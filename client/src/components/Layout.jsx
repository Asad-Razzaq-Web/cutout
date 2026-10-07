import { Outlet } from 'react-router-dom';
import AdUnit from './AdUnit.jsx';
import HistorySidebar from './HistorySidebar.jsx';
import Navbar from './Navbar.jsx';

/**
 * Mobile order:  1) Upload  2) Ad  3) History  4) Steps
 * Desktop (lg+): History | Center (Upload + Steps) | Ad
 */
export default function Layout() {
  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-night dark:text-mist flex flex-col">
      <Navbar />

      <div className="mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)_320px] lg:px-8">

        {/* Center: on mobile it "disappears" so its children join the parent grid */}
        <main className="contents lg:block lg:col-start-2 lg:row-start-1 lg:min-w-0">
          <Outlet />
        </main>

        {/* History: 3rd on mobile, left column on desktop */}
        <aside
          aria-label="Your history"
          className="order-3 w-full min-w-0 lg:order-none lg:col-start-1 lg:row-start-1 lg:w-auto"
        >
          <div className="lg:sticky lg:top-24">
            <HistorySidebar />
          </div>
        </aside>

        {/* Ad: 2nd on mobile, right column on desktop */}
        <aside
          aria-label="Advertisement"
          className="order-2 w-full min-w-0 lg:order-none lg:col-start-3 lg:row-start-1 lg:w-auto"
        >
          <div className="lg:sticky lg:top-24">
            <AdUnit />
          </div>
        </aside>
      </div>

      <footer className="mt-auto border-t border-paper-line py-8 text-center text-sm text-ink-soft dark:border-night-line dark:text-mist-soft">
        © {new Date().getFullYear()} Cutout. Images are processed securely and guest uploads are deleted within the hour.
      </footer>
    </div>
  );
}