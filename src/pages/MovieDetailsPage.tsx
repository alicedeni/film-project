import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchMovieById, type MovieDetails } from '../api/kinopoisk'
import { useFavorites } from '../hooks/useFavorites'
import { useCompare } from '../hooks/useCompare'
import { ConfirmModal } from '../components/ConfirmModal'
import { normalizeGenres, normalizeRating } from '../utils/movie'

export function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const { toggleCompare, isInCompare } = useCompare()
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConfirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    if (!id) return
    let isCancelled = false

    const loadMovie = async () => {
      try {
        setLoading(true)
        const data = await fetchMovieById(id)
        if (!isCancelled) setMovie(data)
      } catch {
        if (!isCancelled) setError('Не удалось загрузить информацию о фильме')
      } finally {
        if (!isCancelled) setLoading(false)
      }
    }

    loadMovie()
    return () => {
      isCancelled = true
    }
  }, [id])

  if (loading) return <p>Загрузка...</p>
  if (error) return <p>{error}</p>
  if (!movie || !id) return <p>Фильм не найден</p>

  const title = movie.name ?? movie.alternativeName ?? 'Без названия'
  const rating = normalizeRating(movie.rating as unknown)
  const genres = normalizeGenres(movie.genres as unknown)
  const isInFavorites = isFavorite(id)
  const isInCompareList = isInCompare(id)

  return (
    <div className="page movie-details">
      <ConfirmModal
        open={isConfirmOpen}
        title="Добавить в избранное?"
        message={`«${title}» будет сохранен в списке избранного на этом устройстве.`}
        confirmLabel="Добавить"
        cancelLabel="Отмена"
        onConfirm={() =>
          addFavorite({ id, name: title, posterUrl: movie.posterUrl, year: movie.year, rating })
        }
        onClose={() => setConfirmOpen(false)}
      />
      <div className="movie-details-layout">
        <div
          className="movie-details-poster"
          style={
            movie.posterUrl
              ? { backgroundImage: `url(${movie.posterUrl})`, backgroundSize: 'cover' }
              : undefined
          }
        />
        <div className="movie-details-main">
          <h1 className="page-title movie-details-title">{title}</h1>
          <p className="movie-details-meta">
            {movie.year && <span>{movie.year}</span>}
            {rating != null && (
              <span>
                {' '}
                · <strong>★ {rating.toFixed(1)}</strong>
              </span>
            )}
            {movie.movieLength && <span> · {movie.movieLength} мин</span>}
          </p>
          {genres.length > 0 && <p className="movie-details-genres">{genres.join(' · ')}</p>}
          {movie.description && (
            <p className="movie-details-description">{movie.description}</p>
          )}
          <div className="movie-details-actions">
            {isInFavorites ? (
              <button type="button" className="ghost-btn" onClick={() => removeFavorite(id)}>
                Удалить из избранного
              </button>
            ) : (
              <button type="button" className="primary-btn" onClick={() => setConfirmOpen(true)}>
                В избранное
              </button>
            )}
            <button
              type="button"
              className={`ghost-btn ${isInCompareList ? 'ghost-btn--active' : ''}`}
              onClick={() =>
                toggleCompare({
                  id,
                  name: title,
                  year: movie.year,
                  rating,
                  genres,
                  movieLength: movie.movieLength,
                })
              }
            >
              {isInCompareList ? 'Убрать из сравнения' : 'Добавить к сравнению'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
