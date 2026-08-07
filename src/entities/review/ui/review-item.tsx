import Image from "next/image"
import { StarIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/shared/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/carousel"
import { Skeleton } from "@/shared/ui/skeleton"

import type { Review } from "../model/types"
import { formatDate } from "./formatter"
import { ReviewContent } from "./review-content"

type ReviewItemProps = {
  review: Review
  action?: React.ReactNode
}

export function ReviewItem({
  review: { created_at, rating, content, images, author, guesthouse },
  action,
}: ReviewItemProps) {
  return (
    <article className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-2 gap-y-0.5">
          <Avatar className="col-start-1 row-span-2 row-start-1">
            <AvatarImage
              src={
                author?.nickname
                  ? author?.avatar || "/avatar.svg"
                  : guesthouse?.images[0] || "/placeholder.jpg"
              }
              alt=""
            />
            <AvatarFallback>
              {author?.nickname[0] || guesthouse?.name[0]}
            </AvatarFallback>
          </Avatar>

          <p className="col-start-2 row-start-1 text-sm font-medium">
            {author?.nickname || guesthouse?.name}
          </p>

          <p
            aria-label={`평점 ${rating.toFixed(1)}점, ${formatDate(created_at)}`}
            className="col-start-2 row-start-2 flex items-center gap-0.5 text-xs text-muted-foreground"
          >
            {Array.from({ length: 5 }).map((_, star) => (
              <HugeiconsIcon
                key={star}
                icon={StarIcon}
                size={14}
                strokeWidth={1.5}
                aria-hidden
                className={cn(
                  "size-3.5 shrink-0",
                  star + 1 <= rating
                    ? "fill-chart-1 text-chart-1"
                    : "fill-muted text-muted-foreground/10"
                )}
              />
            ))}
            <time aria-hidden className="ml-0.5">
              {formatDate(created_at)}
            </time>
          </p>
        </div>

        {action && action}
      </div>

      {images.length > 0 && (
        <Carousel opts={{ align: "start" }}>
          <CarouselContent spacing={2}>
            {images.map((image, index) => (
              <CarouselItem key={image} spacing={2} className="basis-50">
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src={image}
                    alt={`리뷰 이미지 ${index + 1}`}
                    fill
                    sizes="12.5rem"
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}

      <ReviewContent content={content} />
    </article>
  )
}

export function ReviewItemSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-2 gap-y-0.5">
        <Skeleton className="col-start-1 row-span-2 row-start-1 size-9 shrink-0 rounded-full" />
        <Skeleton className="col-start-2 row-start-1 h-5 w-25" />
        <Skeleton className="col-start-2 row-start-2 h-4 w-30" />
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>
    </div>
  )
}
