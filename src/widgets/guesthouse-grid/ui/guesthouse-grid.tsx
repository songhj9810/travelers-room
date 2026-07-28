"use client"

import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react"

import { WishlistButton } from "@/features/wishlist"

import {
  GuesthouseCard,
  type GuesthouseCardProps,
  GuesthouseCardSkeleton,
} from "@/entities/guesthouse"

import { PREFETCH_OFFSET } from "@/shared/config/pagination"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/shared/ui/empty"

type GuesthouseGridProps = {
  items: GuesthouseCardProps[]
  wishlistedIds: Set<string>
  isFetchingNextPage?: boolean
  sentinelRef?: React.RefCallback<HTMLDivElement>
}

export function GuesthouseGrid({
  items,
  wishlistedIds,
  isFetchingNextPage,
  sentinelRef,
}: GuesthouseGridProps) {
  const sentinelIndex = Math.max(0, items.length - PREFETCH_OFFSET)

  return (
    <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
      {items.map((item, index) => {
        const sentinel = sentinelRef && index === sentinelIndex

        return (
          <GuesthouseCard
            key={item.id}
            ref={sentinel ? sentinelRef : undefined} // 무한 스크롤 감지 센티넬
            id={item.id}
            name={item.name}
            images={item.images}
            region={item.region}
            avg_rating={item.avg_rating}
            review_count={item.review_count}
            min_price={item.min_price}
            action={
              <WishlistButton
                guesthouseId={item.id}
                wishlisted={wishlistedIds.has(item.id)}
              />
            }
          />
        )
      })}

      {/* 다음 페이지 로딩 중 스켈레톤 */}
      {isFetchingNextPage &&
        Array.from({ length: 4 }).map((_, index) => (
          <GuesthouseCardSkeleton key={index} />
        ))}
    </div>
  )
}

export function GuesthouseGridSkeleton() {
  return (
    <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <GuesthouseCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function GuesthouseGridEmpty({
  icon,
  message,
}: {
  icon: IconSvgElement
  message: string
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={icon} strokeWidth={1.5} />
        </EmptyMedia>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
