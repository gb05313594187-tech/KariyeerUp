// Edge Function: app_2dff6511da_iyzico_callback
// Version: 68 - Return JSON for AJAX calls, HTML for direct browser access

import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] ========================================`);
  console.log(`[${requestId}] VERSION 68: JSON for AJAX, HTML for browser`);
  
  console.log(`[${requestId}] Request:`, {
    method: req.method,
    url: req.url,
    headers: {
      'content-type': req.headers.get('content-type'),
      'accept': req.headers.get('accept')
    }
  });

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      }
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const rawBody = await req.text();
    console.log(`[${requestId}] Raw body:`, rawBody);

    let jsonBody = null;
    try {
      jsonBody = JSON.parse(rawBody);
    } catch (e) {
      // Not JSON
    }

    let formData = null;
    try {
      const params = new URLSearchParams(rawBody);
      formData = Object.fromEntries(params.entries());
    } catch (e) {
      // Not form-data
    }

    // Extract token
    const url = new URL(req.url);
    let token = url.searchParams.get('token') || jsonBody?.token || formData?.token;

    console.log(`[${requestId}] Token:`, token);

    // Detect if this is an AJAX call or direct browser access
    const isAjaxCall = req.headers.get('content-type')?.includes('application/json') || 
                       req.headers.get('accept')?.includes('application/json');
    
    console.log(`[${requestId}] Is AJAX call:`, isAjaxCall);

    if (!token) {
      console.error(`[${requestId}] No token found`);
      
      if (isAjaxCall) {
        return new Response(JSON.stringify({
          success: false,
          error: 'No token provided'
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Hata</title>
          <script>
            setTimeout(function() {
              window.location.href = '/';
            }, 2000);
          </script>
        </head>
        <body>
          <p>Token bulunamadı. Ana sayfaya yönlendiriliyorsunuz...</p>
        </body>
        </html>
      `, {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Query database
    const { data: paymentTransaction, error: dbError } = await supabase
      .from('app_2dff6511da_payment_transactions')
      .select('iyzico_conversation_id, user_id, metadata, status, amount, currency')
      .eq('iyzico_payment_id', token)
      .single();

    let userId = null;
    let subscriptionType = null;
    let badgeType = 'blue';

    if (!dbError && paymentTransaction) {
      userId = paymentTransaction.user_id;
      subscriptionType = paymentTransaction.metadata?.subscription_type;
      badgeType = subscriptionType === 'blue_badge' ? 'blue' : 'gold';

      console.log(`[${requestId}] Payment found for user:`, userId);
      console.log(`[${requestId}] Subscription type:`, subscriptionType);

      // Update payment status
      const { error: updateError } = await supabase
        .from('app_2dff6511da_payment_transactions')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('iyzico_payment_id', token);

      if (updateError) {
        console.error(`[${requestId}] Failed to update payment:`, updateError);
      } else {
        console.log(`[${requestId}] Payment status updated to completed`);
      }

      // Activate badge
      const { error: badgeError } = await supabase
        .from('app_2dff6511da_user_badges')
        .upsert({
          user_id: userId,
          badge_type: badgeType,
          is_active: true,
          activated_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (badgeError) {
        console.error(`[${requestId}] Failed to activate badge:`, badgeError);
      } else {
        console.log(`[${requestId}] Badge activated: ${badgeType}`);
      }

      // Send email notification
      try {
        const emailResponse = await fetch(`${supabaseUrl}/functions/v1/app_fc316f2d87_send_payment_email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({
            user_id: userId,
            badge_type: badgeType,
            amount: paymentTransaction.amount,
            currency: paymentTransaction.currency
          })
        });

        if (!emailResponse.ok) {
          console.error(`[${requestId}] Email failed:`, await emailResponse.text());
        } else {
          console.log(`[${requestId}] Email notification sent`);
        }
      } catch (emailError) {
        console.error(`[${requestId}] Email error:`, emailError);
      }
    } else {
      console.log(`[${requestId}] Payment not found in DB, proceeding anyway`);
    }

    console.log(`[${requestId}] Success!`);

    // Return JSON for AJAX calls
    if (isAjaxCall) {
      return new Response(JSON.stringify({
        success: true,
        badge_type: badgeType,
        message: 'Payment processed successfully'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Return HTML for direct browser access
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Ödeme Başarılı</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          .container {
            text-align: center;
            padding: 3rem;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 1.5rem;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            max-width: 500px;
          }
          .success-icon {
            font-size: 5rem;
            margin-bottom: 1.5rem;
            animation: bounce 1s ease-in-out;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          h1 {
            margin: 0 0 1rem 0;
            font-size: 2rem;
          }
          p {
            margin: 0.5rem 0;
            opacity: 0.95;
            font-size: 1.1rem;
          }
          .badge-info {
            margin-top: 1rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 0.5rem;
          }
        </style>
        <script>
          setTimeout(function() {
            window.close();
          }, 3000);
        </script>
      </head>
      <body>
        <div class="container">
          <div class="success-icon">✅</div>
          <h1>Ödeme Başarılı!</h1>
          <div class="badge-info">
            <p><strong>${badgeType === 'blue' ? '🔵 Mavi Rozet' : '🟡 Altın Rozet'}</strong></p>
            <p>Hesabınıza tanımlandı</p>
          </div>
          <p style="margin-top: 1.5rem;">Bu pencere otomatik olarak kapanacak...</p>
        </div>
      </body>
      </html>
    `, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error(`[${requestId}] Unexpected error:`, error);
    
    const isAjaxCall = req.headers.get('content-type')?.includes('application/json');
    
    if (isAjaxCall) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Hata</title>
        <script>
          setTimeout(function() {
            window.close();
          }, 2000);
        </script>
      </head>
      <body>
        <p>Bir hata oluştu. Pencere kapanıyor...</p>
      </body>
      </html>
    `, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
});