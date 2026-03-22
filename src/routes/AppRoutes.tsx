import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/AppLayout'
import { MoviesPage } from '../pages/MoviesPage'
import { MovieDetailsPage } from '../pages/MovieDetailsPage'
import { FavoritesPage } from '../pages/FavoritesPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<MoviesPage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="*" element={<MoviesPage />} />
      </Route>
    </Routes>
  )
}
