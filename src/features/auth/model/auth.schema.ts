import { z } from "zod"

// 로그인
export const loginSchema = z.object({
  email: z
    .email({ error: "올바른 형식의 이메일 주소를 입력해주세요" })
    .min(1, { error: "이메일 주소를 입력해주세요" }),
  password: z.string().min(1, { error: "비밀번호를 입력해주세요" }),
})

export type LoginFormValues = z.input<typeof loginSchema>

// 회원가입
export const signupSchema = z
  .object({
    email: z
      .email({ error: "올바른 형식의 이메일 주소를 입력해주세요" })
      .min(1, { error: "이메일 주소를 입력해주세요" })
      .max(254, { error: "이메일 주소는 254자 이하여야 해요" }),
    password: z
      .string()
      .min(8, { error: "비밀번호는 8자 이상이어야 해요" })
      .max(64, { error: "비밀번호는 64자 이하여야 해요" })
      .regex(/^\S*$/, "비밀번호에 공백을 사용할 수 없어요")
      .regex(/[a-zA-Z]/, { error: "비밀번호에 영문이 포함되어야 해요" })
      .regex(/\d/, { error: "비밀번호에 숫자가 포함되어야 해요" }),
    confirmPassword: z
      .string()
      .min(1, { error: "비밀번호 확인을 입력해주세요" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "비밀번호와 비밀번호 확인이 달라요",
  })

export type SignupFormValues = z.input<typeof signupSchema>
