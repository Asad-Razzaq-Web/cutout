import { useEffect } from 'react';

const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');

function upsert(selector, create, apply) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  apply(el);
}

const setMeta = (attr, key, content) =>
  upsert(
    `meta[${attr}="${key}"]`,
    () => Object.assign(document.createElement('meta'), { }),
    (el) => {
      el.setAttribute(attr, key);
      el.setAttribute('content', content);
    }
  );

/**
 * Manages <title>, description, canonical, OpenGraph, Twitter tags and optional JSON-LD.
 * Usage: useSeo({ title, description, path: '/', image, jsonLd })
 */
export function useSeo({ title, description, path = '/', image = '/og-image.png', noindex = false, jsonLd }) {
  useEffect(() => {
    const url = SITE_URL + path;
    const img = image.startsWith('http') ? image : SITE_URL + image;

    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow');

    upsert('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), (el) =>
      el.setAttribute('href', url)
    );

    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', 'Cutout');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', img);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', img);

    let script;
    if (jsonLd) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
    return () => script?.remove();
  }, [title, description, path, image, noindex, jsonLd]);
}
