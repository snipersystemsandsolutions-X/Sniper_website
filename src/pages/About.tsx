import Lottie from "@/components/CustomerService";
import { Layout } from "@/components/Layout";
import Lottiee from "@/components/people";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, CheckCircle, Shield, Users } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import React, { useEffect, useRef, useState } from "react";


gsap.registerPlugin(ScrollTrigger);

// ─── Easing preset ───────────────────────────────────────
const ease = [0.16, 1, 0.3, 1] as const;

// ========================================================
// ✦ WHITE SCREEN TRANSITION
// ========================================================
const WhiteScreenTransition = ({ onComplete }: { onComplete: () => void }) => (
  <motion.div
    className="fixed inset-0 bg-white z-[9999] pointer-events-none"
    initial={{ y: 0 }}
    animate={{ y: "-105%" }}
    transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
    onAnimationComplete={onComplete}
  />
);

// ========================================================
// ✦ FADE-UP WRAPPER
// ========================================================
const FadeUp = ({
  children,
  delay = 0,
  className = "",
  once = true,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </motion.div>
  );
};

// ========================================================
// ✦ GSAP: Animated Counter
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
      trigger: el,
      start: "top 85%",
      onEnter: () => {
        if (triggered.current) return;
        triggered.current = true;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: numericValue,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            if (el)
              el.textContent =
                prefix +
                (Number.isInteger(numericValue)
                  ? Math.round(obj.val).toLocaleString()
                  : obj.val.toFixed(1)) +
                suffix;
          },
        });
      },
    });
    return () => st.kill();
  }, [numericValue, prefix, suffix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
};

// ========================================================
// ✦ GSAP: Parallax Image
// ========================================================
const ParallaxImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
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
        scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: 1 },
      }
    );
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className ?? ""}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover scale-110"
        style={{ willChange: "transform" }}
      />
    </div>
  );
};

// ========================================================
// ✦ GSAP: Sticky Hero Stage (anime.js-style scroll-driven object)
// ========================================================
const HeroStage = () => {
  const wrapRef = useRef<HTMLDivElement>(null);   // tall scroll-distance container
  const stageRef = useRef<HTMLDivElement>(null);  // sticky stage
  const imgWrapRef = useRef<HTMLDivElement>(null); // animated object

  useEffect(() => {
    const wrap = wrapRef.current;
    const imgWrap = imgWrapRef.current;
    if (!wrap || !imgWrap) return;

    const tween = gsap.fromTo(
      imgWrap,
      { scale: 0.78, borderRadius: "3rem", yPercent: 6 },
      {
        scale: 1,
        borderRadius: "1.25rem",
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      }
    );
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);

  return (
    // Tall wrapper creates the scroll "runway" — controls how long the object stays pinned/animating
   <div ref={wrapRef} className="relative h-[120vh] sm:h-[130vh]">
      {/* Sticky stage — keeps the object visually centered/anchored on screen */}
      <div
        ref={stageRef}
        className="sticky top-1 flex items-center justify-center px-2 sm:px-2"
      >
        <div
          ref={imgWrapRef}
          className="relative w-full max-w-6xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl overflow-hidden h-60 sm:h-96 md:h-[500px] lg:h-[600px]"
          style={{ willChange: "transform, border-radius", transformOrigin: "center center" }}
        >
          <ParallaxImage
            src="https://i.postimg.cc/Pq2w9g4x/About-Us-Page.webp"
            alt="Team Collaboration"
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

// ========================================================
// ✦ GSAP: Marquee Ticker
// ========================================================
const MarqueeTicker = () => {
  const items = ["IT Solutions", "Cloud Services", "Digital Transformation", "Quick Support", "World-Class Engineering"];
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden bg-gray-950 py-4 sm:py-5 border-y border-gray-800">
      <div className="flex gap-10 whitespace-nowrap animate-marquee">
        {doubled.map((text, i) => (
          <span
            key={i}
            className="flex items-center gap-10 text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase text-gray-400"
          >
            {text}
            <span className="w-1.5 h-1.5 rounded-full bg-gray-600 inline-block" />
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .animate-marquee { animation: marquee 24s linear infinite; }
      `}</style>
    </div>
  );
};

// ========================================================
// ✦ GSAP: Process Steps with line-draw dividers
// ========================================================
const ProcessSteps = ({
  process,
}: {
  process: { number: string; title: string; description: string }[];
}) => {
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    linesRef.current.forEach((line, i) => {
      if (!line) return;
      gsap.fromTo(
        line,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 0.9, ease: "power3.out", delay: 0.35 + i * 0.12 }
      );
    });
  }, [inView]);

  return (
    <div ref={sectionRef} className="space-y-8 sm:space-y-12">
      {process.map((step, index) => (
        <motion.div
          key={index}
          className="relative pb-8 sm:pb-12 last:pb-0"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.2 + index * 0.1 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-8 items-start sm:items-center">
            <div className="sm:col-span-2">
              <span className="text-3xl sm:text-5xl font-semibold text-white block">{step.number}</span>
            </div>
            <div className="sm:col-span-3">
              <h3 className="text-lg sm:text-xl font-semibold text-white">{step.title}</h3>
            </div>
            <div className="sm:col-span-7">
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">{step.description}</p>
            </div>
          </div>
          {index < process.length - 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-700 overflow-hidden">
              <div
                ref={(el) => { linesRef.current[index] = el; }}
                className="h-full bg-gradient-to-r from-white/40 via-white/80 to-white/40"
                style={{ transform: "scaleX(0)", transformOrigin: "left center", willChange: "transform" }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// ========================================================
// ✦ Stat Card
// ========================================================
const StatCard = ({
  icon: Icon,
  number,
  suffix,
  label,
  staticText,
  delay,
}: {
  icon: React.ElementType;
  number?: string | null;
  suffix?: string;
  label: string;
  staticText?: string;
  delay: number;
}) => (
  <FadeUp delay={delay} className="text-center">
    <div className="flex justify-center mb-3 sm:mb-4">
      <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-900" />
    </div>
    <div className="text-4xl sm:text-5xl md:text-6xl text-gray-900 mb-2 font-semibold">
      {staticText ? staticText : <AnimatedCounter target={number!} suffix={suffix} />}
    </div>
    <p className="text-gray-600 text-base sm:text-lg">{label}</p>
  </FadeUp>
);

// ========================================================
// ✦ FAQ Item
// ========================================================
const FaqItem = ({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: { question: string; answer: string };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className="border-b border-gray-700 pb-4 sm:pb-6 last:border-0">
    <button
      onClick={onToggle}
      className="w-full text-left flex items-center justify-between py-1 group"
    >
      <h3 className="text-base sm:text-lg text-white font-medium pr-6 sm:pr-8 leading-relaxed group-hover:text-gray-300 transition-colors">
        {faq.question}
      </h3>
      <motion.div
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0"
      >
        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </motion.div>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="answer"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.32, ease }}
          className="overflow-hidden"
        >
          <p className="mt-3 sm:mt-4 text-gray-300 text-sm sm:text-base leading-relaxed">
            {faq.answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// ========================================================
// ✦ Orbital Rings
// ========================================================
const OrbitalRings = () => (
  <div className="absolute inset-0 bg-black overflow-hidden">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] md:w-[1000px] md:h-[1000px]">
      <div className="absolute inset-0 animate-[spin_20s_linear_infinite]">
        <div className="absolute inset-0 rounded-full border-2 border-white blur-sm" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-purple-400 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
      </div>
      <div className="absolute inset-8 animate-[spin_15s_linear_infinite_reverse]">
        <div className="absolute inset-0 rounded-full border-2 border-white blur-sm" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
      </div>
      <div className="absolute inset-16 animate-[spin_12s_linear_infinite]">
        <div className="absolute inset-0 rounded-full border-2 border blur-[2px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-pink-400 rounded-full shadow-[0_0_18px_rgba(244,114,182,0.9)]" />
      </div>
      <div className="absolute inset-24 animate-[spin_9s_linear_infinite_reverse]">
        <div className="absolute inset-0 rounded-full border-2 border blur-[1px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_12px_rgba(96,165,250,0.9)]" />
      </div>
      <div className="absolute inset-32 animate-[spin_7s_linear_infinite]">
        <div className="absolute inset-0 rounded-full border-2 border blur-[1px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-violet-400 rounded-full shadow-[0_0_10px_rgba(167,139,250,1)]" />
      </div>
      <div className="absolute inset-40 animate-[spin_5s_linear_infinite_reverse]">
        <div className="absolute inset-0 rounded-full border-2 border" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-fuchsia-400 rounded-full shadow-[0_0_15px_rgba(232,121,249,1)]" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl" />
        <div className="absolute w-16 h-16 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-xl" />
        <div className="absolute w-8 h-8 bg-white/50 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.5)]" />
      </div>
    </div>
  </div>
);

// ========================================================
// ✦ CTA Section
// ========================================================
const CTASection = () => {
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ctaRef}
      className="relative bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12 overflow-hidden"
      initial={{ opacity: 0, y: 60 }}
      animate={ctaInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease }}
    >
      <div className="hidden sm:block"><OrbitalRings /></div>
      <div className="block sm:hidden absolute inset-0 bg-black">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
        >
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold mb-6 leading-tight text-white">
            Ready to<br />transform<br />your business?
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.4 }}
        >
          <a
            href="/contact"
            className="inline-flex items-center px-8 sm:px-12 py-3 sm:py-4 border-2 border-white rounded-full text-white font-medium text-base sm:text-lg hover:bg-white hover:text-black transition-colors duration-300"
          >
            TELL US
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
};

// ========================================================
// ✦ WHY CHOOSE US — GSAP Pinned Horizontal Scroll
//
//   How it works:
//   1. outerRef is the ScrollTrigger "trigger" element.
//   2. GSAP pins outerRef at the top of the viewport.
//   3. While it's pinned, scrolling translates the card
//      stripRef to the LEFT (so cards appear to move RIGHT
//      as you scroll down).
//   4. The pin is released once the last card is fully visible.
//   5. gsap.context() scopes all tweens for clean cleanup.
// ========================================================
// ========================================================
// ✦ WHY CHOOSE US — GSAP Pinned Horizontal Scroll
// ========================================================
const WhyChooseUsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);

  const cards = [
    {
      img: "https://i.postimg.cc/2SYW8sC0/sales.jpg",
      title: "Dedicated Customer Support",
      description: "Personalized assistance and a seamless experience for every client, available around the clock.",
    },
    {
      img: "https://i.postimg.cc/NMDJp6pr/people-office.jpg",
      title: "Smart IT Solutions",
      description: "Innovative technology and streamlined processes that improve efficiency across your entire business.",
    },
    {
      img: "https://i.postimg.cc/h4s7N1N7/cybersecurity-professional-work.jpg",
      title: "Robust Cybersecurity",
      description: "Enterprise-grade protection that shields your data, infrastructure, and people from evolving threats.",
    },
    {
      img: "https://i.postimg.cc/260svtXD/concept.jpg",
      title: "Cloud-First Architecture",
      description: "Scalable, resilient cloud environments tailored to your workloads for speed and cost efficiency.",
    },
    {
      img: "https://i.postimg.cc/YCs6ZzGz/diverse-business-experts-sharing-ideas-corporate-growth-planning.jpg",
      title: "Expert Engineering Team",
      description: "A world-class team of engineers with deep domain expertise ready to tackle your toughest challenges.",
    },

  ];


     // Jotform Chatbot
  useEffect(() => {
    const script = document.createElement("script");

    script.src =
      "https://cdn.jotfor.ms/agent/embedjs/019f2165e4c6756899b7d476e73c18bd40b3/embed.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const cardsContainer = cardsContainerRef.current;
    const cardsWrapper = cardsWrapperRef.current;

    if (!section || !cardsContainer || !cardsWrapper) return;

    // Calculate the total scroll distance
    const getScrollDistance = () => {
      const containerWidth = cardsWrapper.scrollWidth;
      const viewportWidth = cardsContainer.offsetWidth;
      return containerWidth - viewportWidth;
    };

    // Create ScrollTrigger
    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${getScrollDistance()}`,
      pin: true,
      anticipatePin: 1,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Move cards from right to left based on scroll progress
        const progress = self.progress;
        const scrollDistance = getScrollDistance();
        const xPosition = -scrollDistance * progress;
        gsap.set(cardsWrapper, { x: xPosition });
      },
    });

    // Refresh on resize
    window.addEventListener('resize', () => {
      scrollTrigger.refresh();
    });

    return () => {
      scrollTrigger.kill();
      window.removeEventListener('resize', () => {});
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-white overflow-hidden">
      {/* Heading row */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-8 sm:pb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <FadeUp>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-semibold text-gray-900 leading-tight">
              Why Choose Us
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-base sm:text-xl text-gray-700 mt-3 max-w-xl leading-relaxed">
              We Provide Outsourced IT Services For Your Business
            </p>
          </FadeUp>
        </div>
        <motion.div
          className="hidden sm:flex items-center gap-2 text-gray-400 text-sm font-medium tracking-wide select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <span>scroll to explore</span>
          <ArrowRight className="w-4 h-4" />
        </motion.div>
      </div>

      {/* Cards container with horizontal scroll effect */}
      <div
        ref={cardsContainerRef}
        className="overflow-hidden"
      >
        <div
          ref={cardsWrapperRef}
          className="flex gap-5 sm:gap-7 px-4 sm:px-12 pb-12 sm:pb-16"
          style={{
            width: "max-content",
            willChange: "transform",
          }}
        >
          {cards.map((card, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{
                width: "clamp(280px, 32vw, 420px)",
                height: "clamp(400px, 62vh, 580px)",
              }}
            >
              <div className="flex-shrink-0 overflow-hidden" style={{ height: "48%" }}>
                <img
                  src={card.img}
                  alt={card.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div className="flex flex-col justify-center px-6 sm:px-8 py-6 flex-1">
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-3">
                  0{i + 1}
                </span>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 leading-snug">
                  {card.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
          <div className="flex-shrink-0 w-4 sm:w-8" aria-hidden />
        </div>
      </div>
    </section>
  );
};

// ========================================================
// MAIN ABOUT PAGE
// ========================================================
const About = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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

  // Voiceflow chatbot integration


  // GSAP hero word stagger
  const gsapHeroRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = gsapHeroRef.current;
    if (!el) return;
    const words = el.querySelectorAll(".gsap-word");
    const tween = gsap.fromTo(
      words,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.08, delay: 1.4 }
    );
    return () => { tween.kill(); };
  }, []);

  // Hero image scale-on-scroll


  const faqs = [
    {
      question: "What types of companies can benefit from your IT infrastructure solutions?",
      answer: "Our solutions are designed for all business sizes—startups to large enterprises. We tailor our services to meet the unique needs of each organization, ensuring scalable and efficient IT infrastructure.",
    },
    {
      question: "How do you determine the specific needs of a company?",
      answer: "We begin with a comprehensive assessment of your current IT infrastructure, business goals, and operational challenges. Our expert team conducts detailed consultations to understand your requirements and design customized solutions that align with your objectives.",
    },
    {
      question: "How can we get started with your tailored IT solutions?",
      answer: "Getting started is simple. Contact us through our website or call our team directly. We'll schedule an initial consultation to discuss your needs, followed by a detailed proposal outlining our recommended solutions and implementation timeline.",
    },
  ];

  const stats = [
    { icon: Users,       number: "1800", suffix: "+", label: "Happy Customers" },
    { icon: CheckCircle, number: "100",  suffix: "%", label: "Client Satisfaction" },
    { icon: Shield,      number: null,   label: "World Class", staticText: "World Class" },
  ];

  const process = [
    { number: "01", title: "Our Approach", description: "Making technology easy and worry-free for every business." },
    { number: "02", title: "Our Values",   description: "Built on trust, client loyalty, and long-term partnerships." },
    { number: "03", title: "Our Support",  description: "Fast, reliable engineering team available when you need us." },
    { number: "04", title: "Our Solution", description: "We unite top technologies for performance and scalability." },
  ];

  return (
    <Layout>
      <>
        <title>About Sniper Systems | IT Solutions & Managed Services Company in India</title>
        <meta name="description" content="Learn about Sniper Systems, a leading IT solutions provider in India offering IT infrastructure, managed services, cloud solutions, and enterprise technology services for businesses." />
        <meta name="keywords" content="about sniper systems, IT company in India, IT solutions provider Chennai, managed IT services company India" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://sniperindia.com/about-us/" />
        <meta name="geo.region" content="IN-TN" />
        <meta name="geo.placename" content="Chennai" />
        <meta name="geo.position" content="13.0827;80.2707" />
        <meta name="ICBM" content="13.0827, 80.2707" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="About Sniper Systems | IT Infrastructure & Managed Services" />
        <meta property="og:description" content="Sniper Systems delivers enterprise IT infrastructure, managed IT services, cloud and digital transformation solutions across India." />
        <meta property="og:image" content="https://sniperindia.com/wp-content/uploads/2023/09/sniper-systems-banner.jpg" />
        <meta property="og:url" content="https://sniperindia.com/about-us/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Sniper Systems | IT Solutions Company India" />
        <meta name="twitter:description" content="Discover how Sniper Systems provides IT infrastructure, managed services, and enterprise solutions for modern businesses." />
        <meta name="twitter:image" content="https://sniperindia.com/wp-content/uploads/2023/09/sniper-systems-banner.jpg" />
        <script type="application/ld+json">{`{"@context":"https://schema.org","@type":"Organization","name":"Sniper Systems","url":"https://sniperindia.com","logo":"https://sniperindia.com/wp-content/uploads/2023/09/logo.png","description":"Sniper Systems is a leading IT solutions provider delivering enterprise IT infrastructure, managed services, and cloud solutions across India.","sameAs":["https://www.linkedin.com/company/sniper-systems"]}`}</script>
        <script type="application/ld+json">{`{"@context":"https://schema.org","@type":"LocalBusiness","name":"Sniper Systems","image":"https://sniperindia.com/wp-content/uploads/2023/09/logo.png","url":"https://sniperindia.com","telephone":"+91-44-00000000","address":{"@type":"PostalAddress","addressLocality":"Chennai","addressRegion":"Tamil Nadu","addressCountry":"India"},"geo":{"@type":"GeoCoordinates","latitude":13.0827,"longitude":80.2707}}`}</script>
        <script type="application/ld+json">{`{"@context":"https://schema.org","@type":"AboutPage","name":"About Sniper Systems","url":"https://sniperindia.com/about-us/","description":"Learn more about Sniper Systems, an IT solutions provider offering enterprise technology services across India."}`}</script>









      </>

      {showWhiteScreen && (
        <WhiteScreenTransition onComplete={() => setShowWhiteScreen(false)} />
      )}

      {/* ── Hero ── */}
      {/* ── Hero ── */}
<section className="relative bg-white pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
  <div className="relative z-10 max-w-7xl mx-auto">
   <div className="text-center mb-2 sm:mb-4">
      <h1
        ref={gsapHeroRef}
        className="text-4xl sm:text-6xl md:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
      >
        {["Creating", "a", "better", "IT", "solutions"].map((word, i) => (
          <span key={i} className="gsap-word inline-block opacity-0 mr-[0.2em] sm:mr-[0.25em] last:mr-0">
            {word}
            {word === "better" ? <br /> : null}
          </span>
        ))}
      </h1>
      <FadeUp delay={1.9}>
        <p className="text-base sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0 mb-10">
          Let us handle your IT, so you can focus on what matters. Our expertise will manage your
          technology needs efficiently and securely.
        </p>
      </FadeUp>
    </div>
  </div>
</section>

{/* ── Sticky scroll-driven hero stage ── */}
<HeroStage />

      <MarqueeTicker />

      {/* ── Transform ── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-start">
          <FadeUp>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-semibold text-gray-900 leading-tight">
              Transform every<br />Digital Process
            </h2>
          </FadeUp>
          <FadeUp delay={0.15} className="space-y-4 sm:space-y-6">
            <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
              Revolutionize your digital workflows with our transformative solutions. Streamline every
              process for enhanced efficiency and productivity.
            </p>
            <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
              Our comprehensive approach ensures that every aspect of your digital infrastructure works
              seamlessly together, delivering measurable results and competitive advantages.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Experience ── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <FadeUp className="flex items-center justify-center h-64 sm:h-80 lg:h-96">
            <Lottie />
          </FadeUp>
          <div className="space-y-6 sm:space-y-8">
            <FadeUp delay={0.1}>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-gray-900 leading-tight">
                20+ years of<br />experience
              </h2>
            </FadeUp>
            <FadeUp delay={0.2} className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                We help companies by delivering state-of-the-art IT solutions. From hardware optimization
                to customized software solutions, we ensure maximum efficiency and effectiveness.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                With our expertise, companies can streamline operations and achieve their productivity
                goals confidently.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FadeUp className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="mb-10 sm:mb-16">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-semibold text-white leading-tight">
              Frequently<br />Asked Questions
            </h2>
          </FadeUp>
          <div className="space-y-4 sm:space-y-6">
            {faqs.map((faq, index) => (
              <FaqItem
                key={index}
                faq={faq}
                index={index}
                isOpen={openFaq === index}
                onToggle={() => setOpenFaq(openFaq === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ── Happy Customers ── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 sm:mb-16">
            <FadeUp>
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Trusted by 1800+<br />Happy Customers
              </h2>
            </FadeUp>
            <div className="w-full h-px bg-gray-300" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 mb-16 sm:mb-20">
            <FadeUp delay={0.1} className="flex items-center justify-center h-64 sm:h-72 md:h-80 lg:h-96 -mt-20">
              <Lottiee />
            </FadeUp>
            <FadeUp delay={0.2} className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                With a proven track record of satisfaction, we've earned the trust of over 1900 happy
                customers. Our commitment to excellence ensures tailored service for each client.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Every project we undertake is backed by our dedication to delivering world-class solutions
                and maintaining 100% client satisfaction.
              </p>
            </FadeUp>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 -mt-20">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} delay={0.1 + index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us — GSAP Pinned Horizontal Scroll ── */}
      <WhyChooseUsSection />

      {/* ── Process ── */}
      <FadeUp className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="mb-10 sm:mb-16">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-semibold text-white leading-tight">
              Process — How we work
            </h2>
          </FadeUp>
          <ProcessSteps process={process} />
        </div>
      </FadeUp>

      {/* ── Featured Image ──
      <section className="relative bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-semibold text-gray-900 mb-8 sm:mb-12 leading-tight">
              Excellence in<br />every solution
            </h2>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl overflow-hidden h-64 sm:h-[500px] md:h-[600px] lg:h-[700px]">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1600&q=80"
                alt="Team Excellence"
                className="w-full h-full"
              />
            </div>
          </FadeUp>
        </div>
      </section>
      */}

      {/* ── CTA ── */}
      <CTASection />

      {/* ── Scroll to Top ── */}
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

export default About;
