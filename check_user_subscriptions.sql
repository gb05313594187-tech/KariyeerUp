-- Check user's email and ID
SELECT id, email, raw_user_meta_data->>'full_name' as full_name
FROM auth.users
WHERE email LIKE '%samar%' OR email LIKE '%salem%'
LIMIT 5;

-- Check all subscriptions for this user
SELECT 
    s.id,
    s.user_id,
    s.badge_type,
    s.status,
    s.start_date,
    s.end_date,
    s.price,
    s.currency,
    s.created_at,
    s.updated_at
FROM app_2dff6511da_subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE u.email LIKE '%samar%' OR u.email LIKE '%salem%'
ORDER BY s.created_at DESC;

-- Check payments
SELECT 
    p.id,
    p.user_id,
    p.amount,
    p.currency,
    p.payment_status,
    p.payment_date,
    p.transaction_id,
    p.created_at
FROM app_2dff6511da_payments p
JOIN auth.users u ON p.user_id = u.id
WHERE u.email LIKE '%samar%' OR u.email LIKE '%salem%'
ORDER BY p.created_at DESC;

-- Check RLS policies on subscriptions table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'app_2dff6511da_subscriptions';
