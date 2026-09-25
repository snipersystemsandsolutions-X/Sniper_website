import { writeFileSync, mkdirSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "..", "dist");
const SITE_URL = "https://sniperindia.com";

const routes = [
  "/", "/about", "/contact", "/solutions", "/partners", "/industries", "/blog", "/careers",
  "/solutions/it-infrastructure", "/solutions/managed-it-services", "/solutions/networking-solutions",
  "/solutions/it-consulting", "/solutions/device-deployment-mdm", "/solutions/hr-solutions",
  "/solutions/payment-services", "/solutions/av-solutions", "/solutions/it-asset-disposal",
  "/solutions/clould-solutions",
  "/partners/apple", "/partners/microsoft", "/partners/nvidia", "/partners/cisco", "/partners/dell",
  "/partners/hp", "/partners/aws", "/partners/azure", "/partners/lenovo", "/partners/autodesk",
  "/partners/adobe", "/partners/samsung", "/partners/logitech", "/partners/acer", "/partners/asus",
  "/partners/yubico", "/partners/jamf", "/partners/unity", "/partners/unreal-engine",
  "/industries/it-ites-infra", "/industries/healthcare-pharma", "/industries/manufacturing-automotive",
  "/industries/media-and-entertainment", "/industries/aec", "/industries/government",
  "/industries/ar-vr-mr-xr", "/industries/Education",
  "/privacy", "/terms",
];

if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

const urls = routes
  .map((route) => `  <url><loc>${SITE_URL}${route}</loc></url>`)
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

writeFileSync(resolve(distDir, "sitemap.xml"), xml);
console.log("sitemap.xml written to dist/");