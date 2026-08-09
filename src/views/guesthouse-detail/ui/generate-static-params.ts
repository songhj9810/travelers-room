import { createClient } from "@/shared/api/supabase/public"

export async function generateStaticParams() {
  const supabase = createClient()
  const { data: guesthouses, error } = await supabase
    .from("guesthouses")
    .select("id")
    .eq("status", "APPROVED")

  if (error) throw error
  const guesthouseIds = guesthouses.map(({ id }) => id)

  return guesthouseIds.map((guesthouseId) => ({ guesthouseId }))
}
