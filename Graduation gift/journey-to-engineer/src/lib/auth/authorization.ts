import { createClient } from '@/lib/supabase/server'

export type UserRole = 'ADMIN' | 'USER'

export interface UserWithRole {
  id: string
  email: string
  role: UserRole
}

/**
 * Check if the current authenticated user has admin role
 * @returns Promise<boolean> - true if user is admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return false
  }
  
  // Check user role from database
  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()
  
  if (roleError || !roleData) {
    return false
  }
  
  return roleData.role === 'ADMIN'
}

/**
 * Get current user with their role
 * @returns Promise<UserWithRole | null>
 */
export async function getCurrentUserWithRole(): Promise<UserWithRole | null> {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return null
  }
  
  // Get user role
  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()
  
  // Default to USER role if no role exists
  const role: UserRole = roleData?.role || 'USER'
  
  return {
    id: user.id,
    email: user.email || '',
    role
  }
}

/**
 * Require admin role - throws error if not admin
 * Use this in server actions that require admin access
 */
export async function requireAdmin(): Promise<UserWithRole> {
  const user = await getCurrentUserWithRole()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  if (user.role !== 'ADMIN') {
    throw new Error('Admin access required')
  }
  
  return user
}

/**
 * Require authentication - throws error if not authenticated
 * Use this in server actions that require any authenticated user
 */
export async function requireAuth(): Promise<UserWithRole> {
  const user = await getCurrentUserWithRole()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
}
