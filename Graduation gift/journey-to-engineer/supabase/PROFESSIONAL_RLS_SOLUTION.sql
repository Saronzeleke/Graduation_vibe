-- PROFESSIONAL SOLUTION: Database Function with SECURITY DEFINER
-- This bypasses RLS for public message submission while keeping admin operations secure

-- Step 1: Re-enable RLS (we turned it off for testing)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Step 2: Create a secure function that bypasses RLS for inserts
CREATE OR REPLACE FUNCTION public.submit_public_message(
    p_graduate_id UUID,
    p_name TEXT,
    p_relationship TEXT,
    p_message TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER  -- This makes the function run with creator's privileges, bypassing RLS
SET search_path = public
AS $$
DECLARE
    new_message_id UUID;
BEGIN
    -- Validation
    IF p_name IS NULL OR LENGTH(TRIM(p_name)) < 2 THEN
        RAISE EXCEPTION 'Name must be at least 2 characters';
    END IF;
    
    IF p_message IS NULL OR LENGTH(TRIM(p_message)) < 10 THEN
        RAISE EXCEPTION 'Message must be at least 10 characters';
    END IF;
    
    -- Insert message (bypasses RLS because of SECURITY DEFINER)
    INSERT INTO messages (graduate_id, name, relationship, message, approved)
    VALUES (p_graduate_id, TRIM(p_name), TRIM(p_relationship), TRIM(p_message), false)
    RETURNING id INTO new_message_id;
    
    RETURN new_message_id;
END;
$$;

-- Step 3: Grant execute permission to anon role
GRANT EXECUTE ON FUNCTION public.submit_public_message TO anon, public;

-- Step 4: Keep RLS policies for admin operations (SELECT, UPDATE, DELETE)
DROP POLICY IF EXISTS "allow_public_select_approved" ON messages;
CREATE POLICY "allow_public_select_approved" ON messages
    FOR SELECT
    USING (approved = true);

DROP POLICY IF EXISTS "allow_admin_select_all" ON messages;
CREATE POLICY "allow_admin_select_all" ON messages
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'ADMIN'
        )
    );

DROP POLICY IF EXISTS "allow_admin_update" ON messages;
CREATE POLICY "allow_admin_update" ON messages
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'ADMIN'
        )
    );

DROP POLICY IF EXISTS "allow_admin_delete" ON messages;
CREATE POLICY "allow_admin_delete" ON messages
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'ADMIN'
        )
    );

-- Step 5: Remove any INSERT policies (we use the function instead)
DROP POLICY IF EXISTS "allow_public_insert" ON messages;
DROP POLICY IF EXISTS "Public can submit messages" ON messages;

-- Step 6: Test the function
SELECT public.submit_public_message(
    (SELECT id FROM graduates LIMIT 1),
    'Test via function',
    'Friend',
    'This message was submitted through the secure function!'
) as new_message_id;

-- Step 7: Verify it was inserted
SELECT id, name, message, approved FROM messages 
WHERE name = 'Test via function';

-- Step 8: Create admin function to fetch pending messages
CREATE OR REPLACE FUNCTION public.get_pending_messages_admin()
RETURNS TABLE (
    id UUID,
    graduate_id UUID,
    name VARCHAR(255),
    relationship VARCHAR(100),
    message TEXT,
    approved BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER  -- Run with creator's privileges
SET search_path = public
AS $$
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'ADMIN'
    ) THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;
    
    -- Return pending messages
    RETURN QUERY
    SELECT 
        m.id,
        m.graduate_id,
        m.name,
        m.relationship,
        m.message,
        m.approved,
        m.created_at
    FROM messages m
    WHERE m.approved = false
    ORDER BY m.created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users (function checks admin role internally)
GRANT EXECUTE ON FUNCTION public.get_pending_messages_admin TO authenticated;
