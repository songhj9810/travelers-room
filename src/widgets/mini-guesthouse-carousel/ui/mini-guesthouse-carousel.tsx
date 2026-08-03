"use client"

import { useEffect, useState } from "react"
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react"

import { WishlistButton } from "@/features/wishlist"

import {
  type GuesthouseCardProps,
  MiniGuesthouseCard,
  MiniGuesthouseCardSkeleton,
} from "@/entities/guesthouse"

import { PREFETCH_OFFSET } from "@/shared/config/pagination"
import { cn } from "@/shared/lib/utils"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/shared/ui/carousel"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/shared/ui/empty"

type MiniGuesthouseCarouselProps = {
  items: GuesthouseCardProps[]
  wishlistedIds: Set<string>
  activeId: string | null
  onActiveIdChange: (id: string) => void
  isFetchingNextPage?: boolean
  sentinelRef?: React.RefCallback<HTMLDivElement>
}

export function MiniGuesthouseCarousel({
  items,
  wishlistedIds,
  activeId,
  onActiveIdChange,
  isFetchingNextPage,
  sentinelRef,
}: MiniGuesthouseCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()

  const sentinelIndex = Math.max(0, items.length - PREFETCH_OFFSET)

  // 외부 -> 캐러셀
  useEffect(() => {
    if (!api || !activeId) return

    const index = items.findIndex((item) => item.id === activeId)
    if (index !== -1 && index !== api.selectedScrollSnap()) {
      api.scrollTo(index)
    }
  }, [api, activeId, items])

  // 캐러셀 -> 외부
  useEffect(() => {
    if (!api) return

    const handleSelect = () => {
      const index = api.selectedScrollSnap()
      const selectedItem = items[index]
      if (selectedItem && selectedItem.id !== activeId) {
        onActiveIdChange?.(selectedItem.id)
      }
    }

    api.on("select", handleSelect)
    return () => {
      api.off("select", handleSelect)
    }
  }, [api, items, activeId, onActiveIdChange])

  return (
    <Carousel opts={{ align: "center" }} setApi={setApi}>
      <CarouselContent className="overflow-x-clip overflow-y-visible">
        {items.map((item, index) => {
          const sentinel = sentinelRef && index === sentinelIndex

          return (
            <CarouselItem
              key={item.id}
              ref={sentinel ? sentinelRef : undefined} // 무한 스크롤 감지 센티넬
              className={cn(
                "basis-[80%]",
                // 첫번째 카드 왼쪽 마진
                index === 0 && "ml-[10%]",
                // 로딩 중이 아닐 때 마지막 카드 오른쪽 마진
                index === items.length - 1 && !isFetchingNextPage && "mr-[10%]"
              )}
            >
              <MiniGuesthouseCard
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
            </CarouselItem>
          )
        })}

        {/* 다음 페이지 로딩 중 스켈레톤 */}
        {isFetchingNextPage && (
          <CarouselItem className="mr-[10%] basis-[80%]">
            <MiniGuesthouseCardSkeleton />
          </CarouselItem>
        )}
      </CarouselContent>
    </Carousel>
  )
}

export function MiniGuesthouseCarouselSkeleton() {
  return (
    <Carousel opts={{ align: "center" }}>
      <CarouselContent className="overflow-x-clip overflow-y-visible">
        {Array.from({ length: 4 }).map((_, index) => (
          <CarouselItem
            key={index}
            className={cn(
              "basis-[80%]",
              index === 0 && "ml-[10%]",
              index === 3 && "mr-[10%]"
            )}
          >
            <MiniGuesthouseCardSkeleton />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

export function MiniGuesthouseCarouselEmpty({
  icon,
  message,
}: {
  icon: IconSvgElement
  message: string
}) {
  return (
    <Carousel opts={{ align: "center" }}>
      <CarouselContent>
        <CarouselItem className="mx-auto basis-[80%]">
          <Empty className="border bg-card">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={icon} strokeWidth={1.5} />
              </EmptyMedia>
              <EmptyDescription>{message}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  )
}
