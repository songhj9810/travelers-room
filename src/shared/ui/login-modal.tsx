"use client"

import { useRouter } from "next/navigation"

import { PATHS } from "@/shared/config/paths"
import { useLoginModal } from "@/shared/store/login-modal.store"
import { Button } from "@/shared/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"

export function LoginModal() {
  const router = useRouter()
  const { isOpen, close } = useLoginModal()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent
        showCloseButton={false}
        className="grid max-w-xs gap-6 p-6 sm:max-w-md"
      >
        <DialogHeader className="grid grid-rows-[auto_1fr] place-items-center p-0 text-center sm:place-items-start sm:text-left">
          <DialogTitle className="text-lg leading-normal">
            로그인이 필요해요
          </DialogTitle>
          <DialogDescription className="text-balance md:text-pretty">
            로그인 페이지로 이동할까요?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col-reverse p-0 sm:flex-row sm:justify-end md:flex-row md:justify-end">
          <DialogClose
            render={
              <Button type="button" variant="outline" onClick={() => close()}>
                취소
              </Button>
            }
          />
          <Button
            type="button"
            onClick={() => {
              close()
              router.push(PATHS.AUTH.LOGIN)
            }}
          >
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
