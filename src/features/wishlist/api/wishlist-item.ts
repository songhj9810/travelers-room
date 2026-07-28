import { createClient } from "@/shared/api/supabase/client"
import type { Tables } from "@/shared/api/supabase/types"

// 위시리스트 아이템 생성 (위시리스트에 담기)
export async function createWishlistItem({
  guesthouseId,
  wishlistId,
}: {
  guesthouseId: string
  wishlistId: string
}): Promise<Tables<"wishlist_items">> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("wishlist_items")
    .insert({ guesthouse_id: guesthouseId, wishlist_id: wishlistId })
    .select()
    .single() // 생성된 위시리스트 아이템 반환

  if (error) throw error
  return data
}

// 위시리스트 아이템 수정 (위시리스트 옮기기)
export async function updateWishlistItem({
  wishlistItemId,
  newWishlistId,
}: {
  wishlistItemId: string
  newWishlistId: string
}): Promise<Tables<"wishlist_items">> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("wishlist_items")
    .update({ wishlist_id: newWishlistId })
    .eq("id", wishlistItemId)
    .select()
    .single() // 수정된 위시리스트 아이템 반환

  if (error) throw error
  return data
}

// 위시리스트 아이템 삭제 (위시리스트에서 빼기)
export async function deleteWishlistItem({
  guesthouseId,
}: {
  guesthouseId: string
}): Promise<Tables<"wishlist_items">> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("wishlist_items")
    .delete()
    .eq("guesthouse_id", guesthouseId)
    .select()
    .single() // 삭제된 위시리스트 아이템 반환

  if (error) throw error
  return data
}
