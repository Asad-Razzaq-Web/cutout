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
  useSeo({ title: 'Admin dashboard | Cutout', description: 'Site administration.', path: '/admin', noindex: true });
  const { user, ready, logout } = useAuth();
  const { dark, toggle } = useTheme();

  if (!ready) return <p className="p-8 text-center">Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') {
    return (
      <main className="mx-auto mt-24 max-w-md px-4 text-center">
        <h1 className="font-display text-3xl font-extrabold">Admins only</h1>
        <p className="mt-3 text-ink-soft dark:text-mist-soft">
          Your account doesn&apos;t have access to the dashboard. Add your email to <code>ADMIN_EMAILS</code> in
          <code> server/.env</code>, restart the server and log in again.
        </p>
        <Link to="/" className="btn-primary mt-6">Back to the site</Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-paper-line bg-paper/90 backdrop-blur dark:border-night-line dark:bg-night/90">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="font-display text-xl font-extrabold tracking-tight">Cutout admin</Link>
            <nav aria-label="Admin" className="hidden gap-1 sm:flex">
              {TABS.map((t) => (
                <NavLink
                  key={t.to}
                  to={t.to}
                  end={t.end}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-semibold ${isActive ? 'bg-cobalt text-white' : 'hover:bg-paper-line/50 dark:hover:bg-night-line'}`
                  }
                >
                  {t.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={toggle} className="btn-ghost !px-2.5" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <Link to="/" className="btn-ghost">View site</Link>
            <button type="button" onClick={logout} className="btn-ghost">Log out</button>
          </div>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-4 pb-2 sm:hidden">
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold ${isActive ? 'bg-cobalt text-white' : ''}`
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}