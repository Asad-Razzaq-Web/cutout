/**
 * SEO-Optimized Step-by-Step Educational Content Guide.
 * Fully responsive image containers prevent scaling clipping or hidden edges.
 */
export default function SeoGuide() {
  return (
    <section 
      aria-labelledby="guide-title" 
      className="mt-12 w-full font-prose text-base leading-7 text-ink-soft dark:text-mist-soft sm:text-[17px] sm:leading-8"
    >
      {/* Primary Semantic H2 Header Target for SEO Indexing */}
      <div className="max-w-[72ch]">
        <h2 
          id="guide-title" 
          className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl lg:text-4xl dark:text-mist"
        >
          How to Remove Image Backgrounds Online for Free
        </h2>
        <p className="mt-4">
          Removing the background from a picture used to mean tracing around your subject for twenty minutes in Photoshop.
          With our AI-powered online background remover, you can achieve professional cutouts in a few seconds, straight from your browser. Whether
          you are preparing product photos for an online store, optimizing e-commerce listings, customizing profile pictures, or designing marketing materials, 
          a clean transparent cutout makes your imagery pop. Here is how to remove an image background for free in three simple steps.
        </p>
      </div>

      {/* Step-by-Step Layout Grid List */}
      <ol className="mt-12 space-y-12">
        {/* Step 1 */}
        <li className="grid grid-cols-1 gap-6 items-center lg:grid-cols-12 lg:gap-8">
          <article className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cobalt text-xs font-bold text-white">1</span>
              <h3 className="font-display text-xl font-bold text-ink dark:text-mist">Upload Your Image</h3>
            </div>
            <p className="mt-3 max-w-[68ch]">
              Drag your photo into the upload area above, or click it to choose a file from your device. The tool accepts
              <strong> JPG, PNG, and WebP images up to 10 MB</strong>. For the best result, pick a photo where your subject is in focus and
              clearly separated from what is behind it. People, pets, products, cars, and logos all work exceptionally well. Large
              photos are optimized in your browser before upload, keeping the tool ultra-fast even on slow connections.
            </p>
          </article>
          
          {/* 
            Optimized Responsive Image Frame:
            - Removing 'absolute' allows the container to handle image sizing dynamically.
            - `p-2` adds a tiny safety padding cushion so the image edges never hit the card lines.
          */}
          <div className="lg:col-span-5 order-first lg:order-none w-full">
            <div className="checker flex aspect-[4/3] w-full items-center justify-center rounded-xl border border-paper-line bg-paper/50 p-2 shadow-xs dark:border-night-line dark:bg-night/50">
              <img 
                src="./images/step-1-upload.png" 
                alt="How to upload your image infographic step instruction guide" 
                loading="lazy"
                // `object-contain` guarantees the image shrinks to fit entirely inside without cutting off
                className="max-w-full max-h-full h-auto w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </li>

        {/* Step 2 */}
        <li className="grid grid-cols-1 gap-6 items-center lg:grid-cols-12 lg:gap-8">
          <article className="lg:col-span-7 lg:order-last">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cobalt text-xs font-bold text-white">2</span>
              <h3 className="font-display text-xl font-bold text-ink dark:text-mist">AI Automatic Background Removal</h3>
            </div>
            <p className="mt-3 max-w-[68ch]">
              As soon as your image arrives, our automated AI engine detects the main subject and isolates it from
              the backdrop—preserving fine details like hair strands, pet fur, and complex transparent boundaries. There is
              nothing to manually select and no brush adjustments needed. You will see a fast scanning animation, and then your original
              and the background-removed version appear side by side for a clear immediate comparison.
            </p>
          </article>
          <div className="lg:col-span-5 w-full">
            <div className="checker flex aspect-[4/3] w-full items-center justify-center rounded-xl border border-paper-line bg-paper/50 p-2 shadow-xs dark:border-night-line dark:bg-night/50">
              <img 
                src="./images/step-2-AI.png" 
                alt="AI tracking scan dividing a portrait foreground subject from its background layer" 
                loading="lazy"
                className="max-w-full max-h-full h-auto w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </li>
        {/* Step 3 */}
        <li className="grid grid-cols-1 gap-6 items-center lg:grid-cols-12 lg:gap-8">
          <article className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cobalt text-xs font-bold text-white">3</span>
              <h3 className="font-display text-xl font-bold text-ink dark:text-mist">Download Your Transparent PNG</h3>
            </div>
            <p className="mt-3 max-w-[68ch]">
              Happy with the results? Click <strong>Download High-Res</strong> to save your processed graphic file instantly as an alpha-channel transparent PNG. 
              You can overlay it onto custom solid colors, introduce new background scenery, or import the assets straight into Canva, Figma, PowerPoint, 
              or your e-commerce platform. Create a free account to store processed imagery directly into your history tray.
            </p>
          </article>
          <div className="lg:col-span-5 order-first lg:order-none w-full">
            <div className="checker flex aspect-[4/3] w-full items-center justify-center rounded-xl border border-paper-line bg-paper/50 p-2 shadow-xs dark:border-night-line dark:bg-night/50">
              <img 
                src="./images/step-3-download.png" 
                alt="Downloading a clean cutout transparent background PNG image asset" 
                loading="lazy"
                className="max-w-full max-h-full h-auto w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </li>
      </ol>

      {/* Pro Tips Insight Panel Card Block */}
      <div className="panel mt-16 p-5 sm:p-6 bg-paper/40 dark:bg-night/40 max-w-[76ch] rounded-xl border border-paper-line/50 dark:border-night-line/50">
        <h3 className="font-display text-xl font-bold text-ink dark:text-mist">Tips for Perfect Transparent Cutouts</h3>
        <p className="mt-2.5 text-sm sm:text-base">
          Ensuring bright, uniform lighting conditions and distinct contrast fields behind your subject gives the cleanest edges. Avoid heavy motion blur, 
          and keep your main subjects completely contained within your initial frame parameters. If your first attempt isn't perfect, try utilizing a sharper version 
          of the photo with distinct color separations. Because transparent PNG files maintain high-fidelity alpha data profiles, you can reuse outputs endlessly across layout iterations.
        </p>
      </div>

      {/* FAQ Schema Accordion Framework Grid */}
      <div className="mt-16 max-w-[76ch]">
        <h3 className="font-display text-xl font-bold text-ink dark:text-mist">Frequently Asked Questions</h3>
        <dl className="mt-6 space-y-6 border-t border-paper-line/60 pt-6 dark:border-night-line/60">
          <div>
            <dt className="text-base font-bold text-ink dark:text-mist">Is this background remover really free?</dt>
            <dd className="mt-1.5 text-sm sm:text-base max-w-[68ch]">
              Yes. You can process and extract backgrounds completely free of charge, with zero cost barriers and no mandatory sign-ups. Setting up an authenticated account profile simply unlocks storage history tools.
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
