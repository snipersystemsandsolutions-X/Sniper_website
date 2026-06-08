import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CookiesProvider } from 'react-cookie';
import { HelmetProvider } from 'react-helmet-async'; // 1. Import this

createRoot(document.getElementById("root")!).render(
  <HelmetProvider> {/* 2. Wrap the app */}
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </HelmetProvider>
);
