import Image from "next/image"
import { MailAtSign01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import type { Tables } from "@/shared/api/supabase/types"

type ProviderIconProps = {
  provider: Tables<"profiles">["provider"] | null
}

export function ProviderIcon({ provider }: ProviderIconProps) {
  switch (provider) {
    case "email":
      return (
        <HugeiconsIcon
          icon={MailAtSign01Icon}
          strokeWidth={2}
          aria-hidden
          className="size-5 shrink-0 md:size-6"
        />
      )

    case "google":
      return (
        <Image
          src="/google-provider.svg"
          alt=""
          width={28}
          height={28}
          className="h-6 w-6 shrink-0 md:h-7 md:w-7"
        />
      )

    case "kakao":
      return (
        <Image
          src="/kakao-provider.png"
          alt=""
          width={28}
          height={28}
          className="h-6 w-6 shrink-0 md:h-7 md:w-7"
        />
      )

    default:
      return null
  }
}
