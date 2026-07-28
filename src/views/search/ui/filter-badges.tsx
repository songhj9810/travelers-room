import { PRICE_MAX, PRICE_MIN, type SearchFormValues } from "@/features/search"

import { REGION_LOOKUP } from "@/entities/guesthouse"

import { Badge } from "@/shared/ui/badge"

type FilterBadgesProps = {
  values: SearchFormValues
}

export function FilterBadges({ values }: FilterBadgesProps) {
  const items: string[] = []

  if (values.guests > 1) items.push(`${values.guests}명`)

  if (values.regions.length > 0)
    items.push(
      values.regions
        .map((region) => REGION_LOOKUP.get(region)?.regionLabel || region)
        .join(", ")
    )

  const [minPrice, maxPrice] = values.priceRange
  if (minPrice > PRICE_MIN && maxPrice < PRICE_MAX) {
    items.push(`${minPrice.toLocaleString()}~${maxPrice.toLocaleString()}원`)
  } else if (minPrice > PRICE_MIN) {
    items.push(`${minPrice.toLocaleString()}원~`)
  } else if (maxPrice < PRICE_MAX) {
    items.push(`~${maxPrice.toLocaleString()}원`)
  }

  if (values.parking === true) items.push("주차 있음")
  if (values.parking === false) items.push("주차 없음")
  if (values.party === true) items.push("파티 있음")
  if (values.party === false) items.push("파티 없음")

  return (
    <>
      {items.map((item) => (
        <Badge
          key={item}
          variant="secondary"
          title={item}
          className="block h-auto max-w-full cursor-default truncate font-normal tracking-tight md:text-sm"
        >
          {item}
        </Badge>
      ))}
    </>
  )
}
