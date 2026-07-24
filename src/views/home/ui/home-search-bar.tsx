"use client"

import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

import { useHeaderActions } from "@/widgets/header"

import { SearchBar, SearchBarSkeleton } from "@/features/search"

export function HomeSearchBar() {
  const { setHeader, resetHeader } = useHeaderActions()

  const { ref, inView } = useInView({
    threshold: 0.25,
    rootMargin: "-80px 0px 0px 0px",
    initialInView: true,
  })

  useEffect(() => {
    setHeader({ showSearchBar: !inView })
    return () => resetHeader()
  }, [setHeader, resetHeader, inView])

  return (
    <div ref={ref} className="mx-auto w-full max-w-lg">
      <SearchBar size="lg" />
    </div>
  )
}

export function HomeSearchBarSkeleton() {
  return (
    <div className="mx-auto w-full max-w-lg">
      <SearchBarSkeleton size="lg" />
    </div>
  )
}
