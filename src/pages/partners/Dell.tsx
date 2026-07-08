import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, CheckCircle, Database, Shield, Zap } from "lucide-react";
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
// ✦ OFFERINGS LIST  (light bg, GSAP line-draw dividers)
// ========================================================
const OfferingsList = ({ offerings, inView }: { offerings: any[]; inView: boolean }) => {
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (!inView) return;
    linesRef.current.forEach((line, i) => {
      if (!line) return;
      gsap.fromTo(line,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 1, ease: "power3.out", delay: 0.2 + i * 0.1 }
      );
    });
  }, [inView]);

  return (
    <div className="space-y-10 sm:space-y-16">
      {offerings.map((offering, index) => (
        <motion.div
          key={index}
          className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 lg:gap-16 items-start pb-10 sm:pb-12 last:pb-0"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease, delay: 0.1 + index * 0.08 }}
        >
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider">
              {offering.title}
            </h3>
          </div>
          <div className="space-y-3 sm:space-y-6">
            {offering.description ? (
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">{offering.description}</p>
            ) : (
              <ul className="space-y-2 sm:space-y-3">
                {offering.items?.map((item: string, idx: number) => (
                  <li key={idx} className="text-base sm:text-lg text-gray-800 leading-relaxed flex items-start gap-2">
                    <span className="text-gray-900 flex-shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {index < offerings.length - 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300 overflow-hidden">
              <div
                ref={(el) => { linesRef.current[index] = el; }}
                className="h-full bg-gradient-to-r from-transparent via-gray-600 to-transparent"
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
// ✦ INDUSTRY CARD  (CSS hover — no per-card GSAP listeners)
// ========================================================
const IndustryCard = ({ industry }: { industry: any }) => (
  <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
    <div className="relative h-44 sm:h-56 md:h-64 overflow-hidden">
      <img
        src={industry.image}
        alt={industry.title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider">
        {industry.title}
      </h3>
      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{industry.description}</p>
    </div>
  </div>
);

// ========================================================
// MAIN DELL PAGE
// ========================================================
const Dell = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);

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

  // ✦ NEW: Hero image scale-on-scroll (grows from small → full as you scroll down)
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
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);

  // Section inView refs
  const heroRef      = useRef(null);
  const partnerRef   = useRef(null);
  const benefitsRef  = useRef(null);
  const solutionsRef = useRef(null);
  const indRef       = useRef(null);
  const statsRef     = useRef(null);
  const ctaRef       = useRef(null);

  const heroInView      = useInView(heroRef,      { once: true, margin: "-60px" });
  const partnerInView   = useInView(partnerRef,   { once: true, margin: "-60px" });
  const benefitsInView  = useInView(benefitsRef,  { once: true, margin: "-60px" });
  const solutionsInView = useInView(solutionsRef, { once: true, margin: "-60px" });
  const indInView       = useInView(indRef,       { once: true, margin: "-60px" });
  const statsInView     = useInView(statsRef,     { once: true, margin: "-60px" });
  const ctaInView       = useInView(ctaRef,       { once: true, margin: "-100px" });

  // GSAP CTA word stagger
  const ctaHeadingRef = useRef<HTMLHeadingElement>(null);
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

  // GSAP industries grid stagger
  const indGridRef   = useRef<HTMLDivElement>(null);
  const indTriggered = useRef(false);


  useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://cdn.jotfor.ms/agent/embedjs/019f2165e4c6756899b7d476e73c18bd40b3/embed.js";
  script.async = true;
  document.body.appendChild(script);
  return () => { document.body.removeChild(script); };
}, []);


  useEffect(() => {
    if (!indInView || indTriggered.current) return;
    indTriggered.current = true;
    const cards = indGridRef.current?.querySelectorAll(".industry-card");
    if (!cards) return;
    gsap.fromTo(cards,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.12 }
    );
  }, [indInView]);

  // Data
  const partnerBenefits = [
    { icon: CheckCircle, label: "EXPERT CONSULTATION",    description: "Our certified Dell specialists provide in-depth consultations to understand your business requirements and recommend the perfect solutions for your organization." },
    { icon: Zap,         label: "SMOOTH IMPLEMENTATION",  description: "From initial setup to full deployment, we ensure seamless integration of Dell products into your existing infrastructure with minimal disruption." },
    { icon: Shield,      label: "COMPREHENSIVE SUPPORT",  description: "Round-the-clock support and maintenance services to keep your Dell systems running at peak performance, backed by our team of experts." },
    { icon: Database,    label: "FLEXIBLE LICENSING",     description: "Customized licensing solutions and financing options that align with your budget and business growth plans, ensuring maximum ROI." },
  ];

  const dellBenefits = [
    { title: "Scalable Solutions",         description: "Dell products grow with your business, from startups to global enterprises, offering solutions that scale seamlessly as your needs evolve." },
    { title: "Reliability and Performance",description: "Industry-leading uptime, powerful processing capabilities, and robust build quality ensure your business operations never miss a beat." },
    { title: "Future-Ready IT",            description: "Stay ahead with cutting-edge technology designed for tomorrow's challenges, including AI-ready infrastructure and next-gen computing power." },
    { title: "Enhanced Security",          description: "Built-in security features, hardware-level protection, and enterprise-grade encryption safeguard your critical business data." },
    { title: "Seamless Integration",       description: "Dell solutions integrate effortlessly with existing systems, cloud platforms, and enterprise applications for unified workflows." },
  ];

  const solutions = [
    { title: "Workforce Solutions",             items: ["Latitude laptops for mobile professionals and remote teams", "Precision workstations for demanding creative and technical workloads", "OptiPlex desktops for reliable everyday business computing"] },
    { title: "Server and Data Center Solutions",items: ["PowerEdge servers for scalable computing power", "EMC storage solutions for enterprise data management", "Hyperconverged infrastructure for simplified IT operations"] },
    { title: "Cloud and Virtualization",        items: ["Dell Cloud platforms for flexible hybrid cloud deployments", "VMware virtualization for optimized resource utilization", "Software-defined infrastructure for agile IT environments"] },
    { title: "Networking Solutions",            items: ["High-performance switches and routers for enterprise networks", "Network security appliances for threat protection", "SD-WAN solutions for optimized connectivity"] },
    { title: "Security Solutions",              items: ["Endpoint security and threat detection systems", "Data protection and backup solutions", "Compliance and governance tools for regulatory requirements"] },
  ];

  const industries = [
    { title: "Healthcare",    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80", description: "Secure, compliant IT solutions for patient care and medical data management." },
    { title: "Education",     image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80", description: "Empowering learning with technology that scales from classrooms to campuses." },
    { title: "Finance",       image: "https://images.unsplash.com/photo-1560472355-536de3962603?w=800&q=80", description: "High-performance, secure systems for banking and financial services." },
    { title: "Manufacturing", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80", description: "Robust infrastructure supporting automation, IoT, and smart manufacturing." },
    { title: "Retail",        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80", description: "Point-of-sale systems and retail management solutions for seamless operations." },
  ];

  const marqueeItems1 = ["Dell Preferred Partner", "PowerEdge Servers", "Workforce Solutions", "Enterprise IT", "Sniper India", "Dell for Business"];
  const marqueeItems2 = ["Latitude Laptops", "Precision Workstations", "EMC Storage", "VMware", "SD-WAN", "Hyperconverged Infrastructure"];
  const marqueeItems3 = ["Cutting-Edge Solutions", "Digital Transformation", "Future-Ready IT", "Sniper Systems", "Scalable Technology"];

  return (
    <Layout>
      <>
        {/* BASIC SEO */}
        <title>Dell Authorized Partner in India | Dell Business Solutions | Sniper Systems</title>
        <meta
          name="description"
          content="Sniper Systems is a Dell authorized partner in India delivering enterprise laptops, servers, storage, and IT infrastructure solutions with expert consultation, deployment, and support."
        />
        <meta
          name="keywords"
          content="Dell partner India, Dell authorized reseller India, Dell business solutions, Dell servers India, Dell laptops enterprise, Dell IT infrastructure solutions"
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://sniperindia.com/partners/dell"
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
          content="Dell Business Solutions & Enterprise IT | Sniper Systems India"
        />
        <meta
          property="og:description"
          content="Enterprise Dell solutions including laptops, servers, storage, and infrastructure designed for scalable business growth."
        />
        <meta
          property="og:image"
          content="https://sniperindia.com/wp-content/uploads/2023/09/sniper-systems-banner.jpg"
        />
        <meta
          property="og:url"
          content="https://sniperindia.com/partners/dell"
        />

        {/* TWITTER SEO */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Dell Authorized Partner in India | Sniper Systems"
        />
        <meta
          name="twitter:description"
          content="Scalable Dell enterprise solutions for modern businesses across India."
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
            "serviceType": "Dell Business Solutions",
            "provider": {
              "@type": "Organization",
              "name": "Sniper Systems"
            },
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "description": "Dell enterprise solutions including laptops, servers, storage, cloud, and IT infrastructure services for businesses in India."
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
                "name": "What does a Dell authorized partner provide?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A Dell authorized partner provides genuine Dell products, consultation, deployment, and ongoing support for enterprise IT solutions."
                }
              },
              {
                "@type": "Question",
                "name": "What Dell solutions are available for businesses?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Dell offers laptops, desktops, servers, storage, networking, and cloud solutions designed for business scalability and performance."
                }
              },
              {
                "@type": "Question",
                "name": "Why choose Sniper Systems for Dell solutions?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sniper Systems provides expert consultation, seamless implementation, and dedicated support to help businesses maximize the value of Dell technologies."
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
                "name": "Dell",
                "item": "https://sniperindia.com/partners/dell"
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
              aria-label="Dell for Business: Empowering Enterprises with Cutting-Edge Solutions"
            >
              {["Dell", "for", "Business:", "Empowering", "Enterprises", "with", "Cutting-Edge", "Solutions"].map((word, i) => (
                <span key={i} className="hero-word inline-block opacity-0 mr-[0.22em] last:mr-0">
                  {word}
                  {word === "Business:" && <br className="hidden sm:block" />}
                  {word === "with"      && <br className="hidden sm:block" />}
                </span>
              ))}
            </h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-700 max-w-5xl mx-auto leading-relaxed px-2 sm:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 1.6 }}
            >
              In today's fast-paced digital landscape, businesses need technology that enhances productivity,
              strengthens security, and scales seamlessly. Dell for Business offers a comprehensive suite of
              high-performance solutions, including laptops, desktops, servers, storage, and enterprise-grade
              IT infrastructure. As a Dell Preferred Partner, Sniper India delivers tailored B2B solutions to
              meet the unique needs of businesses across industries.
            </motion.p>
          </div>

          {/* Hero image with scale-on-scroll animation */}
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
                src="https://i.postimg.cc/g0N17CTk/images.jpg"
                alt="Dell Technology Solutions"
                className="w-full h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 z-10">
                  <div className="bg-black/50 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                    <span className="text-[10px] sm:text-sm font-medium">DELL PREFERRED PARTNER</span>
                  </div>
                </div>
              </ParallaxImage>
            </div>
          </motion.div>
        </div>
      </section>

      <MarqueeTicker items={marqueeItems1} />

      {/* ── Why Partner with Sniper ───────────────────────────────────────── */}
      <FadeUp className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12">
        <div ref={partnerRef} className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <FadeUp>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-4 sm:mb-6 leading-tight">
                Why Partner with<br className="hidden sm:block" />
                Sniper for Dell Solutions?
              </h2>
            </FadeUp>
          </div>
          <BenefitsList benefits={partnerBenefits} inView={partnerInView} />
        </div>
      </FadeUp>

      <MarqueeTicker items={marqueeItems2} reverse />

      {/* ── Benefits of Dell ──────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={benefitsRef}>
          <FadeUp className="mb-10 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 leading-tight">
              Benefits of Using<br />Dell Products
            </h2>
          </FadeUp>
          <OfferingsList offerings={dellBenefits} inView={benefitsInView} />
        </div>
      </section>

      {/* ── Solutions ─────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={solutionsRef}>
          <FadeUp className="mb-10 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 leading-tight">
              Transforming Businesses<br />with Dell Solutions
            </h2>
          </FadeUp>
          <OfferingsList offerings={solutions} inView={solutionsInView} />
        </div>
      </section>

      {/* ── Industries ───────────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={indRef}>
          <FadeUp className="mb-10 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 leading-tight">
              Industries We Serve
            </h2>
          </FadeUp>

          <div ref={indGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {industries.map((industry, index) => (
              <div key={index} className="industry-card opacity-0">
                <IndustryCard industry={industry} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="bg-white py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={statsRef}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 text-center">
            {[
              { number: "1800", suffix: "+", label: "Happy Customers" },
              { number: "400",  suffix: "+", label: "Dell Projects Delivered" },
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
      <FadeUp className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12 overflow-hidden">
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

export default Dell;
