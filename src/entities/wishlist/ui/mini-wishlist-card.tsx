import Image from "next/image"
import { Archive04Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/shared/lib/utils"
import { Skeleton } from "@/shared/ui/skeleton"

import type { Wishlist } from "../model/types"

type MiniWishlistCardProps = {
  wishlist: Wishlist
  onCardClick?: () => void
}

export function MiniWishlistCard({
  wishlist: { name, thumbnails, item_count },
  onCardClick,
}: MiniWishlistCardProps) {
  return (
    <button
      type="button"
      onClick={onCardClick}
      className="rounded-4xl text-start"
    >
      <div className="flex flex-col">
        <div
          className={cn(
            "relative aspect-5/4 overflow-hidden rounded-4xl",
            thumbnails.length === 0 && "border bg-muted/50"
          )}
        >
          {thumbnails.length === 0 ? (
            <div className="grid h-full place-items-center">
              <HugeiconsIcon
                icon={Archive04Icon}
                size={24}
                strokeWidth={2}
                aria-hidden
                className="size-6 shrink-0"
              />
            </div>
          ) : thumbnails.length === 1 ? (
            <Image
              src={thumbnails[0]}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 288px, (max-width: 1280px) 336px, 384px"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full grid-cols-2 grid-rows-2 gap-1">
              {Array.from({ length: 4 }).map((_, index) => {
                const thumbnail = thumbnails[index]

                return (
                  <div key={index} className="relative bg-muted/50">
                    {thumbnail && (
                      <Image
                        src={thumbnail}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 25vw, (max-width: 1024px) 144px, (max-width: 1280px) 168px, 192px"
                        className="object-cover"
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col p-2">
          <p className="mb-0.5 line-clamp-2 text-base font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">
            담긴 게하 {item_count}개
          </p>
        </div>
      </div>
    </button>
  )
}

export function MiniWishlistCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-5/4 rounded-4xl" />

      <div className="flex flex-col p-2">
        <Skeleton className="mb-0.5 h-6 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
      </div>
    </div>
  )
}
