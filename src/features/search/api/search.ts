import type { Guesthouse } from "@/entities/guesthouse"

import { createClient } from "@/shared/api/supabase/client"
import { PAGE_SIZE } from "@/shared/config/pagination"

import { PRICE_MAX, PRICE_MIN } from "../config/filter"
import type { SearchFormValues } from "../model/schema"

// 게스트하우스 검색 (무한 스크롤)
export async function searchGuesthouses({
  params,
  page = 0,
}: {
  params: SearchFormValues
  page?: number
}): Promise<{ total: number; items: Guesthouse[] }> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc("search_guesthouses", {
    p_keyword: params.keyword.trim() || undefined,
    p_guests: params.guests,
    p_regions: params.regions.length > 0 ? params.regions : undefined,
    p_min_price:
      params.priceRange[0] !== PRICE_MIN ? params.priceRange[0] : undefined,
    p_max_price:
      params.priceRange[1] !== PRICE_MAX ? params.priceRange[1] : undefined,
    p_parking: params.parking ?? undefined,
    p_party: params.party ?? undefined,
    p_limit: PAGE_SIZE,
    p_offset: page * PAGE_SIZE,
  })

  if (error) throw error
  return data as { total: number; items: Guesthouse[] }
}
