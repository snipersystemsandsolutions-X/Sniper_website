import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Award, Cpu, Globe, Headphones, Shield } from "lucide-react";
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
      <div ref={trackRef} className="flex gap-6 sm:gap-10 whitespace-nowrap will-change-transform">
        {doubled.map((text, i) => (
          <span
            key={i}
            className="flex items-center gap-6 sm:gap-10 text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] sm:tracking-[0.22em] uppercase text-gray-500"
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
const AnimatedCounter = ({ target, suffix = "" }: { target: string; suffix?: string }) => {
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
          className="relative pb-8 sm:pb-12 last:pb-0"
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 + index * 0.1 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start lg:grid lg:grid-cols-12 lg:items-center gap-4 sm:gap-6 lg:gap-8">
            <div className="lg:col-span-2 flex justify-start">
              <benefit.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white flex-shrink-0" />
            </div>
            <div className="flex flex-col gap-2 sm:gap-3 lg:contents">
              <div className="lg:col-span-3">
                <p className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider">
                  {benefit.label}
                </p>
              </div>
              <div className="lg:col-span-7">
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
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

// ---- Magnetic CTA link ----
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
    if (!btn) return;
    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
      gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: "power2.out" });
    };
    const onLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.5)" });
    };
    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);
    return () => {
      btn.removeEventListener("mousemove", onMove);
      btn.removeEventListener("mouseleave", onLeave);
    };
  }, []);
  return (
    <a ref={btnRef as any} href={to} className={`will-change-transform ${className ?? ""}`}>
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
    gsap.to(ref.current, {
      yPercent: -105,
      duration: 0.9,
      ease: "power3.inOut",
      delay: 0.2,
      onComplete,
    });
  }, []);
  return <div ref={ref} className="fixed inset-0 bg-white z-[9999] will-change-transform" />;
};

// ---- Solution Card ----
const SolutionCard = ({ solution, index }: { solution: any; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const ease = [0.16, 1, 0.3, 1];

  useEffect(() => {
    if (!inView || !lineRef.current) return;
    gsap.fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 1, ease: "power3.out", delay: 0.1 + (index % 2) * 0.1 }
    );
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      className="relative grid grid-cols-1 gap-4 sm:gap-6 items-start pb-12 sm:pb-16 group"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease, delay: (index % 2) * 0.1 }}
    >
      {/* Image */}
      <div className="relative w-full h-44 sm:h-52 overflow-hidden rounded-xl sm:rounded-2xl">
        <img
          src={solution.image}
          alt={solution.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition duration-500" />
      </div>

      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider">
        {solution.title}
      </h3>

      <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
        {solution.description}
      </p>

      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="inline-block"
      >
        <a
          href="/contact"
          className="inline-flex items-center w-fit px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-gray-900 rounded-full text-gray-900 text-sm sm:text-base font-medium hover:bg-gray-900 hover:text-white transition-colors duration-300"
        >
          Learn more
        </a>
      </motion.div>

      <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 h-px bg-gray-300 overflow-hidden">
        <div
          ref={lineRef}
          className="h-full origin-left bg-gradient-to-r from-transparent via-gray-600 to-transparent"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </motion.div>
  );
};

// ========================================================
// IT INFRASTRUCTURE PAGE
// ========================================================
const ITInfrastructure = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);

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
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const solutions = [
    {
      title: "End-User Computing",
      description:
        "We architect and deploy desktop/laptop and productivity platforms that empower employees while simplifying management. Our solutions improve efficiency and user experience.",
      image: "https://i.postimg.cc/DfYnDKMk/55304.jpg",
    },
    {
      title: "Networking & Connectivity",
      description:
        "We build high-performance LAN/WAN networks and integrated Wi-Fi/telecom environments for fast, secure, reliable connectivity.",
      image: "https://i.postimg.cc/brKXvp7B/118b6aa3-3076-4952-af58-422b82174d33.jpg",
    },
    {
      title: "Audio/Visual & Collaboration",
      description:
        "We integrate AV, UC, conferencing, digital signage, and collaboration systems to enhance communication and teamwork.",
      image: "https://i.postimg.cc/5jcGVpzr/image.jpg",
    },
    {
      title: "Data Center & Virtualisation",
      description:
        "We design scalable, resilient data center infrastructures for mission-critical workloads. We guide enterprises through virtualization, automation, and cloud transformation.",
      image: "https://i.postimg.cc/rFXMc9MJ/3199.jpg",
    },
    {
      title: "Enterprise Mobility",
      description:
        "We enable secure remote workforces with device management, connectivity, and collaboration platforms using modern MDM and wireless technologies.",
      image: "https://i.postimg.cc/mrqKjbD4/19199663.jpg",
    },
    {
      title: "High Performance Computing (HPC)",
      description:
        "We deliver HPC solutions for simulations, analytics, AI/ML workloads, and scientific computing — combining CPU/GPU power, storage, and networking.",
      image: "https://i.postimg.cc/V6QD55v1/glowing.jpg",
    },
  ];

  const benefits = [
    { icon: Globe,      label: "NATIONWIDE REACH",      description: "Pan-India deployment and support for fast, reliable, on-ground service." },
    { icon: Shield,     label: "360° COVERAGE",         description: "Complete end-to-end IT solutions across devices, networking, cloud, security, and AV systems." },
    { icon: Award,      label: "PROVEN EXPERTISE",      description: "15+ years of validated delivery excellence and client satisfaction." },
    { icon: Cpu,        label: "CENTER OF EXCELLENCE",  description: "Advanced technical center focused on wireless, mobility, AV, and security innovations." },
    { icon: Headphones, label: "MANAGED SERVICES",      description: "Reimagined managed IT services with proactive monitoring, maintenance, support, and performance optimization." },
  ];

  // Section refs
  const heroRef   = useRef(null);
  const statsRef  = useRef(null);
  const solRef    = useRef(null);
  const featRef   = useRef(null);
  const benRef    = useRef(null);
  const addImgRef = useRef(null);
  const ctaRef    = useRef(null);

  const heroInView   = useInView(heroRef,   { once: true, margin: "-60px" });
  const statsInView  = useInView(statsRef,  { once: true, margin: "-60px" });
  const solInView    = useInView(solRef,    { once: true, margin: "-60px" });
  const featInView   = useInView(featRef,   { once: true, margin: "-60px" });
  const benInView    = useInView(benRef,    { once: true, margin: "-60px" });
  const addImgInView = useInView(addImgRef, { once: true, margin: "-60px" });
  const ctaInView    = useInView(ctaRef,    { once: true, margin: "-100px" });

  const ease = [0.16, 1, 0.3, 1];

  // GSAP: Hero heading word-stagger
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = heroHeadingRef.current;
    if (!el) return;
    const words = el.querySelectorAll(".infra-word");
    gsap.fromTo(
      words,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.07, delay: 1.2 }
    );
  }, []);

  // GSAP: CTA heading word stagger
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

  const marqueeItems  = ["IT Infrastructure", "End-User Computing", "Networking", "Data Centers", "HPC", "Managed Services", "Enterprise Mobility"];
  const marqueeItems2 = ["AV & Collaboration", "Virtualisation", "Cloud Transformation", "LAN/WAN", "MDM", "AI/ML Workloads", "Pan-India Support"];
  const marqueeItems3 = ["Transform Your Infrastructure", "Future-Ready IT", "Unstoppable Growth", "Sniper Systems", "360° Coverage"];

  return (
    <Layout>
      {showWhiteScreen && <WhiteScreenTransition onComplete={() => setShowWhiteScreen(false)} />}


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
          <div className="text-center mb-10 sm:mb-14 md:mb-16" ref={heroRef}>

            <h1
              ref={heroHeadingRef}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight font-sans"
              aria-label="Future-Ready IT Infrastructure for Unstoppable Growth"
            >
              {["Future-Ready", "IT", "Infrastructure", <br key="br" />, "for", "Unstoppable", "Growth"].map((word, i) =>
                typeof word !== "string" ? word : (
                  <span key={i} className="infra-word inline-block opacity-0 mr-[0.22em] last:mr-0">
                    {word}
                  </span>
                )
              )}
            </h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-3 sm:mb-4 px-2"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 1.6 }}
            >
              Streamline Operations with Sniper's IT Infrastructure Services
            </motion.p>
            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-700 max-w-5xl mx-auto leading-relaxed px-2"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 1.72 }}
            >
              At Sniper, we partner with you to design, deploy, and manage robust IT infrastructures that drive business growth. As a 100% business-focused managed IT services provider, our team brings a consultative, strategic approach to every project. We tailor technology solutions to your goals and ensure seamless integration with your operations.
            </motion.p>
          </div>

          {/* Hero image */}
          <div className="max-w-6xl mx-auto pt-8 sm:pt-10 md:pt-12">
            <motion.div
              className="relative rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden h-56 sm:h-80 md:h-[500px] lg:h-[600px]"
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 1, ease, delay: 0.3 }}
            >
              <ParallaxImage
                src="https://i.postimg.cc/HsNHZBXT/modernroom.jpg"
                alt="IT Infrastructure"
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 z-10">
                <div className="bg-black bg-opacity-50 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                  <span className="text-xs sm:text-sm font-medium">IT INFRASTRUCTURE</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== STATS ==================== */}
      <section className="bg-white py-14 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={statsRef}>
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-8 sm:gap-12 lg:gap-16 w-full max-w-lg sm:max-w-xl">
              {[
                { number: "15",   suffix: "+", label: "Years of Industry Experience" },
                { number: "1900", suffix: "+", label: "Satisfied Customers" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="text-center"
                  initial={{ opacity: 0, y: 40 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, ease, delay: i * 0.12 }}
                >
                  <div className="text-4xl sm:text-5xl md:text-6xl text-gray-900 mb-1 sm:mb-2 font-semibold">
                    <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base md:text-lg">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marquee — after stats */}
      <MarqueeTicker items={marqueeItems} speed={24} />

      {/* ==================== SOLUTIONS ==================== */}
      <section className="bg-white py-16 sm:py-20 md:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={solRef}>
          <div className="mb-12 sm:mb-16 md:mb-20">
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={solInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9 }}
            >
              Our Comprehensive <br /> Solutions
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12">
            {solutions.map((solution, index) => (
              <SolutionCard key={index} solution={solution} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Marquee — between solutions and featured */}
      <MarqueeTicker items={marqueeItems2} speed={30} reverse />

      {/* ==================== FEATURED IMAGE ==================== */}
      <section className="relative bg-white py-14 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={featRef}>
          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-8 sm:mb-10 md:mb-12 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={featInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease }}
          >
            Building the backbone<br />of your digital future
          </motion.h2>
          <motion.div
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-64 sm:h-96 md:h-[500px] lg:h-[600px] xl:h-[700px]"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={featInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1, ease, delay: 0.15 }}
          >
            <ParallaxImage
              src="https://i.postimg.cc/sD3vCVnS/IT-Infrastructure-Management.jpg"
              alt="Technology Infrastructure"
              className="w-full h-full"
            />
          </motion.div>
        </div>
      </section>

      {/* ==================== BENEFITS ==================== */}
      <motion.section
        ref={benRef}
        className="bg-black text-white py-14 sm:py-16 md:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[3rem] lg:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-10 md:my-12"
        initial={{ opacity: 0, y: 60 }}
        animate={benInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-14 md:mb-16">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={benInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
            >
              Why Choose Sniper<br />IT Infrastructure Services?
            </motion.h2>
          </div>
          <BenefitsList benefits={benefits} inView={benInView} />
        </div>
      </motion.section>

      {/* ==================== ADDITIONAL IMAGES ==================== */}
      <section className="bg-white py-14 sm:py-16 md:py-20 px-4 sm:px-6">
        <div
          className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
          ref={addImgRef}
        >
          <motion.div
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-64 sm:h-80 md:h-[450px] lg:h-[550px]"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={addImgInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1 }}
          >
            <ParallaxImage
              src="https://i.postimg.cc/Gth8QqYT/6814c182171008db9057208a-vecteezy-ai-generated-data-center-background-futuristic-server-room-3643423.webp"
              alt="Infrastructure Technology"
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          </motion.div>

          <motion.div
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-64 sm:h-80 md:h-[450px] lg:h-[550px]"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={addImgInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <ParallaxImage
              src="https://i.postimg.cc/vTVjPFn1/1700929409387.jpg"
              alt="Business Technology"
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* Marquee — before CTA */}
      <MarqueeTicker items={marqueeItems3} speed={22} />

      {/* ==================== CTA ==================== */}
      <motion.section
        ref={ctaRef}
        className="bg-black text-white py-14 sm:py-16 md:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[3rem] lg:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-10 md:my-12 overflow-hidden"
        initial={{ opacity: 0, y: 60 }}
        animate={ctaInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 sm:mb-10 md:mb-12 overflow-hidden">
            <h2
              ref={ctaHeadingRef}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold mb-4 sm:mb-6 leading-tight"
              aria-label="Ready to transform your IT infrastructure?"
            >
              {["Ready", "to", "transform", "your",  "IT", "infrastructure?"].map((word, i) =>
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
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <MagneticCTALink
              to="/contact"
              className="inline-flex items-center px-8 sm:px-10 md:px-12 py-3 sm:py-4 border-2 border-white rounded-full text-white font-medium text-base sm:text-lg hover:bg-white hover:text-black transition-colors duration-300"
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
            className="fixed bottom-5 right-5 sm:bottom-8 sm:left-8 w-11 h-11 sm:w-14 sm:h-14 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 z-50 shadow-lg"
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



export default ITInfrastructure;
