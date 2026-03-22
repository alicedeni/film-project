/* eslint-disable react-refresh/only-export-components */
import { createContext, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

export interface FavoriteMovie {
  id: string
  name: string
  posterUrl?: string
  year?: number
  rating?: number
}

const STORAGE_KEY = 'movieapp_favorites'

function loadFromStorage(): FavoriteMovie[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is FavoriteMovie =>
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        'name' in item &&
        typeof (item as FavoriteMovie).id === 'string' &&
        typeof (item as FavoriteMovie).name === 'string',
    )
  } catch {
    return []
  }
}

export interface FavoritesContextValue {
  favorites: FavoriteMovie[]
  isFavorite: (id: string) => boolean
  addFavorite: (movie: FavoriteMovie) => void
  removeFavorite: (id: string) => void
}

export const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>(loadFromStorage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const isFavorite = useCallback(
    (id: string) => favorites.some((fav) => fav.id === id),
    [favorites],
  )

  const addFavorite = useCallback((movie: FavoriteMovie) => {
    setFavorites((prev) => {
      if (prev.some((fav) => fav.id === movie.id)) return prev
      return [...prev, movie]
    })
  }, [])

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id))
  }, [])

  const value = useMemo(
    () => ({
      favorites,
      isFavorite,
      addFavorite,
      removeFavorite,
    }),
    [favorites, isFavorite, addFavorite, removeFavorite],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}
