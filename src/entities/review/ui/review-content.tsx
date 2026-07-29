"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"

import type { Review } from "../model/types"

type ReviewContentProps = Pick<Review, "content">

export function ReviewContent({ content }: ReviewContentProps) {
  const [expanded, setExpanded] = useState(false)
  const [overflow, setOverflow] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = textRef.current
    if (!el) return

    setOverflow(el.scrollHeight > el.clientHeight) // 실제 높이와 화면에 보이는 높이를 비교하여 3줄 이상인지 판단
  }, [content])

  return (
    <div className="flex flex-col">
      <p
        ref={textRef}
        className={cn(
          "text-sm leading-relaxed whitespace-pre-wrap",
          !expanded && "line-clamp-3"
        )}
      >
        {content}
      </p>

      {overflow && (
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => setExpanded((prev) => !prev)}
          className="ml-auto text-sm text-muted-foreground"
        >
          {expanded ? "접기" : "펼치기"}
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            altIcon={ArrowUp01Icon}
            showAlt={expanded}
            size={16}
            strokeWidth={2}
            data-icon="inline-end"
            className="size-4"
          />
        </Button>
      )}
    </div>
  )
}
