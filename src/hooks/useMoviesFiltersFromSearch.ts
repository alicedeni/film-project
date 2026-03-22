import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export interface MoviesFiltersValue {
  genres: string[]
  ratingFrom: number
  ratingTo: number
  yearFrom: number
  yearTo: number
}

export function useMoviesFiltersFromSearch(): [
  MoviesFiltersValue,
  (value: MoviesFiltersValue) => void,
] {
  const [params, setParams] = useSearchParams()
  const filters = useMemo(
    () => ({
      genres: params.get('genres')?.split(',').filter(Boolean) ?? [],
      ratingFrom: Number(params.get('ratingFrom') ?? 0),
      ratingTo: Number(params.get('ratingTo') ?? 10),
      yearFrom: Number(params.get('yearFrom') ?? 1980),
      yearTo: Number(params.get('yearTo') ?? new Date().getFullYear()),
    }),
    [params],
  )
  const setFilters = (newFilters: MoviesFiltersValue) => {
    const nextParams = new URLSearchParams(params)
    if (newFilters.genres.length) {
      nextParams.set('genres', newFilters.genres.join(','))
    } else {
      nextParams.delete('genres')
    }
    nextParams.set('ratingFrom', String(newFilters.ratingFrom))
    nextParams.set('ratingTo', String(newFilters.ratingTo))
    nextParams.set('yearFrom', String(newFilters.yearFrom))
    nextParams.set('yearTo', String(newFilters.yearTo))
    setParams(nextParams, { replace: true })
  }

  return [filters, setFilters]
}
