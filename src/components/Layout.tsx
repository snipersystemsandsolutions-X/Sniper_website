import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import ScrollToTop from "./ScrollToTop";

interface LayoutProps {
  children: ReactNode;
}

/**
 * Site-wide Helmet defaults — every page inherits these unless it overrides
 * them with its own <PageSEO> or <Helmet> instance.
 * Individual pages should use <PageSEO> to provide page-specific values.
 */
const SiteDefaultHelmet = () => (
  <Helmet defaultTitle="Sniper Systems | IT Solutions Provider in Chennai" titleTemplate="%s | Sniper Systems">
    {/* Charset & viewport — belt-and-suspenders (also in index.html) */}
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    {/* Default fallback description (overridden per-page) */}
    <meta
      name="description"
      content="Sniper Systems is a leading IT solutions provider in Chennai delivering enterprise IT infrastructure, managed services, cloud solutions, and cybersecurity across India."
    />

    {/* Geo signals for local SEO */}
    <meta name="geo.region" content="IN-TN" />
    <meta name="geo.placename" content="Chennai, Tamil Nadu, India" />
    <meta name="geo.position" content="13.0827;80.2707" />
    <meta name="ICBM" content="13.0827, 80.2707" />

    {/* Default OG fallback */}
    <meta property="og:site_name" content="Sniper Systems" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:image" content="https://sniperindia.com/og-image.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    {/* Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@sniperindia" />

    {/* Organisation structured data — appears on every page */}
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Sniper Systems and Solutions Pvt. Ltd.",
        alternateName: "Sniper Systems",
        url: "https://sniperindia.com",
        logo: "https://sniperindia.com/favicon.ico",
        sameAs: [
          "https://www.linkedin.com/company/sniper-systems",
          "https://twitter.com/sniperindia",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+91-8939301100",
          contactType: "customer service",
          areaServed: "IN",
          availableLanguage: ["English", "Tamil"],
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Chennai",
          addressRegion: "Tamil Nadu",
          addressCountry: "IN",
        },
      })}
    </script>

    {/* BreadcrumbList will be provided per-page where relevant */}
  </Helmet>
);

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Site-wide SEO defaults */}
      <SiteDefaultHelmet />
      {/* Instant scroll reset on route change */}
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
