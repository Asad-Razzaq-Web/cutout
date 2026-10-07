import { useAdminData } from '../../hooks/useAdminData.js';

const fmtSize = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

export default function Activity() {
  const { data, error, loading, reload } = useAdminData('/admin/activity?limit=100');

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto transition-all duration-200">
      
      {/* Dynamic Activity Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl dark:text-mist">
            Recent activity
          </h1>
          <p className="text-xs text-ink-soft dark:text-mist-soft mt-0.5">Real-time processing event tracking log registers</p>
        </div>
        <button 
          type="button" 
          className="btn-ghost flex items-center justify-center gap-1.5 w-full sm:w-auto text-sm font-semibold min-h-[38px]" 
          onClick={reload} 
          disabled={loading}
        >
          {loading ? (
            <svg className="h-4 w-4 animate-spin text-current" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="h-4 w-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18" />
            </svg>
          )}
          <span>Refresh logs</span>
        </button>
      </div>

      {/* Accessible System Status Alerts */}
      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50/50 p-4 text-sm font-medium text-red-800 backdrop-blur-xs dark:border-red-950/40 dark:bg-red-950/20 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Primary Log Canvas Box */}
      <div className="w-full">
        {loading && !data && (
          <div className="panel p-8 text-center text-sm font-medium text-ink-soft dark:text-mist-soft animate-pulse">
            Loading recent activity logs…
          </div>
        )}
        
        {!loading && data?.items.length === 0 && (
          <div className="panel p-8 text-center text-sm font-medium text-ink-soft dark:text-mist-soft">
            No images processed on the platform yet.
          </div>
        )}

        {/* VIEW 1: Mobile-Responsive Grid Stacked Cards (Hidden on layout widths >= md screens) */}
        {data && data.items.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {data.items.map((i) => (
              <div key={i._id} className="panel p-4 flex flex-col gap-3 border border-paper-line dark:border-night-line bg-paper/50 dark:bg-night/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="block text-[11px] font-semibold text-ink-soft dark:text-mist-soft">
                      {new Date(i.createdAt).toLocaleString()}
                    </span>
                    <span className="block font-bold text-sm text-ink dark:text-mist truncate mt-0.5">
                      {i.email || 'Guest user'}
                    </span>
                  </div>
                  
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold shrink-0 ${
                    i.status === 'success' 
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' 
                      : 'bg-red-500/15 text-red-700 dark:text-red-300'
                  }`}>
                    {i.status === 'success' ? 'Success' : 'Failed'}
                  </span>
                </div>

                {/* Sub-card metadata list block */}
                <div className="flex items-center justify-between border-t border-paper-line/50 dark:border-night-line/50 pt-2.5 text-xs font-medium">
                  <div>
                    <span className="text-ink-soft dark:text-mist-soft opacity-70 mr-1.5">File size:</span>
                    <span className="text-ink dark:text-mist font-semibold">{fmtSize(i.bytes)}</span>
                  </div>
                  
                  {i.error && (
                    <div className="max-w-[60%] text-right">
                      <span className="text-red-600 dark:text-red-400 font-semibold block truncate" title={i.error}>
                        {i.error}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 2: Desktop High-Density Data Table Grid (Hidden below md breakpoint sizes) */}
        {data && data.items.length > 0 && (
          <div className="hidden md:block panel overflow-hidden">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="text-ink-soft dark:text-mist-soft bg-paper-line/10 dark:bg-night-line/10">
                <tr>
                  <th className="p-4 font-semibold">Time transaction</th>
                  <th className="p-4 font-semibold">Account identity</th>
                  <th className="p-4 font-semibold">Status outcome</th>
                  <th className="p-4 font-semibold">File weight</th>
                  <th className="p-4 font-semibold">Exception stack tracking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-line dark:divide-night-line">
                {data.items.map((i) => (
                  <tr key={i._id} className="hover:bg-paper-panel/30 dark:hover:bg-night-panel/30 transition-colors">
                    <td className="whitespace-nowrap p-4 text-ink-soft dark:text-mist-soft font-medium">
                      {new Date(i.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 font-semibold text-ink dark:text-mist">
                      {i.email || <span className="text-ink-soft/60 dark:text-mist-soft/60 font-normal italic">Guest</span>}
                    </td>
                    <td className="p-4">
                      <span className={`rounded-full px-2.5 py-0.5 RegalBadge text-xs font-bold ${
                        i.status === 'success' 
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' 
                          : 'bg-red-500/15 text-red-700 dark:text-red-300'
                      }`}>
                        {i.status === 'success' ? 'Success' : 'Failed'}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-ink-soft dark:text-mist-soft">
                      {fmtSize(i.bytes)}
                    </td>
                    <td 
                      className="max-w-[280px] truncate p-4 text-xs font-mono text-ink-soft dark:text-mist-soft opacity-85" 
                      title={i.error}
                    >
                      {i.error || <span className="opacity-40 font-sans">–</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
