import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/query-keys"

import { loginWithOAuth, loginWithPassword, logout, signup } from "../api/auth"

export function useLoginWithPassword() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: loginWithPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlists.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlistItems.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.byUser() })
    },
  })
}

export function useLoginWithOAuth() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: loginWithOAuth,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlists.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlistItems.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.byUser() })
    },
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
