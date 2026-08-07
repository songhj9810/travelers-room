import { Delete01Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import type { Review } from "@/entities/review"

import { useOpenConfirmModal } from "@/shared/store/confirm-modal.store"
import { Button } from "@/shared/ui/button"
import { topToast } from "@/shared/ui/toast"

import { useOpenEditorModal } from "../model/editor-modal.store"
import { useDeleteReview } from "../model/mutations"

type ActionButtonsProps = {
  review: Review
}

export function ActionButtons({ review }: ActionButtonsProps) {
  const openEditorModal = useOpenEditorModal()
  const openConfirmModal = useOpenConfirmModal()

  const { mutate: deleteReview, isPending } = useDeleteReview()

  const handleEdit = () => {
    openEditorModal({ mode: "edit", review })
  }

  const handleDelete = () => {
    openConfirmModal({
      title: "리뷰를 삭제할까요?",
      description: "삭제한 리뷰는 복구할 수 없어요",
      destructive: true,
      onConfirm: () => {
        deleteReview(
          { reviewId: review.id },
          {
            onSuccess: () => {
              topToast.add({
                type: "success",
                description: "리뷰를 삭제했어요",
              })
            },
            onError: (error) => {
              topToast.add({
                type: "error",
                description: error.message,
                priority: "high",
              })
            },
          }
        )
      },
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={handleEdit}
        disabled={isPending}
        aria-label="리뷰 수정"
      >
        <HugeiconsIcon
          icon={PencilEdit02Icon}
          size={16}
          strokeWidth={1.75}
          aria-hidden
        />
      </Button>

      <Button
        type="button"
        variant="destructive"
        size="icon-sm"
        onClick={handleDelete}
        disabled={isPending}
        aria-label="리뷰 삭제"
        className="bg-transparent dark:bg-transparent"
      >
        <HugeiconsIcon
          icon={Delete01Icon}
          size={16}
          strokeWidth={1.75}
          aria-hidden
        />
      </Button>
    </div>
  )
}
