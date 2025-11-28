import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
};

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] 🚀 Get My Invoices - Request received`);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // Get auth token from header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error(`[${requestId}] ❌ No authorization header`);
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with user token
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error(`[${requestId}] ❌ Invalid token:`, userError);
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] 👤 User authenticated:`, user.id);

    // Create service role client to bypass RLS
    const supabaseServiceRole = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    console.log(`[${requestId}] 🔍 Fetching invoices for user:`, user.id);

    // Fetch invoices using service role (bypasses RLS)
    const { data: invoices, error: invoicesError } = await supabaseServiceRole
      .from('app_2dff6511da_invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('invoice_date', { ascending: false });

    if (invoicesError) {
      console.error(`[${requestId}] ❌ Error fetching invoices:`, invoicesError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch invoices', details: invoicesError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] ✅ Invoices fetched successfully:`, invoices?.length || 0);
    console.log(`[${requestId}] 📋 Invoice data:`, JSON.stringify(invoices, null, 2));

    return new Response(
      JSON.stringify({ invoices: invoices || [] }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`[${requestId}] 💥 Exception:`, error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});