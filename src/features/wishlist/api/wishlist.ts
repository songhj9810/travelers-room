import { createClient } from "@/shared/api/supabase/client"
import type { Tables } from "@/shared/api/supabase/types"

// 위시리스트 생성
export async function createWishlist({
  name,
}: {
  name: string
}): Promise<Tables<"wishlists">> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("wishlists")
    .insert({ name })
    .select()
    .single() // 생성된 위시리스트 반환

  if (error) throw error
  return data
}

// 위시리스트 수정 (이름 변경)
export async function updateWishlist({
  wishlistId,
  newName,
}: {
  wishlistId: string
  newName: string
}): Promise<Tables<"wishlists">> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("wishlists")
    .update({ name: newName })
    .eq("id", wishlistId)
    .select()
    .single() // 수정된 위시리스트 반환

  if (error) throw error
  return data
}

// 위시리스트 삭제
export async function deleteWishlist({
  wishlistId,
}: {
  wishlistId: string
}): Promise<Tables<"wishlists">> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("wishlists")
    .delete()
    .eq("id", wishlistId)
    .select()
    .single() // 삭제된 위시리스트 반환

  if (error) throw error
  return data
}
