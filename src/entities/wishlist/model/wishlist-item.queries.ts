import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/query-keys"
import { createClient } from "@/shared/api/supabase/client"
import { PAGE_SIZE } from "@/shared/config/pagination"

import {
  fetchWishlistedGuesthouseIds,
  fetchWishlistItems,
} from "../api/wishlist-item"

// 위시리스트 아이템 게스트하우스 ID 집합 조회
export function useWishlistedGuesthouseIds() {
  return useQuery({
    queryKey: queryKeys.wishlistItems.ids(),
    queryFn: () => fetchWishlistedGuesthouseIds({ supabase: createClient() }),
  })
}

// 위시리스트 아이템 목록 조회 (무한 스크롤)
export function useWishlistItems({ wishlistId }: { wishlistId: string }) {
  return useInfiniteQuery({
    queryKey: queryKeys.wishlistItems.byWishlist(wishlistId),
    queryFn: ({ pageParam }) =>
      fetchWishlistItems({
        supabase: createClient(),
        wishlistId,
        page: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length : undefined,
    placeholderData: (prev) => prev,
  })
}
