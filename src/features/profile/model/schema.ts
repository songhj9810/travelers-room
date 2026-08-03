import { z } from "zod"

export const nicknameSchema = z.object({
  nickname: z
    .string()
    .min(2, { error: "닉네임은 2자 이상이어야 해요" })
    .max(12, { error: "닉네임은 12자 이하여야 해요" })
    .regex(/^[a-zA-Z0-9가-힣]+$/, {
      message: "닉네임에는 한글, 영문, 숫자만 사용할 수 있어요",
    }),
})

export type NicknameFormValues = z.input<typeof nicknameSchema>
