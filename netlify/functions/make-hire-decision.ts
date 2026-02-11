import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = "Kariyeer <noreply@kariyeer.com>";
const SITE_URL = process.env.URL || "https://kariyeer.com";

async function sendResendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
  });
  return res.json();
}

const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: { "Access-Control-Allow-Origin": "*" }, body: "" };
  }
  if (event.httpMethod !== "POST") return { statusCode: 405 };

  try {
    const {
      interviewId,
      decision,
      salaryOffered,
      startDate,
      notes,
      notifyCandidate = true,
    } = JSON.parse(event.body || "{}");

    const authHeader = event.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };

    // Interview detayları
    const { data: interview } = await supabase
      .from("interviews")
      .select("*, candidate:profiles!candidate_id(full_name,email), job:jobs(position)")
      .eq("id", interviewId)
      .single();

    if (!interview) return { statusCode: 404, body: JSON.stringify({ error: "Mülakat bulunamadı" }) };

    // Hire decision kaydı
    const { data: hireRecord } = await supabase
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

      const result = await sendResendEmail(
        interview.candidate.email,
        `${decisionText} - ${interview.job?.position}`,
        html
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

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, decision, emailSent }),
    };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

export { handler };
