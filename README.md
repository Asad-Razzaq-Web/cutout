# Cutout – Background Removal SaaS (MERN + Vite + Tailwind)

## Setup
```bash
npm run install:all
cp server/.env.example server/.env     # add MONGO_URI, JWT_SECRET, REMOVEBG_API_KEY (or Clipdrop)
cp client/.env.example client/.env     # optional: site URL + AdSense ids
npm run dev                            # API :5000, web :5173
```

## API
| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/signup | – | Create account, returns JWT |
| POST | /api/auth/login | – | Log in, returns JWT |
| GET | /api/auth/me | required | Current user |
| POST | /api/remove-bg | optional | multipart field `image`; saves history only if logged in |
| GET | /api/history | required | Your processed images |
| DELETE | /api/history/:id | required | Delete one item and its files |

## Production notes
- Serve `client/dist` and proxy `/api` + `/uploads` to Express from one domain (nginx/Caddy). This keeps image URLs relative and thumbnails CORS-free.
- Replace local `server/uploads` with S3/R2 for multi-instance deployments.
- Googlebot executes JS, but for best SEO pre-render the home page (e.g. `vite-plugin-prerender` or `react-snap`).
- Replace `YOUR-DOMAIN.com` in `client/public/robots.txt` and `sitemap.xml`; add `client/public/og-image.png` (1200x630).
