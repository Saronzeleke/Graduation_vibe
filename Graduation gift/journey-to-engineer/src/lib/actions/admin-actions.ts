'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/authorization'
import type { Message } from '@/types'

/**
 * Server action to fetch pending messages
 * Requires ADMIN role
 */
export async function getPendingMessagesAction(): Promise<{ success: boolean; data?: Message[]; error?: string }> {
  try {
    // Verify user is admin
    await requireAdmin()
    
    const supabase = await createClient()
    
    // Call the database function that checks admin permissions
    const { data, error } = await supabase.rpc('get_pending_messages_admin')
    
    if (error) {
      console.error('Error fetching pending messages:', error)
      return { 
        success: false, 
        error: 'Failed to fetch pending messages' 
      }
    }
    
    return { 
      success: true, 
      data: data || [] 
    }
  } catch (error) {
    console.error('Authorization error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unauthorized access' 
    }
  }
}

/**
 * Server action to approve a pending message
 * Requires ADMIN role
 */
export async function approveMessageAction(messageId: string) {
  try {
    // Verify user is admin
    await requireAdmin()
    
    const supabase = await createClient()
    
    // Update message to approved
    const { error: updateError } = await supabase
      .from('messages')
      .update({ approved: true })
      .eq('id', messageId)
    
    if (updateError) {
      console.error('Error approving message:', updateError)
      return { 
        success: false, 
        error: 'Failed to approve message' 
      }
    }
    
    // Revalidate pages that display messages
    revalidatePath('/messages')
    revalidatePath('/admin')
    
    return { success: true }
  } catch (error) {
    console.error('Authorization error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unauthorized access' 
    }
  }
}

/**
 * Server action to delete a message
 * Requires ADMIN role
 */
export async function deleteMessageAction(messageId: string) {
  try {
    // Verify user is admin
    await requireAdmin()
    
    const supabase = await createClient()
    
    // Delete message
    const { error: deleteError } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId)
    
    if (deleteError) {
      console.error('Error deleting message:', deleteError)
      return { 
        success: false, 
        error: 'Failed to delete message' 
      }
    }
    
    // Revalidate admin page
    revalidatePath('/admin')
    
    return { success: true }
  } catch (error) {
    console.error('Authorization error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unauthorized access' 
    }
  }
}
