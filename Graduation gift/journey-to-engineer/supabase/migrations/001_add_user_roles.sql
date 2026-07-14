-- Create user_roles table to track admin users
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_role CHECK (role IN ('ADMIN', 'USER'))
);

-- Create index for fast role lookups
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Users can read their own role
CREATE POLICY "Users can read own role" ON user_roles
    FOR SELECT
    USING (auth.uid() = user_id);

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = $1
        AND role = 'ADMIN'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Messages: Only admins can update approval status
DROP POLICY IF EXISTS "Admin can update messages" ON messages;
CREATE POLICY "Admin can update messages" ON messages
    FOR UPDATE
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

-- Messages: Only admins can delete
DROP POLICY IF EXISTS "Admin can delete messages" ON messages;
CREATE POLICY "Admin can delete messages" ON messages
    FOR DELETE
    USING (is_admin(auth.uid()));

-- Messages: Admins can read all messages (including pending)
DROP POLICY IF EXISTS "Admin can read all messages" ON messages;
CREATE POLICY "Admin can read all messages" ON messages
    FOR SELECT
    USING (is_admin(auth.uid()) OR approved = true);

-- Timeline: Only admins can modify
CREATE POLICY "Admin can manage timeline" ON timeline_events
    FOR ALL
    USING (is_admin(auth.uid()));

-- Gallery: Only admins can modify
CREATE POLICY "Admin can manage gallery" ON gallery_images
    FOR ALL
    USING (is_admin(auth.uid()));

-- Bible verses: Only admins can modify
CREATE POLICY "Admin can manage verses" ON bible_verses
    FOR ALL
    USING (is_admin(auth.uid()));

-- Graduates: Only admins can modify
CREATE POLICY "Admin can manage graduates" ON graduates
    FOR ALL
    USING (is_admin(auth.uid()));
