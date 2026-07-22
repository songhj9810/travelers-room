import { Geist_Mono } from "next/font/google"
import localFont from "next/font/local"

import { QueryProvider } from "@/app/providers/query-provider"
import { ThemeProvider } from "@/app/providers/theme-provider"

import { cn } from "@/shared/lib/utils"
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
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
