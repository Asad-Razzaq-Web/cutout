import { useEffect, useState } from 'react';
import { useAdminData } from '../../hooks/useAdminData.js';
import { api, downloadAuthed } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

const fmt = (d) => (d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '–');

function Badge({ children, tone }) {
  const tones = {
    admin: 'bg-cobalt/15 text-cobalt dark:text-cobalt-light',
    off: 'bg-red-500/15 text-red-700 dark:text-red-300',
    ok: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

export default function Users() {
  const { user: me } = useAuth();
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, error, loading, reload } = useAdminData(`/admin/users?page=${page}&search=${encodeURIComponent(query)}`);

  const act = async (fn) => {
    setMessage('');
    try {
      await fn();
      reload();
    } catch (err) {
      setMessage(err.message || 'An error occurred.');
    }
  };

  const patch = (u, body) => act(() => api(`/admin/users/${u._id}`, { method: 'PATCH', body }));
  const remove = (u) => {
    if (!window.confirm(`Delete ${u.email} and all of their saved images? This cannot be undone.`)) return;
    act(() => api(`/admin/users/${u._id}`, { method: 'DELETE' }));
  };

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto transition-all duration-200">
      
      {/* Responsive Title & CSV Action Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-ink dark:text-mist">
            Users{data ? ` (${data.total})` : ''}
          </h1>
          <p className="text-xs text-ink-soft dark:text-mist-soft mt-0.5">Manage administrative account logs and operational directory access.</p>
        </div>
        <button 
          type="button" 
          className="btn-ghost flex items-center justify-center gap-1.5 w-full sm:w-auto text-sm font-semibold min-h-[40px] sm:min-h-0" 
          onClick={() => act(() => downloadAuthed('/admin/users/export', 'users.csv'))}
        >
          <span>Export CSV</span>
        </button>
      </div>

      {/* Input Search Target Wrapper */}
      <div className="w-full">
        <label className="block w-full max-w-md">
          <span className="sr-only">Search users directory</span>
          <input 
            className="input w-full px-4 min-h-[42px] text-sm" 
            type="search" 
            placeholder="Search by email or name" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </label>
      </div>

      {/* Status Notice Messages */}
      {(error || message) && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50/50 p-4 text-sm font-medium text-red-800 dark:border-red-950/40 dark:bg-red-950/20 dark:text-red-300">
          {error || message}
        </div>
      )}
      {/* Primary Responsive View Wrapper Panel */}
      <div className="w-full">
        {loading && !data && (
          <div className="panel p-8 text-center text-sm font-medium text-ink-soft dark:text-mist-soft animate-pulse">
            Loading directory charts…
          </div>
        )}
        
        {!loading && data?.items.length === 0 && (
          <div className="panel p-8 text-center text-sm font-medium text-ink-soft dark:text-mist-soft">
            No system user directory records match that query parameters.
          </div>
        )}

        {/* 1. Mobile Interface Cards View Matrix (Visible on screen layouts < md breakpoint) */}
        {data && data.items.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {data.items.map((u) => {
              const self = u._id === me.id;
              return (
                <div key={u._id} className="panel p-4 flex flex-col gap-3 border border-paper-line dark:border-night-line bg-paper/50 dark:bg-night/50 rounded-xl">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-sm truncate text-ink dark:text-mist">{u.email}</div>
                      {u.name && <div className="text-xs text-ink-soft dark:text-mist-soft mt-0.5 truncate">{u.name}</div>}
                    </div>
                    <div className="flex flex-wrap gap-1 shrink-0 justify-end max-w-[40%]">
                      {u.role === 'admin' && <Badge tone="admin">Admin</Badge>}
                      {u.disabled ? <Badge tone="off">Disabled</Badge> : <Badge tone="ok">Active</Badge>}
                    </div>
                  </div>
                  
                  {/* Parameter Subgrid Metrics List */}
                  <div className="grid grid-cols-3 gap-2 border-y border-paper-line/50 dark:border-night-line/50 py-2 text-xs font-medium text-ink-soft dark:text-mist-soft">
                    <div>
                      <span className="block text-[10px] uppercase font-bold opacity-60">Images</span>
                      <span className="text-ink dark:text-mist font-bold text-sm">{u.imageCount}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold opacity-60">Joined</span>
                      <span className="text-ink dark:text-mist truncate block">{fmt(u.createdAt)}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold opacity-60">Active</span>
                      <span className="text-ink dark:text-mist truncate block">{fmt(u.lastLoginAt)}</span>
                    </div>
                  </div>

                  {/* Accessible Mobile Control Actions */}
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                    <button type="button" disabled={self} className="btn-ghost flex-1 sm:flex-none !px-3 !py-2 text-xs font-bold min-h-[38px]" onClick={() => patch(u, { disabled: !u.disabled })}>
                      {u.disabled ? 'Enable' : 'Disable'}
                    </button>
                    <button type="button" disabled={self} className="btn-ghost flex-1 sm:flex-none !px-3 !py-2 text-xs font-bold min-h-[38px]" onClick={() => patch(u, { role: u.role === 'admin' ? 'user' : 'admin' })}>
                      {u.role === 'admin' ? 'Demote' : 'Promote'}
                    </button>
                    <button type="button" disabled={self} className="btn-ghost flex-1 sm:flex-none !px-3 !py-2 text-xs font-bold text-red-600 dark:text-red-400 min-h-[38px]" onClick={() => remove(u)}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. Desktop High-Density Table Display Matrix Grid (Visible on dashboard resolutions >= md screens) */}
        {data && data.items.length > 0 && (
          <div className="hidden md:block panel overflow-hidden rounded-xl border border-paper-line dark:border-night-line">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="text-ink-soft dark:text-mist-soft bg-paper-line/10 dark:bg-night-line/10">
                <tr>
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Images</th>
                  <th className="p-4 font-semibold">Joined</th>
                  <th className="p-4 font-semibold">Last login</th>
                  <th className="p-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-line dark:divide-night-line">
                {data.items.map((u) => {
                  const self = u._id === me.id;
                  return (
                    <tr key={u._id} className="hover:bg-paper-panel/30 dark:hover:bg-night-panel/30 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-ink dark:text-mist">{u.email}</div>
                        {u.name && <div className="text-xs text-ink-soft dark:text-mist-soft mt-0.5">{u.name}</div>}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          {u.role === 'admin' && <Badge tone="admin">Admin</Badge>}
                          {u.disabled ? <Badge tone="off">Disabled</Badge> : <Badge tone="ok">Active</Badge>}
                        </div>
                      </td>
                      <td className="p-4 font-medium text-ink dark:text-mist">{u.imageCount}</td>
                      <td className="p-4 text-ink-soft dark:text-mist-soft">{fmt(u.createdAt)}</td>
                      <td className="p-4 text-ink-soft dark:text-mist-soft">{fmt(u.lastLoginAt)}</td>
                      <td className="p-4">
                        <div className="flex justify-end gap-1.5">
                          <button type="button" disabled={self} className="btn-ghost !px-2.5 !py-1.5 text-xs font-semibold" onClick={() => patch(u, { disabled: !u.disabled })}>
                            {u.disabled ? 'Enable' : 'Disable'}
                          </button>
                          <button type="button" disabled={self} className="btn-ghost !px-2.5 !py-1.5 text-xs font-semibold" onClick={() => patch(u, { role: u.role === 'admin' ? 'user' : 'admin' })}>
                            {u.role === 'admin' ? 'Remove admin' : 'Make admin'}
                          </button>
                          <button type="button" disabled={self} className="btn-ghost !px-2.5 !py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10" onClick={() => remove(u)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Fluid Dashboard Pagination Strip */}
      {data && data.pages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 text-sm font-medium text-ink-soft dark:text-mist-soft">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button type="button" className="btn-ghost min-h-[38px] flex-1 sm:flex-none px-4 rounded-lg" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>&larr; Previous</button>
            <span className="px-2 text-xs sm:text-sm whitespace-nowrap font-semibold">Page {data.page} of {data.pages}</span>
            <button type="button" className="btn-ghost min-h-[38px] flex-1 sm:flex-none px-4 rounded-lg" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>Next &rarr;</button>
          </div>
        </div>
      )}
    </div>
  );
}
