import { createClient } from 'npm:@supabase/supabase-js@2';
import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts';

const IYZICO_API_KEY = Deno.env.get('IYZICO_API_KEY') || 'sandbox-X4aTXIS0ns5N41hwhVeaYNqnY9gNqrzX';
const IYZICO_SECRET_KEY = Deno.env.get('IYZICO_SECRET_KEY') || 'h28xZYtdIEp0IeEQ';
const IYZICO_BASE_URL = Deno.env.get('IYZICO_BASE_URL') || 'https://sandbox-api.iyzipay.com';

// Generate random request ID
function generateRequestId(): string {
  return crypto.randomUUID();
}

// Generate authorization header for iyzico
async function generateAuthHeader(
  apiKey: string,
  secretKey: string,
  randomString: string,
  requestBody: string
): Promise<string> {
  const dataToHash = `${apiKey}${randomString}${secretKey}${requestBody}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(dataToHash);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  const hashBase64 = btoa(String.fromCharCode(...hashArray));
  
  return `IYZWS ${apiKey}:${hashBase64}`;
}

// Make request to iyzico API
async function makeIyzicoRequest(endpoint: string, body: any): Promise<any> {
  const requestId = generateRequestId();
  const randomString = crypto.randomUUID();
  const requestBody = JSON.stringify(body);
  
  const authHeader = await generateAuthHeader(
    IYZICO_API_KEY,
    IYZICO_SECRET_KEY,
    randomString,
    requestBody
  );

  console.log(`[${requestId}] Making iyzico request to ${endpoint}`);

  const response = await fetch(`${IYZICO_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
      'x-iyzi-rnd': randomString,
      'x-iyzi-client-version': 'iyzipay-node-2.0.0',
    },
    body: requestBody,
  });

  const responseData = await response.json();
  
  console.log(`[${requestId}] iyzico response status:`, responseData.status);
  
  return responseData;
}

Deno.serve(async (req) => {
  const requestId = generateRequestId();
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
    });
  }

  try {
    console.log(`[${requestId}] Received ${req.method} request`);

    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error(`[${requestId}] Failed to parse request body:`, e);
      return new Response(
        JSON.stringify({ 
          status: 'failure', 
          errorCode: 'INVALID_REQUEST',
          errorMessage: 'Invalid request body' 
        }),
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const { action, paymentData, token, conversationId } = body;

    if (action === 'initialize') {
      console.log(`[${requestId}] Initializing payment`);
      
      // Add locale and conversationId
      const iyzicoPaymentData = {
        ...paymentData,
        locale: 'tr',
        conversationId: `CONV_${Date.now()}`,
      };

      const result = await makeIyzicoRequest('/payment/iyzipos/initialize3ds/ecom', iyzicoPaymentData);

      if (result.status === 'success') {
        return new Response(
          JSON.stringify({
            status: 'success',
            threeDSHtmlContent: result.threeDSHtmlContent,
            paymentId: result.paymentId,
            conversationId: result.conversationId,
          }),
          {
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      } else {
        console.error(`[${requestId}] Payment initialization failed:`, result);
        return new Response(
          JSON.stringify({
            status: 'failure',
            errorCode: result.errorCode,
            errorMessage: result.errorMessage,
          }),
          {
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }
    } else if (action === 'verify') {
      console.log(`[${requestId}] Verifying payment`);
      
      const result = await makeIyzicoRequest('/payment/iyzipos/callback3ds/ecom', {
        locale: 'tr',
        conversationId,
        token,
      });

      if (result.status === 'success') {
        return new Response(
          JSON.stringify({
            status: 'success',
            paymentId: result.paymentId,
            conversationId: result.conversationId,
          }),
          {
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      } else {
        console.error(`[${requestId}] Payment verification failed:`, result);
        return new Response(
          JSON.stringify({
            status: 'failure',
            errorCode: result.errorCode,
            errorMessage: result.errorMessage,
          }),
          {
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ 
          status: 'failure', 
          errorCode: 'INVALID_ACTION',
          errorMessage: 'Invalid action' 
        }),
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  } catch (error) {
    console.error(`[${requestId}] Error:`, error);
    return new Response(
      JSON.stringify({
        status: 'failure',
        errorCode: 'INTERNAL_ERROR',
        errorMessage: error.message,
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});