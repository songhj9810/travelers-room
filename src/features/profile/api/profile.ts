import { BUCKET_NAME, removeImages, uploadImage } from "@/shared/api/image"
import { createClient } from "@/shared/api/supabase/client"
import type { Tables } from "@/shared/api/supabase/types"

// 프로필 수정
export async function updateProfile({
  newNickname,
  newAvatarFile,
}: {
  newNickname?: string
  newAvatarFile?: File | null
}): Promise<Tables<"profiles">> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("로그인이 필요해요")

  // 1. 기존 아바타 이미지 URL 조회
  const { data, error } = await supabase
    .from("profiles")
    .select("avatar")
    .eq("id", user.id)
    .single()

  if (error) throw error

  const updates: { nickname?: string; avatar?: string | null } = {}

  let newAvatarUrl: string | undefined
  let updatedProfile: Tables<"profiles">

  try {
    if (newNickname) updates.nickname = newNickname

    // 2. 새 아바타 이미지 업로드
    if (newAvatarFile === null) {
      updates.avatar = null
    } else if (newAvatarFile instanceof File) {
      const fileExtension = newAvatarFile.name.split(".").pop() || "webp" // 파일 확장자 추출, 없으면 webp로 기본 설정
      const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}` // 파일 이름 생성
      const filePath = `${user.id}/avatar/${fileName}` // 파일 경로 생성
      newAvatarUrl = await uploadImage({
        file: newAvatarFile,
        filePath: filePath,
      }) // 이미지 업로드 및 공개 URL 반환
      updates.avatar = newAvatarUrl
    }

    // 3. 프로필 수정
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single() // 수정된 프로필 반환

    if (error) throw error
    updatedProfile = data
  } catch (error) {
    // 롤백: 업로드된 이미지 삭제
    if (newAvatarUrl) await removeImages({ paths: [newAvatarUrl] })

    throw error
  }

  // 4. 기존 아바타 이미지 삭제
  if (
    (newAvatarFile === null || newAvatarFile instanceof File) &&
    data?.avatar
  ) {
    const parts = data?.avatar.split(`/${BUCKET_NAME}/`)
    const url = parts.length > 1 ? parts[1] : data?.avatar
    await removeImages({ paths: [url] })
  }

  return updatedProfile
}
