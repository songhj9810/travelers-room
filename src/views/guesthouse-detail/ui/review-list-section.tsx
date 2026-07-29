"use client"

import { useState } from "react"
import { NoteIcon } from "@hugeicons/core-free-icons"

import {
  ReviewList,
  ReviewListEmpty,
  ReviewListSkeleton,
} from "@/widgets/review-list"

import { useOpenEditorModal } from "@/features/review"

import { useProfile } from "@/entities/profile"
import { useReviewsByGuesthouse } from "@/entities/review"

import { useOpenLoginModal } from "@/shared/store/login-modal.store"
import { Button } from "@/shared/ui/button"

type ReviewListSectionProps = {
  guesthouseId: string
}

export function ReviewListSection({ guesthouseId }: ReviewListSectionProps) {
  const openLoginModal = useOpenLoginModal()
  const openEditorModal = useOpenEditorModal()

  const [page, setPage] = useState(0)

  const { data: profile } = useProfile()
  const { data, isLoading } = useReviewsByGuesthouse({ guesthouseId, page })

  const items = data?.items ?? []
  const total = data?.total ?? 0

  const handleCreate = () => {
    if (!profile) {
      openLoginModal()
      return
    }

    openEditorModal({ mode: "create", guesthouseId })
  }

  return (
    <>
      <div className="mb-4 flex items-start justify-between gap-2">
        {total > 0 && (
          <p className="text-sm text-muted-foreground">
            총 {total}개의 리뷰가 있어요
          </p>
        )}

        <Button type="button" onClick={handleCreate} className="ml-auto">
          리뷰 작성
        </Button>
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
        <ReviewListEmpty icon={NoteIcon} message="작성된 리뷰가 없어요" />
      )}
    </>
  )
}
