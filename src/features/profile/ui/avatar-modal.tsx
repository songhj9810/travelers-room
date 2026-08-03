"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import {
  ImageAdd01Icon,
  ImageNotFound02Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"

import { useUpdateProfile } from "@/features/profile"

import type { Tables } from "@/shared/api/supabase/types"
import { Button } from "@/shared/ui/button"
import {
  ResponsiveModal,
  type ResponsiveModalProps,
} from "@/shared/ui/responsive-modal"

type AvatarModalProps = Pick<ResponsiveModalProps, "open" | "onOpenChange"> & {
  avatar: Tables<"profiles">["avatar"]
}

export function AvatarModal({ open, onOpenChange, avatar }: AvatarModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // undefined: 변경 없음 / null: 삭제 / File: 새 이미지
  const [file, setFile] = useState<File | null | undefined>(undefined)
  const [preview, setPreview] = useState<string | undefined>(undefined)

  const { mutate: updateProfile, isPending } = useUpdateProfile()

  const handleChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0]
    e.target.value = ""

    if (!newFile) return

    setFile(newFile)
    setPreview(URL.createObjectURL(newFile))
  }

  const handleRemoveAvatar = () => {
    setFile(null)
    setPreview(undefined)
  }

  const handleSubmit = () => {
    if (file === undefined) {
      onOpenChange(false)
      return
    }

    updateProfile(
      { newAvatarFile: file },
      {
        onSuccess: () => {
          onOpenChange(false)
          toast.success("프로필 이미지를 변경했어요", {
            position: "top-center",
          })
        },
        onError: (error) => {
          toast.error(error.message, { position: "top-center" })
        },
      }
    )
  }

  // 모달이 열릴 때 파일과 미리보기를 초기화
  useEffect(() => {
    if (open) {
      setFile(undefined)
      setPreview(undefined)
    }
  }, [open])

  // 미리보기 URL을 해제하여 메모리 누수 방지
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="프로필 이미지 변경"
      footer={
        <Button type="button" onClick={handleSubmit} disabled={isPending}>
          {isPending && (
            <HugeiconsIcon
              icon={Loading03Icon}
              size={16}
              strokeWidth={2}
              data-icon="inline-start"
              role="status"
              aria-label="로딩 중"
              className="animate-spin"
            />
          )}
          저장
        </Button>
      }
      close={
        <Button type="button" variant="outline" disabled={isPending}>
          취소
        </Button>
      }
    >
      <div className="flex flex-col items-center gap-4 md:gap-6">
        <div className="relative aspect-square size-30 overflow-hidden rounded-full outline-2 outline-accent md:size-40">
          <Image
            src={
              preview ||
              (file === null ? "/avatar.svg" : avatar || "/avatar.svg")
            }
            alt="프로필 이미지"
            fill
            sizes="(max-width: 768px) 120px, 160px"
            className="object-cover"
          />
        </div>

        <div className="grid w-1/2 min-w-fit grid-cols-1 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
          >
            <HugeiconsIcon
              icon={ImageAdd01Icon}
              size={16}
              strokeWidth={2}
              data-icon="inline-start"
              aria-hidden
            />
            새 이미지 업로드
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleRemoveAvatar}
            disabled={
              file === null || (file === undefined && !avatar) || isPending
            }
          >
            <HugeiconsIcon
              icon={ImageNotFound02Icon}
              size={16}
              strokeWidth={2}
              data-icon="inline-start"
              aria-hidden
            />
            기본 이미지 사용
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChangeAvatar}
          hidden
        />
      </div>
    </ResponsiveModal>
  )
}
