import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, CheckCircle, DollarSign, TrendingUp, Users, Zap } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";






import React from "react";
import { Helmet } from "react-helmet-async";



      <Helmet>

        {/* BASIC SEO */}

        <title>Payment Solutions in India | Secure Digital Payment Services | Sniper Systems</title>

        <meta
          name="description"
          content="Sniper Systems delivers secure payment solutions in India including digital payment systems, POS solutions, payment integration, and enterprise payment infrastructure for seamless transactions."
        />

        <meta
          name="keywords"
          content="payment solutions India, digital payment services India, POS solutions India, payment gateway integration, enterprise payment systems"
        />

        <meta name="robots" content="index, follow" />

        <link
          rel="canonical"
          href="https://sniperindia.com/solutions/payment-services"
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
          content="Digital Payment Solutions & Services | Sniper Systems India"
        />

        <meta
          property="og:description"
          content="Enable secure and seamless transactions with advanced digital payment and POS solutions."
        />

        <meta
          property="og:image"
          content="https://sniperindia.com/wp-content/uploads/2023/09/sniper-systems-banner.jpg"
        />

        <meta
          property="og:url"
          content="https://sniperindia.com/solutions/payment-services"
        />

        {/* TWITTER SEO */}

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="Payment Solutions in India | Sniper Systems"
        />

        <meta
          name="twitter:description"
          content="Secure digital payment infrastructure and POS solutions for modern businesses."
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
            "serviceType": "Payment Solutions",
            "provider": {
              "@type": "Organization",
              "name": "Sniper Systems"
            },
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "description": "Digital payment solutions including POS systems, payment gateway integration, and enterprise payment infrastructure in India."
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
                "name": "What are payment solutions for businesses?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Payment solutions enable businesses to accept, process, and manage digital transactions securely through POS systems, payment gateways, and online platforms."
                }
              },
              {
                "@type": "Question",
                "name": "Why are digital payment services important in India?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Digital payment services in India help businesses improve transaction speed, enhance customer experience, and ensure secure and seamless payments."
                }
              },
              {
                "@type": "Question",
                "name": "Does Sniper Systems provide POS and payment integration?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, Sniper Systems offers POS solutions and payment integration services to support seamless and secure business transactions."
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
                "name": "Solutions",
                "item": "https://sniperindia.com/solutions/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Payment Services",
                "item": "https://sniperindia.com/solutions/payment-services"
              }
            ]
          }
          `}
</script>

      </Helmet>









gsap.registerPlugin(ScrollTrigger);

// ========================================================
// TYPES
// ========================================================
interface ServiceItem {
  title: string;
  description: string;
}

interface WhyChooseItem {
  icon: React.ElementType;
  label: string;
  description: string;
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

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
// WHY CHOOSE LIST
// ========================================================
const WhyChooseList = ({
  items,
  inView,
}: {
  items: WhyChooseItem[];
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
      {items.map((benefit, index) => (
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

          {index < items.length - 1 && (
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
    <div ref={ref} className="fixed inset-0 bg-white z-[9999] will-change-transform" />
  );
};

// ========================================================
// SERVICE CARD
// ========================================================
const ServiceCard = ({
  service,
  index,
}: {
  service: ServiceItem;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  useEffect(() => {
    if (!inView || !lineRef.current) return;
    gsap.fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 1, ease: "power3.out", delay: 0.1 + index * 0.1 }
    );
  }, [inView, index]);

  return (
    <motion.div
      ref={ref}
      className="relative grid grid-cols-1 gap-4 md:gap-6 items-start pb-10 md:pb-12"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease, delay: index * 0.1 }}
    >
      <h3 className="text-xs md:text-sm font-semibold text-gray-900 uppercase tracking-wider">
        {service.title}
      </h3>
      <p className="text-base md:text-lg text-gray-800 leading-relaxed">
        {service.description}
      </p>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="inline-block"
      >
        <a
          href="/contact"
          className="inline-flex items-center w-fit px-6 md:px-8 py-2.5 md:py-3 border-2 border-gray-900 rounded-full text-gray-900 font-medium text-sm md:text-base hover:bg-gray-900 hover:text-white transition-colors duration-300"
        >
          Get started
        </a>
      </motion.div>
      <div className="absolute bottom-4 left-0 right-0 h-px bg-gray-300 overflow-hidden">
        <div
          ref={lineRef}
          className="h-full bg-gradient-to-r from-transparent via-gray-600 to-transparent"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </motion.div>
  );
};

// ========================================================
// BENEFICIARY CARD
// ========================================================
const BeneficiaryCard = ({
  text,
  index,
  inView,
}: {
  text: string;
  index: number;
  inView: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || "ontouchstart" in window) return;
    const onEnter = () => gsap.to(card, { y: -5, duration: 0.35, ease: "power2.out" });
    const onLeave = () => gsap.to(card, { y: 0, duration: 0.5, ease: "elastic.out(1,0.5)" });
    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.2 + index * 0.08,
      }}
    >
      <div
        ref={cardRef}
        className="flex items-start p-4 md:p-6 bg-gray-900 rounded-xl md:rounded-2xl border border-gray-800 hover:border-gray-600 transition-colors duration-300 will-change-transform"
      >
        <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-white mr-3 md:mr-4 mt-0.5 flex-shrink-0" />
        <span className="text-base md:text-lg text-gray-200">{text}</span>
      </div>
    </motion.div>
  );
};

// ========================================================
// MAIN PAGE
// ========================================================
const PaymentServices = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const handleWhiteScreenComplete = () => setShowWhiteScreen(false);

  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  // ---- Data ----
  const paymentServices: ServiceItem[] = [
    {
      title: "Leasing Services",
      description:
        "Access the latest IT hardware without upfront costs. Our flexible leasing solutions help you reduce CAPEX, improve cash flow, and keep your technology updated with customizable payment terms.",
    },
    {
      title: "Finance Services (AFS & More)",
      description:
        "Partner with premium brand finance programs like Apple Financial Services (AFS) to purchase cutting-edge devices through easy installments with transparent approval processes and pre-approved corporate credit lines.",
    },
  ];

  const whyChooseSniper: WhyChooseItem[] = [
    { icon: CheckCircle, label: "TRUSTED IT PARTNER",    description: "With 15+ years of experience in the industry, we bring proven expertise and reliability to every financial solution we offer." },
    { icon: Zap,         label: "VENDOR-NEUTRAL ACCESS", description: "Access to top global OEMs means you get the best technology options without being locked into a single vendor ecosystem." },
    { icon: TrendingUp,  label: "END-TO-END SUPPORT",    description: "From procurement to deployment, we manage every step of the process, ensuring seamless integration and ongoing support." },
    { icon: DollarSign,  label: "TRANSPARENT PRICING",   description: "Zero hidden charges and straightforward pricing structures mean you always know exactly what you're paying for." },
    { icon: Users,       label: "PERSONALIZED SERVICE",  description: "Quick approvals and dedicated account management ensure you get the attention and flexibility your business deserves." },
  ];

  const leasingBenefits = [
    "Access latest devices without upfront cost",
    "Pay monthly / quarterly / annually",
    "Upgrade devices at end of term",
    "Flexible tenure: 12 to 60 months",
    "Setup & maintenance support included",
  ];

  const financeOptions = [
    "Easy EMIs for individuals & companies",
    "Brand-backed programs like AFS",
    "Transparent approval process",
    "Pre-approved corporate credit lines",
    "Bundle devices + accessories + software",
  ];

  const beneficiaries = [
    "Startups scaling fast",
    "Enterprises standardizing hardware",
    "Creative & design teams",
    "Educational institutions",
    "Businesses preferring OPEX over CAPEX",
  ];

  // ---- Section refs ----
  const heroRef = useRef(null);
  const whyRef  = useRef(null);
  const svcRef  = useRef(null);
  const leasRef = useRef(null);
  const finRef  = useRef(null);
  const benRef  = useRef(null);
  const featRef = useRef(null);
  const ctaRef  = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-60px" });
  const whyInView  = useInView(whyRef,  { once: true, margin: "-60px" });
  const svcInView  = useInView(svcRef,  { once: true, margin: "-60px" });
  const leasInView = useInView(leasRef, { once: true, margin: "-60px" });
  const finInView  = useInView(finRef,  { once: true, margin: "-60px" });
  const benInView  = useInView(benRef,  { once: true, margin: "-60px" });
  const featInView = useInView(featRef, { once: true, margin: "-60px" });
  const ctaInView  = useInView(ctaRef,  { once: true, margin: "-100px" });

  // ---- GSAP: Hero heading word-stagger ----
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = heroHeadingRef.current;
    if (!el) return;
    const words = el.querySelectorAll(".hero-word");
    gsap.fromTo(
      words,
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

  // ---- GSAP: CTA heading word stagger ----
  const ctaHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!ctaInView) return;
    const el = ctaHeadingRef.current;
    if (!el) return;
    const words = el.querySelectorAll(".cta-word");
    gsap.fromTo(
      words,
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

  // ---- GSAP: Leasing benefits stagger ----
  const leasListRef = useRef<HTMLUListElement>(null);
  const leasTriggered = useRef(false);
  useEffect(() => {
    if (!leasInView || leasTriggered.current) return;
    leasTriggered.current = true;
    const items = leasListRef.current?.querySelectorAll(".benefit-item");
    if (!items) return;
    gsap.fromTo(
      items,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.55, ease: "power2.out", stagger: 0.1, delay: 0.3 }
    );
  }, [leasInView]);

  // ---- GSAP: Finance options stagger ----
  const finListRef = useRef<HTMLUListElement>(null);
  const finTriggered = useRef(false);
  useEffect(() => {
    if (!finInView || finTriggered.current) return;
    finTriggered.current = true;
    const items = finListRef.current?.querySelectorAll(".finance-item");
    if (!items) return;
    gsap.fromTo(
      items,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.55, ease: "power2.out", stagger: 0.1, delay: 0.3 }
    );
  }, [finInView]);

  // ---- Marquee data ----
  const marqueeItems  = ["Payment Services", "Leasing Solutions", "Finance Services", "Apple Financial Services", "CAPEX to OPEX", "IT Procurement"];
  const marqueeItems2 = ["Trusted IT Partner", "Vendor-Neutral", "End-to-End Support", "Transparent Pricing", "Personalized Service", "15+ Years Experience"];
  const marqueeItems3 = ["Upgrade Your Technology", "Smarter Payments", "Future-Proof Tech", "Sniper Systems", "Unstoppable Growth"];

  // ---- Hero words ----
  const heroWords: (string | React.ReactElement)[] = [
    "Empowering", "Businesses", <br key="br" />, "with", "Smarter", "Payments",
  ];

  const ctaWords: (string | React.ReactElement)[] = [
    "Ready", "to", "upgrade", <br key="br1" />, "your", "technology?",
  ];

  return (
    <Layout>
      {showWhiteScreen && (
        <WhiteScreenTransition onComplete={handleWhiteScreenComplete} />
      )}

      {/* ==================== HERO ==================== */}
      <section className="relative bg-white pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-white opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16" ref={heroRef}>

            <motion.p
              className="text-sm md:text-xl text-gray-700 mb-4 md:mb-6 uppercase tracking-wider font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 1.0 }}
            >
              Flexible Leasing &amp; Finance Solutions by Sniper
            </motion.p>

            <h1
              ref={heroHeadingRef}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-6 leading-tight font-sans"
              aria-label="Empowering Businesses with Smarter Payments"
            >
              {heroWords.map((word, i) =>
                typeof word !== "string" ? (
                  word
                ) : (
                  <span
                    key={i}
                    className="hero-word inline-block opacity-0 mr-[0.2em] last:mr-0"
                  >
                    {word}
                  </span>
                )
              )}
            </h1>

            <motion.p
              className="text-base md:text-xl text-gray-700 max-w-5xl mx-auto leading-relaxed px-2"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 1.72 }}
            >
              Empower your business with the right technology — without the upfront financial
              burden. Sniper offers tailored leasing and finance services that help organizations
              acquire the latest IT hardware with flexible, affordable payment options. Whether you
              need laptops for your growing team or are looking to leverage brand-specific finance
              options like Apple Financial Services (AFS), we've got you covered.
            </motion.p>
          </div>

          {/* Hero image */}
          <div className="max-w-6xl mx-auto pt-8 md:pt-12">
            <motion.div
              className="relative rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden h-56 sm:h-72 md:h-[500px] lg:h-[600px]"
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 1, ease, delay: 0.25 }}
            >
              <ParallaxImage
                src="https://i.postimg.cc/C56YkBcq/wom.jpg"
                alt="Payment Solutions"
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 z-10">
                <div className="bg-black bg-opacity-50 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full backdrop-blur-sm">
                  <span className="text-xs md:text-sm font-medium">PAYMENT SERVICES</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee 1 */}
      <MarqueeTicker items={marqueeItems} speed={24} />

      {/* ==================== WHY CHOOSE ==================== */}
      <motion.section
        ref={whyRef}
        className="bg-black text-white py-16 md:py-20 px-4 md:px-6 rounded-[2.5rem] md:rounded-[4rem] mx-4 md:mx-6 my-10 md:my-12"
        initial={{ opacity: 0, y: 60 }}
        animate={whyInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={whyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
            >
              Why choose Sniper?
            </motion.h2>
          </div>
          <WhyChooseList items={whyChooseSniper} inView={whyInView} />
        </div>
      </motion.section>

      {/* Marquee 2 */}
      <MarqueeTicker items={marqueeItems2} speed={20} reverse />

      {/* ==================== PAYMENT SERVICES ==================== */}
      <section className="bg-white py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto" ref={svcRef}>
          <div className="mb-12 md:mb-16">
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={svcInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease }}
            >
              Our payment
              <br />
              services
            </motion.h2>
          </div>
          <div className="space-y-0">
            {paymentServices.map((service, index) => (
              <ServiceCard key={index} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== LEASING DETAIL ==================== */}
      <section className="bg-white py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto" ref={leasRef}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center">

            {/* Image */}
            <motion.div
              className="rounded-xl md:rounded-2xl overflow-hidden h-64 md:h-80 lg:h-96"
              initial={{ opacity: 0, x: -40 }}
              animate={leasInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease, delay: 0.1 }}
            >
              <ParallaxImage
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                alt="Leasing Services"
                className="w-full h-full"
              />
            </motion.div>

            {/* Content */}
            <div className="space-y-6 md:space-y-8">
              <motion.div
                className="space-y-4 md:space-y-6"
                initial={{ opacity: 0, x: 40 }}
                animate={leasInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.9, ease, delay: 0.15 }}
              >
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900">
                  Simplify IT Procurement with Hassle-Free Leasing
                </h3>
                <p className="text-base md:text-xl text-gray-800 leading-relaxed">
                  Sniper provides leasing solutions for laptops, desktops, workstations, servers,
                  and peripherals. Ideal for startups, SMBs, and enterprises. Reduces CAPEX,
                  improves cash flow, and keeps your tech updated.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={leasInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: 0.25 }}
              >
                <h4 className="text-sm md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 uppercase tracking-wider">
                  Key Benefits
                </h4>
                <ul ref={leasListRef} className="space-y-2 md:space-y-3">
                  {leasingBenefits.map((benefit, index) => (
                    <li key={index} className="benefit-item opacity-0 flex items-start">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-900 mr-2 md:mr-3 mt-0.5 md:mt-1 flex-shrink-0" />
                      <span className="text-base md:text-lg text-gray-800">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FINANCE DETAIL ==================== */}
      <section className="bg-white py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto" ref={finRef}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center">

            {/* Content — stacked first on mobile, left on desktop */}
            <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
              <motion.div
                className="space-y-4 md:space-y-6"
                initial={{ opacity: 0, x: -40 }}
                animate={finInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.9, ease, delay: 0.15 }}
              >
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900">
                  Own the Tech You Love — Smarter &amp; Faster
                </h3>
                <p className="text-base md:text-xl text-gray-800 leading-relaxed">
                  We support Apple Financial Services (AFS) and other finance programs to help you
                  purchase premium devices (MacBooks, iPads, iPhones) with easy installments.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={finInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: 0.25 }}
              >
                <h4 className="text-sm md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 uppercase tracking-wider">
                  Finance Options
                </h4>
                <ul ref={finListRef} className="space-y-2 md:space-y-3">
                  {financeOptions.map((option, index) => (
                    <li key={index} className="finance-item opacity-0 flex items-start">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-900 mr-2 md:mr-3 mt-0.5 md:mt-1 flex-shrink-0" />
                      <span className="text-base md:text-lg text-gray-800">{option}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Image */}
            <motion.div
              className="rounded-xl md:rounded-2xl overflow-hidden h-64 md:h-80 lg:h-96 order-1 lg:order-2"
              initial={{ opacity: 0, x: 40 }}
              animate={finInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease, delay: 0.1 }}
            >
              <ParallaxImage
                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80"
                alt="Finance Services"
                className="w-full h-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== WHO CAN BENEFIT ==================== */}
      <motion.section
        ref={benRef}
        className="bg-black text-white py-16 md:py-20 px-4 md:px-6 rounded-[2.5rem] md:rounded-[4rem] mx-4 md:mx-6 my-10 md:my-12"
        initial={{ opacity: 0, y: 60 }}
        animate={benInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-10 md:mb-12">
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-8 md:mb-12 leading-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={benInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
            >
              Who can benefit?
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-left">
              {beneficiaries.map((beneficiary, index) => (
                <BeneficiaryCard
                  key={index}
                  text={beneficiary}
                  index={index}
                  inView={benInView}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ==================== FEATURED IMAGE ==================== */}
      <section className="relative bg-white py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto" ref={featRef}>
          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-8 md:mb-12 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={featInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease }}
          >
            Flexible payments
            <br />
            for modern business
          </motion.h2>
          <motion.div
            className="relative rounded-2xl md:rounded-3xl overflow-hidden h-64 sm:h-80 md:h-[500px] lg:h-[600px] xl:h-[700px]"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={featInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1, ease, delay: 0.15 }}
          >
            <ParallaxImage
              src="https://i.postimg.cc/g2zQmksf/Na-Nov-15.jpg"
              alt="Modern Business"
              className="w-full h-full"
            />
          </motion.div>
        </div>
      </section>

      {/* Marquee 3 */}
      <MarqueeTicker items={marqueeItems3} speed={22} />

      {/* ==================== CTA ==================== */}
      <motion.section
        ref={ctaRef}
        className="bg-black text-white py-16 md:py-20 px-4 md:px-6 rounded-[2.5rem] md:rounded-[4rem] mx-4 md:mx-6 my-10 md:my-12 overflow-hidden"
        initial={{ opacity: 0, y: 60 }}
        animate={ctaInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-10 md:mb-12 overflow-hidden">
            <h2
              ref={ctaHeadingRef}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold mb-6 leading-tight"
              aria-label="Ready to upgrade your technology?"
            >
              {ctaWords.map((word, i) =>
                typeof word !== "string" ? (
                  word
                ) : (
                  <span
                    key={i}
                    className="cta-word inline-block opacity-0 mr-[0.2em] last:mr-0"
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
            transition={{ duration: 0.7, ease, delay: 0.6 }}
          >
            <MagneticCTALink
              to="/contact"
              className="inline-flex items-center px-8 md:px-12 py-3.5 md:py-4 border-2 border-white rounded-full text-white font-medium text-base md:text-lg hover:bg-white hover:text-black transition-colors duration-300"
            >
              CONTACT US
            </MagneticCTALink>
          </motion.div>
        </div>
      </motion.section>

      {/* ==================== SCROLL TO TOP ==================== */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 md:bottom-8 md:right-8 w-12 h-12 md:w-14 md:h-14 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 z-50 shadow-lg"
            aria-label="Scroll to top"
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 -rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default PaymentServices;
