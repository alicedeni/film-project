import type { MoviesFiltersValue } from '../hooks/useMoviesFiltersFromSearch'

const genreColors: Record<string, string> = {
  боевик: 'rgba(220, 38, 38, 0.35)',
  драма: 'rgba(59, 130, 246, 0.32)',
  комедия: 'rgba(245, 158, 11, 0.3)',
  фантастика: 'rgba(59, 130, 246, 0.3)',
  ужасы: 'rgba(127, 29, 29, 0.38)',
  триллер: 'rgba(30, 64, 175, 0.32)',
  мелодрама: 'rgba(219, 39, 119, 0.3)',
  приключения: 'rgba(22, 163, 74, 0.3)',
  детектив: 'rgba(30, 64, 175, 0.32)',
  криминал: 'rgba(120, 53, 15, 0.35)',
}

const defaultTopLeft = 'rgba(59, 130, 246, 0.24)'
const defaultTopRight = 'rgba(37, 99, 235, 0.22)'

export function getFilterBackground(filters: MoviesFiltersValue): string {
  const genres = filters.genres
  let topLeft = defaultTopLeft
  let topRight = defaultTopRight

  if (genres.length > 0) {
    const tints = genres.map((genre) => genreColors[genre] ?? defaultTopLeft)
    topLeft = tints[0] ?? topLeft
    topRight = tints[1] ?? tints[0] ?? topRight
  }

  const averageRating = (filters.ratingFrom + filters.ratingTo) / 2
  let ratingGradient = null
  if (averageRating >= 7.5) {
    ratingGradient = 'radial-gradient(circle at 50% 100%, rgba(22, 163, 74, 0.1), transparent 50%)'
  } else if (averageRating <= 4) {
    ratingGradient =
      'radial-gradient(circle at 50% 100%, rgba(148, 163, 184, 0.14), transparent 50%)'
  }

  let yearGradient = null
  if (filters.yearTo <= 1995) {
    yearGradient =
      'radial-gradient(ellipse at bottom, rgba(180, 83, 9, 0.12), transparent 60%)'
  } else if (filters.yearFrom >= 2015) {
    yearGradient =
      'radial-gradient(ellipse at bottom, rgba(56, 189, 248, 0.1), transparent 60%)'
  }

  const yearRange = filters.yearTo - filters.yearFrom
  const wideRangeGradient =
    yearRange > 25
      ? 'radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.12), transparent 45%)'
      : null

  const layers = [
    `radial-gradient(ellipse 100% 80% at 0% 0%, ${topLeft}, transparent 48%)`,
    `radial-gradient(ellipse 100% 80% at 100% 0%, ${topRight}, transparent 48%)`,
    ratingGradient,
    yearGradient,
    wideRangeGradient,
    'var(--bg)',
  ].filter(Boolean) as string[]

  return layers.join(', ')
}
