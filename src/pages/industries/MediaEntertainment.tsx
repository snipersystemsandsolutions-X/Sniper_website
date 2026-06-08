import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Film, Palette, Users, Zap } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

// ========================================================
// SHARED UTILITIES
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
  useEffect(() =>
    {
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
      <div
        ref={trackRef}
        className="flex gap-6 sm:gap-8 lg:gap-10 whitespace-nowrap will-change-transform"
      >
        {doubled.map((text, i) => (
          <span
            key={i}
            className="flex items-center gap-6 sm:gap-8 lg:gap-10 text-[9px] sm:text-[10px] lg:text-[11px] font-semibold tracking-[0.16em] sm:tracking-[0.2em] lg:tracking-[0.22em] uppercase text-gray-500"
          >
            {text}
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gray-700 inline-block" />
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

// ---- Animated Counter ----
const AnimatedCounter = ({
  target,
  suffix = "",
}: {
  target: string;
  suffix?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);
  const numericMatch = target.match(/[\d.]+/);
  const numericValue = numericMatch ? parseFloat(numericMatch[0]) : null;
  const prefix = target.replace(/[\d.]+.*/, "");
  const trailingSuffix =
    numericValue !== null
      ? target
          .replace(new RegExp(`^${prefix}[\\d.]+`), "")
          .replace(suffix, "")
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
                prefix +
                Math.round(obj.val).toLocaleString() +
                trailingSuffix +
                suffix;
          },
        });
      },
    });
    return () => st.kill();
  }, [numericValue]);

  if (numericValue === null) return <span ref={ref}>{target}</span>;
  return (
    <span ref={ref}>
      {prefix}0{trailingSuffix}
      {suffix}
    </span>
  );
};

// ---- Benefits List ----
const BenefitsList = ({
  benefits,
  inView,
}: {
  benefits: any[];
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
    <div className="space-y-6 sm:space-y-8 lg:space-y-12">
      {benefits.map((benefit, index) => (
        <motion.div
          key={index}
          className="relative pb-6 sm:pb-8 lg:pb-12 last:pb-0"
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.2 + index * 0.1,
          }}
        >
          <div className="flex flex-col gap-3 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
            <div className="flex items-center gap-3 lg:contents">
              <div className="lg:col-span-2 flex-shrink-0">
                <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="lg:col-span-3">
                <p className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-400 uppercase tracking-wider leading-tight">
                  {benefit.label}
                </p>
              </div>
            </div>
            <div className="lg:col-span-7 pl-9 lg:pl-0">
              <p className="text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          </div>
          {index < benefits.length - 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-700 overflow-hidden">
              <div
                ref={(el) => {
                  linesRef.current[index] = el;
                }}
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

// ---- Offerings List ----
const OfferingsList = ({
  offerings,
  inView,
}: {
  offerings: any[];
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
        { scaleX: 1, duration: 1, ease: "power3.out", delay: 0.2 + i * 0.1 }
      );
    });
  }, [inView]);

  return (
    <div className="space-y-8 sm:space-y-10 lg:space-y-16">
      {offerings.map((offering, index) => (
        <motion.div
          key={index}
          className="relative pb-8 sm:pb-10 lg:pb-12 last:pb-0"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.75,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.1 + index * 0.1,
          }}
        >
          <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-snug">
                {offering.title}
              </h3>
            </div>
            <div>
              <p className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed">
                {offering.description}
              </p>
            </div>
          </div>
          {index < offerings.length - 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300 overflow-hidden">
              <div
                ref={(el) => {
                  linesRef.current[index] = el;
                }}
                className="h-full bg-gradient-to-r from-transparent via-gray-600 to-transparent"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// ---- Brands Grid ----
const BrandsGrid = ({
  brands,
  inView,
}: {
  brands: any[];
  inView: boolean;
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (!inView || triggered.current) return;
    triggered.current = true;
    const items = gridRef.current?.querySelectorAll(".brand-item");
    if (!items) return;
    gsap.fromTo(
      items,
      { opacity: 0, y: () => gsap.utils.random(20, 45) },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: { amount: 0.7, from: "random" },
      }
    );
  }, [inView]);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12"
    >
      {brands.map((brand, index) => (
        <div
          key={index}
          className="brand-item opacity-0 flex items-center justify-center py-2"
        >
          <img
            src={brand.logo}
            alt={brand.name}
            className="h-5 sm:h-6 lg:h-8 object-contain"
          />
        </div>
      ))}
    </div>
  );
};

// ---- Happy Customers Grid ----
const HappyCustomersGrid = ({
  customers,
  inView,
}: {
  customers: any[];
  inView: boolean;
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (!inView || triggered.current) return;
    triggered.current = true;
    const items = gridRef.current?.querySelectorAll(".customer-item");
    if (!items) return;
    gsap.fromTo(
      items,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: "power2.out",
        stagger: 0.12,
        delay: 0.2,
      }
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
            className="h-6 sm:h-7 lg:h-16 w-full object-contain transition-opacity duration-300"
          />
        </div>
      ))}
    </div>
  );
};

// ---- Magnetic CTA Link ----
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
    if (window.matchMedia("(hover: none)").matches) return;
    const btn = btnRef.current;
    if (!btn) return;
    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - (rect.left + rect.width / 2)) * 0.35,
        y: (e.clientY - (rect.top + rect.height / 2)) * 0.35,
        duration: 0.4,
        ease: "power2.out",
      });
    };
    const onLeave = () =>
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.5)" });
    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);
    return () => {
      btn.removeEventListener("mousemove", onMove);
      btn.removeEventListener("mouseleave", onLeave);
    };
  }, []);
  return (
    <a
      ref={btnRef as any}
      href={to}
      className={`will-change-transform ${className ?? ""}`}
    >
      {children}
    </a>
  );
};

// ---- White Screen Transition ----
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
  return (
    <div
      ref={ref}
      className="fixed inset-0 bg-white z-[9999] will-change-transform pointer-events-none"
    />
  );
};

// ========================================================
// MEDIA & ENTERTAINMENT PAGE
// ========================================================
const MediaEntertainment = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // ── Data ──
  const offerings = [
    {
      title: "Video Editing & Animation Workstations",
      description:
        "Powerhouse workstations engineered for demanding video editing and 3D animation workflows. Built with professional-grade components to handle 4K, 8K, and high frame rate content without compromise, ensuring smooth playback and rapid rendering.",
    },
    {
      title: "High-Resolution Displays & Color Accuracy Tools",
      description:
        "Cinema-grade displays with exceptional color accuracy and HDR support for precise color grading and content review. Calibrated monitors that ensure your creative vision translates perfectly from screen to final delivery.",
    },
    {
      title: "Post-Production & Creative Software",
      description:
        "Complete suite of industry-standard software from Adobe, Autodesk, Unity, and leading creative platforms. Everything you need for editing, motion graphics, visual effects, color grading, and audio post-production in one integrated ecosystem.",
    },
    {
      title: "Collaboration & Remote Review Tools",
      description:
        "Cloud-based collaboration platforms and secure remote review tools that keep creative teams connected and projects moving forward. Real-time feedback, version control, and seamless asset sharing across distributed production environments.",
    },
  ];

  const benefits = [
    {
      icon: Zap,
      label: "LIGHTNING-FAST RENDERING",
      description:
        "NVIDIA RTX graphics and high-performance processors deliver the rendering speed your deadlines demand. Cut render times in half and iterate faster with workstations purpose-built for creative professionals.",
    },
    {
      icon: Film,
      label: "STORYBOARD TO SCREEN",
      description:
        "End-to-end solutions that support your entire creative pipeline, from pre-visualization and shooting to editing, color grading, and final delivery. Every tool optimized for seamless creative workflows.",
    },
    {
      icon: Palette,
      label: "CREATIVE FREEDOM, TECHNICAL POWER",
      description:
        "Hardware and software that never gets in the way of creativity. Reliable, powerful systems that handle the technical complexity so your team can focus on storytelling and artistic vision.",
    },
    {
      icon: Users,
      label: "LIVE COLLABORATION ENABLED",
      description:
        "Real-time collaboration tools and cloud infrastructure that keep remote teams in sync. Review sessions, asset sharing, and project coordination that work as smoothly as being in the same studio.",
    },
  ];

  const trustedBrands = [
    {
      name: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    },
    {
      name: "NVIDIA",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a4/NVIDIA_logo.svg",
    },
    {
      name: "Microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1280px-Microsoft_logo.svg.png",
    },
    {
      name: "Lenovo",
      logo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Lenovo_%282015%29.svg",
    },
    {
      name: "Autodesk",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/Autodesk_Logo_2021.svg",
    },
    {
      name: "Unity",
      logo: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Unity_2021.svg",
    },
    {
      name: "Adobe",
      logo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.svg",
    },
  ];

  // "Trusted by AR-VR-MR-XR Leaders" logo grid — same data as Page 1


  const happyCustomers = [
    { name: "Apollo Hospitals",  logo: "https://i.postimg.cc/3kTBp6Ht/amagi-logo-white.jpg" },
    { name: "Fortis Healthcare", logo: "https://i.postimg.cc/rddKpVPc/brand-horizontal.png" },
    { name: "Cipla",             logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Rockstar_Games_Logo.svg" },
    { name: "Sun Pharma",        logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg" },
  ];

  // ── Section refs ──
  const heroRef    = useRef(null);
  const offerRef   = useRef(null);
  const benRef     = useRef(null);
  const statsRef   = useRef(null);
  const brandsRef  = useRef(null);
  const custRef    = useRef(null);
  const xrRef      = useRef(null);
  const ctaRef     = useRef(null);

  const heroInView    = useInView(heroRef,   { once: true, margin: "-60px" });
  const offerInView   = useInView(offerRef,  { once: true, margin: "-60px" });
  const benInView     = useInView(benRef,    { once: true, margin: "-60px" });
  const statsInView   = useInView(statsRef,  { once: true, margin: "-60px" });
  const brandsInView  = useInView(brandsRef, { once: true, margin: "-60px" });
  const custInView    = useInView(custRef,   { once: true, margin: "-60px" });
  const xrInView      = useInView(xrRef,     { once: true, margin: "-60px" });
  const ctaInView     = useInView(ctaRef,    { once: true, margin: "-100px" });

  // ── GSAP: Hero heading word-stagger ──
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = heroHeadingRef.current;
    if (!el) return;
    gsap.fromTo(
      el.querySelectorAll(".me-word"),
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

  // ── GSAP: Hero image scale-on-scroll (matches Page 1) ──
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
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  // ── GSAP: Happy Customers heading word-stagger ──
  const custHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!custInView) return;
    const el = custHeadingRef.current;
    if (!el) return;
    gsap.fromTo(
      el.querySelectorAll(".cust-word"),
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
  }, [custInView]);

  // ── GSAP: XR Leaders heading word-stagger ──
  const xrHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!xrInView) return;
    const el = xrHeadingRef.current;
    if (!el) return;
    gsap.fromTo(
      el.querySelectorAll(".xr-word"),
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
  }, [xrInView]);

  // ── GSAP: CTA heading word-stagger ──
  const ctaHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!ctaInView) return;
    const el = ctaHeadingRef.current;
    if (!el) return;
    gsap.fromTo(
      el.querySelectorAll(".cta-word"),
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

  const marqueeItems  = ["Media & Entertainment", "Video Editing", "3D Animation", "Color Grading", "Post-Production", "Live Collaboration"];
  const marqueeItems2 = ["Adobe", "DaVinci Resolve", "NVIDIA RTX", "Autodesk", "4K Workflows", "Creative Studios", "Remote Review"];
  const marqueeItems3 = ["Elevate Your Creative Work", "Storyboard to Screen", "Creative Power", "Sniper Systems", "Technical Precision"];

  return (
    <Layout>
      {showWhiteScreen && (
        <WhiteScreenTransition onComplete={() => setShowWhiteScreen(false)} />
      )}

      {/* ==================== HERO (Page 1 style) ==================== */}
      <section className="relative bg-white pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-white opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16" ref={heroRef}>
            <h1
              ref={heroHeadingRef}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight font-sans"
              aria-label="Creative Power Meets Technical Precision"
            >
              {[
                "Creative",
                "Power",
                "Meets",
                <br key="br" />,
                "Technical",
                "Precision",
              ].map((word, i) =>
                typeof word !== "string" ? (
                  word
                ) : (
                  <span
                    key={i}
                    className="me-word inline-block opacity-0 mr-[0.2em] sm:mr-[0.22em] lg:mr-[0.25em] last:mr-0"
                  >
                    {word}
                  </span>
                )
              )}
            </h1>
            <motion.p
              className="text-sm sm:text-base lg:text-xl text-gray-700 max-w-5xl mx-auto leading-relaxed px-1 sm:px-4 lg:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 1.6,
              }}
            >
              Sniper supports media houses, production studios, and creative agencies with cutting-edge tools
              for editing, rendering, animation, and live collaboration. We help content creators and studios
              work faster and smarter—from storyboard to screen.
            </motion.p>
          </div>

          {/* Hero image — identical scale-on-scroll as Page 1 */}
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
                src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600&q=80"
                alt="Media Production Studio"
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-3 sm:left-4 lg:left-6 z-10">
                <div className="bg-black bg-opacity-50 text-white px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full backdrop-blur-sm">
                  <span className="text-[10px] sm:text-xs lg:text-sm font-medium tracking-wide">
                    MEDIA & ENTERTAINMENT
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <MarqueeTicker items={marqueeItems} speed={24} />

      {/* ==================== KEY OFFERINGS ==================== */}
      <section className="bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={offerRef}>
          <div className="mb-8 sm:mb-10 lg:mb-16">
            <motion.h2
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={offerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              Key Offerings
            </motion.h2>
          </div>
          <OfferingsList offerings={offerings} inView={offerInView} />
        </div>
      </section>

      {/* ==================== BENEFITS ==================== */}
      <motion.section
        ref={benRef}
        className="bg-black text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 rounded-[1.5rem] sm:rounded-[2.5rem] lg:rounded-[4rem] mx-3 sm:mx-4 lg:mx-6 my-6 sm:my-8 lg:my-12"
        initial={{ opacity: 0, y: 60 }}
        animate={benInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 lg:mb-16">
            <motion.h2
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={benInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1,
              }}
            >
              Why Creative Teams
              <br />
              Choose Sniper
            </motion.h2>
          </div>
          <BenefitsList benefits={benefits} inView={benInView} />
        </div>
      </motion.section>

      <MarqueeTicker items={marqueeItems2} speed={30} reverse />

      {/* ==================== STATS ==================== */}
      <section className="bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={statsRef}>
          <div className="mb-8 sm:mb-10 lg:mb-16">
            <motion.h2
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              Empowering Creators
              <br />
              Across Industries
            </motion.h2>
            <div className="w-full h-px bg-gray-300" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 mb-10 sm:mb-14 lg:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1,
              }}
            >
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-snug">
                FROM STORYBOARD
                <br />
                TO SCREEN
              </h3>
            </motion.div>
            <motion.div
              className="space-y-3 sm:space-y-4 lg:space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2,
              }}
            >
              <p className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed">
                Whether you're a boutique creative agency or a large-scale production house, we provide the
                technology backbone that transforms ideas into compelling visual stories that captivate audiences.
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed">
                Our media and entertainment solutions combine raw computing power, color-accurate displays,
                professional software, and collaborative tools to create an environment where creativity flows
                uninterrupted and deadlines are met with confidence.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-16">
            {[
              { number: "1800", suffix: "+", label: "Happy Customers" },
              { number: "300",  suffix: "+", label: "Creative Studios" },
              { number: "15",   suffix: "+", label: "Years of Experience" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 40 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.3 + i * 0.1,
                }}
              >
                <div className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl text-gray-900 mb-1.5 sm:mb-2 font-semibold">
                  <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                </div>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TRUSTED BRANDS ==================== */}
      <section className="bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={brandsRef}>
          <div className="mb-8 sm:mb-12 lg:mb-20">
            <motion.h2
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={brandsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              Trusted Brands
            </motion.h2>
          </div>
          <BrandsGrid brands={trustedBrands} inView={brandsInView} />
        </div>
      </section>

      <MarqueeTicker items={marqueeItems3} speed={22} />

      {/* ==================== HAPPY CUSTOMERS ==================== */}
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
                aria-label="Trusted by M & E Leaders"
              >
                {["Trusted", "by", <br key="br" />, "M\u00a0&\u00a0E", "Leaders"].map(
                  (word, i) =>
                    typeof word !== "string" ? (
                      word
                    ) : (
                      <span
                        key={i}
                        className="cust-word inline-block opacity-0 mr-[0.2em] sm:mr-[0.22em] lg:mr-[0.25em] last:mr-0"
                      >
                        {word}
                      </span>
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
              initial={{ opacity: 0, y: 20 }}
              animate={custInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2,
              }}
            >
              <h3 className="text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-400 uppercase tracking-wider leading-snug">
                ORGANIZATIONS
                <br />
                ACROSS INDIA
              </h3>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={custInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.3,
              }}
            >
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
                From large production houses to boutique creative studios, our solutions are deployed across
                India's most respected media and entertainment organizations—helping them deliver
                outstanding creative output through better technology.
              </p>
            </motion.div>
          </div>

          {/* Logo grid */}
          <HappyCustomersGrid customers={happyCustomers} inView={custInView} />
        </div>
      </motion.section>



      {/* ==================== CTA ==================== */}
      <motion.section
        ref={ctaRef}
        className="bg-black text-white py-14 sm:py-16 lg:py-20 px-4 sm:px-6 rounded-[1.5rem] sm:rounded-[2.5rem] lg:rounded-[4rem] mx-3 sm:mx-4 lg:mx-6 my-6 sm:my-8 lg:my-12 overflow-hidden"
        initial={{ opacity: 0, y: 60 }}
        animate={ctaInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-4xl mx-auto text-center px-2">
          <div className="mb-8 sm:mb-10 lg:mb-12 overflow-hidden">
            <h2
              ref={ctaHeadingRef}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold mb-4 sm:mb-6 leading-tight"
              aria-label="Ready to elevate your creative work? Let's talk"
            >
              {[
                "Ready",
                "to",
                "elevate",
                <br key="br1" />,
                "your",
                "creative",
                "work?",
                <br key="br2" />,
                "Let's",
                "talk",
              ].map((word, i) =>
                typeof word !== "string" ? (
                  word
                ) : (
                  <span
                    key={i}
                    className="cta-word inline-block opacity-0 mr-[0.15em] sm:mr-[0.18em] lg:mr-[0.22em] last:mr-0"
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
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.6,
            }}
          >
            <MagneticCTALink
              to="/contact"
              className="inline-flex items-center px-6 sm:px-8 lg:px-12 py-3 sm:py-3.5 lg:py-4 border-2 border-white rounded-full text-white font-medium text-sm sm:text-base lg:text-lg hover:bg-white hover:text-black transition-colors duration-300 active:scale-95"
            >
              GET IN TOUCH
            </MagneticCTALink>
          </motion.div>
        </div>
      </motion.section>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-5 right-5 sm:bottom-6 sm:left-6 lg:bottom-8 lg:right-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 z-50 shadow-lg active:scale-90"
            aria-label="Scroll to top"
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 -rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default MediaEntertainment;
