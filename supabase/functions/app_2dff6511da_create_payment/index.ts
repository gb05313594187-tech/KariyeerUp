// Edge Function: app_2dff6511da_create_payment
// Version: 70 - Use webhook endpoint as callback URL

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
  console.log(`[${requestId}] VERSION 70: Use webhook endpoint`);

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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const body = await req.json();
    const { subscription_type, price } = body;

    if (!subscription_type || !price) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const conversationId = crypto.randomUUID();
    const basketId = crypto.randomUUID();
    
    // Use webhook endpoint as callback
    const callbackUrl = `${supabaseUrl.replace('http://', 'https://')}/functions/v1/app_2dff6511da_iyzico_webhook`;
    console.log(`[${requestId}] Callback URL (webhook):`, callbackUrl);

    const userIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '85.34.78.112';

    const paymentRequest = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: conversationId,
      price: price.toString(),
      paidPrice: price.toString(),
      currency: Iyzipay.CURRENCY.TRY,
      basketId: basketId,
      paymentGroup: Iyzipay.PAYMENT_GROUP.SUBSCRIPTION,
      callbackUrl: callbackUrl,
      paymentChannel: 'WEB',
      buyer: {
        id: user.id.substring(0, 11),
        name: user.user_metadata?.full_name?.split(' ')[0] || 'User',
        surname: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || 'Name',
        gsmNumber: '+905555555555',
        email: user.email,
        identityNumber: '11111111111',
        lastLoginDate: new Date().toISOString().split('T')[0] + ' 00:00:00',
        registrationDate: new Date().toISOString().split('T')[0] + ' 00:00:00',
        registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        ip: userIP,
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34732'
      },
      shippingAddress: {
        contactName: user.user_metadata?.full_name || 'User Name',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        zipCode: '34732'
      },
      billingAddress: {
        contactName: user.user_metadata?.full_name || 'User Name',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        zipCode: '34732'
      },
      basketItems: [
        {
          id: subscription_type,
          name: subscription_type === 'blue_badge' ? 'Mavi Tik Abonelik' : 'Altın Tik Abonelik',
          category1: 'Abonelik',
          category2: 'Rozet',
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: price.toString()
        }
      ]
    };

    const iyzicoResult = await new Promise((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(paymentRequest, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if ((iyzicoResult as any).status !== 'success') {
      return new Response(JSON.stringify({
        success: false,
        error: (iyzicoResult as any).errorMessage || 'Payment initialization failed'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const paymentToken = (iyzicoResult as any).token;
    const paymentPageUrl = (iyzicoResult as any).paymentPageUrl;

    const { data: transactionData, error: dbError } = await supabase
      .from('app_2dff6511da_payment_transactions')
      .insert({
        user_id: user.id,
        iyzico_conversation_id: conversationId,
        iyzico_payment_id: paymentToken,
        status: 'pending',
        amount: parseFloat(price.toString()),
        currency: 'TRY',
        payment_method: 'credit_card',
        payment_date: new Date().toISOString(),
        metadata: {
          token: paymentToken,
          subscription_type: subscription_type,
          basketId: basketId,
          callback_url: callbackUrl,
          payment_channel: 'WEB',
          payment_provider: 'iyzico'
        },
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Veritabanı hatası'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      payment_url: paymentPageUrl,
      token: paymentToken,
      conversation_id: conversationId
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
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
});