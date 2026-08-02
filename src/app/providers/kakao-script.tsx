"use client"

import Script from "next/script"

export function KakaoScript() {
  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.8.1/kakao.min.js"
      integrity="sha384-OL+ylM/iuPLtW5U3XcvLSGhE8JzReKDank5InqlHGWPhb4140/yrBw0bg0y7+C9J"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY!)
        }
      }}
    />
  )
}
