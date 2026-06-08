import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Box, Cloud, Layers, Zap } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

// ========================================================
// ORBITAL RINGS
// ========================================================
const OrbitalRings = () => (
  <div className="absolute inset-0 bg-black overflow-hidden">
    <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-purple-500/10 rounded-full blur-3xl" />
    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-cyan-500/10 rounded-full blur-3xl" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] md:w-[700px] md:h-[700px] lg:w-[900px] lg:h-[900px]">
      <div className="absolute inset-0 animate-[spin_20s_linear_infinite]">
        <div className="absolute inset-0 rounded-full border border-white/60 sm:border-2 blur-sm" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-purple-400 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
      </div>
      <div className="absolute inset-8 animate-[spin_15s_linear_infinite_reverse]">
        <div className="absolute inset-0 rounded-full border border-white/60 sm:border-2 blur-sm" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
      </div>
      <div className="absolute inset-16 animate-[spin_12s_linear_infinite]">
        <div className="absolute inset-0 rounded-full border border-white/60 sm:border-2 blur-[2px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-pink-400 rounded-full shadow-[0_0_18px_rgba(244,114,182,0.9)]" />
      </div>
      <div className="absolute inset-24 animate-[spin_9s_linear_infinite_reverse]">
        <div className="absolute inset-0 rounded-full border border-white/60 sm:border-2 blur-[1px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full shadow-[0_0_12px_rgba(96,165,250,0.9)]" />
      </div>
      <div className="absolute inset-32 animate-[spin_7s_linear_infinite]">
        <div className="absolute inset-0 rounded-full border border-white/60 sm:border-2 blur-[1px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-violet-400 rounded-full shadow-[0_0_10px_rgba(167,139,250,1)]" />
      </div>
      <div className="absolute inset-40 animate-[spin_5s_linear_infinite_reverse]">
        <div className="absolute inset-0 rounded-full border border-white/60 sm:border-2" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-fuchsia-400 rounded-full shadow-[0_0_15px_rgba(232,121,249,1)]" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl" />
        <div className="absolute w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-xl" />
        <div className="absolute w-5 h-5 sm:w-8 sm:h-8 bg-white/50 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.5)]" />
      </div>
    </div>
  </div>
);

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
      <div
        ref={trackRef}
        className="flex gap-6 sm:gap-8 lg:gap-10 whitespace-nowrap will-change-transform"
      >
        {doubled.map((text, i) => (
          <span
            key={i}
            className="flex items-center gap-6 sm:gap-8 lg:gap-10 text-[9px] sm:text-[10px] lg:text-[11px] font-semibold tracking-[0.16em] sm:tracking-[0.18em] lg:tracking-[0.22em] uppercase text-gray-500"
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

// ---- Benefits List with GSAP line-draw dividers ----
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
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 + index * 0.1 }}
        >
          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-12 sm:gap-8 sm:items-center">
            <div className="flex items-center gap-3 sm:contents">
              <div className="sm:col-span-2 flex-shrink-0">
                <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="sm:col-span-3">
                <p className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-400 uppercase tracking-wider leading-tight">
                  {benefit.label}
                </p>
              </div>
            </div>
            <div className="sm:col-span-7 pl-9 sm:pl-0">
              <p className="text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          </div>
          {index < benefits.length - 1 && (
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

// ---- Offerings List with GSAP line-draw dividers ----
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
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.1 + index * 0.1 }}
        >
          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-1 lg:grid-cols-2 sm:gap-6 lg:gap-16 items-start">
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-snug">
                {offering.title}
              </h3>
            </div>
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <p className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed">
                {offering.description}
              </p>
            </div>
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
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: { amount: 0.7, from: "random" } }
    );
  }, [inView]);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12"
    >
      {brands.map((brand, index) => (
        <div
          key={index}
          className="brand-item opacity-0 flex items-center justify-center py-2 transition-all duration-300"
        >
          <img src={brand.logo} alt={brand.name} className="h-5 sm:h-6 lg:h-8 object-contain" />
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
  const isTouchDevice = useRef(false);

  useEffect(() => {
    isTouchDevice.current = window.matchMedia("(hover: none)").matches;
    const btn = btnRef.current;
    if (!btn || isTouchDevice.current) return;
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
    <Link
      ref={btnRef as any}
      to={to}
      className={`will-change-transform ${className ?? ""}`}
      onMouseEnter={onMouseEnter}
    >
      {children}
    </Link>
  );
};

// ========================================================
// CTA SECTION
// ========================================================
const CTASection = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [displayPosition, setDisplayPosition] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const ctaRef = useRef<HTMLElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const velocity = useRef({ x: 0, y: 0 });

  const ctaHeadingRef = useRef<HTMLHeadingElement>(null);
  const ctaInView = useInView(ctaRef as any, { once: true, margin: "-100px" });

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(hover: none)").matches);
  }, []);

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

  const lerp = (start: number, end: number, factor: number) =>
    start + (end - start) * factor;

  const animateCursor = useCallback(() => {
    if (!cursorVisible) return;
    const smoothFactor = isHoveringButton ? 0.2 : 0.1;
    setDisplayPosition((prev) => {
      const newX = lerp(prev.x, cursorPosition.x, smoothFactor);
      const newY = lerp(prev.y, cursorPosition.y, smoothFactor);
      velocity.current.x = newX - prev.x;
      velocity.current.y = newY - prev.y;
      return { x: newX, y: newY };
    });
    animationFrameRef.current = requestAnimationFrame(animateCursor);
  }, [cursorVisible, cursorPosition, isHoveringButton]);

  useEffect(() => {
    if (isTouchDevice) return;
    const section = sectionRef.current;
    if (!section) return;

    const handleMouseEnter = () => {
      setCursorVisible(true);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = requestAnimationFrame(animateCursor);
    };
    const handleMouseLeave = () => {
      setCursorVisible(false);
      setIsHoveringButton(false);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    section.addEventListener("mouseenter", handleMouseEnter);
    section.addEventListener("mouseleave", handleMouseLeave);
    section.addEventListener("mousemove", handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(animateCursor);

    return () => {
      section.removeEventListener("mouseenter", handleMouseEnter);
      section.removeEventListener("mouseleave", handleMouseLeave);
      section.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [animateCursor, isTouchDevice]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <>
      {!isTouchDevice && (
        <>
          <div
            className={`fixed pointer-events-none z-50 flex items-center justify-center rounded-full font-bold text-xs sm:text-sm transition-all duration-150 ease-out ${
              cursorVisible ? "opacity-100" : "opacity-0"
            } ${
              isHoveringButton
                ? "w-24 h-24 sm:w-32 sm:h-32 bg-white text-black"
                : "w-20 h-20 sm:w-24 sm:h-24 bg-white text-black"
            }`}
            style={{
              left: `${displayPosition.x}px`,
              top: `${displayPosition.y}px`,
              transform: `translate(-50%, -50%) ${
                cursorVisible ? (isHoveringButton ? "scale(1.3)" : "scale(1)") : "scale(0.5)"
              }`,
              transition: cursorVisible
                ? "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.3s ease, height 0.3s ease"
                : "all 0.3s ease",
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.25))",
            }}
          >
            {isHoveringButton ? "CLICK ME!" : "LET'S GO!"}
          </div>

          <div
            className={`fixed pointer-events-none z-40 rounded-full transition-all duration-300 ease-out ${
              cursorVisible ? "opacity-30" : "opacity-0"
            } ${
              isHoveringButton
                ? "w-16 h-16 sm:w-20 sm:h-20 bg-white/30"
                : "w-12 h-12 sm:w-16 sm:h-16 bg-white/20"
            }`}
            style={{
              left: `${displayPosition.x - velocity.current.x * 0.5}px`,
              top: `${displayPosition.y - velocity.current.y * 0.5}px`,
              transform: "translate(-50%, -50%)",
              transition: "left 0.1s linear, top 0.1s linear",
            }}
          />
        </>
      )}

      <motion.section
        ref={(el) => {
          sectionRef.current = el;
          ctaRef.current = el;
        }}
        className={`relative bg-black text-white py-14 sm:py-16 lg:py-20 px-4 sm:px-6 rounded-[1.5rem] sm:rounded-[2.5rem] lg:rounded-[4rem] mx-3 sm:mx-4 lg:mx-6 my-6 sm:my-8 lg:my-12 overflow-hidden ${
          !isTouchDevice ? "cursor-none" : ""
        }`}
        initial={{ opacity: 0, y: 60 }}
        animate={ctaInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="hidden sm:block">
          <OrbitalRings />
        </div>
        <div className="block sm:hidden absolute inset-0 bg-black">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-2">
          <div className="mb-8 sm:mb-10 lg:mb-12 overflow-hidden">
            <h2
              ref={ctaHeadingRef}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold mb-4 sm:mb-6 leading-tight text-white"
              aria-label="Ready to build the future? Let's connect"
            >
              {["Ready", "to", "build", "the", "future?", "Let's", "connect"].map((word, i) => (
                <span
                  key={i}
                  className="cta-word inline-block opacity-0 mr-[0.15em] sm:mr-[0.18em] lg:mr-[0.22em] last:mr-0"
                >
                  {word}
                  {word === "future?" ? <br /> : null}
                </span>
              ))}
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          >
            <MagneticCTALink
              to="/contact"
              className="inline-flex items-center px-6 sm:px-8 lg:px-12 py-3 sm:py-3.5 lg:py-4 border-2 border-white rounded-full text-white font-medium text-sm sm:text-base lg:text-lg hover:bg-white hover:text-black transition-colors duration-300 relative z-10 active:scale-95"
              onMouseEnter={() => setIsHoveringButton(true)}
              onMouseLeave={() => setIsHoveringButton(false)}
            >
              GET STARTED
              <span className="absolute inset-[-10px] rounded-full" />
            </MagneticCTALink>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
};

// ========================================================
// WHITE SCREEN TRANSITION
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
    <div ref={ref} className="fixed inset-0 bg-white z-[9999] will-change-transform pointer-events-none" />
  );
};

// ========================================================
// AEC PAGE
// ========================================================
const AEC = () => {
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
      title: "CAD/BIM Workstations & Laptops",
      description:
        "High-performance workstations and laptops engineered for demanding CAD and BIM applications. Purpose-built for architects and engineers who require reliable computing power for complex 3D modeling and rendering tasks.",
    },
    {
      title: "Design & Visualization Software",
      description:
        "Industry-leading software solutions from Autodesk, Adobe, and Unity. Complete toolsets for architectural design, structural engineering, 3D visualization, and immersive presentations that bring your projects to life.",
    },
    {
      title: "Cloud Storage & Project Collaboration Tools",
      description:
        "Secure cloud infrastructure and collaboration platforms that enable seamless project coordination across distributed teams. Access your designs and documents anywhere, anytime, with enterprise-grade security.",
    },
    {
      title: "Large Format Monitors & Displays",
      description:
        "Professional-grade displays with exceptional color accuracy and resolution for detailed design work. Experience your projects in stunning clarity with monitors optimized for CAD, BIM, and visualization workflows.",
    },
  ];

  const benefits = [
    {
      icon: Zap,
      label: "HIGH-PERFORMANCE DESIGN TOOLS",
      description:
        "Purpose-built workstations powered by NVIDIA professional graphics and Intel processors deliver the performance your design teams demand for complex modeling and simulation tasks.",
    },
    {
      icon: Layers,
      label: "STREAMLINED WORKFLOWS",
      description:
        "Integrated solutions that connect design, collaboration, and visualization tools into cohesive workflows, reducing friction and accelerating project timelines from concept to completion.",
    },
    {
      icon: Cloud,
      label: "REMOTE PROJECT EXECUTION",
      description:
        "Cloud-enabled infrastructure and secure remote access solutions ensure your teams can collaborate effectively from anywhere, maintaining productivity across distributed work environments.",
    },
    {
      icon: Box,
      label: "BIM & 3D MODELING EXPERTISE",
      description:
        "Specialized hardware and software configurations optimized for Building Information Modeling and advanced 3D modeling applications, ensuring smooth operation even with the largest project files.",
    },
  ];

  const trustedBrands = [
    { name: "Apple",     logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
    { name: "NVIDIA",    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a4/NVIDIA_logo.svg" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1280px-Microsoft_logo.svg.png" },
    { name: "Lenovo",    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Lenovo_%282015%29.svg" },
    { name: "Autodesk",  logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/Autodesk_Logo_2021.svg" },
    { name: "Unreal",    logo: "https://upload.wikimedia.org/wikipedia/commons/d/da/Unreal_Engine_Logo.svg" },
    { name: "Adobe",     logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Adobe_Corporate_wordmark.svg" },
    { name: "HP",        logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/HP_logo_2025.svg" },
  ];

  const happyCustomers = [
    { name: "L&T",              logo: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Larsen_%26_Toubro_logo.svg" },
    { name: "Shapoorji Pallonji", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg" },
    { name: "Godrej Properties", logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Rockstar_Games_Logo.svg" },
    { name: "Tata Projects",     logo: "https://i.postimg.cc/rddKpVPc/brand-horizontal.png" },
  ];

  // ── Section refs ──
  const heroRef   = useRef(null);
  const offerRef  = useRef(null);
  const benRef    = useRef(null);
  const statsRef  = useRef(null);
  const brandsRef = useRef(null);
  const custRef   = useRef(null);

  const heroInView   = useInView(heroRef,   { once: true, margin: "-60px" });
  const offerInView  = useInView(offerRef,  { once: true, margin: "-60px" });
  const benInView    = useInView(benRef,    { once: true, margin: "-60px" });
  const statsInView  = useInView(statsRef,  { once: true, margin: "-60px" });
  const brandsInView = useInView(brandsRef, { once: true, margin: "-60px" });
  const custInView   = useInView(custRef,   { once: true, margin: "-60px" });

  // ── GSAP: Hero heading word-stagger ──
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = heroHeadingRef.current;
    if (!el) return;
    const words = el.querySelectorAll(".aec-word");
    gsap.fromTo(
      words,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.07, delay: 1.2 }
    );
  }, []);

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

  // ── GSAP: Trusted by AEC Leaders heading word-stagger ──
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

  const marqueeItems = [
    "AEC Solutions", "CAD/BIM", "Architecture", "Engineering", "Construction", "3D Modeling", "BIM Expertise",
  ];
  const marqueeItems2 = [
    "Autodesk", "NVIDIA", "Adobe", "Unity", "Cloud Collaboration", "Design Workstations", "Remote Execution",
  ];
  const marqueeItems3 = [
    "Build the Future", "AEC Excellence", "Design with Precision", "Engineering Innovation", "Sniper Systems",
  ];

  return (
    <Layout>
      {showWhiteScreen && (
        <WhiteScreenTransition onComplete={() => setShowWhiteScreen(false)} />
      )}

      {/* ==================== HERO ==================== */}
      <section className="relative bg-white pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-white opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16" ref={heroRef}>
            <h1
              ref={heroHeadingRef}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight font-sans"
              aria-label="Building Tomorrow with Precision IT"
            >
              {["Building", "Tomorrow", "with", "Precision", "IT"].map((word, i) => (
                <span
                  key={i}
                  className="aec-word inline-block opacity-0 mr-[0.2em] sm:mr-[0.22em] lg:mr-[0.25em] last:mr-0"
                >
                  {word}
                  {word === "Tomorrow" ? <br /> : null}
                </span>
              ))}
            </h1>

            <motion.p
              className="text-sm sm:text-base lg:text-xl text-gray-700 max-w-5xl mx-auto leading-relaxed px-1 sm:px-4 lg:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.6 }}
            >
              Sniper Systems & Solutions empowers AEC firms with high-performance design tools,
              workstations, and collaboration platforms that streamline workflows, boost creativity,
              and support remote project execution. Whether it's BIM, 3D modeling, or simulation,
              our solutions are built for architects, engineers, and builders shaping the future.
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
                src="https://i.postimg.cc/pTBnNyXb/building-business-city-construction-geometry.jpg"
                alt="Architecture and Engineering"
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-3 sm:left-4 lg:left-6 z-10">
                <div className="bg-black bg-opacity-50 text-white px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full backdrop-blur-sm">
                  <span className="text-[10px] sm:text-xs lg:text-sm font-medium tracking-wide">
                    AEC SOLUTIONS
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
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              Why Choose
              <br />
              Our AEC Solutions
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
              Powering AEC Firms
              <br />
              Across India
            </motion.h2>
            <div className="w-full h-px bg-gray-300" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 mb-10 sm:mb-14 lg:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-snug">
                EMPOWERING ARCHITECTS,
                <br />
                ENGINEERS & BUILDERS
              </h3>
            </motion.div>
            <motion.div
              className="space-y-3 sm:space-y-4 lg:space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <p className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed">
                From small architectural studios to large engineering firms, we provide the technology
                infrastructure that enables creative teams to push boundaries and deliver exceptional projects.
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed">
                Our AEC solutions combine cutting-edge hardware, professional software, and cloud
                collaboration tools to create an ecosystem where innovation thrives and projects come
                to life with unprecedented efficiency.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-16">
            {[
              { number: "1800", suffix: "+", label: "Happy Customers" },
              { number: "500",  suffix: "+", label: "AEC Firms Served" },
              { number: "15",   suffix: "+", label: "Years of Experience" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 40 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 + i * 0.1 }}
              >
                <div className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl text-gray-900 mb-1.5 sm:mb-2 font-semibold">
                  <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                </div>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg">{stat.label}</p>
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

      {/* ==================== TRUSTED BY AEC LEADERS ==================== */}
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
                aria-label="Trusted by AEC Leaders"
              >
                {["Trusted", "by", <br key="br" />, "AEC", "Leaders"].map(
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
              animate={custInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            >
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
                From large infrastructure conglomerates to boutique architectural studios, our solutions
                are deployed across India's most respected AEC organizations—helping them design,
                build, and deliver outstanding projects through better technology.
              </p>
            </motion.div>
          </div>

          {/* Logo grid */}
          <HappyCustomersGrid customers={happyCustomers} inView={custInView} />
        </div>
      </motion.section>

      <CTASection />

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

export default AEC;
