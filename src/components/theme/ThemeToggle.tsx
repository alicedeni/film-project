import { IconMoon } from '../icons/IconMoon'
import { IconSun } from '../icons/IconSun'
import { useTheme } from '../../hooks/useTheme'

export function ThemeToggle() {
  const { mode, toggleMode } = useTheme()
  const isLight = mode === 'light'
  const label = isLight ? 'Переключить на темную тему' : 'Переключить на светлую тему'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleMode}
      aria-label={label}
      title={label}
    >
      {isLight ? (
        <IconSun className="theme-toggle-icon" />
      ) : (
        <IconMoon className="theme-toggle-icon" />
      )}
    </button>
  )
}
