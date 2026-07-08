import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Building2, CheckCircle2, Cloud, Heart, Landmark, Lock, Shield, Smartphone, Users, Zap } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";


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
      yPercent: -105, duration: 0.9,
      ease: "power3.inOut", delay: 0.2, onComplete,
    });
  }, []);
  return <div ref={ref} className="fixed inset-0 bg-white z-[9999] will-change-transform" />;
};

// ========================================================
// ✦ FADE-UP WRAPPER
// ========================================================
const FadeUp = ({
  children, delay = 0, className = "",
}: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref} className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </motion.div>
  );
};

// ========================================================
// ✦ MARQUEE TICKER  (pure CSS — zero JS overhead)
// ========================================================
const MarqueeTicker = ({ items, reverse = false }: { items: string[]; reverse?: boolean }) => {
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
  src, alt, className, children,
}: { src: string; alt: string; className?: string; children?: React.ReactNode }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef  = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const wrap = wrapRef.current; const img = imgRef.current;
    if (!wrap || !img) return;
    const tween = gsap.fromTo(img, { yPercent: -8 }, {
      yPercent: 8, ease: "none",
      scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: 1 },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);
  return (
    <div ref={wrapRef} className={`overflow-hidden ${className ?? ""}`}>
      <img
        ref={imgRef} src={src} alt={alt}
        loading="lazy" decoding="async"
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
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);
  const numericMatch = target.match(/[\d.]+/);
  const numericValue = numericMatch ? parseFloat(numericMatch[0]) : null;
  const prefix = numericValue !== null ? target.replace(/[\d.]+.*/, "") : "";

  useEffect(() => {
    const el = ref.current;
    if (!el || numericValue === null) return;
    const st = ScrollTrigger.create({
      trigger: el, start: "top 88%",
      onEnter: () => {
        if (triggered.current) return;
        triggered.current = true;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: numericValue, duration: 2.2, ease: "power2.out",
          onUpdate: () => { if (el) el.textContent = prefix + Math.round(obj.val).toLocaleString() + suffix; },
        });
      },
    });
    return () => st.kill();
  }, [numericValue]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
};

// ========================================================
// ✦ BENEFITS LIST  (dark bg, GSAP line-draw dividers)
// ========================================================
const BenefitsList = ({ benefits, inView }: { benefits: any[]; inView: boolean }) => {
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (!inView) return;
    linesRef.current.forEach((line, i) => {
      if (!line) return;
      gsap.fromTo(line,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 1, ease: "power3.out", delay: 0.3 + i * 0.12 }
      );
    });
  }, [inView]);

  return (
    <div className="space-y-8 sm:space-y-12">
      {benefits.map((benefit, index) => (
        <motion.div
          key={index}
          className="relative grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-8 items-start pb-8 sm:pb-12 last:pb-0"
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.2 + index * 0.1 }}
        >
          <div className="sm:col-span-2 flex sm:justify-start">
            <benefit.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white flex-shrink-0" />
          </div>
          <div className="sm:col-span-3">
            <p className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider leading-relaxed">
              {benefit.label}
            </p>
          </div>
          <div className="sm:col-span-7">
            <p className="text-base sm:text-lg text-gray-200 leading-relaxed">{benefit.description}</p>
          </div>
          {index < benefits.length - 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-700 overflow-hidden">
              <div
                ref={(el) => { linesRef.current[index] = el; }}
                className="h-full bg-gradient-to-r from-transparent via-gray-400 to-transparent"
                style={{ transform: "scaleX(0)", willChange: "transform" }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// ========================================================
// ✦ INDUSTRIES LIST  (dark 2-col, GSAP line-draw)
// ========================================================
const IndustriesList = ({ industries, inView }: { industries: any[]; inView: boolean }) => {
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (!inView) return;
    linesRef.current.forEach((line, i) => {
      if (!line) return;
      gsap.fromTo(line,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 1, ease: "power3.out", delay: 0.3 + i * 0.12 }
      );
    });
  }, [inView]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 md:gap-12">
      {industries.map((industry, index) => (
        <motion.div
          key={index}
          className="relative space-y-3 sm:space-y-4 pb-6 sm:pb-8 border-b border-gray-700"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.2 + index * 0.1 }}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <industry.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white flex-shrink-0" />
            <h3 className="text-base sm:text-xl font-semibold text-white">{industry.title}</h3>
          </div>
          <p className="text-sm sm:text-lg text-gray-300 leading-relaxed">{industry.description}</p>
          {index < industries.length - 2 && (
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-700 overflow-hidden hidden sm:block">
              <div
                ref={(el) => { linesRef.current[index] = el; }}
                className="h-full bg-gradient-to-r from-transparent via-gray-400 to-transparent"
                style={{ transform: "scaleX(0)", willChange: "transform" }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// ========================================================
// ✦ KEY FEATURES LIST  (light gray bg, GSAP line-draw dividers)
// ========================================================
const KeyFeaturesList = ({ features, inView }: { features: any[]; inView: boolean }) => {
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!inView) return;
    linesRef.current.forEach((line, i) => {
      if (!line) return;
      gsap.fromTo(line,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 1, ease: "power3.out", delay: 0.3 + i * 0.1 }
      );
    });
  }, [inView]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="relative flex flex-col gap-3 sm:gap-4 p-6 sm:p-8 md:p-10"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease, delay: 0.15 + index * 0.08 }}
        >
          {/* top border line — animated via GSAP */}
          <div className="absolute top-0 left-6 sm:left-8 md:left-10 right-6 sm:right-8 md:right-10 h-px bg-gray-300 overflow-hidden">
            <div
              ref={(el) => { linesRef.current[index] = el; }}
              className="h-full bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400"
              style={{ transform: "scaleX(0)", willChange: "transform" }}
            />
          </div>

          {/* Icon + tag row */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gray-900 flex-shrink-0">
              <feature.icon className="w-5 h-5 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase text-gray-500">
              {feature.tag}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 leading-snug">
            {feature.title}
          </h3>

          {/* Description
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {feature.description}
          </p>*/}

          {/* Bullet points */}
          {feature.bullets && (
            <ul className="space-y-1.5 mt-1">
              {feature.bullets.map((bullet: string, bi: number) => (
                <li key={bi} className="flex items-start gap-2.5 text-sm text-gray-500">
                  <CheckCircle2 className="w-4 h-4 text-gray-700 flex-shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// ========================================================
// ✦ SOLUTION CARD  (CSS hover instead of per-card GSAP listeners)
// ========================================================
const SolutionCard = ({ solution, reverse }: { solution: any; reverse: boolean }) => (
  <>
    <div className={reverse ? "lg:order-2" : ""}>
      <div className="relative rounded-xl sm:rounded-2xl overflow-hidden h-56 sm:h-72 lg:h-96 group">
        <img
          src={solution.image}
          alt={solution.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </div>
    <div className={`flex flex-col justify-center ${reverse ? "lg:order-1" : ""}`}>
      <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3 sm:mb-6">{solution.title}</h3>
      <p className="text-base sm:text-lg text-gray-800 leading-relaxed">{solution.description}</p>
      <br></br>
      <p className="text-base sm:text-lg text-gray-800 leading-relaxed">{solution.descriptionn}</p>
    </div>
  </>
);

// ========================================================
// MAIN YUBICO PAGE
// ========================================================
const Yubico = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);


  useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://cdn.jotfor.ms/agent/embedjs/019f2165e4c6756899b7d476e73c18bd40b3/embed.js";
  script.async = true;
  document.body.appendChild(script);
  return () => { document.body.removeChild(script); };
}, []);


  // Throttled scroll listener
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
    const tween = gsap.fromTo(words,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.07, delay: 1.2 }
    );
    return () => { tween.kill(); };
  }, []);

  // GSAP CTA word stagger
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

  // GSAP solutions stagger
  const solutionsListRef = useRef<HTMLDivElement>(null);
  const solutionsRef     = useRef(null);
  const solutionsInView  = useInView(solutionsRef, { once: true, margin: "-60px" });
  const solTriggered     = useRef(false);
  useEffect(() => {
    if (!solutionsInView || solTriggered.current) return;
    solTriggered.current = true;
    const rows = solutionsListRef.current?.querySelectorAll(".solution-row");
    if (!rows) return;
    gsap.fromTo(rows,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.75, ease: "power2.out", stagger: 0.15 }
    );
  }, [solutionsInView]);

  // Section inView refs
  const heroRef     = useRef(null);
  const partnerRef  = useRef(null);
  const benefitsRef = useRef(null);
  const indRef      = useRef(null);
  const featRef     = useRef(null);
  const statsRef    = useRef(null);
  const keyFeatRef  = useRef(null);

  const heroInView     = useInView(heroRef,     { once: true, margin: "-60px" });
  const partnerInView  = useInView(partnerRef,  { once: true, margin: "-60px" });
  const benefitsInView = useInView(benefitsRef, { once: true, margin: "-60px" });
  const indInView      = useInView(indRef,      { once: true, margin: "-60px" });
  const featInView     = useInView(featRef,     { once: true, margin: "-60px" });
  const statsInView    = useInView(statsRef,    { once: true, margin: "-60px" });
  const keyFeatInView  = useInView(keyFeatRef,  { once: true, margin: "-60px" });

  const marqueeItems1 = ["Yubico Authorized Partner", "YubiKey", "FIDO2 Authentication", "Zero Trust Security", "Sniper Systems", "India"];
  const marqueeItems2 = ["Passwordless Login", "MFA Solutions", "PIV Smart Card", "Microsoft 365", "Google Workspace", "AWS", "GitHub"];
  const marqueeItems3 = ["Hardware-Backed Security", "Enterprise Authentication", "Sniper Systems", "Phishing-Resistant MFA", "Secure at Scale"];

  const benefits = [
    { icon: Shield, label: "Workforce Security",        description: "Protect employees with phishing-resistant MFA and passwordless login for secure access to enterprise applications." },
    { icon: Cloud,  label: "Remote Work Protection",   description: "Secure remote access to VPNs, cloud apps, and enterprise networks." },
    { icon: Users,  label: "Cloud Security",             description: "Integrate seamlessly with Microsoft 365, Google Workspace, and other cloud platforms." },
    { icon: Zap,  label: "Privileged Access Management",             description: "Protect high-value accounts and sensitive systems with strong authentication." },
  ];

const solutions = [
  {
    title: "Stop Cyberattacks",
    description: "Protect your organization from modern cyber threats with phishing-resistant multi-factor authentication (MFA) and hardware-backed security.",
    descriptionn: "By leveraging FIDO2 and public-key cryptography, authentication is bound to trusted devices and domains, preventing credential theft, account takeovers, and identity breaches—even in phishing scenarios.",
    image: "https://i.postimg.cc/QtHTc5bC/Yubi-Key-lit-up-1.jpg"
  },

  {
    title: "Simplify Security",
    description: "Simplify enterprise security with a unified authentication approach that replaces complex password systems with passwordless authentication.",
    descriptionn: "With support for FIDO2, OTP, and smart card (PIV), a single YubiKey can secure users, devices, and applications—making it ideal for IAM and Zero Trust environments.",
    image: "https://i.postimg.cc/wj2yPF4s/compu.jpg"
  },

  {
    title: "Fast & Frictionless",
    description: "Deliver a seamless user experience with tap-and-go authentication, eliminating passwords and delays from traditional MFA methods.",
    descriptionn: "YubiKey works without batteries or network dependency, enabling instant, secure access to applications, cloud services, and enterprise systems—perfect for hybrid and remote work.",
    image: "https://i.postimg.cc/m2Ntz8s7/t.jpg"
  },

  {
    title: "Easy to Deploy",
    description: "Deploy enterprise-grade authentication at scale with plug-and-play security keys and seamless integration with Microsoft 365, Google Workspace, and cloud apps.",
    descriptionn: "Yubico solutions support rapid onboarding, centralized management, and scalable deployment—helping organizations implement Zero Trust security while meeting compliance requirements.",
    image: "https://i.postimg.cc/85RVKXwb/NFC-Yubi-Key-Tablet-Authentication-Process-Security-Device.webp"
  },
];

  const industries = [
    { icon: Building2, title: "IT & Software Development",       description: "Secure codebases, developer tools, and remote workflows." },
    { icon: Landmark,  title: "Banking & Financial Services",    description: "Maintain trust and regulatory compliance with secure access control." },
    { icon: Heart,     title: "Healthcare & Pharmaceutical",     description: "Protect sensitive health data and ensure HIPAA compliance." },
    { icon: Shield,    title: "Government & Public Sector",      description: "Enable strong identity verification and prevent unauthorized access to public systems." },
  ];

  // ── Key Features data ──────────────────────────────────
  const keyFeatures = [
    {
      icon: Lock,
      tag: "Authentication",
      title: "Yubico solution consulting & deployment",
      description: "Hardware-based authentication that eliminates phishing, man-in-the-middle attacks, and credential theft at the root level.",

    },
    {
      icon: Zap,
      tag: "Integration",
      title: "Enterprise security integration",
      description: "A simple tap or touch is all it takes. YubiKey integrates seamlessly into existing login flows without disrupting user productivity.",

    },
    {
      icon: Cloud,
      tag: "Deployment",
      title: "Identity & access management support",
      description: "Works out of the box with hundreds of enterprise services including Microsoft 365, Google Workspace, AWS, GitHub, and Salesforce.",

    },
    {
      icon: Smartphone,
      tag: "Mobility",
      title: "Device lifecycle management",
      description: "Extend strong authentication to remote teams and mobile-first workflows with NFC-enabled keys and cross-platform support.",

    },
    {
      icon: Shield,
      tag: "Compliance",
      title: "Training & onboarding for teams",
      description: "YubiKey satisfies the most demanding compliance frameworks including NIST, HIPAA, PCI-DSS, and ISO 27001 requirements.",

    },
    {
      icon: Users,
      tag: "Scalability",
      title: "Ongoing technical support",
      description: "Centrally manage keys, enforce policies, and provision at scale — whether you're securing 10 users or 100,000 across multiple sites.",

    },
  ];

  return (
    <Layout>
      <>
        {/* BASIC SEO */}
        <title>Yubico Partner in India | YubiKey MFA & Passwordless Security Solutions | Sniper Systems</title>
        <meta
          name="description"
          content="Sniper Systems delivers Yubico YubiKey security solutions in India including MFA, passwordless authentication, phishing-resistant login, Zero Trust security, and enterprise identity protection."
        />
        <meta
          name="keywords"
          content="Yubico partner India, YubiKey India, MFA solutions India, passwordless authentication India, YubiKey reseller India, Zero Trust security solutions"
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://sniperindia.com/partners/yubico"
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
          content="YubiKey MFA & Passwordless Security Solutions | Sniper Systems India"
        />
        <meta
          property="og:description"
          content="Enterprise Yubico solutions for MFA, passwordless authentication, Zero Trust security, and phishing-resistant identity protection."
        />
        <meta
          property="og:image"
          content="https://sniperindia.com/wp-content/uploads/2023/09/sniper-systems-banner.jpg"
        />
        <meta
          property="og:url"
          content="https://sniperindia.com/partners/yubico"
        />

        {/* TWITTER SEO */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Yubico Partner in India | Sniper Systems"
        />
        <meta
          name="twitter:description"
          content="Advanced YubiKey security solutions for MFA, Zero Trust, and enterprise identity protection."
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
            "serviceType": "YubiKey Security & MFA Solutions",
            "provider": {
              "@type": "Organization",
              "name": "Sniper Systems"
            },
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "description": "YubiKey authentication solutions including MFA, passwordless authentication, phishing-resistant login, Zero Trust security, and enterprise identity protection."
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
                "name": "What is YubiKey authentication?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "YubiKey is a hardware-based authentication device that provides secure multi-factor authentication and passwordless login for enterprise security."
                }
              },
              {
                "@type": "Question",
                "name": "Why should businesses use YubiKey solutions?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "YubiKey solutions help organizations prevent phishing attacks, strengthen identity security, and support Zero Trust authentication frameworks."
                }
              },
              {
                "@type": "Question",
                "name": "Does Sniper Systems provide enterprise YubiKey deployment?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, Sniper Systems provides consultation, deployment, integration, and enterprise support for Yubico authentication solutions."
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
                "name": "Partners",
                "item": "https://sniperindia.com/partners/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Yubico",
                "item": "https://sniperindia.com/partners/yubico"
              }
            ]
          }
          `}
        </script>
      </>

      {showWhiteScreen && <WhiteScreenTransition onComplete={() => setShowWhiteScreen(false)} />}


      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-white pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16" ref={heroRef}>

            {/* GSAP word-stagger heading */}
            <h1
              ref={heroHeadingRef}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              aria-label="Yubico Authorized Partner in India"
            >
              {["Yubico", "Authorized", "Partner", "in", "India"].map((word, i) => (
                <span key={i} className="hero-word inline-block opacity-0 mr-[0.22em] last:mr-0">
                  {word}
                  {word === "Partner" && <br className="hidden sm:block" />}
                </span>
              ))}
            </h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-700 max-w-5xl mx-auto leading-relaxed font-medium mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 1.55 }}
            >
             Strengthen your organization’s security with industry-leading authentication solutions from Yubico, delivered by Sniper Systems & Solutions — your trusted authorized partner in India.
            </motion.p>

            <motion.p
              className="text-base sm:text-lg text-gray-700 max-w-5xl mx-auto leading-relaxed px-2 sm:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 1.7 }}
            >
              Yubico enables passwordless authentication, multi-factor authentication (MFA), and phishing-resistant security using hardware-backed protection. Designed for enterprises, governments, and modern workplaces, Yubico solutions help eliminate account takeovers and secure digital identities across devices and platforms.
            </motion.p>
          </div>

          {/* Hero image */}
          <FadeUp delay={0.25}>
            <div className="relative rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden h-56 sm:h-96 md:h-[500px] lg:h-[600px]">
              <ParallaxImage
                src="https://i.postimg.cc/85RVKXwb/NFC-Yubi-Key-Tablet-Authentication-Process-Security-Device.webp"
                alt="YubiKey Security"
                className="w-full h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 z-10">
                  <div className="bg-black/50 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                    <span className="text-[10px] sm:text-sm font-medium">YUBICO</span>
                  </div>
                </div>
              </ParallaxImage>
            </div>
          </FadeUp>
        </div>
      </section>

      <MarqueeTicker items={marqueeItems1} />

      {/* ── About Partnership ─────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={partnerRef}>
          <div className="mb-10 sm:mb-16">
            <FadeUp>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                About Yubico &amp;<br />Our Partnership
              </h2>
            </FadeUp>
            <div className="w-full h-px bg-gray-300" />
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-10 sm:mb-16">
            <FadeUp>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                ABOUT YUBICO &amp;<br />OUR PARTNERSHIP
              </h3>
            </FadeUp>
            <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
               Yubico is a global leader in hardware-based authentication and passwordless security solutions, best known for the YubiKey — a secure hardware key that enables multi-factor authentication (MFA), two-factor authentication (2FA), and passwordless login. Built on open standards like FIDO2, WebAuthn, and smart card (PIV), Yubico helps organizations protect against phishing attacks, credential theft, and unauthorized access. Trusted by enterprises, governments, and technology leaders worldwide, Yubico plays a vital role in advancing Zero Trust security and modern identity protection while improving user experience and meeting compliance requirements.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                As an Yubico authorized partner in India, We deliver enterprise-ready authentication solutions tailored for today’s digital environments. From phishing-resistant MFA and passwordless authentication to identity and access management (IAM), we provide end-to-end support including consulting, deployment, and integration across cloud, on-premise, and hybrid infrastructures. Together with Yubico, we help organizations strengthen security, prevent cyber threats, and enable seamless, scalable, and secure access for users across all devices and platforms.
              </p>
            </FadeUp>
          </div>

          {/* Row 2 */}

        </div>
      </section>

      {/* ── Why Choose ───────────────────────────────────────────────────── */}
      <FadeUp className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12">
        <div ref={benefitsRef} className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <FadeUp>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-4 sm:mb-6 leading-tight">
                Enterprise Use Cases
              </h2>
            </FadeUp>
          </div>
          <BenefitsList benefits={benefits} inView={benefitsInView} />
        </div>
      </FadeUp>

      <MarqueeTicker items={marqueeItems2} reverse />

      {/* ── Solutions ─────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={solutionsRef}>
          <FadeUp className="mb-10 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 leading-tight">
             Features &amp;  <br className="hidden sm:block" />
Capabilities
            </h2>
          </FadeUp>

          <div ref={solutionsListRef} className="space-y-10 sm:space-y-16">
            {solutions.map((solution, index) => (
              <div
                key={index}
                className="solution-row opacity-0 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-12 items-center pb-10 sm:pb-12 last:pb-0 border-b border-gray-300 last:border-0"
              >
                <SolutionCard solution={solution} reverse={index % 2 === 1} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Key Features / Capabilities ──────────────────────────────────── */}
   <section className="bg-gray-100 py-16 sm:py-24 px-4 sm:px-6">
  <div className="max-w-6xl mx-auto">
    {/* Header row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 lg:gap-16 mb-10 sm:mb-16 items-end">
      <FadeUp>
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 leading-tight">
          Why Choose Sniper Systems &amp;<br />Solutions?
        </h2>
      </FadeUp>
      <FadeUp delay={0.1}>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg">
          As an authorized Yubico partner in India, we deliver end-to-end implementation and support.
        </p>
      </FadeUp>
    </div>

    {/* Features grid */}
    <div ref={keyFeatRef}>
      <KeyFeaturesList features={keyFeatures} inView={keyFeatInView} />
    </div>

    {/* Bottom line content */}
    <FadeUp delay={0.2}>
      <p className="mt-10 sm:mt-14 text-center text-gray-700 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
       We help organizations implement secure authentication strategies aligned with compliance and enterprise security standards.
      </p>
    </FadeUp>
  </div>
</section>

      {/* ── Industries ───────────────────────────────────────────────────── */}
      <FadeUp className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12">
        <div ref={indRef} className="max-w-6xl mx-auto">
          <FadeUp className="mb-10 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight">
              Industries We Serve
            </h2>
          </FadeUp>
          <IndustriesList industries={industries} inView={indInView} />
        </div>
      </FadeUp>

      {/* ── Featured Image ────────────────────────────────────────────────── */}
      <section className="relative bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={featRef}>
          <FadeUp>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-8 sm:mb-12 leading-tight">
              Hardware-backed<br />security at scale
            </h2>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-56 sm:h-[400px] md:h-[550px] lg:h-[700px]">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80"
                alt="Enterprise Security"
                className="w-full h-full"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={statsRef}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 text-center sm:text-right">
            {[
              { number: "1800", suffix: "+", label: "Happy Customers" },
              { number: "200",  suffix: "+", label: "Security Deployments" },
              { number: "15",   suffix: "+", label: "Years of Experience" },
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
                <p className="text-gray-600 text-base sm:text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <MarqueeTicker items={marqueeItems3} />

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <FadeUp
        className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12 overflow-hidden"
      >
        <div ref={ctaRef} className="max-w-4xl mx-auto text-center">
          <div className="mb-8 sm:mb-12 overflow-hidden">
            <h2
              ref={ctaHeadingRef}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold mb-4 sm:mb-6 leading-tight"
              aria-label="Have an idea? We make it happen"
            >
              {["Have", "an", "idea?", "We", "make", "it", "happen"].map((word, i) => (
                <span key={i} className="cta-word inline-block opacity-0 mr-[0.22em] last:mr-0">
                  {word}
                  {word === "idea?" && <br className="hidden sm:block" />}
                  {word === "make"  && <br className="hidden sm:block" />}
                </span>
              ))}
            </h2>
          </div>
          <FadeUp delay={0.4}>
            <a
              href="/contact"
              className="inline-flex items-center px-8 sm:px-12 py-3 sm:py-4 border-2 border-white rounded-full text-white font-medium text-base sm:text-lg hover:bg-white hover:text-black transition-colors duration-300"
            >
              TELL US
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

export default Yubico;
