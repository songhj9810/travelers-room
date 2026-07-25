"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FavouriteIcon,
  Home01Icon,
  Search01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useOpenSearchModal } from "@/features/search"

import { useProfile } from "@/entities/profile"

import { PATHS } from "@/shared/config/paths"
import { cn } from "@/shared/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"

export function TabBar() {
  const pathname = usePathname()
  const openSearchModal = useOpenSearchModal()

  const { data: profile } = useProfile()

  const navItemClassName = (active: boolean) =>
    cn(
      "flex w-full flex-col items-center gap-1 text-xs whitespace-nowrap [&>svg]:size-5 [&>svg]:shrink-0",
      active ? "text-primary" : "text-muted-foreground"
    )

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 grid h-16 grid-cols-4 place-items-center border-t bg-background md:hidden">
      <Link
        href={PATHS.HOME}
        className={navItemClassName(pathname === PATHS.HOME)}
      >
        <HugeiconsIcon
          icon={Home01Icon}
          size={20}
          strokeWidth={2}
          aria-hidden
        />
        홈
      </Link>

      <button
        onClick={openSearchModal}
        className={navItemClassName(pathname.startsWith(PATHS.SEARCH))}
      >
        <HugeiconsIcon
          icon={Search01Icon}
          size={20}
          strokeWidth={2}
          aria-hidden
        />
        검색
      </button>

      <Link
        href={PATHS.WISHLISTS.LIST}
        className={navItemClassName(pathname.startsWith(PATHS.WISHLISTS.LIST))}
      >
        <HugeiconsIcon
          icon={FavouriteIcon}
          size={20}
          strokeWidth={2}
          aria-hidden
        />
        위시리스트
      </Link>

      {profile ? (
        <Link
          href={PATHS.ME.PROFILE}
          className={navItemClassName(pathname.startsWith(PATHS.ME.PROFILE))}
        >
          <Avatar className="size-5">
            <AvatarImage src={profile.avatar || "/avatar.svg"} alt="" />
            <AvatarFallback>{profile.nickname[0]}</AvatarFallback>
          </Avatar>
          마이페이지
        </Link>
      ) : (
        <Link
          href={PATHS.AUTH.LOGIN}
          className={navItemClassName(pathname === PATHS.AUTH.LOGIN)}
        >
          <HugeiconsIcon
            icon={UserIcon}
            size={20}
            strokeWidth={2}
            aria-hidden
          />
          로그인
        </Link>
      )}
    </nav>
  )
}
