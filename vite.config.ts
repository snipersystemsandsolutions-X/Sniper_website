import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import sitemap from "vite-plugin-sitemap";

const routes = [
  "/",
  "/about",
  "/blog",
  "/contact",
  "/careers",
  "/privacy",
  "/terms",

  "/solutions",
  "/solutions/av-solutions",
  "/solutions/device-deployment-mdm",
  "/solutions/it-asset-disposal",
  "/solutions/hr-solutions",
  "/solutions/it-consulting",
  "/solutions/managed-it-services",
  "/solutions/payment-services",
  "/solutions/it-infrastructure",
  "/solutions/networking-solutions",
  "/solutions/clould-solutions",

  "/partners",
  "/partners/apple",
  "/partners/nvidia",
  "/partners/microsoft",
  "/partners/lenovo",
  "/partners/autodesk",
  "/partners/adobe",
  "/partners/samsung",
  "/partners/hp",
  "/partners/unity",
  "/partners/jamf",
  "/partners/unreal-engine",
  "/partners/logitech",
  "/partners/cisco",
  "/partners/asus",
  "/partners/yubico",
  "/partners/dell",
  "/partners/acer",
  "/partners/aws",
  "/partners/azure",

  "/industries",
  "/industries/aec",
  "/industries/media-and-entertainment",
  "/industries/ar-vr-mr-xr",
  "/industries/government",
  "/industries/it-ites-infra",
  "/industries/healthcare-pharma",
  "/industries/manufacturing-automotive",
  "/industries/Education",
];

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: "https://sniperindia.com",
      dynamicRoutes: routes,
    }),
    viteCompression(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    chunkSizeWarningLimit: 3000,

    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          motion: ["motion"],
          lottie: ["lottie-react", "lottie-web"],
        },
      },
    },
  },
});
