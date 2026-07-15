'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema } from '@/lib/validations/schemas'
import { ZodError } from 'zod'

export async function signIn(formData: FormData) {
  try {
    const supabase = await createClient()

    // Extract and validate form data
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const validatedData = loginSchema.parse(rawData)

    const { error } = await supabase.auth.signInWithPassword(validatedData)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/admin', 'layout')
    return { error: null }
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.issues[0]
      return { error: firstError.message }
    }
    
    return { error: 'Invalid login credentials' }
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/admin', 'layout')
  redirect('/admin/login')
}
