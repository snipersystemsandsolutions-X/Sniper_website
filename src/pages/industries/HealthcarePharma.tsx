import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Cloud, Database, Heart, Shield } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

// ---- Marquee Ticker ----
const MarqueeTicker = ({ items, speed = 26, reverse = false }: { items: string[]; speed?: number; reverse?: boolean }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const track = trackRef.current; if (!track) return;
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
    const el = ref.current; if (!el || numericValue === null) return;
    const st = ScrollTrigger.create({ trigger: el, start: "top 88%", onEnter: () => {
      if (triggered.current) return; triggered.current = true;
      const obj = { val: 0 };
      gsap.to(obj, { val: numericValue, duration: 2.2, ease: "power2.out", onUpdate: () => { if (el) el.textContent = prefix + Math.round(obj.val).toLocaleString() + trailingSuffix + suffix; } });
    }});
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

// ---- Brands Grid (Trusted Brands — white bg) ----
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

// ---- Happy Customers Grid (dark bg — inverted logos, single row of 4) ----
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
  return <div ref={ref} className="fixed inset-0 bg-white z-[9999] will-change-transform" />;
};

// ---- Sector Card ----
const SectorCard = ({ sector }: { sector: any }) => {
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
      <img ref={imgRef} src={sector.image} alt={sector.title} className="w-full h-full object-cover will-change-transform" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-8">
        <h3 className="text-sm sm:text-base lg:text-xl font-semibold text-white mb-1 sm:mb-2 uppercase tracking-wider">{sector.title}</h3>
        <p className="text-gray-200 text-xs sm:text-sm leading-relaxed">{sector.description}</p>
      </div>
    </div>
  );
};

// ========================================================
// HEALTHCARE PHARMA PAGE
// ========================================================
const HealthcarePharma = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const offerings = [
    { title: "Secure Endpoint Devices",              description: "HIPAA-compliant laptops, tablets, and mobile devices designed for healthcare professionals. Enterprise-grade security features including hardware encryption, biometric authentication, and remote management capabilities to protect sensitive patient data across all touchpoints." },
    { title: "Compliance-Ready Infrastructure",      description: "IT infrastructure solutions built to meet stringent healthcare regulations including HIPAA, FDA 21 CFR Part 11, and NABH standards. Secure networks, access controls, and audit trails that ensure regulatory compliance while maintaining operational efficiency." },
    { title: "Collaboration & Telehealth Solutions", description: "Secure video conferencing, remote consultation platforms, and cloud-based collaboration tools that enable seamless patient care delivery. High-quality audio-visual systems and peripherals optimized for telemedicine and remote diagnostics." },
    { title: "Data Backup & Recovery",               description: "Robust backup solutions and disaster recovery systems that protect critical patient records and research data. Automated backup schedules, redundant storage, and rapid recovery capabilities to ensure data availability and business continuity." },
  ];

  const benefits = [
    { icon: Shield,   label: "SECURITY & COMPLIANCE FIRST",  description: "Healthcare-grade security with end-to-end encryption, access controls, and compliance frameworks that protect patient data and meet regulatory requirements. Every solution designed with privacy and security as core principles." },
    { icon: Heart,    label: "MISSION-CRITICAL RELIABILITY", description: "High-availability systems engineered for healthcare operations where downtime can impact patient care. Redundant systems, proactive monitoring, and rapid support to ensure continuous service delivery." },
    { icon: Cloud,    label: "DIGITAL DIAGNOSTICS ENABLED",  description: "Cloud-connected infrastructure that supports modern diagnostic equipment, PACS systems, and medical imaging workflows. Seamless integration with EMR/EHR platforms and laboratory information systems for efficient data management." },
    { icon: Database, label: "DATA PROTECTION GUARANTEED",   description: "Multi-layered data protection with automated backups, encryption at rest and in transit, and disaster recovery planning. Safeguarding patient records and research data against loss, corruption, or unauthorized access." },
  ];

  const healthcareSectors = [
    { title: "Hospitals & Clinics",      description: "EMR systems, patient monitoring, and clinical collaboration tools",  image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80" },
    { title: "Diagnostic Labs",          description: "LIMS integration, imaging systems, and secure data management",       image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80" },
    { title: "Pharmaceutical Companies", description: "R&D infrastructure, regulatory compliance, and data security",        image: "https://images.unsplash.com/photo-1583911860205-72f8ac8ddcbe?w=800&q=80" },
    { title: "Research Institutions",    description: "High-performance computing and collaborative research platforms",      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80" },
  ];

  const trustedBrands = [
    { name: "Apple",     logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
    { name: "HP",        logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/HP_logo_2025.svg" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1280px-Microsoft_logo.svg.png" },
    { name: "Lenovo",    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Lenovo_%282015%29.svg" },
    { name: "Cisco",     logo: "https://upload.wikimedia.org/wikipedia/commons/1/11/Zoom_Logo_2022.svg" },
    { name: "Adobe",     logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg" },
  ];

  // Happy Customers — 4 logos rendered white on dark bg
  const happyCustomers = [
    { name: "Apollo Hospitals",  logo: "https://i.postimg.cc/JzbMwQbz/appolo-hospital.webp" },
    { name: "Fortis Healthcare", logo: "https://upload.wikimedia.org/wikipedia/en/7/7b/Athenahealth.svg" },
    { name: "Cipla",             logo: "https://upload.wikimedia.org/wikipedia/en/4/4f/AstraZeneca.svg" },
    { name: "Sun Pharma",        logo: "https://www.logoshape.com/wp-content/uploads/2025/07/kauvery-hospital-logo_logoshape.png" },
  ];

  const heroRef     = useRef(null); const offerRef   = useRef(null); const benRef      = useRef(null);
  const sectRef     = useRef(null); const statsRef   = useRef(null); const brandsRef   = useRef(null);
  const ctaRef      = useRef(null); const custRef    = useRef(null);

  const heroInView   = useInView(heroRef,   { once: true, margin: "-60px" });
  const offerInView  = useInView(offerRef,  { once: true, margin: "-60px" });
  const benInView    = useInView(benRef,    { once: true, margin: "-60px" });
  const sectInView   = useInView(sectRef,   { once: true, margin: "-60px" });
  const statsInView  = useInView(statsRef,  { once: true, margin: "-60px" });
  const brandsInView = useInView(brandsRef, { once: true, margin: "-60px" });
  const ctaInView    = useInView(ctaRef,    { once: true, margin: "-100px" });
  const custInView   = useInView(custRef,   { once: true, margin: "-60px" });

  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = heroHeadingRef.current; if (!el) return;
    gsap.fromTo(el.querySelectorAll(".hero-word"), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.07, delay: 1.2 });
  }, []);

  const ctaHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!ctaInView) return;
    const el = ctaHeadingRef.current; if (!el) return;
    gsap.fromTo(el.querySelectorAll(".cta-word"), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.06, delay: 0.2 });
  }, [ctaInView]);

  const custHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!custInView) return;
    const el = custHeadingRef.current; if (!el) return;
    gsap.fromTo(el.querySelectorAll(".cust-word"), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.07, delay: 0.1 });
  }, [custInView]);

  const sectGridRef   = useRef<HTMLDivElement>(null);
  const sectTriggered = useRef(false);
  useEffect(() => {
    if (!sectInView || sectTriggered.current) return;
    sectTriggered.current = true;
    const cards = sectGridRef.current?.querySelectorAll(".sector-card");
    if (!cards) return;
    gsap.fromTo(cards, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.12 });
  }, [sectInView]);

  const marqueeItems  = ["Healthcare IT Solutions", "HIPAA Compliant", "Telehealth Platforms", "Secure Infrastructure", "Digital Diagnostics", "Patient Data Protection"];
  const marqueeItems2 = ["EMR / EHR Systems", "Cloud Backup", "PACS Integration", "Cisco", "Microsoft", "Data Recovery", "Pharma R&D"];
  const marqueeItems3 = ["Empowering Healthcare", "Saving Lives with Tech", "Sniper Systems", "Future-Ready Healthcare", "Compliant & Secure"];

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
              aria-label="Technology That Cares – Enabling Smarter, Safer Healthcare"
            >
              {["Technology", "That", "Cares", "–", <br key="br1" />, "Enabling", "Smarter,", <br key="br2" />, "Safer", "Healthcare"].map((word, i) =>
                typeof word !== "string" ? word : (
                  <span key={i} className="hero-word inline-block opacity-0 mr-[0.2em] sm:mr-[0.22em] lg:mr-[0.25em] last:mr-0">{word}</span>
                )
              )}
            </h1>
            <motion.p
              className="text-sm sm:text-base lg:text-xl text-gray-700 max-w-5xl mx-auto leading-relaxed px-1 sm:px-4 lg:px-0"
              initial={{ opacity: 0, y: 30 }} animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.6 }}
            >
              We provide secure, compliant, and high-performance IT solutions for hospitals, labs, pharma
              companies, and research institutions. From digital diagnostics to cloud-based collaboration,
              Sniper supports your mission to save lives.
            </motion.p>
          </div>

          <motion.div
            className="max-w-6xl mx-auto pt-6 sm:pt-8 lg:pt-12"
            initial={{ opacity: 0, y: 40, scale: 0.98 }} animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          >
            <div className="relative rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden h-48 xs:h-60 sm:h-80 md:h-[420px] lg:h-[500px] xl:h-[600px]">
              <ParallaxImage src="https://i.postimg.cc/8k3CnhT1/heart-shape.jpg" alt="Healthcare Technology" className="w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-3 sm:left-4 lg:left-6 z-10">
                <div className="bg-black bg-opacity-50 text-white px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full backdrop-blur-sm">
                  <span className="text-[10px] sm:text-xs lg:text-sm font-medium tracking-wide">HEALTHCARE & PHARMA</span>
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
            >Supporting your mission<br />to save lives</motion.h2>
          </div>
          <BenefitsList benefits={benefits} inView={benInView} />
        </div>
      </motion.section>

      <MarqueeTicker items={marqueeItems2} speed={30} reverse />

      {/* ── Healthcare Sectors ── */}
      <section className="bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={sectRef}>
          <div className="mb-8 sm:mb-10 lg:mb-16">
            <motion.h2
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }} animate={sectInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >Serving the complete<br />healthcare ecosystem</motion.h2>
            <div className="w-full h-px bg-gray-300 mt-6 sm:mt-8" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 mb-8 sm:mb-12 lg:mb-20">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={sectInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-snug">FROM DIAGNOSIS<br />TO RESEARCH</h3>
            </motion.div>
            <motion.div className="space-y-3 sm:space-y-4 lg:space-y-6" initial={{ opacity: 0, y: 30 }} animate={sectInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}>
              <p className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed">We serve the entire healthcare value chain, from patient-facing hospitals and diagnostic centers to pharmaceutical R&D and clinical research institutions. Each solution is designed to meet the unique needs of healthcare providers while maintaining the highest standards of security and compliance.</p>
              <p className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed">Our healthcare IT solutions enable seamless data exchange, support evidence-based medicine, accelerate research timelines, and ultimately improve patient outcomes through the intelligent application of technology to healthcare challenges.</p>
            </motion.div>
          </div>

          <div ref={sectGridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-8">
            {healthcareSectors.map((sector, index) => (
              <div key={index} className="sector-card opacity-0">
                <SectorCard sector={sector} />
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
            >Powering Healthcare<br />Across India</motion.h2>
            <div className="w-full h-px bg-gray-300" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 mb-10 sm:mb-14 lg:mb-20">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={statsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-snug">EMPOWERING CLINICIANS,<br />RESEARCHERS & INNOVATORS</h3>
            </motion.div>
            <motion.div className="space-y-3 sm:space-y-4 lg:space-y-6" initial={{ opacity: 0, y: 30 }} animate={statsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}>
              <p className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed">From small clinics to large hospital networks, we provide the technology infrastructure that enables healthcare teams to focus on what matters most — patient care.</p>
              <p className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed">Our solutions combine secure hardware, compliant software, and cloud tools to create an ecosystem where healthcare innovation thrives and lives are improved.</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-16">
            {[
              { number: "1800", suffix: "+", label: "Happy Customers" },
              { number: "250",  suffix: "+", label: "Healthcare Clients" },
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

      {/* ── Happy Customers ── (dark pill section) */}
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
                aria-label="Trusted by Healthcare Leaders"
              >
                {["Trusted", "by", <br key="br" />, "Healthcare", "Leaders"].map((word, i) =>
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
                transition={{ duration: 1.2,delay: 0.5 }}
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

          {/* Logo grid with GSAP-drawn borders */}
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
              aria-label="Ready to transform healthcare delivery? Connect with us"
            >
              {["Ready", "to", "transform", <br key="br1" />, "healthcare", "delivery?", <br key="br3" />, "Connect", "with", "us"].map((word, i) =>
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
              LET'S TALK
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

export default HealthcarePharma;
