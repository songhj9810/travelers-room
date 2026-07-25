import { useInfiniteQuery } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/query-keys"
import { PAGE_SIZE } from "@/shared/config/pagination"

import { searchGuesthouses } from "../api/search"
import type { SearchFormValues } from "./schema"

// 게스트하우스 검색 (무한 스크롤)
export function useSearchGuesthouses(params: SearchFormValues) {
  return useInfiniteQuery({
    queryKey: queryKeys.guesthouses.search(params),
    queryFn: ({ pageParam }) => searchGuesthouses({ params, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(lastPage.total / PAGE_SIZE) // 전체 페이지 수 (= 마지막 페이지 번호)
      const nextPage = allPages.length // 다음 페이지 번호
      return nextPage < totalPages ? nextPage : undefined // 마지막 페이지가 아니면 다음 페이지 반환
    },
    placeholderData: (prev) => prev,
  })
}
