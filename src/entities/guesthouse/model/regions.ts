import type { Enums } from "@/shared/api/supabase/types"

export const REGION_GROUPS: {
  label: string
  regions: { label: string; value: Enums<"REGION"> }[]
}[] = [
  {
    label: "제주시 서쪽",
    regions: [
      { label: "애월", value: "AEWOL" },
      { label: "한림", value: "HALLIM" },
      { label: "한경", value: "HANGYEONG" },
    ],
  },
  {
    label: "제주시",
    regions: [{ label: "제주시", value: "JEJU_CITY" }],
  },
  {
    label: "제주시 동쪽",
    regions: [
      { label: "조천", value: "JOCHEON" },
      { label: "구좌", value: "GUJWA" },
      { label: "우도", value: "UDO" },
    ],
  },
  {
    label: "서귀포시 서쪽",
    regions: [
      { label: "대정", value: "DAEJEONG" },
      { label: "안덕", value: "ANDEOK" },
    ],
  },
  {
    label: "서귀포시",
    regions: [
      { label: "서귀포시", value: "SEOGWIPO_CITY" },
      { label: "중문", value: "JUNGMUN" },
    ],
  },
  {
    label: "서귀포시 동쪽",
    regions: [
      { label: "성산", value: "SEONGSAN" },
      { label: "표선", value: "PYOSEON" },
      { label: "남원", value: "NAMWON" },
    ],
  },
]

export const REGION_LOOKUP = new Map<
  Enums<"REGION">,
  { groupLabel: string; regionLabel: string }
>(
  REGION_GROUPS.flatMap((group) =>
    group.regions.map((region) => [
      region.value,
      { groupLabel: group.label, regionLabel: region.label },
    ])
  )
)
