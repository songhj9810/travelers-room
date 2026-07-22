"use client"

import Link from "next/link"
import { useState } from "react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Loading03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"

import { PATHS } from "@/shared/config/paths"
import { getSupabaseErrorMessage } from "@/shared/lib/error"
import { Button } from "@/shared/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"

import { useForgotPassword } from "../model/password.mutations"
import {
  type ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "../model/password.schema"

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: standardSchemaResolver(forgotPasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
    },
  })

  const { mutate: forgotPassword, isPending } = useForgotPassword()

  const handleSubmit: SubmitHandler<ForgotPasswordFormValues> = (values) => {
    forgotPassword(
      { email: values.email },
      {
        onSuccess: () => {
          form.reset()
          setSent(true)
        },
        onError: (error) => {
          toast.error(getSupabaseErrorMessage({ error }), {
            position: "top-center",
          })
        },
      }
    )
  }

  return (
    <>
      {sent ? (
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-lg">메일함을 확인해주세요</CardTitle>
          </CardHeader>

          <CardContent>비밀번호 재설정 링크가 담긴 메일을 보냈어요</CardContent>

          <CardFooter className="justify-center">
            <Button type="button" variant="secondary">
              <Link href={PATHS.AUTH.LOGIN}>로그인하러 가기</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold">
              비밀번호를 잊으셨나요?
            </CardTitle>
            <CardDescription>
              이메일로 비밀번호 재설정 링크를 보내드려요
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              id="forgot-password-form"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FieldGroup>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email">이메일</FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="user@example.com"
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
                  form="forgot-password-form"
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
                  확인
                </Button>
              </FieldGroup>
            </form>
          </CardContent>

          <CardFooter className="justify-center">
            <FieldDescription className="text-center">
              아직 계정이 없으신가요?{" "}
              <Link href={PATHS.AUTH.SIGNUP}>회원가입</Link>
            </FieldDescription>
          </CardFooter>
        </Card>
      )}
    </>
  )
}
