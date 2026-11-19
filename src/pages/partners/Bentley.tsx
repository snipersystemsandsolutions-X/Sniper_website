import { Layout } from '@/components/Layout';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, TouchEvent } from 'react';
import dottedOverlay from '@/assets/dotted_card.png';
/* Keep the folder name's capitalisation identical in every import below. Windows and macOS ignore case, but Vercel
   (Linux) does not, so "Bentley" in one line and "bentley" in another breaks the production build. */
/* Partnership banner: one finished image (handshake photo with both logos already in it). */
import handshakePhoto from '@/assets/Bentley/bentley_handshake.webp';
import slideArchitecture from '@/assets/Bentley/bentley_carousel_one.webp';
import slideInfrastructure from '@/assets/Bentley/bentley_carousel_two.webp';
import slideGeospatial from '@/assets/Bentley/bentley_carousel_three.webp';
import slideAssets from '@/assets/Bentley/bentley_carousel_two.webp';
import sectorIndustrial from '@/assets/Bentley/industries.webp';
import sectorWater from '@/assets/Bentley/water_infra.webp';
import sectorEnergy from '@/assets/Bentley/Energy.webp';
import sectorMining from '@/assets/Bentley/mining.webp';
import sectorTransport from '@/assets/Bentley/transportation.webp';
import sectorCities from '@/assets/Bentley/government.webp';
/* TEMPORARY: all six solution photos use the carousel image. Swap each for its own 3:2 photo (~1600px wide) when ready. */
import solutionIndustrial from '@/assets/Bentley/bentley_carousel_one.webp';
import solutionGeospatial from '@/assets/Bentley/bentley_carousel_one.webp';
import solutionArchitectural from '@/assets/Bentley/bentley_carousel_one.webp';
import solutionUtility from '@/assets/Bentley/bentley_carousel_one.webp';
import solutionCivil from '@/assets/Bentley/bentley_carousel_one.webp';
import solutionTwin from '@/assets/Bentley/bentley_carousel_one.webp';
/* The runtime import and the type import MUST point at the same file (the filename's case must match exactly). */
import {
  Arrow,
  Breadcrumb,
  EnquirySection,
  FAQAccordion,
  PRIVACY_PATH,
  PartnerHero,
  PartnerStyles,
  ProcessSteps,
  RelatedSolutions,
  SITE_CONTAINER,
  SITE_URL,
  SeoHead,
  cx,
  trackEvent,
} from '../../components/PartnerKit';
import type {
  ChoicePreset,
  Crumb,
  EnquiryCopy,
  Faq,
  LinkItem,
  PageMeta,
  ProcessStep,
  RelatedLink,
  TrustPoint,
} from '../../components/PartnerKit';

/**
 * Bentley Systems partner landing page.   Route: /partners/bentley/
 *
 * Built on partnerKit (shared SEO head, buttons, form, FAQ, trust, process, related). This file holds only what is
 * unique to Bentley: the content, the hero carousel and the sector cards.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * RESPONSIVE SYSTEM (what "dynamic to the viewport" means here)
 *  - Container: 16px side gutter on phones, up to 48px on desktops, content capped near 1600px (wider on 2200px+ screens).
 *  - Type, buttons, section gaps, carousel text and card sizes all use clamp(), so they scale smoothly with the screen
 *    instead of jumping at breakpoints.
 *  - Cards size to their content (min-height, not a fixed height), so larger text, browser zoom or long titles can never
 *    collide with the artwork.
 *  - Scrollbars are never hidden. The phone swipe row keeps a thin visible scrollbar, and the kit reserves the page
 *    scrollbar's space (scrollbar-gutter) so nothing shifts sideways when it appears or disappears.
 *
 * CAROUSEL TEXT
 *  - Best practice: export photos WITHOUT text and let the page draw the headline. It stays sharp, scales per device,
 *    is translatable, and search engines can read it.
 *  - If a photo already has text baked in, set `textInImage: true` on that slide. The page then skips its own headline
 *    (no double text) but still keeps the copy in the page for screen readers and search engines.
 *
 * CAROUSEL
 *  - Auto-advances every AUTOPLAY_MS. It pauses on hover, keyboard focus and when the visitor presses the pause button,
 *    and it never auto-plays for people who ask their device for reduced motion (WCAG 2.2.2).
 *
 * SECTOR CARDS (follow the Figma: 3 columns, 16px gaps, 3:2 cards)
 *  - Idle: warm grey card (#D3CDC3) with a faint dot texture. The art is as wide as the card and sits on the bottom edge.
 *  - Hover / focus / press: a red (#DD372B) layer with your dotted texture wipes up, the art stays on top through
 *    mix-blend-multiply, and the descriptor and arrow appear. White on #DD372B is about 4.5:1.
 *  - Touch screens have no hover, so the descriptor is always visible there and a tap never leaves a card stuck red.
 *  - Art must be black halftone on a WHITE or TRANSPARENT background (multiply needs that).
 *
 * BEFORE PUBLISHING
 *  [ ] Title, description, FAQs, process steps and carousel copy are DRAFTS: replace with the SEO person's final copy
 *  [ ] Sector descriptors and carousel claims are approved by Bentley's channel marketing
 *  [ ] Trust figures match the other partner pages and have approvals on file
 *  [ ] OG image exists at META.ogImage; related-page URLs exist
 *  [ ] Layout.tsx renders the single <main> landmark; React >= 18.3 for fetchPriority
 *  [ ] SOLUTIONS copy and the "Why Sniper" checklist card are DRAFTS: confirm with Bentley channel marketing
 *  [ ] Page width: tune PAGE_MAX / PAGE_GUTTER once (see "PAGE WIDTH"). Check the Layout header lines up at 1440, 1920 and 2560px
 * ─────────────────────────────────────────────────────────────────────────────
 */

/* =============================================================================
 * CONTENT
 * ========================================================================== */

interface ImageAsset {
  src: string;
  width: number;
  height: number;
}
interface Slide {
  id: string;
  title: string;
  text: string;
  image: ImageAsset;
  /** True when the photo already has its headline baked in. The page then skips its own text overlay. */
  textInImage?: boolean;
}
interface Solution {
  id: string;
  title: string;
  text: string;
  image: ImageAsset;
}
interface TextPart {
  text: string;
  /** Dark, full-strength text. Parts without it are muted. */
  strong?: boolean;
}
interface Sector {
  id: string;
  title: string;
  text: string;
  image: ImageAsset;
}

/** Set to the real export size of your art, so the browser can reserve the space before the image loads. */
const SECTOR_ART = { width: 1560, height: 1040 } as const;
const SOLUTION_ART = { width: 1560, height: 1040 } as const;
const SLIDE_ART = { width: 1600, height: 650 } as const;

const META: PageMeta = {
  title: 'Bentley Systems Software in India | Sniper Systems',
  shortTitle: 'Bentley Systems Software in India',
  description:
    'Explore Bentley software for infrastructure engineering, geospatial and asset work. Sniper Systems is an Official Bentley Channel Partner in India.',
  path: '/partners/bentley/',
  keywords: [
    'Bentley Systems India',
    'Bentley software India',
    'Official Bentley Channel Partner India',
    'infrastructure engineering software India',
    'civil engineering software India',
    'geospatial software India',
    'reality modelling software',
    'Bentley software licensing India',
  ],
  ogImage: `${SITE_URL}images/bentley-systems-software.jpg`,
  ogImageAlt: 'Bentley Systems software and engineering solutions in India',
};

const BREADCRUMB: Crumb[] = [
  { label: 'Home', href: '/' },
  { label: 'Partners', href: '/partners/' },
  { label: 'Bentley Systems' },
];

const CONTACT = { email: 'enquiry@sniperindia.com', phone: '+91 89393 01100' } as const;

const HERO = {
  h1: 'Bentley Systems software & engineering solutions in India',
  lead: 'Capture reality, model terrain and manage land records on one connected stack. We help infrastructure, utility and government teams put it to work.',
  primaryCta: { label: 'Enquire now', href: '#enquiry' } satisfies LinkItem,
  secondaryCta: { label: 'Explore Bentley solutions', href: '#sectors' } satisfies LinkItem,
};

/** Partnership section copy. `heading` is a list of pieces: `strong: true` pieces are dark, the rest are muted grey. */
const PARTNERSHIP = {
  heading: [
    { text: 'As an Official channel partner for ' },
    { text: 'Bentley, Sniper systems & solutions ', strong: true },
    { text: 'helps organisations explore Bentley’s engineering software portfolio for their project and business requirement' },
  ],
  side: 'Connect with our team to discuss Bentley software options, licensing requirements and product availability for your organisation.',
  cta: { label: 'Talk to our team', href: '#enquiry' } satisfies LinkItem,
  imageAlt: 'Bentley and Sniper Systems & Solutions partnership: a handshake between two business partners',
};

/** All four photos now have their own text, so every slide is flagged `textInImage` (the page draws no headline over them,
 *  but keeps the title and text for screen readers and search engines). */
const SLIDES: Slide[] = [
  {
    id: 'architecture',
    title: 'Architectural solutions provided through Bentley',
    text: 'Capture reality, model terrain and manage land records on one connected stack.',
    image: { src: slideArchitecture, ...SLIDE_ART },
    textInImage: true,
  },
  {
    id: 'infrastructure',
    title: 'Civil and infrastructure engineering through Bentley',
    text: 'Design and deliver roads, rail, bridges and utilities with connected project data.',
    image: { src: slideInfrastructure, ...SLIDE_ART },
    textInImage: true,
  },
  {
    id: 'geospatial',
    title: 'Geospatial and reality modelling through Bentley',
    text: 'Turn survey, drone and scan data into accurate terrain and site models.',
    image: { src: slideGeospatial, ...SLIDE_ART },
    textInImage: true,
  },
  {
    id: 'assets',
    title: 'Asset performance and operations through Bentley',
    text: 'Keep infrastructure data connected from design through operations.',
    image: { src: slideAssets, ...SLIDE_ART },
    textInImage: true,
  },
];

/** Names are sentence case and unique (the old set had "Industrial solutions" twice). */
const SECTORS = {
  heading: 'Bentley Systems capabilities for modern businesses',
  items: [
    {
      id: 'industrial',
      title: 'Industrial solutions',
      text: 'Design, model and operate process plants with connected engineering data.',
      image: { src: sectorIndustrial, ...SECTOR_ART },
    },
    {
      id: 'water',
      title: 'Water infrastructure',
      text: 'Plan, model and maintain water networks, dams and treatment facilities.',
      image: { src: sectorWater, ...SECTOR_ART },
    },
    {
      id: 'energy',
      title: 'Energy and utilities',
      text: 'Engineer grids, generation and renewable assets with connected project data.',
      image: { src: sectorEnergy, ...SECTOR_ART },
    },
    {
      id: 'mining',
      title: 'Mining and geotechnical engineering',
      text: 'Model subsurface conditions for safer, better-planned excavation.',
      image: { src: sectorMining, ...SECTOR_ART },
    },
    {
      id: 'transport',
      title: 'Transportation',
      text: 'Design and manage roads, rail, bridges and transit from concept to upkeep.',
      image: { src: sectorTransport, ...SECTOR_ART },
    },
    {
      id: 'cities',
      title: 'Cities and government',
      text: 'Support planning, public works and land records with digital twins.',
      image: { src: sectorCities, ...SECTOR_ART },
    },
  ] satisfies Sector[],
};

/** DRAFT copy: confirm with Bentley channel marketing. Photos are 3:2. */
const SOLUTIONS: { heading: string; items: Solution[] } = {
  heading: 'Engineering software for infrastructure, design and construction',
  items: [
    { id: 'industrial', title: 'Industrial solutions', text: 'Design, model and operate process plants and industrial facilities with connected engineering data.', image: { src: solutionIndustrial, ...SOLUTION_ART } },
    { id: 'geospatial', title: 'Geospatial solutions', text: 'Turn survey, drone and scan data into reality models and live site dashboards.', image: { src: solutionGeospatial, ...SOLUTION_ART } },
    { id: 'architectural', title: 'Architectural solutions', text: 'Design, coordinate and deliver buildings from concept to construction in one connected model.', image: { src: solutionArchitectural, ...SOLUTION_ART } },
    { id: 'utility', title: 'Utility network solutions', text: 'Plan, map and maintain power, water and telecom networks across cities and corridors.', image: { src: solutionUtility, ...SOLUTION_ART } },
    { id: 'civil', title: 'Civil and transport solutions', text: 'Design and deliver roads, rail, bridges and tunnels with connected project data.', image: { src: solutionCivil, ...SOLUTION_ART } },
    { id: 'twin', title: 'Digital twin solutions', text: 'Keep design, construction and operations data connected in a living model of your asset.', image: { src: solutionTwin, ...SOLUTION_ART } },
  ],
};

/** "Why choose Sniper": the figures are the same Sniper numbers used on the other partner pages (approvals on file). */
const WHY: {
  heading: string;
  statement: TextPart[];
  stats: TrustPoint[];
  card: { title: string; text: string; cta: LinkItem };
} = {
  heading: 'Why choose Sniper for Bentley software',
  statement: [
    { text: 'For teams that design roads and rail, maintain utility networks, run land records and plan cities. ' },
    { text: 'Bentley’s tools ', strong: true },
    { text: 'turn what you capture on site into data everyone can use.' },
  ],
  stats: [
    { value: '2600', suffix: '+', label: 'Happy clients in India', text: 'Infrastructure, security and networking customers supported across the country.' },
    { value: '17', suffix: '+', label: 'Years of proven track record', text: 'Planning, deploying and supporting reliable technology for organisations in India.' },
    { value: '99', suffix: '%', label: 'Uptime partner', text: 'Dependable service availability across supported environments.' },
  ],
  /* DRAFT: replace with the real download, or delete the card. */
  card: {
    title: 'Bentley Systems geospatial checklist',
    text: 'Share your project type and team size and we’ll send the matching Bentley software and licensing options.',
    cta: { label: 'Request catalogue', href: '#enquiry' },
  },
};

/** DRAFT steps: replace with the final workflow copy. */
const PROCESS: { heading: string; steps: ProcessStep[] } = {
  heading: 'How the engagement works',
  steps: [
    { title: 'Understand', text: 'Review your engineering workflows and project needs.' },
    { title: 'Match', text: 'Map those needs to suitable Bentley software.' },
    { title: 'License', text: 'Align licensing and commercial terms.' },
    { title: 'Onboard', text: 'Plan deployment and training, where offered.' },
    { title: 'Support', text: 'Plan ongoing support and renewals, where offered.' },
  ],
};

/** DRAFT FAQs: replace with the final copy. The FAQPage JSON-LD is built from this list automatically. */
const FAQS: { heading: string; accents: string[]; items: Faq[] } = {
  heading: 'Bentley software FAQs',
  accents: ['Bentley'],
  items: [
    {
      q: 'What is Bentley Systems software used for?',
      a: 'Bentley Systems provides software for designing, building and operating infrastructure, from roads, rail and bridges to utilities, plants and mines. The right products depend on your discipline and project type.',
    },
    {
      q: 'Is Sniper Systems an authorised Bentley partner?',
      a: 'Yes. Sniper Systems is an Official Bentley Channel Partner in India.',
    },
    {
      q: 'Which industries can use Bentley software?',
      a: 'This page covers industrial plants, water infrastructure, energy and utilities, mining and geotechnical engineering, transportation, and cities and government.',
    },
    {
      q: 'How is Bentley software licensed?',
      a: 'Licensing and subscription terms vary by product, number of users and usage. Confirm the applicable terms for your configuration before purchasing.',
    },
    {
      q: 'How can I request a quotation?',
      a: 'Share your organisation, the sector you work in and your approximate team size through the enquiry form, and our team will follow up.',
    },
  ],
};

const RELATED: { heading: string; items: RelatedLink[] } = {
  heading: 'Related solutions',
  items: [
    { label: 'Technology partners', text: 'See every vendor Sniper works with.', href: '/partners/' },
    { label: 'Enterprise networking', text: 'Campus networks, SD-WAN and wireless from Sniper Systems.', href: '/solutions/networking-solutions' },
    { label: 'Managed IT services', text: 'Monitoring, support and lifecycle management after rollout.', href: '/solutions/managed-it-services' },
  ],
};

const ENQUIRY: EnquiryCopy = {
  heading: 'Talk to Sniper about Bentley software',
  text: 'Tell us your sector, project type and team size. We’ll help you match suitable Bentley software and plan the next steps.',
  submitLabel: 'Send enquiry',
  privacyHref: PRIVACY_PATH,
  choiceLabel: 'Industry',
  choicePlaceholder: 'Select an industry',
  choices: [...SECTORS.items.map((s) => s.title), 'Not sure yet'],
  scaleLabel: 'Team or project size',
  scalePlaceholder: 'e.g. 25 engineers, 3 projects',
  messagePlaceholder: 'Current tools, project types, timeline, any Bentley products you have in mind',
};

/* =============================================================================
 * PAGE WIDTH: ONE SOURCE OF TRUTH
 * Every section on this page (the ones in this file AND the partnerKit ones: breadcrumb, hero, process, FAQ, related,
 * enquiry) sits in SITE_CONTAINER. PageWidth below sets that container's width ONCE, so left and right edges line up
 * everywhere. Change PAGE_MAX / PAGE_GUTTER here and the whole page follows.
 *  - PAGE_MAX    = widest the CONTENT may get (1600px, the same as the kit's old 1600px). Beyond that the page centres.
 *  - PAGE_GUTTER = side space, fluid: 16px on phones up to 64px on big screens. It is the same --gutter the swipe row uses.
 * No section uses 100vw, so the page never gets a sideways scrollbar and the vertical one is never covered.
 * (The site header lives in Layout.tsx and has its own container: give it the same max-width to line it up as well.)
 * ========================================================================== */

const PAGE_MAX = '100rem';
const PAGE_GUTTER = 'clamp(1rem, 0.5rem + 2.6vw, 4rem)';
const WIDE = SITE_CONTAINER;

/* Turns "!max-w-[120rem]" style Tailwind classes into a safe CSS class selector. */
const escapeClass = (c: string) => c.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
const CONTAINER_SELECTOR = SITE_CONTAINER.split(/\s+/).filter(Boolean).map((c) => '.' + escapeClass(c)).join('');
/* The container's whole box is defined here (not just max-width), so the result does not depend on how the kit built it:
   border-box, full width up to the cap, centred, with the gutter as side padding. */
const PAGE_WIDTH_CSS =
  `.sv-root.sv-root,${CONTAINER_SELECTOR}{--gutter:${PAGE_GUTTER}}` +
  `${CONTAINER_SELECTOR}{box-sizing:border-box !important;width:100% !important;margin-left:auto !important;margin-right:auto !important;` +
  `padding-left:var(--gutter) !important;padding-right:var(--gutter) !important;max-width:calc(${PAGE_MAX} + 2 * var(--gutter)) !important}`;

function PageWidth() {
  return <style dangerouslySetInnerHTML={{ __html: PAGE_WIDTH_CSS }} />;
}

/** ONE weight for every heading and title on the page. Set it to match the h1 inside PartnerHero. */
const HEADING_WEIGHT = 'font-semibold';
const SECTION_PAD = 'py-[clamp(2.5rem,1.25rem_+_4vw,6rem)]';
const H2_WIDE = cx('text-balance text-[clamp(1.75rem,1.1rem_+_1.8vw,3rem)] leading-[1.06] tracking-tighter text-[#141414]', HEADING_WEIGHT);
const GRID_GAP = 'gap-[clamp(0.75rem,0.5rem_+_0.6vw,1.25rem)]';

/* =============================================================================
 * HERO CAROUSEL
 * Accessible: labelled region, one live slide at a time, previous / next / dot buttons, arrow keys, swipe.
 * No autoplay on purpose (WCAG 2.2.2: moving content needs a pause control). Only the first photo is high priority.
 * ========================================================================== */

/** Time each slide stays on screen before the carousel moves on. */
const AUTOPLAY_MS = 5000;

const CAROUSEL_BTN =
  'sv-anim flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#141414] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC3327]';

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d={dir === 'left' ? 'm10 3-5 5 5 5' : 'm6 3 5 5-5 5'} />
    </svg>
  );
}

function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const count = slides.length;
  const [paused, setPaused] = useState(false); // the visitor pressed pause
  const [hold, setHold] = useState(false); // mouse is over the banner, or focus is inside it
  const [reduced, setReduced] = useState(false); // device asks for reduced motion

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const playing = !paused && !reduced && count > 1;
  // The timer restarts after every slide change (including manual ones), so a click never gets cut short.
  useEffect(() => {
    if (!playing || hold) return;
    const t = window.setTimeout(() => go(index + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [playing, hold, index, go]);

  const onKeyDown = (ev: KeyboardEvent<HTMLElement>) => {
    if (ev.key === 'ArrowRight') go(index + 1);
    else if (ev.key === 'ArrowLeft') go(index - 1);
  };
  const onTouchStart = (ev: TouchEvent<HTMLElement>) => {
    touchStartX.current = ev.touches[0].clientX;
  };
  const onTouchEnd = (ev: TouchEvent<HTMLElement>) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start === null) return;
    const dx = ev.changedTouches[0].clientX - start;
    if (Math.abs(dx) > 48) go(index + (dx < 0 ? 1 : -1));
  };

  return (
    <section aria-roledescription="carousel" aria-label="Bentley solutions highlights">
      <div className={cx(WIDE, 'pt-[clamp(1.5rem,1rem_+_1.6vw,2.75rem)]')}>
        {/* touch-pan-y: vertical page scrolling keeps working while a horizontal swipe changes the slide.
            max-h: on a short browser window the banner never grows taller than the screen. */}
        <div
          onKeyDown={onKeyDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onMouseEnter={() => setHold(true)}
          onMouseLeave={() => setHold(false)}
          onFocus={() => setHold(true)}
          onBlur={() => setHold(false)}
          className="relative isolate h-[28rem] max-h-[min(46rem,88vh)] touch-pan-y overflow-hidden rounded-[24px] bg-[#27384A] sm:h-auto sm:aspect-[16/7] lg:aspect-[2.46/1]"
        >
          <div aria-live={playing && !hold ? 'off' : 'polite'}>
            {slides.map((s, i) => {
              const active = i === index;
              // Only the first slide is a real heading, so the page keeps a clean outline for search engines.
              const Title = i === 0 ? 'h2' : 'p';
              return (
                <div
                  key={s.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}`}
                  aria-hidden={!active}
                  className={cx(
                    'sv-anim absolute inset-0 transition-opacity duration-500',
                    active ? 'opacity-100' : 'pointer-events-none opacity-0',
                  )}
                >
                  <img
                    src={s.image.src}
                    width={s.image.width}
                    height={s.image.height}
                    alt=""
                    loading={i === 0 ? 'eager' : 'lazy'}
                    fetchPriority={i === 0 ? 'high' : 'auto'}
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  {s.textInImage ? (
                    /* The photo already shows this text: keep it for screen readers and search engines only. */
                    <div className="sr-only">
                      <Title>{s.title}</Title>
                      <p>{s.text}</p>
                    </div>
                  ) : (
                    <>
                      {/* Keeps the white text readable over bright clouds. */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent max-md:from-black/60 max-md:via-black/35"
                      />
                      <div className="relative p-[clamp(1.25rem,0.5rem_+_3vw,4rem)]">
                        <Title className="max-w-[40rem] text-balance text-[clamp(1.5rem,1rem_+_2.2vw,3.25rem)] font-semibold leading-[1.1] tracking-tighter text-white">
                          {s.title}
                        </Title>
                        <p className="mt-3 max-w-[34rem] text-[clamp(0.9375rem,0.85rem_+_0.4vw,1.25rem)] leading-relaxed text-white md:mt-5">
                          {s.text}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 md:bottom-6">
            <button type="button" onClick={() => go(index - 1)} aria-label="Previous slide" className={CAROUSEL_BTN}>
              <Chevron dir="left" />
            </button>
            <div role="group" aria-label="Choose a slide" className="flex items-center rounded-full bg-white/90 px-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index ? 'true' : undefined}
                  className="flex h-9 w-5 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#DC3327]"
                >
                  <span
                    aria-hidden="true"
                    className={cx(
                      'sv-anim block rounded-full bg-[#141414] transition-all duration-200',
                      i === index ? 'h-2 w-2' : 'h-1.5 w-1.5 opacity-40',
                    )}
                  />
                </button>
              ))}
            </div>
            <button type="button" onClick={() => go(index + 1)} aria-label="Next slide" className={CAROUSEL_BTN}>
              <Chevron dir="right" />
            </button>
            {/* Pause / play: required for moving content. Hidden when the device already asks for reduced motion. */}
            {!reduced && count > 1 && (
              <button
                type="button"
                onClick={() => setPaused((v) => !v)}
                aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
                className={cx(CAROUSEL_BTN, 'ml-1')}
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                  {paused ? <path d="M4.5 2.5v11l9-5.5z" /> : <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" />}
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============================================================================
 * PARTNERSHIP SECTION
 * Sits right after the carousel. Left: the statement. Right: a short next-step panel with a button.
 * Below: the finished banner image (logos are part of the image, so there is no overlay and nothing is blurred by code).
 * Desktop and tablet show the image at its natural ratio. On phones it is cropped to 2.4:1 (logos stay fully visible),
 * which makes it taller and easier to see than the natural ratio would.
 * ========================================================================== */

const PartnershipSection = memo(function PartnershipSection() {
  const P = PARTNERSHIP;
  return (
    <section aria-labelledby="partnership-title" id="partnership" className="scroll-mt-24">
      <div className={cx(WIDE, SECTION_PAD)}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-[clamp(2rem,1rem_+_4vw,6rem)]">
          <h2
            id="partnership-title"
            className={cx('max-w-[64rem] text-balance text-[clamp(1.5rem,1rem_+_1.5vw,2.75rem)] leading-[1.1] tracking-tighter', HEADING_WEIGHT)}
          >
            {P.heading.map((part, i) => (
              <span key={i} className={'strong' in part && part.strong ? 'text-[#141414]' : 'text-[#141414]/45'}>
                {part.text}
              </span>
            ))}
          </h2>

          <div className="flex flex-col items-start justify-center gap-6 lg:border-l lg:border-[#141414]/15 lg:pl-[clamp(1.5rem,1rem_+_2vw,4rem)]">
            <p className="max-w-[34rem] text-[clamp(0.9375rem,0.85rem_+_0.3vw,1.125rem)] leading-snug text-[#141414]">{P.side}</p>
            <a
              href={P.cta.href}
              className="sv-anim group inline-flex items-center gap-3 rounded-full bg-[#141414] py-1.5 pl-5 pr-1.5 text-[clamp(0.875rem,0.8rem_+_0.2vw,1rem)] font-medium text-white transition-colors duration-300 hover:bg-[#B72A20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC3327]"
            >
              {P.cta.label}
              <span
                aria-hidden="true"
                className="sv-anim flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#141414] transition-transform duration-300 group-hover:translate-x-0.5"
              >
                <Arrow />
              </span>
            </a>
          </div>
        </div>

        {/* Set width/height to the real pixel size of your exported banner so the page reserves the space (no layout jump). */}
        <img
          src={handshakePhoto}
          alt={P.imageAlt}
          width={1592}
          height={464}
          loading="lazy"
          decoding="async"
          className="mt-[clamp(1.5rem,1rem_+_2vw,3rem)] block h-auto w-full rounded-[24px] max-sm:aspect-[2.4/1] max-sm:object-cover"
        />
      </div>
    </section>
  );
});

/* =============================================================================
 * SECTOR CARDS
 * ========================================================================== */

/* Full class strings (never built dynamically), so Tailwind keeps them. */
const ON_RED_TEXT = '[@media(hover:hover)]:group-hover:text-white group-focus-visible:text-white group-active:text-white';
const ON_RED_BG = '[@media(hover:hover)]:group-hover:bg-white group-focus-visible:bg-white group-active:bg-white';
const WIPE_IN =
  '[@media(hover:hover)]:group-hover:translate-y-0 group-focus-visible:translate-y-0 group-active:translate-y-0';
const REVEAL_IN =
  '[@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:translate-x-0 [@media(hover:hover)]:group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 group-active:translate-x-0 group-active:translate-y-0 group-active:opacity-100';
const CARD_PAD = 'clamp(1rem,0.7rem_+_0.9vw,1.75rem)';
/* Faint light dots on the warm grey idle card (the Figma has the same texture). */
const IDLE_DOTS = {
  backgroundImage: 'radial-gradient(rgba(255,255,255,0.45) 1px, transparent 1.3px)',
  backgroundSize: '6px 6px',
} as const;

/**
 * Figma card: 3:2, warm grey, title top-left, art as wide as the card and sitting on the bottom edge (it may rise
 * behind the title, like the smoke in the design). The art is absolutely positioned, so it never changes the card size.
 * `min-h` keeps long titles from ever running out of room on narrow phones.
 * `isolate` is also the Safari fix that keeps rounded corners clipping the moving red layer.
 */
const SectorCard = memo(function SectorCard({
  sector,
  onSelect,
}: {
  sector: Sector;
  onSelect: (title: string) => void;
}) {
  return (
    <li className="flex w-[78%] shrink-0 snap-start sm:w-auto">
      <a
        href="#enquiry"
        onClick={() => onSelect(sector.title)}
        className="group relative isolate block aspect-[3/2] min-h-[11.5rem] w-full overflow-hidden rounded-[16px] bg-[#D3CDC3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC3327]"
      >
        {/* Idle dot texture */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={IDLE_DOTS} />

        {/* The red layer (with the dotted texture) wipes up from the bottom. */}
        <span
          aria-hidden="true"
          className={cx(
            'sv-anim pointer-events-none absolute inset-0 -z-10 translate-y-full bg-[#DD372B] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)]',
            WIPE_IN,
          )}
        >
          <img src={dottedOverlay} alt="" loading="lazy" decoding="async" className="h-full w-full select-none object-cover" />
        </span>

        {/* Idle signal: one small red dot. It turns white on the red state. */}
        <span
          aria-hidden="true"
          className={cx(
            'absolute right-[clamp(1rem,0.7rem_+_0.9vw,1.75rem)] top-[clamp(1rem,0.7rem_+_0.9vw,1.75rem)] z-10 h-2 w-2 rounded-full bg-[#DD372B] transition-colors duration-300',
            ON_RED_BG,
          )}
        />

        {/* Art: full card width, anchored to the bottom. */}
        <img
          src={sector.image.src}
          width={sector.image.width}
          height={sector.image.height}
          alt=""
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute bottom-0 left-0 h-auto w-full select-none mix-blend-multiply"
        />

        {/* Text sits above the art */}
        <span
          className="relative z-10 block pr-10"
          style={{ paddingLeft: CARD_PAD.replace(/_/g, ' '), paddingTop: CARD_PAD.replace(/_/g, ' ') }}
        >
          <span
            className={cx(
              'block text-[clamp(1.0625rem,0.9rem_+_0.6vw,1.5rem)] leading-[1.15] tracking-tight text-[#141414] transition-colors duration-300',
              HEADING_WEIGHT,
              ON_RED_TEXT,
            )}
          >
            <span className="sr-only">Enquire about </span>
            {sector.title}
          </span>
          <span
            className={cx(
              'sv-anim mt-1.5 block max-w-[85%] text-[clamp(0.8125rem,0.76rem_+_0.15vw,0.9375rem)] leading-snug text-[#141414]/75 transition-all duration-300',
              /* hover devices: hidden until the red state; touch devices: always visible in dark text */
              '[@media(hover:hover)]:translate-y-1.5 [@media(hover:hover)]:text-white [@media(hover:hover)]:opacity-0',
              ON_RED_TEXT,
              REVEAL_IN,
            )}
          >
            {sector.text}
          </span>
        </span>

        <span
          aria-hidden="true"
          className={cx(
            'sv-anim absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#141414] text-white transition-all duration-300',
            '[@media(hover:hover)]:-translate-x-1.5 [@media(hover:hover)]:bg-white [@media(hover:hover)]:text-[#DD372B] [@media(hover:hover)]:opacity-0',
            REVEAL_IN,
          )}
        >
          <Arrow />
        </span>
      </a>
    </li>
  );
});

const SectorSection = memo(function SectorSection({
  heading,
  items,
  onSelect,
}: {
  heading: string;
  items: Sector[];
  onSelect: (title: string) => void;
}) {
  return (
    <section id="sectors" aria-labelledby="sectors-title" className="scroll-mt-24">
      <div className={cx(WIDE, SECTION_PAD)}>
        <h2 id="sectors-title" className={cx(H2_WIDE, 'max-w-[60rem]')}>
          {heading}
        </h2>
        {/* Phones: a swipe row that bleeds to the screen edge (using the shared --gutter) with the next card peeking in,
            and a thin VISIBLE scrollbar (never hidden). sm and up: a 2, then 3 column grid. */}
        <ul
          className={cx(
            '-mx-[var(--gutter)] mt-8 flex snap-x snap-mandatory scroll-pl-[var(--gutter)] gap-3 overflow-x-auto px-[var(--gutter)] py-1 pb-3 [scrollbar-color:rgba(20,20,20,0.35)_transparent] [scrollbar-width:thin]',
            'sm:mx-0 sm:mt-10 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:py-0 sm:pb-0 md:mt-12 lg:grid-cols-3',
            GRID_GAP,
          )}
        >
          {items.map((s) => (
            <SectorCard key={s.id} sector={s} onSelect={onSelect} />
          ))}
        </ul>
      </div>
    </section>
  );
});

/* =============================================================================
 * SOLUTIONS (Figma: "Engineering software for infrastructure, design and construction")
 * 1 column on phones, 2 on tablets, 3 on desktop. The whole card is one link (stretched on the text link, so screen
 * readers hear a single control), the photo zooms gently on hover, and reduced-motion users get no zoom.
 * ========================================================================== */

const SolutionCard = memo(function SolutionCard({ item }: { item: Solution }) {
  return (
    <li className="group relative flex flex-col">
      <div className="aspect-[3/2] overflow-hidden rounded-[16px] bg-[#E4E4E8]">
        <img
          src={item.image.src}
          width={item.image.width}
          height={item.image.height}
          alt=""
          loading="lazy"
          decoding="async"
          className="sv-anim h-full w-full object-cover transition-transform duration-500 ease-out [@media(hover:hover)]:group-hover:scale-[1.04] motion-reduce:transform-none"
        />
      </div>
      <h3 className={cx('mt-4 text-[clamp(1.0625rem,0.95rem_+_0.4vw,1.375rem)] leading-tight tracking-tight', HEADING_WEIGHT)}>{item.title}</h3>
      <p className="mt-2 max-w-[40rem] text-[clamp(0.875rem,0.82rem_+_0.2vw,1rem)] leading-snug text-[#141414]/65">{item.text}</p>
      <a
        href="#enquiry"
        onClick={() => trackEvent('solution_click', { solution: item.title })}
        className="mt-4 inline-flex w-fit items-center gap-2 text-[clamp(0.75rem,0.72rem_+_0.15vw,0.875rem)] font-medium uppercase tracking-wide underline decoration-[#141414]/40 underline-offset-4 transition-colors duration-300 after:absolute after:inset-0 after:content-[''] hover:decoration-[#DD372B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#DC3327]"
      >
        Explore {item.title.toLowerCase()}
        <Chevron dir="right" />
      </a>
    </li>
  );
});

const SolutionsSection = memo(function SolutionsSection({ heading, items }: { heading: string; items: Solution[] }) {
  return (
    <section id="solutions" aria-labelledby="solutions-title" className="scroll-mt-24">
      <div className={cx(WIDE, SECTION_PAD, 'pt-0 sm:pt-0')}>
        <h2 id="solutions-title" className={cx(H2_WIDE, 'max-w-[60rem]')}>
          {heading}
        </h2>
        <ul
          className={cx(
            'mt-8 grid grid-cols-1 gap-y-[clamp(1.75rem,1.25rem_+_1.5vw,3rem)] sm:mt-10 sm:grid-cols-2 md:mt-12 lg:grid-cols-3',
            GRID_GAP,
          )}
        >
          {items.map((it) => (
            <SolutionCard key={it.id} item={it} />
          ))}
        </ul>
      </div>
    </section>
  );
});

/* =============================================================================
 * WHY CHOOSE SNIPER (Figma: dark statement + staggered figures + catalogue card)
 *  - Figures step down from left to right on desktop (--step). Below desktop they sit in a plain row / stack.
 *  - The dotted dome in the card is pure CSS (no image to load). Masks carry the -webkit- prefix for Safari.
 *  - Red on black: #DD372B is about 4.6:1 for big text, and the small red button text uses the lighter #FF5A4D (about 5.9:1).
 * ========================================================================== */

const STAGGER = ['', 'lg:mt-[var(--step)]', 'lg:mt-[calc(var(--step)*2)]'] as const;

const DOME_DOTS: CSSProperties = {
  backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1.5px)',
  backgroundSize: '9px 9px',
  WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.15) 75%, transparent 100%)',
  maskImage: 'linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.15) 75%, transparent 100%)',
};
const DOME_GLOW: CSSProperties = {
  backgroundImage: 'radial-gradient(70% 90% at 50% 100%, rgba(255,255,255,0.22), transparent 70%)',
};
const STAT_STEP = { '--step': 'clamp(2.5rem,0.5rem_+_5vw,7.5rem)'.replace(/_/g, ' ') } as CSSProperties;

const WhySection = memo(function WhySection() {
  const { heading, statement, stats, card } = WHY;
  return (
    <section id="why-sniper" aria-labelledby="why-title" className="scroll-mt-24 bg-[#0B0B0C] text-white">
      <div className={cx(WIDE, SECTION_PAD)}>
        <h2 id="why-title" className={cx('inline-flex items-center gap-2.5 text-[clamp(0.8125rem,0.75rem_+_0.2vw,1rem)] text-white/80', HEADING_WEIGHT)}>
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#DD372B]" />
          {heading}
        </h2>
        <p className={cx('mt-5 max-w-[96rem] text-balance text-[clamp(1.375rem,0.9rem_+_1.6vw,2.75rem)] leading-[1.15] tracking-tighter', HEADING_WEIGHT)}>
          {statement.map((part, i) => (
            <span key={i} className={part.strong ? 'text-white' : 'text-white/55'}>
              {part.text}
            </span>
          ))}
        </p>

        <div className="mt-[clamp(2rem,1.25rem_+_3vw,4.5rem)] grid gap-10 lg:grid-cols-[minmax(0,1fr)_clamp(17rem,21vw,24rem)] lg:gap-[clamp(2rem,1rem_+_3vw,5rem)]">
          <ul style={STAT_STEP} className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8 lg:items-start lg:gap-[clamp(1.5rem,0.5rem_+_3vw,4.5rem)]">
            {stats.map((st, i) => (
              <li key={st.label} className={cx('min-w-0', STAGGER[i])}>
                <p className={cx('flex items-baseline gap-[0.12em] text-[clamp(2.75rem,1.6rem_+_2.4vw,4rem)] leading-none tracking-tighter', HEADING_WEIGHT)}>
                  <span>{st.value}</span>
                  <span className="text-[0.62em] text-[#DD372B]">{st.suffix}</span>
                </p>
                <p className="mt-[clamp(0.75rem,0.6rem_+_0.6vw,1.25rem)] text-[clamp(1rem,0.9rem_+_0.3vw,1.25rem)] font-semibold leading-snug">{st.label}</p>
                <p className="mt-2 max-w-[22rem] text-[clamp(0.875rem,0.82rem_+_0.15vw,1rem)] leading-snug text-white/60">{st.text}</p>
              </li>
            ))}
          </ul>

          <div className="relative isolate flex w-full max-w-[34rem] min-h-[clamp(20rem,15rem_+_10vw,30rem)] flex-col overflow-hidden rounded-[10px] lg:max-w-none bg-[#161616] p-[clamp(1.25rem,1rem_+_1vw,2rem)] ring-1 ring-inset ring-white/10">
            <div className="flex items-start justify-between gap-4">
              <h3 className={cx('max-w-[16rem] text-[clamp(1.0625rem,1rem_+_0.25vw,1.25rem)] leading-tight tracking-tight', HEADING_WEIGHT)}>{card.title}</h3>
              <svg viewBox="0 0 40 58" className="h-9 w-auto shrink-0" fill="#DD372B" aria-hidden="true">
                <rect x="0" y="0" width="20" height="20" />
                <rect x="20" y="19" width="20" height="20" />
                <rect x="0" y="38" width="20" height="20" />
              </svg>
            </div>
            <p className="mt-4 max-w-[22rem] text-[clamp(0.8125rem,0.78rem_+_0.15vw,0.9375rem)] leading-snug text-white/70">{card.text}</p>
            <a
              href={card.cta.href}
              className="sv-anim relative z-10 mt-6 inline-flex w-fit items-center rounded-full border border-[#FF5A4D] px-4 py-2 text-[0.75rem] font-medium uppercase tracking-wide text-[#FF5A4D] transition-colors duration-300 hover:bg-[#DD372B] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {card.cta.label}
            </a>

            {/* Dotted dome (decorative) */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[46%] overflow-hidden">
              <div className="absolute inset-0" style={DOME_GLOW} />
              <div className="absolute inset-x-[-25%] top-[22%] h-[300%] rounded-[50%]" style={DOME_DOTS} />
              <div className="absolute inset-x-[-25%] top-[22%] h-[300%] rounded-[50%] border-t-2 border-white/70 shadow-[0_-10px_36px_rgba(255,255,255,0.35)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

/* =============================================================================
 * PAGE
 * ========================================================================== */

export default function Bentley() {
  // A sector card sets this, the enquiry form reads it. `id` makes a repeat click on the same card still apply.
  const [preset, setPreset] = useState<ChoicePreset | null>(null);

  const selectSector = useCallback((title: string) => {
    setPreset({ value: title, id: Date.now() });
    trackEvent('sector_select', { sector: title });
  }, []);

  return (
    <Layout>
      <SeoHead
        meta={META}
        serviceName={HERO.h1}
        serviceType="Infrastructure engineering software"
        audience="Infrastructure, utility, mining and government organisations"
        breadcrumb={BREADCRUMB}
        faqs={FAQS.items}
      />
      <PartnerStyles />
      <PageWidth />

      {/* Root is a <div>, not <main>: the Layout component should own the single <main> landmark. */}
      <div className="sv-root bg-[#F5F5F7] text-[#141414] antialiased selection:bg-[#DC3327] selection:text-white">
        <Breadcrumb items={BREADCRUMB} />
        <PartnerHero h1={HERO.h1} lead={HERO.lead} primaryCta={HERO.primaryCta} secondaryCta={HERO.secondaryCta} />
        <HeroCarousel slides={SLIDES} />
        <PartnershipSection />
        <SectorSection heading={SECTORS.heading} items={SECTORS.items} onSelect={selectSector} />
        <SolutionsSection heading={SOLUTIONS.heading} items={SOLUTIONS.items} />
        <WhySection />
        <ProcessSteps {...PROCESS} />
        <FAQAccordion {...FAQS} />
        <RelatedSolutions {...RELATED} />
        <EnquirySection
          vendorName="Bentley"
          vendorSlug="bentley"
          path={META.path}
          contact={CONTACT}
          copy={ENQUIRY}
          preset={preset}
        />
      </div>
    </Layout>
  );
}