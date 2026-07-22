import type { Tables } from "@/shared/api/supabase/types"

export type Wishlist = Tables<"wishlists"> & {
  thumbnails: string[]
  item_count: number
}
