"use client"

import { useEffect } from "react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Loading03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"

import type { Wishlist } from "@/entities/wishlist"

import { Button } from "@/shared/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import {
  ResponsiveModal,
  type ResponsiveModalProps,
} from "@/shared/ui/responsive-modal"

import { type WishlistFormValues, wishlistSchema } from "../model/schema"
import { useUpdateWishlist } from "../model/wishlist.mutations"

type RenameFormModalProps = Pick<
  ResponsiveModalProps,
  "open" | "onOpenChange"
> & {
  wishlist: Wishlist
}

export function RenameFormModal({
  open,
  onOpenChange,
  wishlist: { id, name },
}: RenameFormModalProps) {
  const form = useForm<WishlistFormValues>({
    resolver: standardSchemaResolver(wishlistSchema),
    mode: "onSubmit",
    defaultValues: {
      name: name,
    },
  })

  const { mutate: updateWishlist, isPending } = useUpdateWishlist()

  const handleSubmit: SubmitHandler<WishlistFormValues> = (values) => {
    const newName = values.name.trim()
    if (newName === name) {
      onOpenChange(false)
      return
    }

    updateWishlist(
      {
        wishlistId: id,
        newName,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
        onError: (error) => {
          toast.error(error.message, { position: "top-center" })
        },
      }
    )
  }

  // 모달이 열릴 때 폼을 초기화
  useEffect(() => {
    if (open) form.reset({ name })
  }, [open, form, name])

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="위시리스트 이름 변경"
      footer={
        <Button type="submit" form="rename-form" disabled={isPending}>
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
      <form id="rename-form" onSubmit={form.handleSubmit(handleSubmit)}>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">위시리스트 이름</FieldLabel>
                <Input
                  {...field}
                  id="name"
                  type="text"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
    </ResponsiveModal>
  )
}
