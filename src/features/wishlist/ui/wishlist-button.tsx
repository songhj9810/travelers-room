"use client"

import { FavouriteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"

import { useProfile } from "@/entities/profile"
import { useBaseWishlist } from "@/entities/wishlist"

import { cn } from "@/shared/lib/utils"
import { useOpenLoginModal } from "@/shared/store/login-modal.store"
import { Button } from "@/shared/ui/button"

import { useOpenSelectWishlistModal } from "../model/select-wishlist-modal.store"
import {
  useCreateWishlistItem,
  useDeleteWishlistItem,
} from "../model/wishlist-item.mutations"

type WishlistButtonProps = {
  guesthouseId: string
  wishlisted?: boolean
  type?: "card" | "page"
}

export function WishlistButton({
  guesthouseId,
  wishlisted = false,
  type = "card",
}: WishlistButtonProps) {
  const openLoginModal = useOpenLoginModal()
  const openSelectWishlistModal = useOpenSelectWishlistModal()

  const { data: profile } = useProfile()
  const { data: baseWishlist } = useBaseWishlist()

  const { mutate: addToWishlist, isPending: isAdding } = useCreateWishlistItem()
  const { mutate: removeFromWishlist, isPending: isRemoving } =
    useDeleteWishlistItem()

  const isPending = isAdding || isRemoving

  const handleToggle = () => {
    if (!profile) {
      openLoginModal()
      return
    }

    if (!baseWishlist) {
      toast.error("잠시 후 다시 시도해주세요", { position: "bottom-center" })
      return
    }

    if (wishlisted) {
      removeFromWishlist(
        { guesthouseId },
        {
          onError: (error) => {
            toast.error(error.message, { position: "bottom-center" })
          },
        }
      )
    } else {
      addToWishlist(
        {
          guesthouseId,
          wishlistId: baseWishlist.id,
        },
        {
          onSuccess: (data) => {
            toast.success("기본 위시리스트에 담았어요", {
              action: {
                label: "변경",
                onClick: () =>
                  openSelectWishlistModal({ wishlistItemId: data.id }),
              },
              position: "bottom-center",
            })
          },
          onError: (error) => {
            toast.error(error.message, { position: "bottom-center" })
          },
        }
      )
    }
  }

  return (
    <Button
      type="button"
      variant={type === "card" ? "link" : "outline"}
      size={type === "card" ? "icon-sm" : "icon"}
      onClick={handleToggle}
      disabled={isPending}
      aria-label={wishlisted ? "위시리스트에서 제거" : "위시리스트에 추가"}
    >
      <HugeiconsIcon
        icon={FavouriteIcon}
        strokeWidth={1.75}
        aria-hidden
        className={cn(
          type === "card" &&
            "size-6 fill-muted-foreground/50 text-background drop-shadow-lg",
          wishlisted && "fill-destructive text-destructive"
        )}
      />
    </Button>
  )
}
