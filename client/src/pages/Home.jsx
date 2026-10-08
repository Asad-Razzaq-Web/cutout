import { removeBackground } from '@imgly/background-removal';
import { useCallback, useEffect, useRef, useState } from 'react';
import ProcessingCard from '../components/ProcessingCard.jsx';
import ResultViewer from '../components/ResultViewer.jsx';
import SeoGuide from '../components/SeoGuide.jsx';
import UploadZone from '../components/UploadZone.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useHistory } from '../context/HistoryContext.jsx';
import { useSeo } from '../hooks/useSeo.js';
import { api } from '../lib/api.js';
import { compressImage } from '../lib/imageUtils.js';

const TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_INPUT_MB = 30;

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to remove an image background online for free',
  step: [
    { '@type': 'HowToStep', name: 'Upload your image', text: 'Drag and drop a JPG, PNG or WebP image into the upload area.' },
    { '@type': 'HowToStep', name: 'Let the AI remove the background', text: 'The tool detects the subject and removes the background automatically.' },
    { '@type': 'HowToStep', name: 'Download your transparent PNG', text: 'Click Download High-Res to save the cutout.' },
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

  const { user } = useAuth();
  const { refresh } = useHistory();
  const [status, setStatus] = useState('idle'); // idle | loading | done
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const previewRef = useRef(null);
  const resultRef = useRef(null);

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      if (resultRef.current) URL.revokeObjectURL(resultRef.current);
    },
    []
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError('');
  }, []);

  const handleFile = useCallback(
    async (file) => {
      setError('');
      if (!TYPES.includes(file.type)) return setError('Please choose a JPG, PNG or WebP image.');
      if (file.size > MAX_INPUT_MB * 1024 * 1024) return setError(`That file is too large. Try one under ${MAX_INPUT_MB} MB.`);

      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      const url = URL.createObjectURL(file);
      previewRef.current = url;
      setPreviewUrl(url);
      setProgress('Preparing your image…');
      setStatus('loading');

      try {
        const source = await compressImage(file, { maxDimension: 4000, thresholdBytes: 4 * 1024 * 1024 });

        const blob = await removeBackground(source, {
          model: 'isnet_fp16',
          output: { format: 'image/png' },
          progress: (key, current, total) => {
            if (key.startsWith('fetch') && total) {
              setProgress(`Downloading the AI model (first time only)… ${Math.round((current / total) * 100)}%`);
            } else {
              setProgress('Removing the background…');
            }
          },
        });

        if (resultRef.current) URL.revokeObjectURL(resultRef.current);
        const processedImageUrl = URL.createObjectURL(blob);
        resultRef.current = processedImageUrl;

        let saved = false;
        if (user) {
          try {
            const form = new FormData();
            form.append('original', source);
            form.append('processed', new File([blob], 'cutout.png', { type: 'image/png' }));
            await api('/history', { method: 'POST', formData: form });
            saved = true;
            refresh();
          } catch {
            /* Fallback cutout safety */
          }
        }

        setResult({ processedImageUrl, saved });
        setStatus('done');
      } catch (err) {
        console.error(err);
        setError('Could not remove the background from that image. Try a different one.');
        setStatus('idle');
      }
    },
    [user, refresh]
  );  return (
    <div className="w-full max-w-4xl mx-auto transition-all duration-200">
      
      {/* Primary Tool View Section Block Area */}
      <section aria-labelledby="tool-title" className="flex flex-col">
        <h1 
          id="tool-title" 
          className="font-display text-3xl font-extrabold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-5xl dark:text-mist"
        >
          Remove image backgrounds <span className="text-cobalt dark:text-cobalt-light block sm:inline">in seconds</span>
        </h1>
        <p className="mb-6 mt-3 max-w-[54ch] text-base sm:text-lg text-ink-soft dark:text-mist-soft leading-relaxed">
          Upload a photo and get a clean, transparent PNG. Free to use, no account needed.
        </p>

        {/* 
          State-Preserving Elastic Container Box Frame:
          Isolates the height workspace cleanly between 260px and 360px. This effectively halts
          layout jumps or popping on mobile viewports while processing.
        */}
        <div className="w-full transition-all duration-300 min-h-[260px] sm:min-h-[360px]">
          {status === 'idle' && <UploadZone onFile={handleFile} />}
          {status === 'loading' && <ProcessingCard previewUrl={previewUrl} message={progress} />}
          {status === 'done' && result && (
            <ResultViewer
              originalUrl={previewUrl}
              processedUrl={result.processedImageUrl}
              saved={result.saved}
              onReset={reset}
            />
          )}
        </div>

        {/* Dynamic Exception Notice Error Toast Banner */}
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

      {/* SEO Explainer Content Block: Sits safely under the workspace */}
      <SeoGuide />
    </div>
  );
}
