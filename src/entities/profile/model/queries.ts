import { useQuery } from "@tanstack/react-query"

import { createClient } from "@/shared/api/supabase/client"

import { checkNickname, fetchProfile } from "../api/profile"

// 프로필 조회
export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile({ supabase: createClient() }),
  })
}

// 닉네임 중복 확인
export function useCheckNickname({
  nickname,
  currentNickname,
}: {
  nickname?: string
  currentNickname: string
}) {
  return useQuery({
    queryKey: ["nickname", nickname],
    queryFn: () =>
      checkNickname({ supabase: createClient(), nickname: nickname! }),
    enabled:
      !!nickname && nickname.trim().length >= 2 && nickname !== currentNickname,
    staleTime: 1000 * 5, // 5초
  })
}
