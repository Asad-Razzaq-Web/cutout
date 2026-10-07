import { Outlet } from 'react-router-dom';
import AdUnit from './AdUnit.jsx';
import HistorySidebar from './HistorySidebar.jsx';
import Navbar from './Navbar.jsx';

/**
 * 3-column layout. On mobile the tool comes first (order-1), then history, then ad.
 * On lg+, the DOM order is left | center | right.
 */
export default function Layout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
        <aside aria-label="Your history" className="order-2 lg:order-none">
          <div className="lg:sticky lg:top-24">
            <HistorySidebar />
          </div>
        </aside>

        <main className="order-1 min-w-0 lg:order-none">
          <Outlet />
        </main>

        <aside aria-label="Advertisement" className="order-3 lg:order-none">
          <div className="lg:sticky lg:top-24">
            <AdUnit />
          </div>
        </aside>
      </div>

      <footer className="border-t border-paper-line py-8 text-center text-sm text-ink-soft dark:border-night-line dark:text-mist-soft">
        © {new Date().getFullYear()} Cutout. Images are processed securely and guest uploads are deleted within the hour.
      </footer>
    </div>
  );
}
