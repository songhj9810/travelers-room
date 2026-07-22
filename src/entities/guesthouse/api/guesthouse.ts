import { createClient } from "@/shared/api/supabase/server"
import type { Tables } from "@/shared/api/supabase/types"

import type { Guesthouse } from "../model/types"

// 게스트하우스 목록 조회
export async function fetchGuesthouses({
  sort,
}: {
  sort: "wishlisted_count" | "avg_rating" | "created_at"
}): Promise<Guesthouse[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("vw_guesthouses")
    .select("*")
    .order(sort, { ascending: false, nullsFirst: false })
    .limit(10)

  if (error) throw error
  return data as Guesthouse[]
}

// 게스트하우스 단건 조회
export async function fetchGuesthouse({
  guesthouseId,
}: {
  guesthouseId: string
}): Promise<Tables<"guesthouses">> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("guesthouses")
    .select("*")
    .eq("id", guesthouseId)
    .single()

  if (error) throw error
  return data
}

// 게스트하우스 방 목록 조회
export async function fetchRooms({
  guesthouseId,
}: {
  guesthouseId: string
}): Promise<Tables<"rooms">[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("guesthouse_id", guesthouseId)

  if (error) throw error
  return data
}
