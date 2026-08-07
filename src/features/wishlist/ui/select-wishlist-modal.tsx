"use client"

import { useState } from "react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Loading03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  MiniWishlistCard,
  MiniWishlistCardSkeleton,
  useBaseWishlist,
  useWishlists,
} from "@/entities/wishlist"

import { Button } from "@/shared/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { ResponsiveModal } from "@/shared/ui/responsive-modal"
import { bottomToast } from "@/shared/ui/toast"

import { type WishlistFormValues, wishlistSchema } from "../model/schema"
import { useSelectWishlistModal } from "../model/select-wishlist-modal.store"
import { useCreateWishlist } from "../model/wishlist.mutations"
import { useUpdateWishlistItem } from "../model/wishlist-item.mutations"

export function SelectWishlistModal() {
  const { isOpen, wishlistItemId, close } = useSelectWishlistModal()

  const [step, setStep] = useState<"select" | "create">("select")

  const form = useForm<WishlistFormValues>({
    resolver: standardSchemaResolver(wishlistSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
    },
  })

  const { data: wishlists, isLoading } = useWishlists()
  const { data: baseWishlist } = useBaseWishlist()

  // 순차적 비동기 실행을 위해 mutateAsync 사용
  const { mutateAsync: createWishlist, isPending: isCreating } =
    useCreateWishlist()
  const { mutate: updateWishlistItem, isPending: isUpdating } =
    useUpdateWishlistItem({ baseWishlistId: baseWishlist?.id })

  const isPending = isCreating || isUpdating

  const name = form.watch("name")

  const handleSelect = ({
    wishlistId,
    wishlistName,
  }: {
    wishlistId: string
    wishlistName: string
  }) => {
    if (!wishlistItemId) {
      bottomToast.add({
        type: "warning",
        description: "잠시 후 다시 시도해주세요",
        priority: "high",
      })
      return
    }

    updateWishlistItem(
      {
        wishlistItemId,
        newWishlistId: wishlistId,
      },
      {
        onSuccess: () => {
          close()
          bottomToast.add({
            type: "wishlist",
            title: `${wishlistName}에 담았어요`,
          })
        },
        onError: (error) => {
          bottomToast.add({
            type: "error",
            description: error.message,
            priority: "high",
          })
        },
      }
    )
  }

  const handleCreate: SubmitHandler<WishlistFormValues> = async (values) => {
    if (!wishlistItemId) {
      bottomToast.add({
        type: "warning",
        description: "잠시 후 다시 시도해주세요",
        priority: "high",
      })
      return
    }

    try {
      const newWishlist = await createWishlist({ name: values.name.trim() })
      updateWishlistItem(
        {
          wishlistItemId,
          newWishlistId: newWishlist.id,
        },
        {
          onSuccess: () => {
            close()
            bottomToast.add({
              type: "wishlist",
              title: `${newWishlist.name}에 담았어요`,
            })
          },
          onError: (error) => {
            bottomToast.add({
              type: "error",
              description: error.message,
              priority: "high",
            })
          },
        }
      )
    } catch (error) {
      bottomToast.add({
        type: "error",
        description: (error as Error).message,
        priority: "high",
      })
    }
  }

  const handleClose = () => {
    if (step === "create") {
      setStep("select")
      return
    }
    close()
  }

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose()
      }}
      title={
        step === "select" ? "위시리스트 선택하기" : "새로운 위시리스트 만들기"
      }
      footer={
        step === "select" ? (
          <Button
            type="button"
            onClick={() => {
              form.reset() // 버튼을 클릭할 때 폼을 초기화
              setStep("create")
            }}
            disabled={isPending}
          >
            새 위시리스트 만들기
          </Button>
        ) : (
          <Button
            type="submit"
            form="create-wishlist-form"
            disabled={isPending || !name.trim()}
          >
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
            확인
          </Button>
        )
      }
      close={
        <Button type="button" variant="outline" disabled={isPending}>
          취소
        </Button>
      }
    >
      {step === "select" ? (
        <div className="grid grid-cols-2 items-start gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <MiniWishlistCardSkeleton key={index} />
              ))
            : wishlists?.map((wishlist) => (
                <MiniWishlistCard
                  key={wishlist.id}
                  wishlist={wishlist}
                  onCardClick={() =>
                    handleSelect({
                      wishlistId: wishlist.id,
                      wishlistName: wishlist.name,
                    })
                  }
                />
              ))}
        </div>
      ) : (
        <form
          id="create-wishlist-form"
          onSubmit={form.handleSubmit(handleCreate)}
        >
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
      )}
    </ResponsiveModal>
  )
}
