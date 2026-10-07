import { useState } from 'react';
import { downloadFile } from '../lib/api.js';
import { DownloadIcon } from './icons.jsx';

export default function ResultViewer({ originalUrl, processedUrl, saved, onReset }) {
  const [busy, setBusy] = useState(false);

  const download = async () => {
    setBusy(true);
    try {
      await downloadFile(processedUrl, 'cutout-transparent.png');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="panel p-4" aria-label="Result">
      <div className="grid gap-4 sm:grid-cols-2">
        <figure>
          <div className="flex h-[300px] items-center justify-center overflow-hidden rounded-xl bg-paper dark:bg-night sm:h-[380px]">
            <img src={originalUrl} alt="Original image" className="max-h-full max-w-full object-contain" />
          </div>
          <figcaption className="mt-2 text-center text-sm text-ink-soft dark:text-mist-soft">Original</figcaption>
        </figure>
        <figure>
          <div className="checker flex h-[300px] items-center justify-center overflow-hidden rounded-xl sm:h-[380px]">
            <img src={processedUrl} alt="Image with background removed" className="max-h-full max-w-full object-contain" />
          </div>
          <figcaption className="mt-2 text-center text-sm text-ink-soft dark:text-mist-soft">Background removed</figcaption>
        </figure>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={download} disabled={busy} className="btn-primary">
          <DownloadIcon width={18} height={18} /> {busy ? 'Preparing…' : 'Download High-Res'}
        </button>
        <button type="button" onClick={onReset} className="btn-ghost">Remove another background</button>
      </div>
      {saved && <p className="mt-3 text-center text-sm text-ink-soft dark:text-mist-soft">Saved to your history.</p>}
    </section>
  );
}
