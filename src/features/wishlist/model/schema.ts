import { z } from "zod"

export const wishlistSchema = z.object({
  name: z
    .string()
    .min(1, { error: "위시리스트 이름을 입력해주세요" })
    .max(50, { error: "위시리스트 이름은 50자 이하여야 해요" }),
})

export type WishlistFormValues = z.input<typeof wishlistSchema>
