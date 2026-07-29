import { createClient } from "@/shared/api/supabase/client"

export const BUCKET_NAME = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!

// 이미지 업로드
export async function uploadImage({
  file,
  filePath,
}: {
  file: File
  filePath: string
}): Promise<string> {
  const supabase = createClient()
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file)

  if (error) throw error

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path) // 업로드된 이미지의 공개 URL 가져오기
  return publicUrl
}

// 이미지 삭제
export async function removeImages({
  paths,
}: {
  paths: string[]
}): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.storage.from(BUCKET_NAME).remove(paths)

  if (error) throw error
}
