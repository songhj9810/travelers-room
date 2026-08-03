"use client"

import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Loading03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import { useDebounceValue } from "usehooks-ts"

import { useCheckNickname } from "@/entities/profile"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { Field, FieldError, FieldGroup } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"

import { useUpdateProfile } from "../model/mutations"
import { type NicknameFormValues, nicknameSchema } from "../model/schema"

type NicknameFormProps = {
  currentNickname: string
  onClose: () => void
}

export function NicknameForm({ currentNickname, onClose }: NicknameFormProps) {
  const form = useForm<NicknameFormValues>({
    resolver: standardSchemaResolver(nicknameSchema),
    mode: "onChange",
  })

  const nickname = form.watch("nickname")
  const [debouncedNickname] = useDebounceValue(nickname, 500) // 0.5초 지연

  const { data: isAvailable, isFetching: isChecking } = useCheckNickname({
    nickname: debouncedNickname,
    currentNickname,
  })

  const { mutate: updateProfile, isPending } = useUpdateProfile()

  const handleSubmit: SubmitHandler<NicknameFormValues> = (values) => {
    updateProfile(
      { newNickname: values.nickname },
      {
        onSuccess: () => {
          onClose()
          toast.success("닉네임을 변경했어요", { position: "top-center" })
        },
        onError: (error) => {
          toast.error(error.message, { position: "top-center" })
        },
      }
    )
  }

  return (
    <>
      <form
        id="nickname-form"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-2 min-w-40 flex-1"
      >
        <FieldGroup>
          <Controller
            name="nickname"
            control={form.control}
            defaultValue={currentNickname}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || isAvailable === false}>
                <Input
                  {...field}
                  id="nickname"
                  type="text"
                  aria-invalid={fieldState.invalid || isAvailable === false}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                {!fieldState.invalid &&
                  (isChecking || isAvailable !== undefined) && (
                    <div
                      className={cn(
                        "flex h-5 items-center text-sm font-normal",
                        isChecking
                          ? "text-muted-foreground" // 중복 확인 중
                          : isAvailable
                            ? "text-green-700 dark:text-green-300" // 사용할 수 있는 닉네임
                            : "text-destructive" // 이미 사용 중인 닉네임
                      )}
                    >
                      {isChecking ? (
                        <HugeiconsIcon
                          icon={Loading03Icon}
                          size={16}
                          strokeWidth={2}
                          data-icon="inline-start"
                          role="status"
                          aria-label="중복 확인 중"
                          className="size-4 shrink-0 animate-spin"
                        />
                      ) : isAvailable ? (
                        "사용할 수 있는 닉네임이에요"
                      ) : (
                        "이미 사용 중인 닉네임이에요"
                      )}
                    </div>
                  )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            onClose()
            form.reset()
          }}
          disabled={isPending}
        >
          취소
        </Button>
        <Button
          type="submit"
          form="nickname-form"
          size="sm"
          disabled={isPending || isChecking || isAvailable === false}
        >
          저장
        </Button>
      </div>
    </>
  )
}
