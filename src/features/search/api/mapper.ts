import { Constants, type Enums } from "@/shared/api/supabase/types"

import { PRICE_MAX, PRICE_MIN } from "../config/filter"
import type { SearchFormValues } from "../model/schema"

/** SearchFormValues → URLSearchParams 변환 함수 */
export const formValuesToSearchParams = (
  values: SearchFormValues
): URLSearchParams => {
  const params = new URLSearchParams()

  if (values.keyword) params.set("keyword", values.keyword)

  // 기본값일 때 파라미터 생략
  // ?guests=2
  if (values.guests !== 1) params.set("guests", String(values.guests))

  // 빈 배열일 때 파라미터 생략
  // ?regions=AEWOL,HALLIM
  if (values.regions.length > 0) params.set("regions", values.regions.join(","))

  // 기본값일 때 파라미터 생략
  // ?min=20000&max=50000
  const [min, max] = values.priceRange
  if (min !== PRICE_MIN) params.set("min", String(min))
  if (max !== PRICE_MAX) params.set("max", String(max))

  // null일 때 파라미터 생략
  // ?parking=true&party=false
  if (values.parking !== null) params.set("parking", String(values.parking))
  if (values.party !== null) params.set("party", String(values.party))

  return params
}

const REGION_SET = new Set<Enums<"REGION">>(Constants.public.Enums.REGION)

const parseNumber = (value: string | null, fallback: number): number =>
  value !== null && Number.isFinite(Number(value)) ? Number(value) : fallback

const parseNullableBoolean = (value: string | null): boolean | null =>
  value === "true" ? true : value === "false" ? false : null

/** URLSearchParams → SearchFormValues 변환 함수 */
export const searchParamsToFormValues = (
  params: URLSearchParams
): SearchFormValues => {
  const raw = params.get("regions")
  // 지역 배열 내 순서 정렬
  const regions = raw
    ? raw
        .split(",")
        .filter((r): r is Enums<"REGION"> =>
          REGION_SET.has(r as Enums<"REGION">)
        )
        .sort(
          (a, b) =>
            Constants.public.Enums.REGION.indexOf(a) -
            Constants.public.Enums.REGION.indexOf(b)
        )
    : []

  return {
    keyword: params.get("keyword") ?? "",
    guests: parseNumber(params.get("guests"), 1),
    regions,
    priceRange: [
      parseNumber(params.get("min"), PRICE_MIN),
      parseNumber(params.get("max"), PRICE_MAX),
    ],
    parking: parseNullableBoolean(params.get("parking")),
    party: parseNullableBoolean(params.get("party")),
  }
}
