import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './components/theme/ThemeContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { CompareProvider } from './context/CompareContext'
import { AppRoutes } from './routes/AppRoutes'
import './styles/index.scss'

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ThemeProvider>
        <FavoritesProvider>
          <CompareProvider>
            <AppRoutes />
          </CompareProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
