"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/shared/ui/button"

export function MobileBackButton() {
  const router = useRouter()

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => router.back()}
      aria-label="뒤로 가기"
    >
      <HugeiconsIcon
        icon={ArrowLeft01Icon}
        size={24}
        strokeWidth={2}
        aria-hidden
        className="size-6"
      />
    </Button>
  )
}
