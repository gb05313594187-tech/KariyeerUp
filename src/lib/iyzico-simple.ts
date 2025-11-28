// Simple iyzico integration - Direct API calls
const IYZICO_API_KEY = 'sandbox-X4aTXIS0ns5N41hwhVeaYNqnY9gNqrzX';
const IYZICO_SECRET_KEY = 'h28xZYtdIEp0IeEQ';
const IYZICO_BASE_URL = 'https://sandbox-api.iyzipay.com';

async function generateAuthHeader(requestBody: Record<string, unknown>): Promise<string> {
  const randomString = crypto.randomUUID();
  const payload = IYZICO_API_KEY + randomString + IYZICO_SECRET_KEY + JSON.stringify(requestBody);
  
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashString = btoa(String.fromCharCode(...hashArray));
  
  return `IYZWS ${IYZICO_API_KEY}:${hashString}`;
}

export async function createPayment(
  userId: string,
  userEmail: string,
  userName: string,
  subscriptionType: 'blue_badge' | 'gold_badge',
  price: number
) {
  const conversationId = `${userId.substring(0, 8)}-${Date.now()}`;
  const basketId = `basket_${Date.now()}`;
  
  const callbackUrl = `${window.location.origin}/payment-callback`;
  
  const requestBody = {
    locale: 'tr',
    conversationId: conversationId,
    price: price.toFixed(2),
    paidPrice: price.toFixed(2),
    currency: 'TRY',
    basketId: basketId,
    paymentGroup: 'SUBSCRIPTION',
    callbackUrl: callbackUrl,
    enabledInstallments: [1],
    buyer: {
      id: userId,
      name: userName.split(' ')[0] || 'User',
      surname: userName.split(' ')[1] || 'Name',
      email: userEmail,
      identityNumber: '11111111111',
      registrationAddress: 'Istanbul',
      city: 'Istanbul',
      country: 'Turkey',
      zipCode: '34732',
      ip: '85.34.78.112'
    },
    shippingAddress: {
      contactName: userName,
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Istanbul',
      zipCode: '34732'
    },
    billingAddress: {
      contactName: userName,
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Istanbul',
      zipCode: '34732'
    },
    basketItems: [
      {
        id: subscriptionType,
        name: subscriptionType === 'blue_badge' ? 'Mavi Tik' : 'Altın Tik',
        category1: 'Subscription',
        itemType: 'VIRTUAL',
        price: price.toFixed(2)
      }
    ]
  };

  const authHeader = await generateAuthHeader(requestBody);
  const randomString = crypto.randomUUID();

  console.log('🔵 İyzico İstek Gönderiliyor:', {
    url: `${IYZICO_BASE_URL}/payment/iyzipos/checkoutform/initialize/auth/ecom`,
    conversationId,
    price: requestBody.price
  });

  const response = await fetch(`${IYZICO_BASE_URL}/payment/iyzipos/checkoutform/initialize/auth/ecom`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
      'x-iyzi-rnd': randomString
    },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();
  
  console.log('🔵 İyzico Cevabı:', data);

  if (data.status !== 'success') {
    throw new Error(data.errorMessage || 'Ödeme başlatılamadı');
  }

  return {
    paymentUrl: data.paymentPageUrl,
    token: data.token,
    conversationId: conversationId
  };
}