import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Building2, Heart, Landmark, Network, Shield, Users } from "lucide-react";
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
  const script = document.createElement("script");
  script.src = "https://cdn.jotfor.ms/agent/embedjs/019f2165e4c6756899b7d476e73c18bd40b3/embed.js";
  script.async = true;
  document.body.appendChild(script);
  return () => { document.body.removeChild(script); };
}, []);



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
// ✦ INDUSTRIES LIST  (dark 3-col → 1-col mobile)
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10 md:gap-12">
      {industries.map((industry, index) => (
        <motion.div
          key={index}
          className="relative space-y-3 sm:space-y-4 pb-6 sm:pb-8 border-b border-gray-700"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.2 + index * 0.12 }}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <industry.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white flex-shrink-0" />
            <h3 className="text-base sm:text-xl font-semibold text-white">{industry.title}</h3>
          </div>
          <p className="text-sm sm:text-lg text-gray-300 leading-relaxed">{industry.description}</p>
          {index < industries.length - 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-700 overflow-hidden hidden md:block">
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
// ✦ SOLUTION CARD  (CSS hover — no per-card GSAP listeners)
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
    </div>
  </>
);

// ========================================================
// MAIN CISCO PAGE
// ========================================================
const Cisco = () => {
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

  // Section inView refs
  const heroRef      = useRef(null);
  const partnerRef   = useRef(null);
  const benefitsRef  = useRef(null);
  const solutionsRef = useRef(null);
  const indRef       = useRef(null);
  const featRef      = useRef(null);
  const statsRef     = useRef(null);
  const ctaRef       = useRef(null);

  const heroInView     = useInView(heroRef,     { once: true, margin: "-60px" });
  const partnerInView  = useInView(partnerRef,  { once: true, margin: "-60px" });
  const benefitsInView = useInView(benefitsRef, { once: true, margin: "-60px" });
  const solutionsInView= useInView(solutionsRef,{ once: true, margin: "-60px" });
  const indInView      = useInView(indRef,      { once: true, margin: "-60px" });
  const featInView     = useInView(featRef,     { once: true, margin: "-60px" });
  const statsInView    = useInView(statsRef,    { once: true, margin: "-60px" });
  const ctaInView      = useInView(ctaRef,      { once: true, margin: "-100px" });

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

  // GSAP solutions stagger
  const solutionsListRef = useRef<HTMLDivElement>(null);
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

  const benefits = [
    { icon: Shield,  label: "CERTIFIED CISCO EXPERTISE",      description: "Our team is highly trained and certified in Cisco network architecture, cybersecurity, and collaboration technologies." },
    { icon: Network, label: "TAILORED ENTERPRISE SOLUTIONS",  description: "We design customized Cisco solutions to align with your business goals and compliance needs." },
    { icon: Users,   label: "END-TO-END SUPPORT",             description: "From planning and deployment to ongoing support and scaling, we provide comprehensive service excellence." },
  ];

  const solutions = [
    { title: "Networking Hardware & Software",  description: "High-performance routers, switches, wireless controllers, and next-generation firewalls built for secure, uninterrupted connectivity.", image: "https://i.postimg.cc/GmyXYP1D/5170.jpg" },
    { title: "Collaboration Tools",             description: "Advanced communication platforms like Cisco Webex, enabling efficient video conferencing, messaging, and team collaboration anywhere.", image: "https://i.postimg.cc/4nC9T9F7/4731142.jpg" },
    { title: "Cybersecurity Solutions",         description: "Enterprise-grade security solutions including advanced threat protection, zero-trust frameworks, and secure access control tailored for hybrid workforces.", image: "https://i.postimg.cc/25ThB33h/female.jpg" },
  ];

  const industries = [
    { icon: Building2, title: "IT & Software Development",  description: "Enhance network performance and protect critical digital assets." },
    { icon: Landmark,  title: "Financial Institutions",     description: "Achieve regulatory compliance, mitigate risks, and ensure infrastructure uptime." },
    { icon: Heart,     title: "Healthcare",                 description: "Maintain secure, reliable communication and data access in sensitive environments." },
  ];

  const marqueeItems1 = ["Cisco Authorized Partner", "Enterprise Networking", "Cybersecurity", "Cisco Webex", "Sniper Systems", "India"];
  const marqueeItems2 = ["Cisco Catalyst", "Cisco Meraki", "Zero Trust Security", "SD-WAN", "Cisco Firepower", "Collaboration Tools"];
  const marqueeItems3 = ["Smarter Networking Starts Here", "Future-Ready Infrastructure", "Sniper Systems", "Secure & Scalable IT", "Cisco Solutions"];

  return (
    <Layout>
      <>
        {/* BASIC SEO */}
        <title>Cisco Partner in India | Cisco Networking & Security Solutions | Sniper Systems</title>
        <meta
          name="description"
          content="Sniper Systems delivers Cisco networking, cybersecurity, collaboration, SD-WAN, data center, and enterprise infrastructure solutions in India with deployment, consultation, and managed IT support."
        />
        <meta
          name="keywords"
          content="Cisco partner India, Cisco networking solutions India, Cisco security solutions, Cisco SD-WAN India, Cisco infrastructure solutions, Cisco managed services"
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://sniperindia.com/partners/cisco"
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
          content="Cisco Networking & Security Solutions | Sniper Systems India"
        />
        <meta
          property="og:description"
          content="Enterprise Cisco solutions including networking, cybersecurity, SD-WAN, collaboration, and data center infrastructure."
        />
        <meta
          property="og:image"
          content="https://sniperindia.com/wp-content/uploads/2023/09/sniper-systems-banner.jpg"
        />
        <meta
          property="og:url"
          content="https://sniperindia.com/partners/cisco"
        />

        {/* TWITTER SEO */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Cisco Partner in India | Sniper Systems"
        />
        <meta
          name="twitter:description"
          content="Scalable Cisco networking, cybersecurity, and enterprise infrastructure solutions for modern businesses."
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
            "serviceType": "Cisco Networking & Security Solutions",
            "provider": {
              "@type": "Organization",
              "name": "Sniper Systems"
            },
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "description": "Cisco enterprise solutions including networking, cybersecurity, SD-WAN, collaboration, data center infrastructure, and managed IT services."
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
                "name": "What Cisco solutions does Sniper Systems provide?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sniper Systems provides Cisco networking, cybersecurity, SD-WAN, collaboration, wireless networking, and enterprise infrastructure solutions."
                }
              },
              {
                "@type": "Question",
                "name": "What industries use Cisco enterprise solutions?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Cisco solutions are used across enterprises, education, healthcare, manufacturing, BFSI, and corporate IT environments."
                }
              },
              {
                "@type": "Question",
                "name": "Does Sniper Systems provide Cisco managed services?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, Sniper Systems provides Cisco deployment, implementation, monitoring, maintenance, and managed IT support services."
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
                "name": "Cisco",
                "item": "https://sniperindia.com/partners/cisco"
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
              aria-label="Trusted Cisco Authorized Partner in India"
            >
              {["Trusted", "Cisco", "Authorized", "Partner", "in", "India"].map((word, i) => (
                <span key={i} className="hero-word inline-block opacity-0 mr-[0.22em] last:mr-0">
                  {word}
                  {word === "Authorized" && <br className="hidden sm:block" />}
                </span>
              ))}
            </h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 1.55 }}
            >
              Smarter Networking Starts Here
            </motion.p>

            <motion.p
              className="text-base sm:text-lg text-gray-700 max-w-5xl mx-auto leading-relaxed px-2 sm:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 1.7 }}
            >
              As a Cisco Authorized Partner in India, Sniper Systems &amp; Solutions delivers the full spectrum of Cisco
              networking solutions designed to transform your enterprise connectivity, collaboration, and cybersecurity.
              Whether you're scaling infrastructure or modernizing communication and network management, our Cisco-certified
              solutions guarantee performance, reliability, and future-readiness.
            </motion.p>
          </div>

          {/* Hero image */}
          <FadeUp delay={0.25}>
            <div className="relative rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden h-56 sm:h-96 md:h-[500px] lg:h-[600px]">
              <ParallaxImage
                src="https://i.postimg.cc/mkwMWC2w/image.jpg"
                alt="Cisco Networking"
                className="w-full h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 z-10">
                  <div className="bg-black/50 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                    <span className="text-[10px] sm:text-sm font-medium">CISCO AUTHORIZED PARTNER</span>
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
                About Our Partnership
              </h2>
            </FadeUp>
            <div className="w-full h-px bg-gray-300" />
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-10 sm:mb-16">
            <FadeUp>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                ABOUT OUR<br />PARTNERSHIP
              </h3>
            </FadeUp>
            <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Sniper Systems proudly partners with Cisco, the global leader in networking and IT solutions. As a certified
                Cisco authorized partner, we provide industry-leading Cisco enterprise solutions backed by innovation, global
                standards, and unmatched support.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Our partnership ensures tailored deployment, seamless integration, and end-to-end service delivery—helping
                businesses across India maximize the benefits of Cisco's advanced technologies.
              </p>
            </FadeUp>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            <FadeUp delay={0.1} className="lg:col-start-2">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Cisco leads the way in developing scalable, secure, and intelligent networking technologies that meet today's
                enterprise demands. From traditional on-premise networks to cloud-managed infrastructures, Cisco enables seamless,
                secure connectivity across locations, devices, and users. Sniper Systems leverages Cisco's innovation to help
                enterprises build secure, agile, and scalable IT environments that support hybrid work, digital transformation,
                and global collaboration.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Why Choose ───────────────────────────────────────────────────── */}
      <FadeUp className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12">
        <div ref={benefitsRef} className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <FadeUp>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-4 sm:mb-6 leading-tight">
                Why Choose Sniper Systems<br className="hidden sm:block" />
                for Your Organization?
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
              Cisco Solutions Offered<br className="hidden sm:block" />
              by Sniper Systems
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
              Enterprise networking<br />that scales with you
            </h2>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-56 sm:h-[400px] md:h-[550px] lg:h-[700px]">
              <ParallaxImage
                src="https://i.postimg.cc/bwQYJJ8G/3791694.jpg"
                alt="Network Infrastructure"
                className="w-full h-full"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="bg-white py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={statsRef}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 text-center">
            {[
              { number: "1800", suffix: "+", label: "Happy Customers" },
              { number: "350",  suffix: "+", label: "Cisco Projects Delivered" },
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

export default Cisco;
