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

function sessionEmailHtml(data: {
  name: string;
  role: string;
  coachName: string;
  clientName: string;
  date: string;
  time: string;
  meetingUrl: string;
}) {
  const otherPerson = data.role === "coach" ? data.clientName : data.coachName;
  const otherLabel = data.role === "coach" ? "Danışan" : "Koç";
  return `
    <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
      <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:32px 24px;text-align:center;color:white;">
        <h1 style="margin:0;font-size:24px;">✅ Seans Onaylandı</h1>
        <p style="margin:8px 0 0;opacity:0.9;">Kariyeer.com</p>
      </div>
      <div style="padding:32px 24px;">
        <p>Merhaba <strong>${data.name}</strong>,</p>
        <p>Seansınız onaylanmış ve görüşme linki oluşturulmuştur.</p>
        <div style="background:#f0f4ff;border-radius:8px;padding:20px;margin:20px 0;">
          <p style="margin:4px 0;">📅 <strong>Tarih:</strong> ${data.date}</p>
          <p style="margin:4px 0;">🕐 <strong>Saat:</strong> ${data.time}</p>
          <p style="margin:4px 0;">👤 <strong>${otherLabel}:</strong> ${otherPerson}</p>
          <p style="margin:4px 0;">⏱ <strong>Süre:</strong> 45 dakika</p>
        </div>
        <div style="text-align:center;margin:24px 0;">
          <a href="${data.meetingUrl}" style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:white!important;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">🎥 Görüşmeye Katıl</a>
        </div>
        <p style="color:#6c757d;font-size:13px;">Bağlantıyı seans saatinde açabilirsiniz. 5 dakika öncesinde hazır olun.</p>
      </div>
      <div style="background:#f8f9fa;padding:20px;text-align:center;color:#6c757d;font-size:12px;">© ${new Date().getFullYear()} Kariyeer.com</div>
    </div>`;
}

const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type, Authorization" }, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { sessionRequestId, action } = JSON.parse(event.body || "{}");

    if (!sessionRequestId) {
      return { statusCode: 400, body: JSON.stringify({ error: "sessionRequestId gerekli" }) };
    }

    // Seans talebini al
    const { data: request, error: reqError } = await supabase
      .from("app_2dff6511da_session_requests")
      .select("*")
      .eq("id", sessionRequestId)
      .single();

    if (reqError || !request) {
      return { statusCode: 404, body: JSON.stringify({ error: "Seans talebi bulunamadı" }) };
    }

    // Coach bilgisi al
    const { data: coach } = await supabase
      .from("app_2dff6511da_coaches")
      .select("*")
      .eq("id", request.coach_id)
      .single();

    if (action === "reject") {
      await supabase
        .from("app_2dff6511da_session_requests")
        .update({ status: "rejected", rejected_at: new Date().toISOString() })
        .eq("id", sessionRequestId);

      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ success: true, action: "rejected" }),
      };
    }

    // Jitsi room oluştur
    const shortId = sessionRequestId.substring(0, 8);
    const roomName = `kariyeer-session-${shortId}`;
    const roomUrl = `https://meet.jit.si/${roomName}`;
    const meetingPageUrl = `${SITE_URL}/meeting/${roomName}`;

    // Session request güncelle
    await supabase
      .from("app_2dff6511da_session_requests")
      .update({
        status: "confirmed",
        meeting_provider: "jitsi",
        meeting_room: roomName,
        meeting_url: roomUrl,
        meeting_status: "created",
        jitsi_room: roomName,
        jitsi_url: roomUrl,
        confirmed_at: new Date().toISOString(),
        approved_at: new Date().toISOString(),
      })
      .eq("id", sessionRequestId);

    // Meeting room kaydı
    await supabase.from("meeting_rooms").insert({
      room_name: roomName,
      room_url: roomUrl,
      room_type: "coaching_session",
      related_id: sessionRequestId,
      related_type: "session_request",
      host_user_id: coach?.user_id,
      participant_user_id: request.user_id,
      host_name: coach?.full_name,
      participant_name: request.full_name,
      scheduled_at: `${request.selected_date}T${request.selected_time}:00`,
      duration_minutes: 45,
      status: "created",
    });

    // Danışana email
    let clientEmailSent = false;
    if (request.email) {
      const html = sessionEmailHtml({
        name: request.full_name,
        role: "client",
        coachName: coach?.full_name || "Koçunuz",
        clientName: request.full_name,
        date: request.selected_date,
        time: request.selected_time,
        meetingUrl: meetingPageUrl,
      });
      const result = await sendResendEmail(request.email, "✅ Seansınız Onaylandı - Kariyeer.com", html);
      clientEmailSent = !!result.id;

      await supabase.from("email_logs").insert({
        to_email: request.email,
        to_name: request.full_name,
        subject: "Seans Onaylandı",
        template_type: "session_confirmed",
        related_id: sessionRequestId,
        related_type: "session_request",
        resend_id: result.id || null,
        status: result.id ? "sent" : "failed",
        sent_at: result.id ? new Date().toISOString() : null,
      });
    }

    // Coach'a email
    let coachEmailSent = false;
    if (coach?.email) {
      const html = sessionEmailHtml({
        name: coach.full_name,
        role: "coach",
        coachName: coach.full_name,
        clientName: request.full_name,
        date: request.selected_date,
        time: request.selected_time,
        meetingUrl: meetingPageUrl,
      });
      const result = await sendResendEmail(coach.email, `📅 Seans: ${request.full_name} - ${request.selected_date}`, html);
      coachEmailSent = !!result.id;
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        success: true,
        action: "approved",
        roomUrl,
        roomName,
        meetingPageUrl,
        clientEmailSent,
        coachEmailSent,
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message }),
    };
  }
};

export { handler };
