-- Remove ALL existing policies on messages
DROP POLICY IF EXISTS "Public read approved messages" ON messages;
DROP POLICY IF EXISTS "Admin can update messages" ON messages;
DROP POLICY IF EXISTS "Admin can delete messages" ON messages;
DROP POLICY IF EXISTS "Admin can read all messages" ON messages;
DROP POLICY IF EXISTS "Public can submit messages" ON messages;

-- Recreate policies correctly

-- 1. Anyone can INSERT (submit messages)
CREATE POLICY "Public can submit messages" ON messages
    FOR INSERT
    WITH CHECK (true);

-- 2. Public can only read approved messages
CREATE POLICY "Public read approved messages" ON messages
    FOR SELECT
    USING (approved = true);

-- 3. Admins can read ALL messages (including pending)
CREATE POLICY "Admin can read all messages" ON messages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND role = 'ADMIN'
        )
    );

-- 4. Admins can update messages (approve)
CREATE POLICY "Admin can update messages" ON messages
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND role = 'ADMIN'
        )
    );

-- 5. Admins can delete messages
CREATE POLICY "Admin can delete messages" ON messages
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND role = 'ADMIN'
        )
    );

-- Verify all policies
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'messages'
ORDER BY cmd;
