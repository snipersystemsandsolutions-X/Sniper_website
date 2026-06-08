import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Globe, Layers, Lightbulb, Zap } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

// ---- Marquee Ticker ----
const MarqueeTicker = ({ items, speed = 26, reverse = false }: { items: string[]; speed?: number; reverse?: boolean }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const totalWidth = track.scrollWidth / 2;
    const tween = gsap.to(track, { x: reverse ? `${totalWidth}px` : `-${totalWidth}px`, duration: speed, ease: "none", repeat: -1 });
    return () => tween.kill();
  }, [speed, reverse]);
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden bg-gray-950 py-3 sm:py-4 border-y border-gray-800">
      <div ref={trackRef} className="flex gap-6 sm:gap-8 lg:gap-10 whitespace-nowrap will-change-transform">
        {doubled.map((text, i) => (
          <span key={i} className="flex items-center gap-6 sm:gap-8 lg:gap-10 text-[9px] sm:text-[10px] lg:text-[11px] font-semibold tracking-[0.16em] sm:tracking-[0.2em] lg:tracking-[0.22em] uppercase text-gray-500">
            {text}
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gray-700 inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
};

// ---- Parallax Image ----
const ParallaxImage = ({ src, alt, className, children }: { src: string; alt: string; className?: string; children?: React.ReactNode }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const wrap = wrapRef.current; const img = imgRef.current;
    if (!wrap || !img) return;
    const tween = gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true } });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);
  return (
    <div ref={wrapRef} className={`overflow-hidden ${className ?? ""}`}>
      <img ref={imgRef} src={src} alt={alt} className="w-full h-full object-cover scale-110 will-change-transform" />
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
  const trailingSuffix = numericValue !== null ? target.replace(new RegExp(`^${prefix}[\\d.]+`), "").replace(suffix, "") : "";
  useEffect(() => {
    const el = ref.current;
    if (!el || numericValue === null) return;
    const st = ScrollTrigger.create({
      trigger: el, start: "top 88%", onEnter: () => {
        if (triggered.current) return; triggered.current = true;
        const obj = { val: 0 };
        gsap.to(obj, { val: numericValue, duration: 2.2, ease: "power2.out", onUpdate: () => { if (el) el.textContent = prefix + Math.round(obj.val).toLocaleString() + trailingSuffix + suffix; } });
      }
    });
    return () => st.kill();
  }, [numericValue]);
  if (numericValue === null) return <span ref={ref}>{target}</span>;
  return <span ref={ref}>{prefix}0{trailingSuffix}{suffix}</span>;
};

// ---- Benefits List ----
const BenefitsList = ({ benefits, inView }: { benefits: any[]; inView: boolean }) => {
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (!inView) return;
    linesRef.current.forEach((line, i) => {
      if (!line) return;
      gsap.fromTo(line, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 1, ease: "power3.out", delay: 0.3 + i * 0.12 });
    });
  }, [inView]);
  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-12">
      {benefits.map((benefit, index) => (
        <motion.div key={index} className="relative pb-6 sm:pb-8 lg:pb-12 last:pb-0"
          initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 + index * 0.1 }}>
          <div className="flex flex-col gap-3 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
            <div className="flex items-center gap-3 lg:contents">
              <div className="lg:col-span-2 flex-shrink-0">
                <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="lg:col-span-3">
                <p className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-400 uppercase tracking-wider leading-tight">{benefit.label}</p>
              </div>
            </div>
            <div className="lg:col-span-7 pl-9 lg:pl-0">
              <p className="text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed">{benefit.description}</p>
            </div>
          </div>
          {index < benefits.length - 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-700 overflow-hidden">
              <div ref={el => { linesRef.current[index] = el; }} className="h-full bg-gradient-to-r from-transparent via-gray-400 to-transparent" style={{ transform: "scaleX(0)" }} />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// ---- Offerings List ----
const OfferingsList = ({ offerings, inView }: { offerings: any[]; inView: boolean }) => {
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (!inView) return;
    linesRef.current.forEach((line, i) => {
      if (!line) return;
      gsap.fromTo(line, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 1, ease: "power3.out", delay: 0.2 + i * 0.1 });
    });
  }, [inView]);
  return (
    <div className="space-y-8 sm:space-y-10 lg:space-y-16">
      {offerings.map((offering, index) => (
        <motion.div key={index} className="relative pb-8 sm:pb-10 lg:pb-12 last:pb-0"
          initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.1 + index * 0.1 }}>
          <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-snug">{offering.title}</h3>
            </div>
            <div>
              <p className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed">{offering.description}</p>
            </div>
          </div>
          {index < offerings.length - 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300 overflow-hidden">
              <div ref={el => { linesRef.current[index] = el; }} className="h-full bg-gradient-to-r from-transparent via-gray-600 to-transparent" style={{ transform: "scaleX(0)" }} />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// ---- Brands Grid ----
const BrandsGrid = ({ brands, inView }: { brands: any[]; inView: boolean }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);
  useEffect(() => {
    if (!inView || triggered.current) return;
    triggered.current = true;
    const items = gridRef.current?.querySelectorAll(".brand-item");
    if (!items) return;
    gsap.fromTo(items, { opacity: 0, y: () => gsap.utils.random(20, 45) }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: { amount: 0.7, from: "random" } });
  }, [inView]);
  return (
    <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
      {brands.map((brand, index) => (
        <div key={index} className="brand-item opacity-0 flex items-center justify-center py-2">
          <img src={brand.logo} alt={brand.name} className="h-5 sm:h-6 lg:h-8 object-contain" />
        </div>
      ))}
    </div>
  );
};

// ---- Happy Customers Grid ----
const HappyCustomersGrid = ({ customers, inView }: { customers: any[]; inView: boolean }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (!inView || triggered.current) return;
    triggered.current = true;
    const items = gridRef.current?.querySelectorAll(".customer-item");
    if (!items) return;
    gsap.fromTo(items,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.75, ease: "power2.out", stagger: 0.12, delay: 0.2 }
    );
  }, [inView]);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-2 sm:grid-cols-4 border border-gray-800 rounded-2xl overflow-hidden"
    >
      {customers.map((customer, index) => (
        <div
          key={index}
          className="customer-item opacity-0 flex items-center justify-center px-6 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-14 border-r border-gray-800 last:border-r-0 border-b border-gray-800 sm:border-b-0 even:border-r-0 sm:even:border-r sm:last:border-r-0"
        >
          <img
            src={customer.logo}
            alt={customer.name}
            className="h-6 sm:h-7 lg:h-16 w-full object-contain opacity-100 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      ))}
    </div>
  );
};

// ---- Magnetic CTA ----
const MagneticCTALink = ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => {
  const btnRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const btn = btnRef.current; if (!btn) return;
    const onMove = (e: MouseEvent) => { const rect = btn.getBoundingClientRect(); gsap.to(btn, { x: (e.clientX - (rect.left + rect.width / 2)) * 0.35, y: (e.clientY - (rect.top + rect.height / 2)) * 0.35, duration: 0.4, ease: "power2.out" }); };
    const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.5)" });
    btn.addEventListener("mousemove", onMove); btn.addEventListener("mouseleave", onLeave);
    return () => { btn.removeEventListener("mousemove", onMove); btn.removeEventListener("mouseleave", onLeave); };
  }, []);
  return <a ref={btnRef as any} href={to} className={`will-change-transform ${className ?? ""}`}>{children}</a>;
};

// ---- White Screen Transition ----
const WhiteScreenTransition = ({ onComplete }: { onComplete: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { gsap.to(ref.current, { yPercent: -105, duration: 0.9, ease: "power3.inOut", delay: 0.2, onComplete }); }, []);
  return <div ref={ref} className="fixed inset-0 bg-white z-[9999] will-change-transform pointer-events-none" />;
};

// ---- Industry Card ----
const IndustryCard = ({ industry }: { industry: any }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const card = cardRef.current; const img = imgRef.current; if (!card || !img) return;
    const onEnter = () => gsap.to(img, { scale: 1.07, duration: 0.6, ease: "power2.out" });
    const onLeave = () => gsap.to(img, { scale: 1, duration: 0.6, ease: "power2.out" });
    card.addEventListener("mouseenter", onEnter); card.addEventListener("mouseleave", onLeave);
    return () => { card.removeEventListener("mouseenter", onEnter); card.removeEventListener("mouseleave", onLeave); };
  }, []);
  return (
    <div ref={cardRef} className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl overflow-hidden h-52 xs:h-60 sm:h-72 lg:h-80">
      <img ref={imgRef} src={industry.image} alt={industry.title} className="w-full h-full object-cover will-change-transform" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-8">
        <h3 className="text-sm sm:text-base lg:text-xl font-semibold text-white mb-1 sm:mb-2 uppercase tracking-wider">{industry.title}</h3>
        <p className="text-gray-200 text-xs sm:text-sm leading-relaxed">{industry.description}</p>
      </div>
    </div>
  );
};

// ========================================================
// ARVRMRXR PAGE
// ========================================================
const ARVRMRXR = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const offerings = [
    { title: "High-End XR Computing Platforms", description: "Powerhouse workstations and mobile computing solutions engineered for real-time 3D rendering, physics simulation, and immersive content creation. Built with NVIDIA RTX graphics and cutting-edge processors to handle the most demanding XR applications without compromise." },
    { title: "Professional XR Peripherals & Headsets", description: "Industry-leading AR, VR, and MR headsets and peripherals that deliver precise tracking, high-fidelity visuals, and comfortable extended-use experiences. From standalone devices to tethered professional solutions for every use case." },
    { title: "Creative & Development Tools", description: "Complete ecosystem of software tools from Unity, Unreal Engine, Autodesk, and Adobe for building immersive experiences. Industry-standard development environments, 3D modeling tools, and real-time engines optimized for XR content creation." },
    { title: "Training & Experiential Solutions", description: "End-to-end platforms for immersive training simulations, product visualization, and interactive experiences. Cloud-based deployment and management tools that scale from single-user prototypes to enterprise-wide training programs." },
  ];

  const benefits = [
    { icon: Zap,       label: "REAL-TIME SOLUTIONS",              description: "Low-latency, high-performance computing that powers responsive XR experiences. Hardware configurations optimized for real-time rendering, physics calculations, and seamless interaction in virtual environments." },
    { icon: Globe,     label: "ENDLESS OPPORTUNITIES",            description: "Solutions that span industries from gaming and entertainment to industrial training, product design, and architectural visualization. Technology flexible enough to adapt to your unique XR vision and business objectives." },
    { icon: Layers,    label: "DIGITAL TRANSFORMATION PARTNERS",  description: "Strategic guidance and technical expertise to help you conceptualize, frame, and execute digital transformation initiatives. We understand XR's potential and help you unlock it for competitive advantage." },
    { icon: Lightbulb, label: "INDUSTRY-LEADING TECHNOLOGY",      description: "Authorized partnerships with global technology leaders ensure you get authentic, supported solutions backed by the best in the industry. We bring together the ecosystem of tools and platforms that power world-class XR experiences." },
  ];

  const industries = [
    { title: "Media & Entertainment",       description: "Immersive storytelling, virtual production, and interactive content experiences",   image: "https://i.postimg.cc/zvjGg0WN/woman-enjoy-using-vr-indoors.jpg" },
    { title: "Architecture & Engineering",  description: "Virtual walkthroughs, design review, and collaborative spatial planning",           image: "https://i.postimg.cc/xdTyJ4z2/engineer.jpg" },
    { title: "Automotive & Manufacturing",  description: "Product visualization, assembly training, and virtual prototyping",                 image: "https://i.postimg.cc/Gp7tMMSb/worker-fixes-damaged-car-motor-using-vr.jpg" },
    { title: "Gaming & E-Learning",         description: "Immersive gameplay experiences and interactive educational environments",           image: "https://i.postimg.cc/zDdbtG69/full-shot-gamer-sitting-chair.jpg" },
  ];

  const trustedBrands = [
    { name: "Unreal Engine", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Unreal_Engine_Logo_%28new_typeface%29.svg" },
    { name: "Unity",         logo: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Unity_2021.svg" },
    { name: "Microsoft",     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1280px-Microsoft_logo.svg.png" },
    { name: "Lenovo",        logo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Lenovo_%282015%29.svg" },
    { name: "Autodesk",      logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/Autodesk_Logo_2021.svg" },
    { name: "NVIDIA",        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a4/NVIDIA_logo.svg" },
    { name: "Adobe",         logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Adobe_logo_and_wordmark_%282017%29.svg/640px-Adobe_logo_and_wordmark_%282017%29.svg.png" },
    { name: "Dell",          logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg" },
    { name: "HP",            logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/HP_logo_2025.svg" },
  ];

  const happyCustomers = [
    { name: "Apollo Hospitals",  logo: "https://upload.wikimedia.org/wikipedia/commons/6/65/GE_Vernova_logo.svg" },
    { name: "Fortis Healthcare", logo: "https://i.postimg.cc/7YnR1nGq/2131947.png" },
    { name: "Cipla",             logo: "https://i.postimg.cc/JGnm8TFq/highspot.webp" },
    { name: "Sun Pharma",        logo: "https://i.postimg.cc/PCY7nYdB/Technicolor-logo-svg.png" },
  ];

  // ── All section refs (declared inside the component) ──
  const heroRef    = useRef(null);
  const offerRef   = useRef(null);
  const benRef     = useRef(null);
  const indRef     = useRef(null);
  const statsRef   = useRef(null);
  const brandsRef  = useRef(null);
  const ctaRef     = useRef(null);
  const custRef    = useRef(null);  // FIX: was missing from component

  const heroInView   = useInView(heroRef,   { once: true, margin: "-60px" });
  const offerInView  = useInView(offerRef,  { once: true, margin: "-60px" });
  const benInView    = useInView(benRef,    { once: true, margin: "-60px" });
  const indInView    = useInView(indRef,    { once: true, margin: "-60px" });
  const statsInView  = useInView(statsRef,  { once: true, margin: "-60px" });
  const brandsInView = useInView(brandsRef, { once: true, margin: "-60px" });
  const ctaInView    = useInView(ctaRef,    { once: true, margin: "-100px" });
  const custInView   = useInView(custRef,   { once: true, margin: "-60px" }); // FIX: was missing from component

  // ── GSAP: Hero heading word-stagger ──
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = heroHeadingRef.current; if (!el) return;
    gsap.fromTo(el.querySelectorAll(".xr-word"), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.07, delay: 1.2 });
  }, []);

  // ── GSAP: CTA heading word stagger ──
  const ctaHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!ctaInView) return;
    const el = ctaHeadingRef.current; if (!el) return;
    gsap.fromTo(el.querySelectorAll(".cta-word"), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.06, delay: 0.2 });
  }, [ctaInView]);

  // ── GSAP: Happy Customers heading word stagger ── FIX: was missing entirely
  const custHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!custInView) return;
    const el = custHeadingRef.current; if (!el) return;
    gsap.fromTo(el.querySelectorAll(".cust-word"), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.06, delay: 0.2 });
  }, [custInView]);

  // ── GSAP: Industry cards stagger ──
  const indGridRef   = useRef<HTMLDivElement>(null);
  const indTriggered = useRef(false);
  useEffect(() => {
    if (!indInView || indTriggered.current) return;
    indTriggered.current = true;
    const cards = indGridRef.current?.querySelectorAll(".industry-card");
    if (!cards) return;
    gsap.fromTo(cards, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.12 });
  }, [indInView]);

  // ── GSAP: Hero image scale-on-scroll ──
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

  const marqueeItems  = ["AR/VR/MR/XR Solutions", "Immersive Experiences", "Real-Time Rendering", "XR Peripherals", "Virtual Reality", "Augmented Reality"];
  const marqueeItems2 = ["Unity", "Unreal Engine", "NVIDIA RTX", "Unity", "Unreal", "Digital Transformation", "XR","AR","VR"];
  const marqueeItems3 = ["Build Immersive Worlds", "XR Innovation", "Future-Ready Tech", "Sniper Systems", "Extended Reality"];

  return (
    <Layout>
      {showWhiteScreen && <WhiteScreenTransition onComplete={() => setShowWhiteScreen(false)} />}

      {/* ── Hero ── */}
      <section className="relative bg-white pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-white opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16" ref={heroRef}>
            <h1
              ref={heroHeadingRef}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight font-sans"
              aria-label="Immersive Solutions for Future-Ready Experiences"
            >
              {["Immersive", "Solutions", "for", <br key="br" />, "Future-Ready", "Experiences"].map((word, i) =>
                typeof word !== "string" ? word : (
                  <span key={i} className="xr-word inline-block opacity-0 mr-[0.2em] sm:mr-[0.22em] lg:mr-[0.25em] last:mr-0">{word}</span>
                )
              )}
            </h1>
            <motion.p
              className="text-sm sm:text-base lg:text-xl text-gray-700 max-w-5xl mx-auto leading-relaxed px-1 sm:px-4 lg:px-0"
              initial={{ opacity: 0, y: 30 }} animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.6 }}
            >
              Sniper enables businesses and creators to build immersive environments with high-end computing,
              XR peripherals, and industry-leading creative tools. From product design to experiential training,
              we support your AR/VR ambitions with the tech backbone it needs.
            </motion.p>
          </div>

          <motion.div
            className="max-w-6xl mx-auto pt-6 sm:pt-8 lg:pt-12"
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          >
            <div
              ref={heroImgWrapRef}
              className="relative shadow-2xl overflow-hidden h-48 xs:h-60 sm:h-80 md:h-[420px] lg:h-[500px] xl:h-[600px]"
              style={{
                borderRadius: "2.5rem",
                willChange: "transform, border-radius",
                transformOrigin: "center center",
              }}
            >
              <ParallaxImage
                src="https://i.postimg.cc/SRLZ4z9r/person-wearing-high-tech-vr-glasses-while-surrounded-by-bright-blue-neon-colors.jpg"
                alt="XR Technology"
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-3 sm:left-4 lg:left-6 z-10">
                <div className="bg-black bg-opacity-50 text-white px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full backdrop-blur-sm">
                  <span className="text-[10px] sm:text-xs lg:text-sm font-medium tracking-wide">AR | VR | MR | XR</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <MarqueeTicker items={marqueeItems} speed={24} />

      {/* ── Key Offerings ── */}
      <section className="bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={offerRef}>
          <div className="mb-8 sm:mb-10 lg:mb-16">
            <motion.h2
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }} animate={offerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >Key Offerings</motion.h2>
          </div>
          <OfferingsList offerings={offerings} inView={offerInView} />
        </div>
      </section>

      {/* ── Benefits ── */}
      <motion.section
        ref={benRef}
        className="bg-black text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 rounded-[1.5rem] sm:rounded-[2.5rem] lg:rounded-[4rem] mx-3 sm:mx-4 lg:mx-6 my-6 sm:my-8 lg:my-12"
        initial={{ opacity: 0, y: 60 }} animate={benInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 lg:mb-16">
            <motion.h2
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 40 }} animate={benInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >Real-time solutions,<br />endless opportunities</motion.h2>
          </div>
          <BenefitsList benefits={benefits} inView={benInView} />
        </div>
      </motion.section>

      <MarqueeTicker items={marqueeItems2} speed={30} reverse />

      {/* ── Industries ── */}
      <section className="bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={indRef}>
          <div className="mb-8 sm:mb-10 lg:mb-16">
            <motion.h2
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }} animate={indInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >Empowering<br />industry leaders</motion.h2>
            <div className="w-full h-px bg-gray-300 mt-6 sm:mt-8" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 mb-8 sm:mb-12 lg:mb-20">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={indInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-snug">
                DIGITAL TRANSFORMATION<br />ACROSS INDUSTRIES
              </h3>
            </motion.div>
            <motion.div className="space-y-3 sm:space-y-4 lg:space-y-6" initial={{ opacity: 0, y: 30 }} animate={indInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}>
              <p className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed">We help industry leaders in Media & Entertainment, Architecture & Engineering, Automotive & Manufacturing, Gaming & E-Learning to conceptualise, frame and execute their Digital transformation goals.</p>
              <p className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed">We are strategic and value added partners for global technology leaders in the industry, bringing together hardware, software, and expertise to create immersive experiences that drive business outcomes.</p>
            </motion.div>
          </div>

          <div ref={indGridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-8">
            {industries.map((industry, index) => (
              <div key={index} className="industry-card opacity-0">
                <IndustryCard industry={industry} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={statsRef}>
          <div className="mb-8 sm:mb-10 lg:mb-16">
            <motion.h2
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }} animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >Powering XR Experiences<br />Across India</motion.h2>
            <div className="w-full h-px bg-gray-300" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 mb-10 sm:mb-14 lg:mb-20">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={statsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-snug">EMPOWERING CREATORS,<br />BUILDERS & INNOVATORS</h3>
            </motion.div>
            <motion.div className="space-y-3 sm:space-y-4 lg:space-y-6" initial={{ opacity: 0, y: 30 }} animate={statsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}>
              <p className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed">From small creative studios to large enterprises, we provide the technology infrastructure that enables teams to push boundaries and deliver extraordinary immersive experiences.</p>
              <p className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed">Our XR solutions combine cutting-edge hardware, professional software, and cloud tools to create an ecosystem where innovation thrives and ideas come to life.</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-16">
            {[
              { number: "1800", suffix: "+", label: "Happy Customers" },
              { number: "200",  suffix: "+", label: "Projects Delivered" },
              { number: "15",   suffix: "+", label: "Years of Experience" },
            ].map((stat, i) => (
              <motion.div key={i} className="text-center"
                initial={{ opacity: 0, y: 40 }} animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 + i * 0.1 }}>
                <div className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl text-gray-900 mb-1.5 sm:mb-2 font-semibold">
                  <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                </div>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trusted Brands ── */}
      <section className="bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={brandsRef}>
          <div className="mb-8 sm:mb-12 lg:mb-20">
            <motion.h2
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }} animate={brandsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >Trusted Brands</motion.h2>
          </div>
          <BrandsGrid brands={trustedBrands} inView={brandsInView} />
        </div>
      </section>

      <MarqueeTicker items={marqueeItems3} speed={22} />

      {/* ── Happy Customers ── */}
      <motion.section
        ref={custRef}
        className="bg-black text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 rounded-[1.5rem] sm:rounded-[2.5rem] lg:rounded-[4rem] mx-3 sm:mx-4 lg:mx-6 my-6 sm:my-8 lg:my-12 overflow-hidden"
        initial={{ opacity: 0, y: 60 }}
        animate={custInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <div className="overflow-hidden mb-4 sm:mb-6">
              <h2
                ref={custHeadingRef}
                className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight"
                aria-label="Trusted by AR-VR-MR-XR Leaders"
              >
                {["Trusted", "by", <br key="br" />, "AR-VR-MR-XR", "Leaders"].map((word, i) =>
                  typeof word !== "string" ? word : (
                    <span key={i} className="cust-word inline-block opacity-0 mr-[0.2em] sm:mr-[0.22em] lg:mr-[0.25em] last:mr-0">{word}</span>
                  )
                )}
              </h2>
            </div>
            <div className="w-full h-px bg-gray-800 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-transparent via-gray-500 to-transparent"
                initial={{ scaleX: 0, originX: 0 }}
                animate={custInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.2, delay: 0.5 }}
              />
            </div>
          </div>

          {/* Sub-copy */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 mb-10 sm:mb-14 lg:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={custInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <h3 className="text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-400 uppercase tracking-wider leading-snug">
                ORGANIZATIONS<br />ACROSS INDIA
              </h3>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={custInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            >
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
                From large hospital chains to emerging biotech startups, our solutions are deployed across
                India's most respected healthcare and pharmaceutical organizations—helping them deliver
                better care through better technology.
              </p>
            </motion.div>
          </div>

          {/* Logo grid */}
          <HappyCustomersGrid customers={happyCustomers} inView={custInView} />

        </div>
      </motion.section>

      {/* ── CTA ── */}
      <motion.section
        ref={ctaRef}
        className="bg-black text-white py-14 sm:py-16 lg:py-20 px-4 sm:px-6 rounded-[1.5rem] sm:rounded-[2.5rem] lg:rounded-[4rem] mx-3 sm:mx-4 lg:mx-6 my-6 sm:my-8 lg:my-12 overflow-hidden"
        initial={{ opacity: 0, y: 60 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-4xl mx-auto text-center px-2">
          <div className="mb-8 sm:mb-10 lg:mb-12 overflow-hidden">
            <h2
              ref={ctaHeadingRef}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold mb-4 sm:mb-6 leading-tight"
              aria-label="Ready to build immersive experiences?"
            >
              {["Ready", "to", "build", <br key="br1" />, "immersive",  "experiences?"].map((word, i) =>
                typeof word !== "string" ? word : (
                  <span key={i} className="cta-word inline-block opacity-0 mr-[0.15em] sm:mr-[0.18em] lg:mr-[0.22em] last:mr-0">{word}</span>
                )
              )}
            </h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          >
            <MagneticCTALink
              to="/contact"
              className="inline-flex items-center px-6 sm:px-8 lg:px-12 py-3 sm:py-3.5 lg:py-4 border-2 border-white rounded-full text-white font-medium text-sm sm:text-base lg:text-lg hover:bg-white hover:text-black transition-colors duration-300 active:scale-95"
            >
              LET'S CREATE
            </MagneticCTALink>
          </motion.div>
        </div>
      </motion.section>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button onClick={scrollToTop}
            className="fixed bottom-5 right-5 sm:bottom-6 sm:left-6 lg:bottom-8 lg:right-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 z-50 shadow-lg active:scale-90"
            aria-label="Scroll to top"
            initial={{ opacity: 0, scale: 0.6, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.6, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 -rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default ARVRMRXR;
