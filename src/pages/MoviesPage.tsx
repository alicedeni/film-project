import { useEffect } from 'react'
import { MoviesFilters } from '../components/MoviesFilters'
import { useMoviesFiltersFromSearch } from '../hooks/useMoviesFiltersFromSearch'
import { MoviesResults } from '../components/MoviesResults'
import { getFilterBackground } from '../utils/filterBackground'
import { isApiConfigured } from '../api/kinopoisk'

export function MoviesPage() {
  const [filters, setFilters] = useMoviesFiltersFromSearch()

  useEffect(() => {
    document.body.dataset.moviesFilterActive = 'true'
    document.body.style.background = getFilterBackground(filters)
    return () => {
      delete document.body.dataset.moviesFilterActive
      document.body.style.background = ''
    }
  }, [filters])

  const isApiReady = isApiConfigured()

  return (
    <div className="page page-movies">
      {!isApiReady && (
        <div className="env-warning" role="alert">
          Укажите KINOPOISK_API_KEY
        </div>
      )}
      <MoviesFilters value={filters} onChange={setFilters} />
      <MoviesResults key={JSON.stringify(filters)} filters={filters} />
    </div>
  )
}
