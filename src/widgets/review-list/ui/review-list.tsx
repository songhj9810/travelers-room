"use client"

import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react"

import { ActionButtons } from "@/features/review"

import { useProfile } from "@/entities/profile"
import { type Review, ReviewItem, ReviewItemSkeleton } from "@/entities/review"

import { PAGE_GROUP_SIZE, PAGE_SIZE } from "@/shared/config/pagination"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/shared/ui/empty"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui/pagination"
import { Separator } from "@/shared/ui/separator"

type ReviewListProps = {
  items: Review[]
  total: number
  page: number
  onPageChange?: (page: number) => void
}

export function ReviewList({
  items,
  total,
  page,
  onPageChange,
}: ReviewListProps) {
  const { data: profile } = useProfile()

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const groupIndex = Math.floor(page / PAGE_GROUP_SIZE)
  const groupStartPage = groupIndex * PAGE_GROUP_SIZE
  const groupEndPage = Math.min(groupStartPage + PAGE_GROUP_SIZE, totalPages)

  return (
    <>
      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <div key={item.id} className="flex flex-col gap-4">
            <ReviewItem
              review={item}
              action={
                item.user_id === profile?.id && <ActionButtons review={item} />
              }
            />
            {index < items.length - 1 && <Separator />}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {groupIndex > 0 && (
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange?.(
                      Math.max(groupStartPage - PAGE_GROUP_SIZE, 0)
                    )
                  }}
                />
              </PaginationItem>
            )}

            {Array.from(
              { length: groupEndPage - groupStartPage },
              (_, index) => groupStartPage + index
            ).map((pageIndex) => (
              <PaginationItem key={pageIndex}>
                <PaginationLink
                  href="#"
                  isActive={pageIndex === page}
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange?.(pageIndex)
                  }}
                >
                  {pageIndex + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {groupEndPage < totalPages && (
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange?.(Math.min(groupEndPage, totalPages - 1))
                  }}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  )
}

export function ReviewListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-4">
          <ReviewItemSkeleton />
          {index < 2 && <Separator />}
        </div>
      ))}
    </div>
  )
}

export function ReviewListEmpty({
  icon,
  message,
}: {
  icon: IconSvgElement
  message: string
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={icon} strokeWidth={1.5} />
        </EmptyMedia>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
