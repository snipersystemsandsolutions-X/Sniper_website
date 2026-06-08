import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Cloud,
  CreditCard,
  LayoutGrid,
  Lightbulb,
  Monitor,
  Network,
  Recycle,
  Server,
  Settings,
  Smartphone,
  Users,
} from "lucide-react";
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
    const tween = gsap.to(track, { x: `-${totalWidth}px`, duration: 24, ease: "none", repeat: -1 });
    return () => tween.kill();
  }, []);

  const items = [
    "Cloud Solutions", "AV Solutions", "Device Deployment", "IT Asset Disposal",
    "HR Solutions", "IT Consulting", "Managed IT", "Payment Services",
    "IT Infrastructure", "Networking Solutions",
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
// SOLUTION CARD — large editorial card with hover
// ========================================================
interface SolutionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  to: string;
  index: number;
  trigger: boolean;
  accent: string;
  img: string;
}

const SolutionCard = ({ icon: Icon, title, description, to, index, trigger, accent, img }: SolutionCardProps) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      className="group relative border-b border-gray-200 last:border-0"
      initial={{ opacity: 0, y: 40 }}
      animate={trigger ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease, delay: 0.1 + index * 0.07 }}
    >
      <a
  href={to}
  className="block py-8 sm:py-10"
  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}
>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Number */}
          <div className="sm:col-span-1 hidden sm:block">
            <span className="text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Icon + Title */}
          <div className="sm:col-span-4 flex items-center gap-4 sm:gap-6">
            <motion.div
              className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${accent}15` }}
              whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <Icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: accent }} />
            </motion.div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 leading-tight group-hover:text-gray-600 transition-colors duration-300">
              {title}
            </h3>
          </div>

          {/* Description */}
          <div className="sm:col-span-5">
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">{description}</p>
          </div>

          {/* Arrow */}
          <div className="sm:col-span-2 flex justify-end">
            <motion.div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:border-gray-900 group-hover:bg-gray-900 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white -rotate-45 transition-colors duration-300" />
            </motion.div>
          </div>
        </div>

        {/* Hover preview image strip */}
        <motion.div
          className="overflow-hidden rounded-2xl mt-4 sm:mt-6"
          initial={{ height: 0, opacity: 0 }}
          whileHover={{ height: "180px", opacity: 1 }}
          transition={{ duration: 0.5, ease }}
        >
          <img src={img} alt={title} className="w-full h-full object-cover" />
        </motion.div>
      </a>
    </motion.div>
  );
};

// ========================================================
// SPRING STAT CARD
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
// MAIN SOLUTIONS PAGE
// ========================================================
const Solutions = () => {
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

  const solutions = [
    {
      icon: Cloud,
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure, migration, and management services tailored for your business growth.",
      to: "/solutions/clould-solutions",
      accent: "#000000",
      img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80",
    },
    {
      icon: Monitor,
      title: "AV Solutions",
      description: "Professional audio-visual systems for modern workplaces, conference rooms, and enterprise environments.",
      to: "/solutions/av-solutions",
      accent: "#000000",
      img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80",
    },
    {
      icon: Smartphone,
      title: "Device Deployment & MDM",
      description: "Seamless device provisioning, mobile device management, and endpoint security at scale.",
      to: "/solutions/device-deployment-mdm",
      accent: "#000000",
      img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80",
    },
    {
      icon: Recycle,
      title: "IT Asset Disposal",
      description: "Certified, secure, and environmentally responsible disposal and lifecycle management of IT assets.",
      to: "/solutions/it-asset-disposal",
      accent: "#000000",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    },
    {
      icon: Users,
      title: "HR Solutions",
      description: "Technology-driven HR platforms that streamline recruitment, payroll, and workforce management.",
      to: "/solutions/hr-solutions",
      accent: "#000000",
      img: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80",
    },
    {
      icon: Lightbulb,
      title: "IT Consulting",
      description: "Strategic IT advisory, roadmap planning, and digital transformation for future-ready enterprises.",
      to: "/solutions/it-consulting",
      accent: "#000000",
      img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80",
    },
    {
      icon: Settings,
      title: "Managed IT Services",
      description: "End-to-end IT management, proactive monitoring, and Quick Support so you can focus on business.",
      to: "/solutions/managed-it-services",
      accent: "#000000",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    },
    {
      icon: CreditCard,
      title: "Payment Services",
      description: "Secure, compliant payment infrastructure and gateway integrations for modern commerce.",
      to: "/solutions/payment-services",
      accent: "#000000",
      img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
    },
    {
      icon: Server,
      title: "IT Infrastructure",
      description: "Robust, high-performance infrastructure design, deployment, and lifecycle management.",
      to: "/solutions/it-infrastructure",
      accent: "#000000",
      img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
    },
    {
      icon: Network,
      title: "Networking Solutions",
      description: "Enterprise networking, SD-WAN, Wi-Fi, and secure connectivity solutions across all scales.",
      to: "/solutions/networking-solutions",
      accent: "#000000",
      img: "https://images.unsplash.com/photo-1551808525-51a94da548ce?w=1200&q=80",
    },
  ];

  const stats = [
    { number: "10+", label: "Solution Areas" },
    { number: "1900+", label: "Happy Clients" },
    { number: "20+", label: "Years Experience" },
    { number: "100%", label: "Satisfaction" },
  ];

  const badgeLabels = ["Cloud", "AV", "MDM", "Infrastructure", "Networking", "Managed IT", "Consulting","Server"];

  const heroRef    = useRef(null);
  const statsRef   = useRef(null);
  const listRef    = useRef(null);
  const featRef    = useRef(null);

  const heroInView  = useInView(heroRef,  { once: true, margin: "-60px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });
  const listInView  = useInView(listRef,  { once: true, margin: "-60px" });
  const featInView  = useInView(featRef,  { once: true, margin: "-60px" });

  return (
    <Layout>


       <Helmet>

        {/* BASIC SEO */}

        <title>IT Solutions for Businesses | Enterprise & Digital Solutions | Sniper Systems</title>

        <meta
          name="description"
          content="Discover enterprise IT solutions by Sniper Systems including IT infrastructure, managed services, cloud solutions, cybersecurity, and digital transformation services for businesses in India."
        />

        <meta
          name="keywords"
          content="enterprise IT solutions India, business IT solutions, IT infrastructure solutions Chennai, digital transformation services India, managed IT services provider"
        />

        <meta name="robots" content="index, follow" />

        <link
          rel="canonical"
          href="https://sniperindia.com/solutions/"
        />

        {/* GEO TAGS */}

        <meta name="geo.region" content="IN-TN" />
<meta name="geo.placename" content="Chennai" />
<meta name="geo.position" content="13.0827;80.2707" />
<meta name="ICBM" content="13.0827, 80.2707" />

        {/* OPEN GRAPH */}

        <meta property="og:type" content="website" />

        <meta
          property="og:title"
          content="Enterprise IT Solutions | Sniper Systems"
        />

        <meta
          property="og:description"
          content="Comprehensive IT solutions including infrastructure, cloud, cybersecurity, and managed services for modern enterprises."
        />

        <meta
          property="og:image"
          content="https://sniperindia.com/wp-content/uploads/2023/09/sniper-systems-banner.jpg"
        />

        <meta
          property="og:url"
          content="https://sniperindia.com/solutions/"
        />

        {/* TWITTER SEO */}

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="Business IT Solutions | Sniper Systems"
        />

        <meta
          name="twitter:description"
          content="Explore scalable enterprise IT solutions including infrastructure, cloud computing, and cybersecurity services."
        />

        <meta
          name="twitter:image"
          content="https://sniperindia.com/wp-content/uploads/2023/09/sniper-systems-banner.jpg"
        />

        {/* ORGANIZATION SCHEMA */}

        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Sniper Systems",
            "url": "https://sniperindia.com",
            "logo": "https://sniperindia.com/wp-content/uploads/2023/09/logo.png"
          }
          `}
</script>

        {/* SERVICE SCHEMA */}

        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Enterprise IT Solutions",
            "provider": {
              "@type": "Organization",
              "name": "Sniper Systems"
            },
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "description": "Enterprise IT infrastructure, cloud solutions, cybersecurity, and managed IT services for businesses."
          }
          `}
</script>

        {/* BREADCRUMB SCHEMA */}

        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://sniperindia.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Solutions",
                "item": "https://sniperindia.com/solutions/"
              }
            ]
          }
          `}
</script>

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
              {["Our", "Complete", "Solutions", "Suite"].map((word, i) => (
                <span
                  key={i}
                  className="gsap-word inline-block opacity-0 mr-[0.2em] sm:mr-[0.25em] last:mr-0"
                  style={{ overflow: "visible" }}
                >
                  {word}
                  {word === "Complete" ? <br /> : null}
                </span>
              ))}
            </h1>

            <motion.p
              className="text-base sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0 mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 1.9 }}
            >
              From cloud migration to networking infrastructure — explore our full spectrum of
              enterprise IT solutions engineered to accelerate your business.
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
              className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden h-60 sm:h-96 md:h-[500px] lg:h-[600px]"
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 1, ease, delay: 0.25 }}
              whileHover={{ scale: 1.01 }}
            >
              <ParallaxImage
                src="https://i.postimg.cc/43yyHjXT/business.jpg"
                alt="Solutions Overview"
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
                  <LayoutGrid className="w-4 h-4 text-white" />
                  <span className="text-white text-xs font-bold tracking-[0.15em] uppercase"> Solution Areas</span>
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
              Everything<br />your business<br />needs
            </motion.h2>
            <motion.div
              className="space-y-5 sm:space-y-6 pt-2 sm:pt-4"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease, delay: 0.15 }}
            >
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Sniper Systems and Solutions brings together a full ecosystem of IT services under one roof.
                Whether you're a startup scaling fast or an enterprise modernising its infrastructure, we have
                the expertise and tools to make it happen.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Each solution is purpose-built, deeply integrated, and backed by over 20 years of
                on-the-ground experience across India's most demanding enterprise environments.
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

      {/* ── Solutions List ── */}
      <section className="bg-white py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={listRef}>
          {/* Section label */}
          <motion.div
            className="flex items-center gap-4 mb-8 sm:mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={listInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
          >
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">All Solutions</span>
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">{solutions.length} Areas</span>
          </motion.div>

          {/* Solution rows */}
          <div>
            {solutions.map((sol, index) => (
              <SolutionCard
                key={sol.to}
                {...sol}
                index={index}
                trigger={listInView}
              />
            ))}
          </div>
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
                Why One Partner
              </motion.p>
              <motion.h2
                className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white leading-tight mb-6 sm:mb-8"
                initial={{ opacity: 0, y: 40 }}
                animate={featInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease, delay: 0.15 }}
              >
                Unified IT.<br />Unmatched<br />results.
              </motion.h2>
              <motion.p
                className="text-base sm:text-lg text-gray-300 leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={featInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: 0.25 }}
              >
                Managing multiple vendors creates complexity, delays, and cost overruns. With Sniper Systems,
                all your IT solutions are delivered, supported, and evolved by a single accountable partner.
              </motion.p>
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={featInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: 0.35 }}
              >
                {["Single point of accountability", "Faster issue resolution", "Integrated solution architecture", "Volume-based cost savings"].map((item, i) => (
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
                src="https://i.postimg.cc/Vkdhs6gh/glow.jpg"
                alt="Unified IT Team"
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

export default Solutions;
