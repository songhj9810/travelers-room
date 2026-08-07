import Image from "next/image"

import type { Tables } from "@/shared/api/supabase/types"
import { Badge } from "@/shared/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card"
import { Skeleton } from "@/shared/ui/skeleton"

import { formatBeds } from "./formatter"

type RoomCardProps = {
  room: Tables<"rooms">
  onCardClick?: () => void
}

export function RoomCard({
  room: {
    name,
    images,
    room_type,
    beds,
    base_price,
    base_capacity,
    max_capacity,
  },
  onCardClick,
}: RoomCardProps) {
  return (
    <button
      type="button"
      onClick={onCardClick}
      className="rounded-4xl text-start"
    >
      <Card className="mx-auto w-full max-w-sm pt-0">
        <div className="relative aspect-5/4 overflow-hidden">
          <Image
            src={images[0] || "/placeholder.jpg"}
            alt={`${name}의 대표 이미지`}
            fill
            sizes="(max-width: 40rem) 100vw, (max-width: 64rem) 50vw, 33vw"
            className="object-cover"
          />
        </div>

        <CardHeader>
          <CardAction className="row-span-1">
            {room_type === "PRIVATE" ? (
              <Badge className="bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300">
                일반
              </Badge>
            ) : (
              <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                도미토리
              </Badge>
            )}
          </CardAction>
          <CardTitle>{name}</CardTitle>
          <CardDescription className="col-span-2">
            {`기준 ${base_capacity}인 · 최대 ${max_capacity}인 · ${formatBeds(beds).text}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="text-base font-medium">
          {base_price.toLocaleString()}원
          <span className="text-xs font-normal text-muted-foreground">
            {" "}
            / 1박
          </span>
        </CardContent>
      </Card>
    </button>
  )
}

export function RoomCardSkeleton() {
  return (
    <Card className="mx-auto w-full max-w-sm pt-0">
      <Skeleton className="aspect-5/4 rounded-none" />

      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-5 w-2/3" />
      </CardHeader>

      <CardContent>
        <Skeleton className="h-6 w-1/3" />
      </CardContent>
    </Card>
  )
}
