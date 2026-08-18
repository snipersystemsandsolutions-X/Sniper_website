import { Layout } from "@/components/Layout";
import SEO from "@/components/SEO";
import OrbitingCirclesGlobe from "@/components/ui/orbiting-circles-02";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Clock, Lightbulb, Shield, Zap } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";


import Lottie from "@/components/boyworking";
import Lottiee from "@/components/morphing";
import { StarfieldBackground } from "@/components/StarfieldBackground";


gsap.registerPlugin(ScrollTrigger);




const ease = [0.16, 1, 0.3, 1];



// ---- Animated Counter ----
const AnimatedCounter = ({ target, suffix = "" }: { target: string; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);
  const numericMatch = target.match(/[\d.]+/);
  const numericValue = numericMatch ? parseFloat(numericMatch[0]) : null;
  const prefix = target.replace(/[\d.]+.*/, "");
  const trailingSuffix = numericValue !== null
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
            if (el) {
              el.textContent =
                prefix +
                (Number.isInteger(numericValue)
                  ? Math.round(obj.val).toLocaleString()
                  : obj.val.toFixed(0)) +
                trailingSuffix +
                suffix;
            }
          },
        });
      },
    });
    return () => st.kill();
  }, [numericValue]);

  if (numericValue === null) return <span ref={ref}>{target}</span>;
  return <span ref={ref}>{prefix}0{trailingSuffix}{suffix}</span>;
};

// ---- Parallax Image ----
const ParallaxImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;
    const tween = gsap.fromTo(img, { yPercent: -8 }, {
      yPercent: 8,
      ease: "none",
      scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className ?? ""}`}>
      <img ref={imgRef} src={src} alt={alt} className="w-full h-full object-cover scale-110 will-change-transform" />
    </div>
  );
};

// ---- Marquee Ticker ----
const MarqueeTicker = ({ items }: { items: string[] }) => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const isMobile = window.innerWidth < 640;
    const totalWidth = track.scrollWidth / 2;
    const duration = isMobile ? 18 : 28;

    const tween = gsap.to(track, {
      x: `-${totalWidth}px`,
      duration,
      ease: "none",
      repeat: -1,
    });

    const handleResize = () => {
      tween.kill();
      const newMobile = window.innerWidth < 640;
      const newWidth = track.scrollWidth / 2;
      gsap.to(track, {
        x: `-${newWidth}px`,
        duration: newMobile ? 18 : 28,
        ease: "none",
        repeat: -1,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      tween.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden bg-gray-950 py-3 sm:py-4 border-y border-gray-800">
      <div
        ref={trackRef}
        className="flex whitespace-nowrap will-change-transform"
        style={{ gap: "clamp(1.5rem, 4vw, 2.5rem)" }}
      >
        {doubled.map((text, i) => (
          <span
            key={i}
            className="flex items-center text-gray-500 font-semibold uppercase"
            style={{
              fontSize: "clamp(9px, 2vw, 11px)",
              letterSpacing: "clamp(0.15em, 0.5vw, 0.22em)",
              gap: "clamp(1.5rem, 4vw, 2.5rem)",
            }}
          >
            {text}
            <span
              className="rounded-full bg-gray-700 inline-block flex-shrink-0"
              style={{
                width: "clamp(4px, 1vw, 6px)",
                height: "clamp(4px, 1vw, 6px)",
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
};

// ---- Magnetic Button ----
const MagneticLink = ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => {
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
    const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.5)" });
    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);
    return () => { btn.removeEventListener("mousemove", onMove); btn.removeEventListener("mouseleave", onLeave); };
  }, []);
  return (
    <a ref={btnRef as any} href={to} className={`will-change-transform ${className ?? ""}`}>
      {children}
    </a>
  );
};


// ========================================================
// BANNER SLIDER SECTION
// ========================================================
const BannerSliderSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const banners = [
    {
      title: "POWERFUL TECHNOLOGY SOLUTIONS",
      description: "Enterprise infrastructure, managed services, and business solutions designed to support your organization's growth and digital transformation.",
      image: "https://i.postimg.cc/nhLN25ph/futuristic-business-scene-with-ultra-modern-ambiance.jpg",
      link: "/Solutions"
    },
    {
      title: "SERVING DIVERSE INDUSTRIES",
      description: "Technology solutions for industries like technology, media, healthcare, education, and manufacturing.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
      link: "/Industries"
    },
    {
      title: "APPLE SOLUTIONS FOR BUSINESS & EDUCATION",
      description: "Apple Business Partner enabling businesses with powerful devices and streamlined IT management.",
      image: "https://i.postimg.cc/RVVDHpLZ/desktop.jpg",
      link: "partners/apple/index.html"
    },
    {
      title: "APPLE PREMIUM EDUCATION PARTNER",
      description: "Apple devices like MacBook, iPad, and iMac designed for classrooms, labs, and smarter campus learning.",
      image: "https://i.postimg.cc/0NQnVgDJ/hero-nw00556jozu6-large-2x.jpg", // (replace if you have better asset)
      link: "partners/apple-education/index.html"
    },
    {
      title: "SCALABLE CLOUD INNOVATION",
      description: "Secure cloud infrastructure, smooth migration, and optimized management for modern digital enterprises.",
      image: "https://i.postimg.cc/ZY3RhJ0v/cyber-security-concept-digital-art.jpg",
      link: "partners/cloud-solutions/index.html"
    },
    {
      title: "LET'S BUILD YOUR DIGITAL FUTURE",
      description: "Upgrade infrastructure, deploy devices, or move to the cloud with expert technology support.",
      image: "https://i.postimg.cc/k4gps4WP/ai-data-analysis-team.jpg",
      link: "/contact"
    }
  ];

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => setCurrentSlide((prev) => (prev + 1) % banners.length), 5000);
    }
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [isAutoPlaying, banners.length]);

  const nextSlide = () => { setCurrentSlide((prev) => (prev + 1) % banners.length); setIsAutoPlaying(false); };
  const prevSlide = () => { setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length); setIsAutoPlaying(false); };
  const goToSlide = (index: number) => { setCurrentSlide(index); setIsAutoPlaying(false); };

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <div className="mb-10 sm:mb-12 md:mb-16">
          <motion.h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight" initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            Why businesses<br />choose Sniper
          </motion.h2>
        </div>
        <motion.div className="relative" initial={{ opacity: 0, y: 0 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}>
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
            <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {banners.map((banner, index) => (
                <div key={index} className="min-w-full">
                  <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
                      <div className="max-w-3xl">
                        <h3 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-2 sm:mb-3 md:mb-4">{banner.title}</h3>
                        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white font-normal leading-tight mb-4 sm:mb-6 md:mb-8">{banner.description}</p>
                        <a href={banner.link} className="inline-flex items-center px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 border-2 border-white rounded-full text-white text-sm sm:text-base font-medium hover:bg-white hover:text-black transition-all duration-300">Explore more</a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <motion.button onClick={prevSlide} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center text-gray-900 transition-all duration-300 shadow-lg z-10" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}><ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" /></motion.button>
          <motion.button onClick={nextSlide} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center text-gray-900 transition-all duration-300 shadow-lg z-10" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}><ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" /></motion.button>
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-10">
            {banners.map((_, index) => (
              <button key={index} onClick={() => goToSlide(index)} className={`transition-all duration-300 rounded-full ${currentSlide === index ? "w-8 sm:w-10 md:w-12 h-2 sm:h-2.5 md:h-3 bg-white" : "w-2 sm:w-2.5 md:w-3 h-2 sm:h-2.5 md:h-3 bg-white bg-opacity-50 hover:bg-opacity-75"}`} />
            ))}
          </div>
        </motion.div>
        <div className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 sm:mb-6">TRUSTED BY THE BEST</h3>
          </motion.div>
          <motion.div className="space-y-4 sm:space-y-6" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}>
            <p className="text-base sm:text-lg text-gray-800 leading-relaxed">From startups to global enterprises, organizations choose Sniper Systems because we deliver more than just IT services—we deliver peace of mind, innovation, and results that matter.</p>
            <p className="text-base sm:text-lg text-gray-800 leading-relaxed">With <strong>17+ years of proven excellence</strong>, we've built our reputation on one simple promise: Your success is our success.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};



// ========================================================
// NEW TOP HERO SECTION
// ========================================================
const logoCompanies = [
  { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", w: 108, h: 38 },
  { name: "Lenovo", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Lenovo_%282015%29.svg", w: 98, h: 38 },
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg", w: 108, h: 28 },
  { name: "NVIDIA", logo: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg", w: 108, h: 28 },
  { name: "Autodesk", logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/Autodesk_Logo_2021.svg", w: 108, h: 48 },
  { name: "Unreal", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Unreal_Engine_Logo_%28new_typeface%29.svg", w: 118, h: 58 },
  { name: "Cisco", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg", w: 108, h: 38 },
  { name: "Unity", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Unity_Technologies_logo.svg/1280px-Unity_Technologies_logo.svg.png", w: 108, h: 38 },
  { name: "Adobe", logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Adobe_Corporate_wordmark.svg", w: 108, h: 28 },
  { name: "Dell", logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg", w: 108, h: 58 },
  { name: "HP", logo: "https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg", w: 108, h: 58 },
  { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg", w: 108, h: 48 },
  { name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Samsung_Black_icon.svg", w: 108, h: 28 },
  { name: "Acer", logo: "https://upload.wikimedia.org/wikipedia/commons/0/00/Acer_2011.svg", w: 108, h: 28 },
  { name: "Asus", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg", w: 108, h: 25 },
  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", w: 108, h: 38 },
  { name: "Supermicro", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Super_Micro_Computer_Logo.svg", w: 108, h: 40 },
  { name: "Yubico", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Yubico_logo.svg", w: 108, h: 25 },
  { name: "Poly", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Poly_Inc._Logo.svg", w: 108, h: 38 },
  { name: "Epos", logo: "https://upload.wikimedia.org/wikipedia/en/5/58/Epos-logo.png", w: 108, h: 28 },
  { name: "Eizo", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4f/EIZO_Logo.svg", w: 100, h: 68 },
  { name: "View Sonic", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b0/ViewSonic_logo.svg", w: 108, h: 28 },
  { name: "Belkin", logo: "https://upload.wikimedia.org/wikipedia/commons/9/92/Belkin_logo_2024.svg", w: 108, h: 28 },
  { name: "Honey well", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Honeywell_logo.svg", w: 108, h: 28 },
  { name: "Logitech", logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg", w: 108, h: 28 },
  { name: "Jabra", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Jabra_Logo.png", w: 108, h: 28 },
  { name: "Benq", logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/BenQ_wordmark.svg", w: 95, h: 28 },
  { name: "SketchUp", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Brand_Wordmark_for_SketchUp.png", w: 108, h: 28 },
  { name: "Sap", logo: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg", w: 108, h: 28 },
  { name: "LG", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/LG_logo_%282014%29.svg", w: 108, h: 28 },
  { name: "Keyshot", logo: "https://www.freelogovectors.net/wp-content/uploads/2018/11/keyshot-logo.png", w: 108, h: 28 },
  { name: "Jumpcloud", logo: "https://upload.wikimedia.org/wikipedia/en/4/47/JumpCloud_Logo.svg", w: 108, h: 38 },
];

const NewTopHeroSection = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerGridRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const outer = outerRef.current;
      const innerGrid = innerGridRef.current;
      setScrollY(window.scrollY);
      if (!outer || !innerGrid) return;
      const outerTop = outer.getBoundingClientRect().top;
      const scrolled = -outerTop;
      const maxOuter = outer.offsetHeight - window.innerHeight;
      const maxInner = innerGrid.scrollHeight - innerGrid.clientHeight;
      if (scrolled < 0 || scrolled > maxOuter) return;
      innerGrid.scrollTop = (scrolled / maxOuter) * maxInner;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ─── MOBILE LAYOUT (< lg) ───────────────────────────────────────── */}
      <div className="lg:hidden relative overflow-hidden" style={{ minHeight: "100svh", background: "#f5f4f0" }}>
        <div style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat", backgroundSize: "128px 128px",
        }} />
        <div className="relative z-10 flex items-center justify-between px-5 pt-10 pb-4">
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-800">Sniper Systems</span>
          <a href="/contact" className="text-[11px] font-semibold tracking-wider uppercase text-gray-500 border border-gray-300 rounded-full px-3 py-1">Contact</a>
        </div>
        <div className="relative z-10 px-5 mt-4">
          <div className="rounded-3xl overflow-hidden relative" style={{ background: "linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%)", boxShadow: "0 32px 80px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.15)" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
            <div className="relative z-10 p-7 pb-8">
              <div className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-300">Enterprise IT</span>
              </div>
              <h1 className="text-white font-bold leading-[1.05] mb-5" style={{ fontSize: "clamp(2rem, 9vw, 2.8rem)" }}>
                Empowering<br />Enterprises<br /><span style={{ color: "#a3a3a3" }}>with IT</span><br />Solutions
              </h1>
              <div className="flex gap-5 mb-6 border-t border-white/10 pt-5">
                {[["17+", "Years"], ["2,600+", "Clients"], ["99%", "Uptime"]].map(([val, label]) => (
                  <div key={label}>
                    <div className="text-white font-bold text-lg leading-none">{val}</div>
                    <div className="text-gray-500 text-[10px] tracking-widest uppercase mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
              <a href="/contact" className="flex items-center justify-between w-full px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300" style={{ background: "#ffffff", color: "#0a0a0a" }}>
                Get started today
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="relative z-10 px-5 mt-5">
          <p className="text-sm text-gray-500 leading-relaxed">
            At <span className="text-gray-800 font-semibold">Sniper Systems & Solutions</span>, we deliver tailored infrastructure management and strategic IT consulting.
          </p>
        </div>
        <div className="relative z-10 px-5 mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px bg-gray-300 flex-1" />
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400">Trusted partners</span>
            <div className="h-px bg-gray-300 flex-1" />
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {logoCompanies.slice(0, 29).map((company, i) => (
              <div key={i} className="aspect-square rounded-2xl flex items-center justify-center p-3" style={{ background: "#ffffff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.05)", transform: `translateY(${i % 2 === 0 ? "0px" : "6px"})` }}>
                <img
                  src={company.logo}
                  alt={company.name}
                  width={company.w}
                  height={company.h}
                  className="w-full h-full object-contain"
                  style={{ maxWidth: `${company.w}px`, maxHeight: `${company.h}px` }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex flex-col items-center gap-1 pb-10 mt-10">
          <ChevronDown className="w-4 h-4 text-gray-400 animate-bounce" />
          <span className="text-[9px] tracking-widest uppercase text-gray-400">Scroll</span>
        </div>
      </div>

      {/* ─── DESKTOP LAYOUT (>= lg) ─────────────────────────────────────── */}
      <div ref={outerRef} className="hidden lg:block" style={{ height: "calc(100vh + 600px)" }}>
        <div style={{ position: "sticky", top: 1, height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", backgroundColor: "#ffffff" }}>
          <div style={{ width: "100%", maxWidth: "1380px", margin: "0 auto", padding: "0 28px" }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="order-2 lg:order-1 space-y-6">
                <div className="mb-10 sm:mb-12 md:mb-16">
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                    Empowering Enterprises<br />with Cutting-Edge<br />IT Solutions
                  </h2>
                </div>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg">
                  At <strong>Sniper Systems and Solutions Pvt Ltd</strong>, we specialize in delivering comprehensive IT solutions tailored to your business needs — from advanced infrastructure management to strategic consulting.
                </p>
                <a href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 bg-black border-2 border-white text-white hover:bg-white hover:text-black hover:border-black rounded-full font-medium text-base transition-all duration-300">
                  Get started <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div className="order-1 lg:order-2">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200" style={{ background: "#1f2937" }}>
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700" style={{ background: "#1f2937" }}>
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="bg-gray-700 text-gray-400 text-xs px-4 py-1 rounded-md w-full max-w-xs text-center">www.sniperindia.com</div>
                    </div>
                  </div>
                  <div ref={innerGridRef} style={{ height: "740px", overflowY: "hidden", overflowX: "hidden", background: "#000", padding: "20px" }}>
                    <div className="grid grid-cols-4 gap-3">
                      {logoCompanies.map((company, i) => (
                        <div key={i} className="aspect-square bg-white rounded-xl flex items-center justify-center p-3 hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer group relative">
                          <img
                            src={company.logo}
                            alt={company.name}
                            width={company.w}
                            height={company.h}
                            className="w-full h-full object-contain"
                            style={{ maxWidth: `${company.w}px`, maxHeight: `${company.h}px` }}
                          />
                          <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-10">
                            <div className="bg-black text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">{company.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ========================================================
// ORBITAL RINGS
// ========================================================
const OrbitalRings = () => (
  <div className="absolute inset-0 bg-black overflow-hidden">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] md:w-[1000px] md:h-[1000px]">
      <div className="absolute inset-0 animate-[spin_20s_linear_infinite]"><div className="absolute inset-0 rounded-full border-2 border-white blur-sm"></div><div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-purple-400 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.8)]"></div></div>
      <div className="absolute inset-8 animate-[spin_15s_linear_infinite_reverse]"><div className="absolute inset-0 rounded-full border-2 border-white blur-sm"></div><div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"></div></div>
      <div className="absolute inset-16 animate-[spin_12s_linear_infinite]"><div className="absolute inset-0 rounded-full border-2 border blur-[2px]"></div><div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-pink-400 rounded-full shadow-[0_0_18px_rgba(244,114,182,0.9)]"></div></div>
      <div className="absolute inset-24 animate-[spin_9s_linear_infinite_reverse]"><div className="absolute inset-0 rounded-full border-2 border blur-[1px]"></div><div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_12px_rgba(96,165,250,0.9)]"></div></div>
      <div className="absolute inset-32 animate-[spin_7s_linear_infinite]"><div className="absolute inset-0 rounded-full border-2 border blur-[1px]"></div><div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-violet-400 rounded-full shadow-[0_0_10px_rgba(167,139,250,1)]"></div></div>
      <div className="absolute inset-40 animate-[spin_5s_linear_infinite_reverse]"><div className="absolute inset-0 rounded-full border-2 border"></div><div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-fuchsia-400 rounded-full shadow-[0_0_15px_rgba(232,121,249,1)]"></div></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"></div>
        <div className="absolute w-16 h-16 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-xl"></div>
        <div className="absolute w-8 h-8 bg-white/50 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.5)]"></div>
      </div>
    </div>
  </div>
);

// ========================================================
// CTA SECTION — from Contact.tsx with custom cursor
// ========================================================

// Detect touch once at module level — safe because this module only runs in browser
const IS_TOUCH = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

const CTASection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const ctaBtnRef = useRef<HTMLAnchorElement>(null);
  const rafRef = useRef<number | null>(null);

  // Direct DOM refs for the cursor layers (mutated in RAF, never via state)
  const blobRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  // All cursor tracking in refs — zero re-renders, zero stale closures
  const mouse  = useRef({ x: 0, y: 0 });   // raw mouse position
  const smooth = useRef({ x: 0, y: 0 });   // lerped position written to DOM
  const trail  = useRef({ x: 0, y: 0 });   // trail lags further behind
  const inside  = useRef(false);            // mouse is inside the section
  const hovered = useRef(false);            // mouse is over the CTA button

  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  // ── Single RAF loop — started once, never recreated ──────────────────
  useEffect(() => {
    if (IS_TOUCH) return;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);

      if (!inside.current) return;

      // Lerp the main blob toward the real mouse
      const f = hovered.current ? 0.2 : 0.12;
      smooth.current.x = lerp(smooth.current.x, mouse.current.x, f);
      smooth.current.y = lerp(smooth.current.y, mouse.current.y, f);

      // Trail lags behind smooth position
      trail.current.x = lerp(trail.current.x, smooth.current.x, 0.07);
      trail.current.y = lerp(trail.current.y, smooth.current.y, 0.07);

      // Write directly to DOM — NO React state, NO re-render
      if (blobRef.current) {
        const sz = hovered.current ? 128 : 96;
        blobRef.current.style.transform =
          `translate(${smooth.current.x}px, ${smooth.current.y}px) translate(-50%, -50%) scale(${hovered.current ? 1.25 : 1})`;
        blobRef.current.style.width  = `${sz}px`;
        blobRef.current.style.height = `${sz}px`;
        blobRef.current.textContent  = hovered.current ? "CLICK ME!" : "LET'S GO!";
      }

      if (trailRef.current) {
        trailRef.current.style.transform =
          `translate(${trail.current.x}px, ${trail.current.y}px) translate(-50%, -50%)`;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []); // empty deps — intentional, loop reads from refs not state

  // ── Section mouse events ──────────────────────────────────────────────
  useEffect(() => {
    if (IS_TOUCH) return;
    const section = sectionRef.current;
    if (!section) return;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    const onEnter = () => {
      inside.current = true;
      // Snap smooth/trail to current mouse so there's no "fly in" on first entry
      smooth.current.x = mouse.current.x;
      smooth.current.y = mouse.current.y;
      trail.current.x  = mouse.current.x;
      trail.current.y  = mouse.current.y;
      if (blobRef.current)  blobRef.current.style.opacity  = "1";
      if (trailRef.current) trailRef.current.style.opacity = "0.3";
    };
    const onLeave = () => {
      inside.current  = false;
      hovered.current = false;
      if (blobRef.current)  blobRef.current.style.opacity  = "0";
      if (trailRef.current) trailRef.current.style.opacity = "0";
    };

    section.addEventListener("mousemove",  onMove);
    section.addEventListener("mouseenter", onEnter);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove",  onMove);
      section.removeEventListener("mouseenter", onEnter);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // ── Magnetic CTA button ───────────────────────────────────────────────
  useEffect(() => {
    if (IS_TOUCH) return;
    const btn = ctaBtnRef.current;
    if (!btn) return;
    const onMove = (e: MouseEvent) => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.3;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.3;
      gsap.to(btn, { x: dx, y: dy, duration: 0.35, ease: "power2.out" });
    };
    const onLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.5)" });
    };
    btn.addEventListener("mousemove",  onMove);
    btn.addEventListener("mouseleave", onLeave);
    return () => {
      btn.removeEventListener("mousemove",  onMove);
      btn.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // ── Cursor markup — rendered into document.body via Portal ───────────
  // This escapes ALL ancestor stacking contexts and transforms so that
  // `position: fixed` + `transform` work exactly as expected.
  const cursorPortal = !IS_TOUCH && typeof document !== "undefined"
    ? createPortal(
        <>
          {/* Main blob */}
          <div
            ref={blobRef}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: "#ffffff",
              color: "#000000",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.04em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              userSelect: "none",
              zIndex: 99999,
              opacity: 0,
              // Only non-position props get CSS transition — position uses RAF
              transition: "opacity 0.2s ease, width 0.2s ease, height 0.2s ease",
              filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.35))",
              willChange: "transform",
            }}
          />
          {/* Trailing dot */}
          <div
            ref={trailRef}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
              pointerEvents: "none",
              zIndex: 99998,
              opacity: 0,
              transition: "opacity 0.3s ease",
              willChange: "transform",
            }}
          />
        </>,
        document.body
      )
    : null;

  return (
    <>
      {cursorPortal}

      <motion.section
        ref={(el) => {
          sectionRef.current = el;
          ctaRef.current = el;
        }}
        className="relative bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12 overflow-hidden cursor-none"
        initial={{ opacity: 0, y: 60 }}
        animate={ctaInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <OrbitalRings />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            className="mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold mb-4 sm:mb-6 leading-tight text-white">
              Have<br />an idea?<br />We make it happen
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            <a
              ref={ctaBtnRef}
              href="/contact"
              className="inline-flex items-center px-8 sm:px-12 py-3 sm:py-4 border-2 border-white rounded-full text-white font-medium text-base sm:text-lg hover:bg-white hover:text-black transition-all duration-300 relative z-10 will-change-transform"
              onMouseEnter={() => { hovered.current = true; }}
              onMouseLeave={() => { hovered.current = false; }}
            >
              CONTACT US
              <span className="absolute inset-[-12px] rounded-full" />
            </a>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
};







// ========================================================
// CLIENT TYPES SECTION
// ========================================================
const ClientTypesSection = ({ clientTypes }: { clientTypes: any[] }) => {
  const rightRef = useRef(null);
  const rightInView = useInView(rightRef, { once: true, margin: "-60px" });
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40 && activeIndex < clientTypes.length - 1) setActiveIndex((i) => i + 1);
    if (diff < -40 && activeIndex > 0) setActiveIndex((i) => i - 1);
    touchStartX.current = null;
  };

  return (
    <div className="mx-4 sm:mx-6 my-8 sm:my-10 md:my-12 bg-black text-white" style={{ borderRadius: "3rem" }}>
      {/* ─── MOBILE LAYOUT ─────────────────────────────────────── */}
      <div className="lg:hidden flex flex-col px-6 py-12">
        <h2 className="text-4xl font-semibold leading-tight mb-3">Clearly, We Stand<br />With Everyone</h2>
        <div className="w-full h-px bg-gray-700 my-5" />
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">CLEARLY, WE STAND WITH EVERYONE</p>
        <div className="relative overflow-hidden rounded-2xl" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <motion.div className="flex" animate={{ x: `-${activeIndex * 100}%` }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            {clientTypes.map((client, index) => (
              <div key={index} className="min-w-full bg-white rounded-2xl overflow-hidden">
                <img src={client.image} alt={client.title} className="w-full h-56 object-cover" />
                <div className="h-14 flex items-center justify-center px-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider text-center">{client.title}</h3>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        <div className="flex justify-center gap-2 mt-5">
          {clientTypes.map((_, i) => (
            <button key={i} onClick={() => setActiveIndex(i)} className={`transition-all duration-300 rounded-full ${i === activeIndex ? "w-6 h-2 bg-white" : "w-2 h-2 bg-gray-600"}`} />
          ))}
        </div>
        <div className="flex items-center justify-between mt-8">
          <span className="text-gray-500 text-sm tabular-nums">{String(activeIndex + 1).padStart(2, "0")} / {String(clientTypes.length).padStart(2, "0")}</span>
          <a href="/clients" className="inline-flex items-center px-6 py-2.5 border-2 border-gray-700 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-white hover:text-gray-900 transition-colors duration-300">Read more</a>
        </div>
      </div>

      {/* ─── DESKTOP LAYOUT ──────────────────────────────────────── */}
      <div className="hidden lg:flex flex-row">
        <div className="w-1/2 flex flex-col justify-center px-12 xl:px-20 py-20" style={{ position: "sticky", top: 0, height: "100vh", alignSelf: "flex-start" }}>
          <div className="max-w-lg">
            <h2 className="text-7xl font-semibold mb-6 leading-tight">Clearly, We Stand<br />With Everyone</h2>
            <div className="w-full h-px bg-gray-700 my-8" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider leading-tight mb-8">CLEARLY, WE STAND<br />WITH EVERYONE</h3>
            <a href="/Industries" className="inline-flex items-center px-8 py-3 border-2 border-gray-700 rounded-full bg-gray-900 text-white text-base font-medium hover:bg-white hover:text-gray-900 transition-colors duration-300">Industries We Serve</a>
          </div>
        </div>
        <div className="w-1/2 px-12 xl:px-20 py-20 space-y-6" ref={rightRef}>
          {clientTypes.map((client, index) => (
            <motion.div key={index} className="bg-white rounded-xl overflow-hidden" initial={{ opacity: 0, y: 50 }} animate={rightInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}>
              <img
                src={client.image}
                alt={client.title}
                draggable="false"
                onDragStart={(e) => e.preventDefault()}
                className="w-full h-64 object-cover select-none pointer-events-none"
              />
              <div className="h-16 flex items-center justify-center p-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{client.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ========================================================
// BENEFITS LIST
// ========================================================
const BenefitsList = ({ benefits, benInView }: { benefits: any[]; benInView: boolean }) => {
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (!benInView) return;
    linesRef.current.forEach((line, i) => {
      if (!line) return;
      gsap.fromTo(line, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 1, ease: "power3.out", delay: 0.3 + i * 0.12 });
    });
  }, [benInView]);
  return (
    <div className="space-y-8 sm:space-y-10 md:space-y-12">
      {benefits.map((benefit, index) => (
        <motion.div key={index} className="relative grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center pb-8 sm:pb-10 md:pb-12 last:pb-0" initial={{ opacity: 0, y: 25 }} animate={benInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 + index * 0.09 }}>
          <div className="lg:col-span-2 flex justify-center lg:justify-start"><benefit.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" /></div>
          <div className="lg:col-span-3 text-center lg:text-left"><p className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider">{benefit.label}</p></div>
          <div className="lg:col-span-7"><p className="text-base sm:text-lg text-gray-200 leading-relaxed text-center lg:text-left">{benefit.description}</p></div>
          {index < benefits.length - 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-700 overflow-hidden">
              <div ref={el => { linesRef.current[index] = el; }} className="h-full bg-gradient-to-r from-transparent via-gray-400 to-transparent" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// ========================================================
// PARTNERS GRID
// ========================================================
const PartnersGrid = ({ partners, partnersInView }: { partners: any[]; partnersInView: boolean }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (!partnersInView || triggered.current) return;
    triggered.current = true;
    const items = gridRef.current?.querySelectorAll(".partner-item");
    if (!items) return;
    gsap.fromTo(items,
      { opacity: 0, y: () => gsap.utils.random(20, 50) },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: { amount: 1.2, from: "random" } }
    );
  }, [partnersInView]);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-x-0 gap-y-0"
      style={{
        width: "100vw",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)"
      }}
    >
      {partners.map((partner, index) => (
        <div
          key={index}
          className="partner-item opacity-0 flex items-center justify-center border border-gray-100 hover:bg-gray-50 transition-all duration-300 group"
          style={{
            padding: "clamp(24px, 4vw, 32px) clamp(20px, 3.5vw, 28px)",
            minHeight: "120px"
          }}
        >
          <img
            src={partner.logo}
            alt={partner.name}
            className="object-contain transition-all duration-300 group-hover:scale-110"
            style={{
              width: "100%",
              maxWidth: partner.maxWidth ?? "100px",
              height: "auto",
              maxHeight: partner.maxHeight ?? "56px"
            }}
          />
        </div>
      ))}
    </div>
  );
};

// ========================================================
// SOLUTION CARD
// ========================================================
const SolutionCard = ({ solution, index }: { solution: any; index: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} className="grid grid-cols-1 gap-4 sm:gap-6 items-start pb-8 sm:pb-10 md:pb-12 border-b border-gray-300" initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.08 }}>
      <motion.div className="w-full overflow-hidden rounded-2xl border border-gray-200" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
        <motion.img
          src={solution.img}
          alt={solution.title}
          draggable="false"
          onDragStart={(e) => e.preventDefault()}
          className="w-full h-44 sm:h-48 object-cover select-none"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>
      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider">{solution.title}</h3>
      <p className="text-base sm:text-lg text-gray-800 leading-relaxed">{solution.description}</p>
      <a href={solution.link}>
        <motion.button className="inline-flex items-center w-fit px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-gray-900 rounded-full text-gray-900 text-sm sm:text-base font-medium hover:bg-gray-900 hover:text-white transition-colors duration-300" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          Read more
        </motion.button>
      </a>
    </motion.div>
  );
};


// ========================================================
// MAIN INDEX PAGE
// ========================================================
const Index = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  // Jotform Chatbot
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jotfor.ms/agent/embedjs/019f2165e4c6756899b7d476e73c18bd40b3/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const gsapHeroHeadingMobileRef = useRef<HTMLHeadingElement>(null);
  const gsapHeroHeadingDesktopRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const animateWords = (el: HTMLHeadingElement | null, delayOffset = 0) => {
      if (!el) return;
      const words = el.querySelectorAll(".hero-word");
      gsap.fromTo(words,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.07, delay: 0.2 + delayOffset }
      );
    };
    animateWords(gsapHeroHeadingMobileRef.current);
    animateWords(gsapHeroHeadingDesktopRef.current);
  }, []);

  const solutions = [
    { title: "AV Solutions", description: "Providing innovative audio-visual solutions tailored for business environments.", img: "https://i.postimg.cc/JhBh5MNr/AV-soln.jpg", link: "/solutions/av-solutions" },
    { title: "Cloud Solutions", description: "Delivering scalable and secure cloud services to enhance performance, flexibility, and business growth.", img: "https://i.postimg.cc/DZT7Qsfd/cloud.jpg", link: "/solutions/clould-solutions" },
    { title: "IT Asset Disposal Plans", description: "Ensuring secure and environmentally responsible disposal of IT assets.", img: "https://i.postimg.cc/yNqKB9RB/it-asset-disposal.jpg", link: "/solutions/it-asset-disposal" },
    { title: "IT Infrastructure Solutions", description: "Designing and implementing robust IT infrastructure to support business operations.", img: "https://i.postimg.cc/tJsvYv02/IT-infra.jpg", link: "/solutions/it-infrastructure" },

    { title: "IT Consulting Services", description: "Providing expert advice to align IT strategies with business objectives.", img: "https://i.postimg.cc/nrw8WQxw/it-consulting-services.webp", link: "/solutions/it-consulting" },
    { title: "Managed IT Services", description: "Offering reliable comprehensive IT support and management services.", img: "https://i.postimg.cc/ZqPGSQZq/Managed-it-serv-ice.jpg", link: "/solutions/managed-it-services" },
    { title: "Networking Solutions", description: "Providing networking solutions to ensure seamless connectivity and communication.", img: "https://i.postimg.cc/hjjp5ZtY/network.jpg", link: "/solutions/networking-solutions" },
    { title: "Device Deployment & MDM", description: "Managing the deployment of devices and implementing Mobile Device Management strategies.", img: "https://i.postimg.cc/L6X2VmSL/mdm.webp", link: "/solutions/device-deployment-mdm" },

    { title: "HR Solutions", description: "Expert HR Management Solutions to Recruit Smarter, Hire Better, and Grow Faster.", img: "https://i.postimg.cc/rs9rSzpt/payment.webp", link: "/solutions/hr-solutions" },


  ];

  const benefits = [
    { icon: Clock, label: "EXPERIENCE YOU CAN TRUST", description: "With 17+ years of experience, our IT solutions are seamless, reliable, and tailored for businesses across any location or time zone." },
    { icon: Shield, label: "READY FOR ANY CHALLENGE", description: "\"Impossible\" isn't in our vocabulary. We deliver solutions exactly as designed—no shortcuts, no compromises, just results." },
    { icon: CheckCircle, label: "SOLUTIONS BUILT FOR YOU", description: "Every business is unique. Our IT strategies, managed services, and technology integrations are customized to fit your exact needs." },
    { icon: Lightbulb, label: "PARTNERSHIPS THAT MATTER", description: "As authorized resellers of Apple, Autodesk, Adobe, Unity, and more, we combine global technology with local expertise for maximum impact." },
    { icon: Zap, label: "RELIABLE SUPPORT, ALWAYS", description: "Monitoring and support ensure your operations run smoothly, securely, and without interruption." },
  ];

  const clientTypes = [
    { title: "Large Enterprises", image: "https://i.postimg.cc/xd6t2gKZ/business.jpg" },
    { title: "Mid-Enterprise & Scale-ups", image: "https://i.postimg.cc/6pm8xv7J/employees.jpg" },
    { title: "Global Capability Centers (GCCs)", image: "https://i.postimg.cc/kXNNCf99/3d-realistic-globe-with-musical-elements.jpg" },
    { title: "Startups & Emerging Businesses", image: "https://i.postimg.cc/YCk3LT8G/businesswoman.jpg" },
    { title: "Developers & Tech Teams", image: "https://i.postimg.cc/sX8BsRB6/coders.jpg" },
    { title: "Educational Institutions", image: "https://i.postimg.cc/SNnr6y7s/old-masters-picture-gallery-dresden-night.jpg" },
  ];

  const partners = [
    { name: "Zoho", logo: "https://upload.wikimedia.org/wikipedia/commons/3/30/ZOHO_logo_2023.svg", maxWidth: "82px", maxHeight: "48px" },
    { name: "Larsen & Toubro", logo: "https://upload.wikimedia.org/wikipedia/en/a/a1/Larsen%26Toubro_logo.svg", maxWidth: "42px", maxHeight: "44px" },
    { name: "Deloitte", logo: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Logo_of_Deloitte.svg", maxWidth: "90px", maxHeight: "24px" },
    { name: "TCS", logo: "https://upload.wikimedia.org/wikipedia/en/b/b1/Tata_Consultancy_Services.svg", maxWidth: "85px", maxHeight: "42px" },
    { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg", maxWidth: "88px", maxHeight: "28px" },
    { name: "KPMG", logo: "https://upload.wikimedia.org/wikipedia/commons/d/db/KPMG_blue_logo.svg", maxWidth: "72px", maxHeight: "32px" },
    { name: "ISRO", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Indian_Space_Research_Organisation_Logo.svg", maxWidth: "59px", maxHeight: "64px" },
    { name: "Verizon", logo: "https://upload.wikimedia.org/wikipedia/commons/8/83/Verizon_2024.svg", maxWidth: "88px", maxHeight: "24px" },
    { name: "Paytm", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg", maxWidth: "76px", maxHeight: "30px" },
    { name: "Apollo Hospitals", logo: "https://upload.wikimedia.org/wikipedia/en/c/c5/Apollo_Hospitals_Logo.svg", maxWidth: "55px", maxHeight: "68px" },
    { name: "Metropolis", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Metropolis_Healthcare_Logo_Green_Background.png", maxWidth: "90px", maxHeight: "40px" },
    { name: "Athenahealth", logo: "https://upload.wikimedia.org/wikipedia/en/7/7b/Athenahealth.svg", maxWidth: "110px", maxHeight: "28px" },
    { name: "AstraZeneca", logo: "https://upload.wikimedia.org/wikipedia/en/4/4f/AstraZeneca.svg", maxWidth: "105px", maxHeight: "28px" },
    { name: "Ashok Leyland", logo: "https://upload.wikimedia.org/wikipedia/en/d/df/Ashok_Leyland_logo.svg", maxWidth: "100px", maxHeight: "30px" },
    { name: "Razorpay", logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg", maxWidth: "95px", maxHeight: "28px" },
    { name: "Rane", logo: "https://upload.wikimedia.org/wikipedia/en/b/b8/Rane_Group_Logo.jpg", maxWidth: "58px", maxHeight: "40px" },
    { name: "KONE", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Kone_Logo_2023.svg", maxWidth: "70px", maxHeight: "30px" },
    { name: "Accenture", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg", maxWidth: "95px", maxHeight: "26px" },
    { name: "Daimler", logo: "https://upload.wikimedia.org/wikipedia/en/b/b0/Daimler_logo.svg", maxWidth: "74px", maxHeight: "40px" },
    { name: "Rockstar Games", logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Rockstar_Games_Logo.svg", maxWidth: "40px", maxHeight: "40px" },
    { name: "Karnataka High Court", logo: "https://upload.wikimedia.org/wikipedia/en/1/1f/Logo_of_Karnataka_High_Court.png", maxWidth: "62px", maxHeight: "52px" },
    { name: "GE Vernova", logo: "https://upload.wikimedia.org/wikipedia/commons/6/65/GE_Vernova_logo.svg", maxWidth: "110px", maxHeight: "28px" },
    { name: "C-DAC", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Logo_for_the_Centre_for_Development_of_Advanced_Computing.svg", maxWidth: "60px", maxHeight: "40px" },
    { name: "Technicolor", logo: "https://upload.wikimedia.org/wikipedia/en/e/ec/Technicolor_Group.svg", maxWidth: "100px", maxHeight: "28px" },
    { name: "NDTV", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/NDTV_logo.svg", maxWidth: "80px", maxHeight: "28px" },

    { name: "Grow", logo: "https://i.postimg.cc/rpF0wXSw/groww-logo.webp", maxWidth: "90px", maxHeight: "38px" },
    { name: "amagi", logo: "https://i.postimg.cc/RhQ4tqmB/amagi-logo.webp", maxWidth: "90px", maxHeight: "38px" },

    { name: "Disney+", logo: "https://upload.wikimedia.org/wikipedia/commons/6/64/Disney%2B_2024.svg", maxWidth: "95px", maxHeight: "38px" },
    { name: "SBI", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/State_Bank_of_India.svg", maxWidth: "65px", maxHeight: "60px" },
    { name: "Indian Navy", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Indian_Navy_Insignia.svg", maxWidth: "65px", maxHeight: "55px" },
    { name: "Brigade Group", logo: "https://upload.wikimedia.org/wikipedia/en/8/8e/Brigade_Group.svg", maxWidth: "100px", maxHeight: "48px" },
    { name: "Asianet", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Asianet_2023_logo.png", maxWidth: "90px", maxHeight: "42px" },
    { name: "ChuChu TV", logo: "https://upload.wikimedia.org/wikipedia/en/d/d8/ChuChu_TV-logo.JPG", maxWidth: "70px", maxHeight: "45px" },

    { name: "Chargebee", logo: "https://i.postimg.cc/rsg7c4cz/6ec7fd89-42a8-4a53-a0d4-252515d5a1c2.png", maxWidth: "140px", maxHeight: "78px" },


    { name: "Bluestone", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Bluestone_Group_logo_mid_resolution.jpg", maxWidth: "120px", maxHeight: "56px" },
    { name: "Freshworks", logo: "https://brandlogos.net/wp-content/uploads/2024/04/freshworks-logo_brandlogos.net_c6t5u.png", maxWidth: "100px", maxHeight: "28px" },
    { name: "Amagi", logo: "https://iabm-cdn.s3.us-east-2.amazonaws.com/wp-content/uploads/2023/05/18132311/amagi-media-labs-pvt-ltd.webp", maxWidth: "90px", maxHeight: "28px" },
    { name: "Highspot", logo: "https://cdn-public.softwarereviews.com/production/logos/offerings/8290/large/Highspot_logo.png?1617162059", maxWidth: "90px", maxHeight: "38px" },
    { name: "Embassy Group", logo: "https://upload.wikimedia.org/wikipedia/en/9/9e/Embassy_Group.svg", maxWidth: "100px", maxHeight: "38px" },
    { name: "Swiggy", logo: "https://upload.wikimedia.org/wikipedia/en/d/d4/Swiggy_Logo.svg", maxWidth: "100px", maxHeight: "38px" },

    { name: "postman", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Postman_%28software%29.png", maxWidth: "90px", maxHeight: "38px" },
    { name: "Cognizant", logo: "https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg", maxWidth: "90px", maxHeight: "38px" },
    { name: "amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/0/06/Amazon_2024.svg", maxWidth: "90px", maxHeight: "38px" },
    { name: "wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Wipro_new_logo.svg", maxWidth: "90px", maxHeight: "38px" },
    { name: "Walmart", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Walmart_logo_%282025%29.svg", maxWidth: "90px", maxHeight: "38px" },

    { name: "Capgemini", logo: "https://upload.wikimedia.org/wikipedia/en/7/7c/Capgemini_New_logo.svg", maxWidth: "90px", maxHeight: "38px" },

    { name: "Sharechat", logo: "https://upload.wikimedia.org/wikipedia/en/8/88/Sharechat_Logo_with_Wordmark.svg", maxWidth: "90px", maxHeight: "38px" },

    { name: "Zerodha", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Zerodha_logo.svg", maxWidth: "90px", maxHeight: "38px" },
  ];

  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const solRef = useRef(null);
  const benRef = useRef(null);
  const featRef = useRef(null);
  const statsRef = useRef(null);
  const partnersRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-60px" });
  const aboutInView = useInView(aboutRef, { once: true, margin: "-60px" });
  const solInView = useInView(solRef, { once: true, margin: "-60px" });
  const benInView = useInView(benRef, { once: true, margin: "-60px" });
  const featInView = useInView(featRef, { once: true, margin: "-60px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });
  const partnersInView = useInView(partnersRef, { once: true, margin: "-60px" });

  const marqueeItems = ["IT Infrastructure", "Cloud Services", "Device Deployment", "Cybersecurity", "Quick Support", "IT Consulting", "Managed Services", "AV Solutions"];

  return (
    <Layout>
      <>
        {/* ── SEO ── all meta/og/twitter/JSON-LD injected via react-helmet-async.
            react-snap bakes these into static HTML at build time so
            Googlebot sees them without executing JavaScript.          */}
        <SEO
          title="IT Solutions Provider in Chennai | Managed IT Services India | Sniper Systems"
          description="Sniper Systems is a leading IT solutions provider in Chennai offering enterprise IT infrastructure, managed IT services, cloud solutions, cybersecurity, and digital workplace solutions across India."
          keywords="IT solutions provider in Chennai, managed IT services India, IT infrastructure solutions Chennai, enterprise IT services India, cloud solutions provider Chennai"
          canonical="https://sniperindia.com/"
          ogTitle="IT Solutions Provider in Chennai | Sniper Systems"
          ogDescription="Enterprise IT infrastructure, managed services, cloud solutions, and digital transformation services for businesses across India."
          twitterTitle="IT Infrastructure & Managed IT Services | Sniper Systems"
          twitterDescription="Leading IT solutions provider delivering enterprise IT infrastructure, cloud solutions, and managed IT services in India."
          structuredData={[
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Sniper Systems",
              url: "https://sniperindia.com",
              logo: "https://sniperindia.com/wp-content/uploads/2023/09/logo.png",
              sameAs: ["https://www.linkedin.com/company/sniper-systems"],
            },
            {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Sniper Systems",
              image: "https://sniperindia.com/wp-content/uploads/2023/09/logo.png",
              url: "https://sniperindia.com",
              telephone: "+91-44-00000000",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Chennai",
                addressRegion: "Tamil Nadu",
                addressCountry: "India",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 13.0827,
                longitude: 80.2707,
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "Service",
              serviceType: "IT Infrastructure Solutions",
              provider: { "@type": "Organization", name: "Sniper Systems" },
              areaServed: { "@type": "Country", name: "India" },
            },
          ]}
        />





        {/* BOTPRESS */}
        <script src="https://cdn.botpress.cloud/webchat/v3.6/inject.js"></script>
        <script src="https://files.bpcontent.cloud/2025/11/05/04/20251105042851-RWSTTT6V.js" defer></script>
      </>



      {/* ============================================================
          1. HERO SECTION — full-bleed 100vw × 100vh, two-column
      ============================================================ */}
      <section ref={heroRef} style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#0a0a0a', display: 'flex', flexDirection: 'column' }}>

        {/* Grid background */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />

        {/* Radial glow on globe side */}
        <div style={{ position: 'absolute', right: 0, top: 0, width: '55%', height: '100%', background: 'radial-gradient(ellipse 70% 80% at 65% 50%, rgba(255,255,255,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '32px', left: '36px', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '1px', height: '52px', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.5))' }} />
          <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>SCROLL</span>
        </div>

        {/* ── MOBILE layout (< lg) ── */}
        <div className="lg:hidden flex flex-col" style={{ minHeight: '100svh', padding: '72px 20px 0', overflow: 'hidden' }}>


          <h1 ref={gsapHeroHeadingMobileRef} aria-label="Empowering Enterprises with Cutting-Edge IT Solutions"
            style={{ margin: '0 0 12px', fontSize: 'clamp(2.2rem, 9.5vw, 3.2rem)', fontWeight: 600, lineHeight: 1.08, color: '#ffffff', letterSpacing: '-0.025em', overflow: 'hidden' }}>
            {[{ word: "Empowering", br: false }, { word: "Enterprises", br: true }, { word: "with", br: false }, { word: "Cutting-Edge", br: true }, { word: "IT", br: false }, { word: "Solutions", br: false }].map(({ word, br }, i) => (
              <span key={i}><span className="hero-word" style={{ display: 'inline-block', opacity: 0, fontWeight: 600, color: i >= 2 ? 'rgba(255,255,255,0.4)' : '#ffffff', marginRight: i < 5 ? '0.3em' : '0' }}>{word}</span>{br && <br />}</span>
            ))}
          </h1>

          <motion.p initial={{ opacity: 0, y: 14 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 1.0 }}
            style={{ margin: '0 0 18px', fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>
            At <strong style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>Sniper Systems</strong>, we deliver comprehensive IT solutions — from infrastructure management to strategic consulting.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 1.1 }}>
            <a href="/about" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 22px', background: '#ffffff', color: '#000000', borderRadius: '999px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', textDecoration: 'none', border: '2px solid transparent' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'transparent'; el.style.color = '#fff'; el.style.borderColor = 'rgba(255,255,255,0.55)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = '#fff'; el.style.color = '#000'; el.style.borderColor = 'transparent'; }}>
              What we do <ArrowRight style={{ width: '12px', height: '12px' }} />
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 1.2 }}
            style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingTop: '18px', marginTop: '18px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {[['17+', 'Years'], ['2,600+', 'Clients'], ['99%', 'Uptime']].map(([val, lbl], i, arr) => (
              <Fragment key={lbl}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff', lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginTop: '3px' }}>{lbl}</div>
                </div>
                {i < arr.length - 1 && <div style={{ width: '1px', height: '26px', background: 'rgba(255,255,255,0.08)' }} />}
              </Fragment>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={heroInView ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 0.6 }} style={{ marginTop: '16px', flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '360px', height: '100%', minHeight: 0 }}>
              <OrbitingCirclesGlobe mobile={true} />
            </div>
          </motion.div>
        </div>

        {/* ── DESKTOP layout (>= lg) — full bleed, no maxWidth ── */}
        <div className="hidden lg:flex" style={{ position: 'absolute', inset: 0, flexDirection: 'row' }}>

          {/* LEFT — text content */}
          <div style={{ width: '48%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 0 0 7vw', gap: '28px', position: 'relative', zIndex: 10 }}>



            <h1 ref={gsapHeroHeadingDesktopRef} aria-label="Empowering Enterprises with Cutting-Edge IT Solutions"
              style={{ margin: 0, fontSize: 'clamp(3rem, 4.2vw, 5rem)', fontWeight: 600, lineHeight: 1.06, color: '#ffffff', letterSpacing: '-0.03em', overflow: 'hidden' }}>
              {[{ word: "Empowering", br: false }, { word: "Enterprises", br: true }, { word: "with", br: false }, { word: "Cutting-Edge", br: true }, { word: "IT", br: false }, { word: "Solutions", br: false }].map(({ word, br }, i) => (
                <span key={i}><span className="hero-word" style={{ display: 'inline-block', opacity: 0, fontWeight: 600, color: i >= 2 ? 'rgba(255,255,255,0.38)' : '#ffffff', marginRight: i < 5 ? '0.3em' : '0' }}>{word}</span>{br && <br />}</span>
              ))}
            </h1>

            <div style={{ width: '100%', height: '1px', background: 'linear-gradient(to right, rgba(255,255,255,0.12), transparent)' }} />

            <motion.p initial={{ opacity: 0, y: 14 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 1.0 }}
              style={{ margin: 0, fontSize: '16px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, maxWidth: '480px' }}>
              At <strong style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>Sniper Systems and Solutions Pvt Ltd</strong>, we specialize in delivering comprehensive IT solutions — from advanced infrastructure management to strategic consulting.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 14 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 1.1 }}
              style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <a href="/about" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '13px 30px', background: '#ffffff', color: '#000000', borderRadius: '999px', fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', textDecoration: 'none', border: '2px solid transparent', transition: 'all 0.25s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'transparent'; el.style.color = '#fff'; el.style.borderColor = 'rgba(255,255,255,0.55)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = '#fff'; el.style.color = '#000'; el.style.borderColor = 'transparent'; }}>
                What we do <ArrowRight style={{ width: '14px', height: '14px' }} />
              </a>
              <a href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '13px 30px', background: 'transparent', color: 'rgba(255,255,255,0.55)', borderRadius: '999px', fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em', textDecoration: 'none', border: '2px solid rgba(255,255,255,0.14)', transition: 'all 0.25s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = '#fff'; el.style.borderColor = 'rgba(255,255,255,0.45)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = 'rgba(255,255,255,0.55)'; el.style.borderColor = 'rgba(255,255,255,0.14)'; }}>
                Get in touch
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 14 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 1.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: '32px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              {[['17+', 'Years'], ['2,600+', 'Clients'], ['99%', 'Uptime']].map(([val, lbl], i, arr) => (
                <Fragment key={lbl}>
                  <div>
                    <div style={{ fontSize: '22px', fontWeight: 600, color: '#fff', lineHeight: 1 }}>{val}</div>
                    <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginTop: '5px' }}>{lbl}</div>
                  </div>
                  {i < arr.length - 1 && <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.08)' }} />}
                </Fragment>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — orbiting globe: 52% wide, full height */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '52%', height: '100%', position: 'relative', zIndex: 5 }}
          >
            <OrbitingCirclesGlobe mobile={false} />
          </motion.div>
        </div>

        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      </section>

      {/* 2. BANNER SLIDER */}
      <BannerSliderSection />

      {/* MARQUEE */}
      <MarqueeTicker items={marqueeItems} />

      {/* 3. NEW HERO SECTION */}
      <NewTopHeroSection />

      {/* 4. ABOUT SECTION */}
      <section className="bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center" ref={aboutRef}>
            <motion.div className="flex items-center justify-center h-64 sm:h-72 md:h-80 lg:h-96" initial={{ opacity: 0, x: -40 }} animate={aboutInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
              <Lottiee />
            </motion.div>
            <motion.div className="space-y-6 sm:space-y-8" initial={{ opacity: 0, x: 40 }} animate={aboutInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}>
              <div className="space-y-4 sm:space-y-6">
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-800 leading-relaxed">Since 2009, Sniper Systems and Solutions Pvt. Ltd. has been at the forefront of delivering state-of-the-art IT solutions to businesses across India.</p>
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-800 leading-relaxed">Headquartered in Chennai, we specialize in providing comprehensive IT support services that empower organizations to achieve operational excellence and drive business growth.</p>
              </div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="inline-block">
                <a href="/about" className="inline-flex items-center px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-gray-900 rounded-full text-gray-900 text-sm sm:text-base font-medium hover:bg-gray-900 hover:text-white transition-colors duration-300">What we do</a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <MarqueeTicker items={["AV Solutions", "Cloud", "MDM", "IT Asset Disposal", "Consulting", "Managed Services", "Networking", "Infrastructure"]} />

      {/* 5. SOLUTIONS */}
      <section className="bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={solRef}>
          <div className="mb-10 sm:mb-12 md:mb-16">
            <motion.h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight" initial={{ opacity: 0, y: 50 }} animate={solInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>Our solutions</motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 sm:gap-x-10 lg:gap-x-12 gap-y-10 sm:gap-y-12 md:gap-y-16">
            {solutions.map((solution, index) => <SolutionCard key={index} solution={solution} index={index} />)}
          </div>
        </div>
      </section>

      {/* 6. BENEFITS */}
      <motion.section ref={benRef} className="text-white rounded-3xl sm:rounded-[3rem] md:rounded-[4rem] mx-4 sm:mx-6 my-8 sm:my-10 md:my-12 overflow-hidden" initial={{ opacity: 0, y: 60 }} animate={benInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
        <StarfieldBackground
          className="w-full"
          count={400}
          speed={0.5}
          starColor="#ffffff"
          twinkle={true}
        >
          <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10 sm:mb-12 md:mb-16">
                <motion.h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-4 sm:mb-6 leading-tight" initial={{ opacity: 0, y: 40 }} animate={benInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}>Our Competitive Edge</motion.h2>
              </div>
              <BenefitsList benefits={benefits} benInView={benInView} />
            </div>
          </div>
        </StarfieldBackground>
      </motion.section>

      {/* 8. STATS */}
      <section className="bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={statsRef}>
          <div className="mb-10 sm:mb-12 md:mb-16">
            <motion.h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight" initial={{ opacity: 0, y: 50 }} animate={statsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
              Building Solutions That<br />Move Businesses Forward
            </motion.h2>
            <div className="w-full h-px bg-gray-300"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 mb-12 sm:mb-16 md:mb-20">
            <motion.div className="flex items-center justify-center h-64 sm:h-72 md:h-80 lg:h-96" initial={{ opacity: 0, y: 30 }} animate={statsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}>
              <Lottie />
            </motion.div>
            <motion.div className="space-y-4 sm:space-y-6" initial={{ opacity: 0, y: 30 }} animate={statsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">We build solutions that make a difference, and we take pride in doing it. <strong>Sniper Systems and Solutions Pvt. Ltd.</strong> is a dedicated team of experts ready to tackle the most complex IT challenges for businesses.</p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">Mainstream? Not for us. Because for Sniper, it's not just about delivering IT services—it's about <strong>solving real business problems, supporting people, and ensuring every project succeeds.</strong></p>
            </motion.div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 w-full sm:w-auto">
              {[
                { number: "2600", suffix: "+", label: "Happy Customers" },

                { number: "17", suffix: "+", label: "Years of Experience" },
              ].map((stat, i) => (
                <motion.div key={i} className="text-center" initial={{ opacity: 0, y: 40 }} animate={statsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 + i * 0.1 }}>
                  <div className="text-4xl sm:text-5xl lg:text-6xl text-gray-900 mb-2 font-semibold">
                    <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                  </div>
                  <p className="text-gray-600 text-base sm:text-lg">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. CLIENT TYPES */}
      <ClientTypesSection clientTypes={clientTypes} />

      {/* 10. PARTNERS */}
      <section className="bg-white py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-left" ref={partnersRef}>
          <div className="mb-12 sm:mb-16 md:mb-20">
            <motion.h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight" initial={{ opacity: 0, y: 50 }} animate={partnersInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
              Proudly Serving<br />Innovative Businesses
            </motion.h2>
          </div>
        </div>
        <PartnersGrid partners={partners} partnersInView={partnersInView} />
      </section>

      {/* 11. CTA */}
      <CTASection />



      {/* Scroll To Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button onClick={scrollToTop} className="fixed bottom-6 sm:bottom-8 left-6 sm:left-8 w-12 h-12 sm:w-14 sm:h-14 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 z-50 shadow-lg" aria-label="Scroll to top" initial={{ opacity: 0, scale: 0.6, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.6, y: 20 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 -rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>
    </Layout>


  );
};

export default Index;
