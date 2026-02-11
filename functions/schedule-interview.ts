import { createClient } from "@supabase/supabase-js";

interface Env {
  VITE_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  RESEND_API_KEY: string;
  FROM_EMAIL?: string;
  URL?: string;
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
  const SITE_URL = env.URL || "https://kariyeer.com";

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
      jobApplicationId,
      scheduledAt,
      durationMinutes = 45,
      interviewerName,
      interviewerEmail,
      notes,
      language = "tr",
    } = body;

    // Auth kontrolü
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Başvuru bilgisi
    const { data: application, error: appErr } = await supabase
      .from("job_applications")
      .select("*")
      .eq("id", jobApplicationId)
      .single();

    if (appErr || !application) {
      return new Response(JSON.stringify({ error: "Başvuru bulunamadı" }), { status: 404 });
    }

    // Aday ve Şirket profilleri
    const { data: candidate } = await supabase.from("profiles").select("full_name, email").eq("id", application.candidate_id).single();
    const { data: company } = await supabase.from("profiles").select("full_name, email").eq("id", user.id).single();

    // Pozisyon bilgisi
    const { data: job } = await supabase
      .from("jobs")
      .select("position")
      .eq("post_id", application.job_id)
      .single();

    // Jitsi room oluştur
    const shortId = jobApplicationId.substring(0, 8);
    const dateStr = new Date(scheduledAt).toISOString().slice(0, 10).replace(/-/g, "");
    const roomName = `kariyeer-interview-${shortId}-${dateStr}`;
    const roomUrl = `https://meet.jit.si/${roomName}`;
    const meetingPageUrl = `${SITE_URL}/interview/${roomName}`;

    // Interview kaydı
    const { data: interview, error: intErr }: any = await supabase
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

    if (intErr) throw intErr;

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
    const dateFormatted = scheduled.toLocaleDateString("tr-TR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const timeFormatted = scheduled.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

    // Adaya email gönderimi
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
            <p><strong>${company?.full_name || "Şirket"}</strong> sizi online mülakata davet ediyor.</p>
            <div style="background:#d4edda;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid #28a745;">
              <p style="margin:4px 0;">💼 <strong>Pozisyon:</strong> ${job?.position || "—"}</p>
              <p style="margin:4px 0;">📅 <strong>Tarih:</strong> ${dateFormatted}</p>
              <p style="margin:4px 0;">🕐 <strong>Saat:</strong> ${timeFormatted}</p>
            </div>
            <div style="text-align:center;margin:24px 0;">
              <a href="${meetingPageUrl}" style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:white!important;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">🎥 Mülakata Katıl</a>
            </div>
          </div>
          <div style="background:#f8f9fa;padding:20px;text-align:center;color:#6c757d;font-size:12px;">© ${new Date().getFullYear()} Kariyeer.com</div>
        </div>`;

      const result: any = await sendResendEmail(candidate.email, `🎯 Mülakat Daveti: ${job?.position || ""}`, html, env);
      emailSent = !!result.id;

      await supabase.from("email_logs").insert({
        to_email: candidate.email,
        subject: `Mülakat Daveti: ${job?.position}`,
        template_type: "interview_invite",
        related_id: interview.id,
        related_type: "interview",
        resend_id: result.id || null,
        status: result.id ? "sent" : "failed",
        sent_at: result.id ? new Date().toISOString() : null,
      });

      await supabase.from("interviews").update({ email_sent: emailSent, email_sent_at: emailSent ? new Date().toISOString() : null }).eq("id", interview.id);
    }

    return new Response(JSON.stringify({ success: true, interview: { id: interview.id, roomUrl, roomName, meetingPageUrl }, emailSent }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
};
