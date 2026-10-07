export default function StatCard({ label, value, sub }) {
  return (
    <div className="panel p-4">
      <p className="text-sm text-ink-soft dark:text-mist-soft">{label}</p>
      <p className="mt-1 font-display text-3xl font-extrabold tracking-tight">{value}</p>
      {sub && <p className="mt-1 text-xs text-ink-soft dark:text-mist-soft">{sub}</p>}
    </div>
  );
}