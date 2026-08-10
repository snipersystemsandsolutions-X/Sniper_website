import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Home, Search, Wifi } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Globe404 } from "@/components/ui/globe-404";

// ── Animation variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const globeVariants = {
  hidden: { scale: 0.82, opacity: 0, y: 12 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: "easeOut" },
  },
  floating: {
    y: [0, -8, 0],
    transition: {
      duration: 5,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

// ── Component ───────────────────────────────────────────────────────────────
const NotFound = () => {
  const location = useLocation();

  // Jotform chatbot
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
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const suggestions = [
    { label: "Home", href: "/", icon: Home },
    { label: "Contact", href: "/contact", icon: ArrowRight },
    { label: "Solutions", href: "/solutions", icon: Search },
  ];

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <Helmet>
        <title>Page Not Found | Sniper Systems</title>
        <meta
          name="description"
          content="The page you're looking for doesn't exist. Return to Sniper Systems homepage or contact us for assistance with IT solutions and services."
        />
        <meta name="robots" content="noindex, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Page Not Found | Sniper Systems" />
        <meta
          property="og:description"
          content="The page you requested could not be found. Explore our IT solutions and services or get in touch with our team."
        />
        <meta property="og:url" content="https://sniperindia.com/404/" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Page Not Found | Sniper Systems" />
        <meta
          name="twitter:description"
          content="The page you're looking for doesn't exist. Return to Sniper Systems homepage for IT solutions."
        />
      </Helmet>

      {/* ── Hero: 4 <Globe> 4 ─────────────────────────────────────────────── */}
      <section className="relative bg-white pt-20 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Subtle dot grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <AnimatePresence>
          <motion.div
            className="relative z-10 max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* 4 — Globe — 4 row */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 mb-8 sm:mb-10">
              {/* Left "4" */}
              <motion.span
                className="font-semibold text-gray-900 select-none leading-none"
                style={{
                  fontSize: "clamp(5rem, 18vw, 180px)",
                  letterSpacing: "-0.04em",
                }}
                variants={fadeUp}
              >
                4
              </motion.span>

              {/* Globe */}
              <motion.div
                className="relative flex-shrink-0"
                style={{ width: "clamp(120px, 22vw, 220px)", height: "clamp(120px, 22vw, 220px)" }}
                variants={globeVariants}
                animate={["visible", "floating"]}
              >
                <Globe404 />
              </motion.div>

              {/* Right "4" */}
              <motion.span
                className="font-semibold text-gray-900 select-none leading-none"
                style={{
                  fontSize: "clamp(5rem, 18vw, 180px)",
                  letterSpacing: "-0.04em",
                }}
                variants={fadeUp}
              >
                4
              </motion.span>
            </div>

            {/* Divider */}
            <motion.div
              className="w-full h-px bg-gray-300 mb-8 sm:mb-10"
              variants={fadeUp}
            />

            {/* Heading */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              variants={fadeUp}
            >
              Ups! Lost in space
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
              variants={fadeUp}
            >
              We couldn't find the page you're looking for. It might have been
              moved or deleted.
            </motion.p>

            {/* Attempted path badge */}
            {location.pathname && location.pathname !== "/" && (
              <motion.div
                className="inline-flex items-center gap-2 mt-4 sm:mt-6 bg-gray-100 text-gray-500 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-mono max-w-full overflow-hidden"
                variants={fadeUp}
              >
                <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">{location.pathname}</span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── Quick Links ───────────────────────────────────────────────────── */}
      <section className="bg-black text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] mx-3 sm:mx-4 md:mx-6 my-6 sm:my-8 md:my-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-3 sm:mb-4 leading-tight">
              Where would you<br />like to go?
            </h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg">
              Here are a few pages that might help you find what you're looking for.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {suggestions.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="group flex items-center gap-4 sm:gap-6 md:gap-8 pb-4 sm:pb-5 md:pb-6 border-b border-gray-700 last:border-0 hover:opacity-70 transition-opacity duration-300"
              >
                <div className="flex-shrink-0">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-white transition-colors duration-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xl sm:text-2xl font-semibold text-white">
                    {item.label}
                  </span>
                </div>
                <div className="flex-shrink-0">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Visual atmosphere section ─────────────────────────────────────── */}
      <section className="relative bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight">
                Still can't find<br />what you need?
              </h2>
              <div className="w-full h-px bg-gray-300" />
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Our team is ready to assist you with any questions about our
                Cisco networking solutions, cybersecurity services, or enterprise
                collaboration tools.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Reach out directly and we'll point you in the right direction.
              </p>
            </div>

            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-56 sm:h-72 lg:h-96 bg-gray-900 flex items-center justify-center">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)`,
                  backgroundSize: "28px 28px",
                }}
              />
              <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/30 flex items-center justify-center">
                  <Search className="w-8 h-8 sm:w-10 sm:h-10 text-white/70" />
                </div>
                <p className="text-white/50 text-xs sm:text-sm font-medium uppercase tracking-widest">
                  Connection Lost
                </p>
              </div>
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────────────────────── */}
      <section className="bg-black text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] mx-3 sm:mx-4 md:mx-6 my-6 sm:my-8 md:my-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold mb-4 sm:mb-6 leading-tight">
              Let's get you<br />back on track
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <a
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-10 md:px-12 py-3 sm:py-4 border-2 border-white rounded-full text-white font-medium text-base sm:text-lg hover:bg-white hover:text-black transition-colors duration-300"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              GO HOME
            </a>
            <a
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-10 md:px-12 py-3 sm:py-4 bg-white rounded-full text-black font-medium text-base sm:text-lg hover:bg-gray-200 transition-colors duration-300"
            >
              CONTACT US
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
