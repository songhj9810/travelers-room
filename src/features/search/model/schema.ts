import { z } from "zod"

import { Constants } from "@/shared/api/supabase/types"

import { PRICE_MAX, PRICE_MIN } from "../config/filter"

export const searchSchema = z
  .object({
    keyword: z.string(),
    guests: z.number().min(1).max(20),
    regions: z.array(z.enum(Constants.public.Enums.REGION)),
    priceRange: z.tuple([
      z.number().min(PRICE_MIN).max(PRICE_MAX),
      z.number().min(PRICE_MIN).max(PRICE_MAX),
    ]),
    parking: z.boolean().nullable(),
    party: z.boolean().nullable(),
  })
  .refine((data) => data.priceRange[0] <= data.priceRange[1], {
    path: ["priceRange"],
  })

export type SearchFormValues = z.input<typeof searchSchema>
