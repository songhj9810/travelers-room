import Image from "next/image"
import Link from "next/link"
import { SolidLine01Icon, StarIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { PATHS } from "@/shared/config/paths"
import { Skeleton } from "@/shared/ui/skeleton"

import { formatRegion } from "./formatter"
import type { GuesthouseCardProps } from "./guesthouse-card"

export function MiniGuesthouseCard({
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
        <div className="flex rounded-4xl bg-card p-2 text-card-foreground shadow-md">
          {/* 이미지 */}
          <div className="relative aspect-5/4 flex-4 overflow-hidden rounded-2xl">
            <Image
              src={images[0] || "/placeholder.jpg"}
              alt={`${name}의 대표 이미지`}
              fill
              sizes="35vw"
              className="object-cover"
            />
          </div>

          <div className="ml-2 flex min-w-0 flex-5 flex-col justify-between p-2">
            <div className="flex flex-col">
              {/* 게스트하우스 이름 */}
              <p className="mb-0.5 truncate text-base font-medium">{name}</p>

              <div className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
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
      {action && <div className="absolute top-3 left-3 z-10">{action}</div>}
    </div>
  )
}

export function MiniGuesthouseCardSkeleton() {
  return (
    <div className="flex rounded-4xl bg-card p-2 shadow-md">
      <Skeleton className="aspect-5/4 flex-4 rounded-2xl" />

      <div className="ml-2 flex min-w-0 flex-5 flex-col justify-between p-2">
        <div className="flex flex-col">
          <Skeleton className="mb-0.5 h-6 w-2/3" />

          <div className="mb-2 flex flex-wrap items-center gap-x-2">
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
        </div>

        <Skeleton className="h-6 w-1/2" />
      </div>
    </div>
  )
}
