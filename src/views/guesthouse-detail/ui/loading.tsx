import { ReviewListSkeleton } from "@/widgets/review-list"

import { Separator } from "@/shared/ui/separator"
import { Skeleton } from "@/shared/ui/skeleton"

import { IntroSectionSkeleton } from "./intro-section"
import { RoomListSkeleton } from "./room-list"
import { SectionNavSkeleton } from "./section-nav"

export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-8 pb-6 md:pb-10">
      <Skeleton className="aspect-5/4 max-h-180 w-full rounded-none" />

      <IntroSectionSkeleton />

      <SectionNavSkeleton />

      <section
        id="overview"
        aria-label="정보"
        className="container scroll-mt-30 md:scroll-mt-38"
      >
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="mb-4 text-xl font-semibold md:text-2xl">
              이용 안내
            </h2>
            <Skeleton className="-mx-2 h-32.5 w-[calc(100%+1rem)]" />
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold md:text-2xl">소개</h2>
            <Skeleton className="-mx-2 h-32.5 w-[calc(100%+1rem)]" />
          </div>
        </div>
      </section>

      <Separator className="h-2! bg-border/50" />

      <section
        id="room-list"
        aria-labelledby="room-list-heading"
        className="container scroll-mt-30 md:scroll-mt-38"
      >
        <h2
          id="room-list-heading"
          className="mb-4 text-xl font-semibold md:text-2xl"
        >
          방
        </h2>
        <RoomListSkeleton />
      </section>

      <Separator className="h-2! bg-border/50" />

      <section
        id="location"
        aria-labelledby="location-heading"
        className="container scroll-mt-30 md:scroll-mt-38"
      >
        <h2
          id="location-heading"
          className="mb-4 text-xl font-semibold md:text-2xl"
        >
          위치
        </h2>
        <div className="mb-4 flex flex-col gap-1.5 text-sm">
          <Skeleton className="h-5 w-1/3 min-w-60" />
          <Skeleton className="h-5 w-1/3 min-w-60" />
          <Skeleton className="h-5 w-1/3 min-w-60" />
        </div>
        <Skeleton className="aspect-video h-auto w-full" />
      </section>

      <Separator className="h-2! bg-border/50" />

      <section
        id="review-list"
        aria-labelledby="review-list-heading"
        className="container scroll-mt-30 md:scroll-mt-38"
      >
        <h2
          id="review-list-heading"
          className="mb-4 text-xl font-semibold md:text-2xl"
        >
          리뷰
        </h2>
        <ReviewListSkeleton />
      </section>
    </div>
  )
}
