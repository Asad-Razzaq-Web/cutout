import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getToken } from '../lib/api.js';

function visitorId() {
  try {
    let id = localStorage.getItem('vid');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('vid', id);
    }
    return id;
  } catch {
    return null;
  }
}

/** Sends one anonymous page view per route change. Admin pages are never tracked. */
export function usePageTracking() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    const id = visitorId();
    if (!id) return;
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    fetch('/api/track', {
      method: 'POST',
      headers,
      body: JSON.stringify({ visitorId: id, path: pathname }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);
}