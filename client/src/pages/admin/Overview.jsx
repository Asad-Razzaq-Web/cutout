import { useState } from 'react';
import StatCard from '../../components/admin/StatCard.jsx';
import TimeSeriesChart from '../../components/admin/TimeSeriesChart.jsx';
import { useAdminData } from '../../hooks/useAdminData.js';

const nf = new Intl.NumberFormat();
const RANGES = [7, 30, 90];

export default function Overview() {
  const [days, setDays] = useState(30);
  const stats = useAdminData('/admin/overview');
  const series = useAdminData(`/admin/timeseries?days=${days}`);

  if (stats.error) return <p role="alert" className="text-red-700 dark:text-red-300">{stats.error}</p>;
  if (!stats.data) return <p>Loading…</p>;

  const { users, images, processing, traffic, topPages } = stats.data;
  const rate = processing.successRate7 == null ? '–' : `${Math.round(processing.successRate7 * 100)}%`;
  const share30 = images.guest30 + images.member30;
  const memberPct = share30 ? Math.round((images.member30 / share30) * 100) : 0;
  const points = series.data?.points;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Overview</h1>
        <div className="flex gap-1" role="group" aria-label="Chart range">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setDays(r)}
              aria-pressed={days === r}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${days === r ? 'bg-cobalt text-white' : 'border border-paper-line dark:border-night-line'}`}
            >
              {r} days
            </button>
          ))}
        </div>
      </div>

      <section aria-label="Key numbers" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Registered users" value={nf.format(users.total)} sub={`${users.today} today · ${users.last7} this week`} />
        <StatCard label="Active users (7 days)" value={nf.format(users.active7)} sub="Logged-in users who processed an image" />
        <StatCard label="Visitors (30 days)" value={nf.format(traffic.visitors30)} sub={`${traffic.visitorsToday} today`} />
        <StatCard label="Page views (30 days)" value={nf.format(traffic.pageviews30)} />
        <StatCard label="Images processed" value={nf.format(images.total)} sub={`${images.today} today · ${images.last7} this week`} />
        <StatCard label="Success rate (7 days)" value={rate} sub={`${processing.failed7} failed`} />
        <StatCard label="API calls this month" value={nf.format(processing.callsThisMonth)} sub="Compare with your remove.bg credits" />
        <StatCard label="Disabled accounts" value={nf.format(users.disabled)} />
      </section>

      {points && (
        <section aria-label="Charts" className="grid gap-4 lg:grid-cols-2">
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

          <div className="panel p-4">
            <h3 className="font-display text-lg font-bold">Guests vs members (30 days)</h3>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-paper-line dark:bg-night-line" role="img" aria-label={`${memberPct}% of images processed by members`}>
              <div className="h-full bg-cobalt" style={{ width: `${memberPct}%` }} />
            </div>
            <p className="mt-3 text-sm text-ink-soft dark:text-mist-soft">
              {nf.format(images.member30)} by members · {nf.format(images.guest30)} by guests ({memberPct}% members)
            </p>

            <h3 className="mt-6 font-display text-lg font-bold">Top pages (30 days)</h3>
            {topPages.length === 0 ? (
              <p className="mt-2 text-sm text-ink-soft dark:text-mist-soft">No page views recorded yet.</p>
            ) : (
              <table className="mt-2 w-full text-sm">
                <tbody>
                  {topPages.map((p) => (
                    <tr key={p.path} className="border-t border-paper-line dark:border-night-line">
                      <td className="py-2 font-mono">{p.path}</td>
                      <td className="py-2 text-right">{nf.format(p.views)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}

      <p className="text-xs text-ink-soft dark:text-mist-soft">
        Image, traffic and failure numbers start counting from the moment this dashboard was installed.
      </p>
    </>
  );
}