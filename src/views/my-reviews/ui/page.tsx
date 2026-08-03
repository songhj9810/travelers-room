"use client"

import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { NoteIcon } from "@hugeicons/core-free-icons"

import {
  ReviewList,
  ReviewListEmpty,
  ReviewListSkeleton,
} from "@/widgets/review-list"

import { useReviewsByUser } from "@/entities/review"

import { cn } from "@/shared/lib/utils"

export default function Page() {
  const [page, setPage] = useState(0)

  const { data, isLoading } = useReviewsByUser({ page })

  const items = data?.items ?? []
  const total = data?.total ?? 0

  const { ref: headingRef, inView } = useInView({
    threshold: 0,
    initialInView: true,
  })

  // 페이지 변경 시 스크롤 위치를 최상단으로 이동
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [page])

  return (
    <div className="relative flex w-full flex-col gap-8 p-6 md:p-10">
      <div ref={headingRef} className="absolute -mt-12 h-px md:-mt-20" />
      <div
        className={cn(
          !inView && "border-b",
          "sticky top-12 z-30 -mx-6 bg-transparent px-6 py-4 backdrop-blur-lg supports-[backdrop-filter:blur(0)]:bg-background/70 md:top-20 md:-mx-10 md:px-10"
        )}
      >
        <h1 className="text-2xl font-bold md:text-[1.75rem]/[1.2]">
          내가 작성한 리뷰
        </h1>
        {total > 0 && (
          <p className="mt-4 text-sm text-muted-foreground md:text-base">
            총 {total}개의 리뷰를 작성했어요
          </p>
        )}
      </div>

      {isLoading ? (
        <ReviewListSkeleton />
      ) : items.length > 0 ? (
        <ReviewList
          items={items}
          total={total}
          page={page}
          onPageChange={setPage}
        />
      ) : (
        <ReviewListEmpty icon={NoteIcon} message="작성한 리뷰가 없어요" />
      )}
    </div>
  )
}
