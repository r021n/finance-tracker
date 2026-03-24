INSERT INTO users (name, email, password, role, created_at, updated_at)
VALUES (
    'Admin',
    'admin@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'admin',
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;