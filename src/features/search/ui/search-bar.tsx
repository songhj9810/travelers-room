"use client"

import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/shared/lib/utils"
import { InputGroup, InputGroupAddon } from "@/shared/ui/input-group"
import { Skeleton } from "@/shared/ui/skeleton"

import { useOpenSearchModal } from "../model/search-modal.store"

type SearchBarProps = {
  keyword?: string
  size?: "default" | "lg"
}

export function SearchBar({ keyword, size = "default" }: SearchBarProps) {
  const openSearchModal = useOpenSearchModal()

  return (
    <button
      onClick={openSearchModal}
      aria-label="검색 모달 열기"
      className="w-full rounded-4xl"
    >
      <InputGroup className={cn(size === "lg" && "h-11")}>
        <div
          className={cn(
            "truncate px-3 py-1 pl-1.5 tracking-wide text-muted-foreground",
            size === "lg" && "px-4 pl-2 text-lg"
          )}
        >
          {keyword || "어디에 머무를까요?"}
        </div>
        <InputGroupAddon
          align="inline-start"
          className={cn("cursor-pointer", size === "lg" && "pl-4")}
        >
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            aria-hidden
            className={cn("size-4 shrink-0", size === "lg" && "size-4.5")}
          />
        </InputGroupAddon>
      </InputGroup>
    </button>
  )
}

export function SearchBarSkeleton({ size = "default" }: SearchBarProps) {
  return (
    <Skeleton
      className={cn("h-9 w-full rounded-4xl", size === "lg" && "h-11")}
    />
  )
}
