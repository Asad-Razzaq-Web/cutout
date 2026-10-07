import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { usePageTracking } from './hooks/usePageTracking.js';
import AuthPage from './pages/AuthPage.jsx';
import Home from './pages/Home.jsx';

// Code-split heavy administration assets so mobile bundles stay lightweight and fast
const AdminShell = lazy(() => import('./components/admin/AdminShell.jsx'));
const Overview = lazy(() => import('./pages/admin/Overview.jsx'));
const Users = lazy(() => import('./pages/admin/Users.jsx'));
const Activity = lazy(() => import('./pages/admin/Activity.jsx'));
const System = lazy(() => import('./pages/admin/System.jsx'));

/**
 * Global Routing Engine.
 * Implements granular bundle isolation via Lazy Splitting to protect mobile asset loading performance.
 */
export default function App() {
  usePageTracking();

  // Unified loading skeleton container optimized to prevent Layout Shift (CLS)
  const FallbackLoading = (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center p-8 text-center animate-pulse">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-cobalt border-t-transparent" />
      <p className="mt-3 text-sm font-medium text-ink-soft dark:text-mist-soft">Loading panel…</p>
    </div>
  );

  return (
    <Routes>
      {/* Core Public Views */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<AuthPage mode="login" />} />
        <Route path="signup" element={<AuthPage mode="signup" />} />
      </Route>

      {/* 
        Heavy Admin Dashboards:
        Isolated inside a Suspense layer to prevent mobile users from downloading admin code bundles 
        unless they explicitly navigate to /admin.
      */}
      <Route 
        path="admin" 
        element={
          <Suspense fallback={FallbackLoading}>
            <AdminShell />
          </Suspense>
        }
      >
        <Route index element={<Overview />} />
        <Route path="users" element={<Users />} />
        <Route path="activity" element={<Activity />} />
        <Route path="system" element={<System />} />
      </Route>

      {/* Global Safe Fallback Match / 404 Interceptor */}
      <Route element={<Layout />}>
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
