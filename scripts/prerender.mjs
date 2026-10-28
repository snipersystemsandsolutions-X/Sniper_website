/**
 * Build-time prerender (runs after `vite build` + the sitemap step).
 *
 * WHY: the site is a client-rendered React app, so every route used to ship the same empty
 * `<div id="root"></div>`. Search engines that run JavaScript cope; most AI crawlers (and link
 * previews) do not, so they saw no headings, no copy, no FAQs. This script opens each route in a
 * headless browser once, at build time, and saves the finished HTML as dist/<route>/index.html.
 * The app still boots normally in the visitor's browser and takes over from there.
 *
 * SAFETY: this script never fails the build. If anything goes wrong it logs the problem and the
 * site deploys exactly as it did before (empty shell, still works). Set SKIP_PRERENDER=1 to skip it.
 *
 * LOCAL RUN (Windows): set CHROME_PATH to your Chrome, e.g.
 *   $env:CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"; npm run build
 * On Vercel nothing needs to be set: @sparticuz/chromium supplies a Chromium that runs there.
 *
 * Install once:  npm i -D puppeteer-core @sparticuz/chromium
 */
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SITE_URL = 'https://sniperindia.com';
const SHELL = 'app-shell.html'; // pristine, un-rendered index.html; vercel.json rewrites unknown routes to it

/** Used only if dist/sitemap.xml can't be read. */
const FALLBACK_ROUTES = ['/', '/about', '/contact', '/solutions', '/partners', '/industries', '/gcc', '/partners/fortinet'];

/** Elements removed from the saved HTML (cookie banner, chat widgets, anything that must only exist for real visitors).
 *  Add  data-prerender-skip  to the root element of the cookie banner component. */
const STRIP_SELECTORS = [
  '[data-prerender-skip]',
  '#jotform-chat',
  'iframe[src*="jotform"]',
  '[id^="bp-web-widget"]',
  // Scripts rendered inside the app, or injected by chat/analytics widgets, must not be frozen into the saved HTML
  // (a browser would run them again on load). JSON-LD is kept.
  '#root script:not([type="application/ld+json"])',
  'script[src*="botpress"]',
  'script[src*="bpcontent"]',
  'script[src*="jotfor"]',
  'script[src*="clarity.ms"]',
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

async function readRoutes() {
  try {
    const xml = await readFile(path.join(DIST, 'sitemap.xml'), 'utf8');
    const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
    const routes = urls
      .map((u) => {
        try {
          const url = new URL(u);
          return url.origin === SITE_URL ? url.pathname.replace(/\/+$/, '') || '/' : null;
        } catch {
          return null;
        }
      })
      .filter(Boolean);
    if (routes.length) return [...new Set(routes)];
  } catch {
    /* fall through */
  }
  console.warn('[prerender] sitemap.xml not usable, using the built-in route list');
  return FALLBACK_ROUTES;
}

/** Tiny static server that behaves like Vercel: real files are served as-is, any other path gets the pristine shell. */
function startServer() {
  const server = createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const ext = path.extname(pathname);
      let file = path.join(DIST, SHELL);
      if (ext) {
        const candidate = path.normalize(path.join(DIST, pathname));
        if (candidate.startsWith(DIST) && existsSync(candidate)) file = candidate;
        else if (ext !== '.html') {
          res.writeHead(404).end();
          return;
        }
      }
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(500).end();
    }
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

/** Runs inside the page: drop runtime-only elements, and remove the static fallback tags from index.html that
 *  react-helmet-async has replaced (otherwise the saved HTML would carry two descriptions / two canonicals). */
function cleanDocument(stripSelectors) {
  stripSelectors.forEach((sel) => document.querySelectorAll(sel).forEach((el) => el.remove()));

  const keyOf = (el) => {
    if (el.tagName === 'META') {
      const k = el.getAttribute('name') || el.getAttribute('property') || el.getAttribute('http-equiv');
      return k ? `meta:${k}` : null;
    }
    if (el.tagName === 'LINK' && el.getAttribute('rel') === 'canonical') return 'link:canonical';
    return null;
  };
  const managed = new Set(
    [...document.head.querySelectorAll('[data-rh="true"]')].map(keyOf).filter(Boolean),
  );
  document.head.querySelectorAll('meta, link[rel="canonical"]').forEach((el) => {
    const key = keyOf(el);
    if (key && !el.hasAttribute('data-rh') && managed.has(key)) el.remove();
  });

  // Same for <title>: keep only the one Helmet set (it is always the last).
  const titles = [...document.head.querySelectorAll('title')];
  titles.slice(0, -1).forEach((t) => t.remove());
}

async function main() {
  if (!existsSync(path.join(DIST, 'index.html'))) {
    console.warn('[prerender] dist/index.html not found, nothing to do');
    return;
  }

  // Keep a pristine copy FIRST and ALWAYS (even when skipping): vercel.json rewrites every non-file route to it.
  await copyFile(path.join(DIST, 'index.html'), path.join(DIST, SHELL));

  if (process.env.SKIP_PRERENDER === '1') {
    console.log('[prerender] skipped (SKIP_PRERENDER=1); app shell still created');
    return;
  }

  const [{ default: puppeteer }, { default: chromium }] = await Promise.all([
    import('puppeteer-core'),
    import('@sparticuz/chromium'),
  ]);

  const routes = await readRoutes();
  // Never overwrite a hand-made static page (e.g. public/partners/apple/index.html).
  const todo = routes.filter((r) => r === '/' || !existsSync(path.join(DIST, r, 'index.html')));
  const skipped = routes.filter((r) => !todo.includes(r));

  const server = await startServer();
  const origin = `http://127.0.0.1:${server.address().port}`;

  const local = Boolean(process.env.CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || (await chromium.executablePath()),
    args: local ? ['--no-sandbox'] : chromium.args,
    // 'shell' is the mode the Vercel Chromium build supports; a normal desktop Chrome needs plain headless.
    headless: local ? true : 'shell',
  });

  const done = [];
  const failed = [];
  const warnings = [];

  try {
    for (const route of todo) {
      const page = await browser.newPage();
      try {
        await page.setViewport({ width: 1440, height: 900 });
        await page.setRequestInterception(true);
        // Only our own files load: no analytics, chat widgets or CDN scripts end up frozen into the HTML.
        page.on('request', (req) => (req.url().startsWith(origin) ? req.continue() : req.abort()));

        await page.goto(origin + route, { waitUntil: 'networkidle2', timeout: 45000 });
        await page.waitForFunction(() => (document.querySelector('#root')?.childElementCount || 0) > 0, { timeout: 20000 });
        await new Promise((r) => setTimeout(r, 1500)); // let lazy chunks + Helmet settle

        await page.evaluate(cleanDocument, STRIP_SELECTORS);
        const h1Count = await page.evaluate(() => document.querySelectorAll('h1').length);
        const html = '<!doctype html>\n' + (await page.evaluate(() => document.documentElement.outerHTML));

        if (html.length < 6000) throw new Error(`rendered HTML is only ${html.length} bytes, not saving`);
        if (h1Count !== 1) warnings.push(`${route}: ${h1Count} <h1> tags (expected 1)`);

        const outFile = route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, route, 'index.html');
        await mkdir(path.dirname(outFile), { recursive: true });
        await writeFile(outFile, html, 'utf8');
        done.push(route);
      } catch (err) {
        failed.push(`${route}: ${err.message}`);
      } finally {
        await page.close().catch(() => {});
      }
    }
  } finally {
    await browser.close().catch(() => {});
    server.close();
  }

  console.log(`[prerender] saved ${done.length}/${todo.length} routes`);
  if (skipped.length) console.log(`[prerender] left alone (static page already exists): ${skipped.join(', ')}`);
  warnings.forEach((w) => console.warn(`[prerender] WARNING ${w}`));
  failed.forEach((f) => console.warn(`[prerender] FAILED ${f}`));
}

main().catch((err) => {
  // Never break the deploy over prerendering.
  console.warn(`[prerender] stopped: ${err && err.message ? err.message : err}`);
  console.warn('[prerender] the site will deploy without prerendered pages (same as before).');
});