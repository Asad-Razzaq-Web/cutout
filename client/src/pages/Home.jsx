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
      if (!TYPES.includes(file.type)) return setError('Please choose a JPG, PNG or WebP image.');
      if (file.size > MAX_MB * 1024 * 1024 * 3) return setError(`That file is too large. Try one under ${MAX_MB} MB.`);

      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      const url = URL.createObjectURL(file);
      previewRef.current = url;
      setPreviewUrl(url);
      setStatus('loading');

      try {
        const upload = await compressImage(file);
        if (upload.size > MAX_MB * 1024 * 1024) throw new Error(`That file is too large. Try one under ${MAX_MB} MB.`);

        const formData = new FormData();
        formData.append('image', upload);
        const data = await api('/remove-bg', { method: 'POST', formData });

        setResult(data);
        setStatus('done');
        if (data.saved) refresh();
      } catch (err) {
        setError(err.message);
        setStatus('idle');
      }
    },
    [refresh]
  );

  return (
    <>
      <section aria-labelledby="tool-title">
        <h1 id="tool-title" className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
          Remove image backgrounds in seconds
        </h1>
        <p className="mb-6 mt-3 max-w-[60ch] text-lg text-ink-soft dark:text-mist-soft">
          Upload a photo and get a clean, transparent PNG. Free to use, no account needed.
        </p>

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

        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </p>
        )}
      </section>

      <SeoGuide />
    </>
  );
}
