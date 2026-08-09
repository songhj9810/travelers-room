"use client"

import { useEffect, useRef } from "react"
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
  activeId: string | null
  scrollMarginTop: number
  isFetchingNextPage?: boolean
  sentinelRef?: React.RefCallback<HTMLDivElement>
}

export function GuesthouseGrid({
  items,
  wishlistedIds,
  activeId,
  scrollMarginTop,
  isFetchingNextPage,
  sentinelRef,
}: GuesthouseGridProps) {
  const activeRef = useRef<HTMLDivElement | null>(null)

  const sentinelIndex = Math.max(0, items.length - PREFETCH_OFFSET)

  // 지도에서 마커 클릭 시 해당 카드로 스크롤
  useEffect(() => {
    if (!activeId || !activeRef.current) return

    activeRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }, [activeId])

  return (
    <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
      {items.map((item, index) => {
        const active = item.id === activeId
        const sentinel = sentinelRef && index === sentinelIndex

        return (
          <GuesthouseCard
            key={item.id}
            ref={(node) => {
              // 액티브 카드 ref
              if (active) {
                activeRef.current = node
              }
              // 무한 스크롤 감지 센티넬 ref
              if (sentinel) {
                sentinelRef(node)
              }
            }}
            style={active ? { scrollMarginTop } : undefined} // 스크롤 마진 설정
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
            lcp={index === 0}
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
