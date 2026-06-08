import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  FileText,
  Globe,
  Link2,
  Mail,
  MessageSquare,
  RefreshCw,
  Scale,
  Shield
} from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

// -------------------- Easing presets --------------------
const ease = [0.16, 1, 0.3, 1] as const;

// ========================================================
// ✦ WHITE SCREEN TRANSITION
// ========================================================
const WhiteScreenTransition = ({ onComplete }: { onComplete: () => void }) => (
  <motion.div
    className="fixed inset-0 bg-white z-[9999]"
    initial={{ y: 0 }}
    animate={{ y: "-105%" }}
    transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
    onAnimationComplete={onComplete}
  />
);

// ========================================================
// ✦ SPRING BADGE PILL
// ========================================================
const SpringBadge = ({ children }: { children: React.ReactNode }) => (
  <motion.span
    className="inline-block px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.15em] uppercase cursor-default border border-black/10 bg-gray-100 text-gray-700"
    whileHover={{ scale: 1.08, backgroundColor: "#111", color: "#fff" }}
    transition={{ type: "spring", stiffness: 400, damping: 18 }}
  >
    {children}
  </motion.span>
);

// ========================================================
// ✦ SPRING HEADING
// ========================================================
const SpringHeading = ({
  children,
  trigger,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  trigger: boolean;
  delay?: number;
  className?: string;
}) => (
  <motion.h2
    className={`font-semibold leading-tight ${className}`}
    initial={{ opacity: 0, y: 60 }}
    animate={trigger ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
    transition={{ duration: 0.8, ease, delay }}
  >
    {children}
  </motion.h2>
);

// ========================================================
// ✦ GSAP MARQUEE TICKER
// ========================================================
const MarqueeTicker = ({ items }: { items: string[] }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const totalWidth = track.scrollWidth / 2;
    const tween = gsap.to(track, { x: `-${totalWidth}px`, duration: 24, ease: "none", repeat: -1 });
    return () => tween.kill();
  }, []);
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden bg-gray-950 py-4 sm:py-5 border-y border-gray-800">
      <div ref={trackRef} className="flex gap-10 whitespace-nowrap will-change-transform">
        {doubled.map((text, i) => (
          <span key={i} className="flex items-center gap-10 text-[11px] font-semibold tracking-[0.22em] uppercase text-gray-500">
            {text}
            <span className="w-1.5 h-1.5 rounded-full bg-gray-700 inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
};

// ========================================================
// ✦ GSAP LINE-DRAW SECTION DIVIDER
// ========================================================
const SectionDivider = ({ inView, delay = 0 }: { inView: boolean; delay?: number }) => {
  const lineRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!inView || !lineRef.current) return;
    gsap.fromTo(lineRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 1.1, ease: "power3.out", delay }
    );
  }, [inView, delay]);
  return (
    <div className="w-full h-px bg-gray-200 overflow-hidden my-6">
      <div ref={lineRef} className="h-full bg-gradient-to-r from-gray-900/40 via-gray-900 to-gray-900/40" style={{ transform: "scaleX(0)" }} />
    </div>
  );
};

// ========================================================
// ✦ TERMS SECTION CARD
// ========================================================
const TermsSection = ({
  icon: Icon,
  number,
  title,
  children,
  trigger,
  index,
}: {
  icon: React.ElementType;
  number: string;
  title: string;
  children: React.ReactNode;
  trigger: boolean;
  index: number;
}) => (
  <motion.div
    className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 py-12 sm:py-16"
    initial={{ opacity: 0, y: 40 }}
    animate={trigger ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
    transition={{ duration: 0.75, ease, delay: 0.1 + index * 0.07 }}
  >
    {/* Left — number + icon */}
    <div className="lg:col-span-3 flex flex-row lg:flex-col items-center lg:items-start gap-4 lg:gap-0">
      <motion.span
        className="text-5xl sm:text-6xl font-semibold text-gray-200 leading-none select-none"
        initial={{ opacity: 0, x: -20 }}
        animate={trigger ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease, delay: 0.2 + index * 0.07 }}
      >
        {number}
      </motion.span>
      <motion.div
        className="mt-0 lg:mt-6"
        whileHover={{ rotate: [0, -8, 8, 0] }}
        transition={{ duration: 0.5 }}
      >
        <Icon className="w-8 h-8 text-gray-700" />
      </motion.div>
    </div>

    {/* Right — title + content */}
    <div className="lg:col-span-9">
      <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 leading-snug">{title}</h3>
      <div className="text-base sm:text-lg text-gray-700 leading-relaxed space-y-4">
        {children}
      </div>
    </div>
  </motion.div>
);

// ========================================================
// ✦ TERMS BULLET LIST
// ========================================================
const TermsList = ({ items }: { items: string[] }) => (
  <ul className="space-y-3 mt-4">
    {items.map((item, i) => (
      <motion.li
        key={i}
        className="flex items-start gap-3 text-gray-700"
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease, delay: i * 0.06 }}
      >
        <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-900" />
        <span>{item}</span>
      </motion.li>
    ))}
  </ul>
);

// ========================================================
// ✦ QUICK NAV PILLS (sticky index)
// ========================================================
const QuickNav = ({ sections }: { sections: { id: string; label: string }[] }) => {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.div
      className="hidden xl:flex flex-col gap-2 sticky top-32 self-start"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease, delay: 1.6 }}
    >
      <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-2">Contents</p>
      {sections.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          className={`text-left text-sm font-medium transition-all duration-300 leading-snug py-1 border-l-2 pl-3 ${
            active === id
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          {label}
        </button>
      ))}
    </motion.div>
  );
};

// ========================================================
// ✦ ORBITAL RINGS (for CTA)
// ========================================================
const OrbitalRings = () => (
  <div className="absolute inset-0 bg-black overflow-hidden">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] md:w-[1000px] md:h-[1000px]">
      <div className="absolute inset-0 animate-[spin_20s_linear_infinite]"><div className="absolute inset-0 rounded-full border-2 border-white blur-sm" /><div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-purple-400 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.8)]" /></div>
      <div className="absolute inset-8 animate-[spin_15s_linear_infinite_reverse]"><div className="absolute inset-0 rounded-full border-2 border-white blur-sm" /><div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]" /></div>
      <div className="absolute inset-16 animate-[spin_12s_linear_infinite]"><div className="absolute inset-0 rounded-full border-2 border blur-[2px]" /><div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-pink-400 rounded-full shadow-[0_0_18px_rgba(244,114,182,0.9)]" /></div>
      <div className="absolute inset-24 animate-[spin_9s_linear_infinite_reverse]"><div className="absolute inset-0 rounded-full border-2 border blur-[1px]" /><div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_12px_rgba(96,165,250,0.9)]" /></div>
      <div className="absolute inset-32 animate-[spin_7s_linear_infinite]"><div className="absolute inset-0 rounded-full border-2 border blur-[1px]" /><div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-violet-400 rounded-full shadow-[0_0_10px_rgba(167,139,250,1)]" /></div>
      <div className="absolute inset-40 animate-[spin_5s_linear_infinite_reverse]"><div className="absolute inset-0 rounded-full border-2 border" /><div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-fuchsia-400 rounded-full shadow-[0_0_15px_rgba(232,121,249,1)]" /></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl" />
        <div className="absolute w-16 h-16 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-xl" />
        <div className="absolute w-8 h-8 bg-white/50 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.5)]" />
      </div>
    </div>
  </div>
);

// ========================================================
// ✦ CTA SECTION
// ========================================================
const CTASection = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [displayPosition, setDisplayPosition] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const sectionRef = useRef(null);
  const ctaBtnRef = useRef<HTMLAnchorElement>(null);
  const animationFrameRef = useRef(null);
  const velocity = useRef({ x: 0, y: 0 });

  useEffect(() => { setIsTouchDevice(window.matchMedia("(hover: none)").matches); }, []);

  const lerp = (s: number, e: number, f: number) => s + (e - s) * f;

  const animateCursor = useCallback(() => {
    if (!cursorVisible) return;
    const sf = isHoveringButton ? 0.2 : 0.1;
    setDisplayPosition(prev => {
      const newX = lerp(prev.x, cursorPosition.x, sf);
      const newY = lerp(prev.y, cursorPosition.y, sf);
      velocity.current = { x: newX - prev.x, y: newY - prev.y };
      return { x: newX, y: newY };
    });
    animationFrameRef.current = requestAnimationFrame(animateCursor);
  }, [cursorVisible, cursorPosition, isHoveringButton]);

  useEffect(() => {
    if (isTouchDevice) return;
    const section = sectionRef.current;
    if (!section) return;
    const enter = () => { setCursorVisible(true); animationFrameRef.current = requestAnimationFrame(animateCursor); };
    const leave = () => { setCursorVisible(false); setIsHoveringButton(false); if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
    const move = (e: MouseEvent) => setCursorPosition({ x: e.clientX, y: e.clientY });
    section.addEventListener("mouseenter", enter);
    section.addEventListener("mouseleave", leave);
    section.addEventListener("mousemove", move);
    animationFrameRef.current = requestAnimationFrame(animateCursor);
    return () => { section.removeEventListener("mouseenter", enter); section.removeEventListener("mouseleave", leave); section.removeEventListener("mousemove", move); if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, [animateCursor, isTouchDevice]);

  useEffect(() => {
    const btn = ctaBtnRef.current;
    if (!btn || isTouchDevice) return;
    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
      gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: "power2.out" });
    };
    const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);
    return () => { btn.removeEventListener("mousemove", onMove); btn.removeEventListener("mouseleave", onLeave); };
  }, [isTouchDevice]);

  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <>
      {!isTouchDevice && (
        <>
          <div
            className={`fixed pointer-events-none z-50 flex items-center justify-center rounded-full font-bold text-sm ${cursorVisible ? "opacity-100" : "opacity-0"} ${isHoveringButton ? "w-32 h-32 bg-white text-black" : "w-24 h-24 bg-white text-black"}`}
            style={{ left: `${displayPosition.x}px`, top: `${displayPosition.y}px`, transform: `translate(-50%, -50%) ${cursorVisible ? (isHoveringButton ? "scale(1.3)" : "scale(1)") : "scale(0.5)"}`, transition: cursorVisible ? "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.3s ease, height 0.3s ease" : "all 0.3s ease", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.25))" }}
          >
            {isHoveringButton ? "CLICK ME!" : "LET'S GO!"}
          </div>
          <div
            className={`fixed pointer-events-none z-40 rounded-full ${cursorVisible ? "opacity-30" : "opacity-0"} ${isHoveringButton ? "w-20 h-20 bg-white/30" : "w-16 h-16 bg-white/20"}`}
            style={{ left: `${displayPosition.x - velocity.current.x * 0.5}px`, top: `${displayPosition.y - velocity.current.y * 0.5}px`, transform: "translate(-50%, -50%)", transition: "left 0.1s linear, top 0.1s linear" }}
          />
        </>
      )}

      <motion.section
        ref={(el) => { sectionRef.current = el; ctaRef.current = el; }}
        className={`relative bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12 overflow-hidden ${!isTouchDevice ? "cursor-none" : ""}`}
        initial={{ opacity: 0, y: 60 }}
        animate={ctaInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease }}
      >
        <div className="hidden sm:block"><OrbitalRings /></div>
        <div className="block sm:hidden absolute inset-0 bg-black">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div className="mb-10 sm:mb-12" initial={{ opacity: 0, y: 40 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease, delay: 0.2 }}>
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold mb-6 leading-tight text-white">
              Questions<br />about these<br />terms?
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease, delay: 0.4 }}>
            <a
              ref={ctaBtnRef as any}
              href="/contact"
              className="inline-flex items-center px-8 sm:px-12 py-3 sm:py-4 border-2 border-white rounded-full text-white font-medium text-base sm:text-lg hover:bg-white hover:text-black transition-colors duration-300 relative z-10 will-change-transform"
              onMouseEnter={() => setIsHoveringButton(true)}
              onMouseLeave={() => setIsHoveringButton(false)}
            >
              CONTACT US
              <span className="absolute inset-[-10px] rounded-full" />
            </a>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
};

// ========================================================
// ✦ KEY PRINCIPLES SECTION (black pill)
// ========================================================
const PrinciplesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!inView) return;
    linesRef.current.forEach((line, i) => {
      if (!line) return;
      gsap.fromTo(line,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 0.9, ease: "power3.out", delay: 0.3 + i * 0.1 }
      );
    });
  }, [inView]);

  const principles = [
    { label: "Lawful use only",     text: "Our website is provided exclusively for lawful purposes in full compliance with applicable local, national, and international regulations." },
    { label: "IP protected",        text: "All content on this website is the exclusive intellectual property of Sniper Systems and may not be reproduced without written authorization." },
    { label: "Liability limited",   text: "To the maximum extent permitted by law, Sniper Systems shall not be held liable for damages arising from website use or content reliance." },

  ];

  return (
    <motion.section
      ref={ref}
      className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12"
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
        >
          <SpringHeading trigger={inView} delay={0.1} className="text-4xl sm:text-6xl md:text-7xl text-white">
            Key legal<br />principles
          </SpringHeading>
        </motion.div>

        <div className="space-y-0">
          {principles.map((item, index) => (
            <motion.div
              key={index}
              className="relative pb-6 sm:pb-8 last:pb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease, delay: 0.2 + index * 0.1 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-8 items-start py-6 sm:py-8">
                <div className="sm:col-span-3">
                  <motion.span
                    className="text-lg sm:text-xl font-semibold text-white"
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, ease, delay: 0.3 + index * 0.1 }}
                  >
                    {item.label}
                  </motion.span>
                </div>
                <div className="sm:col-span-9">
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed">{item.text}</p>
                </div>
              </div>
              {index < principles.length - 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-700 overflow-hidden">
                  <div
                    ref={el => { linesRef.current[index] = el; }}
                    className="h-full bg-gradient-to-r from-white/40 via-white/80 to-white/40"
                    style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

// ========================================================
// ✦ MAIN TERMS PAGE
// ========================================================
const Terms = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // GSAP: Hero heading word-by-word stagger
  const gsapHeroRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = gsapHeroRef.current;
    if (!el) return;
    const words = el.querySelectorAll(".gsap-word");
    gsap.fromTo(words,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.09, delay: 1.4 }
    );
  }, []);

  // Section refs
  const heroRef      = useRef(null);
  const introRef     = useRef(null);
  const s0Ref        = useRef(null);
  const s1Ref        = useRef(null);
  const s2Ref        = useRef(null);
  const s3Ref        = useRef(null);
  const s4Ref        = useRef(null);
  const s5Ref        = useRef(null);
  const s6Ref        = useRef(null);
  const s7Ref        = useRef(null);
  const s8Ref        = useRef(null);
  const s9Ref        = useRef(null);
  const s10Ref       = useRef(null);

  const heroInView  = useInView(heroRef,  { once: true, margin: "-60px" });
  const introInView = useInView(introRef, { once: true, margin: "-60px" });
  const s0InView    = useInView(s0Ref,    { once: true, margin: "-60px" });
  const s1InView    = useInView(s1Ref,    { once: true, margin: "-60px" });
  const s2InView    = useInView(s2Ref,    { once: true, margin: "-60px" });
  const s3InView    = useInView(s3Ref,    { once: true, margin: "-60px" });
  const s4InView    = useInView(s4Ref,    { once: true, margin: "-60px" });
  const s5InView    = useInView(s5Ref,    { once: true, margin: "-60px" });
  const s6InView    = useInView(s6Ref,    { once: true, margin: "-60px" });
  const s7InView    = useInView(s7Ref,    { once: true, margin: "-60px" });
  const s8InView    = useInView(s8Ref,    { once: true, margin: "-60px" });
  const s9InView    = useInView(s9Ref,    { once: true, margin: "-60px" });
  const s10InView   = useInView(s10Ref,   { once: true, margin: "-60px" });



  const marqueeItems = [
    "Terms & Conditions", "Legal Agreement", "Intellectual Property",  "Sniper Systems", "Chennai India", "User Policy",
  ];

  const navSections = [
    { id: "section-intro", label: "Introduction" },
    { id: "section-1",     label: "Use of the Website" },
    { id: "section-2",     label: "Intellectual Property" },
    { id: "section-3",     label: "Accuracy of Content" },
    { id: "section-4",     label: "Third-Party Links" },
    { id: "section-5",     label: "Limitation of Liability" },
    { id: "section-6",     label: "User Submissions" },
    { id: "section-7",     label: "Privacy" },
    { id: "section-8",     label: "Modifications" },

    { id: "section-10",    label: "Contact Us" },
  ];

  return (
    <Layout>
      {showWhiteScreen && <WhiteScreenTransition onComplete={() => setShowWhiteScreen(false)} />}

      {/* ── Hero Section ── */}
      <section className="relative bg-white pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 opacity-80" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16" ref={heroRef}>

            {/* GSAP word-by-word heading */}
            <h1
              ref={gsapHeroRef}
              className="text-4xl sm:text-6xl md:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
            >
              {["Terms", "&", "Conditions"].map((word, i) => (
                <span
                  key={i}
                  className="gsap-word inline-block opacity-0 mr-[0.25em] last:mr-0"
                  style={{ overflow: "visible" }}
                >
                  {word}
                </span>
              ))}
            </h1>

            <motion.p
              className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0 mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 1.9 }}
            >
              Sniper Systems and Solutions Pvt Ltd
            </motion.p>



            {/* Badge trail */}

          </div>
        </div>
      </section>

      {/* Marquee */}
      <MarqueeTicker items={marqueeItems} />

      {/* ── Intro Statement (black pill section) ── */}
      <motion.section
        ref={introRef}
        className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12"
        initial={{ opacity: 0, y: 60 }}
        animate={introInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={introInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
          >
            <SpringHeading trigger={introInView} delay={0.1} className="text-4xl sm:text-5xl md:text-6xl text-white mb-8">
              A legally<br />binding<br />agreement.
            </SpringHeading>
          </motion.div>
          <motion.p
            className="text-base sm:text-xl text-gray-300 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={introInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.3 }}
          >
            Welcome to the official website of Sniper Systems and Solutions Pvt Ltd. These Terms &
            Conditions constitute a legally binding agreement between you and Sniper Systems and Solutions
            Pvt Ltd, governing your access to and use of our website, digital content, and associated services.
            By accessing or continuing to use this website, you confirm that you have read, understood, and
            agree to be legally bound by these Terms in their entirety.
          </motion.p>
        </div>
      </motion.section>

      {/* ── Main Terms Content ── */}
      <section className="bg-white py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-16">

            {/* Sticky side nav */}
            <div className="xl:col-span-2">
              <QuickNav sections={navSections} />
            </div>

            {/* Terms sections */}
            <div className="xl:col-span-10">

              {/* Introduction */}
              <div id="section-intro" ref={s0Ref}>
                <TermsSection icon={BookOpen} number="00" title="Introduction" trigger={s0InView} index={0}>
                  <p>
                    These Terms apply to all visitors, users, and others who interact with our website or
                    services, regardless of the nature or purpose of such interaction. If you do not agree
                    with any provision contained herein, you must immediately discontinue your use of this
                    website.
                  </p>
                  <p>
                    Content published on this website is provided solely for general informational purposes
                    relating to Sniper Systems and Solutions Pvt Ltd — including our products, services,
                    capabilities, and company profile. It does not constitute a binding offer, contractual
                    commitment, or professional advice of any kind.
                  </p>
                </TermsSection>
                <SectionDivider inView={s0InView} delay={0.4} />
              </div>

              {/* Section 1 */}
              <div id="section-1" ref={s1Ref}>
                <TermsSection icon={FileText} number="01" title="Use of the Website" trigger={s1InView} index={1}>
                  <p>
                    As a condition of your use of this website, you warrant and agree that you will:
                  </p>
                  <TermsList items={[
                    "Access and use the website exclusively for lawful purposes and in full compliance with all applicable local, national, and international laws and regulations",
                    "Refrain from engaging in any conduct that may damage, disrupt, impair, or compromise the functionality, security, or integrity of the website or its underlying systems",
                    "Not attempt to gain unauthorized access to any part of the website, its servers, or any connected network or database",
                    "Not use automated tools, bots, or scraping mechanisms to extract content or data from the website without our express written consent",
                  ]} />
                  <p className="mt-4">
                    We reserve the right to suspend or terminate access for any user found to be in violation
                    of these conditions, without prior notice.
                  </p>
                </TermsSection>
                <SectionDivider inView={s1InView} delay={0.3} />
              </div>

              {/* Section 2 */}
              <div id="section-2" ref={s2Ref}>
                <TermsSection icon={Shield} number="02" title="Intellectual Property Rights" trigger={s2InView} index={2}>
                  <p>
                    All content appearing on this website — including but not limited to text, graphics,
                    logos, images, icons, software, design layouts, and proprietary technology — is the
                    exclusive intellectual property of Sniper Systems and Solutions Pvt Ltd or its duly
                    authorized licensors, protected under applicable intellectual property laws including
                    copyright, trademark, and design protection statutes.
                  </p>
                  <p>Specifically, you are prohibited from:</p>
                  <TermsList items={[
                    "Reproducing, copying, or duplicating any content from this website for commercial or public use",
                    "Distributing, transmitting, or publishing any website content without prior written consent",
                    "Modifying, adapting, or creating derivative works based on our proprietary content",
                    "Removing or altering any copyright, trademark, or other proprietary notices from the website",
                  ]} />
                  <p className="mt-4">
                    Requests for content use or licensing may be directed to{" "}
                    <a href="mailto:enquiry@sniperindia.com" className="underline underline-offset-4 text-gray-900 hover:text-gray-600 transition-colors">
                      enquiry@sniperindia.com
                    </a>.
                  </p>
                </TermsSection>
                <SectionDivider inView={s2InView} delay={0.3} />
              </div>

              {/* Section 3 */}
              <div id="section-3" ref={s3Ref}>
                <TermsSection icon={BookOpen} number="03" title="Accuracy of Website Content" trigger={s3InView} index={3}>
                  <p>
                    Sniper Systems and Solutions Pvt Ltd endeavors to ensure that all information published
                    on this website is accurate, current, and complete at the time of publication. However,
                    we make no representations, warranties, or guarantees — express or implied — as to the
                    accuracy, reliability, timeliness, or completeness of any content herein.
                  </p>
                  <p>
                    Content on this website is subject to change at any time without prior notice, including
                    the removal or modification of information relating to our products, services, pricing,
                    or organizational details. Users are advised to verify any critical information directly
                    with our team before acting upon it.
                  </p>
                  <p>
                    The website is provided on an "as is" and "as available" basis without any warranty of
                    any kind, whether express, implied, or statutory.
                  </p>
                </TermsSection>
                <SectionDivider inView={s3InView} delay={0.3} />
              </div>

              {/* Section 4 */}
              <div id="section-4" ref={s4Ref}>
                <TermsSection icon={Link2} number="04" title="Third-Party Links" trigger={s4InView} index={4}>
                  <p>
                    For informational convenience, our website may include hyperlinks to external, third-party
                    websites. These sites are operated independently by their respective owners and are not
                    under the control or supervision of Sniper Systems and Solutions Pvt Ltd.
                  </p>
                  <p>
                    The inclusion of any third-party link on our website does not imply our endorsement,
                    recommendation, or affiliation with the linked website or its operators. We expressly
                    disclaim all responsibility for:
                  </p>
                  <TermsList items={[
                    "The accuracy, legality, or appropriateness of content on third-party websites",
                    "The privacy policies, data collection practices, or terms of use of such external platforms",
                    "Any loss, damage, or liability arising from your use of or reliance on third-party content",
                  ]} />
                  <p className="mt-4">
                    We strongly encourage you to review the terms and privacy policies of any third-party
                    website before engaging with it.
                  </p>
                </TermsSection>
                <SectionDivider inView={s4InView} delay={0.3} />
              </div>

              {/* Section 5 */}
              <div id="section-5" ref={s5Ref}>
                <TermsSection icon={AlertTriangle} number="05" title="Limitation of Liability" trigger={s5InView} index={5}>
                  <p>
                    To the maximum extent permissible under applicable law, Sniper Systems and Solutions
                    Pvt Ltd, its directors, officers, employees, agents, and affiliates shall not be held
                    liable for any damages — whether direct, indirect, incidental, special, consequential,
                    or punitive — arising out of or in connection with:
                  </p>
                  <TermsList items={[
                    "Your access to, use of, or inability to use this website or its content",
                    "Any errors, omissions, or inaccuracies in the information published on the website",
                    "Unauthorized access to or alteration of your data or transmissions",
                    "Loss of data, business interruption, system failures, or other technical disruptions",
                    "Any conduct or content of third parties linked to or accessible through our website",
                  ]} />
                  <p className="mt-4">
                    This limitation of liability applies regardless of the legal theory under which the claim
                    is brought, including contract, tort, negligence, or strict liability, and even if we
                    have been advised of the possibility of such damages.
                  </p>
                </TermsSection>
                <SectionDivider inView={s5InView} delay={0.3} />
              </div>

              {/* Section 6 */}
              <div id="section-6" ref={s6Ref}>
                <TermsSection icon={MessageSquare} number="06" title="User Submissions and Communications" trigger={s6InView} index={6}>
                  <p>
                    When you submit information to us — whether through contact forms, inquiry submissions,
                    email correspondence, or any other communication channel available on this website — you
                    represent and warrant that:
                  </p>
                  <TermsList items={[
                    "All information provided is truthful, accurate, and current to the best of your knowledge",
                    "Your submission does not infringe upon the intellectual property rights, privacy rights, or any other rights of any third party",
                    "The content of your submission does not contain unlawful, defamatory, obscene, or otherwise objectionable material",
                  ]} />
                  <p className="mt-4">
                    We reserve the right to use information submitted by you for the purpose of responding
                    to inquiries, providing requested services, and improving our offerings. Please refer to
                    our Privacy Policy for further detail on how submitted information is handled and protected.
                  </p>
                </TermsSection>
                <SectionDivider inView={s6InView} delay={0.3} />
              </div>

              {/* Section 7 */}
              <div id="section-7" ref={s7Ref}>
                <TermsSection icon={Globe} number="07" title="Privacy" trigger={s7InView} index={7}>
                  <p>
                    Your use of this website is also governed by our Privacy Policy, which is incorporated
                    into these Terms by reference. The Privacy Policy provides a comprehensive explanation
                    of how we collect, process, store, and protect your personal information in connection
                    with your use of our website and services.
                  </p>
                  <p>
                    We encourage you to review our Privacy Policy carefully. By using this website, you
                    consent to the data practices described therein.
                  </p>
                  <motion.div
                    className="mt-6"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease }}
                  >
                    <a
                      href="/privacy"
                      className="inline-flex items-center gap-2 text-gray-900 font-semibold border-b-2 border-gray-900 pb-0.5 hover:border-gray-400 hover:text-gray-600 transition-all duration-300 text-sm tracking-wide uppercase"
                    >
                      Read Privacy Policy <ArrowRight className="w-4 h-4" />
                    </a>
                  </motion.div>
                </TermsSection>
                <SectionDivider inView={s7InView} delay={0.3} />
              </div>

              {/* Section 8 */}
              <div id="section-8" ref={s8Ref}>
                <TermsSection icon={RefreshCw} number="08" title="Modifications to These Terms" trigger={s8InView} index={8}>
                  <p>
                    Sniper Systems and Solutions Pvt Ltd reserves the right, at its sole discretion, to
                    amend, revise, or replace these Terms & Conditions at any time and without prior notice.
                    All modifications will be effective immediately upon being posted to this page, and the
                    "Last Updated" date will be revised accordingly.
                  </p>
                  <p>
                    It is your responsibility to review these Terms periodically to remain informed of any
                    changes. Your continued use of this website following the publication of revised Terms
                    constitutes your acceptance of and agreement to those changes.
                  </p>
                  <p>
                    If any modification is materially adverse to your interests and you do not agree with
                    the revised Terms, you should cease using the website immediately.
                  </p>
                </TermsSection>
                <SectionDivider inView={s8InView} delay={0.3} />
              </div>

              {/* Section 9
              <div id="section-9" ref={s9Ref}>
                <TermsSection icon={Scale} number="09" title="Governing Law and Jurisdiction" trigger={s9InView} index={9}>
                  <p>
                    These Terms & Conditions shall be construed, interpreted, and governed exclusively in
                    accordance with the laws of the Republic of India, without regard to its conflict of
                    law principles.
                  </p>
                  <p>
                    Any dispute, controversy, or claim arising out of or in connection with these Terms,
                    including any question regarding their existence, validity, breach, or termination,
                    shall be subject to the exclusive jurisdiction of the competent courts located in
                    Chennai, Tamil Nadu, India.
                  </p>
                  <p>
                    By using this website, you irrevocably submit to the personal jurisdiction of such
                    courts and waive any objection to the exercise of jurisdiction over you by such courts.
                  </p>
                </TermsSection>
                <SectionDivider inView={s9InView} delay={0.3} />
              </div>*/}

              {/* Section 10 */}
              <div id="section-10" ref={s10Ref}>
                <TermsSection icon={Mail} number="10" title="Contact Us" trigger={s10InView} index={10}>
                  <p>
                    If you have any questions, concerns, or require clarification regarding these Terms &
                    Conditions, we invite you to reach out to us. Our team is committed to addressing all
                    queries in a prompt and transparent manner.
                  </p>
                  <motion.div
                    className="mt-8 p-6 sm:p-8 bg-gray-50 rounded-2xl sm:rounded-3xl border border-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={s10InView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease, delay: 0.35 }}
                  >
                    <p className="font-semibold text-gray-900 text-lg mb-4">Sniper Systems and Solutions Pvt Ltd</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <a
                          href="https://sniperindia.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-gray-900 underline underline-offset-4 transition-colors"
                        >
                          https://sniperindia.com
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <a
                          href="mailto:enquiry@sniperindia.com"
                          className="text-gray-700 hover:text-gray-900 underline underline-offset-4 transition-colors"
                        >
                          enquiry@sniperindia.com
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </TermsSection>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Marquee bottom */}
      <MarqueeTicker items={["Legal Agreement",  "Chennai India", "Intellectual Property", "Sniper Systems", "User Policy", "Liability"]} />

      {/* ── Key Principles (black section) ── */}
      <PrinciplesSection />

      {/* ── CTA Section ── */}
      <CTASection />

      {/* ── Scroll to Top ── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 sm:bottom-8 sm:left-8 w-12 h-12 sm:w-14 sm:h-14 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 z-50 shadow-lg"
            aria-label="Scroll to top"
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 -rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Terms;
