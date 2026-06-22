import { Link } from "react-router-dom";
// ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import imgSrcc from "@/assets/sniper-logo-black.png";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;



};

const quickLinks = [
  { name: "Home", href: "https://www.sniperindia.com/" },
  { name: "Blog", href: "https://www.sniperindia.com/blog" },
  { name: "Contact Us", href: "https://www.sniperindia.com/contact" },

  { name: "Solutions", href: "https://www.sniperindia.com/Solutions" },
  { name: "Partners", href: "https://www.sniperindia.com/Partners" },
  { name: "Industries", href: "https://www.sniperindia.com/industries" },
  { name: "Careers", href: "https://www.sniperindia.com/careers" },

  { name: "Privacy Policy", href: "/privacy" },
];

const solutionsLinks = [
  { name: "AV Solutions", href: "https://www.sniperindia.com/solutions/av-solutions" },
    { name: "Cloud Solutions", href: "https://www.sniperindia.com/solutions/clould-solutions", desc: "Scalable cloud services" },
  { name: "Device Deployment & MDM", href: "https://www.sniperindia.com/solutions/device-deployment-mdm" },
  { name: "Gifting Solution", href: "https://www.sniperindia.com/solutions/gifting-solution" },
  { name: "IT Asset Disposal", href: "https://www.sniperindia.com/solutions/it-asset-disposal" },
  { name: "HR Solutions", href: "https://www.sniperindia.com/solutions/hr-solutions" },
  { name: "IT Consulting Services", href: "https://www.sniperindia.com/solutions/it-consulting" },
  { name: "Managed IT Services", href: "https://www.sniperindia.com/solutions/managed-it-services" },
  { name: "Payment Services", href: "https://www.sniperindia.com/solutions/payment-services" },
  { name: "IT Infrastructure Solutions", href: "https://www.sniperindia.com/solutions/it-infrastructure" },
  { name: "Networking Solutions", href: "https://www.sniperindia.com/solutions/networking-solutions" },
];

const partnersLinks = [
  { name: "Apple", href: "https://www.sniperindia.com/partners/apple" },
  { name: "Nvidia", href: "https://www.sniperindia.com/partners/nvidia" },
  { name: "Microsoft", href: "https://www.sniperindia.com/partners/microsoft" },
  { name: "Lenovo", href: "https://www.sniperindia.com/partners/lenovo" },
  { name: "Autodesk", href: "https://www.sniperindia.com/partners/autodesk" },
  { name: "Adobe", href: "https://www.sniperindia.com/partners/adobe" },
  { name: "Samsung", href: "https://www.sniperindia.com/partners/samsung" },
  { name: "HP", href: "https://www.sniperindia.com/partners/hp" },
  { name: "Unity", href: "https://www.sniperindia.com/partners/unity" },
  { name: "JAMF", href: "https://www.sniperindia.com/partners/jamf" },
  { name: "Unreal Engine", href: "https://www.sniperindia.com/partners/unreal-engine" },
  { name: "Logitech", href: "https://www.sniperindia.com/partners/logitech" },
  { name: "Cisco", href: "https://www.sniperindia.com/partners/cisco" },
  { name: "Asus", href: "https://www.sniperindia.com/partners/asus" },
  { name: "Yubico", href: "https://www.sniperindia.com/partners/yubico" },
  { name: "Dell", href: "https://www.sniperindia.com/partners/dell" },
  { name: "Acer", href: "https://www.sniperindia.com/partners/acer" },
];

const industriesLinks = [
  { name: "AEC", href: "https://www.sniperindia.com/industries/aec" },
  { name: "Media & Entertainment", href: "https://www.sniperindia.com/industries/media-and-entertainment" },
  { name: "AR / VR / MR / XR", href: "https://www.sniperindia.com/industries/ar-vr-mr-xr" },
  { name: "Government Sector", href: "https://www.sniperindia.com/industries/government" },
  { name: "IT / ITES / Infrastructure", href: "https://www.sniperindia.com/industries/it-ites-infra" },
  { name: "Healthcare & Pharma", href: "https://www.sniperindia.com/industries/healthcare-pharma" },
  { name: "Manufacturing & Automotive", href: "https://www.sniperindia.com/industries/manufacturing-automotive" },
  { name: "Education", href: "https://www.sniperindia.com/industries/Education", desc: "EdTech and digital learning solutions" },
];

export const Footer = () => {
  return (
    <footer className="bg-stone-200 text-stone-800">
      <div className="container mx-auto px-8 lg:px-16 py-20">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-20 mb-32">
          {/* Left Column - CTA */}
          <div className="lg:col-span-1">
            <h2 className="text-4xl lg:text-5xl font-light leading-tight mb-6 text-stone-900">
              Stay connected<br />to the future of<br />Enterprise IT
            </h2>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 text-lg border-b-2 border-stone-900 pb-1 hover:border-stone-600 transition-colors"
            >
              Get in Touch <span>→</span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-normal mb-6 text-stone-900">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-base text-stone-700 hover:text-stone-900 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-lg font-normal mb-6 text-stone-900">Solutions</h3>
            <ul className="space-y-3">
              {solutionsLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-base text-stone-700 hover:text-stone-900 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners & Industries Combined */}

            {/* Partners */}
            <div>
              <h3 className="text-lg font-normal mb-6 text-stone-900">Partners</h3>
              <ul className="space-y-3">
                {partnersLinks.slice(0, 17).map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-base text-stone-700 hover:text-stone-900 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Industries */}
            <div>
              <h3 className="text-lg font-normal mb-6 text-stone-900">Industries</h3>
              <ul className="space-y-3">
                {industriesLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-base text-stone-700 hover:text-stone-900 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

        </div>

        {/* Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-20">
          <div className="lg:col-span-1"></div>

          <div className="lg:col-span-2">
            <h3 className="text-lg font-normal mb-6 text-stone-900">Contact</h3>
            <div className="space-y-4">
              <div>
                <p className="font-normal text-stone-900 mb-4">Chennai | Bangalore | Hyderabad | Coimbatore | Kochi | Gurugram | Vijayawada</p>

               <a
  href="tel:+918939301100"
  className="text-base text-stone-700 hover:text-stone-900 transition-colors"
>
  +91 8939301100
</a>

              </div>
              <div>
                <a
                  href="mailto:enquiry@sniperindia.com"
                  className="text-base text-stone-700 hover:text-stone-900 transition-colors"
                >
                  Enquiry@sniperindia.com
                </a>
              </div>
            </div>
          </div>

        <div>


  <h3 className="text-lg font-normal mb-6 text-stone-900">Social</h3>

  <div className="flex flex-col space-y-3">

    <Link
      to="https://www.linkedin.com/company/sniper-systems-solutions-pvt-ltd"
      className="text-base text-stone-700 hover:text-stone-900 transition-colors"
    >
      LinkedIn
    </Link>

    <Link
      to="https://www.facebook.com/snipersystemsandsolution/"
      className="text-base text-stone-700 hover:text-stone-900 transition-colors"
    >
      Facebook
    </Link>

    <Link
      to="https://www.instagram.com/sniperindia/"
      className="text-base text-stone-700 hover:text-stone-900 transition-colors"
    >
      Instagram
    </Link>

    <Link
      to="https://x.com/_sniperindia"
      className="text-base text-stone-700 hover:text-stone-900 transition-colors"
    >
      Twitter / X
    </Link>

    <Link
      to="https://www.youtube.com/@Snipersystemsandsolutions"
      className="text-base text-stone-700 hover:text-stone-900 transition-colors"
    >
      YouTube
    </Link>

  </div>
</div>

        </div>

        {/* Bottom Section with Brand */}
        <div className="relative border-t border-stone-400 pt-12">
          {/* Legal Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-2 mb-12 text-sm text-stone-700">
            <a href="/privacy" className="hover:text-stone-900 transition-colors">
              Privacy Policy
            </a>
            <a href="/Solutions" className="hover:text-stone-900 transition-colors">
             Solutions
            </a>
            <a href="/Partners" className="hover:text-stone-900 transition-colors">
             Partners
            </a>
            <a href="/industries" className="hover:text-stone-900 transition-colors">
             Industries
            </a>
<div className="flex flex-col items-center leading-tight">
  <span className="text-[6px] text-red-500 uppercase tracking-wider animate-float -mt-1">
    Join our team
  </span>
  <a href="/Careers" className="hover:text-stone-900 transition-colors">
    Careers
  </a>
</div>
          </div>

          {/* Copyright and Brand */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            <p className="text-sm text-stone-700">
  ©&nbsp;SniperSystems&nbsp;2026
</p>

            {/* Large Brand Typography
            <div className="text-right">
              <h2 className="text-7xl lg:text-8xl xl:text-9xl font-light tracking-tight text-stone-900 leading-none">
                Sniper
              </h2>
            </div>
*/}

{/* Large Brand Image - Typography Equivalent */}
<div className="text-right">
  <img
    src={imgSrcc}
    alt="Sniper"
    className="inline-block w-[40%] lg:w-[50%] xl:w-[35%] h-auto object-contain"
  />
</div>





          </div>
        </div>
      </div>
    </footer>
  );
};
