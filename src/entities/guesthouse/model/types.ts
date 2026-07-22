import type { Tables } from "@/shared/api/supabase/types"

export type Guesthouse = Tables<"guesthouses"> & {
  avg_rating: number
  review_count: number
  min_price: number | null
}
