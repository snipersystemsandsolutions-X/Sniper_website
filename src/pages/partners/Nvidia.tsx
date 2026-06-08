import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Brain, CheckCircle, Globe, Layers, Star } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

// ─── Shared easing ────────────────────────────────────────
const ease = [0.16, 1, 0.3, 1] as const;

// ========================================================
// ✦ WHITE SCREEN TRANSITION  (pure GSAP, no state re-render)
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
// ✦ FADE-UP WRAPPER  (shared, replaces scattered motion.divs)
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
const MarqueeTicker = ({
  items, reverse = false,
}: { items: string[]; reverse?: boolean }) => {
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
// ✦ PARALLAX IMAGE  (GSAP scrub, lazy load)
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
// ✦ ANIMATED COUNTER  (pure GSAP DOM writes, no setState)
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
          {/* Icon */}
          <div className="sm:col-span-2 flex sm:justify-start">
            <benefit.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white flex-shrink-0" />
          </div>
          {/* Label */}
          <div className="sm:col-span-3">
            <p className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider">{benefit.label}</p>
          </div>
          {/* Description */}
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
// ✦ OFFERINGS LIST  (light bg, GSAP line-draw dividers)
// ========================================================
const OfferingsList = ({ offerings, inView }: { offerings: any[]; inView: boolean }) => {
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
      {offerings.map((offering, index) => (
        <motion.div
          key={index}
          className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 lg:gap-16 items-start pb-10 sm:pb-12 last:pb-0"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease, delay: 0.1 + index * 0.08 }}
        >
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider">{offering.title}</h3>
          </div>
          <div>
            {offering.description ? (
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">{offering.description}</p>
            ) : (
              <ul className="space-y-2 sm:space-y-3">
                {offering.items?.map((item: string, idx: number) => (
                  <li key={idx} className="text-base sm:text-lg text-gray-800 leading-relaxed flex items-start gap-2">
                    <span className="text-gray-900 mt-1 flex-shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {index < offerings.length - 1 && (
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
// ✦ INDUSTRY CARD  (CSS hover, lazy img)
// ========================================================
const IndustryCard = ({ industry }: { industry: any }) => (
  <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
    <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
      <img
        src={industry.image}
        alt={industry.title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider">{industry.title}</h3>
      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{industry.description}</p>
    </div>
  </div>
);

// ========================================================
// MAIN NVIDIA PAGE
// ========================================================
const Nvidia = () => {
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

  // ✦ NEW: Hero image scale-on-scroll (grows from small → full as you scroll down)
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

  // Refs for sections
  const heroRef    = useRef(null);
  const statsRef   = useRef(null);
  const innovRef   = useRef(null);
  const nvidBenRef = useRef(null);
  const sniperRef  = useRef(null);
  const solRef     = useRef(null);
  const indRef     = useRef(null);
  const ctaRef     = useRef(null);

  const heroInView    = useInView(heroRef,    { once: true, margin: "-60px" });
  const statsInView   = useInView(statsRef,   { once: true, margin: "-60px" });
  const innovInView   = useInView(innovRef,   { once: true, margin: "-60px" });
  const nvidBenInView = useInView(nvidBenRef, { once: true, margin: "-60px" });
  const sniperInView  = useInView(sniperRef,  { once: true, margin: "-60px" });
  const solInView     = useInView(solRef,     { once: true, margin: "-60px" });
  const indInView     = useInView(indRef,     { once: true, margin: "-60px" });
  const ctaInView     = useInView(ctaRef,     { once: true, margin: "-100px" });

  // GSAP stats stagger
  const statsGridRef   = useRef<HTMLDivElement>(null);
  const statsTriggered = useRef(false);
  useEffect(() => {
    if (!statsInView || statsTriggered.current) return;
    statsTriggered.current = true;
    const items = statsGridRef.current?.querySelectorAll(".stat-item");
    if (!items) return;
    gsap.fromTo(items,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.12 }
    );
  }, [statsInView]);

  // GSAP industries grid stagger
  const indGridRef   = useRef<HTMLDivElement>(null);
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

  // Data
  const nvidiaBenefits = [
    { title: "World-Class GPUs", description: "NVIDIA's industry-leading GPU architecture delivers unmatched performance for high-intensity AI training, deep learning inference, and real-time rendering workloads at enterprise scale." },
    { title: "Scalable Infrastructure", description: "From single-node deployments to multi-cluster supercomputing environments, NVIDIA's infrastructure scales rapidly to meet the demands of training and deploying large AI models." },
    { title: "Industry-Specific AI Frameworks", description: "Pre-trained models, domain-specific SDKs, and optimized frameworks for healthcare, finance, automotive, retail, and more — enabling faster time-to-value for AI adoption." },
    { title: "Comprehensive AI Pipelines", description: "End-to-end solutions covering data ingestion, model training, optimization, and production deployment, helping businesses build streamlined and efficient AI pipelines." },
    { title: "Enterprise-Class Support", description: "Access to NVIDIA's full suite of enterprise SDKs, libraries, developer tools, and dedicated support — ensuring your AI initiatives are backed by the best technology stack available." },
  ];

  const sniperBenefits = [
    { icon: Brain,       label: "NVIDIA FULL STACK EXPERTISE",  description: "Our certified team holds deep expertise across NVIDIA's full technology stack — from GPU hardware and CUDA programming to DGX systems, AI Enterprise software, and cloud-native deployments." },
    { icon: Layers,      label: "CUSTOMIZED AI SOLUTIONS",      description: "We don't deliver off-the-shelf answers. Every solution is architected around your unique business needs, data environment, and performance goals — ensuring maximum ROI from your NVIDIA investment." },
    { icon: CheckCircle, label: "COMPREHENSIVE SUPPORT",        description: "From initial consultation and proof-of-concept to full deployment and ongoing optimization, Sniper supports your AI journey at every stage with hands-on technical expertise." },
    { icon: Globe,       label: "INDUSTRY-SPECIFIC KNOWLEDGE",  description: "With extensive experience across healthcare, finance, manufacturing, automotive, and logistics, our team brings domain-specific AI knowledge that translates technical capability into real business outcomes." },
  ];

  const nvidiaSolutions = [
    { title: "AI & Deep Learning",        items: ["NVIDIA DGX systems for accelerated AI training and research at scale", "NVIDIA A100 and H100 Tensor Core GPUs for large language model training", "NVIDIA AI Enterprise software suite for production-grade AI deployment", "CUDA and cuDNN optimized frameworks for deep neural network workloads"] },
    { title: "Data Center & HPC",         items: ["NVIDIA DGX SuperPOD for hyperscale AI infrastructure deployments", "NVIDIA InfiniBand networking for ultra-low latency GPU cluster communication", "NVIDIA BlueField DPUs for intelligent data center infrastructure offload", "High-performance computing solutions for scientific simulation and research"] },
    { title: "Visualization & Design",    items: ["NVIDIA RTX professional GPUs for real-time ray tracing and rendering", "NVIDIA Omniverse platform for collaborative 3D design and digital twins", "NVIDIA Quadro solutions for CAD, VFX, and immersive visualization workflows", "GPU-accelerated virtual workstation deployments via NVIDIA vWS"] },
    { title: "Embedded & Edge AI",        items: ["NVIDIA Jetson modules for AI inference at the edge in compact form factors", "NVIDIA EGX platform for deploying AI at the enterprise edge at scale", "Autonomous machine and robotics solutions powered by NVIDIA Isaac", "Real-time video analytics and intelligent video surveillance systems"] },
    { title: "Generative AI & LLMs",      items: ["NVIDIA NeMo framework for building and fine-tuning large language models", "Retrieval-augmented generation (RAG) pipelines with NVIDIA AI foundations", "NVIDIA TensorRT-LLM for optimized LLM inference and deployment", "Enterprise generative AI solutions for content, code, and data generation"] },
  ];

  const industries = [
    { title: "Healthcare & Life Sciences", image: "https://i.postimg.cc/1zrqK0Jx/9762653.jpg",           description: "Accelerating drug discovery, medical imaging analysis, and genomics with GPU-powered AI." },
    { title: "Financial Services",         image: "https://i.postimg.cc/Z0zbg25L/finance.jpg",            description: "Real-time fraud detection, risk modeling, and algorithmic trading powered by NVIDIA AI." },
    { title: "Automotive & Mobility",      image: "https://i.postimg.cc/sfqv70sh/futuristic.jpg",         description: "Autonomous vehicle development, ADAS simulation, and fleet intelligence with NVIDIA DRIVE." },
    { title: "Manufacturing",              image: "https://i.postimg.cc/9QRH3Vkw/engineerfactory.jpg",    description: "AI-powered defect detection, predictive maintenance, and smart factory automation." },
    { title: "Retail & E-Commerce",        image: "https://i.postimg.cc/kGmJM37x/digital-wardrobe-transparent-screen.jpg",           description: "Personalization engines, demand forecasting, and visual search powered by GPU-accelerated AI." },
    { title: "Media & Entertainment",      image: "https://i.postimg.cc/MKHhRqqd/7350.jpg",              description: "AI-assisted content creation, real-time rendering, and immersive virtual production." },
  ];

  const stats = [
    { value: "5-Star", label: "Generative AI Partner of the Year" },
    { value: "10+",    label: "Years of NVIDIA Partnership" },
    { value: "500+",   label: "Enterprise Deployments" },
    { value: "6+",     label: "Industries Served" },
  ];

  const marqueeItems1 = ["NVIDIA Preferred Partner", "Generative AI", "GPU Computing", "DGX Systems", "Sniper Systems", "India"];
  const marqueeItems2 = ["CUDA", "NVIDIA H100", "AI Enterprise", "Omniverse", "TensorRT", "NVIDIA Jetson", "LLM Training"];
  const marqueeItems3 = ["AI & Deep Learning", "Data Center HPC", "Edge AI", "Digital Twins", "Sniper Systems", "Accelerated Computing"];
  const marqueeItems4 = ["5-Star GenAI Partner", "Future-Ready AI", "Sniper Systems", "GPU-Powered Innovation", "Enterprise AI"];

  return (
    <Layout>
      {showWhiteScreen && <WhiteScreenTransition onComplete={() => setShowWhiteScreen(false)} />}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-white pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16" ref={heroRef}>

            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-black text-white px-4 sm:px-5 py-2 rounded-full mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, ease, delay: 0.8 }}
            >
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
              <span className="text-[10px] sm:text-sm font-medium tracking-wide text-center leading-tight">
                GENERATIVE AI 5-STAR PARTNER OF THE YEAR
              </span>
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
            </motion.div>

            {/* GSAP word-stagger heading */}
            <h1
              ref={heroHeadingRef}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              aria-label="India's Trusted NVIDIA Preferred Partner for AI & GPU Solutions"
            >
              {["India's", "Trusted", "NVIDIA", "Preferred", "Partner", "for", "AI", "&", "GPU", "Solutions"].map((word, i, arr) => (
                <span key={i}>
                  <span className="hero-word inline-block opacity-0 mr-[0.2em] sm:mr-[0.25em]">{word}</span>
                  {/* line break after "NVIDIA" on md+ */}
                  {word === "NVIDIA" && <br key={`br-${i}`} className="hidden sm:block" />}
                  {word === "for"    && <br key={`br2-${i}`} className="hidden sm:block" />}
                </span>
              ))}
            </h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-700 max-w-5xl mx-auto leading-relaxed px-2 sm:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 1.7 }}
            >
              Sniper Systems and Solutions is an NVIDIA Preferred Partner delivering advanced computing
              solutions that accelerate business workflows across diverse industries. Our expertise covers
              AI, Machine Learning, Visualization, and Embedded Systems — powering the next generation
              of intelligent enterprise operations.
            </motion.p>
          </div>

          {/* Hero image with scale-on-scroll animation */}
          <motion.div
            className="max-w-6xl mx-auto pt-6 sm:pt-8 lg:pt-12"
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          >
            <div
              ref={heroImgWrapRef}
              className="relative shadow-2xl overflow-hidden h-56 sm:h-96 md:h-[500px] lg:h-[600px]"
              style={{
                borderRadius: "2.5rem",
                willChange: "transform, border-radius",
                transformOrigin: "center center",
              }}
            >
              <ParallaxImage
                src="https://i.postimg.cc/y6ph8k3d/Copy-of-genai-social-nemotron-3-4643900-1920x1080-1.webp"
                alt="NVIDIA AI Solutions"
                className="w-full h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 z-10">
                  <div className="bg-black/60 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                    <span className="text-[10px] sm:text-sm font-medium">NVIDIA PREFERRED PARTNER — INDIA</span>
                  </div>
                </div>
              </ParallaxImage>
            </div>
          </motion.div>
        </div>
      </section>

      <MarqueeTicker items={marqueeItems1} />

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="bg-white py-10 sm:py-12 px-4 sm:px-6" ref={statsRef}>
        <div className="max-w-6xl mx-auto">
          <div
            ref={statsGridRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 border border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-10"
          >
            {stats.map((stat, index) => (
              <div key={index} className="stat-item opacity-0 text-center">
                <p className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-1 sm:mb-2">{stat.value}</p>
                <p className="text-[10px] sm:text-sm text-gray-500 uppercase tracking-wider leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leading AI Innovation ─────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={innovRef}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <FadeUp>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 leading-tight">
                Leading AI<br />Innovation,<br />Empowering<br />Your Business
              </h2>
            </FadeUp>
            <FadeUp delay={0.15} className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
                NVIDIA stands at the forefront of AI and machine learning, transforming industries
                worldwide. From advanced GPUs to scalable infrastructure, NVIDIA's AI technology
                empowers organizations to optimize workflows, harness predictive analytics, and
                implement AI-driven automation.
              </p>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
                With NVIDIA, we help businesses in healthcare, finance, automotive, and beyond to
                revolutionize operations and drive lasting competitive advantage through the power
                of accelerated computing and generative AI.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      <MarqueeTicker items={marqueeItems2} reverse />

      {/* ── Why Choose NVIDIA ─────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={nvidBenRef}>
          <FadeUp className="mb-10 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 leading-tight">
              Why Choose NVIDIA<br />for AI?
            </h2>
          </FadeUp>
          <OfferingsList offerings={nvidiaBenefits} inView={nvidBenInView} />
        </div>
      </section>

      {/* ── Why Sniper ───────────────────────────────────────────────────── */}
      <FadeUp className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12">
        <div ref={sniperRef} className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <FadeUp>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-4 sm:mb-6">
                Why Sniper is Your<br />Ideal NVIDIA Partner
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                As a preferred NVIDIA partner, Sniper Systems &amp; Solutions brings unparalleled expertise
                in AI and ML. Our experienced team is dedicated to guiding your business through the
                complexities of NVIDIA's solutions — unlocking NVIDIA's full potential to drive growth,
                innovation, and operational excellence.
              </p>
            </FadeUp>
          </div>
          <BenefitsList benefits={sniperBenefits} inView={sniperInView} />
        </div>
      </FadeUp>

      <MarqueeTicker items={marqueeItems3} />

      {/* ── NVIDIA Solutions ─────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={solRef}>
          <FadeUp className="mb-10 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 leading-tight">
              NVIDIA Solutions<br />We Deliver
            </h2>
          </FadeUp>
          <OfferingsList offerings={nvidiaSolutions} inView={solInView} />
        </div>
      </section>

      {/* ── Industries ───────────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={indRef}>
          <div className="mb-10 sm:mb-16">
            <FadeUp>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Industries We Serve
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed">
                NVIDIA AI is transforming operations across every major sector. Sniper brings
                domain-specific expertise to ensure your industry gets the most from accelerated computing.
              </p>
            </FadeUp>
          </div>

          {/* GSAP stagger grid */}
          <div ref={indGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {industries.map((industry, index) => (
              <div key={index} className="industry-card opacity-0">
                <IndustryCard industry={industry} />
              </div>
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

export default Nvidia;
