import { useCallback, useEffect, useRef, useState } from 'react';
import ProcessingCard from '../components/ProcessingCard.jsx';
import ResultViewer from '../components/ResultViewer.jsx';
import SeoGuide from '../components/SeoGuide.jsx';
import UploadZone from '../components/UploadZone.jsx';
import { useHistory } from '../context/HistoryContext.jsx';
import { useSeo } from '../hooks/useSeo.js';
import { api } from '../lib/api.js';
import { compressImage } from '../lib/imageUtils.js';

const MAX_MB = 10;
const TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Semantic structured JSON-LD schema payload optimized for search visibility
const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to remove an image background online for free',
  step: [
    { '@type': 'HowToStep', name: 'Upload your image', text: 'Drag and drop or select a JPG, PNG, or WebP image file up to 10 MB.' },
    { '@type': 'HowToStep', name: 'AI Background Extraction', text: 'The automated engine isolates the subject from its background layer.' },
    { '@type': 'HowToStep', name: 'Download Alpha PNG Cutout', text: 'Click Download High-Res to instantly save your background-removed asset.' },
  ],
};

export default function Home() {
  useSeo({
    title: 'Free Background Remover – Remove Image Backgrounds Online | Cutout',
    description:
      'Remove the background from any image in seconds. Free online background remover with transparent PNG download. No design skills needed.',
    path: '/',
    jsonLd: JSON_LD,
  });

  const { refresh } = useHistory();
  const [status, setStatus] = useState('idle'); // idle | loading | done
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const previewRef = useRef(null);

  useEffect(() => () => previewRef.current && URL.revokeObjectURL(previewRef.current), []);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError('');
  }, []);

  const handleFile = useCallback(
    async (file) => {
      setError('');
      if (!TYPES.includes(file.type)) return setError('Please choose a valid JPG, PNG or WebP image file.');
      if (file.size > MAX_MB * 1024 * 1024 * 3) return setError(`That file exceeds limits. Please select an image under ${MAX_MB} MB.`);

      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      const url = URL.createObjectURL(file);
      previewRef.current = url;
      setPreviewUrl(url);
      setStatus('loading');

      try {
        const upload = await compressImage(file);
        if (upload.size > MAX_MB * 1024 * 1024) throw new Error(`Compressed file size exceeds limits. Please use a file under ${MAX_MB} MB.`);

        const formData = new FormData();
        formData.append('image', upload);
        const data = await api('/remove-bg', { method: 'POST', formData });

        setResult(data);
        setStatus('done');
        if (data.saved) refresh();
      } catch (err) {
        setError(err.message || 'An error occurred during background removal.');
        setStatus('idle');
      }
    },
    [refresh]
  );

 return (
  <>
    {/* 1) Upload workspace: first on mobile */}
    <section
      aria-labelledby="tool-title"
      className="order-1 mx-auto flex w-full min-w-0 max-w-4xl flex-col lg:order-none"
    >
      <h1
        id="tool-title"
        className="font-display text-3xl font-extrabold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-5xl dark:text-mist"
      >
        Remove image backgrounds{' '}
        <span className="block text-cobalt sm:inline dark:text-cobalt-light">in seconds</span>
      </h1>
      <p className="mb-6 mt-3 max-w-[54ch] text-base leading-relaxed text-ink-soft sm:text-lg dark:text-mist-soft">
        Upload your photographs to instantly generate sharp, transparent PNG cutouts. Free to use, zero waiting times, and no sign-ups required.
      </p>

      <div className="min-h-[260px] w-full transition-all duration-300 sm:min-h-[360px]">
        {status === 'idle' && <UploadZone onFile={handleFile} />}
        {status === 'loading' && <ProcessingCard previewUrl={previewUrl} />}
        {status === 'done' && result && (
          <ResultViewer
            originalUrl={previewUrl}
            processedUrl={result.processedImageUrl}
            saved={result.saved}
            onReset={reset}
          />
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm font-medium text-red-800 backdrop-blur-xs transition-all dark:border-red-950/40 dark:bg-red-950/20 dark:text-red-200 animate-fade-in"
        >
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
    </section>

    {/* 4) Steps / SEO guide: last on mobile */}
    <div className="order-4 mx-auto w-full min-w-0 max-w-4xl lg:order-none lg:mt-6">
      <SeoGuide />
    </div>
  </>
);
}
