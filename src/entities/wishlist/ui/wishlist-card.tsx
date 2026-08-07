import Image from "next/image"
import Link from "next/link"
import {
  Archive04Icon,
  Delete01Icon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { PATHS } from "@/shared/config/paths"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { Skeleton } from "@/shared/ui/skeleton"

import type { Wishlist } from "../model/types"

type WishlistCardProps = {
  wishlist: Wishlist
  onRename?: () => void
  onDelete?: () => void
}

export function WishlistCard({
  wishlist: { id, name, base, thumbnails, item_count },
  onRename,
  onDelete,
}: WishlistCardProps) {
  return (
    <div className="group relative">
      <Link href={PATHS.WISHLISTS.DETAIL(id)} className="rounded-4xl">
        <div className="flex flex-col">
          <div
            className={cn(
              "relative aspect-5/4 overflow-hidden rounded-4xl",
              thumbnails.length === 0 && "border bg-muted/50"
            )}
          >
            {thumbnails.length === 0 ? (
              <div className="grid h-full place-items-center">
                <HugeiconsIcon
                  icon={Archive04Icon}
                  size={24}
                  strokeWidth={2}
                  aria-hidden
                  className="size-6 shrink-0"
                />
              </div>
            ) : thumbnails.length === 1 ? (
              <Image
                src={thumbnails[0]}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
              />
            ) : (
              <div className="grid h-full grid-cols-2 grid-rows-2 gap-1">
                {Array.from({ length: 4 }).map((_, index) => {
                  const thumbnail = thumbnails[index]

                  return (
                    <div key={index} className="relative bg-muted/50">
                      {thumbnail && (
                        <Image
                          src={thumbnail}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 25vw, (max-width: 1024px) 16vw, 12vw"
                          className="object-cover"
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col p-2">
            <p className="mb-0.5 line-clamp-2 text-base font-medium">{name}</p>
            <p className="text-sm text-muted-foreground">
              저장된 게하 {item_count}개
            </p>
          </div>
        </div>
      </Link>

      {!base && (
        <div className="absolute top-3 right-3 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="위시리스트 관리"
                  className="rounded-full group-hover:bg-muted group-hover:text-foreground dark:group-hover:bg-muted/50"
                >
                  <HugeiconsIcon
                    icon={MoreHorizontalIcon}
                    size={16}
                    strokeWidth={2}
                    aria-hidden
                  />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="min-w-fit">
              <DropdownMenuItem onClick={onRename}>
                <HugeiconsIcon
                  icon={PencilEdit02Icon}
                  size={16}
                  strokeWidth={2}
                  aria-hidden
                />
                이름 변경
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={onDelete}>
                <HugeiconsIcon
                  icon={Delete01Icon}
                  size={16}
                  strokeWidth={2}
                  aria-hidden
                />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}

export function WishlistCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-5/4 rounded-4xl" />

      <div className="flex flex-col p-2">
        <Skeleton className="mb-0.5 h-6 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
      </div>
    </div>
  )
}
