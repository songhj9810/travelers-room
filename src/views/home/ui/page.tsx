import { fetchGuesthouses } from "@/entities/guesthouse/server"

import { GuesthouseCarousel } from "./guesthouse-carousel"
import { HomeSearchBar } from "./home-search-bar"

// ISR 주기
export const revalidate = 3600 // 1시간

export default async function Page() {
  const [popularGuesthouses, recommendedGuesthouses, newGuesthouses] =
    await Promise.all([
      fetchGuesthouses({ sort: "wishlisted_count" }),
      fetchGuesthouses({ sort: "avg_rating" }),
      fetchGuesthouses({ sort: "created_at" }),
    ])

  return (
    <div className="flex w-full flex-col gap-8 p-6 md:p-10">
      <HomeSearchBar />

      <section aria-labelledby="popular-heading">
        <h2
          id="popular-heading"
          className="mb-4 text-xl font-semibold md:text-2xl"
        >
          인기
        </h2>
        <GuesthouseCarousel items={popularGuesthouses} />
      </section>

      <section aria-labelledby="recommended-heading">
        <h2
          id="recommended-heading"
          className="mb-4 text-xl font-semibold md:text-2xl"
        >
          추천
        </h2>
        <GuesthouseCarousel items={recommendedGuesthouses} />
      </section>

      <section aria-labelledby="new-heading">
        <h2 id="new-heading" className="mb-4 text-xl font-semibold md:text-2xl">
          신규
        </h2>
        <GuesthouseCarousel items={newGuesthouses} />
      </section>
    </div>
  )
}
