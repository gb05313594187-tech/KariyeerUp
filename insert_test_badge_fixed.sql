-- Insert test subscription (Blue Badge)
INSERT INTO app_2dff6511da_subscriptions (
    user_id,
    badge_type,
    status,
    start_date,
    end_date,
    price,
    currency,
    auto_renew
) VALUES (
    'ba080031-5af1-4d71-b147-d5ffa325c9fb',
    'blue',
    'active',
    NOW(),
    NOW() + INTERVAL '1 year',
    99,
    'TRY',
    false
)
RETURNING *;

-- Insert test payment record (FIXED: using credit_card instead of test)
INSERT INTO app_2dff6511da_payments (
    user_id,
    subscription_id,
    amount,
    currency,
    payment_method,
    payment_status,
    payment_date,
    transaction_id
) VALUES (
    'ba080031-5af1-4d71-b147-d5ffa325c9fb',
    (SELECT id FROM app_2dff6511da_subscriptions WHERE user_id = 'ba080031-5af1-4d71-b147-d5ffa325c9fb' ORDER BY created_at DESC LIMIT 1),
    99,
    'TRY',
    'credit_card',
    'completed',
    NOW(),
    'TEST-' || EXTRACT(EPOCH FROM NOW())::TEXT
)
RETURNING *;

-- Insert test invoice
INSERT INTO app_2dff6511da_invoices (
    user_id,
    payment_id,
    invoice_number,
    invoice_date,
    amount,
    currency,
    tax_amount,
    total_amount,
    status,
    invoice_sent
) VALUES (
    'ba080031-5af1-4d71-b147-d5ffa325c9fb',
    (SELECT id FROM app_2dff6511da_payments WHERE user_id = 'ba080031-5af1-4d71-b147-d5ffa325c9fb' ORDER BY created_at DESC LIMIT 1),
    'INV-TEST-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
    NOW(),
    99,
    'TRY',
    17.82,
    116.82,
    'paid',
    true
)
RETURNING *;
