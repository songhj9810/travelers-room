"use client"

import { useState } from "react"

import {
  RoomCard,
  RoomCardSkeleton,
  RoomDetailModal,
} from "@/entities/guesthouse"

import type { Tables } from "@/shared/api/supabase/types"

type RoomListProps = {
  rooms: Tables<"rooms">[]
}

export function RoomList({ rooms }: RoomListProps) {
  const [selectedRoom, setSelectedRoom] = useState<Tables<"rooms">>(rooms[0])
  const [roomDetailOpen, setRoomDetailOpen] = useState(false)

  return (
    <>
      {rooms.length > 0 ? (
        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onCardClick={() => {
                setSelectedRoom(room)
                setRoomDetailOpen(true)
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center text-sm text-muted-foreground">
          호스트가 아직 방을 등록하지 않았어요
        </div>
      )}

      {selectedRoom && (
        <RoomDetailModal
          open={roomDetailOpen}
          onOpenChange={setRoomDetailOpen}
          room={selectedRoom}
        />
      )}
    </>
  )
}

export function RoomListSkeleton() {
  return (
    <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <RoomCardSkeleton key={index} />
      ))}
    </div>
  )
}
