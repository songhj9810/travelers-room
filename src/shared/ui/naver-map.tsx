"use client"

import { useEffect, useRef } from "react"
import { renderToString } from "react-dom/server"

import { cn } from "@/shared/lib/utils"
import { MapMarker } from "@/shared/ui/map-marker"

export type Marker = {
  id: string
  name: string
  lat: number
  lng: number
}

type NaverMapProps = {
  markers: Marker[]
  activeId: string | null
  onMarkerClick?: (id: string) => void
  onMapClick?: () => void
}

export function NaverMap({
  markers,
  activeId,
  onMarkerClick,
  onMapClick,
}: NaverMapProps) {
  const mapElementRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<naver.maps.Map | null>(null)

  const markersRef = useRef(markers)
  const prevActiveIdRef = useRef<string | null>(null)
  const markerRefs = useRef<Map<string, naver.maps.Marker>>(new Map())

  useEffect(() => {
    markersRef.current = markers
  }, [markers])

  const onMarkerClickRef = useRef(onMarkerClick)
  const onMapClickRef = useRef(onMapClick)

  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick
  }, [onMarkerClick])
  useEffect(() => {
    onMapClickRef.current = onMapClick
  }, [onMapClick])

  // 지도 생성
  useEffect(() => {
    const { naver } = window
    // 스크립트가 아직 로드되지 않았거나, 지도가 렌더링될 요소가 없거나, 이미 지도 인스턴스가 존재하면 종료
    if (!naver || !mapElementRef.current || mapRef.current) return

    const map = new naver.maps.Map(mapElementRef.current, {
      center: new naver.maps.LatLng(33.3590628, 126.534361), // 제주도 중심 좌표
      maxZoom: 18,
      minZoom: 10,
      scrollWheel: false,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT,
        style: naver.maps.ZoomControlStyle.SMALL,
      },
    })

    // 지도 저장
    mapRef.current = map

    // 지도 클릭 이벤트 핸들러 등록
    naver.maps.Event.addListener(map, "click", () => {
      onMapClickRef.current?.()
    })

    return () => {
      map.destroy()
      mapRef.current = null
    }
  }, [])

  // 마커 생성 및 지도 범위 조정
  useEffect(() => {
    const { naver } = window
    // 스크립트가 아직 로드되지 않았거나, 지도 인스턴스가 존재하지 않으면 종료
    if (!naver || !mapRef.current) return

    // 기존 마커 제거
    markerRefs.current.forEach((marker) => marker.setMap(null))
    markerRefs.current.clear()

    // 새로운 마커 생성 및 지도에 추가
    markers.forEach((marker) => {
      const instance = new naver.maps.Marker({
        map: mapRef.current!,
        position: new naver.maps.LatLng(marker.lat, marker.lng),
        icon: {
          content: renderToString(
            <MapMarker name={marker.name} active={marker.id === activeId} />
          ),
          anchor: new naver.maps.Point(0, 0),
        },
        title: marker.name,
        zIndex: marker.id === activeId ? 99 : 1,
      })

      // 마커 클릭 이벤트 핸들러 등록
      naver.maps.Event.addListener(instance, "click", () => {
        onMarkerClickRef.current?.(marker.id)
      })

      markerRefs.current.set(marker.id, instance) // 새로운 마커 저장
    })

    // 마커 개수에 따라 지도 범위 조정
    if (markers.length === 0) {
      // 마커가 없을 경우, 제주도 전체가 보이도록 줌 레벨 조정
      mapRef.current.setZoom(10)
    } else if (markers.length === 1) {
      // 마커가 1개일 경우, 해당 마커를 중심으로 지도 이동
      mapRef.current.setCenter(
        new naver.maps.LatLng(markers[0].lat, markers[0].lng)
      )
    } else {
      // 마커가 2개 이상일 경우, 모든 마커가 보이도록 지도 범위 조정
      const bounds = new naver.maps.LatLngBounds(
        new naver.maps.LatLng(markers[0].lat, markers[0].lng),
        new naver.maps.LatLng(markers[0].lat, markers[0].lng)
      )

      markers.forEach((marker) => {
        bounds.extend(new naver.maps.LatLng(marker.lat, marker.lng))
      })

      mapRef.current.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      })
    }
  }, [markers]) // 마커 데이터가 바뀔 때마다 실행

  // 마커 스타일 업데이트
  useEffect(() => {
    const prevActiveId = prevActiveIdRef.current
    if (prevActiveId === activeId) return // 액티브 아이템이 바뀌지 않았으면 종료

    const updateMarker = (id: string | null, active: boolean) => {
      if (!id) return

      const data = markersRef.current.find((marker) => marker.id === id)
      const marker = markerRefs.current.get(id)
      if (!data || !marker) return

      marker.setIcon({
        content: renderToString(<MapMarker name={data.name} active={active} />),
        anchor: new naver.maps.Point(0, 0),
      })
      marker.setZIndex(active ? 99 : 1) // 액티브 마커가 다른 마커에 가려지지 않도록 z-index 조정
    }

    updateMarker(prevActiveId, false) // 이전 액티브 마커 비활성화
    updateMarker(activeId, true) // 새로운 액티브 마커 활성화

    prevActiveIdRef.current = activeId
  }, [activeId])

  // 액티브 마커를 중심으로 지도 이동
  useEffect(() => {
    const { naver } = window
    // 스크립트가 아직 로드되지 않았거나, 지도 인스턴스가 존재하지 않거나, 액티브 아이템이 없으면 종료
    if (!naver || !mapRef.current || !activeId) return

    const activeMarker = markers.find((marker) => marker.id === activeId)
    if (!activeMarker) return

    mapRef.current.panTo(
      new naver.maps.LatLng(activeMarker.lat, activeMarker.lng)
    )
  }, [activeId, markers])

  return (
    <div ref={mapElementRef} className={cn("relative z-0 h-full w-full")} />
  )
}
