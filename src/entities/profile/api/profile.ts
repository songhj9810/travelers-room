import { type SupabaseClient } from "@supabase/supabase-js"

import type { Database, Tables } from "@/shared/api/supabase/types"

// 프로필 조회
export async function fetchProfile({
  supabase,
}: {
  supabase: SupabaseClient<Database>
}): Promise<Tables<"profiles"> | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) throw error
  return data
}
