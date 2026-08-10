import { Helmet } from "react-helmet-async";

const SITE_NAME = "Sniper Systems";
const SITE_URL = "https://sniperindia.com";
const DEFAULT_IMAGE = "https://sniperindia.com/og-image.jpg";
const TWITTER_HANDLE = "@sniperindia";

interface PageSEOProps {
  /** Browser tab + OG title (do NOT append site name here — it is added automatically) */
  title: string;
  /** 140–160 character page description */
  description: string;
  /** Canonical path, e.g. "/solutions/cloud-solutions"  (defaults to current href) */
  canonical?: string;
  /** Absolute OG image URL */
  ogImage?: string;
  /** Set to "noindex, nofollow" for utility/private pages */
  robots?: string;
  /** Extra JSON-LD structured data objects (array) */
  structuredData?: object | object[];
}

/**
 * Drop this component at the top of any page to get consistent,
 * complete meta tags without repeating boilerplate.
 *
 * Usage:
 *   <PageSEO
 *     title="Cloud Solutions"
 *     description="Scalable cloud infrastructure…"
 *     canonical="/solutions/cloud-solutions"
 *   />
 */
export const PageSEO = ({
  title,
  description,
  canonical,
  ogImage = DEFAULT_IMAGE,
  robots = "index, follow",
  structuredData,
}: PageSEOProps) => {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonical
    ? `${SITE_URL}${canonical}`
    : typeof window !== "undefined"
    ? window.location.href
    : SITE_URL;

  const jsonLdItems = structuredData
    ? Array.isArray(structuredData)
      ? structuredData
      : [structuredData]
    : [];

  return (
    <Helmet>
      {/* ── Core ── */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalUrl} />

      {/* ── Open Graph ── */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_IN" />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* ── Structured Data (JSON-LD) ── */}
      {jsonLdItems.map((item, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
};

export default PageSEO;
