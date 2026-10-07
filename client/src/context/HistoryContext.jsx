import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';
import { useAuth } from './AuthContext.jsx';

const HistoryContext = createContext(null);
export const useHistory = () => useContext(HistoryContext);

export function HistoryProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) return setItems([]);
    setLoading(true);
    try {
      const data = await api('/history');
      setItems(data.items);
    } catch {
      /* sidebar is non-critical */
    } finally {
      setLoading(false);
    }
  }, [user]);

  const remove = useCallback(async (id) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
    try {
      await api(`/history/${id}`, { method: 'DELETE' });
    } catch {
      refresh();
    }
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(() => ({ items, loading, refresh, remove }), [items, loading, refresh, remove]);
  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}
