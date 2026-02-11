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

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const SITE_URL = env.URL || "https://kariyeer.com";

  // CORS ayarları
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
    const { sessionRequestId, action } = body;

    if (!sessionRequestId) {
      return new Response(JSON.stringify({ error: "sessionRequestId gerekli" }), { status: 400 });
    }

    const { data: sessionRequest, error: reqError } = await supabase
      .from("app_2dff6511da_session_requests")
      .select("*")
      .eq("id", sessionRequestId)
      .single();

    if (reqError || !sessionRequest) {
      return new Response(JSON.stringify({ error: "Seans talebi bulunamadı" }), { status: 404 });
    }

    const { data: coach } = await supabase
      .from("app_2dff6511da_coaches")
      .select("*")
      .eq("id", sessionRequest.coach_id)
      .single();

    if (action === "reject") {
      await supabase
        .from("app_2dff6511da_session_requests")
        .update({ status: "rejected", rejected_at: new Date().toISOString() })
        .eq("id", sessionRequestId);

      return new Response(JSON.stringify({ success: true, action: "rejected" }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const shortId = sessionRequestId.substring(0, 8);
    const roomName = `kariyeer-session-${shortId}`;
    const roomUrl = `https://meet.jit.si/${roomName}`;
    const meetingPageUrl = `${SITE_URL}/meeting/${roomName}`;

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

    await supabase.from("meeting_rooms").insert({
      room_name: roomName,
      room_url: roomUrl,
      room_type: "coaching_session",
      related_id: sessionRequestId,
      related_type: "session_request",
      host_user_id: coach?.user_id,
      participant_user_id: sessionRequest.user_id,
      host_name: coach?.full_name,
      participant_name: sessionRequest.full_name,
      scheduled_at: `${sessionRequest.selected_date}T${sessionRequest.selected_time}:00`,
      duration_minutes: 45,
      status: "created",
    });

    let clientEmailSent = false;
    if (sessionRequest.email) {
      const html = sessionEmailHtml({
        name: sessionRequest.full_name,
        role: "client",
        coachName: coach?.full_name || "Koçunuz",
        clientName: sessionRequest.full_name,
        date: sessionRequest.selected_date,
        time: sessionRequest.selected_time,
        meetingUrl: meetingPageUrl,
      });
      const result: any = await sendResendEmail(sessionRequest.email, "✅ Seansınız Onaylandı - Kariyeer.com", html, env);
      clientEmailSent = !!result.id;

      await supabase.from("email_logs").insert({
        to_email: sessionRequest.email,
        to_name: sessionRequest.full_name,
        subject: "Seans Onaylandı",
        template_type: "session_confirmed",
        related_id: sessionRequestId,
        related_type: "session_request",
        resend_id: result.id || null,
        status: result.id ? "sent" : "failed",
        sent_at: result.id ? new Date().toISOString() : null,
      });
    }

    let coachEmailSent = false;
    if (coach?.email) {
      const html = sessionEmailHtml({
        name: coach.full_name,
        role: "coach",
        coachName: coach.full_name,
        clientName: sessionRequest.full_name,
        date: sessionRequest.selected_date,
        time: sessionRequest.selected_time,
        meetingUrl: meetingPageUrl,
      });
      const result: any = await sendResendEmail(coach.email, `📅 Seans: ${sessionRequest.full_name} - ${sessionRequest.selected_date}`, html, env);
      coachEmailSent = !!result.id;
    }

    return new Response(
      JSON.stringify({
        success: true,
        action: "approved",
        roomUrl,
        roomName,
        meetingPageUrl,
        clientEmailSent,
        coachEmailSent,
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
