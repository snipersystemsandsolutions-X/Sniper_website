import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  /** Pass one or more JSON-LD objects to serialize as <script type="application/ld+json"> */
  structuredData?: object | object[];
  noIndex?: boolean;
}

const DEFAULT_IMAGE =
  "https://sniperindia.com/wp-content/uploads/2023/09/sniper-systems-banner.jpg";

/**
 * Drop-in SEO component built on react-helmet-async.
 * Injects <title>, meta tags, Open Graph, Twitter Card,
 * canonical link, and optional JSON-LD structured data.
 *
 * Because HelmetProvider wraps the entire app (src/main.tsx),
 * these tags are written into the pre-rendered HTML by react-snap
 * so Googlebot sees them without executing JS.
 *
 * Usage:
 *   <SEO
 *     title="Page Title | Sniper Systems"
 *     description="Short page description…"
 *     canonical="https://sniperindia.com/page"
 *     structuredData={{ "@context": "https://schema.org", … }}
 *   />
 */
export const SEO = ({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_IMAGE,
  ogType = "website",
  twitterTitle,
  twitterDescription,
  twitterImage = DEFAULT_IMAGE,
  structuredData,
  noIndex = false,
}: SEOProps) => {
  const resolvedOgTitle = ogTitle ?? title;
  const resolvedOgDescription = ogDescription ?? description;
  const resolvedTwitterTitle = twitterTitle ?? title;
  const resolvedTwitterDescription = twitterDescription ?? description;

  const schemas = structuredData
    ? Array.isArray(structuredData)
      ? structuredData
      : [structuredData]
    : [];

  return (
    <Helmet>
      {/* Core */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={resolvedOgTitle} />
      <meta property="og:description" content={resolvedOgDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="Sniper Systems" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolvedTwitterTitle} />
      <meta name="twitter:description" content={resolvedTwitterDescription} />
      <meta name="twitter:image" content={twitterImage} />

      {/* JSON-LD structured data */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
