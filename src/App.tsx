import Preloader from "@/components/Preloader";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AnimatePresence, motion } from "motion/react";
import React, { Suspense, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppleStyleDock } from "./components/AppleStyleDock";

// ── Lazy pages (code-split for faster initial load) ──────────────────────────
const Index = React.lazy(() => import("./pages/Index"));
const About = React.lazy(() => import("./pages/About"));
const Blog = React.lazy(() => import("./pages/Blog"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Careers = React.lazy(() => import("./pages/Careers"));

// ── Eager pages (small, no benefit from lazy-loading) ───────────────────────
import NotFound from "./pages/NotFound";
import Privacy from "./pages/privacy";
import TermsAndConditions from "./pages/TermsAndConditions";

// Solutions
import AVSolutions from "./pages/solutions/AVSolutions";
import CloudSolutions from "./pages/solutions/CloudSolutions";
import DeviceDeploymentMDM from "./pages/solutions/DeviceDeploymentMDM";
import HRSolutions from "./pages/solutions/HRSolutions";
import ITAssetDisposal from "./pages/solutions/ITAssetDisposal";
import ITConsulting from "./pages/solutions/ITConsulting";
import ITInfrastructure from "./pages/solutions/ITInfrastructure";
import ManagedITServices from "./pages/solutions/ManagedITServices";
import NetworkingSolutions from "./pages/solutions/NetworkingSolutions";
import PaymentServices from "./pages/solutions/PaymentServices";
import Solutions from "./pages/solutions/Solutions";

// Partners
import Acer from "./pages/partners/Acer";
import Adobe from "./pages/partners/Adobe";
import Apple from "./pages/partners/Apple";
import Asus from "./pages/partners/Asus";
import Autodesk from "./pages/partners/Autodesk";
import AWS from "./pages/partners/AWS";
import Azure from "./pages/partners/Azure";
import Cisco from "./pages/partners/Cisco";
import Dell from "./pages/partners/Dell";
import HP from "./pages/partners/HP";
import JAMF from "./pages/partners/JAMF";
import Lenovo from "./pages/partners/Lenovo";
import Logitech from "./pages/partners/Logitech";
import Microsoft from "./pages/partners/Microsoft";
import Nvidia from "./pages/partners/Nvidia";
import Partners from "./pages/partners/Partners";
import Samsung from "./pages/partners/Samsung";
import Unity from "./pages/partners/Unity";
import UnrealEngine from "./pages/partners/UnrealEngine";
import Yubico from "./pages/partners/Yubico";

// Industries
import AEC from "./pages/industries/AEC";
import ARVRMRXR from "./pages/industries/ARVRMRXR";
import Education from "./pages/industries/Education";
import Government from "./pages/industries/Government";
import HealthcarePharma from "./pages/industries/HealthcarePharma";
import Industries from "./pages/industries/Industries";
import ITITESInfra from "./pages/industries/ITITESInfra";
import ManufacturingAutomotive from "./pages/industries/ManufacturingAutomotive";
import MediaEntertainment from "./pages/industries/MediaEntertainment";

// ── Page transition variants ─────────────────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

/**
 * Wraps every route's content with a fade+slide transition.
 * Must live inside <BrowserRouter> so it can call useLocation().
 */
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        className="page-transition"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Suspense fallback={null}>

          <Routes location={location}>
            <Route path="/" element={<Index />} />

            {/* Main pages */}
            <Route path="/about" element={<About />} />
            <Route path="/about-us" element={<Navigate to="/about" replace />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<TermsAndConditions />} />

            {/* Solutions */}
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/solutions/av-solutions" element={<AVSolutions />} />
            <Route path="/solutions/device-deployment-mdm" element={<DeviceDeploymentMDM />} />
            <Route path="/solutions/it-asset-disposal" element={<ITAssetDisposal />} />
            <Route path="/solutions/hr-solutions" element={<HRSolutions />} />
            <Route path="/solutions/it-consulting" element={<ITConsulting />} />
            <Route path="/solutions/managed-it-services" element={<ManagedITServices />} />
            <Route path="/solutions/payment-services" element={<PaymentServices />} />
            <Route path="/solutions/it-infrastructure" element={<ITInfrastructure />} />
            <Route path="/solutions/networking-solutions" element={<NetworkingSolutions />} />
            <Route path="/solutions/clould-solutions" element={<CloudSolutions />} />

            {/* Partners */}
            <Route path="/partners" element={<Partners />} />
            <Route path="/partners/apple/" element={<Apple />} />
            <Route path="/partners/nvidia" element={<Nvidia />} />
            <Route path="/partners/microsoft" element={<Microsoft />} />
            <Route path="/partners/lenovo" element={<Lenovo />} />
            <Route path="/partners/autodesk" element={<Autodesk />} />
            <Route path="/partners/adobe" element={<Adobe />} />
            <Route path="/partners/samsung" element={<Samsung />} />
            <Route path="/partners/hp" element={<HP />} />
            <Route path="/partners/unity" element={<Unity />} />
            <Route path="/partners/jamf" element={<JAMF />} />
            <Route path="/partners/unreal-engine" element={<UnrealEngine />} />
            <Route path="/partners/logitech" element={<Logitech />} />
            <Route path="/partners/cisco" element={<Cisco />} />
            <Route path="/partners/asus" element={<Asus />} />
            <Route path="/partners/yubico" element={<Yubico />} />
            <Route path="/partners/dell" element={<Dell />} />
            <Route path="/partners/acer" element={<Acer />} />
            <Route path="/partners/aws" element={<AWS />} />
            <Route path="/partners/azure" element={<Azure />} />

            {/* Industries */}
            <Route path="/industries" element={<Industries />} />
            <Route path="/industries/aec" element={<AEC />} />
            <Route path="/industries/media-and-entertainment" element={<MediaEntertainment />} />
            <Route path="/industries/ar-vr-mr-xr" element={<ARVRMRXR />} />
            <Route path="/industries/government" element={<Government />} />
            <Route path="/industries/it-ites-infra" element={<ITITESInfra />} />
            <Route path="/industries/healthcare-pharma" element={<HealthcarePharma />} />
            <Route path="/industries/manufacturing-automotive" element={<ManufacturingAutomotive />} />
            <Route path="/industries/education" element={<Education />} />
            <Route path="/industries/Education" element={<Navigate to="/industries/education" replace />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Root app ─────────────────────────────────────────────────────────────────
const queryClient = new QueryClient();

const App = () => {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <>
      {/*
       * Preloader lives here — outside QueryClientProvider, TooltipProvider,
       * BrowserRouter, and AnimatePresence — so it is NEVER inside a CSS
       * transform stacking context. position:fixed works correctly at this level.
       */}
      {!preloaderDone && (
        <Preloader onComplete={() => setPreloaderDone(true)} />
      )}

      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Analytics />
           <SpeedInsights />
            <AnimatedRoutes />
            <AppleStyleDock />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </>
  );
};

export default App;
