import { Link } from "react-router-dom";
import imgSrcc from "@/assets/sniper-logo-black.png";
import footermap from "@/assets/footermap.png";
import {
  FiMail,
  FiPhone,
} from "react-icons/fi";

import {
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

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
  <span className="ml-2 inline-flex items-center rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-regular leading-none tracking-wide text-white">
    {children}
  </span>
);

// Reusable footer link column
const LinkColumn = ({ title, links }) => (
  <div>
    <h3 className="text-base font-medium mb-5 text-stone-900">{title}</h3>
    <ul className="space-y-3.5">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            className={`inline-flex items-center text-sm transition-colors ${
              link.active
                ? "text-red-500 hover:text-red-600"
                : "text-stone-600 hover:text-red-600"
            }`}
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
    className="hidden lg:block h-16 w-auto text-stone-300"
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
            opacity="0.45"
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

// Floating scroll-to-top button
const ScrollToTop = () => (
  <button
    type="button"
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    aria-label="Scroll to top"
    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700 shadow-sm hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-colors"
  >
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
      <path d="m18 15-6-6-6 6" />
    </svg>
  </button>
);

export const Footer = () => {
  return (
    <footer className="bg-stone-50 text-stone-800 rounded-t-[32px] border-t border-stone-200 shadow-[0_-12px_30px_-12px_rgba(0,0,0,0.12)]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20 py-14 lg:py-16">
        {/* Top Section — CTA + 5 link columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[380px_repeat(4,1fr)] gap-y-12 gap-x-8 xl:gap-x-10 2xl:gap-x-12 mb-14">
          {/* CTA */}
          <div className="max-w-[360px]">
            <h2 className="text-[26px] md:text-[28px] lg:text-[30px] font-semibold leading-[1.2] tracking-tighter mb-4 text-stone-900 whitespace-nowrap">
              Stay Connected to
              <br/>
              the future of Enterprise IT
            </h2>
            <p className="text-sm leading-6 tracking-tight text-stone-500 mb-6 max-w-xs">
              Crafted with creativity &amp; passion, let&rsquo;s stay connected and reach out
              each other
            </p>
            <a
              href="/contact"
  className="group relative inline-flex items-center gap-3 rounded-full bg-stone-900 text-stone-50 pl-2 pr-5 py-2 overflow-hidden hover:bg-red-600 transition-colors duration-300 hover:animate-btn-bounce"
>
  {/* 1. Arrow circle */}
  {/* Arrow circle — horizontal slide, left to right */}
<span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-50 text-stone-900 overflow-hidden">
  <svg
    className="absolute h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-6"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
  <svg
    className="absolute h-4 w-4 -translate-x-6 transition-transform duration-300 ease-out group-hover:translate-x-0"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
</span>

  {/* 2. Text swap — THIS is the part you were asking about */}
  <span className="relative h-5 overflow-hidden">
    <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
      Get in Touch
    </span>
    <span className="absolute left-0 top-0 block translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
      Get in Touch
    </span>
  </span>
</a>

            {/* Contact Section */}
<div className="mt-14">
  <h3 className="text-lg font-medium text-stone-900 mb-6">
    Contact Us
  </h3>

  <div className="space-y-5">

    {/* Email */}
    <a
      href="mailto:Enquiry@sniperindia.com"
      className="group flex items-center gap-4"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-200 transition-colors group-hover:bg-red-500">
        <FiMail className="text-lg text-stone-700 transition-colors group-hover:text-white" />
      </div>

      <div>
        <p className="text-sm text-stone-500">Email</p>

        <p className="text-[15px] text-stone-800 underline underline-offset-4 group-hover:text-red-600 transition-colors">
          Enquiry@sniperindia.com
        </p>
      </div>
    </a>

    {/* Phone */}
    <a
      href="tel:+918939301100"
      className="group flex items-center gap-4"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-200 transition-colors group-hover:bg-red-500">
        <FiPhone className="text-lg text-stone-700 transition-colors group-hover:text-white" />
      </div>

      <div>
        <p className="text-sm text-stone-500">Phone</p>

        <p className="text-[15px] text-stone-800 group-hover:text-red-600 transition-colors">
          +91 89393 01100
        </p>
      </div>
    </a>

  </div>

  {/* Follow Us */}
  <div className="mt-10">
    <h3 className="text-lg font-medium text-stone-900 mb-5">
      Follow us on
    </h3>

    <div className="flex items-center gap-3">

      {/* LinkedIn */}
      <a
        href="https://www.linkedin.com/company/sniper-systems-solutions-pvt-ltd"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-11 w-11 items-center justify-center rounded-full bg-stone-200 transition-all duration-300 hover:-translate-y-1 hover:bg-[#0077B5]"
      >
        <FaLinkedinIn className="text-lg text-stone-600 group-hover:text-white" />
      </a>

      {/* Facebook */}
      <a
        href="https://www.facebook.com/snipersystemsandsolution/"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-11 w-11 items-center justify-center rounded-full bg-stone-200 transition-all duration-300 hover:-translate-y-1 hover:bg-[#1877F2]"
      >
        <FaFacebookF className="text-lg text-stone-600 group-hover:text-white" />
      </a>

      {/* Instagram */}
      <a
        href="https://www.instagram.com/sniperindia/"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-11 w-11 items-center justify-center rounded-full bg-stone-200 transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF]"
      >
        <FaInstagram className="text-lg text-stone-600 group-hover:text-white" />
      </a>

      {/* Twitter / X */}
      <a
        href="https://x.com/_sniperindia"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-11 w-11 items-center justify-center rounded-full bg-stone-200 transition-all duration-300 hover:-translate-y-1 hover:bg-black"
      >
        <FaXTwitter className="text-lg text-stone-600 group-hover:text-white" />
      </a>

      {/* YouTube */}
      <a
        href="https://www.youtube.com/@Snipersystemsandsolutions"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-11 w-11 items-center justify-center rounded-full bg-stone-200 transition-all duration-300 hover:-translate-y-1 hover:bg-[#FF0000]"
      >
        <FaYoutube className="text-lg text-stone-600 group-hover:text-white" />
      </a>

    </div>
  </div>
</div>
          </div>

          <LinkColumn title="Quick Links" links={quickLinks} />
          <LinkColumn title="Solutions" links={solutionsLinks} />
          <LinkColumn title="Partners" links={partnersLinks} />
          <LinkColumn title="Industries" links={industriesLinks} />

          {/* Social — plain list, external links */}
          
        </div>

        {/* Locations bar + scroll-to-top */}
        
    {/* ===========================================
      OUR PRESENCE
=========================================== */}

<div className="relative mt-12 mb-14">
{/* Desktop  */}
  <div className="relative overflow-hidden rounded-[30px] border border-stone-200 bg-white px-8 py-8 shadow-sm md:block hidden">

    {/* Background World Map */}
    <div
      className="
        absolute
        inset-y-0
        right-0
        w-[55%]
        pointer-events-none
        select-none
      "
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, rgba(0,0,0,.15) 15%, rgba(0,0,0,.55) 35%, black 70%)",
        maskImage:
          "linear-gradient(to right, transparent 0%, rgba(0,0,0,.15) 15%, rgba(0,0,0,.55) 35%, black 70%)",
      }}
    >
      <img
        src={footermap}
        alt="Global Presence"
        className="
          h-full
          w-full
          object-cover
          opacity-20
          grayscale
        "
      />
    </div>

    {/* Content */}

    <div className="relative z-20 flex items-center justify-between">

      {/* Left */}

      <div className="relative z-20 w-full">

        {/* Logo */}

        <img
          src={imgSrcc}
          alt="Sniper Logo"
          className="h-14 w-auto object-contain"
        />

        {/* Heading */}

        <div className="mt-5 flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-100">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-red-500"
            >
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>

          </div>

          <div>

            <h3 className="text-lg font-semibold text-stone-900">
              Our Presence
            </h3>

            <p className="mt-1 text-sm text-stone-500">
              Serving businesses across India
            </p>

          </div>

        </div>

        {/* Locations */}

        <div className="mt-7 flex flex-wrap gap-3">

          {locations.map((city) => (

            <button
              key={city}
              className="
                rounded-full
                border
                border-stone-300
                bg-white
                px-4
                py-1.5
                text-xs
                font-medium
                text-stone-700
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-red-500
                hover:bg-red-500
                hover:text-white
                hover:shadow-md
              "
            >
              {city}
            </button>

          ))}

        </div>

      </div>

      {/* Scroll */}

      <button
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        className="
          group
          hidden
          lg:flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          border
          border-stone-300
          bg-white/90
          backdrop-blur-md
          transition-all
          duration-300
          hover:-translate-y-1
          hover:bg-red-500
          hover:border-red-500
          hover:shadow-lg
        "
      >

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="
            h-5
            w-5
            text-stone-700
            transition-all
            duration-300
            group-hover:text-white
            group-hover:-translate-y-1
          "
        >
          <path d="m18 15-6-6-6 6" />
        </svg>

      </button>

    </div>

  </div>
  {/* ===========================
        Mobile Presence Card
=========================== */}

<div className="md:hidden mt-10 mb-12">

  <div className="relative overflow-hidden rounded-[28px] border border-stone-200 bg-white px-5 py-6 shadow-sm">

    {/* Decorative Map */}
    <img
      src={footermap}
      alt=""
      className="
        absolute
        right-0
        top-0
        h-full
        w-[65%]
        object-cover
        opacity-[0.05]
        grayscale
        pointer-events-none
        select-none
      "
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, rgba(0,0,0,.15) 25%, black 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0%, rgba(0,0,0,.15) 25%, black 100%)",
      }}
    />

    <div className="relative z-10">

      {/* Logo */}

      <img
        src={imgSrcc}
        alt="Sniper"
        className="h-11 w-auto mx-auto"
      />

      <div className="mx-auto mt-4 h-[3px] w-10 rounded-full bg-red-500" />

      {/* Heading */}

      <div className="mt-6 flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-red-500"
          >
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>

        </div>

        <div>

          <h3 className="text-lg font-semibold text-stone-900">
            Our Presence
          </h3>

          <p className="text-sm text-stone-500">
            Serving businesses across India
          </p>

        </div>

      </div>

      {/* Divider */}

      <div className="mt-5 h-px bg-stone-200" />

      {/* Locations */}

      <div className="mt-5 flex flex-wrap gap-2">

        {locations.map((city) => (

          <span
            key={city}
            className="
              rounded-full
              border
              border-stone-300
              bg-white
              px-3
              py-1.5
              text-xs
              font-medium
              text-stone-700
            "
          >
            {city}
          </span>

        ))}

      </div>

      {/* Scroll */}

      <div className="mt-8 flex justify-center">

        <button
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          className="
            group
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            border
            border-stone-300
            bg-white
            shadow-sm
            transition-all
            duration-300
            hover:bg-red-500
            hover:border-red-500
          "
        >

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="
              h-5
              w-5
              text-stone-700
              group-hover:text-white
            "
          >
            <path d="m18 15-6-6-6 6"/>
          </svg>

        </button>

      </div>

    </div>

  </div>

</div>

</div>

        {/* Bottom Section */}
        <div className="border-t border-stone-200 pt-6">
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
    <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-stone-500">
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

    <p className="text-sm text-stone-500 whitespace-nowrap">
      © {new Date().getFullYear()} Sniper Systems &amp; Solutions
    </p>
  </div>
</div>
      </div>
    </footer>
  );
};