"use client"

import { WishlistButton } from "@/features/wishlist"

import {
  GuesthouseCard,
  type GuesthouseCardProps,
  GuesthouseCardSkeleton,
} from "@/entities/guesthouse"
import { useWishlistedGuesthouseIds } from "@/entities/wishlist"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/carousel"

type GuesthouseCarouselProps = {
  items: GuesthouseCardProps[]
  lcp?: boolean
}

export function GuesthouseCarousel({ items, lcp }: GuesthouseCarouselProps) {
  const { data: wishlistedIds = new Set<string>() } =
    useWishlistedGuesthouseIds()

  return (
    // 모바일에서는 화면 가로를 꽉 채우도록 함
    <div className="-mx-6 md:mx-0">
      <Carousel opts={{ align: "start" }} className="@container">
        <CarouselContent className="px-6 md:px-0">
          {items.map((item, index) => (
            <CarouselItem
              key={item.id}
              className="basis-2xs md:basis-1/3 lg:basis-1/4"
            >
              <GuesthouseCard
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
                variant="carousel"
                lcp={lcp && index === 0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* 이전/다음 버튼이 이미지 수직 중앙에 위치하도록 계산 */}
        {items.length > 3 && (
          <>
            <CarouselPrevious
              size="icon-lg"
              className="inset-y-auto top-[calc(100cqw*2/15)] left-0 my-0 hidden -translate-x-1/2 -translate-y-1/2 shadow-lg active:translate-y-[calc(-50%+1px)]! disabled:hidden md:flex lg:top-[10cqw]"
            />
            <CarouselNext
              size="icon-lg"
              className="inset-y-auto top-[calc(100cqw*2/15)] right-0 my-0 hidden translate-x-1/2 -translate-y-1/2 shadow-lg active:translate-y-[calc(-50%+1px)]! disabled:hidden md:flex lg:top-[10cqw]"
            />
          </>
        )}
      </Carousel>
    </div>
  )
}

export function GuesthouseCarouselSkeleton() {
  return (
    <div className="-mx-6 md:mx-0">
      <Carousel opts={{ align: "start" }}>
        <CarouselContent className="px-6 md:px-0">
          {Array.from({ length: 4 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="basis-2xs md:basis-1/3 lg:basis-1/4"
            >
              <GuesthouseCardSkeleton />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
