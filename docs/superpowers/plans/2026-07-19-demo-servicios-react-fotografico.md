# Ruta Casa React Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Ruta Casa Alpine page with a locally bundled React photographic demo.

**Architecture:** React components are authored in `demo-servicios-domiciliarios/src/main.jsx` and bundled by esbuild into local `assets/app.js`. The static HTML only mounts React and keeps metadata; all request state remains in `stax-demo-hogar`.

**Tech Stack:** React, ReactDOM, esbuild, static HTML/CSS, local images, Playwright.

## Global Constraints

- No CDN or runtime network resources; the compiled JS and images live in the demo folder.
- Keep `file://`, SEO metadata, a unique `h1`, local storage isolation and accessible modal behavior.
- Preserve the existing request object fields: `commune`, `service`, `urgency`, `schedule`, `detail`, `status`.

---

### Task 1: Local React build

**Files:** `package.json`, `package-lock.json`, `scripts/build_demo_hogar.js`, `demo-servicios-domiciliarios/src/main.jsx`.

- [ ] Install `react`, `react-dom` and `esbuild` locally; add `build:demo-hogar` running `node scripts/build_demo_hogar.js`.
- [ ] Bundle `src/main.jsx` to `demo-servicios-domiciliarios/assets/app.js` with `bundle: true`, `format: 'iife'`, and `platform: 'browser'`.
- [ ] Verify with `npm run build:demo-hogar` and commit the build configuration.

### Task 2: Photos and React components

**Files:** `demo-servicios-domiciliarios/fotos/*.png`, `demo-servicios-domiciliarios/src/main.jsx`, `demo-servicios-domiciliarios/index.html`.

- [ ] Add four local images for electricity, plumbing, maintenance and arrival.
- [ ] Implement `HeroVisita`, `ServicioFotografico`, `CoberturaOperativa`, `BitacoraSolicitudes` and `SolicitudModal` in `main.jsx`.
- [ ] Use `useState` plus `useEffect` for persistence and `resetDemo`; modal fields are required where appropriate and Escape/cancel reset the draft.
- [ ] Replace Alpine mount attributes with `<div id="root"></div>` and a local `<script src="./assets/app.js"></script>`.
- [ ] Run `npm run build:demo-hogar` and the focused Playwright test.

### Task 3: Visual regression and release

**Files:** `tests/demos-15-to-18-exhaustive.spec.js`.

- [ ] Extend the focused test with a visible service photo assertion and a React service CTA.
- [ ] Capture desktop and 390px pages with Chromium, inspect hero, service cards and dialog.
- [ ] Run `npm run qa:gate` and `npm run qa:e2e`; commit source, generated local bundle, tests and assets.
