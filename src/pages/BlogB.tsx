import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Analytics } from "@vercel/analytics/next"
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Tag,
  User,
  CheckCircle2,
  Briefcase,
  Megaphone,
  Scale,
  Users,
  BarChart2,
  Cpu,
  Tv,
} from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

// ─── Shared easing ────────────────────────────────────────
const ease = [0.16, 1, 0.3, 1] as const;

// ========================================================
// ✦ WHITE SCREEN TRANSITION
// ========================================================
const WhiteScreenTransition = ({ onComplete }: { onComplete: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.to(ref.current, {
      yPercent: -105,
      duration: 0.9,
      ease: "power3.inOut",
      delay: 0.2,
      onComplete,
    });
  }, []);
  return <div ref={ref} className="fixed inset-0 bg-white z-[9999] will-change-transform" />;
};

// ========================================================
// ✦ FADE-UP WRAPPER
// ========================================================
const FadeUp = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </motion.div>
  );
};

// ========================================================
// ✦ MARQUEE TICKER
// ========================================================
const MarqueeTicker = ({
  items,
  reverse = false,
}: {
  items: string[];
  reverse?: boolean;
}) => {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden bg-gray-950 py-3 sm:py-4 border-y border-gray-800">
      <div
        className="flex gap-8 sm:gap-10 whitespace-nowrap"
        style={{
          animation: `marquee${reverse ? "Rev" : ""} 28s linear infinite`,
          willChange: "transform",
        }}
      >
        {doubled.map((text, i) => (
          <span
            key={i}
            className="flex items-center gap-8 sm:gap-10 text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase text-gray-500"
          >
            {text}
            <span className="w-1.5 h-1.5 rounded-full bg-gray-700 inline-block flex-shrink-0" />
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee    { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes marqueeRev { from { transform: translateX(-50%) } to { transform: translateX(0) } }
      `}</style>
    </div>
  );
};

// ========================================================
// ✦ PARALLAX IMAGE
// ========================================================
const ParallaxImage = ({
  src,
  alt,
  className,
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  children?: React.ReactNode;
}) => {
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
        scrollTrigger: {
          trigger: wrap,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);
  return (
    <div ref={wrapRef} className={`overflow-hidden ${className ?? ""}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover scale-110"
        style={{ willChange: "transform" }}
      />
      {children}
    </div>
  );
};

// ========================================================
// ✦ ANIMATED COUNTER
// ========================================================
const AnimatedCounter = ({
  target,
  suffix = "",
}: {
  target: string;
  suffix?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);
  const numericMatch = target.match(/[\d.]+/);
  const numericValue = numericMatch ? parseFloat(numericMatch[0]) : null;
  const prefix =
    numericValue !== null ? target.replace(/[\d.]+.*/, "") : "";

  useEffect(() => {
    const el = ref.current;
    if (!el || numericValue === null) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      onEnter: () => {
        if (triggered.current) return;
        triggered.current = true;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: numericValue,
          duration: 2.2,
          ease: "power2.out",
          onUpdate: () => {
            if (el)
              el.textContent =
                prefix + Math.round(obj.val).toLocaleString() + suffix;
          },
        });
      },
    });
    return () => st.kill();
  }, [numericValue]);

  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
};

// ========================================================
// ✦ META PILL
// ========================================================
const MetaPill = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium">
    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
    <span>{label}</span>
  </div>
);

// ========================================================
// ✦ RELATED POST CARD
// ========================================================
const RelatedCard = ({
  post,
}: {
  post: { title: string; category: string; image: string; readTime: string };
}) => (
  <div className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 h-full">
    <div className="relative h-44 sm:h-56 overflow-hidden">
      <img
        src={post.image}
        alt={post.title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute top-3 left-3">
        <span className="bg-black/70 text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-sm">
          {post.category}
        </span>
      </div>
    </div>
    <div className="p-5 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-snug group-hover:underline underline-offset-2">
        {post.title}
      </h3>
      <span className="text-xs text-gray-500 flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5" /> {post.readTime}
      </span>
    </div>
  </div>
);

// ========================================================
// ✦ TABLE OF CONTENTS ITEM (dark panel with smooth-scroll ID targets)
// ========================================================
const TocItem = ({
  index,
  title,
  id,
  inView,
}: {
  index: number;
  title: string;
  id: string;
  inView: boolean;
}) => {
  const lineRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!inView || !lineRef.current) return;
    gsap.fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      {
        scaleX: 1,
        duration: 1,
        ease: "power3.out",
        delay: 0.3 + index * 0.1,
      }
    );
  }, [inView]);

  return (
    <motion.div
      className="relative pb-5 last:pb-0"
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, ease, delay: 0.2 + index * 0.08 }}
    >
      <a
        href={`#${id}`}
        onClick={(e) => {
          e.preventDefault();
          const target = document.getElementById(id);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            window.history.pushState(null, "", `#${id}`);
          }
        }}
        className="group flex items-start gap-4 cursor-pointer"
      >
        <span className="text-gray-500 text-xs font-mono mt-1 flex-shrink-0">
          0{index + 1}
        </span>
        <span className="text-white text-sm sm:text-base font-medium leading-relaxed group-hover:text-blue-400 transition-colors">
          {title}
        </span>
      </a>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-700 overflow-hidden">
        <div
          ref={lineRef}
          className="h-full bg-gradient-to-r from-transparent via-gray-400 to-transparent"
          style={{ transform: "scaleX(0)", willChange: "transform" }}
        />
      </div>
    </motion.div>
  );
};

// ========================================================
// ✦ BENEFIT CARD (Lenovo section)
// ========================================================
const BenefitCard = ({
  icon: Icon,
  title,
  description,
  index,
  inView,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
  inView: boolean;
}) => (
  <motion.div
    className="border border-gray-200 rounded-2xl p-6 sm:p-8 bg-white hover:shadow-lg transition-shadow duration-300"
    initial={{ opacity: 0, y: 40 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.6, ease, delay: 0.1 + index * 0.08 }}
  >
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 sm:mb-5">
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
    </div>
    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 leading-snug">
      {title}
    </h4>
    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);

// ========================================================
// MAIN BLOG-B PAGE (Lenovo AI)
// ========================================================
const BlogB = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);

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

  // GSAP hero word-stagger
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = heroHeadingRef.current;
    if (!el) return;
    const words = el.querySelectorAll(".hero-word");
    const tween = gsap.fromTo(
      words,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        stagger: 0.07,
        delay: 1.2,
      }
    );
    return () => tween.kill();
  }, []);

  // Hero image scale-on-scroll
  const heroImgWrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = heroImgWrapRef.current;
    if (!el) return;
    const tween = gsap.fromTo(
      el,
      { scale: 0.82, borderRadius: "2.5rem" },
      {
        scale: 1,
        borderRadius: "1.5rem",
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 95%",
          end: "top 10%",
          scrub: 1.4,
        },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  // GSAP CTA word stagger
  const ctaHeadingRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });
  useEffect(() => {
    if (!ctaInView) return;
    const el = ctaHeadingRef.current;
    if (!el) return;
    const words = el.querySelectorAll(".cta-word");
    gsap.fromTo(
      words,
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.06,
        delay: 0.2,
      }
    );
  }, [ctaInView]);

  // Related posts grid stagger
  const relatedGridRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef(null);
  const relatedInView = useInView(relatedRef, { once: true, margin: "-60px" });
  const relatedTriggered = useRef(false);
  useEffect(() => {
    if (!relatedInView || relatedTriggered.current) return;
    relatedTriggered.current = true;
    const cards = relatedGridRef.current?.querySelectorAll(".related-card");
    if (!cards) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.12 }
    );
  }, [relatedInView]);

  // Section inView refs
  const heroRef = useRef(null);
  const tocRef = useRef(null);
  const statsRef = useRef(null);
  const benefitsRef = useRef(null);
  const teamsRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-60px" });
  const tocInView = useInView(tocRef, { once: true, margin: "-60px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });
  const benefitsInView = useInView(benefitsRef, { once: true, margin: "-60px" });
  const teamsInView = useInView(teamsRef, { once: true, margin: "-60px" });

  // Data
  const tocItems = [
    { title: "Why Lenovo and FIFA Are the Perfect Partnership", id: "why-lenovo-fifa-perfect-match" },
    { title: "Football AI Pro — Intelligence for Every Team", id: "football-ai-pro" },
    { title: "VAR & Referee View body cameras", id: "broadcast-var" },
    { title: "Hybrid AI Infrastructure Powering the Tournament", id: "hybrid-ai-infrastructure" },
    { title: "Digital Workplace Solutions & Always-On Operations", id: "digital-workplace-solutions" },
    { title: "Motorola, Special Edition Devices & FIFAe Esports", id: "motorola-special-editions" },
    { title: "Key Business Benefits of the Partnership", id: "key-business-benefits" },
    { title: "Who Gains Most from Lenovo's FIFA Technology", id: "who-gains-most" },
    { title: "The Future of Sports Technology", id: "future-sports-tech" },
  ];

  const benefits = [
    {
      icon: Cpu,
      title: "Real-Time Intelligence",
      description:
        "Teams and operations staff act on live data — no delays, no guesswork, no missed decisions during the world's biggest sporting event.",
    },
    {
      icon: Users,
      title: "Equal Access for All 48 Teams",
      description:
        "Football AI Pro ensures every participating nation benefits from the same AI-driven analytics, levelling the playing field at the highest level.",
    },
    {
      icon: BarChart2,
      title: "Scalable Infrastructure",
      description:
        "From 7,500 deployed assets at Club World Cup to a full-tournament backbone for World Cup 2026 — Lenovo's platform scales without friction.",
    },
    {
      icon: Tv,
      title: "Immersive Fan Experience",
      description:
        "Referee View body cams, IPTV delivery, and special edition devices bring 6 billion fans closer to the action than ever before.",
    },
  ];

  const teams = [
    {
      icon: User,
      team: "Coaches & Analysts",
      items: [
        "Query Football AI Pro for real-time player and match insights",
        "Access tactical breakdowns and opposition intelligence instantly",
      ],
    },
    {
      icon: Briefcase,
      team: "Tournament Organizers",
      items: [
        "Manage logistics across 16 stadiums and 3 countries with always-on systems",
        "Deploy and provision thousands of devices in weeks, not months",
      ],
    },
    {
      icon: Megaphone,
      team: "Broadcasters",
      items: [
        "Distribute HD/4K feeds across satellite, cable, and IPTV with near-zero latency",
        "Leverage Referee View body camera footage for richer storytelling",
      ],
    },
    {
      icon: Users,
      team: "Fans Worldwide",
      items: [
        "Watch through Motorola's AI-powered FIFA special edition devices",
        "Experience immersive in-stadium and at-home digital fan journeys",
      ],
    },
    {
      icon: BarChart2,
      team: "Enterprise Leaders",
      items: [
        "See Lenovo's Hybrid AI infrastructure proven under maximum real-world load",
        "Apply the same full-stack AI platform to mission-critical business operations",
      ],
    },
  ];

  const relatedPosts = [
    {
      title: "A Smarter Way to Document Work",
      category: "Adobe Acrobat",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      readTime: "8 min read",
    },
    {
      title: "Maximizing ROI with Managed IT Services",
      category: "Managed Services",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      readTime: "6 min read",
    },
    {
      title: "Mobile Device Management Best Practices",
      category: "Device Management",
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
      readTime: "7 min read",
    },
  ];

  const marqueeItems1 = [
    "Lenovo AI Solutions",
    "FIFA World Cup 2026",
    "Football AI Pro",
    "Hybrid AI Infrastructure",
    "Smarter AI for All",
    "Official Technology Partner",
  ];
  const marqueeItems2 = [
    "Real-Time Analytics",
    "Referee View Body Cams",
    "Motorola Razr FIFA Edition",
    "Lenovo Legion Gaming",
    "Always-On Operations",
    "Digital Workplace Solutions",
  ];
  const marqueeItems3 = [
    "Future of Sports Tech",
    "Lenovo Hybrid Cloud",
    "Sniper Systems",
    "Next-Gen Infrastructure",
    "Read More",
  ];

  return (
    <Layout>
      <Helmet>
        {/* BASIC SEO */}
        <title>Lenovo AI Powers a World Gone Football™ | Sniper Systems</title>
        <meta
          name="description"
          content="Explore how Lenovo's full-stack AI, Football AI Pro, and hybrid AI infrastructure are driving the most advanced FIFA World Cup 2026™ in history."
        />
        <meta
          name="keywords"
          content="Lenovo FIFA partnership, FIFA World Cup 2026 technology, Football AI Pro, Official Technology Partner FIFA, Lenovo AI solutions, Hybrid AI infrastructure, Referee View body camera, Motorola FIFA smartphone, Smarter AI for All"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://sniperindia.com/blog/blogb" />

        {/* GEO TAGS */}
        <meta name="geo.region" content="IN-TN" />
        <meta name="geo.placename" content="Chennai" />
        <meta name="geo.position" content="13.0827;80.2707" />
        <meta name="ICBM" content="13.0827, 80.2707" />

        {/* OPEN GRAPH */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Lenovo AI Powers a World Gone Football™ | Sniper Systems" />
        <meta
          property="og:description"
          content="Explore how Lenovo's full-stack AI, Football AI Pro, and hybrid AI infrastructure are driving the most advanced FIFA World Cup 2026™ in history."
        />
        <meta property="og:image" content="https://i.postimg.cc/cH9k1cMp/1729031977049.jpg" />
        <meta property="og:url" content="https://sniperindia.com/blog/blogb" />
        <meta property="article:published_time" content="2026-06-11T12:00:00+05:30" />
        <meta property="article:modified_time" content="2026-06-11T12:00:00+05:30" />
        <meta property="article:section" content="Technology" />
        <meta property="article:tag" content="Lenovo AI, FIFA World Cup 2026, Hybrid Infrastructure, Football AI Pro, Motorola" />

        {/* TWITTER SEO */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lenovo AI Powers a World Gone Football™ | Sniper Systems" />
        <meta
          name="twitter:description"
          content="Explore how Lenovo's full-stack AI, Football AI Pro, and hybrid AI infrastructure are driving the most advanced FIFA World Cup 2026™ in history."
        />
        <meta name="twitter:image" content="https://i.postimg.cc/cH9k1cMp/1729031977049.jpg" />

        {/* SCHEMA MARKUP (JSON-LD) */}
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "Lenovo AI Powers a World Gone Football™",
            "alternativeHeadline": "How Lenovo's full-stack AI technology is driving the most advanced FIFA World Cup™ in history",
            "image": "https://i.postimg.cc/cH9k1cMp/1729031977049.jpg",
            "genre": "Technology",
            "keywords": "Lenovo FIFA partnership, Football AI Pro, Lenovo AI, FIFA World Cup 2026",
            "publisher": {
              "@type": "Organization",
              "name": "Sniper Systems",
              "url": "https://sniperindia.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://sniperindia.com/wp-content/uploads/2023/09/logo.png"
              }
            },
            "url": "https://sniperindia.com/blog/blogb",
            "datePublished": "2026-06-11T12:00:00+05:30",
            "dateCreated": "2026-06-11T12:00:00+05:30",
            "dateModified": "2026-06-11T12:00:00+05:30",
            "description": "How Lenovo's full-stack AI technology is driving the most advanced FIFA World Cup™ in history. Built end-to-end by Lenovo.",
            "articleBody": "When billions of fans tune in to FIFA World Cup 2026™, they'll be watching more than football. Behind every match, broadcast, and stadium operation runs a digital infrastructure unlike anything the tournament has seen — built end-to-end by Lenovo, the Official Technology Partner of FIFA World Cup 2026™.",
            "author": {
              "@type": "Organization",
              "name": "Sniper Systems",
              "url": "https://sniperindia.com"
            }
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
                "name": "Blog",
                "item": "https://sniperindia.com/blog/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Lenovo AI Powers a World Gone Football",
                "item": "https://sniperindia.com/blog/blogb"
              }
            ]
          }
          `}
        </script>
      </Helmet>
      {showWhiteScreen && (
        <WhiteScreenTransition onComplete={() => setShowWhiteScreen(false)} />
      )}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-white pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16" ref={heroRef}>
            <motion.div
              className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease, delay: 0.9 }}
            >
              <MetaPill icon={Tag} label="Lenovo AI" />
              <MetaPill icon={Calendar} label="June 11, 2026" />
              <MetaPill icon={Clock} label="10 min read" />
              <MetaPill icon={User} label="Sniper Systems" />
            </motion.div>

            <h1
              ref={heroHeadingRef}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              aria-label="Lenovo AI Powers a World Gone Football"
            >
              {["Lenovo", "AI", "Powers", "a", "World", "Gone", "Football"].map((word, i) => (
                <span
                  key={i}
                  className="hero-word inline-block opacity-0 mr-[0.22em] last:mr-0"
                >
                  {word}
                  {word === "a" && <br className="hidden sm:block" />}
                </span>
              ))}
            </h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 1.55 }}
            >
              How Lenovo's full-stack AI technology is driving the most advanced FIFA World Cup™ in history
            </motion.p>

            <motion.p
              className="text-base sm:text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 1.7 }}
            >
              When billions of fans tune in to FIFA World Cup 2026™, they'll be watching more than football.
              Behind every match, broadcast, and stadium operation runs a digital infrastructure unlike anything the
              tournament has seen — built end-to-end by Lenovo, the Official Technology Partner of FIFA World Cup 2026™.
            </motion.p>
          </div>

          {/* Hero image with scale-on-scroll */}
          <motion.div
            className="max-w-6xl mx-auto pt-6 sm:pt-8 lg:pt-12"
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          >
            <div
              ref={heroImgWrapRef}
              className="relative shadow-2xl overflow-hidden h-56 sm:h-96 md:h-[500px] lg:h-[600px]"
              style={{
                borderRadius: "2.5rem",
                willChange: "transform, border-radius",
                transformOrigin: "center center",
              }}
            >
              <ParallaxImage
                src="https://i.postimg.cc/cH9k1cMp/1729031977049.jpg"
                alt="Lenovo FIFA World Cup AI technology"
                className="w-full h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 z-10">
                  <div className="bg-black/50 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                    <span className="text-[10px] sm:text-sm font-medium uppercase tracking-widest">
                      LENOVO FIFA PARTNERSHIP
                    </span>
                  </div>
                </div>
              </ParallaxImage>
            </div>
          </motion.div>
        </div>
      </section>

      <MarqueeTicker items={marqueeItems1} />

      {/* ── Table of Contents ──────────────────────────────────────────── */}
      <FadeUp className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12">
        <div ref={tocRef} className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8 sm:mb-12">
            <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white flex-shrink-0" />
            <FadeUp>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight">
                In This Article
              </h2>
            </FadeUp>
          </div>
          <div className="space-y-5">
            {tocItems.map((item, i) => (
              <TocItem key={i} index={i} title={item.title} id={item.id} inView={tocInView} />
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ── Article Body: The Partnership ────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">

          <div className="mb-10 sm:mb-16">
            <FadeUp>
              <h2 id="why-lenovo-fifa-perfect-match" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Why Lenovo & FIFA<br />Are the Perfect Match
              </h2>
            </FadeUp>
            <div className="w-full h-px bg-gray-300" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-10 sm:mb-16">
            <FadeUp>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                SECTION ONE<br />WHY IT MATTERS
              </h3>
            </FadeUp>
            <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                The Lenovo–FIFA relationship did not begin on paper — it was tested under live tournament pressure at
                the FIFA Club World Cup 2025™, where Lenovo and Motorola served as Official Technology Partners,
                deploying over 7,500 assets across 63 matches. With 2.7 billion fans watching and 32 of the world's
                top clubs competing, Lenovo proved it could deliver at scale.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                That performance unlocked a far larger mandate. Lenovo was named Official Global Technology Partner
                for FIFA World Cup 2026™ — a 48-team, 104-match event spanning Canada, Mexico, and the United States
                — as well as the FIFA Women's World Cup 2027™ in Brazil. For the first time in the tournament's history,
                a single tech partner is responsible for the full stack: infrastructure, devices, AI analytics, broadcast
                operations, and fan experience.
              </p>
            </FadeUp>
          </div>

          {/* Mid-article image */}
          <FadeUp delay={0.1} className="mb-10 sm:mb-16">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-48 sm:h-[360px] md:h-[480px]">
              <ParallaxImage
                src="https://i.postimg.cc/5tNNZxPY/images.jpg"
                alt="High-tech infrastructure for sports analytics"
                className="w-full h-full"
              />
            </div>
          </FadeUp>

          {/* Section 2 — AI Assistant & VAR */}
          <div className="mb-10 sm:mb-16">
            <div className="mb-10 sm:mb-16">
              <FadeUp>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                  Football AI Pro &amp;<br />Next-Gen Broadcasts
                </h2>
              </FadeUp>
              <div className="w-full h-px bg-gray-300" />
            </div>

            {/* AI Assistant */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-10 sm:mb-14">
              <FadeUp>
                <h3 id="football-ai-pro" className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                  SECTION TWO<br />AI ASSISTANT
                </h3>
              </FadeUp>
              <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  Announced at <a
                    href="https://sniperindia.com/partners/lenovo-authorized-platinum-partner-reseller/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontWeight: 'bold',
                      color: '#0000EE',
                      textDecoration: 'underline',
                    }}
                  >
                    Lenovo Tech World 2026
                  </a> — held at the Sphere in Las Vegas — Football AI Pro is a
                  generative AI knowledge assistant designed specifically for football. All 48 participating teams
                  receive access to it. Coaches and analysts can query it in natural language for player performance
                  data, tactical breakdowns, injury risk indicators, and historical match context in real time.
                </p>
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  The same philosophy behind Lenovo's Smarter AI for All approach drives Football AI Pro: advanced AI
                  should not be reserved for well-resourced teams alone. A first-time qualifier gets the same analytical
                  depth as a perennial contender. This is perhaps the most democratising technology deployment in the
                  tournament's history.
                </p>
              </FadeUp>
            </div>

            {/* Broadcast & VAR */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
              <FadeUp>
                <h3 id="broadcast-var" className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                  SECTION THREE<br />BROADCAST &amp; VAR
                </h3>
              </FadeUp>
              <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  Beyond the dugout, Lenovo is providing resilient infrastructure for FIFA's VAR Technology Provider Hawk-Eye
                  Innovations across all 16 stadiums. Following the successful trial at Club World Cup 2025™, referee body
                  cameras — now enhanced with AI under the name Referee View — will give the anticipated global audience
                  of 6+ billion fans access to the on-field point of view in real time, adding a layer of transparency
                  and immersion that was impossible before.
                </p>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      <MarqueeTicker items={marqueeItems2} reverse />

      {/* ── Pull Quote ───────────────────────────────────────────────────── */}
      <FadeUp className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-6 sm:mb-10">
              "Having an Official Technology Partner in Lenovo meant that we could mobilise quickly. Their event-proven delivery model gave us the flexibility to scale up operations in weeks, not months."
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-gray-400 text-sm sm:text-base uppercase tracking-widest font-medium">
              — Jose Ignacio Fresco, FIFA Director of Technology
            </p>
          </FadeUp>
        </div>
      </FadeUp>

      {/* ── Infrastructure, Workplace, Devices ────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 sm:mb-16">
            <FadeUp>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Behind the Scenes:<br />Infrastructure &amp; Devices
              </h2>
            </FadeUp>
            <div className="w-full h-px bg-gray-300" />
          </div>

          {/* Infrastructure */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-10 sm:mb-14">
            <FadeUp>
              <h3 id="hybrid-ai-infrastructure" className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                SECTION THREE (CONTINUED)<br />INFRASTRUCTURE
              </h3>
            </FadeUp>
            <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                At the International Broadcast Center in Dallas, Texas, Lenovo servers are processing and distributing
                video feeds simultaneously across satellite, cable, and IP channels globally. The platform enables near
                real-time IPTV delivery with ultra-low latency — meaning a goal scored in Los Angeles reaches screens
                in Chennai within moments.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                This is Lenovo's Hybrid AI Advantage in practice: AI-optimised data centres, edge computing, storage
                systems, and workstations working as a single, unified platform. For enterprise decision-makers
                watching this unfold, it is a live proof of concept — the same infrastructure that keeps a World Cup
                broadcast live can power mission-critical operations in finance, healthcare, or logistics.
              </p>
            </FadeUp>
          </div>

          {/* Workplace & Operations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-10 sm:mb-14">
            <FadeUp>
              <h3 id="digital-workplace-solutions" className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                SECTION FOUR<br />OPERATIONS &amp; WORKPLACE
              </h3>
            </FadeUp>
            <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Running a 104-match tournament across three countries means thousands of staff, officials, broadcasters,
                and volunteers need to stay connected simultaneously. Lenovo's Digital Workplace Solutions provide the speed,
                resilience, and adaptability to pull off the world's most watched event with zero tolerance for downtime.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                At Club World Cup 2025™, Lenovo deployed provisioning services, custom software through its Solutions &amp;
                Services Group, Lenovo Tab K11 tablets, and Motorola mobile devices — with ServiceNow integration for seamless
                operations management. The same model scales to World Cup 26. In football, there are no timeouts. Lenovo's
                infrastructure doesn't take them either.
              </p>
            </FadeUp>
          </div>

          {/* Devices & Gaming */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            <FadeUp>
              <h3 id="motorola-special-editions" className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                SECTION FIVE<br />DEVICES &amp; GAMING
              </h3>
            </FadeUp>
            <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Lenovo's subsidiary Motorola is the Official Smartphone Partner of FIFA World Cup 26™. AI-powered razr and
                edge devices are designed for fans in stadiums, at home, and on the move — with a special FIFA World Cup 26
                Edition Motorola razr joining a lineup of limited-edition devices including the ThinkPad X1 Carbon,
                ThinkPad X9-14, Yoga Slim 7i Aura Edition, Idea Tab, and Lenovo Legion Pro 7i.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Football's digital frontier extends to esports. Lenovo Legion is the official gaming PC partner of FIFAe
                Finals 2025™ — the world's premier football esports competition — bringing high-performance hardware to
                players competing at the intersection of sport and technology. It is a signal that Lenovo's commitment
                covers the entire football ecosystem, not just the 90 minutes on the pitch.
              </p>
            </FadeUp>
          </div>

        </div>
      </section>

      {/* ── Key Benefits Grid ────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 sm:mb-16">
            <FadeUp>
              <h2 id="key-business-benefits" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Key Business<br />Benefits
              </h2>
            </FadeUp>
            <div className="w-full h-px bg-gray-300" />
          </div>

          <div
            ref={benefitsRef}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-16 sm:mb-20"
          >
            {benefits.map((b, i) => (
              <BenefitCard key={i} {...b} index={i} inView={benefitsInView} />
            ))}
          </div>

          {/* Stats */}
          <div ref={statsRef}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 text-center">
              {[
                { number: "6", suffix: "Billion ", label: "Fans" },
                { number: "48", suffix: "", label: "Teams" },
                { number: "1", suffix: "", label: "Official Technology Partner." },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="text-center"
                  initial={{ opacity: 0, y: 40 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, ease, delay: 0.3 + i * 0.1 }}
                >
                  <div className="text-4xl sm:text-5xl md:text-6xl text-gray-900 mb-2 font-semibold">
                    <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base px-2">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team Use Cases ───────────────────────────────────────────────── */}
      <FadeUp className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8 sm:mb-12">
            <FadeUp>
              <h2 id="who-gains-most" className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight text-white">
                Who Gains Most from<br />Lenovo's FIFA Technology
              </h2>
            </FadeUp>
          </div>
          <div ref={teamsRef}>
            {teams.map((t, i) => (
              <div
                key={i}
                className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-4 sm:gap-8 py-6 sm:py-8 border-b border-gray-700 last:border-b-0 items-start"
              >
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={teamsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, ease, delay: 0.1 + i * 0.07 }}
                >
                  <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <t.icon className="w-4 h-4 text-gray-300" />
                  </div>
                  <span className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
                    {t.team}
                  </span>
                </motion.div>
                <motion.ul
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={teamsInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, ease, delay: 0.2 + i * 0.07 }}
                >
                  {t.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm sm:text-base text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </motion.ul>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ── Future of Documentation ──────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 sm:mb-16">
            <FadeUp>
              <h2 id="future-sports-tech" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                The Future of<br />Sports Technology
              </h2>
            </FadeUp>
            <div className="w-full h-px bg-gray-300" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-14 sm:mb-20">
            <FadeUp>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                SECTION FINAL<br />WHAT'S NEXT
              </h3>
            </FadeUp>
            <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                The Lenovo–FIFA partnership is the most ambitious deployment of AI-driven sports technology in history.
                No test environment simulates six billion concurrent touchpoints, 104 live productions, and logistics
                spanning three continents. FIFA World Cup 2026™ is that test — and Lenovo is running it live, in real time,
                for the whole world to see.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                For business leaders, the signal is clear. The same predictive planning, AI-optimised data centres,
                and full-stack hybrid AI infrastructure Lenovo has deployed for FIFA can be configured for your organisation's
                most demanding workloads. The pitch is proof of what's possible — and the same capabilities are available
                through Lenovo's Smarter AI for All solutions today.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-semibold text-gray-950">
                Whether you're a fan counting down to kick-off, a CIO evaluating AI infrastructure, or an operations
                leader looking to eliminate downtime — this partnership is worth watching closely. The beautiful game just
                got a beautiful digital backbone.
              </p>
            </FadeUp>
          </div>

          {/* Final image */}
          <FadeUp delay={0.1}>
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-48 sm:h-[360px] md:h-[480px]">
              <ParallaxImage
                src="https://i.postimg.cc/YCFS1nv3/FIFA-Lasso-16x9.jpg"
                alt="Lenovo Sports Technology Football pitch"
                className="w-full h-full"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      <MarqueeTicker items={marqueeItems3} />

      {/* ── Related Posts ────────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={relatedRef}>
          <FadeUp className="mb-10 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 leading-tight">
              Continue<br />Reading
            </h2>
          </FadeUp>

          <div
            ref={relatedGridRef}
            className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8"
          >
            {relatedPosts.map((post, index) => (
              <div key={index} className="related-card opacity-0">
                <RelatedCard post={post} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <FadeUp className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12 overflow-hidden">
        <div ref={ctaRef} className="max-w-4xl mx-auto text-center">
          <div className="mb-8 sm:mb-12 overflow-hidden">
            <h2
              ref={ctaHeadingRef}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold mb-4 sm:mb-6 leading-tight"
              aria-label="Ready to bring Lenovo AI to your business?"
            >
              {["Ready", "to", "bring", "Lenovo", "AI", "to", "your", "business?"].map((word, i) => (
                <span
                  key={i}
                  className="cta-word inline-block opacity-0 mr-[0.22em] last:mr-0"
                >
                  {word}
                  {word === "bring" && <br className="hidden sm:block" />}
                </span>
              ))}
            </h2>
          </div>
          <FadeUp delay={0.3}>
            <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-8 sm:mb-12 leading-relaxed">
              Talk to our team about the right AI infrastructure solution for your operations, scale, and goals.
            </p>
          </FadeUp>
          <FadeUp delay={0.45}>
            <a
              href="/contact"
              className="inline-flex items-center px-8 sm:px-12 py-3 sm:py-4 border-2 border-white rounded-full text-white font-medium text-base sm:text-lg hover:bg-white hover:text-black transition-colors duration-300"
            >
              GET IN TOUCH
            </a>
          </FadeUp>
        </div>
      </FadeUp>

      {/* ── Scroll to Top ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 left-6 sm:bottom-8 sm:left-8 w-12 h-12 sm:w-14 sm:h-14 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 z-50 shadow-lg"
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
    </Layout>
  );
};

export default BlogB;
