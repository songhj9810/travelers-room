"use client"

import { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import {
  CursorInWindowIcon,
  FavouriteIcon,
  Share01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useHeaderActions } from "@/widgets/header"

import { WishlistButton } from "@/features/wishlist"

import { formatRegion } from "@/entities/guesthouse"
import { useWishlistedGuesthouseIds } from "@/entities/wishlist"

import type { Tables } from "@/shared/api/supabase/types"
import { Button, buttonVariants } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"

import { ShareButton } from "./share-button"

type HeaderProps = {
  guesthouse: Tables<"guesthouses">
}

export function IntroSection({
  guesthouse: { id, name, region, naver },
}: HeaderProps) {
  const { setHeader, resetHeader } = useHeaderActions()

  const { data: wishlistedIds = new Set<string>() } =
    useWishlistedGuesthouseIds()

  const { ref, inView } = useInView({
    threshold: 0.25,
    rootMargin: "-48px 0px 0px 0px",
    initialInView: true,
  })

  useEffect(() => {
    setHeader({ showTitle: !inView, title: name })
    return () => resetHeader()
  }, [setHeader, resetHeader, inView, name])

  return (
    <div ref={ref} className="container flex items-start justify-between gap-2">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold md:text-[1.75rem]/[1.2]">{name}</h1>
        <p className="text-base text-muted-foreground">
          {formatRegion(region)}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <WishlistButton
          guesthouseId={id}
          wishlisted={wishlistedIds.has(id)}
          type="page"
        />
        <ShareButton />
        {naver && (
          <a
            href={naver}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants()}
          >
            <HugeiconsIcon
              icon={CursorInWindowIcon}
              size={16}
              strokeWidth={2}
              data-icon="inline-start"
              aria-hidden
              className="size-4 shrink-0"
            />
            예약하러 가기
          </a>
        )}
      </div>
    </div>
  )
}

export function IntroSectionSkeleton() {
  return (
    <div className="container flex items-start justify-between gap-2">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-8 w-60 md:h-8.5" />
        <Skeleton className="h-6 w-40" />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button type="button" variant="outline" size="icon">
          <HugeiconsIcon
            icon={FavouriteIcon}
            size={16}
            strokeWidth={1.75}
            aria-hidden
          />
        </Button>
        <Button type="button" variant="outline" size="icon">
          <HugeiconsIcon
            icon={Share01Icon}
            size={16}
            strokeWidth={1.75}
            aria-hidden
          />
        </Button>
      </div>
    </div>
  )
}
