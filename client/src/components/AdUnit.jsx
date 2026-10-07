import { useEffect, useRef, useState } from 'react';

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

export default function AdUnit() {
  const pushed = useRef(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Track responsive screen thresholds to swap layouts safely before script push
  useEffect(() => {
    const checkMatch = () => setIsDesktop(window.innerWidth >= 640);
    checkMatch(); // Run on initial mount
    
    window.addEventListener('resize', checkMatch);
    return () => window.removeEventListener('resize', checkMatch);
  }, []);

  useEffect(() => {
    // Only fire the ad registration push when configuration vars are present
    if (!CLIENT || !SLOT || pushed.current) return;
    
    loadAdSense();
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* Blocked or script not ready */
    }
  }, []);

  // Compute adaptive layout dimensions based on verified screen breaks
  const adWidth = 300;
  const adHeight = isDesktop ? 600 : 250;
  const containerMinHeight = adHeight + 40; // Safely wraps text label padding heights

  return (
    <div 
      className="panel mx-auto flex w-full max-w-[340px] flex-col overflow-hidden transition-all duration-200" 
      style={{ minHeight: containerMinHeight }}
    >
      {/* Label identifier */}
      <p className="px-4 pt-3 text-xs font-medium tracking-wide text-ink-soft dark:text-mist-soft">
        Advertisement
      </p>
      
      {/* Centered Ad Slot Frame */}
      <div className="flex flex-1 items-center justify-center p-2">
        {CLIENT && SLOT ? (
          <ins
            className="adsbygoogle"
            style={{ display: 'inline-block', width: adWidth, height: adHeight }}
            data-ad-client={CLIENT}
            data-ad-slot={SLOT}
            // Tells AdSense not to alter sizing behind our backs causing CLS shifts
            data-full-width-responsive="false" 
          />
        ) : (
          <div
            className="flex items-center justify-center rounded-xl border-2 border-dashed border-paper-line text-center text-xs font-semibold text-ink-soft transition-all dark:border-night-line dark:text-mist-soft"
            style={{ width: adWidth, height: adHeight }}
            role="img"
            aria-label={`Ad placeholder, ${adWidth} by ${adHeight}`}
          >
            <div>
              <p className="font-mono text-sm">{adWidth} × {adHeight}</p>
              <p className="mt-0.5 opacity-70">ad slot</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
