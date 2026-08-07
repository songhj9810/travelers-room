"use client"

import { useState } from "react"
import { useInView } from "react-intersection-observer"

import { RenameFormModal, useDeleteWishlist } from "@/features/wishlist"

import {
  useWishlists,
  type Wishlist,
  WishlistCard,
  WishlistCardSkeleton,
} from "@/entities/wishlist"

import { cn } from "@/shared/lib/utils"
import { useOpenConfirmModal } from "@/shared/store/confirm-modal.store"
import { topToast } from "@/shared/ui/toast"

export default function Page() {
  const openConfirmModal = useOpenConfirmModal()

  const [selectedWishlist, setSelectedWishlist] = useState<Wishlist>()
  const [renameOpen, setRenameOpen] = useState(false)

  const { data: wishlists, isLoading } = useWishlists()

  const { mutate: deleteWishlist } = useDeleteWishlist()

  const handleDelete = ({
    wishlistId,
    wishlistName,
  }: {
    wishlistId: string
    wishlistName: string
  }) => {
    openConfirmModal({
      title: `'${wishlistName}'을(를) 삭제할까요?`,
      description: "삭제한 위시리스트는 복구할 수 없어요",
      destructive: true,
      onConfirm: () => {
        deleteWishlist(
          { wishlistId },
          {
            onSuccess: () => {
              topToast.add({
                type: "success",
                description: "위시리스트를 삭제했어요",
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

  const { ref: headingRef, inView } = useInView({
    threshold: 0,
    initialInView: true,
  })

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
          위시리스트
        </h1>
      </div>

      <div className="grid grid-cols-2 items-start gap-4 md:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <WishlistCardSkeleton key={index} />
            ))
          : wishlists?.map((wishlist) => (
              <WishlistCard
                key={wishlist.id}
                wishlist={wishlist}
                onRename={() => {
                  setSelectedWishlist(wishlist)
                  setRenameOpen(true)
                }}
                onDelete={() =>
                  handleDelete({
                    wishlistId: wishlist.id,
                    wishlistName: wishlist.name,
                  })
                }
              />
            ))}
      </div>

      {selectedWishlist && (
        <RenameFormModal
          open={renameOpen}
          onOpenChange={setRenameOpen}
          wishlist={selectedWishlist}
        />
      )}
    </div>
  )
}
