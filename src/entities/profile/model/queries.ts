import { useQuery } from "@tanstack/react-query"

import { createClient } from "@/shared/api/supabase/client"

import { fetchProfile } from "../api/profile"

// 프로필 조회
export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile({ supabase: createClient() }),
  })
}
