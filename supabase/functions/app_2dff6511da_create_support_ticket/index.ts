import { createClient } from 'npm:@supabase/supabase-js@2';
import { Anthropic } from 'npm:@anthropic-ai/sdk@0.24.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
};

interface TicketRequest {
  subject: string;
  description: string;
  category?: string;
  user_metadata?: any;
}

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] 📨 Incoming request:`, req.method, req.url);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // Get authorization token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error(`[${requestId}] ❌ Missing Authorization header`);
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error(`[${requestId}] ❌ Invalid token:`, userError);
      return new Response(
        JSON.stringify({ error: 'Invalid authorization token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] 👤 User authenticated:`, user.id);

    // Parse request body
    let body: TicketRequest;
    try {
      body = await req.json();
    } catch (e) {
      console.error(`[${requestId}] ❌ Invalid JSON body:`, e);
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { subject, description, category = 'badge_issue', user_metadata } = body;

    if (!subject || !description) {
      return new Response(
        JSON.stringify({ error: 'Subject and description are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] 📝 Creating ticket:`, { subject, category });

    // Generate ticket number
    const ticketNumber = `TICKET-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // AI Analysis with Claude
    let aiAnalysis = null;
    try {
      const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
      if (anthropicKey) {
        console.log(`[${requestId}] 🤖 Running AI analysis...`);
        const anthropic = new Anthropic({ apiKey: anthropicKey });
        
        const analysisPrompt = `Analyze this support ticket and provide:
1. Severity level (low/medium/high/urgent)
2. Suggested priority
3. Possible root cause
4. Recommended actions for support team
5. Estimated resolution time

Ticket Details:
Subject: ${subject}
Description: ${description}
Category: ${category}
User Metadata: ${JSON.stringify(user_metadata || {})}

Respond in JSON format with keys: severity, priority, root_cause, recommended_actions, estimated_resolution_time`;

        const message = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [{
            role: 'user',
            content: analysisPrompt
          }]
        });

        const content = message.content[0];
        if (content.type === 'text') {
          try {
            aiAnalysis = JSON.parse(content.text);
            console.log(`[${requestId}] ✅ AI analysis completed:`, aiAnalysis);
          } catch (e) {
            console.error(`[${requestId}] ⚠️ Failed to parse AI response:`, e);
            aiAnalysis = { raw_response: content.text };
          }
        }
      }
    } catch (aiError) {
      console.error(`[${requestId}] ⚠️ AI analysis failed:`, aiError);
    }

    // Determine priority from AI or default
    const priority = aiAnalysis?.priority || 'medium';

    // Insert ticket into database
    const { data: ticket, error: insertError } = await supabase
      .from('app_2dff6511da_support_tickets')
      .insert({
        user_id: user.id,
        ticket_number: ticketNumber,
        subject,
        description,
        category,
        priority,
        status: 'open',
        ai_analysis: aiAnalysis
      })
      .select()
      .single();

    if (insertError) {
      console.error(`[${requestId}] ❌ Database insert error:`, insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to create ticket', details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] ✅ Ticket created:`, ticket.id);

    // Send email notification to admin
    try {
      const smtpHost = Deno.env.get('SMTP_HOST');
      const smtpUser = Deno.env.get('SMTP_USER');
      const smtpPassword = Deno.env.get('SMTP_PASSWORD');
      const smtpFrom = Deno.env.get('SMTP_FROM');

      if (smtpHost && smtpUser && smtpPassword) {
        console.log(`[${requestId}] 📧 Sending email notification...`);
        
        const emailBody = `
🎫 Yeni Destek Talebi Oluşturuldu

Ticket Numarası: ${ticketNumber}
Kategori: ${category}
Öncelik: ${priority}
Durum: Açık

👤 Kullanıcı Bilgileri:
- ID: ${user.id}
- Email: ${user.email}
- Ad Soyad: ${user_metadata?.fullName || 'N/A'}

📋 Talep Detayları:
Konu: ${subject}
Açıklama: ${description}

${aiAnalysis ? `
🤖 AI Analizi:
${JSON.stringify(aiAnalysis, null, 2)}
` : ''}

Lütfen en kısa sürede bu talebi inceleyin.
        `.trim();

        // Note: Email sending would require nodemailer or similar
        // For now, we'll log it
        console.log(`[${requestId}] 📧 Email content prepared:`, emailBody);
      }
    } catch (emailError) {
      console.error(`[${requestId}] ⚠️ Email notification failed:`, emailError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        ticket: {
          id: ticket.id,
          ticket_number: ticketNumber,
          status: 'open',
          priority,
          ai_analysis: aiAnalysis
        },
        message: 'Destek talebiniz başarıyla oluşturuldu. En kısa sürede size dönüş yapılacaktır.'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error(`[${requestId}] ❌ Unexpected error:`, error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});