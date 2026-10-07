import { Route, Routes } from 'react-router-dom';
import AdminShell from './components/admin/AdminShell.jsx';
import Layout from './components/Layout.jsx';
import { usePageTracking } from './hooks/usePageTracking.js';
import AuthPage from './pages/AuthPage.jsx';
import Home from './pages/Home.jsx';
import Activity from './pages/admin/Activity.jsx';
import Overview from './pages/admin/Overview.jsx';
import System from './pages/admin/System.jsx';
import Users from './pages/admin/Users.jsx';

export default function App() {
  usePageTracking();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<AuthPage mode="login" />} />
        <Route path="signup" element={<AuthPage mode="signup" />} />
      </Route>

      <Route path="admin" element={<AdminShell />}>
        <Route index element={<Overview />} />
        <Route path="users" element={<Users />} />
        <Route path="activity" element={<Activity />} />
        <Route path="system" element={<System />} />
      </Route>

      <Route element={<Layout />}>
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}