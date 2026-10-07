import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../hooks/useTheme.js';
import { MoonIcon, SunIcon } from './icons.jsx';

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight shrink-0" aria-label="Cutout home">
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
        <rect width="32" height="32" rx="8" className="fill-cobalt" />
        <circle cx="16" cy="16" r="7" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="4 3" />
      </svg>
      <span>Cutout</span>
    </Link>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-paper-line bg-paper/90 backdrop-blur dark:border-night-line dark:bg-night/90">
      <nav className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main">
        <Logo />
        
        {/* Core Control Frame */}
        <div className="flex items-center gap-2">
          {/* Light/Dark Toggle Button */}
          <button
            type="button"
            onClick={toggle}
            className="btn-ghost !px-2.5"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Desktop User Context Actions */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              {user.role === 'admin' && <Link to="/admin" className="btn-ghost">Dashboard</Link>}
              <span className="max-w-[150px] md:max-w-[180px] truncate text-sm font-medium text-ink-soft dark:text-mist-soft">
                {user.email}
              </span>
              <button type="button" onClick={logout} className="btn-ghost">Log out</button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="btn-ghost">Log in</Link>
              <Link to="/signup" className="btn-primary">Sign up</Link>
            </div>
          )}

          {/* Mobile Overlay Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="btn-ghost flex h-10 w-10 items-center justify-center p-0 sm:hidden"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <svg className="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* 
        High-Z Floating Dropdown Menu:
        Absolutely positioned below the 16-unit header frame boundary line,
        it layers elegantly over the layout workspace without shifting page content.
      */}
      {isMobileMenuOpen && (
        <>
          {/* Dismissible Background Panel Overlay */}
          <div 
            className="fixed inset-0 top-16 z-40 bg-black/10 backdrop-blur-xs sm:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Floating Dropdown Drawer */}
          <nav 
            aria-label="Mobile Navigation" 
            className="absolute left-0 right-0 top-16 z-50 border-b border-paper-line bg-paper px-4 py-4 shadow-xl sm:hidden dark:border-night-line dark:bg-night"
          >
            <div className="flex flex-col gap-2">
              {user ? (
                <>
                  <div className="px-3 py-2 rounded-lg bg-paper-line/30 dark:bg-night-line/30 mb-1">
                    <p className="text-xs text-ink-soft dark:text-mist-soft">Logged in as</p>
                    <p className="truncate text-sm font-semibold mt-0.5">{user.email}</p>
                  </div>
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="btn-ghost w-full justify-start text-left"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button 
                    type="button" 
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }} 
                    className="btn-ghost w-full justify-start text-left text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="btn-ghost w-full text-center"
                  >
                    Log in
                  </Link>
                  <Link 
                    to="/signup" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="btn-primary w-full text-center"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
