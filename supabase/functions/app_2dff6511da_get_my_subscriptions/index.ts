import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
};

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] 📨 Incoming request: ${req.method} ${req.url}`);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    console.log(`[${requestId}] 🔧 Initializing Supabase client`);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error(`[${requestId}] ❌ No authorization header`);
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    console.log(`[${requestId}] 🔑 Verifying JWT token`);
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error(`[${requestId}] ❌ Invalid token:`, userError);
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] ✅ User authenticated:`, user.id);

    // Fetch all active subscriptions for this user using service role
    console.log(`[${requestId}] 🔍 Fetching active subscriptions for user:`, user.id);
    
    const { data: subscriptions, error: subError } = await supabase
      .from('app_2dff6511da_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (subError) {
      console.error(`[${requestId}] ❌ Error fetching subscriptions:`, subError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch subscriptions', details: subError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] ✅ Found ${subscriptions?.length || 0} active subscriptions`);
    console.log(`[${requestId}] 📊 Subscriptions:`, JSON.stringify(subscriptions, null, 2));

    return new Response(
      JSON.stringify({ 
        success: true, 
        subscriptions: subscriptions || [],
        count: subscriptions?.length || 0
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error(`[${requestId}] 💥 Exception:`, error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        requestId 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});