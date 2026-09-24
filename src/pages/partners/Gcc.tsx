import { Layout } from "@/components/Layout";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  ChevronDown,
  Mail,
  Phone,
  Users,
  UserCheck,
  Award,
  MapPin,
  User,
  Asterisk,
  Plus,
  HardDrive,
  Network,
  ShieldCheck,
  Headphones,
  PackageCheck,
  X,
  Clock,
  Activity,
} from "lucide-react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
// GSAP powers the hero's entrance choreography + idle globe float below
// (see the GCC component). If this project doesn't have it yet: `npm i gsap`.
import gsap from "gsap";
import { AnimatePresence, useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import OrbitingCirclesGlobeDemo from "@/components/ui/OrbitingCirclesGlobeDemo";
import noiseBackground from "@/assets/noise_background.png";
import gccImage from "@/assets/gcc_image.png";
import enterpriseIT from "@/assets/Enterprise_IT_Infrastructure.jpg";
import cloudAi from "@/assets/Cloud_and_AI_Solutions.jpg";
import cybersecurity from "@/assets/Cybersecurity.jpg";
import networking from "@/assets/Enterprise_Networking.jpg";
import digitalWorkplace from "@/assets/Digital_Workplace.jpg";
import managedItServices from "@/assets/Managed_IT_Services.jpg";
import deviceLifecycle from "@/assets/Device_Lifecycle_Management.jpg";
import claude from "@/assets/claude_logo.svg";
import chatgpt from "@/assets/chatgpt_logo.svg";
import gemini from "@/assets/gemini_logo.png";
// TODO: point this at the actual Sniper logo/mark file already used
// elsewhere in the project (e.g. the Navbar) — filename below is a
// placeholder, swap it for the real asset path.
import sniper from "@/assets/sniper-logo-neww.png";
import company_experience from "@/assets/company_experience.jpg";
import technology from "@/assets/technology.jpg";
import healthcare from "@/assets/healthcare.jpg";
import automotive from "@/assets/automotive.jpg";
import engineering from "@/assets/engineering.jpg";
import Ecommerce from "@/assets/Ecommerce.jpg";
import Banking from "@/assets/Banking.jpg";
import happy_customers from "@/assets/happy_customer.jpg";
import azure from "@/assets/azure.png";
import jamf from "@/assets/jamf.svg";
import poly from "@/assets/poly.svg";
import yubico from "@/assets/yubico.png";
import unity from "@/assets/unity.svg";
import trimble from "@/assets/trimble.jpg";
import yotta from   "@/assets/yotta.png";


const ease = [0.16, 1, 0.3, 1] as const;

// ============================================================================
// ✦ DESIGN TOKENS — light / red, per the approved GCC hero mock.
// Keep every color reference in this block so the palette can be tuned
// from one place instead of hunting through className strings.
// ============================================================================
const INK = "#4D4D4D";   // headline black, primary text
const RED = "#DC3327";   // accent — headline highlight, CTA arrow, dots, hover fill
const MUTE = "#8C8C90";  // secondary/caption text
const PAPER = "#F6F5F3"; // page background
const RULE = "#E7CFCB";  // faint red-tinted dividers/underlines
const DIVIDER = "#DADADA"; // neutral row dividers (Solutions list, Approach table)
const INK_DEEP = "#262626"; // CTA hover fill (primary button)
const INK_RING = "rgba(77,77,77,0.3)"; // hairline ring/divider on the secondary CTA
const INK_BLACK = "#141414"; // CTA label on the white hover fill (dark-surface primary)

// Blueprint-grid tokens (Problems section — see ProblemsSection).
const BP_LINE = "rgba(77,77,77,0.22)";       // frame, column rules, dashed dividers
const BP_FAINT = "rgba(77,77,77,0.07)";      // drafting-grid lines behind the figures
const BP_STROKE_DIM = "rgba(77,77,77,0.5)";  // line art in the unfocused columns
const BP_BODY = "#6B6B6F";                   // column body copy

// ============================================================================
// ✦ SECTION SPACING — one shared vertical-rhythm value for every "chapter"
// section (Problems, Partners, Solutions, Approach, Work Process, Industry
// Solutions, Company Highlights, Case Studies, FAQ, Contact).
//
// These previously each carried `min-h-screen flex flex-col justify-center`,
// which ties a section's height — and therefore how much empty space shows
// up above/below its (often much shorter) content — to the viewport height
// of whoever happens to be looking at it. `100vh` is a different number of
// pixels on a MacBook screen than on a Windows laptop or an external
// monitor, so identical content ends up with a different amount of
// surrounding whitespace on each one — that's the actual cause of the
// section-to-section spacing "looking different" across machines, not a
// browser bug. On short/wide monitors the vertical centering can even push
// content close enough to the section above/below it that the rhythm
// breaks down further. It's also why FAQSection had quietly drifted to its
// own smaller `py-16 sm:py-24` at some point — a local patch for a problem
// that was actually coming from `min-h-screen` itself.
//
// Replacing that with one fixed, content-driven padding scale (no
// `min-h-screen`, no `justify-center`) makes the gap between every pair of
// sections a known, identical number of pixels at a given width, regardless
// of screen height, OS, or browser — matching how NumbersSection already
// behaves (see its own comment below) for this same reason, and giving
// every section the same 3-step ramp NumbersSection's own padding uses.
// ============================================================================
const SECTION_PADDING = "py-10 sm:py-14 lg:py-16";

// ============================================================================
// ✦ TYPE SCALE / TRACKING CONVENTION
//
// - Headings (h1/h2/h3, plus heading-weight display numbers like stat
//   values and FAQ question titles): `tracking-tighter`.
// - Body copy — paragraphs, captions, form labels, card text: `tracking-tight`
//   plus one step up in size vs. the previous pass (the type read too small
//   against the reference). Tailwind has no literal `text-md` utility, so
//   "md-sized" body text below is `text-base`/`text-lg` — the closest stock
//   sizes to what a "medium" body size means in most type scales.
// - Deliberately letter-spaced uppercase micro-labels (the section Eyebrow,
//   the logo-strip caption, the Approach table's header row) keep their
//   existing `tracking-[...]`/`tracking-wide` value instead of switching to
//   `tracking-tight` — that spacing is the point of those labels, not an
//   oversight.
//
// ============================================================================
// ✦ SECTION RHYTHM CONVENTION (this handoff)
//
// - Every *major* top-level section (Problems, Partners, Solutions,
//   Approach, Work Process, Industry Solutions, Company Highlights, Case
//   Studies, FAQ, Contact) shares one identical wrapper via the
//   `SECTION_PADDING` constant (defined above, next to the color tokens) —
//   plain padding, no `min-h-screen`/`justify-center`. See that constant's
//   own comment for why the earlier viewport-height-based version was
//   replaced: it made the gap between sections vary by screen height,
//   which is what caused the same page to look inconsistently spaced
//   across different machines/monitors.
// - NumbersSection and LogoMarquee are the exception: they're visually a
//   continuation of the hero (stat cards + trusted-by strip riding right
//   under the hero art), not their own full-bleed "chapter," so they use
//   their own smaller, three-step padding scale instead of
//   `SECTION_PADDING`, and sit directly under the hero `<section>` with no
//   seam (same PAPER background, no border/rule between them).
// - CONTAINER CONVENTION (this pass): horizontal padding (`px-4 sm:px-6`)
//   now lives on the same element as `mx-auto max-w-7xl w-full` — i.e. the
//   inner content div, not the outer `<section>`. Previously the section
//   carried the padding and the inner div only carried the max-width,
//   which meant that once `max-w-7xl` (not the section's own padding)
//   became the limiting factor on wide viewports, the inner content sat
//   flush against the 1280px boundary with no inset — while Navbar.tsx's
//   container fuses padding and max-width on one element, so its content
//   sits inset by the padding *inside* its 1280px box. That mismatch is
//   what caused section content to start ~24px further outward than the
//   navbar's content on wide screens. Fusing padding + max-width on the
//   same div here (matching Navbar) fixes that for every section.
// ============================================================================

// ============================================================================
// ✦ VIEWPORT HOOK — for components that take a `mobile` boolean PROP rather
// than reading CSS breakpoints (OrbitingCirclesGlobeDemo is the one case on
// this page: its ring radii, globe size and icon size are plain numbers
// computed in JS from that prop, not Tailwind classes — so no amount of
// `sm:`/`lg:` on the wrapper div can resize what's inside it, only this can).
// Threshold matches Tailwind's own `sm` breakpoint (640px) so it agrees with
// every other responsive rule on this page. The initial state is computed
// synchronously from `window` (this app has no SSR pass to worry about) so
// there's no first-paint flash of the desktop-sized rings on a phone; the
// effect only exists to keep it in sync across resizes/rotation.
// ============================================================================
const MOBILE_BREAKPOINT_QUERY = "(max-width: 639px)";

const useIsMobileViewport = () => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches
  );

  useEffect(() => {
    const query = window.matchMedia(MOBILE_BREAKPOINT_QUERY);
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isMobile;
};

// ============================================================================
// ✦ FADE-UP WRAPPER
// ============================================================================
const FadeUp = ({
  children, delay = 0, className = "",
}: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, ease, delay }}
  >
    {children}
  </motion.div>
);

// ============================================================================
// ✦ SECTION EYEBROW
// ============================================================================
const Eyebrow = ({ children, align = "left", compact = false }: { children: React.ReactNode; align?: "left" | "center"; compact?: boolean }) => (
  <span
    className={`inline-block border-b pb-2 ${compact ? "text-[9px] tracking-[0.12em]" : "text-[11px] tracking-[0.2em]"} sm:text-sm font-medium uppercase leading-relaxed sm:tracking-[0.25em] ${
      align === "center" ? "text-center" : ""
    }`}
    style={{ color: INK, borderColor: RED }}
  >
    {children}
  </span>
);

// ============================================================================
// ✦ CTA BUTTON — the ONE button style used across the whole page.
//
// Square-edged by default (GCC theme: no rounded corners on buttons/cards/
// sections). Every button on the page goes through this component so the
// look, hover and states can be tuned in one place.
//
// variant
//   "primary"   — solid RED, white label. Hover: an INK_DEEP fill sweeps up
//                 from the bottom edge. The main conversion action.
//   "secondary" — transparent with a hairline INK ring. Hover: a RED fill
//                 sweeps up and the label flips to white. Softer action.
// size      "md" (hero / section CTAs) | "sm" (compact controls, chips)
// shape     "square" (default) | "pill" — pill is only for the Ask-AI bar,
//           a documented exception to the square-corner rule (per the mock)
// icon      arrow direction: "right" = take an action, "down" = scroll to a
//           section on this page, "up-right" = external link, "close" = clear
// onDark    primary on a dark surface: hover fills WHITE (not charcoal) so
//           the button doesn't sink into the bar behind it
// width     "auto" | "full" | "full-mobile" (full-width, capped at 320px,
//           below `sm` only)
// leading   optional node before the label (e.g. a logo)
// href      renders an <a>; otherwise renders a <button> (type / onClick /
//           disabled / loading — `loading` swaps the icon for a spinner and
//           disables the button)
// ============================================================================
type CTAIcon = "right" | "down" | "up-right" | "close";

const CTA_ICONS = { right: ArrowRight, down: ArrowDown, "up-right": ArrowUpRight, close: X } as const;

const CTA_ICON_HOVER: Record<CTAIcon, string> = {
  right: "group-hover:translate-x-1",
  down: "group-hover:translate-y-0.5",
  "up-right": "group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
  close: "group-hover:rotate-90",
};

const CTA_SIZES = {
  md: {
    text: "text-sm sm:text-base",
    label: "py-3 pl-4 pr-3 sm:py-3.5 sm:pl-6 sm:pr-5",
    cell: "w-10 sm:w-12",
    icon: "h-4 w-4 sm:h-5 sm:w-5",
  },
  sm: {
    text: "text-xs sm:text-sm",
    label: "py-2 pl-3 pr-3 sm:py-2.5 sm:pl-4 sm:pr-4",
    cell: "w-8 sm:w-9",
    icon: "h-3.5 w-3.5 sm:h-4 sm:w-4",
  },
} as const;

const CTA_WIDTHS = {
  auto: "",
  full: "w-full",
  "full-mobile": "w-full max-w-[320px] sm:w-auto sm:max-w-none",
} as const;

interface CTAButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: keyof typeof CTA_SIZES;
  shape?: "square" | "pill";
  icon?: CTAIcon;
  leading?: React.ReactNode;
  onDark?: boolean;
  width?: keyof typeof CTA_WIDTHS;
  // glass: frosted backdrop-blur fill instead of the normal solid/transparent
  // one — for a button that sits over moving artwork (e.g. the hero's
  // orbiting globe) and needs to stay legible without a hard opaque panel
  // behind it, per-instance rather than a global CTAButton behavior change.
  glass?: boolean;
  className?: string;
  // link mode
  href?: string;
  target?: string;
  rel?: string;
  // button mode
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
}

const CTAButton = ({
  children, variant = "primary", size = "md", shape = "square", icon = "right",
  leading, onDark = false, width = "auto", glass = false, className = "",
  href, target, rel, type = "button", onClick, disabled = false, loading = false, ariaLabel,
}: CTAButtonProps) => {
  const primary = variant === "primary";
  const sz = CTA_SIZES[size];
  const Icon = CTA_ICONS[icon];

  const rootClass = [
    "group relative inline-flex items-stretch overflow-hidden font-medium tracking-tight",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    "disabled:pointer-events-none disabled:opacity-60",
    sz.text,
    CTA_WIDTHS[width],
    shape === "pill" ? "rounded-full" : "",
    // backdrop-blur-md is the actual glass — it's what keeps whatever is
    // animating behind the button (globe, orbit badges, etc.) from reading
    // through the transparent parts of a secondary button's fill.
    glass ? "backdrop-blur-md" : "",
    className,
  ].filter(Boolean).join(" ");

  const rootStyle = {
    color: primary ? "#fff" : INK,
    backgroundColor: glass
      ? (primary ? "rgba(220,51,39,0.82)" : "rgba(246,245,243,0.55)")
      : (primary ? RED : undefined),
    boxShadow: primary ? undefined : `inset 0 0 0 1px ${INK_RING}`,
    outlineColor: RED,
    "--cta-hover-text": primary && onDark ? INK_BLACK : "#fff",
  } as React.CSSProperties;

  const content = (
    <>
      {/* hover fill — sweeps up from the bottom edge */}
      <span
        aria-hidden="true"
        className="absolute inset-0 translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0 motion-reduce:transition-none"
        style={{ backgroundColor: primary ? (onDark ? "#fff" : INK_DEEP) : RED }}
      />
      <span
        className={`relative z-10 flex flex-1 items-center transition-colors duration-300 group-hover:text-[color:var(--cta-hover-text)] ${sz.label}`}
      >
        {leading && <span className="mr-2 inline-flex shrink-0 items-center">{leading}</span>}
        {children}
      </span>
      <span
        className={`relative z-10 flex shrink-0 items-center justify-center border-l transition-colors duration-300 group-hover:text-[color:var(--cta-hover-text)] ${sz.cell}`}
        style={{ borderColor: primary ? "rgba(255,255,255,0.28)" : INK_RING }}
      >
        {loading ? (
          <span className={`${sz.icon} animate-spin rounded-full border-2 border-current border-t-transparent`} />
        ) : (
          <Icon
            aria-hidden="true"
            className={`${sz.icon} transition-transform duration-300 ease-out motion-reduce:transition-none ${CTA_ICON_HOVER[icon]}`}
          />
        )}
      </span>
    </>
  );

  return href ? (
    <a href={href} target={target} rel={rel} className={rootClass} style={rootStyle}>
      {content}
    </a>
  ) : (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      className={rootClass}
      style={rootStyle}
    >
      {content}
    </button>
  );
};

// ============================================================================
// ✦ NUMBERS SECTION
//
// No longer a standalone `min-h-screen` chapter — it's the stat-card strip
// that rides directly under the hero. Padding is modest and top-only-free
// (no `pt-*`) so it sits flush against the hero section above it.
// ============================================================================
interface Stat {
  Icon: typeof Users;
  value: string;
  label: string;
}

const STATS: Stat[] = [
  { Icon: Award, value: "17+", label: "years of proved track record" },
  { Icon: Users, value: "2600+", label: "Happy Customers" },
  { Icon: MapPin, value: "7+", label: "Locations Across India" },
  { Icon: UserCheck, value: "180+", label: "Employees" },
];

const NumbersSection = () => (
  <section className="bg-[#f6f5f3] py-10 sm:py-16 lg:py-20">
    <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10">
      <FadeUp>
        {/* corner-marked frame — same chrome as the ProblemsSection
            figures, applied to a photo instead of an isometric SVG. */}
        <div className="relative">
          <img
            src={company_experience}
            alt="Sniper Systems team overlooking a city skyline"
            className="h-[220px] w-full object-cover grayscale sm:h-[360px] lg:h-[400px]"
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-2 hidden sm:block">
            {["left-0 top-0", "right-0 top-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos) => (
              <Plus key={pos} strokeWidth={1.25} className={`absolute h-3.5 w-3.5 ${pos}`} style={{ color: "#fff" }} />
            ))}
          </div>
        </div>
      </FadeUp>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <FadeUp delay={0.08}>
          <h2
            className="max-w-xl text-[28px] font-semibold leading-[1.2] tracking-tighter sm:text-[38px] sm:leading-[1.15]"
            style={{ color: INK }}
          >
            <span style={{ color: RED }}>With over a decade</span> of experience,
            <br />
            we empower global enterprises to build and scale GCCs in India
          </h2>
        </FadeUp>

        {/* hairline stat grid — gap-px on a BP_LINE background reads as a
            drafted grid of cells, matching the ProblemsSection frame, with
            a bracketed [01]-[04] index replacing the plain icon-only cards. */}
        <div
          className="grid grid-cols-1 gap-px p-px sm:grid-cols-2"
          style={{ backgroundColor: BP_LINE }}
        >
          {STATS.map(({ Icon, value, label }, index) => (
            <FadeUp key={label} delay={0.12 + index * 0.06}>
              <article className="relative min-h-[164px] bg-white p-5 sm:p-6">
                <div className="flex items-start justify-between border-b border-dashed pb-3" style={{ borderColor: BP_LINE }}>
                  <Icon className="h-8 w-8" strokeWidth={1.5} style={{ color: INK }} />
                  <span className="font-mono text-[11px] tracking-[0.04em]" style={{ color: "#A3A3A6" }}>
                    [0{index + 1}]
                  </span>
                </div>

                <p
                  className="mt-4 text-4xl font-medium tracking-tighter sm:text-5xl"
                  style={{ color: RED }}
                >
                  {value}
                </p>

                <p
                  className="mt-1 font-mono text-[11px] uppercase tracking-[0.06em] sm:text-xs"
                  style={{ color: MUTE }}
                >
                  {label}
                </p>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </div>
  </section>
);



// ============================================================================
// ✦ PROBLEMS SECTION — "Setting up a GCC in India".
//
// V3 — "blueprint spec sheet". V2 was a list ⇄ featured-panel split; this
// swaps it for a four-column engineering-drawing grid (hairline frame,
// mono labels + [01] index, dashed dividers, corner registration marks,
// faint drafting grid, ruler strip) with one looping isometric line-art
// figure per pillar. Nothing decorative: each figure animates the *idea*
// of its column —
//   01 Rapid IT Readiness   — dashed footprints on a bare slab; modules
//                             drop in one after another, last one goes
//                             "online" (red pulse).
//   02 Secure & Compliant   — cube inside a perimeter ring; a red scan
//                             line sweeps the shield, a red node orbits it.
//   03 Integrated Multi-OEM — three different primitives (plate, cylinder,
//                             sphere) in exploded view, snapping into one
//                             assembly, then a red "joined" marker lights.
//   04 Scale & Managed Ops  — a stack of slabs that gains layers over time;
//                             the red marker climbs to the newest one.
//
// INTERACTION: one column is "focused" at a time (dark ink lines, grid,
// corner marks, red accents, tinted paper — the same treatment as the
// first column in the reference); the others go quiet grey. Hover / focus
// selects a column; when nobody is interacting it auto-advances every
// AUTO_ADVANCE_MS (set to 0 to switch that off). Below `lg` (1024px) there
// is no hover, so every column renders in its focused state instead.
//
// MOTION: pure CSS keyframes on SVG groups (compositor-friendly transforms
// + opacity only), generated in BP_CSS below. Everything pauses while the
// grid is off-screen (`data-play`), and `prefers-reduced-motion` freezes
// every figure in its finished/assembled pose.
// ============================================================================
interface Problem {
  number: string;
  title: string;
  tagline: string;
  category: string;
  items: string[];
  body: string;
}

const PROBLEMS: Problem[] = [
  {
    number: "01",
    title: "Rapid IT Readiness",
    tagline: "From Bare Office to Business-Ready IT",
    category: "IT Infrastructure",
    items: ["Networking", "Data Center", "Compute", "Cloud", "End-User Computing", "Workplace"],
    body: "Accelerate GCC IT setup and establish a business-ready technology environment from day one.",
  },
  {
    number: "02",
    title: "Secure & Compliant Foundation",
    tagline: "Security Built Into the Architecture",
    category: "Network Security",
    items: ["Endpoint Security", "Identity", "Cloud Security", "Access Controls", "Data Protection"],
    body: "Establish a secure technology foundation aligned with organizational security and governance requirements.",
  },
  {
    number: "03",
    title: "Integrated Multi-OEM Delivery",
    tagline: "One Partner. Multiple Technologies.",
    category: "Multi-OEM Solutions",
    items: ["Solution Design", "Presales", "Deployment", "Integration", "Single-Window Coordination"],
    body: "Simplify complex IT environments through one coordinated partner across multiple OEMs and technology domains.",
  },
  {
    number: "04",
    title: "Scale & Managed Operations",
    tagline: "Support Today. Scale Tomorrow.",
    category: "Deployment",
    items: ["Configuration", "Monitoring", "AMC", "Managed Services", "Support", "Technology Refresh"],
    body: "Enable GCCs to scale infrastructure, users and locations while maintaining operational continuity and support.",
  },
];

// Grain overlay — real noise_background.png asset (imported above), layered
// on every card across the page (ProblemCard, PartnerCard, SolutionRow, and
// the Company Highlights bento cards) via this one shared constant. Each
// usage site still controls its own opacity/hover behavior — light cards
// (Problem/Partner/Solution) keep the grain hover-only so it doesn't muddy
// the white background at rest, while the always-dark bento cards show it
// at rest — but they all now point at the same real texture asset instead
// of a procedurally-generated SVG.
const NOISE_BG = `url(${noiseBackground})`;

// ----------------------------------------------------------------------------
// Blueprint tuning knobs
// ----------------------------------------------------------------------------
const AUTO_ADVANCE_MS = 5200;   // 0 = hover/focus only, no auto-advance
const BP_GRAIN_OPACITY = 0.16;  // paper-grain strength on the cells; 0 = off

// ----------------------------------------------------------------------------
// Isometric geometry helpers. Projection: screen x = (x − y)·cos30°,
// screen y = (x + y)·½ − z. The nearest corner of a box is (x+w, y+d).
// Every figure is generated from these so the line-work is exact and the
// hidden (back) edges can be drawn dashed, like a real technical drawing.
// ----------------------------------------------------------------------------
type XY = [number, number];
const ISO_X = 0.866025;
const iso = (cx: number, cy: number, x: number, y: number, z: number): XY => [
  cx + (x - y) * ISO_X,
  cy + (x + y) * 0.5 - z,
];
const fmt = ([x, y]: XY) => `${x.toFixed(1)} ${y.toFixed(1)}`;

const isoBox = (
  cx: number, cy: number,
  ox: number, oy: number, oz: number,
  w: number, d: number, h: number,
  withHidden = true,
) => {
  const p = (x: number, y: number, z: number) => fmt(iso(cx, cy, x, y, z));
  const x1 = ox + w, y1 = oy + d, z1 = oz + h;
  return {
    solid:
      `M${p(ox, oy, z1)}L${p(x1, oy, z1)}L${p(x1, y1, z1)}L${p(ox, y1, z1)}Z` + // top face
      `M${p(ox, y1, z1)}L${p(ox, y1, oz)}L${p(x1, y1, oz)}L${p(x1, oy, oz)}L${p(x1, oy, z1)}` + // left · base · right
      `M${p(x1, y1, z1)}L${p(x1, y1, oz)}`, // front vertical
    hidden: withHidden
      ? `M${p(ox, oy, oz)}L${p(ox, y1, oz)}M${p(ox, oy, oz)}L${p(x1, oy, oz)}M${p(ox, oy, oz)}L${p(ox, oy, z1)}`
      : "",
  };
};

// Flat diamond lying on the iso ground plane (footprints, red markers).
const isoPlate = (cx: number, cy: number, ox: number, oy: number, z: number, w: number, d: number) => {
  const p = (x: number, y: number) => fmt(iso(cx, cy, x, y, z));
  return `M${p(ox, oy)}L${p(ox + w, oy)}L${p(ox + w, oy + d)}L${p(ox, oy + d)}Z`;
};

// Upright cylinder on the iso ground plane (circle → 1.2247r × 0.7071r ellipse).
const IsoCylinder = ({ cx, cy, z0, z1, r }: { cx: number; cy: number; z0: number; z1: number; r: number }) => {
  const rx = r * 1.2247, ry = r * 0.7071;
  const top = iso(cx, cy, 0, 0, z1), bot = iso(cx, cy, 0, 0, z0);
  return (
    <>
      <ellipse cx={top[0]} cy={top[1]} rx={rx} ry={ry} />
      <path
        d={`M${top[0] - rx} ${top[1]}L${bot[0] - rx} ${bot[1]}A${rx} ${ry} 0 0 0 ${bot[0] + rx} ${bot[1]}L${top[0] + rx} ${top[1]}`}
      />
      <path className="bp-hidden" d={`M${bot[0] - rx} ${bot[1]}A${rx} ${ry} 0 0 1 ${bot[0] + rx} ${bot[1]}`} />
    </>
  );
};

const IsoSphere = ({ x, y, r }: { x: number; y: number; r: number }) => (
  <>
    <circle cx={x} cy={y} r={r} />
    <path d={`M${x - r} ${y}A${r} ${r * 0.34} 0 0 0 ${x + r} ${y}`} />
    <path className="bp-hidden" d={`M${x - r} ${y}A${r} ${r * 0.34} 0 0 1 ${x + r} ${y}`} />
  </>
);

// ----------------------------------------------------------------------------
// The four figures. All share one 400×400 coordinate space, cropped to its central 300×300 by the viewBox; strokes, dashes and the red
// accent visibility are driven by CSS variables on `.bp-cell` (see BP_CSS), so
// a figure never needs to know whether its column is currently focused.
// ----------------------------------------------------------------------------
const FIG_PROPS = { viewBox: "50 50 300 300", className: "bp-svg h-full w-full", "aria-hidden": true } as const;

// 01 — bare slab → modules land → last one goes online
const ReadyFigure = () => {
  const cx = 200, cy = 268;
  const slab = isoBox(cx, cy, -70, -70, 0, 140, 140, 10);
  const mods = [
    { ox: -58, oy: -58, w: 44, d: 44, h: 64 },
    { ox: 14, oy: -58, w: 44, d: 44, h: 44 },
    { ox: -24, oy: 8, w: 48, d: 48, h: 28 },
  ];
  return (
    <svg {...FIG_PROPS}>
      <path d={slab.solid} />
      <path d={slab.hidden} className="bp-hidden" />
      {mods.map((m, i) => (
        <path key={`f${i}`} className="bp-ghost" d={isoPlate(cx, cy, m.ox, m.oy, 10, m.w, m.d)} />
      ))}
      {mods.map((m, i) => {
        const b = isoBox(cx, cy, m.ox, m.oy, 10, m.w, m.d, m.h);
        return (
          <g key={`m${i}`} className={`bp-anim bp-drop-${i}`}>
            <path d={b.solid} />
            <path d={b.hidden} className="bp-hidden" />
            {i === mods.length - 1 && (
              <g className="bp-accent">
                <path
                  className="bp-anim bp-blink bp-red"
                  d={isoPlate(cx, cy, m.ox + m.w / 2 - 7, m.oy + m.d / 2 - 7, 10 + m.h, 14, 14)}
                />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};

// 02 — cube inside a perimeter; scan line sweeps, red node orbits
const ShieldFigure = () => {
  const cube = isoBox(200, 200, -48, -48, -48, 96, 96, 96);
  return (
    <svg {...FIG_PROPS}>
      <defs>
        <clipPath id="bp-shield-clip">
          <circle cx="200" cy="200" r="112" />
        </clipPath>
        <linearGradient id="bp-scan-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={RED} stopOpacity="0" />
          <stop offset="1" stopColor={RED} stopOpacity="0.16" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="200" r="112" />
      <g className="bp-anim bp-spin" style={{ transformOrigin: "200px 200px" }}>
        <circle cx="200" cy="200" r="130" className="bp-ghost" />
        <g className="bp-accent">
          <rect className="bp-red" x="196" y="66" width="8" height="8" />
        </g>
      </g>
      <path d={cube.solid} />
      <path d={cube.hidden} className="bp-hidden" />
      {/* the sweep itself always runs (quiet grey when the column is idle);
          only its red line + glow trail belong to the focused state */}
      <g clipPath="url(#bp-shield-clip)">
        <g className="bp-anim bp-scan">
          <g className="bp-accent">
            <rect x="80" y="-44" width="240" height="44" fill="url(#bp-scan-grad)" stroke="none" />
          </g>
          <path className="bp-scan-line" d="M80 0H320" strokeWidth="1.5" />
        </g>
      </g>
    </svg>
  );
};

// 03 — plate + cylinder + sphere: exploded view ⇄ one assembly
const OemFigure = () => {
  const cx = 200, cy = 246;
  const plate = isoBox(cx, cy, -60, -60, 0, 120, 120, 14);
  return (
    <svg {...FIG_PROPS}>
      <path className="bp-ghost" d={`M${cx} 80V${cy + 82}`} />
      <g className="bp-anim bp-explode-0" style={{ "--d": "16px" } as React.CSSProperties}>
        <path d={plate.solid} />
        <path d={plate.hidden} className="bp-hidden" />
      </g>
      <g className="bp-anim bp-explode-1" style={{ "--d": "-32px" } as React.CSSProperties}>
        <IsoCylinder cx={cx} cy={cy} z0={14} z1={46} r={34} />
      </g>
      <g className="bp-anim bp-explode-2" style={{ "--d": "-74px" } as React.CSSProperties}>
        <IsoSphere x={cx} y={cy - 73} r={27} />
      </g>
      <path className="bp-ghost" d={`M248 ${cy - 46}H294`} />
      <g className="bp-accent">
        <rect className="bp-anim bp-lock bp-red" x="294" y={cy - 50} width="8" height="8" />
      </g>
    </svg>
  );
};

// 04 — slab stack gains layers; red marker climbs to the newest
const SCALE_LAYER_STEP = 30;
const ScaleFigure = () => {
  const cx = 200, cy = 288;
  const layers = [0, 1, 2, 3, 4];
  return (
    <svg {...FIG_PROPS}>
      {layers.map((k) => {
        const b = isoBox(cx, cy, -58, -58, k * SCALE_LAYER_STEP, 116, 116, 10, false);
        return (
          <g key={k} className={k >= 2 ? `bp-anim bp-layer-${k - 2}` : undefined}>
            <path d={b.solid} />
          </g>
        );
      })}
      <g className="bp-accent">
        <path
          className="bp-anim bp-climb bp-red"
          d={isoPlate(cx, cy, -8, -8, SCALE_LAYER_STEP + 10, 16, 16)}
        />
      </g>
    </svg>
  );
};

const PROBLEM_FIGURES = [ReadyFigure, ShieldFigure, OemFigure, ScaleFigure];

// ----------------------------------------------------------------------------
// CSS — state variables, figure styling and generated keyframes.
// Kept as one string so the animation timings sit next to the geometry that
// depends on them (percentages below are shares of each figure's own loop).
// ----------------------------------------------------------------------------
const BP_OUT = "cubic-bezier(0.16,1,0.3,1)";
const BP_INOUT = "cubic-bezier(0.65,0,0.35,1)";

const BP_DROP_STARTS = [6, 18, 30];
const BP_EXPLODE_WINDOWS: [number, number][] = [[6, 26], [9, 32], [12, 38]];
const BP_LAYER_STARTS = [20, 42, 64];

const BP_CSS = `
.bp-cell{--bp-stroke:${INK};--bp-scan-line:${RED};--bp-accent:1;--bp-chrome:1;--bp-dot-w:8px;--bp-dot-m:10px;background-color:${PAPER};transition:background-color .6s ease}
.bp-cell:focus-visible{outline:1px solid ${RED};outline-offset:-3px}
@media (min-width:1024px){
  .bp-cell[data-active="true"]{background-color:#FAF9F7}
  .bp-cell[data-active="false"]{--bp-stroke:${BP_STROKE_DIM};--bp-scan-line:${BP_STROKE_DIM};--bp-accent:0;--bp-chrome:0;--bp-dot-w:0px;--bp-dot-m:0px}
}
.bp-svg{fill:none;stroke:var(--bp-stroke);stroke-width:1.25;stroke-linejoin:round;stroke-linecap:round;overflow:visible;transition:stroke .6s ease}
.bp-hidden{stroke-dasharray:4 4;stroke-width:1;opacity:.7}
.bp-ghost{stroke-dasharray:3 5;stroke-width:1;opacity:.6}
.bp-red{fill:${RED};stroke:none}
.bp-scan-line{stroke:var(--bp-scan-line);transition:stroke .6s ease}
.bp-accent{opacity:var(--bp-accent);transition:opacity .6s ease}
.bp-chrome{opacity:var(--bp-chrome);transition:opacity .6s ease}
.bp-dot{width:var(--bp-dot-w);margin-right:var(--bp-dot-m);opacity:var(--bp-accent);transition:width .5s ${BP_OUT},margin .5s ${BP_OUT},opacity .5s ease}
.bp-grid[data-play="false"] .bp-anim{animation-play-state:paused}

/* 01 — modules land in sequence, hold, fade */
${BP_DROP_STARTS.map(
  (s, i) => `@keyframes bp-drop-${i}{0%,${s}%{opacity:0;transform:translateY(-56px)}${s + 12}%,84%{opacity:1;transform:translateY(0)}94%,100%{opacity:0;transform:translateY(0)}}
.bp-drop-${i}{animation:bp-drop-${i} 7s ${BP_OUT} infinite}`,
).join("\n")}
@keyframes bp-blink{0%,100%{opacity:1}50%{opacity:.15}}
.bp-blink{animation:bp-blink 1.6s ease-in-out infinite}

/* 02 — orbiting node + scan sweep */
@keyframes bp-spin{to{transform:rotate(360deg)}}
.bp-spin{animation:bp-spin 36s linear infinite;transform-box:view-box}
@keyframes bp-scan{0%{transform:translateY(88px);opacity:0}8%{opacity:1}72%{transform:translateY(312px);opacity:1}82%,100%{transform:translateY(312px);opacity:0}}
.bp-scan{animation:bp-scan 5.5s cubic-bezier(0.45,0,0.55,1) infinite}

/* 03 — exploded view ⇄ assembly */
${BP_EXPLODE_WINDOWS.map(
  ([a, b], i) => `@keyframes bp-explode-${i}{0%,${a}%{transform:translateY(var(--d))}${b}%,64%{transform:translateY(0)}86%,100%{transform:translateY(var(--d))}}
.bp-explode-${i}{animation:bp-explode-${i} 8s ${BP_INOUT} infinite}`,
).join("\n")}
@keyframes bp-lock{0%,38%{opacity:0}46%{opacity:1}54%{opacity:.3}62%,66%{opacity:1}82%,100%{opacity:0}}
.bp-lock{animation:bp-lock 8s ease-in-out infinite}

/* 04 — layers stack up, marker climbs */
${BP_LAYER_STARTS.map(
  (s, i) => `@keyframes bp-layer-${i}{0%,${s - 2}%{opacity:0;transform:translateY(-${SCALE_LAYER_STEP + 8}px)}${s + 6}%,90%{opacity:1;transform:translateY(0)}97%,100%{opacity:0;transform:translateY(0)}}
.bp-layer-${i}{animation:bp-layer-${i} 9s ${BP_OUT} infinite}`,
).join("\n")}
@keyframes bp-climb{0%,24%{transform:translateY(0);opacity:1}28%,46%{transform:translateY(-${SCALE_LAYER_STEP}px)}50%,68%{transform:translateY(-${SCALE_LAYER_STEP * 2}px)}72%,90%{transform:translateY(-${SCALE_LAYER_STEP * 3}px);opacity:1}97%,100%{transform:translateY(-${SCALE_LAYER_STEP * 3}px);opacity:0}}
.bp-climb{animation:bp-climb 9s ${BP_OUT} infinite}

@media (prefers-reduced-motion:reduce){
  .bp-anim{animation:none!important}
  .bp-climb{transform:translateY(-${SCALE_LAYER_STEP * 3}px)}
}
`;

// ----------------------------------------------------------------------------
// One column of the spec sheet.
// ----------------------------------------------------------------------------
const ProblemCell = ({
  problem, index, active, onActivate,
}: { problem: Problem; index: number; active: boolean; onActivate: () => void }) => {
  const Figure = PROBLEM_FIGURES[index];
  const dashed = { borderColor: BP_LINE } as const;

  return (
    <article
      className="bp-cell relative flex flex-col outline-none"
      data-active={active}
      tabIndex={0}
      onMouseEnter={onActivate}
      onFocus={onActivate}
    >
      {/* paper grain — same texture the rest of the page uses */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 mix-blend-multiply"
        style={{ backgroundImage: NOISE_BG, opacity: BP_GRAIN_OPACITY }}
      />

      {/* label row */}
      <div className="relative z-10 flex items-center justify-between border-b border-dashed px-5 py-4 sm:px-6" style={dashed}>
        <span className="flex items-center font-mono text-[11px] uppercase tracking-[0.06em]" style={{ color: INK }}>
          <span aria-hidden="true" className="bp-dot block h-2 shrink-0" style={{ backgroundColor: RED }} />
          {problem.category}
        </span>
        <span className="font-mono text-[11px] tracking-[0.04em]" style={{ color: "#A3A3A6" }}>
          [{problem.number}]
        </span>
      </div>

      {/* figure stage */}
      <div className="relative z-10 h-[300px] border-b border-dashed sm:h-[330px] lg:h-[350px]" style={dashed}>
        <div
          aria-hidden="true"
          className="bp-chrome absolute inset-[22px]"
          style={{
            backgroundImage: `linear-gradient(to right, ${BP_FAINT} 1px, transparent 1px), linear-gradient(to bottom, ${BP_FAINT} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            backgroundPosition: "center",
          }}
        />
        {["left-4 top-4", "right-4 top-4", "bottom-4 left-4", "bottom-4 right-4"].map((pos) => (
          <Plus
            key={pos}
            aria-hidden="true"
            strokeWidth={1}
            className={`bp-chrome absolute h-3.5 w-3.5 ${pos}`}
            style={{ color: INK }}
          />
        ))}
        <div className="absolute inset-x-0 top-4 bottom-14">
          <Figure />
        </div>
        <span
          className="absolute inset-x-10 bottom-3.5 text-center font-mono text-[10px] uppercase leading-snug tracking-[0.08em]"
          style={{ color: MUTE }}
        >
          {problem.tagline}
        </span>
      </div>

      {/* copy */}
      <div className="relative z-10 flex flex-1 flex-col px-5 pb-6 pt-7 sm:px-6">
        <h3
          className="text-[28px] font-medium uppercase leading-[0.95] tracking-tighter sm:text-[32px] xl:text-[34px]"
          style={{ color: INK }}
        >
          {problem.title}
        </h3>
        <p className="mt-8 max-w-[34ch] text-[15px] leading-snug tracking-tight sm:text-base md:mt-auto md:pt-8" style={{ color: BP_BODY }}>
          {problem.body}
        </p>
        <p
          className="mt-6 border-t border-dashed pt-4 font-mono text-[10px] uppercase leading-relaxed tracking-[0.06em]"
          style={{ ...dashed, color: MUTE }}
        >
          {problem.items.join("  /  ")}
        </p>
      </div>
    </article>
  );
};

// Ruler strip along the base of the frame; the red bar slides under
// whichever column is focused (lg+ only — below that every column is).
const BlueprintRuler = ({ activeIndex }: { activeIndex: number }) => (
  <div className="relative col-span-full h-7" style={{ backgroundColor: PAPER }} aria-hidden="true">
    <Plus className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" strokeWidth={1} style={{ color: INK }} />
    <Plus className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" strokeWidth={1} style={{ color: INK }} />
    <div
      className="absolute inset-x-9 top-1/2 h-[5px] -translate-y-1/2"
      style={{ backgroundImage: `repeating-linear-gradient(to right, ${BP_LINE} 0 1px, transparent 1px 8px)` }}
    />
    <div
      className="absolute left-0 top-0 hidden h-full w-1/4 lg:block"
      style={{
        transform: `translateX(${activeIndex * 100}%)`,
        transition: `transform 0.7s ${BP_OUT}`,
      }}
    >
      <span className="absolute inset-x-0 top-0 h-[2px]" style={{ backgroundColor: RED }} />
    </div>
  </div>
);

const ProblemsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { amount: 0.25 });
  const reduceMotion = useReducedMotion();

  // Gentle auto-advance while the grid is on screen and nobody is pointing
  // at it — keeps the focused-column state alive without any input.
  useEffect(() => {
    if (!AUTO_ADVANCE_MS || !inView || paused || reduceMotion) return;
    const id = window.setInterval(
      () => setActiveIndex((i) => (i + 1) % PROBLEMS.length),
      AUTO_ADVANCE_MS,
    );
    return () => window.clearInterval(id);
  }, [inView, paused, reduceMotion]);

  return (
    <section className={SECTION_PADDING} style={{ backgroundColor: PAPER }}>
      <style>{BP_CSS}</style>
      <div className="mx-auto max-w-[1440px] w-full px-4 sm:px-6 lg:px-10">
        <FadeUp>
          <Eyebrow>SETTING UP A GCC IN INDIA</Eyebrow>
        </FadeUp>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:items-end lg:gap-16">
          <FadeUp delay={0.08}>
            <h2 className="max-w-4xl text-balance text-[28px] sm:text-5xl md:text-5xl font-semibold tracking-tighter leading-[1.1]">
              <span style={{ color: INK }}>Sniper Enables the IT Foundation to Scale </span>
              <span style={{ color: RED }}>From Day One</span>
            </h2>
          </FadeUp>

          <FadeUp delay={0.16}>
            <p className="text-[15px] sm:text-lg tracking-tight leading-relaxed" style={{ color: MUTE }}>
              Building a GCC requires more than technology procurement. Sniper brings together infrastructure, security, cloud, workplace and services to create a scalable, secure and operationally ready IT environment
            </p>
          </FadeUp>
        </div>

        <FadeUp delay={0.2} className="mt-10 sm:mt-14">
          <div
            ref={gridRef}
            data-play={inView}
            className="bp-grid grid grid-cols-1 gap-px p-px md:grid-cols-2 lg:grid-cols-4"
            style={{ backgroundColor: BP_LINE }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            {PROBLEMS.map((problem, i) => (
              <ProblemCell
                key={problem.title}
                problem={problem}
                index={i}
                active={activeIndex === i}
                onActivate={() => setActiveIndex(i)}
              />
            ))}
            <BlueprintRuler activeIndex={activeIndex} />
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

// ============================================================================
// ✦ PARTNERS SECTION — "Enterprise Technology Ecosystem".
//
// A filterable logo grid (6 columns on desktop). Every card is static:
// it stays white and shows only its full-color logo. The logo wrapper has
// one responsive size at each breakpoint, so all marks occupy the same
// centered visual area regardless of their source image dimensions.
//
// The two filter dropdowns are real `<select>` elements (native, so they
// behave correctly on mobile) filtering `PARTNERS` by `industry` and
// `technology`. The trailing "info" card (dot-grid icon) is decorative
// and always renders after whatever the current filter returns — it's
// not itself a partner, so it isn't part of the filtering.
// ============================================================================
interface Partner {
  name: string;
  // Replace with the real logo asset path when one is available.
  src: string;
  industry: string;
  technology: string;
}

const PARTNERS: Partner[] = [
  { name: "Lenovo", src: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Lenovo_%282015%29.svg", industry: "Hardware", technology: "Devices" },
  { name: "Dell", src: "https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg", industry: "Hardware", technology: "Devices" },
  { name: "Nvidia", src: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg", industry: "Hardware", technology: "AI & Compute" },
  { name: "HP", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Hewlett_Packard_Enterprise_logo_2025.svg/1280px-Hewlett_Packard_Enterprise_logo_2025.svg.png", industry: "Hardware", technology: "Devices" },
  { name: "Azure", src: azure, industry: "Cloud", technology: "Cloud & AI" },
  { name: "Yotta", src: yotta, industry: "Cloud", technology: "Data Center" },
  { name: "Cisco", src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg", industry: "Networking", technology: "Network & Security" },
  { name: "Yubico", src: yubico, industry: "Security", technology: "Identity & Access" },
  { name: "Jamf", src: jamf, industry: "Digital Workplace", technology: "Device Management" },
  { name: "Logitech", src: "https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg", industry: "Digital Workplace", technology: "Collaboration" },
  { name: "Poly", src: poly, industry: "Digital Workplace", technology: "Collaboration" },
  { name: "Apple", src: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", industry: "Digital Workplace", technology: "Devices" },
  { name: "Autodesk", src: "https://upload.wikimedia.org/wikipedia/commons/4/41/Autodesk_Logo_2021.svg", industry: "Software", technology: "Design & Engineering" },
  { name: "Adobe", src: "https://upload.wikimedia.org/wikipedia/commons/9/90/Adobe_Corporate_wordmark.svg", industry: "Software", technology: "Creative & Productivity" },
  { name: "Unity", src: unity, industry: "Software", technology: "3D & Simulation" },
  { name: "Trimble", src: trimble, industry: "Software", technology: "Design & Engineering" },
];

const PartnerCard = ({ partner }: { partner: Partner }) => (
  <div className="group relative flex aspect-square flex-col items-center justify-center bg-white p-4 sm:p-5">
    <img
      src={partner.src}
      alt={partner.name}
      className="h-7 w-20 object-contain sm:h-8 sm:w-24 lg:h-9 lg:w-28"
    />
    {/* mono micro-label — hidden until hover so the grid stays clean at
        rest but still reads as a spec sheet, not a plain logo wall. */}
    <span
      className="absolute inset-x-2 bottom-2 truncate text-center font-mono text-[9px] uppercase leading-none tracking-[0.06em] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{ color: MUTE }}
    >
      {partner.technology}
    </span>
  </div>
);

// Static (non-hover) closing card — dot-grid icon + the section's own
// value prop, matching the wide "info" cell in the reference mock. Spans
// 2 grid columns at every breakpoint so it reads as a deliberately wider
// card, not a partner logo.
const PartnersInfoCard = () => (
  <div className="col-span-2 flex flex-col justify-between bg-white p-5 sm:p-6" style={{ minHeight: "100%" }}>
    <div className="flex items-center justify-between border-b border-dashed pb-3" style={{ borderColor: BP_LINE }}>
      <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em]" style={{ color: MUTE }}>
        <span className="h-2 w-2 shrink-0" style={{ backgroundColor: RED }} />
        Ecosystem
      </span>
      <span className="font-mono text-[11px] tracking-[0.04em]" style={{ color: "#A3A3A6" }}>[05]</span>
    </div>
    <p className="mt-3 text-sm sm:text-base tracking-tight leading-relaxed" style={{ color: INK }}>
      Sniper partners with leading global technology providers to build secure, scalable, and
      future-ready GCC environments.
    </p>
    <div className="mt-4 grid w-fit grid-cols-3 gap-1.5 self-end" aria-hidden="true">
      {Array.from({ length: 9 }).map((_, i) => (
        <span key={i} className="h-1.5 w-1.5 rounded-lg" style={{ backgroundColor: RED }} />
      ))}
    </div>
  </div>
);

// Filter controls share one width rule so the two selects and the clear
// button sit in three equal columns that line up flush with the partner
// card grid below them. `w-full` + a 3-column grid on the parent does the
// elongating — no fixed widths anywhere.
const FILTER_SELECT_CLASS =
  "w-full appearance-none border-b bg-transparent pb-2 pr-8 text-sm sm:text-base tracking-tight outline-none transition-colors duration-300 focus:border-[#DC3327] cursor-pointer";

const PartnersFilterSelect = ({
  label, value, options, onChange,
}: { label: string; value: string; options: string[]; onChange: (v: string) => void }) => (
  <label className="relative block w-full">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={FILTER_SELECT_CLASS}
      style={{ borderColor: DIVIDER, color: INK }}
    >
      <option value="all">{label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    <ChevronDown
      className="pointer-events-none absolute right-1 top-0.5 h-4 w-4"
      style={{ color: INK }}
    />
  </label>
);

// Third control in the filter row — a plain compact button, not a
// stretched field. Sized to its own label, sits at the end of the row.
const PartnersClearFilter = ({
  active, onClear,
}: { active: boolean; onClear: () => void }) => (
  <CTAButton
    variant="secondary"
    size="sm"
    icon="close"
    onClick={onClear}
    disabled={!active}
    ariaLabel="Clear filters"
    className="shrink-0 self-start sm:self-end"
  >
    Clear Filter
  </CTAButton>
);

const PartnersSection = () => {
  const [industry, setIndustry] = useState("all");
  const [technology, setTechnology] = useState("all");

  const industries = Array.from(new Set(PARTNERS.map((p) => p.industry)));
  const technologies = Array.from(new Set(PARTNERS.map((p) => p.technology)));

  const filtered = PARTNERS.filter(
    (p) => (industry === "all" || p.industry === industry) &&
      (technology === "all" || p.technology === technology)
  );

  // Drives both the enabled/disabled look of the Clear Filter button and
  // the reset itself, so the two can never drift out of sync.
  const hasActiveFilter = industry !== "all" || technology !== "all";
  const clearFilters = () => {
    setIndustry("all");
    setTechnology("all");
  };

  return (
    <section
      className={SECTION_PADDING}
      style={{ backgroundColor: PAPER }}
    >
      <div className="mx-auto max-w-[1440px] w-full px-4 sm:px-6 lg:px-10">
        <FadeUp className="text-center">
          <Eyebrow align="center">Partners</Eyebrow>
        </FadeUp>

        <FadeUp delay={0.08} className="mx-auto mt-6 max-w-4xl text-center">
          <h2 className="text-[28px] sm:text-5xl md:text-5xl font-semibold tracking-tighter leading-[1.1]">
            <span style={{ color: INK }}>Enterprise </span>
            <span style={{ color: RED }}>Technology</span>
            <br />
            <span style={{ color: RED }}>Ecosystem</span>
          </h2>
        </FadeUp>

        <FadeUp delay={0.16} className="mx-auto mt-6 max-w-2xl text-center">
          <p className="text-[15px] sm:text-xl tracking-tight leading-relaxed" style={{ color: MUTE }}>
            Sniper partners with leading global technology providers to build secure, scalable,
            and future-ready GCC environments.
          </p>
        </FadeUp>

        <FadeUp delay={0.22} className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-4">
          <div className="w-full sm:flex-1">
            <PartnersFilterSelect label="All Industries" value={industry} options={industries} onChange={setIndustry} />
          </div>
          <div className="w-full sm:flex-1">
            <PartnersFilterSelect label="All Technologies" value={technology} options={technologies} onChange={setTechnology} />
          </div>
          <PartnersClearFilter active={hasActiveFilter} onClear={clearFilters} />
        </FadeUp>

        {/* ruler-style rule — echoes BlueprintRuler's dashed strip + corner
            marks from ProblemsSection, marking the hand-off into the grid. */}
        <div className="relative mt-8 hidden h-6 sm:mt-10 sm:block" aria-hidden="true">
          <Plus className="absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2" strokeWidth={1} style={{ color: INK }} />
          <Plus className="absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2" strokeWidth={1} style={{ color: INK }} />
          <div
            className="absolute inset-x-9 top-1/2 h-[5px] -translate-y-1/2"
            style={{ backgroundImage: `repeating-linear-gradient(to right, ${BP_LINE} 0 1px, transparent 1px 8px)` }}
          />
        </div>

        <FadeUp delay={0.28} className="mt-4 sm:mt-6">
          <div
            className="relative grid grid-cols-2 gap-px p-px sm:grid-cols-3 lg:grid-cols-6"
            style={{ backgroundColor: BP_LINE }}
          >
            {filtered.map((partner) => (
              <PartnerCard key={partner.name} partner={partner} />
            ))}
            <PartnersInfoCard />
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

// ============================================================================
// ✦ SOLUTIONS SECTION — "One Partner for GCC Infrastructure, Network, Security & Managed Support".
//
// A hoverable row list. Default state: paper background, dark text.
// Hover state: row fills red + grain texture, ALL text in that row turns
// white, and a cursor-following image preview fades/scales in next to the
// pointer (image src intentionally left blank — drop in real assets via
// the `image` field on each SOLUTIONS entry).
//
// IMPORTANT: color is driven by React state (`isActive`), not CSS
// `:hover` + Tailwind's `group-hover:*`. Inline `style` always wins over
// class-based CSS regardless of selector specificity, so a
// `group-hover:text-white` class can never override a sibling
// `style={{ color: INK }}` — that mismatch was the earlier bug. Passing
// the resolved color straight into `style` per render sidesteps it.
// ============================================================================
interface Solution {
  number: string;
  title: string;
  // Route of the matching service page (must match a <Route path> in the
  // app router). Rows WITHOUT an href render as plain, non-clickable rows.
  href?: string;
  description: string;
  // Fallback tint shown behind the preview image before a real asset is
  // wired up (and visible through any transparent PNG).
  swatch: string;
  // Import the real asset and assign it here, e.g.
  // image: enterpriseItImg (from "@/assets/solutions/enterprise-it.png")
  image: string;
}

// Row → service-page routing. Every `href` below must match a <Route path> in
// the app router — a wrong path sends visitors to a 404. Rows with no
// matching service page (04 Cybersecurity, 05 Digital Workplace) have no
// `href` and render as plain, non-clickable rows; add one when a page exists.
const SOLUTIONS: Solution[] = [
  {
    number: "01",
    title: "Enterprise IT Infrastructure",
    href: "/solutions/it-infrastructure",
    description:
      "Build a resilient IT foundation with enterprise servers, storage, virtualization, backup, and data center solutions.",
    swatch: "#2B2B2B",
    image: enterpriseIT,
  },
  {
    number: "02",
    title: "Cloud & AI Solutions",
    // NOTE: "clould" matches the route as currently registered in the router
    // (typo). If that route is renamed to /solutions/cloud-solutions, update
    // this href with it.
    href: "/solutions/clould-solutions",
    description:
      "Accelerate innovation through cloud migration, hybrid cloud, AI infrastructure, cloud optimization, and managed cloud services.",
    swatch: "#8C8C8C",
    image: cloudAi,
  },
  {
    number: "03",
    title: "Enterprise Networking",
    href: "/solutions/networking-solutions",
    description:
      "Design and deploy secure campus networks, SD-WAN, wireless infrastructure, structured cabling, and intelligent network management.",
    swatch: "#EFE8D3",
    image: networking,
  },
  {
    number: "04",
    title: "Cybersecurity",
    description:
      "Protect users, devices, applications, and data with comprehensive security solutions that reduce cyber risk and improve compliance.",
    swatch: "#706D63",
    image: cybersecurity,
  },
  {
    number: "05",
    title: "Digital Workplace",
    description:
      "Deliver seamless employee experiences through Apple, Microsoft, endpoint management, collaboration tools, meeting rooms, and mobility solutions.",
    swatch: "#1E1E1E",
    image: digitalWorkplace,
  },
  {
    number: "06",
    title: "Managed IT Services",
    href: "/solutions/managed-it-services",
    description:
      "Optimize operations with proactive monitoring, onsite and remote support, infrastructure management, and technology lifecycle services.",
    swatch: "#4D4D4D",
    image: managedItServices,
  },
  {
    number: "07",
    title: "Device Lifecycle Management",
    href: "/solutions/device-deployment-mdm",
    description:
      "Simplify IT asset management through procurement, deployment, MDM, asset tracking, buyback, secure data wiping, and responsible e-waste disposal.",
    swatch: "#3A3A3A",
    image: deviceLifecycle,
  },
];

const SolutionRow = ({
  solution, index, isActive, onEnter, onLeave,
}: {
  solution: Solution; index: number; isActive: boolean; onEnter: (i: number) => void; onLeave: () => void;
}) => {
  const { number, title, description, href } = solution;
  const textColor = isActive ? "#FFFFFF" : INK;
  const mutedColor = isActive ? "rgba(255,255,255,0.85)" : MUTE;

  const rowClass = `group relative flex items-center justify-between gap-6 sm:gap-10 overflow-hidden border-t border-dashed px-4 sm:px-8 py-7 sm:py-10 transition-colors duration-300 ${
    index === SOLUTIONS.length - 1 ? "border-b border-dashed" : ""
  } ${href ? "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2" : ""}`;
  const rowStyle = { borderColor: isActive ? "transparent" : BP_LINE, backgroundColor: isActive ? RED : "transparent", outlineColor: RED };

  const content = (
    <>
      <div className="relative z-10 flex items-baseline gap-4 sm:gap-8 min-w-0">
        <span
          className="shrink-0 font-mono text-[11px] sm:text-xs tracking-[0.04em] tabular-nums transition-colors duration-300"
          style={{ color: mutedColor }}
        >
          [{number}]
        </span>
        <h3
          className=" text-2xl sm:text-4xl md:text-4xl font-semibold tracking-tighter transition-colors duration-300"
          style={{ color: textColor }}
        >
          {title}
        </h3>
      </div>

      <div className="relative z-10 flex shrink-0 items-center gap-4 sm:gap-10">
        <p
          className="hidden max-w-xs text-left text-base tracking-tight leading-relaxed sm:block transition-colors duration-300"
          style={{ color: mutedColor }}
        >
          {description}
        </p>
        <ArrowUpRight
          className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 transition-colors duration-300"
          style={{ color: textColor }}
          strokeWidth={1.75}
        />
      </div>
    </>
  );

  return href ? (
    <Link
      to={href}
      aria-label={`${title} — view service`}
      className={rowClass}
      style={rowStyle}
      onMouseEnter={() => onEnter(index)}
      onMouseLeave={onLeave}
    >
      {content}
    </Link>
  ) : (
    <div className={rowClass} style={rowStyle} onMouseEnter={() => onEnter(index)} onMouseLeave={onLeave}>
      {content}
    </div>
  );
};

// Cursor-following image preview — mirrors the reference "modal" pattern,
// rebuilt on motion/react (already a project dependency) instead of GSAP.
// No rounded corners on the preview box, per the GCC "no rounded borders on
// buttons/cards/sections" rule — this is a floating card-like element.
const SolutionsImagePreview = ({
  activeIndex, x, y,
}: {
  activeIndex: number | null; x: ReturnType<typeof useMotionValue<number>>; y: ReturnType<typeof useMotionValue<number>>;
}) => {
  const active = activeIndex !== null;
  const current = active ? SOLUTIONS[activeIndex] : null;

  return (
    <motion.div
      className="pointer-events-none absolute z-20 hidden h-56 w-44 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.18)] sm:block"
      style={{ left: x, top: y, translateX: "-50%", translateY: "-50%" }}
      initial={{ scale: 0, opacity: 0 }}
      animate={active ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{ duration: 0.4, ease }}
    >
      {current && (
        <div className="relative h-full w-full" style={{ backgroundColor: current.swatch }}>
          {current.image && (
            <img
              src={current.image}
              alt={`${current.title} for Global Capability Centers`}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      )}
    </motion.div>
  );
};

const SolutionsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { damping: 26, stiffness: 220, mass: 0.4 });
  const springY = useSpring(cursorY, { damping: 26, stiffness: 220, mass: 0.4 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    cursorX.set(e.clientX - rect.left);
    cursorY.set(e.clientY - rect.top);
  };

  return (
    <section
      id="solutions"
      className={SECTION_PADDING}
      style={{ backgroundColor: PAPER }}
    >
      <div className="mx-auto max-w-[1440px] w-full px-4 sm:px-6 lg:px-10">
        <FadeUp>
          <Eyebrow>Solutions Provided</Eyebrow>
        </FadeUp>

        <FadeUp delay={0.08} className="mt-6 max-w-4xl">
          <h2 className="text-[28px] sm:text-5xl md:text-5xl font-semibold tracking-tighter leading-[1.1]">
            <span style={{ color: INK }}>One Partner for </span>
            <span style={{ color: RED }}>GCC</span>
            <span style={{ color: INK }}> Infrastructure, Network, Security &amp; Managed Support</span>
          </h2>
        </FadeUp>

        <FadeUp delay={0.16} className="mt-6 max-w-2xl">
          <p className="text-[15px] sm:text-xl tracking-tight leading-relaxed" style={{ color: MUTE }}>
            Each service maps to a practical GCC outcome — from infrastructure and networking to security, workplace technology and managed support — delivered through one accountable technology partner.
          </p>
        </FadeUp>

        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setActiveIndex(null)}
          className="relative mt-12 border border-dashed sm:mt-16"
          style={{ borderColor: BP_LINE }}
        >
          {["-left-[6px] -top-[6px]", "-right-[6px] -top-[6px]", "-bottom-[6px] -left-[6px]", "-bottom-[6px] -right-[6px]"].map((pos) => (
            <Plus key={pos} aria-hidden="true" strokeWidth={1} className={`pointer-events-none absolute z-20 hidden h-3.5 w-3.5 sm:block ${pos}`} style={{ color: INK }} />
          ))}
          {SOLUTIONS.map((solution, i) => (
            <SolutionRow
              key={solution.number}
              solution={solution}
              index={i}
              isActive={activeIndex === i}
              onEnter={setActiveIndex}
              onLeave={() => {}}
            />
          ))}

          <SolutionsImagePreview activeIndex={activeIndex} x={springX} y={springY} />
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// ✦ SNIPER APPROACH SECTION — hub-and-spoke infrastructure diagram.
//
// Replaces the earlier "redline" document metaphor and the standalone
// "Sniper vs. Traditional" comparison table (removed — it repeated the
// same five-vendor point already made here, so the second section had
// nothing new to say). This is now one diagram: Sniper sits at the
// center, and the five vendor relationships a traditional GCC setup has
// to run separately (procurement, hardware, network, security, support)
// all resolve into one connected partner.
//
// LAYOUT: `md:` and up render the landscape radial diagram — five node
// cards positioned with percentage-based absolute coordinates around a
// center hub, connected by a single shared SVG overlay
// (`viewBox="0 0 854 463"`, matching the node bounding box in the
// reference mock so the arrow endpoints line up with the cards without
// per-node math). Percentage positioning means the whole diagram scales
// as one unit with its container instead of needing per-breakpoint
// coordinates.
//
// Below `md`, `MobileApproachDiagram` abandons the radial wheel entirely
// and renders a vertical hub-and-spine list instead (see that
// component's own comment for why) — a portrait phone screen simply
// doesn't have the horizontal room for five wide text cards to radiate
// around a center point without either overlapping or truncating.
//
// The "Ask AI" bar at the bottom is carried over from the removed
// comparison section (same `ASK_AI_PROMPT`/`ASK_AI_OPTIONS`), rebuilt on
// the shared CTAButton (secondary, `shape="pill"`). The pill shape is a
// deliberate, documented exception to the page's square-corner rule — the
// reference mock shows these specific buttons fully rounded. Drop
// `shape="pill"` to square them off like every other button.
// ============================================================================
const ASK_AI_PROMPT =
  "Tell me about Sniper Systems and their GCC IT infrastructure solutions in India.";

interface AskAIOption {
  name: string;
  Icon: string;
  url: string;
}

// URL query params below are each assistant's own documented way to open
// a fresh chat with a prefilled prompt — no API keys, no embedding.
const ASK_AI_OPTIONS: AskAIOption[] = [
  { name: "ChatGPT", Icon: chatgpt, url: `https://chatgpt.com/?q=${encodeURIComponent(ASK_AI_PROMPT)}` },
  { name: "Claude", Icon: claude, url: `https://claude.ai/new?q=${encodeURIComponent(ASK_AI_PROMPT)}` },
  { name: "Gemini", Icon: gemini, url: `https://gemini.google.com/app?q=${encodeURIComponent(ASK_AI_PROMPT)}` },
];

const AskAIPillButton = ({ name, Icon, url }: AskAIOption) => (
  <CTAButton
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    variant="secondary"
    size="sm"
    shape="pill"
    icon="up-right"
    leading={
      // white chip keeps the brand logo legible on the red hover fill
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white sm:h-6 sm:w-6">
        <img src={Icon} alt={name} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </span>
    }
    className="shrink-0 whitespace-nowrap bg-white"
  >
    {name}
  </CTAButton>
);

interface ApproachNode {
  title: string;
  subtitle: string;
  Icon: typeof HardDrive;
  // Center point of the node card, as a percentage of the diagram box.
  // These and HUB_POSITION are the single source of truth for the whole
  // diagram — ApproachConnectors reads the same numbers to draw each
  // line, so the cards and the arrows can never drift out of alignment
  // with each other the way independently-eyeballed pixel coordinates
  // could. Chosen to mirror symmetrically around the hub: Support/
  // Network sit at equal distance left/right of center at the hub's own
  // height, Hardware/Security sit at equal distance left/right one row
  // down, and Procurement sits dead-center the same distance above the
  // hub that Hardware/Security sit below it.
  top: number;
  left: number;
}

const HUB_POSITION = { top: 52, left: 50 };

// Each node's subtitle is a short, title-specific description rather than
// a repeated generic label — keeps the card meaningful on its own instead
// of relying on the heading alone. Support/Network and Hardware/Security
// are also pulled in a few points from the earlier 14/86 and 24/76 split
// (still symmetric around the 50% center) so the outer two cards sit
// clear of the diagram's edge instead of crowding it.
// NOTE ON THE 90/28–90/72 → 80.7/33.4–80.7/66.6 CHANGE BELOW:
// The visible connector-line length (what ApproachConnectors actually
// draws, after pulling back off both the card and the hub — see
// nodeClearance()) is NOT the same as the raw top/left distance. A
// diagonal ray exits a wide/short card's rectangle much closer to its
// center than a horizontal or vertical ray does, so it gets far less
// pulled-back clearance — at the old 90/28 and 90/72 positions that made
// the two bottom lines render roughly TWICE as long as the top/left/
// right ones (~123px vs ~60–65px), which is the "lower two arms aren't
// equal to the other three" asymmetry. Moving Hardware/Security in to
// 80.7/33.4 and 80.7/66.6 keeps the same diagonal angle (so the layout
// still reads as two arms below the hub, just less far-flung) while
// shortening the raw distance enough that, once the same clearance math
// runs, all five visible lines land within a few px of ~60px — solved
// with a position change only, no change to ApproachConnectors itself.
const APPROACH_NODES: ApproachNode[] = [
  { title: "Procurement & BuyBack", subtitle: "Sourcing to secure buyback", Icon: PackageCheck, top: 14, left: 50 },
  { title: "Support Vendor", subtitle: "Onsite & remote helpdesk", Icon: Headphones, top: 52, left: 18 },
  { title: "Network Vendor", subtitle: "Design, rollout & monitoring", Icon: Network, top: 52, left: 82 },
  { title: "Hardware Vendor", subtitle: "Devices sized & deployed", Icon: HardDrive, top: 80.7, left: 33.4 },
  { title: "Security Vendor", subtitle: "Compliance-ready protection", Icon: ShieldCheck, top: 80.7, left: 66.6 },
];

const ApproachNodeCard = ({ node }: { node: ApproachNode }) => {
  const { title, subtitle, Icon, top, left } = node;
  return (
    <div
      className="absolute z-10 flex w-max -translate-x-1/2 -translate-y-1/2 items-start gap-3 whitespace-nowrap bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] sm:px-5 sm:py-4"
      style={{ top: `${top}%`, left: `${left}%` }}
    >
      <Icon className="h-5 w-5 shrink-0 translate-y-[2px] sm:h-6 sm:w-6" style={{ color: INK }} strokeWidth={1.5} />
      <div>
        <p className="text-sm font-medium tracking-tight sm:text-base" style={{ color: INK }}>
          {title}
        </p>
        <p className="text-xs tracking-tight sm:text-sm" style={{ color: MUTE }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
};

// Center hub — dark circle carrying the real Sniper logo mark (no glow,
// no text wordmark). Positioned from the same HUB_POSITION the connectors
// use, rather than a separate hardcoded `top-[54%]`.
const ApproachHub = () => (
  <div
    className="absolute z-10 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ring-1 ring-white/10 sm:h-32 sm:w-32"
    style={{ top: `${HUB_POSITION.top}%`, left: `${HUB_POSITION.left}%`, backgroundColor: "#2B2B2B" }}
  >
    <img
      src={sniper}
      alt="Sniper Systems"
      className="h-10 w-10 object-contain sm:h-24 sm:w-24"
    />
  </div>
);

// Diagram geometry — real pixel space matching the diagram box's own
// `aspect-[854/463]` (see ApproachSection below), not a 0–100 square.
// Doing the line math here (rather than in a stretched viewBox with
// `preserveAspectRatio="none"`) is what keeps the arrowhead marker a
// clean, unskewed chevron instead of a lopsided shape warped by uneven
// x/y scaling.
const DIAGRAM_WIDTH = 854;
const DIAGRAM_HEIGHT = 463;
// How far each line pulls back from the node/hub center before it's
// drawn, so the arrowhead lands in the open gap instead of being drawn
// underneath — and hidden by — an opaque card.
//
// This used to be one flat NODE_CLEARANCE radius applied in every
// direction. That's correct for the horizontal nodes (Support/Network),
// where the card is wide enough that a 100px pull-back still lands just
// inside its edge — the leftover bit of line is hidden behind the opaque
// card, so there's no visible gap. But a rectangular card's real edge is
// much closer to its center along a diagonal: the short/wide card shape
// means a 45°-ish ray exits through the top/bottom edge almost
// immediately. A flat 100px radius overshoots that by a lot, so the
// diagonal lines (Hardware/Security) started in empty space well clear
// of their cards — a large stretch of "missing" line between the card
// and where the stroke actually began.
//
// Fix: treat each card as an axis-aligned rectangle (half-width ×
// half-height, approximate but close to the real rendered card box) and
// pull back exactly to where the ray toward the hub would exit that
// rectangle, plus a small fixed gap for breathing room. Works correctly
// for horizontal, vertical, and diagonal nodes alike, instead of only
// happening to work for horizontal ones.
const NODE_HALF_WIDTH = 132;
const NODE_HALF_HEIGHT = 40;
const NODE_GAP = 14;
const HUB_CLEARANCE = 62;

const nodeClearance = (ux: number, uy: number) =>
  Math.min(NODE_HALF_WIDTH / Math.abs(ux || 1e-6), NODE_HALF_HEIGHT / Math.abs(uy || 1e-6)) + NODE_GAP;

const toPx = ({ top, left }: { top: number; left: number }) => ({
  x: (left / 100) * DIAGRAM_WIDTH,
  y: (top / 100) * DIAGRAM_HEIGHT,
});

// Connecting arrows — one shared SVG overlay rather than five separately
// rotated/positioned line elements. Each line is pulled back off both its
// node and the hub by a fixed clearance, and animates in with a
// left-to-right "draw" via `pathLength` (mirrors the FadeUp pattern used
// everywhere else on this page, just applied to an SVG stroke instead of
// opacity/y).
const ApproachConnectors = () => {
  const hub = toPx(HUB_POSITION);

  return (
    <svg
      viewBox={`0 0 ${DIAGRAM_WIDTH} ${DIAGRAM_HEIGHT}`}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        {/* Open chevron rather than a solid triangle — reads lighter and
            more "engineered", with the accent color doing the work
            instead of a heavy filled shape. */}
        <marker
          id="approach-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6.5"
          markerHeight="6.5"
          orient="auto"
        >
          <path
            d="M1 1 L8.5 5 L1 9"
            fill="none"
            stroke={INK}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>

      {APPROACH_NODES.map((node, i) => {
        const point = toPx(node);
        const dx = hub.x - point.x;
        const dy = hub.y - point.y;
        const dist = Math.hypot(dx, dy) || 1;
        const ux = dx / dist;
        const uy = dy / dist;

        const x1 = point.x + ux * nodeClearance(ux, uy);
        const y1 = point.y + uy * nodeClearance(ux, uy);
        const x2 = hub.x - ux * HUB_CLEARANCE;
        const y2 = hub.y - uy * HUB_CLEARANCE;

        return (
          <motion.line
            key={node.title}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={INK}
            strokeWidth={1.5}
            strokeLinecap="round"
            markerEnd="url(#approach-arrow)"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease, delay: 0.3 + i * 0.08 }}
          />
        );
      })}
    </svg>
  );
};

// < md — a vertical hub-and-spine list, not a shrunk copy of the
// desktop wheel. A radial layout needs real horizontal room on both
// sides of the hub for every card; a phone screen only has ~300–380px
// total, which is enough for ONE wide text card per row, not two facing
// each other across a center point. Forcing five wide cards to radiate
// in 2D inside that width is what produced the overlap and clipped text
// in the previous two passes (Hardware/Security colliding, subtitles
// cut off mid-word) — the geometry was fighting the viewport, not
// working with it.
//
// This redesign drops the "wheel" metaphor for mobile and uses the
// shape the content and the viewport actually agree on: a single
// vertical spine running down from the hub, with each vendor as a full-
// width row branching off it, alternating left/right of the spine like
// a timeline. Every row gets its full card width to itself, so text can
// wrap naturally instead of needing to be pre-shortened or truncated,
// and there is no coordinate math to keep in sync — it's a plain flex
// column, so it can never overlap or clip regardless of how long a
// title/subtitle turns out to be at a given font size.
// Kept short/punchy specifically for the compact mobile card — not a
// geometry workaround anymore (rows can wrap freely now), just a nicer
// one-line read at this size than the fuller desktop phrasing.
const MOBILE_SUBTITLES: Record<string, string> = {
  "Procurement & BuyBack": "Full lifecycle",
  "Support Vendor": "Helpdesk support",
  "Network Vendor": "Rollout & monitoring",
  "Hardware Vendor": "Sizing & deployment",
  "Security Vendor": "Compliance ready",
};

const MOBILE_APPROACH_NODES: ApproachNode[] = APPROACH_NODES.map((node) => ({
  ...node,
  subtitle: MOBILE_SUBTITLES[node.title] ?? node.subtitle,
}));

// Single consistent row style for every vendor — icon-left, text-left,
// same as the desktop card, just full width. The previous pass tried an
// alternating left/right zigzag; that needs a `justify-content` +
// `flex-row-reverse` pairing to flip per row, and those two ended up
// fighting each other on the "left" rows — icon pushed clean outside
// the card. One row style, used for every item, removes that whole
// class of bug: there's no direction to get backwards.
const MobileApproachRow = ({ node, index }: { node: ApproachNode; index: number }) => {
  const { title, subtitle, Icon } = node;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease, delay: 0.15 + index * 0.08 }}
    >
      {/* junction dot — sits on the spine, right where it meets this
          card's top edge, marking the branch point. */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-0 z-10 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ backgroundColor: RED }}
      />
      <div className="flex items-start gap-3 bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
        <Icon className="h-5 w-5 shrink-0 translate-y-[2px]" style={{ color: INK }} strokeWidth={1.5} />
        <div className="min-w-0">
          <p className="text-sm font-medium leading-snug tracking-tight" style={{ color: INK }}>
            {title}
          </p>
          <p className="mt-0.5 text-xs leading-snug tracking-tight" style={{ color: MUTE }}>
            {subtitle}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Hub — same mark and dark fill as desktop, just sized down for a
// narrower column. Centered above the spine; the spine's top edge
// starts right at the hub's bottom edge (see MobileApproachDiagram) so
// the "flow" from hub into the vendor list reads as one continuous
// line rather than a gap.
const MobileApproachHub = () => (
  <div
    className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full ring-1 ring-white/10"
    style={{ backgroundColor: "#2B2B2B" }}
  >
    <img src={sniper} alt="Sniper Systems" className="h-9 w-9 object-contain" />
  </div>
);

const MobileApproachDiagram = () => (
  <div className="relative mx-auto mt-10 w-full max-w-sm md:hidden">
    <MobileApproachHub />

    {/* central spine — runs straight down the middle from the hub,
        behind every card (each card is ~100% of this container's
        width), with a red dot popping out at the top edge of each card
        to mark where it "branches" off the line. absolute + inset-y-0
        against the relative wrapper below means its height always
        matches the row list exactly, however tall wrapped titles push
        it, instead of a hardcoded pixel height that could fall short. */}
    <div className="relative mt-1 pb-2">
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
        style={{ backgroundColor: DIVIDER }}
      />
      <div className="flex flex-col gap-6 pt-6">
        {MOBILE_APPROACH_NODES.map((node, i) => (
          <MobileApproachRow key={node.title} node={node} index={i} />
        ))}
      </div>
    </div>
  </div>
);

const ApproachSection = () => (
  <section
    className={SECTION_PADDING}
    style={{ backgroundColor: PAPER }}
  >
    <div className="mx-auto max-w-[1440px] w-full px-4 sm:px-6 lg:px-10">
      <FadeUp className="text-center">
        <Eyebrow align="center">Enterprise positioning</Eyebrow>
      </FadeUp>

      <FadeUp delay={0.08} className="mx-auto mt-6 max-w-3xl text-center">
        <h2 className="text-[28px] sm:text-5xl md:text-5xl font-semibold tracking-tighter leading-[1.1]">
          <span style={{ color: INK }}>The infrastructure layer is what lets a center </span>
          <span style={{ color: RED }}>move as one.</span>
        </h2>
      </FadeUp>

      <FadeUp delay={0.16} className="mx-auto mt-6 max-w-2xl text-center">
        <p className="text-[15px] sm:text-xl tracking-tight leading-relaxed" style={{ color: MUTE }}>
          Sniper brings the physical, digital and operational pieces together so global teams can
          connect, employees can be provisioned, data can be protected, workloads can scale and
          service continuity can be maintained.
        </p>
      </FadeUp>

      <FadeUp delay={0.24}>
        <div
          className="relative mx-auto mt-12 hidden aspect-[854/463] w-full max-w-4xl border border-dashed md:block lg:max-w-5xl sm:mt-16"
          style={{ borderColor: BP_LINE }}
        >
          {["-left-[6px] -top-[6px]", "-right-[6px] -top-[6px]", "-bottom-[6px] -left-[6px]", "-bottom-[6px] -right-[6px]"].map((pos) => (
            <Plus key={pos} aria-hidden="true" strokeWidth={1} className={`absolute z-20 h-3.5 w-3.5 ${pos}`} style={{ color: INK }} />
          ))}
          <span
            className="absolute left-4 top-4 z-20 font-mono text-[10px] uppercase tracking-[0.08em]"
            style={{ color: MUTE }}
          >
            GCC Delivery Network
          </span>
          <ApproachConnectors />
          {APPROACH_NODES.map((node) => (
            <ApproachNodeCard key={node.title} node={node} />
          ))}
          <ApproachHub />
        </div>

        <MobileApproachDiagram />
      </FadeUp>

      <FadeUp delay={0.32} className="mt-14 border-t border-dashed pt-8 sm:mt-20" style={{ borderColor: BP_LINE }}>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex gap-4">
            <span className="w-0.5 shrink-0 self-stretch" style={{ backgroundColor: RED }} aria-hidden="true" />
            <div>
              <p className="text-lg font-semibold tracking-tight sm:text-xl" style={{ color: INK }}>
                Ask AI about Sniper Systems &amp; Solutions
              </p>
              <p className="mt-1 text-sm tracking-tight sm:text-base" style={{ color: MUTE }}>
                Get instant answers, compare or explore use cases
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {ASK_AI_OPTIONS.map((option) => (
              <AskAIPillButton key={option.name} {...option} />
            ))}
          </div>
        </div>
      </FadeUp>
    </div>
  </section>
);

// ============================================================================
// ✦ WORK PROCESS SECTION — "Define Strategy / Build Infrastructure /
//   Optimize Operations / Scale Globally".
//
// Replaces the earlier dark-tile version. Per the approved mock this is now
// a light card row: white card, oversized ghost number top-left, a custom
// two-tone geometric mark centered, and the step name pinned to the bottom.
//
// HOVER STATE (what card 02 shows in the mock):
//   1. the card scales up slightly (`hover:scale-[1.05]`) and lifts on a
//      soft shadow, with `hover:z-10` so it overlaps its neighbours instead
//      of being clipped by them;
//   2. the description expands open underneath the title — done with the
//      `grid-rows-[0fr] → [1fr]` trick rather than `max-h-0 → max-h-40`,
//      because a max-height guess either clips long copy or leaves dead
//      space when the copy is short. `0fr → 1fr` animates to the text's own
//      measured height, so it's exact at every breakpoint;
//   3. a red bar grows from 0 → 10px along the bottom edge — it's part of
//      the card (absolutely positioned inside it), same conjoined treatment
//      as ProblemCard, not a detached strip.
//
// The grid uses `items-center` so a scaling card grows symmetrically up and
// down rather than shoving the row baseline around.
//
// ICONS: these marks aren't in lucide, so they're small local SVG components
// below. They all share one 100×100 viewBox, take `className` for sizing, and
// use only INK / RED / ICON_GREY so they stay in the page's palette. If the
// real marks get exported from Figma, swap each component's body for the
// exported paths — sizing is applied from the card, so they drop straight in.
// ============================================================================

// Pale grey shared by the light half of each mark.
const ICON_GREY = "#D6D6D6";
// Slightly lighter than ICON_GREY — used only for the step numbers so they
// read as background texture rather than as content.
const STEP_NUMBER = "#E2E2E2";

type IconProps = { className?: string };

// 01 — a bearing: grey dial, two-tone needle split red/ink. Strategy: fixing
// a direction before anything is built.
const BearingMark = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <circle cx="50" cy="50" r="38" fill={ICON_GREY} />
    <path d="M50 14 62 50 50 58 38 50Z" fill={RED} />
    <path d="M50 86 38 50 50 42 62 50Z" fill={INK} />
    <circle cx="50" cy="50" r="6" fill="#FFFFFF" />
  </svg>
);

// 02 — a stacked server rack. Infrastructure: the physical/network layers
// that get deployed together, with an LED indicator on each unit.
const DomesMark = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <rect x="16" y="14" width="68" height="20" rx="2" fill={ICON_GREY} />
    <rect x="16" y="40" width="68" height="20" rx="2" fill={ICON_GREY} />
    <rect x="16" y="66" width="68" height="20" rx="2" fill={RED} />
    <circle cx="28" cy="24" r="3.5" fill="#FFFFFF" />
    <circle cx="28" cy="50" r="3.5" fill="#FFFFFF" />
    <circle cx="28" cy="76" r="3.5" fill="#FFFFFF" />
  </svg>
);

// 03 — a padlock: grey body, ink shackle, red keyhole. Security: the
// environment locked down before it carries day-to-day operations. Same
// grey-base + ink-contrast + red-accent composition as the other marks.
const ShieldMark = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <path
      d="M32 46V34C32 20.7452 40.9543 10 52 10C63.0457 10 72 20.7452 72 34V46"
      fill="none"
      stroke={INK}
      strokeWidth="9"
      strokeLinecap="round"
    />
    <rect x="18" y="46" width="64" height="44" rx="8" fill={ICON_GREY} />
    <circle cx="50" cy="63" r="7" fill={RED} />
    <rect x="47" y="63" width="6" height="15" rx="3" fill={RED} />
  </svg>
);

// 04 — a gauge with a needle pointing toward the top of its range.
// Operations: performance being measured and kept in the optimal zone.
const OrbitMark = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <path
      d="M12 62A38 38 0 0 1 88 62"
      fill="none"
      stroke={ICON_GREY}
      strokeWidth="12"
      strokeLinecap="round"
    />
    <path
      d="M50 58 68 32"
      stroke={RED}
      strokeWidth="6"
      strokeLinecap="round"
    />
    <circle cx="50" cy="58" r="8" fill={INK} />
  </svg>
);

// 05 — a globe with a marker. Scale: the same setup reaching new sites
// without changing shape.
const ScaleMark = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <circle cx="46" cy="50" r="36" fill={ICON_GREY} />
    <ellipse
      cx="46"
      cy="50"
      rx="15"
      ry="36"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="3"
    />
    <line x1="10" y1="50" x2="82" y2="50" stroke="#FFFFFF" strokeWidth="3" />
    <line x1="16" y1="30" x2="76" y2="30" stroke="#FFFFFF" strokeWidth="2" />
    <line x1="16" y1="70" x2="76" y2="70" stroke="#FFFFFF" strokeWidth="2" />
    <circle cx="72" cy="28" r="10" fill={RED} />
  </svg>
);

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  Mark: React.ComponentType<IconProps>;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Define Strategy",
    description:
      "We map seat counts, security mandates and growth targets into a technology plan before a single device is ordered.",
    Mark: BearingMark,
  },
  {
    number: "02",
    title: "Build Infrastructure",
    description:
      "Network, compute, security and workplace IT are deployed together under one contract — across seven locations in India.",
    Mark: DomesMark,
  },
  {
    number: "03",
    title: "Secure the Environment",
    description:
      "Endpoints, identity, network and data are locked down against a compliance-ready baseline before the center goes live.",
    Mark: ShieldMark,
  },
  {
    number: "04",
    title: "Optimize Operations",
    description:
      "Proactive monitoring, onsite and remote support, and lifecycle management keep the center running against its SLAs.",
    Mark: OrbitMark,
  },
  {
    number: "05",
    title: "Scale Globally",
    description:
      "Add seats, sites or workloads without re-architecting — the stack is sized to double headcount without breaking support.",
    Mark: ScaleMark,
  },
];

// ============================================================================
// ✦ WORK PROCESS SECTION — v2
//
// Five cards became one object: a single bordered rail, split into five
// panels, with only one panel "open" at a time — hover/focus on pointer
// and keyboard, tap on touch. Inactive panels compress to a rotated
// number + title; the active panel reveals the Mark, title and
// description. Reuses PROCESS_STEPS, the Mark components, STEP_NUMBER/
// ICON_GREY, INK/RED/MUTE/DIVIDER, Eyebrow, FadeUp and `ease` from above.
// ============================================================================

const ProcessRailPanel = ({
  step,
  isActive,
  onActivate,
}: {
  step: ProcessStep;
  isActive: boolean;
  onActivate: () => void;
}) => {
  const { number, title, description, Mark } = step;

  return (
    <div
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className={`
        group relative flex flex-col overflow-hidden bg-white
        transition-[flex-grow,flex-basis,max-height] duration-700
        ease-[cubic-bezier(0.16,1,0.3,1)]
        sm:h-full sm:max-h-none
        ${isActive ? "max-h-[600px] sm:flex-[3.2]" : "max-h-20 sm:flex-[1]"}
      `}
    >
      {/* ghost numeral — present at every breakpoint once a panel is
          active, sized for the panel it's actually in: a compact desktop
          watermark while collapsed, and a bigger bleed-off-the-edge
          treatment once active (mobile gets its own, smaller "big number"
          than desktop's, since it's sitting in a full-width card instead
          of a wide rail panel). */}
      <span
        aria-hidden="true"
        className={`
          pointer-events-none absolute select-none
          font-semibold leading-none tracking-tighter
          transition-[right,top,font-size] duration-700
          ease-[cubic-bezier(0.16,1,0.3,1)]
          ${
            isActive
              ? "right-1 -top-2 text-7xl sm:right-1 sm:-top-4 sm:text-[7rem] lg:text-[8.5rem]"
              : "hidden right-4 top-4 text-5xl sm:block"
          }
        `}
        style={{ color: STEP_NUMBER }}
      >
        {number}
      </span>

      {/* mobile accordion trigger — only the collapsed rows keep this
          compact number/title/chevron header; the active row drops it in
          favour of the full expanded content below, matching a plain
          accordion rather than a header that stays pinned above its own
          answer. */}
      <button
        type="button"
        onClick={onActivate}
        aria-expanded={isActive}
        className={`
          relative z-10 w-full items-center gap-4 p-5 text-left sm:hidden
          ${isActive ? "hidden" : "flex"}
        `}
      >
        <span
          className="text-3xl font-semibold tracking-tighter"
          style={{ color: ICON_GREY }}
        >
          {number}
        </span>
        <span
          className="flex-1 text-lg font-medium tracking-tight"
          style={{ color: INK }}
        >
          {title}
        </span>
        <ChevronDown className="h-5 w-5 shrink-0" style={{ color: MUTE }} />
      </button>

      {/* Inactive desktop/tablet panels keep the original rail behaviour,
          with a stronger centered icon and a title anchored to the bottom.
          The mobile accordion remains separate above. */}
      <div
        className={`
          absolute inset-0 hidden sm:block transition-opacity duration-500
          ${isActive ? "opacity-0" : "opacity-100 delay-150"}
        `}
      >
        <Mark className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 lg:h-32 lg:w-32" />
        <span
          className="absolute inset-x-5 bottom-6 text-center text-lg font-semibold leading-tight tracking-tighter lg:bottom-7 lg:text-2xl"
          style={{ color: INK }}
        >
          {title}
        </span>
      </div>

      {/* expanded content — mark, title, description. Title only shows on
          mobile now that the accordion header disappears when a row opens
          (on desktop the header was always the separate vertical label, so
          this has always been its only place to show the title there). */}
      <div
        className={`
          relative z-10 flex flex-col justify-end p-6 sm:h-full sm:justify-end sm:p-8
          transition-opacity duration-500
          ${isActive ? "opacity-100 delay-150" : "pointer-events-none opacity-0"}
        `}
      >
        <Mark className="h-14 w-14 sm:h-20 sm:w-20" />

        <h3
          className="mt-4 text-[26px] font-semibold leading-[1.05] tracking-tighter sm:mt-6 sm:text-[32px]"
          style={{ color: INK }}
        >
          {title}
        </h3>

        <p
          className="mt-3 max-w-sm text-sm leading-relaxed tracking-tight sm:text-base"
          style={{ color: MUTE }}
        >
          {description}
        </p>
      </div>

      {/* active-state left rule — mobile only; the stacked accordion needs
          its own edge marker since desktop's cards sit side by side and
          rely on the bottom rule alone. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 transition-[width] duration-500 ease-out sm:hidden"
        style={{ backgroundColor: RED, width: isActive ? 4 : 0 }}
      />

      {/* active-state bottom rule — same conjoined red-bar treatment as the
          old cards, now marking the one open panel instead of every card */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 transition-[height] duration-500 ease-out"
        style={{ backgroundColor: RED, height: isActive ? 4 : 0 }}
      />
    </div>
  );
};

const WorkProcessSection = () => {
  const [active, setActive] = useState(0);

  return (
    <section
      className={SECTION_PADDING}
      style={{ backgroundColor: PAPER }}
    >
      <div className="mx-auto max-w-[1440px] w-full px-4 sm:px-6 lg:px-10">
        <FadeUp>
          <Eyebrow>Work Process</Eyebrow>
        </FadeUp>

        <FadeUp delay={0.08} className="mt-6 max-w-4xl">
          <h2 className="text-[28px] sm:text-5xl md:text-5xl font-semibold tracking-tighter leading-[1.1]">
            <span style={{ color: INK }}>One accountable partner for the <span style={{ color: RED }}>technology  workstream </span></span>
            
          </h2>
        </FadeUp>

        <FadeUp delay={0.16} className="mt-6 max-w-2xl">
          <p
            className="text-[15px] sm:text-xl tracking-tight leading-relaxed"
            style={{ color: MUTE }}
          >
            Sniper is not a generalist GCC consultancy. We focus on the technology environment behind the center—and stay close from architecture through day-to-day operations.
          </p>
        </FadeUp>

        <FadeUp delay={0.24} className="relative mt-12 sm:mt-16">
          {["-left-[6px] -top-[6px]", "-right-[6px] -top-[6px]", "-bottom-[6px] -left-[6px]", "-bottom-[6px] -right-[6px]"].map((pos) => (
            <Plus key={pos} aria-hidden="true" strokeWidth={1} className={`absolute z-20 hidden h-3.5 w-3.5 sm:block ${pos}`} style={{ color: INK }} />
          ))}
          <div
            className="flex w-full flex-col divide-y divide-dashed border border-dashed sm:h-[520px] sm:flex-row sm:divide-x sm:divide-y-0"
            style={{ borderColor: BP_LINE }}
          >
            {PROCESS_STEPS.map((step, i) => (
              <ProcessRailPanel
                key={step.title}
                step={step}
                isActive={active === i}
                onActivate={() => setActive(i)}
              />
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

// ============================================================================
// ✦ INDUSTRY SOLUTIONS SECTION — "Why GCC Technology portfolio".
//
// Two-up layout: a static highlight card (left) beside an Instagram-Story-
// style auto-advancing slider (right) that cycles through the industries
// Sniper serves. Sits directly after WorkProcessSection per the reference
// mock, and reuses the page's existing tokens/components (Eyebrow, FadeUp,
// CTAButton, NOISE_BG) rather than inventing new ones.
//
// STORY MECHANICS: each top segment represents one slide. The active
// segment fills left→right over STORY_SLIDE_DURATION and then the slider
// auto-advances — exactly like an Instagram/WhatsApp status bar. Unlike a
// segment driven purely by a CSS transition, the fill is driven by a real
// elapsed-time counter (`elapsedRef`, ticked every STORY_TICK_INTERVAL),
// so hovering the card can freeze it *exactly* where it is (no snapping to
// 0% or 100%) and resume from that same point on mouse-leave, rather than
// restarting the slide. Clicking any segment — including ones already
// passed or not yet reached — jumps straight to that slide and resets the
// timer, so a skipped/missed slide is always one click away.
// ============================================================================
interface IndustrySlide {
  title: string;
  description: string;
  // Placeholder asset path, following the same convention as SOLUTIONS/
  // PARTNERS/CASE_STUDIES elsewhere in this file — swap in real industry
  // photography per slide.
  image: string;
  // Route of the matching industry page (must match a <Route path>). Slides
  // without one (no industry page yet) stay non-clickable.
  href?: string;
}

const INDUSTRY_SLIDES: IndustrySlide[] = [
  {
    title: "Technology & Software",
    href: "/industries/it-ites-infra",
    description:
      "A comprehensive suite of enterprise-grade tools, cloud services, accelerators and support.",
    image: technology,
  },
  {
    title: "Banking & Financial Services",
    description:
      "Secure, compliant infrastructure built for high-availability financial operations.",
    image: Banking,
  },
  {
    title: "Healthcare & Life Sciences",
    href: "/industries/healthcare-pharma",
    description:
      "Compliant environments that protect patient data without slowing down research.",
    image: healthcare,
  },
  {
    title: "Manufacturing & Automotive",
    href: "/industries/manufacturing-automotive",
    description:
      "Resilient plant-floor connectivity and OT/IT integration at enterprise scale.",
    image: automotive,
  },
  {
    title: "Engineering & AEC",
    href: "/industries/aec",
    description:
      "GPU-ready workstations and licensing sized for CAD, BIM, and simulation workloads.",
    image: engineering ,
  },
  {
    title: "Retail & E-commerce",
    description:
      "Always-on infrastructure built to hold through peak traffic and seasonal demand.",
    image: Ecommerce,
  },
];

const STORY_SLIDE_DURATION = 5000; // ms an autoplaying slide stays active
const STORY_TICK_INTERVAL = 50; // ms between progress updates

// Top segment row — one bar per slide. Fully filled = already played,
// filling = active, empty = upcoming. Every segment is independently
// clickable so any slide is reachable regardless of autoplay position.
const IndustryStorySegments = ({
  count, currentIndex, progress, onSelect,
}: {
  count: number; currentIndex: number; progress: number; onSelect: (index: number) => void;
}) => (
  <div className="absolute inset-x-6 top-6 z-20 flex gap-2 sm:inset-x-8 sm:top-8">
    {Array.from({ length: count }).map((_, i) => {
      const fill = i < currentIndex ? 100 : i === currentIndex ? progress : 0;
      return (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === currentIndex}
          className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/30"
        >
          <span
            className="block h-full rounded-full bg-white"
            style={{ width: `${fill}%` }}
          />
        </button>
      );
    })}
  </div>
);

const IndustryStoryCard = ({ slides }: { slides: IndustrySlide[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const elapsedRef = useRef(0);

  const goTo = (index: number) => {
    setCurrentIndex(((index % slides.length) + slides.length) % slides.length);
  };

  // Reset the elapsed-time counter whenever the active slide changes —
  // whether that's autoplay advancing or a manual segment click.
  useEffect(() => {
    elapsedRef.current = 0;
    setProgress(0);
  }, [currentIndex]);

  // Advance the active segment's fill on a real timer (not a CSS
  // transition) so pausing on hover freezes it mid-fill instead of
  // snapping, and resuming continues from the same point.
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      elapsedRef.current += STORY_TICK_INTERVAL;
      const pct = Math.min(100, (elapsedRef.current / STORY_SLIDE_DURATION) * 100);
      setProgress(pct);
      if (pct >= 100) {
        setCurrentIndex((i) => (i + 1) % slides.length);
      }
    }, STORY_TICK_INTERVAL);
    return () => clearInterval(id);
  }, [currentIndex, isPaused, slides.length]);

  const active = slides[currentIndex];

  const caption = (
    <>
      <h3 className="flex items-center gap-2 text-2xl font-semibold tracking-tighter text-white sm:text-3xl">
        {active.title}
        {active.href && (
          <ArrowUpRight
            aria-hidden="true"
            className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 sm:h-6 sm:w-6"
            strokeWidth={1.75}
          />
        )}
      </h3>
      <p className="mt-2 max-w-md text-sm tracking-tight leading-relaxed text-white/75 sm:text-base">
        {active.description}
      </p>
    </>
  );

  return (
    <div
      className="relative h-[480px] overflow-hidden bg-[#1B0B0B] sm:h-[560px] lg:h-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <IndustryStorySegments
        count={slides.length}
        currentIndex={currentIndex}
        progress={progress}
        onSelect={goTo}
      />

      {/* mono index chip + corner marks — same registration-mark language
          as the hero/Problems/Approach frames, in white for this dark
          full-bleed card. Sits above the photo (z-20) but doesn't touch
          the crossfade or segment-bar logic. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-6 z-20 font-mono text-[10px] uppercase tracking-[0.08em] text-white/70 sm:right-8 sm:top-8"
      >
        [0{currentIndex + 1}/0{slides.length}]
      </span>
      {["left-3 bottom-3", "right-3 bottom-3"].map((pos) => (
        <Plus key={pos} aria-hidden="true" strokeWidth={1} className={`pointer-events-none absolute z-20 h-3 w-3 text-white/40 ${pos}`} />
      ))}

      {/* slide photo — crossfades between industries instead of a hard cut */}
      <AnimatePresence>
        <motion.div
          key={active.title}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${active.image})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease }}
        />
      </AnimatePresence>

      {/* legibility gradient — text sits over the bottom third of the photo */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(10,8,8,0.05) 0%, rgba(10,8,8,0.35) 55%, rgba(10,8,8,0.85) 100%)",
        }}
      />

      {/* grain — same NOISE_BG texture used on every other card on this page */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-20 mix-blend-overlay"
        style={{ backgroundImage: NOISE_BG }}
      />

      {/* Caption. The wrapper is pointer-events-none so it doesn't sit on top
          of (and swallow clicks meant for) the progress segments above it;
          when the slide has an industry page, the caption itself is a
          router link and opts back in with pointer-events-auto. */}
      <div className="pointer-events-none relative z-20 flex h-full flex-col justify-end p-6 sm:p-8">
        {active.href ? (
          <Link
            to={active.href}
            aria-label={`Explore ${active.title}`}
            className="group pointer-events-auto block w-fit max-w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{ outlineColor: "#fff" }}
          >
            {caption}
          </Link>
        ) : (
          caption
        )}
      </div>
    </div>
  );
};

// Shared CTA row for the Service-Provided / "Why GCC Technology portfolio"
// section. It's rendered in two different places depending on viewport
// (see IndustryHighlightCard directly below, and IndustrySolutionsSection
// further down), so it's its own component instead of being written twice:
//
//   < lg  — a full-width, evenly split pair of buttons (`flex-1` on both)
//           rendered as their OWN row in the grid, AFTER the story image.
//           Matches the approved mobile mock: copy → image → actions,
//           not copy+actions → image.
//   >= lg — the original desktop treatment, unchanged: content-width
//           buttons anchored to the bottom of the white highlight card
//           (via that card's own `justify-between`), sitting beside the
//           story card rather than below it.
//
// Both buttons are the shared CTAButton (primary + secondary), so they look
// the same at every breakpoint — only their sizing changes: below `lg` they
// split the row evenly (`flex-1`), from `lg` up they shrink to content width.
const IndustryCTAs = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-stretch gap-3 ${className}`}>
    <CTAButton href="#contact" className="flex-1 lg:flex-none">Get in Touch</CTAButton>
    <CTAButton href="#solutions" variant="secondary" icon="down" className="flex-1 lg:flex-none">
      Read more
    </CTAButton>
  </div>
);

// Static left-hand card — badge, heading, supporting copy. The CTA row
// itself is NOT rendered inline here below `lg` — see IndustryCTAs above,
// and IndustrySolutionsSection below for where it moves to instead.
//
// `bg-white p-8 sm:p-10` used to apply at every width. On a single-column
// mobile/tablet layout that reads as an inset "boxed card" floating inside
// the section — padding the eyebrow/headline above it don't share, which
// eats into the width available to this heading/paragraph and forces them
// to wrap tighter than the rest of the section. Below `lg` the card is now
// flush with the page (`bg-transparent p-0`), matching the approved mock;
// the white-card + padding treatment is restored at `lg` only, once this
// sits beside the story card as a genuine two-up card layout.
const IndustryHighlightCard = () => (
  <div className="flex h-full flex-col justify-between bg-transparent p-0 lg:bg-white lg:p-10">
    <div>
      {/* Tag chip — a deliberate, documented rounded-corner exception (like
          the closing CTA pill on the Company Highlights section below):
          the reference mock shows this specific tag with soft corners,
          unlike every card/button elsewhere on the page. */}
      <span
        className="inline-block rounded-md px-3 py-1.5 text-xs font-medium tracking-tight"
        style={{ backgroundColor: "#ECECEC", color: INK }}
      >
        Industry-Focused GCC Solutions
      </span>

      <h2
        className="mt-6 text-3xl font-semibold tracking-tighter leading-[1.15] sm:text-4xl"
        style={{ color: INK }}
      >
        Sniper delivers tailored enterprise solutions for{" "}
        <span style={{ color: RED }}>GCCs</span> across
      </h2>

      <p className="mt-5 max-w-sm text-base tracking-tight leading-relaxed" style={{ color: MUTE }}>
        Every industry has unique technology requirements. Sniper delivers tailored enterprise
        solutions for GCCs.
      </p>
    </div>

    {/* Desktop-only inline CTA — hidden below `lg`, where
        IndustrySolutionsSection renders IndustryCTAs as its own grid row
        after the story card instead (see below). */}
    <div className="hidden lg:block">
      <IndustryCTAs className="mt-10" />
    </div>
  </div>
);

const IndustrySolutionsSection = () => (
  <section
    className={SECTION_PADDING}
    style={{ backgroundColor: PAPER }}
  >
    <div className="mx-auto max-w-[1440px] w-full px-4 sm:px-6 lg:px-10">
      <FadeUp>
        <Eyebrow>Service Provided</Eyebrow>
      </FadeUp>

      <FadeUp delay={0.08} className="mt-6 max-w-4xl">
        <h2 className="text-[28px] sm:text-5xl md:text-5xl font-semibold tracking-tighter leading-[1.1]">
          <span style={{ color: INK }}>End-to-End IT Services for <span style={{ color: RED }}>GCC</span> </span>
        </h2>
      </FadeUp>

      <FadeUp delay={0.16} className="mt-6 max-w-2xl">
        <p className="text-[15px] sm:text-xl tracking-tight leading-relaxed" style={{ color: MUTE }}>
          From infrastructure and connectivity to cybersecurity, cloud, workplace technology, and managed IT support — Sniper brings the technology workstreams together under one partner
        </p>
      </FadeUp>

      <FadeUp delay={0.24} className="relative mt-12 border border-dashed p-2 sm:mt-16 sm:p-3" style={{ borderColor: BP_LINE }}>
        {["-left-[6px] -top-[6px]", "-right-[6px] -top-[6px]", "-bottom-[6px] -left-[6px]", "-bottom-[6px] -right-[6px]"].map((pos) => (
          <Plus key={pos} aria-hidden="true" strokeWidth={1} className={`pointer-events-none absolute z-20 hidden h-3.5 w-3.5 sm:block ${pos}`} style={{ color: INK }} />
        ))}
        <div className="grid grid-cols-1 lg:grid-cols-[0.60fr_1.15fr] gap-3 sm:gap-4 lg:h-[620px] xl:h-[680px]">
          <IndustryHighlightCard />
          <IndustryStoryCard slides={INDUSTRY_SLIDES} />
          {/* Mobile/tablet-only CTA row — content → image → actions, per the
              approved mock. `lg:hidden` takes it fully out of grid flow at
              `lg` (display:none, not just visually hidden), so it can't
              disturb the 2-column desktop grid or leave a stray empty cell;
              IndustryHighlightCard renders its own copy of these buttons
              inline at `lg` instead. */}
          <IndustryCTAs className="lg:hidden" />
        </div>
      </FadeUp>
    </div>
  </section>
);

// ============================================================================
// ✦ COMPANY HIGHLIGHTS SECTION — "Why choose Sniper" bento grid.
//
// Sits between Sniper Approach and FAQ, per the approved reference mock.
// Reuses the page's existing tokens (INK / RED / MUTE / PAPER) plus a
// small set of dark/maroon gradients scoped to this section only — the
// rest of the page is light (PAPER), so these gradients exist purely to
// match the mock's "highlight card" treatment and aren't promoted to the
// shared token block above.
//
// GRID MECHANICS — no manual grid-template-areas needed. The whole bento
// layout (3 cards on row 1, a tall card + 2 stacked cards + a wide card on
// row 2) falls out of plain CSS Grid auto-placement once each card is
// given the right `col-span`/`row-span` on a 4-column grid:
//   - Row 1: 1 + 1 + 2 columns = 4 → fills exactly.
//   - Row 2: the "99.9%" card spans 2 cols × 2 rows, which blocks cols
//     1–2 in both row 2 and row 3. The browser's auto-placement then
//     places the GCC launch-readiness and accountable-partner cards in
//     the two open cells in row 2 (cols 3–4), then the wide scale-ready
//     GCC card in the remaining 2-column gap on row 3.
// This is why the JSX order below matters — reordering the cards changes
// where auto-placement puts them — but no card needs an explicit grid-area.
// At `sm` (2-col) and mobile (1-col) the `row-span-2` only applies at
// `lg`, so the grid degrades to a clean, ungapped single/double column
// stack rather than leaving empty cells.
// ============================================================================
const HIGHLIGHT_WARM = "linear-gradient(135deg, #E3A15E 0%, #C15A3D 48%, #2B1712 100%)";
const HIGHLIGHT_DARK = "linear-gradient(160deg, #262626 0%, #121212 100%)";
const HIGHLIGHT_MAROON = "linear-gradient(160deg, #3B1613 0%, #170B0A 78%)";
const HIGHLIGHT_MAROON_SOFT = "linear-gradient(150deg, #451A16 0%, #1B0D0B 82%)";

// Flat near-black base used by cards that now read as a dark surface lit by
// one or two blurred radial "blobs" (per the Figma reference) rather than a
// diagonal gradient fill running edge-to-edge across the card.
const BLOB_CARD_BG = "#170D0C";

const AVATAR_COLORS = ["#DC3327", "#4D4D4D", "#8C8C8C", "#2B2B2B"];

// Shared min-height for row-1's three single/double-span cards
// (TrackRecordCard, TechnicalProfessionalsCard, LocationsCard). Card 5
// (HappyCustomersCard) and card 6 (NewStandardCard) intentionally use their own,
// TALLER `BENTO_ROW2_MIN_H` below instead of this constant — per feedback,
// row 2 gets extra breathing room now that the whole grid is bigger, and
// there's no requirement that it match row 1's height. TrustCard (which
// spans both rows) simply inherits whatever combined height rows 1+2 end
// up at, via `lg:min-h-0` + `lg:row-span-2` — see its own comment below.
const BENTO_ROW_MIN_H = "min-h-[220px] sm:min-h-[260px]";

// Card 5 (HappyCustomersCard) / Card 6 (NewStandardCard) — explicitly taller
// than BENTO_ROW_MIN_H. This is the "we have the extra space now, so give
// these two more room" change from this pass: row 2 no longer has to match
// row 1's height, it's allowed to be its own, larger size.
const BENTO_ROW2_MIN_H = "min-h-[260px] sm:min-h-[320px]";

// Shared card shell — background/grain/overflow live on the outer element
// (so grid span utilities can be passed in via `className`), while flex
// layout + padding live on the inner content wrapper (via
// `contentClassName`) so each card can arrange its own content without
// fighting the outer grid-placement classes.
const BentoCard = ({
  className = "", contentClassName = "", background, index, label, children,
}: {
  className?: string; contentClassName?: string; background: string; index?: number; label?: string; children: React.ReactNode;
}) => (
  <div className={`relative flex h-full flex-col overflow-hidden ${className}`} style={{ background }}>
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 opacity-25 mix-blend-overlay"
      style={{ backgroundImage: NOISE_BG }}
    />

    {/* corner registration marks — the same drafting-frame language as the
        Problems/Partners spec-sheet cards (see ProblemCell), tuned for a
        dark card (white at low opacity instead of ink), on all four
        corners instead of just one. */}
    {["left-2.5 top-2.5", "right-2.5 top-2.5", "bottom-2.5 left-2.5", "bottom-2.5 right-2.5"].map((pos) => (
      <Plus
        key={pos}
        aria-hidden="true"
        strokeWidth={1}
        className={`pointer-events-none absolute z-20 h-3 w-3 text-white/25 ${pos}`}
      />
    ))}

    {/* label row — mono category + red dot + [0N] index over a dashed
        rule: the exact header every spec-sheet card on this page shares
        (Problems, Partners' info card), so Company Highlights reads as
        one continuous system instead of a separate "bento" idiom. */}
    {(label || typeof index === "number") && (
      <div
        className="relative z-20 flex items-center justify-between border-b border-dashed px-4 pt-4 pb-3 sm:px-5"
        style={{ borderColor: "rgba(255,255,255,0.14)" }}
      >
        <span className="flex items-center font-mono text-[10px] uppercase tracking-[0.08em] text-white/55">
          {label && (
            <span aria-hidden="true" className="mr-2 block h-1.5 w-1.5 shrink-0" style={{ backgroundColor: RED }} />
          )}
          {label}
        </span>
        {typeof index === "number" && (
          <span className="font-mono text-[10px] tracking-[0.04em] text-white/35">[0{index}]</span>
        )}
      </div>
    )}

    <div className={`relative z-10 flex flex-1 flex-col p-6 sm:p-7 ${contentClassName}`}>
      {children}
    </div>
  </div>
);

// Card 1 — track record. Per the Figma reference: a flat near-black card
// with one soft, blurred warm-red blob hugging the top-left corner (a light
// source in the corner, not a diagonal gradient wash across the whole
// card). The blob is a plain sibling rendered before the copy, so it paints
// behind it without needing its own z-index — same pattern OrganicReachCard
// already uses below.
// Card 1 — track record. Per the Figma reference: a near-black card lit by
// two separate blurred blobs — a saturated red one on the left, a warm
// yellow/amber one on the right, overlapping just enough in the middle to
// blend — plus a heavier grain layer on top for the "frosted glass" texture
// the mock shows (a plain noise overlay reads too smooth/clean on its own
// at this size, so this card stacks a second, more visible grain pass over
// the shared BentoCard one). All three overlay layers are plain siblings
// rendered before the copy so they paint behind it, same convention as
// OrganicReachCard.
const TrackRecordCard = () => (
  <BentoCard background={BLOB_CARD_BG} className={BENTO_ROW_MIN_H} index={1} label="Track Record">
    {/* red blob — left */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -left-10 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full blur-2xl sm:h-64 sm:w-64"
      style={{
        background:
          "radial-gradient(circle, rgba(196,42,32,0.95) 0%, rgba(196,42,32,0.35) 55%, rgba(196,42,32,0) 78%)",
      }}
    />
    {/* warm yellow/amber blob — right */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -right-12 -top-10 h-56 w-56 rounded-full blur-2xl sm:h-64 sm:w-64"
      style={{
        background:
          "radial-gradient(circle, rgba(232,186,110,0.9) 0%, rgba(232,186,110,0.3) 55%, rgba(232,186,110,0) 78%)",
      }}
    />
    {/* extra grain pass, on top of the two blobs — gives the frosted-glass
        speckle the mock shows instead of a clean smooth gradient */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
      style={{ backgroundImage: NOISE_BG }}
    />
    <p className="relative text-5xl sm:text-6xl font-semibold tracking-tighter text-white">17+</p>
    <p className="relative mt-auto pt-10 text-sm sm:text-base font-light  leading-relaxed text-white/85">
      <span className="font-medium text-white">Years of enterprise IT experience.</span> From
      first seat to multi-site scale, we build around your GCC roadmap.
    </p>
  </BentoCard>
);

// Card 2 — "180+ / Technical professionals". Design-only pass: the copy is
// untouched, this just brings the card up to the same visual language the
// rest of the grid already uses — a soft ambient blob (flat HIGHLIGHT_DARK
// on its own read noticeably flatter than cards 1/7's blob-lit treatment),
// an uppercase mono micro-label directly under the stat (the same pattern
// LocationsCard uses for "DELIVERY LOCATIONS ACROSS INDIA"), a dashed rule
// borrowed from the page's spec-sheet system to separate stat from body
// copy, and a small "+" overflow chip on the avatar stack so 180+ reads as
// a real headcount rather than four generic circles.
const TechnicalProfessionalsCard = () => (
  <BentoCard background={HIGHLIGHT_DARK} className={BENTO_ROW_MIN_H} index={2} label="Delivery Capability">
    {/* single soft amber/red blob, top-right — same "light source in the
        corner" language as TrackRecordCard, toned down to one blob since
        this card doesn't need the full two-tone treatment */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full blur-3xl sm:h-56 sm:w-56"
      style={{
        background: "radial-gradient(circle, rgba(220,51,39,0.4) 0%, rgba(220,51,39,0) 72%)",
      }}
    />

    <p className="relative text-5xl sm:text-6xl font-semibold tracking-tighter text-white">180+</p>
    <p className="relative mt-1.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.1em] text-white/70">
      Technical professionals
    </p>

    <div className="relative mt-5 flex items-center" aria-hidden="true">
      {AVATAR_COLORS.map((color, i) => (
        <span
          key={color}
          className="flex h-7 w-7 items-center justify-center rounded-full"
          style={{ backgroundColor: color, marginLeft: i === 0 ? 0 : "-0.5rem", boxShadow: "0 0 0 2px #121212" }}
        >
          <User className="h-3.5 w-3.5 text-white/90" strokeWidth={1.75} />
        </span>
      ))}
      <span
        className="flex h-7 items-center rounded-full px-2 text-[10px] font-semibold text-white/80"
        style={{ marginLeft: "-0.5rem", backgroundColor: "rgba(255,255,255,0.1)", boxShadow: "0 0 0 2px #121212" }}
      >
        +176
      </span>
    </div>

    <div className="relative mt-auto pt-6">
      <div className="border-t border-dashed pt-4" style={{ borderColor: "rgba(255,255,255,0.16)" }}>
        <p className="text-sm sm:text-base tracking-tight leading-relaxed text-white/80">
          One team across infrastructure, cloud, cybersecurity and managed support.
        </p>
      </div>
    </div>
  </BentoCard>
);

// Card 3 — "7+ / Locations Across India". Uses the real gcc_image.png map
// asset (imported above) as a right-aligned backdrop. Per feedback: flat
// single-color background (no gradient) instead of the maroon gradient
// used elsewhere, and the image's left edge is feathered via a CSS mask
// gradient (rather than left as a hard rectangular crop) so it fades into
// the card's background color instead of looking like a pasted-on photo.
const LOCATIONS_BG = "#1B0B0B";

const LocationsCard = () => (
  <BentoCard
    background={LOCATIONS_BG}
    className={`${BENTO_ROW_MIN_H} sm:col-span-2 lg:col-span-2`}
    index={3}
    label="Delivery Locations"
  >
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 z-0 h-full w-3/5"
      style={{
        backgroundImage: `url(${gccImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center right",
        opacity: 0.95,
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 40%)",
        maskImage: "linear-gradient(to right, transparent 0%, black 40%)",
      }}
    />

    {/* soft blurred red blob, low and left — ambient warmth behind the
        copy, independent of the map graphic on the right */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -left-16 -bottom-20 z-0 h-52 w-52 rounded-full blur-3xl sm:h-64 sm:w-64"
      style={{
        background: "radial-gradient(circle, rgba(220,51,39,0.5) 0%, rgba(220,51,39,0) 70%)",
      }}
    />

    {/* 7+ — gradient text, red at top fading to white at the bottom: the
        inverse of the 99.9% card's white-to-red gradient below. */}
    <p
      className="relative z-10 text-5xl sm:text-6xl font-semibold tracking-tighter"
      style={{
        backgroundImage: "linear-gradient(180deg, #DC3327 0%, #FFFFFF 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      7+
    </p>
    <p className="relative z-10 mt-2 text-lg sm:text-xl font-semibold uppercase tracking-tight text-white">
      Delivery locations across India
    </p>
    <p className="relative z-10 mt-auto max-w-[16rem] pt-10 text-sm sm:text-base tracking-tight leading-relaxed text-white/70">
      Local delivery reach, one accountable partner and a consistent rollout standard.
    </p>
  </BentoCard>
);

// Concentric rotated-square "diamond rings" mark used on the trust card,
// standing in for the mock's layered-diamond icon — built from three
// stroked, rotated <rect> elements rather than an icon-font glyph so the
// ring spacing/opacity can be tuned directly.
const DiamondRings = () => (
  <svg viewBox="0 0 100 100" className="h-16 w-16 sm:h-20 sm:w-20" aria-hidden="true">
    {[36, 26, 16].map((r, i) => (
      <rect
        key={r}
        x={50 - r}
        y={50 - r}
        width={r * 2}
        height={r * 2}
        transform="rotate(45 50 50)"
        fill="none"
        stroke="white"
        strokeOpacity={0.4 - i * 0.1}
        strokeWidth={1}
      />
    ))}
  </svg>
);

// Card 4 — Service Reliability. Previously a single "99.9%" stat; that
// number has moved to the Accountability card (6) below, where it reads as
// the thing Sniper is accountable *to*. Repeating the same stat here would
// just be decoration, so this card now earns its 2×2 footprint with an
// actual reliability *readout* instead of one more number — a live-status
// pill (the "is it working right now" question, answered instantly), a
// headline that states the position in words, and a three-metric spec row
// styled like the Approach table elsewhere on the page, so it reads as a
// small ops dashboard rather than a second copy of the trust card. Metric
// values are placeholders in the same spirit as the rest of this section's
// stats (17+, 180+, 2600+) — swap for whatever SLA figures are accurate.
const ServiceReliabilityMetrics = [
  { Icon: Activity, value: "24/7/365", label: "Proactive monitoring" },
  { Icon: Clock, value: "< 15 min", label: "Avg. response time" },
  { Icon: ShieldCheck, value: "Direct to engineer", label: "Escalation path" },
];

const TrustCard = () => (
  <BentoCard
    background={BLOB_CARD_BG}
    className="min-h-[480px] sm:min-h-[580px] lg:min-h-0 sm:col-span-2 lg:col-span-2 lg:row-span-2"
    contentClassName="items-center justify-center text-center"
    index={4}
    label="Service Reliability"
  >
    {/* blurred red blob bleeding down from the top edge, behind the copy —
        the "gradient redblob" treatment used across this pass, sized big
        and soft so it reads as ambient light rather than a hard shape. */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-0 z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl sm:h-96 sm:w-96"
      style={{
        background: "radial-gradient(circle, rgba(220,51,39,0.55) 0%, rgba(220,51,39,0) 70%)",
      }}
    />
    {/* diamond mark demoted to faint corner texture — it used to anchor a
        single stat, now the stat's gone so it just adds quiet geometry
        behind the readout instead of competing with it */}
    <div className="pointer-events-none absolute -right-3 -top-3 z-0 opacity-[0.12]" aria-hidden="true">
      <DiamondRings />
    </div>

    {/* live-status pill — answers "is it working right now" before any
        copy does, and gives this card its own visual identity instead of
        being "the other dark stat card" */}
    <div
      className="relative z-10 inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
      style={{ borderColor: "rgba(255,255,255,0.18)" }}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
          style={{ backgroundColor: "#4ADE80" }}
        />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#4ADE80" }} />
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">
        All systems operational
      </span>
    </div>

    <p className="relative z-10 mt-6 max-w-xs text-2xl sm:text-3xl font-semibold leading-[1.18] tracking-tighter text-white">
      Reliability that&apos;s engineered, not promised.
    </p>

    <div className="relative z-10 mt-8 flex w-full max-w-sm flex-col sm:flex-row">
      {ServiceReliabilityMetrics.map(({ Icon, value, label }, i) => (
        <div
          key={label}
          className="flex flex-1 flex-col items-center gap-1.5 border-b border-dashed px-4 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:py-0 sm:last:border-r-0"
          style={{ borderColor: "rgba(255,255,255,0.16)" }}
        >
          <Icon className="h-4 w-4 text-white/45" strokeWidth={1.5} />
          <p className="text-sm sm:text-base font-semibold tracking-tight text-white">{value}</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-white/45">{label}</p>
        </div>
      ))}
    </div>

    <p className="relative z-10 mt-8 max-w-[18rem] text-xs sm:text-sm leading-relaxed tracking-tight text-white/50">
      One accountable team watches every GCC environment we run — proactively, not reactively.
    </p>
  </BentoCard>
);

// Card 5 — 2600+ happy customers (photo card)
// Real background photo (happy_customers.jpg, already imported/used
// elsewhere on this page), a dark legibility gradient, the shared grain
// texture, and a stat panel pinned to the bottom-left corner. Design pass:
// the panel was a fully opaque PAPER-colored block sitting on top of the
// photo — visually it read as a paper sticker pasted over a photograph
// rather than one composed image, and it fully hid whatever part of the
// photo sat behind it. It's now a frosted glass panel (backdrop-blur over
// a translucent dark tint) with a single red top edge as the only hard
// line, so the photo still reads through the panel instead of disappearing
// behind it — closer to the glass treatment used on the hero's secondary
// CTA than to a flat card. Copy is tightened to speak to the GCC audience
// this whole page is written for, instead of a generic "enterprise tools"
// line that could belong to any SaaS company.
const HappyCustomersCard = () => (
  <div className={`relative h-full overflow-hidden ${BENTO_ROW2_MIN_H}`}>
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${happy_customers})` }}
    />
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(10,8,8,0) 0%, rgba(10,8,8,0.1) 45%, rgba(10,8,8,0.45) 100%)",
      }}
    />
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 opacity-20 mix-blend-overlay"
      style={{ backgroundImage: NOISE_BG }}
    />
    {/* corner registration marks + label strip — matches BentoCard's
        header exactly, so this photo card (which can't route through
        BentoCard itself) still reads as part of the same spec-sheet
        system as the rest of the grid. */}
    {["left-2.5 top-2.5", "right-2.5 top-2.5", "bottom-2.5 left-2.5", "bottom-2.5 right-2.5"].map((pos) => (
      <Plus key={pos} aria-hidden="true" strokeWidth={1} className={`pointer-events-none absolute z-20 h-3 w-3 text-white/25 ${pos}`} />
    ))}
    <div
      className="absolute inset-x-0 top-0 z-20 flex items-center justify-between border-b border-dashed px-4 pt-4 pb-3 sm:px-5"
      style={{ borderColor: "rgba(255,255,255,0.14)" }}
    >
      <span className="flex items-center font-mono text-[10px] uppercase tracking-[0.08em] text-white/70">
        <span aria-hidden="true" className="mr-2 block h-1.5 w-1.5 shrink-0" style={{ backgroundColor: RED }} />
        Customer Base
      </span>
      <span className="font-mono text-[10px] tracking-[0.04em] text-white/45">[05]</span>
    </div>
    <div className="relative z-20 flex h-full items-end p-3 sm:p-4">
      <div
        className="max-w-[15rem] border-t-2 px-4 py-4 backdrop-blur-md sm:px-5 sm:py-5"
        style={{ backgroundColor: "rgba(10,8,8,0.55)", borderColor: RED }}
      >
        <p className="text-3xl sm:text-4xl font-semibold tracking-tighter" style={{ color: RED }}>
          2600+
        </p>
        <p className="mt-1 text-sm sm:text-base font-semibold tracking-tight text-white">
          Happy Customers
        </p>
        <p className="mt-1 text-xs sm:text-sm leading-relaxed tracking-tight text-white/65">
          Across enterprise IT, cloud and managed services — GCCs of every size trust Sniper to deliver.
        </p>
      </div>
    </div>
  </div>
);

// Card 6 — Accountability. Previously "One partner. Clear accountability."
// paired with a generic toggle icon — on its own that's a claim with
// nothing backing it. This card now carries the "99.9%" stat that used to
// live on the Service Reliability card, reframed so the number *is* the
// accountability claim: one partner, one figure they stand behind, instead
// of an abstract promise next to an unrelated icon. Content fully replaced
// per the brief — nothing from the old card carries over.
const NewStandardCard = () => (
  <BentoCard
    background={HIGHLIGHT_DARK}
    className={BENTO_ROW2_MIN_H}
    contentClassName="items-center justify-center text-center"
    index={6}
    label="Accountability"
  >
    {/* same "redblob bleeding from the top edge" language as the Service
        Reliability card, scaled down for this card's smaller footprint —
        keeps the two stat-bearing dark cards reading as one family */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-0 z-0 h-48 w-48 -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl"
      style={{
        background: "radial-gradient(circle, rgba(220,51,39,0.5) 0%, rgba(220,51,39,0) 70%)",
      }}
    />

    <p className="relative z-10 font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
      Service availability
    </p>
    <p
      className="relative z-10 mt-2 text-5xl sm:text-6xl font-semibold tracking-tighter"
      style={{
        backgroundImage: "linear-gradient(180deg, #FFFFFF 0%, #DC3327 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      99.9%
    </p>
    <p className="relative z-10 mt-3 max-w-[14rem] text-sm leading-relaxed tracking-tight text-white/60">
      One partner. One number we&apos;re accountable to.
    </p>
  </BentoCard>
);

// Card 7 — Market Reach. The previous copy ("organic reach that keeps
// climbing") was growth-marketing language for a social/content audience —
// it didn't actually say anything about reach *in the market this page is
// selling into*. This card now states reach concretely: the same industry
// set IndustrySolutionsSection covers a few sections down (INDUSTRY_SLIDES
// above), condensed into a chip row, so "Market Reach" is demonstrated
// rather than asserted. Visual language (the two glow blooms, the bare
// asterisk mark, the near-black ground) is unchanged — only the content
// block at the bottom is new.
const ORGANIC_REACH_BG = "#180E0E";

const MARKET_REACH_INDUSTRIES = ["Technology", "BFSI", "Healthcare", "Manufacturing", "Engineering", "E-commerce"];

const OrganicReachCard = () => (
  <BentoCard
    background={ORGANIC_REACH_BG}
    className="min-h-[200px] sm:min-h-[240px] sm:col-span-2 lg:col-span-2"
    contentClassName="justify-between gap-8"
    index={7}
    label="Market Reach"
  >
    {/* glow blooms — radial, blurred, clipped by BentoCard's own
        `overflow-hidden` so they read as light bleeding in from outside
        the card rather than shapes drawn inside it. Top-right is the
        vivid, concentrated one from the mock; bottom-left is deliberately
        larger/softer so it reads as ambient warmth rather than a second
        hot spot. */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full blur-2xl sm:h-64 sm:w-64"
      style={{
        background:
          "radial-gradient(circle, rgba(232,84,74,0.9) 0%, rgba(232,84,74,0) 68%)",
      }}
    />
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full blur-3xl sm:h-64 sm:w-64"
      style={{
        background:
          "radial-gradient(circle, rgba(120,40,35,0.55) 0%, rgba(120,40,35,0) 70%)",
      }}
    />

    <Asterisk className="h-7 w-7 text-white" strokeWidth={2} />

    <div className="flex flex-col gap-5">
      <p className="max-w-sm text-2xl sm:text-3xl font-medium leading-[1.15] tracking-tight text-white">
        One partner across every industry your GCC touches.
      </p>
      <div className="flex flex-wrap gap-2">
        {MARKET_REACH_INDUSTRIES.map((industry) => (
          <span
            key={industry}
            className="rounded-full border border-dashed px-3 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-white/70"
            style={{ borderColor: "rgba(255,255,255,0.24)" }}
          >
            {industry}
          </span>
        ))}
      </div>
    </div>
  </BentoCard>
);

const BentoHighlightsSection = () => (
  <section
    className={SECTION_PADDING}
    style={{ backgroundColor: PAPER }}
  >
    <div className="mx-auto max-w-[1440px] w-full px-4 sm:px-6 lg:px-10">
      <FadeUp>
        <Eyebrow>Company Highlights</Eyebrow>
      </FadeUp>

      <FadeUp delay={0.08} className="mt-6 max-w-3xl">
        <h2 className="text-[28px] sm:text-5xl md:text-5xl font-semibold tracking-tighter leading-[1.1]">
          <span style={{ color: INK }}>Built for GCCs that need to </span>
          <span style={{ color: RED }}>move with confidence.</span>
        </h2>
      </FadeUp>

      <FadeUp delay={0.16} className="mt-6 max-w-2xl">
        <p className="text-[15px] sm:text-xl tracking-tight leading-relaxed" style={{ color: MUTE }}>
          Sniper replaces fragmented technology delivery with one secure, scalable foundation—
          so your GCC can launch faster, operate reliably and grow without disruption.
        </p>
      </FadeUp>

      {/* SIZING (this pass): row 1 (TrackRecordCard/TechnicalProfessionalsCard/
          LocationsCard) uses BENTO_ROW_MIN_H; row 2 (HappyCustomersCard/
          NewStandardCard) uses the deliberately TALLER BENTO_ROW2_MIN_H —
          the two rows are no longer forced to match. TrustCard spans both
          rows via `lg:row-span-2` + `lg:min-h-0`, so it just inherits
          whatever combined height rows 1+2 resolve to; nothing here needs
          to be hand-kept-in-sync. The grid is intentionally allowed to run
          taller than one viewport now — the closing "Need a growth plan?"
          bar below it can sit below the fold; only the 7 bento cards
          need to read as a cohesive block on screen at once. */}
      <div className="relative mt-12 border border-dashed p-2 sm:mt-16 sm:p-3" style={{ borderColor: BP_LINE, backgroundColor: PAPER }}>
        {/* faint drafting grid in the seams between cards — the same
            backdrop pattern ProblemCell's figure stage uses, at the same
            40px pitch, so this frame reads as one more panel of the page's
            blueprint sheet rather than a separate "bento" component. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(to right, ${BP_FAINT} 1px, transparent 1px), linear-gradient(to bottom, ${BP_FAINT} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            backgroundPosition: "center",
          }}
        />
        {["-left-[6px] -top-[6px]", "-right-[6px] -top-[6px]", "-bottom-[6px] -left-[6px]", "-bottom-[6px] -right-[6px]"].map((pos) => (
          <Plus key={pos} aria-hidden="true" strokeWidth={1} className={`pointer-events-none absolute z-20 hidden h-3.5 w-3.5 sm:block ${pos}`} style={{ color: INK }} />
        ))}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          <FadeUp delay={0.1}>
            <TrackRecordCard />
          </FadeUp>
          <FadeUp delay={0.14}>
            <TechnicalProfessionalsCard />
          </FadeUp>
          <FadeUp delay={0.18} className="sm:col-span-2 lg:col-span-2">
            <LocationsCard />
          </FadeUp>
          <FadeUp delay={0.22} className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
            <TrustCard />
          </FadeUp>
          <FadeUp delay={0.26}>
            <HappyCustomersCard />
          </FadeUp>
          <FadeUp delay={0.3}>
            <NewStandardCard />
          </FadeUp>
          <FadeUp delay={0.34} className="sm:col-span-2 lg:col-span-2">
            <OrganicReachCard />
          </FadeUp>
        </div>
      </div>

      {/* closing strip — full-width dark bar, matches the mock's
          "need a growth plan?" CTA row under the grid. The button is the
          shared CTAButton (primary, `onDark`): red at rest, fills white on
          hover so it doesn't sink into the dark bar. */}
      <FadeUp delay={0.4} className="mt-4 sm:mt-5">
        <div
          className="flex flex-col items-start justify-between gap-4 px-6 py-5 sm:flex-row sm:items-center sm:px-8"
          style={{ backgroundColor: "#141414" }}
        >
          <p className="text-sm tracking-tight text-white/90 sm:text-base">
            Planning a GCC launch or expansion?{" "}
            <a href="#contact" className="font-semibold underline underline-offset-2">
              Book a strategy call
            </a>
          </p>
          <CTAButton href="#contact" onDark className="shrink-0">
            Talk to an expert
          </CTAButton>
        </div>
      </FadeUp>
    </div>
  </section>
);

// ============================================================================
// ✦ CASE STUDIES SECTION — photo cards with a bottom red glow overlay.
//
// Each card is a full-bleed background photo (placeholder path, same
// convention as SOLUTIONS/PARTNERS elsewhere in this file) with a dark
// gradient for text legibility plus a separate red radial-glow layer
// pinned to the bottom edge. Both overlays are always present at rest —
// the glow just intensifies on hover via `group-hover:opacity-100` — and
// the "Read more" button flips from an outlined ghost button to a solid
// white pill on hover. That hover treatment is what the reference mock's
// 4th card is showing; it isn't a permanently "active" 4th card, every
// card behaves identically on `:hover`.
//
// No rounded corners on the card or the button, per the page's established
// square-edge convention; the button keeps its border-only default so it
// stays legible against a photo of unpredictable brightness.
// ============================================================================
interface CaseStudy {
  number: string;
  title: string;
  description: string;
  // Placeholder asset path — swap in a real case-study photo per card.
  image: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    number: "01",
    title: "Explore popular unity industry use cases that's good",
    description: "Explore popular unity industry use cases that unlock the potential of 3D data to achieve",
    image: "/images/case-studies/case-01.jpg",
  },
  {
    number: "02",
    title: "Explore popular unity industry use cases that's good",
    description: "Explore popular unity industry use cases that unlock the potential of 3D data to achieve",
    image: "/images/case-studies/case-02.jpg",
  },
  {
    number: "03",
    title: "Explore popular unity industry use cases that's good",
    description: "Explore popular unity industry use cases that unlock the potential of 3D data to achieve",
    image: "/images/case-studies/case-03.jpg",
  },
  {
    number: "04",
    title: "Explore popular unity industry use cases that's good",
    description: "Explore popular unity industry use cases that unlock the potential of 3D data to achieve",
    image: "/images/case-studies/case-04.jpg",
  },
];

const CaseStudyCard = ({ number, title, description, image }: CaseStudy) => (
  <div className="group relative flex h-full min-h-[380px] sm:min-h-[420px] flex-col overflow-hidden bg-[#141414]">
    {/* background photo */}
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
      style={{ backgroundImage: `url(${image})` }}
    />

    {/* base gradient — keeps the number/title/copy legible over any photo */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(10,8,8,0.15) 0%, rgba(10,8,8,0.55) 55%, rgba(10,8,8,0.88) 100%)",
      }}
    />

    {/* red glow — pinned to the bottom edge, intensifies on hover */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 opacity-70 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-100"
      style={{ backgroundImage: `radial-gradient(120% 90% at 50% 100%, ${RED} 0%, transparent 65%)` }}
    />

    {/* grain — same texture used on every other card on this page */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 opacity-20 mix-blend-overlay"
      style={{ backgroundImage: NOISE_BG }}
    />

    <div className="relative z-20 flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <span className="text-3xl font-semibold tracking-tighter text-white sm:text-4xl">{number}</span>
        <Plus className="h-4 w-4 text-white/80" strokeWidth={2} />
      </div>

      <h3 className="mt-8 text-lg font-semibold leading-snug tracking-tight text-white sm:mt-10 sm:text-xl">
        {title}
      </h3>

      <p className="mt-3 max-w-[16rem] text-xs leading-relaxed tracking-tight text-white/60 sm:text-sm">
        {description}
      </p>

      <div className="mt-auto pt-8">
        <a
          href="#contact"
          className="inline-flex items-center justify-center border border-white/70 px-5 py-2.5 text-sm font-medium tracking-tight text-white transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-[#141414]"
        >
          Read more
        </a>
      </div>
    </div>
  </div>
);

const CaseStudiesSection = () => (
  <section
    className={SECTION_PADDING}
    style={{ backgroundColor: PAPER }}
  >
    <div className="mx-auto max-w-[1440px] w-full px-4 sm:px-6 lg:px-10">
      <FadeUp>
        <Eyebrow>Case Studies</Eyebrow>
      </FadeUp>

      <FadeUp delay={0.08} className="mt-6 max-w-4xl">
        <h2 className="text-[28px] sm:text-5xl md:text-5xl font-semibold tracking-tighter leading-[1.1]">
          <span style={{ color: INK }}>Why </span>
          <span style={{ color: RED }}>choose sniper</span>
          <span style={{ color: INK }}> over other companies?</span>
        </h2>
      </FadeUp>

      <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {CASE_STUDIES.map((study, i) => (
          <FadeUp key={study.number} delay={0.1 + i * 0.06} className="h-full">
            <CaseStudyCard {...study} />
          </FadeUp>
        ))}
      </div>
    </div>
  </section>
);

// ============================================================================
// ✦ FAQ SECTION — accordion, first item open by default.
// ============================================================================
interface FAQEntry {
  question: string;
  answer: string;
}

const FAQS: FAQEntry[] = [
  {
    question: "How long does it take to set up IT Infrastructure for GCC in India?",
    answer:
      "Timelines depend on your seat count, the city or cities involved, and the complexity of your security requirements. After an initial consultation, we share a detailed timeline estimate for your specific setup.",
  },
  {
    question: "Which cities does Sniper support for GCC deployments?",
    answer:
      "Sniper Systems delivers from 7+ locations across India, giving GCC teams consistent, nationwide coverage without adding a new vendor relationship every time they open a new location.",
  },
  {
    question: "Do you handle both hardware procurement and network setup?",
    answer:
      "Yes. Sniper manages procurement, network design and rollout, and ongoing infrastructure support through one accountable partner — no separate vendors to coordinate.",
  },
  {
    question: "Which IT services can Sniper cover for a GCC?",
    answer:
      "The full technology stack, under one partner: enterprise IT infrastructure, cloud and AI solutions, enterprise networking, cybersecurity, digital workplace, managed IT services, and device lifecycle management.",
  },
  {
    question: "How does Sniper handle security when setting up a GCC?",
    answer:
      "Security is planned into the setup from the start rather than added afterwards. Sniper's cybersecurity solutions cover users, devices, applications, and data, and your organization's own security requirements are built into the initial design. Share them during the consultation and we'll scope the setup around them.",
  },
  {
    question: "Can Sniper support an existing GCC, or only new setups?",
    answer:
      "Both. Sniper can stand up a GCC from scratch, or take over infrastructure and support for an already-running center without disrupting day-to-day operations.",
  },
  {
    question: "What should we have ready before speaking to Sniper?",
    answer:
      "A rough seat count, your target city or cities, an approximate go-live window, and any security requirements from your global team. Even estimates are enough to scope the first conversation and shape a timeline for your setup.",
  },
];

// ============================================================================
// ✦ STRUCTURED DATA (JSON-LD) — rendered inside <Helmet> in the GCC page.
//
// FAQ_JSON_LD is built by mapping the FAQS array above, so the schema can
// never drift from the visible accordion (Google requires the marked-up
// answers to match what's on the page). SERVICE_JSON_LD only states things
// the page itself already says; add Organization/LocalBusiness details
// (address, phone, logo) only once the business has confirmed them.
// ============================================================================
const PAGE_URL = "https://sniperindia.com/gcc";

const SERVICE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "GCC IT Infrastructure and Managed Services",
  serviceType: "IT infrastructure services for Global Capability Centers",
  url: PAGE_URL,
  provider: { "@type": "Organization", name: "Sniper Systems", url: "https://sniperindia.com" },
  areaServed: { "@type": "Country", name: "India" },
  description:
    "End-to-end IT infrastructure, networking, cybersecurity, device rollout, and managed support for Global Capability Centers in India.",
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

const FAQAccordionItem = ({
  entry, index, isOpen, onToggle,
}: { entry: FAQEntry; index: number; isOpen: boolean; onToggle: () => void }) => (
  <div className="border-t border-dashed bg-white first:border-t-0" style={{ borderColor: BP_LINE }}>
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="flex w-full items-center justify-between gap-4 px-6 sm:px-8 py-6 text-left"
    >
      <span className="flex min-w-0 items-baseline gap-3 sm:gap-4">
        <span
          aria-hidden="true"
          className="hidden h-1.5 w-1.5 shrink-0 translate-y-[-1px] self-center transition-opacity duration-300 sm:block"
          style={{ backgroundColor: RED, opacity: isOpen ? 1 : 0 }}
        />
        <span
          className="shrink-0 font-mono text-[10px] tracking-[0.04em] transition-colors duration-300"
          style={{ color: isOpen ? RED : "#A3A3A6" }}
        >
          [Q{String(index + 1).padStart(2, "0")}]
        </span>
        <span
          className="text-lg sm:text-lg font-medium tracking-tight transition-colors duration-300"
          style={{ color: isOpen ? RED : INK }}
        >
          {entry.question}
        </span>
      </span>
      <ChevronDown
        className="h-5 w-5 shrink-0 transition-transform duration-300"
        style={{ color: INK, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
      />
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease }}
          className="overflow-hidden"
        >
          <p className="px-6 sm:px-8 pb-6 text-base tracking-tight leading-relaxed" style={{ color: MUTE }}>
            {entry.answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className={SECTION_PADDING}
      style={{ backgroundColor: PAPER }}
    >
      <div className="mx-auto max-w-[1440px] w-full px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-16">
        <div>
          <FadeUp>
            <Eyebrow>FAQs</Eyebrow>
          </FadeUp>

          <FadeUp delay={0.08} className="mt-6">
            <h2
              className="text-[28px] sm:text-5xl md:text-5xl font-semibold tracking-tighter leading-[1.1]"
              style={{ color: INK }}
            >
              Frequently Asked
              <br />
              Questions
            </h2>
          </FadeUp>

          <FadeUp delay={0.16} className="mt-6 max-w-sm">
            <p className="text-[15px] tracking-tight leading-relaxed" style={{ color: MUTE }}>
              Everything you need to know about setting up and running a GCC with Sniper Systems.
            </p>
          </FadeUp>

          <FadeUp delay={0.22} className="mt-6">
            <a
              href="#contact"
              className="group inline-flex items-center gap-1.5 text-base tracking-tight font-medium"
              style={{ color: RED }}
            >
              <span className="border-b" style={{ borderColor: RED }}>
                Have a specific question
              </span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </FadeUp>
        </div>

        <FadeUp delay={0.16} className="relative border border-dashed p-2 sm:p-3" style={{ borderColor: BP_LINE }}>
          {/* same drafting-frame chrome as the Problems grid and Company
              Highlights: faint grid backdrop in the margin + corner
              registration marks, so the FAQ panel reads as one more sheet
              of the same spec system instead of a plain list. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              backgroundImage: `linear-gradient(to right, ${BP_FAINT} 1px, transparent 1px), linear-gradient(to bottom, ${BP_FAINT} 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
              backgroundPosition: "center",
            }}
          />
          {["-left-[6px] -top-[6px]", "-right-[6px] -top-[6px]", "-bottom-[6px] -left-[6px]", "-bottom-[6px] -right-[6px]"].map((pos) => (
            <Plus key={pos} aria-hidden="true" strokeWidth={1} className={`pointer-events-none absolute z-20 hidden h-3.5 w-3.5 sm:block ${pos}`} style={{ color: INK }} />
          ))}
          <div className="relative z-10 flex flex-col border-b border-dashed" style={{ borderColor: BP_LINE }}>
            {FAQS.map((entry, i) => (
              <FAQAccordionItem
                key={entry.question}
                entry={entry}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

// ============================================================================
// ✦ CONTACT / CTA FORM SECTION.
//
// Layout: a single <form> containing two stacked bands —
//   Band 1: heading
//   Full-width divider rule
//   Band 2 (2-col grid): copy + contact card + book-a-call | first/last
//                          name, work email/role, org, discuss, submit
//
// No rounded corners on the Contact Us card or the submit button, per the
// GCC theme. The mail/phone icon badges keep `rounded-full` since they're
// decorative icon chips, not cards or buttons.
// ============================================================================
const ContactField = ({
  label, className, ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className={`flex flex-col gap-2 ${className ?? ""}`}>
    <span className="text-lg  font-semibold tracking-tight" style={{ color: INK }}>
      {label}
    </span>
    <input
      {...props}
      className="w-full border-b bg-transparent pb-2 text-lg tracking-tight outline-none transition-colors duration-300 focus:border-[#DC3327] disabled:opacity-60"
      style={{ borderColor: DIVIDER, color: INK }}
    />
  </label>
);

interface ContactFormData {
  firstName: string;
  lastName: string;
  workEmail: string;
  phone: string;
  role: string;
  orgName: string;
  discuss: string;
}

// ============================================================================
// ✦ LEAD SUBMISSION — Web3Forms.
// Same access key + endpoint pattern already used on the main Contact page,
// so GCC leads land through the same working pipeline instead of only
// console.logging (as this form previously did). Swap the fallback key
// below, or set VITE_WEB3FORMS_ACCESS_KEY, to point this at a different
// Web3Forms account if GCC leads should route separately.
// ============================================================================
const WEB3FORMS_ACCESS_KEY =
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "ab9fd6a8-a8de-4f28-ba11-f6d95387e932";

// ---- Minimal toast, in the GCC page's own INK / RED / PAPER palette ----
//
// Rendered through a React Portal straight into document.body. This section
// sits deep inside many nested `motion.div`/whileInView wrappers up the tree
// (Layout, page transitions, FadeUp, etc.) — Framer Motion leaves a
// `transform` on those DOM nodes even after the entrance animation settles,
// and CSS defines that ANY ancestor with a transform becomes the containing
// block for `position: fixed` descendants. So without the portal, this toast
// would get pinned to that ancestor's box (often off-screen or clipped)
// instead of the actual viewport — the same failure mode already documented
// and fixed for the CTA section's cursor blob further down this file.
const GCCToast = ({
  visible, onDone, message, isError = false,
}: { visible: boolean; onDone: () => void; message: string; isError?: boolean }) => {
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2 px-4 sm:px-0"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.35, ease }}
        >
          <div
            className="whitespace-nowrap px-6 py-3 text-sm font-semibold tracking-tight text-white shadow-xl"
            style={{ backgroundColor: isError ? "#B3261E" : INK }}
          >
            {isError ? "✕" : "✓"} &nbsp; {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

const ContactSection = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    workEmail: "",
    phone: "",
    role: "",
    orgName: "",
    discuss: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMounted, setToastMounted] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIsError, setToastIsError] = useState(false);

  const handleChange =
    (field: keyof ContactFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const showToast = (msg: string, isError = false) => {
    setToastMessage(msg);
    setToastIsError(isError);
    setToastMounted(true);
    setTimeout(() => setToastVisible(true), 20);
    setTimeout(() => setToastVisible(false), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.workEmail,
        phone: formData.phone || "—",
        role: formData.role,
        company: formData.orgName,
        message: formData.discuss,
        subject: `New GCC Enquiry from ${formData.firstName} ${formData.lastName} — ${formData.orgName}`,
        from_name: `${formData.firstName} ${formData.lastName}`.trim(),
      };

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        showToast("MESSAGE SENT — WE'LL BE IN TOUCH SOON");
        setFormData({
          firstName: "",
          lastName: "",
          workEmail: "",
          phone: "",
          role: "",
          orgName: "",
          discuss: "",
        });
      } else {
        showToast("SOMETHING WENT WRONG — PLEASE TRY AGAIN", true);
      }
    } catch {
      showToast("NETWORK ERROR — PLEASE TRY AGAIN LATER", true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className={SECTION_PADDING}
      style={{ backgroundColor: PAPER }}
    >
      <div className="mx-auto max-w-[1440px] w-full px-4 sm:px-6 lg:px-10 mb-12 ">
        <FadeUp>
          <Eyebrow>Contact</Eyebrow>
        </FadeUp>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col">
          {/* Band 1 — heading */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-start">
            <FadeUp delay={0.08}>
              <h2 className="text-[28px] sm:text-5xl md:text-5xl font-semibold tracking-tighter leading-[1.1]">
                <span style={{ color: INK }}>Let&apos;s Build Your</span>
                <br />
                <span style={{ color: INK }}>Next-Generation </span>
                <span style={{ color: RED }}>GCC</span>
              </h2>
            </FadeUp>
          </div>

          {/* Full-width ruler — dashed strip + corner Plus marks, the same
              hand-off chrome BlueprintRuler / the Partners section use
              between their header and their grid, instead of a bare
              dashed line. */}
          <div className="relative my-8 h-6" aria-hidden="true">
            <Plus className="absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2" strokeWidth={1} style={{ color: INK }} />
            <Plus className="absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2" strokeWidth={1} style={{ color: INK }} />
            <div
              className="absolute inset-x-9 top-1/2 h-[5px] -translate-y-1/2"
              style={{ backgroundImage: `repeating-linear-gradient(to right, ${BP_LINE} 0 1px, transparent 1px 8px)` }}
            />
          </div>

          {/* Band 2 — intro copy + contact card + book-a-call (left) beside
              all form fields and the submit button (right). */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="flex flex-col">
              <FadeUp delay={0.16}>
                <p className="max-w-lg text-lg tracking-tight leading-relaxed" style={{ color: MUTE }}>
                  Tell us about your GCC and we&apos;ll map the highest-impact infrastructure gaps
                  — then set up a tailored rollout plan so you&apos;re live and running fast.
                </p>
              </FadeUp>

              <FadeUp delay={0.24} className="mt-40">
                {/* card — same spec-sheet chrome as ProblemCell/BentoCard:
                    dashed border, corner registration marks, and a mono
                    label + [0N] index header row over a dashed rule,
                    instead of a plain bordered box. Icon chips are square
                    (dashed ring) rather than rounded-full, matching the
                    page's no-rounded-corners convention. */}
                <div className="relative max-w-lg border border-dashed" style={{ borderColor: BP_LINE }}>
                  {["-left-[5px] -top-[5px]", "-right-[5px] -top-[5px]", "-bottom-[5px] -left-[5px]", "-bottom-[5px] -right-[5px]"].map((pos) => (
                    <Plus key={pos} aria-hidden="true" strokeWidth={1} className={`pointer-events-none absolute z-10 h-3 w-3 ${pos}`} style={{ color: INK }} />
                  ))}

                  <div className="flex items-center justify-between border-b border-dashed px-6 py-4" style={{ borderColor: BP_LINE }}>
                    <span className="flex items-center font-mono text-[11px] uppercase tracking-[0.06em]" style={{ color: INK }}>
                      <span aria-hidden="true" className="mr-2 block h-2 w-2 shrink-0" style={{ backgroundColor: RED }} />
                      Direct Contact
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.04em]" style={{ color: "#A3A3A6" }}>[01]</span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start gap-3">
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center border border-dashed"
                        style={{ borderColor: BP_LINE }}
                      >
                        <Mail className="h-4 w-4" style={{ color: INK }} strokeWidth={1.75} />
                      </span>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.08em]" style={{ color: MUTE }}>Email</p>
                        <a
                          href="mailto:enquiry@sniperindia.com"
                          className="text-base font-medium tracking-tight underline underline-offset-2"
                          style={{ color: INK }}
                        >
                          enquiry@sniperindia.com
                        </a>
                      </div>
                    </div>

                    <div className="mt-4 flex items-start gap-3">
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center border border-dashed"
                        style={{ borderColor: BP_LINE }}
                      >
                        <Phone className="h-4 w-4" style={{ color: INK }} strokeWidth={1.75} />
                      </span>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.08em]" style={{ color: MUTE }}>Phone</p>
                        <a href="tel:+918939301100" className="text-base font-medium tracking-tight" style={{ color: INK }}>
                          +91 89393 01100
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.3} className="mt-8 flex flex-wrap items-center gap-2 text-base tracking-tight">
                <span style={{ color: MUTE }}>Book a 30-mins intro call with us?</span>
                <a
                  href="#book-call"
                  className="group inline-flex items-center gap-1 font-semibold"
                  style={{ color: INK }}
                >
                  Book a call
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{ color: INK }}
                  />
                </a>
              </FadeUp>
            </div>

            <FadeUp delay={0.16} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ContactField
                  label="First name*"
                  required
                  disabled={isSubmitting}
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange("firstName")}
                />
                <ContactField
                  label="Last name*"
                  required
                  disabled={isSubmitting}
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange("lastName")}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ContactField
                  label="Work email*"
                  type="email"
                  required
                  disabled={isSubmitting}
                  placeholder="Enter your email"
                  value={formData.workEmail}
                  onChange={handleChange("workEmail")}
                />
                <ContactField
                  label="Phone*"
                  type="tel"
                  required
                  disabled={isSubmitting}
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange("phone")}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ContactField
                  label="Your role*"
                  required
                  disabled={isSubmitting}
                  placeholder="Enter your role"
                  value={formData.role}
                  onChange={handleChange("role")}
                />
                <ContactField
                  label="Organisation name*"
                  required
                  disabled={isSubmitting}
                  placeholder="Enter your organisation name"
                  value={formData.orgName}
                  onChange={handleChange("orgName")}
                />
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-lg font-semibold tracking-tight" style={{ color: INK }}>
                  What would you like to discuss?*
                </span>
                <textarea
                  required
                  disabled={isSubmitting}
                  rows={3}
                  placeholder="Write something...."
                  value={formData.discuss}
                  onChange={handleChange("discuss")}
                  className="w-full resize-none border-b bg-transparent pb-2 text-lg tracking-tight outline-none transition-colors duration-300 focus:border-[#DC3327] disabled:opacity-60"
                  style={{ borderColor: DIVIDER, color: INK }}
                />
              </label>

              {/* submit — shared CTAButton, full width of the form column */}
              <CTAButton
                type="submit"
                width="full"
                disabled={isSubmitting}
                loading={isSubmitting}
                className="mt-2"
              >
                {isSubmitting ? "SENDING..." : "Talk to a GCC Infrastructure Specialist"}
              </CTAButton>
            </FadeUp>
          </div>
        </form>
      </div>

      {toastMounted && (
        <GCCToast
          visible={toastVisible}
          onDone={() => setToastMounted(false)}
          message={toastMessage}
          isError={toastIsError}
        />
      )}
    </section>
  );
};

// ============================================================================
// ✦ GCC PAGE
// ============================================================================
const GCC = () => {
  const isMobileViewport = useIsMobileViewport();

  // ==========================================================================
  // ✦ HERO ENTRANCE — GSAP, scoped to heroRef via gsap.context so every
  // tween/listener it creates is torn down together on unmount (ctx.revert()),
  // instead of relying on hand-rolled cleanup for each one.
  //
  // Replaces the old FadeUp (opacity + 24px translateY, identical on every
  // element) with a proper choreographed reveal: the headline is masked
  // behind its own box with a clip-path "curtain" instead of just fading in,
  // the CTA row staggers button-by-button, and the globe scales/fades in
  // overlapping the tail of the text (timeline position offsets) rather than
  // waiting its turn — the difference between "things appear" and "a
  // sequence unfolds."
  //
  // Performance: only transform/opacity/clip-path are animated (all
  // compositor-friendly, no layout thrash), `will-change` is set for the
  // duration of the entrance only and cleared the moment it ends, the whole
  // thing is skipped for prefers-reduced-motion, and the one continuous loop
  // (the globe's idle float) pauses via the Page Visibility API when the tab
  // isn't in view instead of ticking in the background.
  // ==========================================================================
  const heroRef = useRef<HTMLElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const paraRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRowRef = useRef<HTMLDivElement | null>(null);
  const globeWrapRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // gsap.context() auto-reverts GSAP tweens/timelines created inside it,
    // but a plain addEventListener isn't a GSAP object — so this is tracked
    // and torn down by hand below rather than assumed to ride along.
    let floatTween: gsap.core.Tween | null = null;

    const ctx = gsap.context(() => {
      const heroEls = [
        eyebrowRef.current,
        headlineRef.current,
        paraRef.current,
        ctaRowRef.current,
        globeWrapRef.current,
      ].filter(Boolean) as HTMLElement[];

      if (reduceMotion) {
        // Respect the OS setting outright rather than a "smaller" version
        // of the same motion — just land everything in its resting state.
        gsap.set(heroEls, { clearProps: "all" });
        return;
      }

      gsap.set(heroEls, { willChange: "transform, opacity" });
      gsap.set(eyebrowRef.current, { autoAlpha: 0, y: 14 });
      gsap.set(headlineRef.current, { autoAlpha: 0, y: 28, clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(paraRef.current, { autoAlpha: 0, y: 16 });
      gsap.set(ctaRowRef.current ? Array.from(ctaRowRef.current.children) : [], { autoAlpha: 0, y: 14 });
      gsap.set(globeWrapRef.current, { autoAlpha: 0, scale: 0.88 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(eyebrowRef.current, { autoAlpha: 1, y: 0, duration: 0.5 })
        .to(
          headlineRef.current,
          { autoAlpha: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 0.95, ease: "power4.out" },
          "-=0.25"
        )
        .to(paraRef.current, { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.6")
        .to(
          ctaRowRef.current ? Array.from(ctaRowRef.current.children) : [],
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 },
          "-=0.35"
        )
        .to(globeWrapRef.current, { autoAlpha: 1, scale: 1, duration: 1.2, ease: "power3.out" }, "-=0.9")
        .add(() => gsap.set(heroEls, { clearProps: "willChange" }));

      // Idle float — a slow, few-pixel breathing motion on the globe once
      // the entrance settles, so the hero isn't dead-still afterward.
      // Transform-only. Assigned to the outer `floatTween` (not a local
      // const) so the visibility handler below — which lives outside this
      // gsap.context callback — can still reach it.
      floatTween = gsap.to(globeWrapRef.current, {
        y: "+=14",
        duration: 4.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.4,
      });
    }, heroRef);

    // Pause the one continuous loop when the tab isn't visible rather than
    // let it tick in the background.
    const handleVisibility = () => {
      if (!floatTween) return;
      if (document.hidden) floatTween.pause();
      else floatTween.resume();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      // Reverts every tween/timeline gsap.context tracked above (including
      // floatTween) and restores the pre-animation inline styles.
      ctx.revert();
    };
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>GCC Setup & IT Infrastructure Services in India | Sniper</title>
        <meta
          name="description"
          content="Sniper delivers end-to-end IT infrastructure for Global Capability Centers in India, including networks, cybersecurity, device rollout, and managed support."
        />
        <link rel="canonical" href={PAGE_URL} />
        <script type="application/ld+json">{JSON.stringify(SERVICE_JSON_LD)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_JSON_LD)}</script>
      </Helmet>

      {/*
        ✦ HERO — centered copy anchored to the TOP of the section, with the
        orbiting globe pinned to the bottom edge as a clipped semicircle
        underneath it. Two things this fixes vs. the earlier pass:

        1. STACKING CONTEXT: the copy block is a sibling that comes AFTER
           the globe in the DOM and carries `relative z-10`; the globe
           wrapper carries `z-0`. In a plain (non-flex-centered) stacking
           context the later DOM sibling with the higher z-index always
           wins, so the copy renders on top of the orbit rings rather than
           being covered by them.
        2. VERTICAL POSITION: the section no longer uses
           `justify-center` — the copy sits near the top via `pt-*`
           padding instead of being vertically centered in the viewport,
           which was pushing it down into the globe's territory. The globe
           wrapper is pinned to the section's bottom edge and shifted down
           by more than half its own height (`translate-y-[58%]`, not the
           full `50%` a literal half-circle would use), so a bit more than
           half is clipped by the section's `overflow-hidden` — it reads
           as a semicircle sitting low and clear of the copy above it,
           rather than a full circle bisecting the text.
      */}
      <section
        ref={heroRef}
        className="relative flex flex-col overflow-hidden pt-20 pb-0 sm:min-h-screen sm:pt-16 lg:pt-20"
        style={{ backgroundColor: PAPER }}
      >
        {/* fade — sits above the globe, below the copy panel. Lets orbiting
            badges dissolve into the page background before they reach the
            section's hard overflow-hidden edge, instead of abruptly
            popping in/out right at the clip line as they rotate through it. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-10 sm:h-40 lg:h-48"
          style={{ backgroundImage: `linear-gradient(to bottom, transparent 0%, ${PAPER} 88%)` }}
        />

        {/* ✦ BLUEPRINT FRAME — ties the hero into the same engineering-drawing
            language as ProblemsSection ("Setting Up a GCC"): hairline
            border, corner registration marks, a mono index row. Pure
            overlay (absolute, pointer-events-none, hidden < sm) so it
            never touches the GSAP entrance refs or the globe's own
            layout/overflow-hidden clipping. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 z-20 hidden border sm:inset-6 sm:block"
          style={{ borderColor: BP_LINE }}
        >
          {["-left-[5px] -top-[5px]", "-right-[5px] -top-[5px]", "-bottom-[5px] -left-[5px]", "-bottom-[5px] -right-[5px]"].map((pos) => (
            <Plus key={pos} strokeWidth={1} className={`absolute h-3.5 w-3.5 ${pos}`} style={{ color: INK }} />
          ))}
          <div
            className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-dashed px-4 py-3 font-mono text-[10px] uppercase tracking-[0.08em] sm:px-5"
            style={{ borderColor: BP_LINE, color: MUTE }}
          >
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 shrink-0" style={{ backgroundColor: RED }} />
              GCC Infrastructure Partner
            </span>
            <span>[00]</span>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-[1440px] w-full px-4 sm:px-6 lg:px-10">
          {/* Soft scrim behind the copy — the globe/orbit rings sit just
              below this block and can peek up behind the CTA at some
              breakpoints. The earlier pass used backdrop-filter: blur()
              clipped by a mask, which reads as an unnatural floating
              frosted rectangle (blur intensity doesn't fade with the mask,
              only opacity does — so you get a smeared patch with an odd
              edge) and is also the likely source of the mobile rendering
              glitches, since mask-image + backdrop-filter together are
              flaky on some mobile browsers. This replaces it with a plain
              radial-gradient wash of the page's own PAPER color — no blur,
              no mask, no compositing edge cases. It's solid at the center
              (fully legible behind the headline) and fades to fully
              transparent at the rim, so it reads as a soft glow rather
              than a panel. */}
          <div
            className="mx-auto max-w-3xl px-1 py-2 sm:px-10 sm:py-10"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 68% 75% at 50% 50%, rgba(246,245,243,0.94) 0%, rgba(246,245,243,0.72) 45%, rgba(246,245,243,0) 100%)",
            }}
          >
            <div ref={eyebrowRef} className="text-center">
              <Eyebrow align="center" compact>Build Technology-Ready Global Capability Centers</Eyebrow>
            </div>

            {/* clip-path curtain reveal — see the GSAP effect above. The
                overflow-hidden-by-clip-path lives on this wrapper, not the
                h1 itself, so the h1's own layout/line-breaks are untouched. */}
            <div ref={headlineRef} className="mt-6 text-center">
              <h1 className="text-[30px] sm:text-5xl md:text-6xl font-semibold tracking-[-2.1px] leading-[1.12] sm:leading-[1.08]">
                <span style={{ color: INK }}>Build & Scale Your<br className="sm:hidden" /> <span style={{ color: RED }}>GCC</span> IT<br className="sm:hidden" /> Infrastructure in India</span>
                
              </h1>
            </div>

            <p
              ref={paraRef}
              className="mt-6 mx-auto max-w-[34ch] text-center text-[15px] sm:max-w-2xl sm:text-xl tracking-tight leading-relaxed"
              style={{ color: MUTE }}
            >
             Sniper Systems helps global enterprises set up technology-ready GCCs in India — IT infrastructure, cloud, cybersecurity, AI, and workplace solutions under one partner.
            </p>

            <div ref={ctaRowRef} className="mt-7 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row sm:gap-4">
              <CTAButton href="#contact" width="full-mobile">Talk to a GCC Expert</CTAButton>
              {/* glass: the globe/orbit rings sit right behind this button at
                  several breakpoints, and as a secondary CTA it has no solid
                  fill of its own — glass gives it a frosted backdrop so the
                  animation behind it doesn't read through the button. */}
              <CTAButton href="#solutions" variant="secondary" icon="down" width="full-mobile" glass>
                Explore GCC Solutions
              </CTAButton>
            </div>
          </div>
        </div>

        {/* globe — ONE instance, two positioning modes.
            < sm: it's a normal in-flow block that sits under the copy at its
            natural square size, so the orbit reads as a complete circle
            instead of a slice. It comes after the copy in the DOM and the
            section is no longer min-h-screen at this width, so the page just
            ends where the circle ends — no dead space, nothing cropped. The
            wrapper is 420px square: OrbitingCirclesGlobeDemo hardcodes
            `minHeight: 420` on its own root div whenever `mobile` is true
            (see its source), so anything shorter than that gets silently
            stretched past what we declare here regardless of our own
            className. 420 also comfortably clears its widest mobile ring
            (174px radius × 2 = 348px), so the ring sits centered with real
            margin instead of touching the edge.
            ≥ sm: everything reverts to the previous desktop treatment —
            absolutely pinned to the section's bottom edge and pushed down
            past it (`translate-y-[46%]`) so `overflow-hidden` clips it into
            the semicircle the desktop mock shows. `z-0` keeps it behind the
            copy panel (`z-10`) at every width.
            MOBILE CROP: the 420px box is centred on the globe (y = 210). The
            -mb-[193px] pulls the section's bottom edge up to 227px, i.e. 17px
            below the globe centre, so `overflow-hidden` slices it into the
            upper-half orbit + ~60% globe from the mobile reference. `sm:mb-0`
            resets it so desktop is untouched.
            Switching modes on one element rather than rendering two copies
            matters here: `hidden` doesn't unmount, so a second instance
            would keep its animation loop running off-screen the whole time.
            THE `mobile` PROP: OrbitingCirclesGlobeDemo's ring radii, globe
            size and icon size are plain numbers computed in its own JS from
            this boolean — they are not CSS and don't respond to the
            Tailwind classes on the wrapper div at all. Without passing it,
            the component always rendered its desktop numbers (rings up to a
            1300px diameter) no matter how small the wrapper below sm was,
            which is what made the phone view break. `isMobileViewport` is
            a real `window.matchMedia` check against the same 640px cutoff
            Tailwind's own `sm:` uses, so this switches in lockstep with
            every other responsive rule on the page. */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none relative z-0 mx-auto -mt-1.5 -mb-[193px] h-[420px] w-[420px] max-w-full shrink-0
            sm:absolute sm:left-1/2 sm:bottom-14 sm:mt-0 sm:mb-0 sm:h-[620px] sm:w-[620px]
            sm:-translate-x-1/2 sm:translate-y-[46%]
            lg:bottom-16 lg:h-[840px] lg:w-[840px]
          "
        >
          {/* GSAP's entrance scale + idle float live on this inner layer,
              not the outer div above — the outer div's own translate-x-1/2
              /translate-y-[46%] classes are what center/position the globe
              on sm+, and an inline `transform` from GSAP would completely
              overwrite that (inline style always beats a utility class), so
              the two transforms are kept on separate elements. */}
          <div ref={globeWrapRef} className="h-full w-full">
            <OrbitingCirclesGlobeDemo mobile={isMobileViewport} />
          </div>
        </div>
      </section>

      {/*
        NumbersSection + LogoMarquee are visually part of the hero block
        above (stat cards + trusted-by strip riding directly under the
        hero art) — they intentionally use their own smaller padding scale
        rather than SECTION_PADDING, so there's no seam or big vertical
        jump between the hero and these two. ProblemsSection below is
        where the next full "chapter" of the page begins, and that's where
        the uniform SECTION_PADDING rhythm
        picks back up.
      */}
      <NumbersSection />
      <ProblemsSection />
      <SolutionsSection />
      <ApproachSection />
      <WorkProcessSection />
      <IndustrySolutionsSection />
      <BentoHighlightsSection />
      <PartnersSection />
      {/* <CaseStudiesSection /> */}
      <FAQSection />
      <ContactSection />
    </Layout>
  );
};

export default GCC;