import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
// ✦ TABLE OF CONTENTS ITEM (dark panel)
// ========================================================
const TocItem = ({
  index,
  title,
  inView,
}: {
  index: number;
  title: string;
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
      <div className="flex items-start gap-4">
        <span className="text-gray-500 text-xs font-mono mt-1 flex-shrink-0">
          0{index + 1}
        </span>
        <span className="text-white text-sm sm:text-base font-medium leading-relaxed">
          {title}
        </span>
      </div>
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
// ✦ BENEFIT CARD (Adobe section)
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
// ✦ TEAM USE CASE ROW
// ========================================================
const TeamRow = ({
  icon: Icon,
  team,
  items,
  index,
  inView,
}: {
  icon: React.ElementType;
  team: string;
  items: string[];
  index: number;
  inView: boolean;
}) => (
  <motion.div
    className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-4 sm:gap-8 py-6 sm:py-8 border-b border-gray-200 last:border-b-0 items-start"
    initial={{ opacity: 0, x: -24 }}
    animate={inView ? { opacity: 1, x: 0 } : {}}
    transition={{ duration: 0.55, ease, delay: 0.1 + index * 0.07 }}
  >
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-gray-700" />
      </div>
      <span className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
        {team}
      </span>
    </div>
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-gray-700">
          <CheckCircle2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  </motion.div>
);

// ========================================================
// MAIN BLOG-A PAGE
// ========================================================
const BlogA = () => {
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
    "Why Businesses Are Moving Toward Automated Workflows",
    "Intelligent Document Understanding with AI Assistant",
    "Centralized Management & Seamless Collaboration",
    "Smart Content Creation with Adobe Express",
    "Enterprise-Grade Security & Compliance",
    "Key Business Benefits & ROI",
    "Where Businesses See the Most Impact",
    "The Future of Business Documentation",
  ];

  const benefits = [
    {
      icon: CheckCircle2,
      title: "Improved Productivity",
      description:
        "Teams spend less time searching for information and more time executing decisions that drive business forward.",
    },
    {
      icon: Users,
      title: "Enhanced Collaboration",
      description:
        "Real-time updates and shared access improve cross-functional teamwork, eliminating email chains and version confusion.",
    },
    {
      icon: BarChart2,
      title: "Higher ROI",
      description:
        "Efficiency gains from automated workflows translate directly into measurable business impact and cost savings.",
    },
    {
      icon: CheckCircle2,
      title: "Consistent Output Quality",
      description:
        "Standardized tools ensure uniformity across all documents, proposals, and communications — at every level of the organization.",
    },
  ];

  const teams = [
    {
      icon: Briefcase,
      team: "Sales Teams",
      items: ["Create proposals faster with AI-assisted templates", "Access key contract insights instantly"],
    },
    {
      icon: Megaphone,
      team: "Marketing Teams",
      items: ["Design campaign materials using Adobe Express", "Maintain consistent brand identity at scale"],
    },
    {
      icon: Scale,
      team: "Legal Teams",
      items: ["Review and compare contracts efficiently", "Reduce manual workload with intelligent summaries"],
    },
    {
      icon: Users,
      team: "HR Teams",
      items: ["Manage policies and training documentation", "Streamline internal communication workflows"],
    },
    {
      icon: BarChart2,
      team: "Finance Teams",
      items: ["Generate reports quickly with structured templates", "Analyze business data effectively in context"],
    },
  ];

  const relatedPosts = [
    {
      title: "ROG Series Deep Dive: Gaming Hardware for Professionals",
      category: "Hardware",
      image:
        "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80",
      readTime: "6 min read",
    },
    {
      title: "How to Choose the Right Business Laptop in 2025",
      category: "Guide",
      image:
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80",
      readTime: "8 min read",
    },
    {
      title: "Creative Professionals and the Tools They Actually Use",
      category: "Creator",
      image:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
      readTime: "5 min read",
    },
  ];

  const marqueeItems1 = [
    "Sniper Systems Blog",
    "Adobe Acrobat",
    "Document Workflows",
    "AI Assistant",
    "Adobe Express",
    "Business Solutions",
  ];
  const marqueeItems2 = [
    "AI-Powered Documents",
    "PDF Management",
    "Collaboration Tools",
    "Enterprise Security",
    "Adobe Express",
    "Smart Workflows",
    "Digital Transformation",
  ];
  const marqueeItems3 = [
    "Stay Informed",
    "Technology Insights",
    "Sniper Systems",
    "Future-Ready IT",
    "Read More",
  ];

  return (
    <Layout>
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
              <MetaPill icon={Tag} label="Productivity" />
              <MetaPill icon={Calendar} label="May 04, 2026" />
              <MetaPill icon={Clock} label="8 min read" />
              <MetaPill icon={User} label="Sniper Systems" />
            </motion.div>

            <h1
              ref={heroHeadingRef}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              aria-label="A Smarter Way for Businesses to Document Work with Adobe Acrobat Studio"
            >
              {["A", "Smarter", "Way", "to", "Document", "Work"].map((word, i) => (
                <span
                  key={i}
                  className="hero-word inline-block opacity-0 mr-[0.22em] last:mr-0"
                >
                  {word}
                  {word === "to" && <br className="hidden sm:block" />}
                </span>
              ))}
            </h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 1.55 }}
            >
              How Adobe Acrobat, Adobe Express, and AI Assistant are transforming business documentation
            </motion.p>

            <motion.p
              className="text-base sm:text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 1.7 }}
            >
              In today's fast-paced business environment, documents are at the heart of every
              operation — contracts, reports, proposals, and internal communications. Yet
              managing them efficiently remains one of the most overlooked challenges in
              modern organizations. Manual document processes create time-consuming reviews,
              delayed decisions, and inefficient collaboration that costs teams hours every week.
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
                src="https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1600&q=80"
                alt="Adobe Acrobat Business Documentation"
                className="w-full h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 z-10">
                  <div className="bg-black/50 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                    <span className="text-[10px] sm:text-sm font-medium uppercase tracking-widest">
                      ADOBE ACROBAT STUDIO
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
              <TocItem key={i} index={i} title={item} inView={tocInView} />
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ── Article Body: The Problem ──────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">

          <div className="mb-10 sm:mb-16">
            <FadeUp>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                The Document<br />Management Problem
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
                Organizations today are actively seeking ways to reduce manual effort, improve
                productivity, and accelerate access to information. Traditional document handling
                slows operations and creates bottlenecks that cascade across teams — a contract
                delayed in review can stall a sale; a report trapped in email threads means
                decisions get made without the full picture.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Modern, AI-powered workflows change this entirely. Teams can now process
                information instantly, collaborate in real time, and act with the confidence
                that comes from having the right tools. Adobe Acrobat, Adobe Express, and
                the AI Assistant capability sit at the center of this shift.
              </p>
            </FadeUp>
          </div>

          {/* Mid-article image */}
          <FadeUp delay={0.1} className="mb-10 sm:mb-16">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-48 sm:h-[360px] md:h-[480px]">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80"
                alt="Modern document workflows"
                className="w-full h-full"
              />
            </div>
          </FadeUp>

          {/* Section 2 — How Adobe Powers Workflows */}
          <div className="mb-10 sm:mb-16">
            <div className="mb-10 sm:mb-16">
              <FadeUp>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                  How Adobe Powers<br />Modern Workflows
                </h2>
              </FadeUp>
              <div className="w-full h-px bg-gray-300" />
            </div>

            {/* AI Assistant */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-10 sm:mb-14">
              <FadeUp>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                  SECTION TWO<br />AI ASSISTANT
                </h3>
              </FadeUp>
              <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  Adobe Acrobat's AI Assistant helps users quickly summarize, extract insights,
                  and understand lengthy documents — eliminating the need to read every page
                  manually. Whether it's a 200-page contract or a dense financial report, the
                  AI surfaces what matters most in seconds.
                </p>
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  Centralized document management lets teams handle PDFs and multiple file
                  formats in one secure platform, ensuring better organization and easy access
                  across the organization. Combined with real-time sharing, commenting, and
                  reviewing features, this reduces dependency on email chains and dramatically
                  improves team coordination.
                </p>
              </FadeUp>
            </div>

            {/* Adobe Express */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
              <FadeUp>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                  SECTION THREE<br />ADOBE EXPRESS
                </h3>
              </FadeUp>
              <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  Adobe Express empowers teams to create visually compelling reports, proposals,
                  and marketing assets quickly — ensuring professional and consistent output
                  without requiring design expertise. Templates, brand kits, and smart
                  suggestions mean anyone on the team can produce polished collateral.
                </p>
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  Underpinning all of this is enterprise-grade security: secure access,
                  document tracking, and compliance controls keep sensitive business data
                  protected at all times — meeting the requirements of legal, finance,
                  and HR teams alike.
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
              "Efficient document management is no longer optional — it's a critical driver of business success."
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-gray-400 text-sm sm:text-base uppercase tracking-widest font-medium">
              Sniper Systems &amp; Solutions, Adobe Acrobat Studio Report
            </p>
          </FadeUp>
        </div>
      </FadeUp>

      {/* ── Key Benefits Grid ────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 sm:mb-16">
            <FadeUp>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
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
                { number: "40", suffix: "%", label: "Average reduction in document processing time" },
                { number: "3",  suffix: "×", label: "Faster contract review with AI summarization" },
                { number: "60", suffix: "%", label: "Less time spent searching for documents" },
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight text-white">
                Where Businesses See<br />the Most Impact
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
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                The Future of<br />Business Documentation
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
                Organizations are rapidly moving toward AI-driven document intelligence,
                integrated workflow platforms, and collaborative digital ecosystems. The
                businesses that invest in these capabilities today will have a structural
                advantage over those that delay — not just in speed, but in the quality
                of decisions they're able to make.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                The ultimate goal is to reduce operational friction and enhance overall
                performance. With Adobe Acrobat, Adobe Express, and AI Assistant,
                organizations can simplify complex workflows, boost team productivity,
                accelerate decision-making, and maintain secure, organized documentation
                — all from a single, trusted platform.
              </p>
            </FadeUp>
          </div>

          {/* Final image */}
          <FadeUp delay={0.1}>
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-48 sm:h-[360px] md:h-[480px]">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1600&q=80"
                alt="Future of business documentation"
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
              aria-label="Ready to simplify your document workflows?"
            >
              {["Ready", "to", "simplify", "your", "docs?"].map((word, i) => (
                <span
                  key={i}
                  className="cta-word inline-block opacity-0 mr-[0.22em] last:mr-0"
                >
                  {word}
                  {word === "simplify" && <br className="hidden sm:block" />}
                </span>
              ))}
            </h2>
          </div>
          <FadeUp delay={0.3}>
            <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-8 sm:mb-12 leading-relaxed">
              Talk to our team about the right Adobe solution for your business, budget, and goals.
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

export default BlogA;
