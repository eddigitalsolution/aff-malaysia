# Project Standards & Global Guidelines

## 1. UI/UX & Visual Authority
- **Anti-AI-Slop Iconography**: Use clean, minimal vector line icons (Lucide React or SVG). Strictly avoid 3D glossy icons, rainbow sparkles, or tacky badges.
- **Typography**: Clean hierarchy with high contrast, legible font weight scaling, and explicit dark mode tokens.
- **Navigation**: Clean, concise, uppercase navbar links with `whitespace-nowrap`. Mobile viewport uses an accessible drawer (`lg:hidden`).

## 2. React 19 & Next.js Standards
- Use TypeScript for strict type checking on all data models.
- Modular component structure with single responsibility.
- State management via Zustand for global tournament context.

## 3. Accessibility (a11y)
- All `<input>` fields must include `id`, `name`, `autoComplete`, and `aria-label` or `<label>`.
- Interactive buttons and links must provide accessible labels and visible focus rings.

## 4. Mobile & Safe Area Insets
- Implement `pt-[max(0.75rem,env(safe-area-inset-top))]` and `pb-[max(0.75rem,env(safe-area-inset-bottom))]` for notch and home-indicator protection.
- Pitch nodes and interactive items must be clamped horizontally (`16%` to `84%`) to prevent overflow truncation on small screens (e.g. iPhone 440px).

## 5. Security & Edge Headers
- Edge deployment must serve `public/_headers` with Content Security Policy (CSP), `X-Frame-Options: SAMEORIGIN`, and `X-Content-Type-Options: nosniff`.
- Synchronize CSP in `src/app/layout.tsx` `<meta httpEquiv="Content-Security-Policy">`.
