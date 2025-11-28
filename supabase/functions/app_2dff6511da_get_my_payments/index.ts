import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
};

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] 🚀 Get My Payments - Request received`);

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

    console.log(`[${requestId}] 🔍 Fetching payments for user:`, user.id);

    // Fetch payments using service role (bypasses RLS)
    const { data: payments, error: paymentsError } = await supabaseServiceRole
      .from('app_2dff6511da_payments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (paymentsError) {
      console.error(`[${requestId}] ❌ Error fetching payments:`, paymentsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch payments', details: paymentsError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] ✅ Payments fetched successfully:`, payments?.length || 0);
    console.log(`[${requestId}] 📋 Payment data:`, JSON.stringify(payments, null, 2));

    return new Response(
      JSON.stringify({ payments: payments || [] }),
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