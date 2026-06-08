import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Cpu, Network, Settings, Zap } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

// ========================================================
// TYPES
// ========================================================
interface Brand {
  name: string;
  logo: string;
}

interface Offering {
  title: string;
  description: string;
}

interface Benefit {
  icon: React.ElementType;
  label: string;
  description: string;
}

interface Sector {
  title: string;
  description: string;
  image: string;
}

interface StatItem {
  number: string;
  suffix: string;
  label: string;
}

interface Customer {
  name: string;
  logo: string;
}

// ========================================================
// MARQUEE TICKER
// ========================================================
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
    const raf = requestAnimationFrame(() => {
      const totalWidth = track.scrollWidth / 2;
      const tween = gsap.to(track, {
        x: reverse ? `${totalWidth}px` : `-${totalWidth}px`,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
      return () => tween.kill();
    });
    return () => cancelAnimationFrame(raf);
  }, [speed, reverse]);

  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden bg-gray-950 py-3 md:py-4 border-y border-gray-800">
      <div
        ref={trackRef}
        className="flex gap-8 md:gap-10 whitespace-nowrap will-change-transform"
      >
        {doubled.map((text, i) => (
          <span
            key={i}
            className="flex items-center gap-8 md:gap-10 text-[10px] md:text-[11px] font-semibold tracking-[0.18em] md:tracking-[0.22em] uppercase text-gray-500"
          >
            {text}
            <span className="w-1.5 h-1.5 rounded-full bg-gray-700 inline-block flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
};

// ========================================================
// PARALLAX IMAGE
// ========================================================
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

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isTouch = "ontouchstart" in window;
    if (prefersReducedMotion || isTouch) return;

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      animation: gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: "none" }),
    });

    return () => st.kill();
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

// ========================================================
// ANIMATED COUNTER
// ========================================================
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
            if (el) {
              el.textContent =
                prefix +
                Math.round(obj.val).toLocaleString() +
                trailingSuffix +
                suffix;
            }
          },
        });
      },
    });

    return () => st.kill();
  }, [numericValue, prefix, suffix, trailingSuffix]);

  if (numericValue === null) return <span ref={ref}>{target}</span>;

  return (
    <span ref={ref}>
      {prefix}0{trailingSuffix}
      {suffix}
    </span>
  );
};

// ========================================================
// BENEFITS LIST
// ========================================================
const BenefitsList = ({
  benefits,
  inView,
}: {
  benefits: Benefit[];
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
    <div className="space-y-8 md:space-y-12">
      {benefits.map((benefit, index) => (
        <motion.div
          key={index}
          className="relative pb-8 md:pb-12 last:pb-0"
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.2 + index * 0.1,
          }}
        >
          <div className="flex flex-col md:grid md:grid-cols-12 md:gap-8 md:items-center gap-4">
            <div className="md:col-span-2 flex justify-start">
              <benefit.icon className="w-7 h-7 md:w-8 md:h-8 text-white flex-shrink-0" />
            </div>
            <div className="md:col-span-3">
              <p className="text-xs md:text-sm font-medium text-gray-400 uppercase tracking-wider">
                {benefit.label}
              </p>
            </div>
            <div className="md:col-span-7">
              <p className="text-base md:text-lg text-gray-200 leading-relaxed">
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

// ========================================================
// OFFERINGS LIST
// ========================================================
const OfferingsList = ({
  offerings,
  inView,
}: {
  offerings: Offering[];
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
    <div className="space-y-12 md:space-y-16">
      {offerings.map((offering, index) => (
        <motion.div
          key={index}
          className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 lg:gap-16 items-start pb-10 md:pb-12 last:pb-0"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.75,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.1 + index * 0.1,
          }}
        >
          <div>
            <h3 className="text-xs md:text-sm font-semibold text-gray-900 uppercase tracking-wider">
              {offering.title}
            </h3>
          </div>
          <div>
            <p className="text-base md:text-lg text-gray-800 leading-relaxed">
              {offering.description}
            </p>
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

// ========================================================
// BRANDS GRID
// ========================================================
const BrandsGrid = ({
  brands,
  inView,
}: {
  brands: Brand[];
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
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12"
    >
      {brands.map((brand, index) => (
        <div
          key={index}
          className="brand-item opacity-0 flex items-center justify-center py-2"
        >
          <img
            src={brand.logo}
            alt={brand.name}
            className="h-6 md:h-8 w-auto object-contain"
          />
        </div>
      ))}
    </div>
  );
};

// ========================================================
// HAPPY CUSTOMERS GRID
// ========================================================
const HappyCustomersGrid = ({
  customers,
  inView,
}: {
  customers: Customer[];
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

// ========================================================
// MAGNETIC CTA LINK
// ========================================================
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
    if (!btn || "ontouchstart" in window) return;

    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
      gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: "power2.out" });
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
      ref={btnRef}
      href={to}
      className={`will-change-transform ${className ?? ""}`}
    >
      {children}
    </a>
  );
};

// ========================================================
// WHITE SCREEN TRANSITION
// ========================================================
const WhiteScreenTransition = ({ onComplete }: { onComplete: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      yPercent: -105,
      duration: 0.9,
      ease: "power3.inOut",
      delay: 0.2,
      onComplete,
    });
  }, [onComplete]);

  return (
    <div
      ref={ref}
      className="fixed inset-0 bg-white z-[9999] will-change-transform pointer-events-none"
    />
  );
};

// ========================================================
// SECTOR CARD
// ========================================================
const SectorCard = ({ sector }: { sector: Sector }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const img = imgRef.current;
    if (!card || !img || "ontouchstart" in window) return;

    const onEnter = () =>
      gsap.to(img, { scale: 1.07, duration: 0.6, ease: "power2.out" });
    const onLeave = () =>
      gsap.to(img, { scale: 1, duration: 0.6, ease: "power2.out" });

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);

    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl md:rounded-2xl overflow-hidden h-64 md:h-80"
    >
      <img
        ref={imgRef}
        src={sector.image}
        alt={sector.title}
        className="w-full h-full object-cover will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
        <h3 className="text-base md:text-xl font-semibold text-white mb-1 md:mb-2 uppercase tracking-wider">
          {sector.title}
        </h3>
        <p className="text-gray-200 text-xs md:text-sm leading-relaxed">
          {sector.description}
        </p>
      </div>
    </div>
  );
};

// ========================================================
// MAIN PAGE
// ========================================================
const ManufacturingAutomotive = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const handleWhiteScreenComplete = () => setShowWhiteScreen(false);

  // ---- Data ----
  const offerings: Offering[] = [
    {
      title: "CAD & Design Workstations",
      description:
        "High-performance engineering workstations powered by professional graphics cards and multi-core processors for complex CAD, CAM, and PLM applications. Purpose-built systems that handle large assemblies, detailed simulations, and parametric modeling with exceptional performance and stability.",
    },
    {
      title: "AR/VR & Simulation Tools",
      description:
        "Immersive technology platforms for virtual prototyping, assembly line simulation, and training environments. Hardware and software solutions that enable digital twins, virtual commissioning, and interactive design reviews, reducing physical prototyping costs and accelerating time-to-market.",
    },
    {
      title: "Rugged Devices & Connectivity Solutions",
      description:
        "Industrial-grade tablets, laptops, and mobile devices built to withstand harsh manufacturing environments. Dust-resistant, shock-proof, and temperature-tolerant hardware with reliable wireless connectivity for shop floor operations, inventory management, and quality control.",
    },
    {
      title: "Security & Industrial Networking",
      description:
        "Robust network infrastructure and cybersecurity solutions designed for operational technology environments. Secure communication between machines, sensors, and control systems with industrial protocols, firewalls, and intrusion detection for protecting critical manufacturing assets.",
    },
  ];

  const benefits: Benefit[] = [
    {
      icon: Zap,
      label: "FACTORY FLOOR TO DESIGN BOARD",
      description:
        "Comprehensive technology solutions that span the entire manufacturing value chain, from engineering and design through production, quality control, and supply chain management. Integrated systems that drive efficiency across all operations.",
    },
    {
      icon: Settings,
      label: "ADVANCED MANUFACTURING SUPPORT",
      description:
        "Technology infrastructure that enables Industry 4.0 initiatives including IoT sensors, machine learning analytics, predictive maintenance, and automated quality inspection. Smart manufacturing solutions that optimize production and reduce downtime.",
    },
    {
      icon: Network,
      label: "SUPPLY CHAIN AUTOMATION",
      description:
        "Connected systems for real-time inventory tracking, automated logistics, and supply chain visibility. Integration with ERP, MES, and warehouse management systems for seamless material flow and just-in-time manufacturing.",
    },
    {
      icon: Cpu,
      label: "DIGITAL ENGINEERING AT SCALE",
      description:
        "High-performance computing clusters and workstation networks that support concurrent engineering, simulation-driven design, and collaborative product development across global teams and multiple facilities.",
    },
  ];

  const manufacturingSectors: Sector[] = [
    {
      title: "Automotive Manufacturing",
      description: "Design, simulation, and production line automation systems",
      image: "https://i.postimg.cc/zXtcrXq4/minsk.jpg",
    },
    {
      title: "Aerospace & Defense",
      description: "Precision engineering workstations and secure collaboration tools",
      image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80",
    },
    {
      title: "Electronics & Components",
      description: "PCB design, testing equipment, and quality control systems",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    },
    {
      title: "Heavy Equipment & Machinery",
      description: "Rugged computing and industrial IoT infrastructure",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
    },
  ];

  const trustedBrands: Brand[] = [
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
      name: "Cisco",
      logo: "https://bcassetcdn.com/public/blog/wp-content/uploads/2024/06/14155422/image-1.png",
    },
    {
      name: "Unity",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Unity_Technologies_logo.svg/1280px-Unity_Technologies_logo.svg.png",
    },
  ];

  // "Trusted by AR-VR-MR-XR Leaders" customers
  const xrLeaders: Customer[] = [
    {
      name: "Apollo Hospitals",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a1/Larsen%26Toubro_logo.svg/1920px-Larsen%26Toubro_logo.svg.png",
    },
    {
      name: "Fortis Healthcare",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Kone_Logo_2023.svg/3840px-Kone_Logo_2023.svg.png",
    },
    {
      name: "Cipla",
      logo: "https://upload.wikimedia.org/wikipedia/en/b/b8/Rane_Group_Logo.jpg",
    },
    {
      name: "Sun Pharma",
      logo: "https://upload.wikimedia.org/wikipedia/en/d/df/Ashok_Leyland_logo.svg",
    },
  ];

  const stats: StatItem[] = [
    { number: "1800", suffix: "+", label: "Happy Customers" },
    { number: "400",  suffix: "+", label: "Manufacturing Clients" },
    { number: "15",   suffix: "+", label: "Years of Experience" },
  ];

  // ---- Section refs ----
  const heroRef    = useRef(null);
  const offerRef   = useRef(null);
  const benRef     = useRef(null);
  const sectorsRef = useRef(null);
  const statsRef   = useRef(null);
  const brandsRef  = useRef(null);
  const xrRef      = useRef(null);
  const ctaRef     = useRef(null);

  const heroInView    = useInView(heroRef,    { once: true, margin: "-60px" });
  const offerInView   = useInView(offerRef,   { once: true, margin: "-60px" });
  const benInView     = useInView(benRef,     { once: true, margin: "-60px" });
  const sectorsInView = useInView(sectorsRef, { once: true, margin: "-60px" });
  const statsInView   = useInView(statsRef,   { once: true, margin: "-60px" });
  const brandsInView  = useInView(brandsRef,  { once: true, margin: "-60px" });
  const xrInView      = useInView(xrRef,      { once: true, margin: "-60px" });
  const ctaInView     = useInView(ctaRef,     { once: true, margin: "-100px" });

  // ---- GSAP: Hero heading word-stagger ----
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = heroHeadingRef.current;
    if (!el) return;
    gsap.fromTo(
      el.querySelectorAll(".ma-word"),
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

  // ---- GSAP: Hero image scale-on-scroll (Page 1 style) ----
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

  // ---- GSAP: CTA heading word stagger ----
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

  // ---- GSAP: XR Leaders heading word stagger ----
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

  // ---- GSAP: Sector cards stagger ----
  const sectorGridRef   = useRef<HTMLDivElement>(null);
  const sectorTriggered = useRef(false);
  useEffect(() => {
    if (!sectorsInView || sectorTriggered.current) return;
    sectorTriggered.current = true;
    const cards = sectorGridRef.current?.querySelectorAll(".sector-card");
    if (!cards) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.12 }
    );
  }, [sectorsInView]);

  // ---- Marquee data ----
  const marqueeItems  = ["Manufacturing & Automotive", "CAD Workstations", "Industry 4.0", "Digital Engineering", "Factory Automation", "Rugged Devices"];
  const marqueeItems2 = ["Autodesk", "NVIDIA RTX", "Cisco", "AR/VR Simulation", "Industrial IoT", "Supply Chain", "Smart Factories"];
  const marqueeItems3 = ["Optimize Your Operations", "Engineering Excellence", "Industry 4.0", "Sniper Systems", "Digital Innovation"];

  const heroWords: (string | React.ReactElement)[] = [
    "Driving", "Efficiency", "with", <br key="br" />, "Rugged,", "Scalable", "Tech",
  ];

  const ctaWords: (string | React.ReactElement)[] = [
    "Ready", "to", "optimize", <br key="br1" />, "your", "operations?",
    <br key="br2" />, "Let's", "innovate", "together",
  ];

  return (
    <Layout>
      {showWhiteScreen && (
        <WhiteScreenTransition onComplete={handleWhiteScreenComplete} />
      )}

      {/* ==================== HERO (Page 1 style) ==================== */}
      <section className="relative bg-white pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-white opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16" ref={heroRef}>
            <h1
              ref={heroHeadingRef}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight font-sans"
              aria-label="Driving Efficiency with Rugged, Scalable Tech"
            >
              {heroWords.map((word, i) =>
                typeof word !== "string" ? (
                  word
                ) : (
                  <span
                    key={i}
                    className="ma-word inline-block opacity-0 mr-[0.2em] sm:mr-[0.22em] lg:mr-[0.25em] last:mr-0"
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
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.6 }}
            >
              Whether on the factory floor or the design board, our solutions support advanced
              manufacturing, supply chain automation, and automotive innovation. We help streamline
              operations and support digital engineering at scale.
            </motion.p>
          </div>

          {/* Hero image — Page 1 scale-on-scroll */}
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
                src="https://i.postimg.cc/5yp880PW/industrial.jpg"
                alt="Manufacturing Technology"
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-3 sm:left-4 lg:left-6 z-10">
                <div className="bg-black bg-opacity-50 text-white px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full backdrop-blur-sm">
                  <span className="text-[10px] sm:text-xs lg:text-sm font-medium tracking-wide">
                    MANUFACTURING & AUTOMOTIVE
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee 1 */}
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
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              Powering Industry 4.0
              <br />
              transformation
            </motion.h2>
          </div>
          <BenefitsList benefits={benefits} inView={benInView} />
        </div>
      </motion.section>

      {/* Marquee 2 */}
      <MarqueeTicker items={marqueeItems2} speed={30} reverse />

      {/* ==================== MANUFACTURING SECTORS ==================== */}
      <section className="bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={sectorsRef}>
          <div className="mb-8 sm:mb-10 lg:mb-16">
            <motion.h2
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={sectorsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              Serving diverse
              <br />
              manufacturing sectors
            </motion.h2>
            <div className="w-full h-px bg-gray-300 mt-6 sm:mt-8" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 mb-10 sm:mb-14 lg:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={sectorsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-tight">
                FROM DESIGN TO
                <br />
                PRODUCTION LINE
              </h3>
            </motion.div>
            <motion.div
              className="space-y-3 sm:space-y-4 lg:space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={sectorsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <p className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed">
                We serve manufacturers across automotive, aerospace, electronics, and heavy
                machinery sectors with technology solutions that drive operational efficiency,
                product quality, and innovation. From CAD workstations to factory floor systems,
                we support the complete manufacturing ecosystem.
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed">
                Our manufacturing solutions enable smart factories with IoT connectivity,
                predictive analytics, and automation that optimize production, reduce waste,
                and accelerate time-to-market while maintaining the highest standards of
                quality and safety.
              </p>
            </motion.div>
          </div>

          <div
            ref={sectorGridRef}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-8"
          >
            {manufacturingSectors.map((sector, index) => (
              <div key={index} className="sector-card opacity-0">
                <SectorCard sector={sector} />
              </div>
            ))}
          </div>
        </div>
      </section>

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
              Powering Manufacturing
              <br />
              Across India
            </motion.h2>
            <div className="w-full h-px bg-gray-300" />
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-16 w-full lg:w-auto">
              {stats.map((stat, i) => (
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

      {/* Marquee 3 */}
      <MarqueeTicker items={marqueeItems3} speed={22} />

      {/* ==================== TRUSTED BY AR-VR-MR-XR LEADERS ==================== */}
      <motion.section
        ref={xrRef}
        className="bg-black text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 rounded-[1.5rem] sm:rounded-[2.5rem] lg:rounded-[4rem] mx-3 sm:mx-4 lg:mx-6 my-6 sm:my-8 lg:my-12 overflow-hidden"
        initial={{ opacity: 0, y: 60 }}
        animate={xrInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <div className="overflow-hidden mb-4 sm:mb-6">
              <h2
                ref={xrHeadingRef}
                className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight"
                aria-label="Trusted by AR-VR-MR-XR Leaders"
              >
                {[
                  "Trusted",
                  "by",
                  <br key="br" />,
                  "Manufacturing Automotive",
                  "Leaders",
                ].map((word, i) =>
                  typeof word !== "string" ? (
                    word
                  ) : (
                    <span
                      key={i}
                      className="xr-word inline-block opacity-0 mr-[0.2em] sm:mr-[0.22em] lg:mr-[0.25em] last:mr-0"
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
                animate={xrInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.2, delay: 0.5 }}
              />
            </div>
          </div>

          {/* Sub-copy */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 mb-10 sm:mb-14 lg:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={xrInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <h3 className="text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-400 uppercase tracking-wider leading-snug">
                ORGANIZATIONS
                <br />
                ACROSS INDIA
              </h3>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={xrInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            >
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
                From large hospital chains to emerging biotech startups, our XR solutions are deployed
                across India's most respected healthcare and pharmaceutical organizations—helping them
                deliver better care through better technology.
              </p>
            </motion.div>
          </div>

          {/* Logo grid */}
          <HappyCustomersGrid customers={xrLeaders} inView={xrInView} />

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
              aria-label="Ready to optimize your operations? Let's innovate together"
            >
              {ctaWords.map((word, i) =>
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
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          >
            <MagneticCTALink
              to="/contact"
              className="inline-flex items-center px-6 sm:px-8 lg:px-12 py-3 sm:py-3.5 lg:py-4 border-2 border-white rounded-full text-white font-medium text-sm sm:text-base lg:text-lg hover:bg-white hover:text-black transition-colors duration-300 active:scale-95"
            >
              GET STARTED
            </MagneticCTALink>
          </motion.div>
        </div>
      </motion.section>

      {/* ==================== SCROLL TO TOP ==================== */}
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

export default ManufacturingAutomotive;
