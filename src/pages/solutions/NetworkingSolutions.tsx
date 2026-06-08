import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Activity, ArrowRight, CheckCircle, Shield, Zap } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { Helmet } from "react-helmet-async";



      <Helmet>

        {/* BASIC SEO */}

        <title>Best Networking Solutions in Chennai | Secure Network Infrastructure | Sniper Systems</title>

        <meta
          name="description"
          content="Looking for reliable networking solutions in Chennai? Sniper Systems offers secure and scalable network infrastructure, enterprise networking, and network security solutions for businesses across India."
        />

        <meta
          name="keywords"
          content="networking solutions Chennai, enterprise networking solutions India, network infrastructure services, network security solutions Chennai, IT networking company"
        />

        <meta name="robots" content="index, follow" />

        <link
          rel="canonical"
          href="https://sniperindia.com/solutions/networking-solutions"
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
          content="Networking Solutions | Sniper Systems"
        />

        <meta
          property="og:description"
          content="Secure and scalable networking solutions including enterprise networking, infrastructure, and network security services."
        />

        <meta
          property="og:image"
          content="https://sniperindia.com/wp-content/uploads/2023/09/sniper-systems-banner.jpg"
        />

        <meta
          property="og:url"
          content="https://sniperindia.com/solutions/networking-solutions"
        />

        {/* TWITTER SEO */}

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="Enterprise Networking Solutions | Sniper Systems"
        />

        <meta
          name="twitter:description"
          content="Enhance your business with secure, scalable, and high-performance networking solutions."
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
            "serviceType": "Networking Solutions",
            "provider": {
              "@type": "Organization",
              "name": "Sniper Systems"
            },
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "description": "Enterprise networking solutions including network infrastructure, security, and performance optimization."
          }
          `}
</script>

        {/* FAQ SCHEMA (VERY POWERFUL FOR SEO) */}

        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What are networking solutions for businesses?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Networking solutions include designing, implementing, and managing network infrastructure to ensure secure and efficient communication within an organization."
                }
              },
              {
                "@type": "Question",
                "name": "Why are enterprise networking solutions important?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Enterprise networking solutions ensure high performance, security, scalability, and seamless connectivity across business operations."
                }
              },
              {
                "@type": "Question",
                "name": "Does Sniper Systems provide network security?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, Sniper Systems offers advanced network security solutions to protect business data and infrastructure from cyber threats."
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
                "name": "Networking Solutions",
                "item": "https://sniperindia.com/solutions/networking-solutions"
              }
            ]
          }
          `}
</script>

      </Helmet>


gsap.registerPlugin(ScrollTrigger);

// ========================================================
// GSAP UTILITIES
// ========================================================

// ---- Marquee Ticker ----
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
    const totalWidth = track.scrollWidth / 2;
    const tween = gsap.to(track, {
      x: reverse ? `${totalWidth}px` : `-${totalWidth}px`,
      duration: speed,
      ease: "none",
      repeat: -1,
    });
    return () => tween.kill();
  }, [speed, reverse]);
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden bg-gray-950 py-3 sm:py-4 border-y border-gray-800">
      <div ref={trackRef} className="flex gap-8 sm:gap-10 whitespace-nowrap will-change-transform">
        {doubled.map((text, i) => (
          <span
            key={i}
            className="flex items-center gap-8 sm:gap-10 text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] sm:tracking-[0.22em] uppercase text-gray-500"
          >
            {text}
            <span className="w-1.5 h-1.5 rounded-full bg-gray-700 inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
};

// ---- Parallax Image ----
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
    // Disable parallax on mobile for performance
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
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
            scrub: true,
          },
        }
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
    return () => mm.revert();
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

// ---- Animated Counter ----
const AnimatedCounter = ({ target, suffix = "" }: { target: string; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);
  const numericMatch = target.match(/[\d.]+/);
  const numericValue = numericMatch ? parseFloat(numericMatch[0]) : null;
  const prefix = target.replace(/[\d.]+.*/, "");
  const trailingSuffix =
    numericValue !== null
      ? target.replace(new RegExp(`^${prefix}[\\d.]+`), "").replace(suffix, "")
      : "";

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
                prefix + Math.round(obj.val).toLocaleString() + trailingSuffix + suffix;
          },
        });
      },
    });
    return () => st.kill();
  }, [numericValue]);

  if (numericValue === null) return <span ref={ref}>{target}</span>;
  return (
    <span ref={ref}>
      {prefix}0{trailingSuffix}{suffix}
    </span>
  );
};

// ---- Benefits List with GSAP line-draw dividers ----
const BenefitsList = ({ benefits, inView }: { benefits: any[]; inView: boolean }) => {
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
    <div className="space-y-8 sm:space-y-12">
      {benefits.map((benefit, index) => (
        <motion.div
          key={index}
          className="relative pb-8 sm:pb-12 last:pb-0"
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 + index * 0.1 }}
        >
          {/* Mobile: stacked layout | Desktop: grid */}
          <div className="flex items-start gap-4 sm:grid sm:grid-cols-12 sm:gap-8 sm:items-center">
            {/* Icon */}
            <div className="flex-shrink-0 sm:col-span-2 sm:flex sm:justify-start">
              <benefit.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white mt-0.5 sm:mt-0" />
            </div>

            {/* Content: mobile stacks label + desc together, desktop separates */}
            <div className="flex-1 sm:contents">
              <div className="sm:col-span-3">
                <p className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider mb-1 sm:mb-0">
                  {benefit.label}
                </p>
                {/* Mobile: description follows immediately */}
                <p className="text-base sm:hidden text-gray-200 leading-relaxed mt-2">
                  {benefit.description}
                </p>
              </div>
              {/* Desktop only description column */}
              <div className="hidden sm:block sm:col-span-7">
                <p className="text-lg text-gray-200 leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          </div>

          {index < benefits.length - 1 && (
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

// ---- Magnetic CTA link (desktop only, touch devices get normal link) ----
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
    if (!btn) return;
    // Only apply magnetic effect on non-touch devices
    const mm = gsap.matchMedia();
    mm.add("(hover: hover) and (pointer: fine)", () => {
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
    });
    return () => mm.revert();
  }, []);
  return (
    <a ref={btnRef as any} href={to} className={`will-change-transform ${className ?? ""}`}>
      {children}
    </a>
  );
};

// ========================================================
// WHITE SCREEN TRANSITION — GSAP curtain wipe
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

// ---- Solution Card ----
const SolutionCard = ({ solution, index }: { solution: any; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const ease = [0.16, 1, 0.3, 1];

  useEffect(() => {
    if (!inView || !lineRef.current) return;
    gsap.fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      {
        scaleX: 1,
        duration: 1,
        ease: "power3.out",
        delay: 0.1 + (index % 2) * 0.1,
      }
    );
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      className="relative grid grid-cols-1 gap-4 sm:gap-6 items-start pb-10 sm:pb-14 group"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease, delay: (index % 2) * 0.1 }}
    >
      {/* IMAGE */}
      <div className="relative w-full h-44 sm:h-52 overflow-hidden rounded-xl sm:rounded-2xl">
        <img
          src={solution.image}
          alt={solution.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition duration-500" />
      </div>

      {/* TITLE */}
      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider">
        {solution.title}
      </h3>

      {/* DESCRIPTION */}
      <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
        {solution.description}
      </p>

      {/* BUTTON */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="inline-block"
      >
        <a
          href="/contact"
          className="inline-flex items-center w-fit px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-gray-900 rounded-full text-gray-900 text-sm sm:text-base font-medium hover:bg-gray-900 hover:text-white transition-colors duration-300 active:bg-gray-900 active:text-white"
        >
          Get started
        </a>
      </motion.div>

      {/* GSAP Divider */}
      <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 h-px bg-gray-300 overflow-hidden">
        <div
          ref={lineRef}
          className="h-full origin-left bg-gradient-to-r from-transparent via-gray-600 to-transparent"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </motion.div>
  );
};

// ========================================================
// NETWORKING SOLUTIONS PAGE
// ========================================================
const NetworkingSolutions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const solutions = [
    {
      title: "Network Architecture & Consulting",
      description: "Optimized solutions for high availability, user performance, and future growth.",
      image: "https://i.postimg.cc/15BW39Df/glowing-i.jpg",
    },
    {
      title: "Enterprise & Campus Networking",
      description: "End-to-end LAN switching and wireless deployment for office and campus networks.",
      image: "https://i.postimg.cc/1zkBj41k/57242.jpg",
    },
    {
      title: "Data Center Networking",
      description: "Core routing, virtualization, and high-speed switching for data center environments.",
      image: "https://i.postimg.cc/FsrZq2w9/futuristic.jpg",
    },
    {
      title: "Wireless & Mobility",
      description: "Reliable enterprise Wi-Fi and secure mobility for mobile users and IoT devices.",
      image: "https://i.postimg.cc/mD3Ypwwh/futuristic-sm.jpg",
    },

    {
      title: "Network Security Solutions & SD-WAN",
      description: "Secure your network with next-gen firewalls, VPNs, and software-defined WAN.",
      image: "https://i.postimg.cc/TwcbJPdQ/55302.jpg",
    },
    {
      title: "Managed Network Services",
      description: "Proactive monitoring, updates, and fast issue resolution to ensure uptime.",
      image: "https://i.postimg.cc/qqfFyj7t/it-staff.jpg",
    },
  ];

  const benefits = [
    { icon: CheckCircle, label: "CERTIFIED EXPERTISE",          description: "Our engineers hold multi-vendor certifications with deep technical know-how." },
    { icon: Zap,         label: "SCALABLE SOLUTIONS",           description: "We build networks that scale with your growth—stable, secure, and adaptable." },
    { icon: Shield,      label: "RELIABLE PERFORMANCE",         description: "Enterprise-grade infrastructure ensuring high uptime and consistent delivery." },
    { icon: Activity,    label: "PROACTIVE NETWORK MANAGEMENT", description: "Preventive monitoring and maintenance to minimize downtime and disruptions." },
  ];

  const partners = [
    { name: "Cisco",            logo: "https://i.postimg.cc/wvWg6MyT/Cisco-logo-blue-2016-svg.png" },
    { name: "Juniper",          logo: "https://i.postimg.cc/XYwWrQG2/Juniper-Networks-logo-svg.png" },
    { name: "Aruba",            logo: "https://i.postimg.cc/Fzd5NZXB/Hpe-aruba-networking-logo-svg.png" },
    { name: "Fortinet",         logo: "https://i.postimg.cc/xC8B3RCZ/Fortinet-logo-svg.png" },
    { name: "Palo Alto",        logo: "https://i.postimg.cc/ZK6YNTXf/Palo-Alto-Networks-2020-Logo-svg.png" },
    { name: "Ubiquiti",         logo: "https://i.postimg.cc/cCwWfmk4/Ubiquiti-Logo-2023-svg.png" },
    { name: "Extreme Networks", logo: "https://i.postimg.cc/3xJMwYhX/Extreme-Networks-logo-new.png" },
  ];

  // Section refs
  const heroRef     = useRef(null);
  const solRef      = useRef(null);
  const benRef      = useRef(null);
  const statsRef    = useRef(null);
  const partnersRef = useRef(null);
  const ctaRef      = useRef(null);

  const heroInView     = useInView(heroRef,     { once: true, margin: "-60px" });
  const solInView      = useInView(solRef,      { once: true, margin: "-60px" });
  const benInView      = useInView(benRef,      { once: true, margin: "-60px" });
  const statsInView    = useInView(statsRef,    { once: true, margin: "-60px" });
  const partnersInView = useInView(partnersRef, { once: true, margin: "-60px" });
  const ctaInView      = useInView(ctaRef,      { once: true, margin: "-100px" });

  const ease = [0.16, 1, 0.3, 1];

  // GSAP: Hero heading word-stagger
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = heroHeadingRef.current;
    if (!el) return;
    const words = el.querySelectorAll(".net-word");
    gsap.fromTo(
      words,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.07, delay: 1.2 }
    );
  }, []);

  // GSAP: CTA heading word stagger
  const ctaHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!ctaInView) return;
    const el = ctaHeadingRef.current;
    if (!el) return;
    const words = el.querySelectorAll(".cta-word");
    gsap.fromTo(
      words,
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.06, delay: 0.2 }
    );
  }, [ctaInView]);

  // GSAP: Partners random stagger
  const partnersGridRef = useRef<HTMLDivElement>(null);
  const partnersTriggered = useRef(false);
  useEffect(() => {
    if (!partnersInView || partnersTriggered.current) return;
    partnersTriggered.current = true;
    const items = partnersGridRef.current?.querySelectorAll(".partner-item");
    if (!items) return;
    gsap.fromTo(
      items,
      { opacity: 0, y: () => gsap.utils.random(15, 35) },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: { amount: 0.6, from: "random" } }
    );
  }, [partnersInView]);

  const marqueeItems  = ["Networking Solutions", "Enterprise Networking", "SD-WAN", "Data Center", "Wireless & Mobility", "IoT Connectivity"];
  const marqueeItems2 = ["Cisco", "Juniper", "Aruba", "Fortinet", "Palo Alto", "99.9% Uptime", "Certifications", "Quick Support"];
  const marqueeItems3 = ["Upgrade Your Network", "Future-Ready Connectivity", "Enterprise Grade", "Sniper Systems", "Secure & Scalable"];

  return (
    <Layout>
      {showWhiteScreen && <WhiteScreenTransition onComplete={() => setShowWhiteScreen(false)} />}

      {/* ==================== HERO ==================== */}
      <section className="relative bg-white pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-white opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16" ref={heroRef}>

            {/* GSAP word-stagger heading — responsive font size */}
            <h1
              ref={heroHeadingRef}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight font-sans"
              aria-label="Transforming Connections into Opportunities"
            >
              {["Transforming", "Connections", <br key="br" />, "into", "Opportunities"].map((word, i) =>
                typeof word !== "string" ? word : (
                  <span key={i} className="net-word inline-block opacity-0 mr-[0.2em] sm:mr-[0.25em] last:mr-0">
                    {word}
                  </span>
                )
              )}
            </h1>

            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-gray-800 max-w-4xl mx-auto mb-4 sm:mb-8 leading-relaxed font-medium"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              Networking Solutions Built for Performance and Security
            </motion.p>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-700 max-w-5xl mx-auto leading-relaxed px-1 sm:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.72 }}
            >
              Sniper delivers robust, scalable networking solutions designed to keep your business connected, secure, and future-ready. As a trusted partner to top-tier vendors, we offer end-to-end IT networking solutions tailored to your specific operational needs—whether it's enterprise campuses, data centers, or remote facilities. Our consultative approach ensures simplified complexity, high performance, and seamless scalability.
            </motion.p>
          </div>

          {/* Hero image — reduced height on mobile */}
          <div className="max-w-6xl mx-auto pt-8 sm:pt-12">
            <motion.div
              className="relative rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden h-56 sm:h-96 md:h-[500px] lg:h-[600px]"
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.25 }}
            >
              <ParallaxImage
                src="https://i.postimg.cc/MKjxLgwb/43114.jpg"
                alt="Network Infrastructure"
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 z-10">
                <div className="bg-black bg-opacity-50 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                  <span className="text-xs sm:text-sm font-medium">NETWORKING SOLUTIONS</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee — after hero */}
      <MarqueeTicker items={marqueeItems} speed={24} />

      {/* ==================== SOLUTIONS ==================== */}
      <section className="bg-white py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={solRef}>

          <div className="mb-12 sm:mb-20">
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={solInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9 }}
            >
              Enterprise Networking <br /> Solutions
            </motion.h2>
          </div>

          {/*
            Mobile: single column
            Tablet+: two columns
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-12">
            {solutions.map((solution, index) => (
              <SolutionCard key={index} solution={solution} index={index} />
            ))}
          </div>

        </div>
      </section>

      {/* Marquee — between sections */}
      <MarqueeTicker items={marqueeItems2} speed={30} reverse />

      {/* ==================== BENEFITS ==================== */}
      <motion.section
        ref={benRef}
        className="bg-black text-white py-14 sm:py-20 px-4 sm:px-6 rounded-[2.5rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12"
        initial={{ opacity: 0, y: 60 }}
        animate={benInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={benInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
            >
              Why Choose Sniper India?
            </motion.h2>
          </div>
          <BenefitsList benefits={benefits} inView={benInView} />
        </div>
      </motion.section>

      {/* ==================== STATS ==================== */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={statsRef}>
          <div className="mb-10 sm:mb-16">
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9 }}
            >
              Network Solutions<br />That Deliver Results
            </motion.h2>
            <div className="w-full h-px bg-gray-300" />
          </div>

          {/* Two-column layout: stacks on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-12 sm:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-tight">
                NETWORK SOLUTIONS<br />THAT DELIVER RESULTS
              </h3>
            </motion.div>
            <motion.div
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                At Sniper Systems and Solutions, we understand that your network is the backbone of your business operations. Our networking solutions are designed to provide maximum uptime, security, and performance.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                From small businesses to large enterprises, we deliver <strong>customized networking architectures that grow with your organization</strong> while maintaining the highest standards of reliability and security.
              </p>
            </motion.div>
          </div>

          {/* Stats — full width on mobile, right-aligned on desktop */}
          <div className="flex justify-center lg:justify-end">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:gap-16 w-full sm:w-auto">
              {[

                { number: "99.9", suffix: "%", label: "Network Uptime" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="text-center"
                  initial={{ opacity: 0, y: 40 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.3 + i * 0.1 }}
                >
                  <div className="text-4xl sm:text-5xl md:text-6xl text-gray-900 mb-1 sm:mb-2 font-semibold">
                    <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                  </div>
                  <p className="text-gray-600 text-base sm:text-lg">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PARTNERS ==================== */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={partnersRef}>
          <div className="mb-12 sm:mb-20">
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={partnersInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9 }}
            >
              Partnering with<br />industry leaders
            </motion.h2>
          </div>

          {/*
            Mobile: 2 cols
            Tablet: 3 cols
            Desktop: 4 cols
          */}
          <div
            ref={partnersGridRef}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 sm:gap-12"
          >
            {partners.map((partner, index) => (
              <div
                key={index}
                className="partner-item opacity-0 flex items-center justify-center py-2"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-7 sm:h-10 w-auto transition duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee — before CTA */}
      <MarqueeTicker items={marqueeItems3} speed={22} />

      {/* ==================== CTA ==================== */}
      <motion.section
        ref={ctaRef}
        className="bg-black text-white py-14 sm:py-20 px-4 sm:px-6 rounded-[2.5rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12 overflow-hidden"
        initial={{ opacity: 0, y: 60 }}
        animate={ctaInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 sm:mb-12 overflow-hidden">
            {/* GSAP word stagger — responsive font */}
            <h2
              ref={ctaHeadingRef}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold mb-4 sm:mb-6 leading-tight"
              aria-label="Ready to upgrade your network?"
            >
              {["Ready", "to", "upgrade", "your", "network?"].map((word, i) => (
                <span key={i} className="cta-word inline-block opacity-0 mr-[0.18em] sm:mr-[0.22em] last:mr-0">
                  {word}
                </span>
              ))}
            </h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.6 }}
          >
            {/* Magnetic on desktop, normal on mobile */}
            <MagneticCTALink
              to="/contact"
              className="inline-flex items-center px-8 sm:px-12 py-3.5 sm:py-4 border-2 border-white rounded-full text-white font-medium text-base sm:text-lg hover:bg-white hover:text-black active:bg-white active:text-black transition-colors duration-300"
            >
              CONTACT US TODAY
            </MagneticCTALink>
          </motion.div>
        </div>
      </motion.section>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 sm:bottom-8 sm:left-8 w-12 h-12 sm:w-14 sm:h-14 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white active:bg-gray-900 active:text-white transition-all duration-300 z-50 shadow-lg touch-manipulation"
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

export default NetworkingSolutions;
