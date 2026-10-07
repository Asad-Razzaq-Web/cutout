import { useState } from 'react';
import { Link, NavLink, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSeo } from '../../hooks/useSeo.js';
import { useTheme } from '../../hooks/useTheme.js';
import { MoonIcon, SunIcon } from '../icons.jsx';

const TABS = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/activity', label: 'Activity' },
  { to: '/admin/system', label: 'System' },
];

export default function AdminShell() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useSeo({ 
    title: 'Admin dashboard | Cutout', 
    description: 'Site administration.', 
    path: '/admin', 
    noindex: true 
  });

  const { user, ready, logout } = useAuth();
  const { dark, toggle } = useTheme();

  if (!ready) return <p className="p-8 text-center">Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') {
    return (
      <main className="mx-auto mt-24 max-w-md px-4 text-center">
        <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Admins only</h1>
        <p className="mt-3 text-sm text-ink-soft sm:text-base dark:text-mist-soft">
          Your account doesn&apos;t have access to the dashboard. Add your email to <code>ADMIN_EMAILS</code> in
          <code> server/.env</code>, restart the server and log in again.
        </p>
        <Link to="/" className="btn-primary mt-6 inline-block w-full sm:w-auto">Back to the site</Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-night dark:text-mist">
      {/* Sticky Header Wrapper */}
      <header className="sticky top-0 z-40 border-b border-paper-line bg-paper/90 backdrop-blur dark:border-night-line dark:bg-night/90">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-6">
            <Link to="/admin" className="font-display text-lg font-extrabold tracking-tight sm:text-xl">
              Cutout admin
            </Link>
            <nav aria-label="Admin Desktop" className="hidden gap-1 sm:flex">
              {TABS.map((t) => (
                <NavLink
                  key={t.to}
                  to={t.to}
                  end={t.end}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                      isActive ? 'bg-cobalt text-white' : 'hover:bg-paper-line/50 dark:hover:bg-night-line'
                    }`
                  }
                >
                  {t.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Actions & Hamburger Toggle */}
          <div className="flex items-center gap-2">
            <button 
              type="button" 
              onClick={toggle} 
              className="btn-ghost !px-2.5" 
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            
            {/* Desktop Actions */}
            <Link to="/" className="btn-ghost hidden sm:inline-flex">View site</Link>
            <button type="button" onClick={logout} className="btn-ghost hidden sm:inline-flex">Log out</button>

            {/* Mobile Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn-ghost flex h-10 w-10 items-center justify-center p-0 sm:hidden"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              <svg className="h-6 w-6 stroke-current" fill="none" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Absolute High-Z Mobile Dropdown Container */}
        {isMenuOpen && (
          <>
            {/* Click-away backdrop overlay */}
            <div 
              className="fixed inset-0 top-16 z-40 bg-black/20 backdrop-blur-xs sm:hidden" 
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Floating Mobile Nav Panel */}
            <nav 
              aria-label="Admin Mobile" 
              className="absolute left-0 right-0 top-16 z-50 border-b border-paper-line bg-paper px-4 py-3 shadow-xl transition-all sm:hidden dark:border-night-line dark:bg-night"
            >
              <div className="flex flex-col gap-1.5">
                {TABS.map((t) => (
                  <NavLink
                    key={t.to}
                    to={t.to}
                    end={t.end}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                        isActive ? 'bg-cobalt text-white' : 'hover:bg-paper-line/50 dark:hover:bg-night-line'
                      }`
                    }
                  >
                    {t.label}
                  </NavLink>
                ))}
                
                {/* Mobile View Site & Logout Buttons */}
                <div className="mt-2 border-t border-paper-line pt-2 dark:border-night-line">
                  <Link 
                    to="/" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex w-full rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-paper-line/50 dark:hover:bg-night-line"
                  >
                    View site
                  </Link>
                  <button
                    type="button"
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="flex w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-paper-line/50 dark:hover:bg-night-line"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </nav>
          </>
        )}
      </header>

      {/* Main Content: Layout does not shift anymore */}
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
