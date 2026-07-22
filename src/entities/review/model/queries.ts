import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/query-keys"
import { createClient } from "@/shared/api/supabase/client"

import { fetchReviewsByGuesthouse, fetchReviewsByUser } from "../api/review"

// 게스트하우스 리뷰 목록 조회 (페이지네이션)
export function useReviewsByGuesthouse({
  guesthouseId,
  page = 0,
}: {
  guesthouseId: string
  page?: number
}) {
  return useQuery({
    queryKey: queryKeys.reviews.byGuesthousePage(guesthouseId, page),
    queryFn: () =>
      fetchReviewsByGuesthouse({
        supabase: createClient(),
        guesthouseId,
        page,
      }),
    placeholderData: keepPreviousData, // 페이지네이션 시 이전 데이터 유지
  })
}

// 내가 작성한 리뷰 목록 조회 (페이지네이션)
export function useReviewsByUser({ page = 0 }: { page?: number }) {
  return useQuery({
    queryKey: queryKeys.reviews.byUserPage(page),
    queryFn: () => fetchReviewsByUser({ supabase: createClient(), page }),
    placeholderData: keepPreviousData, // 페이지네이션 시 이전 데이터 유지
  })
}
