"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { Archive04Icon } from "@hugeicons/core-free-icons"

import {
  GuesthouseGrid,
  GuesthouseGridEmpty,
  GuesthouseGridSkeleton,
} from "@/widgets/guesthouse-grid"
import { useHeaderActions } from "@/widgets/header"
import {
  MiniGuesthouseCarousel,
  MiniGuesthouseCarouselEmpty,
  MiniGuesthouseCarouselSkeleton,
} from "@/widgets/mini-guesthouse-carousel"

import {
  useWishlist,
  useWishlistedGuesthouseIds,
  useWishlistItems,
} from "@/entities/wishlist"

import { cn } from "@/shared/lib/utils"
import { ViewSwitcher } from "@/shared/ui/view-switcher"

export default function Page() {
  const { wishlistId } = useParams<{ wishlistId: string }>()
  const { setHeader, resetHeader } = useHeaderActions()

  const [view, setView] = useState<"list" | "map">("list") // 모바일

  const { data: wishlist } = useWishlist({ wishlistId })
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useWishlistItems({ wishlistId })
  const { data: wishlistedIds = new Set<string>() } =
    useWishlistedGuesthouseIds()

  const items = data?.pages.flat().map((item) => item.guesthouse) ?? []

  const { ref: sentinelRef } = useInView({
    threshold: 0,
    skip: isFetchingNextPage || !hasNextPage,
    onChange: (inView) => {
      if (inView) fetchNextPage()
    },
  })

  useEffect(() => {
    setHeader({ showTitle: true, title: wishlist?.name })
    return () => resetHeader()
  }, [setHeader, resetHeader, wishlist?.name])

  return (
    <div className="flex w-full flex-col md:grid md:grid-cols-2 md:gap-4">
      <div
        className={cn(
          "flex flex-col p-6 md:p-10 md:pt-0 md:pr-0",
          view === "map" && "hidden md:flex"
        )}
      >
        <div className="sticky top-12 z-30 hidden bg-background py-4 md:top-20 md:block">
          <h1 className="text-2xl font-bold md:text-[1.75rem]/[1.2]">
            {wishlist?.name}
          </h1>
        </div>

        {isLoading ? (
          <GuesthouseGridSkeleton />
        ) : items.length > 0 ? (
          <GuesthouseGrid
            items={items}
            wishlistedIds={wishlistedIds}
            isFetchingNextPage={isFetchingNextPage}
            sentinelRef={sentinelRef}
          />
        ) : (
          <GuesthouseGridEmpty
            icon={Archive04Icon}
            message="저장된 게스트하우스가 없어요"
          />
        )}
      </div>

      <div
        className={cn(
          "fixed inset-x-0 top-12 bottom-16 flex bg-muted transition-opacity",
          "md:sticky md:top-20 md:h-[calc(100svh-80px)]",
          view === "list" &&
            "pointer-events-none invisible opacity-0 md:pointer-events-auto md:visible md:opacity-100"
        )}
      >
        지도
      </div>

      <div className="fixed inset-x-0 bottom-20 z-20 flex flex-col items-center gap-4 md:hidden">
        <ViewSwitcher value={view} onValueChange={(value) => setView(value)} />

        {view === "map" && (
          <div className="w-full">
            {isLoading ? (
              <MiniGuesthouseCarouselSkeleton />
            ) : items.length > 0 ? (
              <MiniGuesthouseCarousel
                items={items}
                wishlistedIds={wishlistedIds}
                isFetchingNextPage={isFetchingNextPage}
                sentinelRef={sentinelRef}
              />
            ) : (
              <MiniGuesthouseCarouselEmpty
                icon={Archive04Icon}
                message="저장된 게스트하우스가 없어요"
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
