import Image from "next/image"
import Link from "next/link"

import { PATHS } from "@/shared/config/paths"

import { DesktopNav } from "./desktop-nav"
import { DesktopSearchBar } from "./desktop-search-bar"
import { MobileBackButton } from "./mobile-back-button"
import { MobileTitle } from "./mobile-title"

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-background">
      {/* 데스크탑 헤더 */}
      <div className="hidden h-20 grid-cols-10 items-center gap-4 px-10 md:grid">
        {/* 로고 */}
        <div className="col-span-3 col-start-1 flex items-center justify-start">
          <Link href={PATHS.HOME}>
            <Image
              src="/logo.svg"
              alt="로고"
              loading="eager"
              width={192}
              height={64}
              className="h-16 w-48"
            />
          </Link>
        </div>
        {/* 서치바 */}
        <div className="col-span-4 col-start-4 flex items-center justify-center">
          <DesktopSearchBar />
        </div>
        {/* 네비 */}
        <nav className="col-span-3 col-start-8 flex items-center justify-end gap-4">
          <DesktopNav />
        </nav>
      </div>

      {/* 모바일 헤더 */}
      <div className="grid h-12 grid-cols-10 items-center gap-2 px-1.5 md:hidden">
        {/* 뒤로 가기 버튼 */}
        <div className="col-span-1 col-start-1 justify-start">
          <MobileBackButton />
        </div>
        {/* 타이틀 */}
        <div className="col-span-6 col-start-3 justify-center">
          <MobileTitle />
        </div>
      </div>
    </header>
  )
}
