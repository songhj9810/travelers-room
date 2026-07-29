import type { Review } from "@/entities/review"

import { BUCKET_NAME, removeImages, uploadImage } from "@/shared/api/image"
import { createClient } from "@/shared/api/supabase/client"

// 리뷰 생성
export async function createReview({
  guesthouseId,
  rating,
  content,
  imagesToUpload = [],
}: {
  guesthouseId: string
  rating: number
  content: string
  imagesToUpload?: File[]
}): Promise<Review> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("로그인이 필요해요")

  // 1. 리뷰 생성
  const { data: createdReview, error: createError } = await supabase
    .from("reviews")
    .insert({
      guesthouse_id: guesthouseId,
      rating,
      content,
      images: [], // 이미지 URL은 일단 빈 배열로 생성
    })
    .select()
    .single() // 생성된 리뷰 반환

  if (createError) throw createError
  if (imagesToUpload.length === 0) return createdReview

  const pathsToUpload: string[] = []

  try {
    // 2. 이미지 업로드
    const urls = await Promise.all(
      imagesToUpload.map(async (file) => {
        const fileExtension = file.name.split(".").pop() || "webp" // 파일 확장자 추출, 없으면 webp로 기본 설정
        const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}` // 파일 이름 생성
        const filePath = `${user.id}/${createdReview.id}/${fileName}` // 파일 경로 생성
        const publicUrl = await uploadImage({
          file: file,
          filePath: filePath,
        }) // 이미지 업로드 및 공개 URL 반환
        pathsToUpload.push(filePath) // 파일 경로 저장
        return publicUrl
      })
    )

    // 3. 리뷰 수정 (이미지 URL 추가)
    const { data: updatedReview, error: updateError } = await supabase
      .from("reviews")
      .update({ images: urls })
      .eq("id", createdReview.id)
      .select()
      .single() // 수정된 리뷰 반환

    if (updateError) throw updateError
    return updatedReview
  } catch (error) {
    // 롤백: 생성된 리뷰 삭제 및 업로드된 이미지 삭제
    await supabase.from("reviews").delete().eq("id", createdReview.id)
    if (pathsToUpload.length > 0) await removeImages({ paths: pathsToUpload })

    throw error
  }
}

// 리뷰 수정
export async function updateReview({
  reviewId,
  newRating,
  newContent,
  imagesToUpload = [],
  imagesToRemove = [],
}: {
  reviewId: string
  newRating: number
  newContent: string
  imagesToUpload?: File[]
  imagesToRemove?: string[]
}): Promise<Review> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("로그인이 필요해요")

  // 1. 기존 이미지 URL 배열에서 삭제할 이미지 제외
  const { data: review, error: fetchError } = await supabase
    .from("reviews")
    .select("images")
    .eq("id", reviewId)
    .single()

  if (fetchError) throw fetchError

  let urls: string[] = review.images.filter(
    (url) => !imagesToRemove.includes(url)
  )
  const pathsToUpload: string[] = []

  try {
    // 2. (imagesToUpload) 이미지 업로드 후 유지할 이미지 URL 배열에 추가
    if (imagesToUpload.length > 0) {
      const newUrls = await Promise.all(
        imagesToUpload.map(async (file) => {
          const fileExtension = file.name.split(".").pop() || "webp" // 파일 확장자 추출, 없으면 webp로 기본 설정
          const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}` // 파일 이름 생성
          const filePath = `${user.id}/${reviewId}/${fileName}` // 파일 경로 생성
          const publicUrl = await uploadImage({
            file: file,
            filePath: filePath,
          }) // 이미지 업로드 및 공개 URL 반환
          pathsToUpload.push(filePath) // 파일 경로 저장
          return publicUrl
        })
      )
      urls = [...urls, ...newUrls]
    }

    // 3. 리뷰 수정 (이미지 URL 업데이트)
    const { data: updatedReview, error: updateError } = await supabase
      .from("reviews")
      .update({
        rating: newRating,
        content: newContent,
        images: urls,
      })
      .eq("id", reviewId)
      .select()
      .single() // 수정된 리뷰 반환

    if (updateError) throw updateError

    // 4. (imagesToRemove) 이미지 삭제
    if (imagesToRemove.length > 0) {
      const pathsToRemove = imagesToRemove.map((url) => {
        const parts = url.split(`/${BUCKET_NAME}/`)
        return parts.length > 1 ? parts[1] : url
      })
      await removeImages({ paths: pathsToRemove })
    }

    return updatedReview
  } catch (error) {
    // 롤백: 업로드된 이미지 삭제
    if (pathsToUpload.length > 0) await removeImages({ paths: pathsToUpload })

    throw error
  }
}

// 리뷰 삭제
export async function deleteReview({
  reviewId,
}: {
  reviewId: string
}): Promise<Review> {
  const supabase = createClient()
  const { data: deletedReview, error: deleteError } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId)
    .select()
    .single() // 삭제된 리뷰 반환

  if (deleteError) throw deleteError

  if (deletedReview.images.length > 0) {
    const pathsToRemove = deletedReview.images.map((url) => {
      const parts = url.split(`/${BUCKET_NAME}/`)
      return parts.length > 1 ? parts[1] : url
    })
    await removeImages({ paths: pathsToRemove })
  }

  return deletedReview
}
