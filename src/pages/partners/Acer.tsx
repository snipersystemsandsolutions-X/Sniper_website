import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, CheckCircle, Laptop, Package, Users } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";


gsap.registerPlugin(ScrollTrigger);

// ─── Shared easing ────────────────────────────────────────
const ease = [0.16, 1, 0.3, 1] as const;

// ========================================================
// ✦ WHITE SCREEN TRANSITION
// ========================================================
const WhiteScreenTransition = ({ onComplete }: { onComplete: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://cdn.jotfor.ms/agent/embedjs/019f2165e4c6756899b7d476e73c18bd40b3/embed.js";
  script.async = true;
  document.body.appendChild(script);
  return () => { document.body.removeChild(script); };
}, []);


  useEffect(() => {
    gsap.to(ref.current, {
      yPercent: -105, duration: 0.9,
      ease: "power3.inOut", delay: 0.2, onComplete,
    });
  }, []);
  return <div ref={ref} className="fixed inset-0 bg-white z-[9999] will-change-transform" />;
};

// ========================================================
// ✦ FADE-UP WRAPPER
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
const MarqueeTicker = ({ items, reverse = false }: { items: string[]; reverse?: boolean }) => {
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
// ✦ PARALLAX IMAGE
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
// ✦ ANIMATED COUNTER
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
          <div className="sm:col-span-2 flex sm:justify-start">
            <benefit.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white flex-shrink-0" />
          </div>
          <div className="sm:col-span-3">
            <p className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider leading-relaxed">
              {benefit.label}
            </p>
          </div>
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
// ✦ PRODUCT CARD  (CSS hover — no per-card GSAP listeners)
// ========================================================
const ProductCard = ({ product }: { product: any }) => (
  <div className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 h-full">
    <div className="relative h-44 sm:h-56 md:h-64 overflow-hidden">
      <img
        src={product.image}
        alt={product.title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <div className="p-5 sm:p-8">
      <h3 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-4">{product.title}</h3>
      <p className="text-sm sm:text-lg text-gray-700 leading-relaxed">{product.description}</p>
    </div>
  </div>
);

// ========================================================
// MAIN ACER PAGE
// ========================================================
const Acer = () => {
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

  // GSAP CTA word stagger
  const ctaHeadingRef = useRef<HTMLHeadingElement>(null);
  const ctaRef        = useRef(null);
  const ctaInView     = useInView(ctaRef, { once: true, margin: "-100px" });
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

  // GSAP products grid stagger
  const productsGridRef   = useRef<HTMLDivElement>(null);
  const productsRef       = useRef(null);
  const productsInView    = useInView(productsRef, { once: true, margin: "-60px" });
  const productsTriggered = useRef(false);
  useEffect(() => {
    if (!productsInView || productsTriggered.current) return;
    productsTriggered.current = true;
    const cards = productsGridRef.current?.querySelectorAll(".product-card");
    if (!cards) return;
    gsap.fromTo(cards,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.12 }
    );
  }, [productsInView]);

  // Section inView refs
  const heroRef     = useRef(null);
  const benefitsRef = useRef(null);
  const partnerRef  = useRef(null);
  const featRef     = useRef(null);
  const statsRef    = useRef(null);

  const heroInView     = useInView(heroRef,     { once: true, margin: "-60px" });
  const benefitsInView = useInView(benefitsRef, { once: true, margin: "-60px" });
  const partnerInView  = useInView(partnerRef,  { once: true, margin: "-60px" });
  const featInView     = useInView(featRef,     { once: true, margin: "-60px" });
  const statsInView    = useInView(statsRef,    { once: true, margin: "-60px" });

  // Data
  const benefits = [
    { icon: CheckCircle, label: "AUTHORIZED RESELLER BENEFITS",  description: "As an Acer authorized reseller, we ensure genuine products backed by official Acer warranties and support. With us, you're guaranteed authenticity and peace of mind." },
    { icon: Package,     label: "COMPREHENSIVE PRODUCT RANGE",   description: "Our Acer product lineup caters to professionals, gamers, and creatives with versatile laptops for productivity, desktops with powerful performance, and monitors offering stunning clarity." },
    { icon: Users,       label: "INDUSTRY-SPECIFIC SOLUTIONS",   description: "We understand the unique needs of different industries. From IT and education to creative professionals, we provide tailored Acer solutions that align with your goals." },
    { icon: Laptop,      label: "EXPERT CONSULTATION",           description: "Leverage our expertise to find the perfect Acer product for your requirements. Our team ensures you get the right technology to enhance efficiency and innovation." },
  ];

  const products = [
    { title: "Acer Laptops & Notebooks",    description: "Elevate your mobility & productivity with Acer laptops for professionals, students, & gamers. Featuring the latest processors & sleek designs, they deliver unmatched performance.", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80" },
    { title: "Acer Monitors and Displays",  description: "Experience immersive visuals with Acer's advanced monitors. Whether it's for gaming, work, or creative projects, our displays ensure clarity and vibrant colors.", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80" },
    { title: "Acer Desktops & All-in-Ones", description: "Harness the power of Acer desktops built for multitasking and heavy workloads. From compact designs to powerhouse configurations, we have options for every need.", image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80" },
    { title: "Accessories & Peripherals",   description: "Complete your tech ecosystem with Acer's range of accessories, including keyboards, mice, and docking stations, ensuring seamless connectivity and performance.", image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&q=80" },
  ];

  const marqueeItems1 = ["Acer Authorized Reseller", "Laptops & Notebooks", "Monitors & Displays", "Desktops & AiO", "Sniper Systems", "Genuine Acer Products"];
  const marqueeItems2 = ["Acer Swift", "Acer Predator", "Acer Nitro", "Acer ConceptD", "Acer Chromebook", "Acer Veriton", "Accessories"];
  const marqueeItems3 = ["Innovation Meets Performance", "Efficient. Secure. Sustainable.", "Sniper Systems", "Acer Technology", "Future-Ready Computing"];

  return (
    <Layout>
      <>
        {/* BASIC SEO */}
        <title>Acer Authorized Partner in India | Acer Business Solutions | Sniper Systems</title>
        <meta
          name="description"
          content="Sniper Systems is an Acer authorized partner in India delivering business laptops, desktops, monitors, projectors, and enterprise IT solutions with deployment, consultation, and support services."
        />
        <meta
          name="keywords"
          content="Acer partner India, Acer authorized reseller India, Acer business laptops, Acer enterprise solutions, Acer monitors India, Acer IT infrastructure solutions"
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://sniperindia.com/partners/acer"
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
          content="Acer Business Solutions & Enterprise Computing | Sniper Systems India"
        />
        <meta
          property="og:description"
          content="Enterprise Acer solutions including business laptops, monitors, desktops, and workplace IT infrastructure."
        />
        <meta
          property="og:image"
          content="https://sniperindia.com/wp-content/uploads/2023/09/sniper-systems-banner.jpg"
        />
        <meta
          property="og:url"
          content="https://sniperindia.com/partners/acer"
        />

        {/* TWITTER SEO */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Acer Authorized Partner in India | Sniper Systems"
        />
        <meta
          name="twitter:description"
          content="Scalable Acer enterprise computing solutions for modern businesses and workplaces."
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
            "serviceType": "Acer Business Solutions",
            "provider": {
              "@type": "Organization",
              "name": "Sniper Systems"
            },
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "description": "Acer enterprise solutions including laptops, desktops, monitors, projectors, and IT infrastructure services for organizations in India."
          }
          `}
        </script>

        {/* FAQ SCHEMA */}
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What does an Acer authorized partner provide?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "An Acer authorized partner provides genuine Acer products, deployment, consultation, and support services for enterprise IT requirements."
                }
              },
              {
                "@type": "Question",
                "name": "What Acer solutions are available for businesses?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Acer offers business laptops, desktops, monitors, projectors, and enterprise computing solutions designed for workplace productivity and performance."
                }
              },
              {
                "@type": "Question",
                "name": "Why choose Sniper Systems for Acer solutions?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sniper Systems provides end-to-end Acer business solutions with consultation, deployment, and enterprise support services."
                }
              }
            ]
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
                "name": "Partners",
                "item": "https://sniperindia.com/partners/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Acer",
                "item": "https://sniperindia.com/partners/acer"
              }
            ]
          }
          `}
        </script>
      </>

      {showWhiteScreen && <WhiteScreenTransition onComplete={() => setShowWhiteScreen(false)} />}


      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-white pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16" ref={heroRef}>

            {/* GSAP word-stagger heading */}
            <h1
              ref={heroHeadingRef}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              aria-label="Your Trusted Acer Authorized Reseller"
            >
              {["Your", "Trusted", "Acer", "Authorized", "Reseller"].map((word, i) => (
                <span key={i} className="hero-word inline-block opacity-0 mr-[0.22em] last:mr-0">
                  {word}
                  {word === "Acer" && <br className="hidden sm:block" />}
                </span>
              ))}
            </h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 1.55 }}
            >
              Efficient. Secure. Sustainable.
            </motion.p>

            <motion.p
              className="text-base sm:text-lg text-gray-700 max-w-5xl mx-auto leading-relaxed px-2 sm:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 1.7 }}
            >
              As an Acer authorized reseller, Sniper Systems and Solutions proudly brings you the latest in Acer
              technology to transform your workspace. From high-performance laptops to innovative solutions for
              businesses, we deliver Acer's cutting-edge products with unparalleled service and expertise.
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
                src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1600&q=80"
                alt="Acer Technology"
                className="w-full h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 z-10">
                  <div className="bg-black/50 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                    <span className="text-[10px] sm:text-sm font-medium">ACER AUTHORIZED RESELLER</span>
                  </div>
                </div>
              </ParallaxImage>
            </div>
          </motion.div>
        </div>
      </section>

      <MarqueeTicker items={marqueeItems1} />

      {/* ── Why Choose ───────────────────────────────────────────────────── */}
      <FadeUp className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12">
        <div ref={benefitsRef} className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <FadeUp>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-4 sm:mb-6 leading-tight">
                Why Choose Sniper Systems<br className="hidden sm:block" />
                and Solutions for<br className="hidden sm:block" />
                Acer Products?
              </h2>
            </FadeUp>
          </div>
          <BenefitsList benefits={benefits} inView={benefitsInView} />
        </div>
      </FadeUp>

      <MarqueeTicker items={marqueeItems2} reverse />

      {/* ── Product Categories ────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={productsRef}>
          <FadeUp className="mb-10 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 leading-tight">
              Explore Our Acer<br />Product Categories
            </h2>
          </FadeUp>

          <div ref={productsGridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 lg:gap-12">
            {products.map((product, index) => (
              <div key={index} className="product-card opacity-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partnership Section ───────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={partnerRef}>
          <div className="mb-10 sm:mb-16">
            <FadeUp>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Partnering with Acer<br />for Innovation
              </h2>
            </FadeUp>
            <div className="w-full h-px bg-gray-300" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            <FadeUp>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                PARTNERING WITH ACER<br />FOR INNOVATION
              </h3>
            </FadeUp>
            <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Acer's commitment to innovation aligns perfectly with our mission at Sniper Systems and Solutions. As an
                Acer authorized reseller, we deliver technologies that empower businesses and individuals to stay ahead
                in a competitive world.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Whether you're looking for cutting-edge laptops, powerful desktops, or stunning displays, we provide the
                full spectrum of Acer products backed by expert support and genuine warranties.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Featured Image ────────────────────────────────────────────────── */}
      <section className="relative bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={featRef}>
          <FadeUp>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-8 sm:mb-12 leading-tight">
              Innovation<br />meets performance
            </h2>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-56 sm:h-[400px] md:h-[550px] lg:h-[700px]">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&q=80"
                alt="Acer Technology Showcase"
                className="w-full h-full"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="bg-white py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={statsRef}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 text-center">
            {[
              { number: "1800", suffix: "+", label: "Happy Customers" },
              { number: "300",  suffix: "+", label: "Acer Projects Delivered" },
              { number: "15",   suffix: "+", label: "Years of Experience" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 40 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: 0.3 + i * 0.1 }}
              >
                <div className="text-4xl sm:text-5xl md:text-6xl text-gray-900 mb-2 font-semibold">
                  <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                </div>
                <p className="text-gray-600 text-base sm:text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <MarqueeTicker items={marqueeItems3} />

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

export default Acer;
