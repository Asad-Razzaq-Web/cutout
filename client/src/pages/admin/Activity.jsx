import { useAdminData } from '../../hooks/useAdminData.js';

const fmtSize = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

export default function Activity() {
  const { data, error, loading, reload } = useAdminData('/admin/activity?limit=100');

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Recent activity</h1>
        <button type="button" className="btn-ghost" onClick={reload} disabled={loading}>Refresh</button>
      </div>

      {error && <p role="alert" className="text-sm text-red-700 dark:text-red-300">{error}</p>}

      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-ink-soft dark:text-mist-soft">
            <tr>
              <th className="p-3 font-semibold">Time</th>
              <th className="p-3 font-semibold">Who</th>
              <th className="p-3 font-semibold">Result</th>
              <th className="p-3 font-semibold">Size</th>
              <th className="p-3 font-semibold">Error</th>
            </tr>
          </thead>
          <tbody>
            {!data && loading && <tr><td className="p-3" colSpan={5}>Loading…</td></tr>}
            {data?.items.length === 0 && <tr><td className="p-3" colSpan={5}>No images processed yet.</td></tr>}
            {data?.items.map((i) => (
              <tr key={i._id} className="border-t border-paper-line dark:border-night-line">
                <td className="whitespace-nowrap p-3">{new Date(i.createdAt).toLocaleString()}</td>
                <td className="p-3">{i.email || <span className="text-ink-soft dark:text-mist-soft">Guest</span>}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${i.status === 'success' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/15 text-red-700 dark:text-red-300'}`}>
                    {i.status === 'success' ? 'Success' : 'Failed'}
                  </span>
                </td>
                <td className="p-3">{fmtSize(i.bytes)}</td>
                <td className="max-w-[280px] truncate p-3 text-ink-soft dark:text-mist-soft" title={i.error}>{i.error || '–'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}