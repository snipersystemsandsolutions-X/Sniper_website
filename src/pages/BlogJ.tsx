import { Layout } from "@/components/Layout";
import { useSEO } from "@/hooks/useSEO";
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
  BarChart2,
  Users,
  Settings,
  Shield,
  Smartphone,
  Lock,
} from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

// ─── Shared easing ─────────────────────────────────────
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
          animation: `marqueeJ${reverse ? "Rev" : ""} 28s linear infinite`,
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
        @keyframes marqueeJ    { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes marqueeJRev { from { transform: translateX(-50%) } to { transform: translateX(0) } }
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
  const imgRef  = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const wrap = wrapRef.current;
    const img  = imgRef.current;
    if (!wrap || !img) return;
    const tween = gsap.fromTo(
      img,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: 1 },
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
const AnimatedCounter = ({ target, suffix = "" }: { target: string; suffix?: string }) => {
  const ref       = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);
  const numericMatch = target.match(/[\d.]+/);
  const numericValue = numericMatch ? parseFloat(numericMatch[0]) : null;
  const prefix    = numericValue !== null ? target.replace(/[\d.]+.*/, "") : "";

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
            if (el) el.textContent = prefix + Math.round(obj.val).toLocaleString() + suffix;
          },
        });
      },
    });
    return () => st.kill();
  }, [numericValue]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
};

// ========================================================
// ✦ META PILL
// ========================================================
const MetaPill = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
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
// ✦ TABLE OF CONTENTS ITEM
// ========================================================
const TocItem = ({ index, title, inView }: { index: number; title: string; inView: boolean }) => {
  const lineRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!inView || !lineRef.current) return;
    gsap.fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 1, ease: "power3.out", delay: 0.3 + index * 0.1 }
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
        <span className="text-gray-500 text-xs font-mono mt-1 flex-shrink-0">0{index + 1}</span>
        <span className="text-white text-sm sm:text-base font-medium leading-relaxed">{title}</span>
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
// ✦ BENEFIT CARD
// ========================================================
const BenefitCard = ({
  icon: Icon, title, description, index, inView,
}: {
  icon: React.ElementType; title: string; description: string; index: number; inView: boolean;
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
    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 leading-snug">{title}</h4>
    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);

// ========================================================
// ✦ CAPABILITY ROW (dark panel)
// ========================================================
const CapabilityRow = ({
  icon: Icon, area, items, index, inView,
}: {
  icon: React.ElementType; area: string; items: string[]; index: number; inView: boolean;
}) => (
  <motion.div
    className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-4 sm:gap-8 py-6 sm:py-8 border-b border-gray-700 last:border-b-0 items-start"
    initial={{ opacity: 0, x: -24 }}
    animate={inView ? { opacity: 1, x: 0 } : {}}
    transition={{ duration: 0.55, ease, delay: 0.1 + index * 0.07 }}
  >
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-gray-300" />
      </div>
      <span className="text-sm font-semibold text-gray-200 uppercase tracking-wider">{area}</span>
    </div>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 flex-shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  </motion.div>
);

// ========================================================
// MAIN BLOG-J PAGE
// ========================================================
const BlogJ = () => {
  const [showScrollTop,   setShowScrollTop]   = useState(false);
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);

  // ── GEO meta tags (India) ─────────────────────────────
  useEffect(() => {
    const geoTags: Array<[string, string]> = [
      ["geo.region",    "IN"],
      ["geo.placename", "India"],
      ["geo.position",  "20.5937;78.9629"],
      ["ICBM",          "20.5937, 78.9629"],
    ];
    const added: HTMLMetaElement[] = [];
    geoTags.forEach(([name, content]) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.name = name;
        document.head.appendChild(el);
        added.push(el);
      }
      el.content = content;
    });
    return () => added.forEach((el) => el.remove());
  }, []);

  // ── SEO ───────────────────────────────────────────────
  useSEO({
    title: "How Microsoft Intune Is Helping Enterprises Secure Hybrid Work and Simplify Endpoint Management",
    description:
      "Discover how Microsoft Intune enables enterprises in India to secure hybrid work, simplify endpoint management, and support Zero Trust across Windows, macOS, iOS, and Android devices.",
    keywords:
      "Microsoft Intune India, endpoint management India, hybrid work security, Zero Trust endpoint, BYOD management India, Microsoft Intune enterprise, MDM India, cloud-based device management, Intune BYOD security",
    ogTitle:
      "How Microsoft Intune Is Helping Enterprises Secure Hybrid Work and Simplify Endpoint Management",
    ogDescription:
      "Learn how Microsoft Intune helps organizations manage and secure endpoints across hybrid work environments using Zero Trust and automated compliance policies.",
    ogImage:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1600&q=80",
    ogUrl:
      "https://sniperindia.com/blog/how-microsoft-intune-is-helping-enterprises-secure-hybrid-work-and-simplify-endpoint-management",
    canonicalUrl:
      "https://sniperindia.com/blog/how-microsoft-intune-is-helping-enterprises-secure-hybrid-work-and-simplify-endpoint-management",
    twitterTitle:
      "How Microsoft Intune Is Helping Enterprises Secure Hybrid Work and Simplify Endpoint Management",
    twitterDescription:
      "Hybrid work expanded the attack surface. Discover how Microsoft Intune gives IT teams complete visibility and control across every endpoint.",
    twitterImage:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1600&q=80",
  });

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => { setShowScrollTop(window.scrollY > 300); ticking = false; });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── GSAP: hero word-stagger ────────────────────────────
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = heroHeadingRef.current;
    if (!el) return;
    const words = el.querySelectorAll(".hero-word");
    const tween = gsap.fromTo(
      words,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.07, delay: 1.2 }
    );
    return () => { tween.kill(); };
  }, []);

  // ── GSAP: hero image scale-on-scroll ──────────────────
  const heroImgWrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = heroImgWrapRef.current;
    if (!el) return;
    const tween = gsap.fromTo(
      el,
      { scale: 0.82, borderRadius: "2.5rem" },
      {
        scale: 1, borderRadius: "1.5rem", ease: "none",
        scrollTrigger: { trigger: el, start: "top 95%", end: "top 10%", scrub: 1.4 },
      }
    );
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);

  // ── GSAP: CTA word stagger ────────────────────────────
  const ctaHeadingRef = useRef<HTMLHeadingElement>(null);
  const ctaRef        = useRef(null);
  const ctaInView     = useInView(ctaRef, { once: true, margin: "-100px" });
  useEffect(() => {
    if (!ctaInView) return;
    const el = ctaHeadingRef.current;
    if (!el) return;
    const words = el.querySelectorAll(".cta-word");
    gsap.fromTo(words,
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.06, delay: 0.2 }
    );
  }, [ctaInView]);

  // ── Related posts stagger ─────────────────────────────
  const relatedGridRef   = useRef<HTMLDivElement>(null);
  const relatedRef       = useRef(null);
  const relatedInView    = useInView(relatedRef, { once: true, margin: "-60px" });
  const relatedTriggered = useRef(false);
  useEffect(() => {
    if (!relatedInView || relatedTriggered.current) return;
    relatedTriggered.current = true;
    const cards = relatedGridRef.current?.querySelectorAll(".related-card");
    if (!cards) return;
    gsap.fromTo(cards, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.12 });
  }, [relatedInView]);

  // ── Section inView refs ───────────────────────────────
  const heroRef      = useRef(null);
  const tocRef       = useRef(null);
  const statsRef     = useRef(null);
  const benefitsRef  = useRef(null);
  const capsRef      = useRef(null);

  const heroInView     = useInView(heroRef,     { once: true, margin: "-60px" });
  const tocInView      = useInView(tocRef,      { once: true, margin: "-60px" });
  const statsInView    = useInView(statsRef,    { once: true, margin: "-60px" });
  const benefitsInView = useInView(benefitsRef, { once: true, margin: "-60px" });
  const capsInView     = useInView(capsRef,     { once: true, margin: "-60px" });

  // ── Data ──────────────────────────────────────────────
  const tocItems = [
    "Why Traditional Device Management No Longer Works",
    "A New Approach to Endpoint Management",
    "Supporting Zero Trust in a Hybrid Workplace",
    "Simplifying IT Operations Through Automation",
    "Managing Corporate and Personal Devices Without Compromising Security",
    "Why Microsoft Intune Matters for Modern Businesses",
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Stronger Endpoint Security",
      description:
        "Conditional access policies and device compliance checks prevent unmanaged or non-compliant devices from accessing sensitive business data.",
    },
    {
      icon: Settings,
      title: "Automated IT Operations",
      description:
        "Deploy security configs, apps, VPN profiles, and OS updates automatically — reducing repetitive admin work and shortening deployment times.",
    },
    {
      icon: Smartphone,
      title: "Cross-Platform Management",
      description:
        "Manage Windows, macOS, iOS, Android, and Linux devices from a single centralized console without traditional on-premises infrastructure.",
    },
    {
      icon: Lock,
      title: "BYOD Without Compromise",
      description:
        "Separate corporate data from personal content through application protection policies, balancing security with employee privacy.",
    },
  ];

  const capabilities = [
    {
      icon: Shield,
      area: "Zero Trust",
      items: [
        "Verify device compliance before granting access to corporate resources",
        "Integrated with Microsoft Entra ID and Microsoft Defender for conditional access",
      ],
    },
    {
      icon: Settings,
      area: "Automation",
      items: [
        "Define policies once and auto-deploy security configs, Wi-Fi, VPN, and apps",
        "Automated patch management keeps endpoints healthy without manual effort",
      ],
    },
    {
      icon: Smartphone,
      area: "BYOD",
      items: [
        "App protection policies separate work and personal data on employee devices",
        "Protect business data without accessing employees' personal content",
      ],
    },
    {
      icon: BarChart2,
      area: "Visibility",
      items: [
        "Endpoint analytics surface potential issues before they affect productivity",
        "Monitor compliance and device health across the entire fleet in real time",
      ],
    },
    {
      icon: Users,
      area: "Onboarding",
      items: [
        "Automate device provisioning so new employees are productive from day one",
        "Self-service enrollment reduces IT workload during high-volume hiring periods",
      ],
    },
  ];

  const relatedPosts = [
    {
      title: "Microsoft Threat Protection: Strengthening Enterprise Security Against Modern Cyber Threats",
      category: "Cybersecurity",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      readTime: "9 min read",
    },
    {
      title: "How Enterprises Are Using Azure OpenAI to Drive Productivity and Innovation in 2026",
      category: "Cloud AI",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
      readTime: "11 min read",
    },
    {
      title: "The Future of Business Transformation: Cloud Solutions for Indian Enterprises",
      category: "Cloud Solutions",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      readTime: "15 min read",
    },
  ];

  const marqueeItems1 = [
    "Sniper Systems Blog",
    "Microsoft Intune",
    "Endpoint Management",
    "Hybrid Work Security",
    "Zero Trust",
    "BYOD Management",
  ];
  const marqueeItems2 = [
    "Microsoft Entra ID",
    "Microsoft Defender",
    "Conditional Access",
    "Device Compliance",
    "MDM India",
    "Cloud Security",
    "IT Automation",
  ];
  const marqueeItems3 = [
    "Stay Informed",
    "Technology Insights",
    "Sniper Systems",
    "Microsoft Partner India",
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
              <MetaPill icon={Tag}      label="Endpoint Security" />
              <MetaPill icon={Calendar} label="July 2, 2026" />
              <MetaPill icon={Clock}    label="9 min read" />
              <MetaPill icon={User}     label="Sniper Systems" />
            </motion.div>

            <h1
              ref={heroHeadingRef}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              aria-label="How Microsoft Intune Is Helping Enterprises Secure Hybrid Work and Simplify Endpoint Management"
            >
              {["Securing", "Hybrid", "Work", "with", "Intune"].map((word, i) => (
                <span key={i} className="hero-word inline-block opacity-0 mr-[0.22em] last:mr-0">
                  {word}
                  {word === "Work" && <br className="hidden sm:block" />}
                </span>
              ))}
            </h1>

           <motion.p
  className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium mb-3 sm:mb-4"
  initial={{ opacity: 0, y: 20 }}
  animate={heroInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.7, ease, delay: 1.55 }}
>
  How{" "}
  <a
    href="https://www.sniperindia.com/partners/microsoft/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 hover:text-blue-800 hover:underline font-semibold"
  >
    Microsoft
  </a>{" "}
  Intune Is Helping Enterprises Secure Hybrid Work and Simplify Endpoint Management
</motion.p>

            <motion.p
              className="text-base sm:text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 1.7 }}
            >
              Hybrid work expanded the organization's attack surface. Employees now access
              business applications from laptops, personal phones, tablets, and cloud platforms
              across multiple locations. For IT leaders, ensuring every endpoint remains secure,
              compliant, and manageable — without disrupting the employee experience — is the
              defining challenge of modern enterprise IT.
            </motion.p>
          </div>

          {/* Hero image */}
          <motion.div
            className="max-w-6xl mx-auto pt-6 sm:pt-8 lg:pt-12"
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          >
            <div
              ref={heroImgWrapRef}
              className="relative shadow-2xl overflow-hidden h-56 sm:h-96 md:h-[500px] lg:h-[600px]"
              style={{ borderRadius: "2.5rem", willChange: "transform, border-radius", transformOrigin: "center center" }}
            >
              <ParallaxImage
                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1600&q=80"
                alt="Microsoft Intune enterprise endpoint management hybrid work security"
                className="w-full h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 z-10">
                  <div className="bg-black/50 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                    <span className="text-[10px] sm:text-sm font-medium uppercase tracking-widest">
                      MICROSOFT INTUNE
                    </span>
                  </div>
                </div>
              </ParallaxImage>
            </div>
          </motion.div>
        </div>
      </section>

      <MarqueeTicker items={marqueeItems1} />

      {/* ── Table of Contents ────────────────────────────────────────────── */}
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

      {/* ── Section 1: Why Traditional Management Fails ──────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">

          <div className="mb-10 sm:mb-16">
            <FadeUp>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Why Traditional Device<br />Management No Longer Works
              </h2>
            </FadeUp>
            <div className="w-full h-px bg-gray-300" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-10 sm:mb-16">
            <FadeUp>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                SECTION ONE<br />THE OLD APPROACH
              </h3>
            </FadeUp>
            <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Not long ago, managing corporate devices was relatively straightforward.
                Employees worked from the office, laptops rarely left the building, and
                IT teams had direct control over every endpoint connected to the network.
                Today's workplace looks very different.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Modern organizations manage a mix of Windows laptops, macOS devices,
                Android phones, iPhones, and tablets. Add Bring Your Own Device policies
                and remote work, and the complexity grows quickly. Without centralized
                management, IT teams face inconsistent security policies, manual deployments,
                delayed onboarding, limited endpoint visibility, and increased risk from
                non-compliant devices — challenges that affect business continuity, employee
                productivity, and regulatory compliance.
              </p>
            </FadeUp>
          </div>

          {/* Mid-article image */}
          <FadeUp delay={0.1} className="mb-10 sm:mb-16">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-48 sm:h-[360px] md:h-[480px]">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80"
                alt="Enterprise IT endpoint management complexity"
                className="w-full h-full"
              />
            </div>
          </FadeUp>

          {/* Section 2 — New Approach */}
          <div className="mb-10 sm:mb-16">
            <div className="mb-10 sm:mb-16">
              <FadeUp>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                  A New Approach to<br />Endpoint Management
                </h2>
              </FadeUp>
              <div className="w-full h-px bg-gray-300" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-10 sm:mb-14">
              <FadeUp>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                  SECTION TWO<br />MICROSOFT INTUNE
                </h3>
              </FadeUp>
              <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  Modern endpoint management is about more than controlling devices. It's
                  about enabling employees to work securely from anywhere while giving IT
                  teams complete visibility and control. Microsoft Intune provides a
                  cloud-based platform that enables organizations to manage Windows, macOS,
                  iOS, Android, and Linux devices from a centralized console without
                  requiring traditional on-premises infrastructure.
                </p>
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  Instead of configuring each device individually, IT teams can automate
                  provisioning, deploy security policies, manage business applications
                  remotely, and monitor device compliance throughout the device lifecycle.
                  The result is a more consistent, secure, and scalable endpoint environment
                  that supports the way modern organizations actually work.
                </p>
              </FadeUp>
            </div>
          </div>

          {/* Section 3 — Zero Trust */}
          <div className="mb-10 sm:mb-16">
            <div className="mb-10 sm:mb-16">
              <FadeUp>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                  Supporting Zero Trust<br />in a Hybrid Workplace
                </h2>
              </FadeUp>
              <div className="w-full h-px bg-gray-300" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
              <FadeUp>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                  SECTION THREE<br />ZERO TRUST SECURITY
                </h3>
              </FadeUp>
              <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  Security strategies are evolving from trusting network locations to
                  continuously verifying users, devices, and access requests. Microsoft
                  Intune plays an important role in a Zero Trust architecture by helping
                  organizations verify device compliance before granting access to corporate
                  resources.
                </p>
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  Integrated with Microsoft Entra ID and Microsoft Defender, Intune enables
                  conditional access policies that reduce the risk of compromised or
                  unmanaged devices accessing sensitive business data. Rather than relying
                  on perimeter-based security, organizations can apply consistent security
                  policies regardless of where employees work.
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
              "Endpoint management is no longer just an IT function — it's a business enabler."
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-gray-400 text-sm sm:text-base uppercase tracking-widest font-medium">
              Sniper Systems &amp; Solutions, Microsoft Partner India
            </p>
          </FadeUp>
        </div>
      </FadeUp>

      {/* ── Capabilities Panel ──────────────────────────────────────────── */}
      <FadeUp className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8 sm:mb-12">
            <FadeUp>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight text-white">
                What Intune Enables<br />Across Your Organization
              </h2>
            </FadeUp>
          </div>
          <div ref={capsRef}>
            {capabilities.map((c, i) => (
              <CapabilityRow
                key={i}
                icon={c.icon}
                area={c.area}
                items={c.items}
                index={i}
                inView={capsInView}
              />
            ))}
          </div>
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
                { number: "60", suffix: "%", label: "Reduction in device provisioning time reported by organizations using Intune automation" },
                { number: "3",  suffix: "×", label: "Faster security policy deployment across endpoints compared to on-premises MDM" },
                { number: "45", suffix: "%", label: "Decrease in endpoint-related security incidents after deploying Zero Trust policies" },
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

      {/* ── Sections 4 & 5: Automation + BYOD ──────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Automation */}
          <div className="mb-10 sm:mb-16">
            <div className="mb-10 sm:mb-16">
              <FadeUp>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                  Simplifying IT Through<br />Automation
                </h2>
              </FadeUp>
              <div className="w-full h-px bg-gray-300" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
              <FadeUp>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                  SECTION FOUR<br />IT AUTOMATION
                </h3>
              </FadeUp>
              <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  One of the biggest advantages of cloud-based endpoint management is
                  automation. Instead of manually configuring every new laptop or mobile
                  device, IT administrators can define policies once and automatically
                  deploy security configurations, Wi-Fi profiles, VPN settings, business
                  applications, OS updates, and compliance policies.
                </p>
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  This reduces repetitive administrative work, shortens deployment times,
                  and creates a more consistent user experience across the organization.
                  Automated patch management and endpoint analytics also help IT teams
                  proactively maintain device health and identify potential issues before
                  they affect productivity.
                </p>
              </FadeUp>
            </div>
          </div>

          {/* Mid image */}
          <FadeUp delay={0.1} className="mb-10 sm:mb-16">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-48 sm:h-[360px] md:h-[480px]">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1600&q=80"
                alt="Mobile device management BYOD enterprise security"
                className="w-full h-full"
              />
            </div>
          </FadeUp>

          {/* BYOD */}
          <div className="mb-10 sm:mb-16">
            <div className="mb-10 sm:mb-16">
              <FadeUp>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                  Corporate and Personal<br />Devices, Balanced
                </h2>
              </FadeUp>
              <div className="w-full h-px bg-gray-300" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-14 sm:mb-20">
              <FadeUp>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                  SECTION FIVE<br />BYOD SECURITY
                </h3>
              </FadeUp>
              <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  Many organizations now support BYOD programs to improve flexibility and
                  reduce hardware costs. However, securing personal devices while respecting
                  employee privacy remains a significant concern. Microsoft Intune addresses
                  this by separating corporate data from personal information through
                  application protection policies and device management capabilities.
                </p>
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                  Organizations can protect business data without gaining unnecessary
                  visibility into employees' personal content. This balance between security
                  and user privacy has become increasingly important as hybrid work continues
                  to evolve — and it's a key reason enterprises are choosing Intune as their
                  central endpoint management platform.
                </p>
              </FadeUp>
            </div>
          </div>

          {/* Final image */}
          <FadeUp delay={0.1}>
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-48 sm:h-[360px] md:h-[480px]">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1600&q=80"
                alt="Future of enterprise endpoint management and secure hybrid work"
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

          <div ref={relatedGridRef} className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8">
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
              aria-label="Ready to secure your endpoints with Microsoft Intune?"
            >
              {["Ready", "to", "secure", "every", "endpoint?"].map((word, i) => (
                <span key={i} className="cta-word inline-block opacity-0 mr-[0.22em] last:mr-0">
                  {word}
                  {word === "secure" && <br className="hidden sm:block" />}
                </span>
              ))}
            </h2>
          </div>
          <FadeUp delay={0.3}>
            <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-8 sm:mb-12 leading-relaxed">
              Talk to our team about Microsoft Intune deployment, Zero Trust strategy, and endpoint security for your organization.
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

export default BlogJ;
