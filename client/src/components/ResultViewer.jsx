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
    <section className="panel p-4 sm:p-5" aria-label="Result">
      {/* 
        Grid Engine:
        - Mobile: Stacks vertically into 1 unified column.
        - Tablets & Up (sm): Snaps cleanly into a side-by-side 2-column layout.
      */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        
        {/* Original Image Canvas */}
        <figure className="flex flex-col">
          <div className="flex h-[35vh] sm:h-[45vh] md:max-h-[400px] w-full items-center justify-center overflow-hidden rounded-xl bg-paper p-3 select-none dark:bg-night">
            <img 
              src={originalUrl} 
              alt="Original preview asset" 
              className="h-full w-full object-contain transition-opacity duration-200" 
              loading="lazy"
            />
          </div>
          <figcaption className="mt-2 text-center text-xs font-semibold tracking-wide text-ink-soft sm:text-sm dark:text-mist-soft">
            Original
          </figcaption>
        </figure>

        {/* Processed Cutout Canvas */}
        <figure className="flex flex-col">
          <div className="checker flex h-[35vh] sm:h-[45vh] md:max-h-[400px] w-full items-center justify-center overflow-hidden rounded-xl p-3 select-none">
            <img 
              src={processedUrl} 
              alt="Asset with background removed" 
              className="h-full w-full object-contain transition-all duration-200" 
            />
          </div>
          <figcaption className="mt-2 text-center text-xs font-semibold tracking-wide text-ink-soft sm:text-sm dark:text-mist-soft">
            Background removed
          </figcaption>
        </figure>
      </div>

      {/* 
        Responsive Action Row:
        - Stacks into clean full-width blocks on tiny mobile screens (`flex-col w-full`).
        - Relaxes into centered groupings on tablets/desktops (`sm:flex-row sm:w-auto`).
      */}
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button 
          type="button" 
          onClick={download} 
          disabled={busy} 
          className={`btn-primary flex w-full items-center justify-center gap-2 font-semibold sm:w-auto ${
            busy ? 'opacity-75 pointer-events-none' : ''
          }`}
        >
          {busy ? (
            <svg className="h-4 w-4 animate-spin text-current" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <DownloadIcon className="text-base" />
          )}
          <span>{busy ? 'Preparing…' : 'Download High-Res'}</span>
        </button>

        <button 
          type="button" 
          onClick={onReset} 
          className="btn-ghost w-full font-semibold sm:w-auto text-center"
        >
          Remove another background
        </button>
      </div>

      {/* Synchronized History Notification Tag */}
      {saved && (
        <p className="mt-4 text-center text-xs font-medium tracking-wide text-ink-soft dark:text-mist-soft animate-fade-in" aria-live="status">
          Saved to your history.
        </p>
      )}
    </section>
  );
}
