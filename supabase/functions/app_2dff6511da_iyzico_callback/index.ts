import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
};

serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] 🎯 Iyzico Callback - Request received`);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const conversationId = url.searchParams.get('conversationId');

    console.log(`[${requestId}] Token:`, token);
    console.log(`[${requestId}] ConversationId:`, conversationId);

    if (!token) {
      console.error(`[${requestId}] ❌ Missing token`);
      return new Response('Missing token', { status: 400, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`[${requestId}] 🔍 Fetching payment with token:`, token);

    const { data: payment, error: paymentError } = await supabase
      .from('app_2dff6511da_payments')
      .select('*')
      .eq('transaction_id', token)
      .single();

    if (paymentError || !payment) {
      console.error(`[${requestId}] ❌ Payment not found:`, paymentError);
      return new Response('Payment not found', { status: 404, headers: corsHeaders });
    }

    console.log(`[${requestId}] ✅ Payment found:`, payment.id);

    if (payment.payment_status === 'completed') {
      console.log(`[${requestId}] ⚠️ Payment already processed`);
      return new Response('Payment already processed', { status: 200, headers: corsHeaders });
    }

    console.log(`[${requestId}] 📝 Updating payment status to completed`);

    const { error: updateError } = await supabase
      .from('app_2dff6511da_payments')
      .update({ 
        payment_status: 'completed',
        payment_date: new Date().toISOString()
      })
      .eq('id', payment.id);

    if (updateError) {
      console.error(`[${requestId}] ❌ Failed to update payment:`, updateError);
      throw updateError;
    }

    console.log(`[${requestId}] ✅ Payment updated successfully`);

    if (payment.subscription_id) {
      console.log(`[${requestId}] 🔄 Activating subscription:`, payment.subscription_id);

      const { error: subError } = await supabase
        .from('app_2dff6511da_subscriptions')
        .update({ 
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.subscription_id);

      if (subError) {
        console.error(`[${requestId}] ❌ Failed to activate subscription:`, subError);
      } else {
        console.log(`[${requestId}] ✅ Subscription activated`);
      }
    }

    console.log(`[${requestId}] 📄 Creating invoice`);

    const invoiceNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const taxRate = 0.20;
    const baseAmount = payment.amount;
    const taxAmount = baseAmount * taxRate;
    const totalAmount = baseAmount + taxAmount;

    const { data: subscription } = await supabase
      .from('app_2dff6511da_subscriptions')
      .select('badge_type')
      .eq('id', payment.subscription_id)
      .single();

    const subscriptionType = subscription?.badge_type || 'standard';

    const { data: invoice, error: invoiceError } = await supabase
      .from('app_2dff6511da_invoices')
      .insert({
        user_id: payment.user_id,
        payment_id: payment.id,
        invoice_number: invoiceNumber,
        invoice_date: new Date().toISOString(),
        amount: baseAmount,
        currency: payment.currency,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        status: 'paid',
        invoice_sent: false,
        subscription_type: subscriptionType
      })
      .select()
      .single();

    if (invoiceError) {
      console.error(`[${requestId}] ❌ Failed to create invoice:`, invoiceError);
    } else {
      console.log(`[${requestId}] ✅ Invoice created:`, invoice.invoice_number);

      // Send invoice email automatically
      console.log(`[${requestId}] 📧 Sending invoice email automatically`);
      
      try {
        const emailResponse = await fetch(`${supabaseUrl}/functions/v1/app_2dff6511da_send_invoice_email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ invoice_id: invoice.id })
        });

        if (emailResponse.ok) {
          console.log(`[${requestId}] ✅ Invoice email sent successfully`);
        } else {
          const errorText = await emailResponse.text();
          console.error(`[${requestId}] ⚠️ Failed to send invoice email:`, errorText);
        }
      } catch (emailError) {
        console.error(`[${requestId}] ⚠️ Email sending error:`, emailError);
      }
    }

    console.log(`[${requestId}] ✅ Callback processing completed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment processed successfully',
        invoice_number: invoiceNumber
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`[${requestId}] 💥 Unexpected error:`, error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});