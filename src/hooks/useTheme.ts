import { useContext } from 'react'
import { ThemeContext } from '../components/theme/ThemeContext'

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('ThemeProvider')
  return context
}
