DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'users'::regclass AND conname = 'uni_users_email'
    ) THEN
        ALTER TABLE users RENAME CONSTRAINT uni_users_email TO users_email_key;
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'categories'::regclass AND conname = 'uni_categories_name'
    ) THEN
        ALTER TABLE categories RENAME CONSTRAINT uni_categories_name TO categories_name_key;
    END IF;
END $$;