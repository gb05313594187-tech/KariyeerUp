import { createClient } from 'npm:@supabase/supabase-js@2';
import nodemailer from 'npm:nodemailer';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  type?: 'welcome' | 'subscription_expiring' | 'payment_confirmation' | 'coach_approved' | 'coach_rejected';
}

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Request started:`, {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
  });

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // Parse request body
    let body: EmailRequest;
    try {
      body = await req.json();
    } catch (error) {
      console.error(`[${requestId}] Failed to parse request body:`, error);
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { to, subject, html, type } = body;

    console.log(`[${requestId}] Email request:`, { to, subject, type });

    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject, html' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`[${requestId}] Supabase client initialized`);

    // Configure SMTP transporter
    const smtpHost = Deno.env.get('SMTP_HOST');
    const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '587');
    const smtpSecure = Deno.env.get('SMTP_SECURE') !== 'false';
    const smtpUser = Deno.env.get('SMTP_USER');
    const smtpPassword = Deno.env.get('SMTP_PASSWORD');
    const smtpFrom = Deno.env.get('SMTP_FROM') || 'noreply@kariyeer.com';

    if (!smtpHost || !smtpUser || !smtpPassword) {
      console.error(`[${requestId}] SMTP configuration missing`);
      return new Response(
        JSON.stringify({ error: 'SMTP configuration not set' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] SMTP configuration:`, {
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      user: smtpUser,
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

    // Send email
    console.log(`[${requestId}] Sending email...`);
    const info = await transporter.sendMail({
      from: smtpFrom,
      to,
      subject,
      html,
    });

    console.log(`[${requestId}] Email sent successfully:`, {
      messageId: info.messageId,
      response: info.response,
    });

    return new Response(
      JSON.stringify({
        success: true,
        messageId: info.messageId,
        type,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(`[${requestId}] Error sending email:`, error);
    return new Response(
      JSON.stringify({
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});