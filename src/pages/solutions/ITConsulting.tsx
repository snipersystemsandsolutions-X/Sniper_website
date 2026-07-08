import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Cloud, LineChart, Shield, Target, Users, Search, Compass, RefreshCw, Activity } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

import React from "react";
import { Helmet } from "react-helmet-async";



<>

  {/* BASIC SEO */}

  <title>IT Consulting Services in India | Strategic IT Advisory | Sniper Systems</title>

  <meta
    name="description"
    content="Sniper Systems delivers expert IT consulting services in India, including IT strategy, infrastructure modernization, cloud consulting, and cybersecurity advisory to drive business growth."
  />

  <meta
    name="keywords"
    content="IT consulting services Chennai, IT advisory services India, IT strategy consulting, cloud consulting services, IT consulting company Chennai"
  />

  <meta name="robots" content="index, follow" />

  <link
    rel="canonical"
    href="https://sniperindia.com/solutions/it-consulting"
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
    content="IT Consulting & Advisory Services | Sniper Systems"
  />

  <meta
    property="og:description"
    content="Strategic IT consulting services including IT roadmap planning, cloud transformation, and cybersecurity advisory."
  />

  <meta
    property="og:image"
    content="https://sniperindia.com/wp-content/uploads/2023/09/sniper-systems-banner.jpg"
  />

  <meta
    property="og:url"
    content="https://sniperindia.com/solutions/it-consulting"
  />

  {/* TWITTER SEO */}

  <meta name="twitter:card" content="summary_large_image" />

  <meta
    name="twitter:title"
    content="IT Consulting Services in Chennai | Sniper Systems"
  />

  <meta
    name="twitter:description"
    content="Expert IT consulting services to align your technology strategy with business goals."
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
            "serviceType": "IT Consulting Services",
            "provider": {
              "@type": "Organization",
              "name": "Sniper Systems"
            },
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "description": "IT consulting services including IT strategy, cloud consulting, infrastructure modernization, and cybersecurity advisory."
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
                "name": "What are IT consulting services?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "IT consulting services help businesses align technology strategies with their goals through expert guidance, planning, and implementation support."
                }
              },
              {
                "@type": "Question",
                "name": "Why does a business need IT consulting?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "IT consulting helps businesses optimize technology investments, improve efficiency, enhance security, and accelerate digital transformation."
                }
              },
              {
                "@type": "Question",
                "name": "Does Sniper Systems provide cloud and cybersecurity consulting?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, Sniper Systems offers cloud consulting, infrastructure modernization, and cybersecurity advisory services tailored to business needs."
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
                "name": "IT Consulting",
                "item": "https://sniperindia.com/solutions/it-consulting"
              }
            ]
          }
          `}
  </script>

</>

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
      <div ref={trackRef} className="flex gap-6 sm:gap-10 whitespace-nowrap will-change-transform">
        {doubled.map((text, i) => (
          <span
            key={i}
            className="flex items-center gap-6 sm:gap-10 text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] sm:tracking-[0.22em] uppercase text-gray-500"
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
  const script = document.createElement("script");
  script.src = "https://cdn.jotfor.ms/agent/embedjs/019f2165e4c6756899b7d476e73c18bd40b3/embed.js";
  script.async = true;
  document.body.appendChild(script);
  return () => { document.body.removeChild(script); };
}, []);


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
          scrub: true,
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
        className="w-full h-full object-cover scale-110 will-change-transform"
      />
      {children}
    </div>
  );
};

// ---- Why Choose List with GSAP line-draw dividers ----
const WhyChooseList = ({ items, inView }: { items: any[]; inView: boolean }) => {
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
      {items.map((item, index) => (
        <motion.div
          key={index}
          className="relative pb-8 sm:pb-12 last:pb-0"
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 + index * 0.1 }}
        >
          {/* Mobile: stacked layout | lg: 12-col grid */}
          <div className="flex flex-col sm:flex-row sm:items-start lg:grid lg:grid-cols-12 lg:items-center gap-4 sm:gap-6 lg:gap-8">
            {/* Icon */}
            <div className="lg:col-span-2 flex justify-start sm:justify-start lg:justify-start">
              <item.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white flex-shrink-0" />
            </div>
            {/* Label + description stacked on mobile, split on lg */}
            <div className="flex flex-col gap-2 sm:gap-3 lg:contents">
              <div className="lg:col-span-3">
                <p className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider">
                  {item.label}
                </p>
              </div>
              <div className="lg:col-span-7">
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
                  {item.description}
                </p>
              </div>
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

// ---- Magnetic CTA link ----
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

// ---- Service Images ----
const serviceImages: string[] = [
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80", // IT Assessment & Audits
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80", // IT Strategy & Roadmapping
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80", // Infrastructure Modernization
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80", // Cloud & Virtualization Consulting
  "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80", // Cybersecurity & Compliance
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80", // CIO Advisory Services
];

// ---- Service Card with GSAP line-draw divider ----
const ServiceCard = ({ service, index }: { service: any; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const ease = [0.16, 1, 0.3, 1];

  useEffect(() => {
    if (!inView || !lineRef.current) return;
    gsap.fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 1, ease: "power3.out", delay: 0.1 + (index % 2) * 0.1 }
    );
  }, [inView, index]);

  useEffect(() => {
    const card = ref.current;
    const img = imgRef.current;
    if (!card || !img || "ontouchstart" in window) return;
    const onEnter = () => gsap.to(img, { scale: 1.07, duration: 0.6, ease: "power2.out" });
    const onLeave = () => gsap.to(img, { scale: 1.0, duration: 0.6, ease: "power2.out" });
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
      className="relative grid grid-cols-1 gap-4 sm:gap-6 items-start pb-10 sm:pb-12"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease, delay: (index % 2) * 0.1 }}
    >
      {/* Service image */}
      <div className="overflow-hidden rounded-xl sm:rounded-2xl h-48 sm:h-56 w-full mb-3 sm:mb-4">
        <img
          ref={imgRef}
          src={serviceImages[index]}
          alt={service.title}
          className="w-full h-full object-cover will-change-transform"
        />
      </div>

      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider">
        {service.title}
      </h3>
      <p className="text-base sm:text-lg text-gray-800 leading-relaxed">{service.description}</p>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="inline-block"
      >
        <a
          href="/contact"
          className="inline-flex items-center w-fit px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-gray-900 rounded-full text-gray-900 text-sm sm:text-base font-medium hover:bg-gray-900 hover:text-white transition-colors duration-300"
        >
          Get started
        </a>
      </motion.div>
      {/* GSAP line-draw divider */}
      <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 h-px bg-gray-300 overflow-hidden">
        <div
          ref={lineRef}
          className="h-full bg-gradient-to-r from-transparent via-gray-600 to-transparent"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </motion.div>
  );
};

// ---- Consulting Process / Timeline Diagram ----
const ConsultingProcessDiagram = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px" });

  const steps = [




  ];

  return (
    <div ref={containerRef} className="py-12 sm:py-16 overflow-hidden">
      {/* Desktop View: Horizontal Timeline */}
      <div className="hidden lg:block relative max-w-5xl mx-auto px-4">
        {/* Connection line in background */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-12 z-0" />

        {/* Animated progressive line */}



      </div>

      {/* Mobile/Tablet View: Vertical Timeline */}
      <div className="lg:hidden relative pl-8 sm:pl-10 max-w-md mx-auto">
        {/* Background Vertical Line */}
        <div className="absolute top-4 bottom-4 left-4 sm:left-5 w-0.5 bg-gray-200 z-0" />

        {/* Animated progressive line */}
        <motion.div
          className="absolute top-4 bottom-4 left-4 sm:left-5 w-0.5 bg-gradient-to-b from-blue-500 via-purple-600 to-red-500 z-0 origin-top"
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
        />

        <div className="space-y-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                className="relative flex items-start gap-4 sm:gap-6 group"
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: idx * 0.15 }}
              >
                {/* Visual Icon Node on Timeline */}
                <div className="absolute -left-[28px] sm:-left-[37px] mt-1 flex items-center justify-center">
                  <div className={`absolute -inset-1 bg-gradient-to-r ${step.color} rounded-full blur opacity-0 group-hover:opacity-40 transition duration-500`} />
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-gray-900 transition duration-300 shadow-sm overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <Icon className="relative z-10 w-3.5 h-3.5 sm:w-5 sm:h-5 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-gray-50 border border-gray-100 hover:border-gray-300 rounded-xl p-5 transition-all duration-300 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                      {step.title}
                    </h4>
                    <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${step.color}`}>
                      Phase {step.phase}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ========================================================
// IT CONSULTING PAGE
// ========================================================
const ITConsulting = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const services = [
    {
      title: "IT Assessment & Audits",
      description:
        "Evaluate existing infrastructure, security, applications, and workflows to identify bottlenecks, risks, and opportunities.",
    },
    {
      title: "IT Strategy & Roadmapping",
      description:
        "Define a scalable, cost-effective, and future-ready IT roadmap aligned to business priorities.",
    },
    {
      title: "Infrastructure Modernization",
      description:
        "Evolve IT infrastructure from on-prem to hybrid to fully cloud-native, matching modern workloads and user expectations.",
    },
    {
      title: "Cloud & Virtualization Consulting",
      description:
        "Guide transition to cloud environments — public, private, or hybrid — ensuring performance, security, and cost optimization.",
    },
    {
      title: "Cybersecurity & Compliance",
      description:
        "Risk assessments, data protection strategies, compliance audits, and recommendations aligned to industry standards.",
    },
    {
      title: "CIO Advisory Services",
      description:
        "Virtual CIO services providing strategic guidance on IT investments, architecture, and vendor management for growing enterprises without in-house tech leadership.",
    },
  ];

  const whyChoose = [
    {
      icon: Target,
      label: "15+ YEARS IN ENTERPRISE IT",
      description:
        "Over a decade and a half of proven experience delivering IT consulting services across diverse industries and business models.",
    },
    {
      icon: Shield,
      label: "CERTIFIED CONSULTANTS",
      description:
        "Our team holds certifications across Apple, Microsoft, Cisco, AWS, and more, ensuring expert-level guidance on every engagement.",
    },
    {
      icon: LineChart,
      label: "BUSINESS-FIRST APPROACH",
      description:
        "We align technology decisions with real business outcomes, ensuring every IT investment drives measurable value and growth.",
    },
    {
      icon: Users,
      label: "INDEPENDENT & BRAND-AGNOSTIC",
      description:
        "Our recommendations are unbiased and tailored to your needs, not influenced by vendor partnerships or product quotas.",
    },
    {
      icon: Cloud,
      label: "PROVEN SUCCESS ACROSS ALL SCALES",
      description:
        "From fast-growing startups to SMBs and large enterprises, we've helped organizations of all sizes achieve IT excellence.",
    },
  ];

  // Section refs
  const heroRef = useRef(null);
  const svcRef = useRef(null);
  const whyRef = useRef(null);
  const featRef = useRef(null);
  const procRef = useRef(null);
  const ctaRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-60px" });
  const svcInView = useInView(svcRef, { once: true, margin: "-60px" });
  const whyInView = useInView(whyRef, { once: true, margin: "-60px" });
  const featInView = useInView(featRef, { once: true, margin: "-60px" });
  const procInView = useInView(procRef, { once: true, margin: "-60px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  const ease = [0.16, 1, 0.3, 1];

  // GSAP: Hero heading word-stagger
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = heroHeadingRef.current;
    if (!el) return;
    const words = el.querySelectorAll(".hero-word");
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

  // GSAP: Process / stats stagger
  const procGridRef = useRef<HTMLDivElement>(null);
  const procTriggered = useRef(false);
  useEffect(() => {
    if (!procInView || procTriggered.current) return;
    procTriggered.current = true;
    const items = procGridRef.current?.querySelectorAll(".proc-item");
    if (!items) return;
    gsap.fromTo(
      items,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.15 }
    );
  }, [procInView]);

  const marqueeItems = ["IT Consulting", "IT Assessment & Audits", "IT Strategy", "Infrastructure Modernization", "Cloud Consulting", "CIO Advisory"];
  const marqueeItems2 = ["Business-First Approach", "Certified Consultants", "15+ Years Experience", "Scalable Solutions", "Brand-Agnostic", "Digital Transformation"];
  const marqueeItems3 = ["Transform Your IT", "Strategy Meets Execution", "Smarter Businesses", "Sniper Systems", "Unstoppable Growth"];

  return (
    <Layout>


        <>

        {/* BASIC SEO */}

        <title>IT Consulting Services in India | Strategic IT Advisory | Sniper Systems</title>

        <meta
          name="description"
          content="Sniper Systems delivers expert IT consulting services in India, including IT strategy, infrastructure modernization, cloud consulting, and cybersecurity advisory to drive business growth."
        />

        <meta
          name="keywords"
          content="IT consulting services Chennai, IT advisory services India, IT strategy consulting, cloud consulting services, IT consulting company Chennai"
        />

        <meta name="robots" content="index, follow" />

        <link
          rel="canonical"
          href="https://sniperindia.com/solutions/it-consulting"
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
          content="IT Consulting & Advisory Services | Sniper Systems"
        />

        <meta
          property="og:description"
          content="Strategic IT consulting services including IT roadmap planning, cloud transformation, and cybersecurity advisory."
        />

        <meta
          property="og:image"
          content="https://sniperindia.com/wp-content/uploads/2023/09/sniper-systems-banner.jpg"
        />

        <meta
          property="og:url"
          content="https://sniperindia.com/solutions/it-consulting"
        />

        {/* TWITTER SEO */}

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="IT Consulting Services in Chennai | Sniper Systems"
        />

        <meta
          name="twitter:description"
          content="Expert IT consulting services to align your technology strategy with business goals."
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
            "serviceType": "IT Consulting Services",
            "provider": {
              "@type": "Organization",
              "name": "Sniper Systems"
            },
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "description": "IT consulting services including IT strategy, cloud consulting, infrastructure modernization, and cybersecurity advisory."
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
                "name": "What are IT consulting services?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "IT consulting services help businesses align technology strategies with their goals through expert guidance, planning, and implementation support."
                }
              },
              {
                "@type": "Question",
                "name": "Why does a business need IT consulting?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "IT consulting helps businesses optimize technology investments, improve efficiency, enhance security, and accelerate digital transformation."
                }
              },
              {
                "@type": "Question",
                "name": "Does Sniper Systems provide cloud and cybersecurity consulting?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, Sniper Systems offers cloud consulting, infrastructure modernization, and cybersecurity advisory services tailored to business needs."
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
                "name": "IT Consulting",
                "item": "https://sniperindia.com/solutions/it-consulting"
              }
            ]
          }
          `}
</script>

      </>


      {showWhiteScreen && <WhiteScreenTransition onComplete={() => setShowWhiteScreen(false)} />}

      {/* ==================== HERO ==================== */}
      <section className="relative bg-white pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-white opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14 md:mb-16" ref={heroRef}>

            <motion.p
              className="text-sm sm:text-base md:text-xl text-gray-700 mb-4 sm:mb-6 uppercase tracking-wider font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 1.0 }}
            >
              Strategic Technology Consulting to Drive Business Transformation
            </motion.p>

            {/* GSAP word-stagger heading */}
            <h1
              ref={heroHeadingRef}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight font-sans"
              aria-label="Transforming Businesses with Expert IT Consulting"
            >
              {["Transforming", "Businesses", "with", <br key="br" />, "Expert", "IT", "Consulting"].map(
                (word, i) =>
                  typeof word !== "string" ? word : (
                    <span key={i} className="hero-word inline-block opacity-0 mr-[0.22em] last:mr-0">
                      {word}
                    </span>
                  )
              )}
            </h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-700 max-w-5xl mx-auto leading-relaxed px-2"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 1.72 }}
            >
              At Sniper, we help organizations make smarter IT decisions. With over two decades of experience in enterprise technology, our IT consulting services are designed to align your IT strategy with your business goals. Whether you're scaling fast, modernizing legacy systems, or migrating to the cloud — we bring clarity, strategy, and execution to your IT roadmap.
            </motion.p>
          </div>

          {/* GSAP Parallax hero image */}
          <div className="max-w-6xl mx-auto pt-8 sm:pt-10 md:pt-12">
            <motion.div
              className="relative rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden h-56 sm:h-80 md:h-[500px] lg:h-[600px]"
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 1, ease, delay: 0.25 }}
            >
              <ParallaxImage
                src="https://i.postimg.cc/63TRrYx1/futuristic-technology-hologram.jpg"
                alt="IT Consulting"
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 z-10">
                <div className="bg-black bg-opacity-50 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                  <span className="text-xs sm:text-sm font-medium">IT CONSULTING SERVICES</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GSAP Marquee — after hero */}
      <MarqueeTicker items={marqueeItems} speed={24} />

      {/* ==================== SERVICES ==================== */}
      <section className="bg-white py-14 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={svcRef}>
          <div className="mb-10 sm:mb-14 md:mb-16">
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={svcInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease }}
            >
              Our IT Consulting<br />Services
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-0">
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== WHY CHOOSE ==================== */}
      <motion.section
        ref={whyRef}
        className="bg-black text-white py-14 sm:py-16 md:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[3rem] lg:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-10 md:my-12"
        initial={{ opacity: 0, y: 60 }}
        animate={whyInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-14 md:mb-16">
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={whyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
            >
              Why choose Sniper India?
            </motion.h2>
          </div>
          <WhyChooseList items={whyChoose} inView={whyInView} />
        </div>
      </motion.section>

      {/* GSAP Marquee — between why and featured */}
      <MarqueeTicker items={marqueeItems2} speed={20} reverse />

      {/* ==================== FEATURED IMAGE ==================== */}
      <section className="relative bg-white py-14 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={featRef}>
          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-8 sm:mb-10 md:mb-12 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={featInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease }}
          >
            Strategy meets<br />execution
          </motion.h2>
          <motion.div
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-64 sm:h-96 md:h-[500px] lg:h-[600px] xl:h-[700px]"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={featInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1, ease, delay: 0.15 }}
          >
            <ParallaxImage
              src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1600&q=80"
              alt="IT Strategy"
              className="w-full h-full"
            />
          </motion.div>
        </div>
      </section>

      {/* ==================== CONSULTING APPROACH + STATS ==================== */}
      <section className="bg-white py-14 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={procRef}>
          <div className="mb-10 sm:mb-14 md:mb-16">
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={procInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease }}
            >
              Our consulting<br />approach
            </motion.h2>
            <div className="w-full h-px bg-gray-300" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 mb-14 sm:mb-16 md:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={procInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 0.15 }}
            >
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-tight">
                TAILORED, STRATEGIC,<br />AND RESULTS-DRIVEN
              </h3>
            </motion.div>
            <motion.div
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={procInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 0.25 }}
            >
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Every business is unique, and so are its IT challenges. Our consulting methodology begins with a deep understanding of your business objectives, current technology landscape, and future ambitions.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                We don't believe in cookie-cutter solutions. From discovery to implementation, our consultants work as an extension of your team, providing{" "}
                <strong>actionable insights, strategic roadmaps, and hands-on support</strong> to ensure successful outcomes.
              </p>
            </motion.div>
          </div>

          {/* Methodology Visual Diagram */}
          <ConsultingProcessDiagram />

          {/* Stats — centered on mobile, right-aligned on lg */}
          <div className="flex justify-center lg:justify-end">
            <div
              ref={procGridRef}
              className="grid grid-cols-3 gap-6 sm:gap-10 lg:gap-16 w-full lg:w-auto"
            >
              {[
                { value: "500+", label: "Consulting Projects" },
                { value: "200+", label: "Enterprise Clients" },
                { value: "15+", label: "Years of Expertise" },
              ].map((stat, index) => (
                <div key={index} className="proc-item opacity-0 text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-1 sm:mb-2 font-semibold">
                    {stat.value}
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base lg:text-lg">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GSAP Marquee — before CTA */}
      <MarqueeTicker items={marqueeItems3} speed={22} />

      {/* ==================== CTA ==================== */}
      <motion.section
        ref={ctaRef}
        className="bg-black text-white py-14 sm:py-16 md:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[3rem] lg:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-10 md:my-12 overflow-hidden"
        initial={{ opacity: 0, y: 60 }}
        animate={ctaInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 sm:mb-10 md:mb-12 overflow-hidden">
            {/* GSAP word stagger on CTA heading */}
            <h2
              ref={ctaHeadingRef}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold mb-4 sm:mb-6 leading-tight"
              aria-label="Ready to transform your IT?"
            >
              {["Ready", "to", "transform", <br key="br2" />, "your", "IT?"].map((word, i) =>
                typeof word !== "string" ? word : (
                  <span key={i} className="cta-word inline-block opacity-0 mr-[0.22em] last:mr-0">
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
            {/* GSAP magnetic button */}
            <MagneticCTALink
              to="/contact"
              className="inline-flex items-center px-8 sm:px-10 md:px-12 py-3 sm:py-4 border-2 border-white rounded-full text-white font-medium text-base sm:text-lg hover:bg-white hover:text-black transition-colors duration-300"
            >
              LET'S TALK
            </MagneticCTALink>
          </motion.div>
        </div>
      </motion.section>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-5 right-5 sm:bottom-8 sm:left-8 w-11 h-11 sm:w-14 sm:h-14 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 z-50 shadow-lg"
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

export default ITConsulting;
