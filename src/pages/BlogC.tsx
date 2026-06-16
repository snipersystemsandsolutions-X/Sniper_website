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
  Factory,
  Building2,
  GraduationCap,
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
// ✦ BENEFIT CARD (Unity Studio section)
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
// ✦ INDUSTRY USE CASE ROW
// ========================================================
const IndustryRow = ({
  icon: Icon,
  industry,
  useCase,
  index,
  inView,
}: {
  icon: React.ElementType;
  industry: string;
  useCase: string;
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
        <Icon className="w-4 h-4 text-gray-900" />
      </div>
      <span className="text-sm font-semibold text-gray-100 uppercase tracking-wider">
        {industry}
      </span>
    </div>
    <p className="text-sm sm:text-base text-gray-200 leading-relaxed">{useCase}</p>
  </motion.div>
);

// ========================================================
// MAIN BLOG-C PAGE
// ========================================================
const BlogC = () => {
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
  const industriesRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-60px" });
  const tocInView = useInView(tocRef, { once: true, margin: "-60px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });
  const benefitsInView = useInView(benefitsRef, { once: true, margin: "-60px" });
  const industriesInView = useInView(industriesRef, { once: true, margin: "-60px" });

  // Data
  const tocItems = [
    "Why Interactive 3D Is Becoming a Business Priority",
    "How Businesses Are Using Unity Studio",
    "Manufacturing & Industrial Operations",
    "Product Demonstrations & Sales Enablement",
    "Employee Training & Simulation",
    "Architecture, Engineering & Construction",
    "Why Browser-Based 3D Platforms Matter",
    "Business Benefits of Interactive 3D Workflows",
    "Industries Seeing the Highest Adoption",
  ];

  const benefits = [
    {
      icon: BarChart2,
      title: "Faster Decision-Making",
      description:
        "Interactive visualization simplifies complex information, helping teams make quicker decisions.",
    },
    {
      icon: Users,
      title: "Better Customer Engagement",
      description:
        "Customers interact with products and environments in real time instead of viewing static presentations.",
    },
    {
      icon: Factory,
      title: "Improved Operational Efficiency",
      description:
        "Simulation-based workflows reduce errors, delays, and rework in operational processes.",
    },
    {
      icon: Scale,
      title: "Reduced Training Costs",
      description:
        "Virtual training environments minimize the need for physical resources and repeated sessions.",
    },
    {
      icon: Megaphone,
      title: "Scalable Collaboration",
      description:
        "Teams across multiple locations can collaborate on projects more efficiently.",
    },
  ];

  const industries = [
    {
      icon: Factory,
      industry: "Manufacturing",
      useCase: "Equipment simulation & digital twins",
    },
    {
      icon: Briefcase,
      industry: "Automotive",
      useCase: "Product visualization & training",
    },
    {
      icon: Building2,
      industry: "Retail",
      useCase: "Interactive product configurators",
    },
    {
      icon: GraduationCap,
      industry: "Healthcare",
      useCase: "Virtual training environments",
    },
    {
      icon: Building2,
      industry: "Architecture",
      useCase: "Real-time walkthroughs",
    },
    {
      icon: Megaphone,
      industry: "Enterprise Sales",
      useCase: "Immersive product demos",
    },
  ];

  const relatedPosts = [
    {
      title: "Lenovo AI Powers a World Gone Football™",
      category: "Lenovo AI",
      image:
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80",
      readTime: "10 min read",
    },
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
  ];

  const marqueeItems1 = [
    "Sniper Systems Blog",
    "Unity Studio",
    "Interactive 3D",
    "Business Solutions",
    "Digital Transformation",
    "Real-time Visualization",
  ];
  const marqueeItems2 = [
    "3D Experiences",
    "Sales Enablement",
    "Training Solutions",
    "Operational Efficiency",
    "Unity Studio",
    "Browser-Based 3D",
    "Business Innovation",
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
              <MetaPill icon={Tag} label="Interactive 3D" />
              <MetaPill icon={Calendar} label="June 16, 2026" />
              <MetaPill icon={Clock} label="12 min read" />
              <MetaPill icon={User} label="Sniper Systems" />
            </motion.div>

            <h1
              ref={heroHeadingRef}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              aria-label="How Businesses Are Using Interactive 3D Experiences to Improve Sales, Training & Operations with Unity Studio"
            >
              {["Interactive", "3D", "for", "Business"].map((word, i) => (
                <span
                  key={i}
                  className="hero-word inline-block opacity-0 mr-[0.22em] last:mr-0"
                >
                  {word}
                  {word === "for" && <br className="hidden sm:block" />}
                </span>
              ))}
            </h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 1.55 }}
            >
              A Smarter Way to Engage Customers and Streamline Operations
            </motion.p>

            <motion.p
              className="text-base sm:text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 1.7 }}
            >
              For many organizations, product presentations, training sessions, and operational workflows still rely on static PDFs, slides, videos, or complex demonstrations. These traditional methods often fail to capture customer attention, simplify complex products, deliver immersive training experiences, and speed up business decisions.
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
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80"
                alt="Interactive 3D Business Experiences"
                className="w-full h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 z-10">
                  <div className="bg-black/50 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                    <span className="text-[10px] sm:text-sm font-medium uppercase tracking-widest">
                      UNITY STUDIO
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
                Why Interactive 3D<br />Is Becoming a Business Priority
              </h2>
            </FadeUp>
            <div className="w-full h-px bg-gray-300" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-10 sm:mb-16">
            <FadeUp>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                SECTION ONE<br />THE SHIFT
              </h3>
            </FadeUp>
            <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Organizations across industries are under pressure to improve customer engagement, reduce operational delays, accelerate training processes, and simplify product visualization. Interactive 3D environments help businesses achieve this by transforming static information into real-time experiences.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Instead of explaining products or processes through documents, companies can now showcase products interactively, simulate real-world environments, train employees virtually, and visualize operations in real time. This is where Unity Studio is helping enterprises modernize how they communicate, train, and operate.
              </p>
            </FadeUp>
          </div>

          {/* Mid-article image */}
          <FadeUp delay={0.1} className="mb-10 sm:mb-16">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-48 sm:h-[360px] md:h-[480px]">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&q=80"
                alt="Interactive 3D visualization"
                className="w-full h-full"
              />
            </div>
          </FadeUp>

          {/* Section 2 — How Businesses Are Using Unity Studio */}
          <div className="mb-10 sm:mb-16">
            <div className="mb-10 sm:mb-16">
              <FadeUp>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                  How Businesses Are<br />Using Unity Studio
                </h2>
              </FadeUp>
              <div className="w-full h-px bg-gray-300" />
            </div>

            {/* Manufacturing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-10 sm:mb-14">
              <FadeUp>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                  SECTION TWO<br />MANUFACTURING & INDUSTRIAL
                </h3>
              </FadeUp>
              <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  Manufacturers are using interactive 3D environments to visualize factory layouts, simulate equipment operations, and create digital twins of physical systems. This improves operational planning, maintenance workflows, and team collaboration. Businesses gain better visibility into operations before implementation.
                </p>
              </FadeUp>
            </div>

            {/* Product Demonstrations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-10 sm:mb-14">
              <FadeUp>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                  SECTION THREE<br />PRODUCT DEMONSTRATIONS
                </h3>
              </FadeUp>
              <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  Traditional product demos often limit customer understanding. With Unity Studio, businesses can create interactive product walkthroughs, real-time product configurators, and immersive customer presentations. This helps sales teams communicate product value more effectively and improve customer engagement.
                </p>
              </FadeUp>
            </div>

            {/* Employee Training */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-10 sm:mb-14">
              <FadeUp>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                  SECTION FOUR<br />EMPLOYEE TRAINING
                </h3>
              </FadeUp>
              <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  Training teams through manuals or videos can be time-consuming and inconsistent. Interactive simulations enable organizations to train employees in virtual environments, reduce onboarding time, and improve knowledge retention. Industries such as manufacturing, healthcare, and automotive are increasingly adopting simulation-based training to improve workforce readiness.
                </p>
              </FadeUp>
            </div>

            {/* AEC */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
              <FadeUp>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                  SECTION FIVE<br />ARCHITECTURE, ENGINEERING & CONSTRUCTION
                </h3>
              </FadeUp>
              <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  Businesses in AEC sectors are using real-time visualization for virtual walkthroughs, design collaboration, and project presentations. This helps stakeholders understand projects more clearly before construction begins, reducing costly revisions and improving project outcomes.
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
              "Interactive 3D is no longer limited to gaming or entertainment—it is becoming a core business tool for improving productivity, engagement, and operational visibility."
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-gray-400 text-sm sm:text-base uppercase tracking-widest font-medium">
              Sniper Systems &amp; Solutions, Unity Studio Report
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
                Business Benefits<br />of Interactive 3D
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
                { number: "50", suffix: "%", label: "Faster decision-making with 3D visualization" },
                { number: "40", suffix: "%", label: "Reduction in training time" },
                { number: "60", suffix: "%", label: "Improvement in customer engagement" },
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

      {/* ── Industry Use Cases ───────────────────────────────────────────────── */}
      <FadeUp className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8 sm:mb-12">
            <FadeUp>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight text-white">
                Industries Seeing<br />the Highest Adoption
              </h2>
            </FadeUp>
          </div>
          <div ref={industriesRef}>
            {industries.map((industry, i) => (
              <IndustryRow key={i} {...industry} index={i} inView={industriesInView} />
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ── Why This Matters in 2026 ──────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 sm:mb-16">
            <FadeUp>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Why This Matters<br />in 2026
              </h2>
            </FadeUp>
            <div className="w-full h-px bg-gray-300" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-14 sm:mb-20">
            <FadeUp>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                SECTION FINAL<br />THE FUTURE
              </h3>
            </FadeUp>
            <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Businesses are rapidly investing in digital transformation, real-time visualization, immersive customer experiences, and operational simulations. Interactive 3D is no longer limited to gaming or entertainment—it is becoming a core business tool for improving productivity, engagement, and operational visibility.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Organizations adopting these technologies early are gaining a competitive advantage in customer experience and workflow efficiency. With platforms like Unity Studio, enterprises can build scalable and immersive experiences that support modern business transformation.
              </p>
            </FadeUp>
          </div>

          {/* Final image */}
          <FadeUp delay={0.1}>
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-48 sm:h-[360px] md:h-[480px]">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80"
                alt="Future of interactive 3D in business"
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
              aria-label="Ready to transform your business with interactive 3D?"
            >
              {["Ready", "to", "transform", "your", "business?"].map((word, i) => (
                <span
                  key={i}
                  className="cta-word inline-block opacity-0 mr-[0.22em] last:mr-0"
                >
                  {word}
                  {word === "transform" && <br className="hidden sm:block" />}
                </span>
              ))}
            </h2>
          </div>
          <FadeUp delay={0.3}>
            <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-8 sm:mb-12 leading-relaxed">
              Talk to our team about the right Unity Studio solution for your business, budget, and goals.
            </p>
          </FadeUp>
          <FadeUp delay={0.45}>
            <a
              href="https://sniperindia.com/contact"
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

export default BlogC;
