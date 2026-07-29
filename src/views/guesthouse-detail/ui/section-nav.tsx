"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/shared/lib/utils"

const SECTIONS = [
  { id: "overview", label: "정보" },
  { id: "room-list", label: "방" },
  { id: "location", label: "위치" },
  { id: "review-list", label: "리뷰" },
] as const

export function SectionNav() {
  const [activeId, setActiveId] = useState<
    "overview" | "room-list" | "location" | "review-list"
  >("overview")
  const isScrolling = useRef(false)

  const scrollTo = (
    id: "overview" | "room-list" | "location" | "review-list"
  ) => {
    const el = document.getElementById(id)
    if (!el) return

    isScrolling.current = true
    setActiveId(id)
    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })

    const handleScrollEnd = () => {
      isScrolling.current = false
      window.removeEventListener("scrollend", handleScrollEnd)
    }
    window.addEventListener("scrollend", handleScrollEnd)
  }

  // 페이지 진입 시 스크롤 위치를 최상단으로 이동
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (isScrolling.current) return
          if (entry.isIntersecting) setActiveId(id)
        },
        { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <div className="sticky top-12 z-30 border-b bg-transparent backdrop-blur supports-[backdrop-filter:blur(0)]:bg-background/50 md:top-20">
      <div className="container flex h-10 gap-4">
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => scrollTo(id)}
            className={cn(
              "w-10 text-sm whitespace-nowrap transition-colors",
              activeId === id
                ? "border-b-2 border-primary font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function SectionNavSkeleton() {
  return (
    <div className="sticky top-12 z-30 border-b bg-transparent backdrop-blur supports-[backdrop-filter:blur(0)]:bg-background/50 md:top-20">
      <div className="container flex h-10 gap-4">
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className="w-10 text-sm whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
