import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CookiesProvider } from 'react-cookie';
import { HelmetProvider } from 'react-helmet-async';

// scripts/prerender.mjs saves ready-made HTML for each page at build time so crawlers can read it.
// In the browser we always render fresh and replace that HTML, which avoids hydration mismatches.
createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </HelmetProvider>
);