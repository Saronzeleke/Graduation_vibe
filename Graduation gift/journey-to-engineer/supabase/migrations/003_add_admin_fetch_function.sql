-- Migration: Add admin function to fetch pending messages
-- This function allows admins to fetch pending messages with proper authorization

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
