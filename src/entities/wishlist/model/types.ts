import type { Guesthouse } from "@/entities/guesthouse/@x/wishlist-item"

import type { Tables } from "@/shared/api/supabase/types"

export type Wishlist = Tables<"wishlists"> & {
  thumbnails: string[]
  item_count: number
}

export type WishlistItem = Tables<"wishlist_items"> & {
  guesthouse: Guesthouse
}
