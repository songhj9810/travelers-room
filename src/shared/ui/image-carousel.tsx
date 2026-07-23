"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import { cn } from "@/shared/lib/utils"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/shared/ui/carousel"

type ImageCarouselProps = {
  name: string
  images: string[]
}

export function ImageCarousel({ name, images }: ImageCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on("select", handleSelect)
    return () => {
      api.off("select", handleSelect)
    }
  }, [api])

  return (
    <>
      {images.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          <Carousel opts={{ align: "center", loop: true }} setApi={setApi}>
            <CarouselContent spacing={0}>
              {images.map((image, index) => (
                <CarouselItem key={image} spacing={0} className="basis-full">
                  <div className="relative aspect-5/4 max-h-180 w-full overflow-hidden">
                    <Image
                      src={image}
                      alt={`${name}의 이미지 ${index + 1}`}
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Dot Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => api?.scrollTo(index)}
                aria-label={`${index + 1}번째 이미지로 이동`}
                className={cn(
                  "size-3 touch-manipulation rounded-full border-2 border-neutral transition-opacity",
                  index === current ? "opacity-100" : "opacity-10"
                )}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center text-sm text-muted-foreground">
          호스트가 아직 이미지를 등록하지 않았어요
        </div>
      )}
    </>
  )
}
