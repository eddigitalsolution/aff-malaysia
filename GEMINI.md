# Harimau Malaya Analytics Hub — Workspace & Development Guide

Welcome to the **Harimau Malaya Analytics Hub** (`aff-malaysia`), the premier tactical analytics, tournament tracking, and starting lineup simulator for the Malaysian National Football Team across the **ASEAN Hyundai Cup 2026** and **FIFA ASEAN Cup 2026**.

---

## ⚡ Active Workspace Rules & Directives

This project adheres to the global web development architecture and deployment standards defined in:
- [`.agents/rules/project-standards.md`](.agents/rules/project-standards.md): Master rules for React 19 + Next.js App Router, TypeScript, UI/UX anti-slop guidelines, accessibility, and SEO.
- [`.agents/rules/cloudflare-setup.md`](.agents/rules/cloudflare-setup.md): Deployment standards, edge security headers, SPA routing, and Cloudflare Pages/Workers configuration.
- [`.agents/rules/contact-details.md`](.agents/rules/contact-details.md): Project and business contact configuration.
- [`CLOUDFLARE.md`](CLOUDFLARE.md): Static deployment quick reference.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Styling**: Tailwind CSS v4, custom glassmorphism design tokens in `src/app/globals.css`
- **Iconography**: Lucide React (Clean vector outlines, anti-AI-slop standard)
- **State Management**: Zustand (`src/store/index.ts`)
- **Hosting**: Cloudflare Pages / Vercel / Netlify with edge security headers (`public/_headers`)

---

## 🚀 Key Commands

- `npm run dev`: Launch local development server (`http://localhost:3000`)
- `npm run build`: Compile and generate optimized static pages
- `npm run start`: Serve production build locally
- `npm run lint`: Run ESLint and TypeScript code analysis
