import { type SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/shared/api/supabase/types"

import type { Wishlist } from "../model/types"

// 위시리스트 목록 조회
export async function fetchWishlists({
  supabase,
}: {
  supabase: SupabaseClient<Database>
}): Promise<Wishlist[]> {
  const { data, error } = await supabase
    .from("vw_wishlists")
    .select("*")
    .order("base", { ascending: false }) // 기본 위시리스트가 맨 앞
    .order("created_at", { ascending: false }) // 최신순 정렬

  if (error) throw error
  return data as Wishlist[]
}
