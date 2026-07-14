/**
 * Rate Limiting Utilities
 * Simple IP-based rate limiting using database storage
 */

import { createClient } from '@/lib/supabase/server'
import { createHash } from 'crypto'
import { headers } from 'next/headers'

/**
 * Rate limit configuration
 */
export const RATE_LIMITS = {
  MESSAGE_SUBMISSION: {
    SHORT_WINDOW: {
      requests: 1,
      windowMinutes: 5,
      action: 'message_submit_short'
    },
    LONG_WINDOW: {
      requests: 5,
      windowMinutes: 60,
      action: 'message_submit_long'
    }
  }
} as const

/**
 * Get client IP address from headers
 * Supports various proxy headers
 */
export async function getClientIP(): Promise<string> {
  const headersList = await headers()
  
  // Check common proxy headers
  const forwardedFor = headersList.get('x-forwarded-for')
  const realIP = headersList.get('x-real-ip')
  const cfConnectingIP = headersList.get('cf-connecting-ip')
  
  // Use the first available IP
  const ip = cfConnectingIP || realIP || forwardedFor?.split(',')[0] || '127.0.0.1'
  
  return ip.trim()
}

/**
 * Hash IP address for privacy
 * We don't store raw IPs, only hashes
 */
export function hashIP(ip: string): string {
  return createHash('sha256').update(ip).digest('hex')
}

/**
 * Check if request is rate limited
 * Returns { allowed: boolean, error?: string }
 */
export async function checkRateLimit(action: {
  requests: number
  windowMinutes: number
  action: string
}): Promise<{ allowed: boolean; error?: string; retryAfter?: number }> {
  try {
    const supabase = await createClient()
    const ip = await getClientIP()
    const ipHash = hashIP(ip)
    
    // Call database function to check rate limit
    const { data: isAllowed, error } = await supabase.rpc('check_rate_limit', {
      p_ip_hash: ipHash,
      p_action: action.action,
      p_max_requests: action.requests,
      p_window_minutes: action.windowMinutes
    })
    
    if (error) {
      console.error('[Rate Limit] Error checking rate limit:', error)
      // Fail open - allow request if rate limit check fails
      return { allowed: true }
    }
    
    if (!isAllowed) {
      return {
        allowed: false,
        error: `Rate limit exceeded. Please wait ${action.windowMinutes} minutes before trying again.`,
        retryAfter: action.windowMinutes * 60 // seconds
      }
    }
    
    return { allowed: true }
  } catch (error) {
    console.error('[Rate Limit] Unexpected error:', error)
    // Fail open - allow request on error
    return { allowed: true }
  }
}

/**
 * Record a rate limit entry after successful request
 */
export async function recordRateLimit(action: {
  requests: number
  windowMinutes: number
  action: string
}): Promise<void> {
  try {
    const supabase = await createClient()
    const ip = await getClientIP()
    const ipHash = hashIP(ip)
    
    // Call database function to record rate limit
    const { error } = await supabase.rpc('record_rate_limit', {
      p_ip_hash: ipHash,
      p_action: action.action,
      p_window_minutes: action.windowMinutes
    })
    
    if (error) {
      console.error('[Rate Limit] Error recording rate limit:', error)
      // Non-critical error, don't throw
    }
  } catch (error) {
    console.error('[Rate Limit] Unexpected error recording:', error)
    // Non-critical error, don't throw
  }
}

/**
 * Check all rate limits for message submission
 * Checks both short window (1 per 5 min) and long window (5 per hour)
 */
export async function checkMessageSubmissionRateLimit(): Promise<{
  allowed: boolean
  error?: string
  retryAfter?: number
}> {
  // Check short window first (1 per 5 minutes)
  const shortCheck = await checkRateLimit(RATE_LIMITS.MESSAGE_SUBMISSION.SHORT_WINDOW)
  if (!shortCheck.allowed) {
    return shortCheck
  }
  
  // Then check long window (5 per hour)
  const longCheck = await checkRateLimit(RATE_LIMITS.MESSAGE_SUBMISSION.LONG_WINDOW)
  if (!longCheck.allowed) {
    return longCheck
  }
  
  return { allowed: true }
}

/**
 * Record message submission rate limit entries
 */
export async function recordMessageSubmission(): Promise<void> {
  // Record both windows
  await Promise.all([
    recordRateLimit(RATE_LIMITS.MESSAGE_SUBMISSION.SHORT_WINDOW),
    recordRateLimit(RATE_LIMITS.MESSAGE_SUBMISSION.LONG_WINDOW)
  ])
}
