import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, CheckCircle, DollarSign, Lock, TrendingUp } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

import React from "react";
import { Helmet } from "react-helmet-async";



      <Helmet>

        {/* BASIC SEO */}

        <title>Device Deployment & MDM Solutions in India | Enterprise Mobility | Sniper Systems</title>

        <meta
          name="description"
          content="Sniper Systems delivers secure device deployment and mobile device management (MDM) solutions across India. Enable centralized control, seamless onboarding, and enterprise-grade security for business devices."
        />

        <meta
          name="keywords"
          content="device deployment services Chennai, mobile device management India, MDM solutions Chennai, enterprise mobility solutions, device management services"
        />

        <meta name="robots" content="index, follow" />

        <link
          rel="canonical"
          href="https://sniperindia.com/solutions/device-deployment-mdm"
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
          content="Device Deployment & MDM Solutions | Sniper Systems"
        />

        <meta
          property="og:description"
          content="Secure, manage, and deploy enterprise devices with scalable MDM and mobility solutions."
        />

        <meta
          property="og:image"
          content="https://sniperindia.com/wp-content/uploads/2023/09/sniper-systems-banner.jpg"
        />

        <meta
          property="og:url"
          content="https://sniperindia.com/solutions/device-deployment-mdm"
        />

        {/* TWITTER SEO */}

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="Mobile Device Management & Deployment | Sniper Systems"
        />

        <meta
          name="twitter:description"
          content="Manage and secure enterprise devices with advanced MDM and deployment solutions."
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
            "serviceType": "Device Deployment & Mobile Device Management (MDM)",
            "provider": {
              "@type": "Organization",
              "name": "Sniper Systems"
            },
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "description": "Enterprise device deployment and mobile device management solutions for secure, scalable, and centralized device control."
          }
          `}
</script>

        {/* FAQ SCHEMA */}

        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is Mobile Device Management (MDM)?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Mobile Device Management (MDM) is a solution that enables organizations to manage, monitor, and secure mobile devices accessing corporate data."
                }
              },
              {
                "@type": "Question",
                "name": "Why is device deployment important for businesses?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Device deployment ensures efficient setup, configuration, and onboarding of devices, reducing downtime and improving productivity."
                }
              },
              {
                "@type": "Question",
                "name": "What are the benefits of MDM solutions?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "MDM solutions provide centralized control, security enforcement, remote management, and compliance for enterprise devices."
                }
              }
            ]
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
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Device Deployment & MDM",
                "item": "https://sniperindia.com/solutions/device-deployment-mdm"
              }
            ]
          }
          `}
</script>

      </Helmet>

gsap.registerPlugin(ScrollTrigger);

// ========================================================
// TYPES
// ========================================================
interface BenefitItem {
  icon: React.ElementType;
  label: string;
  description: string;
}

interface ChallengeItem {
  title: string;
  description: string;
}

interface SolutionItem {
  title: string;
  description: string;
}

interface StatItem {
  value: string;
  text: string;
}

interface ImgCard {
  src: string;
  alt: string;
}

// ========================================================
// MARQUEE TICKER
// ========================================================
const MarqueeTicker = ({
  items,
  speed = 26,
  reverse = false,
}: {
  items: string[];
  speed?: number;
  reverse?: boolean;
}) => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const raf = requestAnimationFrame(() => {
      const totalWidth = track.scrollWidth / 2;
      const tween = gsap.to(track, {
        x: reverse ? `${totalWidth}px` : `-${totalWidth}px`,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
      return () => tween.kill();
    });
    return () => cancelAnimationFrame(raf);
  }, [speed, reverse]);

  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden bg-gray-950 py-3 md:py-4 border-y border-gray-800">
      <div
        ref={trackRef}
        className="flex gap-8 md:gap-10 whitespace-nowrap will-change-transform"
      >
        {doubled.map((text, i) => (
          <span
            key={i}
            className="flex items-center gap-8 md:gap-10 text-[10px] md:text-[11px] font-semibold tracking-[0.18em] md:tracking-[0.22em] uppercase text-gray-500"
          >
            {text}
            <span className="w-1.5 h-1.5 rounded-full bg-gray-700 inline-block flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
};

// ========================================================
// PARALLAX IMAGE
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

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = "ontouchstart" in window;
    if (prefersReducedMotion || isTouch) return;

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      animation: gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: "none" }),
    });

    return () => st.kill();
  }, []);

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className ?? ""}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover scale-110 will-change-transform"
      />
      {children}
    </div>
  );
};

// ========================================================
// BENEFITS LIST
// ========================================================
const BenefitsList = ({
  items,
  inView,
}: {
  items: BenefitItem[];
  inView: boolean;
}) => {
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!inView) return;
    linesRef.current.forEach((line, i) => {
      if (!line) return;
      gsap.fromTo(
        line,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 1, ease: "power3.out", delay: 0.3 + i * 0.12 }
      );
    });
  }, [inView]);

  return (
    <div className="space-y-8 md:space-y-12">
      {items.map((benefit, index) => (
        <motion.div
          key={index}
          className="relative pb-8 md:pb-12 last:pb-0"
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.2 + index * 0.1,
          }}
        >
          <div className="flex flex-col md:grid md:grid-cols-12 md:gap-8 md:items-center gap-4">
            <div className="md:col-span-2 flex justify-start">
              <benefit.icon className="w-7 h-7 md:w-8 md:h-8 text-white flex-shrink-0" />
            </div>
            <div className="md:col-span-3">
              <p className="text-xs md:text-sm font-medium text-gray-400 uppercase tracking-wider">
                {benefit.label}
              </p>
            </div>
            <div className="md:col-span-7">
              <p className="text-base md:text-lg text-gray-200 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          </div>

          {index < items.length - 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-700 overflow-hidden">
              <div
                ref={(el) => { linesRef.current[index] = el; }}
                className="h-full bg-gradient-to-r from-transparent via-gray-400 to-transparent"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// ========================================================
// MAGNETIC CTA LINK
// ========================================================
const MagneticCTALink = ({
  to,
  children,
  className,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const btnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn || "ontouchstart" in window) return;

    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
      gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: "power2.out" });
    };
    const onLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.5)" });
    };

    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);

    return () => {
      btn.removeEventListener("mousemove", onMove);
      btn.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <a
      ref={btnRef}
      href={to}
      className={`will-change-transform ${className ?? ""}`}
    >
      {children}
    </a>
  );
};

// ========================================================
// WHITE SCREEN TRANSITION
// ========================================================
const WhiteScreenTransition = ({ onComplete }: { onComplete: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      yPercent: -105,
      duration: 0.9,
      ease: "power3.inOut",
      delay: 0.2,
      onComplete,
    });
  }, [onComplete]);

  return (
    <div ref={ref} className="fixed inset-0 bg-white z-[9999] will-change-transform" />
  );
};

// ========================================================
// CHALLENGE CARD
// ========================================================
const ChallengeCard = ({
  challenge,
  index,
}: {
  challenge: ChallengeItem;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  useEffect(() => {
    if (!inView || !lineRef.current) return;
    gsap.fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 1, ease: "power3.out", delay: 0.1 + (index % 2) * 0.1 }
    );
  }, [inView, index]);

  return (
    <motion.div
      ref={ref}
      className="relative grid grid-cols-1 gap-4 md:gap-6 items-start pb-10 md:pb-12"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease, delay: index * 0.1 }}
    >
      <h3 className="text-xs md:text-sm font-semibold text-gray-900 uppercase tracking-wider">
        {challenge.title}
      </h3>
      <p className="text-base md:text-lg text-gray-800 leading-relaxed">
        {challenge.description}
      </p>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="inline-block"
      >
        <a
          href="/contact"
          className="inline-flex items-center w-fit px-6 md:px-8 py-2.5 md:py-3 border-2 border-gray-900 rounded-full text-gray-900 font-medium text-sm md:text-base hover:bg-gray-900 hover:text-white transition-colors duration-300"
        >
          Get Solution
        </a>
      </motion.div>
      <div className="absolute bottom-4 left-0 right-0 h-px bg-gray-300 overflow-hidden">
        <div
          ref={lineRef}
          className="h-full bg-gradient-to-r from-transparent via-gray-600 to-transparent"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </motion.div>
  );
};

// ========================================================
// SOLUTION CARD
// ========================================================
const SolutionCard = ({
  solution,
  index,
}: {
  solution: SolutionItem;
  index: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  useEffect(() => {
    const card = cardRef.current;
    if (!card || "ontouchstart" in window) return;
    const onEnter = () => gsap.to(card, { y: -6, duration: 0.4, ease: "power2.out" });
    const onLeave = () => gsap.to(card, { y: 0, duration: 0.5, ease: "elastic.out(1,0.5)" });
    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease, delay: (index % 2) * 0.1 }}
    >
      <div
        ref={cardRef}
        className="bg-gray-900 rounded-xl md:rounded-2xl p-6 md:p-8 border border-gray-800 hover:border-gray-600 transition-colors duration-300 will-change-transform h-full"
      >
        <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">
          {solution.title}
        </h3>
        <p className="text-base md:text-lg text-gray-300 leading-relaxed">
          {solution.description}
        </p>
      </div>
    </motion.div>
  );
};

// ========================================================
// INTRO LINE
// ========================================================
const IntroLine = ({ inView }: { inView: boolean }) => {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!inView || !lineRef.current) return;
    gsap.fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 1.2, ease: "power3.out", delay: 0.4 }
    );
  }, [inView]);

  return (
    <div className="w-full h-px bg-gray-300 overflow-hidden">
      <div
        ref={lineRef}
        className="h-full bg-gradient-to-r from-transparent via-gray-600 to-transparent"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
};

// ========================================================
// MAIN PAGE
// ========================================================
const DeviceDeploymentMDM = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const handleWhiteScreenComplete = () => setShowWhiteScreen(false);

  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  // ---- Data ----
  const benefits: BenefitItem[] = [
    {
      icon: TrendingUp,
      label: "EFFICIENCY",
      description:
        "Streamline the deployment of devices across your organization, saving time and resources.",
    },
    {
      icon: Lock,
      label: "SECURITY",
      description:
        "Ensure that all devices are securely managed and compliant with company policies and regulations.",
    },
    {
      icon: CheckCircle,
      label: "PRODUCTIVITY",
      description:
        "Empower teams with seamless access to essential tools and resources on their mobile devices, enhancing productivity and collaboration.",
    },
    {
      icon: DollarSign,
      label: "COST SAVINGS",
      description:
        "Optimise device usage and reduce unnecessary expenses through efficient management and monitoring.",
    },
  ];

  const challenges: ChallengeItem[] = [
    {
      title: "Device Fragmentation",
      description: "Managing diverse devices and platforms can lead to fragmentation and complexity.",
    },
    {
      title: "Security Risks",
      description: "Unmanaged devices pose security risks, exposing sensitive data.",
    },
    {
      title: "Resource Drain",
      description: "Manual deployment is time-consuming and resource-intensive.",
    },
  ];

  const solutions: SolutionItem[] = [
    {
      title: "Automated Deployment",
      description: "Automation reduces manual efforts and ensures consistency.",
    },
    {
      title: "Centralized Management",
      description: "Manage all devices from a single dashboard with seamless monitoring and updates.",
    },
    {
      title: "Security Features",
      description: "Implement encryption, access controls, and threat protection.",
    },
    {
      title: "Expert Support",
      description: "Industry-leading help for deployment, monitoring, and management.",
    },
  ];

  const stats: StatItem[] = [
    { value: "90%", text: "of companies claim MDM allows them to embrace BYOD easier." },
    { value: "42%", text: "of enterprises think of themselves as mobile-first." },
  ];

  const imgCards: ImgCard[] = [
    { src: "https://i.postimg.cc/NMf3DHN7/Mobile-Phone-Security.jpg", alt: "Automated Deployment" },
    { src: "https://i.postimg.cc/6QBg6ZxS/Untitled-29.webp",          alt: "Centralized Management" },
  ];

  // ---- Section refs ----
  const heroRef    = useRef(null);
  const introRef   = useRef(null);
  const statsRef   = useRef(null);
  const whyRef     = useRef(null);
  const featRef    = useRef(null);
  const challRef   = useRef(null);
  const helpRef    = useRef(null);
  const imgGridRef = useRef(null);
  const ctaRef     = useRef(null);

  const heroInView    = useInView(heroRef,    { once: true, margin: "-60px" });
  const introInView   = useInView(introRef,   { once: true, margin: "-60px" });
  const statsInView   = useInView(statsRef,   { once: true, margin: "-60px" });
  const whyInView     = useInView(whyRef,     { once: true, margin: "-60px" });
  const featInView    = useInView(featRef,    { once: true, margin: "-60px" });
  const challInView   = useInView(challRef,   { once: true, margin: "-60px" });
  const helpInView    = useInView(helpRef,    { once: true, margin: "-60px" });
  const imgGridInView = useInView(imgGridRef, { once: true, margin: "-60px" });
  const ctaInView     = useInView(ctaRef,     { once: true, margin: "-100px" });

  // ---- GSAP: Hero heading word-stagger ----
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = heroHeadingRef.current;
    if (!el) return;
    const words = el.querySelectorAll(".hero-word");
    gsap.fromTo(
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
  }, []);

  // ---- GSAP: CTA heading word stagger ----
  const ctaHeadingRef = useRef<HTMLHeadingElement>(null);
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

  // ---- GSAP: Stats stagger ----
  const statsGridRef = useRef<HTMLDivElement>(null);
  const statsTriggered = useRef(false);
  useEffect(() => {
    if (!statsInView || statsTriggered.current) return;
    statsTriggered.current = true;
    const items = statsGridRef.current?.querySelectorAll(".stat-item");
    if (!items) return;
    gsap.fromTo(
      items,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.2 }
    );
  }, [statsInView]);

  // ---- GSAP: Image grid stagger ----
  const imgPairRef = useRef<HTMLDivElement>(null);
  const imgTriggered = useRef(false);
  useEffect(() => {
    if (!imgGridInView || imgTriggered.current) return;
    imgTriggered.current = true;
    const imgs = imgPairRef.current?.querySelectorAll(".img-card");
    if (!imgs) return;
    gsap.fromTo(
      imgs,
      { opacity: 0, y: () => gsap.utils.random(20, 45) },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: { amount: 0.4, from: "start" },
      }
    );
  }, [imgGridInView]);

  // ---- Marquee data ----
  const marqueeItems  = ["Device Deployment", "Mobile Device Management", "MDM", "Automated Deployment", "Centralized Management", "Security Features"];
  const marqueeItems2 = ["Efficiency", "Security", "Productivity", "Cost Savings", "BYOD", "Device Fragmentation", "Expert Support"];
  const marqueeItems3 = ["Streamline Device Management", "Smarter Businesses", "Future-Proof Tech", "Sniper Systems", "Unstoppable Growth"];

  // ---- Hero words ----
  const heroWords: (string | React.ReactElement)[] = [
    "Device", "Deployment", "&", <br key="br" />, "Mobile", "Device", "Management",
  ];

  const ctaWords: (string | React.ReactElement)[] = [
    "Ready", "to", "streamline", <br key="br2" />, "your", "devices?",
  ];

  return (
    <Layout>
      {showWhiteScreen && (
        <WhiteScreenTransition onComplete={handleWhiteScreenComplete} />
      )}

      {/* ==================== HERO ==================== */}
      <section className="relative bg-white pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-white opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16" ref={heroRef}>

            <motion.p
              className="text-sm md:text-xl text-gray-700 mb-4 md:mb-6 uppercase tracking-wider font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 1.0 }}
            >
              Elevate Your Work Environment with Sniper Systems and Solutions
            </motion.p>

            <h1
              ref={heroHeadingRef}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-6 leading-tight font-sans"
              aria-label="Device Deployment & Mobile Device Management"
            >
              {heroWords.map((word, i) =>
                typeof word !== "string" ? (
                  word
                ) : (
                  <span
                    key={i}
                    className="hero-word inline-block opacity-0 mr-[0.2em] last:mr-0"
                  >
                    {word}
                  </span>
                )
              )}
            </h1>
          </div>

          {/* Hero image */}
          <div className="max-w-6xl mx-auto pt-8 md:pt-12">
            <motion.div
              className="relative rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden h-56 sm:h-72 md:h-[500px] lg:h-[600px]"
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 1, ease, delay: 0.25 }}
            >
              <ParallaxImage
                src="https://i.postimg.cc/SQ7TZ9dd/Mobile-Device-Management-MDM.png"
                alt="Device Management"
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 z-10">
                <div className="bg-black bg-opacity-50 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full backdrop-blur-sm">
                  <span className="text-xs md:text-sm font-medium">DEVICE DEPLOYMENT & MDM</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee 1 */}
      <MarqueeTicker items={marqueeItems} speed={24} />

      {/* ==================== INTRODUCTION ==================== */}
      <section className="bg-white py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto" ref={introRef}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start pb-10 md:pb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={introInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 0.1 }}
            >
              <h2 className="text-xs md:text-sm font-semibold text-gray-900 uppercase tracking-wider">
                OPTIMIZING TEAM PERFORMANCE
              </h2>
            </motion.div>
            <motion.div
              className="space-y-4 md:space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={introInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 0.22 }}
            >
              <p className="text-base md:text-lg text-gray-800 leading-relaxed">
                Efficient device management is pivotal for optimal team performance. It ensures that
                devices are properly configured, updated, and secured, allowing teams to work
                seamlessly without disruptions.
              </p>
              <p className="text-base md:text-lg text-gray-800 leading-relaxed">
                By managing devices effectively, organisations can maximise productivity, streamline
                workflows, and minimise downtime. This leads to improved efficiency, collaboration,
                and overall performance, enabling teams to achieve their best results.
              </p>
            </motion.div>
          </div>
          <IntroLine inView={introInView} />
        </div>
      </section>

      {/* ==================== STATS ==================== */}
      <section className="bg-white py-16 md:py-20 px-4 md:px-6" ref={statsRef}>
        <div className="max-w-6xl mx-auto">
          <div
            ref={statsGridRef}
            className="grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-12 lg:gap-16"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="stat-item opacity-0 text-center lg:text-left"
              >
                <div className="text-5xl md:text-6xl lg:text-7xl text-gray-900 mb-3 md:mb-4 font-semibold">
                  {stat.value}
                </div>
                <p className="text-gray-600 text-base md:text-lg">{stat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== WHY MDM ==================== */}
      <motion.section
        ref={whyRef}
        className="bg-black text-white py-16 md:py-20 px-4 md:px-6 rounded-[2.5rem] md:rounded-[4rem] mx-4 md:mx-6 my-10 md:my-12"
        initial={{ opacity: 0, y: 60 }}
        animate={whyInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={whyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
            >
              Why Device Deployment
              <br />
              &amp; MDM?
            </motion.h2>
          </div>
          <BenefitsList items={benefits} inView={whyInView} />
        </div>
      </motion.section>

      {/* Marquee 2 */}
      <MarqueeTicker items={marqueeItems2} speed={20} reverse />

      {/* ==================== FEATURED IMAGE ==================== */}
      <section className="relative bg-white py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto" ref={featRef}>
          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-8 md:mb-12 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={featInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease }}
          >
            Seamless device
            <br />
            management at scale
          </motion.h2>
          <motion.div
            /* Fixed: was "w-80px h-80px" which is not a valid Tailwind class */
            className="relative rounded-2xl md:rounded-3xl overflow-hidden h-64 sm:h-80 md:h-[500px] lg:h-[600px] xl:h-[700px]"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={featInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1, ease, delay: 0.15 }}
          >
            <ParallaxImage
              src="https://i.postimg.cc/JhxCVF5V/What-is-Mobile-Device-Management.png"
              alt="Device Management Dashboard"
              className="w-full h-full"
            />
          </motion.div>
        </div>
      </section>

      {/* ==================== INDUSTRY CHALLENGES ==================== */}
      <section className="bg-white py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto" ref={challRef}>
          <div className="mb-12 md:mb-16">
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={challInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease }}
            >
              Industry challenges
            </motion.h2>
          </div>
          <div className="space-y-0">
            {challenges.map((challenge, index) => (
              <ChallengeCard key={index} challenge={challenge} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW SNIPER CAN HELP ==================== */}
      <motion.section
        ref={helpRef}
        className="bg-black text-white py-16 md:py-20 px-4 md:px-6 rounded-[2.5rem] md:rounded-[4rem] mx-4 md:mx-6 my-10 md:my-12"
        initial={{ opacity: 0, y: 60 }}
        animate={helpInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 md:mb-16">
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={helpInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
            >
              How Sniper Systems
              <br />
              Can Help
            </motion.h2>
            <div className="w-full h-px bg-gray-700 my-6 md:my-8" />
            <motion.p
              className="text-base md:text-xl text-gray-300 leading-relaxed max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={helpInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 0.2 }}
            >
              Sniper Systems offers best-in-class Device Deployment &amp; MDM.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
            {solutions.map((solution, index) => (
              <SolutionCard key={index} solution={solution} index={index} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* ==================== IMAGE GRID ==================== */}
      <section className="bg-white py-16 md:py-20 px-4 md:px-6" ref={imgGridRef}>
        <div className="max-w-6xl mx-auto">
          <div
            ref={imgPairRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          >
            {imgCards.map((img, i) => (
              <div
                key={i}
                className="img-card opacity-0 rounded-2xl md:rounded-3xl overflow-hidden h-64 md:h-80"
              >
                <ParallaxImage src={img.src} alt={img.alt} className="w-full h-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee 3 */}
      <MarqueeTicker items={marqueeItems3} speed={22} />

      {/* ==================== CTA ==================== */}
      <motion.section
        ref={ctaRef}
        className="bg-black text-white py-16 md:py-20 px-4 md:px-6 rounded-[2.5rem] md:rounded-[4rem] mx-4 md:mx-6 my-10 md:my-12 overflow-hidden"
        initial={{ opacity: 0, y: 60 }}
        animate={ctaInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-10 md:mb-12 overflow-hidden">
            <h2
              ref={ctaHeadingRef}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold mb-6 leading-tight"
              aria-label="Ready to streamline your device management?"
            >
              {ctaWords.map((word, i) =>
                typeof word !== "string" ? (
                  word
                ) : (
                  <span
                    key={i}
                    className="cta-word inline-block opacity-0 mr-[0.2em] last:mr-0"
                  >
                    {word}
                  </span>
                )
              )}
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.6 }}
          >
            <MagneticCTALink
              to="/contact"
              className="inline-flex items-center px-8 md:px-12 py-3.5 md:py-4 border-2 border-white rounded-full text-white font-medium text-base md:text-lg hover:bg-white hover:text-black transition-colors duration-300"
            >
              GET STARTED
            </MagneticCTALink>
          </motion.div>
        </div>
      </motion.section>

      {/* ==================== SCROLL TO TOP ==================== */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 md:bottom-8 md:right-8 w-12 h-12 md:w-14 md:h-14 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 z-50 shadow-lg"
            aria-label="Scroll to top"
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 -rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default DeviceDeploymentMDM;
