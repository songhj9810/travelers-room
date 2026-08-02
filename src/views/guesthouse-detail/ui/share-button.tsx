"use client"

import Image from "next/image"
import { CopyLinkIcon, Share01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"

import { Button } from "@/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog"

export function ShareButton() {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("링크를 복사했어요", { position: "top-center" })
    } catch {
      toast.error("잠시 후 다시 시도해주세요", { position: "top-center" })
    }
  }
  const handleKakaoShare = () => {
    window.Kakao.Share.sendScrap({
      requestUrl: window.location.href,
    })
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="공유하기"
          >
            <HugeiconsIcon
              icon={Share01Icon}
              size={16}
              strokeWidth={1.75}
              aria-hidden
            />
          </Button>
        }
      />
      <DialogContent className="w-sm">
        <DialogHeader className="text-center">
          <DialogTitle>공유하기</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 place-items-center gap-2 px-6 py-2">
          <Button
            type="button"
            variant="link"
            onClick={handleCopyLink}
            className="flex h-auto flex-col items-center justify-center text-foreground"
          >
            <div className="grid h-10 w-10 place-content-center rounded-full bg-accent">
              <HugeiconsIcon
                icon={CopyLinkIcon}
                size={20}
                strokeWidth={1.75}
                aria-hidden
                className="size-5 text-foreground"
              />
            </div>
            링크 복사
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={handleKakaoShare}
            className="flex h-auto flex-col items-center justify-center text-foreground"
          >
            <div className="grid h-10 w-10 place-content-center rounded-full bg-[#FFEB00]">
              <Image
                src="/kakao-share.png"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6"
              />
            </div>
            카카오톡
          </Button>
        </div>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  )
}
