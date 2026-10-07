export default function ProcessingCard({ previewUrl }) {
  return (
    <div className="panel overflow-hidden" role="status" aria-live="polite">
      <div className="relative flex min-h-[320px] items-center justify-center bg-paper p-4 dark:bg-night">
        <img src={previewUrl} alt="Your image being processed" className="max-h-[420px] w-auto max-w-full rounded-lg object-contain opacity-70" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-y-0 w-1/3 animate-sweep bg-gradient-to-r from-transparent via-cobalt/30 to-transparent" />
        </div>
      </div>
      <p className="p-4 text-center text-sm font-medium">Removing the background… this usually takes a few seconds.</p>
    </div>
  );
}
