-- Migration: Add rate limiting for message submissions
-- Tracks submissions by IP to prevent spam/abuse

-- Create rate_limits table
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_hash TEXT NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Index for fast lookups
CREATE INDEX idx_rate_limits_ip_action ON rate_limits(ip_hash, action);
CREATE INDEX idx_rate_limits_expires ON rate_limits(expires_at);

-- Enable RLS
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- No public access to rate_limits table
-- Only backend functions can interact with it

-- Create function to check rate limit
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_ip_hash TEXT,
    p_action VARCHAR(50),
    p_max_requests INTEGER,
    p_window_minutes INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    request_count INTEGER;
    window_start TIMESTAMP WITH TIME ZONE;
BEGIN
    window_start := NOW() - (p_window_minutes || ' minutes')::INTERVAL;
    
    -- Clean up expired entries
    DELETE FROM rate_limits WHERE expires_at < NOW();
    
    -- Count recent requests from this IP for this action
    SELECT COUNT(*) INTO request_count
    FROM rate_limits
    WHERE ip_hash = p_ip_hash
      AND action = p_action
      AND created_at > window_start;
    
    -- Return TRUE if under limit, FALSE if over limit
    RETURN request_count < p_max_requests;
END;
$$;

-- Create function to record rate limit entry
CREATE OR REPLACE FUNCTION public.record_rate_limit(
    p_ip_hash TEXT,
    p_action VARCHAR(50),
    p_window_minutes INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO rate_limits (ip_hash, action, expires_at)
    VALUES (
        p_ip_hash,
        p_action,
        NOW() + (p_window_minutes || ' minutes')::INTERVAL
    );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.check_rate_limit TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_rate_limit TO anon, authenticated;

-- Create automatic cleanup job (runs every hour to clean old entries)
-- Note: This requires pg_cron extension which may not be available on all Supabase plans
-- If not available, cleanup happens on each rate limit check anyway
-- Uncomment if pg_cron is available:
-- SELECT cron.schedule(
--     'cleanup-rate-limits',
--     '0 * * * *', -- Every hour
--     $$DELETE FROM rate_limits WHERE expires_at < NOW()$$
-- );
