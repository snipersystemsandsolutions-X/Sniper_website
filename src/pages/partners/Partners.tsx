import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Award, LayoutGrid, Handshake } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

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
    const tween = gsap.to(track, { x: `-${totalWidth}px`, duration: 28, ease: "none", repeat: -1 });
    return () => tween.kill();
  }, []);

  const items = [
    "Apple", "Lenovo", "Microsoft", "NVIDIA", "Autodesk",
    "Unreal Engine", "Cisco", "Unity", "Adobe", "Dell",
    "HP", "AWS", "Samsung", "Google", "Logitech",
  ];
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden bg-gray-950 py-4 sm:py-5 my-0 border-y border-gray-800">
      <div ref={trackRef} className="flex gap-8 sm:gap-12 whitespace-nowrap will-change-transform">
        {doubled.map((text, i) => (
          <span
            key={i}
            className="flex items-center gap-8 sm:gap-12 text-xs sm:text-sm font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-gray-400"
          >
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
    const tween = gsap.fromTo(
      img,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className ?? ""}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover scale-110 will-change-transform"
      />
    </div>
  );
};

// ========================================================
// STAT CARD
// ========================================================
const SpringStatCard = ({
  number, label, index, trigger,
}: { number: string; label: string; index: number; trigger: boolean }) => (
  <motion.div
    className="text-center py-8 sm:py-10 border-r border-gray-200 last:border-0"
    initial={{ opacity: 0, y: 40 }}
    animate={trigger ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
    transition={{ duration: 0.7, ease, delay: 0.2 + index * 0.1 }}
    whileHover={{ y: -6 }}
  >
    <div className="text-4xl sm:text-5xl md:text-6xl font-semibold text-gray-900 mb-2">{number}</div>
    <p className="text-gray-500 text-sm sm:text-base uppercase tracking-wider font-medium">{label}</p>
  </motion.div>
);

// ========================================================
// LOGO CARD
// ========================================================
interface LogoCardProps {
  name: string;
  logo: string;
  w: number;
  h: number;
  index: number;
  trigger: boolean;
}

const LogoCard = ({ name, logo, w, h, index, trigger }: LogoCardProps) => (
  <motion.div
    className="group relative flex items-center justify-center border border-gray-100 rounded-2xl bg-white hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-default overflow-hidden"
    style={{ padding: "clamp(20px, 4vw, 36px)" }}
    initial={{ opacity: 0, y: 30, scale: 0.96 }}
    animate={trigger ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.96 }}
    transition={{ duration: 0.55, ease, delay: 0.05 + (index % 8) * 0.045 }}
    whileHover={{ y: -4, scale: 1.03 }}
  >
    {/* subtle hover bg */}
    <motion.div
      className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
    />
    <img
      src={logo}
      alt={name}
      style={{ width: Math.min(w, 120), height: Math.min(h, 56), objectFit: "contain" }}
      className="relative z-10 grayscale group-hover:grayscale-0 transition-all duration-500"
      loading="lazy"
    />
  </motion.div>
);

// ========================================================
// CATEGORY SECTION
// ========================================================
interface CategoryProps {
  label: string;
  partners: { name: string; logo: string; w: number; h: number }[];
  index: number;
}

const CategorySection = ({ label, partners, index }: CategoryProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="mb-16 sm:mb-20">
      <motion.div
        className="flex items-center gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease, delay: 0.05 }}
      >
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">{label}</span>
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">{partners.length} Partners</span>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {partners.map((p, i) => (
          <LogoCard key={p.name} {...p} index={i} trigger={inView} />
        ))}
      </div>
    </div>
  );
};

// ========================================================
// ORBITAL RINGS (reused from Solutions)
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
        <motion.div
          className="mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
        >
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold mb-6 leading-tight text-white">
            Ready to<br />get started<br />with us?
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.4 }}
        >
          <a
            ref={btnRef as any}
            href="/contact"
            className="inline-flex items-center px-8 sm:px-12 py-3 sm:py-4 border-2 border-white rounded-full text-white font-medium text-base sm:text-lg hover:bg-white hover:text-black transition-colors duration-300 relative z-10 will-change-transform"
          >
            CONTACT US
            <span className="absolute inset-[-10px] rounded-full" />
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
};

// ========================================================
// PARTNER DATA
// ========================================================
const allPartners = [
  { name: "Apple",       logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",                                                    w: 108, h: 38 },
  { name: "Lenovo",      logo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Lenovo_%282015%29.svg",                                                   w: 98,  h: 38 },
  { name: "Microsoft",   logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",                                           w: 108, h: 28 },
  { name: "NVIDIA",      logo: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg",                                                         w: 108, h: 28 },
  { name: "Autodesk",    logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/Autodesk_Logo_2021.svg",                                                  w: 108, h: 48 },
  { name: "Unreal",      logo: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Unreal_Engine_Logo_%28new_typeface%29.svg",                               w: 118, h: 58 },
  { name: "Cisco",       logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg",                                                w: 108, h: 38 },
  { name: "Unity",       logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Unity_Technologies_logo.svg/1280px-Unity_Technologies_logo.svg.png", w: 108, h: 38 },
  { name: "Adobe",       logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Adobe_Corporate_wordmark.svg",                                            w: 108, h: 28 },
  { name: "Dell",        logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg",                                                      w: 108, h: 58 },
  { name: "HP",          logo: "https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg",                                                        w: 108, h: 58 },
  { name: "AWS",         logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",                                            w: 108, h: 48 },
  { name: "Samsung",     logo: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Samsung_Black_icon.svg",                                                  w: 108, h: 28 },
  { name: "Acer",        logo: "https://upload.wikimedia.org/wikipedia/commons/0/00/Acer_2011.svg",                                                           w: 108, h: 28 },
  { name: "Asus",        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg",                                                           w: 108, h: 25 },
  { name: "Google",      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",                                                    w: 108, h: 38 },
  { name: "Supermicro",  logo: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Super_Micro_Computer_Logo.svg",                                           w: 108, h: 40 },
  { name: "Yubico",      logo: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Yubico_logo.svg",                                                         w: 108, h: 25 },
  { name: "Poly",        logo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Poly_Inc._Logo.svg",                                                      w: 108, h: 38 },
  { name: "Epos",        logo: "https://upload.wikimedia.org/wikipedia/en/5/58/Epos-logo.png",                                                                w: 108, h: 28 },
  { name: "Eizo",        logo: "https://upload.wikimedia.org/wikipedia/commons/4/4f/EIZO_Logo.svg",                                                           w: 100, h: 68 },
  { name: "ViewSonic",   logo: "https://upload.wikimedia.org/wikipedia/commons/b/b0/ViewSonic_logo.svg",                                                      w: 108, h: 28 },
  { name: "Belkin",      logo: "https://upload.wikimedia.org/wikipedia/commons/9/92/Belkin_logo_2024.svg",                                                    w: 108, h: 28 },
  { name: "Honeywell",   logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Honeywell_logo.svg",                                                      w: 108, h: 28 },
  { name: "Logitech",    logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg",                                                       w: 108, h: 28 },
  { name: "Jabra",       logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Jabra_Logo.png",                                                          w: 108, h: 28 },
  { name: "BenQ",        logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/BenQ_wordmark.svg",                                                       w: 95,  h: 28 },
  { name: "SketchUp",    logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Brand_Wordmark_for_SketchUp.png",                                         w: 108, h: 28 },
  { name: "SAP",         logo: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg",                                                       w: 108, h: 28 },
  { name: "LG",          logo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/LG_logo_%282014%29.svg",                                                  w: 108, h: 28 },
  { name: "Keyshot",     logo: "https://www.freelogovectors.net/wp-content/uploads/2018/11/keyshot-logo.png",                                                 w: 108, h: 28 },
  { name: "JumpCloud",   logo: "https://upload.wikimedia.org/wikipedia/en/4/47/JumpCloud_Logo.svg",                                                           w: 108, h: 38 },
];

// Group into categories
const categories = [
  {
    label: "Hardware & Devices",
    partners: allPartners.filter(p =>
      ["Apple", "Lenovo", "Dell", "HP", "Samsung", "Acer", "Asus", "Supermicro", "LG"].includes(p.name)
    ),
  },
  {
    label: "Software & Cloud",
    partners: allPartners.filter(p =>
      ["Microsoft", "Adobe", "Google", "AWS", "SAP", "Autodesk", "Keyshot", "SketchUp", "JumpCloud"].includes(p.name)
    ),
  },
  {
    label: "Networking & Security",
    partners: allPartners.filter(p =>
      ["Cisco", "NVIDIA", "Yubico", "Honeywell"].includes(p.name)
    ),
  },
  {
    label: "AV, Peripherals & Display",
    partners: allPartners.filter(p =>
      ["Poly", "Epos", "Eizo", "ViewSonic", "Belkin", "Logitech", "Jabra", "BenQ"].includes(p.name)
    ),
  },
  {
    label: "Creative & Development",
    partners: allPartners.filter(p =>
      ["Unreal", "Unity"].includes(p.name)
    ),
  },
];

// ========================================================
// MAIN PARTNERS PAGE
// ========================================================
const Partners = () => {
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // GSAP hero heading
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

  const stats = [
    { number: "32+", label: "Technology Partners" },
    { number: "20+", label: "Years of Alliances" },
    { number: "5",   label: "Solution Categories" },
    { number: "100%", label: "Certified Reseller" },
  ];

  const badgeLabels = ["Hardware", "Software", "Cloud", "Networking", "AV", "Security", "Creative", "Display"];

  const heroRef  = useRef(null);
  const statsRef = useRef(null);
  const featRef  = useRef(null);

  const heroInView  = useInView(heroRef,  { once: true, margin: "-60px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });
  const featInView  = useInView(featRef,  { once: true, margin: "-60px" });

  return (
    <Layout>
      <Helmet>
        <title>Our Technology Partners | Sniper Systems</title>
        <meta
          name="description"
          content="Sniper Systems partners with industry-leading technology brands including Apple, Microsoft, Cisco, Dell, HP, NVIDIA, AWS and more to deliver best-in-class IT solutions across India."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://sniperindia.com/partners/" />
        <meta name="geo.region" content="IN-TN" />
        <meta name="geo.placename" content="Chennai" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Technology Partners | Sniper Systems" />
        <meta property="og:description" content="We partner with 32+ leading technology brands to bring world-class IT solutions to enterprises across India." />
        <meta property="og:url" content="https://sniperindia.com/partners/" />
      </Helmet>

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
              {["Our", "Technology", "Partners"].map((word, i) => (
                <span
                  key={i}
                  className="gsap-word inline-block opacity-0 mr-[0.2em] sm:mr-[0.25em] last:mr-0"
                  style={{ overflow: "visible" }}
                >
                  {word}
                  {word === "Technology" ? <br /> : null}
                </span>
              ))}
            </h1>

            <motion.p
              className="text-base sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0 mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 1.9 }}
            >
              We collaborate with the world's most trusted technology brands — bringing you certified,
              enterprise-grade products backed by deep partnerships and decades of expertise.
            </motion.p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {badgeLabels.map((label, i) => (
                <motion.span
                  key={label}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 2.1 + i * 0.08 }}
                >
                  <SpringBadge>{label}</SpringBadge>
                </motion.span>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div className="max-w-6xl mx-auto pt-8 sm:pt-12">
            <motion.div
              className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden h-60 sm:h-96 md:h-[500px] lg:h-[580px]"
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 1, ease, delay: 0.25 }}
              whileHover={{ scale: 1.01 }}
            >
              <ParallaxImage
                src="https://i.postimg.cc/X7VPBxjD/6486.jpg"
                alt="Partners Overview"
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              <motion.div
                className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: 1.2 }}
              >
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5">
                  <Handshake className="w-4 h-4 text-white" />
                  <span className="text-white text-xs font-bold tracking-[0.15em] uppercase">Technology Partners</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GSAP Marquee */}
      <MarqueeTicker />

      {/* ── Stats Strip ── */}
      <section className="bg-white py-10 sm:py-16 px-4 sm:px-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto" ref={statsRef}>
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {stats.map((s, i) => (
              <SpringStatCard key={i} {...s} index={i} trigger={statsInView} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Intro Copy ── */}
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
              Trusted brands.<br />Proven<br />results.
            </motion.h2>
            <motion.div
              className="space-y-5 sm:space-y-6 pt-2 sm:pt-4"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease, delay: 0.15 }}
            >
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Sniper Systems holds authorised reseller and partner status with over 32 global technology
                leaders. From Apple and Microsoft to Cisco and NVIDIA, every product we supply is fully
                certified, warranted, and supported.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Our partnerships give you access to enterprise pricing, priority support channels, and
                the very latest product roadmaps — all managed through one trusted relationship.
              </p>
              <motion.div
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <a
                  href="/contact"
                  className="inline-flex items-center gap-3 text-gray-900 font-semibold text-base sm:text-lg border-b-2 border-gray-900 pb-0.5 hover:gap-5 transition-all duration-300"
                >
                  Talk to our team <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Partner Logo Grid by Category ── */}
      <section className="bg-white py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {categories.map((cat, i) => (
            <CategorySection key={cat.label} label={cat.label} partners={cat.partners} index={i} />
          ))}
        </div>
      </section>

      {/* ── Featured Highlight — dark card ── */}
      <motion.section
        className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease }}
        ref={featRef}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div>
              <motion.p
                className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-6"
                initial={{ opacity: 0 }}
                animate={featInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, ease, delay: 0.1 }}
              >
                Why Our Partnerships Matter
              </motion.p>
              <motion.h2
                className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white leading-tight mb-6 sm:mb-8"
                initial={{ opacity: 0, y: 40 }}
                animate={featInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease, delay: 0.15 }}
              >
                Official.<br />Authorised.<br />Accountable.
              </motion.h2>
              <motion.p
                className="text-base sm:text-lg text-gray-300 leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={featInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: 0.25 }}
              >
                Every brand on our roster is an active, certified partnership — not a grey-market
                arrangement. This means you get genuine products, full warranty coverage, and access
                to vendor-level support escalation paths.
              </motion.p>
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={featInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: 0.35 }}
              >
                {[
                  "Authorised reseller status across 32+ brands",
                  "Access to official warranty & support channels",
                  "Enterprise pricing and volume benefits",
                  "Certified engineers for each technology stack",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 text-gray-300 text-sm sm:text-base"
                    initial={{ opacity: 0, x: -20 }}
                    animate={featInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, ease, delay: 0.4 + i * 0.08 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                    {item}
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.div
              className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-64 sm:h-80 lg:h-[420px]"
              initial={{ opacity: 0, x: 40 }}
              animate={featInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <ParallaxImage
                src="https://i.postimg.cc/wBh5V8Fv/freepik-assistant-85970.png"
                alt="Partner ecosystem"
                className="w-full h-full rounded-2xl sm:rounded-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none rounded-2xl sm:rounded-3xl" />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ── Final CTA ── */}
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

export default Partners;
