import type { Metadata } from "next"

import { fetchGuesthouse } from "@/entities/guesthouse/server"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ guesthouseId: string }>
}): Promise<Metadata> {
  const { guesthouseId } = await params

  const guesthouse = await fetchGuesthouse({ guesthouseId })

  return {
    title: guesthouse.name,
    description: guesthouse.description,
    alternates: {
      canonical: `/guesthouses/${guesthouseId}`,
    },
    openGraph: {
      title: guesthouse.name,
      description: guesthouse.description,
      images: guesthouse.images.length > 0 ? guesthouse.images : undefined,
    },
  }
}
