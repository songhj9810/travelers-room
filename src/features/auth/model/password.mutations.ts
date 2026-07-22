import { useMutation } from "@tanstack/react-query"

import { forgotPassword, resetPassword } from "../api/password"

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  })
}
