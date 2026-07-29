import { z } from "zod"

export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, { error: "별점은 최소 1점까지 선택할 수 있어요" })
    .max(5, { error: "별점은 최대 5점까지 선택할 수 있어요" }),
  content: z
    .string()
    .min(1, { error: "내용을 입력해주세요" })
    .max(2000, { error: "최대 2,000자까지 입력할 수 있어요" }),
  images: z
    .array(
      z.discriminatedUnion("type", [
        z.object({ type: z.literal("old"), url: z.url() }),
        z.object({
          type: z.literal("new"),
          file: z.file({ error: "유효한 파일을 선택해주세요" }),
          preview: z.url(),
        }),
      ])
    )
    .max(6, { error: "최대 6장까지 첨부할 수 있어요" }),
})

export type ReviewFormValues = z.input<typeof reviewSchema>
