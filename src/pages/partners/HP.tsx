import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, CheckCircle, Cloud, Database, Monitor, Server, Shield, Zap } from "lucide-react";
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
// ✦ SOLUTIONS LIST  (light bg, GSAP line-draw dividers)
// ========================================================
const SolutionsList = ({ solutions, inView }: { solutions: any[]; inView: boolean }) => {
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
      {solutions.map((solution, index) => (
        <motion.div
          key={index}
          className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 lg:gap-16 items-start pb-10 sm:pb-12 last:pb-0"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease, delay: 0.1 + index * 0.08 }}
        >
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider">
              {solution.title}
            </h3>
          </div>
          <div>
            <ul className="space-y-2 sm:space-y-3">
              {solution.items.map((item: string, idx: number) => (
                <li key={idx} className="text-base sm:text-lg text-gray-800 leading-relaxed flex items-start gap-2">
                  <span className="text-gray-900 flex-shrink-0 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {index < solutions.length - 1 && (
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
// MAIN HP PAGE
// ========================================================
const HP = () => {
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

  // GSAP industries grid stagger
  const indGridRef   = useRef<HTMLDivElement>(null);
  const indRef       = useRef(null);
  const indInView    = useInView(indRef, { once: true, margin: "-60px" });
  const indTriggered = useRef(false);
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

  // Section inView refs
  const heroRef    = useRef(null);
  const hpeBenRef  = useRef(null);
  const hpeSolRef  = useRef(null);
  const hpiBenRef  = useRef(null);
  const hpiSolRef  = useRef(null);
  const statsRef   = useRef(null);

  const heroInView   = useInView(heroRef,   { once: true, margin: "-60px" });
  const hpeBenInView = useInView(hpeBenRef, { once: true, margin: "-60px" });
  const hpeSolInView = useInView(hpeSolRef, { once: true, margin: "-60px" });
  const hpiBenInView = useInView(hpiBenRef, { once: true, margin: "-60px" });
  const hpiSolInView = useInView(hpiSolRef, { once: true, margin: "-60px" });
  const statsInView  = useInView(statsRef,  { once: true, margin: "-60px" });

  // Data
  const hpeBenefits = [
    { icon: CheckCircle, label: "SEAMLESS INTEGRATION",          description: "Certified partner support throughout the entire lifecycle — from initial architecture design to ongoing maintenance — ensuring your HPE environment runs at peak efficiency." },
    { icon: Server,      label: "ENTERPRISE-GRADE INFRASTRUCTURE",description: "Servers, storage, and networking built for the demands of modern enterprises, delivering the performance, reliability, and scalability your business depends on." },
    { icon: Cloud,       label: "HYBRID IT EXPERTISE",           description: "From on-premises deployments to full cloud migration and everything in between, we architect end-to-end hybrid IT strategies that accelerate your digital transformation." },
    { icon: Database,    label: "HPE GREENLAKE",                 description: "A flexible pay-as-you-go infrastructure model that brings the cloud experience to your data center — scale up or down based on actual consumption with no upfront capital commitment." },
    { icon: Shield,      label: "BUILT-IN SECURITY",             description: "Infrastructure-level protection and compliance embedded at every layer, safeguarding your critical business data and ensuring regulatory requirements are consistently met." },
    { icon: Zap,         label: "BUSINESS CONTINUITY",           description: "Comprehensive backup and disaster recovery strategies that protect your operations against disruptions, ensuring your business stays online and resilient at all times." },
  ];

  const hpeSolutions = [
    { title: "Supercomputing Products",      items: ["HPE Cray supercomputers for high-performance scientific and enterprise workloads", "AI and machine learning optimized infrastructure for next-generation computing", "Massively parallel processing architectures for complex simulation and analytics"] },
    { title: "Compute Solutions",            items: ["HPE ProLiant servers for scalable and reliable data center computing", "HPE Synergy composable infrastructure for dynamic workload management", "HPE Edgeline converged edge systems for IoT and real-time processing"] },
    { title: "Enterprise Storage Solutions", items: ["HPE Nimble Storage for intelligent, AI-driven predictive flash storage", "HPE Primera for mission-critical storage with guaranteed availability", "HPE StoreOnce for efficient backup, deduplication, and disaster recovery"] },
    { title: "Networking Products",          items: ["Aruba networking solutions for secure, high-performance enterprise connectivity", "HPE FlexFabric switches for data center and campus network environments", "SD-WAN and intelligent edge solutions for optimized branch connectivity"] },
  ];

  const hpiBenefits = [
    { icon: Zap,         label: "INNOVATIVE TECHNOLOGY",      description: "HP leads the way with cutting-edge computing solutions, offering unparalleled speed, performance, and reliability — the most preferred computing device across all industries worldwide." },
    { icon: Monitor,     label: "VERSATILITY ACROSS INDUSTRIES",description: "HP delivers tailored solutions across all industries — from education and healthcare to IT, manufacturing, finance, and enterprise — making it the go-to computing brand globally." },
    { icon: CheckCircle, label: "SUSTAINABILITY LEADERSHIP",  description: "HP's energy-efficient devices and sustainable manufacturing practices demonstrate a strong commitment to the environment, helping businesses reduce their carbon footprint responsibly." },
    { icon: Server,      label: "COMPREHENSIVE RANGE",        description: "HP offers a wide variety of computing solutions — laptops, desktops, workstations, servers, storage, and a wide range of accessories — to suit the diverse needs of every business." },
    { icon: Shield,      label: "ADVANCED SECURITY",          description: "Industry-leading security features including BIOS-level protection and endpoint security safeguard your data against evolving cyber threats at the hardware level." },
    { icon: Database,    label: "GLOBAL TRUST",               description: "Trusted by businesses and professionals worldwide, HP is renowned for its quality, durability, and relentless innovation — backed by decades of technology leadership." },
  ];

  const hpiSolutions = [
    { title: "Laptops & Notebooks",         items: ["HP EliteBook series for enterprise professionals requiring premium performance", "HP ProBook for SMBs seeking reliable, cost-effective business laptops", "HP ZBook mobile workstations for creative and technical power users"] },
    { title: "Desktops & All-in-Ones",      items: ["HP EliteDesk desktops for secure, manageable enterprise computing", "HP ProDesk compact and tower desktops for everyday business productivity", "HP All-in-One PCs combining sleek design with powerful performance"] },
    { title: "Workstations",                items: ["HP Z Desktop Workstations for demanding creative and engineering workflows", "HP Z Mobile Workstations for on-the-go professional-grade performance", "ISV-certified workstations for CAD, simulation, and media production"] },
    { title: "Thin Clients, Monitors & Accessories", items: ["HP Thin Clients for secure, centrally managed virtual desktop environments", "Monitors and displays from FHD to 4K for every workspace requirement", "Servers, storage solutions, and a wide range of accessories"] },
  ];

  const industries = [
    { title: "Healthcare",    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80", description: "Secure, compliant IT solutions for patient care, medical imaging, and healthcare data management." },
    { title: "Education",     image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80", description: "Empowering learning institutions with technology that scales from classrooms to full campuses." },
    { title: "Finance",       image: "https://images.unsplash.com/photo-1560472355-536de3962603?w=800&q=80", description: "High-performance, secure systems for banking, trading platforms, and financial services." },
    { title: "Manufacturing", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80", description: "Robust infrastructure supporting automation, IoT, and smart manufacturing workflows." },
    { title: "Retail",        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80", description: "Point-of-sale systems and retail management solutions for seamless customer experiences." },
  ];

  const marqueeItems1 = ["HP & HPE Solutions", "Enterprise IT", "Hybrid Cloud", "HPE GreenLake", "Authorized Partner", "Sniper Systems"];
  const marqueeItems2 = ["HPE ProLiant", "HPE Nimble Storage", "Aruba Networking", "HP EliteBook", "HP ZBook", "Workstations"];
  const marqueeItems3 = ["HP Inc.", "Hewlett Packard Enterprise", "Smart Computing", "Digital Transformation", "Business Continuity"];
  const marqueeItems4 = ["Servers & Storage", "Thin Clients", "All-in-One PCs", "HPE Cray", "SD-WAN", "Edge Computing"];

  return (
    <Layout>
      {showWhiteScreen && <WhiteScreenTransition onComplete={() => setShowWhiteScreen(false)} />}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-white pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16" ref={heroRef}>

            {/* GSAP word-stagger heading */}
            <h1
              ref={heroHeadingRef}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              aria-label="Transform Your Business with HP"
            >
              {["Transform", "Your", "Business", "with", "HP"].map((word, i) => (
                <span key={i} className="hero-word inline-block opacity-0 mr-[0.22em] last:mr-0">
                  {word}
                  {word === "Business" && <br className="hidden sm:block" />}
                </span>
              ))}
            </h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-700 max-w-5xl mx-auto leading-relaxed px-2 sm:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 1.6 }}
            >
              Sniper Systems &amp; Solutions is an authorized partner for both HP Inc. (HPI) and Hewlett
              Packard Enterprise (HPE). Whether you're equipping your workforce with top-tier computing
              devices or modernizing your IT infrastructure, we bring the right HP solutions tailored for
              your business — from startups and SMBs to large-scale enterprises across all industries.
            </motion.p>
          </div>

          {/* Dual hero images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto pt-8 sm:pt-12">
            {/* HPE */}
            <motion.div
              className="relative rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden h-56 sm:h-72 md:h-80 lg:h-[420px]"
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 1, ease, delay: 0.3 }}
            >
              <ParallaxImage
                src="https://i.postimg.cc/Nj4X2LzM/1749744308758.jpg"
                alt="HPE Enterprise Solutions"
                className="w-full h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 z-10">
                  <div className="bg-black/60 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl backdrop-blur-sm">
                    <p className="text-[9px] sm:text-xs font-medium text-gray-300 uppercase tracking-widest mb-0.5 sm:mb-1">
                      Hewlett Packard Enterprise
                    </p>
                    <p className="text-sm sm:text-lg font-semibold leading-tight">Enterprise IT, Reimagined</p>
                  </div>
                </div>
              </ParallaxImage>
            </motion.div>

            {/* HPI */}
            <motion.div
              className="relative rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden h-56 sm:h-72 md:h-80 lg:h-[420px]"
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 1, ease, delay: 0.45 }}
            >
              <ParallaxImage
                src="https://i.postimg.cc/90ZRmf9h/hp-logo-brand-computer-symbol-white-design-usa-laptop-illustration-free-vector.jpg"
                alt="HP Inc Computing Solutions"
                className="w-full h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 z-10">
                  <div className="bg-black/60 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl backdrop-blur-sm">
                    <p className="text-[9px] sm:text-xs font-medium text-gray-300 uppercase tracking-widest mb-0.5 sm:mb-1">
                      HP Inc.
                    </p>
                    <p className="text-sm sm:text-lg font-semibold leading-tight">
                      Smart Computing for Modern Workplaces
                    </p>
                  </div>
                </div>
              </ParallaxImage>
            </motion.div>
          </div>
        </div>
      </section>

      <MarqueeTicker items={marqueeItems1} />

      {/* ══════ HPE BLOCK ══════════════════════════════════════════════════ */}

      {/* HPE — Why Choose */}
      <FadeUp className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12">
        <div ref={hpeBenRef} className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <FadeUp delay={0.1}>
              <p className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-widest mb-3 sm:mb-4">
                Hewlett Packard Enterprise
              </p>
            </FadeUp>
            <FadeUp delay={0.15}>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-4 sm:mb-6 leading-tight">
                Why Choose HPE<br />from Sniper Systems?
              </h2>
            </FadeUp>
            <FadeUp delay={0.25}>
              <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                With HPE solutions, Sniper helps businesses build agile, secure, and scalable IT
                environments — architecting and implementing end-to-end infrastructure strategies that
                accelerate your digital transformation.
              </p>
            </FadeUp>
          </div>
          <BenefitsList benefits={hpeBenefits} inView={hpeBenInView} />
        </div>
      </FadeUp>

      {/* HPE — Solutions */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={hpeSolRef}>
          <div className="mb-10 sm:mb-16">
            <FadeUp>
              <p className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3 sm:mb-4">
                Hewlett Packard Enterprise
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 leading-tight">
                HPE Solutions<br />We Provide
              </h2>
            </FadeUp>
          </div>
          <SolutionsList solutions={hpeSolutions} inView={hpeSolInView} />
        </div>
      </section>

      <MarqueeTicker items={marqueeItems2} reverse />

      {/* Visual Divider */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="border-t-2 border-gray-900" />
      </div>

      {/* ══════ HPI BLOCK ══════════════════════════════════════════════════ */}

      {/* HPI — Why Choose */}
      <FadeUp className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12">
        <div ref={hpiBenRef} className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <FadeUp delay={0.1}>
              <p className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-widest mb-3 sm:mb-4">
                HP Inc.
              </p>
            </FadeUp>
            <FadeUp delay={0.15}>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-4 sm:mb-6 leading-tight">
                Why Choose HP Inc.<br />from Sniper Systems?
              </h2>
            </FadeUp>
            <FadeUp delay={0.25}>
              <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                As an HP Authorized Reseller, Sniper delivers the latest in HP computing technology —
                the most preferred computing device across all industries, designed to boost productivity
                and simplify IT management.
              </p>
            </FadeUp>
          </div>
          <BenefitsList benefits={hpiBenefits} inView={hpiBenInView} />
        </div>
      </FadeUp>

      {/* HPI — Products */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={hpiSolRef}>
          <div className="mb-10 sm:mb-16">
            <FadeUp>
              <p className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3 sm:mb-4">
                HP Inc.
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 leading-tight">
                HP Products<br />We Offer
              </h2>
            </FadeUp>
          </div>
          <SolutionsList solutions={hpiSolutions} inView={hpiSolInView} />
        </div>
      </section>

      <MarqueeTicker items={marqueeItems3} />

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
              { number: "500",  suffix: "+", label: "HP Projects Delivered" },
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

      <MarqueeTicker items={marqueeItems4} reverse />

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

export default HP;
