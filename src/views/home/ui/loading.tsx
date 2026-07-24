import { GuesthouseCarouselSkeleton } from "./guesthouse-carousel"
import { HomeSearchBarSkeleton } from "./home-search-bar"

export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-8 p-6 md:p-10">
      <HomeSearchBarSkeleton />

      <section aria-labelledby="popular-heading">
        <h2
          id="popular-heading"
          className="mb-4 text-xl font-semibold md:text-2xl"
        >
          인기
        </h2>
        <GuesthouseCarouselSkeleton />
      </section>

      <section aria-labelledby="recommended-heading">
        <h2
          id="recommended-heading"
          className="mb-4 text-xl font-semibold md:text-2xl"
        >
          추천
        </h2>
        <GuesthouseCarouselSkeleton />
      </section>

      <section aria-labelledby="new-heading">
        <h2 id="new-heading" className="mb-4 text-xl font-semibold md:text-2xl">
          신규
        </h2>
        <GuesthouseCarouselSkeleton />
      </section>
    </div>
  )
}
