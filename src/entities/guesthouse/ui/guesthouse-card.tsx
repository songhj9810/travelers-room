import Image from "next/image"
import Link from "next/link"
import { SolidLine01Icon, StarIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { PATHS } from "@/shared/config/paths"
import { Skeleton } from "@/shared/ui/skeleton"

import type { Guesthouse } from "../model/types"
import { formatRegion } from "./formatter"

export type GuesthouseCardProps = Pick<
  Guesthouse,
  | "id"
  | "name"
  | "images"
  | "region"
  | "avg_rating"
  | "review_count"
  | "min_price"
> & {
  action?: React.ReactNode
} & React.ComponentPropsWithRef<"div">

export function GuesthouseCard({
  id,
  name,
  images,
  region,
  avg_rating,
  review_count,
  min_price,
  action,
  ...props
}: GuesthouseCardProps) {
  return (
    <div className="group relative" {...props}>
      <Link href={PATHS.GUESTHOUSES.DETAIL(id)} className="rounded-4xl">
        <div className="flex flex-col">
          {/* 이미지 */}
          <div className="relative aspect-5/4 overflow-hidden rounded-4xl">
            <Image
              src={images[0] || "/placeholder.jpg"}
              alt={`${name}의 대표 이미지`}
              fill
              sizes="(max-width: 40rem) 100vw, (max-width: 48rem) 50vw, (max-width: 64rem) 50vw, 25vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col p-2">
            {/* 게스트하우스 이름 */}
            <p className="mb-0.5 truncate text-base font-medium">{name}</p>

            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              {/* 지역 */}
              <p>{formatRegion(region)}</p>

              {/* 구분선 */}
              <HugeiconsIcon
                icon={SolidLine01Icon}
                size={14}
                strokeWidth={2}
                aria-hidden
                className="size-3.5 shrink-0 rotate-90"
              />

              {/* 평점과 리뷰 개수 */}
              <p
                aria-label={`평점 ${avg_rating.toFixed(1)}점, 리뷰 ${review_count}개`}
                className="flex items-center gap-1 text-nowrap"
              >
                <HugeiconsIcon
                  icon={StarIcon}
                  size={14}
                  strokeWidth={1}
                  aria-hidden
                  className="size-3.5 shrink-0 fill-chart-1 text-chart-1"
                />
                <span aria-hidden>
                  {avg_rating.toFixed(1)} ({review_count})
                </span>
              </p>
            </div>

            {/* 가격 */}
            <p className="text-base font-medium">
              {min_price
                ? `${min_price.toLocaleString()}원~`
                : "가격 정보 없음"}
            </p>
          </div>
        </div>
      </Link>

      {/* 찜하기 버튼 */}
      {action && <div className="absolute top-3 right-3 z-10">{action}</div>}
    </div>
  )
}

export function GuesthouseCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-5/4 rounded-4xl" />

      <div className="flex flex-col p-2">
        <Skeleton className="mb-0.5 h-6 w-2/3" />

        <div className="mb-2 flex items-center gap-2">
          <Skeleton className="h-5 w-1/2" />
          <HugeiconsIcon
            icon={SolidLine01Icon}
            size={14}
            strokeWidth={2}
            aria-hidden
            className="size-3.5 shrink-0 rotate-90 text-muted-foreground"
          />
          <Skeleton className="h-5 w-1/4" />
        </div>

        <Skeleton className="h-6 w-1/2" />
      </div>
    </div>
  )
}
