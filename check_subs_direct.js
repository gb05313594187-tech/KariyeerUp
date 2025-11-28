import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wzadnstzslxvuwmmjmwn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6YWRuc3R6c2x4dnV3bW1qbXduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NTQzODAsImV4cCI6MjA3OTQzMDM4MH0.YfzfHbgObuv2nqKO8aFIiUlXx60vtsf_95zsg7PdRRg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log('=== Checking ALL Subscriptions ===');
  const { data: allSubs, error: allError } = await supabase
    .from('app_2dff6511da_subscriptions')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (allError) {
    console.error('Error fetching all subscriptions:', allError);
  } else {
    console.log('Total subscriptions in DB:', allSubs?.length);
    console.log('All subscriptions:', JSON.stringify(allSubs, null, 2));
  }
  
  console.log('\n=== Checking ALL Payments ===');
  const { data: allPayments, error: payError } = await supabase
    .from('app_2dff6511da_payments')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (payError) {
    console.error('Error fetching payments:', payError);
  } else {
    console.log('Total payments in DB:', allPayments?.length);
    console.log('All payments:', JSON.stringify(allPayments, null, 2));
  }
  
  console.log('\n=== Checking RLS Policies ===');
  const { data: policies, error: polError } = await supabase
    .rpc('get_policies', { table_name: 'app_2dff6511da_subscriptions' })
    .select('*');
  
  if (polError) {
    console.log('Cannot check policies (expected):', polError.message);
  }
}

checkData().catch(console.error);
