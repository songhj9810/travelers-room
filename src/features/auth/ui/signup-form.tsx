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

import { useSignup } from "../model/auth.mutations"
import { type SignupFormValues, signupSchema } from "../model/auth.schema"

export function SignupForm() {
  const [sent, setSent] = useState(false)

  const form = useForm<SignupFormValues>({
    resolver: standardSchemaResolver(signupSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const { mutate: signup, isPending } = useSignup()

  const handleSubmit: SubmitHandler<SignupFormValues> = (values) => {
    signup(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          form.reset()
          setSent(true)
        },
        onError: (error) => {
          form.resetField("password")
          form.resetField("confirmPassword")
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

          <CardContent>인증 링크가 담긴 메일을 보냈어요</CardContent>

          <CardFooter className="justify-center">
            <Button type="button" variant="secondary">
              <Link href={PATHS.AUTH.LOGIN}>로그인하러 가기</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold">회원가입</CardTitle>
          </CardHeader>

          <CardContent>
            <form id="signup-form" onSubmit={form.handleSubmit(handleSubmit)}>
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

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="password">비밀번호</FieldLabel>
                      <Input
                        {...field}
                        id="password"
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
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="confirmPassword">
                        비밀번호 확인
                      </FieldLabel>
                      <Input
                        {...field}
                        id="confirmPassword"
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
                  form="signup-form"
                  disabled={isPending}
                  className="bg-neutral text-neutral-foreground hover:bg-neutral"
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
                  회원가입
                </Button>
              </FieldGroup>
            </form>
          </CardContent>

          <CardFooter className="justify-center">
            <FieldDescription className="text-center">
              이미 계정이 있으신가요?{" "}
              <Link href={PATHS.AUTH.LOGIN}>로그인</Link>
            </FieldDescription>
          </CardFooter>
        </Card>
      )}
    </>
  )
}
