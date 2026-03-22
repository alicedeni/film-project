import { Link } from 'react-router-dom'
import { useCompare } from '../hooks/useCompare'
import { useInfiniteMovies } from '../hooks/useInfiniteMovies'
import { MoviePosterWithFallback } from './MoviePoster'
import type { MoviesFiltersValue } from './MoviesFilters'
import { normalizeGenres, normalizeRating } from '../utils/movie'

interface Props {
  filters: MoviesFiltersValue
}

export function MoviesResults({ filters }: Props) {
  const { toggleCompare, isInCompare } = useCompare()
  const { movies, loading, loadingMore, error, hasMore, sentinelRef } = useInfiniteMovies({
    limit: 50,
    filters,
  })

  return (
    <section className="movies-results">
      {loading && <p className="movies-status">Загрузка…</p>}
      {error && <p className="movies-status movies-status--error">{error}</p>}
      {!loading && !error && movies.length === 0 && (
        <p className="movies-status">
          Нет фильмов
        </p>
      )}
      <div className="movies-grid">
        {movies.map((movie) => {
          const rating = normalizeRating(movie.rating)
          const genres = normalizeGenres(movie.genres as unknown)
          const movieId = String(movie.id)
          const inCompare = isInCompare(movieId)
          const forCompare = {
            id: movieId,
            name: movie.name,
            year: movie.year,
            rating,
            genres,
            movieLength: movie.movieLength,
          }

          return (
            <article key={movie.id} className="movie-card movie-card--with-actions">
              <Link to={`/movie/${movie.id}`} className="movie-card-link">
                <MoviePosterWithFallback url={movie.posterUrl} />
                <div className="movie-meta">
                  <h2 className="movie-title">{movie.name}</h2>
                  <div className="movie-info">
                    {movie.year != null && <span className="movie-year">{movie.year}</span>}
                    {rating != null && (
                      <span className="movie-rating" title="Рейтинг КиноПоиск">
                        ★ {rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  {genres.length > 0 && (
                    <p className="movie-genres">{genres.slice(0, 3).join(', ')}</p>
                  )}
                </div>
              </Link>
              <button
                type="button"
                className={`movie-compare-chip ${inCompare ? 'movie-compare-chip--on' : ''}`}
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  toggleCompare(forCompare)
                }}
              >
                {inCompare ? 'В сравнении' : 'Сравнить'}
              </button>
            </article>
          )
        })}
      </div>
      {hasMore && (
        <>
          <div ref={sentinelRef} className="movies-sentinel" aria-hidden="true" />
          {loadingMore && <p className="movies-status movies-loading-more">Загрузка фильмов…</p>}
        </>
      )}
    </section>
  )
}
