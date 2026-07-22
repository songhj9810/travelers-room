import { useMutation, useQueryClient } from "@tanstack/react-query"

import { loginWithOAuth, loginWithPassword, logout, signup } from "../api/auth"

export function useLoginWithPassword() {
  return useMutation({
    mutationFn: loginWithPassword,
  })
}

export function useLoginWithOAuth() {
  return useMutation({
    mutationFn: loginWithOAuth,
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.clear(), // 로그아웃 시 모든 캐시 삭제
  })
}

export function useSignup() {
  return useMutation({
    mutationFn: signup,
  })
}
