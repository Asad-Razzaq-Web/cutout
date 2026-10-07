import { useEffect, useRef, useState } from 'react';
import { createThumbnail } from '../lib/imageUtils.js';

/**
 * Loads nothing until near the viewport, then downsizes the image client-side
 * to a ~160px WebP so the sidebar never pulls full-resolution PNGs.
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
    createThumbnail(src, size * 2)
      .then((u) => {
        url = u;
        if (cancelled) URL.revokeObjectURL(u);
        else setThumb(u);
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
      className="checker shrink-0 overflow-hidden rounded-lg"
      style={{ width: size, height: size }}
    >
      {thumb ? (
        <img src={thumb} alt={alt} width={size} height={size} decoding="async" className="h-full w-full object-contain" />
      ) : failed ? (
        // Fallback: let the browser lazy-load the original
        <img src={src} alt={alt} width={size} height={size} loading="lazy" decoding="async" className="h-full w-full object-contain" />
      ) : (
        <div className="h-full w-full animate-pulse bg-paper-line/60 dark:bg-night-line" />
      )}
    </div>
  );
}
