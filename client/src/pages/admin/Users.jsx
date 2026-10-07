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
      setMessage(err.message);
    }
  };

  const patch = (u, body) => act(() => api(`/admin/users/${u._id}`, { method: 'PATCH', body }));
  const remove = (u) => {
    if (!window.confirm(`Delete ${u.email} and all of their saved images? This cannot be undone.`)) return;
    act(() => api(`/admin/users/${u._id}`, { method: 'DELETE' }));
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Users{data ? ` (${data.total})` : ''}</h1>
        <button type="button" className="btn-ghost" onClick={() => act(() => downloadAuthed('/admin/users/export', 'users.csv'))}>
          Export CSV
        </button>
      </div>

      <label className="block">
        <span className="sr-only">Search users</span>
        <input className="input max-w-sm" type="search" placeholder="Search by email or name" value={search} onChange={(e) => setSearch(e.target.value)} />
      </label>

      {(error || message) && <p role="alert" className="text-sm text-red-700 dark:text-red-300">{error || message}</p>}

      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-ink-soft dark:text-mist-soft">
            <tr>
              <th className="p-3 font-semibold">User</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Images</th>
              <th className="p-3 font-semibold">Joined</th>
              <th className="p-3 font-semibold">Last login</th>
              <th className="p-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && !data && (
              <tr><td className="p-3" colSpan={6}>Loading…</td></tr>
            )}
            {data?.items.length === 0 && (
              <tr><td className="p-3" colSpan={6}>No users match that search.</td></tr>
            )}
            {data?.items.map((u) => {
              const self = u._id === me.id;
              return (
                <tr key={u._id} className="border-t border-paper-line dark:border-night-line">
                  <td className="p-3">
                    <div className="font-semibold">{u.email}</div>
                    {u.name && <div className="text-xs text-ink-soft dark:text-mist-soft">{u.name}</div>}
                  </td>
                  <td className="space-x-1 p-3">
                    {u.role === 'admin' && <Badge tone="admin">Admin</Badge>}
                    {u.disabled ? <Badge tone="off">Disabled</Badge> : <Badge tone="ok">Active</Badge>}
                  </td>
                  <td className="p-3">{u.imageCount}</td>
                  <td className="p-3">{fmt(u.createdAt)}</td>
                  <td className="p-3">{fmt(u.lastLoginAt)}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1.5">
                      <button type="button" disabled={self} className="btn-ghost !px-2.5 !py-1.5 text-xs" onClick={() => patch(u, { disabled: !u.disabled })}>
                        {u.disabled ? 'Enable' : 'Disable'}
                      </button>
                      <button type="button" disabled={self} className="btn-ghost !px-2.5 !py-1.5 text-xs" onClick={() => patch(u, { role: u.role === 'admin' ? 'user' : 'admin' })}>
                        {u.role === 'admin' ? 'Remove admin' : 'Make admin'}
                      </button>
                      <button type="button" disabled={self} className="btn-ghost !px-2.5 !py-1.5 text-xs text-red-700 dark:text-red-300" onClick={() => remove(u)}>
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

      {data && data.pages > 1 && (
        <div className="flex items-center justify-center gap-3 text-sm">
          <button type="button" className="btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span>Page {data.page} of {data.pages}</span>
          <button type="button" className="btn-ghost" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}
    </>
  );
}