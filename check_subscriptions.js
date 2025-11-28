import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wzadnstzslxvuwmmjmwn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6YWRuc3R6c2x4dnV3bW1qbXduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NTQzODAsImV4cCI6MjA3OTQzMDM4MH0.YfzfHbgObuv2nqKO8aFIiUlXx60vtsf_95zsg7PdRRg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log('=== Checking Supabase Auth Users ===');
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
  
  if (usersError) {
    console.error('Error fetching users:', usersError);
  } else {
    console.log('Total users:', users?.length);
    const samUser = users?.find(u => u.email === 'sam123@gmail.com');
    if (samUser) {
      console.log('Sam user found:', {
        id: samUser.id,
        email: samUser.email,
        created_at: samUser.created_at
      });
      
      console.log('\n=== Checking Subscriptions for Sam ===');
      const { data: subs, error: subsError } = await supabase
        .from('app_2dff6511da_subscriptions')
        .select('*')
        .eq('user_id', samUser.id);
      
      if (subsError) {
        console.error('Error fetching subscriptions:', subsError);
      } else {
        console.log('Total subscriptions:', subs?.length);
        console.log('Subscriptions:', JSON.stringify(subs, null, 2));
      }
      
      console.log('\n=== Checking Active Subscriptions ===');
      const { data: activeSubs, error: activeError } = await supabase
        .from('app_2dff6511da_subscriptions')
        .select('*')
        .eq('user_id', samUser.id)
        .eq('status', 'active');
      
      if (activeError) {
        console.error('Error fetching active subscriptions:', activeError);
      } else {
        console.log('Active subscriptions:', activeSubs?.length);
        console.log('Active subs data:', JSON.stringify(activeSubs, null, 2));
      }
    } else {
      console.log('Sam user NOT found!');
    }
  }
}

checkData().catch(console.error);
