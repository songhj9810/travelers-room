"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import {
  Cancel01Icon,
  ImageAdd02Icon,
  Loading03Icon,
  StarIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"

import { cn } from "@/shared/lib/utils"
import { useOpenConfirmModal } from "@/shared/store/confirm-modal.store"
import { Button } from "@/shared/ui/button"
import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/carousel"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field"
import { ResponsiveModal } from "@/shared/ui/responsive-modal"
import { Textarea } from "@/shared/ui/textarea"

import { useEditorModal } from "../model/editor-modal.store"
import { useCreateReview, useUpdateReview } from "../model/mutations"
import { type ReviewFormValues, reviewSchema } from "../model/schema"

export function EditorModal() {
  const { isOpen, mode, guesthouseId, review, close } = useEditorModal()
  const openConfirmModal = useOpenConfirmModal()

  const [hoverRating, setHoverRating] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<ReviewFormValues>({
    resolver: standardSchemaResolver(reviewSchema),
    mode: "onSubmit",
    defaultValues: {
      rating: 0,
      content: "",
      images: [],
    },
  })

  const { mutate: createReview, isPending: isCreating } = useCreateReview()
  const { mutate: updateReview, isPending: isUpdating } = useUpdateReview()

  const isPending = isCreating || isUpdating

  const rating = form.watch("rating")
  const images = form.watch("images")

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // 선택된 파일들을 폼의 images 필드에 맞는 형태로 변환
      const files = Array.from(e.target.files)
      const newImages: ReviewFormValues["images"] = files.map((file) => ({
        type: "new",
        file,
        preview: URL.createObjectURL(file), // 미리보기 URL 생성
      }))
      // 폼의 images 필드 업데이트
      form.setValue(
        "images",
        [...images, ...newImages].slice(0, 6), // 기존 이미지 배열에 새로 추가된 이미지들을 합쳐서 최대 6개까지만 유지
        { shouldDirty: true } // dirty 상태로 설정하여 폼이 수정되었음을 표시
      )
    }
    e.target.value = ""
  }

  const handleRemoveImage = (index: number) => {
    // 제거할 이미지가 새로 추가된 이미지인 경우, 미리보기 URL 해제
    const target = images[index]
    if (target.type === "new") URL.revokeObjectURL(target.preview)
    // 폼의 images 필드 업데이트
    form.setValue(
      "images",
      images.filter((_, i) => i !== index), // 기존 이미지 배열에서 해당 인덱스의 이미지 제거
      { shouldDirty: true } // dirty 상태로 설정하여 폼이 수정되었음을 표시
    )
  }

  const handleSubmit: SubmitHandler<ReviewFormValues> = (values) => {
    const newImages = values.images
      ? values.images.filter((image) => image.type === "new")
      : []
    const imagesToUpload = newImages.map((image) => image.file) // 추가할 이미지 파일 추출

    if (mode === "create" && guesthouseId) {
      createReview(
        {
          guesthouseId,
          rating: values.rating,
          content: values.content,
          imagesToUpload,
        },
        {
          onSuccess: () => {
            close()
            toast.success("리뷰를 작성했어요", { position: "top-center" })
          },
          onError: (error) => {
            toast.error(error.message, { position: "top-center" })
          },
        }
      )
    }

    if (mode === "edit" && review) {
      const oldImages = values.images
        ? values.images.filter((image) => image.type === "old")
        : []
      const imagesToRemove = (review.images ?? []).filter(
        (url) => !oldImages.map((image) => image.url).includes(url)
      ) // 제거할 이미지 URL 추출

      updateReview(
        {
          reviewId: review.id,
          newRating: values.rating,
          newContent: values.content,
          imagesToUpload,
          imagesToRemove,
        },
        {
          onSuccess: () => {
            close()
            toast.success("리뷰를 수정했어요", { position: "top-center" })
          },
          onError: (error) => {
            toast.error(error.message, { position: "top-center" })
          },
        }
      )
    }
  }

  const handleClose = () => {
    if (form.formState.isDirty) {
      openConfirmModal({
        title:
          mode === "create"
            ? "리뷰 작성을 취소할까요?"
            : "리뷰 수정을 취소할까요?",
        description: "작성 중인 내용이 사라져요",
        onConfirm: () => close(),
      })
      return
    }
    close()
  }

  useEffect(() => {
    // 모달이 닫힐 때, 새로 생성된 미리보기 URL을 해제하여 메모리 누수 방지
    if (!isOpen) {
      const images = form.getValues("images")
      images.forEach((image) => {
        if (image.type === "new") URL.revokeObjectURL(image.preview)
      })
      return
    }

    // 모달이 열릴 때 폼을 초기화
    if (isOpen) {
      form.reset({
        rating: review?.rating ?? 0,
        content: review?.content ?? "",
        images: review?.images.map((url) => ({ type: "old", url })) ?? [],
      })
    }
  }, [isOpen, form, review])

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={handleClose}
      size="lg"
      title={mode === "create" ? "리뷰 작성하기" : "리뷰 수정하기"}
      footer={
        <Button
          type="submit"
          form={mode === "create" ? "create-review-form" : "edit-review-form"}
          disabled={isPending}
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
          저장
        </Button>
      }
      close={
        <Button type="button" variant="outline" disabled={isPending}>
          취소
        </Button>
      }
    >
      <form
        id={mode === "create" ? "create-review-form" : "edit-review-form"}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FieldGroup>
          <Controller
            name="rating"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="rating">별점</FieldLabel>
                <div id="rating" className="flex items-center justify-center">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Button
                      key={star}
                      type="button"
                      variant="link"
                      onMouseEnter={() => setHoverRating(star + 1)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => field.onChange(star + 1)}
                      aria-label={`${star + 1}점`}
                      className="p-1 hover:scale-120"
                    >
                      <HugeiconsIcon
                        key={star}
                        icon={StarIcon}
                        size={24}
                        strokeWidth={2}
                        aria-hidden
                        className={cn(
                          "size-6",
                          star + 1 <= (hoverRating || rating)
                            ? "fill-chart-1 text-chart-1"
                            : "fill-muted text-muted-foreground/10"
                        )}
                      />
                    </Button>
                  ))}
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="content">내용</FieldLabel>
                <Textarea
                  {...field}
                  id="content"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="images"
            control={form.control}
            render={({ fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="images">
                  사진 ({images.length}/6)
                </FieldLabel>
                <div
                  id="images"
                  className="grid w-full grid-cols-[auto_1fr] gap-2"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={images.length >= 6}
                    aria-label="사진 추가"
                    className="size-30 rounded-lg md:size-40"
                  >
                    <HugeiconsIcon
                      icon={ImageAdd02Icon}
                      size={20}
                      strokeWidth={2}
                      aria-hidden
                      className="size-5"
                    />
                  </Button>

                  {images.length > 0 && (
                    <Carousel className="w-full min-w-0">
                      <CarouselContent spacing={2}>
                        {images.map((image, index) => (
                          <CarouselItem
                            key={index}
                            spacing={2}
                            className="basis-32 md:basis-42"
                          >
                            <div className="group relative aspect-square overflow-hidden rounded-lg">
                              <Image
                                src={
                                  image.type === "new"
                                    ? image.preview
                                    : image.url
                                }
                                alt={`사진 ${index + 1} 미리보기`}
                                fill
                                sizes="(max-width: 768px) 120px, 160px"
                                className="object-cover"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => handleRemoveImage(index)}
                                aria-label={`사진 ${index + 1} 제거`}
                                className="absolute top-0.5 right-0.5 z-10 group-hover:bg-muted group-hover:text-foreground dark:group-hover:bg-muted/50"
                              >
                                <HugeiconsIcon
                                  icon={Cancel01Icon}
                                  size={12}
                                  strokeWidth={2}
                                  aria-hidden
                                />
                              </Button>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAddImage}
                    multiple
                    hidden
                  />
                </div>
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
