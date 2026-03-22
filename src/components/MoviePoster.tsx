import { useState } from 'react'
import { useTheme } from '../hooks/useTheme'

const POSTER_PLACEHOLDER_LIGHT =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 180'%3E%3Crect fill='%23e2e8f0' width='120' height='180'/%3E%3Ctext fill='%2364748b' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='14' font-family='system-ui'%3EНет фото%3C/text%3E%3C/svg%3E"
const POSTER_PLACEHOLDER_DARK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 180'%3E%3Crect fill='%2323344d' width='120' height='180'/%3E%3Crect x='8' y='8' width='104' height='164' fill='none' stroke='%23475569' stroke-width='2' rx='4'/%3E%3Ctext fill='%2394a3b8' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='14' font-family='system-ui'%3EНет фото%3C/text%3E%3C/svg%3E"

export function MoviePosterWithFallback({ url }: { url?: string }) {
  const [loadFailed, setLoadFailed] = useState(false)
  const { mode } = useTheme()
  const showPlaceholder = !url || loadFailed
  const isDark = mode === 'dark'
  const placeholderImage = isDark ? POSTER_PLACEHOLDER_DARK : POSTER_PLACEHOLDER_LIGHT
  const imageSrc = showPlaceholder ? placeholderImage : url
  return (
    <div
      className={`movie-poster ${showPlaceholder ? 'movie-poster--placeholder' : ''}`}
      style={{ backgroundImage: `url(${imageSrc})`, backgroundSize: 'cover' }}
    >
      {url && !loadFailed && (
        <img
          src={url}
          alt=""
          className="movie-poster-img"
          onError={() => setLoadFailed(true)}
        />
      )}
    </div>
  )
}
