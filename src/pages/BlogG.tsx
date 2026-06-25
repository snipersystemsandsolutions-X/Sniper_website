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
  Activity,
  Scale,
  Users,
  BarChart2,
  Shield,
  Cpu,
  Layers,
  Workflow
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
  post: { id: string; title: string; category: string; image: string; readTime: string };
}) => (
  <a href={`/blog/${post.id}`} className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
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
    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-snug group-hover:underline underline-offset-2">
        {post.title}
      </h3>
      <span className="text-xs text-gray-500 flex items-center gap-1.5 mt-4">
        <Clock className="w-3.5 h-3.5" /> {post.readTime}
      </span>
    </div>
  </a>
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
// ✦ BENEFIT CARD (Enterprise features)
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
// MAIN BLOG-G PAGE
// ========================================================
const BlogG = () => {
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
        stagger: 0.05,
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
    "Why Azure OpenAI Is Still the Default Enterprise Starting Point",
    "The Shift From Chatbots to Agentic AI",
    "Governance Is the New Differentiator, Not an Afterthought",
    "Grounding Agents in Real Business Context",
    "Productivity Gains: What Enterprises Are Actually Reporting",
    "Innovation Trends CIOs and CTOs Should Watch Through the Rest of 2026",
    "Getting Started: A Practical Framing",
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Regional Data Compliance",
      description:
        "Azure OpenAI keeps inference inside the same regional boundary, matching existing cloud footprints with regional data residency.",
    },
    {
      icon: Layers,
      title: "Multi-Model Flexibility",
      description:
        "Access to a sprawling catalog of foundation, open-source, reasoning, and industry-specific models through a unified API.",
    },
    {
      icon: Cpu,
      title: "Agent Identity & Entra ID",
      description:
        "Assign distinct workload identities to AI agents, enforcing authentication and auditing behaviors exactly like a human employee.",
    },
    {
      icon: Workflow,
      title: "Open Interoperability Standards",
      description:
        "Integration with Model Context Protocol (MCP) and Agent-to-Agent (A2A) protocols so agents can work seamlessly across platforms.",
    },
  ];

  const teams = [
    {
      icon: Briefcase,
      team: "Supply Chain",
      items: [
        "Monitor logistics feeds and automatically reroute shipments when events disrupt transit",
        "Escalate to human managers only above specified cost thresholds"
      ],
    },
    {
      icon: Activity,
      team: "Healthcare",
      items: [
        "Extract diagnostic codes from physician notes and pre-fill insurance claims",
        "Process protected health information inside confidential compute enclaves to satisfy HIPAA"
      ],
    },
    {
      icon: Scale,
      team: "Financial Audit",
      items: [
        "Scan contract repositories and flag clauses deviating from standard language",
        "Reduce manual audit workloads, providing a comprehensive head start instead of a blank page"
      ],
    },
    {
      icon: Users,
      team: "Sales & Accounts",
      items: [
        "Combine low-code conversational surfaces with pro-code multi-agent systems for complex queries",
        "Enforce human-in-the-loop approval gates before sending outputs to clients"
      ],
    },
  ];

  const relatedPosts = [
    {
      id: "microsoft-threat-protection-strengthening-enterprise-security",
      title: "Microsoft Threat Protection: Strengthening Enterprise Security Against Modern Cyber Threats",
      category: "Cybersecurity",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      readTime: "9 min read",
    },
    {
      id: "blogb",
      title: "Lenovo AI Powers a World Gone Football™",
      category: "Lenovo AI",
      image: "https://i.postimg.cc/c4XZj4V4/131659201.jpg",
      readTime: "10 min read",
    },
    {
      id: "bloga",
      title: "A Smarter Way to Document Work",
      category: "Adobe Acrobat",
      image: "https://i.postimg.cc/PrX7vbNy/adobe-acrobat-logo-on-background-(1).jpg",
      readTime: "8 min read",
    },
  ];

  const marqueeItems1 = [
    "Azure OpenAI Service",
    "Agentic AI",
    "Azure AI Foundry",
    "Enterprise Solutions",
    "Confidential Computing",
    "Digital Transformation",
  ];
  const marqueeItems2 = [
    "Entra Agent ID",
    "Model Context Protocol",
    "Multi-Model Strategy",
    "Enterprise Security & Governance",
    "AI Red Teaming",
    "Confidential Compute",
  ];
  const marqueeItems3 = [
    "Sniper Systems Insights",
    "Azure AI Trends 2026",
    "Innovation & Scalability",
    "AI-Native Infrastructure",
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
              <MetaPill icon={Tag} label="Enterprise AI" />
              <MetaPill icon={Calendar} label="June 25, 2026" />
              <MetaPill icon={Clock} label="10 min read" />
              <MetaPill icon={User} label="Sniper Systems" />
            </motion.div>

            <h1
              ref={heroHeadingRef}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight max-w-5xl mx-auto font-sans"
              aria-label="How Enterprises Are Using Azure OpenAI to Drive Productivity and Innovation in 2026"
            >
              {["How", "Enterprises", "Are", "Using", "Azure", "OpenAI", "to", "Drive", "Productivity", "and", "Innovation"].map((word, i) => (
                <span
                  key={i}
                  className="hero-word inline-block opacity-0 mr-[0.22em] last:mr-0"
                >
                  {word}
                  {(word === "Using" || word === "Drive") && <br className="hidden sm:block" />}
                </span>
              ))}
            </h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 1.55 }}
            >
              How Enterprises Are Using Azure OpenAI to Drive Productivity and Innovation
            </motion.p>

            <motion.p
              className="text-base sm:text-lg text-gray-750 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 1.7 }}
            >
              A couple of years ago, generative AI in the enterprise meant a chatbot bolted onto a help desk.
              In 2026, it means something closer to a digital workforce: AI agents that read contracts,
              reroute shipments, pre-fill insurance claims, and escalate to a human only when the stakes call for it.
              Azure OpenAI sits at the center of that shift for a large share of the world's largest companies.
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
                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1600&q=80"
                alt="Azure OpenAI and Enterprise Systems"
                className="w-full h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 z-10">
                  <div className="bg-black/50 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                    <span className="text-[10px] sm:text-sm font-medium uppercase tracking-widest">
                      AZURE OPENAI SERVICE
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

      {/* ── Article Body: Section 1 ──────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 sm:mb-16">
            <FadeUp>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Default Enterprise<br />Starting Point
              </h2>
            </FadeUp>
            <div className="w-full h-px bg-gray-300" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-10 sm:mb-16">
            <FadeUp>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                SECTION ONE<br />WHY AZURE OPENAI WINS
              </h3>
            </FadeUp>
            <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Azure OpenAI keeps coming up in cloud strategy conversations because it has quietly become infrastructure
                rather than just another API.{" "}
                <a
                  href="https://www.sniperindia.com/partners/cloud-solutions/index.html"
                  className="text-blue-600 hover:text-blue-800 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Microsoft's Azure OpenAI Service
                </a>{" "}
                now supports a large and fast-growing base of organizations, with usage climbing sharply as enterprises move from
                pilots into production. Azure AI Foundry—the platform Azure OpenAI now lives inside—has become the default building
                ground for a wide swath of enterprise and digital-native developers, including the great majority of the largest
                global companies.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Compliance boundaries already match their existing cloud footprint: Azure OpenAI keeps inference inside the
                same Azure compliance perimeter—regional data residency, private networking through VNETs and private endpoints,
                and Microsoft Entra ID authentication that security teams have already mapped for every other Azure service.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Furthermore, it avoids single-vendor lock-in. Azure AI Foundry gives access to a sprawling catalog of foundation,
                open-source, reasoning, and industry-specific models, including OpenAI, Anthropic, Meta, Mistral, xAI, and Microsoft's own
                first-party MAI models, through a single unified API. For organizations already standardized on Microsoft 365, Entra, and Defender,
                adding a new model to an existing Azure OpenAI deployment is an incremental configuration change, not a new vendor evaluation cycle.
              </p>
            </FadeUp>
          </div>

          {/* Mid-article image */}
          <FadeUp delay={0.1} className="mb-10 sm:mb-16">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-48 sm:h-[360px] md:h-[480px]">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&q=80"
                alt="Modern AI Cloud Infrastructure"
                className="w-full h-full"
              />
            </div>
          </FadeUp>

          {/* Section 2 — Chatbots to Agentic */}
          <div className="mb-10 sm:mb-16">
            <div className="mb-10 sm:mb-16">
              <FadeUp>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                  The Shift From<br />Chatbots to Agentic AI
                </h2>
              </FadeUp>
              <div className="w-full h-px bg-gray-300" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-10 sm:mb-14">
              <FadeUp>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                  SECTION TWO<br />TAKING ACTION
                </h3>
              </FadeUp>
              <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  The single biggest change in how enterprises use Azure OpenAI this year is the move from retrieval augmented generation
                  (answering questions) to agentic AI (taking action). RAG-based copilots solved the "find the right document" problem.
                  They rarely solved the underlying business problem, because most enterprise workflows require someone or something
                  to actually submit the form, update the record, or trigger the next step.
                </p>
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  Enterprises are transitioning rapidly to low-code conversational layers (handling the bulk of routine queries like shipment status)
                  coupled with pro-code multi-agent systems behind the scenes for complex, multi-source reasoning, with human-in-the-loop approval gates.
                </p>
              </FadeUp>
            </div>

            {/* Section 3 — Governance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
              <FadeUp>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                  SECTION THREE<br />GOVERNANCE & TRUST
                </h3>
              </FadeUp>
              <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  If the previous couple of years were about proving generative AI could work, 2026 is about proving it can be governed.
                  Industry surveys consistently show data privacy, security, and agent reliability as the top barriers to scaling AI past the pilot stage.
                  Shadow AI adoption touches a large share of enterprises, making ungoverned AI adoption a board-level risk.
                </p>
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  Microsoft's response, formalized through Azure AI Foundry's governed agent stack, centers on agent workload identities (Microsoft Entra Agent ID),
                  policy-as-code for agent behavior (YAML-based declarations), built-in observability (agent tracing and PyRIT framework safety checking),
                  and complete network isolation using bring-your-own-VNet and confidential compute enclaves.
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
              "For infrastructure heads evaluating platforms in 2026, the governance layer — not raw model benchmarks — is increasingly the deciding factor."
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-gray-400 text-sm sm:text-base uppercase tracking-widest font-medium">
              Sniper Systems &amp; Solutions, Azure AI Strategy Report
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
                Governance &amp;<br />Grounding Pillars
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
                { number: "90", suffix: "%", label: "Enterprises deploying reasoning models on Azure AI Foundry" },
                { number: "10", suffix: "×", label: "Increase in autonomous transaction-level agents in production" },
                { number: "3.5", suffix: "×", label: "Reduction in security evaluation cycles via pre-mapped Entra" },
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

      {/* ── Team Use Cases (Where Businesses See Impact) ──────────────────── */}
      <FadeUp className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8 sm:mb-12">
            <FadeUp>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight text-white">
                Enterprise Agentic<br />Use Cases in 2026
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
                  <span className="text-sm font-semibold text-gray-200 uppercase tracking-wider font-sans">
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

      {/* ── Future / Innovation Trends ───────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 sm:mb-16">
            <FadeUp>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Emerging Innovation &amp;<br />Cloud Trends
              </h2>
            </FadeUp>
            <div className="w-full h-px bg-gray-300" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-14 sm:mb-20">
            <FadeUp>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                SECTION FINAL<br />WHAT'S NEXT IN 2026
              </h3>
            </FadeUp>
            <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                A few emerging cloud trends are worth tracking as you plan budget and architecture for the rest of 2026:
                deliberate multi-model routing to avoid deep lock-in, managing agent sprawl via centralized identity,
                capacity planning around reserved GPU capacity (Provisioned Throughput Units), and sovereignty as table stakes.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                If you're scoping an Azure OpenAI initiative, follow a similar sequence: start with a narrow, well-bounded workflow where action
                creates measurable value; build the governance and observability layer before scaling; and treat model selection as a per-workload decision.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-semibold">
                Azure OpenAI's advantage isn't that it has the single best model—leadership shifts constantly. Its advantage is the surrounding
                enterprise infrastructure: identity, compliance boundaries, data grounding, and governance that organizations have already invested years in building.
              </p>
            </FadeUp>
          </div>

          {/* Final image */}
          <FadeUp delay={0.1}>
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-48 sm:h-[360px] md:h-[480px]">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&q=80"
                alt="The Future of AI Systems in Enterprise"
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
              aria-label="Ready to transform your enterprise operations with AI?"
            >
              {["Ready", "to", "scale", "your", "agents?"].map((word, i) => (
                <span
                  key={i}
                  className="cta-word inline-block opacity-0 mr-[0.22em] last:mr-0"
                >
                  {word}
                  {word === "scale" && <br className="hidden sm:block" />}
                </span>
              ))}
            </h2>
          </div>
          <FadeUp delay={0.3}>
            <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-8 sm:mb-12 leading-relaxed">
              Talk to our team of Azure AI architects about planning, securing, and deploying your agentic workforce.
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

export default BlogG;
