import { type SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/shared/api/supabase/types"
import { PAGE_SIZE } from "@/shared/config/pagination"

import type { WishlistItem } from "../model/types"

// 위시리스트 아이템 게스트하우스 ID 집합 조회
export async function fetchWishlistedGuesthouseIds({
  supabase,
}: {
  supabase: SupabaseClient<Database>
}): Promise<Set<string>> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new Set()

  const { data, error } = await supabase
    .from("wishlist_items")
    .select("guesthouse_id")
    .eq("user_id", user.id)

  if (error) throw error
  return new Set(data.map((item) => item.guesthouse_id))
}

// 위시리스트 아이템 목록 조회 (무한 스크롤)
export async function fetchWishlistItems({
  supabase,
  wishlistId,
  page = 0,
}: {
  supabase: SupabaseClient<Database>
  wishlistId: string
  page?: number
}): Promise<WishlistItem[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const from = page * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, error } = await supabase
    .from("wishlist_items")
    .select("*, guesthouse:vw_guesthouses!guesthouse_id(*)")
    .eq("wishlist_id", wishlistId)
    .order("created_at", { ascending: false }) // 최신순 정렬
    .range(from, to)

  if (error) throw error
  return data as WishlistItem[]
}
