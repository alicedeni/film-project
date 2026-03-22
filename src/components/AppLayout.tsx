import { Link, NavLink, Outlet } from 'react-router-dom'
import { ThemeToggle } from './theme/ThemeToggle'
import { ComparePanel } from './ComparePanel'

export function AppLayout() {
  return (
    <div className="app-root">
      <header className="app-header">
        <Link to="/" className="app-logo">
          На главную
        </Link>
        <nav className="app-nav">
          <NavLink to="/" end>
            Фильмы
          </NavLink>
          <NavLink to="/favorites">Избранное</NavLink>
        </nav>
        <div className="app-actions">
          <ThemeToggle />
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <ComparePanel />
    </div>
  )
}
