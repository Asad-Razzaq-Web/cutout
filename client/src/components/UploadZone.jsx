import { useState } from 'react';
import { UploadIcon } from './icons.jsx';

const ACCEPT = 'image/jpeg,image/png,image/webp';

/**
 * Modern, touch-optimized, fully responsive drag-and-drop file upload target card.
 * Context-aware copy switching tailors instruction paths cleanly for mobile viewports.
 */
export default function UploadZone({ onFile, disabled }) {
  const [dragging, setDragging] = useState(false);

  const pick = (files) => {
    const file = files?.[0];
    if (file) onFile(file);
  };

  return (
    <label
      onDragOver={(e) => { 
        e.preventDefault(); 
        if (!disabled) setDragging(true); 
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { 
        e.preventDefault(); 
        setDragging(false); 
        if (!disabled) pick(e.dataTransfer.files); 
      }}
      className={[
        // Responsive Height: 240px fluid container height on mobile, scales up to 340px on larger displays
        'group flex min-h-[240px] sm:min-h-[340px] w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-6 sm:p-10 text-center transition-all select-none',
        'focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-cobalt',
        dragging
          ? 'border-cobalt bg-cobalt/10 scale-[0.99]'
          : 'border-paper-line bg-paper-panel hover:border-cobalt dark:border-night-line dark:bg-night-panel dark:hover:border-cobalt-light',
        disabled ? 'pointer-events-none opacity-50' : '',
      ].join(' ')}
    >
      <input
        type="file"
        accept={ACCEPT}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => { 
          pick(e.target.files); 
          e.target.value = ''; 
        }}
      />
      
      {/* Icon Frame - Shrinks neatly on narrow mobile devices */}
      <span className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-cobalt text-white shadow-md transition-transform group-hover:scale-110">
        <UploadIcon className="text-xl sm:text-2xl" />
      </span>
      
      {/* Context-aware Typography Layout block */}
      <div className="max-w-[32ch] sm:max-w-md">
        <span className="block font-display text-lg font-bold tracking-tight text-ink sm:text-xl dark:text-mist">
          {/* Mobile vs Desktop context-aware textual swap toggles */}
          <span className="hidden sm:inline">Drop an image here, or </span>
          <span className="text-cobalt dark:text-cobalt-light sm:text-inherit underline sm:no-underline decoration-2 underline-offset-2">
            click to browse
          </span>
        </span>
        <span className="mt-1.5 block text-xs font-medium text-ink-soft sm:text-sm dark:text-mist-soft">
          Supports JPG, PNG or WebP <span className="inline-block">up to 10 MB</span>
        </span>
      </div>
    </label>
  );
}
