import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Heart,
  Lightbulb,
  Mail,
  Phone,
  Rocket,
  Shield,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.16, 1, 0.3, 1] as const;

// ========================================================
// WHITE SCREEN TRANSITION
// ========================================================
const WhiteScreenTransition = ({ onComplete }: { onComplete: () => void }) => (
  <motion.div
    className="fixed inset-0 bg-white z-[9999]"
    initial={{ y: 0 }}
    animate={{ y: "-105%" }}
    transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
    onAnimationComplete={onComplete}
  />
);

// ========================================================
// SPRING BADGE
// ========================================================
const SpringBadge = ({ children }: { children: React.ReactNode }) => (
  <motion.span
    className="inline-block px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.15em] uppercase cursor-default border border-black/10 bg-gray-100 text-gray-700"
    whileHover={{ scale: 1.08, backgroundColor: "#111", color: "#fff" }}
    transition={{ type: "spring", stiffness: 400, damping: 18 }}
  >
    {children}
  </motion.span>
);

// ========================================================
// GSAP MARQUEE TICKER
// ========================================================
const MarqueeTicker = () => {
  const trackRef = useRef<HTMLDivElement>(null);

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
    const track = trackRef.current;
    if (!track) return;
    const totalWidth = track.scrollWidth / 2;
    const tween = gsap.to(track, { x: `-${totalWidth}px`, duration: 26, ease: "none", repeat: -1 });
    return () => tween.kill();
  }, []);

  const items = [
    "Sales", "Account Management", "IT Infrastructure", "Cloud Solutions",
    "Design", "Customer Support", "Finance & Accounts", "Operations",
    "Project Management", "Pre-Sales Engineering",
  ];
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden bg-gray-950 py-4 sm:py-5 my-0 border-y border-gray-800">
      <div ref={trackRef} className="flex gap-8 sm:gap-12 whitespace-nowrap will-change-transform">
        {doubled.map((text, i) => (
          <span
            key={i}
            className="flex items-center gap-8 sm:gap-12 text-xs sm:text-sm font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-gray-400"
          >
            {text}
            <span className="w-1.5 h-1.5 rounded-full bg-gray-600 inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
};

// ========================================================
// GSAP PARALLAX IMAGE
// ========================================================
const ParallaxImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;
    const tween = gsap.fromTo(img, { yPercent: -8 }, {
      yPercent: 8, ease: "none",
      scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);
  return (
    <div ref={wrapRef} className={`overflow-hidden ${className ?? ""}`}>
      <img ref={imgRef} src={src} alt={alt} className="w-full h-full object-cover scale-110 will-change-transform" />
    </div>
  );
};

// ========================================================
// STAT CARD
// ========================================================
const SpringStatCard = ({ number, label, index, trigger }: { number: string; label: string; index: number; trigger: boolean }) => (
  <motion.div
    className="text-center py-8 sm:py-10 border-r border-gray-200 last:border-0"
    initial={{ opacity: 0, y: 40 }}
    animate={trigger ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
    transition={{ duration: 0.7, ease, delay: 0.2 + index * 0.1 }}
    whileHover={{ y: -6 }}
  >
    <div className="text-4xl sm:text-5xl md:text-6xl font-semibold text-gray-900 mb-2">{number}</div>
    <p className="text-gray-500 text-sm sm:text-base uppercase tracking-wider font-medium">{label}</p>
  </motion.div>
);

// ========================================================
// WHY JOIN CARD
// ========================================================
interface WhyCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
  trigger: boolean;
}

const WhyCard = ({ icon: Icon, title, description, index, trigger }: WhyCardProps) => (
  <motion.div
    className="group relative border border-gray-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 bg-white hover:border-gray-300 hover:shadow-xl transition-all duration-400 overflow-hidden"
    initial={{ opacity: 0, y: 40 }}
    animate={trigger ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
    transition={{ duration: 0.65, ease, delay: 0.08 + index * 0.07 }}
    whileHover={{ y: -5 }}
  >
    <motion.div
      className="absolute inset-0 bg-gray-950 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl"
    />
    <div className="relative z-10">
      <motion.div
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gray-100 group-hover:bg-white/10 flex items-center justify-center mb-5 transition-colors duration-300"
        whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        <Icon className="w-6 h-6 text-gray-800 group-hover:text-white transition-colors duration-300" />
      </motion.div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-white mb-3 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 group-hover:text-gray-300 leading-relaxed transition-colors duration-300">
        {description}
      </p>
    </div>
  </motion.div>
);

// ========================================================
// JOB CARD
// ========================================================
interface JobCardProps {
  title: string;
  department: string;
  type: string;
  location: string;
  index: number;
  trigger: boolean;
}

const JobCard = ({ title, department, type, location, index, trigger }: JobCardProps) => (
  <motion.div
    className="group relative border-b border-gray-200 last:border-0"
    initial={{ opacity: 0, y: 35 }}
    animate={trigger ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
    transition={{ duration: 0.65, ease, delay: 0.08 + index * 0.07 }}
  >
    <a
      href="mailto:hr@sniperindia.com"
      className="block py-7 sm:py-9"
    >
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-center">
        {/* Index */}
        <div className="sm:col-span-1 hidden sm:block">
          <span className="text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Title + dept */}
        <div className="sm:col-span-5">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 leading-tight group-hover:text-gray-500 transition-colors duration-300 mb-1.5">
            {title}
          </h3>
          <span className="text-xs font-bold tracking-[0.15em] uppercase text-gray-400">{department}</span>
        </div>

        {/* Tags */}
        <div className="sm:col-span-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.12em] uppercase bg-gray-100 text-gray-600 border border-gray-200">
            {type}
          </span>

        </div>

        {/* Arrow */}
        <div className="sm:col-span-2 flex justify-end">
          <motion.div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:border-gray-900 group-hover:bg-gray-900 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white -rotate-45 transition-colors duration-300" />
          </motion.div>
        </div>
      </div>
    </a>
  </motion.div>
);

// ========================================================
// VALUE PILL (culture section)
// ========================================================
const ValuePill = ({ icon: Icon, label, index, trigger }: { icon: React.ElementType; label: string; index: number; trigger: boolean }) => (
  <motion.div
    className="flex items-center gap-3 px-5 py-3 rounded-full border border-gray-200 bg-white hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 cursor-default group"
    initial={{ opacity: 0, scale: 0.85 }}
    animate={trigger ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
    transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.1 + index * 0.07 }}
    whileHover={{ scale: 1.05 }}
  >
    <Icon className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300" />
    <span className="text-sm font-bold tracking-[0.12em] uppercase text-gray-700 group-hover:text-white transition-colors duration-300">
      {label}
    </span>
  </motion.div>
);

// ========================================================
// ORBITAL RINGS
// ========================================================
const OrbitalRings = () => (
  <div className="absolute inset-0 bg-black overflow-hidden">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] md:w-[1000px] md:h-[1000px]">
      <div className="absolute inset-0 animate-[spin_20s_linear_infinite]"><div className="absolute inset-0 rounded-full border-2 border-white blur-sm" /><div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-purple-400 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.8)]" /></div>
      <div className="absolute inset-8 animate-[spin_15s_linear_infinite_reverse]"><div className="absolute inset-0 rounded-full border-2 border-white blur-sm" /><div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]" /></div>
      <div className="absolute inset-16 animate-[spin_12s_linear_infinite]"><div className="absolute inset-0 rounded-full border-2 border blur-[2px]" /><div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-pink-400 rounded-full shadow-[0_0_18px_rgba(244,114,182,0.9)]" /></div>
      <div className="absolute inset-24 animate-[spin_9s_linear_infinite_reverse]"><div className="absolute inset-0 rounded-full border-2 border blur-[1px]" /><div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_12px_rgba(96,165,250,0.9)]" /></div>
      <div className="absolute inset-32 animate-[spin_7s_linear_infinite]"><div className="absolute inset-0 rounded-full border-2 border blur-[1px]" /><div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-violet-400 rounded-full shadow-[0_0_10px_rgba(167,139,250,1)]" /></div>
      <div className="absolute inset-40 animate-[spin_5s_linear_infinite_reverse]"><div className="absolute inset-0 rounded-full border-2 border" /><div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-fuchsia-400 rounded-full shadow-[0_0_15px_rgba(232,121,249,1)]" /></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl" />
        <div className="absolute w-16 h-16 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-xl" />
        <div className="absolute w-8 h-8 bg-white/50 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.5)]" />
      </div>
    </div>
  </div>
);

// ========================================================
// APPLY SECTION (dark card)
// ========================================================
const ApplySection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
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
    const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);
    return () => { btn.removeEventListener("mousemove", onMove); btn.removeEventListener("mouseleave", onLeave); };
  }, []);

  return (
    <motion.section
      ref={ref}
      className="relative bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12 overflow-hidden"
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease }}
    >
      <div className="hidden sm:block"><OrbitalRings /></div>
      <div className="block sm:hidden absolute inset-0 bg-black">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">
          {/* Left: headline */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
          >
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-6">Apply Now</p>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-semibold mb-6 leading-tight text-white">
              Ready to<br />build your<br />career?
            </h2>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-4">
              Drop us your resume and tell us what excites you. We read every application and get back to every candidate.
            </p>
          </motion.div>

          {/* Right: contact details */}
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.3 }}
          >
            {/* Email */}
            <motion.a
              href="mailto:hr@sniperindia.com"
              className="group flex items-center gap-5 p-5 sm:p-6 rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
              whileHover={{ x: 6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors duration-300">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-[0.15em] uppercase text-gray-500 mb-1">Email your resume</p>
                <p className="text-base sm:text-lg font-semibold text-white">hr@sniperindia.com</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white ml-auto -rotate-45 transition-colors duration-300" />
            </motion.a>

            {/* Phone */}
            <motion.a
              href="tel:+918939301100"
              className="group flex items-center gap-5 p-5 sm:p-6 rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
              whileHover={{ x: 6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors duration-300">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-[0.15em] uppercase text-gray-500 mb-1">Call us directly</p>
                <p className="text-base sm:text-lg font-semibold text-white">+91 89393 01100</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white ml-auto -rotate-45 transition-colors duration-300" />
            </motion.a>

            {/* Contact page */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease, delay: 0.5 }}
            >
              <a
                ref={btnRef as any}
                href="/contact"
                className="inline-flex items-center gap-3 px-8 sm:px-10 py-3 sm:py-4 border-2 border-white rounded-full text-white font-medium text-base hover:bg-white hover:text-black transition-colors duration-300 will-change-transform relative"
              >
                OR VISIT CONTACT PAGE
                <ArrowRight className="w-4 h-4 -rotate-45" />
                <span className="absolute inset-[-10px] rounded-full" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

// ========================================================
// DATA
// ========================================================
const whyJoin = [
  {
    icon: Award,
    title: "Work with Industry Leaders",
    description: "Collaborate directly with global technology brands — Apple, Adobe, Autodesk, Cisco, NVIDIA and more — delivering real enterprise-grade solutions that power India's top organisations.",
  },
  {
    icon: TrendingUp,
    title: "Accelerate Your Growth",
    description: "We invest heavily in your future through vendor certifications, structured learning paths, and hands-on exposure to complex enterprise IT projects from day one.",
  },
  {
    icon: Users,
    title: "Collaborative by Design",
    description: "Our flat, open culture means your ideas surface fast and get acted on. Every team member has a voice — and every voice shapes how we work and win.",
  },
  {
    icon: Heart,
    title: "Life Beyond Work",
    description: "We build careers without burning people out. Flexible schedules, a healthy office culture, and genuine respect for personal time make Sniper a place people stay.",
  },
  {
    icon: Target,
    title: "Make Real Impact",
    description: "From startups to Fortune 500s, your work lands in live production environments — not sandboxes. You will see the direct effect of your contributions on real businesses.",
  },
  {
    icon: Rocket,
    title: "Fast-Moving Environment",
    description: "As one of Chennai's fastest-growing IT solutions providers, there's no ceiling here. Roles evolve, responsibilities expand, and high performers move up quickly.",
  },
];

const openings = [
  { title: "Sales Executive — IT Solutions", department: "Business Development", type: "Full-time",  },
  { title: "Inside Sales Representative (ISR)", department: "Business Development", type: "Full-time",  },
  { title: "Account Manager", department: "Client Success", type: "Full-time",  },
  { title: "Graphic Designer", department: "Marketing & Creative", type: "Full-time",  },
  { title: "Customer Support Executive", department: "Operations", type: "Full-time",  },
  { title: "Accounts Executive", department: "Finance", type: "Full-time",  },
];

const cultureValues = [
  { icon: Lightbulb, label: "Innovation" },
  { icon: Shield, label: "Integrity" },
  { icon: Star, label: "Excellence" },
  { icon: Zap, label: "Customer Success" },
  { icon: BookOpen, label: "Continuous Learning" },
  { icon: Briefcase, label: "Ownership" },
];

// ========================================================
// MAIN CAREERS PAGE
// ========================================================
const Careers = () => {
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // GSAP hero heading
  const gsapHeroRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = gsapHeroRef.current;
    if (!el) return;
    const words = el.querySelectorAll(".gsap-word");
    gsap.fromTo(words,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.08, delay: 1.4 }
    );
  }, []);

  const stats = [
    { number: "20+", label: "Years in Business" },
    { number: "6+",  label: "Open Roles" },
    { number: "1900+", label: "Clients Served" },
    { number: "100%", label: "Growth Mindset" },
  ];

  const badgeLabels = ["Sales", "Design", "Finance", "Operations", "Pre-Sales", "Support", "Management"];

  const heroRef    = useRef(null);
  const statsRef   = useRef(null);
  const whyRef     = useRef(null);
  const jobsRef    = useRef(null);
  const cultureRef = useRef(null);
  const featRef    = useRef(null);

  const heroInView    = useInView(heroRef,    { once: true, margin: "-60px" });
  const statsInView   = useInView(statsRef,   { once: true, margin: "-80px" });
  const whyInView     = useInView(whyRef,     { once: true, margin: "-60px" });
  const jobsInView    = useInView(jobsRef,    { once: true, margin: "-60px" });
  const cultureInView = useInView(cultureRef, { once: true, margin: "-60px" });
  const featInView    = useInView(featRef,    { once: true, margin: "-60px" });

  return (
    <Layout>
      <>
        <title>Careers at Sniper Systems | Build Your IT Career in Chennai</title>
        <meta
          name="description"
          content="Join Sniper Systems and Solutions in Chennai. Explore open roles in IT sales, account management, design, operations, and more. Grow your career with India's leading IT solutions provider."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://sniperindia.com/careers/" />
        <meta name="geo.region" content="IN-TN" />
        <meta name="geo.placename" content="Chennai" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Careers at Sniper Systems | IT Jobs Chennai" />
        <meta property="og:description" content="Build your career at Sniper Systems — Chennai's leading enterprise IT solutions provider. Open roles in Sales, Design, Operations and more." />
        <meta property="og:url" content="https://sniperindia.com/careers/" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "JobPosting",
            "title": "Multiple Positions",
            "hiringOrganization": {
              "@type": "Organization",
              "name": "Sniper Systems and Solutions Pvt. Ltd.",
              "url": "https://sniperindia.com"
            },
            "jobLocation": {
              "@type": "Place",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Chennai",
                "addressRegion": "Tamil Nadu",
                "addressCountry": "IN"
              }
            },
            "employmentType": "FULL_TIME"
          }
        `}</script>
      </>

      {showWhiteScreen && <WhiteScreenTransition onComplete={() => setShowWhiteScreen(false)} />}

      {/* ── Hero ── */}
      <section className="relative bg-white pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-white opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16" ref={heroRef}>
            <h1
              ref={gsapHeroRef}
              className="text-4xl sm:text-6xl md:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight font-sans"
            >
              {["Build Your", "Career", "With Us"].map((word, i) => (
                <span
                  key={i}
                  className="gsap-word inline-block opacity-0 mr-[0.2em] sm:mr-[0.25em] last:mr-0"
                  style={{ overflow: "visible" }}
                >
                  {word}
                  {word === "Career" ? <br /> : null}
                </span>
              ))}
            </h1>

            <motion.p
              className="text-base sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0 mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 1.9 }}
            >
              At Sniper Systems, we believe careers should be built with intention — not just filled with tasks.
              Join a team of innovators and technologists shaping enterprise IT across India.
            </motion.p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {badgeLabels.map((label, i) => (
                <motion.span
                  key={label}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 2.1 + i * 0.08 }}
                >
                  <SpringBadge>{label}</SpringBadge>
                </motion.span>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div className="max-w-6xl mx-auto pt-8 sm:pt-12">
            <motion.div
              className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden h-60 sm:h-96 md:h-[500px] lg:h-[580px]"
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 1, ease, delay: 0.25 }}
              whileHover={{ scale: 1.01 }}
            >
              <ParallaxImage
                src="https://i.postimg.cc/XNRC2N15/hr-text1.jpg"
                alt="Careers at Sniper Systems"
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              <motion.div
                className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: 1.2 }}
              >
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5">
                  <Briefcase className="w-4 h-4 text-white" />
                  <span className="text-white text-xs font-bold tracking-[0.15em] uppercase"> Open Positions </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GSAP Marquee */}
      <MarqueeTicker />

      {/* ── Stats Strip ── */}
      <section className="bg-white py-10 sm:py-16 px-4 sm:px-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto" ref={statsRef}>
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {stats.map((s, i) => (
              <SpringStatCard key={i} {...s} index={i} trigger={statsInView} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Intro Copy ── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-start">
            <motion.h2
              className="text-4xl sm:text-6xl md:text-7xl font-semibold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease }}
            >
              More than<br />a job.<br />A career.
            </motion.h2>
            <motion.div
              className="space-y-5 sm:space-y-6 pt-2 sm:pt-4"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease, delay: 0.15 }}
            >
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Sniper Systems and Solutions is one of Chennai's most respected enterprise IT providers — with over
                20 years of deep partnerships with global technology leaders and a client base that spans startups,
                institutions, and large enterprises.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                When you join us, you join a company where ambition is met with opportunity. Where you work on
                real projects, for real clients, with real accountability — and where your growth is tracked
                and actively invested in.
              </p>
              <motion.div
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <a
                  href="#openings"
                  className="inline-flex items-center gap-3 text-gray-900 font-semibold text-base sm:text-lg border-b-2 border-gray-900 pb-0.5 hover:gap-5 transition-all duration-300"
                >
                  View open roles <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Why Join ── */}
      <section className="bg-gray-50/60 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" ref={whyRef}>
          <motion.div
            className="flex items-center gap-4 mb-10 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={whyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
          >
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">Why Join Sniper</span>
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">6 Reasons</span>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {whyJoin.map((item, i) => (
              <WhyCard key={item.title} {...item} index={i} trigger={whyInView} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Current Openings ── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6" id="openings">
        <div className="max-w-6xl mx-auto" ref={jobsRef}>
          <motion.div
            className="flex items-center gap-4 mb-10 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={jobsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
          >
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">Current Openings</span>
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">{openings.length} Positions</span>
          </motion.div>

          <div>
            {openings.map((job, i) => (
              <JobCard key={job.title} {...job} index={i} trigger={jobsInView} />
            ))}
          </div>

          <motion.p
            className="text-sm text-gray-400 mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={jobsInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, ease, delay: 0.6 }}
          >
            Don't see the right fit? Email us anyway — we're always looking for exceptional people.
          </motion.p>
        </div>
      </section>

      {/* ── Life at Sniper — dark card ── */}
      <motion.section
        className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease }}
        ref={featRef}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div>
              <motion.p
                className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-6"
                initial={{ opacity: 0 }}
                animate={featInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, ease, delay: 0.1 }}
              >
                Life at Sniper
              </motion.p>
              <motion.h2
                className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white leading-tight mb-6 sm:mb-8"
                initial={{ opacity: 0, y: 40 }}
                animate={featInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease, delay: 0.15 }}
              >
                Innovators.<br />Problem-solvers.<br />Technologists.
              </motion.h2>
              <motion.p
                className="text-base sm:text-lg text-gray-300 leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={featInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: 0.25 }}
              >
                We're more than an IT company. We're a diverse team united by a passion for technology
                and a shared ambition to deliver outstanding outcomes for every client we serve.
                With growing operations in Chennai and beyond, every project stretches your thinking.
              </motion.p>
              <motion.p
                className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-5"
                initial={{ opacity: 0 }}
                animate={featInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, ease, delay: 0.3 }}
              >
                Our Culture
              </motion.p>
              <motion.div
                ref={cultureRef}
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={featInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: 0.35 }}
              >
                {cultureValues.map((v, i) => (
                  <ValuePill key={v.label} {...v} index={i} trigger={featInView} />
                ))}
              </motion.div>
            </div>

            <motion.div
              className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-64 sm:h-80 lg:h-[460px]"
              initial={{ opacity: 0, x: 40 }}
              animate={featInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <ParallaxImage
                src="https://i.postimg.cc/wTrhYcBw/21404.jpg"
                alt="Life at Sniper Systems"
                className="w-full h-full rounded-2xl sm:rounded-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none rounded-2xl sm:rounded-3xl" />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ── Apply Section ── */}
      <ApplySection />

      {/* ── Scroll to Top ── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 sm:bottom-8 sm:left-8 w-12 h-12 sm:w-14 sm:h-14 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 z-50 shadow-lg"
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

export default Careers;
