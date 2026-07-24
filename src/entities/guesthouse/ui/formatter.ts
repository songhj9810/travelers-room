import type { Enums } from "@/shared/api/supabase/types"

import { REGION_LOOKUP } from "../model/regions"

export const formatRegion = (value: Enums<"REGION"> | null): string => {
  if (!value) {
    return "-"
  }

  const found = REGION_LOOKUP.get(value)
  if (!found) {
    return value
  }
  if (found.groupLabel === "제주시" || found.groupLabel === "서귀포시") {
    return found.regionLabel
  }
  return `${found.groupLabel}, ${found.regionLabel}`
}
