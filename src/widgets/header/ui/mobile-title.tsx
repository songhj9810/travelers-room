"use client"

import { cn } from "@/shared/lib/utils"

import { useHeaderTitle } from "../model/header.store"

export function MobileTitle() {
  const { showTitle, title } = useHeaderTitle()

  return (
    <div
      className={cn(
        "min-w-0 truncate text-center text-lg font-medium",
        "transition-[translate,opacity] duration-300 ease-in-out",
        showTitle ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
      )}
    >
      {title}
    </div>
  )
}
