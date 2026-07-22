import { type NextRequest, NextResponse } from "next/server"
import { type EmailOtpType } from "@supabase/supabase-js"

import { createClient } from "@/shared/api/supabase/server"
import { PATHS } from "@/shared/config/paths"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null

  if (token_hash && type) {
    const supabase = await createClient() // 클라이언트 생성
    const { error } = await supabase.auth.verifyOtp({ token_hash, type }) // 토큰 검증

    // 성공 시 페이지 이동
    if (!error) {
      const next = type === "email" ? PATHS.HOME : PATHS.AUTH.RESET_PASSWORD

      return NextResponse.redirect(`${origin}${next}`)
    }

    // 실패 시 에러 페이지 이동
    return NextResponse.redirect(
      `${origin}${PATHS.AUTH.ERROR}?code=${error.code ?? "unknown"}`
    )
  }

  return NextResponse.redirect(`${origin}${PATHS.AUTH.ERROR}?code=unknown`)
}
