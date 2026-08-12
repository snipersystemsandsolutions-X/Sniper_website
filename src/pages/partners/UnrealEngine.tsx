import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
   ArrowRight, Play, ChevronDown, Zap, PiggyBank, Users,
} from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { bentoItems, solutions, faqs, partnerItems } from "@/constant";
import ImpactSection from "@/components/ui/ImpactSection";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import ShinyText from "@/components/ui/ShinyText";
import UseCasesSection from "@/components/ui/UseCasesSection";
import AnimatedGradientBackground from "@/components/ui/backgrounds/AnimatedGradientBackground";
// spiralanim.mov — asset removed; add the file to src/assets/ to re-enable the hero video card


gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

const ease = [0.16, 1, 0.3, 1] as const;

// ========================================================
// ✦ SHARED VISIBILITY HOOK
// ========================================================
function useIsVisible<T extends HTMLElement>(rootMargin = "200px") {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin, threshold: 0.01 }
    );
    io.observe(el);

    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        setVisible(false);
      } else {
        const rect = el.getBoundingClientRect();
        setVisible(rect.top < window.innerHeight && rect.bottom > 0);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [rootMargin]);

  return { ref, visible };
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

// ========================================================
// ✦ ONE BUTTON SYSTEM — replaces 3 ad-hoc CTA treatments
// ========================================================
const PrimaryCTA = ({ href, children, onClick }: { href?: string; children: React.ReactNode; onClick?: () => void }) => {
  const cls = "group relative inline-flex items-center gap-3 rounded-full bg-white text-black text-sm font-medium tracking-tight pl-2 pr-5 py-2 overflow-hidden hover:bg-white/90 transition-colors duration-300";
  const inner = (
    <>
      {/* Arrow circle — horizontal slide, left to right */}
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white overflow-hidden">
        <ArrowRight className="absolute h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-6" />
        <ArrowRight className="absolute h-4 w-4 -translate-x-6 transition-transform duration-300 ease-out group-hover:translate-x-0" />
      </span>

      {/* Text swap — slides the label up and a duplicate in from below */}
      <span className="relative h-5 overflow-hidden">
        <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
          {children}
        </span>
        <span className="absolute left-0 top-0 block translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
          {children}
        </span>
      </span>
    </>
  );
  return href
    ? <a href={href} className={cls}>{inner}</a>
    : <button onClick={onClick} className={cls}>{inner}</button>;
};

const SecondaryCTA = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="group relative isolate inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_32px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all duration-500 hover:border-white/40 hover:bg-white/[0.16] hover:shadow-[0_12px_40px_rgba(110,50,207,0.35),inset_0_1px_0_rgba(255,255,255,0.35)]"
  >
    <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/25 via-white/5 to-transparent opacity-70" />
    <span className="pointer-events-none absolute -inset-y-full -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[120%] group-hover:opacity-100" />
    <span className="relative flex items-center gap-2">{children}</span>
  </a>
);

// ========================================================
// ✦ WHITE SCREEN TRANSITION
// ========================================================
const WhiteScreenTransition = ({ onComplete }: { onComplete: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.to(ref.current, {
      yPercent: -105, duration: 0.9,
      ease: "power3.inOut", delay: 0.2, onComplete,
    });
  }, []);
  return <div ref={ref} className="fixed inset-0 bg-[#0a0118] z-[9999] will-change-transform" />;
};

const solutionsStickyContent = solutions.map((solution: any) => ({
  title: solution.title,
  description: solution.descriptionn
    ? `${solution.description} ${solution.descriptionn}`
    : solution.description,
  tags: solution.tags,
  content: (
    <img
      src={solution.image}
      alt={`${solution.title} — Unreal Engine enterprise solution by Sniper Systems`}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover"
    />
  ),
}));

// ========================================================
// ✦ FADE-UP WRAPPER
// ========================================================
const FadeUp = ({
  children, delay = 0, className = "",
}: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref} className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </motion.div>
  );
};

// ========================================================
// ✦ DOT GRID + PARTNER HOVER CARD (unchanged)
// ========================================================
const DotGrid = ({ pattern, active }: { pattern: number[]; active: boolean }) => (
  <div className="grid grid-cols-3 gap-1.5 flex-shrink-0">
    {pattern.map((on, i) => (
      <span
        key={i}
        className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
          on ? (active ? "bg-violet-600" : "bg-violet-300") : "bg-gray-200"
        }`}
      />
    ))}
  </div>
);

const dotPatterns = [
  [1, 1, 0, 0, 0, 0, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 1],
];

const PartnerHoverCard = ({
  item, index, isActive, onHover,
}: { item: any; index: number; isActive: boolean; onHover: (i: number | null) => void }) => (
  <motion.div
    layout
    onMouseEnter={() => onHover(index)}
    onMouseLeave={() => onHover(null)}
    className={`h-full flex flex-col justify-center rounded-2xl bg-white px-6 sm:px-7 py-5 sm:py-6 cursor-default transition-shadow duration-300 ${
      isActive ? "shadow-xl" : "shadow-sm"
    }`}
    transition={{ layout: { duration: 0.4, ease } }}
  >
    <div className="flex items-center justify-between gap-4">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">
        {item.label}
      </h3>
      <DotGrid pattern={dotPatterns[index % dotPatterns.length]} active={isActive} />
    </div>

    <AnimatePresence initial={false}>
      {isActive && (
        <motion.div
          key="body"
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: "auto", marginTop: 12 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          transition={{ duration: 0.3, ease }}
          className="overflow-hidden"
        >
          <p className="text-sm text-gray-500 leading-relaxed max-w-md">
            {item.description}
          </p>
          {item.tag && (
            <span className="mt-4 inline-block text-xs font-medium text-gray-600 bg-gray-100 rounded-full px-3 py-1.5">
              {item.tag}
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const WhyPartnerSniper = ({ items }: { items: any[] }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const activeIndex = hovered ?? items.length - 1;
  const active = items[activeIndex];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
      <div className="lg:col-span-6">
        <div className="relative rounded-3xl overflow-hidden bg-black h-full min-h-[420px] lg:min-h-0">
          <AnimatePresence mode="wait">
            <motion.video
              key={active.video}
              autoPlay muted loop playsInline
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease }}
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={active.video} type="video/mp4" />
            </motion.video>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease }}
              >
                <h4 className="text-lg sm:text-xl font-semibold text-white leading-snug mb-1.5">
                  {active.label}
                </h4>
                <p className="text-sm text-white/75 leading-relaxed max-w-xs">
                  {active.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="lg:col-span-6 flex flex-col gap-4 lg:h-full">
        {items.slice(0, 3).map((item, i) => (
          <div key={i} className="lg:flex-1">
            <PartnerHoverCard item={item} index={i} isActive={activeIndex === i} onHover={setHovered} />
          </div>
        ))}
      </div>
    </div>
  );
};



// ========================================================
// ✦ FAQ ITEM (unchanged)
// ========================================================
const FAQItem = ({
  faq, isOpen, onToggle, index,
}: { faq: { question: string; answer: string }; isOpen: boolean; onToggle: () => void; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5, ease, delay: index * 0.06 }}
    className="rounded-xl sm:rounded-2xl bg-white overflow-hidden"
  >
    <button
      onClick={onToggle}
      aria-expanded={isOpen}
      className="w-full flex items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 text-left"
    >
      <span className="text-sm sm:text-base font-semibold text-gray-900">{faq.question}</span>
      <ChevronDown className={`w-5 h-5 flex-shrink-0 text-violet-600 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
    </button>
    <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
      <div className="overflow-hidden">
        <p className="px-5 sm:px-6 pb-4 sm:pb-5 text-sm text-gray-500 leading-relaxed tracking-tight">{faq.answer}</p>
      </div>
    </div>
  </motion.div>
);

// ========================================================
// ✦ YOUTUBE BACKGROUND (unchanged)
// ========================================================
const YouTubeBackground = ({ videoId, start = 0 }: { videoId: string; start?: number }) => {
  const { ref, visible } = useIsVisible<HTMLDivElement>("300px");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hasLoadedOnce = useRef(false);

  useEffect(() => {
    if (visible) hasLoadedOnce.current = true;
    if (!visible && iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*");
    }
  }, [visible]);

  return (
    <div ref={ref} className="aspect-video">
      {(visible || hasLoadedOnce.current) && (
        <iframe
          ref={iframeRef}
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&start=${start}&enablejsapi=1`}
          title="Unreal Engine"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
};

// ========================================================
// ✦ BUSINESS ADVANTAGES — REDESIGNED as an engine-viewport HUD
// (replaces the old Instagram-story carousel — same autoplay/
// progress timing logic, new visual language tied to the subject:
// grid mesh, corner reticle, "FEED 01/06" readout, optional live
// stat pulled from item.metric if you add that field to bentoItems)
// ========================================================
const STORY_DURATION_MS = 4500;

const ViewportCorners = () => (
  <>
    <span className="pointer-events-none absolute left-4 top-4 z-20 h-4 w-4 border-l border-t border-white/20" />
    <span className="pointer-events-none absolute right-4 top-4 z-20 h-4 w-4 border-r border-t border-white/20" />
    <span className="pointer-events-none absolute left-4 bottom-4 z-20 h-4 w-4 border-l border-b border-white/20" />
    <span className="pointer-events-none absolute right-4 bottom-4 z-20 h-4 w-4 border-r border-b border-white/20" />
  </>
);

const BusinessAdvantagesStory = ({ items }: { items: any[] }) => {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const rafRef = useRef<number>();
  const pausedRef = useRef(paused);
  const reducedMotionRef = useRef(reducedMotion);
  const itemsLengthRef = useRef(items.length);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { reducedMotionRef.current = reducedMotion; }, [reducedMotion]);
  useEffect(() => { itemsLengthRef.current = items.length; }, [items.length]);

  useEffect(() => {
    elapsedRef.current = 0;
    lastTimeRef.current = null;
    setProgress(0);
  }, [active]);

  useEffect(() => {
    const tick = (now: number) => {
      rafRef.current = requestAnimationFrame(tick);

      const shouldRun =
        !pausedRef.current &&
        !reducedMotionRef.current &&
        document.visibilityState === "visible";

      if (!shouldRun) {
        lastTimeRef.current = null;
        return;
      }

      if (lastTimeRef.current == null) {
        lastTimeRef.current = now;
        return;
      }

      elapsedRef.current += now - lastTimeRef.current;
      lastTimeRef.current = now;

      const pct = Math.min(100, (elapsedRef.current / STORY_DURATION_MS) * 100);
      setProgress(pct);

      if (pct >= 100) {
        elapsedRef.current = 0;
        lastTimeRef.current = null;
        setActive((a) => (a + 1) % itemsLengthRef.current);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const goTo = (i: number) => setActive(i);
  const item = items[active];
  const total = items.length;

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Channel rail — every row is 1/N of the rail's full height, ── */}
      {/* so it always matches the viewport height exactly, regardless   */}
      {/* of how long each label runs.                                   */}
      <div className="lg:col-span-4 flex flex-col h-full min-h-[420px] sm:min-h-[480px]">
        {items.map((it, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="group relative flex flex-1 items-center gap-4 px-2 sm:px-3 text-left"
            >
              <span
                className={`text-xs tabular-nums tracking-widest transition-colors duration-300 ${
                  isActive ? "text-violet-300" : "text-white/30 group-hover:text-white/50"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <span
                className={`flex-1 text-sm sm:text-base font-medium leading-snug line-clamp-2 transition-colors duration-300 ${
                  isActive ? "text-white" : "text-white/50 group-hover:text-white/75"
                }`}
              >
                {it.label}
              </span>

              <span
                className={`relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                  isActive ? "bg-white/[0.06] text-violet-300" : "text-white/20 group-hover:text-white/40"
                }`}
              >
                <it.icon className="h-4 w-4" strokeWidth={1.75} />
              </span>

              {/* scrub line — same timing data as before, restyled */}
              <span className="absolute bottom-0 left-2 right-2 sm:left-3 sm:right-3 h-px bg-white/10 overflow-hidden">
                <span
                  className="block h-full bg-gradient-to-r from-violet-400 to-fuchsia-400"
                  style={{
                    width: i < active ? "100%" : i === active ? `${progress}%` : "0%",
                    transition: i === active && progress > 0 ? "none" : "width 0.25s ease",
                  }}
                />
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Viewport ─────────────────────────────────────────── */}
      <div className="lg:col-span-8">
        <div className="relative flex h-full min-h-[420px] sm:min-h-[480px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d0620]">
          {/* engine grid mesh — only shows where no image covers it */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 via-transparent to-fuchsia-500/10" />
          <ViewportCorners />

          {/* HUD top bar — same font-figtree as the rest of the page, */}
          {/* just set in caps/wide tracking to read as a HUD label   */}
          <div className="relative z-20 flex items-center justify-between px-5 pt-5 sm:px-6 sm:pt-6">
            <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-300/80">
              <span
                className={`h-1.5 w-1.5 rounded-full bg-violet-400 ${
                  paused || reducedMotion ? "" : "animate-pulse"
                }`}
              />
              Feed {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            {item?.metric && (
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50 tabular-nums">
                {item.metric}
              </span>
            )}
          </div>

          {/* visual stage — uses item.image if you add one to bentoItems, */}
          {/* falls back to the icon tile so nothing breaks either way    */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`visual-${active}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease }}
              className="relative z-10 flex flex-1 items-center justify-center overflow-hidden"
            >
              {item.image ? (
                <>
                  <img
                    src={item.image}
                    alt={item.label}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0620] via-[#0d0620]/25 to-transparent" />
                </>
              ) : (
                <>
                  <div className="absolute h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" />
                  <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-2xl border border-violet-400/20 bg-white/[0.03]">
                    <item.icon className="h-10 w-10 sm:h-12 sm:w-12 text-violet-300" strokeWidth={1.25} />
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* bottom readout */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${active}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease }}
              className="relative z-20 border-t border-white/10 bg-black/30 px-6 py-5 sm:px-8 sm:py-6 backdrop-blur-sm"
            >
              <h4 className="text-lg sm:text-xl font-semibold text-white leading-snug mb-1.5">
                {item.label}
              </h4>
              <p className="text-sm text-white/65 leading-relaxed max-w-md">{item.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// ========================================================
// ✦ AMBIENT BACKGROUND — 11 blobs → 6, blur 150–170px → 90–110px
// ========================================================
type AmbientBlob = {
  id: string; top: string; left: string; width: number; height: number;
  rotate: number; blur: number; opacity: number; radius: string; gradientAngle: number;
};

const AMBIENT_BLOBS: AmbientBlob[] = [
  { id: "partnership-a", top: "8%",  left: "12%", width: 680, height: 640, rotate: -15, blur: 100, opacity: 0.3, radius: "42% 58% 63% 37% / 41% 44% 56% 59%", gradientAngle: 90 },
  { id: "advantages",    top: "26%", left: "92%", width: 560, height: 720, rotate: -22, blur: 100, opacity: 0.6,  radius: "48% 52% 70% 30% / 38% 47% 53% 62%", gradientAngle: 0 },
  { id: "impact",        top: "48%", left: "4%",  width: 820, height: 560, rotate: 10,  blur: 110, opacity: 0.6,  radius: "55% 45% 40% 60% / 48% 38% 62% 52%", gradientAngle: 90 },
  { id: "solutions",     top: "65%", left: "88%", width: 620, height: 780, rotate: 16,  blur: 100, opacity: 0.6,  radius: "44% 56% 50% 50% / 55% 40% 60% 45%", gradientAngle: 45 },
  { id: "partner",       top: "84%", left: "40%", width: 800, height: 560, rotate: -6,  blur: 110, opacity: 0.6,  radius: "50% 50% 42% 58% / 55% 40% 60% 45%", gradientAngle: 15 },
  { id: "faq-cta",       top: "98%", left: "90%", width: 560, height: 640, rotate: 14,  blur: 100, opacity: 0.6,  radius: "45% 55% 60% 40% / 50% 60% 40% 50%", gradientAngle: 60 },
];

const GRAIN_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>" +
  "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/>" +
  "<feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0'/></filter>" +
  "<rect width='100%' height='100%' filter='url(%23n)'/></svg>";

const AmbientBackground = ({ blobs = AMBIENT_BLOBS }: { blobs?: AmbientBlob[] }) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ isolation: "isolate" }} aria-hidden="true">
    <div className="absolute inset-0 bg-[#0a0118]" />
    <div className="absolute inset-0" style={{ mixBlendMode: "screen" }}>
      {blobs.map((blob) => (
        <div
          key={blob.id}
          className="absolute"
          style={{
            top: blob.top, left: blob.left, width: blob.width, height: blob.height,
            borderRadius: blob.radius,
            transform: `translate(-50%, -50%) rotate(${blob.rotate}deg)`,
            filter: `blur(${blob.blur}px)`,
            opacity: blob.opacity,
            background: `linear-gradient(${blob.gradientAngle}deg, #E0CFF7, #6E32CF, #381DB4)`,
          }}
        />
      ))}
    </div>
    <div
      className="absolute inset-0 opacity-[0.05]"
      style={{ mixBlendMode: "overlay", backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}")`, backgroundSize: "160px 160px" }}
    />
  </div>
);

// ========================================================
// MAIN UNREAL ENGINE PAGE
// ========================================================
const UnrealEngine = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { ref: heroWebglRef, visible: heroWebglVisible } = useIsVisible<HTMLDivElement>("0px");

  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = heroHeadingRef.current;
    if (!el) return;
    const words = el.querySelectorAll(".hero-word");
    const tween = gsap.fromTo(words, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.07, delay: 1.2 });
    return () => { tween.kill(); };
  }, []);

  const ctaHeadingRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });
  useEffect(() => {
    if (!ctaInView) return;
    const el = ctaHeadingRef.current;
    if (!el) return;
    const words = el.querySelectorAll(".cta-word");
    gsap.fromTo(words, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.06, delay: 0.2 });
  }, [ctaInView]);

  const solutionsListRef = useRef<HTMLDivElement>(null);
  const solutionsRef = useRef(null);
  const solutionsInView = useInView(solutionsRef, { once: true, margin: "-60px" });
  const solTriggered = useRef(false);
  useEffect(() => {
    if (!solutionsInView || solTriggered.current) return;
    solTriggered.current = true;
    const rows = solutionsListRef.current?.querySelectorAll(".solution-row");
    if (!rows) return;
    gsap.fromTo(rows, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.75, ease: "power2.out", stagger: 0.15 });
  }, [solutionsInView]);

  const heroRef = useRef(null);
  const bentoRef = useRef(null);
  const partnerWhyRef = useRef(null);
  const partnerBentoRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-60px" });

  // ------------------------------------------------------
  // ✦ SEO — merged from the colleague's SEO doc into this page's
  // existing Helmet. See notes below on the two things flagged
  // for follow-up rather than pasted in blind.
  // ------------------------------------------------------

  // FAQ schema is generated FROM the real `faqs` array the page already
  // renders below (StickyScroll/FAQItem section), instead of the
  // hardcoded Q&A in the SEO doc. Hardcoding a second, different set of
  // questions would create a mismatch between what's marked up as
  // structured data and what's actually on the page — Google treats
  // that as a spammy/misleading signal and can ignore or penalize the
  // schema. This keeps the two in sync automatically.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq: { question: string; answer: string }) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <Layout>
      <Helmet>
        {/* ── Basic SEO ─────────────────────────────────────────── */}
        <title>Authorized Unreal Engine Partner in India | Enterprise Real-Time 3D Solutions | Sniper Systems</title>
        <meta
          name="description"
          content="Sniper Systems is an Authorized Unreal Engine Partner in India delivering enterprise real-time 3D visualization, digital twins, virtual production, industrial simulation, immersive XR, and custom Unreal Engine solutions for businesses."
        />
        <meta
          name="keywords"
          content="Authorized Unreal Engine Partner India, Unreal Engine partner India, real-time 3D India, Unreal Engine enterprise solutions, Unreal Engine services India, digital twin solutions India, virtual production India, enterprise XR, Unreal Engine consulting, interactive 3D development, Sniper Systems"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://sniperindia.com/partners/unreal-engine" />

        {/* ── Geo tags ──────────────────────────────────────────── */}
        <meta name="geo.region" content="IN-TN" />
        <meta name="geo.placename" content="Chennai" />
        <meta name="geo.position" content="13.0827;80.2707" />
        <meta name="ICBM" content="13.0827, 80.2707" />

        {/* ── Open Graph ────────────────────────────────────────── */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Authorized Unreal Engine Partner in India | Sniper Systems" />
        <meta
          property="og:description"
          content="Enterprise real-time 3D solutions — digital twins, immersive training, virtual production, and XR — built on Unreal Engine."
        />
        {/* TODO(roobesh): confirm this asset actually exists at this path
            before shipping — an og:image that 404s means link previews on
            LinkedIn/Slack/WhatsApp show no image at all. */}
        <meta property="og:image" content="https://sniperindia.com/images/unreal-engine-banner.jpg" />
        <meta property="og:url" content="https://sniperindia.com/partners/unreal-engine" />

        {/* ── Twitter ───────────────────────────────────────────── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Authorized Unreal Engine Partner in India | Sniper Systems" />
        <meta
          name="twitter:description"
          content="Authorized Unreal Engine Partner delivering enterprise visualization, digital twins, and immersive training in India."
        />
        <meta name="twitter:image" content="https://sniperindia.com/images/unreal-engine-banner.jpg" />

        {/* ── Organization schema ───────────────────────────────── */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Sniper Systems & Solutions Pvt. Ltd.",
            "url": "https://sniperindia.com",
            "logo": "https://sniperindia.com/assets/images/logo.png",
            "description": "Sniper Systems is an IT infrastructure and enterprise technology solutions provider in India delivering cloud, AI, networking, cybersecurity, digital transformation and Unreal Engine enterprise solutions."
          }
        `}</script>

        {/* ── Service schema ────────────────────────────────────── */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Unreal Engine Enterprise Solutions",
            "provider": { "@type": "Organization", "name": "Sniper Systems & Solutions Pvt. Ltd." },
            "areaServed": { "@type": "Country", "name": "India" },
            "description": "Enterprise Unreal Engine services including real-time 3D visualization, virtual production, digital twins, simulation, immersive experiences, XR applications, interactive product visualization, and custom Unreal Engine development."
          }
        `}</script>

        {/* ── Breadcrumb schema ─────────────────────────────────── */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sniperindia.com/" },
              { "@type": "ListItem", "position": 2, "name": "Partners", "item": "https://sniperindia.com/partners/" },
              { "@type": "ListItem", "position": 3, "name": "Unreal Engine", "item": "https://sniperindia.com/partners/unreal-engine" }
            ]
          }
        `}</script>

        {/* ── FAQ schema — generated from the live `faqs` data above ── */}
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <div className="font-figtree">
      {showWhiteScreen && <WhiteScreenTransition onComplete={() => setShowWhiteScreen(false)} />}

      <section>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section ref={heroWebglRef} className="relative bg-[#0a0118] min-h-[640px] sm:min-h-[720px] px-4 sm:px-6 overflow-hidden">

          <div className="absolute inset-0">
            {heroWebglVisible && (
              // <LightPillar quality="medium" noiseIntensity={0.3} rotationSpeed={0.3} />
              <AnimatedGradientBackground />
            )}

          </div>

          <div className="relative z-10 max-w-7xl mx-auto pt-24 sm:pt-20 pb-20 sm:pb-32 lg:pb-36" ref={heroRef}>
            <div className="max-w-3xl">
              <FadeUp>
                <p className="text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-white/75 mb-4 sm:mb-5">
                  <ShinyText text="TRUSTED UNREAL ENGINE PARTNER" speed={2} delay={0} color="#b5b5b5" shineColor="#ffffff" spread={120} direction="left" yoyo={false} pauseOnHover={false} disabled={false} />
                </p>
              </FadeUp>

              <h1 ref={heroHeadingRef} className="text-4xl sm:text-4xl md:text-6xl font-semibold text-white mb-5 sm:mb-6 leading-tight tracking-tighter" aria-label="Enterprise Real-Time 3D Solutions for Digital Transformation">
                {["Enterprise", "Real-Time", "3D", "Solutions", "for", "Digital", "Transformation"].map((word, i) => (
                  <span key={i} className="hero-word inline-block opacity-0 mr-[0.22em] last:mr-0">
                    <span className={word === "for" ? "text-white" : ""}>{word}</span>
                    {word === "Solutions" && <br />}
                  </span>
                ))}
              </h1>

              <motion.p
                className="text-md mt-4 text-white/75 max-w-xl leading-relaxed tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: 1.55 }}
              >
                From Digital Twins and Industrial Simulations to Immersive Training and Virtual Production, we help enterprises accelerate innovation with Unreal Engine.
              </motion.p>

              <motion.div
                className="mt-8 flex flex-wrap items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: 1.75 }}
              >
                <PrimaryCTA href="/contact">Book a free consultation</PrimaryCTA>
                <SecondaryCTA href="#solutions">
                  <Play className="h-4 w-4" />
                  Watch Walkthrough
                </SecondaryCTA>
              </motion.div>
            </div>

            <motion.div
              className="hidden lg:block absolute -right-16  w-[480px]"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 2 }}
            >
              <p className="text-sm font-medium text-white/75 mb-3">Featured Case</p>
              <a href="#solutions" className="flex items-stretch shadow-xl hover:shadow-2xl transition-all rounded-xl overflow-hidden">
                <div className="flex relative w-24 flex-shrink-0 items-center justify-center bg-gradient-to-br from-violet-700 via-fuchsia-700 to-violet-900 overflow-hidden">
                </div>
                <div className="flex-1 flex items-center justify-between gap-3 bg-white py-4 px-5">
                  <div>
                    <h4 className="text-base font-medium text-violet-600 leading-snug tracking-tight">Explore enterprise Unreal Engine use cases</h4>
                    <p className="mt-1.5 text-sm text-gray-500 leading-tighter tracking-tight">See how industries deploy real-time 3D at scale, from digital twins to industrial.</p>
                  </div>
                </div>
              </a>
            </motion.div>
          </div>
        </section>

        <section
          className="relative bg-black overflow-hidden py-20 sm:py-28 px-4 sm:px-6 min-h-[85vh] flex flex-col justify-center"
          style={{ contentVisibility: "auto", containIntrinsicSize: "1px 700px" }}
        >
          <div className="absolute inset-0 -left-[50px] top-[200px] w-full h-[220px] rounded-full blur-[100px] opacity-80 bg-gradient-to-r from-[#6E32CF] via-[#381DB4] to-[#E0CFF7]" />
          <div className="absolute inset-0 -left-[50px] top-[600px] w-full h-[220px] rounded-full blur-[100px] opacity-80 bg-gradient-to-r from-[#E0CFF7] via-[#6E32CF] to-[#381DB4]" />

          <div className="relative z-10 max-w-6xl mt-12 mx-auto w-full">
            <FadeUp className="mb-16 sm:mb-20">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-gradient-to-r from-violet-400 to-fuchsia-400" />
                <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-violet-300/90">our value proposition</span>
              </div>
              <h2 className="text-4xl font-semibold leading-tight text-white lg:text-5xl tracking-tighter max-w-3xl">
                Transform enterprise innovation with Unreal Engine
              </h2>
            </FadeUp>

            <div className="h-px bg-gradient-to-r from-violet-500/40 via-white/15 to-transparent mb-16 sm:mb-20" />

            <div className="grid lg:grid-cols-12 gap-y-14 gap-x-8">
              <FadeUp className="lg:col-span-4 lg:col-start-1">
                {/* Restored from PDF intro — was trimmed to a shorter
                    paraphrase that dropped "digital transformation" /
                    decision-making / development-cycle language. */}
                <p className="text-base sm:text-lg leading-relaxed tracking-tight text-white/75 max-w-sm">
                  Every organization is looking for smarter ways to design products, visualize complex data, train teams, collaborate remotely, and accelerate innovation. As industries embrace digital transformation, real-time 3D has become essential for improving decision-making, reducing development cycles, and delivering immersive customer experiences.
                </p>
              </FadeUp>

              <FadeUp delay={0.1} className="lg:col-span-7 lg:col-start-6">
                <div className="relative pl-8 sm:pl-10 border-l border-violet-400/30">
                  <span aria-hidden="true" className="absolute -left-2 -top-5 text-6xl sm:text-7xl font-serif text-violet-400/40 select-none">&ldquo;</span>
                  <p className="text-2xl sm:text-3xl lg:text-3xl font-medium text-white leading-snug tracking-tighter">
                    As an <span className="text-violet-300">Authorized Unreal Engine Partner</span>,   Sniper Systems & Solutions helps organizations
harness the power of Unreal Engine to build interactive, photorealistic, and scalable
applications for enterprise visualization, digital twins, simulation, immersive training, virtual
production, and extended reality (XR)
                  </p>
                </div>
              </FadeUp>

              <FadeUp delay={0.15} className="lg:col-span-5 lg:col-start-6 mt-2">
                {/* Restored the full consulting → managed-support chain
                    from the PDF (was missing "consulting" and
                    "integration, optimization" in the trimmed version). */}
                <p className="text-sm sm:text-base leading-relaxed text-white/65 max-w-md">
                  From consulting and solution architecture to implementation, integration, optimization, and managed support, we help organizations unlock the full potential of digital twins, simulation, immersive training, virtual production, and XR built on Unreal Engine.
                </p>
              </FadeUp>
            </div>

            <FadeUp delay={0.2} className="mt-20 sm:mt-28 grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-10 pt-10 border-t border-white/10">
              {[
                { label: "Faster decisions", desc: "Explore live interactive environments instead of static renders.", icon: Zap },
                { label: "Lower costs", desc: "Cut physical prototyping and reduce rework.", icon: PiggyBank },
                { label: "Real-time collaboration", desc: "Teams review and iterate on the same live scene, together.", icon: Users },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 border border-violet-400/25">
                    <item.icon className="relative w-5 h-5 text-violet-300" strokeWidth={1.75} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold tracking-[0.2em] uppercase text-violet-300/80">{item.label}</span>
                    <p className="text-sm text-white/70 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </FadeUp>
          </div>
        </section>

        <section className="relative bg-black overflow-hidden py-20 sm:py-28 px-4 sm:px-6 min-h-[85vh] flex flex-col justify-center" style={{ contentVisibility: "auto", containIntrinsicSize: "1px 900px" }}>
          <div className="absolute inset-0 -left-[50px] top-[300px] w-full h-[500px] rounded-full blur-[100px] opacity-45 bg-gradient-to-r from-[#E0CFF7] via-[#6E32CF] to-[#381DB4]" />

          <div className="relative mx-auto max-w-6xl w-full">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }} className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-gradient-to-r from-violet-400 to-fuchsia-400" />
                <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-violet-300/90">about unreal engine industry</span>
              </div>
              <h2 className="text-4xl font-semibold leading-tight text-white lg:text-5xl tracking-tighter">
                Why these Unreal Engine solutions are the ultimate combo
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-purple-100/85">
                Explore popular industry use cases that unlock the potential of real-time 3D visualization, immersive simulations, digital twins, and interactive experiences.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2, ease }} className="relative mt-16">
              <div className="overflow-hidden rounded-[30px] border border-white/10 shadow-2xl">
                <YouTubeBackground videoId="qC5KtatMcUw" start={88} />
              </div>
            </motion.div>
          </div>
        </section>
      </section>

      <div className="relative">
        <AmbientBackground />

        {/* ── Business Advantages ────────────────────────────────────── */}
        <section className="relative py-20 sm:py-28 px-4 sm:px-6 min-h-[85vh] flex flex-col justify-center" style={{ contentVisibility: "auto", containIntrinsicSize: "1px 900px" }}>
          <div className="relative z-10 max-w-6xl mx-auto w-full" ref={bentoRef}>
            <FadeUp className="max-w-2xl mb-10 sm:mb-14">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-gradient-to-r from-violet-400 to-fuchsia-400" />
                <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-violet-300/90">Business Advantages</span>
              </div>
              <h2 className="text-4xl font-semibold leading-tight text-white lg:text-5xl tracking-tighter">
                What real-time 3D actually changes for your business
              </h2>
              {/* Restored the "why this matters" framing from the PDF's
                  "Why Real-Time 3D Matters for Modern Enterprises" intro,
                  which the shortened version below had dropped. */}
              <p className="mt-5 text-sm sm:text-base text-white/70 leading-relaxed">
                Organizations are generating more engineering data, operational insights, and digital assets than ever before, and traditional visualization methods often struggle to communicate that complexity — leading to longer design cycles and slower decisions. Instead of static presentations or pre-rendered images, teams explore interactive environments, collaborate in real time, and make informed decisions faster.
              </p>
            </FadeUp>
            {/* Was bentoItems.slice(0, 6) — silently dropped 3 of the PDF's
                9 Business Advantages ("Improve operational visibility",
                "Enable immersive decision-making", "Drive digital
                transformation initiatives"). Now shows the full list. */}
            <BusinessAdvantagesStory items={bentoItems} />
          </div>
        </section>

        {/* ── Solutions ──────────────────────────────────────────────── */}
        <section id="solutions" className="py-20 sm:py-28 px-4 sm:px-6 tracking-tight" style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1600px" }}>
          <div className="max-w-6xl mx-auto" ref={solutionsRef}>
            <StickyScroll
              header={{
                eyebrow: "Solutions",
                title: (
                  <div className="tracking-tighter">
                    Enterprise Solutions<br className="hidden sm:block" />
                    Built with Unreal Engine
                  </div>
                ),
                description: "Our enterprise solutions are tailored to meet the needs of organizations across diverse industries while integrating seamlessly with existing IT infrastructure and business workflows.",
              }}
              content={solutionsStickyContent}
            />
          </div>
        </section>

        <section className="relative overflow-hidden py-20 sm:py-28 px-4 sm:px-6" style={{ contentVisibility: "auto", containIntrinsicSize: "1px 900px" }}>
          <div className="relative z-10 max-w-6xl mx-auto" ref={partnerWhyRef}>
            <ImpactSection />
          </div>
        </section>



        <UseCasesSection />

        {/* ── FAQs ───────────────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 py-20 sm:py-28" style={{ contentVisibility: "auto", containIntrinsicSize: "1px 900px" }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-10 lg:gap-16 items-start">
              <div>
                <FadeUp className="flex items-center gap-3 mb-4 sm:mb-5">
                  <span className="h-px w-8 bg-gradient-to-r from-violet-300 to-white/60" />
                  <span className="text-sm font-medium text-violet-200">FAQs</span>
                </FadeUp>
                <FadeUp delay={0.05}>
                  <h2 className="text-4xl font-semibold leading-tight text-white lg:text-5xl tracking-tighter mb-4 sm:mb-5">
                    Frequently Asked Questions
                  </h2>
                </FadeUp>
                <FadeUp delay={0.1}>
                  <p className="text-sm sm:text-base text-violet-100/85 leading-relaxed tracking-tight max-w-sm">
                    Everything you need to know about Unreal Engine solutions with Sniper Systems.
                  </p>
                </FadeUp>
              </div>

              <div className="space-y-3 sm:space-y-4 tracking-tight font-medium">
                {faqs.map((faq, i) => (
                  <FAQItem key={i} faq={faq} index={i} isOpen={openFAQ === i} onToggle={() => setOpenFAQ(openFAQ === i ? null : i)} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────── */}
        <section className="relative z-10 px-4 sm:px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-[#2a1854] via-[#1b0e3d] to-[#0a0118] px-6 py-16 sm:px-12 sm:py-20">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
                    "<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'>" +
                      "<circle cx='40' cy='40' r='90' fill='none' stroke='white' stroke-width='1'/>" +
                      "<circle cx='190' cy='60' r='70' fill='none' stroke='white' stroke-width='1'/>" +
                      "<circle cx='110' cy='190' r='80' fill='none' stroke='white' stroke-width='1'/>" +
                    "</svg>",
                  )}")`,
                  backgroundSize: "220px 220px",
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-1/2 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full blur-[100px] opacity-55 bg-gradient-to-t from-[#E0CFF7] via-[#6E32CF] to-transparent"
              />

              <div ref={ctaRef} className="relative z-10 mx-auto max-w-2xl text-center">
                <h2 ref={ctaHeadingRef} className="text-4xl font-semibold leading-tight text-white lg:text-5xl tracking-tighter">
                  Ready to accelerate your
                  <br />
                  <span className="text-white/70">digital transformation?</span>
                </h2>
                <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                  Partner with Sniper Systems to build enterprise-grade visualization, digital twins, XR experiences, and real-time 3D applications tailored to your business
                </p>
                <div className="mt-8 flex justify-center">
                  <PrimaryCTA href="/contact">Talk to Our Experts</PrimaryCTA>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Scroll to Top ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 left-6 sm:bottom-8 sm:left-8 w-12 h-12 sm:w-14 sm:h-14 bg-white border-2 border-violet-900 rounded-full flex items-center justify-center text-violet-900 hover:bg-violet-900 hover:text-white transition-all duration-300 z-50 shadow-lg"
            aria-label="Scroll to top"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 -rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
    </Layout>
  );
};

export default UnrealEngine;
