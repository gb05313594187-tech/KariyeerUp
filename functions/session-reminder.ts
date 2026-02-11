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

function reminderHtml(data: {
  name: string;
  type: string;
  otherName: string;
  otherRole: string;
  date: string;
  time: string;
  meetingUrl: string;
  position?: string;
}) {
  const isInterview = data.type === "interview";
  return `
    <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
      <div style="background:linear-gradient(135deg,#f093fb,#f5576c);padding:32px 24px;text-align:center;color:white;">
        <h1 style="margin:0;font-size:24px;">⏰ 1 Saat Kaldı!</h1>
        <p style="margin:8px 0 0;opacity:0.9;">${isInterview ? "Mülakat" : "Seans"} Hatırlatma</p>
      </div>
      <div style="padding:32px 24px;">
        <p>Merhaba <strong>${data.name}</strong>,</p>
        <p>${isInterview ? "Mülakatınıza" : "Seansınıza"} 1 saat kaldı!</p>
        <div style="background:#fff3cd;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid #ffc107;">
          ${data.position ? `<p style="margin:4px 0;">💼 <strong>Pozisyon:</strong> ${data.position}</p>` : ""}
          <p style="margin:4px 0;">📅 <strong>Tarih:</strong> ${data.date}</p>
          <p style="margin:4px 0;">🕐 <strong>Saat:</strong> ${data.time}</p>
          <p style="margin:4px 0;">👤 <strong>${data.otherRole}:</strong> ${data.otherName}</p>
        </div>
        <div style="text-align:center;margin:24px 0;">
          <a href="${data.meetingUrl}" style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:white!important;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;">🎥 Görüşmeye Katıl</a>
        </div>
      </div>
      <div style="background:#f8f9fa;padding:20px;text-align:center;color:#6c757d;font-size:12px;">© ${new Date().getFullYear()} Kariyeer.com</div>
    </div>`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    date: d.toLocaleDateString("tr-TR", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    time: d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
  };
}

const handler: Handler = async () => {
  try {
    const now = new Date();
    const oneHour = new Date(now.getTime() + 60 * 60 * 1000);
    const twoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    let totalSent = 0;

    // ─── 1) COACHING SEANSLARI ───
    const { data: rooms } = await supabase
      .from("meeting_rooms")
      .select("*")
      .eq("status", "created")
      .gte("scheduled_at", oneHour.toISOString())
      .lte("scheduled_at", twoHours.toISOString());

    for (const room of rooms || []) {
      // Daha önce gönderilmiş mi?
      const { data: existing } = await supabase
        .from("email_logs")
        .select("id")
        .eq("related_id", room.related_id)
        .eq("template_type", "session_reminder")
        .limit(1);

      if (existing && existing.length > 0) continue;

      const { date, time } = formatDate(room.scheduled_at);
      const meetingPageUrl = `${SITE_URL}/meeting/${room.room_name}`;
      const isInterview = room.room_type === "interview";

      // Katılımcıya
      if (room.participant_user_id) {
        const { data: p } = await supabase
          .from("profiles")
          .select("email, full_name")
          .eq("id", room.participant_user_id)
          .single();

        if (p?.email) {
          const html = reminderHtml({
            name: p.full_name || "Katılımcı",
            type: isInterview ? "interview" : "session",
            otherName: room.host_name || "",
            otherRole: isInterview ? "Mülakatçı" : "Koç",
            date, time,
            meetingUrl: meetingPageUrl,
          });
          const result = await sendResendEmail(p.email, `⏰ ${isInterview ? "Mülakatınıza" : "Seansınıza"} 1 Saat Kaldı!`, html);

          await supabase.from("email_logs").insert({
            to_email: p.email,
            to_name: p.full_name,
            subject: "Hatırlatma",
            template_type: "session_reminder",
            related_id: room.related_id,
            related_type: room.related_type,
            resend_id: result.id || null,
            status: result.id ? "sent" : "failed",
            sent_at: result.id ? new Date().toISOString() : null,
          });
          totalSent++;
        }
      }

      // Host'a
      if (room.host_user_id) {
        const { data: h } = await supabase
          .from("profiles")
          .select("email, full_name")
          .eq("id", room.host_user_id)
          .single();

        if (h?.email) {
          const html = reminderHtml({
            name: h.full_name || "Host",
            type: isInterview ? "interview" : "session",
            otherName: room.participant_name || "",
            otherRole: isInterview ? "Aday" : "Danışan",
            date, time,
            meetingUrl: meetingPageUrl,
          });
          await sendResendEmail(h.email, `⏰ ${isInterview ? "Mülakatınıza" : "Seansınıza"} 1 Saat Kaldı!`, html);
          totalSent++;
        }
      }
    }

    // ─── 2) MÜLAKATLAR (interview tablosundan) ───
    const { data: interviews } = await supabase
      .from("interviews")
      .select("*")
      .eq("status", "scheduled")
      .eq("reminder_sent", false)
      .gte("scheduled_at", oneHour.toISOString())
      .lte("scheduled_at", twoHours.toISOString());

    for (const iv of interviews || []) {
      const { date, time } = formatDate(iv.scheduled_at);
      const meetingPageUrl = `${SITE_URL}/interview/${iv.jitsi_room || ""}`;

      // Pozisyon
      let position = "";
      if (iv.job_id) {
        const { data: job } = await supabase.from("jobs").select("position").eq("post_id", iv.job_id).single();
        position = job?.position || "";
      }

      // Adaya
      if (iv.candidate_email) {
        const html = reminderHtml({
          name: iv.candidate_name || "Aday",
          type: "interview",
          otherName: iv.interviewer_name || "Mülakatçı",
          otherRole: "Mülakatçı",
          date, time,
          meetingUrl: meetingPageUrl,
          position,
        });
        await sendResendEmail(iv.candidate_email, `⏰ Mülakatınıza 1 Saat Kaldı! - ${position}`, html);
        totalSent++;
      }

      // Mülakatçıya
      if (iv.interviewer_email) {
        const html = reminderHtml({
          name: iv.interviewer_name || "Mülakatçı",
          type: "interview",
          otherName: iv.candidate_name || "Aday",
          otherRole: "Aday",
          date, time,
          meetingUrl: meetingPageUrl,
          position,
        });
        await sendResendEmail(iv.interviewer_email, `⏰ Mülakatınıza 1 Saat Kaldı! - ${position}`, html);
        totalSent++;
      }

      // Güncelle
      await supabase
        .from("interviews")
        .update({ reminder_sent: true, reminder_sent_at: new Date().toISOString() })
        .eq("id", iv.id);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, totalSent, checkedAt: now.toISOString() }),
    };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

export { handler };
