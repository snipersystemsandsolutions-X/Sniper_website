"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { Layout } from "@/components/Layout"; // adjust to wherever your <Layout> lives
import lotus_mandela from "@/assets/lotus_mandela.png";

// Next.js gives an object with `.src`; Vite and CRA give a plain string. This handles both.
const lotusSrc: string = (() => {
  const asset: unknown = lotus_mandela;
  return typeof asset === "string" ? asset : (asset as { src: string }).src;
})();

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type CategoryId = "wearables" | "audio" | "accessories" | "security";
type CategoryFilter = CategoryId | "all";
type IconName = "watch" | "audio" | "speaker" | "buds" | "hub" | "bag" | "key" | "keyboard" | "plug";
type MotifKind = "rangoli" | "marigold" | "coins" | "mandala" | "lotus" | "tree" | "burst";
type SortKey = "catalogue" | "asc" | "desc";

interface Product {
  id: string;
  category: CategoryId;
  /** Small label above the name, e.g. "Workspace" */
  label: string;
  name: string;
  description: string;
  /** Starting price in INR */
  price: number;
  icon: IconName;
  /** Tile background colour (any CSS colour) */
  tint: string;
  /** Optional real product image. When set, it replaces the icon. */
  image?: string;
}

interface BudgetBand {
  value: string;
  label: string;
  min: number;
  /** Exclusive upper bound */
  max: number;
}

interface Festival {
  id: string;
  /** Shown as the coloured eyebrow, e.g. "Diwali" */
  name: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  /** Card title */
  headline: string;
  /** Category the card's button opens in the catalogue */
  suggest: CategoryId;
  suggestLabel: string;
  /** Soft card background (full Tailwind classes, kept literal so the JIT can find them) */
  surface: string;
  /** Eyebrow text colour class */
  accent: string;
  /** Glow colour behind the illustration (6-digit hex) */
  glow: string;
  motif: MotifKind;
}

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "All gifts" },
  { id: "wearables", label: "Wearables" },
  { id: "audio", label: "Audio" },
  { id: "accessories", label: "Tech accessories" },
  { id: "security", label: "Security" },
];

const OFFER: Record<CategoryId, { title: string; text: string; icon: IconName }> = {
  wearables: { title: "Wearables", text: "Smartwatches and fitness bands for people who track their day.", icon: "watch" },
  audio: { title: "Audio", text: "Headphones, earbuds and speakers for focus, calls and downtime.", icon: "audio" },
  accessories: { title: "Tech accessories", text: "Hubs, chargers, bags and desk gear that make work easier.", icon: "hub" },
  security: { title: "Security", text: "Hardware security keys that protect accounts from phishing.", icon: "key" },
};

const BUDGETS: BudgetBand[] = [
  { value: "u2", label: "Under ₹2,000", min: 0, max: 2000 },
  { value: "2to5", label: "₹2,000 to ₹5,000", min: 2000, max: 5000 },
  { value: "5to25", label: "₹5,000 to ₹25,000", min: 5000, max: 25000 },
  { value: "25p", label: "Above ₹25,000", min: 25000, max: Number.POSITIVE_INFINITY },
];

const PRODUCTS: Product[] = [
  { id: "apple-watch", category: "wearables", label: "Wearables", name: "Apple Watch", description: "The Apple Watch range, including Ultra.", price: 39499, icon: "watch", tint: "#dfe6f3" },
  { id: "samsung-watch", category: "wearables", label: "Wearables", name: "Samsung Galaxy Watch", description: "Round smartwatches in several sizes and colours.", price: 26599, icon: "watch", tint: "#d6ece4" },
  { id: "boat-watch", category: "wearables", label: "Wearables", name: "boAt Watches", description: "Round and square smartwatches, plus a smart ring.", price: 1770, icon: "watch", tint: "#f4e3d3" },
  { id: "amazfit", category: "wearables", label: "Wearables", name: "Amazfit", description: "Round and square smartwatches.", price: 3999, icon: "watch", tint: "#e8e0f2" },

  { id: "apple-audio", category: "audio", label: "Audio", name: "Apple Audio", description: "AirPods and AirPods Max.", price: 23199, icon: "audio", tint: "#e6e6ea" },
  { id: "samsung-audio", category: "audio", label: "Audio", name: "Samsung Audio", description: "Galaxy Buds and AKG over-ear headphones.", price: 5699, icon: "buds", tint: "#e6dcf3" },
  { id: "boat-audio", category: "audio", label: "Audio", name: "boAt Audio", description: "Headphones and gaming headsets.", price: 1359, icon: "audio", tint: "#f1d9d4" },
  { id: "honeywell-audio", category: "audio", label: "Audio", name: "Honeywell Audio", description: "Bluetooth speaker and wireless headphones.", price: 1199, icon: "speaker", tint: "#d9ead7" },
  { id: "google-audio", category: "audio", label: "Audio", name: "Google Audio", description: "Nest speaker and Pixel Buds.", price: 5359, icon: "speaker", tint: "#e3e8ee" },
  { id: "amazon-echo", category: "audio", label: "Audio", name: "Amazon Echo", description: "Echo speakers, from compact to premium.", price: 3499, icon: "speaker", tint: "#dbe7ef" },
  { id: "boat-speakers", category: "audio", label: "Audio", name: "boAt Speakers", description: "Earbuds, headphones, party speaker and soundbar.", price: 1219, icon: "speaker", tint: "#f4dcc9" },
  { id: "epos", category: "audio", label: "Audio", name: "EPOS", description: "Wired and foldable office headsets.", price: 3599, icon: "audio", tint: "#e1e4e8" },
  { id: "poly", category: "audio", label: "Audio", name: "Poly", description: "Wired headsets, wireless headsets and a speakerphone.", price: 3285, icon: "audio", tint: "#f0ddd9" },
  { id: "jabra", category: "audio", label: "Audio", name: "Jabra", description: "Office headsets and true wireless earbuds.", price: 3999, icon: "buds", tint: "#f6efc9" },

  { id: "cadyce", category: "accessories", label: "Workspace", name: "Cadyce", description: "USB-C hub, adapters and cables.", price: 595, icon: "hub", tint: "#e5e7ea" },
  { id: "belkin", category: "accessories", label: "Workspace", name: "Belkin", description: "Magnetic power bank, charger and USB-C hub.", price: 3249, icon: "plug", tint: "#e9e9e9" },
  { id: "alogic", category: "accessories", label: "Workspace", name: "Alogic", description: "Docks, hubs and adapters.", price: 1349, icon: "hub", tint: "#e4e8ec" },
  { id: "logitech", category: "accessories", label: "Workspace", name: "Logitech", description: "Keyboard, mouse and wrist rest.", price: 215, icon: "keyboard", tint: "#e3e9f1" },
  { id: "phone-desk", category: "accessories", label: "Tech accessories", name: "Phone and desk accessories", description: "Cases, chargers, presenters, earphones and neckbands from Samsung, Logitech, Honeywell, EPOS and boAt.", price: 345, icon: "plug", tint: "#f3e6cf" },
  { id: "laptop-bags", category: "accessories", label: "Tech accessories", name: "Laptop bags", description: "Backpacks, sleeves and briefcases from STM Goods, Dicota and Tucano.", price: 1315, icon: "bag", tint: "#dde7e3" },

  { id: "yubico", category: "security", label: "Security", name: "Yubico", description: "YubiKey security keys in USB-C, USB-A, NFC and Lightning.", price: 4000, icon: "key", tint: "#efe8c8" },
];

/** Upcoming Indian festive dates, soonest first. Past dates are hidden automatically. */
const FESTIVALS: Festival[] = [
  { id: "dussehra", name: "Dussehra", date: "2026-10-20", headline: "Mark the win with a gift that lasts.", suggest: "wearables", suggestLabel: "Wearables", surface: "bg-gradient-to-b from-white via-[#fffaf0] to-[#ffe7c2]", accent: "text-[#c2570c]", glow: "#ffb347", motif: "marigold" },
  { id: "dhanteras", name: "Dhanteras", date: "2026-11-06", headline: "A day for new buys. Gift tech that lasts.", suggest: "audio", suggestLabel: "Audio", surface: "bg-gradient-to-b from-white via-[#fffdf2] to-[#fff0b8]", accent: "text-[#a16207]", glow: "#ffd54a", motif: "coins" },
  { id: "diwali", name: "Diwali", date: "2026-11-08", headline: "Light up every desk this Diwali.", suggest: "accessories", suggestLabel: "Tech accessories", surface: "bg-gradient-to-b from-white via-[#fff7fa] to-[#ffd9e8]", accent: "text-[#d6176f]", glow: "#ff7eb6", motif: "rangoli" },
  { id: "bhai-dooj", name: "Bhai Dooj", date: "2026-11-11", headline: "Small thank-yous. Big smiles.", suggest: "audio", suggestLabel: "Audio", surface: "bg-gradient-to-b from-white via-[#fbf5ff] to-[#ead8ff]", accent: "text-[#8e3fd1]", glow: "#c79bff", motif: "mandala" },
  { id: "gurpurab", name: "Guru Nanak Jayanti", date: "2026-11-24", headline: "A season of gratitude, gifted well.", suggest: "accessories", suggestLabel: "Tech accessories", surface: "bg-gradient-to-b from-white via-[#f4f8ff] to-[#d9e7ff]", accent: "text-[#2563c9]", glow: "#8db6ff", motif: "lotus" },
  { id: "christmas", name: "Christmas", date: "2026-12-25", headline: "Year-end thank-yous, wrapped and ready.", suggest: "wearables", suggestLabel: "Wearables", surface: "bg-gradient-to-b from-white via-[#f4fcf6] to-[#d3f1dc]", accent: "text-[#1b7f45]", glow: "#7fd69b", motif: "tree" },
  { id: "new-year", name: "New Year 2027", date: "2027-01-01", headline: "Start 2027 with every account protected.", suggest: "security", suggestLabel: "Security", surface: "bg-gradient-to-b from-white via-[#f7f4ff] to-[#dcd6ff]", accent: "text-[#4f46e5]", glow: "#a5a0ff", motif: "burst" },
];

const OFFER_IDS = Object.keys(OFFER) as CategoryId[];
const AUTOPLAY_MS = 2500;
const SLIDER_MS = 4500;

interface HeroSlide {
  /** Path under /public (or a static import) */
  src: string;
  alt: string;
  /** CSS object-position, e.g. "right center" */
  position?: string;
  /** Optional white caption on the top-left of the slide */
  overlay?: { title: string; muted?: string };
}

/** Put your slide images in /public/hero. Add `overlay` for a caption like "The best companies. For the people". */
const HERO_SLIDES: HeroSlide[] = [
  { src: "/hero/slide-01-wearables.png", alt: "Smartwatches in festive gift boxes" },
  { src: "/hero/slide-02-audio.png", alt: "Headphones, speakers and earbuds in gift boxes" },
  { src: "/hero/slide-03-accessories.png", alt: "Bags, power banks and hubs in gift boxes" },
  { src: "/hero/slide-04-security.png", alt: "Security keys in gift boxes" },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const formatINR = (n: number): string =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

/** Whole days from today (local) to an ISO date. Negative if the date has passed. */
const daysUntil = (iso: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${iso}T00:00:00`);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
};

const formatFestivalDate = (iso: string): string =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

/* -------------------------------------------------------------------------- */
/*  Icons and motifs                                                          */
/* -------------------------------------------------------------------------- */

const ICON_PATHS: Record<IconName, ReactNode> = {
  watch: (
    <>
      <rect x="19" y="16" width="26" height="32" rx="8" />
      <path d="M24 16l2-9h12l2 9M24 48l2 9h12l2-9" />
      <path d="M32 26v7l5 3" />
    </>
  ),
  audio: (
    <>
      <path d="M12 40V32a20 20 0 0 1 40 0v8" />
      <rect x="9" y="38" width="10" height="16" rx="4" />
      <rect x="45" y="38" width="10" height="16" rx="4" />
    </>
  ),
  speaker: (
    <>
      <rect x="16" y="8" width="32" height="48" rx="12" />
      <circle cx="32" cy="38" r="8" />
      <circle cx="32" cy="38" r="2" fill="currentColor" />
      <path d="M26 19h12" />
    </>
  ),
  buds: (
    <>
      <path d="M22 12a8 8 0 0 0-8 8c0 5 4 7 4 12v14a4 4 0 0 0 8 0V20a8 8 0 0 0-4-8z" />
      <path d="M42 12a8 8 0 0 1 8 8c0 5-4 7-4 12v14a4 4 0 0 1-8 0V20a8 8 0 0 1 4-8z" />
    </>
  ),
  hub: (
    <>
      <rect x="8" y="22" width="48" height="20" rx="5" />
      <path d="M16 29h8M30 29h4M40 29h8M16 36h32" />
      <path d="M32 42v10c0 4 4 6 8 6h8" />
    </>
  ),
  bag: (
    <>
      <rect x="14" y="18" width="36" height="40" rx="10" />
      <path d="M24 18v-4a8 8 0 0 1 16 0v4" />
      <path d="M22 36h20M22 46h12" />
    </>
  ),
  key: (
    <>
      <rect x="18" y="6" width="28" height="36" rx="8" />
      <circle cx="32" cy="17" r="3" />
      <circle cx="32" cy="29" r="6" />
      <rect x="25" y="42" width="14" height="16" rx="2" />
      <path d="M29 47v6M35 47v6" />
    </>
  ),
  keyboard: (
    <>
      <rect x="5" y="20" width="40" height="24" rx="5" />
      <path d="M12 28h2M20 28h2M28 28h2M36 28h2M12 36h26" />
      <rect x="48" y="22" width="11" height="20" rx="5.5" />
      <path d="M53.5 22v7" />
    </>
  ),
  plug: (
    <>
      <rect x="16" y="22" width="32" height="26" rx="7" />
      <path d="M25 22v-9M39 22v-9M32 48v8" />
      <path d="M28 31l-3 5h6l-3 5" />
    </>
  ),
};

function GiftIcon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

/** Festive illustrations: layered gradients, drawn to bleed off the bottom of a card. */
function Petals({
  count,
  cy,
  rx,
  ry,
  fill,
  offset = 0,
  opacity = 1,
}: {
  count: number;
  cy: number;
  rx: number;
  ry: number;
  fill: string;
  offset?: number;
  opacity?: number;
}) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <ellipse
          key={i}
          cx={120}
          cy={cy}
          rx={rx}
          ry={ry}
          fill={fill}
          fillOpacity={opacity}
          transform={`rotate(${offset + (i * 360) / count} 120 120)`}
        />
      ))}
    </>
  );
}

function Grad({ id, from, to, vertical = true }: { id: string; from: string; to: string; vertical?: boolean }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2={vertical ? "0" : "1"} y2={vertical ? "1" : "1"}>
      <stop offset="0" stopColor={from} />
      <stop offset="1" stopColor={to} />
    </linearGradient>
  );
}

function Coin({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="url(#cn-g)" />
      <circle cx={cx} cy={cy} r={r * 0.78} fill="none" stroke="#fff" strokeOpacity=".65" strokeWidth={2.5} />
      <text x={cx} y={cy + r * 0.34} textAnchor="middle" fontSize={r * 0.95} fontWeight={700} fill="#fff" fillOpacity=".9">
        ₹
      </text>
    </g>
  );
}

const star = (x: number, y: number, s: number, fill: string) => (
  <path
    d={`M${x} ${y - s}c${s * 0.12} ${s * 0.6} ${s * 0.4} ${s * 0.88} ${s} ${s}-${s * 0.6} ${s * 0.12}-${s * 0.88} ${s * 0.4}-${s} ${s}-${s * 0.12}-${s * 0.6}-${s * 0.4}-${s * 0.88}-${s}-${s} ${s * 0.6}-${s * 0.12} ${s * 0.88}-${s * 0.4} ${s}-${s}z`}
    fill={fill}
  />
);

const BURST_COLORS = ["#ff5a36", "#f4b400", "#34a853", "#3b8be0", "#a855f7", "#ff5fa2"];

function Illustration({ kind, className }: { kind: MotifKind; className?: string }) {
  let body: ReactNode = null;
  switch (kind) {
    case "rangoli":
      body = (
        <>
          <defs>
            <Grad id="rg-a" from="#ff5fa2" to="#ff9a4d" />
            <Grad id="rg-b" from="#ffc2dc" to="#ffb27a" />
          </defs>
          <Petals count={12} cy={30} rx={19} ry={30} fill="url(#rg-b)" offset={15} />
          <Petals count={12} cy={58} rx={17} ry={34} fill="url(#rg-a)" />
          <Petals count={8} cy={84} rx={13} ry={24} fill="#fff" opacity={0.6} offset={22} />
          <circle cx={120} cy={120} r={20} fill="url(#rg-a)" />
          <circle cx={120} cy={120} r={8} fill="#fff" />
          {Array.from({ length: 12 }, (_, i) => (
            <circle key={i} cx={120} cy={4} r={3.5} fill="#ff7eb6" transform={`rotate(${i * 30} 120 120)`} />
          ))}
        </>
      );
      break;
    case "marigold":
      body = (
        <g transform="translate(24 24) scale(.8)">
          <defs>
            <Grad id="mg-a" from="#ffcf3f" to="#fb8500" />
            <Grad id="mg-b" from="#ffe27a" to="#ffae1a" />
          </defs>
          <Petals count={4} cy={26} rx={22} ry={40} fill="#9fd88a" offset={45} />
          <Petals count={18} cy={40} rx={15} ry={30} fill="url(#mg-a)" />
          <Petals count={18} cy={58} rx={13} ry={25} fill="url(#mg-b)" offset={10} />
          <Petals count={12} cy={78} rx={11} ry={19} fill="#ff9f1c" offset={5} />
          <circle cx={120} cy={120} r={17} fill="#d9480f" />
          <circle cx={120} cy={120} r={8} fill="#ffb347" />
        </g>
      );
      break;
    case "coins":
      body = (
        <>
          <defs>
            <Grad id="cn-g" from="#ffe066" to="#e0a21b" />
          </defs>
          <Coin cx={52} cy={176} r={32} />
          <Coin cx={190} cy={182} r={28} />
          <Coin cx={120} cy={132} r={72} />
          {star(40, 70, 9, "#ffd54a")}
          {star(204, 84, 7, "#ffd54a")}
          {star(176, 28, 5, "#ffe9a0")}
        </>
      );
      break;
    case "mandala":
      body = (
        <>
          <defs>
            <Grad id="md-a" from="#b57bff" to="#ff8fb8" />
          </defs>
          <Petals count={8} cy={34} rx={22} ry={38} fill="url(#md-a)" />
          <Petals count={8} cy={34} rx={22} ry={38} fill="url(#md-a)" offset={22.5} opacity={0.55} />
          <Petals count={8} cy={66} rx={15} ry={28} fill="#ffd9ee" offset={22.5} />
          <Petals count={16} cy={92} rx={6} ry={13} fill="#fff" opacity={0.8} />
          <circle cx={120} cy={120} r={22} fill="#fff" />
          <circle cx={120} cy={120} r={11} fill="url(#md-a)" />
          {Array.from({ length: 16 }, (_, i) => (
            <circle key={i} cx={120} cy={6} r={3} fill="#c79bff" transform={`rotate(${i * 22.5} 120 120)`} />
          ))}
        </>
      );
      break;
    case "lotus":
      body = (
        <>
          <defs>
            <Grad id="lt-a" from="#a78bfa" to="#f9a8d4" />
            <Grad id="lt-b" from="#e9d5ff" to="#fbcfe8" />
          </defs>
          {[-72, -48, -24, 0, 24, 48, 72].map((a) => (
            <ellipse key={`b${a}`} cx={120} cy={120} rx={24} ry={72} fill="url(#lt-b)" transform={`rotate(${a} 120 196)`} />
          ))}
          {[-60, -30, 0, 30, 60].map((a) => (
            <ellipse key={`f${a}`} cx={120} cy={132} rx={24} ry={62} fill="url(#lt-a)" fillOpacity=".9" transform={`rotate(${a} 120 196)`} />
          ))}
          <ellipse cx={120} cy={196} rx={78} ry={12} fill="#8ec5ff" fillOpacity=".4" />
          <circle cx={120} cy={42} r={8} fill="#ffd166" />
        </>
      );
      break;
    case "tree":
      body = (
        <>
          <defs>
            <Grad id="tr-g" from="#4cc27a" to="#1e7d3a" />
          </defs>
          <rect x={108} y={196} width={24} height={34} rx={4} fill="#a0643c" />
          <path d="M120 98L200 196H40z" fill="url(#tr-g)" />
          <path d="M120 58L184 140H56z" fill="url(#tr-g)" />
          <path d="M120 20L170 90H70z" fill="url(#tr-g)" />
          {star(120, 16, 11, "#ffd54a")}
          <circle cx={98} cy={128} r={7} fill="#ff6b6b" />
          <circle cx={142} cy={158} r={7} fill="#ffd54a" />
          <circle cx={86} cy={176} r={7} fill="#6bb6ff" />
          <circle cx={150} cy={112} r={6} fill="#ff9ad5" />
          <circle cx={118} cy={182} r={6} fill="#fff" fillOpacity=".9" />
        </>
      );
      break;
    case "burst":
      body = (
        <>
          {Array.from({ length: 18 }, (_, i) => {
            const long = i % 2 === 0;
            const c = BURST_COLORS[i % BURST_COLORS.length];
            return (
              <g key={i} transform={`rotate(${i * 20} 120 120)`}>
                <line x1={120} y1={72} x2={120} y2={long ? 22 : 40} stroke={c} strokeWidth={7} strokeLinecap="round" />
                {long && <circle cx={120} cy={8} r={5} fill={c} />}
              </g>
            );
          })}
          <circle cx={120} cy={120} r={30} fill="#fff" fillOpacity=".85" />
          {star(120, 120, 18, "#f4b400")}
        </>
      );
      break;
  }
  return (
    <svg viewBox="0 0 240 240" overflow="visible" className={className} aria-hidden="true">
      {body}
    </svg>
  );
}

/** Only the radially symmetric illustrations rotate slowly. */
const SPINS: Record<MotifKind, boolean> = {
  rangoli: true,
  marigold: true,
  mandala: true,
  burst: true,
  coins: false,
  lotus: false,
  tree: false,
};

/* -------------------------------------------------------------------------- */
/*  Hero + festive carousel                                                   */
/* -------------------------------------------------------------------------- */

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SCALE = [1, 0.88, 0.78, 0.7];
const OPACITY = [1, 0.92, 0.78, 0.55];
const GAP = 16;
const SPRING = { type: "spring" as const, stiffness: 230, damping: 28, mass: 0.8 };
const INSTANT = { duration: 0 };

/** Horizontal centre of the card at signed position k, so cards sit edge to edge with a fixed gap. */
const xAt = (k: number, W: number): number => {
  const a = Math.abs(k);
  if (a === 0) return 0;
  let edge = W / 2;
  let centre = 0;
  for (let j = 1; j <= a; j++) {
    const w = W * (SCALE[j] ?? 0.7);
    centre = edge + GAP + w / 2;
    edge += GAP + w;
  }
  return Math.sign(k) * centre;
};

/** Signed position of slide i relative to the active slide, wrapped so the list loops forever. */
const relPos = (i: number, active: number, n: number): number => {
  const k = (((i - active) % n) + n) % n;
  return k > n / 2 ? k - n : k;
};

const minPrice = (c: CategoryId): number =>
  Math.min(...PRODUCTS.filter((p) => p.category === c).map((p) => p.price));

interface SlideProps {
  festival: Festival;
  k: number;
  prevK: number;
  n: number;
  index: number;
  total: number;
  W: number;
  Hc: number;
  days: number | null;
  reduced: boolean;
  onActivate: () => void;
  onSelectCategory: (category: CategoryId) => void;
}

function Slide({
  festival: f,
  k,
  prevK,
  n,
  index,
  total,
  W,
  Hc,
  days,
  reduced,
  onActivate,
  onSelectCategory,
}: SlideProps) {
  const abs = Math.abs(k);
  const active = k === 0;

  // A card jumping from one end of the loop to the other is repositioned instantly and faded in,
  // so it never flies across the screen.
  const wrapped = Math.abs(k - prevK) > n / 2;
  const move = reduced || wrapped ? INSTANT : SPRING;

  const countdown =
    days === null ? "" : days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days} days to go`;

  return (
    <m.article
      initial={false}
      animate={{
        x: xAt(k, W),
        scale: SCALE[abs] ?? 0.7,
        opacity: abs > 3 ? 0 : wrapped ? [0, 1] : OPACITY[abs],
      }}
      transition={{ x: move, scale: move, opacity: { duration: reduced ? 0 : 0.3 } }}
      onClick={() => !active && onActivate()}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}: ${f.name}`}
      aria-hidden={!active}
      style={{ width: W, height: Hc, marginLeft: -W / 2, zIndex: 10 - abs, willChange: "transform" }}
      className={`absolute left-1/2 top-6 overflow-hidden rounded-[28px] shadow-[0_2px_24px_rgba(0,0,0,0.07)] ring-1 ring-black/5 ${f.surface} ${
        active ? "" : "cursor-pointer"
      }`}
    >
      {/* Soft glow behind the illustration */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5"
        style={{ background: `radial-gradient(65% 65% at 50% 100%, ${f.glow}66, transparent 72%)` }}
      />

      {/* Illustration bleeding off the bottom edge */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 w-[82%] -translate-x-1/2 translate-y-[16%]">
        <Illustration
          kind={f.motif}
          className={`h-auto w-full ${SPINS[f.motif] ? "animate-[spin_90s_linear_infinite] motion-reduce:animate-none" : ""}`}
        />
      </div>

      {/* Copy */}
      <div className="relative z-10 p-6 sm:p-7">
        <p className={`text-[12px] font-semibold uppercase tracking-wide ${f.accent}`}>
          {f.name} &middot; {formatFestivalDate(f.date)}
        </p>
        <h3 className="mt-2 text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#1d1d1f] sm:text-[30px]">
          {f.headline}
        </h3>
        <p className="mt-2 text-[15px] leading-snug text-neutral-600">
          {countdown && `${countdown} · `}
          {f.suggestLabel} from {formatINR(minPrice(f.suggest))}
        </p>
        <button
          type="button"
          tabIndex={active ? 0 : -1}
          onClick={(e) => {
            e.stopPropagation();
            onSelectCategory(f.suggest);
          }}
          className="mt-4 inline-flex h-10 items-center rounded-full bg-[#1d1d1f] px-5 text-sm font-medium text-white transition-colors hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ee2a2a]"
        >
          See {f.suggestLabel.toLowerCase()}
        </button>
      </div>
    </m.article>
  );
}

function FestiveCards({ onSelectCategory }: { onSelectCategory: (category: CategoryId) => void }) {
  const reduced = useReducedMotion() ?? false;

  // Days-left depends on "today", so it is computed after mount to avoid hydration mismatches.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const slides = useMemo(() => {
    if (!mounted) return FESTIVALS;
    const upcoming = FESTIVALS.filter((f) => daysUntil(f.date) >= 0);
    return upcoming.length ? upcoming : FESTIVALS;
  }, [mounted]);
  const n = slides.length;

  // `prev` lets each card know where it came from, so wrap-around jumps can be hidden.
  const [pos, setPos] = useState({ index: 0, prev: 0 });
  const go = useCallback(
    (i: number) => setPos((s) => ({ index: ((i % n) + n) % n, prev: s.index })),
    [n],
  );

  // Responsive sizing from the stage width
  const stageRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const [cw, setCw] = useState(1200);
  useIsoLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const read = () => setCw((prev) => (prev === el.clientWidth ? prev : el.clientWidth));
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const W = Math.min(440, Math.round(cw * 0.8));
  const Hc = Math.round(W * (W >= 400 ? 1.12 : 1.22));

  // Autoplay: one card at a time, paused when held, off-screen, in a background tab, or by choice
  const [playing, setPlaying] = useState(true);
  const [hold, setHold] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const el = regionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    if (!playing || hold || !inView || !tabVisible || reduced || n < 2) return;
    const id = window.setTimeout(() => go(pos.index + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [playing, hold, inView, tabVisible, reduced, n, pos.index, go]);

  const ring =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ee2a2a]";
  const ctrl = `grid h-10 w-10 place-items-center rounded-full border border-neutral-300 text-neutral-950 transition-colors hover:border-neutral-950 ${ring}`;
  const fade = "linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%)";

  return (
    <LazyMotion features={domAnimation} strict>
      <section id="festive" className="scroll-mt-24 pt-16 sm:pt-20">
        {/* Festive carousel */}
        <div
          ref={regionRef}
          className="relative"
          role="region"
          aria-roledescription="carousel"
          aria-label="Upcoming Indian festivals"
          onMouseEnter={() => setHold(true)}
          onMouseLeave={() => setHold(false)}
          onFocus={() => setHold(true)}
          onBlur={() => setHold(false)}
        >
          <h2 className="px-4 text-center text-2xl font-semibold tracking-[-0.02em] sm:text-[28px]">
            <span className="bg-gradient-to-r from-[#e0197d] to-[#ff8a4c] bg-clip-text text-transparent">
              Festive gifting.
            </span>{" "}
            <span className="text-neutral-500">Plan the season early.</span>
          </h2>

          <div
            ref={stageRef}
            className="relative mt-4 w-full overflow-hidden"
            style={{ height: Hc + 48, maskImage: fade, WebkitMaskImage: fade }}
          >
            {slides.map((f, i) => (
              <Slide
                key={f.id}
                festival={f}
                k={relPos(i, pos.index, n)}
                prevK={relPos(i, pos.prev, n)}
                n={n}
                index={i}
                total={n}
                W={W}
                Hc={Hc}
                days={mounted ? daysUntil(f.date) : null}
                reduced={reduced}
                onActivate={() => go(i)}
                onSelectCategory={onSelectCategory}
              />
            ))}
          </div>

          <div className="mt-2 flex items-center justify-center gap-3 sm:gap-4">
            <button type="button" onClick={() => go(pos.index - 1)} aria-label="Previous festival" className={ctrl}>
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 3L5 8l5 5" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              {slides.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to ${f.name}`}
                  aria-current={i === pos.index}
                  className={`h-2 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                    i === pos.index ? "w-6 bg-[#ee2a2a]" : "w-2 bg-neutral-300 hover:bg-neutral-400"
                  }`}
                />
              ))}
            </div>
            <button type="button" onClick={() => go(pos.index + 1)} aria-label="Next festival" className={ctrl}>
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 3l5 5-5 5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause autoplay" : "Play autoplay"}
              className={ctrl}
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                {playing ? <path d="M4 3h3v10H4zM9 3h3v10H9z" /> : <path d="M5 3l8 5-8 5z" />}
              </svg>
            </button>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero intro: lotus, headline, buttons                                      */
/* -------------------------------------------------------------------------- */

function HeroIntro() {
  const ring =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ee2a2a]";
  return (
    <section className="relative">
      {/* Soft rose glow that fades into the page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[150px] bg-gradient-to-b from-[#ecb3ba] via-[#f6dde0] to-transparent"
      />
      {/* Lotus, cropped by the top edge. Raise or lower it with the translate value. */}
      <div aria-hidden="true" className="pointer-events-none relative h-[110px] w-full overflow-hidden">
        <img
          src={lotusSrc}
          alt=""
          decoding="async"
          className="absolute left-1/2 top-0 h-auto w-[300px] -translate-x-1/2 -translate-y-[40%] sm:w-[340px]"
        />
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-10 text-center sm:px-6 sm:pt-14">
        <h1 className="text-6xl font-semibold leading-[1.06] tracking-tighter text-neutral-950">
          <span className="block">Gift thousands.</span>
          <span className="block">
            Make each{" "}
            <span className="bg-gradient-to-r from-[#ee2a2a] to-[#ff7a7a] bg-clip-text text-transparent">
              one feel chosen
            </span>
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-[46ch] text-base tracking-[-0.01em] text-neutral-500 sm:text-lg">
          One catalogue of watches, audio, accessories and security keys, priced upfront and ready to quote for any
          team size.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#offer"
            className={`inline-flex h-12 items-center rounded-full bg-[#ee2a2a] px-7 text-[15px] font-medium text-white transition-colors hover:bg-[#d41f1f] ${ring}`}
          >
            What can we gift?
          </a>
          <a
            href="#catalogue"
            className={`inline-flex h-12 items-center rounded-full border border-neutral-400 px-7 text-[15px] font-medium text-neutral-950 transition-colors hover:border-neutral-950 hover:bg-neutral-950 hover:text-white ${ring}`}
          >
            Browse the catalogue
          </a>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero image slider                                                         */
/* -------------------------------------------------------------------------- */

function HeroSlider() {
  const reduced = useReducedMotion() ?? false;
  const total = HERO_SLIDES.length;

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hold, setHold] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const regionRef = useRef<HTMLElement>(null);

  // Pause when off-screen or when the tab is in the background
  useEffect(() => {
    const el = regionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    if (!playing || hold || !inView || !tabVisible || reduced || total < 2) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % total), SLIDER_MS);
    return () => window.clearTimeout(id);
  }, [playing, hold, inView, tabVisible, reduced, total, index]);

  return (
    <LazyMotion features={domAnimation} strict>
      <section
        ref={regionRef}
        aria-roledescription="carousel"
        aria-label="Featured gifting ideas"
        className="mx-auto mt-10 w-full max-w-[1600px] px-4 sm:mt-12 sm:px-[6%]"
        onMouseEnter={() => setHold(true)}
        onMouseLeave={() => setHold(false)}
        onFocus={() => setHold(true)}
        onBlur={() => setHold(false)}
      >
        <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] bg-[#2a1608] shadow-[0_8px_40px_rgba(0,0,0,0.12)] sm:aspect-[2.4/1] lg:aspect-[3.1/1]">
          {HERO_SLIDES.map((s, i) => (
            <m.div
              key={s.src}
              initial={false}
              animate={{ opacity: i === index ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.7, ease: "easeInOut" }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${total}`}
              aria-hidden={i !== index}
              className="absolute inset-0"
              style={{ pointerEvents: i === index ? "auto" : "none" }}
            >
              <img
                src={s.src}
                alt={s.alt}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: s.position ?? "center" }}
              />
              {s.overlay && (
                <>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
                  <p className="absolute left-6 top-6 text-xl font-semibold tracking-[-0.02em] text-white sm:left-14 sm:top-12 sm:text-[28px]">
                    {s.overlay.title}
                    {s.overlay.muted && <span className="text-white/60"> {s.overlay.muted}</span>}
                  </p>
                </>
              )}
            </m.div>
          ))}

          {/* Dashes + pause */}
          <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className="group py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span
                  className={`block h-1 w-9 rounded-full transition-colors duration-300 motion-reduce:transition-none ${
                    i === index ? "bg-white" : "bg-white/45 group-hover:bg-white/70"
                  }`}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-black/35 text-white transition-colors hover:bg-black/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:bottom-4 sm:right-4"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
              {playing ? <path d="M4 3h3v10H4zM9 3h3v10H9z" /> : <path d="M5 3l8 5-8 5z" />}
            </svg>
          </button>
        </div>
      </section>
    </LazyMotion>
  );
}

/* -------------------------------------------------------------------------- */
/*  What we gift                                                              */
/* -------------------------------------------------------------------------- */

function OfferGrid({ onSelect }: { onSelect: (category: CategoryId) => void }) {
  return (
    <section id="offer" className="scroll-mt-24 pt-24">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[clamp(2rem,4.2vw,3.2rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-neutral-950">
            Four kinds of gifts, one simple catalogue
          </h2>
          <p className="mt-3 text-base tracking-[-0.01em] text-neutral-500 sm:text-lg">
            Pick a category to see what we can supply and where the prices start.
          </p>
        </div>

        <div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {OFFER_IDS.map((id) => {
            const o = OFFER[id];
            const items = PRODUCTS.filter((p) => p.category === id);
            const min = Math.min(...items.map((p) => p.price));
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelect(id)}
                className="flex min-h-[260px] flex-col gap-3.5 rounded-[28px] border border-neutral-200 bg-white p-6 text-left transition-colors hover:border-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ee2a2a]"
              >
                <span className="grid h-[52px] w-[52px] place-items-center rounded-2xl bg-neutral-100 text-neutral-950">
                  <GiftIcon name={o.icon} className="h-7 w-7" />
                </span>
                <h3 className="mt-1.5 text-xl font-semibold tracking-[-0.03em] text-neutral-950">{o.title}</h3>
                <p className="flex-1 text-sm text-neutral-500">{o.text}</p>
                <span className="text-[13px] text-neutral-500">
                  {items.length} ranges, starting from
                  <b className="block text-xl font-semibold tracking-[-0.03em] text-neutral-950">
                    {formatINR(min)}
                  </b>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Product catalogue                                                         */
/* -------------------------------------------------------------------------- */

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`pointer-events-none absolute right-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6l5 5 5-5" />
    </svg>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex flex-col rounded-[28px] border border-neutral-200 bg-white p-3 pb-5">
      <div
        className="grid aspect-[4/3] place-items-center overflow-hidden rounded-[18px]"
        style={{ backgroundColor: product.tint }}
      >
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
        ) : (
          <GiftIcon name={product.icon} className="h-1/2 w-1/2 text-neutral-900" />
        )}
      </div>
      <div className="flex flex-1 flex-col px-3 pt-4">
        <span className="text-[11px] uppercase tracking-wide text-neutral-500">{product.label}</span>
        <h3 className="mt-1 text-[1.3rem] font-semibold tracking-[-0.035em] text-neutral-950">{product.name}</h3>
        <p className="mt-1.5 flex-1 text-[15px] text-neutral-500">{product.description}</p>
        <div className="mt-[18px] flex flex-col">
          <span className="text-[11px] uppercase tracking-wide text-neutral-500">Starting from</span>
          <b className="text-[1.6rem] font-semibold leading-tight tracking-[-0.04em] text-neutral-950">
            {formatINR(product.price)}
          </b>
        </div>
      </div>
    </article>
  );
}

const selectBase =
  "h-10 appearance-none rounded-full pl-5 pr-10 text-[15px] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ee2a2a]";

function ProductCatalogue({
  category,
  onCategoryChange,
}: {
  category: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
}) {
  const [budget, setBudget] = useState<string>("any");
  const [sort, setSort] = useState<SortKey>("catalogue");

  const products = useMemo(() => {
    let list = PRODUCTS.filter((p) => category === "all" || p.category === category);
    const band = BUDGETS.find((b) => b.value === budget);
    if (band) list = list.filter((p) => p.price >= band.min && p.price < band.max);
    if (sort === "asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [category, budget, sort]);

  const isFiltered = category !== "all" || budget !== "any" || sort !== "catalogue";

  const clear = () => {
    onCategoryChange("all");
    setBudget("any");
    setSort("catalogue");
  };

  return (
    <section id="catalogue" className="scroll-mt-24 pt-24">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[clamp(2rem,4.2vw,3.2rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-neutral-950">
            Browse every gift we can supply
          </h2>
          <p className="mt-3 text-base tracking-[-0.01em] text-neutral-500 sm:text-lg">
            Filter by category or budget. Every price is the starting price for that range.
          </p>
        </div>

        {/* Filters */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <div
            role="tablist"
            aria-label="Gift category"
            className="flex max-w-full gap-1 overflow-x-auto rounded-full bg-white p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={category === c.id}
                onClick={() => onCategoryChange(c.id)}
                className={`h-10 shrink-0 whitespace-nowrap rounded-full px-5 text-[15px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ee2a2a] ${
                  category === c.id ? "bg-[#ee2a2a] text-white" : "text-neutral-500 hover:text-neutral-950"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <label className="relative">
            <span className="sr-only">Budget</span>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={`${selectBase} border border-neutral-300 bg-white text-neutral-950 hover:border-neutral-950`}
            >
              <option value="any">Any budget</option>
              {BUDGETS.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
            <Chevron className="text-neutral-950" />
          </label>

          <label className="relative">
            <span className="sr-only">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className={`${selectBase} bg-[#ee2a2a] text-white`}
            >
              <option value="catalogue">Catalogue order</option>
              <option value="asc">Price: low to high</option>
              <option value="desc">Price: high to low</option>
            </select>
            <Chevron className="text-white" />
          </label>

          {isFiltered && (
            <button
              type="button"
              onClick={clear}
              className="h-10 rounded-full border border-neutral-300 px-5 text-[15px] text-neutral-950 transition-colors hover:border-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ee2a2a]"
            >
              Clear filters
            </button>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-neutral-500" aria-live="polite">
          {products.length > 0 ? `Showing ${products.length} gift range${products.length > 1 ? "s" : ""}` : ""}
        </p>

        {/* Grid */}
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.length > 0 ? (
            products.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <div className="col-span-full rounded-[28px] border border-neutral-200 px-5 py-14 text-center text-neutral-500">
              <b className="mb-1 block text-xl text-neutral-950">No gifts match this budget</b>
              Try a different category or clear the filters.
            </div>
          )}
        </div>

        <p className="mx-auto mt-7 max-w-[70ch] text-center text-[13px] text-neutral-500">
          Prices are the starting prices listed in the Sniper gifting catalogue. Exact pricing is confirmed on
          quote for the models and quantities you choose.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function GiftingSolution() {
  const [category, setCategory] = useState<CategoryFilter>("all");

  // Used by the festive cards and offer cards: filter, then jump to the catalogue
  const openCategory = (id: CategoryId) => {
    setCategory(id);
    document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Layout>
      <div className="bg-[#f5f5f7] pb-24">
        <HeroIntro />
        <HeroSlider />
        <FestiveCards onSelectCategory={openCategory} />
        <OfferGrid onSelect={openCategory} />
        <ProductCatalogue category={category} onCategoryChange={setCategory} />
      </div>
    </Layout>
  );
}