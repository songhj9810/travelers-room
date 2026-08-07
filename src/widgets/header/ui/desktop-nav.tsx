"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { useLogout } from "@/features/auth"

import { useProfile } from "@/entities/profile"

import { PATHS } from "@/shared/config/paths"
import { getSupabaseErrorMessage } from "@/shared/lib/error"
import { cn } from "@/shared/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Button, buttonVariants } from "@/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { topToast } from "@/shared/ui/toast"

export function DesktopNav() {
  const router = useRouter()
  const pathname = usePathname()

  const { data: profile, isLoading } = useProfile()

  const { mutate: logout, isPending } = useLogout()

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.refresh()
        router.replace(PATHS.HOME)
      },
      onError: (error) => {
        topToast.add({
          type: "error",
          description: getSupabaseErrorMessage({ error }),
          priority: "high",
        })
      },
    })
  }

  return (
    <>
      <Link
        href={PATHS.WISHLISTS.LIST}
        className={cn(
          buttonVariants(),
          "bg-background text-base hover:bg-background",
          pathname.startsWith(PATHS.WISHLISTS.LIST)
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        위시리스트
      </Link>

      {isLoading ? (
        <div className="size-9" />
      ) : profile ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={profile.avatar || "/avatar.svg"} alt="" />
                  <AvatarFallback>{profile.nickname[0]}</AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="min-w-fit">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{profile.nickname}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={<Link href={PATHS.ME.PROFILE}>마이페이지</Link>}
              />
              <DropdownMenuItem
                variant="destructive"
                onClick={handleLogout}
                disabled={isPending}
              >
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href={PATHS.AUTH.LOGIN} className={cn(buttonVariants())}>
          로그인
        </Link>
      )}
    </>
  )
}
