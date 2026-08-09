import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import localFont from "next/font/local"

import { KakaoScript } from "@/app/providers/kakao-script"
import { NaverScript } from "@/app/providers/naver-script"
import { QueryProvider } from "@/app/providers/query-provider"
import { ThemeProvider } from "@/app/providers/theme-provider"

import { Header } from "@/widgets/header"
import { TabBar } from "@/widgets/tab-bar"

import { EditorModal } from "@/features/review"
import { SearchModal } from "@/features/search"
import { SelectWishlistModal } from "@/features/wishlist"

import { SITE_URL } from "@/shared/config/site"
import { cn } from "@/shared/lib/utils"
import { ConfirmModal } from "@/shared/ui/confirm-modal"
import { LoginModal } from "@/shared/ui/login-modal"
import { Toaster } from "@/shared/ui/toast"

import "./globals.css"

const pretendard = localFont({
  src: "../src/shared/assets/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-sans",
})
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

const title = "여행자의 방"
const description =
  "조건에 맞는 숙소를 찾아 위시리스트에 담고 리뷰를 남길 수 있는 제주 여행자를 위한 게스트하우스 탐색 플랫폼"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description,
  openGraph: {
    type: "website",
    title,
    description,
    siteName: title,
    locale: "ko_KR",
    url: SITE_URL,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={cn(
        "font-sans antialiased",
        pretendard.variable,
        fontMono.variable
      )}
    >
      <body>
        <KakaoScript />
        <NaverScript />
        <ThemeProvider>
          <QueryProvider>
            <div className="flex min-h-svh flex-col">
              <Header />
              {/* 헤더와 탭바 높이만큼 패딩을 줌 */}
              <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col pt-12 pb-16 md:pt-20 md:pb-0">
                {children}
              </main>
              <TabBar />
            </div>
            <ConfirmModal />
            <LoginModal />
            <SearchModal />
            <SelectWishlistModal />
            <EditorModal />
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
