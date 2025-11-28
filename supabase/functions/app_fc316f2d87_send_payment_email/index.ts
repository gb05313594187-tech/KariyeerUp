import { createClient } from 'npm:@supabase/supabase-js@2';
import nodemailer from 'npm:nodemailer';

const SMTP_HOST = Deno.env.get('SMTP_HOST') || 'smtp.gmail.com';
const SMTP_PORT = parseInt(Deno.env.get('SMTP_PORT') || '587');
const SMTP_SECURE = Deno.env.get('SMTP_SECURE') !== 'false';
const SMTP_USER = Deno.env.get('SMTP_USER') || '';
const SMTP_PASSWORD = Deno.env.get('SMTP_PASSWORD') || '';
const SMTP_FROM = Deno.env.get('SMTP_FROM') || 'noreply@kariyeer.com';

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Send payment email request received`);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    });
  }

  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error(`[${requestId}] Failed to parse body:`, e);
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const { userId, amount, currency } = body;

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user details
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    if (userError || !userData) {
      console.error(`[${requestId}] User not found:`, userError);
      throw new Error('User not found');
    }

    const user = userData.user;
    const userEmail = user.email;
    const userName = user.user_metadata?.full_name || 'Kullanıcı';

    console.log(`[${requestId}] Preparing email for:`, userEmail);

    // Get subscription details
    const { data: subscription } = await supabase
      .from('app_2dff6511da_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    const badgeType = subscription?.tier || 'verified';
    const invoiceNumber = `INV-${Date.now()}-${userId.substring(0, 8).toUpperCase()}`;
    const invoiceDate = new Date().toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const badgeNames: Record<string, string> = {
      'verified': 'Doğrulanmış Rozet',
      'blue_badge': 'Mavi Tik',
      'gold_badge': 'Altın Tik',
      'premium': 'Premium'
    };

    const badgeName = badgeNames[badgeType] || 'Premium Rozet';
    const baseAmount = amount || 99;
    const taxAmount = baseAmount * 0.18;
    const totalAmount = baseAmount + taxAmount;

    // Professional email HTML template
    const emailHtml = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ödeme Onayı - Kariyeer</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6; 
      color: #1f2937;
      background: #f9fafb;
    }
    .email-wrapper { 
      max-width: 600px; 
      margin: 40px auto; 
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white; 
      padding: 48px 32px;
      text-align: center;
    }
    .header h1 { 
      font-size: 32px; 
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    .header p {
      font-size: 16px;
      opacity: 0.95;
    }
    .content { 
      padding: 40px 32px;
    }
    .greeting {
      font-size: 18px;
      color: #374151;
      margin-bottom: 24px;
    }
    .success-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border-radius: 100px;
      font-weight: 600;
      font-size: 16px;
      margin: 24px 0;
      box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
    }
    .invoice-card {
      background: linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%);
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 32px;
      margin: 32px 0;
    }
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 2px solid #e5e7eb;
    }
    .invoice-title {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 4px;
    }
    .invoice-number {
      font-size: 14px;
      color: #6b7280;
      font-family: 'Courier New', monospace;
    }
    .invoice-date {
      text-align: right;
      font-size: 14px;
      color: #6b7280;
    }
    .invoice-row {
      display: flex;
      justify-content: space-between;
      padding: 16px 0;
      border-bottom: 1px solid #f3f4f6;
    }
    .invoice-row:last-child {
      border-bottom: none;
    }
    .invoice-label {
      color: #6b7280;
      font-size: 15px;
    }
    .invoice-value {
      font-weight: 600;
      color: #111827;
      font-size: 15px;
    }
    .invoice-total {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 2px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .total-label {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
    }
    .total-amount {
      font-size: 32px;
      font-weight: 700;
      color: #10b981;
    }
    .features {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-radius: 12px;
      padding: 32px;
      margin: 32px 0;
    }
    .features h3 {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .features ul {
      list-style: none;
    }
    .features li {
      padding: 12px 0;
      color: #374151;
      font-size: 15px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .features li:before {
      content: '✓';
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: #10b981;
      color: white;
      border-radius: 50%;
      font-weight: 700;
      flex-shrink: 0;
    }
    .cta-button {
      display: inline-block;
      padding: 16px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      margin: 32px 0;
      box-shadow: 0 4px 6px -1px rgba(102, 126, 234, 0.4);
      transition: transform 0.2s;
    }
    .cta-button:hover {
      transform: translateY(-2px);
    }
    .support-info {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 20px;
      border-radius: 8px;
      margin: 32px 0;
    }
    .support-info p {
      color: #92400e;
      font-size: 14px;
      margin: 0;
    }
    .support-info a {
      color: #b45309;
      font-weight: 600;
      text-decoration: none;
    }
    .footer {
      background: #f9fafb;
      padding: 32px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      color: #6b7280;
      font-size: 14px;
      margin: 8px 0;
    }
    .footer-links {
      margin: 16px 0;
    }
    .footer-links a {
      color: #667eea;
      text-decoration: none;
      margin: 0 12px;
      font-size: 14px;
    }
    .social-links {
      margin-top: 20px;
    }
    .social-links a {
      display: inline-block;
      margin: 0 8px;
      color: #9ca3af;
      text-decoration: none;
      font-size: 20px;
    }
    @media only screen and (max-width: 600px) {
      .email-wrapper { margin: 0; border-radius: 0; }
      .header { padding: 32px 24px; }
      .content { padding: 24px 20px; }
      .invoice-card { padding: 24px 20px; }
      .invoice-header { flex-direction: column; gap: 16px; }
      .invoice-date { text-align: left; }
      .features { padding: 24px 20px; }
      .footer { padding: 24px 20px; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <h1>🎉 Ödemeniz Onaylandı!</h1>
      <p>Premium üyeliğiniz başarıyla aktif edildi</p>
    </div>
    
    <div class="content">
      <p class="greeting">Merhaba <strong>${userName}</strong>,</p>
      
      <p style="color: #4b5563; font-size: 16px; margin-bottom: 16px;">
        Kariyeer platformundaki ödemeniz başarıyla tamamlandı. Premium rozetiniz aktif edildi ve artık profilinizde görünüyor!
      </p>

      <div style="text-align: center;">
        <span class="success-badge">
          <span style="font-size: 20px;">✨</span>
          ${badgeName}
        </span>
      </div>

      <div class="invoice-card">
        <div class="invoice-header">
          <div>
            <div class="invoice-title">Fatura</div>
            <div class="invoice-number">${invoiceNumber}</div>
          </div>
          <div class="invoice-date">
            <strong>Tarih</strong><br>
            ${invoiceDate}
          </div>
        </div>

        <div class="invoice-row">
          <span class="invoice-label">Ürün</span>
          <span class="invoice-value">${badgeName}</span>
        </div>
        
        <div class="invoice-row">
          <span class="invoice-label">Tutar</span>
          <span class="invoice-value">${baseAmount.toFixed(2)} ${currency || 'TRY'}</span>
        </div>
        
        <div class="invoice-row">
          <span class="invoice-label">KDV (%18)</span>
          <span class="invoice-value">${taxAmount.toFixed(2)} ${currency || 'TRY'}</span>
        </div>

        <div class="invoice-total">
          <span class="total-label">Toplam Tutar</span>
          <span class="total-amount">${totalAmount.toFixed(2)} ${currency || 'TRY'}</span>
        </div>
      </div>

      <div class="features">
        <h3>
          <span style="font-size: 24px;">✨</span>
          Premium Özellikleriniz
        </h3>
        <ul>
          <li>Profilinizde ${badgeName} rozeti görünüyor</li>
          <li>Arama sonuçlarında öne çıkıyorsunuz</li>
          <li>%300 daha fazla profil görüntülenmesi</li>
          <li>Öncelikli müşteri desteği</li>
          <li>Gelişmiş analitik raporlar</li>
          <li>Özel rozet göstergesi</li>
        </ul>
      </div>

      <div style="text-align: center;">
        <a href="https://kariyeer.com/profile" class="cta-button">
          🚀 Profilimi Görüntüle
        </a>
      </div>

      <div class="support-info">
        <p>
          <strong>💡 İpucu:</strong> Dashboard'unuzdan faturalarınıza ve ödeme geçmişinize erişebilirsiniz.
          Herhangi bir sorunuz varsa, <a href="mailto:destek@kariyeer.com">destek@kariyeer.com</a> adresinden bizimle iletişime geçebilirsiniz.
        </p>
      </div>

      <p style="color: #6b7280; font-size: 14px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        Teşekkür ederiz,<br>
        <strong style="color: #111827;">Kariyeer Ekibi</strong>
      </p>
    </div>

    <div class="footer">
      <p><strong>Kariyeer</strong></p>
      <p>Profesyonel kariyer platformu</p>
      
      <div class="footer-links">
        <a href="https://kariyeer.com">Ana Sayfa</a>
        <a href="https://kariyeer.com/about">Hakkımızda</a>
        <a href="https://kariyeer.com/support">Destek</a>
        <a href="https://kariyeer.com/privacy">Gizlilik</a>
      </div>

      <div class="social-links">
        <a href="https://twitter.com/kariyeer">🐦</a>
        <a href="https://linkedin.com/company/kariyeer">💼</a>
        <a href="https://instagram.com/kariyeer">📷</a>
      </div>

      <p style="margin-top: 24px; font-size: 12px;">
        Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.
      </p>
      <p style="font-size: 12px;">
        © ${new Date().getFullYear()} Kariyeer. Tüm hakları saklıdır.
      </p>
    </div>
  </div>
</body>
</html>
    `;

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD
      }
    });

    // Send email
    try {
      const info = await transporter.sendMail({
        from: `"Kariyeer" <${SMTP_FROM}>`,
        to: userEmail,
        subject: `✅ Ödemeniz Onaylandı - ${badgeName}`,
        html: emailHtml
      });

      console.log(`[${requestId}] Email sent successfully:`, info.messageId);
    } catch (emailError) {
      console.error(`[${requestId}] Failed to send email:`, emailError);
      // Don't fail the request if email fails
    }

    console.log(`[${requestId}] Email processing completed`);

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Email sent successfully',
      recipient: userEmail,
      invoiceNumber
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error(`[${requestId}] Error:`, error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
});