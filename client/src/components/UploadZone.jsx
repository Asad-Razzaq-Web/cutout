import { useState } from 'react';
import { UploadIcon } from './icons.jsx';

const ACCEPT = 'image/jpeg,image/png,image/webp';

export default function UploadZone({ onFile, disabled }) {
  const [dragging, setDragging] = useState(false);

  const pick = (files) => {
    const file = files?.[0];
    if (file) onFile(file);
  };

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); if (!disabled) pick(e.dataTransfer.files); }}
      className={[
        'group flex min-h-[320px] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-8 text-center transition-colors',
        'focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-cobalt',
        dragging
          ? 'border-cobalt bg-cobalt/10'
          : 'border-paper-line bg-paper-panel hover:border-cobalt dark:border-night-line dark:bg-night-panel dark:hover:border-cobalt-light',
        disabled ? 'pointer-events-none opacity-60' : '',
      ].join(' ')}
    >
      <input
        type="file"
        accept={ACCEPT}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => { pick(e.target.files); e.target.value = ''; }}
      />
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cobalt text-white">
        <UploadIcon width={26} height={26} />
      </span>
      <span>
        <span className="block font-display text-xl font-bold">Drop an image here, or click to browse</span>
        <span className="mt-1 block text-sm text-ink-soft dark:text-mist-soft">JPG, PNG or WebP, up to 10 MB</span>
      </span>
    </label>
  );
}
