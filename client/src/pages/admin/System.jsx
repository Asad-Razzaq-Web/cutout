import StatCard from '../../components/admin/StatCard.jsx';
import { useAdminData } from '../../hooks/useAdminData.js';

const fmtBytes = (b) => (b >= 1073741824 ? `${(b / 1073741824).toFixed(2)} GB` : `${(b / 1048576).toFixed(1)} MB`);
const fmtUptime = (s) => {
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return d ? `${d}d ${h}h` : h ? `${h}h ${m}m` : `${m}m`;
};

export default function System() {
  const { data, error } = useAdminData('/admin/system');
  if (error) return <p role="alert" className="text-red-700 dark:text-red-300">{error}</p>;
  if (!data) return <p>Loading…</p>;

  return (
    <>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">System</h1>
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="System status">
        <StatCard label="Database" value={data.database === 'connected' ? 'Connected' : 'Down'} />
        <StatCard
          label="Background removal API"
          value={data.providerConfigured ? 'Key set' : 'Key missing'}
          sub={`Provider: ${data.provider}`}
        />
        <StatCard label="Stored images" value={fmtBytes(data.storageBytes)} sub={`${data.files} files on disk`} />
        <StatCard label="Server uptime" value={fmtUptime(data.uptimeSeconds)} sub={`${data.memoryMb} MB memory`} />
        <StatCard label="Environment" value={data.environment} sub={`Node ${data.node}`} />
        <StatCard label="Upload limit" value={`${data.maxFileMb} MB`} />
      </section>
    </>
  );
}