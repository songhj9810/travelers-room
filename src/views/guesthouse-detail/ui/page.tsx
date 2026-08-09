import {
  Call02Icon,
  CircleParkingOffIcon,
  InstagramIcon,
  Location08Icon,
  MuteIcon,
  ParkingAreaCircleIcon,
  SmileIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { formatTime } from "@/entities/guesthouse"
import { fetchGuesthouse, fetchRooms } from "@/entities/guesthouse/server"
import { fetchReviewsByGuesthouse } from "@/entities/review"

import { getQueryClient } from "@/shared/api/get-query-client"
import { queryKeys } from "@/shared/api/query-keys"
import { createClient } from "@/shared/api/supabase/server"
import { ImageCarousel } from "@/shared/ui/image-carousel"
import { NaverMap } from "@/shared/ui/naver-map"
import { Separator } from "@/shared/ui/separator"

import { IntroSection } from "./intro-section"
import { ReviewListSection } from "./review-list-section"
import { RoomList } from "./room-list"
import { SectionNav } from "./section-nav"

// ISR 주기
export const revalidate = 3600 // 1시간

export default async function Page({
  params,
}: {
  params: Promise<{ guesthouseId: string }>
}) {
  const { guesthouseId } = await params

  const [guesthouse, rooms] = await Promise.all([
    fetchGuesthouse({ guesthouseId }),
    fetchRooms({ guesthouseId }),
  ])

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: guesthouse.name,
    description: guesthouse.description,
    image: guesthouse.images.length > 0 ? guesthouse.images[0] : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: guesthouse.address,
      addressCountry: "KR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: guesthouse.latitude,
      longitude: guesthouse.longitude,
    },
    telephone: guesthouse.contact || undefined,
    checkinTime: guesthouse.check_in,
    checkoutTime: guesthouse.check_out,
    priceRange:
      rooms.length > 0
        ? `${Math.min(...rooms.map((room) => room.base_price))}원~`
        : undefined,
  }

  // prefetch
  const queryClient = getQueryClient()
  const supabase = await createClient()
  // eslint-disable-next-line @tanstack/query/exhaustive-deps
  await queryClient.prefetchQuery({
    queryKey: queryKeys.reviews.byGuesthousePage(guesthouseId, 0),
    queryFn: () =>
      fetchReviewsByGuesthouse({ supabase, guesthouseId, page: 0 }),
  })

  const { icon: CheckInIcon, text: checkInTime } = formatTime(
    guesthouse.check_in
  )
  const { icon: CheckOutIcon, text: checkOutTime } = formatTime(
    guesthouse.check_out
  )

  return (
    <div className="flex w-full flex-col gap-8 pb-6 md:pb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <ImageCarousel name={guesthouse.name} images={guesthouse.images} />

      <IntroSection guesthouse={guesthouse} />

      <SectionNav />

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
            <div className="-mx-2 grid grid-cols-[auto_1fr] items-center gap-1.5 rounded-2xl bg-muted/50 p-4 text-sm">
              <HugeiconsIcon
                icon={CheckInIcon}
                size={16}
                strokeWidth={2}
                aria-hidden
                className="size-4 shrink-0"
              />
              <span>체크인은 {checkInTime}시부터예요</span>

              <HugeiconsIcon
                icon={CheckOutIcon}
                size={16}
                strokeWidth={2}
                aria-hidden
                className="size-4 shrink-0"
              />
              <span>체크아웃은 {checkOutTime}시까지예요</span>

              <HugeiconsIcon
                icon={
                  guesthouse.parking
                    ? ParkingAreaCircleIcon
                    : CircleParkingOffIcon
                }
                size={16}
                strokeWidth={2}
                aria-hidden
                className="size-4 shrink-0"
              />
              <span>
                주차가 {guesthouse.parking ? "가능해요" : "불가능해요"}
              </span>

              <HugeiconsIcon
                icon={guesthouse.party ? SmileIcon : MuteIcon}
                size={16}
                strokeWidth={2}
                aria-hidden
                className="size-4 shrink-0"
              />
              <span>파티가 {guesthouse.party ? "있어요" : "없어요"}</span>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold md:text-2xl">소개</h2>
            <div className="-mx-2 rounded-2xl bg-muted/50 p-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {guesthouse.description ||
                  "호스트가 아직 소개글을 등록하지 않았어요"}
              </p>
            </div>
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
        <RoomList rooms={rooms} />
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
          <p className="flex items-center gap-1.5">
            <HugeiconsIcon
              icon={Location08Icon}
              size={16}
              strokeWidth={2}
              aria-hidden
              className="size-4 shrink-0"
            />
            <span>{guesthouse.address}</span>
          </p>
          {guesthouse.contact && (
            <a
              href={`tel:${guesthouse.contact}`}
              className="flex items-center gap-1.5"
            >
              <HugeiconsIcon
                icon={Call02Icon}
                size={16}
                strokeWidth={2}
                aria-hidden
                className="size-4 shrink-0"
              />
              <span>{guesthouse.contact}</span>
            </a>
          )}
          {guesthouse.sns && (
            <a
              href={`https://instagram.com/${guesthouse.sns}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5"
            >
              <HugeiconsIcon
                icon={InstagramIcon}
                size={16}
                strokeWidth={2}
                aria-hidden
                className="size-4 shrink-0"
              />
              <span>@{guesthouse.sns}</span>
            </a>
          )}
        </div>
        <div className="flex aspect-video items-center justify-center">
          <NaverMap
            markers={[
              {
                id: guesthouse.id,
                name: guesthouse.name,
                lat: guesthouse.latitude,
                lng: guesthouse.longitude,
              },
            ]}
            activeId={guesthouse.id}
          />
        </div>
      </section>

      <Separator className="h-2! bg-border/50" />

      {/* prefetch */}
      <HydrationBoundary state={dehydrate(queryClient)}>
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
          <ReviewListSection guesthouseId={guesthouse.id} />
        </section>
      </HydrationBoundary>
    </div>
  )
}
