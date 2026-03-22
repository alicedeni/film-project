import { Link } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'
import { MoviePosterWithFallback } from '../components/MoviePoster'
import { normalizeRating } from '../utils/movie'

export function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites()

  if (favorites.length === 0) {
    return (
      <div className="page favorites-page">
        <Link to="/" className="primary-btn favorites-empty-link">
          К каталогу
        </Link>
      </div>
    )
  }

  return (
    <div className="page favorites-page">
      <div className="movies-grid">
        {favorites.map((movie) => {
          const rating = normalizeRating(movie.rating as unknown)
          return (
            <article key={movie.id} className="movie-card movie-card--with-actions">
              <Link to={`/movie/${movie.id}`} className="movie-card-link">
                <MoviePosterWithFallback url={movie.posterUrl} />
                <div className="movie-meta">
                  <h2 className="movie-title">{movie.name}</h2>
                  <div className="movie-info">
                    {movie.year != null && <span className="movie-year">{movie.year}</span>}
                    {rating != null && (
                      <span className="movie-rating" title="Рейтинг">
                        ★ {rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
              <button
                type="button"
                className="movie-compare-chip"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  removeFavorite(movie.id)
                }}
                aria-label={`Удалить «${movie.name}» из избранного`}
              >
                Удалить
              </button>
            </article>
          )
        })}
      </div>
    </div>
  )
}
