"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useInView } from "react-intersection-observer"
import {
  ArrowRight01Icon,
  Logout01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useLogout } from "@/features/auth"
import { AvatarModal } from "@/features/profile"

import { useProfile } from "@/entities/profile"
import { useReviewsByUser } from "@/entities/review"

import { PATHS } from "@/shared/config/paths"
import { getSupabaseErrorMessage } from "@/shared/lib/error"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { Separator } from "@/shared/ui/separator"
import { topToast } from "@/shared/ui/toast"

import { NicknameSection } from "./nickname-section"
import { ProviderIcon } from "./provider-icon"

export default function Page() {
  const router = useRouter()

  const [avatarOpen, setAvatarOpen] = useState(false)

  const { data: profile, isLoading: isProfileLoading } = useProfile()
  const { data: reviews, isLoading: isReviewsLoading } = useReviewsByUser({})

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

  const { ref: headingRef, inView } = useInView({
    threshold: 0,
    initialInView: true,
  })

  return (
    <div className="relative flex w-full flex-1 flex-col gap-8 p-6 md:p-10">
      <div ref={headingRef} className="absolute -mt-12 h-px md:-mt-20" />
      <div
        className={cn(
          !inView && "border-b",
          "sticky top-12 z-30 -mx-6 bg-transparent px-6 py-4 backdrop-blur-lg supports-[backdrop-filter:blur(0)]:bg-background/70 md:top-20 md:-mx-10 md:px-10"
        )}
      >
        <h1 className="text-2xl font-bold md:text-[1.75rem]/[1.2]">
          마이페이지
        </h1>
      </div>

      <div className="group relative mx-auto">
        <div className="relative aspect-square size-30 overflow-hidden rounded-full outline-2 outline-accent md:size-40">
          <Image
            src={profile?.avatar || "/avatar.svg"}
            alt="프로필"
            fill
            sizes="(max-width: 768px) 120px, 160px"
            className="object-cover"
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setAvatarOpen(true)}
          aria-label="프로필 이미지 변경"
          className="absolute right-0 bottom-0 z-10 bg-accent/50 group-hover:bg-accent group-hover:text-foreground hover:bg-accent hover:text-foreground dark:group-hover:bg-accent dark:hover:bg-accent"
        >
          <HugeiconsIcon
            icon={Settings01Icon}
            size={16}
            strokeWidth={2}
            aria-hidden
          />
        </Button>
        <AvatarModal
          open={avatarOpen}
          onOpenChange={setAvatarOpen}
          avatar={profile?.avatar ?? null}
        />
      </div>

      <div className="flex flex-col gap-4 md:gap-6">
        <NicknameSection
          currentNickname={profile?.nickname ?? ""}
          isLoading={isProfileLoading}
        />

        <div className="flex flex-col gap-1 rounded-2xl border p-4 md:p-6">
          <span className="text-xs text-muted-foreground md:text-sm">
            이메일
          </span>

          <div className="flex items-center justify-between gap-2">
            <span className="text-base font-medium md:text-lg">
              {isProfileLoading ? null : profile?.email}
            </span>

            <div className="inline-flex h-8 items-center justify-center border border-transparent px-2 md:px-1.75">
              <ProviderIcon provider={profile?.provider ?? null} />
            </div>
          </div>
        </div>
      </div>

      <Separator className="-mx-6 h-2! w-auto! bg-border/50 md:-mx-10" />

      <Link
        href={PATHS.ME.REVIEWS}
        className="flex items-center justify-between gap-2 rounded-2xl border p-4 transition-colors hover:bg-muted md:p-6 dark:hover:bg-input/30"
      >
        <span className="text-base font-medium md:text-lg">
          내가 작성한 리뷰
        </span>
        <div className="flex items-center gap-1 whitespace-nowrap">
          <span>{isReviewsLoading ? "-" : reviews?.total}개</span>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            strokeWidth={2}
            aria-hidden
            className="size-4.5 shrink-0 md:size-5"
          />
        </div>
      </Link>

      <button
        type="button"
        onClick={handleLogout}
        disabled={isPending}
        className="mt-auto flex items-center justify-between gap-2 rounded-2xl border p-4 transition-colors hover:bg-muted md:p-6 dark:hover:bg-input/30"
      >
        <span className="text-base font-medium md:text-lg">로그아웃</span>
        <HugeiconsIcon
          icon={Logout01Icon}
          strokeWidth={2}
          aria-hidden
          className="size-4.5 shrink-0 md:size-5"
        />
      </button>
    </div>
  )
}
