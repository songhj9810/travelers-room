import type { Metadata } from "next"

import { searchParamsToFormValues } from "@/features/search"

import { REGION_LOOKUP } from "@/entities/guesthouse"

import type { Enums } from "@/shared/api/supabase/types"

function getTitle({
  keyword,
  regions,
}: {
  keyword: string
  regions: Enums<"REGION">[]
}): string {
  if (keyword) return `${keyword} 검색`

  if (regions.length > 0) {
    const labels = regions
      .map((region) => REGION_LOOKUP.get(region)?.regionLabel)
      .filter((label): label is string => Boolean(label))

    if (labels.length === 0) return "게스트하우스 검색"

    return labels.length > 3
      ? `${labels.slice(0, 3).join(", ")} 외 ${labels.length - 3}개 지역 게스트하우스 검색`
      : `${labels.slice(0, 3).join(", ")} 게스트하우스 검색`
  }

  return "게스트하우스 검색"
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const params = await searchParams

  const urlSearchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => urlSearchParams.append(key, v))
    } else if (value) {
      urlSearchParams.append(key, value)
    }
  })

  const { keyword, regions } = searchParamsToFormValues(urlSearchParams)

  return {
    title: getTitle({ keyword, regions }),
    robots: {
      index: false,
      follow: true,
    },
  }
}
