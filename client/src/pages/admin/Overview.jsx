import { useState } from 'react';
import StatCard from '../../components/admin/StatCard.jsx';
import TimeSeriesChart from '../../components/admin/TimeSeriesChart.jsx';
import { useAdminData } from '../../hooks/useAdminData.js';

const nf = new Intl.NumberFormat();
const RANGES =[7, 30, 90];

export default function Overview() {
  const [days, setDays] = useState(30);
  const stats = useAdminData('/admin/overview');
  const series = useAdminData(`/admin/timeseries?days=${days}`);

  if (stats.error) {
    return (
      <div role="alert" className="rounded-xl border border-red-200 bg-red-50/50 p-4 text-sm font-medium text-red-800 dark:border-red-950/40 dark:bg-red-950/20 dark:text-red-300">
        <span className="flex items-center gap-2">&rarr; {stats.error}</span>
      </div>
    );
  }

  // Prevents Cumulative Layout Shift (CLS) on tiny mobile screens
  if (!stats.data) {
    return (
      <div className="space-y-6 w-full max-w-6xl mx-auto animate-pulse">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-8 w-32 bg-paper-line/50 dark:bg-night-line rounded-lg" />
          <div className="h-9 w-48 bg-paper-line/50 dark:bg-night-line rounded-lg" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="panel h-24 bg-paper-panel/40 dark:bg-night-panel/40" />
          ))}
        </div>
      </div>
    );
  }

  const { users, images, processing, traffic, topPages } = stats.data;
  const rate = processing.successRate7 == null ? '–' : `${Math.round(processing.successRate7 * 100)}%`;
  const share30 = images.guest30 + images.member30;
  const memberPct = share30 ? Math.round((images.member30 / share30) * 100) : 0;
  const points = series.data?.points;

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto transition-all duration-200">
      
      {/* Responsive Title & Range Picker */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl dark:text-mist">
            Overview
          </h1>
          <p className="text-xs text-ink-soft dark:text-mist-soft mt-0.5">Platform telemetry and performance indicators</p>
        </div>
        
        <div className="flex w-full sm:w-auto p-1 bg-paper-line/30 rounded-xl dark:bg-night-line/30" role="group" aria-label="Time range">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setDays(r)}
              aria-pressed={days === r}
              className={`flex-1 sm:flex-none rounded-lg px-4 py-2 text-xs sm:text-sm font-bold transition-all min-h-[36px] ${
                days === r ? 'bg-cobalt text-white shadow-sm' : 'text-ink-soft dark:text-mist-soft hover:text-ink dark:hover:text-mist'
              }`}
            >
              {r} days
            </button>
          ))}
        </div>
      </div>

      {/* Grid: 1 col on small phones, 2 on tablets, 4 on desktops */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Key numbers">
        <StatCard label="Registered users" value={nf.format(users.total)} sub={`${users.today} today · ${users.last7} this week`} />
        <StatCard label="Active users (7 days)" value={nf.format(users.active7)} sub="Logged-in users who processed an image" />
        <StatCard label="Visitors (30 days)" value={nf.format(traffic.visitors30)} sub={`${traffic.visitorsToday} today`} />
        <StatCard label="Page views (30 days)" value={nf.format(traffic.pageviews30)} sub="Total views across site" />
        <StatCard label="Images processed" value={nf.format(images.total)} sub={`${images.today} today · ${images.last7} this week`} />
        <StatCard label="Success rate (7 days)" value={rate} sub={`${processing.failed7} failed processes`} />
        <StatCard label="API calls this month" value={nf.format(processing.callsThisMonth)} sub="Compare with your remove.bg credits" />
        <StatCard label="Disabled accounts" value={nf.format(users.disabled)} sub="Suspended user records" />
      </section>
      {/* Charts Section: Fits side-by-side or stacks perfectly on mobile viewports */}
      {points && (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2" aria-label="Analytics visualizer charts">
          <TimeSeriesChart
            title="Traffic"
            data={points}
            series={[
              { key: 'visitors', label: 'Visitors', color: '#5B7BFF' },
              { key: 'pageviews', label: 'Page views', color: '#1FA67A' },
            ]}
          />
          <TimeSeriesChart
            title="Images processed"
            data={points}
            series={[
              { key: 'processed', label: 'Succeeded', color: '#1FA67A' },
              { key: 'failed', label: 'Failed', color: '#E5484D' },
            ]}
          />
          <TimeSeriesChart
            title="New sign-ups"
            data={points}
            series={[{ key: 'signups', label: 'Sign-ups', color: '#E0A100' }]}
          />

          {/* Breakdown Mix Composition Panel */}
          <div className="panel p-5 flex flex-col justify-between border border-paper-line dark:border-night-line">
            <div>
              <h3 className="font-display text-base font-bold text-ink dark:text-mist sm:text-lg">Guests vs members (30 days)</h3>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-paper-line dark:bg-night-line" role="img" aria-label={`${memberPct}% of images processed by members`}>
                <div className="h-full bg-cobalt transition-all duration-500" style={{ width: `${memberPct}%` }} />
              </div>
              <p className="mt-3 text-xs sm:text-sm text-ink-soft dark:text-mist-soft font-medium">
                {nf.format(images.member30)} by members · {nf.format(images.guest30)} by guests ({memberPct}% members)
              </p>
            </div>

            {/* Top Pages List Container: Handles long mono paths securely on mobile screens */}
            <div className="mt-6">
              <h3 className="font-display text-base font-bold text-ink dark:text-mist sm:text-lg">Top pages (30 days)</h3>
              {topPages.length === 0 ? (
                <p className="mt-3 text-xs sm:text-sm text-ink-soft dark:text-mist-soft">No page views recorded yet.</p>
              ) : (
                <div className="overflow-x-auto w-full mt-3">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <tbody className="divide-y divide-paper-line/60 dark:divide-night-line/60">
                      {topPages.map((p) => (
                        <tr key={p.path} className="hover:bg-paper-line/10 dark:hover:bg-night-line/10 transition-colors">
                          <td className="py-2.5 font-mono text-ink-soft dark:text-mist-soft break-all pr-4">{p.path}</td>
                          <td className="py-2.5 text-right font-bold text-ink dark:text-mist whitespace-nowrap">{nf.format(p.views)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Analytics trace footer description */}
      <div className="pt-2">
        <p className="text-[11px] font-medium leading-relaxed text-ink-soft/70 dark:text-mist-soft/70">
          Image, traffic and failure numbers start counting from the moment this dashboard was installed.
        </p>
      </div>
    </div>
  );
}
