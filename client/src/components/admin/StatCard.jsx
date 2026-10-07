export default function StatCard({ label, value, sub }) {
  return (
    <div className="panel flex flex-col justify-between p-4 sm:p-5 transition-all">
      <div>
        {/* Label - scales down text size gracefully on tiny screens */}
        <p className="truncate text-xs font-medium text-ink-soft sm:text-sm dark:text-mist-soft" title={label}>
          {label}
        </p>
        
        {/* Value - responsive font sizes prevent layout breaks with large numbers */}
        <p className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl break-words">
          {value}
        </p>
      </div>

      {/* Subtext - takes advantage of flex setup to align perfectly at the bottom */}
      {sub && (
        <p className="mt-2 text-xs text-ink-soft line-clamp-2 dark:text-mist-soft" title={sub}>
          {sub}
        </p>
      )}
    </div>
  );
}
