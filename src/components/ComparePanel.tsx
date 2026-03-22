import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { CompareMovie } from '../context/CompareContext'
import { useCompare } from '../hooks/useCompare'

function CompareCard({ movie, onRemove }: { movie: CompareMovie; onRemove: () => void }) {
  return (
    <div className="compare-card">
      <div className="compare-card-header">
        <Link to={`/movie/${movie.id}`} className="compare-card-name">
          {movie.name}
        </Link>
        <button
          type="button"
          className="compare-card-remove"
          onClick={onRemove}
          aria-label={`Убрать «${movie.name}» из сравнения`}
        >
          ×
        </button>
      </div>
      <dl className="compare-card-dl">
        <div>
          <dt>Год</dt>
          <dd>{movie.year ?? '—'}</dd>
        </div>
        <div>
          <dt>Рейтинг</dt>
          <dd>{movie.rating != null ? `★ ${movie.rating.toFixed(1)}` : '—'}</dd>
        </div>
        <div>
          <dt>Жанры</dt>
          <dd>{movie.genres.length ? movie.genres.join(', ') : '—'}</dd>
        </div>
        <div>
          <dt>Длит.</dt>
          <dd>{movie.movieLength != null ? `${movie.movieLength} мин` : '—'}</dd>
        </div>
      </dl>
    </div>
  )
}

export function ComparePanel() {
  const { items, removeCompare, clearCompare } = useCompare()

  useEffect(() => {
    const appRoot = document.querySelector('.app-root')
    if (!appRoot) return
    if (items.length > 0) {
      appRoot.setAttribute('data-compare-open', '')
    } else {
      appRoot.removeAttribute('data-compare-open')
    }
    return () => appRoot.removeAttribute('data-compare-open')
  }, [items.length])

  if (items.length === 0) {
    return null
  }

  const [firstMovie, secondMovie] = [items[0], items[1] ?? null]

  return (
    <aside className="compare-panel" aria-label="Сравнение фильмов">
      <div className="compare-panel-header">
        <h2 className="compare-panel-title">Сравнение</h2>
        <button type="button" className="compare-panel-clear" onClick={clearCompare}>
          Очистить
        </button>
      </div>
      <div className="compare-panel-cards">
        <CompareCard movie={firstMovie} onRemove={() => removeCompare(firstMovie.id)} />
        {secondMovie ? (
          <CompareCard movie={secondMovie} onRemove={() => removeCompare(secondMovie.id)} />
        ) : (
          <div className="compare-card compare-card--placeholder">
            <span>+ Добавьте второй фильм</span>
          </div>
        )}
      </div>
    </aside>
  )
}
