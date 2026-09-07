# KCESAR TrailSafe — v1.1 prototype (PWA)

An installable, offline-capable interactive prototype of the KCESAR TrailSafe
product spec: emergency guidance, a Trip Plan generator, a Ten Essentials /
phone-readiness checklist, and a Safety Guide library.

This is a **prototype for walking through product decisions**, not the real
KCESAR app. See the About screen in the app for scope notes and what still
needs Operations/King County 911 review before anything like this could ship
for real.

## What's in this repo

```
index.html          the entire app (markup, styles, and logic in one file)
manifest.json        PWA manifest (name, icons, theme colors, display mode)
sw.js                 service worker — caches the app shell for offline use
icons/                app icons (192, 512, 512 maskable, 180 apple-touch, favicon)
```

There's no build step and no server code — it's a static site.

## Run it locally

Because service workers require a real origin (not `file://`), you need to
serve the folder over HTTP, even locally:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Then open the printed `localhost` URL in your browser.

## Deploy with GitHub Pages (recommended)

1. Push this folder to a GitHub repository.
2. In the repo: **Settings → Pages → Build and deployment → Source**, choose
   **Deploy from a branch**, pick your default branch and the `/ (root)`
   folder, then **Save**.
3. GitHub will publish it at `https://<your-username>.github.io/<repo-name>/`
   within a minute or two.
4. Open that URL on a phone. In Chrome/Edge on Android you'll see an
   **Install** option (also exposed as a button on the app's About screen);
   on iOS Safari, use the Share icon → **Add to Home Screen**.

Once installed, the app opens with no network connection at all — it was
built and tested against that requirement from the start.

## Updating the cache after you make changes

The service worker caches aggressively so the app is reliably available
offline. After you edit any file, bump the version string so returning
visitors get the update instead of a stale cache:

```js
// sw.js
const CACHE_NAME = 'trailsafe-cache-v2'; // was v1
```

## Data & privacy

Trip plans and checklist progress are saved with `localStorage`, on-device
only. Nothing is sent to a server — there isn't one. See **About → Data on
this device** in the app for the reset control.

## Regenerating the icons

Icons were generated programmatically (a simple compass mark on the app's
forest-green/safety-orange palette) rather than hand-designed — treat them as
placeholders. Swap the PNGs in `icons/` with a real KCESAR-approved mark
before this goes anywhere near production, keeping the same filenames and
dimensions (or update `manifest.json` and the `<link>` tags in `index.html`
to match new ones).
