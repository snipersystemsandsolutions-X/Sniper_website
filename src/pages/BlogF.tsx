import { Layout } from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    ArrowRight,
    Calendar,
    Clock,
    Tag,
    User
} from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.16, 1, 0.3, 1] as const;

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
  return <div ref={ref} className="fixed inset-0 bg-white z-[9999] will-change-transform" />;
};

const FadeUp = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
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

const MetaPill = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium">
    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
    <span>{label}</span>
  </div>
);

const MarqueeTicker = ({
  items,
  reverse = false,
}: {
  items: string[];
  reverse?: boolean;
}) => {
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

const RelatedCard = ({
  post,
}: {
  post: { title: string; category: string; image: string; readTime: string };
}) => (
  <div className="group bg-white rounded-3xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 h-full">
    <div className="relative h-44 sm:h-52 overflow-hidden">
      <img
        src={post.image}
        alt={post.title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute top-4 left-4">
        <span className="bg-black/70 text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-sm">
          {post.category}
        </span>
      </div>
    </div>
    <div className="p-5 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-snug group-hover:underline underline-offset-2">
        {post.title}
      </h3>
      <span className="text-xs text-gray-500 flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5" /> {post.readTime}
      </span>
    </div>
  </div>
);

const TocItem = ({
  index,
  title,
  id,
  inView,
}: {
  index: number;
  title: string;
  id: string;
  inView: boolean;
}) => {
  const lineRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!inView || !lineRef.current) return;
    gsap.fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 1, ease: "power3.out", delay: 0.15 + index * 0.08 }
    );
  }, [inView, index]);

  return (
    <motion.div
      className="relative pb-5 last:pb-0"
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, ease, delay: 0.15 + index * 0.07 }}
    >
      <a
        href={`#${id}`}
        onClick={(e) => {
          e.preventDefault();
          const target = document.getElementById(id);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            window.history.pushState(null, "", `#${id}`);
          }
        }}
        className="group flex items-start gap-4 cursor-pointer"
      >
        <span className="text-gray-500 text-xs font-mono mt-1 flex-shrink-0">0{index + 1}</span>
        <span className="text-white text-sm sm:text-base font-medium leading-relaxed group-hover:text-blue-400 transition-colors">
          {title}
        </span>
      </a>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-700 overflow-hidden">
        <div
          ref={lineRef}
          className="h-full bg-gradient-to-r from-transparent via-gray-400 to-transparent"
          style={{ transform: "scaleX(0)", willChange: "transform" }}
        />
      </div>
    </motion.div>
  );
};

const BlogF = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const heroRef = useRef(null);
  const tocRef = useRef(null);
  const relatedRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-60px" });
  const tocInView = useInView(tocRef, { once: true, margin: "-80px" });
  const relatedInView = useInView(relatedRef, { once: true, margin: "-60px" });

  useEffect(() => {
    const el = heroRef.current as HTMLDivElement | null;
    if (!el) return;
    const words = el.querySelectorAll(".hero-word");
    gsap.fromTo(
      words,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.07, delay: 1.1 }
    );
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const relatedPosts = [
    {
      title: "A Smarter Way to Document Work",
      category: "Adobe Acrobat",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      readTime: "8 min read",
    },
    {
      title: "Cybersecurity in the Age of Remote Work",
      category: "Security",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
      readTime: "9 min read",
    },
    {
      title: "Mobile Device Management Best Practices",
      category: "Device Management",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
      readTime: "7 min read",
    },
  ];

  const tocItems = [
    { title: "The cybersecurity challenge facing modern organizations", id: "cybersecurity-challenge" },
    { title: "What is Microsoft Threat Protection?", id: "what-is-microsoft-threat-protection" },
    { title: "Why traditional security approaches are no longer enough", id: "why-traditional-security-fails" },
    { title: "Identity, endpoint, email, and cloud security", id: "identity-endpoint-email-cloud" },
    { title: "Benefits of unified threat protection", id: "benefits-unified-threat-protection" },
    { title: "Supporting secure hybrid work environments", id: "secure-hybrid-work" },
    { title: "The future of integrated cybersecurity", id: "future-of-cybersecurity" },
    { title: "Conclusion", id: "conclusion" },
  ];

  const marqueeItems1 = [
    "Microsoft Threat Protection",
    "Unified Security",
    "Enterprise Defense",
    "Cloud Visibility",
    "Identity Protection",
    "Endpoint Security",
  ];

  const marqueeItems2 = [
    "Alert Correlation",
    "Automated Response",
    "Email Protection",
    "Hybrid Work",
    "Security Intelligence",
    "Insider Threat Detection",
  ];

  return (
    <Layout>
      {showWhiteScreen && <WhiteScreenTransition onComplete={() => setShowWhiteScreen(false)} />}

      <Helmet>
        <title>Microsoft Threat Protection: Strengthening Enterprise Security Against Modern Cyber Threats | Sniper Systems</title>
        <meta
          name="description"
          content="Learn how Microsoft Threat Protection delivers unified visibility and faster response across identity, endpoints, email, cloud, and data for modern enterprise security."
        />
        <meta
          name="keywords"
          content="Microsoft Threat Protection, unified threat protection, enterprise cybersecurity, hybrid work security, cloud security, identity protection"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://sniperindia.com/blog/microsoft-threat-protection-strengthening-enterprise-security" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Microsoft Threat Protection: Strengthening Enterprise Security Against Modern Cyber Threats | Sniper Systems" />
        <meta property="og:description" content="Learn how Microsoft Threat Protection delivers unified visibility and faster response across identity, endpoints, email, cloud, and data for modern enterprise security." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80" />
        <meta property="og:url" content="https://sniperindia.com/blog/microsoft-threat-protection-strengthening-enterprise-security" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Microsoft Threat Protection: Strengthening Enterprise Security Against Modern Cyber Threats | Sniper Systems" />
        <meta name="twitter:description" content="Learn how Microsoft Threat Protection delivers unified visibility and faster response across identity, endpoints, email, cloud, and data for modern enterprise security." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80" />
      </Helmet>

      <section className="relative bg-white pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16" ref={heroRef}>
            <motion.div
              className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease, delay: 0.9 }}
            >
              <MetaPill icon={Tag} label="Microsoft Threat Protection" />
              <MetaPill icon={Calendar} label="June 22, 2026" />
              <MetaPill icon={Clock} label="9 min read" />
              <MetaPill icon={User} label="Sniper Systems" />
            </motion.div>

            <h1
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              aria-label="Microsoft Threat Protection: Strengthening Enterprise Security Against Modern Cyber Threats"
            >
              {[
                "Microsoft",
                "Threat",
                "Protection:",
                "Strengthening",
                "Enterprise",
                "Security",
                "Against",
                "Modern",
                "Cyber",
                "Threats",
              ].map((word, i) => (
                <span key={i} className="hero-word inline-block opacity-0 mr-[0.22em] last:mr-0">
                  {word}
                  {(word === "Protection:" || word === "Security") && <br className="hidden sm:block" />}
                </span>
              ))}
            </h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 1.1 }}
            >
              Microsoft Threat Protection unifies identity, endpoints, email, cloud, and data signals so organizations can detect, investigate, and respond to modern cyber threats with speed and clarity.
            </motion.p>
          </div>

          <motion.div
            className="max-w-6xl mx-auto pt-6 sm:pt-8 lg:pt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease, delay: 0.25 }}
          >
            <div className="relative shadow-2xl overflow-hidden h-72 sm:h-96 rounded-[2rem]">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80"
                alt="Enterprise cybersecurity unified dashboard"
                className="w-full h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </ParallaxImage>
            </div>
          </motion.div>
        </div>
      </section>

      <MarqueeTicker items={marqueeItems1} />

      <section className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_0.9fr] gap-10">
            <div>
              <FadeUp>
                <h2 className="text-4xl sm:text-5xl font-semibold mb-6 leading-tight">
                  The cybersecurity challenge facing modern organizations
                </h2>
              </FadeUp>
              <FadeUp delay={0.1}>
                <p className="text-base sm:text-lg leading-relaxed text-gray-200 mb-6">
                  Cyber threats have become more sophisticated, targeted, and difficult to detect than ever before. Hybrid work, cloud platforms, and digital collaboration tools have expanded the attack surface, while attackers rely on automation and identity-based tactics to move faster.
                </p>
                <ul className="grid gap-3 text-sm sm:text-base text-gray-300">
                  <li>• Phishing attacks</li>
                  <li>• Ransomware incidents</li>
                  <li>• Credential theft</li>
                  <li>• Endpoint compromise</li>
                  <li>• Email-based attacks</li>
                  <li>• Cloud security risks</li>
                  <li>• Insider threats</li>
                </ul>
              </FadeUp>
            </div>
            <div className="rounded-[2rem] bg-white/5 border border-white/10 p-8">
              <FadeUp>
                <h3 className="text-xl font-semibold text-white mb-4">Why unified security matters</h3>
                <p className="text-gray-300 leading-relaxed">
                  Traditional tools often operate in isolation, producing disconnected alerts and creating blind spots for security operations teams. Modern enterprises need a platform that correlates signals across users, devices, applications, email, and data.
                </p>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-[0.7fr_0.45fr] items-start">
          <div>
            <FadeUp>
              <h2 className="text-4xl sm:text-5xl font-semibold mb-8 leading-tight">
                What is Microsoft Threat Protection?
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                Microsoft Threat Protection brings together identity protection, endpoint security, email defense, cloud visibility, and data protection into a single threat management experience. It correlates signals from across the digital environment so security teams can see the full story behind a threat.
              </p>
            </FadeUp>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl border border-gray-200 p-6 bg-slate-50">
                <h3 className="text-xl font-semibold mb-3">Identity Protection</h3>
                <p className="text-gray-700 leading-relaxed">
                  Detect suspicious sign-ins, credential theft attempts, and identity-based attacks before they escalate. Identity is now the most common target for cybercriminals.
                </p>
              </div>
              <div className="rounded-3xl border border-gray-200 p-6 bg-slate-50">
                <h3 className="text-xl font-semibold mb-3">Endpoint Protection</h3>
                <p className="text-gray-700 leading-relaxed">
                  Protect laptops, desktops, and mobile devices with advanced threat detection that identifies malicious behavior and helps respond quickly to compromises.
                </p>
              </div>
              <div className="rounded-3xl border border-gray-200 p-6 bg-slate-50">
                <h3 className="text-xl font-semibold mb-3">Email & Collaboration</h3>
                <p className="text-gray-700 leading-relaxed">
                  Secure email communications, attachments, and links while reducing phishing and malware risk across collaboration platforms.
                </p>
              </div>
              <div className="rounded-3xl border border-gray-200 p-6 bg-slate-50">
                <h3 className="text-xl font-semibold mb-3">Cloud Security</h3>
                <p className="text-gray-700 leading-relaxed">
                  Monitor cloud applications, detect risky behavior, and identify threats across cloud workloads with deeper visibility and context.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] bg-gray-950 text-white p-10 shadow-2xl">
            <h3 className="text-2xl font-semibold mb-5">Security realities today</h3>
            <ul className="space-y-3 text-gray-300">
              <li>• Security silos slow down investigations and increase risk.</li>
              <li>• Alert fatigue makes it harder to find real threats.</li>
              <li>• Limited visibility leaves critical indicators hidden.</li>
              <li>• Slow response increases damage and recovery time.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid gap-12 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-10 shadow-xl border border-gray-200">
            <FadeUp>
              <h2 className="text-4xl sm:text-5xl font-semibold mb-6 leading-tight">
                Benefits of unified threat protection
              </h2>
            </FadeUp>
            <ul className="space-y-6 text-gray-700 text-base sm:text-lg">
              <li>
                <strong className="font-semibold">Faster threat detection.</strong> Correlated security intelligence helps organizations identify threats earlier in the attack lifecycle.
              </li>
              <li>
                <strong className="font-semibold">Improved investigation capabilities.</strong> Security teams can view related incidents in context instead of piecing together alerts from disconnected tools.
              </li>
              <li>
                <strong className="font-semibold">Better incident response.</strong> Automated workflows help teams act faster and reduce the impact of attacks.
              </li>
              <li>
                <strong className="font-semibold">Enhanced visibility.</strong> Organizations gain a clearer understanding of their security posture across users, devices, applications, and data.
              </li>
            </ul>
          </div>
          <div className="rounded-[2rem] bg-white p-10 shadow-xl border border-gray-200">
            <FadeUp delay={0.1}>
              <h3 className="text-4xl font-semibold mb-6 leading-tight">
                Protect hybrid work without slowing productivity
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Remote employees, mobile devices, and cloud workloads need protection that adapts without blocking collaboration. Unified threat protection helps secure every access point while giving teams the freedom to work safely.
              </p>
              <div className="space-y-4 text-gray-700 text-base sm:text-lg">
                <p>• Secure remote employees, cloud workloads, mobile devices, collaboration platforms, and corporate identities.</p>
                <p>• Keep operations resilient across hybrid work environments.</p>
                <p>• Improve security posture while maintaining employee productivity.</p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <MarqueeTicker items={marqueeItems2} reverse />

      <section className="bg-white py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">The future of cybersecurity</p>
              <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900 leading-tight">
                The future of cybersecurity is integrated
              </h2>
            </div>
          </FadeUp>
          <div className="grid gap-10 lg:grid-cols-3">
            <FadeUp>
              <div className="rounded-3xl border border-gray-200 p-8 bg-slate-50">
                <h3 className="text-xl font-semibold mb-4">Centralized visibility</h3>
                <p className="text-gray-700 leading-relaxed">
                  Security teams need a single source of truth for incidents across identities, devices, applications, and data.
                </p>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="rounded-3xl border border-gray-200 p-8 bg-slate-50">
                <h3 className="text-xl font-semibold mb-4">Intelligent threat detection</h3>
                <p className="text-gray-700 leading-relaxed">
                  Platforms that learn from behavior and adapt to evolving threats will be essential for modern enterprises.
                </p>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="rounded-3xl border border-gray-200 p-8 bg-slate-50">
                <h3 className="text-xl font-semibold mb-4">Automated response</h3>
                <p className="text-gray-700 leading-relaxed">
                  Fast, automated workflows reduce manual effort and help security teams focus on the highest priorities.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="bg-black text-white py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-10 lg:grid-cols-[0.65fr_0.35fr] items-start">
            <div>
              <FadeUp>
                <h2 className="text-4xl sm:text-5xl font-semibold mb-6 leading-tight">Conclusion</h2>
              </FadeUp>
              <FadeUp delay={0.1}>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Cybersecurity is no longer just an IT concern — it is a business priority. Modern enterprises need comprehensive visibility, faster threat detection, and streamlined incident response to protect users, data, and operations.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Microsoft Threat Protection offers a unified approach that helps organizations break down security silos and respond to sophisticated attacks before significant damage occurs.
                </p>
              </FadeUp>
            </div>
            <div className="rounded-[2rem] bg-white p-10 text-gray-900 border border-gray-200 shadow-2xl">
              <FadeUp>
                <h3 className="text-2xl font-semibold mb-4">Key takeaways</h3>
                <ul className="space-y-4 text-gray-700 text-base">
                  <li>• Unified protection reduces alert fatigue and improves investigation speed.</li>
                  <li>• Integrated security is critical for hybrid work and cloud-first organizations.</li>
                  <li>• Visibility across identity, endpoint, email, and cloud is essential.</li>
                  <li>• Automated response helps teams act faster and reduce business impact.</li>
                </ul>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-[0.55fr_0.45fr] items-center">
          <div>
            <FadeUp>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 mb-4">AI-powered security</p>
              <h2 className="text-4xl sm:text-5xl font-semibold text-white mb-4 leading-tight">
                AI visuals that bring threat protection to life
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                This illustration highlights how artificial intelligence analyzes signals from identity, endpoints, email, and cloud services to detect threats faster and reduce blind spots across the enterprise.
              </p>
            </FadeUp>
          </div>
          <FadeUp delay={0.1}>
            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl border border-white/10 h-80 sm:h-[420px]">
              <img
                src="https://i.ibb.co/zh0tpFKQ/Navigating-the-Ethics-of-AI-Visuals-Nine-Considerations-for-Marketers.png" 
                alt="AI security visualization with threat analytics dashboard"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="bg-white py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center" ref={relatedRef}>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">Related reading</p>
            <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900 leading-tight">More from the Sniper Systems blog</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((post) => (
              <RelatedCard key={post.title} post={post} />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-14 h-14 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 z-50 shadow-lg"
            aria-label="Scroll to top"
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowRight className="w-6 h-6 -rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default BlogF;
