"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useInView } from "react-intersection-observer"
import {
  FilterHorizontalIcon,
  SearchRemoveIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

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
  SearchBar,
  searchParamsToFormValues,
  useSearchGuesthouses,
} from "@/features/search"

import { useWishlistedGuesthouseIds } from "@/entities/wishlist"

import { cn } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { ViewSwitcher } from "@/shared/ui/view-switcher"

import { FilterBadges } from "./filter-badges"
import { FilterModal } from "./filter-modal"

export default function Page() {
  const searchParams = useSearchParams()
  const { setHeader, resetHeader } = useHeaderActions()

  const [view, setView] = useState<"list" | "map">("list") // 모바일
  const [filterOpen, setFilterOpen] = useState(false)

  const values = useMemo(
    () => searchParamsToFormValues(searchParams),
    [searchParams]
  )

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearchGuesthouses(values)
  const { data: wishlistedIds = new Set<string>() } =
    useWishlistedGuesthouseIds()

  const total = data?.pages[0].total ?? 0
  const items = data?.pages.flatMap((page) => page.items) ?? []

  const { ref: sentinelRef } = useInView({
    threshold: 0,
    skip: isFetchingNextPage || !hasNextPage,
    onChange: (inView) => {
      if (inView) fetchNextPage()
    },
  })

  useEffect(() => {
    setHeader({ keyword: values.keyword })
    return () => resetHeader()
  }, [setHeader, resetHeader, values.keyword])

  return (
    <div className="flex w-full flex-col md:grid md:grid-cols-2 md:gap-4">
      <div
        className={cn(
          "flex flex-col p-6 pt-0 md:p-10 md:pt-0 md:pr-0",
          view === "map" && "hidden md:flex"
        )}
      >
        <div className="sticky top-12 z-30 bg-background py-4 md:top-20">
          <div className="grid grid-cols-[1fr_auto] grid-rows-[auto_auto_1fr] items-center gap-2 md:grid-cols-[auto_1fr] md:grid-rows-[auto_1fr]">
            <div className="order-1 min-w-0 md:hidden">
              <SearchBar keyword={values.keyword} />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setFilterOpen(true)}
              aria-label="검색 필터 모달 열기"
              className="order-2 md:order-1"
            >
              <HugeiconsIcon
                icon={FilterHorizontalIcon}
                size={16}
                strokeWidth={2}
                aria-hidden
              />
            </Button>
            <FilterModal
              open={filterOpen}
              onOpenChange={setFilterOpen}
              values={values}
            />

            <Badge className="order-3 h-auto cursor-default bg-background text-sm font-normal text-foreground md:order-2 md:text-base">
              총 {isLoading ? "-" : total}개의 게하
            </Badge>

            <div className="order-4 col-span-2 flex flex-wrap gap-2 md:order-3">
              <FilterBadges values={values} />
            </div>
          </div>
        </div>

        {isLoading ? (
          <GuesthouseGridSkeleton />
        ) : total > 0 ? (
          <GuesthouseGrid
            items={items}
            wishlistedIds={wishlistedIds}
            isFetchingNextPage={isFetchingNextPage}
            sentinelRef={sentinelRef}
          />
        ) : (
          <GuesthouseGridEmpty
            icon={SearchRemoveIcon}
            message="검색 결과가 없어요"
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
            ) : total > 0 ? (
              <MiniGuesthouseCarousel
                items={items}
                wishlistedIds={wishlistedIds}
                isFetchingNextPage={isFetchingNextPage}
                sentinelRef={sentinelRef}
              />
            ) : (
              <MiniGuesthouseCarouselEmpty
                icon={SearchRemoveIcon}
                message="검색 결과가 없어요"
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
