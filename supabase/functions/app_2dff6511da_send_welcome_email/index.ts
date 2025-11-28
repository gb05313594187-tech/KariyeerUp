import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import nodemailer from 'npm:nodemailer';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
};

serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Welcome Email Request`);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let userId: string;
    try {
      const body = await req.json();
      userId = body.user_id;
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing user_id' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const { data: userData } = await supabase.auth.admin.getUserById(userId);
    const userEmail = userData?.user?.email;
    const userName = userData?.user?.user_metadata?.full_name || 'Değerli Kullanıcı';

    if (!userEmail) {
      return new Response(JSON.stringify({ error: 'Email not found' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const smtpHost = Deno.env.get('SMTP_HOST');
    const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '587');
    const smtpUser = Deno.env.get('SMTP_USER');
    const smtpPassword = Deno.env.get('SMTP_PASSWORD');
    const smtpFrom = Deno.env.get('SMTP_FROM') || smtpUser;

    if (!smtpHost || !smtpUser || !smtpPassword) {
      return new Response(JSON.stringify({ error: 'SMTP not configured' }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPassword },
    });

    const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#f5f7fa;padding:20px;margin:0">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden">
    <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:40px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:28px">🎉 Hoş Geldiniz!</h1>
    </div>
    <div style="padding:30px">
      <h2 style="color:#1f2937;margin:0 0 15px">Merhaba ${userName},</h2>
      <p style="color:#4b5563;line-height:1.6">Kariyeer platformuna hoş geldiniz! Profesyonel kariyer gelişiminiz için gereken tüm araçlar artık elinizin altında.</p>
      <div style="background:#f0f9ff;padding:20px;border-radius:8px;margin:20px 0">
        <h3 style="color:#1f2937;margin:0 0 15px">🚀 İlk Adımlar</h3>
        <ul style="color:#374151;margin:0;padding-left:20px">
          <li>Profilinizi tamamlayın</li>
          <li>Premium rozetler kazanın</li>
          <li>Size uygun koç bulun</li>
        </ul>
      </div>
      <div style="text-align:center;margin:30px 0">
        <a href="https://kariyeer.com/dashboard" style="display:inline-block;background:#2563eb;color:#fff;padding:14px 30px;text-decoration:none;border-radius:8px;font-weight:600">Dashboard'a Git</a>
      </div>
      <p style="color:#6b7280;font-size:14px;margin:20px 0 0;padding-top:20px;border-top:1px solid #e5e7eb">Başarılarınızın bir parçası olmaktan mutluluk duyuyoruz!<br><strong>Kariyeer Ekibi</strong></p>
    </div>
    <div style="background:#f9fafb;padding:20px;text-align:center;border-top:1px solid #e5e7eb">
      <p style="color:#9ca3af;margin:0;font-size:12px">© ${new Date().getFullYear()} Kariyeer Platform</p>
    </div>
  </div>
</body>
</html>`;

    await transporter.sendMail({
      from: `"Kariyeer" <${smtpFrom}>`,
      to: userEmail,
      subject: '🎉 Kariyeer\'e Hoş Geldiniz!',
      html: emailHtml,
    });

    console.log(`[${requestId}] Email sent to ${userEmail}`);

    return new Response(JSON.stringify({ success: true }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error(`[${requestId}] Error:`, error);
    return new Response(JSON.stringify({ error: 'Internal error' }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});