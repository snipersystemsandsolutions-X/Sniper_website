import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CookiesProvider } from 'react-cookie';
import { HelmetProvider } from 'react-helmet-async';

const rootEl = document.getElementById("root")!;
const app = (
  <HelmetProvider>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </HelmetProvider>
);

// react-snap pre-renders HTML for each route at build time.
// On subsequent visits the browser receives that pre-rendered HTML,
// so we hydrate instead of doing a fresh render — this preserves
// the server-side content and avoids a flash of blank content.
if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, app);
} else {
  createRoot(rootEl).render(app);
}
