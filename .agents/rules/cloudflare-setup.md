# Cloudflare Setup & Edge Deployment Rules

## 1. Hosting Architecture
- Deploy via **Cloudflare Pages** or **Cloudflare Workers**.
- Static assets and edge rules must reside in `public/_headers` and `public/_redirects`.

## 2. Content Security Policy (CSP)
```http
/*
  Content-Security-Policy: default-src 'self' https: data: blob: 'unsafe-inline'; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: blob:; font-src 'self' https: data:; connect-src 'self' https: wss:;
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
```

## 3. SPA Routing
- For Cloudflare Pages, use `public/_redirects`:
  ```txt
  /*  /index.html  200
  ```
- In `wrangler.jsonc`, use `pages_build_output_dir: "./.next"` or `"./dist"` depending on build target, or `not_found_handling: "single-page-application"`.
