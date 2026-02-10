import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || "Kariyeer <noreply@kariyeer.com>";
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
    return { statusCode: 200, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type, Authorization" }, body: "" };
  }
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const {
      jobApplicationId,
      scheduledAt,
      durationMinutes = 45,
      interviewerName,
      interviewerEmail,
      notes,
      language = "tr",
    } = JSON.parse(event.body || "{}");

    // Auth kontrolü
    const authHeader = event.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };

    // Başvuru bilgisi
    const { data: application, error: appErr } = await supabase
      .from("job_applications")
      .select("*")
      .eq("id", jobApplicationId)
      .single();

    if (appErr || !application) {
      return { statusCode: 404, body: JSON.stringify({ error: "Başvuru bulunamadı" }) };
    }

    // Aday profili
    const { data: candidate } = await supabase
      .from("profiles")
      .select("full_name, email, avatar_url")
      .eq("id", application.candidate_id)
      .single();

    // Şirket profili
    const { data: company } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .single();

    // Pozisyon bilgisi
    const { data: job } = await supabase
      .from("jobs")
      .select("post_id, position, location_text, company_id")
      .eq("post_id", application.job_id)
      .single();

    // Jitsi room oluştur
    const shortId = jobApplicationId.substring(0, 8);
    const dateStr = new Date(scheduledAt).toISOString().slice(0, 10).replace(/-/g, "");
    const roomName = `kariyeer-interview-${shortId}-${dateStr}`;
    const roomUrl = `https://meet.jit.si/${roomName}`;
    const meetingPageUrl = `${SITE_URL}/interview/${roomName}`;

    // Interview kaydı
    const { data: interview, error: intErr } = await supabase
      .from("interviews")
      .insert({
        job_id: application.job_id,
        candidate_id: application.candidate_id,
        company_user_id: user.id,
        interviewer_name: interviewerName || company?.full_name,
        interviewer_email: interviewerEmail || company?.email,
        candidate_name: candidate?.full_name,
        candidate_email: candidate?.email,
        meeting_link: roomUrl,
        meeting_provider: "jitsi",
        jitsi_room: roomName,
        jitsi_url: roomUrl,
        scheduled_at: scheduledAt,
        duration_minutes: durationMinutes,
        notes,
        status: "scheduled",
        language,
      })
      .select()
      .single();

    if (intErr) {
      return { statusCode: 500, body: JSON.stringify({ error: "Interview oluşturulamadı", details: intErr }) };
    }

    // Meeting room kaydı
    await supabase.from("meeting_rooms").insert({
      room_name: roomName,
      room_url: roomUrl,
      room_type: "interview",
      related_id: interview.id,
      related_type: "interview",
      host_user_id: user.id,
      participant_user_id: application.candidate_id,
      host_name: interviewerName || company?.full_name,
      participant_name: candidate?.full_name,
      scheduled_at: scheduledAt,
      duration_minutes: durationMinutes,
      status: "created",
    });

    // Başvuru durumu güncelle
    await supabase
      .from("job_applications")
      .update({ status: "interview_scheduled", updated_at: new Date().toISOString() })
      .eq("id", jobApplicationId);

    // Tarih formatla
    const scheduled = new Date(scheduledAt);
    const dateFormatted = scheduled.toLocaleDateString("tr-TR", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
    const timeFormatted = scheduled.toLocaleTimeString("tr-TR", {
      hour: "2-digit", minute: "2-digit",
    });

    // Adaya mülakat davet emaili
    let emailSent = false;
    if (candidate?.email) {
      const html = `
        <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
          <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:32px 24px;text-align:center;color:white;">
            <h1 style="margin:0;font-size:24px;">🎯 Mülakat Daveti</h1>
            <p style="margin:8px 0 0;opacity:0.9;">Kariyeer.com</p>
          </div>
          <div style="padding:32px 24px;">
            <p>Merhaba <strong>${candidate.full_name}</strong>,</p>
            <p>Başvurunuz olumlu değerlendirildi! <strong>${company?.full_name || "Şirket"}</strong> sizi online mülakata davet ediyor.</p>
            <div style="background:#d4edda;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid #28a745;">
              <p style="margin:4px 0;">💼 <strong>Pozisyon:</strong> ${job?.position || "—"}</p>
              <p style="margin:4px 0;">🏢 <strong>Şirket:</strong> ${company?.full_name || "—"}</p>
              <p style="margin:4px 0;">📅 <strong>Tarih:</strong> ${dateFormatted}</p>
              <p style="margin:4px 0;">🕐 <strong>Saat:</strong> ${timeFormatted}</p>
              <p style="margin:4px 0;">⏱ <strong>Süre:</strong> ${durationMinutes} dakika</p>
            </div>
            <div style="text-align:center;margin:24px 0;">
              <a href="${meetingPageUrl}" style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:white!important;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">🎥 Mülakata Katıl</a>
            </div>
            <p style="color:#6c757d;font-size:13px;">💡 Sessiz bir ortamda, kameranız açık şekilde katılmanızı öneririz.</p>
          </div>
          <div style="background:#f8f9fa;padding:20px;text-align:center;color:#6c757d;font-size:12px;">© ${new Date().getFullYear()} Kariyeer.com</div>
        </div>`;

      const result = await sendResendEmail(
        candidate.email,
        `🎯 Mülakat Daveti: ${job?.position || "Pozisyon"} - ${company?.full_name || ""}`,
        html
      );
      emailSent = !!result.id;

      // Email log
      await supabase.from("email_logs").insert({
        to_email: candidate.email,
        to_name: candidate.full_name,
        subject: `Mülakat Daveti: ${job?.position}`,
        template_type: "interview_invite",
        related_id: interview.id,
        related_type: "interview",
        resend_id: result.id || null,
        status: result.id ? "sent" : "failed",
        sent_at: result.id ? new Date().toISOString() : null,
      });

      // Interview email durumu güncelle
      await supabase
        .from("interviews")
        .update({ email_sent: emailSent, email_sent_at: emailSent ? new Date().toISOString() : null })
        .eq("id", interview.id);
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        success: true,
        interview: { id: interview.id, roomUrl, roomName, meetingPageUrl, scheduledAt },
        emailSent,
      }),
    };
  } catch (err: any) {
    return { statusCode: 500, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ error: err.message }) };
  }
};

export { handler };
