import { ArrowRight, ArrowUpRight, ChevronDown, ChevronRight, Mail, Menu, Phone, Users, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";

/* ────────────────────────────────────────────────────────────────────────────
   Sniper India – Navbar v7 ("rail + services")

   Desktop panel = RAIL (groups) + SERVICES (active group) + ONE promo card. No brand logos or
   chips here: visitors choosing a service shouldn't also be choosing a brand.
   Brands live in the Partners menu, grouped by Hardware / Software / Networking,
   each with "Used for …" derived from ITEM_BRANDS below.

   Optional brand logos (Partners menu only): set PARTNER_LOGO_DIR = "/nav/partners"
   and add square mono SVGs named apple.svg, dell.svg, unreal-engine.svg …
   Mobile: native <dialog> (top layer). Font: Plus Jakarta Sans.
   ──────────────────────────────────────────────────────────────────────────── */

const ACCENT = "#E5262B";
const PARTNER_LOGO_DIR = null as string | null;

// ─── Data ──────────────────────────────────────────────────────────────────────
type Item = { name: string; href: string; desc: string };
type Cat = { label: string; blurb: string; items: Item[] };
type MenuKey = "solutions" | "industries" | "partners";

const PARTNERS: Record<string, string> = {
  Apple: "Mac, iPad and iPhone for teams",
  Dell: "Laptops, workstations and servers",
  HP: "PCs, workstations and print",
  Lenovo: "ThinkPad and ThinkStation",
  Asus: "Laptops and creator PCs",
  Acer: "Laptops and displays",
  Samsung: "Displays, mobiles and storage",
  Microsoft: "Windows, 365 and Azure",
  Adobe: "Creative Cloud and Acrobat",
  Autodesk: "AutoCAD, Revit and Maya",
  AWS: "Cloud infrastructure",
  Azure: "Cloud and AI services",
  Unity: "Real-time 3D engine",
  "Unreal Engine": "Real-time 3D for studios",
  Cisco: "Networking and security",
  Yubico: "Hardware security keys",
  JAMF: "Apple device management",
  Logitech: "Webcams, peripherals and AV",
  Nvidia: "GPUs and AI computing",
};

const partnerHref = (n: string) => `/partners/${n.toLowerCase().replace(/\s+/g, "-")}`;
const partnerItems = (names: string[]): Item[] => names.map((n) => ({ name: n, href: partnerHref(n), desc: PARTNERS[n] }));

// Brands per service (edit freely). Only the Partners menu reads this, to show
// "Used for …" under each brand.
const ITEM_BRANDS: Record<string, string[]> = {
  "/solutions/it-infrastructure": ["Dell", "HP", "Lenovo", "Cisco", "Nvidia"],
  "/solutions/networking-solutions": ["Cisco"],
  "/solutions/clould-solutions": ["AWS", "Azure", "Microsoft"],
  "/solutions/managed-it-services": ["Microsoft", "Dell", "Lenovo"],
  "/solutions/it-consulting": ["Microsoft", "AWS", "Cisco"],
  "/solutions/device-deployment-mdm": ["Apple", "JAMF", "Microsoft", "Samsung"],
  "/solutions/hr-solutions": ["Microsoft"],
  "/solutions/payment-services": ["Yubico", "Samsung"],
  "/solutions/av-solutions": ["Logitech", "Samsung"],
  "/solutions/it-asset-disposal": ["Dell", "HP", "Lenovo", "Apple"],
  "/industries/it-ites-infra": ["Dell", "Lenovo", "Cisco", "Microsoft"],
  "/industries/ar-vr-mr-xr": ["Nvidia", "Unity", "Unreal Engine"],
  "/industries/media-and-entertainment": ["Apple", "Adobe", "Nvidia", "HP"],
  "/industries/government": ["Microsoft", "Cisco", "Yubico", "HP"],
  "/industries/aec": ["Autodesk", "Dell", "Nvidia", "HP"],
  "/industries/manufacturing-automotive": ["Autodesk", "Lenovo", "Dell"],
  "/industries/healthcare-pharma": ["Apple", "Samsung", "Microsoft", "Yubico"],
  "/industries/education": ["Apple", "Acer", "Asus", "Lenovo", "Microsoft"],
};

const MENUS: Record<MenuKey, { label: string; href: string; cta: string; cats: Cat[] }> = {
  solutions: {
    label: "Solutions",
    href: "/solutions",
    cta: "Solutions overview",
    cats: [
      {
        label: "Infrastructure",
        blurb: "Build the foundation: compute, network and cloud.",
        items: [
          { name: "IT Infrastructure", href: "/solutions/it-infrastructure", desc: "Build robust enterprise infrastructure" },
          { name: "Networking Solutions", href: "/solutions/networking-solutions", desc: "Enterprise-grade network architecture" },
          { name: "Cloud Solutions", href: "/solutions/clould-solutions", desc: "Scalable cloud infrastructure & services" },
        ],
      },
      {
        label: "Managed services",
        blurb: "Hand day-to-day IT to one accountable team.",
        items: [
          { name: "Managed IT Services", href: "/solutions/managed-it-services", desc: "Complete end-to-end IT support" },
          { name: "IT Consulting", href: "/solutions/it-consulting", desc: "Expert technology guidance & strategy" },
          { name: "Device Deployment & MDM", href: "/solutions/device-deployment-mdm", desc: "Seamless device lifecycle management" },
        ],
      },
      {
        label: "Business solutions",
        blurb: "Run people and payments without the friction.",
        items: [
          { name: "HR Solutions", href: "/solutions/hr-solutions", desc: "Streamline your HR operations" },
          { name: "Payment Services", href: "/solutions/payment-services", desc: "Secure and reliable payment processing" },
        ],
      },
      {
        label: "Specialty",
        blurb: "Audio-visual systems and secure asset retirement.",
        items: [
          { name: "AV Solutions", href: "/solutions/av-solutions", desc: "Professional audio-visual systems" },
          { name: "IT Asset Disposal", href: "/solutions/it-asset-disposal", desc: "Secure disposal & lifecycle management" },
        ],
      },
    ],
  },
  industries: {
    label: "Industries",
    href: "/industries",
    cta: "Industries overview",
    cats: [
      {
        label: "Technology",
        blurb: "Infrastructure and immersive tech for builders.",
        items: [
          { name: "IT / ITES / Infrastructure", href: "/industries/it-ites-infra", desc: "Technology infrastructure management" },
          { name: "AR / VR / MR / XR", href: "/industries/ar-vr-mr-xr", desc: "Immersive extended reality technology" },
        ],
      },
      {
        label: "Creative & public",
        blurb: "Studios, broadcasters and government desks.",
        items: [
          { name: "Media & Entertainment", href: "/industries/media-and-entertainment", desc: "Creative production & broadcast solutions" },
          { name: "Government Sector", href: "/industries/government", desc: "Secure public sector IT solutions" },
        ],
      },
      {
        label: "Industrial",
        blurb: "Design and engineering workstations at scale.",
        items: [
          { name: "AEC", href: "/industries/aec", desc: "Architecture, Engineering & Construction" },
          { name: "Manufacturing & Automotive", href: "/industries/manufacturing-automotive", desc: "Industrial automation & IT solutions" },
        ],
      },
      {
        label: "Health & education",
        blurb: "Compliant, easy-to-manage devices for care and learning.",
        items: [
          { name: "Healthcare & Pharma", href: "/industries/healthcare-pharma", desc: "Medical technology & compliance solutions" },
          { name: "Education", href: "/industries/education", desc: "EdTech and digital learning solutions" },
        ],
      },
    ],
  },
  partners: {
    label: "Partners",
    href: "/partners",
    cta: "All partners",
    cats: [
      {
        label: "Hardware",
        blurb: "Devices we source, deploy and support.",
        items: partnerItems(["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "Samsung"]),
      },
      {
        label: "Software & cloud",
        blurb: "Platforms and creative tools we license and manage.",
        items: partnerItems(["Microsoft", "Adobe", "Autodesk", "AWS", "Azure", "Unity", "Unreal Engine"]),
      },
      {
        label: "Networking & security",
        blurb: "Connectivity, identity and peripherals.",
        items: partnerItems(["Cisco", "Yubico", "JAMF", "Logitech", "Nvidia"]),
      },
    ],
  },
};

// Reverse index: brand -> services it supports (powers the Partners menu)
const USED_IN: Record<string, string[]> = {};
MENUS.solutions.cats.forEach((c) =>
  c.items.forEach((i) => (ITEM_BRANDS[i.href] ?? []).forEach((b) => (USED_IN[b] = [...(USED_IN[b] ?? []), i.name])))
);

const MENU_KEYS: MenuKey[] = ["solutions", "industries", "partners"];
const countOf = (k: MenuKey) => MENUS[k].cats.reduce((n, c) => n + c.items.length, 0);
const META: Record<MenuKey, string> = {
  solutions: `${countOf("solutions")} services`,
  industries: `${countOf("industries")} sectors`,
  partners: `${countOf("partners")} brands`,
};

// ─── Small pieces ──────────────────────────────────────────────────────────────
const PartnerMark = ({ name, size = "h-6 w-6" }: { name: string; size?: string }) => {
  const [failed, setFailed] = useState(false);
  if (PARTNER_LOGO_DIR && !failed) {
    return (
      <img
        src={`${PARTNER_LOGO_DIR}/${name.toLowerCase().replace(/\s+/g, "-")}.svg`}
        alt=""
        onError={() => setFailed(true)}
        className={`${size} flex-shrink-0 object-contain`}
      />
    );
  }
  return (
    <span className={`${size} flex flex-shrink-0 items-center justify-center rounded bg-zinc-900 text-[11px] font-bold text-white transition-colors group-hover:bg-[var(--accent)]`}>
      {name[0]}
    </span>
  );
};

const navItem = (active: boolean) =>
  `group relative flex h-10 items-center gap-1.5 rounded-md px-3.5 text-[14.5px] font-medium tracking-tight outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
    active ? "text-white" : "text-zinc-300 hover:text-white"
  }`;

const Underline = ({ active }: { active: boolean }) => (
  <span
    aria-hidden
    className={`pointer-events-none absolute inset-x-3.5 -bottom-[19px] h-[2px] origin-left rounded-full bg-[var(--accent)] transition-transform duration-200 ${
      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
    }`}
  />
);

// ─── Desktop panel ─────────────────────────────────────────────────────────────
// Three zones: RAIL (groups) | SERVICES for the active group | ONE promo card.
// Height follows the rail, so there is no dead space under short groups.
// Edit promo copy here. Drop an image at /public/nav/promo.jpg (optional; a dark
// red gradient shows until it exists).
const PROMO: Record<MenuKey, { title: string; body: string; cta: string; href: string; image?: string }> = {
  solutions: { title: "Plan your IT in one conversation", body: "Tell us what you run today. We'll map it to the right services.", cta: "Book a consultation", href: "/contact", image: "/nav/promo.jpg" },
  industries: { title: "Built around your sector", body: "Tell us how your team works and we'll shape the setup around it.", cta: "Talk to us", href: "/contact", image: "/nav/promo.jpg" },
  partners: { title: "Don't see your brand?", body: "Ask us. We'll tell you what we can source and support.", cta: "Ask about a brand", href: "/contact", image: "/nav/promo.jpg" },
};
const CROSS: Partial<Record<MenuKey, { label: string; href: string }>> = {
  solutions: { label: "Browse by industry", href: "/industries" },
  industries: { label: "Browse by solution", href: "/solutions" },
};

const ArrowDot = () => (
  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 transition-colors group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white">
    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
  </span>
);

const footLink =
  "group inline-flex items-center gap-2.5 rounded-md text-[14.5px] font-semibold text-zinc-900 outline-none transition-colors hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]";

const Promo = ({ k, onNavigate }: { k: MenuKey; onNavigate: () => void }) => {
  const p = PROMO[k];
  const [failed, setFailed] = useState(false);
  return (
    <Link
      to={p.href}
      onClick={onNavigate}
      className="group relative flex h-full min-h-[280px] flex-col justify-between overflow-hidden rounded-2xl bg-zinc-950 p-6 text-white outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
    >
      {p.image && !failed && (
        <img src={p.image} alt="" onError={() => setFailed(true)} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      )}
      <span
        aria-hidden
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 90% at 100% 100%, rgba(229,38,43,.5), transparent 60%), linear-gradient(to top, rgba(0,0,0,.8), rgba(0,0,0,.15) 65%)" }}
      />
      <span className="relative text-[21px] font-semibold leading-tight tracking-tight">{p.title}</span>
      <span className="relative">
        <span className="block text-[13.5px] leading-snug text-zinc-200">{p.body}</span>
        <span className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[13.5px] font-semibold text-zinc-900 transition-colors group-hover:bg-[var(--accent)] group-hover:text-white">
          {p.cta}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </span>
      </span>
    </Link>
  );
};

const Panel = ({ k, pathname, onNavigate }: { k: MenuKey; pathname: string; onNavigate: () => void }) => {
  const menu = MENUS[k];
  const cross = CROSS[k];
  const [idx, setIdx] = useState(0);
  const railTimer = useRef<number | null>(null);
  const railRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const cat = menu.cats[idx];
  const unit = k === "partners" ? "brands" : k === "industries" ? "sectors" : "services";
  const extra = (list: string[], n: number) => list.slice(0, n).join(", ") + (list.length > n ? ` +${list.length - n}` : "");

  const stop = () => {
    if (railTimer.current) window.clearTimeout(railTimer.current);
    railTimer.current = null;
  };
  const pick = (i: number) => {
    stop();
    setIdx(i);
  };
  // short delay so a diagonal mouse path toward the content doesn't flip the group
  const hoverPick = (i: number) => {
    stop();
    railTimer.current = window.setTimeout(() => pick(i), 70);
  };
  useEffect(() => stop, []);

  return (
    <div className="container mx-auto grid grid-cols-[250px_1fr] gap-x-8 px-4 py-8 xl:grid-cols-[250px_1fr_320px]">
      {/* Rail */}
      <div role="tablist" aria-orientation="vertical" aria-label={menu.label} className="flex flex-col gap-1" onMouseLeave={stop}>
        {menu.cats.map((c, i) => {
          const on = i === idx;
          return (
            <button
              key={c.label}
              ref={(el) => {
                railRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              aria-selected={on}
              tabIndex={on ? 0 : -1}
              onMouseEnter={() => hoverPick(i)}
              onFocus={() => pick(i)}
              onClick={() => pick(i)}
              onKeyDown={(e) => {
                if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
                e.preventDefault();
                e.stopPropagation();
                const n = menu.cats.length;
                const next = (i + (e.key === "ArrowDown" ? 1 : n - 1)) % n;
                pick(next);
                railRefs.current[next]?.focus();
              }}
              className={`relative flex items-center justify-between rounded-lg px-4 py-3.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                on ? "bg-zinc-100" : "hover:bg-zinc-50"
              }`}
            >
              <span aria-hidden className={`absolute inset-y-2.5 left-0 w-[3px] rounded-full bg-[var(--accent)] transition-opacity ${on ? "opacity-100" : "opacity-0"}`} />
              <span>
                <span className={`block text-[15px] font-semibold tracking-tight ${on ? "text-[var(--accent)]" : "text-zinc-900"}`}>{c.label}</span>
                <span className="mt-0.5 block text-[12.5px] leading-snug text-zinc-500">
                  {c.items.length} {unit}
                </span>
              </span>
              <ChevronRight className={`h-4 w-4 transition-all ${on ? "translate-x-0.5 text-[var(--accent)]" : "text-zinc-400"}`} aria-hidden />
            </button>
          );
        })}
      </div>

      {/* Services */}
      <div role="tabpanel" className="flex min-w-0 flex-col border-l border-zinc-200 pl-8">
        <div key={`${k}-${idx}`} className="sn-fade flex h-full flex-col">
          <p className="text-[22px] font-semibold tracking-tight text-zinc-900">{cat.label}</p>
          <p className="mt-1 text-[14px] text-zinc-600">{cat.blurb}</p>

          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1">
            {cat.items.map((it) => {
              const current = pathname === it.href || pathname.startsWith(`${it.href}/`);
              const used = USED_IN[it.name] ?? [];
              return (
                <Link
                  key={it.href}
                  to={it.href}
                  onClick={onNavigate}
                  aria-current={current ? "page" : undefined}
                  className="group -mx-3 flex gap-3 rounded-lg px-3 py-3 outline-none transition-colors hover:bg-zinc-100 focus-visible:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  {k === "partners" ? (
                    <PartnerMark name={it.name} size="h-9 w-9" />
                  ) : (
                    <span aria-hidden className="mt-0.5 h-5 w-[3px] flex-shrink-0 rounded-full bg-[var(--accent)]" />
                  )}
                  <span className="min-w-0">
                    <span className="block text-[15px] font-semibold leading-snug tracking-tight text-zinc-900 group-hover:text-[var(--accent)]">{it.name}</span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-zinc-600">{it.desc}</span>
                    {k === "partners" && used.length > 0 && (
                      <span className="mt-1.5 block text-[12.5px] leading-snug text-zinc-500">Used for {extra(used, 2)}</span>
                    )}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Footer: one rule, two quiet links */}
          <div className="mt-auto flex items-center justify-between gap-6 border-t border-zinc-200 pt-4">
            <Link to={menu.href} onClick={onNavigate} className={footLink}>
              {menu.cta}
              <ArrowDot />
            </Link>
            {cross && (
              <Link to={cross.href} onClick={onNavigate} className={footLink}>
                {cross.label}
                <ArrowDot />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* The only promo / call to action in the panel (xl and up) */}
      <div className="hidden xl:block">
        <Promo key={k} k={k} onNavigate={onNavigate} />
      </div>
    </div>
  );
};

// ─── Mobile ────────────────────────────────────────────────────────────────────
const mobileRow = "flex min-h-[64px] items-center justify-between border-b border-white/15 py-4 text-[26px] font-semibold tracking-tight text-white";

const MobileMenu = ({ k, open, onToggle, onNavigate }: { k: MenuKey; open: boolean; onToggle: () => void; onNavigate: () => void }) => {
  const menu = MENUS[k];
  return (
    <div className="border-b border-white/15">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`m-${k}`}
        className="flex min-h-[64px] w-full items-center justify-between gap-4 py-4 text-left text-[26px] font-semibold tracking-tight text-white"
      >
        <span>{menu.label}</span>
        <span className="flex items-center gap-3">
          <span className="text-[14px] font-medium text-zinc-400">{META[k]}</span>
          <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${open ? "rotate-180 text-[var(--accent)]" : "text-zinc-300"}`} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`m-${k}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="space-y-7 pb-6">
              {menu.cats.map((c) => (
                <div key={c.label}>
                  <p className="mb-1 text-[14px] font-semibold text-zinc-300">{c.label}</p>
                  {c.items.map((it) => (
                    <Link
                      key={it.href}
                      to={it.href}
                      onClick={onNavigate}
                      className="flex min-h-[56px] items-stretch gap-3 rounded-xl py-2 text-white active:bg-white/10"
                    >
                      <span aria-hidden className="w-[3px] flex-shrink-0 rounded-full bg-[var(--accent)]" />
                      <span className="min-w-0">
                        <span className="block text-[16px] font-semibold leading-tight tracking-tight">{it.name}</span>
                        <span className="mt-0.5 block text-[13px] leading-snug text-zinc-400">{it.desc}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              ))}
              <Link
                to={menu.href}
                onClick={onNavigate}
                className="flex min-h-[48px] items-center justify-between rounded-full border border-white/30 px-5 text-[15px] font-semibold text-white active:bg-white/10"
              >
                {menu.cta}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Navbar ───────────────────────────────────────────────────────────────
export const Navbar = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<MenuKey | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRefs = useRef<Partial<Record<MenuKey, HTMLButtonElement | null>>>({});
  const timer = useRef<number | null>(null);
  const pointerType = useRef<string>("mouse");

  const clearTimer = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  };
  const hoverOpen = (k: MenuKey) => {
    clearTimer();
    timer.current = window.setTimeout(() => setOpen(k), open ? 120 : 90);
  };
  const scheduleClose = () => {
    clearTimer();
    timer.current = window.setTimeout(() => setOpen(null), 180);
  };
  const closeAll = () => {
    clearTimer();
    setOpen(null);
  };
  const closeMobile = () => {
    setMobileOpen(false);
    setMobileSection(null);
  };

  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
    setMobileSection(null);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !open) return;
      triggerRefs.current[open]?.focus();
      setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (mobileOpen && !d.open) d.showModal();
    if (!mobileOpen && d.open) d.close();
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && closeMobile();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => () => clearTimer(), []);

  const renderTrigger = (k: MenuKey) => {
    const isOpen = open === k;
    const active = isOpen || pathname.startsWith(`/${k}`);
    return (
      <button
        type="button"
        ref={(el) => {
          triggerRefs.current[k] = el;
        }}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={`mega-${k}`}
        onMouseEnter={() => hoverOpen(k)}
        onMouseLeave={clearTimer}
        onPointerDown={(e) => {
          pointerType.current = e.pointerType;
        }}
        onClick={(e) => {
          clearTimer();
          setOpen(isOpen && (e.detail === 0 || pointerType.current !== "mouse") ? null : k);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(k);
            requestAnimationFrame(() =>
              requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>("button, a")?.focus())
            );
          }
        }}
        className={navItem(active)}
      >
        {MENUS[k].label}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-[var(--accent)]" : ""}`} />
        <Underline active={active} />
      </button>
    );
  };

  const renderPlainLink = (to: string, label: string, external = false) => {
    const active = !external && pathname.startsWith(to);
    return external ? (
      <a href={to} target="_blank" rel="noopener noreferrer" onMouseEnter={scheduleClose} className={navItem(false)}>
        {label}
        <ArrowUpRight className="h-3.5 w-3.5 opacity-70" aria-hidden />
        <span className="sr-only"> (opens in a new tab)</span>
        <Underline active={false} />
      </a>
    ) : (
      <Link to={to} onMouseEnter={scheduleClose} className={navItem(active)}>
        {label}
        <Underline active={active} />
      </Link>
    );
  };

  return (
    <MotionConfig reducedMotion="user">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .sn-nav { --accent: ${ACCENT}; font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
        @keyframes sn-sheet-in { from { opacity: 0; transform: translateY(10px); } }
        .sn-sheet[open] { animation: sn-sheet-in .22s cubic-bezier(.22,1,.36,1); }
        @keyframes sn-fade { from { opacity: 0; transform: translateY(4px); } }
        .sn-fade { animation: sn-fade .18s ease-out; }
        @media (prefers-reduced-motion: reduce) { .sn-sheet[open], .sn-fade { animation: none; } }
      `}</style>

      {/* Utility bar */}
      <div className="sn-nav relative z-[45] hidden border-b border-stone-200 bg-white py-2.5 text-[13.5px] text-stone-800 md:block">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <a href="tel:+918939301100" className="group flex items-center gap-2 transition-colors hover:text-[var(--accent)]">
              <Phone className="h-4 w-4 text-stone-500 transition-colors group-hover:text-[var(--accent)]" />
              <span className="font-semibold">+91 8939301100</span>
            </a>
            <a href="mailto:enquiry@sniperindia.com" className="group flex items-center gap-2 transition-colors hover:text-[var(--accent)]">
              <Mail className="h-4 w-4 text-stone-500 transition-colors group-hover:text-[var(--accent)]" />
              <span className="font-semibold">enquiry@sniperindia.com</span>
            </a>
          </div>
          <div className="flex items-center gap-2 text-stone-800">
            <Users className="h-4 w-4 text-stone-600" />
            <span className="font-semibold">Trusted IT Partner</span>
          </div>
        </div>
      </div>

      {/* Sticky header */}
      <header ref={headerRef} className="sn-nav sticky top-0 z-50" onMouseEnter={clearTimer} onMouseLeave={scheduleClose}>
        <div
          className={`border-b transition-colors duration-300 ${
            scrolled || open ? "border-white/15 bg-black/95 backdrop-blur-xl" : "border-white/10 bg-black"
          }`}
        >
          <div className="container mx-auto flex h-16 items-center px-4 lg:h-[76px]">
            <Link to="/" className="flex flex-shrink-0 items-center" onClick={closeAll} aria-label="Sniper India – home">
              <img
                src="https://i.ibb.co/9BNf5rZ/sniper-logo-neww.png"
                alt="Sniper India"
                className="h-8 object-contain transition-transform duration-300 hover:scale-105 md:h-11"
              />
            </Link>

            <nav aria-label="Primary" className="ml-8 hidden items-center gap-0.5 lg:flex">
              {renderPlainLink("/about", "About Us")}
              {MENU_KEYS.map(renderTrigger)}
              {renderPlainLink("/gcc", "GCC")}
              {renderPlainLink("https://blog.sniperindia.com/", "Blog", true)}
            </nav>

            <div className="flex-1" />

            <div className="hidden items-center lg:flex" onMouseEnter={scheduleClose}>
              <Link
                to="/contact"
                className="inline-flex h-11 items-center rounded-full bg-[var(--accent)] px-6 text-[14px] font-semibold text-white outline-none transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white active:scale-[0.98]"
              >
                Contact Us
              </Link>
            </div>

            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Desktop mega panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              ref={panelRef}
              id={`mega-${open}`}
              className="absolute inset-x-0 top-full hidden max-h-[calc(100dvh-8rem)] overflow-y-auto border-b border-zinc-200 bg-white shadow-[0_36px_48px_-20px_rgba(0,0,0,0.5)] lg:block"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* key resets the active rail item each time a different menu opens */}
              <Panel key={open} k={open} pathname={pathname} onNavigate={closeAll} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu – native modal <dialog> */}
        <dialog
          ref={dialogRef}
          id="mobile-menu"
          aria-label="Site menu"
          onClose={closeMobile}
          className="sn-sheet m-0 h-[100dvh] max-h-none w-full max-w-none overflow-hidden border-0 bg-black p-0 text-white lg:hidden"
        >
          <div className="flex h-full flex-col">
            <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-white/15 px-5">
              <Link to="/" onClick={closeMobile} aria-label="Sniper India – home">
                <img src="https://i.ibb.co/9BNf5rZ/sniper-logo-neww.png" alt="Sniper India" className="h-8 object-contain" />
              </Link>
              <button
                type="button"
                onClick={closeMobile}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white active:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5">
              <Link to="/about" onClick={closeMobile} className={mobileRow}>About Us</Link>
              {MENU_KEYS.map((k) => (
                <MobileMenu
                  key={k}
                  k={k}
                  open={mobileSection === k}
                  onToggle={() => setMobileSection(mobileSection === k ? null : k)}
                  onNavigate={closeMobile}
                />
              ))}
              <Link to="/gcc" onClick={closeMobile} className={mobileRow}>GCC</Link>
              <a href="https://blog.sniperindia.com/" target="_blank" rel="noopener noreferrer" className={mobileRow}>
                <span>
                  Blog<span className="sr-only"> (opens in a new tab)</span>
                </span>
                <ArrowUpRight className="h-5 w-5 text-zinc-300" aria-hidden />
              </a>
            </div>

            <div className="flex-shrink-0 border-t border-white/15 bg-zinc-950 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Link
                to="/contact"
                onClick={closeMobile}
                className="flex h-12 items-center justify-center rounded-full bg-[var(--accent)] text-[16px] font-semibold text-white active:scale-[0.98]"
              >
                Contact Us
              </Link>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <a
                  href="tel:+918939301100"
                  className="flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 text-[15px] font-semibold text-white active:bg-white/10"
                >
                  <Phone className="h-4 w-4" aria-hidden /> Call
                </a>
                <a
                  href="mailto:enquiry@sniperindia.com"
                  className="flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 text-[15px] font-semibold text-white active:bg-white/10"
                >
                  <Mail className="h-4 w-4" aria-hidden /> Email
                </a>
              </div>
            </div>
          </div>
        </dialog>
      </header>

      {/* Dim backdrop behind desktop panels */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 hidden bg-black/60 backdrop-blur-[3px] lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeAll}
            aria-hidden
          />
        )}
      </AnimatePresence>
    </MotionConfig>
  );
};

export default Navbar;