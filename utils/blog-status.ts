export type BlogStatus = 'draft' | 'scheduled' | 'published' | 'archived'

export function determineBlogStatus(
  publishedAt: string | null,
  featuredStart: string | null,
  featuredEnd: string | null
): BlogStatus {
  const now = new Date()

  if (!publishedAt) {
    return 'draft'
  }

  const publishDate = new Date(publishedAt)

  if (publishDate > now) {
    return 'scheduled'
  }

  if (featuredEnd) {
    const endDate = new Date(featuredEnd)
    if (endDate < now) {
      return 'archived'
    }
  }

  return 'published'
}

export function isFeaturedPost(
  featuredStart: string | null,
  featuredEnd: string | null
): boolean {
  const now = new Date()

  if (!featuredStart) {
    return false
  }

  const startDate = new Date(featuredStart)

  if (startDate > now) {
    return false
  }

  if (featuredEnd) {
    const endDate = new Date(featuredEnd)
    if (endDate < now) {
      return false
    }
  }

  return true
}
