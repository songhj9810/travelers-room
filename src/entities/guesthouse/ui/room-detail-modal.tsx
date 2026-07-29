import {
  AddTeamIcon,
  Bathtub01Icon,
  DoorOpenIcon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import type { Tables } from "@/shared/api/supabase/types"
import { ImageCarousel } from "@/shared/ui/image-carousel"
import {
  ResponsiveModal,
  type ResponsiveModalProps,
} from "@/shared/ui/responsive-modal"

import { formatBeds } from "./formatter"

type RoomDetailModalProps = Pick<
  ResponsiveModalProps,
  "open" | "onOpenChange"
> & {
  room: Tables<"rooms">
}

export function RoomDetailModal({
  open,
  onOpenChange,
  room: {
    name,
    description,
    images,
    room_type,
    beds,
    bathroom,
    base_price,
    extra_person_fee,
    base_capacity,
    max_capacity,
  },
}: RoomDetailModalProps) {
  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title={name}
      footer={<div />}
    >
      <div className="flex flex-col gap-6">
        <ImageCarousel name={name} images={images} />

        <div>
          <h3 className="mb-0.5 text-lg font-semibold md:text-xl">{name}</h3>
          <p className="text-lg font-semibold md:text-xl">
            {base_price.toLocaleString()}원
          </p>
        </div>

        <div>
          <h4 className="mb-2 text-base font-medium md:text-lg">이용 안내</h4>
          <div className="-mx-2 grid grid-cols-[auto_1fr_auto_1fr] items-center gap-1.5 rounded-2xl bg-muted/50 p-4 text-sm">
            <HugeiconsIcon
              icon={UserMultiple02Icon}
              size={16}
              strokeWidth={2}
              aria-hidden
              className="size-4 shrink-0"
            />
            <span>
              기준 {base_capacity}인(최대 {max_capacity}인)
            </span>

            <HugeiconsIcon
              icon={DoorOpenIcon}
              size={16}
              strokeWidth={2}
              aria-hidden
              className="size-4 shrink-0"
            />
            <span>{`${{ PRIVATE: "나만 쓰는 방이에요", DORMITORY: "다른 사람과 함께 쓰는 방이에요" }[room_type]}`}</span>

            <HugeiconsIcon
              icon={formatBeds(beds).icon}
              size={16}
              strokeWidth={2}
              aria-hidden
              className="size-4 shrink-0"
            />
            <span>{formatBeds(beds).text}</span>

            <HugeiconsIcon
              icon={Bathtub01Icon}
              size={16}
              strokeWidth={2}
              aria-hidden
              className="size-4 shrink-0"
            />
            <span>{bathroom ? "개별 욕실" : "공용 욕실"}</span>

            {!!extra_person_fee && (
              <>
                <HugeiconsIcon
                  icon={AddTeamIcon}
                  size={16}
                  strokeWidth={2}
                  aria-hidden
                  className="size-4 shrink-0"
                />
                <span className="col-span-3">
                  기준 인원 초과 시 인당 {extra_person_fee.toLocaleString()}
                  원의 추가 요금이 발생해요
                </span>
              </>
            )}
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-base font-medium md:text-lg">소개</h4>
          <div className="-mx-2 rounded-2xl bg-muted/50 p-4">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {description || "호스트가 아직 소개글을 등록하지 않았어요"}
            </p>
          </div>
        </div>
      </div>
    </ResponsiveModal>
  )
}
