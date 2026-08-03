import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/shared/api/query-keys"

import { updateProfile } from "../api/profile"

// 프로필 수정
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data)
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all })
    },
  })
}
