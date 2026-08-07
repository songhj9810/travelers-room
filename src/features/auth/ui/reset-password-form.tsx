"use client"

import { useRouter } from "next/navigation"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Loading03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { PATHS } from "@/shared/config/paths"
import { getSupabaseErrorMessage } from "@/shared/lib/error"
import { Button } from "@/shared/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { topToast } from "@/shared/ui/toast"

import { useResetPassword } from "../model/password.mutations"
import {
  type ResetPasswordFormValues,
  resetPasswordSchema,
} from "../model/password.schema"

export function ResetPasswordForm() {
  const router = useRouter()

  const form = useForm<ResetPasswordFormValues>({
    resolver: standardSchemaResolver(resetPasswordSchema),
    mode: "onTouched",
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  })

  const { mutate: resetPassword, isPending } = useResetPassword()

  const handleSubmit: SubmitHandler<ResetPasswordFormValues> = (values) => {
    resetPassword(
      { newPassword: values.newPassword },
      {
        onSuccess: () => {
          topToast.add({
            type: "success",
            description: "비밀번호를 재설정했어요",
          })
          router.replace(PATHS.HOME)
        },
        onError: (error) => {
          form.reset()
          topToast.add({
            type: "error",
            description: getSupabaseErrorMessage({ error }),
            priority: "high",
          })
        },
      }
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold">비밀번호 재설정</CardTitle>
        <CardDescription>새로운 비밀번호를 입력해주세요</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="reset-password-form"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FieldGroup>
            <Controller
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="newPassword">비밀번호</FieldLabel>
                  <Input
                    {...field}
                    id="newPassword"
                    type="password"
                    placeholder="영문/숫자 포함 8자 이상 64자 이하"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirmNewPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmNewPassword">
                    비밀번호 확인
                  </FieldLabel>
                  <Input
                    {...field}
                    id="confirmNewPassword"
                    type="password"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              form="reset-password-form"
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
              비밀번호 재설정
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
