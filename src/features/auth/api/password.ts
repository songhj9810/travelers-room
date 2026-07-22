import { createClient } from "@/shared/api/supabase/client"

export async function forgotPassword({ email }: { email: string }) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.resetPasswordForEmail(email)

  if (error) throw error
  return data
}

export async function resetPassword({ newPassword }: { newPassword: string }) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) throw error
  return data
}
