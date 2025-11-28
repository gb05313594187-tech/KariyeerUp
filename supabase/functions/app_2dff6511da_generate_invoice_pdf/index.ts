import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
};

interface InvoiceData {
  id: string;
  invoice_number: string;
  user_id: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  created_at: string;
  payment_id: string;
  subscription_type: string;
  user_email?: string;
  user_name?: string;
}

serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Incoming request:`, {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
  });

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`[${requestId}] Supabase client initialized`);

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error(`[${requestId}] No authorization header`);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error(`[${requestId}] Auth error:`, authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] User authenticated:`, user.id);

    // Parse request body
    let invoiceId: string;
    try {
      const body = await req.json();
      invoiceId = body.invoice_id;
    } catch (e) {
      console.error(`[${requestId}] Failed to parse request body:`, e);
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!invoiceId) {
      console.error(`[${requestId}] Missing invoice_id`);
      return new Response(
        JSON.stringify({ error: 'invoice_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] Fetching invoice:`, invoiceId);

    // Fetch invoice data
    const { data: invoice, error: invoiceError } = await supabase
      .from('app_2dff6511da_invoices')
      .select('*')
      .eq('id', invoiceId)
      .eq('user_id', user.id)
      .single();

    if (invoiceError || !invoice) {
      console.error(`[${requestId}] Invoice fetch error:`, invoiceError);
      return new Response(
        JSON.stringify({ error: 'Invoice not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] Invoice found:`, invoice);

    // Get user details
    const { data: userData } = await supabase.auth.admin.getUserById(user.id);
    const userEmail = userData?.user?.email || 'N/A';
    const userName = userData?.user?.user_metadata?.full_name || 'N/A';

    console.log(`[${requestId}] User details:`, { userEmail, userName });

    // Prepare invoice data
    const invoiceData: InvoiceData = {
      id: invoice.id,
      invoice_number: invoice.invoice_number,
      user_id: invoice.user_id,
      amount: invoice.amount,
      tax_amount: invoice.tax_amount,
      total_amount: invoice.total_amount,
      created_at: invoice.created_at,
      payment_id: invoice.payment_id,
      subscription_type: invoice.subscription_type,
      user_email: userEmail,
      user_name: userName,
    };

    // Generate PDF HTML
    const pdfHtml = generateInvoicePDF(invoiceData);

    console.log(`[${requestId}] PDF HTML generated, length:`, pdfHtml.length);

    // Return HTML for PDF generation (client-side will handle PDF conversion)
    return new Response(
      JSON.stringify({ 
        success: true, 
        html: pdfHtml,
        invoice: invoiceData 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error(`[${requestId}] Unexpected error:`, error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : String(error) 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateInvoicePDF(invoice: InvoiceData): string {
  const date = new Date(invoice.created_at).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fatura - ${invoice.invoice_number}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 40px;
      background: #f5f5f5;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 60px;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 50px;
      padding-bottom: 30px;
      border-bottom: 3px solid #2563eb;
    }
    .company-info h1 {
      color: #2563eb;
      font-size: 32px;
      margin-bottom: 10px;
    }
    .company-info p {
      color: #666;
      line-height: 1.6;
    }
    .invoice-info {
      text-align: right;
    }
    .invoice-info h2 {
      color: #333;
      font-size: 28px;
      margin-bottom: 10px;
    }
    .invoice-info p {
      color: #666;
      margin: 5px 0;
    }
    .customer-info {
      margin-bottom: 40px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .customer-info h3 {
      color: #333;
      margin-bottom: 15px;
      font-size: 18px;
    }
    .customer-info p {
      color: #666;
      margin: 8px 0;
    }
    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 40px;
    }
    .invoice-table th {
      background: #2563eb;
      color: white;
      padding: 15px;
      text-align: left;
      font-weight: 600;
    }
    .invoice-table td {
      padding: 15px;
      border-bottom: 1px solid #e5e7eb;
    }
    .invoice-table tr:last-child td {
      border-bottom: none;
    }
    .totals {
      margin-left: auto;
      width: 350px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .totals-row.total {
      border-top: 3px solid #2563eb;
      border-bottom: 3px solid #2563eb;
      font-weight: bold;
      font-size: 20px;
      color: #2563eb;
      margin-top: 10px;
      padding: 15px 0;
    }
    .footer {
      margin-top: 60px;
      padding-top: 30px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
    .footer p {
      margin: 5px 0;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .invoice-container {
        box-shadow: none;
        padding: 40px;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <div class="company-info">
        <h1>Kariyeer Platform</h1>
        <p>Profesyonel Koçluk Hizmetleri</p>
        <p>İstanbul, Türkiye</p>
        <p>info@kariyeer.com</p>
      </div>
      <div class="invoice-info">
        <h2>FATURA</h2>
        <p><strong>Fatura No:</strong> ${invoice.invoice_number}</p>
        <p><strong>Tarih:</strong> ${date}</p>
        <p><strong>Ödeme ID:</strong> ${invoice.payment_id}</p>
      </div>
    </div>

    <div class="customer-info">
      <h3>Müşteri Bilgileri</h3>
      <p><strong>Ad Soyad:</strong> ${invoice.user_name}</p>
      <p><strong>E-posta:</strong> ${invoice.user_email}</p>
      <p><strong>Müşteri ID:</strong> ${invoice.user_id.substring(0, 8)}...</p>
    </div>

    <table class="invoice-table">
      <thead>
        <tr>
          <th>Hizmet Açıklaması</th>
          <th style="text-align: right;">Tutar</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${invoice.subscription_type === 'premium' ? 'Premium Üyelik' : 
                      invoice.subscription_type === 'gold' ? 'Gold Üyelik' : 
                      invoice.subscription_type === 'silver' ? 'Silver Üyelik' : 
                      'Standart Üyelik'}</strong>
            <br>
            <small style="color: #666;">Aylık abonelik paketi</small>
          </td>
          <td style="text-align: right;">${invoice.amount.toFixed(2)} TL</td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Ara Toplam:</span>
        <span>${invoice.amount.toFixed(2)} TL</span>
      </div>
      <div class="totals-row">
        <span>KDV (%20):</span>
        <span>${invoice.tax_amount.toFixed(2)} TL</span>
      </div>
      <div class="totals-row total">
        <span>TOPLAM:</span>
        <span>${invoice.total_amount.toFixed(2)} TL</span>
      </div>
    </div>

    <div class="footer">
      <p><strong>Ödeme Durumu:</strong> Ödendi ✓</p>
      <p>Bu fatura elektronik olarak oluşturulmuştur ve geçerlidir.</p>
      <p>Sorularınız için: destek@kariyeer.com</p>
      <p style="margin-top: 20px; font-size: 12px;">© 2025 Kariyeer Platform. Tüm hakları saklıdır.</p>
    </div>
  </div>
</body>
</html>
  `;
}