/**
 * Fully responsive Processing Card with fluid aspect-ratio boundaries and a scanning overlay.
 * Adapts dynamically to mobile layouts, screen height variations, and multi-column sidebars.
 */
export default function ProcessingCard({ previewUrl, message }) {
  return (
    <div className="panel w-full overflow-hidden transition-all duration-200" role="status" aria-live="polite">
      
      {/* 
        Fluid Canvas Workspace:
        - `h-[40vh]`: Caps height perfectly on small mobile screens to prevent stretching or pushing text out of view.
        - `sm:h-[50vh] md:max-h-[440px]`: Dynamically expands height and anchors boundaries cleanly on tablets and desktop monitors.
      */}
      <div className="relative flex h-[40vh] sm:h-[50vh] md:max-h-[440px] w-full items-center justify-center bg-paper p-4 dark:bg-night select-none">
        
        {/* Responsive Image Constraint Panel */}
        <img 
          src={previewUrl} 
          alt="Your image being processed" 
          className="h-full w-full object-contain rounded-lg opacity-65 transition-opacity duration-300" 
        />
        {/* 
          Layout-Isolating Scan Animation Layer:
          - `touch-none pointer-events-none`: Ensures that scrolling fingers on mobile screens ignore this overlay entirely.
        */}
        <div className="pointer-events-none touch-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-y-0 w-1/3 animate-sweep bg-gradient-to-r from-transparent via-cobalt/20 dark:via-cobalt/35 to-transparent" />
        </div>
        
      </div>
      
      {/* Dynamic Progress Message Status Footer */}
      <div className="border-t border-paper-line/50 p-4 text-center dark:border-night-line/50 bg-paper/20 dark:bg-night/20 min-h-[52px] flex items-center justify-center">
        <p className="text-xs font-semibold tracking-wide text-ink-soft sm:text-sm dark:text-mist-soft max-w-[45ch] break-words">
          {message || 'Removing the background…'}
        </p>
      </div>

    </div>
  );
}
