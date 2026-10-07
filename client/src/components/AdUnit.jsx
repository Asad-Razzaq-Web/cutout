import { useEffect, useRef } from 'react';

const CLIENT = import.meta.env.VITE_ADSENSE_CLIENT;
const SLOT = import.meta.env.VITE_ADSENSE_SLOT;

function loadAdSense() {
  if (!CLIENT || document.querySelector('script[data-adsense]')) return;
  const s = document.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.dataset.adsense = '1';
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;
  document.head.appendChild(s);
}

/**
 * Fixed-size container (300x600) so the ad never shifts the layout (good for CLS).
 * Without VITE_ADSENSE_CLIENT it renders a placeholder; with it, a real AdSense unit.
 */
export default function AdUnit() {
  const pushed = useRef(false);

  useEffect(() => {
    if (!CLIENT || !SLOT || pushed.current) return;
    loadAdSense();
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* ad blocker or script not ready */
    }
  }, []);

  return (
    <div className="panel mx-auto flex w-full max-w-[320px] flex-col overflow-hidden" style={{ minHeight: 640 }}>
      <p className="px-4 pt-3 text-xs text-ink-soft dark:text-mist-soft">Advertisement</p>
      <div className="flex flex-1 items-center justify-center p-2">
        {CLIENT && SLOT ? (
          <ins
            className="adsbygoogle"
            style={{ display: 'inline-block', width: 300, height: 600 }}
            data-ad-client={CLIENT}
            data-ad-slot={SLOT}
          />
        ) : (
          <div
            className="flex h-[600px] w-[300px] items-center justify-center rounded-xl border-2 border-dashed border-paper-line text-center text-sm text-ink-soft dark:border-night-line dark:text-mist-soft"
            role="img"
            aria-label="Ad placeholder, 300 by 600"
          >
            300 × 600<br />ad slot
          </div>
        )}
      </div>
    </div>
  );
}
