"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { useInView } from "react-intersection-observer"
import {
  FilterHorizontalIcon,
  SearchRemoveIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMediaQuery } from "usehooks-ts"

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
import { type Marker, NaverMap } from "@/shared/ui/naver-map"
import { ViewSwitcher } from "@/shared/ui/view-switcher"

import { FilterBadges } from "./filter-badges"
import { FilterModal } from "./filter-modal"

export default function Page() {
  const searchParams = useSearchParams()
  const { setHeader, resetHeader } = useHeaderActions()

  const [view, setView] = useState<"list" | "map">("list") // 모바일
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const filterRef = useRef<HTMLDivElement | null>(null)
  const [scrollMarginTop, setScrollMarginTop] = useState(0) // 데스크탑

  const values = useMemo(
    () => searchParamsToFormValues(searchParams),
    [searchParams]
  )
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearchGuesthouses(values)
  const { data: wishlistedIds = new Set<string>() } =
    useWishlistedGuesthouseIds()

  const total = data?.pages[0].total ?? 0
  const items = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data?.pages]
  )
  const markers: Marker[] = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        name: item.name,
        lat: item.latitude,
        lng: item.longitude,
      })),
    [items]
  )

  const selectedId = items.some((item) => item.id === activeId)
    ? activeId
    : null

  const isDesktop = useMediaQuery("(min-width: 768px)")

  useEffect(() => {
    const el = filterRef.current
    if (!el) return

    const updateMargin = () => {
      const stickyTop = isDesktop ? 80 : 48
      setScrollMarginTop(stickyTop + el.offsetHeight)
    }

    updateMargin() // 초기값 설정

    const resizeObserver = new ResizeObserver(updateMargin)
    resizeObserver.observe(el)
    return () => resizeObserver.disconnect()
  }, [isDesktop])

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
        <div
          ref={filterRef}
          className="sticky top-12 z-30 bg-background py-4 md:top-20"
        >
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
            activeId={selectedId}
            scrollMarginTop={scrollMarginTop}
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
        <NaverMap
          markers={markers}
          activeId={selectedId}
          onMarkerClick={setActiveId}
          onMapClick={() => setActiveId(null)}
        />
      </div>

      <div className="fixed inset-x-0 bottom-20 z-20 flex flex-col items-center gap-4 md:hidden">
        <ViewSwitcher
          value={view}
          onValueChange={(value) => {
            setView(value)
            if (value === "list" && selectedId) {
              const currentActiveId = selectedId
              setActiveId(null)
              requestAnimationFrame(() => {
                setActiveId(currentActiveId)
              })
            }
            if (value === "map" && !selectedId) {
              setActiveId(items[0]?.id ?? null)
            }
          }}
        />

        {view === "map" && (
          <div className="w-full">
            {isLoading ? (
              <MiniGuesthouseCarouselSkeleton />
            ) : total > 0 ? (
              <MiniGuesthouseCarousel
                items={items}
                wishlistedIds={wishlistedIds}
                activeId={selectedId}
                onActiveIdChange={setActiveId}
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
