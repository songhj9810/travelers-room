"use client"

import { useState } from "react"
import { PencilEdit02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { NicknameForm } from "@/features/profile"

import { Button } from "@/shared/ui/button"

type NicknameSectionProps = {
  currentNickname: string
  isLoading: boolean
}

export function NicknameSection({
  currentNickname,
  isLoading,
}: NicknameSectionProps) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="flex flex-col gap-1 rounded-2xl border p-4 md:p-6">
      <span className="text-xs text-muted-foreground md:text-sm">닉네임</span>

      <div className="flex items-baseline justify-between gap-2">
        {isEditing ? (
          <NicknameForm
            currentNickname={currentNickname}
            onClose={() => setIsEditing(false)}
          />
        ) : (
          <>
            <span className="text-base font-medium md:text-lg">
              {isLoading ? "여행자" : currentNickname}
            </span>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              aria-label="닉네임 변경"
            >
              <HugeiconsIcon
                icon={PencilEdit02Icon}
                strokeWidth={2}
                aria-hidden
                className="size-4 md:size-4.5"
              />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
