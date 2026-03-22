import type { MoviesFiltersValue } from '../hooks/useMoviesFiltersFromSearch'

const AVAILABLE_GENRES = [
  'боевик',
  'драма',
  'комедия',
  'фантастика',
  'ужасы',
  'триллер',
  'мелодрама',
  'приключения',
  'детектив',
  'криминал',
]

export type { MoviesFiltersValue } from '../hooks/useMoviesFiltersFromSearch'

interface Props {
  value: MoviesFiltersValue
  onChange: (value: MoviesFiltersValue) => void
}

export function MoviesFilters({ value, onChange }: Props) {
  const handleGenreClick = (genre: string) => {
    const isSelected = value.genres.includes(genre)
    const nextGenres = isSelected
      ? value.genres.filter((selected) => selected !== genre)
      : [...value.genres, genre]
    onChange({ ...value, genres: nextGenres })
  }

  return (
    <section className="filters-panel">
      <div className="filters-row">
        <div className="filter-group">
          <span className="filter-label">Жанры</span>
          <div className="chips-row">
            {AVAILABLE_GENRES.map((genre) => (
              <button
                key={genre}
                type="button"
                className={`chip ${value.genres.includes(genre) ? 'chip--active' : ''}`}
                onClick={() => handleGenreClick(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <span className="filter-label">Рейтинг</span>
          <div className="range-row">
            <input
              type="number"
              min={0}
              max={10}
              value={value.ratingFrom}
              onChange={(event) =>
                onChange({ ...value, ratingFrom: Number(event.target.value || 0) })
              }
            />
            <span className="range-sep">-</span>
            <input
              type="number"
              min={0}
              max={10}
              value={value.ratingTo}
              onChange={(event) =>
                onChange({ ...value, ratingTo: Number(event.target.value || 10) })
              }
            />
          </div>
        </div>
        <div className="filter-group">
          <span className="filter-label">Год</span>
          <div className="range-row">
            <input
              type="number"
              min={1980}
              max={2100}
              value={value.yearFrom}
              onChange={(event) =>
                onChange({ ...value, yearFrom: Number(event.target.value || 1980) })
              }
            />
            <span className="range-sep">-</span>
            <input
              type="number"
              min={1980}
              max={2100}
              value={value.yearTo}
              onChange={(event) =>
                onChange({
                  ...value,
                  yearTo: Number(event.target.value || new Date().getFullYear()),
                })
              }
            />
          </div>
        </div>
      </div>
    </section>
  )
}
