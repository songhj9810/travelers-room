import { type NextRequest, NextResponse } from "next/server"

import { createClient } from "@/shared/api/supabase/server"
import { PATHS } from "@/shared/config/paths"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get("code")
  let next = searchParams.get("next") ?? "/"

  if (!next.startsWith("/")) {
    next = "/"
  }

  if (code) {
    const supabase = await createClient() // 클라이언트 생성
    const { error } = await supabase.auth.exchangeCodeForSession(code) // 코드 교환

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host")
      const isLocalEnv = process.env.NODE_ENV === "development"
      const redirectOrigin =
        !isLocalEnv && forwardedHost ? `https://${forwardedHost}` : origin

      return NextResponse.redirect(`${redirectOrigin}${next}`)
    }

    return NextResponse.redirect(
      `${origin}${PATHS.AUTH.ERROR}?code=${error.code ?? "unknown"}`
    )
  }

  return NextResponse.redirect(`${origin}${PATHS.AUTH.ERROR}?code=unknown`)
}
