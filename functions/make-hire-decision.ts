import { createClient } from "@supabase/supabase-js";

interface Env {
  VITE_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  RESEND_API_KEY: string;
  URL?: string;
}

async function sendResendEmail(to: string, subject: string, html: string, env: Env) {
  const FROM_EMAIL = "Kariyeer <noreply@kariyeer.com>";
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
      notifyCandidate = true,
    } = body;

    // Yetkilendirme
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Interview detayları
    const { data: interview }: any = await supabase
      .from("interviews")
      .select("*, candidate:profiles!candidate_id(full_name,email), job:jobs(position)")
      .eq("id", interviewId)
      .single();

    if (!interview) {
      return new Response(JSON.stringify({ error: "Mülakat bulunamadı" }), { status: 404 });
    }

    // Hire decision kaydı
    const { data: hireRecord, error: hireErr }: any = await supabase
      .from("hire_decisions")
      .insert({
        interview_id: interviewId,
        job_id: interview.job_id,
        candidate_id: interview.candidate_id,
        company_user_id: user.id,
        decision,
        salary_offered: salaryOffered,
        start_date: startDate,
        notes,
        notified: notifyCandidate,
        notified_at: notifyCandidate ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (hireErr) throw hireErr;

    // Interview tablosunda karar güncelle
    await supabase
      .from("interviews")
      .update({ hire_decision: decision })
      .eq("id", interviewId);

    let emailSent = false;
    if (notifyCandidate && interview.candidate?.email) {
      const decisionText = decision === "hired" ? "İşe Alındınız 🎉" : decision === "rejected" ? "Maalesef Olmadı" : "Beklemeye Alındı";
      const color = decision === "hired" ? "#28a745" : decision === "rejected" ? "#dc3545" : "#ffc107";

      const html = `
        <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
          <div style="background:${color};padding:32px 24px;text-align:center;color:white;">
            <h1 style="margin:0;font-size:26px;">${decisionText}</h1>
          </div>
          <div style="padding:32px 24px;">
            <p>Merhaba <strong>${interview.candidate.full_name}</strong>,</p>
            <p>${interview.job?.position || "Pozisyon"} başvurunuz ile ilgili kararımız şu şekildedir:</p>
            <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;text-align:center;">
              <h2 style="margin:0;color:${color};">${decision === "hired" ? "✅ İŞE ALINDINIZ" : decision === "rejected" ? "❌ REDDEDİLDİ" : "⏳ BEKLEMEYE ALINDI"}</h2>
              ${decision === "hired" && salaryOffered ? `<p style="margin:16px 0 0;font-size:18px;"><strong>Maaş Teklifi: ${salaryOffered.toLocaleString()} ₺</strong></p>` : ""}
              ${startDate ? `<p style="margin:8px 0;"><strong>Başlangıç Tarihi:</strong> ${new Date(startDate).toLocaleDateString("tr-TR")}</p>` : ""}
            </div>
            ${notes ? `<p><strong>Not:</strong> ${notes}</p>` : ""}
            <p style="margin-top:32px;color:#6c757d;">İlginiz için teşekkür ederiz.</p>
          </div>
        </div>`;

      const result: any = await sendResendEmail(
        interview.candidate.email,
        `${decisionText} - ${interview.job?.position}`,
        html,
        env
      );

      emailSent = !!result.id;

      await supabase.from("email_logs").insert({
        to_email: interview.candidate.email,
        subject: `${decisionText} - Kariyeer`,
        template_type: "hire_decision",
        related_id: hireRecord.id,
        status: emailSent ? "sent" : "failed",
      });
    }

    return new Response(
      JSON.stringify({ success: true, decision, emailSent }),
      { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
};
