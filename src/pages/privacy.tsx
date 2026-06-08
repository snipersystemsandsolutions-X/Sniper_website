import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen, Building2,
  Cookie, Eye, FileText,
  Gavel,
  Globe, Lock, Mail,
  MessageSquare,
  RefreshCw, Shield, Trash2, UserCheck, Users
} from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

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
// ✦ PART BANNER (black divider strip between TC and PP)
// ========================================================
const PartBanner = ({
  part,
  title,
  subtitle,
  trigger,
}: {
  part: string;
  title: string;
  subtitle: string;
  trigger: boolean;
}) => (
  <motion.div
    className="bg-gray-950 text-white rounded-2xl sm:rounded-3xl px-8 sm:px-12 py-10 sm:py-14 my-10 sm:my-16 mx-0"
    initial={{ opacity: 0, y: 40 }}
    animate={trigger ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.85, ease }}
  >
    <motion.span
      className="block text-[11px] font-bold tracking-[0.22em] uppercase text-gray-500 mb-3"
      initial={{ opacity: 0 }}
      animate={trigger ? { opacity: 1 } : {}}
      transition={{ duration: 0.6, ease, delay: 0.2 }}
    >
      {part}
    </motion.span>
    <motion.h2
      className="text-3xl sm:text-5xl font-semibold text-white leading-tight mb-4"
      initial={{ opacity: 0, y: 30 }}
      animate={trigger ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease, delay: 0.25 }}
    >
      {title}
    </motion.h2>
    <motion.p
      className="text-base sm:text-lg text-gray-400 max-w-2xl leading-relaxed"
      initial={{ opacity: 0, y: 20 }}
      animate={trigger ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease, delay: 0.35 }}
    >
      {subtitle}
    </motion.p>
  </motion.div>
);

// ========================================================
// ✦ POLICY SECTION CARD
// ========================================================
const PolicySection = ({
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
    <div className="lg:col-span-9">
      <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 leading-snug">{title}</h3>
      <div className="text-base sm:text-lg text-gray-700 leading-relaxed space-y-4">
        {children}
      </div>
    </div>
  </motion.div>
);

// ========================================================
// ✦ POLICY BULLET LIST
// ========================================================
const PolicyList = ({ items }: { items: string[] }) => (
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
// ✦ B2B CALLOUT BOX
// ========================================================
const CalloutBox = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <motion.div
    className="mt-6 p-5 sm:p-6 bg-gray-50 border-l-4 border-gray-900 rounded-r-2xl"
    initial={{ opacity: 0, x: -16 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease, delay: 0.2 }}
  >
    <p className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">{label}</p>
    <p className="text-base text-gray-600 leading-relaxed">{children}</p>
  </motion.div>
);

// ========================================================
// ✦ QUICK NAV PILLS (sticky index)
// ========================================================
const QuickNav = ({ sections }: { sections: { id: string; label: string; part?: string }[] }) => {
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

  let lastPart = "";

  return (
    <motion.div
      className="hidden xl:flex flex-col gap-1 sticky top-32 self-start"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease, delay: 1.6 }}
    >
      <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-2">Contents</p>
      {sections.map(({ id, label, part }) => {
        const showPart = part && part !== lastPart;
        if (part) lastPart = part;
        return (
          <div key={id}>
            {showPart && (
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-gray-300 mt-3 mb-1 pl-3">{part}</p>
            )}
            <button
              onClick={() => scrollTo(id)}
              className={`text-left text-sm font-medium transition-all duration-300 leading-snug py-1 border-l-2 pl-3 ${
                active === id
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {label}
            </button>
          </div>
        );
      })}
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
              Questions<br />about our<br />policies?
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
// ✦ KEY COMMITMENTS SECTION (black)
// ========================================================
const CommitmentsSection = () => {
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

  const commitments = [
    { label: "No data selling",  text: "We never sell, rent, license, or trade your personal or organizational information to third parties for commercial gain. Your data exists to serve your engagement with us — nothing more." },
    { label: "Purpose-limited",  text: "Information collected is used exclusively for the specific purposes outlined in this document. We do not repurpose data beyond its stated collection context or without your knowledge." },
    { label: "Security-first",   text: "Robust technical and organizational measures are applied at every layer of our digital infrastructure to protect your information from unauthorized access, disclosure, or loss." },
    { label: "Transparent",      text: "Every data practice we operate is documented herein. We revise this document whenever our practices change and notify users through prominent publication on our platform." },
    { label: "B2B integrity",    text: "As a dedicated B2B provider, we treat all client and partner data with the confidentiality expected in professional commercial relationships, holding our service providers to the same standard." },
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
        <motion.div className="mb-10 sm:mb-14" initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease, delay: 0.1 }}>
          <SpringHeading trigger={inView} delay={0.1} className="text-4xl sm:text-6xl md:text-7xl text-white">
            Our core<br />commitments
          </SpringHeading>
        </motion.div>

        <div className="space-y-0">
          {commitments.map((item, index) => (
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
              {index < commitments.length - 1 && (
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
// ✦ MAIN TERMS & PRIVACY PAGE
// ========================================================
const TermsAndPrivacy = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

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

  // ── Refs ──────────────────────────────────────────────
  const heroRef       = useRef(null);
  const introRef      = useRef(null);
  const partTCRef     = useRef(null);
  const partPPRef     = useRef(null);

  // TC sections
  const tcS1Ref  = useRef(null);
  const tcS2Ref  = useRef(null);
  const tcS3Ref  = useRef(null);
  const tcS4Ref  = useRef(null);
  const tcS5Ref  = useRef(null);
  const tcS6Ref  = useRef(null);
  const tcS7Ref  = useRef(null);
  const tcS8Ref  = useRef(null);
  const tcS9Ref  = useRef(null);

  // PP sections
  const ppS1Ref  = useRef(null);
  const ppS2Ref  = useRef(null);
  const ppS3Ref  = useRef(null);
  const ppS4Ref  = useRef(null);
  const ppS5Ref  = useRef(null);
  const ppS6Ref  = useRef(null);
  const ppS7Ref  = useRef(null);
  const ppS8Ref  = useRef(null);
  const ppS9Ref  = useRef(null);
  const ppS10Ref = useRef(null);
  const ppS11Ref = useRef(null);

  const heroInView    = useInView(heroRef,    { once: true, margin: "-60px" });
  const introInView   = useInView(introRef,   { once: true, margin: "-60px" });
  const partTCInView  = useInView(partTCRef,  { once: true, margin: "-60px" });
  const partPPInView  = useInView(partPPRef,  { once: true, margin: "-60px" });

  const tcS1InView  = useInView(tcS1Ref,  { once: true, margin: "-60px" });
  const tcS2InView  = useInView(tcS2Ref,  { once: true, margin: "-60px" });
  const tcS3InView  = useInView(tcS3Ref,  { once: true, margin: "-60px" });
  const tcS4InView  = useInView(tcS4Ref,  { once: true, margin: "-60px" });
  const tcS5InView  = useInView(tcS5Ref,  { once: true, margin: "-60px" });
  const tcS6InView  = useInView(tcS6Ref,  { once: true, margin: "-60px" });
  const tcS7InView  = useInView(tcS7Ref,  { once: true, margin: "-60px" });
  const tcS8InView  = useInView(tcS8Ref,  { once: true, margin: "-60px" });
  const tcS9InView  = useInView(tcS9Ref,  { once: true, margin: "-60px" });

  const ppS1InView  = useInView(ppS1Ref,  { once: true, margin: "-60px" });
  const ppS2InView  = useInView(ppS2Ref,  { once: true, margin: "-60px" });
  const ppS3InView  = useInView(ppS3Ref,  { once: true, margin: "-60px" });
  const ppS4InView  = useInView(ppS4Ref,  { once: true, margin: "-60px" });
  const ppS5InView  = useInView(ppS5Ref,  { once: true, margin: "-60px" });
  const ppS6InView  = useInView(ppS6Ref,  { once: true, margin: "-60px" });
  const ppS7InView  = useInView(ppS7Ref,  { once: true, margin: "-60px" });
  const ppS8InView  = useInView(ppS8Ref,  { once: true, margin: "-60px" });
  const ppS9InView  = useInView(ppS9Ref,  { once: true, margin: "-60px" });
  const ppS10InView = useInView(ppS10Ref, { once: true, margin: "-60px" });
  const ppS11InView = useInView(ppS11Ref, { once: true, margin: "-60px" });

  const marqueeItems = [
    "Terms & Conditions", "Privacy Policy", "Legal Agreement", "Data Security",
    "Sniper Systems",  "Chennai India", "B2B Solutions",
  ];

  const navSections = [
    // Terms & Conditions
    { id: "tc-1",  label: "Introduction & Scope",           part: "Terms & Conditions" },
    { id: "tc-2",  label: "Permitted Use",                  part: "Terms & Conditions" },
    { id: "tc-3",  label: "Intellectual Property",          part: "Terms & Conditions" },
    { id: "tc-4",  label: "Accuracy of Content",            part: "Terms & Conditions" },
    { id: "tc-5",  label: "Third-Party Links",              part: "Terms & Conditions" },
    { id: "tc-6",  label: "Limitation of Liability",        part: "Terms & Conditions" },
    { id: "tc-7",  label: "User Submissions",               part: "Terms & Conditions" },
    { id: "tc-8",  label: "Modifications",                  part: "Terms & Conditions" },

    // Privacy Policy
    { id: "pp-1",  label: "Information We Collect",         part: "Privacy Policy" },
    { id: "pp-2",  label: "How We Use Your Info",           part: "Privacy Policy" },
    { id: "pp-3",  label: "Cookies & Tracking",             part: "Privacy Policy" },
    { id: "pp-4",  label: "Sharing & Disclosure",           part: "Privacy Policy" },
    { id: "pp-5",  label: "Data Security",                  part: "Privacy Policy" },
    { id: "pp-6",  label: "Data Retention",                 part: "Privacy Policy" },
    { id: "pp-7",  label: "Your Rights",                    part: "Privacy Policy" },
    { id: "pp-8",  label: "Children's Privacy",             part: "Privacy Policy" },
    { id: "pp-9",  label: "Policy Updates",                 part: "Privacy Policy" },
    { id: "pp-10", label: "Contact Us",                     part: "Privacy Policy" },
  ];

  return (
    <Layout>
      {showWhiteScreen && <WhiteScreenTransition onComplete={() => setShowWhiteScreen(false)} />}

      {/* ── Hero Section ── */}
      <section className="relative bg-white pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 opacity-80" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16" ref={heroRef}>
            <h1
              ref={gsapHeroRef}
              className="text-4xl sm:text-6xl md:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
            >
              {["Terms", "&", "Privacy"].map((word, i) => (
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

            <motion.div
              className="flex flex-wrap justify-center gap-3 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 2.1 }}
            >

            </motion.div>
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
          <motion.div initial={{ opacity: 0, y: 40 }} animate={introInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease, delay: 0.1 }}>
            <SpringHeading trigger={introInView} delay={0.1} className="text-4xl sm:text-5xl md:text-6xl text-white mb-8">
              A legally binding<br />agreement — and a<br />foundational commitment.
            </SpringHeading>
          </motion.div>
          <motion.p
            className="text-base sm:text-xl text-gray-300 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={introInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.3 }}
          >
            This document constitutes a legally binding agreement between you and Sniper Systems and
            Solutions Pvt Ltd, governing your access to and use of our website, digital content, and
            associated services. It also provides a clear, transparent explanation of how we collect, use,
            store, and safeguard your information. By accessing our website, you agree to be fully bound
            by both parts of this document.
          </motion.p>
        </div>
      </motion.section>

      {/* ── Main Content ── */}
      <section className="bg-white py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-16">

            {/* Sticky side nav */}
            <div className="xl:col-span-2">
              <QuickNav sections={navSections} />
            </div>

            {/* Content */}
            <div className="xl:col-span-10">

              {/* ══ PART I: TERMS & CONDITIONS ══ */}
              <div ref={partTCRef}>
                <PartBanner
                  part="Part I"
                  title="Terms & Conditions"
                  subtitle="These Terms apply to all visitors, users, and B2B stakeholders who interact with our website or services, regardless of the nature or purpose of such interaction."
                  trigger={partTCInView}
                />
              </div>

              {/* TC-1: Introduction */}
              <div id="tc-1" ref={tcS1Ref}>
                <PolicySection icon={BookOpen} number="01" title="Introduction & Scope of Agreement" trigger={tcS1InView} index={0}>
                  <p>
                    Sniper Systems and Solutions Pvt Ltd operates exclusively in the business-to-business (B2B) domain,
                    providing security systems, surveillance solutions, and integrated technology offerings to corporate
                    clients, government entities, institutional buyers, and channel partners across India. All content
                    published on this website is directed at business professionals and organizational decision-makers,
                    and is intended for commercial evaluation and engagement purposes.
                  </p>
                  <p>
                    By accessing or continuing to use this website — whether for product inquiry, technical research,
                    partnership consideration, or general reference — you confirm that you have read, understood, and
                    agree to be fully bound by these Terms & Conditions and our accompanying Privacy Policy. If you do
                    not agree with any provision contained herein, you must immediately discontinue your use of this website.
                  </p>
                  <CalloutBox label="B2B Notice">
                    This website is designed for business and professional use only. Content, pricing information, and
                    service descriptions are subject to formal commercial agreements and do not constitute a binding offer
                    or quotation.
                  </CalloutBox>
                </PolicySection>
                <SectionDivider inView={tcS1InView} delay={0.4} />
              </div>

              {/* TC-2: Use */}
              <div id="tc-2" ref={tcS2Ref}>
                <PolicySection icon={FileText} number="02" title="Permitted Use of the Website" trigger={tcS2InView} index={1}>
                  <p>
                    Access to this website is granted strictly for lawful purposes aligned with business evaluation,
                    research, and commercial engagement with Sniper Systems and Solutions Pvt Ltd. As a condition of
                    your continued use, you warrant and agree that you will:
                  </p>
                  <PolicyList items={[
                    "Access and use the website exclusively for lawful business purposes, in full compliance with all applicable local, national, and international laws, regulations, and industry standards.",
                    "Refrain from any conduct that may damage, disrupt, impair, or compromise the functionality, security, or operational integrity of the website or its underlying infrastructure.",
                    "Not attempt to gain unauthorized access to any restricted area of the website, its servers, databases, or any connected network or system.",
                    "Not deploy automated tools, bots, web crawlers, or scraping mechanisms to extract content or data from this website without our prior express written consent.",
                    "Not use this platform to transmit unsolicited commercial messages, engage in fraudulent misrepresentation, or impersonate any individual or organization.",
                  ]} />
                  <p className="mt-4">
                    We reserve the right to suspend, restrict, or permanently terminate website access for any user
                    found to be in violation of these conditions, without prior notice and without prejudice to any
                    other rights or remedies available to us.
                  </p>
                </PolicySection>
                <SectionDivider inView={tcS2InView} delay={0.3} />
              </div>

              {/* TC-3: IP */}
              <div id="tc-3" ref={tcS3Ref}>
                <PolicySection icon={Shield} number="03" title="Intellectual Property Rights" trigger={tcS3InView} index={2}>
                  <p>
                    All content appearing on this website — including but not limited to text, graphics, logos, images,
                    icons, software, design layouts, and proprietary technology — is the exclusive intellectual property
                    of Sniper Systems and Solutions Pvt Ltd or its duly authorized licensors, protected under the
                    Copyright Act, 1957, the Trade Marks Act, 1999, and other relevant statutes of the Republic of India.
                  </p>
                  <p>
                    Authorized B2B partners and registered clients may reference publicly available product information
                    for internal evaluation, procurement decisions, or legitimate business correspondence with Sniper
                    Systems. Any use beyond this scope requires our express written authorization. You are expressly
                    prohibited from:
                  </p>
                  <PolicyList items={[
                    "Reproducing, copying, or duplicating any content from this website for commercial or public use.",
                    "Distributing, transmitting, or republishing any website content without prior written consent.",
                    "Modifying, adapting, or creating derivative works based on our proprietary content or technology.",
                    "Removing or altering any copyright, trademark, or other proprietary notices from the website.",
                  ]} />
                  <p className="mt-4 text-gray-500 text-sm">
                    Requests for content licensing or authorized reproduction may be directed to enquiry@sniperindia.com.
                  </p>
                </PolicySection>
                <SectionDivider inView={tcS3InView} delay={0.3} />
              </div>

              {/* TC-4: Accuracy */}
              <div id="tc-4" ref={tcS4Ref}>
                <PolicySection icon={Eye} number="04" title="Accuracy of Website Content" trigger={tcS4InView} index={3}>
                  <p>
                    Sniper Systems and Solutions Pvt Ltd exercises reasonable care to ensure that all information
                    published on this website is accurate, current, and complete at the time of publication. This
                    includes product specifications, solution descriptions, organizational information, and capability
                    statements presented for B2B engagement purposes.
                  </p>
                  <p>
                    However, we make no representations, warranties, or guarantees — express or implied — as to the
                    absolute accuracy, technical reliability, timeliness, or commercial completeness of any content
                    herein. Product specifications, availability, pricing structures, and service scope are subject to
                    change without prior notice. Business users are advised to formally verify all critical commercial
                    and technical details directly with our sales or technical team prior to initiating any procurement,
                    integration, or deployment decision.
                  </p>
                  <p>
                    This website is provided on an "as is" and "as available" basis without warranty of any kind.
                    Nothing published on this platform constitutes a binding quotation, formal tender response,
                    contractual commitment, or professional advisory of any nature.
                  </p>
                </PolicySection>
                <SectionDivider inView={tcS4InView} delay={0.3} />
              </div>

              {/* TC-5: Third-party links */}
              <div id="tc-5" ref={tcS5Ref}>
                <PolicySection icon={Globe} number="05" title="Third-Party Links" trigger={tcS5InView} index={4}>
                  <p>
                    For informational convenience, our website may include hyperlinks to external platforms — such as
                    technology partner websites, industry bodies, certification authorities, or regulatory portals —
                    that are operated independently of Sniper Systems and Solutions Pvt Ltd. These external sites are
                    maintained by their respective owners and are not under our control or editorial oversight.
                  </p>
                  <p>
                    The inclusion of any third-party link on our website does not imply our endorsement, affiliation,
                    or recommendation of the linked platform or its operators. We expressly disclaim all responsibility
                    for the accuracy, legality, data practices, and terms of engagement of such third-party websites.
                    We strongly encourage you to review the applicable terms and privacy policies of any external
                    platform before engaging with or submitting information to it.
                  </p>
                </PolicySection>
                <SectionDivider inView={tcS5InView} delay={0.3} />
              </div>

              {/* TC-6: Liability */}
              <div id="tc-6" ref={tcS6Ref}>
                <PolicySection icon={AlertTriangle} number="06" title="Limitation of Liability" trigger={tcS6InView} index={5}>
                  <p>
                    To the maximum extent permissible under applicable Indian law, Sniper Systems and Solutions Pvt Ltd,
                    its directors, officers, employees, agents, and affiliates shall not be held liable for any damages
                    — whether direct, indirect, incidental, special, consequential, or punitive — arising out of or in
                    connection with:
                  </p>
                  <PolicyList items={[
                    "Your access to, use of, or inability to use this website or its content.",
                    "Any errors, omissions, or inaccuracies in the information published on the website, including product or technical specifications.",
                    "Unauthorized access to or alteration of your data or transmissions.",
                    "Loss of business data, commercial opportunities, revenue, or operational continuity resulting from technical failures or system downtime.",
                    "Any conduct or content of third parties linked to or accessible through our website.",
                  ]} />
                  <p className="mt-4">
                    This limitation applies regardless of the legal theory under which the claim is brought — whether
                    in contract, tort, negligence, or strict liability — and shall remain operative even where we have
                    been advised of the possibility of such damages.
                  </p>
                </PolicySection>
                <SectionDivider inView={tcS6InView} delay={0.3} />
              </div>

              {/* TC-7: User Submissions */}
              <div id="tc-7" ref={tcS7Ref}>
                <PolicySection icon={MessageSquare} number="07" title="User Submissions & B2B Communications" trigger={tcS7InView} index={6}>
                  <p>
                    When you submit information to Sniper Systems through any communication channel on this website
                    — including contact forms, RFI submissions, partnership proposals, or direct email correspondence
                    — you represent and warrant that:
                  </p>
                  <PolicyList items={[
                    "All information provided is truthful, accurate, and current to the best of your knowledge.",
                    "You are duly authorized to submit the information on behalf of your organization, where applicable.",
                    "Your submission does not infringe upon the intellectual property rights, confidentiality obligations, or privacy rights of any third party.",
                    "The content of your submission does not contain unlawful, defamatory, fraudulent, obscene, or otherwise objectionable material.",
                  ]} />
                  <p className="mt-4">
                    We reserve the right to use information submitted for the purposes of responding to your inquiry,
                    facilitating B2B engagement, providing requested services, and improving our commercial and technical
                    offerings. All submitted information is handled in strict accordance with our Privacy Policy.
                  </p>
                  <CalloutBox label="B2B Engagement">
                    Submitting a contact form or inquiry does not constitute a binding commercial agreement. All
                    engagements are formalized through written proposals, purchase orders, or executed service agreements.
                  </CalloutBox>
                </PolicySection>
                <SectionDivider inView={tcS7InView} delay={0.3} />
              </div>

              {/* TC-8: Modifications */}
              <div id="tc-8" ref={tcS8Ref}>
                <PolicySection icon={RefreshCw} number="08" title="Modifications to These Terms" trigger={tcS8InView} index={7}>
                  <p>
                    Sniper Systems and Solutions Pvt Ltd reserves the right, at its sole discretion, to amend, revise,
                    or replace these Terms & Conditions at any time and without prior notice. All modifications will be
                    effective immediately upon being posted to this page, and the "Last Updated" date will be revised
                    accordingly.
                  </p>
                  <p>
                    It is your responsibility to review these Terms periodically to remain informed of any changes that
                    may affect your rights or obligations. Your continued use of this website following the publication
                    of revised Terms constitutes your unqualified acceptance of and agreement to those changes. If you
                    do not agree with the revised Terms, you should cease use of the website immediately.
                  </p>
                </PolicySection>
                <SectionDivider inView={tcS8InView} delay={0.3} />
              </div>

              {/* TC-9: Governing Law
              <div id="tc-9" ref={tcS9Ref}>
                <PolicySection icon={Gavel} number="09" title="" trigger={tcS9InView} index={8}>
                  <p>
                    These Terms & Conditions shall be construed, interpreted, and governed exclusively in accordance
                    with the laws of the Republic of India, without regard to its conflict of law principles.
                  </p>
                  <p>
                    Any dispute, controversy, or claim arising out of or in connection with these Terms — including
                    any question regarding their existence, validity, breach, interpretation, or termination — shall
                    be subject to the exclusive jurisdiction of the competent courts located in Chennai, Tamil Nadu,
                    India. By using this website, you irrevocably submit to the personal jurisdiction of such courts
                    and waive any objection to the exercise of jurisdiction over you by such courts.
                  </p>
                  <CalloutBox label="Dispute Resolution">
                    Before initiating formal legal proceedings, both parties agree to make a genuine effort to resolve
                    disputes amicably through direct written communication with our designated legal or compliance
                    contact at enquiry@sniperindia.com.
                  </CalloutBox>
                </PolicySection>
              </div>*/}

              {/* ══ PART II: PRIVACY POLICY ══ */}
              <div ref={partPPRef}>
                <PartBanner
                  part="Part II"
                  title="Privacy Policy"
                  subtitle="At Sniper Systems and Solutions Pvt Ltd, your privacy is not an afterthought. This Policy is designed to give you a clear, transparent understanding of how we collect, use, store, and safeguard your personal information."
                  trigger={partPPInView}
                />
              </div>

              {/* PP-1: Collection */}
              <div id="pp-1" ref={ppS1Ref}>
                <PolicySection icon={FileText} number="10" title="Information We Collect" trigger={ppS1InView} index={0}>
                  <p>
                    We collect only the information necessary to deliver our B2B services effectively, respond to
                    commercial inquiries, and improve the experience of business professionals interacting with our
                    platform. The categories of information we may gather include:
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900 mt-4 mb-2">Personal and Professional Information</p>
                    <p>
                      This encompasses identifying information relating to you and your organization that is voluntarily
                      submitted or collected in the course of B2B engagement. It may include, but is not limited to:
                    </p>
                    <PolicyList items={[
                      "Full name, professional email address, and direct telephone number.",
                      "Company name, industry, job title, and departmental role.",
                      "Mailing address, registered office address, or project site details.",
                      "Nature of inquiry, procurement requirements, or partnership interest as expressed in your correspondence.",
                      "Any other details you voluntarily provide via contact forms, RFI submissions, or direct written communications.",
                    ]} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mt-6 mb-2">Technical and Usage Information</p>
                    <p>
                      When you visit our website, certain information is automatically recorded by our systems to support
                      performance monitoring, security management, and user experience optimization. This includes:
                    </p>
                    <PolicyList items={[
                      "IP address and approximate geographic location (country or region level).",
                      "Browser type, version, and operating system in use.",
                      "Device type, screen resolution, and connection parameters.",
                      "Pages visited, content accessed, time spent on each section, and navigation paths within our website.",
                      "Date, time, and duration of each visit, along with referral source.",
                    ]} />
                    <p className="mt-4 text-gray-500 text-sm">
                      Technical and usage data is primarily analyzed in aggregate form and does not typically identify
                      you as a specific individual.
                    </p>
                  </div>
                </PolicySection>
                <SectionDivider inView={ppS1InView} delay={0.4} />
              </div>

              {/* PP-2: Use */}
              <div id="pp-2" ref={ppS2Ref}>
                <PolicySection icon={Eye} number="11" title="How We Use Your Information" trigger={ppS2InView} index={1}>
                  <p>
                    The information we collect serves specific, legitimate, and proportionate purposes aligned with
                    our B2B operations. We do not use your data for any purpose that is incompatible with the context
                    in which it was originally collected. Our primary uses include:
                  </p>
                  <PolicyList items={[
                    "Responding promptly and accurately to your business inquiries, technical questions, or service requests.",
                    "Providing detailed information about our security products, integrated solutions, and deployment capabilities to facilitate informed procurement decisions.",
                    "Enhancing the functionality, usability, performance, and content relevance of our website for B2B users.",
                    "Sending relevant professional communications, including service updates, product announcements, policy revisions, or event invitations where you have provided consent.",
                    "Maintaining the security, operational integrity, and continuity of our digital systems and client-facing infrastructure.",
                    "Fulfilling applicable legal, regulatory, audit, or contractual obligations that govern our business operations in India.",
                  ]} />
                  <p className="mt-4">
                    We do not use personal information for automated profiling, algorithmic decision-making, or any
                    form of unsolicited consumer marketing. All outreach is B2B-oriented and directed at organizational
                    contacts who have engaged with us or expressed commercial interest.
                  </p>
                </PolicySection>
                <SectionDivider inView={ppS2InView} delay={0.3} />
              </div>

              {/* PP-3: Cookies */}
              <div id="pp-3" ref={ppS3Ref}>
                <PolicySection icon={Cookie} number="12" title="Cookies and Tracking Technologies" trigger={ppS3InView} index={2}>
                  <p>
                    Our website may utilize cookies — small data files stored on your browser or device — along with
                    similar tracking technologies such as web beacons and session tokens, to deliver a seamless
                    browsing experience and to understand how business visitors interact with our content. Cookies
                    serve several functional and analytical purposes, including:
                  </p>
                  <PolicyList items={[
                    "Retaining your browsing preferences and session state across page visits for a more coherent experience.",
                    "Analyzing traffic patterns, page engagement, and content performance to guide ongoing improvements to our platform.",
                    "Supporting essential website functionality, form submission integrity, and secure session management.",
                  ]} />
                  <p className="mt-4">
                    You retain full control over cookie usage at all times. Your browser settings may be configured
                    to decline, restrict, or delete cookies. Please note that disabling certain categories of cookies
                    may affect the functionality of specific features on our website, including form submissions and
                    session continuity.
                  </p>
                </PolicySection>
                <SectionDivider inView={ppS3InView} delay={0.3} />
              </div>

              {/* PP-4: Sharing */}
              <div id="pp-4" ref={ppS4Ref}>
                <PolicySection icon={Users} number="13" title="Sharing and Disclosure of Information" trigger={ppS4InView} index={3}>
                  <p>
                    Sniper Systems and Solutions Pvt Ltd operates on a strict policy of not selling, renting, leasing,
                    or trading your personal information to third parties for commercial purposes. We treat all client
                    and partner data with the highest degree of confidentiality, consistent with our obligations as a
                    B2B technology provider. We may disclose information in the following limited circumstances:
                  </p>
                  <PolicyList items={[
                    "With vetted, trusted technology service providers or operational support vendors engaged to maintain our website and deliver our services — each contractually bound by confidentiality obligations no less stringent than our own.",
                    "When required to comply with applicable law, legal process, court order, or regulatory authority of competent jurisdiction in India.",
                    "To protect and defend the legitimate rights, intellectual assets, contractual interests, or physical safety of Sniper Systems, our B2B clients, employees, or authorized representatives.",
                  ]} />
                  <p className="mt-4">
                    In all cases, we ensure that any such sharing is proportionate to its stated purpose, limited to
                    what is strictly necessary, and carried out with appropriate contractual and technical safeguards.
                  </p>
                </PolicySection>
                <SectionDivider inView={ppS4InView} delay={0.3} />
              </div>

              {/* PP-5: Security */}
              <div id="pp-5" ref={ppS5Ref}>
                <PolicySection icon={Shield} number="14" title="Data Security" trigger={ppS5InView} index={4}>
                  <p>
                    We implement robust, multi-layered technical and organizational security measures designed to
                    protect your personal and business information from unauthorized access, inadvertent disclosure,
                    unlawful alteration, or accidental loss. Our security practices are reviewed and updated on a
                    continuous basis to remain aligned with prevailing industry standards and applicable data
                    protection frameworks in India.
                  </p>
                  <p>
                    Security measures applied to your data include access controls, encryption protocols where
                    appropriate, system monitoring, and internal data handling procedures that restrict access to
                    authorized personnel only. Our teams are trained to handle B2B client information with discretion
                    and in accordance with documented data governance policies.
                  </p>
                  <p>
                    That said, no method of data transmission over the Internet, nor any electronic storage mechanism,
                    can be unconditionally guaranteed to be impenetrable against all forms of threat. While we take
                    every reasonable and commercially practicable precaution, we encourage all business users to
                    exercise appropriate care when sharing sensitive organizational information through digital channels.
                  </p>
                </PolicySection>
                <SectionDivider inView={ppS5InView} delay={0.3} />
              </div>

              {/* PP-6: Retention */}
              <div id="pp-6" ref={ppS6Ref}>
                <PolicySection icon={Trash2} number="15" title="Data Retention" trigger={ppS6InView} index={5}>
                  <p>
                    We retain your personal and organizational information only for as long as is reasonably necessary
                    to fulfil the purposes for which it was originally collected. This includes the provision of
                    services, management of B2B relationships, compliance with statutory accounting and audit
                    obligations, resolution of commercial disputes, and enforcement of contractual rights.
                  </p>
                  <p>
                    The specific retention periods applied to different categories of data are determined by reference
                    to the nature of the information, the purpose for which it was collected, applicable legal
                    requirements, and the duration of our commercial relationship with your organization. Once data
                    is no longer required for any legitimate purpose, it is securely deleted, anonymized, or archived
                    in accordance with applicable regulations and our internal data lifecycle policies.
                  </p>
                </PolicySection>
                <SectionDivider inView={ppS6InView} delay={0.3} />
              </div>

              {/* PP-7: Rights */}
              <div id="pp-7" ref={ppS7Ref}>
                <PolicySection icon={UserCheck} number="16" title="Your Rights and Choices" trigger={ppS7InView} index={6}>
                  <p>
                    Depending on your jurisdiction and applicable data protection legislation — including but not
                    limited to the Information Technology Act, 2000, its associated rules, and any subsequent
                    legislative framework enacted in India — you may be entitled to exercise certain rights with
                    respect to the personal information we hold about you. These rights may include:
                  </p>
                  <PolicyList items={[
                    "The right to access a clear and structured copy of the personal data we have collected about you in connection with your use of our website or services.",
                    "The right to request correction of any personal information found to be inaccurate, incomplete, or no longer current.",
                    "The right to request erasure or restriction of your personal data, subject to applicable legal, contractual, or regulatory limitations that may necessitate its continued retention.",
                    "The right to withdraw your consent for specific uses of your information at any time, without affecting the lawfulness of any processing that took place prior to such withdrawal.",
                  ]} />
                  <p className="mt-4">
                    To exercise any of the above rights, please reach out to us through the contact details provided
                    at the end of this Policy. We are committed to acknowledging your request in a timely manner and
                    to responding in a transparent, fair, and legally compliant way.
                  </p>
                </PolicySection>
                <SectionDivider inView={ppS7InView} delay={0.3} />
              </div>

              {/* PP-8: Children */}
              <div id="pp-8" ref={ppS8Ref}>
                <PolicySection icon={Lock} number="17" title="Children's Privacy" trigger={ppS8InView} index={7}>
                  <p>
                    This website and the services we offer are intended exclusively for adults, business professionals,
                    and authorized organizational representatives. We do not knowingly solicit, collect, or process
                    personal information from individuals under the age of 18, nor is our website designed to attract
                    or serve minors in any capacity.
                  </p>
                  <p>
                    Should we discover that personal data has been inadvertently collected from a minor without
                    verifiable parental or guardian consent, we will promptly take appropriate technical and
                    administrative measures to remove such information from our systems and to prevent any further
                    processing.
                  </p>
                </PolicySection>
                <SectionDivider inView={ppS8InView} delay={0.3} />
              </div>

              {/* PP-9: Updates */}
              <div id="pp-9" ref={ppS9Ref}>
                <PolicySection icon={RefreshCw} number="18" title="Updates to This Privacy Policy" trigger={ppS9InView} index={8}>
                  <p>
                    As our services evolve, our technology partnerships expand, and the regulatory landscape governing
                    data protection in India continues to develop, we may update this Privacy Policy periodically to
                    reflect those changes. All revisions will be published on this page, with the "Last Updated" date
                    revised accordingly.
                  </p>
                  <p>
                    We encourage all B2B users and organizational contacts to review this Policy on a regular basis
                    in order to remain fully informed of how we protect and process your information. Continued use
                    of our website following any published update constitutes your acceptance of the revised Policy.
                    Where changes are material in nature, we will make reasonable efforts to bring them to your
                    attention through prominent website notification.
                  </p>
                </PolicySection>
                <SectionDivider inView={ppS9InView} delay={0.3} />
              </div>

              {/* PP-10: Contact */}
              <div id="pp-10" ref={ppS10Ref}>
                <PolicySection icon={Mail} number="19" title="Contact Us" trigger={ppS10InView} index={9}>
                  <p>
                    If you have questions, concerns, legal inquiries, or requests relating to these Terms & Conditions,
                    our Privacy Policy, or our data handling practices more broadly, we welcome you to reach out through
                    the contact details below. Our team is committed to addressing all queries with due diligence,
                    professionalism, and transparency.
                  </p>
                  <motion.div
                    className="mt-8 p-6 sm:p-8 bg-gray-50 rounded-2xl sm:rounded-3xl border border-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={ppS10InView ? { opacity: 1, y: 0 } : {}}
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
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-700">Chennai, Tamil Nadu, India</span>
                      </div>
                    </div>
                  </motion.div>
                </PolicySection>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Marquee bottom */}
      <MarqueeTicker items={["Legal Agreement",  "Chennai India", "Intellectual Property", "Sniper Systems", "User Policy", "Liability", "B2B Integrity"]} />

      {/* ── Core Commitments (black section) ── */}
      <CommitmentsSection />

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

export default TermsAndPrivacy;
