import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../hooks/useTheme.js';
import { MoonIcon, SunIcon } from './icons.jsx';

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight" aria-label="Cutout home">
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" className="fill-cobalt" />
        <circle cx="16" cy="16" r="7" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="4 3" />
      </svg>
      Cutout
    </Link>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-paper-line bg-paper/90 backdrop-blur dark:border-night-line dark:bg-night/90">
      <nav className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4" aria-label="Main">
        <Logo />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="btn-ghost !px-2.5"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
          {user ? (
              <>
              {user.role === 'admin' && <Link to="/admin" className="btn-ghost">Dashboard</Link>}
              <span className="hidden max-w-[180px] truncate text-sm text-ink-soft dark:text-mist-soft sm:inline">{user.email}</span>
              <button type="button" onClick={logout} className="btn-ghost">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Log in</Link>
              <Link to="/signup" className="btn-primary">Sign up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
