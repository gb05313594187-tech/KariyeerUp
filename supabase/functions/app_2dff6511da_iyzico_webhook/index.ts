// Edge Function: app_2dff6511da_iyzico_webhook
// Version: 6 - Fixed badge_type and payment_status values

import { createClient } from 'npm:@supabase/supabase-js@2';
import Iyzipay from 'npm:iyzipay@2.0.29';

const IYZICO_API_KEY = Deno.env.get('IYZICO_API_KEY') || 'sandbox-rblLSqjC3iZEVJueht5yYDbongifvBMN';
const IYZICO_SECRET_KEY = Deno.env.get('IYZICO_SECRET_KEY') || 'sandbox-uTMoWVVTz40bQ55AJDCT7WUHaKNBbos5';
const IYZICO_BASE_URL = Deno.env.get('IYZICO_BASE_URL') || 'https://sandbox-api.iyzipay.com';

const iyzipay = new Iyzipay({
  apiKey: IYZICO_API_KEY,
  secretKey: IYZICO_SECRET_KEY,
  uri: IYZICO_BASE_URL
});

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] ========================================`);
  console.log(`[${requestId}] VERSION 6: Fixed badge_type and payment_status`);

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

    const url = new URL(req.url);
    let token = url.searchParams.get('token');

    if (!token && req.method === 'POST') {
      try {
        const body = await req.text();
        const formData = new URLSearchParams(body);
        token = formData.get('token');
      } catch (e) {
        console.log(`[${requestId}] Could not parse body:`, e);
      }
    }

    console.log(`[${requestId}] Token:`, token);

    if (!token) {
      return new Response(getErrorHTML(), {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Process payment in background
    processPayment(requestId, token, supabase, supabaseUrl, supabaseKey);

    // Return success HTML
    return new Response(getSuccessHTML(), {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error(`[${requestId}] Error:`, error);
    return new Response(getErrorHTML(), {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
});

async function processPayment(requestId: string, token: string, supabase: any, supabaseUrl: string, supabaseKey: string) {
  try {
    console.log(`[${requestId}] Processing payment for token:`, token);

    const iyzicoResult = await new Promise((resolve, reject) => {
      iyzipay.checkoutForm.retrieve({ token }, (err: any, result: any) => {
        if (err) {
          console.error(`[${requestId}] Iyzico retrieve error:`, err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    console.log(`[${requestId}] Iyzico result:`, JSON.stringify(iyzicoResult, null, 2));

    const paymentStatus = (iyzicoResult as any).paymentStatus;

    if (paymentStatus === 'SUCCESS') {
      console.log(`[${requestId}] ✅ Payment successful, activating subscription...`);

      const { data: transaction, error: dbError } = await supabase
        .from('app_2dff6511da_payment_transactions')
        .select('user_id, metadata, status')
        .eq('iyzico_payment_id', token)
        .single();

      if (dbError || !transaction) {
        console.error(`[${requestId}] Transaction not found:`, dbError);
        return;
      }

      const userId = transaction.user_id;
      const subscriptionType = transaction.metadata?.subscription_type;
      // FIX: Use 'blue' and 'gold' instead of 'blue_badge' and 'gold_badge'
      const badgeType = subscriptionType === 'blue_badge' ? 'blue' : 'gold';
      const price = subscriptionType === 'blue_badge' ? 299 : 599;

      console.log(`[${requestId}] User ID: ${userId}, Badge Type: ${badgeType}`);

      // Update transaction status to 'success' (not 'completed')
      await supabase
        .from('app_2dff6511da_payment_transactions')
        .update({
          status: 'success',
          updated_at: new Date().toISOString()
        })
        .eq('iyzico_payment_id', token);

      console.log(`[${requestId}] Transaction updated to success`);

      // Create or update subscription in app_2dff6511da_subscriptions table
      const startDate = new Date();
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1); // 1 year subscription

      // First, delete existing subscription to avoid conflicts
      await supabase
        .from('app_2dff6511da_subscriptions')
        .delete()
        .eq('user_id', userId);

      const { data: subscription, error: subError } = await supabase
        .from('app_2dff6511da_subscriptions')
        .insert({
          user_id: userId,
          badge_type: badgeType,
          status: 'active',
          price: price,
          currency: 'TRY',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          auto_renew: false
        })
        .select()
        .single();

      if (subError) {
        console.error(`[${requestId}] Subscription creation error:`, subError);
      } else {
        console.log(`[${requestId}] ✅ Subscription created:`, subscription);
      }

      // Create payment record in app_2dff6511da_payments table
      const { data: payment, error: paymentError } = await supabase
        .from('app_2dff6511da_payments')
        .insert({
          user_id: userId,
          subscription_id: subscription?.id,
          amount: price,
          currency: 'TRY',
          payment_method: 'credit_card',
          payment_status: 'completed', // Use 'payment_status' not 'status'
          transaction_id: token,
          payment_date: new Date().toISOString()
        })
        .select()
        .single();

      if (paymentError) {
        console.error(`[${requestId}] Payment record creation error:`, paymentError);
      } else {
        console.log(`[${requestId}] ✅ Payment record created:`, payment);
      }

      // Create invoice
      const invoiceNumber = `INV-${Date.now()}-${userId.substring(0, 8)}`;
      const { data: invoice, error: invError } = await supabase
        .from('app_2dff6511da_invoices')
        .insert({
          user_id: userId,
          payment_id: payment?.id,
          invoice_number: invoiceNumber,
          invoice_date: new Date().toISOString(),
          amount: price,
          tax_amount: price * 0.18, // 18% KDV
          total_amount: price * 1.18,
          currency: 'TRY',
          status: 'paid',
          invoice_sent: false
        })
        .select()
        .single();

      if (invError) {
        console.error(`[${requestId}] Invoice creation error:`, invError);
      } else {
        console.log(`[${requestId}] ✅ Invoice created:`, invoice);
      }

      // Send email
      try {
        await fetch(`${supabaseUrl}/functions/v1/app_fc316f2d87_send_payment_email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({
            user_id: userId,
            badge_type: badgeType,
            amount: price,
            currency: 'TRY'
          })
        });
        console.log(`[${requestId}] ✅ Email sent`);
      } catch (e) {
        console.error(`[${requestId}] Email error:`, e);
      }

      console.log(`[${requestId}] ✅ Payment processing complete!`);
    } else {
      console.log(`[${requestId}] ⚠️ Payment not successful:`, paymentStatus);
    }
  } catch (error) {
    console.error(`[${requestId}] Error processing payment:`, error);
  }
}

function getSuccessHTML(): string {
  return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ödeme Başarılı</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 60px 40px;
            max-width: 500px;
            width: 100%;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: slideUp 0.5s ease-out;
        }
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .checkmark {
            width: 80px;
            height: 80px;
            margin: 0 auto 30px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: scaleIn 0.5s ease-out 0.2s both;
        }
        @keyframes scaleIn {
            from {
                transform: scale(0);
            }
            to {
                transform: scale(1);
            }
        }
        .checkmark svg {
            width: 50px;
            height: 50px;
            stroke: white;
            stroke-width: 3;
            stroke-linecap: round;
            stroke-linejoin: round;
            fill: none;
            animation: drawCheck 0.5s ease-out 0.5s both;
        }
        @keyframes drawCheck {
            to {
                stroke-dashoffset: 0;
            }
        }
        .checkmark svg {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
        }
        h1 {
            color: #1a202c;
            font-size: 32px;
            margin-bottom: 20px;
            font-weight: 700;
        }
        p {
            color: #718096;
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 15px;
        }
        .success-message {
            background: #f0fdf4;
            border: 2px solid #10b981;
            border-radius: 12px;
            padding: 20px;
            margin: 30px 0;
        }
        .success-message p {
            color: #065f46;
            font-weight: 600;
            margin: 0;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 18px 50px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 700;
            font-size: 18px;
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            border: none;
            cursor: pointer;
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
        .info-text {
            color: #a0aec0;
            font-size: 14px;
            margin-top: 25px;
            line-height: 1.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="checkmark">
            <svg viewBox="0 0 52 52">
                <path d="M14 27l8 8 16-16"/>
            </svg>
        </div>
        <h1>Ödeme Başarılı! 🎉</h1>
        <p>Tebrikler! Ödemeniz başarıyla alındı.</p>
        
        <div class="success-message">
            <p>✅ Rozetiniz aktif edildi!</p>
        </div>
        
        <button class="button" onclick="closeAndReturn()">
            Dashboard'a Dön
        </button>
        
        <p class="info-text">
            Bu pencereyi kapatıp ana sayfaya dönebilirsiniz.<br>
            Rozetiniz dashboard'unuzda görünecektir.
        </p>
    </div>
    <script>
        function closeAndReturn() {
            window.close();
            
            if (window.opener && !window.opener.closed) {
                window.opener.focus();
                window.close();
            }
            
            setTimeout(() => {
                alert('Lütfen bu pencereyi manuel olarak kapatın ve ana sayfaya dönün.');
            }, 500);
        }
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            closeAndReturn();
        }, 5000);
    </script>
</body>
</html>
  `;
}

function getErrorHTML(): string {
  return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ödeme Hatası</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 60px 40px;
            max-width: 500px;
            width: 100%;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .error-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 30px;
            background: #f5576c;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 48px;
            font-weight: bold;
        }
        h1 {
            color: #1a202c;
            font-size: 28px;
            margin-bottom: 15px;
        }
        p {
            color: #718096;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 40px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            transition: transform 0.2s;
            border: none;
            cursor: pointer;
        }
        .button:hover {
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-icon">!</div>
        <h1>Ödeme Hatası</h1>
        <p>Ödeme işlemi sırasında bir hata oluştu. Lütfen dashboard'unuzu kontrol edin veya tekrar deneyin.</p>
        <button class="button" onclick="window.close()">Pencereyi Kapat</button>
    </div>
</body>
</html>
  `;
}