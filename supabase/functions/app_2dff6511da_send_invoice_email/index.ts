import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import nodemailer from 'npm:nodemailer';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
};

interface EmailData {
  to: string;
  subject: string;
  html: string;
  invoiceNumber: string;
}

serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] 📧 Send Invoice Email - Request received`);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`[${requestId}] Supabase client initialized`);

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error(`[${requestId}] ❌ No authorization header`);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error(`[${requestId}] ❌ Auth error:`, authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] ✅ User authenticated:`, user.id);

    // Parse request body
    let invoiceId: string;
    try {
      const body = await req.json();
      invoiceId = body.invoice_id;
    } catch (e) {
      console.error(`[${requestId}] ❌ Failed to parse request body:`, e);
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!invoiceId) {
      console.error(`[${requestId}] ❌ Missing invoice_id`);
      return new Response(
        JSON.stringify({ error: 'invoice_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] 🔍 Fetching invoice:`, invoiceId);

    // Fetch invoice data
    const { data: invoice, error: invoiceError } = await supabase
      .from('app_2dff6511da_invoices')
      .select('*')
      .eq('id', invoiceId)
      .eq('user_id', user.id)
      .single();

    if (invoiceError || !invoice) {
      console.error(`[${requestId}] ❌ Invoice fetch error:`, invoiceError);
      return new Response(
        JSON.stringify({ error: 'Invoice not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] ✅ Invoice found:`, invoice.invoice_number);

    // Get user details
    const { data: userData } = await supabase.auth.admin.getUserById(user.id);
    const userEmail = userData?.user?.email;
    const userName = userData?.user?.user_metadata?.full_name || userEmail || 'Değerli Müşterimiz';

    if (!userEmail) {
      console.error(`[${requestId}] ❌ User email not found`);
      return new Response(
        JSON.stringify({ error: 'User email not found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] 👤 User details:`, { email: userEmail, name: userName });

    // Generate email HTML
    const emailHtml = generateInvoiceEmailHTML(invoice, userName);

    // Send email using SMTP
    console.log(`[${requestId}] 📤 Sending email to:`, userEmail);
    
    const emailSent = await sendEmail({
      to: userEmail,
      subject: `Kariyeer - Faturanız Hazır (${invoice.invoice_number})`,
      html: emailHtml,
      invoiceNumber: invoice.invoice_number
    }, requestId);

    if (!emailSent) {
      console.error(`[${requestId}] ❌ Failed to send email`);
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update invoice as sent
    const { error: updateError } = await supabase
      .from('app_2dff6511da_invoices')
      .update({ 
        invoice_sent: true, 
        invoice_sent_at: new Date().toISOString() 
      })
      .eq('id', invoiceId);

    if (updateError) {
      console.error(`[${requestId}] ⚠️ Failed to update invoice status:`, updateError);
    }

    console.log(`[${requestId}] ✅ Email sent successfully`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Invoice email sent successfully',
        invoice_number: invoice.invoice_number
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`[${requestId}] 💥 Unexpected error:`, error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : String(error) 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function sendEmail(emailData: EmailData, requestId: string): Promise<boolean> {
  try {
    const smtpHost = Deno.env.get('SMTP_HOST');
    const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '587');
    const smtpSecure = Deno.env.get('SMTP_SECURE') !== 'false';
    const smtpUser = Deno.env.get('SMTP_USER');
    const smtpPassword = Deno.env.get('SMTP_PASSWORD');
    const smtpFrom = Deno.env.get('SMTP_FROM') || smtpUser;

    if (!smtpHost || !smtpUser || !smtpPassword) {
      console.error(`[${requestId}] ❌ SMTP credentials not configured`);
      return false;
    }

    console.log(`[${requestId}] 🔧 SMTP Config:`, { 
      host: smtpHost, 
      port: smtpPort, 
      secure: smtpSecure,
      user: smtpUser,
      from: smtpFrom
    });

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    const info = await transporter.sendMail({
      from: `"Kariyeer Platform" <${smtpFrom}>`,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    });

    console.log(`[${requestId}] ✅ Email sent:`, info.messageId);
    return true;
  } catch (error) {
    console.error(`[${requestId}] ❌ Email send error:`, error);
    return false;
  }
}

function generateInvoiceEmailHTML(invoice: any, userName: string): string {
  const date = new Date(invoice.created_at).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const subscriptionName = invoice.subscription_type === 'premium' ? 'Premium Üyelik' : 
                           invoice.subscription_type === 'gold' ? 'Gold Üyelik' : 
                           invoice.subscription_type === 'silver' ? 'Silver Üyelik' : 
                           'Standart Üyelik';

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Faturanız Hazır</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Kariyeer Platform</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 14px;">Profesyonel Kariyer Gelişim Platformu</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Merhaba ${userName},</h2>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                ${subscriptionName} aboneliğiniz için ödemeniz başarıyla alınmıştır. Faturanız aşağıdaki detaylarla hazırlanmıştır:
              </p>

              <!-- Invoice Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; margin: 30px 0;">
                <tr>
                  <td style="padding: 25px;">
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">Fatura Numarası:</td>
                        <td style="color: #1f2937; font-weight: 600; font-size: 14px; text-align: right; padding: 8px 0;">${invoice.invoice_number}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">Tarih:</td>
                        <td style="color: #1f2937; font-weight: 600; font-size: 14px; text-align: right; padding: 8px 0;">${date}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">Abonelik:</td>
                        <td style="color: #1f2937; font-weight: 600; font-size: 14px; text-align: right; padding: 8px 0;">${subscriptionName}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px; padding: 8px 0; border-top: 1px solid #e5e7eb; padding-top: 15px;">Ara Toplam:</td>
                        <td style="color: #1f2937; font-weight: 600; font-size: 14px; text-align: right; padding: 8px 0; border-top: 1px solid #e5e7eb; padding-top: 15px;">${invoice.amount.toFixed(2)} TL</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">KDV (%20):</td>
                        <td style="color: #1f2937; font-weight: 600; font-size: 14px; text-align: right; padding: 8px 0;">${invoice.tax_amount.toFixed(2)} TL</td>
                      </tr>
                      <tr>
                        <td style="color: #2563eb; font-size: 18px; font-weight: 700; padding: 15px 0 8px 0; border-top: 2px solid #2563eb;">TOPLAM:</td>
                        <td style="color: #2563eb; font-size: 18px; font-weight: 700; text-align: right; padding: 15px 0 8px 0; border-top: 2px solid #2563eb;">${invoice.total_amount.toFixed(2)} TL</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Payment Status -->
              <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 15px 20px; border-radius: 6px; margin: 30px 0;">
                <p style="margin: 0; color: #065f46; font-weight: 600; font-size: 14px;">
                  ✓ Ödeme Durumu: Başarıyla Tamamlandı
                </p>
              </div>

              <p style="color: #4b5563; line-height: 1.6; margin: 30px 0 20px 0; font-size: 16px;">
                Faturanızın detaylı bir kopyasını dashboard'unuzdan indirebilirsiniz.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://kariyeer.com/dashboard" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Dashboard'a Git
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #6b7280; line-height: 1.6; margin: 30px 0 0 0; font-size: 14px;">
                Herhangi bir sorunuz varsa, lütfen bizimle iletişime geçmekten çekinmeyin.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
                <strong>Kariyeer Platform</strong><br>
                İstanbul, Türkiye
              </p>
              <p style="color: #9ca3af; margin: 10px 0; font-size: 12px;">
                Bu email otomatik olarak gönderilmiştir.<br>
                Destek için: <a href="mailto:destek@kariyeer.com" style="color: #2563eb; text-decoration: none;">destek@kariyeer.com</a>
              </p>
              <p style="color: #9ca3af; margin: 15px 0 0 0; font-size: 11px;">
                © ${new Date().getFullYear()} Kariyeer Platform. Tüm hakları saklıdır.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}