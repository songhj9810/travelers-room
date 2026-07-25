"use client"

import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react"

import { WishlistButton } from "@/features/wishlist"

import {
  type GuesthouseCardProps,
  MiniGuesthouseCard,
  MiniGuesthouseCardSkeleton,
} from "@/entities/guesthouse"

import { cn } from "@/shared/lib/utils"
import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/carousel"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/shared/ui/empty"

type MiniGuesthouseCarouselProps = {
  items: GuesthouseCardProps[]
  wishlistedIds: Set<string>
  isFetchingNextPage?: boolean
  sentinelRef?: React.RefCallback<HTMLDivElement>
}

export function MiniGuesthouseCarousel({
  items,
  wishlistedIds,
  isFetchingNextPage,
  sentinelRef,
}: MiniGuesthouseCarouselProps) {
  return (
    <Carousel opts={{ align: "center" }}>
      <CarouselContent className="overflow-x-clip overflow-y-visible">
        {items.map((item, index) => (
          <CarouselItem
            key={item.id}
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
        ))}

        {/* 다음 페이지 로딩 중 스켈레톤 */}
        {isFetchingNextPage && (
          <CarouselItem className="mr-[10%] basis-[80%]">
            <MiniGuesthouseCardSkeleton />
          </CarouselItem>
        )}

        {/* 무한 스크롤 감지 센티넬 */}
        {sentinelRef && <div ref={sentinelRef} className="h-full w-px" />}
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
