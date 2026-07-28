import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/query-keys"

import {
  createWishlistItem,
  deleteWishlistItem,
  updateWishlistItem,
} from "../api/wishlist-item"

// 위시리스트 아이템 생성 (위시리스트에 담기)
export function useCreateWishlistItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createWishlistItem,
    onMutate: async (variables) => {
      // 낙관적 업데이트가 덮어씌워지지 않도록 진행 중인 쿼리 취소
      await queryClient.cancelQueries({
        queryKey: queryKeys.wishlistItems.ids(),
      })
      // 에러 발생 시 복구를 위한 스냅샷 저장
      const previous = queryClient.getQueryData<Set<string>>(
        queryKeys.wishlistItems.ids()
      )
      // 낙관적 업데이트
      queryClient.setQueryData<Set<string>>(
        queryKeys.wishlistItems.ids(),
        (old) =>
          new Set(
            old ? [...old, variables.guesthouseId] : [variables.guesthouseId]
          )
      )
      return { previous }
    },
    onError: (_error, _variables, context) => {
      // 에러 발생 시 저장해둔 스냅샷으로 복구
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.wishlistItems.ids(),
          context.previous
        )
      }
    },
    onSettled: (_data, _error, variables) => {
      // 서버 상태 동기화
      queryClient.invalidateQueries({
        queryKey: queryKeys.wishlistItems.ids(),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.wishlistItems.byWishlist(variables.wishlistId), // 항상 기본 위시리스트
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlists.all })
    },
  })
}

// 위시리스트 아이템 수정 (위시리스트 옮기기)
export function useUpdateWishlistItem({
  baseWishlistId,
}: {
  baseWishlistId?: string
}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateWishlistItem,
    onSuccess: (data) => {
      if (baseWishlistId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.wishlistItems.byWishlist(baseWishlistId), // 여기에서
        })
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.wishlistItems.byWishlist(data.wishlist_id), // 여기로 이동
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlists.all })
    },
  })
}

// 위시리스트 아이템 삭제 (위시리스트에서 빼기)
export function useDeleteWishlistItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteWishlistItem,
    onMutate: async (variables) => {
      // 낙관적 업데이트가 덮어씌워지지 않도록 진행 중인 쿼리 취소
      await queryClient.cancelQueries({
        queryKey: queryKeys.wishlistItems.ids(),
      })
      // 에러 발생 시 복구를 위한 스냅샷 저장
      const previous = queryClient.getQueryData<Set<string>>(
        queryKeys.wishlistItems.ids()
      )
      // 낙관적 업데이트
      queryClient.setQueryData<Set<string>>(
        queryKeys.wishlistItems.ids(),
        (old) => {
          const next = new Set(old)
          next.delete(variables.guesthouseId)
          return next
        }
      )
      return { previous }
    },
    onError: (_error, _variables, context) => {
      // 에러 발생 시 저장해둔 스냅샷으로 복구
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.wishlistItems.ids(),
          context.previous
        )
      }
    },
    onSettled: (data) => {
      // 서버 상태 동기화
      queryClient.invalidateQueries({
        queryKey: queryKeys.wishlistItems.ids(),
      })
      if (data?.wishlist_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.wishlistItems.byWishlist(data.wishlist_id),
        })
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlists.all })
    },
  })
}
