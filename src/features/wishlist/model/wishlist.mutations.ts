import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/query-keys"

import { createWishlist, deleteWishlist, updateWishlist } from "../api/wishlist"

// 위시리스트 생성
export function useCreateWishlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlists.all })
    },
  })
}

// 위시리스트 수정 (이름 변경)
export function useUpdateWishlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlists.all })
    },
  })
}

// 위시리스트 삭제
export function useDeleteWishlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteWishlist,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlists.all })
      queryClient.removeQueries({
        queryKey: queryKeys.wishlistItems.byWishlist(data.id),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.wishlistItems.ids(),
      })
    },
  })
}
