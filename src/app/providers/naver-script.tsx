"use client"

import Script from "next/script"

export function NaverScript() {
  return (
    <Script
      type="text/javascript"
      src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID!}&callback=CALLBACK_FUNCTION`}
      strategy="afterInteractive"
    />
  )
}
