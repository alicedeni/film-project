export function normalizeRating(rating: unknown): number | undefined {
  if (typeof rating === 'number' && !Number.isNaN(rating)) return rating
  if (rating && typeof rating === 'object') {
    const obj = rating as Record<string, unknown>
    for (const key of ['kp', 'imdb', 'filmCritics']) {
      const score = obj[key]
      if (typeof score === 'number' && !Number.isNaN(score)) return score
    }
  }
  return undefined
}

export function normalizeGenres(genres: unknown): string[] {
  if (!Array.isArray(genres)) return []
  return genres
    .map((item) => {
      if (typeof item === 'string') return item
      if (
        item &&
        typeof item === 'object' &&
        'name' in item &&
        typeof (item as { name: unknown }).name === 'string'
      ) {
        return (item as { name: string }).name
      }
      return ''
    })
    .filter(Boolean)
}
