import type { Tables } from "@/shared/api/supabase/types"

export type Review = Tables<"reviews"> & {
  author?: Pick<Tables<"profiles">, "nickname" | "avatar">
  guesthouse?: Pick<Tables<"guesthouses">, "name" | "images">
}
