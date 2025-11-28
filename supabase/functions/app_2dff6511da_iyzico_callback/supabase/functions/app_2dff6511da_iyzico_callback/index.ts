// Edge Function: app_2dff6511da_iyzico_callback
// Version: 37 - ULTIMATE METHOD ACCEPTANCE + DETAILED LOGGING

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Generate random string (mimics SDK's generateRandomString)
function generateRandomString(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2);
  return `${timestamp}${random}`;
}

// Generate HMAC-SHA256 signature using Web Crypto API (mimics SDK's generateHashV2)
async function generateSignature(
  randomString: string,
  uri: string,
  body: Record<string, any>,
  secretKey: string
): Promise<string> {
  const encoder = new TextEncoder();
  
  // Create signature input: randomString + uri + JSON.stringify(body)
  const signatureInput = randomString + uri + JSON.stringify(body);
  
  // Import secret key for HMAC
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secretKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  // Generate HMAC-SHA256 signature
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(signatureInput)
  );
  
  // Convert to hex string
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Generate authorization header V2 (mimics SDK's generateAuthorizationHeaderV2)
async function generateAuthorizationHeaderV2(
  apiKey: string,
  secretKey: string,
  uri: string,
  body: Record<string, any>
): Promise<string> {
  const randomString = generateRandomString();
  const separator = ':';
  
  // Generate signature
  const signature = await generateSignature(randomString, uri, body, secretKey);
  
  // Build authorization params
  const authParams = [
    `apiKey${separator}${apiKey}`,
    `randomKey${separator}${randomString}`,
    `signature${separator}${signature}`
  ];
  
  // Base64 encode
  const encoder = new TextEncoder();
  const authString = authParams.join('&');
  const base64 = btoa(String.fromCharCode(...encoder.encode(authString)));
  
  return `IYZWS ${base64}`;
}

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] ========================================`);
  console.log(`[${requestId}] VERSION 37: ULTIMATE METHOD ACCEPTANCE`);
  console.log(`[${requestId}] Incoming request: ${req.method} ${req.url}`);
  console.log(`[${requestId}] Headers:`, JSON.stringify(Object.fromEntries(req.headers.entries())));

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log(`[${requestId}] ✅ Handling OPTIONS preflight`);
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  // ⚡ ULTIMATE METHOD ACCEPTANCE - Accept ANY HTTP method and process as POST
  console.log(`[${requestId}] ⚡ ULTIMATE ACCEPTANCE: Processing ${req.method} request as POST`);

  try {
    // Parse request body
    let body;
    try {
      body = await req.json();
      console.log(`[${requestId}] ✅ Request body parsed successfully`);
    } catch (e) {
      console.error(`[${requestId}] ❌ Failed to parse request body:`, e);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`[${requestId}] 📦 Request body:`, JSON.stringify(body));

    const { token, userId } = body;

    if (!token || !userId) {
      console.error(`[${requestId}] ❌ Missing required fields: token=${!!token}, userId=${!!userId}`);
      return new Response(
        JSON.stringify({ error: 'Missing token or userId' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`[${requestId}] ✅ Token: ${token}`);
    console.log(`[${requestId}] ✅ User ID: ${userId}`);

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`[${requestId}] ✅ Supabase client initialized`);

    // Get iyzico credentials from environment
    const apiKey = Deno.env.get('IYZICO_API_KEY');
    const secretKey = Deno.env.get('IYZICO_SECRET_KEY');
    const baseUrl = Deno.env.get('IYZICO_BASE_URL') || 'https://sandbox-api.iyzipay.com';

    console.log(`[${requestId}] 🔑 API Key exists: ${!!apiKey}`);
    console.log(`[${requestId}] 🔑 Secret Key exists: ${!!secretKey}`);
    console.log(`[${requestId}] 🌐 Base URL: ${baseUrl}`);

    if (apiKey) {
      const prefix = apiKey.substring(0, 8);
      console.log(`[${requestId}] 🔑 API Key prefix: ${prefix}... (should start with 'sandbox-' for test environment)`);
    }

    if (!apiKey || !secretKey) {
      console.error(`[${requestId}] ❌ Missing iyzico credentials`);
      return new Response(
        JSON.stringify({ error: 'Server configuration error - Missing API credentials' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Prepare request body for iyzico API
    const iyzicoRequestBody = {
      locale: 'tr',
      token: token
    };

    const uri = '/payment/iyzipos/checkoutform/auth/ecom/detail';
    const fullUrl = `${baseUrl}${uri}`;

    console.log(`[${requestId}] 🔄 Verifying payment with iyzico...`);
    console.log(`[${requestId}] 🌐 URL: ${fullUrl}`);
    console.log(`[${requestId}] 📦 Request body:`, JSON.stringify(iyzicoRequestBody));

    // Generate authorization header using SDK logic
    const authHeader = await generateAuthorizationHeaderV2(
      apiKey,
      secretKey,
      uri,
      iyzicoRequestBody
    );

    console.log(`[${requestId}] ✅ Authorization header generated (SDK V2 method)`);

    // Make request to iyzico
    const iyzicoResponse = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'x-iyzi-client-version': 'iyzipay-node-2.0.0'
      },
      body: JSON.stringify(iyzicoRequestBody)
    });

    const result = await iyzicoResponse.json();
    console.log(`[${requestId}] 📊 iyzico response status: ${iyzicoResponse.status}`);
    console.log(`[${requestId}] 📊 iyzico result:`, JSON.stringify(result));

    // Check payment status
    if (result.status !== 'success') {
      console.error(`[${requestId}] ❌ Payment verification failed:`, result);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: result.errorMessage || 'Payment verification failed',
          errorCode: result.errorCode,
          details: result
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Payment successful - activate badge
    console.log(`[${requestId}] ✅ Payment verified successfully!`);
    console.log(`[${requestId}] 🎉 Activating badge for user ${userId}`);

    // Update or create subscription
    const { data: subscription, error: subError } = await supabase
      .from('app_2dff6511da_subscriptions')
      .upsert({
        user_id: userId,
        tier: 'verified',
        status: 'active',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (subError) {
      console.error(`[${requestId}] ❌ Failed to update subscription:`, subError);
      return new Response(
        JSON.stringify({ error: 'Failed to activate badge' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`[${requestId}] ✅ Subscription updated successfully`);

    // Record payment
    const { data: payment, error: payError } = await supabase
      .from('app_2dff6511da_payments')
      .insert({
        user_id: userId,
        amount: result.price || result.paidPrice || 0,
        currency: result.currency || 'TRY',
        status: 'completed',
        payment_method: 'iyzico',
        transaction_id: result.paymentId || token,
        metadata: result
      })
      .select()
      .single();

    if (payError) {
      console.error(`[${requestId}] ⚠️ Failed to record payment (non-critical):`, payError);
    } else {
      console.log(`[${requestId}] ✅ Payment recorded successfully`);
    }

    // Send email notification
    try {
      console.log(`[${requestId}] 📧 Sending email notification...`);
      const emailResponse = await fetch(
        `${supabaseUrl}/functions/v1/app_fc316f2d87_send_payment_email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`
          },
          body: JSON.stringify({
            userId,
            amount: result.price || result.paidPrice || 0,
            currency: result.currency || 'TRY'
          })
        }
      );

      if (!emailResponse.ok) {
        console.error(`[${requestId}] ⚠️ Failed to send email notification (non-critical)`);
      } else {
        console.log(`[${requestId}] ✅ Email notification sent successfully`);
      }
    } catch (emailError) {
      console.error(`[${requestId}] ⚠️ Error sending email (non-critical):`, emailError);
    }

    console.log(`[${requestId}] 🎉 Payment processed successfully!`);
    console.log(`[${requestId}] ========================================`);

    return new Response(
      JSON.stringify({
        success: true,
        subscription,
        payment,
        message: 'Badge activated successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error(`[${requestId}] ❌ Unexpected error:`, error);
    console.error(`[${requestId}] Error stack:`, error instanceof Error ? error.stack : 'No stack trace');
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});