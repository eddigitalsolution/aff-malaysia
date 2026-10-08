# Cloudflare Deployment Quick Reference

## Edge Security & Redirects
- **Edge Headers**: Configured in [`public/_headers`](public/_headers) with CSP, nosniff, SAMEORIGIN, and Referrer-Policy.
- **SPA Fallback**: Configured in [`public/_redirects`](public/_redirects).
- **Meta CSP**: Synchronized in [`src/app/layout.tsx`](src/app/layout.tsx).

## Build Command & Output
- **Build Command**: `npm run build`
- **Node.js Version**: `20.x` or higher
