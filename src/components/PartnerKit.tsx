import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { AnchorHTMLAttributes, CSSProperties, FormEvent, ReactNode } from 'react';
import dottedOverlay from '@/assets/dotted_card.png';

/**
 * partnerKit — shared building blocks for every Sniper partner landing page (Bentley now, Fortinet and others later).
 *
 * Why this file exists
 *  - Each partner page used to carry its own copy of the form, FAQ, SEO head, buttons and tokens (~1,500 lines each).
 *    Now a partner page is: a content object + the few sections that are unique to that partner.
 *  - Fix a bug or change the red once, here, and every partner page gets it.
 *
 * Put this file next to the partner pages (e.g. src/pages/partners/partnerKit.tsx).
 *
 * PALETTE   #F5F5F7 canvas · #FFFFFF cards · #141414 ink · #DC3327 red · #B72A20 deep red (hover / text-on-white red)
 */

/* =============================================================================
 * TYPES
 * ========================================================================== */

export interface LinkItem {
  label: string;
  href: string;
}
export interface Crumb {
  label: string;
  href?: string;
}
export interface Faq {
  q: string;
  a: string;
}
export interface PageMeta {
  title: string;
  /** Optional shorter title for Twitter cards. Falls back to `title`. */
  shortTitle?: string;
  description: string;
  path: string;
  keywords: string[];
  ogImage: string;
  ogImageAlt: string;
}
export interface TrustPoint {
  value: string;
  suffix?: string;
  label: string;
  text: string;
}
export interface ProcessStep {
  title: string;
  text: string;
}
export interface RelatedLink {
  label: string;
  text: string;
  href: string;
}
export interface EnquiryPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  company: string;
  choice: string;
  choiceLabel: string;
  scale: string;
  message: string;
  vendor: string;
  sourcePath: string;
}
export interface EnquiryCopy {
  heading: string;
  text: string;
  submitLabel: string;
  privacyHref: string;
  /** The optional dropdown (e.g. "Industry" or "Environment"). */
  choiceLabel: string;
  choicePlaceholder: string;
  choices: string[];
  /** The optional free-text size field. */
  scaleLabel: string;
  scalePlaceholder: string;
  messagePlaceholder: string;
}
/** A card elsewhere on the page sets this; the form reads it. `id` makes a repeat click on the same card still apply. */
export interface ChoicePreset {
  value: string;
  id: number;
}

/* =============================================================================
 * TOKENS + HELPERS
 * ========================================================================== */

export const SITE_URL = 'https://sniperindia.com/';
/** Route that renders pages/privacy in the app router. */
export const PRIVACY_PATH = '/privacy';

/** One source of truth for the page's horizontal edges (content = 1365px wide, centred). */
export const SITE_CONTAINER = 'mx-auto w-full max-w-[calc(1365px+3rem)] px-4 sm:px-6';
export const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#DC3327]';
/** Section headings: 28px mobile, 36px tablet, 48px desktop. */
export const H2_CLASS =
  'text-[1.75rem] leading-[1.1] sm:text-4xl sm:leading-[1.1] lg:text-5xl lg:leading-[1.05] font-semibold tracking-tighter';
export const BODY = 'text-[15px] leading-relaxed text-[#141414]/70';
const SPLIT_5_7 = 'grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16';

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** Analytics: works with GA4 (gtag) or Google Tag Manager (dataLayer). Silent if neither is on the page. */
export function trackEvent(name: string, params: Record<string, string | number | undefined> = {}): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] };
  if (w.gtag) w.gtag('event', name, params);
  else if (w.dataLayer) w.dataLayer.push({ event: name, ...params });
}

/** Internal paths use the router (no full reload); everything else is a normal link. */
export function SmartLink({
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

export function Arrow({ className }: { className?: string }) {
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

export function AccentedHeading({
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

/**
 * Every section owns only its TOP padding, so every gap on the page is identical.
 * scroll-mt-24 keeps anchored sections clear of the fixed navbar.
 */
export function Band({
  id,
  labelledBy,
  label,
  children,
  className,
}: {
  id?: string;
  labelledBy?: string;
  /** Use instead of `labelledBy` when the section has no visible heading. */
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} aria-label={label} className="scroll-mt-24">
      <div className={cx(SITE_CONTAINER, 'pt-12 md:pt-20', className)}>{children}</div>
    </section>
  );
}

/* =============================================================================
 * BUTTONS
 * ========================================================================== */

type ButtonVariant = 'primary' | 'dark' | 'outline' | 'secondary';
type ButtonSize = 'md' | 'sm';

const BTN_BASE =
  'sv-anim inline-flex items-center justify-center rounded-[8px] text-[14px] font-medium sm:text-[15px] leading-tight transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 ' +
  FOCUS;

const BTN_VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-[#DC3327] text-white hover:bg-[#B72A20]',
  /** Black at rest, red on hover. */
  dark: 'bg-[#141414] text-white hover:bg-[#DC3327]',
  /** White with a red hairline, fills red on hover. */
  outline: 'bg-[#FFFFFF] text-[#141414] ring-1 ring-inset ring-[#DC3327] hover:bg-[#DC3327] hover:text-white',
  /** The hairline ring keeps a white button visible on the near-white canvas. */
  secondary: 'bg-[#FFFFFF] text-[#141414] ring-1 ring-inset ring-[#141414]/15 hover:bg-[#141414] hover:text-white',
};

const BTN_SIZE: Record<ButtonSize, string> = {
  md: 'px-5 py-3 sm:px-6',
  sm: 'px-4 py-3 sm:px-5 sm:py-2.5',
};

export const buttonClass = (variant: ButtonVariant = 'primary', extra?: string, size: ButtonSize = 'md') =>
  cx(BTN_BASE, BTN_SIZE[size], BTN_VARIANT[variant], extra);

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Analytics label. When set, a click fires a `cta_click` event. */
  track?: string;
}

export function ButtonLink({ variant = 'primary', size = 'md', className, children, track, onClick, ...rest }: ButtonLinkProps) {
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

/* =============================================================================
 * SEO — one head for every partner page
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

interface SeoHeadProps {
  meta: PageMeta;
  serviceName: string;
  serviceType: string;
  audience: string;
  breadcrumb: Crumb[];
  faqs: Faq[];
}

export function SeoHead({ meta, serviceName, serviceType, audience, breadcrumb, faqs }: SeoHeadProps) {
  const pageUrl = useMemo(() => new URL(meta.path, SITE_URL).toString(), [meta.path]);

  // JSON-LD is built from the same data the page renders, so the markup can never drift from the visible FAQ.
  const [service, faq, crumbs] = useMemo(
    () => [
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${pageUrl}#service`,
        name: serviceName,
        serviceType,
        description: meta.description,
        provider: { '@id': ORG_ID },
        areaServed: { '@type': 'Country', name: 'India' },
        audience: { '@type': 'BusinessAudience', audienceType: audience },
        url: pageUrl,
      }),
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      }),
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumb.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.label,
          item: c.href ? new URL(c.href, SITE_URL).toString() : pageUrl,
        })),
      }),
    ],
    [pageUrl, serviceName, serviceType, audience, meta.description, faqs, breadcrumb],
  );
  const org = useMemo(() => JSON.stringify(ORGANIZATION_JSON_LD), []);

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords.join(', ')} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={pageUrl} />

      <meta name="geo.region" content="IN-TN" />
      <meta name="geo.placename" content="Chennai" />
      <meta name="geo.position" content="13.0827;80.2707" />
      <meta name="ICBM" content="13.0827, 80.2707" />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content="Sniper Systems & Solutions" />
      <meta property="og:image" content={meta.ogImage} />
      <meta property="og:image:alt" content={meta.ogImageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.shortTitle ?? meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.ogImage} />

      {/* Fonts: preconnect + one stylesheet link (no render-blocking CSS @import). */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&display=swap"
      />

      <script type="application/ld+json">{org}</script>
      <script type="application/ld+json">{service}</script>
      <script type="application/ld+json">{faq}</script>
      <script type="application/ld+json">{crumbs}</script>
    </Helmet>
  );
}

/* =============================================================================
 * SECTIONS
 * ========================================================================== */

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className={cx(SITE_CONTAINER, 'pb-2 pt-6')}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-medium text-[#141414]/70">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.label} className="flex items-center gap-2">
              {c.href && !last ? (
                <SmartLink
                  href={c.href}
                  className={cx('-my-2 inline-block py-2 underline-offset-4 hover:text-[#B72A20] hover:underline', FOCUS)}
                >
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

/** Text-only hero (the only H1 on the page). Put any hero media in its own section below. */
export function PartnerHero({
  h1,
  accents,
  lead,
  primaryCta,
  secondaryCta,
}: {
  h1: string;
  accents?: string[];
  lead: string;
  primaryCta: LinkItem;
  secondaryCta: LinkItem;
}) {
  return (
    <section aria-labelledby="hero-title">
      <div className={cx(SITE_CONTAINER, 'pt-4 md:pt-8')}>
        <div className="mx-auto flex max-w-[1040px] flex-col items-center text-center">
          <h1
            id="hero-title"
            className="max-w-[760px] text-balance text-[clamp(1.875rem,4.2vw+0.5rem,3.25rem)] font-semibold leading-[1.1] tracking-tighter"
          >
            <AccentedHeading text={h1} accents={accents} />
          </h1>
          <p className="mt-4 max-w-[760px] text-balance text-[15px] leading-relaxed text-[#141414]/70 md:text-[16px]">
            {lead}
          </p>
          <div className="mt-6 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center">
            <ButtonLink href={primaryCta.href} variant="dark" track="hero_primary" className="w-full sm:w-auto">
              {primaryCta.label}
            </ButtonLink>
            <ButtonLink href={secondaryCta.href} variant="outline" track="hero_secondary" className="w-full sm:w-auto">
              {secondaryCta.label}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrustStrip({
  heading,
  accents,
  items,
}: {
  heading: string;
  accents?: string[];
  items: TrustPoint[];
}) {
  if (items.length === 0) return null;
  return (
    <Band labelledBy="trust-title">
      <h2
        id="trust-title"
        className="mx-auto max-w-[26rem] text-balance text-center text-[1.75rem] font-semibold leading-[1.1] tracking-tighter sm:max-w-[34rem] sm:text-4xl lg:max-w-[820px] lg:text-5xl lg:leading-[1.05]"
      >
        <AccentedHeading text={heading} accents={accents} />
      </h2>
      <ul className="mx-auto mt-10 grid max-w-[1180px] gap-6 md:mt-12 md:grid-cols-3 md:gap-10">
        {items.map((t) => (
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

/** Numbered row on desktop, vertical timeline on phones. Works for any number of steps. */
export function ProcessSteps({ heading, steps }: { heading: string; steps: ProcessStep[] }) {
  return (
    <Band labelledBy="process-title">
      <h2 id="process-title" className={H2_CLASS}>
        {heading}
      </h2>

      <ol
        style={{ '--n': steps.length } as CSSProperties}
        className="mt-10 grid md:mt-12 md:grid-cols-[repeat(var(--n),minmax(0,1fr))]"
      >
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
                    <svg
                      viewBox="0 0 8 8"
                      className="float-right -mt-[3.5px] h-[8px] w-[8px]"
                      fill="none"
                      stroke="#141414"
                      strokeWidth="1"
                    >
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
    </Band>
  );
}

/** Native <details>: content is in the DOM and works without JS. */
export function FAQAccordion({ heading, accents, items }: { heading: string; accents?: string[]; items: Faq[] }) {
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

/** White card + black rail (red on hover). The rail text is decorative; the card title is the link text. */
export function RelatedSolutions({ heading, items }: { heading: string; items: RelatedLink[] }) {
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

/* =============================================================================
 * ENQUIRY — section, form, validation, transport
 * ========================================================================== */

type Fields = {
  firstName: string;
  lastName: string;
  workEmail: string;
  phone: string;
  role: string;
  orgName: string;
  choice: string;
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
  choice: '',
  scale: '',
  discuss: '',
};

/** Order the fields appear on screen, so focus jumps to the first invalid one. */
const REQUIRED_ORDER: RequiredField[] = ['firstName', 'lastName', 'workEmail', 'phone', 'role', 'orgName', 'discuss'];

const TOAST_MS = 4000;
const DISCUSS_MIN = 10;

/** Maximum length per field (set as `maxLength` and re-applied after paste/autofill). */
const LIMITS: Partial<Record<keyof Fields, number>> = {
  firstName: 40,
  lastName: 40,
  workEmail: 254,
  phone: 20,
  role: 60,
  orgName: 100,
  scale: 60,
  discuss: 1000,
};

const squash = (s: string) => s.replace(/^\s+/, '').replace(/ {2,}/g, ' ');

/**
 * Applied on every change, so typing, pasting and browser autofill can never put a disallowed character in the field.
 *  names: letters, spaces, apostrophe, dot, hyphen · role: letters plus . - / & · org: also digits and ( ) ,
 *  phone: digits, spaces, hyphen, one leading "+" · email: no whitespace · free text: no angle brackets.
 */
const SANITIZE: Partial<Record<keyof Fields, (v: string) => string>> = {
  firstName: (v) => squash(v.replace(/[^\p{L}\p{M}\s'.-]/gu, '')),
  lastName: (v) => squash(v.replace(/[^\p{L}\p{M}\s'.-]/gu, '')),
  role: (v) => squash(v.replace(/[^\p{L}\p{M}\s.\-/&]/gu, '')),
  orgName: (v) => squash(v.replace(/[^\p{L}\p{M}\p{N}\s&.,'()/-]/gu, '')),
  phone: (v) => squash(v.replace(/[^\d+\s-]/g, '').replace(/(?!^)\+/g, '')),
  workEmail: (v) => v.replace(/\s/g, ''),
  scale: (v) => squash(v.replace(/[<>]/g, '').replace(/[\u0000-\u001F\u007F]/g, '')),
  discuss: (v) =>
    v
      .replace(/[<>]/g, '')
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
      .replace(/^\s+/, ''),
};

/** Collapse repeated spaces and line breaks before sending, so the inbox gets clean values. */
const tidy = (v: string) => v.trim().replace(/\s+/g, ' ');

function validate(v: Fields): Errors {
  const e: Errors = {};
  const letters = (x: string) => (x.match(/\p{L}/gu) || []).length;

  if (letters(v.firstName) < 1) e.firstName = 'Please enter your first name.';
  if (letters(v.lastName) < 1) e.lastName = 'Please enter your last name.';

  const email = v.workEmail.trim();
  if (!email) e.workEmail = 'Please enter your work email.';
  else if (
    email.length > (LIMITS.workEmail ?? 254) ||
    email.includes('..') ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
  )
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

/**
 * Web3Forms pipeline shared with the GCC page, so leads land in the inbox you already monitor.
 * Set VITE_WEB3FORMS_ACCESS_KEY to route a partner's leads to a separate Web3Forms account.
 */
const WEB3FORMS_ACCESS_KEY =
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'ab9fd6a8-a8de-4f28-ba11-f6d95387e932';

export async function submitEnquiry(payload: EnquiryPayload): Promise<void> {
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
      [payload.choiceLabel.toLowerCase()]: payload.choice || '—',
      scale: payload.scale || '—',
      message: payload.message || '—',
      source_page: payload.sourcePath,
    }),
  });
  const data = (await res.json()) as { success?: boolean };
  if (!res.ok || !data.success) throw new Error(`Enquiry failed with status ${res.status}`);
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
 * Rendered through a portal into document.body so a transformed ancestor (Layout / page transitions) can never turn
 * `position: fixed` into "fixed to that ancestor". aria-hidden: the form's live region announces the same message.
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

interface TextFieldOptions {
  label: string;
  placeholder?: string;
  autoComplete?: string;
  type?: 'text' | 'email' | 'tel';
  name?: string;
  required?: boolean;
  optional?: boolean;
}

interface EnquiryFormProps {
  vendorName: string;
  vendorSlug: string;
  path: string;
  fallbackEmail: string;
  copy: EnquiryCopy;
  preset: ChoicePreset | null;
}

function EnquiryForm({ vendorName, vendorSlug, path, fallbackEmail, copy, preset }: EnquiryFormProps) {
  const [values, setValues] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);

  // A card elsewhere on the page picks a choice; every click applies, even a repeat of the same card.
  useEffect(() => {
    if (preset && copy.choices.includes(preset.value)) {
      setValues((v) => ({ ...v, choice: preset.value }));
    }
  }, [preset, copy.choices]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

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
    const limit = LIMITS[key];
    let next = SANITIZE[key] ? SANITIZE[key]!(ev.target.value) : ev.target.value;
    if (limit) next = next.slice(0, limit);
    setValues((v) => ({ ...v, [key]: next }));
    // Clear a field's error as soon as the visitor edits it.
    setErrors((e) => (e[key as RequiredField] ? { ...e, [key]: undefined } : e));
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
      await submitEnquiry({
        firstName: tidy(values.firstName),
        lastName: tidy(values.lastName),
        email: values.workEmail.trim().toLowerCase(),
        phone: tidy(values.phone),
        role: tidy(values.role),
        company: tidy(values.orgName),
        choice: values.choice,
        choiceLabel: copy.choiceLabel,
        scale: tidy(values.scale),
        message: values.discuss.trim(),
        vendor: vendorName,
        sourcePath: path,
      });
      trackEvent('enquiry_submit', { vendor: vendorSlug, choice: values.choice || 'unspecified' });
      setValues(EMPTY);
      setErrors({});
      showToast('Message sent. We’ll be in touch soon.');
    } catch {
      setFailed(true);
      showToast('Something went wrong. Please try again.', true);
      trackEvent('enquiry_error', { vendor: vendorSlug });
    } finally {
      setBusy(false);
    }
  }

  /** A plain function (not a component), so inputs keep focus between keystrokes. */
  const textField = (field: keyof Fields, o: TextFieldOptions) => {
    const id = `enq-${field}`;
    const error = errors[field as RequiredField];
    const isEmail = o.type === 'email';
    return (
      <Field id={id} label={o.label} required={o.required} optional={o.optional} error={error}>
        <input
          id={id}
          name={o.name ?? field}
          type={o.type ?? 'text'}
          inputMode={isEmail ? 'email' : o.type === 'tel' ? 'tel' : undefined}
          autoComplete={o.autoComplete}
          autoCapitalize={isEmail ? 'none' : undefined}
          spellCheck={isEmail ? false : undefined}
          placeholder={o.placeholder}
          value={values[field]}
          onChange={set(field)}
          maxLength={LIMITS[field]}
          disabled={busy}
          aria-required={o.required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={INPUT}
        />
      </Field>
    );
  };

  const discussOver = values.discuss.length >= (LIMITS.discuss ?? 1000) * 0.9;

  return (
    <>
      {/* Persistent live region: it exists before the message changes, so screen readers actually announce it. */}
      <p aria-live="polite" className="sr-only">
        {toast && toastVisible ? toast.message : ''}
      </p>

      <form onSubmit={handleSubmit} noValidate className="relative grid gap-5 p-6 sm:grid-cols-2 md:p-12">
        {textField('firstName', { label: 'First name', placeholder: 'Enter your first name', autoComplete: 'given-name', required: true })}
        {textField('lastName', { label: 'Last name', placeholder: 'Enter your last name', autoComplete: 'family-name', required: true })}
        {textField('workEmail', { label: 'Work email', placeholder: 'name@company.com', autoComplete: 'email', type: 'email', name: 'email', required: true })}
        {textField('phone', { label: 'Phone', placeholder: 'e.g. +91 98765 43210', autoComplete: 'tel', type: 'tel', required: true })}
        {textField('role', { label: 'Your role', placeholder: 'Enter your role', autoComplete: 'organization-title', required: true })}
        {textField('orgName', { label: 'Organisation name', placeholder: 'Enter your organisation name', autoComplete: 'organization', name: 'company', required: true })}

        <Field id="enq-choice" label={copy.choiceLabel} optional>
          <div className="relative">
            <select
              id="enq-choice"
              name="choice"
              value={values.choice}
              onChange={set('choice')}
              disabled={busy}
              className={cx(INPUT, 'appearance-none pr-10')}
            >
              <option value="">{copy.choicePlaceholder}</option>
              {copy.choices.map((c) => (
                <option key={c} value={c}>
                  {c}
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
        {textField('scale', { label: copy.scaleLabel, placeholder: copy.scalePlaceholder, optional: true })}

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
                discussOver ? 'font-semibold text-[#B72A20]' : 'text-[#141414]/65',
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
            placeholder={copy.messagePlaceholder}
            aria-required="true"
            aria-invalid={errors.discuss ? true : undefined}
            aria-describedby={cx(errors.discuss && 'enq-discuss-error', 'enq-discuss-count')}
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
              We couldn’t send your enquiry. Please try again or email {fallbackEmail}.
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <button
              type="submit"
              disabled={busy}
              aria-busy={busy || undefined}
              className={buttonClass('primary', 'w-full sm:w-auto')}
            >
              {busy ? 'Sending…' : copy.submitLabel}
            </button>
            <p className="max-w-sm text-[13px] leading-relaxed text-[#141414]/70">
              We use these details only to respond to your enquiry. See our{' '}
              <SmartLink href={copy.privacyHref} className="font-semibold underline underline-offset-2 hover:text-[#B72A20]">
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

export function EnquirySection({
  vendorName,
  vendorSlug,
  path,
  contact,
  copy,
  preset,
}: {
  vendorName: string;
  vendorSlug: string;
  path: string;
  contact: { email: string; phone: string };
  copy: EnquiryCopy;
  preset: ChoicePreset | null;
}) {
  return (
    <Band id="enquiry" labelledBy="enquiry-title" className="pb-20 md:pb-28">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Colour and dots are layers INSIDE the clipped wrapper, so the rounded edge is clipped once and no red fringe shows. */}
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
              {copy.heading}
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white md:text-[16px]">{copy.text}</p>
          </div>

          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/40 pt-6 text-[15px] font-medium">
            <a
              className={cx('inline-block py-1 underline underline-offset-4', FOCUS)}
              href={`mailto:${contact.email}`}
              onClick={() => trackEvent('contact_click', { channel: 'email', location: 'enquiry' })}
            >
              {contact.email}
            </a>
            <span aria-hidden="true" className="hidden h-4 w-px bg-white/60 sm:block" />
            <a
              className={cx('inline-block py-1 underline underline-offset-4', FOCUS)}
              href={`tel:${contact.phone.replace(/\s/g, '')}`}
              onClick={() => trackEvent('contact_click', { channel: 'phone', location: 'enquiry' })}
            >
              {contact.phone}
            </a>
          </p>
        </div>

        <div className="relative rounded-[24px] bg-[#FFFFFF] text-[#141414]">
          <EnquiryForm
            vendorName={vendorName}
            vendorSlug={vendorSlug}
            path={path}
            fallbackEmail={contact.email}
            copy={copy}
            preset={preset}
          />
        </div>
      </div>
    </Band>
  );
}

/* =============================================================================
 * STYLES — render <PartnerStyles /> once per page
 * ========================================================================== */

const PARTNER_CSS = `
.sv-root { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif; }

/* Native <details> marker off: we draw our own. */
.sv-faq > summary { list-style: none; }
.sv-faq > summary::-webkit-details-marker { display: none; }

@media (prefers-reduced-motion: reduce) {
  .sv-anim, .sv-anim * { transition: none !important; animation: none !important; }
}
`;

export function PartnerStyles() {
  return <style dangerouslySetInnerHTML={{ __html: PARTNER_CSS }} />;
}