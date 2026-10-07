import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useHistory } from '../context/HistoryContext.jsx';
import { downloadFile } from '../lib/api.js';
import { DownloadIcon, TrashIcon } from './icons.jsx';
import LazyThumbnail from './LazyThumbnail.jsx';

function LoggedOutCard() {
  return (
    <section className="panel p-5" aria-labelledby="history-cta">
      <h2 id="history-cta" className="font-display text-lg font-bold leading-snug">
        Log in to save your history and access past downloads
      </h2>
      <p className="mt-2 text-sm text-ink-soft dark:text-mist-soft">
        Every image you process while logged in is kept here, ready to download again.
      </p>
      <div className="mt-4 flex flex-col gap-2">
        <Link to="/signup" className="btn-primary">Create free account</Link>
        <Link to="/login" className="btn-ghost">Log in</Link>
      </div>
    </section>
  );
}

function HistoryList() {
  const { items, loading, remove } = useHistory();

  return (
    <section className="panel p-4" aria-labelledby="history-title">
      <h2 id="history-title" className="font-display text-lg font-bold">Your images</h2>

      {loading && items.length === 0 && <p className="mt-3 text-sm text-ink-soft dark:text-mist-soft">Loading…</p>}

      {!loading && items.length === 0 && (
        <p className="mt-3 text-sm text-ink-soft dark:text-mist-soft">
          Nothing here yet. Upload an image and it will appear in this list.
        </p>
      )}

      <ul className="mt-3 max-h-[70vh] space-y-3 overflow-y-auto pr-1">
        {items.map((item) => (
          <li key={item._id} className="flex items-center gap-3">
            <LazyThumbnail src={item.processedImageUrl} alt="Background removed thumbnail" />
            <div className="min-w-0 flex-1">
              <time className="block truncate text-xs text-ink-soft dark:text-mist-soft" dateTime={item.createdAt}>
                {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </time>
              <button
                type="button"
                onClick={() => downloadFile(item.processedImageUrl, `cutout-${item._id}.png`)}
                className="btn-ghost mt-1 !px-2.5 !py-1.5 text-xs"
              >
                <DownloadIcon width={14} height={14} /> Download
              </button>
            </div>
            <button
              type="button"
              onClick={() => remove(item._id)}
              className="rounded-md p-1.5 text-ink-soft hover:bg-paper hover:text-red-600 dark:text-mist-soft dark:hover:bg-night"
              aria-label="Delete this image"
            >
              <TrashIcon width={16} height={16} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function HistorySidebar() {
  const { user } = useAuth();
  return user ? <HistoryList /> : <LoggedOutCard />;
}
