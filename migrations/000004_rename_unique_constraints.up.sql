DO $$
DECLARE
    users_email_unique_name text;
    categories_name_unique_name text;
BEGIN
    -- Cari aturan unik untuk kolom users.email
    SELECT c.conname INTO users_email_unique_name
    FROM pg_constraint c
    JOIN pg_attribute a
      ON a.attrelid = c.conrelid AND a.attnum = ANY (c.conkey)
    WHERE c.conrelid = 'users'::regclass
      AND c.contype = 'u'
      AND a.attname = 'email'
    LIMIT 1;

    IF users_email_unique_name IS NOT NULL AND users_email_unique_name <> 'uni_users_email' THEN
        EXECUTE format('ALTER TABLE users RENAME CONSTRAINT %I TO uni_users_email', users_email_unique_name);
    END IF;

    -- Cari aturan unik untuk kolom categories.name
    SELECT c.conname INTO categories_name_unique_name
    FROM pg_constraint c
    JOIN pg_attribute a
      ON a.attrelid = c.conrelid AND a.attnum = ANY (c.conkey)
    WHERE c.conrelid = 'categories'::regclass
      AND c.contype = 'u'
      AND a.attname = 'name'
    LIMIT 1;

    IF categories_name_unique_name IS NOT NULL AND categories_name_unique_name <> 'uni_categories_name' THEN
        EXECUTE format('ALTER TABLE categories RENAME CONSTRAINT %I TO uni_categories_name', categories_name_unique_name);
    END IF;
END $$;