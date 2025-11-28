import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Session } from '@supabase/supabase-js';

interface Subscription {
  id: string;
  user_id: string;
  badge_type: string;
  status: string;
  price: string;
  currency: string;
  end_date: string;
}

export default function DebugAuth() {
  const { user, supabaseUser, isAuthenticated } = useAuth();
  const [sessionInfo, setSessionInfo] = useState<Session | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [error, setError] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const checkAuth = async () => {
    setLogs([]);
    setError('');
    
    try {
      // Check environment variables
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      addLog(`Supabase URL: ${supabaseUrl || '❌ MISSING'}`);
      addLog(`Supabase Key: ${supabaseKey ? '✅ Present' : '❌ MISSING'}`);

      if (!supabaseUrl || !supabaseKey) {
        setError('Environment variables are missing! Check .env file.');
        return;
      }

      // Get current session
      addLog('Fetching session...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        addLog(`❌ Session Error: ${sessionError.message}`);
        setError(`Session Error: ${sessionError.message}`);
        return;
      }

      if (!session) {
        addLog('❌ No session found');
        setError('No active session');
        return;
      }

      addLog(`✅ Session found for user: ${session.user.id}`);
      setSessionInfo(session);

      // Try direct query first
      addLog('Attempting direct query to subscriptions table...');
      const { data: directData, error: directError } = await supabase
        .from('app_2dff6511da_subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'active');

      if (directError) {
        addLog(`❌ Direct query failed: ${directError.message}`);
        addLog(`Error code: ${directError.code}`);
        addLog(`Error details: ${JSON.stringify(directError.details)}`);
        
        // Try edge function as fallback
        addLog('Trying edge function fallback...');
        try {
          const response = await fetch(
            `${supabaseUrl}/functions/v1/app_2dff6511da_get_my_subscriptions`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          addLog(`Edge function response status: ${response.status}`);
          
          if (!response.ok) {
            const errorText = await response.text();
            addLog(`❌ Edge function failed: ${errorText}`);
            setError(`Edge function error: ${errorText}`);
          } else {
            const result = await response.json();
            addLog(`✅ Edge function success: ${result.subscriptions?.length || 0} subscriptions`);
            setSubscriptions(result.subscriptions || []);
          }
        } catch (edgeError) {
          addLog(`❌ Edge function exception: ${edgeError instanceof Error ? edgeError.message : 'Unknown'}`);
          setError(`Edge function exception: ${edgeError instanceof Error ? edgeError.message : 'Unknown'}`);
        }
      } else {
        addLog(`✅ Direct query success: ${directData?.length || 0} subscriptions`);
        setSubscriptions(directData || []);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      addLog(`❌ Exception: ${errorMessage}`);
      setError(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">🔍 Auth Debug Bilgileri</h1>

        {/* Environment Variables */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 font-mono text-sm">
            <p><strong>VITE_SUPABASE_URL:</strong> {import.meta.env.VITE_SUPABASE_URL || '❌ MISSING'}</p>
            <p><strong>VITE_SUPABASE_ANON_KEY:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Present' : '❌ MISSING'}</p>
          </div>
        </div>

        {/* Auth Context */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Auth Context</h2>
          <div className="space-y-2 font-mono text-sm">
            <p><strong>isAuthenticated:</strong> {isAuthenticated ? '✅ true' : '❌ false'}</p>
            <p><strong>user?.id:</strong> {user?.id || '❌ null'}</p>
            <p><strong>user?.email:</strong> {user?.email || '❌ null'}</p>
            <p><strong>supabaseUser?.id:</strong> {supabaseUser?.id || '❌ null'}</p>
          </div>
        </div>

        {/* Session Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Supabase Session</h2>
          {sessionInfo ? (
            <div className="space-y-2 font-mono text-sm">
              <p><strong>User ID:</strong> {sessionInfo.user?.id || '❌ null'}</p>
              <p><strong>Email:</strong> {sessionInfo.user?.email || '❌ null'}</p>
              <p><strong>Access Token:</strong> {sessionInfo.access_token ? '✅ Mevcut' : '❌ Yok'}</p>
              <p><strong>Expires At:</strong> {sessionInfo.expires_at ? new Date(sessionInfo.expires_at * 1000).toLocaleString('tr-TR') : '❌ null'}</p>
            </div>
          ) : (
            <p className="text-red-600">❌ Session bulunamadı!</p>
          )}
        </div>

        {/* Subscriptions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Abonelikler</h2>
          {subscriptions.length > 0 ? (
            <div className="space-y-4">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="border p-4 rounded bg-green-50">
                  <p><strong>Badge Type:</strong> {sub.badge_type}</p>
                  <p><strong>Status:</strong> {sub.status}</p>
                  <p><strong>Price:</strong> {sub.price} {sub.currency}</p>
                  <p><strong>End Date:</strong> {new Date(sub.end_date).toLocaleDateString('tr-TR')}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-600">❌ Abonelik bulunamadı!</p>
          )}
        </div>

        {/* Logs */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs space-y-1 max-h-96 overflow-y-auto">
            {logs.length > 0 ? (
              logs.map((log, idx) => <p key={idx}>{log}</p>)
            ) : (
              <p className="text-gray-500">No logs yet. Click "🔄 Yeniden Kontrol Et" to start.</p>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Hata</h2>
            <p className="text-red-600 font-mono text-sm">{error}</p>
          </div>
        )}

        {/* LocalStorage */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">LocalStorage Keys</h2>
          <div className="font-mono text-sm space-y-1">
            {Object.keys(localStorage).map((key) => (
              <p key={key}>• {key}</p>
            ))}
          </div>
        </div>

        <button
          onClick={checkAuth}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
        >
          🔄 Yeniden Kontrol Et
        </button>
      </div>
    </div>
  );
}