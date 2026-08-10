import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import sitemap from "vite-plugin-sitemap";
import compression from "vite-plugin-compression";

const SITE_URL = "https://sniperindia.com";

// Per-route sitemap priorities.
// Higher priority = Googlebot crawls more frequently.
const routesWithPriority: { url: string; priority: number; changefreq: string }[] = [
  // Core pages — highest priority
  { url: "/",                                    priority: 1.0, changefreq: "daily"   },
  { url: "/about",                               priority: 0.9, changefreq: "monthly" },
  { url: "/contact",                             priority: 0.9, changefreq: "monthly" },
  { url: "/solutions",                           priority: 0.9, changefreq: "weekly"  },
  { url: "/partners",                            priority: 0.9, changefreq: "weekly"  },
  { url: "/industries",                          priority: 0.9, changefreq: "weekly"  },
  { url: "/blog",                                priority: 0.8, changefreq: "weekly"  },
  { url: "/careers",                             priority: 0.7, changefreq: "weekly"  },

  // Solutions
  { url: "/solutions/it-infrastructure",         priority: 0.85, changefreq: "monthly" },
  { url: "/solutions/managed-it-services",       priority: 0.85, changefreq: "monthly" },
  { url: "/solutions/networking-solutions",      priority: 0.8,  changefreq: "monthly" },
  { url: "/solutions/it-consulting",             priority: 0.8,  changefreq: "monthly" },
  { url: "/solutions/device-deployment-mdm",    priority: 0.75, changefreq: "monthly" },
  { url: "/solutions/hr-solutions",             priority: 0.75, changefreq: "monthly" },
  { url: "/solutions/payment-services",         priority: 0.75, changefreq: "monthly" },
  { url: "/solutions/av-solutions",             priority: 0.7,  changefreq: "monthly" },
  { url: "/solutions/it-asset-disposal",        priority: 0.7,  changefreq: "monthly" },
  { url: "/solutions/clould-solutions",         priority: 0.8,  changefreq: "monthly" },

  // Partners (authorised reseller pages rank well for brand + partner searches)
  { url: "/partners/apple",                      priority: 0.8, changefreq: "monthly" },
  { url: "/partners/microsoft",                  priority: 0.8, changefreq: "monthly" },
  { url: "/partners/nvidia",                     priority: 0.8, changefreq: "monthly" },
  { url: "/partners/cisco",                      priority: 0.8, changefreq: "monthly" },
  { url: "/partners/dell",                       priority: 0.8, changefreq: "monthly" },
  { url: "/partners/hp",                         priority: 0.8, changefreq: "monthly" },
  { url: "/partners/aws",                        priority: 0.8, changefreq: "monthly" },
  { url: "/partners/azure",                      priority: 0.8, changefreq: "monthly" },
  { url: "/partners/lenovo",                     priority: 0.75, changefreq: "monthly" },
  { url: "/partners/autodesk",                   priority: 0.75, changefreq: "monthly" },
  { url: "/partners/adobe",                      priority: 0.75, changefreq: "monthly" },
  { url: "/partners/samsung",                    priority: 0.75, changefreq: "monthly" },
  { url: "/partners/logitech",                   priority: 0.7,  changefreq: "monthly" },
  { url: "/partners/acer",                       priority: 0.7,  changefreq: "monthly" },
  { url: "/partners/asus",                       priority: 0.7,  changefreq: "monthly" },
  { url: "/partners/yubico",                     priority: 0.7,  changefreq: "monthly" },
  { url: "/partners/jamf",                       priority: 0.7,  changefreq: "monthly" },
  { url: "/partners/unity",                      priority: 0.7,  changefreq: "monthly" },
  { url: "/partners/unreal-engine",              priority: 0.7,  changefreq: "monthly" },

  // Industries
  { url: "/industries/it-ites-infra",            priority: 0.8,  changefreq: "monthly" },
  { url: "/industries/healthcare-pharma",        priority: 0.8,  changefreq: "monthly" },
  { url: "/industries/manufacturing-automotive", priority: 0.75, changefreq: "monthly" },
  { url: "/industries/media-and-entertainment",  priority: 0.75, changefreq: "monthly" },
  { url: "/industries/aec",                      priority: 0.75, changefreq: "monthly" },
  { url: "/industries/government",               priority: 0.75, changefreq: "monthly" },
  { url: "/industries/ar-vr-mr-xr",             priority: 0.7,  changefreq: "monthly" },
  { url: "/industries/Education",               priority: 0.7,  changefreq: "monthly" },

  // Utility pages
  { url: "/privacy",                            priority: 0.3, changefreq: "yearly" },
  { url: "/terms",                              priority: 0.3, changefreq: "yearly" },
];

export default defineConfig({
  plugins: [
    react(),

    // Auto-generates /sitemap.xml with per-route priorities on every build
    sitemap({
      hostname: SITE_URL,
      dynamicRoutes: routesWithPriority.map((r) => r.url),
      exclude: ["/about-us"],
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date(),
      robots: [
        {
          userAgent: "*",
          allow: "/",
          disallow: ["/404.html", "/__vite_ping"],
        },
      ],
    }),

    // Brotli compression (.br) — served by most CDNs / nginx automatically.
    // Reduces JS/CSS transfer size by ~20-30% vs gzip, improving TTFB & FCP.
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 1024,
      deleteOriginFile: false,
      filter: /\.(js|css|html|svg|json)$/i,
    }),

    // Gzip (.gz) fallback for older CDNs / servers that don't support Brotli
    compression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 1024,
      deleteOriginFile: false,
      filter: /\.(js|css|html|svg|json)$/i,
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    chunkSizeWarningLimit: 3000,
    // Target modern browsers — smaller, faster output
    // ES2019 keeps optional chaining transpiled, which is needed for
    // react-snap's bundled Chromium (older V8) to pre-render pages.
    target: "es2019",

    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["react-router-dom"],
          motion: ["motion"],
          lottie: ["lottie-react"],
          radix: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-navigation-menu",
            "@radix-ui/react-tooltip",
          ],
        },
      },
    },
  },
});
