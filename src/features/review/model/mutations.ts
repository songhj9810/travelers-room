import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/query-keys"

import { createReview, deleteReview, updateReview } from "../api/review"

// 리뷰 생성
export function useCreateReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createReview,
    onSuccess: (data) => {
      // 해당 게스트하우스의 리뷰 목록 갱신
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byGuesthouse(data.guesthouse_id),
      })
      // 내가 작성한 리뷰 목록 갱신
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.byUser() })
    },
  })
}

// 리뷰 수정
export function useUpdateReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateReview,
    onSuccess: (data) => {
      // 해당 게스트하우스의 리뷰 목록 갱신
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byGuesthouse(data.guesthouse_id),
      })
      // 내가 작성한 리뷰 목록 갱신
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.byUser() })
    },
  })
}

// 리뷰 삭제
export function useDeleteReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteReview,
    onSuccess: (data) => {
      // 해당 게스트하우스의 리뷰 목록 갱신
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byGuesthouse(data.guesthouse_id),
      })
      // 내가 작성한 리뷰 목록 갱신
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.byUser() })
    },
  })
}
