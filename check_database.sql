-- Check if user has any subscriptions (active or not)
SELECT 
    id,
    user_id,
    badge_type,
    status,
    start_date,
    end_date,
    created_at
FROM app_2dff6511da_subscriptions
WHERE user_id = 'ba080031-5af1-4d71-b147-d5ffa325c9fb'
ORDER BY created_at DESC;

-- Check if user has any payments
SELECT 
    id,
    user_id,
    amount,
    payment_status,
    payment_date,
    transaction_id,
    created_at
FROM app_2dff6511da_payments
WHERE user_id = 'ba080031-5af1-4d71-b147-d5ffa325c9fb'
ORDER BY created_at DESC;

-- Check payment transactions
SELECT 
    iyzico_payment_id,
    status,
    amount,
    created_at
FROM app_2dff6511da_payment_transactions
WHERE user_id = 'ba080031-5af1-4d71-b147-d5ffa325c9fb'
ORDER BY created_at DESC;
