/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react'

export interface CompareMovie {
  id: string
  name: string
  year?: number
  rating?: number
  genres: string[]
  movieLength?: number
}

interface CompareContextValue {
  items: CompareMovie[]
  toggleCompare: (movie: CompareMovie) => void
  removeCompare: (id: string) => void
  clearCompare: () => void
  isInCompare: (id: string) => boolean
}

export const CompareContext = createContext<CompareContextValue | undefined>(undefined)

const MAX_ITEMS = 2

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CompareMovie[]>([])

  const toggleCompare = useCallback((movie: CompareMovie) => {
    setItems((prev) => {
      if (prev.some((item) => item.id === movie.id)) {
        return prev.filter((item) => item.id !== movie.id)
      }
      const updated = [...prev, movie]
      if (updated.length > MAX_ITEMS) return updated.slice(-MAX_ITEMS)
      return updated
    })
  }, [])

  const removeCompare = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const clearCompare = useCallback(() => {
    setItems([])
  }, [])

  const isInCompare = useCallback((id: string) => items.some((item) => item.id === id), [items])

  const value = useMemo(
    () => ({
      items,
      toggleCompare,
      removeCompare,
      clearCompare,
      isInCompare,
    }),
    [items, toggleCompare, removeCompare, clearCompare, isInCompare],
  )

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
}
