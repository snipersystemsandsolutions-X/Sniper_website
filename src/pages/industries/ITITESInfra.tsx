import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Cloud, Shield, TrendingUp, Zap } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

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
      <div ref={trackRef} className="flex gap-6 sm:gap-10 whitespace-nowrap will-change-transform">
        {doubled.map((text, i) => (
          <span
            key={i}
            className="flex items-center gap-6 sm:gap-10 text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase text-gray-500"
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
    if (window.matchMedia("(max-width: 640px)").matches) return;
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
          className="relative grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-8 items-start sm:items-center pb-8 sm:pb-12 last:pb-0"
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 + index * 0.1 }}
        >
          <div className="flex items-center gap-4 sm:contents">
            <div className="sm:col-span-2 flex justify-start sm:justify-start flex-shrink-0">
              <benefit.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="sm:col-span-3 sm:text-left">
              <p className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider">
                {benefit.label}
              </p>
            </div>
          </div>
          <div className="sm:col-span-7">
            <p className="text-base sm:text-lg text-gray-200 leading-relaxed">{benefit.description}</p>
          </div>
          {index < benefits.length - 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-700 overflow-hidden sm:col-span-12">
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

// ---- Offerings List with GSAP line-draw dividers ----
const OfferingsList = ({ offerings, inView }: { offerings: any[]; inView: boolean }) => {
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
    <div className="space-y-10 sm:space-y-16">
      {offerings.map((offering, index) => (
        <motion.div
          key={index}
          className="relative grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-16 items-start pb-10 sm:pb-12 last:pb-0"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.1 + index * 0.1 }}
        >
          <div>
            <h3 className="text-sm sm:text-sm font-semibold text-gray-900 uppercase tracking-wider">
              {offering.title}
            </h3>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <p className="text-base sm:text-lg text-gray-800 leading-relaxed">{offering.description}</p>
          </div>
          {index < offerings.length - 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300 overflow-hidden">
              <div
                ref={(el) => { linesRef.current[index] = el; }}
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

// ---- Trusted Brands — GSAP random stagger ----
const BrandsGrid = ({ brands, inView }: { brands: any[]; inView: boolean }) => {
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
    <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-12">
      {brands.map((brand, index) => (
        <div
          key={index}
          className="brand-item opacity-0 flex items-center justify-center transition-all duration-300"
        >
          <img src={brand.logo} alt={brand.name} className="h-6 sm:h-8 object-contain" />
        </div>
      ))}
    </div>
  );
};

// ---- Magnetic CTA link ----
const MagneticCTALink = ({
  to,
  children,
  className,
  onMouseEnter,
  onMouseLeave,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => {
  const btnRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
      gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: "power2.out" });
    };
    const onLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.5)" });
      onMouseLeave?.();
    };
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
      onMouseEnter={onMouseEnter}
    >
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
  return (
    <div
      ref={ref}
      className="fixed inset-0 bg-white z-[9999] will-change-transform pointer-events-none"
    />
  );
};

// ---- Use Case Card with GSAP hover ----
const UseCaseCard = ({ useCase }: { useCase: any }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const img = imgRef.current;
    if (!card || !img) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const onEnter = () => gsap.to(img, { scale: 1.07, duration: 0.6, ease: "power2.out" });
    const onLeave = () => gsap.to(img, { scale: 1, duration: 0.6, ease: "power2.out" });
    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={cardRef} className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden h-56 sm:h-72 md:h-80">
      <img
        ref={imgRef}
        src={useCase.image}
        alt={useCase.title}
        className="w-full h-full object-cover will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      {(useCase.title || useCase.description) && (
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
          {useCase.title && (
            <h3 className="text-base sm:text-xl font-semibold text-white mb-1 sm:mb-2 uppercase tracking-wider">
              {useCase.title}
            </h3>
          )}
          {useCase.description && (
            <p className="text-gray-200 text-xs sm:text-sm leading-relaxed">{useCase.description}</p>
          )}
        </div>
      )}
    </div>
  );
};

// ========================================================
// IT / ITES / INFRASTRUCTURE PAGE
// ========================================================
const ITITESInfra = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const offerings = [
    {
      title: "Enterprise Laptops & Workstations",
      description:
        "High-performance computing solutions engineered for demanding IT workloads, software development, and infrastructure management. Premium enterprise-grade devices from Apple, Lenovo, and leading manufacturers that deliver reliability, security, and productivity for technical teams.",
    },
    {
      title: "Devices for Cloud Infrastructure Enablement",
      description:
        "Specialized hardware and endpoint solutions optimized for cloud-native development, DevOps workflows, and hybrid infrastructure management. Powerful systems that seamlessly integrate with AWS, Azure, Google Cloud, and private cloud environments for maximum efficiency.",
    },
    {
      title: "Devices for Cybersecurity Environments",
      description:
        "Purpose-built security workstations and monitoring systems for SOC operations, threat analysis, and penetration testing. Hardware configurations that meet the demanding requirements of cybersecurity professionals with enhanced processing power and multiple display support.",
    },
    {
      title: "Collaboration Tools & Peripherals",
      description:
        "Complete ecosystem of video conferencing systems, collaboration displays, and productivity peripherals that enable seamless remote work and hybrid team environments. Professional-grade audio-visual equipment and accessories for modern distributed workforces.",
    },
  ];

  const benefits = [
    {
      icon: Zap,
      label: "PERFORMANCE & UPTIME GUARANTEED",
      description:
        "Enterprise-grade hardware with proven reliability and minimal downtime. Systems engineered for operations, critical workloads, and mission-critical applications where failure is not an option.",
    },
    {
      icon: TrendingUp,
      label: "AGILITY & SCALABILITY",
      description:
        "Technology stacks that scale with your business growth and adapt to changing requirements. Flexible solutions that support rapid deployment, team expansion, and evolving technology needs without compromise.",
    },
    {
      icon: Cloud,
      label: "CLOUD-NATIVE READINESS",
      description:
        "Hardware and software ecosystems optimized for cloud-first architectures and modern development practices. Seamless integration with leading cloud platforms and container orchestration systems for maximum efficiency.",
    },
    {
      icon: Shield,
      label: "COST-EFFICIENCY AT SCALE",
      description:
        "Strategic procurement solutions, flexible financing options, and lifecycle management services that optimize total cost of ownership. Smart technology investments that deliver ROI and support sustainable growth.",
    },
  ];

  const useCases = [
    {
      title: "",
      description: "",
      image: "https://i.postimg.cc/BQvkxmfN/future-visions-business-technology-concept.jpg",
    },
    {
      title: "",
      description: "",
      image: "https://i.postimg.cc/YC5PBkGy/abstract-cybersecurity-concept-design.jpg",
    },
    {
      title: "",
      description: "",
      image: "https://i.postimg.cc/Wz1Ww1KY/woman-smiling-drawn-graphics.jpg",
    },
    {
      title: "",
      description: "",
      image: "https://i.postimg.cc/8PsXFsLZ/html-css-collage-concept-with-person.jpg",
    },
  ];

  const trustedBrands = [
    { name: "Apple",     logo: "https://i.postimg.cc/XvWWW9tZ/Apple-logo-1.png" },
    { name: "NVIDIA",    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a4/NVIDIA_logo.svg" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1280px-Microsoft_logo.svg.png" },
    { name: "Lenovo",    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Lenovo_%282015%29.svg" },
    { name: "Cisco",     logo: "https://bcassetcdn.com/public/blog/wp-content/uploads/2024/06/14155422/image-1.png" },
    { name: "Adobe",     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Adobe_logo_and_wordmark_%282017%29.svg/640px-Adobe_logo_and_wordmark_%282017%29.svg.png" },
    { name: "Autodesk",  logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/Autodesk_Logo_2021.svg" },
    { name: "Dell",      logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg" },
    { name: "HP",        logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/HP_logo_2025.svg" },
  ];

  // Section refs
  const heroRef      = useRef(null);
  const offerRef     = useRef(null);
  const benRef       = useRef(null);
  const featRef      = useRef(null);
  const useCasesRef  = useRef(null);
  const statsRef     = useRef(null);
  const brandsRef    = useRef(null);
  const ctaRef       = useRef(null);

  const heroInView      = useInView(heroRef,      { once: true, margin: "-60px" });
  const offerInView     = useInView(offerRef,     { once: true, margin: "-60px" });
  const benInView       = useInView(benRef,       { once: true, margin: "-60px" });
  const featInView      = useInView(featRef,      { once: true, margin: "-60px" });
  const useCasesInView  = useInView(useCasesRef,  { once: true, margin: "-60px" });
  const statsInView     = useInView(statsRef,     { once: true, margin: "-60px" });
  const brandsInView    = useInView(brandsRef,    { once: true, margin: "-60px" });
  const ctaInView       = useInView(ctaRef,       { once: true, margin: "-100px" });

  // ✦ GSAP: Hero heading word-stagger
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = heroHeadingRef.current;
    if (!el) return;
    const words = el.querySelectorAll(".it-word");
    gsap.fromTo(
      words,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.07, delay: 1.2 }
    );
  }, []);

  // ✦ GSAP: CTA heading word stagger
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

  // ✦ GSAP: Use case cards stagger
  const useCaseGridRef = useRef<HTMLDivElement>(null);
  const useCaseTriggered = useRef(false);
  useEffect(() => {
    if (!useCasesInView || useCaseTriggered.current) return;
    useCaseTriggered.current = true;
    const cards = useCaseGridRef.current?.querySelectorAll(".usecase-card");
    if (!cards) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.12 }
    );
  }, [useCasesInView]);

  // ✦ NEW: Hero image scale-on-scroll (grows as you scroll down)
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

  const marqueeItems  = ["IT / ITES / Infrastructure", "Enterprise Laptops", "Cloud Enablement", "Cybersecurity", "DevOps", "Digital Economy"];
  const marqueeItems2 = ["Apple", "Lenovo", "Cisco", "Microsoft", "AWS", "Azure", "Cloud-Native", "SOC Operations"];
  const marqueeItems3 = ["Accelerate Your Digital Journey", "Cloud-Native Ready", "IT Innovation", "Sniper Systems", "Digital Progress"];

  return (
    <Layout>
      {showWhiteScreen && (
        <WhiteScreenTransition onComplete={() => setShowWhiteScreen(false)} />
      )}

         <>

        {/* BASIC SEO */}

        <title>IT Infrastructure Solutions in Chennai | Enterprise IT Services | Sniper Systems</title>

        <meta
          name="description"
          content="Sniper Systems provides enterprise IT infrastructure solutions in Chennai including networking, data center solutions, cloud integration, and secure IT environments for businesses across India."
        />

        <meta
          name="keywords"
          content="IT infrastructure solutions Chennai, enterprise IT infrastructure India, network infrastructure services, data center solutions India, IT infrastructure company Chennai"
        />

        <meta name="robots" content="index, follow" />

        <link
          rel="canonical"
          href="https://sniperindia.com/solutions/it-infrastructure"
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
          content="IT Infrastructure Solutions | Sniper Systems"
        />

        <meta
          property="og:description"
          content="Build secure, scalable, and high-performance IT infrastructure with Sniper Systems enterprise solutions."
        />

        <meta
          property="og:image"
          content="https://sniperindia.com/wp-content/uploads/2023/09/sniper-systems-banner.jpg"
        />

        <meta
          property="og:url"
          content="https://sniperindia.com/solutions/it-infrastructure"
        />

        {/* TWITTER SEO */}

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="Enterprise IT Infrastructure Services | Sniper Systems"
        />

        <meta
          name="twitter:description"
          content="Transform your business with secure IT infrastructure, networking, and cloud-ready enterprise solutions."
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
            "serviceType": "IT Infrastructure Solutions",
            "provider": {
              "@type": "Organization",
              "name": "Sniper Systems"
            },
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "description": "Enterprise IT infrastructure solutions including networking, cloud integration, and secure IT environments."
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
                "name": "IT Infrastructure",
                "item": "https://sniperindia.com/solutions/it-infrastructure"
              }
            ]
          }
          `}
</script>

      </>

      {/* ==================== HERO ==================== */}
      <section className="relative bg-white pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-white opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16" ref={heroRef}>

            {/* ✦ GSAP word-stagger heading */}
            <h1
              ref={heroHeadingRef}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight font-sans"
              aria-label="Accelerating Innovation for the Digital Economy"
            >
              {["Accelerating", "Innovation", "for", <br key="br" />, "the", "Digital", "Economy"].map((word, i) =>
                typeof word !== "string" ? word : (
                  <span key={i} className="it-word inline-block opacity-0 mr-[0.25em] last:mr-0">
                    {word}
                  </span>
                )
              )}
            </h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-700 max-w-5xl mx-auto leading-relaxed px-2 sm:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.6 }}
            >
              For IT, ITES, and Infrastructure firms, performance and uptime are non-negotiable. Sniper delivers
              cutting-edge technology stacks, cloud platforms, and endpoint ecosystems that enable agility,
              collaboration, and cost-efficiency.
            </motion.p>
          </div>

          {/* ✦ Hero image with scroll-triggered scale animation */}
          <motion.div
            className="max-w-6xl mx-auto pt-6 sm:pt-12"
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          >
            {/*
              ✦ heroImgWrapRef is placed on this inner div.
                 GSAP scrubs scale(0.82 → 1) and borderRadius as you scroll.
                 overflow-hidden ensures the image never bleeds outside corners.
                 Framer's scale: 0.98 initial has been removed to avoid conflicts —
                 GSAP owns the scale entirely on this element.
            */}
            <div
              ref={heroImgWrapRef}
              className="relative shadow-2xl overflow-hidden h-56 sm:h-80 md:h-[500px] lg:h-[600px]"
              style={{
                borderRadius: "2.5rem",
                willChange: "transform, border-radius",
                transformOrigin: "center center",
              }}
            >
              <ParallaxImage
                src="https://i.postimg.cc/Zn53MBJ2/businessman-working-futuristic-office.jpg"
                alt="IT Infrastructure"
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 z-10">
                <div className="bg-black bg-opacity-50 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                  <span className="text-xs sm:text-sm font-medium">IT / ITES / INFRASTRUCTURE</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ✦ GSAP Marquee — after hero */}
      <MarqueeTicker items={marqueeItems} speed={24} />

      {/* ==================== KEY OFFERINGS ==================== */}
      <section className="bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={offerRef}>
          <div className="mb-10 sm:mb-16">
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
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
        className="bg-black text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12"
        initial={{ opacity: 0, y: 60 }}
        animate={benInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <motion.h2
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={benInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              Built for the demands<br />of digital business
            </motion.h2>
          </div>
          <BenefitsList benefits={benefits} inView={benInView} />
        </div>
      </motion.section>

      {/* ✦ GSAP Marquee — between benefits and use cases */}
      <MarqueeTicker items={marqueeItems2} speed={30} reverse />

      {/* ==================== USE CASES ==================== */}
      <section className="bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={useCasesRef}>
          <div className="mb-10 sm:mb-16">
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={useCasesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              Powering modern<br />IT operations
            </motion.h2>
            <div className="w-full h-px bg-gray-300 mt-6 sm:mt-8" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-12 sm:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={useCasesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider leading-tight">
                ENABLING AGILITY<br />&amp; INNOVATION
              </h3>
            </motion.div>
            <motion.div
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={useCasesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                From startups to enterprise IT organizations, we provide technology solutions that support rapid
                development cycles, secure operations, and seamless collaboration across distributed teams and
                complex infrastructure environments.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Our IT/ITES solutions combine enterprise-grade hardware, cloud-ready systems, and comprehensive
                support services to create technology foundations that scale with your business and adapt to
                emerging opportunities in the digital economy.
              </p>
            </motion.div>
          </div>

          {/* ✦ GSAP use case cards stagger */}
          <div ref={useCaseGridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="usecase-card opacity-0">
                <UseCaseCard useCase={useCase} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== STATS ==================== */}
      <section className="bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={statsRef}>
          <div className="mb-10 sm:mb-16">
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              Powering IT Teams<br />Across India
            </motion.h2>
            <div className="w-full h-px bg-gray-300" />
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-8 lg:gap-16 w-full sm:w-auto">
              {[
                { number: "1800", suffix: "+", label: "Happy Customers" },
                { number: "600",  suffix: "+", label: "IT/ITES Clients" },
                { number: "15",   suffix: "+", label: "Years of Experience" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="text-center"
                  initial={{ opacity: 0, y: 40 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 + i * 0.1 }}
                >
                  <div className="text-4xl sm:text-5xl md:text-6xl text-gray-900 mb-2 font-semibold">
                    <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                  </div>
                  <p className="text-gray-600 text-base sm:text-lg">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TRUSTED BRANDS ==================== */}
      <section className="bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={brandsRef}>
          <div className="mb-12 sm:mb-20">
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
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

      {/* ✦ GSAP Marquee — before CTA */}
      <MarqueeTicker items={marqueeItems3} speed={22} />

      {/* ==================== CTA ==================== */}
      <motion.section
        ref={ctaRef}
        className="bg-black text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12 overflow-hidden"
        initial={{ opacity: 0, y: 60 }}
        animate={ctaInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 sm:mb-12 overflow-hidden">
            <h2
              ref={ctaHeadingRef}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold mb-4 sm:mb-6 leading-tight"
              aria-label="Ready to accelerate your digital journey? Let's connect"
            >
              {["Ready", "to", "accelerate", <br key="br1" />, "your", "digital", "journey?", <br key="br2" />, "Let's", "connect"].map((word, i) =>
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
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          >
            <MagneticCTALink
              to="/contact"
              className="inline-flex items-center px-8 sm:px-12 py-3 sm:py-4 border-2 border-white rounded-full text-white font-medium text-base sm:text-lg hover:bg-white hover:text-black transition-colors duration-300"
            >
              GET STARTED
            </MagneticCTALink>
          </motion.div>
        </div>
      </motion.section>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 sm:bottom-8 right-4 sm:left-8 w-11 sm:w-14 h-11 sm:h-14 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 z-50 shadow-lg"
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

export default ITITESInfra;
