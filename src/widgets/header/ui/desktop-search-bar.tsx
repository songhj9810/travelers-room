"use client"

import { usePathname } from "next/navigation"

import { SearchBar } from "@/features/search"

import { PATHS } from "@/shared/config/paths"

import { useHeaderSearchBar } from "../model/header.store"

export function DesktopSearchBar() {
  const pathname = usePathname()
  const { showSearchBar, keyword } = useHeaderSearchBar()

  // 홈이 아닌 페이지에서는 스토어 값과 무관하게 항상 헤더에 서치바 표시
  const visible = pathname === PATHS.HOME ? showSearchBar : true

  if (!visible) return null

  return <SearchBar keyword={keyword} />
}
