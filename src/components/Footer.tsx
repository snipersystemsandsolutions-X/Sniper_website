import { Link } from "react-router-dom";
import imgSrcc from "@/assets/sniper-logo-black.png";
import imgSrccc from "@/assets/aaaa87d7-c10a-420c-99fb-d72436796abd.png";
const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "https://blog.sniperindia.com/" },
  { name: "Contact Us", href: "/contact" },
  { name: "Solutions", href: "/Solutions" },
  { name: "Partners", href: "/Partners" },
  { name: "Industries", href: "/industries" },
  { name: "Careers", href: "/careers", badge: "We're Hiring" },
  { name: "Privacy Policy", href: "/privacy" },
];

const solutionsLinks = [
  { name: "AV Solutions", href: "/solutions/av-solutions" },
  { name: "Cloud Solutions", href: "/solutions/clould-solutions" },
  { name: "Device Deployment & MDM", href: "/solutions/device-deployment-mdm" },
  { name: "Gifting Solution", href: "/solutions/gifting-solution" },
  { name: "IT Asset Disposal", href: "/solutions/it-asset-disposal" },
  { name: "HR Solutions", href: "/solutions/hr-solutions" },
  { name: "IT Consulting Services", href: "/solutions/it-consulting" },
  { name: "Managed IT Services", href: "/solutions/managed-it-services" },
  { name: "Payment Services", href: "/solutions/payment-services" },
  { name: "IT Infrastructure Solutions", href: "/solutions/it-infrastructure" },
  { name: "Networking Solutions", href: "/solutions/networking-solutions" },
];

const partnersLinks = [
  { name: "Apple", href: "/partners/apple" },
  { name: "Nvidia", href: "/partners/nvidia" },
  { name: "Microsoft", href: "/partners/microsoft" },
  { name: "Lenovo", href: "/partners/lenovo" },
  { name: "Autodesk", href: "/partners/autodesk" },
  { name: "Adobe", href: "/partners/adobe" },
  { name: "Samsung", href: "/partners/samsung" },
  { name: "HP", href: "/partners/hp" },
  { name: "Unity", href: "/partners/unity" },
  { name: "JAMF", href: "/partners/jamf" },
  { name: "Unreal Engine", href: "/partners/unreal-engine" },
  { name: "Logitech", href: "/partners/logitech" },
  { name: "Cisco", href: "/partners/cisco" },
  { name: "Asus", href: "/partners/asus" },
  { name: "Yubico", href: "/partners/yubico" },
  { name: "Dell", href: "/partners/dell" },
  { name: "Acer", href: "/partners/acer" },
];

const industriesLinks = [
  { name: "AEC", href: "/industries/aec" },
  { name: "Media & Entertainment", href: "/industries/media-and-entertainment" },
  { name: "AR / VR / MR / XR", href: "/industries/ar-vr-mr-xr" },
  { name: "Government Sector", href: "/industries/government" },
  { name: "IT / ITES / Infrastructure", href: "/industries/it-ites-infra" },
  { name: "Healthcare & Pharma", href: "/industries/healthcare-pharma" },
  { name: "Manufacturing & Automotive", href: "/industries/manufacturing-automotive" },
  { name: "Education", href: "/industries/Education" },
];

const socialLinks = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/sniper-systems-solutions-pvt-ltd" },
  { name: "Facebook", href: "https://www.facebook.com/snipersystemsandsolution/" },
  { name: "Instagram", href: "https://www.instagram.com/sniperindia/" },
  { name: "Twitter / X", href: "https://x.com/_sniperindia" },
  { name: "YouTube", href: "https://www.youtube.com/@Snipersystemsandsolutions" },
];

const locations = [
  "Chennai",
  "Bangalore",
  "Hyderabad",
  "Gurugram",
  "Coimbatore",
  "Kochi",
  "Vijayawada",
];

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Cookie Policy", href: "/cookie-policy" },
];

// Small badge used for "New" / "We're Hiring" style tags
const Badge = ({ children }) => (
  <span className="ml-2 inline-flex items-center rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-medium leading-none text-white">
    {children}
  </span>
);

// Reusable footer link column
const LinkColumn = ({ title, links }) => (
  <div>
    <h3 className="text-lg font-normal mb-6 text-stone-900">{title}</h3>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            className="inline-flex items-center text-base text-stone-700 hover:text-stone-900 transition-colors"
          >
            {link.name}
            {link.badge && <Badge>{link.badge}</Badge>}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

// Faint dotted world-map graphic used behind the locations bar.
// Pure SVG / CSS — no external image asset required.
const LocationsMap = () => (
  <svg
    viewBox="0 0 400 90"
    className="hidden lg:block h-16 w-auto text-stone-400"
    fill="none"
    aria-hidden="true"
  >
    {Array.from({ length: 12 }).map((_, row) =>
      Array.from({ length: 40 }).map((_, col) => {
        // sparse pseudo-random dot placement to suggest a world map silhouette
        const seed = (row * 40 + col) % 7;
        if (seed !== 0) return null;
        return (
          <circle
            key={`${row}-${col}`}
            cx={col * 10 + 4}
            cy={row * 8 + 4}
            r="1.4"
            fill="currentColor"
            opacity="0.35"
          />
        );
      })
    )}
    <circle cx="60" cy="30" r="3" fill="#ef4444" />
    <circle cx="140" cy="50" r="3" fill="#ef4444" />
    <circle cx="230" cy="20" r="3" fill="#ef4444" />
    <circle cx="300" cy="60" r="3" fill="#ef4444" />
    <circle cx="360" cy="35" r="3" fill="#ef4444" />
  </svg>
);

export const Footer = () => {
  return (
    <footer className="bg-stone-200 text-stone-800">
      <div className="container mx-auto px-8 lg:px-16 py-20">
        {/* Top Section — CTA + 5 link columns */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12 lg:gap-10 mb-20">
          {/* CTA */}
          <div className="lg:col-span-1">
            <h2 className="text-3xl lg:text-4xl font-light leading-tight mb-6 text-stone-900">
              Stay connected
              <br />
              to the future of
              <br />
              Enterprise IT
            </h2>
            <p className="text-stone-600 mb-6 max-w-xs">
              Crafted with creativity &amp; passion, let&rsquo;s stay connected and reach out
              each other
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-3 rounded-full bg-stone-900 text-stone-50 pl-5 pr-2 py-2 hover:bg-stone-700 transition-colors"
            >
              Get in Touch
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-50 text-stone-900">
                →
              </span>
            </a>

            <div className="mt-10 space-y-2">
              <p className="text-lg text-stone-600">Contact Us</p>
              <p className="text-lg">
                <a
                  href="tel:+918939301100"
                  className="text-stone-700 hover:text-stone-900 transition-colors"
                >
                  +91 8939301100
                </a>
                {" | "}
                <a
                  href="mailto:enquiry@sniperindia.com"
                  className="text-stone-700 hover:text-stone-900 transition-colors"
                >
                  Enquiry@sniperindia.com
                </a>
              </p>
            </div>
          </div>

          <LinkColumn title="Quick Links" links={quickLinks} />
          <LinkColumn title="Solutions" links={solutionsLinks} />
          <LinkColumn title="Partners" links={partnersLinks} />
          <LinkColumn title="Industries" links={industriesLinks} />

          {/* Social — plain list, external links */}
          <div>
            <h3 className="text-lg font-normal mb-6 text-stone-900">Social</h3>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-base text-stone-700 hover:text-stone-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


        </div>

        {/* Locations bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 rounded-2xl border border-stone-400/70 px-6 py-6 mb-16">
  <div className="flex items-start lg:items-center gap-3 flex-wrap">
    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500 text-stone-700 shrink-0">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
</span>
    <span className="font-normal text-stone-900 shrink-0">
      Locations
    </span>
    <span className="text-stone-700">
      {locations.join(" | ")}
    </span>
  </div>

 <img
  src={imgSrccc}
  alt="Global Locations"
  className="hidden lg:block w-[150px] h-30 "
/>
</div>

        {/* Bottom Section */}
        <div className="border-t border-stone-400 pt-8">

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">


            {/* Text-based brand mark — replaces the raster logo image */}
            <div className="flex items-center">
  <img
     src={imgSrcc}
    alt="Sniper Logo"
    className="h-16 w-auto object-contain"
  />
</div>

            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-stone-700">
              {legalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover:text-stone-900 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <p className="text-sm text-stone-700 whitespace-nowrap">
              © Sniper Systems &amp; Solutions {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
