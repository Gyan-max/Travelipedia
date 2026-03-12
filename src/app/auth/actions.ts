'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function syncUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: dbUser, error } = await supabase
    .from('users')
    .upsert({
      supabaseUid: user.id,
      email: user.email!,
      name: user.user_metadata.full_name || user.email?.split('@')[0],
    }, { onConflict: 'supabaseUid' })
    .select()
    .single()

  if (error) {
    console.error('Error syncing user:', error)
    return null
  }

  return dbUser
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  await syncUser()
  revalidatePath('/', 'layout')
  redirect('/')
}


export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    redirect(`/register?message=${encodeURIComponent(error.message)}`)
  }

  // Note: For sign up, syncUser might need to wait for email confirmation
  // but for many flows, we sync immediately if confirmation is off.
  await syncUser()
  revalidatePath('/', 'layout')
  redirect('/login?message=Check your email to confirm your account')
}


export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
