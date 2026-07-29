import {
  BedBunkIcon,
  BedDoubleIcon,
  BedIcon,
  BedSingle01Icon,
  Clock1Icon,
  Clock2Icon,
  Clock3Icon,
  Clock4Icon,
  Clock5Icon,
  Clock6Icon,
  Clock7Icon,
  Clock8Icon,
  Clock9Icon,
  Clock10Icon,
  Clock11Icon,
  Clock12Icon,
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

const CLOCK_ICONS: IconSvgElement[] = [
  Clock1Icon,
  Clock2Icon,
  Clock3Icon,
  Clock4Icon,
  Clock5Icon,
  Clock6Icon,
  Clock7Icon,
  Clock8Icon,
  Clock9Icon,
  Clock10Icon,
  Clock11Icon,
  Clock12Icon,
]

export const formatTime = (
  value: string | null
): { icon: IconSvgElement; text: string } => {
  if (!value) {
    return { icon: CLOCK_ICONS[8], text: "-" }
  }

  const hour = Number(value.split(":")[0])
  const period = hour < 12 ? "오전" : "오후"
  const hour12 = hour % 12 || 12

  const icon = CLOCK_ICONS[hour12 - 1]
  const text = `${period} ${hour12}`
  return { icon, text }
}
