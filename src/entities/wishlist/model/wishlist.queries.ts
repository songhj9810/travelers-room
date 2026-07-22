import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/query-keys"
import { createClient } from "@/shared/api/supabase/client"

import { fetchWishlists } from "../api/wishlist"

// 위시리스트 목록 조회
export function useWishlists() {
  return useQuery({
    queryKey: queryKeys.wishlists.all,
    queryFn: () => fetchWishlists({ supabase: createClient() }),
  })
}

// 위시리스트 단건 조회
export function useWishlist({ wishlistId }: { wishlistId: string }) {
  return useQuery({
    queryKey: queryKeys.wishlists.all,
    queryFn: () => fetchWishlists({ supabase: createClient() }),
    select: (data) => data.find((wishlist) => wishlist.id === wishlistId),
  })
}

// 기본 위시리스트 조회
export function useBaseWishlist() {
  return useQuery({
    queryKey: queryKeys.wishlists.all,
    queryFn: () => fetchWishlists({ supabase: createClient() }),
    select: (data) => data.find((wishlist) => wishlist.base),
  })
}
