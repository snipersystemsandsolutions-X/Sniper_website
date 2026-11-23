import { writeFileSync, mkdirSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "..", "dist");
const SITE_URL = "https://sniperindia.com";

// No trailing slashes: these must match the canonical URLs set on each page.
// Every route listed here is also prerendered by scripts/prerender.mjs.
// The "/index.html" entries are hand-made static pages under public/partners/ — they are
// NOT prerendered; prerender.mjs skips URLs whose dist/<path>/index.html already exists.
// Client-side redirect stubs (/blog, /solutions/av-solutions, /industries/education, ...) are
// delisted on purpose: a sitemap must only list final, canonical, same-host URLs. They are
// redirected server-side via vercel.json instead.
const routes = [
  "/", "/about", "/contact", "/solutions", "/partners", "/industries", "/careers", "/gcc",
  "/solutions/it-infrastructure", "/solutions/managed-it-services", "/solutions/networking-solutions",
  "/solutions/it-consulting", "/solutions/device-deployment-mdm", "/solutions/hr-solutions",
  "/solutions/payment-services",
  "/partners/apple", "/partners/apple/Macbook_pro_M6/index.html", "/partners/microsoft/index.html",
  "/partners/nvidia", "/partners/cisco", "/partners/dell", "/partners/hp", "/partners/aws",
  "/partners/azure", "/partners/lenovo/index.html", "/partners/autodesk/index.html",
  "/partners/adobe/index.html", "/partners/logitech", "/partners/acer", "/partners/asus", "/partners/yubico",
  "/partners/unity/index.html", "/partners/unreal-engine", "/partners/fortinet", "/partners/bentley",
  "/partners/av-solutions/index.html", "/partners/cloud-solutions/index.html", "/partners/education/index.html",
  "/partners/empower-your-apple-ecosystem-with-jamf/index.html", "/partners/it-asset-disposal-plans/index.html",
  "/industries/it-ites-infra", "/industries/healthcare-pharma", "/industries/manufacturing-automotive",
  "/industries/media-and-entertainment", "/industries/aec", "/industries/government",
  "/industries/ar-vr-mr-xr",
  "/privacy", "/terms",
];

if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

const urls = routes
  .map((route) => `  <url><loc>${SITE_URL}${route === "/" ? "/" : route}</loc></url>`)
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

writeFileSync(resolve(distDir, "sitemap.xml"), xml);
console.log(`sitemap.xml written to dist/ (${routes.length} URLs)`);