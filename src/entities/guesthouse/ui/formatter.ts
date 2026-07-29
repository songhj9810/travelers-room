import {
  BedBunkIcon,
  BedDoubleIcon,
  BedIcon,
  BedSingle01Icon,
} from "@hugeicons/core-free-icons"
import { IconSvgElement } from "@hugeicons/react"

import type { Enums, Json } from "@/shared/api/supabase/types"

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

const BED_MAP: Record<string, { icon: IconSvgElement; label: string }> = {
  BUNK: { icon: BedBunkIcon, label: "이층침대" },
  DOUBLE: { icon: BedDoubleIcon, label: "더블침대" },
  QUEEN: { icon: BedDoubleIcon, label: "퀸침대" },
  SINGLE: { icon: BedSingle01Icon, label: "싱글침대" },
}

export const formatBeds = (
  value: Json | null
): { icon: IconSvgElement; text: string } => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return { icon: BedIcon, text: "-" }
  }

  const entries = Object.entries(value).filter(
    ([, count]) => typeof count === "number"
  )
  if (entries.length === 0) {
    return { icon: BedIcon, text: "-" }
  }

  const icon = BED_MAP[entries[0][0]]?.icon || BedIcon
  const text = entries
    .map(([bed, count]) => {
      const label = BED_MAP[bed]?.label || bed
      return `${label} ${count}개`
    })
    .join(", ")
  return { icon, text }
}
