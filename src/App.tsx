import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import React, { Suspense } from "react";
// Pages
const Index = React.lazy(() => import("./pages/Index"));


const About = React.lazy(() => import("./pages/About"));
const Blog = React.lazy(() => import("./pages/Blog"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Careers = React.lazy(() => import("./pages/Careers"));
const BlogA = React.lazy(() => import("./pages/BlogA"));
import NotFound from "./pages/NotFound";
import Privacy from "./pages/privacy";
import TermsAndConditions from "./pages/TermsAndConditions";

// Solutions
import Solutions from "./pages/solutions/Solutions";
import CloudSolutions from "./pages/solutions/CloudSolutions";
import AVSolutions from "./pages/solutions/AVSolutions";
import DeviceDeploymentMDM from "./pages/solutions/DeviceDeploymentMDM";
import ITAssetDisposal from "./pages/solutions/ITAssetDisposal";
import HRSolutions from "./pages/solutions/HRSolutions";
import ITConsulting from "./pages/solutions/ITConsulting";
import ManagedITServices from "./pages/solutions/ManagedITServices";
import PaymentServices from "./pages/solutions/PaymentServices";
import ITInfrastructure from "./pages/solutions/ITInfrastructure";
import NetworkingSolutions from "./pages/solutions/NetworkingSolutions";


// Partners
import Partners from "./pages/partners/Partners";
import Apple from "./pages/partners/Apple";
import Nvidia from "./pages/partners/Nvidia";
import Microsoft from "./pages/partners/Microsoft";
import Lenovo from "./pages/partners/Lenovo";
import Autodesk from "./pages/partners/Autodesk";
import Adobe from "./pages/partners/Adobe";
import Samsung from "./pages/partners/Samsung";
import HP from "./pages/partners/HP";
import Unity from "./pages/partners/Unity";
import JAMF from "./pages/partners/JAMF";
import UnrealEngine from "./pages/partners/UnrealEngine";
import Logitech from "./pages/partners/Logitech";
import Cisco from "./pages/partners/Cisco";
import Asus from "./pages/partners/Asus";
import Yubico from "./pages/partners/Yubico";
import Dell from "./pages/partners/Dell";
import Acer from "./pages/partners/Acer";
import AWS from "./pages/partners/AWS";
import Azure from "./pages/partners/Azure";


//  <Route path="/about" element={<About />} />



// Industries
import Industries from "./pages/industries/Industries";
import AEC from "./pages/industries/AEC";
import MediaEntertainment from "./pages/industries/MediaEntertainment";
import ARVRMRXR from "./pages/industries/ARVRMRXR";
import Government from "./pages/industries/Government";
import ITITESInfra from "./pages/industries/ITITESInfra";
import HealthcarePharma from "./pages/industries/HealthcarePharma";
import ManufacturingAutomotive from "./pages/industries/ManufacturingAutomotive";
import Education from "./pages/industries/Education";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
       <BrowserRouter>
  <Suspense>
    <Routes>
          <Route path="/" element={<Index />} />

          {/* Main route */}
          <Route path="/about" element={<About />} />

          {/* Redirect old URL */}
          <Route path="/about-us" element={<Navigate to="/about" replace />} />


          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/privacy" element={<Privacy/>}/>
          <Route path="/terms" element={<TermsAndConditions/>}/>

          {/* Solutions Routes */}
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

          {/* Partners Routes */}
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

          {/* Industries Routes */}
          <Route path="/industries" element={<Industries />} />
          <Route path="/industries/aec" element={<AEC />} />
          <Route path="/industries/media-and-entertainment" element={<MediaEntertainment />} />
          <Route path="/industries/ar-vr-mr-xr" element={<ARVRMRXR />} />
          <Route path="/industries/government" element={<Government />} />
          <Route path="/industries/it-ites-infra" element={<ITITESInfra />} />
          <Route path="/industries/healthcare-pharma" element={<HealthcarePharma />} />
          <Route path="/industries/manufacturing-automotive" element={<ManufacturingAutomotive />} />
          <Route path="/industries/Education" element={<Education />} />


<Route path="/blog/bloga" element={<BlogA />} />


          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
            </Routes>
  </Suspense>
</BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
