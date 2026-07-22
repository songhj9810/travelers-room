import { isAuthError } from "@supabase/supabase-js"

const SUPABASE_ERROR_MESSAGES: Record<string, string> = {
  email_address_invalid: "사용할 수 없는 이메일이에요",
  email_exists: "이미 사용 중인 이메일이에요",
  email_not_confirmed: "이메일 인증이 완료되지 않았어요",
  flow_state_expired: "인증 정보가 만료되었어요",
  flow_state_not_found: "인증 정보를 찾을 수 없어요",
  invalid_credentials: "이메일 또는 비밀번호가 올바르지 않아요",
  over_email_send_rate_limit: "잠시 후 다시 시도해주세요",
  over_request_rate_limit: "잠시 후 다시 시도해주세요",
  same_password: "현재 비밀번호와 다른 비밀번호를 입력해주세요",
  session_expired: "세션이 만료되었어요",
  session_not_found: "세션을 찾을 수 없어요",
  unexpected_failure: "잠시 후 다시 시도해주세요",
  user_already_exists: "이미 가입된 사용자예요",
  user_not_found: "사용자를 찾을 수 없어요",
  weak_password: "사용할 수 없는 비밀번호예요",
  unknown: "알 수 없는 오류가 발생했어요",
}

export function getSupabaseErrorMessage({
  error,
  code,
}: {
  error?: unknown
  code?: string
}) {
  return (
    SUPABASE_ERROR_MESSAGES[
      code ?? (isAuthError(error) ? error.code : "unknown") ?? "unknown"
    ] ?? SUPABASE_ERROR_MESSAGES.unknown
  )
}
