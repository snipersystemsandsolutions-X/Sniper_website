import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sitemap from "vite-plugin-sitemap";
import path from "path";

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
          motion: ["framer-motion"],
          lottie: ["lottie-react", "lottie-web"],
        },
      },
    },
  },
});
