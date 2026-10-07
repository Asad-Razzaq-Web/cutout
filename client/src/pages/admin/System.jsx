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

  if (error) {
    return (
      <div role="alert" className="rounded-xl border border-red-200 bg-red-50/50 p-4 text-sm font-medium text-red-800 dark:border-red-950/40 dark:bg-red-950/20 dark:text-red-300">
        <div className="flex gap-2">
          <svg className="h-4 w-4 shrink-0 stroke-current mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6 w-full max-w-6xl mx-auto animate-pulse">
        <div className="h-9 w-32 bg-paper-line/50 dark:bg-night-line rounded-lg" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="panel h-28 bg-paper-panel/40 dark:bg-night-panel/40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto transition-all duration-200">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl dark:text-mist">
          System Infrastructure
        </h1>
        <p className="text-xs text-ink-soft dark:text-mist-soft mt-0.5">
          Real-time environment configurations and storage cluster status telemetry
        </p>
      </div>

      {/* 
        Fluid Responsive Grid Framework:
        - Mobile views (`default`): `grid-cols-1` prevents label text squeeze.
        - Tablet views (`sm` breakpoint+): Spreads to `grid-cols-2`.
        - Large Desktops (`lg` breakpoint+): Spreads to `grid-cols-4`.
      */}
      <section 
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" 
        aria-label="System status overview indicators"
      >
        <StatCard 
          label="Database status" 
          value={data.database === 'connected' ? 'Connected' : 'Down'} 
        />
        
        <StatCard
          label="Background removal API"
          value={data.providerConfigured ? 'Key Set' : 'Key Missing'}
          sub={`Provider: ${data.provider}`}
        />
        
        <StatCard 
          label="Stored assets space" 
          value={fmtBytes(data.storageBytes)} 
          sub={`${data.files.toLocaleString()} files on disk`} 
        />
        
        <StatCard 
          label="Server uptime core" 
          value={fmtUptime(data.uptimeSeconds)} 
          sub={`${data.memoryMb.toLocaleString()} MB RAM memory`} 
        />
        
        <StatCard 
          label="Runtime environment" 
          value={data.environment} 
          sub={`Node v${data.node}`} 
        />
        
        <StatCard 
          label="Maximum upload limit" 
          value={`${data.maxFileMb} MB`} 
          sub="Per transaction request"
        />
      </section>
    </div>
  );
}
