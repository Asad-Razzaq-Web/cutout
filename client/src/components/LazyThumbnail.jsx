import { useEffect, useRef, useState } from 'react';
import { createThumbnail } from '../lib/imageUtils.js';

/**
 * Highly responsive client-side optimized lazy thumbnail component.
 * Loads nothing until near the viewport, then dynamically generates a high-performance,
 * size-fitted optimized preview thumbnail client-side to keep browser operations clean.
 */
export default function LazyThumbnail({ src, alt, size = 56 }) {
  const ref = useRef(null);
  const [thumb, setThumb] = useState(null);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) return setVisible(true);
    
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let url;
    let cancelled = false;

    // Use higher target resolution boundaries for high-DPI smartphone/desktop screens
    createThumbnail(src, size * 2)
      .then((u) => {
        url = u;
        if (cancelled) {
          URL.revokeObjectURL(u);
        } else {
          setThumb(u);
        }
      })
      .catch(() => !cancelled && setFailed(true));

    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [visible, src, size]);

  return (
    <div
      ref={ref}
      // Combines aspect-ratio layouts to remain 100% elastic inside flex parents without smashing
      className="checker relative shrink-0 aspect-square overflow-hidden rounded-lg bg-paper-line/30 dark:bg-night-line/30"
      style={{ 
        width: size, 
        maxHeight: size,
        maxWidth: '100%' 
      }}
    >
      {thumb ? (
        <img 
          src={thumb} 
          alt={alt} 
          width={size} 
          height={size} 
          decoding="async" 
          className="h-full w-full object-contain object-center transition-opacity duration-200" 
        />
      ) : failed ? (
        <img 
          src={src} 
          alt={alt} 
          width={size} 
          height={size} 
          loading="lazy" 
          decoding="async" 
          className="h-full w-full object-contain object-center" 
        />
      ) : (
        /* Enhanced UI loading animation indicator state block */
        <div className="absolute inset-0 h-full w-full animate-pulse bg-paper-line/60 dark:bg-night-line/60" />
      )}
    </div>
  );
}
