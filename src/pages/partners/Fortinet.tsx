import { Layout } from '@/components/Layout';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import dottedOverlay from '@/assets/dotted_card.png';
import dottedCard from '@/assets/dotted-card-two.png';
import heroImage from '@/assets/Hero_section_image.webp';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { AnchorHTMLAttributes, ElementType, FormEvent, HTMLAttributes, ReactNode } from 'react';

/**
 * Fortinet partner landing page — single self-contained file.
 * Route: /partners/fortinet/
 *
 * Theme: Sniper Figma look — light canvas, white rounded cards, tight Plus Jakarta Sans headings, one red accent.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHAT CHANGED IN THIS REVISION (so you can follow the code)
 *
 * LATEST TWEAKS (round 6)
 *  - Privacy link fixed: it pointed at /privacy-policy/, which has no route (404). It now uses PRIVACY_PATH ('/privacy',
 *    the route that renders pages/privacy).
 *  - Enquiry form now follows the GCC page's form: first / last name, work email, phone, role, organisation, "What would you
 *    like to discuss?", the same Web3Forms payload shape, and a toast + form reset on success. Environment and users/sites
 *    stay as optional extras because the environment cards pre-fill the Environment select.
 *  - Form input rules: names and role accept letters only, phone accepts digits (+, space, hyphen allowed; 10 to 15 digits), email has no
 *    spaces, description is limited to 1000 characters with a live counter and a 10 character minimum. Rules run on typing AND paste.
 *  - SEO parity with GCC: added geo.position and ICBM. Everything else GCC has (title, description, keywords, robots, canonical,
 *    geo region/placename, Open Graph, Twitter, Organization / Service / FAQPage / BreadcrumbList JSON-LD) was already here.
 *
 * LATEST TWEAKS (round 5 — mobile pass)
 *  - Hero H1 was 24px on phones, SMALLER than every section H2 (28px). Now 30px minimum and scales up smoothly.
 *  - Trust heading matches the shared H2 scale (was 24px).
 *  - Form fields are 16px on phones (iOS Safari zooms the whole page on focus when an input is under 16px); submit is full width.
 *  - Environment cards: horizontal swipe carousel on phones (was ~1,500px of stacked cards). Link is sentence case with a 44px tap area.
 *  - Technical resources: 2 columns on tablets. The red header SVG is stretched, so a single 700px-wide column distorted its corners and notch.
 *    Fake 01/02/03 numbering removed (the cards are not a sequence); footer wraps instead of squeezing.
 *  - Capability cards are shorter on phones; all-caps micro labels removed; hover lift only on devices that can hover.
 *  - Breadcrumb and contact links get larger tap areas.
 *
 * LATEST TWEAKS (round 4)
 *  - Technical resources: 3 cards (overview, datasheets, documentation library). Threat research was dropped as the least relevant to a firewall purchase, so the cards are roomier.
 *  - Mid-page CTA is a slim taskbar-sized strip: heading + one button to the contact section (phone number removed).
 *  - Related solutions: card stays white; only the "Redirect now" rail is black, red on hover. Hero primary button: black at rest, red on hover.
 *  - Enquiry left panel: simple solid red panel with dotted texture (no gradient), colour layered inside the clipped wrapper so no red fringe shows at the rounded edge. Mid-page CTA strip is solid red.
 *  - Technical resource cards: header is one drawn shape (no overlay seam). Hero H1, lead and secondary CTA updated from the SEO brief. Mid-page CTA: dotted texture removed.
 *
 * LATEST TWEAKS (round 3)
 *  - Technical resources: heading on top, cards in a row below (4 across on desktop).
 *  - Related solutions: red side rail with arrow and vertical "Redirect now" text, dotted texture (decorative, aria-hidden).
 *
 * LATEST TWEAKS (round 2)
 *  - Section headings use one shared scale: 28px mobile, 36px tablet, 48px (text-5xl) desktop.
 *  - Technical resources: intro line removed; footer row now sits on one baseline.
 *  - How it works: vertical timeline on mobile; dark flow card has more room + a readability gradient on mobile.
 *
 * LATEST TWEAKS (round 1)
 *  - Trust strip: the 17+ card description now runs to three lines.
 *  - Environment drawings redrawn to match their titles: branch offices (HQ + branches), enterprise and campus (office towers),
 *    remote and hybrid workforce (laptop + shielded tunnel + office). The data center drawing was already right and is untouched.
 *
 * STRUCTURE / UX
 *  1. ONE environment section (ProductFamilyGrid): the duplicate section is gone and the cards keep the original
 *     design (title, drawing, text, link). No extra content inside them.
 *  2. The stacking cards are removed. "How the engagement works" is back to the numbered row + node-flow panel.
 *  3. The mid-page CTA is now a slim, taskbar-sized strip (PositioningBand) with a real <h2>, one button and the phone number.
 *  4. No Fortinet product / series names anywhere (partner-agreement constraint). The families section is
 *     retitled "Start with your environment" so it promises exactly what it delivers.
 *  5. The capabilities section has no intro line (it was a copy-paste of a family card), matching your live design.
 *  6. Family cards also respond to TAP (touch devices have no hover).
 *  7. Technical resources: simple folder-style cards (red header, notched tab, footer row), colour change on hover only.
 *  9. Mobile pass: smaller buttons, full-width stacked CTAs, shorter cards, smaller headings, form copy trimmed.
 * 10. FAQs use the SPLIT_5_7 column split; Technical resources now sits full width under its heading; tab hairline removed.
 *  8. SPACING: every section now owns only its TOP padding (Band: pt-12 md:pt-20), so every gap is identical.
 *     Before, sections mixed py-20 with pt-8 overrides, so gaps ranged from 104px to 160px.
 *
 * SEO (modelled on the GCC page)
 *  - <Helmet> (react-helmet-async) instead of manual document.head code → works with SSR / prerender.
 *  - Title, description, keywords, robots, canonical, geo, Open Graph, Twitter card.
 *  - JSON-LD: Organization, Service, FAQPage (built from the visible FAQ so it can never drift), BreadcrumbList.
 *  - Google Fonts moved from a render-blocking @import to preconnect + <link>, weights trimmed to 400/500/600.
 *  - "India" added to the visible hero copy (the title promises India). Hero image gets fetchPriority="high".
 *  - Internal links use react-router <Link> (no full page reloads).
 *
 * ACCESSIBILITY
 *  - Contrast fixes: no red text on grey/dark cards, no semi-transparent white on red, placeholders darker.
 *  - Smallest text is 12px (was 11px).
 *  - scroll-mt-24 so anchored sections are not hidden under the navbar.
 *  - Form: aria-required, persistent live region, focus moves to the success heading.
 *  - Secondary button has a hairline ring (it was white on near-white).
 *  - Removed the vertical "Explore" rail text. Page root is a <div> (Layout should own the single <main>).
 *
 * CODE
 *  - Removed: ContactDock import, unused 'dark' button variant, old tab CSS, window CustomEvent (replaced by
 *    shared React state), inline VERIFY comments inside content.
 *  - NodeFlow now cancels its animation loop off-screen and clamps its random walk.
 *  - Lead form now posts through the SAME Web3Forms pipeline as the GCC page (the old placeholder threw an error
 *    when no endpoint was set, which would have dropped every lead).
 *  - trackEvent() added for CTA clicks, environment picks and form results (GA4 gtag or GTM dataLayer).
 *
 * BEFORE PUBLISHING — confirm with the right people:
 *  [ ] Brand / "FortiGate" naming in title, meta and FAQ is allowed by the partner agreement (get it in writing)
 *  [ ] Trust figures + "Up to 100%" claim approvals are on file
 *  [ ] OG image URL exists, privacy URL, related-page URLs, resource URLs
 *  [ ] Layout.tsx renders the <main> landmark
 *  [ ] React version ≥ 18.3 (for the fetchPriority attribute)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * PALETTE   #F5F5F7 canvas · #FFFFFF cards · #141414 ink · #DC3327 red · #B72A20 deep red · #E4E4E8 hairline
 */

type IconKey = 'branch' | 'campus' | 'datacenter' | 'remote';
type CapabilityIconKey = 'shield' | 'wifi' | 'network' | 'gearlock';
type CapabilityTone = 'red' | 'white' | 'grey' | 'dark';

interface LinkItem {
  label: string;
  href: string;
}
interface Crumb {
  label: string;
  href?: string;
}
interface PageMeta {
  title: string;
  description: string;
  path: string;
  keywords: string[];
  ogImage: string;
  ogImageAlt: string;
}
interface ImageRef {
  /** Imported asset URL. Leave undefined to show the placeholder. */
  src?: string;
  alt: string;
  slotLabel: string;
  width?: number;
  height?: number;
}
interface HeroContent {
  h1: string;
  accents?: string[];
  lead: string;
  primaryCta: LinkItem;
  secondaryCta: LinkItem;
  image: ImageRef;
}
interface TrustPoint {
  value: string;
  suffix?: string;
  label: string;
  text: string;
}
interface ProductFamily {
  id: string;
  icon: IconKey;
  title: string;
  text: string;
}
interface ProcessStep {
  title: string;
  text: string;
}
interface ResourceLink {
  label: string;
  text: string;
  href: string;
  /** Short type label, e.g. Overview, Datasheets. */
  tag: string;
  /** Where the link goes, shown in the card footer. */
  source: string;
}
interface Faq {
  q: string;
  a: string;
}
interface RelatedLink {
  label: string;
  text: string;
  href: string;
}

interface VendorConfig {
  slug: string;
  name: string;
  meta: PageMeta;
  breadcrumb: Crumb[];
  contact: { email: string; phone: string };
  hero: HeroContent;
  trust: { heading: string; accents?: string[]; items: TrustPoint[] };
  families: {
    heading: string;
    accents?: string[];
    intro: string;
    items: ProductFamily[];
  };
  capabilities: {
    heading: string;
    accents?: string[];
    items: Array<{ title: string; icon: CapabilityIconKey; tone: CapabilityTone }>;
  };
  positioning: { heading: string; accents?: string[]; text: string; cta: LinkItem };
  process: {
    heading: string;
    steps: ProcessStep[];
    flow: {
      heading: string;
      text: string;
      leftTitle: string;
      left: string[];
      rightTitle: string;
      right: string[];
    };
  };
  resources: { heading: string; items: ResourceLink[] };
  faqs: { heading: string; accents?: string[]; items: Faq[] };
  related: { heading: string; items: RelatedLink[] };
  enquiry: {
    heading: string;
    text: string;
    checklistTitle: string;
    checklist: string[];
    nextTitle: string;
    next: string[];
    submitLabel: string;
    privacyHref: string;
    environments: string[];
  };
}

interface EnquiryPayload {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone: string;
  role: string;
  environment: string;
  scale: string;
  message: string;
  vendor: string;
  sourcePath: string;
}

/* =============================================================================
 * CONTENT
 * Copy follows the Sniper SEO blueprint (13 Oct 2026). Nothing here names a Fortinet product or series.
 * ========================================================================== */

const SITE_URL = 'https://sniperindia.com/';

/** Route that renders pages/privacy in the app router. Change it here if the route ever moves. */
const PRIVACY_PATH = '/privacy';

const fortinet: VendorConfig = {
  slug: 'fortinet',
  name: 'Fortinet',

  meta: {
    title: 'Fortinet Firewall Solutions in India | Sniper Systems',
    description:
      'Explore FortiGate firewall solutions for business networks. Compare security needs, review product options and discuss suitable solutions with Sniper Systems.',
    path: '/partners/fortinet/',
    // Generic on purpose: no model names. Search engines mostly ignore this tag, but your team tracks it.
    keywords: [
      'Fortinet firewall India',
      'Fortinet solutions for business networks',
      'enterprise firewall solutions India',
      'network security solutions India',
      'branch office firewall',
      'data center firewall',
      'secure remote access VPN India',
      'firewall quotation India',
      'IT infrastructure partner India',
    ],
    ogImage: `${SITE_URL}images/fortinet-firewall-solutions.jpg`,
    ogImageAlt: 'Fortinet firewall solutions for business networks in India',
  },

  breadcrumb: [{ label: 'Home', href: '/' }, { label: 'Partners', href: '/partners/' }, { label: 'Fortinet' }],

  // Same company details already published on the GCC page.
  contact: { email: 'enquiry@sniperindia.com', phone: '+91 89393 01100' },

  hero: {
    h1: 'Fortinet Firewall Solutions in India for Business Network Security',
    accents: ['Fortinet'],
    lead: 'Secure your business network with Fortinet FortiGate firewall solutions tailored to your infrastructure, security needs and growth plans. Sniper Systems helps Indian organisations evaluate suitable firewall models, licensing options and deployment requirements.',
    primaryCta: { label: 'Discuss Your Firewall Requirements', href: '#enquiry' },
    secondaryCta: { label: 'Explore Firewall Solutions', href: '#environments' },
    image: {
      src: heroImage,
      alt: 'Network firewall, switch and wireless hardware used in business network security',
      slotLabel: 'Hero image · import from assets (wide, ~16:7)',
      width: 1600,
      height: 700,
    },
  },

  trust: {
    heading: 'Infrastructure experience behind every firewall conversation, helping businesses stay secure.',
    accents: ['Infrastructure', 'firewall'],
    items: [
      { value: '2600', suffix: '+', label: 'Happy clients in India', text: 'We’ve successfully served over 2600 happy customers across India, supporting their infrastructure, security and networking needs.' },
      { value: '17', suffix: '+', label: 'Years of proven track record', text: 'A long track record in IT infrastructure, helping organizations plan, deploy and support secure, reliable networks across India.' },
      { value: '99', suffix: '%', label: 'Uptime partner', text: 'Reliable service availability across supported environments, helping keep your business network connected and secure when it matters most.' },
    ],
  },

  families: {
    heading: 'Start with your environment',
    accents: ['environment'],
    intro:
      'Every network has different security needs. Pick the environment closest to yours to discuss the right fit for your scale, deployment and performance requirements. Final model selection follows the manufacturer’s official datasheets.',
    items: [
      {
        id: 'branch',
        icon: 'branch',
        title: 'Branch and distributed offices',
        text: 'Explore suitable security solutions for smaller sites, remote offices and distributed business networks.',
      },
      {
        id: 'campus',
        icon: 'campus',
        title: 'Enterprise and campus',
        text: 'Evaluate firewall options for larger user populations, campus networks and complex connectivity needs.',
      },
      {
        id: 'datacenter',
        icon: 'datacenter',
        title: 'Data center environments',
        text: 'Assess solutions for high-throughput environments and demanding network architectures.',
      },
      {
        id: 'remote',
        icon: 'remote',
        title: 'Remote and hybrid workforce',
        text: 'Explore secure remote access and VPN options for hybrid teams, home offices and users connecting from outside the office.',
      },
    ],
  },

  capabilities: {
    heading: 'Network Security capabilities for modern businesses',
    accents: ['Network Security'],
    items: [
      { title: 'Advanced threat protection tailored to your security requirements', icon: 'shield', tone: 'red' },
      { title: 'Real-time network visibility across your entire business', icon: 'wifi', tone: 'white' },
      { title: 'Secure connectivity for distributed teams and offices', icon: 'network', tone: 'grey' },
      { title: 'Centralized security management and simplified operations', icon: 'gearlock', tone: 'dark' },
    ],
  },

  positioning: {
    heading: 'More than product procurement. A partner for your IT infrastructure.',
    accents: ['product procurement.'],
    text: 'Share your environment and priorities. We will help you narrow down suitable options and plan the next steps.',
    cta: { label: 'Discuss Your Requirements', href: '#enquiry' },
  },

  process: {
    heading: 'How the engagement works',
    steps: [
      { title: 'Understand', text: 'Review your existing infrastructure and security requirements.' },
      { title: 'Evaluate', text: 'Compare suitable models, capabilities and licensing considerations.' },
      { title: 'Coordinate', text: 'Align procurement and delivery requirements.' },
      { title: 'Plan', text: 'Plan next steps for implementation and ongoing support, where offered.' },
    ],
    flow: {
      heading: 'From requirement to a suitable solution',
      text: 'Many inputs, one clear path. We narrow your network, security and commercial requirements into options you can act on.',
      leftTitle: 'What you bring',
      left: ['Sites and users', 'Connectivity', 'Security priorities'],
      rightTitle: 'What you get',
      right: ['Shortlisted options', 'Licensing clarity', 'A plan for next steps'],
    },
  },

  resources: {
    heading: 'Technical resources',
    items: [
      {
        label: 'Fortinet next-generation firewall overview',
        text: 'Product families, deployment contexts and firewall selection.',
        href: 'https://www.fortinet.com/products/next-generation-firewall',
        tag: 'Overview',
        source: 'fortinet.com',
      },
      {
        label: 'Fortinet datasheets library',
        text: 'Model-level specifications and product literature.',
        href: 'https://www.fortinet.com/resources/data-sheets',
        tag: 'Datasheets',
        source: 'fortinet.com',
      },
      {
        label: 'Fortinet documentation library',
        text: 'Administration guides, quick-start guides and release notes.',
        href: 'https://docs.fortinet.com/',
        tag: 'Documentation',
        source: 'docs.fortinet.com',
      },
    ],
  },

  faqs: {
    heading: 'Fortinet firewall FAQs',
    accents: ['Fortinet'],
    items: [
      {
        q: 'What is a FortiGate firewall?',
        a: 'FortiGate is Fortinet’s firewall product family. Depending on the model and configuration, FortiGate solutions can support network traffic control and various security capabilities. The right choice depends on deployment requirements and product specifications.',
      },
      {
        q: 'How do I choose a FortiGate firewall for my business?',
        a: 'Start with internet bandwidth, expected traffic, number of sites and users, VPN requirements, inspection needs, network interfaces and expected growth. Selection should account for how the solution will be configured and used.',
      },
      {
        q: 'Can Sniper Systems help select a suitable FortiGate model?',
        a: 'Yes. Share your network scale, users, connectivity and security priorities, and our team will help you narrow down appropriate FortiGate options for your environment.',
      },
      {
        q: 'Do FortiGate features require separate licences or subscriptions?',
        a: 'Requirements vary by model, feature and subscription. Confirm the applicable licensing and support terms for the specific product configuration before purchasing.',
      },
      {
        q: 'How can I request a Fortinet firewall quotation?',
        a: 'Share your organization details, deployment requirements, approximate user or site count and any known model preferences through Sniper’s enquiry form.',
      },
    ],
  },

  related: {
    heading: 'Related solutions',
    items: [
      {
        label: 'Enterprise networking',
        text: 'Campus networks, SD-WAN and wireless from Sniper Systems.',
        href: '/solutions/networking-solutions',
      },
      { label: 'Technology partners', text: 'See every vendor Sniper works with.', href: '/partners/' },
      {
        label: 'Managed IT services',
        text: 'Monitoring, support and lifecycle management after rollout.',
        href: '/solutions/managed-it-services',
      },
    ],
  },

  enquiry: {
    heading: 'Discuss your firewall requirements',
    text: 'Tell Sniper about your environment, approximate scale and security priorities. We ask only for the information needed to begin the conversation.',
    checklistTitle: 'Helpful to include',
    checklist: [
      'Your organization and deployment requirements',
      'Approximate user or site count',
      'Any known model preferences',
    ],
    nextTitle: 'What happens next',
    next: ['We review your requirements', 'We follow up with any questions', 'We outline suitable options and next steps'],
    submitLabel: 'Send enquiry',
    privacyHref: PRIVACY_PATH,
    environments: [
      'Branch and distributed offices',
      'Enterprise and campus',
      'Data center environments',
      'Remote and hybrid workforce',
      'Not sure yet',
    ],
  },
};

/* =============================================================================
 * SEO — structured data builders (same pattern as the GCC page)
 * ========================================================================== */

const ORG_ID = `${SITE_URL}#organization`;

const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Sniper Systems & Solutions Pvt Ltd',
  url: SITE_URL,
  description:
    'Sniper Systems & Solutions Pvt Ltd is an IT solutions provider delivering enterprise IT infrastructure, cloud, networking, device deployment, managed IT services and workplace technology solutions across India.',
  foundingDate: '2009',
  telephone: '+91 89393 01100',
  email: 'enquiry@sniperindia.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'No.131/2A, Moti Towers, 4th Floor, Rajiv Gandhi Salai, OMR, Perungudi',
    addressLocality: 'Chennai',
    postalCode: '600096',
    addressRegion: 'Tamil Nadu',
    addressCountry: 'IN',
  },
  areaServed: { '@type': 'Country', name: 'India' },
};

function buildJsonLd(vendor: VendorConfig, pageUrl: string) {
  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    name: vendor.hero.h1,
    serviceType: 'Network security solutions',
    description: vendor.meta.description,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'India' },
    audience: { '@type': 'BusinessAudience', audienceType: 'Businesses and enterprises with multi-site or growing networks' },
    url: pageUrl,
  };

  // Built from the visible FAQ so the markup can never drift from the page (Google requires them to match).
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: vendor.faqs.items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: vendor.breadcrumb.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: c.href ? new URL(c.href, SITE_URL).toString() : pageUrl,
    })),
  };

  return { service, faq, breadcrumb };
}

function SeoHead({ vendor }: { vendor: VendorConfig }) {
  const { meta } = vendor;
  const pageUrl = new URL(meta.path, SITE_URL).toString();
  const ld = buildJsonLd(vendor, pageUrl);
  const shortTitle = `${vendor.name} Firewall Solutions in India | Sniper Systems`;

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords.join(', ')} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={pageUrl} />

      {/* Geo / local relevance (same as the GCC page) */}
      <meta name="geo.region" content="IN-TN" />
      <meta name="geo.placename" content="Chennai" />
      <meta name="geo.position" content="13.0827;80.2707" />
      <meta name="ICBM" content="13.0827, 80.2707" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content="Sniper Systems & Solutions" />
      <meta property="og:image" content={meta.ogImage} />
      <meta property="og:image:alt" content={meta.ogImageAlt} />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={shortTitle} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.ogImage} />

      {/* Fonts: preconnect + one stylesheet link (replaces the render-blocking CSS @import) */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&display=swap"
      />

      {/* Structured data */}
      <script type="application/ld+json">{JSON.stringify(ORGANIZATION_JSON_LD)}</script>
      <script type="application/ld+json">{JSON.stringify(ld.service)}</script>
      <script type="application/ld+json">{JSON.stringify(ld.faq)}</script>
      <script type="application/ld+json">{JSON.stringify(ld.breadcrumb)}</script>
    </Helmet>
  );
}



function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** Analytics: works with GA4 (gtag) or Google Tag Manager (dataLayer). Silent if neither is on the page. */
function trackEvent(name: string, params: Record<string, string | number | undefined> = {}): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] };
  if (w.gtag) w.gtag('event', name, params);
  else if (w.dataLayer) w.dataLayer.push({ event: name, ...params });
}

/** Internal paths use the router (no full reload); everything else is a normal link. */
function SmartLink({
  href,
  className,
  children,
  ...rest
}: { href: string; className?: string; children: ReactNode } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  if (href.startsWith('/')) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  );
}

/* ---------- tokens ---------- */

/** One source of truth for the page's horizontal edges (content = 1365px wide, centred). */
const SITE_CONTAINER = 'mx-auto w-full max-w-[calc(1365px+3rem)] px-4 sm:px-6';

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#DC3327]';
const HEADING = 'font-semibold tracking-tighter';
/** Section headings: 28px mobile -> 36px tablet -> 48px (text-5xl) desktop, matching Figma. */
const H2_CLASS =
  'text-[1.75rem] leading-[1.1] sm:text-4xl sm:leading-[1.1] lg:text-5xl lg:leading-[1.05] font-semibold tracking-tighter';
/** Two-column split shared by Resources and FAQs so their right-hand columns line up exactly. */
const SPLIT_5_7 = 'grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16';
const BODY = 'text-[15px] leading-relaxed text-[#141414]/70';

/* ---------- small glyphs ---------- */

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cx('h-4 w-4 shrink-0', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d="M3.5 12.5 12.5 3.5M5 3.5h7.5V11" />
    </svg>
  );
}

function AccentedHeading({
  text,
  accents,
  accentClass = 'text-[#DC3327]',
}: {
  text: string;
  accents?: string[];
  accentClass?: string;
}) {
  if (!accents || accents.length === 0) return <>{text}</>;
  const escaped = accents.map((a) => a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const parts = text.split(new RegExp(`(${escaped.join('|')})`));
  return (
    <>
      {parts.map((p, i) =>
        accents.includes(p) ? (
          <span key={i} className={accentClass}>
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

/* ---------- surfaces ---------- */

interface PanelProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  tone?: 'white' | 'red' | 'dark';
}

function Panel({ as: Tag = 'div', tone = 'white', className, children, ...rest }: PanelProps) {
  return (
    <Tag
      className={cx(
        'rounded-[20px]',
        tone === 'red' ? 'bg-[#DC3327] text-white' : tone === 'dark' ? 'bg-[#141414] text-white' : 'bg-[#FFFFFF] text-[#141414]',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** scroll-mt-24 keeps anchored sections clear of the fixed navbar. */
function Band({
  id,
  labelledBy,
  children,
  className,
}: {
  id?: string;
  labelledBy?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className="scroll-mt-24">
      <div className={cx(SITE_CONTAINER, 'pt-12 md:pt-20', className)}>{children}</div>
    </section>
  );
}

/** Four corner crop marks around a drawing, optional halftone texture. */
function CropFrame({
  children,
  className,
  halftone = false,
}: {
  children: ReactNode;
  className?: string;
  halftone?: boolean;
}) {
  const corners = [
    'left-0 top-0 border-l border-t',
    'right-0 top-0 border-r border-t',
    'bottom-0 left-0 border-b border-l',
    'bottom-0 right-0 border-b border-r',
  ];
  return (
    <div className={cx('relative', halftone && 'sv-halftone', className)}>
      {corners.map((c) => (
        <span key={c} aria-hidden="true" className={cx('pointer-events-none absolute h-3 w-3 border-current', c)} />
      ))}
      {children}
    </div>
  );
}

/** Hero picture (or a neutral placeholder until `src` is set). Scales to the parent's height, never wider. */
function HeroImage({ image }: { image: ImageRef }) {
  if (image.src) {
    return (
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="block h-full w-auto max-w-full object-contain"
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={image.alt}
      className="flex h-full w-full items-center justify-center bg-[#ECECF0] p-6 text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-[#141414]/65"
    >
      {image.slotLabel}
    </div>
  );
}

/* ---------- buttons ---------- */

type ButtonVariant = 'primary' | 'secondary' | 'dark';

const BTN_BASE =
  'sv-anim inline-flex items-center justify-center rounded-[8px] text-[14px] font-medium sm:text-[15px] leading-tight transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 ' +
  FOCUS;

const BTN_VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-[#DC3327] text-white hover:bg-[#B72A20]',
  // Black at rest, red on hover (hero primary button).
  dark: 'bg-[#141414] text-white hover:bg-[#DC3327]',
  // The hairline ring keeps a white button visible on the near-white canvas.
  secondary: 'bg-[#FFFFFF] text-[#141414] ring-1 ring-inset ring-[#141414]/15 hover:bg-[#141414] hover:text-white',
};

const BTN_SIZE = { md: 'px-5 py-3 sm:px-6', sm: 'px-4 py-3 sm:px-5 sm:py-2.5' } as const;

const buttonClass = (variant: ButtonVariant = 'primary', extra?: string, size: keyof typeof BTN_SIZE = 'md') =>
  cx(BTN_BASE, BTN_SIZE[size], BTN_VARIANT[variant], extra);

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: keyof typeof BTN_SIZE;
  /** Analytics label. When set, a click fires a `cta_click` event. */
  track?: string;
}

function ButtonLink({ variant = 'primary', size = 'md', className, children, track, onClick, ...rest }: ButtonLinkProps) {
  return (
    <a
      className={buttonClass(variant, className, size)}
      onClick={(ev) => {
        if (track) trackEvent('cta_click', { cta: track });
        onClick?.(ev);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

/* ---------- illustrations ---------- */

const LINE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function BranchIcon({ className }: { className?: string }) {
  /* Head office in the centre, linked to four smaller branch offices. */
  const branches: Array<[number, number]> = [
    [32, 38],
    [128, 38],
    [32, 122],
    [128, 122],
  ];
  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden="true" {...LINE}>
      {branches.map(([x, y]) => {
        const dx = 80 - x;
        const dy = 80 - y;
        const len = Math.hypot(dx, dy);
        const ux = dx / len;
        const uy = dy / len;
        return (
          <g key={`${x}-${y}`}>
            <line x1={x + ux * 20} y1={y + uy * 20} x2={80 - ux * 24} y2={80 - uy * 24} strokeDasharray="2 5" />
            {/* small branch office: roof + body + door */}
            <path d={`M${x - 14} ${y - 4}L${x} ${y - 16}L${x + 14} ${y - 4}`} />
            <rect x={x - 11} y={y - 4} width="22" height="20" />
            <path d={`M${x - 3} ${y + 16}v-8h6v8`} />
          </g>
        );
      })}
      {/* head office */}
      <rect x="62" y="56" width="36" height="48" />
      <path d="M58 56h44" />
      {[66, 78, 90].map((y) => (
        <path key={y} d={`M69 ${y}h4M87 ${y}h4`} strokeWidth="2.2" />
      ))}
      <path d="M75 104v-9h10v9" />
    </svg>
  );
}

function CampusIcon({ className }: { className?: string }) {
  /* Enterprise / campus: a cluster of office towers of different heights on a shared ground line. */
  const windows = (x: number, w: number, top: number, bottom: number, cols: number) => {
    const out: ReactNode[] = [];
    const gap = w / (cols + 1);
    for (let y = top + 10; y < bottom - 8; y += 12) {
      for (let c = 1; c <= cols; c++) {
        out.push(<path key={`${x}-${y}-${c}`} d={`M${x + gap * c - 2} ${y}h4`} strokeWidth="2.2" />);
      }
    }
    return out;
  };
  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden="true" {...LINE}>
      {/* left tower */}
      <rect x="18" y="72" width="34" height="62" />
      {windows(18, 34, 72, 134, 2)}
      {/* centre tower with antenna */}
      <rect x="58" y="28" width="44" height="106" />
      <path d="M80 28V16M76 16h8" />
      {windows(58, 44, 28, 118, 3)}
      {/* right tower */}
      <rect x="108" y="56" width="34" height="78" />
      {windows(108, 34, 56, 134, 2)}
      {/* entrance */}
      <path d="M73 134v-14h14v14" />
      {/* ground */}
      <path d="M10 134h140" />
      <path d="M10 144h140" strokeDasharray="2 5" />
    </svg>
  );
}

function DataCenterIcon({ className }: { className?: string }) {
  const slabs = [30, 56, 82, 108];
  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden="true" {...LINE}>
      {slabs.map((y) => (
        <g key={y}>
          <rect x="30" y={y} width="100" height="20" rx="1.5" />
          <circle cx="42" cy={y + 10} r="2.5" />
          <circle cx="52" cy={y + 10} r="2.5" fill="currentColor" />
          <path d={`M82 ${y + 10}h36M82 ${y + 6}h36M82 ${y + 14}h36`} strokeDasharray="1.5 3" />
        </g>
      ))}
      <path d="M40 130v10M120 130v10M30 140h100" />
    </svg>
  );
}

function RemoteWorkIcon({ className }: { className?: string }) {
  /* Remote worker's laptop linked to the office through a shielded (dotted) tunnel. */
  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden="true" {...LINE}>
      {/* laptop */}
      <rect x="16" y="84" width="44" height="26" />
      <path d="M10 110h56l-4 8H14Z" />
      {/* tunnel */}
      <path d="M62 97h9M93 97h11" strokeDasharray="2 4" />
      {/* shield */}
      <path d="M82 83 93 88V98C93 106 88 111 82 114C76 111 71 106 71 98V88Z" />
      <path d="m76 98 4 4 7-8" />
      {/* office */}
      <rect x="104" y="40" width="38" height="78" />
      {[52, 66, 80, 94].map((y) => (
        <path key={y} d={`M112 ${y}h4M130 ${y}h4`} strokeWidth="2.2" />
      ))}
      <path d="M117 118v-10h10v10" />
      {/* ground */}
      <path d="M6 118h148" />
      <path d="M6 128h148" strokeDasharray="2 5" />
    </svg>
  );
}

const ICONS: Record<IconKey, (p: { className?: string }) => ReactNode> = {
  branch: BranchIcon,
  campus: CampusIcon,
  datacenter: DataCenterIcon,
  remote: RemoteWorkIcon,
};

/* Capability card icons (48x48, drawn with currentColor). */
const CAP_LINE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function ShieldChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...CAP_LINE}>
      <path d="M24 5 40 11v11c0 10-7 17.5-16 21C15 39.5 8 32 8 22V11Z" />
      <path d="m17 26 7-7 7 7M17 32l7-7 7 7" />
    </svg>
  );
}

function WifiIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...CAP_LINE} strokeWidth={4.4}>
      <path d="M4.5 17.5c10.5-9.5 28.5-9.5 39 0" />
      <path d="M12 26c7-6 17-6 24 0" />
      <circle cx="24" cy="35.5" r="2.8" fill="currentColor" />
    </svg>
  );
}

function NetworkNodesIcon({ className }: { className?: string }) {
  const outer: Array<[number, number]> = [
    [8, 12],
    [40, 8],
    [42, 40],
    [10, 38],
  ];
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...CAP_LINE} strokeWidth={2}>
      <circle cx="24" cy="24" r="6.5" />
      {outer.map(([x, y]) => {
        const dx = x - 24;
        const dy = y - 24;
        const len = Math.hypot(dx, dy);
        const ux = dx / len;
        const uy = dy / len;
        return (
          <g key={`${x}-${y}`}>
            <line x1={24 + ux * 6.5} y1={24 + uy * 6.5} x2={x - ux * 4} y2={y - uy * 4} />
            <circle cx={x} cy={y} r="4" />
          </g>
        );
      })}
    </svg>
  );
}

function GearLockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g fill="currentColor">
        <circle cx="24" cy="24" r="16" />
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x="19.5" y="2" width="9" height="9" rx="2.5" transform={`rotate(${i * 45} 24 24)`} />
        ))}
      </g>
      <g className="text-[#141414]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <path d="M19.5 22.5v-2.5a4.5 4.5 0 0 1 9 0v2.5" />
        <rect x="17.5" y="22.5" width="13" height="10" rx="2" fill="currentColor" />
      </g>
    </svg>
  );
}

const CAP_ICONS: Record<CapabilityIconKey, (p: { className?: string }) => ReactNode> = {
  shield: ShieldChevronIcon,
  wifi: WifiIcon,
  network: NetworkNodesIcon,
  gearlock: GearLockIcon,
};

/* ================= NODE FLOW ================= */

/**
 * Dotted curves converge from both edges to the centre while small square nodes travel along them.
 * Click or tap to send a ripple. The animation loop is CANCELLED while off-screen (not just skipped), and a single
 * still frame is drawn when the visitor prefers reduced motion. Decorative only (aria-hidden).
 */
function NodeFlow({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    type Path = { isLeft: boolean; startY: number; t: number; speed: number; red: boolean };
    type Ripple = { x: number; y: number; radius: number; life: number };

    let w = 0;
    let h = 0;
    let raf = 0;
    let paths: Path[] = [];
    let ripples: Ripple[] = [];

    const build = () => {
      const n = w < 640 ? 34 : 64;
      paths = Array.from({ length: n }, (_, i) => ({
        isLeft: i % 2 === 0,
        startY: (i / n) * h * 1.4 - h * 0.2,
        t: Math.random(),
        speed: 0.0015 + Math.random() * 0.002,
        red: i % 9 === 0,
      }));
    };

    const bezier = (
      t: number,
      p0: { x: number; y: number },
      p1: { x: number; y: number },
      p2: { x: number; y: number },
      p3: { x: number; y: number },
    ) => {
      const u = 1 - t;
      return {
        x: u ** 3 * p0.x + 3 * u ** 2 * t * p1.x + 3 * u * t ** 2 * p2.x + t ** 3 * p3.x,
        y: u ** 3 * p0.y + 3 * u ** 2 * t * p1.y + 3 * u * t ** 2 * p2.y + t ** 3 * p3.y,
      };
    };

    const draw = (advance: boolean) => {
      ctx.clearRect(0, 0, w, h);
      const cx0 = w / 2;
      const cy0 = h / 2;

      if (advance) {
        ripples.forEach((r) => {
          r.radius += 15;
          r.life -= 0.015;
        });
        ripples = ripples.filter((r) => r.life > 0);
      }

      paths.forEach((path) => {
        const p0 = { x: path.isLeft ? 0 : w, y: path.startY };
        const p1 = { x: path.isLeft ? cx0 * 0.5 : w - cx0 * 0.5, y: path.startY };
        const p2 = { x: path.isLeft ? cx0 * 0.8 : w - cx0 * 0.8, y: cy0 };
        const p3 = { x: cx0, y: cy0 };

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([1, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        if (advance) {
          path.t += path.speed;
          if (path.t > 1) {
            path.t = 0;
            // Clamped so the random walk can never drift far outside the canvas.
            path.startY = Math.min(h * 1.2, Math.max(-h * 0.2, path.startY + (Math.random() - 0.5) * 10));
          }
        }

        const pos = bezier(path.t, p0, p1, p2, p3);
        ripples.forEach((r) => {
          const dx = pos.x - r.x;
          const dy = pos.y - r.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < r.radius + 120 && dist > r.radius - 120) {
            const force = (1 - Math.abs(dist - r.radius) / 120) * r.life;
            pos.x += (dx / dist) * force * 80;
            pos.y += (dy / dist) * force * 80;
          }
        });

        const size = path.red ? 4 : 3;
        ctx.fillStyle = path.red ? '#DC3327' : 'rgba(255, 255, 255, 0.75)';
        ctx.fillRect(pos.x - size / 2, pos.y - size / 2, size, size);
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      draw(false);
    };

    const loop = () => {
      draw(true);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf && !reduce) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onPointer = (ev: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      ripples.push({ x: ev.clientX - rect.left, y: ev.clientY - rect.top, radius: 0, life: 1 });
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    io.observe(canvas);

    if (!reduce) canvas.addEventListener('pointerdown', onPointer);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointerdown', onPointer);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={cx('block h-full w-full', className)} />;
}

/* ================= SECTIONS ================= */

/* 01 — Breadcrumb */
function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className={cx(SITE_CONTAINER, 'pb-2 pt-6')}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-medium text-[#141414]/70">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.label} className="flex items-center gap-2">
              {c.href && !last ? (
                <SmartLink href={c.href} className={cx('-my-2 inline-block py-2 underline-offset-4 hover:text-[#B72A20] hover:underline', FOCUS)}>
                  {c.label}
                </SmartLink>
              ) : (
                <span aria-current={last ? 'page' : undefined} className="text-[#141414]">
                  {c.label}
                </span>
              )}
              {!last && (
                <span aria-hidden="true" className="text-[#141414]/40">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* 02 — Hero (the only H1 on the page) */
function VendorHero({ hero }: { hero: HeroContent }) {
  return (
    <section aria-labelledby="hero-title">
      <div className={cx(SITE_CONTAINER, 'pt-4 md:pt-8')}>
        <div className="mx-auto flex max-w-[1040px] flex-col items-center text-center">
          <h1
            id="hero-title"
            className="max-w-[760px] text-balance text-[clamp(1.875rem,4.2vw+0.5rem,3.25rem)] font-semibold leading-[1.1] tracking-tighter"
          >
            <AccentedHeading text={hero.h1} accents={hero.accents} />
          </h1>
          <p className="mt-4 max-w-[760px] text-balance text-[15px] leading-relaxed text-[#141414]/70 md:text-[16px]">{hero.lead}</p>
          <div className="mt-6 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
            <ButtonLink href={hero.primaryCta.href} variant="dark" track="hero_primary" className="w-full sm:w-auto">
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="secondary" track="hero_secondary" className="w-full sm:w-auto">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>

        <div className="mx-auto mt-8 flex h-[clamp(14rem,calc(100svh-25rem),32rem)] max-w-[1040px] items-center justify-center md:mt-10">
          <HeroImage image={hero.image} />
        </div>
      </div>
    </section>
  );
}

/* 03 — Trust strip */
function TrustStrip({ trust }: { trust: VendorConfig['trust'] }) {
  if (trust.items.length === 0) return null;
  return (
    <Band labelledBy="trust-title">
      <h2
        id="trust-title"
        className="mx-auto max-w-[26rem] text-balance text-center text-[1.75rem] font-semibold leading-[1.1] tracking-tighter sm:max-w-[34rem] sm:text-4xl lg:max-w-[820px] lg:text-5xl lg:leading-[1.05]"
      >
        <AccentedHeading text={trust.heading} accents={trust.accents} />
      </h2>
      <ul className="mx-auto mt-10 grid max-w-[1180px] gap-6 md:mt-12 md:grid-cols-3 md:gap-10">
        {trust.items.map((t) => (
          <li key={t.label} className="flex flex-col gap-4">
            <div className="rounded-[14px] border border-[#141414]/70 px-5 py-4 text-center md:px-6">
              <p className="text-[clamp(2.4rem,4.2vw,3.6rem)] font-semibold leading-none tracking-tighter">
                {t.value}
                <span className="text-[#DC3327]">{t.suffix}</span>
              </p>
              <p className="mt-2 text-[15px]">{t.label}</p>
            </div>
            <p className="text-sm leading-relaxed text-[#141414]/70">{t.text}</p>
          </li>
        ))}
      </ul>
    </Band>
  );
}

/* 04 — Environments (the ONE environment section). Red = hovered / focused / tapped. */
function ProductFamilyGrid({
  heading,
  accents,
  intro,
  items,
  onSelectEnvironment,
}: VendorConfig['families'] & { onSelectEnvironment: (environment: string) => void }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <Band id="environments" labelledBy="families-title">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-start lg:gap-16">
        <h2 id="families-title" className={cx(H2_CLASS, 'text-balance')}>
          <AccentedHeading text={heading} accents={accents} />
        </h2>
        <p className={cx(BODY, 'lg:pt-3')}>{intro}</p>
      </div>

      {/* Phones: swipeable row with the next card peeking in. sm and up: the normal grid. */}
      <ul className="-mx-4 mt-8 flex snap-x snap-mandatory scroll-pl-4 gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mt-10 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 md:mt-12 xl:grid-cols-4">
        {items.map((f, i) => {
          const on = i === active;
          const Icon = ICONS[f.icon];
          return (
            <li
              key={f.id}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(i)} /* touch devices have no hover, so a tap activates the card */
              className="flex w-[82%] shrink-0 snap-start flex-col gap-1.5 sm:w-auto"
            >
              <div
                className={cx(
                  'sv-anim flex flex-1 flex-col rounded-[20px] p-5 transition-colors duration-200',
                  on ? 'bg-[#DC3327] text-white' : 'bg-[#FFFFFF] text-[#141414]',
                )}
              >
                <h3 className="text-center sm:min-h-[3.4rem] text-[1.35rem] font-semibold leading-tight tracking-tighter">
                  {f.title}
                </h3>
                <CropFrame
                  halftone
                  className="mt-4 flex aspect-[2/1] items-center justify-center text-[#141414] sm:aspect-square"
                >
                  <Icon className="h-[80%] w-auto sm:h-[72%] sm:w-[72%]" />
                </CropFrame>
              </div>

              <div
                className={cx(
                  'sv-anim flex min-h-[8rem] flex-col justify-between gap-4 sm:min-h-[10rem] rounded-[20px] p-5 transition-colors duration-200',
                  on ? 'bg-[#DC3327] text-white' : 'bg-[#FFFFFF] text-[#141414]',
                )}
              >
                <p className="text-[15px] leading-snug">{f.text}</p>
                <a
                  href="#enquiry"
                  onClick={() => {
                    onSelectEnvironment(f.title);
                    trackEvent('environment_select', { environment: f.title });
                  }}
                  className="-my-2 inline-flex items-center gap-1.5 self-start py-2 text-[14px] font-semibold underline decoration-1 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
                >
                  Discuss this environment
                  <Arrow className="h-3.5 w-3.5" />
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </Band>
  );
}

/* 05 — Capabilities */
const CAP_TONE: Record<CapabilityTone, { card: string; icon: string }> = {
  red: { card: 'bg-[#DC3327] text-white', icon: 'text-white' },
  white: { card: 'bg-[#FFFFFF] text-[#141414]', icon: 'text-[#141414]' },
  grey: { card: 'bg-[#D1D1D3] text-[#141414]', icon: 'text-[#141414]/80' },
  dark: { card: 'bg-[#1E1E1E] text-white', icon: 'text-white' },
};

function CapabilitySection({ heading, accents, items }: VendorConfig['capabilities']) {
  return (
    <Band labelledBy="capabilities-title">
      <h2 id="capabilities-title" className={cx(H2_CLASS, 'max-w-[56rem] text-balance')}>
        <AccentedHeading text={heading} accents={accents} />
      </h2>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 xl:grid-cols-4">
        {items.map((c) => {
          const tone = CAP_TONE[c.tone];
          const Icon = CAP_ICONS[c.icon];
          return (
            <li
              key={c.title}
              className={cx(
                'relative isolate flex min-h-[11rem] flex-col justify-between overflow-hidden rounded-[20px] p-6 sm:aspect-square sm:min-h-0 md:p-7',
                tone.card,
              )}
            >
              {c.tone === 'red' && (
                <img
                  src={dottedCard}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className="pointer-events-none absolute inset-0 -z-10 h-full w-full select-none object-cover"
                />
              )}
              <Icon className={cx('h-12 w-12 self-end', tone.icon)} />
              <h3 className="text-xl font-medium leading-[1.3] tracking-tighter sm:text-2xl">{c.title}</h3>
            </li>
          );
        })}
      </ul>
    </Band>
  );
}

/* 06 — Mid-page CTA: a slim, taskbar-sized strip (one line on desktop) with a real <h2> and one button that jumps to the contact section. */
function PositioningBand({ heading, accents, cta }: VendorConfig['positioning']) {
  return (
    <section aria-labelledby="positioning-title" className="scroll-mt-24">
      <div className={cx(SITE_CONTAINER, 'pt-12 md:pt-20')}>
        <div className="relative isolate flex flex-col gap-3 overflow-hidden rounded-[16px] bg-[#141414] px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 md:px-8">
          <h2 id="positioning-title" className="text-balance text-[15px] font-semibold leading-snug tracking-tight sm:text-base lg:text-lg">
            <AccentedHeading text={heading} accents={accents} accentClass="text-[#FF9A90]" />
          </h2>
          <ButtonLink href={cta.href} variant="primary" size="sm" track="positioning_cta" className="w-full shrink-0 sm:w-auto">
            {cta.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/* 07 — How it works + node flow */
function ProcessSteps({ heading, steps, flow }: VendorConfig['process']) {
  return (
    <Band labelledBy="process-title">
      <h2 id="process-title" className={H2_CLASS}>
        {heading}
      </h2>

      {/* Mobile: vertical timeline (badge + dashed connector on the left). md and up: the horizontal row with arrows. */}
      <ol className="mt-10 grid md:mt-12 md:grid-cols-4">
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          return (
            <li key={s.title} className="flex gap-4 md:block md:pr-6">
              <div className="flex flex-col items-center md:w-full md:flex-row md:gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[12px] bg-[#DC3327] text-[22px] font-medium text-white"
                >
                  {i + 1}
                </span>
                {!last && (
                  <span
                    aria-hidden="true"
                    className="my-2 w-0 flex-1 border-l border-dashed border-[#141414]/40 md:hidden"
                  />
                )}
                {!last && (
                  <span className="hidden h-px flex-1 bg-[#141414]/70 md:block" aria-hidden="true">
                    <svg viewBox="0 0 8 8" className="float-right -mt-[3.5px] h-[8px] w-[8px]" fill="none" stroke="#141414" strokeWidth="1">
                      <path d="M1 1l3 3-3 3" transform="translate(1.5 0)" />
                    </svg>
                  </span>
                )}
              </div>
              <div className={cx('pt-2 md:pt-0', last ? 'pb-0' : 'pb-8 md:pb-0')}>
                <h3 className="text-2xl font-semibold tracking-tighter md:mt-5">{s.title}</h3>
                <p className={cx(BODY, 'mt-2 max-w-[16rem]')}>{s.text}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="relative mt-12 overflow-hidden rounded-[24px] bg-black md:min-h-[34rem]">
        <NodeFlow className="absolute inset-0" />
        {/* Mobile only: darkens the top and bottom so the text stays readable over the moving nodes. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/85 via-black/20 to-black/85 md:hidden"
        />
        <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between gap-14 px-5 py-8 sm:px-8 md:min-h-[34rem] md:gap-10 md:p-10">
          <div className="max-w-[34rem]">
            <h3 className={cx(H2_CLASS, 'text-white')}>{flow.heading}</h3>
            <p className="mt-5 text-[15px] leading-relaxed text-white/75 md:text-base">{flow.text}</p>
          </div>

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end md:gap-6">
            {(
              [
                [flow.leftTitle, flow.left, ''],
                [flow.rightTitle, flow.right, 'md:items-end'],
              ] as const
            ).map(([title, chips, align]) => (
              <div key={title} className={cx('flex flex-col gap-3.5', align)}>
                <p className="text-[13px] font-medium text-white/70">{title}</p>
                <ul className={cx('flex flex-wrap gap-2.5', align && 'md:justify-end')}>
                  {chips.map((c) => (
                    <li
                      key={c}
                      className="rounded-full border border-white/25 bg-black/60 px-3.5 py-1.5 text-[13px] text-white backdrop-blur-sm"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Band>
  );
}

/* 08 — Technical resources: simple folder-style cards (red header, notched tab, footer row). No animation beyond a colour change. */
function ResourceLinks({ heading, items }: VendorConfig['resources']) {
  return (
    <Band labelledBy="resources-title">
      <h2 id="resources-title" className={cx(H2_CLASS, 'text-balance')}>
        {heading}
      </h2>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 lg:grid-cols-3 lg:gap-5">
        {items.map((r, i) => (
          <li key={r.href} className="flex">
            <a
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('resource_click', { resource: r.label })}
              className={cx('group flex min-h-[21rem] w-full flex-col sm:min-h-[24rem] rounded-[28px] bg-[#FFFFFF] p-2.5', FOCUS)}
            >
              {/* Header drawn as one red shape with the notch already cut out (nothing is layered on top, so no hairline can show at the edges). */}
              <span className="relative block h-48">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 340 192"
                  preserveAspectRatio="none"
                  shapeRendering="geometricPrecision"
                  className="absolute inset-0 block h-full w-full"
                >
                  <defs>
                    <linearGradient id={`folder-grad-${i}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="192">
                      <stop offset="0" stopColor="#2B0D0A" />
                      <stop offset="0.72" stopColor="#B72A20" />
                      <stop offset="1" stopColor="#DC3327" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 20Q0 0 20 0H320Q340 0 340 20V178H262C232 178 222 144 196 144H12Q0 144 0 156Z"
                    fill={`url(#folder-grad-${i})`}
                  />
                </svg>
                <span
                  aria-hidden="true"
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors group-hover:bg-white group-hover:text-[#DC3327]"
                >
                  <Arrow />
                </span>
              </span>

              {/* title + description sit in the tab (negative margin pulls them up into it) */}
              <span className="relative z-10 -mt-9 block px-5">
                <span className="block max-w-[52%] text-[17px] font-semibold leading-snug tracking-tight">
                  {r.label}
                  <span className="sr-only"> (opens the manufacturer site in a new tab)</span>
                </span>
                <span className="mt-3 block text-[14px] leading-snug text-[#141414]/70">{r.text}</span>
              </span>

              {/* footer row */}
              <span className="mt-auto flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 pb-4 pt-4">
                <span className="text-[15px] font-semibold">{r.tag}</span>
                <span className="text-[14px] text-[#141414]/70">{r.source}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Band>
  );
}

/* 09 — FAQs (native <details>: content is in the DOM and works without JS) */
function FAQAccordion({ heading, accents, items }: VendorConfig['faqs']) {
  return (
    <Band labelledBy="faq-title">
      <div className={SPLIT_5_7}>
        <h2 id="faq-title" className={cx(H2_CLASS, 'lg:sticky lg:top-24 lg:self-start')}>
          <AccentedHeading text={heading} accents={accents} />
        </h2>
        <div className="flex flex-col gap-3">
          {items.map((f, i) => (
            <details key={f.q} open={i === 0} className="sv-faq group rounded-[14px] bg-[#FFFFFF]">
              <summary
                className={cx(
                  'flex cursor-pointer items-center justify-between gap-6 p-5 text-[17px] font-medium leading-snug tracking-[-0.02em] transition-colors group-open:text-[#B72A20] md:px-6 md:py-5',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#DC3327]',
                )}
              >
                {f.q}
                <svg
                  viewBox="0 0 16 16"
                  className="sv-anim h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="m3 6 5 5 5-5" />
                </svg>
              </summary>
              <p className={cx(BODY, 'max-w-[46rem] px-5 pb-6 md:px-6')}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Band>
  );
}

/* 10 — Related solutions (internal links go through the router; the vertical rail text is gone) */
function RelatedSolutions({ heading, items }: VendorConfig['related']) {
  return (
    <Band labelledBy="related-title">
      <h2 id="related-title" className={H2_CLASS}>
        {heading}
      </h2>
      <ul className="mt-10 grid gap-4 md:mt-12 md:grid-cols-3">
        {items.map((r) => (
          <li key={r.href} className="flex">
            <SmartLink
              href={r.href}
              className={cx(
                'group sv-anim flex min-h-[11rem] w-full overflow-hidden rounded-[20px] bg-[#FFFFFF] transition-transform duration-200 [@media(hover:hover)]:hover:-translate-y-1 md:min-h-[14.5rem]',
                FOCUS,
              )}
            >
              <span className="flex flex-1 flex-col p-6 md:p-10">
                <span className="block text-[1.4rem] font-medium leading-tight tracking-tighter md:text-[1.75rem]">
                  {r.label}
                </span>
                <span className="mt-4 block text-[15px] leading-relaxed text-[#141414]/70">{r.text}</span>
              </span>

              {/* Black rail (red on hover): arrow at the top, "Redirect now" reading upward at the bottom (decorative; the link text is the card title). */}
              <span
                aria-hidden="true"
                className="relative isolate flex w-11 shrink-0 flex-col items-center justify-between bg-[#141414] py-4 text-white transition-colors group-hover:bg-[#DC3327]"
              >
                <img
                  src={dottedOverlay}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="pointer-events-none absolute inset-0 -z-10 h-full w-full select-none object-cover"
                />
                <Arrow />
                <span className="rotate-180 text-[12px] font-semibold uppercase tracking-[0.04em] [writing-mode:vertical-rl]">
                  Redirect now
                </span>
              </span>
            </SmartLink>
          </li>
        ))}
      </ul>
    </Band>
  );
}

/* ---------- enquiry form ---------- */

/*
 * Field set, required-ness, Web3Forms payload and the toast + reset-on-success flow follow the GCC page's ContactSection.
 * Kept from the Fortinet version: the Environment select (the "Discuss this environment" cards pre-fill it), the honeypot,
 * inline field errors with aria-invalid / aria-describedby, and a persistent live region for screen readers.
 */

type Fields = {
  firstName: string;
  lastName: string;
  workEmail: string;
  phone: string;
  role: string;
  orgName: string;
  environment: string;
  scale: string;
  discuss: string;
};
type RequiredField = 'firstName' | 'lastName' | 'workEmail' | 'phone' | 'role' | 'orgName' | 'discuss';
type Errors = Partial<Record<RequiredField, string>>;
type ToastState = { message: string; error: boolean };

const EMPTY: Fields = {
  firstName: '',
  lastName: '',
  workEmail: '',
  phone: '',
  role: '',
  orgName: '',
  environment: '',
  scale: '',
  discuss: '',
};

/** Order the fields appear on screen, so focus jumps to the first invalid one. */
const REQUIRED_ORDER: RequiredField[] = ['firstName', 'lastName', 'workEmail', 'phone', 'role', 'orgName', 'discuss'];

const TOAST_MS = 4000;

/** Maximum length for every text field (also set as `maxLength` on the inputs, and re-applied after paste/autofill). */
const LIMITS = {
  firstName: 40,
  lastName: 40,
  workEmail: 254,
  phone: 20,
  role: 60,
  orgName: 100,
  scale: 60,
  discuss: 1000,
} as const;
const DISCUSS_MIN = 10;

const squash = (s: string) => s.replace(/^\s+/, '').replace(/ {2,}/g, ' ');

/**
 * Applied on every change, so typing, pasting and browser autofill can never put a disallowed character in the field.
 *  - names:   letters (any language), spaces, apostrophe, dot, hyphen        — no digits or symbols
 *  - role:    letters, spaces, dot, hyphen, slash, ampersand                 — no digits ("CTO / Head of IT" still works)
 *  - org:     letters, digits, spaces, & . , ' ( ) / -                       — digits allowed ("3M", "Tata 1mg")
 *  - phone:   digits, spaces, hyphen and one leading "+"                     — no letters
 *  - email:   no whitespace
 *  - scale:   free text without angle brackets
 *  - discuss: free text without angle brackets or control characters (new lines are kept)
 */
const SANITIZE: Partial<Record<keyof Fields, (v: string) => string>> = {
  firstName: (v) => squash(v.replace(/[^\p{L}\p{M}\s'.-]/gu, '')),
  lastName: (v) => squash(v.replace(/[^\p{L}\p{M}\s'.-]/gu, '')),
  role: (v) => squash(v.replace(/[^\p{L}\p{M}\s.\-/&]/gu, '')),
  orgName: (v) => squash(v.replace(/[^\p{L}\p{M}\p{N}\s&.,'()/-]/gu, '')),
  phone: (v) => squash(v.replace(/[^\d+\s-]/g, '').replace(/(?!^)\+/g, '')),
  workEmail: (v) => v.replace(/\s/g, ''),
  scale: (v) => squash(v.replace(/[<>]/g, '').replace(/[\u0000-\u001F\u007F]/g, '')),
  discuss: (v) => v.replace(/[<>]/g, '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').replace(/^\s+/, ''),
};

/** Collapse repeated spaces/line breaks before sending, so the inbox gets clean values. */
const tidy = (v: string) => v.trim().replace(/\s+/g, ' ');

function validate(v: Fields): Errors {
  const e: Errors = {};
  const letters = (x: string) => (x.match(/\p{L}/gu) || []).length;

  if (letters(v.firstName) < 1) e.firstName = 'Please enter your first name.';
  if (letters(v.lastName) < 1) e.lastName = 'Please enter your last name.';

  const email = v.workEmail.trim();
  if (!email) e.workEmail = 'Please enter your work email.';
  else if (email.length > LIMITS.workEmail || email.includes('..') || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    e.workEmail = 'Please enter a valid email address.';

  const digits = v.phone.replace(/\D/g, '');
  if (!v.phone.trim()) e.phone = 'Please enter your phone number.';
  else if (digits.length < 10 || digits.length > 15) e.phone = 'Please enter a valid phone number (10 to 15 digits).';

  if (!v.role.trim()) e.role = 'Please enter your role.';
  else if (letters(v.role) < 2) e.role = 'Please enter a valid role, for example IT Manager.';

  if (!v.orgName.trim()) e.orgName = 'Please enter your organisation name.';
  else if (v.orgName.trim().length < 2) e.orgName = 'Please enter a valid organisation name.';

  const msg = v.discuss.trim();
  if (!msg) e.discuss = 'Please tell us what you would like to discuss.';
  else if (msg.length < DISCUSS_MIN) e.discuss = `Please add a little more detail (at least ${DISCUSS_MIN} characters).`;
  return e;
}

const INPUT =
  'w-full rounded-[8px] border border-[#141414]/30 bg-[#FFFFFF] px-3 py-3 text-base text-[#141414] sm:py-2.5 sm:text-[15px] placeholder:text-[#141414]/60 transition-colors hover:border-[#141414]/50 focus-visible:border-[#DC3327] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#DC3327]/30 aria-[invalid=true]:border-[#B72A20] disabled:opacity-60';

function Field({
  id,
  label,
  required,
  optional,
  error,
  hint,
  children,
  className,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  /** Small helper text under the control (e.g. a character counter). */
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[15px] font-medium">
        {label}
        {required && (
          <span className="text-[#B72A20]" aria-hidden="true">
            *
          </span>
        )}
        {optional && <span className="text-[13px] font-normal text-[#141414]/65"> · optional</span>}
      </label>
      {children}
      {hint}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm font-semibold text-[#B72A20]">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Toast, same idea as the GCC page's GCCToast. Rendered through a portal into document.body so a transformed ancestor
 * (Layout / page transitions) can never turn `position: fixed` into "fixed to that ancestor". It is aria-hidden because
 * the form's persistent live region announces the same message.
 */
function FormToast({ toast, visible }: { toast: ToastState | null; visible: boolean }) {
  if (!toast || typeof document === 'undefined') return null;
  return createPortal(
    <div
      aria-hidden="true"
      className={cx(
        'sv-root sv-anim pointer-events-none fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2 px-4 transition-all duration-300',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
      )}
    >
      <div
        className={cx(
          'flex items-center gap-2.5 rounded-[10px] px-5 py-3 text-[14px] font-semibold text-white shadow-xl',
          toast.error ? 'bg-[#B72A20]' : 'bg-[#141414]',
        )}
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.25">
          {toast.error ? <path d="m5 5 10 10M15 5 5 15" /> : <path d="m4 10.5 4 4 8-9" />}
        </svg>
        {toast.message}
      </div>
    </div>,
    document.body,
  );
}

function EnquiryForm({
  vendor,
  presetEnvironment,
  onSubmit,
}: {
  vendor: VendorConfig;
  /** Set when a visitor clicks "Discuss this environment" on a card. */
  presetEnvironment: string;
  onSubmit: (payload: EnquiryPayload) => Promise<void>;
}) {
  const cfg = vendor.enquiry;
  const [values, setValues] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);

  // Shared state replaces the old window CustomEvent: the page passes the chosen environment down.
  useEffect(() => {
    if (presetEnvironment && cfg.environments.includes(presetEnvironment)) {
      setValues((v) => ({ ...v, environment: presetEnvironment }));
    }
  }, [presetEnvironment, cfg.environments]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const showToast = (message: string, error = false) => {
    clearTimers();
    setToast({ message, error });
    setToastVisible(false);
    timers.current.push(
      window.setTimeout(() => setToastVisible(true), 20),
      window.setTimeout(() => setToastVisible(false), TOAST_MS),
      window.setTimeout(() => setToast(null), TOAST_MS + 400),
    );
  };

  const set = (key: keyof Fields) => (ev: { target: { value: string } }) => {
    const limit = (LIMITS as Record<string, number>)[key];
    let next = SANITIZE[key] ? SANITIZE[key]!(ev.target.value) : ev.target.value;
    if (limit) next = next.slice(0, limit);
    setValues((v) => ({ ...v, [key]: next }));
    // Clear a field's error as soon as the visitor edits it.
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (busy) return;

    const found = validate(values);
    setErrors(found);
    const firstInvalid = REQUIRED_ORDER.find((k) => found[k]);
    if (firstInvalid) {
      document.getElementById(`enq-${firstInvalid}`)?.focus();
      trackEvent('enquiry_validation_error', { fields: Object.keys(found).join(',') });
      return;
    }

    // Bots fill the hidden field: pretend it worked, send nothing.
    if (honeypot.current?.value) {
      setValues(EMPTY);
      showToast('Message sent. We’ll be in touch soon.');
      return;
    }

    setBusy(true);
    setFailed(false);
    try {
      await onSubmit({
        firstName: tidy(values.firstName),
        lastName: tidy(values.lastName),
        email: values.workEmail.trim().toLowerCase(),
        phone: tidy(values.phone),
        role: tidy(values.role),
        company: tidy(values.orgName),
        environment: values.environment,
        scale: tidy(values.scale),
        message: values.discuss.trim(),
        vendor: vendor.name,
        sourcePath: vendor.meta.path,
      });
      trackEvent('enquiry_submit', { vendor: vendor.slug, environment: values.environment || 'unspecified' });
      setValues(EMPTY);
      setErrors({});
      showToast('Message sent. We’ll be in touch soon.');
    } catch {
      setFailed(true);
      showToast('Something went wrong. Please try again.', true);
      trackEvent('enquiry_error', { vendor: vendor.slug });
    } finally {
      setBusy(false);
    }
  }

  const describe = (key: RequiredField) => (errors[key] ? `enq-${key}-error` : undefined);

  return (
    <>
      {/* Persistent live region: it exists before the message changes, so screen readers actually announce it. */}
      <p aria-live="polite" className="sr-only">
        {toast && toastVisible ? toast.message : ''}
      </p>

      <form onSubmit={handleSubmit} noValidate className="relative grid gap-5 p-6 sm:grid-cols-2 md:p-12">
        <Field id="enq-firstName" label="First name" required error={errors.firstName}>
          <input
            id="enq-firstName"
            name="firstName"
            autoComplete="given-name"
            placeholder="Enter your first name"
            value={values.firstName}
            onChange={set('firstName')}
            maxLength={LIMITS.firstName}
            disabled={busy}
            aria-required="true"
            aria-invalid={errors.firstName ? true : undefined}
            aria-describedby={describe('firstName')}
            className={INPUT}
          />
        </Field>
        <Field id="enq-lastName" label="Last name" required error={errors.lastName}>
          <input
            id="enq-lastName"
            name="lastName"
            autoComplete="family-name"
            placeholder="Enter your last name"
            value={values.lastName}
            onChange={set('lastName')}
            maxLength={LIMITS.lastName}
            disabled={busy}
            aria-required="true"
            aria-invalid={errors.lastName ? true : undefined}
            aria-describedby={describe('lastName')}
            className={INPUT}
          />
        </Field>
        <Field id="enq-workEmail" label="Work email" required error={errors.workEmail}>
          <input
            id="enq-workEmail"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="name@company.com"
            value={values.workEmail}
            onChange={set('workEmail')}
            maxLength={LIMITS.workEmail}
            disabled={busy}
            aria-required="true"
            aria-invalid={errors.workEmail ? true : undefined}
            aria-describedby={describe('workEmail')}
            className={INPUT}
          />
        </Field>
        <Field id="enq-phone" label="Phone" required error={errors.phone}>
          <input
            id="enq-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="e.g. +91 98765 43210"
            value={values.phone}
            onChange={set('phone')}
            maxLength={LIMITS.phone}
            disabled={busy}
            aria-required="true"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describe('phone')}
            className={INPUT}
          />
        </Field>
        <Field id="enq-role" label="Your role" required error={errors.role}>
          <input
            id="enq-role"
            name="role"
            autoComplete="organization-title"
            placeholder="Enter your role"
            value={values.role}
            onChange={set('role')}
            maxLength={LIMITS.role}
            disabled={busy}
            aria-required="true"
            aria-invalid={errors.role ? true : undefined}
            aria-describedby={describe('role')}
            className={INPUT}
          />
        </Field>
        <Field id="enq-orgName" label="Organisation name" required error={errors.orgName}>
          <input
            id="enq-orgName"
            name="company"
            autoComplete="organization"
            placeholder="Enter your organisation name"
            value={values.orgName}
            onChange={set('orgName')}
            maxLength={LIMITS.orgName}
            disabled={busy}
            aria-required="true"
            aria-invalid={errors.orgName ? true : undefined}
            aria-describedby={describe('orgName')}
            className={INPUT}
          />
        </Field>
        <Field id="enq-environment" label="Environment" optional>
          <div className="relative">
            <select
              id="enq-environment"
              name="environment"
              value={values.environment}
              onChange={set('environment')}
              disabled={busy}
              className={cx(INPUT, 'appearance-none pr-10')}
            >
              <option value="">Select an environment</option>
              {cfg.environments.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
            <svg
              viewBox="0 0 12 12"
              className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden="true"
            >
              <path d="m2 4 4 4 4-4" />
            </svg>
          </div>
        </Field>
        <Field id="enq-scale" label="Approx. users or sites" optional>
          <input
            id="enq-scale"
            name="scale"
            value={values.scale}
            onChange={set('scale')}
            maxLength={LIMITS.scale}
            disabled={busy}
            placeholder="e.g. 250 users, 6 sites"
            className={INPUT}
          />
        </Field>
        <Field
          id="enq-discuss"
          label="What would you like to discuss?"
          required
          error={errors.discuss}
          className="sm:col-span-2"
          hint={
            <p
              id="enq-discuss-count"
              className={cx(
                'mt-1.5 text-right text-[13px]',
                values.discuss.length >= LIMITS.discuss * 0.9 ? 'font-semibold text-[#B72A20]' : 'text-[#141414]/65',
              )}
            >
              {values.discuss.length} / {LIMITS.discuss}
            </p>
          }
        >
          <textarea
            id="enq-discuss"
            name="message"
            rows={4}
            value={values.discuss}
            onChange={set('discuss')}
            maxLength={LIMITS.discuss}
            disabled={busy}
            placeholder="Current firewall, security priorities, timeline, any model preferences"
            aria-required="true"
            aria-invalid={errors.discuss ? true : undefined}
            aria-describedby={[describe('discuss'), 'enq-discuss-count'].filter(Boolean).join(' ')}
            className={cx(INPUT, 'resize-y')}
          />
        </Field>

        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="sm:col-span-2">
          {failed && (
            <p role="alert" className="mb-4 rounded-[10px] border border-[#B72A20] p-3 text-sm font-semibold text-[#B72A20]">
              We couldn’t send your enquiry. Please try again or email {vendor.contact.email}.
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <button
              type="submit"
              disabled={busy}
              aria-busy={busy || undefined}
              className={buttonClass('primary', 'w-full sm:w-auto')}
            >
              {busy ? 'Sending…' : cfg.submitLabel}
            </button>
            <p className="max-w-sm text-[13px] leading-relaxed text-[#141414]/70">
              We use these details only to respond to your enquiry. See our{' '}
              <SmartLink href={cfg.privacyHref} className="font-semibold underline underline-offset-2 hover:text-[#B72A20]">
                privacy notice
              </SmartLink>
              .
            </p>
          </div>
        </div>
      </form>

      <FormToast toast={toast} visible={toastVisible} />
    </>
  );
}

/* 11 — Final CTA + enquiry form */
function EnquirySection({
  vendor,
  presetEnvironment,
  onSubmit,
}: {
  vendor: VendorConfig;
  presetEnvironment: string;
  onSubmit: (payload: EnquiryPayload) => Promise<void>;
}) {
  const cfg = vendor.enquiry;
  return (
    <Band id="enquiry" labelledBy="enquiry-title" className="pb-20 md:pb-28">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* No background on the clipped wrapper: the colour and dots are layers INSIDE it, so the rounded edge is clipped once and no red fringe shows outside the card. */}
        <div className="relative isolate flex flex-col justify-between gap-8 overflow-hidden rounded-[24px] p-6 text-white md:p-12">
          <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[#DC3327]" />
          <img
            src={dottedOverlay}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full select-none object-cover"
          />

          <div>
            <h2 id="enquiry-title" className={cx(H2_CLASS, 'text-balance')}>
              {cfg.heading}
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white md:text-[16px]">{cfg.text}</p>
          </div>

          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/40 pt-6 text-[15px] font-medium">
            <a
              className={cx('inline-block py-1 underline underline-offset-4', FOCUS)}
              href={`mailto:${vendor.contact.email}`}
              onClick={() => trackEvent('contact_click', { channel: 'email', location: 'enquiry' })}
            >
              {vendor.contact.email}
            </a>
            <span aria-hidden="true" className="hidden h-4 w-px bg-white/60 sm:block" />
            <a
              className={cx('inline-block py-1 underline underline-offset-4', FOCUS)}
              href={`tel:${vendor.contact.phone.replace(/\s/g, '')}`}
              onClick={() => trackEvent('contact_click', { channel: 'phone', location: 'enquiry' })}
            >
              {vendor.contact.phone}
            </a>
          </p>
        </div>

        <Panel className="relative rounded-[24px]">
          <EnquiryForm vendor={vendor} presetEnvironment={presetEnvironment} onSubmit={onSubmit} />
        </Panel>
      </div>
    </Band>
  );
}

/* ---------- page template ---------- */

interface VendorLandingPageProps {
  vendor: VendorConfig;
  onEnquirySubmit: (payload: EnquiryPayload) => Promise<void>;
}

function VendorLandingPage({ vendor, onEnquirySubmit }: VendorLandingPageProps) {
  // Shared state: a family card sets it, the enquiry form reads it (replaces the old window CustomEvent).
  const [presetEnvironment, setPresetEnvironment] = useState('');

  // Root is a <div>, not <main>: the Layout component should own the single <main> landmark.
  return (
    <div className="sv-root bg-[#F5F5F7] text-[#141414] antialiased selection:bg-[#DC3327] selection:text-white">
      <Breadcrumb items={vendor.breadcrumb} />
      <VendorHero hero={vendor.hero} />
      <TrustStrip trust={vendor.trust} />
      <ProductFamilyGrid {...vendor.families} onSelectEnvironment={setPresetEnvironment} />
      <CapabilitySection {...vendor.capabilities} />
      <PositioningBand {...vendor.positioning} />
      <ProcessSteps {...vendor.process} />
      <ResourceLinks {...vendor.resources} />
      <FAQAccordion {...vendor.faqs} />
      <RelatedSolutions {...vendor.related} />
      <EnquirySection vendor={vendor} presetEnvironment={presetEnvironment} onSubmit={onEnquirySubmit} />
    </div>
  );
}

/* ---------- embedded styles (helpers only; fonts are loaded in <SeoHead />) ---------- */

const VENDOR_CSS = `
.sv-root { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif; }

/* Fine dot texture used inside crop-mark frames. */
.sv-halftone {
  background-image: radial-gradient(rgba(20, 20, 20, 0.2) 0.7px, transparent 0.9px);
  background-size: 4px 4px;
}

/* Native <details> marker off: we draw our own. */
.sv-faq > summary { list-style: none; }
.sv-faq > summary::-webkit-details-marker { display: none; }

@media (prefers-reduced-motion: reduce) {
  .sv-anim, .sv-anim * { transition: none !important; animation: none !important; }
}
`;

function VendorStyles() {
  return <style dangerouslySetInnerHTML={{ __html: VENDOR_CSS }} />;
}

/* ---------- enquiry transport ---------- */

/**
 * Same Web3Forms pipeline as the GCC page, so leads land in the inbox you already monitor.
 * (The previous placeholder threw an error when no endpoint was configured, which would have dropped every lead.)
 * Set VITE_WEB3FORMS_ACCESS_KEY to route Fortinet leads to a separate Web3Forms account.
 */
const WEB3FORMS_ACCESS_KEY =
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'ab9fd6a8-a8de-4f28-ba11-f6d95387e932';

async function submitEnquiry(payload: EnquiryPayload): Promise<void> {
  const fullName = `${payload.firstName} ${payload.lastName}`.trim();
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `New ${payload.vendor} enquiry from ${fullName} — ${payload.company}`,
      from_name: fullName,
      name: fullName,
      email: payload.email,
      phone: payload.phone || '—',
      role: payload.role || '—',
      company: payload.company,
      environment: payload.environment || '—',
      scale: payload.scale || '—',
      message: payload.message || '—',
      source_page: payload.sourcePath,
    }),
  });
  const data = (await res.json()) as { success?: boolean };
  if (!res.ok || !data.success) throw new Error(`Enquiry failed with status ${res.status}`);
}

/* ---------- page ---------- */

export default function Fortinet() {
  return (
    <Layout>
      <SeoHead vendor={fortinet} />
      <VendorStyles />
      <VendorLandingPage vendor={fortinet} onEnquirySubmit={submitEnquiry} />
    </Layout>
  );
}