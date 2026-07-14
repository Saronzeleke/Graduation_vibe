'use server'

import { revalidatePath } from 'next/cache'
import { submitMessage as submitMessageQuery } from '@/lib/supabase/queries'
import { messageSchema } from '@/lib/validations/schemas'
import { checkMessageSubmissionRateLimit, recordMessageSubmission } from '@/lib/utils/rate-limit'
import { ZodError } from 'zod'

export async function submitMessage(formData: FormData) {
  try {
    // Check rate limit FIRST (before validation to save resources)
    const rateLimitCheck = await checkMessageSubmissionRateLimit()
    
    if (!rateLimitCheck.allowed) {
      return {
        success: false,
        error: rateLimitCheck.error || 'Too many requests. Please try again later.',
        rateLimited: true,
        retryAfter: rateLimitCheck.retryAfter,
      }
    }

    // Extract form data
    const rawData = {
      name: formData.get('name') as string,
      relationship: formData.get('relationship') as string,
      message: formData.get('message') as string,
    }

    // Validate with Zod
    const validatedData = messageSchema.parse(rawData)

    // Submit to database
    const result = await submitMessageQuery(validatedData)

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to submit message',
      }
    }

    // Record rate limit entry AFTER successful submission
    await recordMessageSubmission()

    // Revalidate pages
    revalidatePath('/messages')
    revalidatePath('/admin')
    
    return {
      success: true,
    }
  } catch (error) {
    // Handle validation errors
    if (error instanceof ZodError) {
      const firstError = error.errors?.[0]
      if (firstError) {
        return {
          success: false,
          error: firstError.message,
          field: firstError.path[0] as string,
        }
      }
    }

    // Handle other errors
    console.error('Message submission error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit message',
    }
  }
}
