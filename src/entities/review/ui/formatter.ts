export const formatDate = (value: string | null, now = new Date()): string => {
  if (!value) {
    return "-"
  }

  const targetDate = new Date(value)
  if (Number.isNaN(targetDate.getTime())) {
    return "-"
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  )

  const diffDays = Math.floor(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
  )
  if (diffDays < 0) {
    return "-"
  }
  if (diffDays === 0) {
    return "오늘"
  }
  if (diffDays < 7) {
    return `${diffDays}일 전`
  }

  const diffWeeks = Math.floor(diffDays / 7)
  if (diffDays < 35) {
    return `${diffWeeks}주 전`
  }

  return `${targetDate.getFullYear()}년 ${targetDate.getMonth() + 1}월`
}
