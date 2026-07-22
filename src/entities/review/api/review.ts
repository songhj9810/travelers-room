import { type SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/shared/api/supabase/types"
import { PAGE_SIZE } from "@/shared/config/pagination"

import type { Review } from "../model/types"

// 게스트하우스 리뷰 목록 조회 (페이지네이션)
export async function fetchReviewsByGuesthouse({
  supabase,
  guesthouseId,
  page = 0,
}: {
  supabase: SupabaseClient<Database>
  guesthouseId: string
  page?: number
}): Promise<{ items: Review[]; total: number }> {
  const from = page * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, count, error } = await supabase
    .from("reviews")
    .select("*, author:profiles!user_id(nickname, avatar)", {
      count: "exact",
    })
    .eq("guesthouse_id", guesthouseId)
    .order("created_at", { ascending: false }) // 최신순 정렬
    .range(from, to)

  if (error) throw error
  return { items: data as Review[], total: count ?? 0 }
}

// 내가 작성한 리뷰 목록 조회 (페이지네이션)
export async function fetchReviewsByUser({
  supabase,
  page = 0,
}: {
  supabase: SupabaseClient<Database>
  page?: number
}): Promise<{ items: Review[]; total: number }> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { items: [], total: 0 }

  const from = page * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, count, error } = await supabase
    .from("reviews")
    .select("*, guesthouse:guesthouses!guesthouse_id(name, images)", {
      count: "exact",
    })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false }) // 최신순 정렬
    .range(from, to)

  if (error) throw error
  return { items: data as Review[], total: count ?? 0 }
}
