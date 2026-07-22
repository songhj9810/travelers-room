import { type Provider } from "@supabase/supabase-js"

import { createClient } from "@/shared/api/supabase/client"

export async function loginWithPassword({
  email,
  password,
}: {
  email: string
  password: string
}) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function loginWithOAuth({ provider }: { provider: Provider }) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })

  if (error) throw error
  return data
}

export async function logout() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()

  if (error) throw error
}

export async function signup({
  email,
  password,
}: {
  email: string
  password: string
}) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) throw error
  return data
}
