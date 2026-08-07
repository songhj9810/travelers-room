"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Loading03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Provider } from "@supabase/supabase-js"

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
  FieldSeparator,
} from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { topToast } from "@/shared/ui/toast"

import {
  useLoginWithOAuth,
  useLoginWithPassword,
} from "../model/auth.mutations"
import { type LoginFormValues, loginSchema } from "../model/auth.schema"

export function LoginForm() {
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: standardSchemaResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { mutate: loginWithPassword, isPending: isPasswordLoginPending } =
    useLoginWithPassword()
  const { mutate: loginWithOAuth, isPending: isOAuthLoginPending } =
    useLoginWithOAuth()

  const isPending = isPasswordLoginPending || isOAuthLoginPending

  const handleSubmit: SubmitHandler<LoginFormValues> = (values) => {
    loginWithPassword(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          router.refresh()
          router.replace(PATHS.HOME)
        },
        onError: (error) => {
          topToast.add({
            type: "error",
            description: getSupabaseErrorMessage({ error }),
            priority: "high",
          })
        },
      }
    )
  }

  const handleOAuthLogin = ({ provider }: { provider: Provider }) => {
    loginWithOAuth(
      { provider },
      {
        onError: (error) => {
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
        <CardTitle className="text-xl font-semibold">로그인</CardTitle>
      </CardHeader>

      <CardContent>
        <form id="login-form" onSubmit={form.handleSubmit(handleSubmit)}>
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
                  <div className="flex items-center justify-between gap-3">
                    <FieldLabel htmlFor="password">비밀번호</FieldLabel>
                    <FieldDescription className="leading-snug [&>a]:no-underline [&>a:hover]:underline">
                      <Link href={PATHS.AUTH.FORGOT_PASSWORD}>
                        비밀번호를 잊으셨나요?
                      </Link>
                    </FieldDescription>
                  </div>
                  <Input
                    {...field}
                    id="password"
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
              form="login-form"
              disabled={isPending}
              className="bg-neutral text-neutral-foreground hover:bg-neutral"
            >
              {isPasswordLoginPending && (
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
              로그인
            </Button>

            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
              또는
            </FieldSeparator>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={() => handleOAuthLogin({ provider: "google" })}
                disabled={isPending}
                className="bg-[#F2F2F2] text-[#1F1F1F] hover:bg-[#F2F2F2]"
              >
                <Image
                  src="/google-login.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
                구글 로그인
              </Button>

              <Button
                type="button"
                onClick={() => handleOAuthLogin({ provider: "kakao" })}
                disabled={isPending}
                className="bg-[#FEE500] text-[#000000]/85 hover:bg-[#FEE500]"
              >
                <Image
                  src="/kakao-login.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
                카카오 로그인
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="justify-center">
        <FieldDescription className="text-center">
          아직 계정이 없으신가요? <Link href={PATHS.AUTH.SIGNUP}>회원가입</Link>
        </FieldDescription>
      </CardFooter>
    </Card>
  )
}
