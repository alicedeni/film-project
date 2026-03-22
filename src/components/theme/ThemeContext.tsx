/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'

export type ThemeMode = 'light' | 'dark'

export interface ThemeContextValue {
  mode: ThemeMode
  toggleMode: () => void
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const STORAGE_KEY = 'movieapp_theme_mode'

function applyTheme(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode
}

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  return (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode)

  useEffect(() => {
    applyTheme(mode)
  }, [mode])

  const toggleMode = () => {
    setMode((prev) => {
      const next: ThemeMode = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem(STORAGE_KEY, next)
      applyTheme(next)
      return next
    })
  }

  const value = useMemo(() => ({ mode, toggleMode }), [mode])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
