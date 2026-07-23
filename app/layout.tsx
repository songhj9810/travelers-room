import { Geist_Mono } from "next/font/google"
import localFont from "next/font/local"

import { QueryProvider } from "@/app/providers/query-provider"
import { ThemeProvider } from "@/app/providers/theme-provider"

import { Header } from "@/widgets/header"
import { TabBar } from "@/widgets/tab-bar"

import { cn } from "@/shared/lib/utils"
import { ConfirmModal } from "@/shared/ui/confirm-modal"
import { Toaster } from "@/shared/ui/sonner"

import "./globals.css"

const pretendard = localFont({
  src: "../src/shared/assets/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-sans",
})
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export default function RootLayout({
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
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
