import { createClient } from "@supabase/supabase-js";

interface Env {
  VITE_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  RESEND_API_KEY: string;
  FROM_EMAIL?: string;
}

async function sendResendEmail(to: string, subject: string, html: string, env: Env) {
  const FROM_EMAIL = env.FROM_EMAIL || "Kariyeer <noreply@kariyeer.com>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
  });
  return res.json();
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // CORS Ayarları
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  try {
    const body: any = await request.json();
    const {
      interviewId,
      decision,
      salaryOffered,
      startDate,
      notes,
      adminNotes,
      notifyCandidate = true,
    } = body;

    // Yetkilendirme (Auth) kontrolü
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Interview bilgisi çekme
    const { data: interview, error: intErr } = await supabase
      .from("interviews")
      .select("*")
      .eq("id", interviewId)
      .single();

    if (intErr || !interview) {
      return new Response(JSON.stringify({ error: "Mülakat bulunamadı" }), { status: 404 });
    }

    // Hire decision (İşe alım kararı) kaydı
    const { data: decisionRecord, error: decErr } = await supabase
      .from("hire_decisions")
      .insert({
        interview_id: interviewId,
        job_id: interview.job_id,
        candidate_id: interview.candidate_id,
        company_user_id: interview.company_user_id,
        decision,
        decided_by: user.id,
        salary_offered: salaryOffered,
        start_date: startDate,
        notes,
        admin_notes: adminNotes,
      })
      .select()
      .single();

    if (decErr) {
      return new Response(JSON.stringify({ error: "Karar kaydedilemedi", details: decErr }), { status: 500 });
    }

    // Interview (Mülakat) durumunu güncelle
    await supabase
      .from("interviews")
      .update({
        hire_decision: decision,
        status: "completed",
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", interviewId);

    // Job application (İş Başvurusu) durumunu güncelle
    if (interview.job_id && interview.candidate_id) {
      const appStatus = decision === "hired" ? "hired" : decision === "rejected" ? "rejected" : "on_hold";
      await supabase
        .from("job_applications")
        .update({ status: appStatus, updated_at: new Date().toISOString() })
        .eq("job_id", interview.job_id)
        .eq("candidate_id", interview.candidate_id);
    }

    // Adaya email gönderimi
    let emailSent = false;
    if (notifyCandidate && interview.candidate_email) {
      const { data: company } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", interview.company_user_id)
        .single();

      let position = "—";
      if (interview.job_id) {
        const { data: job } = await supabase
          .from("jobs")
          .select("position")
          .eq("post_id", interview.job_id)
          .single();
        position = job?.position || "—";
      }

      let subject = "";
      let html = "";

      if (decision === "hired") {
        subject = `🎉 Tebrikler! ${position} pozisyonu için işe alındınız`;
        html = `
          <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
            <div style="background:linear-gradient(135deg,#28a745,#20c997);padding:32px 24px;text-align:center;color:white;">
              <h1 style="margin:0;font-size:28px;">🎉 Tebrikler!</h1>
              <p style="margin:8px 0 0;opacity:0.9;">İşe Alındınız!</p>
            </div>
            <div style="padding:32px 24px;">
              <p>Merhaba <strong>${interview.candidate_name}</strong>,</p>
              <p><strong>${company?.full_name || "Şirket"}</strong> tarafından <strong>${position}</strong> pozisyonu için işe alındınız!</p>
              <div style="background:#d4edda;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid #28a745;">
                <p style="margin:4px 0;">💼 <strong>Pozisyon:</strong> ${position}</p>
                <p style="margin:4px 0;">🏢 <strong>Şirket:</strong> ${company?.full_name || "—"}</p>
                ${startDate ? `<p style="margin:4px 0;">📅 <strong>Başlangıç:</strong> ${startDate}</p>` : ""}
                ${salaryOffered ? `<p style="margin:4px 0;">💰 <strong>Teklif:</strong> ${salaryOffered} TL</p>` : ""}
              </div>
              ${notes ? `<p><strong>Not:</strong> ${notes}</p>` : ""}
            </div>
            <div style="background:#f8f9fa;padding:20px;text-align:center;color:#6c757d;font-size:12px;">© ${new Date().getFullYear()} Kariyeer.com</div>
          </div>`;
      } else if (decision === "rejected") {
        subject = `Başvuru Sonucu: ${position}`;
        html = `
          <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
            <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:32px 24px;text-align:center;color:white;">
              <h1 style="margin:0;font-size:24px;">Başvuru Sonucu</h1>
            </div>
            <div style="padding:32px 24px;">
              <p>Merhaba <strong>${interview.candidate_name}</strong>,</p>
              <p><strong>${position}</strong> pozisyonu için gösterdiğiniz ilgiye teşekkür ederiz.</p>
              <p>Maalesef bu sefer başka bir aday ile devam etme kararı alınmıştır.</p>
              ${notes ? `<p><strong>Not:</strong> ${notes}</p>` : ""}
              <p>Kariyerinizde başarılar dileriz.</p>
            </div>
            <div style="background:#f8f9fa;padding:20px;text-align:center;color:#6c757d;font-size:12px;">© ${new Date().getFullYear()} Kariyeer.com</div>
          </div>`;
      }

      const result: any = await sendResendEmail(interview.candidate_email, subject, html, env);
      emailSent = !!result.id;

      // Email loglarını kaydet
      await supabase.from("email_logs").insert({
        to_email: interview.candidate_email,
        to_name: interview.candidate_name,
        subject,
        template_type: "hire_notification",
        related_id: interviewId,
        related_type: "interview",
        resend_id: result.id || null,
        status: result.id ? "sent" : "failed",
        sent_at: result.id ? new Date().toISOString() : null,
      });

      // Notified (Bilgilendirildi) durumunu güncelle
      await supabase
        .from("hire_decisions")
        .update({ notified: true, notified_at: new Date().toISOString() })
        .eq("id", decisionRecord.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        decision,
        decisionId: decisionRecord.id,
        emailSent,
      }),
      { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
};
