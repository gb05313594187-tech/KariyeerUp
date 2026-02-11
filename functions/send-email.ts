interface Env {
  RESEND_API_KEY: string;
  FROM_EMAIL?: string;
  URL?: string;
}

interface EmailPayload {
  to: string;
  toName?: string;
  subject: string;
  templateType: string;
  data: Record<string, any>;
}

function getEmailHtml(templateType: string, data: Record<string, any>, siteUrl: string): string {
  const wrapper = (header: string, headerColor: string, body: string) => `
    <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
      <div style="background:linear-gradient(135deg,${headerColor});padding:32px 24px;text-align:center;color:white;">
        ${header}
      </div>
      <div style="padding:32px 24px;">
        ${body}
      </div>
      <div style="background:#f8f9fa;padding:20px;text-align:center;color:#6c757d;font-size:12px;">
        © ${new Date().getFullYear()} Kariyeer.com - Kariyer Danışmanlık Platformu
      </div>
    </div>
  `;

  const btn = (url: string, text: string) =>
    `<div style="text-align:center;margin:24px 0;">
      <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:white!important;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">${text}</a>
    </div>`;

  const infoBox = (color: string, border: string, items: string[]) =>
    `<div style="background:${color};border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid ${border};">
      ${items.map((i) => `<p style="margin:4px 0;">${i}</p>`).join("")}
    </div>`;

  switch (templateType) {
    case "session_confirmed":
      return wrapper(
        `<h1 style="margin:0;font-size:24px;">✅ Seans Onaylandı</h1>
         <p style="margin:8px 0 0;opacity:0.9;">Kariyeer.com</p>`,
        "#667eea,#764ba2",
        `<p>Merhaba <strong>${data.clientName}</strong>,</p>
         <p>Kariyer koçunuz <strong>${data.coachName}</strong> ile seansınız onaylanmıştır.</p>
         ${infoBox("#f0f4ff", "#667eea", [
           `📅 <strong>Tarih:</strong> ${data.sessionDate}`,
           `🕐 <strong>Saat:</strong> ${data.sessionTime}`,
           `⏱ <strong>Süre:</strong> ${data.duration || 45} dakika`,
           `👨‍💼 <strong>Koç:</strong> ${data.coachName}`,
         ])}
         ${btn(data.meetingUrl, "🎥 Görüşmeye Katıl")}
         <p style="color:#6c757d;font-size:13px;">⚠️ Bağlantıyı seans saatinde açabilirsiniz. 5 dakika öncesinde hazır olun.</p>`
      );

    case "session_reminder":
      return wrapper(
        `<h1 style="margin:0;font-size:24px;">⏰ Seans Hatırlatma</h1>`,
        "#f093fb,#f5576c",
        `<p>Merhaba <strong>${data.name}</strong>,</p>
         <p>Seansınıza <strong>${data.timeUntil}</strong> kaldı!</p>
         ${infoBox("#fff3cd", "#ffc107", [
           `📅 <strong>Tarih:</strong> ${data.sessionDate}`,
           `🕐 <strong>Saat:</strong> ${data.sessionTime}`,
           `👤 <strong>${data.otherPartyRole}:</strong> ${data.otherPartyName}`,
         ])}
         ${btn(data.meetingUrl, "🎥 Görüşmeye Katıl")}`
      );

    case "interview_invite":
      return wrapper(
        `<h1 style="margin:0;font-size:24px;">🎯 Mülakat Daveti</h1>
         <p style="margin:8px 0 0;opacity:0.9;">Kariyeer.com</p>`,
        "#667eea,#764ba2",
        `<p>Merhaba <strong>${data.candidateName}</strong>,</p>
         <p>Başvurunuz olumlu değerlendirilmiştir! <strong>${data.companyName}</strong> sizi online mülakata davet ediyor.</p>
         ${infoBox("#d4edda", "#28a745", [
           `💼 <strong>Pozisyon:</strong> ${data.position}`,
           `🏢 <strong>Şirket:</strong> ${data.companyName}`,
           `📅 <strong>Tarih:</strong> ${data.interviewDate}`,
           `🕐 <strong>Saat:</strong> ${data.interviewTime}`,
           `⏱ <strong>Süre:</strong> ${data.duration || 45} dakika`,
         ])}
         ${btn(data.meetingUrl, "🎥 Mülakata Katıl")}
         <p style="color:#6c757d;font-size:13px;">💡 Sessiz bir ortamda, kameranız açık şekilde katılmanızı öneririz.</p>`
      );

    case "interview_reminder":
      return wrapper(
        `<h1 style="margin:0;font-size:24px;">⏰ Mülakat Hatırlatma</h1>`,
        "#f093fb,#f5576c",
        `<p>Merhaba <strong>${data.name}</strong>,</p>
         <p>Mülakatınıza <strong>${data.timeUntil}</strong> kaldı!</p>
         ${infoBox("#fff3cd", "#ffc107", [
           `💼 <strong>Pozisyon:</strong> ${data.position}`,
           `📅 <strong>Tarih:</strong> ${data.interviewDate}`,
           `🕐 <strong>Saat:</strong> ${data.interviewTime}`,
         ])}
         ${btn(data.meetingUrl, "🎥 Mülakata Katıl")}`
      );

    case "hire_notification":
      return wrapper(
        `<h1 style="margin:0;font-size:28px;">🎉 Tebrikler!</h1>
         <p style="margin:8px 0 0;opacity:0.9;">İşe Alındınız!</p>`,
        "#28a745,#20c997",
        `<p>Merhaba <strong>${data.candidateName}</strong>,</p>
         <p><strong>${data.companyName}</strong> tarafından <strong>${data.position}</strong> pozisyonu için işe alındınız!</p>
         ${infoBox("#d4edda", "#28a745", [
           `💼 <strong>Pozisyon:</strong> ${data.position}`,
           `🏢 <strong>Şirket:</strong> ${data.companyName}`,
           ...(data.startDate ? [`📅 <strong>Başlangıç:</strong> ${data.startDate}`] : []),
           ...(data.salary ? [`💰 <strong>Maaş:</strong> ${data.salary}`] : []),
         ])}
         ${btn(siteUrl + "/dashboard", "📋 Dashboard'a Git")}`
      );

    case "payment_confirmed":
      return wrapper(
        `<h1 style="margin:0;font-size:24px;">💳 Ödeme Onaylandı</h1>`,
        "#667eea,#764ba2",
        `<p>Merhaba <strong>${data.clientName}</strong>,</p>
         <p>Ödemeniz başarıyla alınmıştır.</p>
         ${infoBox("#f0f4ff", "#667eea", [
           `💰 <strong>Tutar:</strong> ${data.amount} ${data.currency || "TL"}`,
           `👨‍💼 <strong>Koç:</strong> ${data.coachName}`,
           `📅 <strong>Seans Tarihi:</strong> ${data.sessionDate}`,
           `🕐 <strong>Seans Saati:</strong> ${data.sessionTime}`,
         ])}
         <p>Seans bağlantınız onay sonrası email ile gönderilecektir.</p>`
      );

    case "new_session_request":
      return wrapper(
        `<h1 style="margin:0;font-size:24px;">📩 Yeni Seans Talebi</h1>`,
        "#667eea,#764ba2",
        `<p>Merhaba <strong>${data.coachName}</strong>,</p>
         <p>Yeni bir seans talebi aldınız!</p>
         ${infoBox("#f0f4ff", "#667eea", [
           `👤 <strong>Danışan:</strong> ${data.clientName}`,
           `📧 <strong>Email:</strong> ${data.clientEmail}`,
           `📅 <strong>İstenen Tarih:</strong> ${data.sessionDate}`,
           `🕐 <strong>İstenen Saat:</strong> ${data.sessionTime}`,
           ...(data.note ? [`📝 <strong>Not:</strong> ${data.note}`] : []),
         ])}
         ${btn(siteUrl + "/dashboard/sessions", "📋 Talebi İncele")}`
      );

    default:
      return `<p>${JSON.stringify(data)}</p>`;
  }
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const FROM_EMAIL = env.FROM_EMAIL || "Kariyeer <noreply@kariyeer.com>";
  const SITE_URL = env.URL || "https://kariyeer.com";

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

  try {
    const payload: EmailPayload = await request.json();
    const { to, subject, templateType, data } = payload;

    if (!to || !subject || !templateType) {
      return new Response(JSON.stringify({ error: "to, subject, templateType gerekli" }), { 
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const html = getEmailHtml(templateType, data || {}, SITE_URL);

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    });

    const resendData: any = await resendResponse.json();

    if (!resendResponse.ok) {
      return new Response(JSON.stringify({ error: "Email gönderilemedi", details: resendData }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      resendId: resendData.id,
      message: `Email ${to} adresine gönderildi`,
    }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
};
