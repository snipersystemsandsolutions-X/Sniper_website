import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Building2, GraduationCap, Headphones, Heart, Palette, Video } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

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
// ✦ MARQUEE TICKER  (pure CSS)
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
// ✦ BENEFITS LIST  (dark bg, GSAP line-draw)
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
// MAIN LOGITECH PAGE
// ========================================================
const Logitech = () => {
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
      { yPercent: 0, opacity: 1, duration: 0.95, ease: "power3.out", stagger: 0.08, delay: 0.6 }
    );
    return () => { tween.kill(); };
  }, []);

  // Section inView refs
  const whyRef    = useRef(null);
  const whyInView = useInView(whyRef, { once: true, margin: "-60px" });

  const indRef    = useRef(null);
  const indInView = useInView(indRef, { once: true, margin: "-60px" });

  // GSAP industries stagger
  const indGridRef   = useRef<HTMLDivElement>(null);
  const indTriggered = useRef(false);
  useEffect(() => {
    if (!indInView || indTriggered.current) return;
    indTriggered.current = true;
    const cards = indGridRef.current?.querySelectorAll(".industry-card");
    if (!cards) return;
    gsap.fromTo(cards,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.65, ease: "power2.out", stagger: 0.12 }
    );
  }, [indInView]);

  // Data
  const benefits = [
    { icon: Building2,  label: "CERTIFIED DEPLOYMENT ACROSS INDUSTRIES",            description: "We ensure smooth implementation of Logitech products tailored to specific industry requirements." },
    { icon: Video,      label: "PROVEN EXPERIENCE IN HYBRID WORK ENABLEMENT",        description: "We help organizations transform their communication infrastructure to support flexible, hybrid work environments." },
    { icon: Headphones, label: "DEDICATED AFTER-SALES SERVICE AND TECHNICAL SUPPORT", description: "Our support team provides ongoing assistance to keep your Logitech solutions performing at their best." },
  ];

  const solutions = [
    { title: "Video Conferencing Systems",          description: "Logitech video collaboration tools bring HD-quality video and clear audio to conference rooms of all sizes.",                                                                image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80" },
    { title: "Business Webcams and Headsets",       description: "Equip your teams with professional webcams and noise-cancelling headsets ideal for remote and hybrid work environments.",                                              image: "https://images.unsplash.com/photo-1590845947670-c009801ffa74?w=800&q=80" },
    { title: "Meeting Room Solutions",              description: "Deploy complete Logitech room solutions integrated with Microsoft Teams, Zoom, and Google Meet for consistent user experiences.",                                      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" },
    { title: "Keyboards, Mice & Ergonomic Accessories", description: "Improve workplace comfort and efficiency with Logitech's range of ergonomic and high-performance input devices.",                                               image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80" },
    { title: "Logitech Sync for Device Management", description: "Remotely monitor, manage, and update all your Logitech video collaboration devices through a single cloud-based platform.",                                          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80" },
    { title: "Logitech Digital Signage Solutions",  description: "Enhance communication and engagement in workplaces with digital signage systems powered by Logitech's high-quality display and streaming technology.",                image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80" },
  ];

  const industries = [
    { icon: Building2,    title: "Corporate Offices and Enterprises", description: "Reliable video collaboration tools to support seamless communication across distributed teams." },
    { icon: GraduationCap,title: "Education",                         description: "Enable virtual classrooms with high-quality audio and video for schools, universities, and training centers." },
    { icon: Heart,        title: "Healthcare",                         description: "Enhance remote consultation experiences with secure, user-friendly communication solutions." },
    { icon: Palette,      title: "Media & Design",                    description: "Support creative professionals with intuitive devices built for performance and flexibility." },
  ];

  const marqueeItems1 = ["Logitech Authorized Partner", "Hybrid Work", "Video Conferencing", "Meeting Room Solutions", "Sniper Systems", "India"];
  const marqueeItems2 = ["Webcams & Headsets", "Logitech Sync", "Microsoft Teams", "Zoom Rooms", "Google Meet", "Digital Signage"];

  return (
    <Layout>
      {showWhiteScreen && <WhiteScreenTransition onComplete={() => setShowWhiteScreen(false)} />}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-white pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">

            {/* GSAP word-stagger heading */}
            <h1
              ref={heroHeadingRef}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
            >
              {["Logitech", "Authorized", "Partner", "in", "India"].map((word, i) => (
                <span key={i} className="hero-word inline-block opacity-0 mr-[0.22em] last:mr-0">
                  {word}
                  {word === "Partner" && <br className="hidden sm:block" />}
                </span>
              ))}
            </h1>

            <FadeUp delay={0.3}>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium mb-4 sm:mb-6">
                Integrated Logitech Systems for Modern Businesses
              </p>
            </FadeUp>

            <FadeUp delay={0.45}>
              <p className="text-base sm:text-lg text-gray-700 max-w-5xl mx-auto leading-relaxed px-2 sm:px-0">
                Sniper Systems, a trusted Logitech Authorized Reseller in India, offers a complete portfolio of Logitech
                for Business solutions to meet the growing needs of hybrid work and enterprise collaboration. From enterprise
                meeting rooms to individual workstations, we help businesses of all sizes enhance communication and streamline
                collaboration with Logitech's innovative technology.
              </p>
            </FadeUp>
          </div>

          {/* Hero image */}
          <FadeUp delay={0.2}>
            <div className="relative rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden h-56 sm:h-96 md:h-[500px] lg:h-[600px]">
              <ParallaxImage
                src="https://i.postimg.cc/prQ2m2Ct/how-to-pair-your-bluetooth-keyboard-to-any-device.webp"
                alt="Logitech Collaboration"
                className="w-full h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 z-10">
                  <div className="bg-black/50 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                    <span className="text-[10px] sm:text-sm font-medium">LOGITECH</span>
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 sm:mb-16">
            <FadeUp>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                About Our<br />Partnership
              </h2>
            </FadeUp>
            <div className="w-full h-px bg-gray-300" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-16 sm:mb-20">
            <FadeUp>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider leading-relaxed">
                ABOUT OUR<br />PARTNERSHIP
              </h3>
            </FadeUp>
            <FadeUp delay={0.1} className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                As a certified Logitech partner, Sniper Systems delivers reliable, scalable, and user-friendly collaboration
                tools tailored for modern business environments. Our partnership with Logitech allows us to provide end-to-end
                support, from consultation and deployment to after-sales service.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                With a focus on performance and usability, Logitech solutions enable seamless hybrid work experiences,
                professional-grade video conferencing, and productivity-enhancing peripherals.
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
              Logitech Solutions Offered<br className="hidden sm:block" />
              by Sniper Systems
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
              Industries We Serve
            </h2>
          </FadeUp>

          <div ref={indGridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 md:gap-12">
            {industries.map((industry, index) => (
              <div key={index} className="industry-card opacity-0 space-y-3 sm:space-y-4 pb-6 sm:pb-8 border-b border-gray-700">
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
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-8 sm:mb-12 leading-tight">
              Collaboration<br />without boundaries
            </h2>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-56 sm:h-[400px] md:h-[550px] lg:h-[700px]">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1600&q=80"
                alt="Modern Collaboration"
                className="w-full h-full"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <FadeUp className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp className="mb-8 sm:mb-12">
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold mb-4 sm:mb-6 leading-tight">
              Have an idea?<br />We make<br className="sm:hidden" /> it happen
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
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

export default Logitech;
