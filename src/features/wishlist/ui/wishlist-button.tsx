"use client"

import { useState } from "react"
import { FavouriteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useProfile } from "@/entities/profile"

import { cn } from "@/shared/lib/utils"
import { useOpenLoginModal } from "@/shared/store/login-modal.store"
import { Button } from "@/shared/ui/button"

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

  const [isWishlisted, setIsWishlisted] = useState(wishlisted)

  const { data: profile } = useProfile()

  const handleToggle = () => {
    if (!profile) {
      openLoginModal()
      return
    }

    // TODO: 찜 기능 구현
    setIsWishlisted(!isWishlisted)
  }

  return (
    <Button
      type="button"
      variant={type === "card" ? "link" : "outline"}
      size={type === "card" ? "icon-sm" : "icon"}
      onClick={handleToggle}
      aria-label={isWishlisted ? "위시리스트에서 제거" : "위시리스트에 추가"}
    >
      <HugeiconsIcon
        icon={FavouriteIcon}
        strokeWidth={1.75}
        aria-hidden
        className={cn(
          type === "card" &&
            "size-6 fill-muted-foreground/50 text-background drop-shadow-lg",
          isWishlisted && "fill-destructive text-destructive"
        )}
      />
    </Button>
  )
}
