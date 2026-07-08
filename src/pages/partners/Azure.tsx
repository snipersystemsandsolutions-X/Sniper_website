import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight, Cloud, Database, Globe, Lock,
  Settings, ShieldCheck, Users, Zap,
} from "lucide-react";
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
    gsap.to(ref.current, {
      yPercent: -105, duration: 0.9,
      ease: "power3.inOut", delay: 0.2, onComplete,
    });
  }, []);
  return <div ref={ref} className="fixed inset-0 bg-white z-[9999] will-change-transform pointer-events-none" />;
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
// ✦ MARQUEE TICKER
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
// ✦ BENEFITS LIST
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
// ✦ SOLUTION CARD
// ========================================================
const SolutionCard = ({ solution, delay }: { solution: any; delay: number }) => (
  <FadeUp delay={delay}>
    <div className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 h-full">
      <div className="relative h-44 sm:h-56 md:h-64 overflow-hidden bg-gray-100">
        <img
          src={solution.image}
          alt={solution.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5 sm:p-8">
        <h3 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-4">{solution.title}</h3>
        <p className="text-sm sm:text-lg text-gray-700 leading-relaxed">{solution.description}</p>
      </div>
    </div>
  </FadeUp>
);

// ========================================================
// MAIN AZURE PAGE
// ========================================================
const Azure = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);



useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://cdn.jotfor.ms/agent/embedjs/019f2165e4c6756899b7d476e73c18bd40b3/embed.js";
  script.async = true;
  document.body.appendChild(script);
  return () => { document.body.removeChild(script); };
}, []);


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
      { yPercent: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.08, delay: 0.6 }
    );
    return () => { tween.kill(); };
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

  // GSAP industries stagger
  const indGridRef   = useRef<HTMLDivElement>(null);
  const indRef       = useRef(null);
  const indInView    = useInView(indRef, { once: true, margin: "-60px" });
  const indTriggered = useRef(false);
  useEffect(() => {
    if (!indInView || indTriggered.current) return;
    indTriggered.current = true;
    const cards = indGridRef.current?.querySelectorAll(".industry-item");
    if (!cards) return;
    gsap.fromTo(cards,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.65, ease: "power2.out", stagger: 0.12 }
    );
  }, [indInView]);

  // Hero image scale-on-scroll
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

  // Section refs
  const heroRef     = useRef(null);
  const partnerRef  = useRef(null);
  const whyRef      = useRef(null);
  const featRef     = useRef(null);

  const heroInView    = useInView(heroRef,    { once: true, margin: "-60px" });
  const partnerInView = useInView(partnerRef, { once: true, margin: "-60px" });
  const whyInView     = useInView(whyRef,     { once: true, margin: "-60px" });

  // Data
  const benefits = [
    { icon: ShieldCheck, label: "CERTIFIED SPD PARTNER",          description: "Official Microsoft Azure SPD (Solution Provider Designation) partner in India. Get 100% genuine Azure services with full support, compliance assurance, and direct access to Microsoft's latest cloud innovations." },
    { icon: Settings,    label: "TAILORED AZURE SOLUTIONS",       description: "We architect and deploy the right Azure solutions based on your specific workloads, industry requirements, and growth goals—ensuring every deployment is optimized for performance and cost." },
    { icon: Users,       label: "COMPETITIVE PARTNER PRICING",    description: "Access to exclusive Microsoft partner pricing, Azure reserved instance discounts, and value-added bundles tailored to your business scale and consumption patterns." },
    { icon: Cloud,       label: "END-TO-END SUPPORT",             description: "From cloud consultation and migration planning to deployment and fully managed services, we provide complete lifecycle Azure support so your team can stay focused on what matters." },
  ];

  const solutions = [
    { title: "Azure Migration & Modernization",    description: "Seamlessly migrate your on-premises workloads to Azure with minimal downtime. We plan, execute, and optimize every step of your cloud journey—from lift-and-shift to full re-architecture.",          image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80" },
    { title: "Azure Infrastructure & DevOps",      description: "Build scalable, resilient infrastructure using Azure VMs, Virtual Networks, Azure SQL, and more—combined with Azure DevOps pipelines and best-in-class CI/CD practices.",                              image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80" },
    { title: "Data & Analytics on Azure",          description: "Unlock business insights with Azure Synapse Analytics, Azure Data Factory, and Power BI. Transform raw data into actionable intelligence at any scale, in real time.",                                image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80" },
    { title: "AI & Machine Learning on Azure",     description: "Harness Azure OpenAI Service, Azure Machine Learning, and Cognitive Services to build intelligent applications, automate workflows, and create next-generation user experiences.",                   image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80" },
  ];

  const industries = [
    { icon: Globe,    title: "Startups & Scale-ups",            description: "Flexible, pay-as-you-go Azure infrastructure that grows with your business from day one—backed by Microsoft's global network." },
    { icon: Lock,     title: "BFSI & Compliance-Heavy Sectors", description: "Secure, compliant Azure environments designed for banking, finance, and insurance workloads, meeting global regulatory standards." },
    { icon: Database, title: "Healthcare & Life Sciences",      description: "HIPAA-eligible Azure services and intelligent data management solutions for healthcare providers, researchers, and life science organizations." },
    { icon: Zap,      title: "Retail & E-Commerce",            description: "High-availability Azure architecture to handle peak traffic spikes, real-time personalization, and advanced retail analytics at scale." },
  ];

  const marqueeItems1 = ["Microsoft Azure SPD Partner", "Cloud Migration", "DevOps", "AI & ML", "Sniper Systems", "India"];
  const marqueeItems2 = ["Azure Virtual Machines", "Azure OpenAI", "Synapse Analytics", "Azure DevOps", "Cosmos DB", "Azure Functions", "Power BI"];
  const marqueeItems3 = ["Scale Without Limits", "Cloud-Native Solutions", "Sniper Systems", "Future-Ready Cloud", "Azure Innovation"];

  return (
    <Layout>
      <>
        {/* BASIC SEO */}
        <title>Microsoft Azure Partner in India | Azure Cloud Solutions | Sniper Systems</title>
        <meta
          name="description"
          content="Sniper Systems delivers Microsoft Azure cloud solutions in India including cloud migration, infrastructure management, backup, security, disaster recovery, and managed Azure services for enterprises."
        />
        <meta
          name="keywords"
          content="Azure partner India, Microsoft Azure solutions India, Azure cloud migration, Azure managed services India, Microsoft cloud solutions, Azure consulting partner"
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://sniperindia.com/partners/azure"
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
          content="Microsoft Azure Cloud Solutions & Migration | Sniper Systems India"
        />
        <meta
          property="og:description"
          content="Enterprise Microsoft Azure solutions including migration, cloud infrastructure, backup, disaster recovery, and managed cloud services."
        />
        <meta
          property="og:image"
          content="https://sniperindia.com/wp-content/uploads/2023/09/sniper-systems-banner.jpg"
        />
        <meta
          property="og:url"
          content="https://sniperindia.com/partners/azure"
        />

        {/* TWITTER SEO */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Microsoft Azure Partner in India | Sniper Systems"
        />
        <meta
          name="twitter:description"
          content="Scalable Microsoft Azure cloud infrastructure and managed services for modern enterprises."
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
            "serviceType": "Microsoft Azure Cloud Solutions",
            "provider": {
              "@type": "Organization",
              "name": "Sniper Systems"
            },
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "description": "Microsoft Azure cloud solutions including migration, cloud infrastructure, backup, disaster recovery, managed services, and cloud security."
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
                "name": "What Azure services does Sniper Systems provide?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sniper Systems provides Azure cloud migration, infrastructure deployment, managed services, cloud security, backup, disaster recovery, and consulting solutions."
                }
              },
              {
                "@type": "Question",
                "name": "Why should businesses migrate to Microsoft Azure?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Microsoft Azure helps businesses improve scalability, security, business continuity, and operational efficiency while enabling hybrid cloud infrastructure."
                }
              },
              {
                "@type": "Question",
                "name": "Does Sniper Systems provide Azure managed services?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, Sniper Systems provides end-to-end Azure managed services including monitoring, optimization, backup, and enterprise cloud support."
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
                "name": "Azure",
                "item": "https://sniperindia.com/partners/azure"
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
            >
              {["Microsoft", "Azure", "SPD", "Partner", "in", "India"].map((word, i) => (
                <span key={i} className="hero-word inline-block opacity-0 mr-[0.22em] last:mr-0">
                  {word}
                  {word === "Partner" && <br className="hidden sm:block" />}
                </span>
              ))}
            </h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 0.9 }}
            >
              Accelerate Your Business with Microsoft Azure
            </motion.p>

            <motion.p
              className="text-base sm:text-lg text-gray-700 max-w-5xl mx-auto leading-relaxed px-2 sm:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 1.05 }}
            >
              Looking for enterprise-grade cloud infrastructure, reliable scalability, and future-ready technology?
              Sniper Systems &amp; Solutions, an official Microsoft Azure SPD Partner in India, offers a full suite of
              Azure cloud solutions. Whether you're migrating legacy systems, building cloud-native applications,
              leveraging AI/ML capabilities, or managing data at scale—we deliver cloud technology built for results.
            </motion.p>
          </div>

          {/* Hero image — FadeUp handles opacity+y, GSAP owns scale scrub */}
          <FadeUp delay={0.2}>
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
                src="https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=1600&q=80"
                alt="Microsoft Azure Cloud Technology"
                className="w-full h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 z-10">
                  <div className="bg-black/50 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                    <span className="text-[10px] sm:text-sm font-medium">MICROSOFT AZURE SPD PARTNER</span>
                  </div>
                </div>
              </ParallaxImage>
            </div>
          </FadeUp>
        </div>
      </section>

      <MarqueeTicker items={marqueeItems1} />

      {/* ── About Partnership ─────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={partnerRef}>
          <div className="mb-10 sm:mb-16">
            <FadeUp>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                About Our<br />Partnership
              </h2>
            </FadeUp>
            <div className="w-full h-px bg-gray-300" />
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-10 sm:mb-16">
            <FadeUp>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                ABOUT OUR<br />PARTNERSHIP
              </h3>
            </FadeUp>
            <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Microsoft Azure is the world's second-largest cloud platform, offering over 200 products and cloud
                services designed to help organizations meet their business challenges. Azure powers enterprises,
                startups, and government agencies across the globe with unmatched hybrid cloud capabilities, AI
                infrastructure, and enterprise-grade security.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                At Sniper Systems &amp; Solutions, we proudly hold the Microsoft Azure SPD (Solution Provider
                Designation) partnership—a recognition of our technical excellence and customer commitment. As an
                official Microsoft Azure partner in India, we deliver cutting-edge cloud solutions and tailored IT
                strategies that meet the demands of modern enterprises, fast-growing startups, and digital-first
                organizations.
              </p>
            </FadeUp>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            <FadeUp delay={0.1} className="lg:col-start-2">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                With Sniper Systems, you get access to genuine Azure services, dedicated cloud architects, and the
                latest in Microsoft cloud innovation—all from a trusted technology partner who understands your
                business and keeps you ahead of the curve.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Why Choose ───────────────────────────────────────────────────── */}
      <FadeUp className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12">
        <div ref={whyRef} className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <FadeUp>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-4 sm:mb-6 leading-tight">
                Why Choose Sniper Systems<br className="hidden sm:block" />
                for Your Organization?
              </h2>
            </FadeUp>
          </div>
          <BenefitsList benefits={benefits} inView={whyInView} />
        </div>
      </FadeUp>

      <MarqueeTicker items={marqueeItems2} reverse />

      {/* ── Solutions ─────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="mb-10 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 leading-tight">
              Explore our<br />Azure Solutions
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 lg:gap-12">
            {solutions.map((solution, index) => (
              <SolutionCard key={index} solution={solution} delay={0.05 * index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Industries ───────────────────────────────────────────────────── */}
      <FadeUp className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12">
        <div ref={indRef} className="max-w-6xl mx-auto">
          <FadeUp className="mb-10 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight">
              Industries<br />We Serve
            </h2>
          </FadeUp>

          <div ref={indGridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 md:gap-12">
            {industries.map((industry, index) => (
              <div key={index} className="industry-item opacity-0 space-y-3 sm:space-y-4 pb-6 sm:pb-8 border-b border-gray-700 ">
                <div className="flex items-center gap-3 sm:gap-4">
                  <industry.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white flex-shrink-0" />
                  <h3 className="text-base sm:text-xl font-semibold text-white">{industry.title}</h3>
                </div>
                <p className="text-sm sm:text-lg text-gray-300 leading-relaxed">{industry.description}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ── Featured Image ────────────────────────────────────────────────── */}
      <section className="relative bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={featRef}>
          <FadeUp>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-8 sm:mb-12 leading-tight">
              Scale without<br />limits
            </h2>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-56 sm:h-[400px] md:h-[550px] lg:h-[700px]">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1600&q=80"
                alt="Microsoft Azure Cloud Showcase"
                className="w-full h-full"
              />
            </div>
          </FadeUp>
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

export default Azure;
