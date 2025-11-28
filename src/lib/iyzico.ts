// iyzico Payment Integration Library
import { supabase } from './supabase';

export interface PaymentRequest {
  price: string;
  paidPrice: string;
  currency: string;
  basketId: string;
  paymentGroup: string;
  callbackUrl: string;
  buyer: {
    id: string;
    name: string;
    surname: string;
    email: string;
    identityNumber: string;
    registrationAddress: string;
    city: string;
    country: string;
    ip: string;
  };
  shippingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
  };
  billingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
  };
  basketItems: Array<{
    id: string;
    name: string;
    category1: string;
    itemType: string;
    price: string;
  }>;
}

export interface PaymentResponse {
  status: 'success' | 'failure';
  paymentId?: string;
  conversationId?: string;
  threeDSHtmlContent?: string;
  errorCode?: string;
  errorMessage?: string;
}

/**
 * Initialize payment with iyzico
 * This will create a 3D Secure payment request
 */
export async function initializePayment(
  paymentData: PaymentRequest
): Promise<PaymentResponse> {
  try {
    console.log('=== PAYMENT INITIALIZATION STARTED ===');
    console.log('Payment data:', {
      basketId: paymentData.basketId,
      price: paymentData.price,
      buyerEmail: paymentData.buyer.email
    });

    // Get the current session to get auth token
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return {
        status: 'failure',
        errorCode: 'SESSION_ERROR',
        errorMessage: 'Oturum hatası: ' + sessionError.message,
      };
    }

    if (!session) {
      console.error('No active session found');
      return {
        status: 'failure',
        errorCode: 'NO_SESSION',
        errorMessage: 'Lütfen giriş yapın',
      };
    }

    console.log('Session found, user ID:', session.user.id);

    const edgeFunctionUrl = 'https://wzadnstzslxvuwmmjmwn.supabase.co/functions/v1/app_2dff6511da_iyzico_payment';
    console.log('Making request to:', edgeFunctionUrl);

    // Make direct fetch call to edge function
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        action: 'initialize',
        paymentData,
      }),
    });

    console.log('Edge function response status:', response.status);
    console.log('Edge function response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge function error response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { errorMessage: errorText };
      }

      return {
        status: 'failure',
        errorCode: errorData.errorCode || 'EDGE_FUNCTION_ERROR',
        errorMessage: errorData.errorMessage || `HTTP ${response.status}: ${errorText}`,
      };
    }

    const result = await response.json();
    console.log('Edge function success response:', result);

    return result;

  } catch (error) {
    console.error('=== PAYMENT INITIALIZATION ERROR ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Full error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return {
      status: 'failure',
      errorCode: 'NETWORK_ERROR',
      errorMessage: `Ağ hatası: ${errorMessage}`,
    };
  }
}

/**
 * Verify payment after 3D Secure
 */
export async function verifyPayment(
  token: string,
  conversationId: string
): Promise<PaymentResponse> {
  try {
    console.log('=== PAYMENT VERIFICATION STARTED ===');
    console.log('Token:', token);
    console.log('Conversation ID:', conversationId);

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('Session error:', sessionError);
      return {
        status: 'failure',
        errorCode: 'NO_SESSION',
        errorMessage: 'Lütfen giriş yapın',
      };
    }

    const edgeFunctionUrl = 'https://wzadnstzslxvuwmmjmwn.supabase.co/functions/v1/app_2dff6511da_iyzico_payment';
    console.log('Making verification request to:', edgeFunctionUrl);

    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        action: 'verify',
        token,
        conversationId,
      }),
    });

    console.log('Verification response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Verification error:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { errorMessage: errorText };
      }

      return {
        status: 'failure',
        errorCode: errorData.errorCode || 'VERIFICATION_ERROR',
        errorMessage: errorData.errorMessage || `HTTP ${response.status}`,
      };
    }

    const result = await response.json();
    console.log('Verification success:', result);

    return result;

  } catch (error) {
    console.error('=== PAYMENT VERIFICATION ERROR ===');
    console.error('Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return {
      status: 'failure',
      errorCode: 'NETWORK_ERROR',
      errorMessage: `Ağ hatası: ${errorMessage}`,
    };
  }
}

/**
 * Create payment request for subscription
 */
export function createSubscriptionPaymentRequest(
  userId: string,
  userEmail: string,
  userName: string,
  subscriptionType: string,
  price: number,
  userIP: string
): PaymentRequest {
  const nameParts = userName.split(' ');
  const firstName = nameParts[0] || 'User';
  const lastName = nameParts.slice(1).join(' ') || 'Name';

  return {
    price: price.toFixed(2),
    paidPrice: price.toFixed(2),
    currency: 'TRY',
    basketId: `basket_${Date.now()}`,
    paymentGroup: 'SUBSCRIPTION',
    callbackUrl: `${window.location.origin}/payment-callback`,
    buyer: {
      id: userId,
      name: firstName,
      surname: lastName,
      email: userEmail,
      identityNumber: '11111111111',
      registrationAddress: 'Adres',
      city: 'Istanbul',
      country: 'Turkey',
      ip: userIP,
    },
    shippingAddress: {
      contactName: userName,
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Adres',
    },
    billingAddress: {
      contactName: userName,
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Adres',
    },
    basketItems: [
      {
        id: subscriptionType,
        name: subscriptionType,
        category1: 'Subscription',
        itemType: 'VIRTUAL',
        price: price.toFixed(2),
      },
    ],
  };
}

/**
 * Get user's IP address
 */
export async function getUserIP(): Promise<string> {
  try {
    console.log('Getting user IP...');
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    console.log('User IP:', data.ip);
    return data.ip;
  } catch (error) {
    console.error('Failed to get user IP:', error);
    return '127.0.0.1';
  }
}