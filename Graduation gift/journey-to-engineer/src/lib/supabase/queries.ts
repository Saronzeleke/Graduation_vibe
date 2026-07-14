import { supabase } from './client'
import type { Graduate, TimelineEvent, GalleryImage, Message, BibleVerse, MessageSubmission } from '@/types';

// Graduate queries
export async function getGraduate(): Promise<Graduate | null> {
  const { data, error } = await supabase
    .from('graduates')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching graduate:', error);
    return null;
  }

  return data;
}

// Timeline queries
export async function getTimelineEvents(): Promise<TimelineEvent[]> {
  const { data, error } = await supabase
    .from('timeline_events')
    .select('*')
    .order('event_date', { ascending: true });

  if (error) {
    console.error('Error fetching timeline events:', error);
    return [];
  }

  return data || [];
}

// Gallery queries
export async function getGalleryImages(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }

  return data || [];
}

// Message queries
export async function getApprovedMessages(): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return data || [];
}

export async function submitMessage(submission: MessageSubmission): Promise<{ success: boolean; error?: string }> {
  console.log('[submitMessage] Starting submission:', { name: submission.name })
  
  // Get the graduate ID
  const graduate = await getGraduate();
  
  if (!graduate) {
    console.error('[submitMessage] No graduate found!')
    return { success: false, error: 'Graduate not found' };
  }

  console.log('[submitMessage] Found graduate:', graduate.id)

  // Call the database function that bypasses RLS
  const { data, error } = await supabase.rpc('submit_public_message', {
    p_graduate_id: graduate.id,
    p_name: submission.name,
    p_relationship: submission.relationship,
    p_message: submission.message,
  })

  if (error) {
    console.error('[submitMessage] Error submitting message:', error);
    
    // Check for validation errors from the function
    if (error.message.includes('must be at least')) {
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    return { success: false, error: 'Failed to submit message' };
  }

  console.log('[submitMessage] Message inserted successfully, ID:', data)
  return { success: true };
}

// Bible verse queries
export async function getBibleVerses(): Promise<BibleVerse[]> {
  const { data, error } = await supabase
    .from('bible_verses')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching bible verses:', error);
    return [];
  }

  return data || [];
}

// NOTE: Admin queries have been moved to server actions in @/lib/actions/admin-actions.ts
// Use getPendingMessagesAction() instead of getPendingMessages() for admin dashboard
