import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Building2, Car, Film, Glasses, GraduationCap, Heart, Landmark, Monitor } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.16, 1, 0.3, 1] as const;

// ========================================================
// WHITE SCREEN TRANSITION
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
// SPRING BADGE
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
// GSAP MARQUEE TICKER
// ========================================================
const MarqueeTicker = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const totalWidth = track.scrollWidth / 2;
    const tween = gsap.to(track, { x: `-${totalWidth}px`, duration: 26, ease: "none", repeat: -1 });
    return () => tween.kill();
  }, []);

  const items = [
    "AEC", "Media & Entertainment", "AR / VR / MR / XR",
    "Government", "IT & ITES", "Healthcare & Pharma",
    "Manufacturing", "Automotive", "Education",
  ];
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden bg-gray-950 py-4 sm:py-5 border-y border-gray-800">
      <div ref={trackRef} className="flex gap-8 sm:gap-12 whitespace-nowrap will-change-transform">
        {doubled.map((text, i) => (
          <span key={i} className="flex items-center gap-8 sm:gap-12 text-xs sm:text-sm font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-gray-400">
            {text}
            <span className="w-1.5 h-1.5 rounded-full bg-gray-600 inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
};

// ========================================================
// GSAP PARALLAX IMAGE
// ========================================================
const ParallaxImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;
    const tween = gsap.fromTo(img, { yPercent: -8 }, {
      yPercent: 8, ease: "none",
      scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);
  return (
    <div ref={wrapRef} className={`overflow-hidden ${className ?? ""}`}>
      <img ref={imgRef} src={src} alt={alt} className="w-full h-full object-cover scale-110 will-change-transform" />
    </div>
  );
};

// ========================================================
// INDUSTRY CARD — full-bleed image with overlay
// ========================================================
interface IndustryCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  to: string;
  index: number;
  trigger: boolean;
  accent: string;
  img: string;
  tag: string;
}

const IndustryCard = ({ icon: Icon, title, description, to, index, trigger, accent, img, tag }: IndustryCardProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer group"
      style={{ height: index === 0 ? "480px" : "340px" }}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={trigger ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.97 }}
      transition={{ duration: 0.7, ease, delay: 0.08 + index * 0.07 }}
      whileHover={{ y: -6, boxShadow: "0 32px 64px rgba(0,0,0,0.18)" }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <a href={to} className="absolute inset-0 z-20" aria-label={title} />

      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={img}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${hovered ? "scale-110" : "scale-105"}`}
        />
      </div>

      {/* Gradient overlay */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${hovered ? "opacity-80" : "opacity-60"}`}
        style={{ background: `linear-gradient(to top, ${accent}ee 0%, ${accent}44 45%, transparent 100%)` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      {/* Tag pill top-left */}
      <div className="absolute top-4 left-4 z-10">
        <span className="inline-block text-white uppercase tracking-widest px-3 py-1 rounded-full"
          style={{ fontSize: "9px", fontWeight: 700, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)" }}>
          {tag}
        </span>
      </div>

      {/* Arrow top-right */}
      <motion.div
        className="absolute top-4 right-4 z-10"
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
        transition={{ duration: 0.25 }}
      >
        <div className="flex items-center justify-center rounded-full w-9 h-9"
          style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.25)" }}>
          <ArrowRight className="w-4 h-4 text-white -rotate-45" />
        </div>
      </motion.div>

      {/* Content bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
        <motion.div
          className="flex items-center gap-3 mb-3"
          animate={{ y: hovered ? -4 : 0 }}
          transition={{ duration: 0.35, ease }}
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)" }}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <h3 className={`text-white font-semibold leading-tight ${index === 0 ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"}`}>
            {title}
          </h3>
        </motion.div>
        <motion.p
          className="text-gray-200 text-sm leading-relaxed"
          animate={{ opacity: hovered ? 1 : 0.7, y: hovered ? 0 : 4 }}
          transition={{ duration: 0.35, ease }}
          style={{ fontSize: index === 0 ? "15px" : "13px" }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
};

// ========================================================
// PROCESS STEP ROW (dark section)
// ========================================================
const IndustryRow = ({
  icon: Icon, title, description, index, trigger, accent, to
}: {
  icon: React.ElementType; title: string; description: string;
  index: number; trigger: boolean; accent: string; to: string;
}) => {
  const linesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trigger || !linesRef.current) return;
    gsap.fromTo(linesRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 0.9, ease: "power3.out", delay: 0.3 + index * 0.1 }
    );
  }, [trigger, index]);

  return (
    <motion.div
      className="relative pb-6 last:pb-0"
      initial={{ opacity: 0, y: 24 }}
      animate={trigger ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.65, ease, delay: 0.15 + index * 0.08 }}
    >
      <a href={to} className="group block py-2">
        <div className="grid grid-cols-12 gap-4 sm:gap-8 items-center">
          <div className="col-span-1">
            <span className="text-xs font-semibold tracking-[0.15em] text-gray-600 uppercase">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1 flex justify-start">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300"
              style={{ background: `${accent}20` }}>
              <Icon className="w-4 h-4 transition-colors duration-300" style={{ color: accent }} />
            </div>
          </div>
          <div className="col-span-7 sm:col-span-4">
            <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-gray-300 transition-colors duration-300 leading-tight">
              {title}
            </h3>
          </div>
          <div className="hidden sm:block col-span-5">
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{description}</p>
          </div>
          <div className="col-span-2 sm:col-span-1 flex justify-end">
            <motion.div
              className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center group-hover:border-white group-hover:bg-white transition-all duration-300"
              whileHover={{ scale: 1.1 }}
            >
              <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-black -rotate-45 transition-colors duration-300" />
            </motion.div>
          </div>
        </div>
      </a>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-800 overflow-hidden">
        <div ref={linesRef} className="h-full bg-gradient-to-r from-gray-600/40 via-gray-500/70 to-gray-600/40" style={{ transform: "scaleX(0)" }} />
      </div>
    </motion.div>
  );
};

// ========================================================
// ORBITAL RINGS
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
// CTA SECTION
// ========================================================
const CTASection = () => {
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });
  const btnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
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
  }, []);

  return (
    <motion.section
      ref={ctaRef}
      className="relative bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12 overflow-hidden"
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
        <motion.div className="mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 40 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease, delay: 0.2 }}>
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold mb-6 leading-tight text-white">
            Your industry,<br />our expertise.
          </h2>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.4 }}>
          <a
            ref={btnRef as any}
            href="/contact"
            className="inline-flex items-center px-8 sm:px-12 py-3 sm:py-4 border-2 border-white rounded-full text-white font-medium text-base sm:text-lg hover:bg-white hover:text-black transition-colors duration-300 relative z-10 will-change-transform"
          >
            GET IN TOUCH
            <span className="absolute inset-[-10px] rounded-full" />
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
};

// ========================================================
// MAIN INDUSTRIES PAGE
// ========================================================
const Industries = () => {
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // GSAP hero word-stagger
  const gsapHeroRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = gsapHeroRef.current;
    if (!el) return;
    const words = el.querySelectorAll(".gsap-word");
    gsap.fromTo(words,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.08, delay: 1.4 }
    );
  }, []);

  const industries = [
    {
      icon: Building2,
      title: "AEC",
      description: "Architecture, Engineering & Construction — precision IT for project-centric teams.",
      to: "/industries/aec",
      accent: "#ffffff",
      img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
      tag: "Architecture · Engineering · Construction",
    },
    {
      icon: Film,
      title: "Media & Entertainment",
      description: "High-performance infrastructure for studios, post-production, and broadcast.",
      to: "/industries/media-and-entertainment",
      accent: "#ffffff",
      img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&q=80",
      tag: "Studios · Broadcast · Post-Production",
    },
    {
      icon: Glasses,
      title: "AR / VR / MR / XR",
      description: "Cutting-edge extended reality environments for immersive enterprise applications.",
      to: "/industries/ar-vr-mr-xr",
      accent: "#ffffff",
      img: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=1200&q=80",
      tag: "Immersive · Extended Reality",
    },
    {
      icon: Landmark,
      title: "Government",
      description: "Secure, compliant, and resilient IT solutions for public sector organisations.",
      to: "/industries/government",
      accent: "#ffffff",
      img: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1200&q=80",
      tag: "Public Sector · Compliance",
    },
    {
      icon: Monitor,
      title: "IT & ITES Infrastructure",
      description: "Robust backbone infrastructure built for technology companies and service providers.",
      to: "/industries/it-ites-infra",
      accent: "#ffffff",
      img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
      tag: "IT · ITES · Data Centres",
    },
    {
      icon: Heart,
      title: "Healthcare & Pharma",
      description: "HIPAA-aligned, mission-critical IT for hospitals, labs, and pharmaceutical enterprises.",
      to: "/industries/healthcare-pharma",
      accent: "#ffffff",
      img: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=1200&q=80",
      tag: "Hospitals · Pharma · Labs",
    },
    {
      icon: Car,
      title: "Manufacturing & Automotive",
      description: "Smart factory, IoT, and supply-chain IT for modern manufacturing floors.",
      to: "/industries/manufacturing-automotive",
      accent: "#ffffff",
      img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80",
      tag: "Manufacturing · Automotive · IoT",
    },
    {
      icon: GraduationCap,
      title: "Education",
      description: "Digital learning ecosystems, campus networking, and EdTech infrastructure.",
      to: "/industries/education",
      accent: "#ffffff",
      img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
      tag: "K-12 · Higher Education · EdTech",
    },
  ];

  const badgeLabels = ["AEC", "Media", "AR/VR/XR", "Government", "IT & ITES", "Healthcare", "Manufacturing", "Education"];

  const heroRef   = useRef(null);
  const gridRef   = useRef(null);
  const listRef   = useRef(null);
  const featRef   = useRef(null);

  const heroInView  = useInView(heroRef,  { once: true, margin: "-60px" });
  const gridInView  = useInView(gridRef,  { once: true, margin: "-80px" });
  const listInView  = useInView(listRef,  { once: true, margin: "-60px" });
  const featInView  = useInView(featRef,  { once: true, margin: "-60px" });

  return (
    <Layout>
      {showWhiteScreen && <WhiteScreenTransition onComplete={() => setShowWhiteScreen(false)} />}

      {/* ── Hero ── */}
      <section className="relative bg-white pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-white opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16" ref={heroRef}>

            <h1
              ref={gsapHeroRef}
              className="text-4xl sm:text-6xl md:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight font-sans"
            >
              {["Industries", "We", "Serve"].map((word, i) => (
                <span key={i} className="gsap-word inline-block opacity-0 mr-[0.25em] last:mr-0" style={{ overflow: "visible" }}>
                  {word}
                  {word === "We" ? <br /> : null}
                </span>
              ))}
            </h1>

            <motion.p
              className="text-base sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0 mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 1.9 }}
            >
              From construction sites to operating theatres, from government corridors to creative studios —
              we bring deep domain knowledge and proven IT solutions to every industry we serve.
            </motion.p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {badgeLabels.map((label, i) => (
                <motion.span key={label}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 2.1 + i * 0.08 }}>
                  <SpringBadge>{label}</SpringBadge>
                </motion.span>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div className="max-w-6xl mx-auto pt-8 sm:pt-12">
            <motion.div
              className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden h-60 sm:h-96 md:h-[500px] lg:h-[600px]"
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 1, ease, delay: 0.25 }}
              whileHover={{ scale: 1.01 }}
            >
              <ParallaxImage
                src="https://i.postimg.cc/yYRxC2Tb/future.jpg"
                alt="Industries We Serve"
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              {/* Floating label */}
              <motion.div
                className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: 1.2 }}
              >
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5">

                  <span className="text-white text-xs font-bold tracking-[0.15em] uppercase">Industry</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GSAP Marquee */}
      <MarqueeTicker />

      {/* ── Intro copy ── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-start">
            <motion.h2
              className="text-4xl sm:text-6xl md:text-7xl font-semibold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease }}
            >
              Deep domain.<br />Proven<br />delivery.
            </motion.h2>
            <motion.div
              className="space-y-5 sm:space-y-6 pt-2 sm:pt-4"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease, delay: 0.15 }}
            >
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Every industry runs on different rhythms, compliance demands, and technology expectations.
                Generic IT doesn't cut it. Sniper Systems brings sector-specific expertise, implementation
                frameworks, and support models fine-tuned for your vertical.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                With 20+ years serving enterprises across India's most demanding sectors, we understand
                not just the technology — but the operational context it must serve.
              </p>
              <motion.div whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
                <a href="/contact"
                  className="inline-flex items-center gap-3 text-gray-900 font-semibold text-base sm:text-lg border-b-2 border-gray-900 pb-0.5 hover:gap-5 transition-all duration-300">
                  Discuss your industry <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* ── Dark list section ── */}
      <motion.section
        ref={listRef}
        className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12"
        initial={{ opacity: 0, y: 60 }}
        animate={listInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div className="mb-10 sm:mb-14"
            initial={{ opacity: 0, y: 40 }} animate={listInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.1 }}>
            <motion.h2
              className="text-4xl sm:text-6xl md:text-7xl font-semibold text-white leading-tight"
              initial={{ opacity: 0, y: 60 }}
              animate={listInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
            >
              Quick access —<br />All verticals
            </motion.h2>
          </motion.div>

          <div className="space-y-0">
            {industries.map((ind, index) => (
              <IndustryRow
                key={ind.to}
                icon={ind.icon}
                title={ind.title}
                description={ind.description}
                to={ind.to}
                index={index}
                trigger={listInView}
                accent={ind.accent}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Feature split — dark with image ── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6" ref={featRef}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <motion.div
              className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-64 sm:h-80 lg:h-[500px]"
              initial={{ opacity: 0, x: -40 }}
              animate={featInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease }}
              whileHover={{ scale: 1.02 }}
            >
              <ParallaxImage
                src="https://i.postimg.cc/SNscK4VY/37220.jpg"
                alt="Cross-industry expertise"
                className="w-full h-full rounded-2xl sm:rounded-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </motion.div>

            <div>
              <motion.p
                className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-5"
                initial={{ opacity: 0 }}
                animate={featInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, ease, delay: 0.1 }}
              >
                Cross-Industry Strength
              </motion.p>
              <motion.h2
                className="text-4xl sm:text-5xl md:text-6xl font-semibold text-gray-900 leading-tight mb-6 sm:mb-8"
                initial={{ opacity: 0, y: 40 }}
                animate={featInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease, delay: 0.15 }}
              >
                Sector-smart<br />solutions that<br />scale with you.
              </motion.h2>
              <motion.p
                className="text-base sm:text-lg text-gray-700 leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={featInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: 0.25 }}
              >
                Our cross-industry experience means we bring transferable best practices, battle-tested
                frameworks, and benchmark insights from every vertical we serve — delivering compounding
                value as your technology partner.
              </motion.p>
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={featInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: 0.35 }}
              >
                {[
                  "Compliance-ready for regulated industries",
                  "Sector-specific SLAs and support models",
                  "Certified specialists per vertical",
                  "Trusted by enterprises worldwide",
                ].map((item, i) => (
                  <motion.div key={i}
                    className="flex items-center gap-3 text-gray-700 text-sm sm:text-base"
                    initial={{ opacity: 0, x: -20 }}
                    animate={featInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, ease, delay: 0.4 + i * 0.07 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 flex-shrink-0" />
                    {item}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
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

export default Industries;
