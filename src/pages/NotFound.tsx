import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, Home, Search, Wifi } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    window.scrollTo(0, 0);
    setMounted(true);
  }, [location.pathname]);

  const suggestions = [
    { label: "Home",      href: "/",         icon: Home      },
    { label: "Contact",   href: "/contact",  icon: ArrowRight },
    { label: "Solutions", href: "/solutions", icon: Search    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">

      {/* ── Hero 404 Section ──────────────────────────────────────────────── */}
      <section className="relative bg-white pt-20 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Subtle background dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Giant 404 */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <div
              className="font-semibold text-gray-900 leading-none select-none"
              style={{
                fontSize: "clamp(7rem, 28vw, 300px)",
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(40px)",
                transition: "opacity 0.7s ease, transform 0.7s ease",
                letterSpacing: "-0.04em",
                fontFeatureSettings: '"tnum"',
              }}
            >
              404
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gray-300 mb-8 sm:mb-10 md:mb-12" />

          {/* Message */}
          <div className="text-center px-2 sm:px-4">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
              }}
            >
              Page Not Found
            </h1>
            <p
              className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s",
              }}
            >
              The page you're looking for doesn't exist or may have been moved.
              Let's get you back on track.
            </p>

            {/* Attempted path badge */}
            {location.pathname && location.pathname !== "/" && (
              <div
                className="inline-flex items-center gap-2 mt-4 sm:mt-6 bg-gray-100 text-gray-500 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-mono max-w-full overflow-hidden"
                style={{
                  opacity: mounted ? 1 : 0,
                  transition: "opacity 0.7s ease 0.35s",
                }}
              >
                <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">{location.pathname}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Quick Links / Navigation Block ───────────────────────────────── */}
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
                {/* Icon */}
                <div className="flex-shrink-0">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-white transition-colors duration-200" />
                </div>
                {/* Label */}
                <div className="flex-1 min-w-0">
                  <span className="text-xl sm:text-2xl font-semibold text-white">{item.label}</span>
                </div>
                {/* Arrow */}
                <div className="flex-shrink-0">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Visual Atmosphere Section ─────────────────────────────────────── */}
      <section className="relative bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            {/* Left: text block */}
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

            {/* Right: decorative visual tile */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-56 sm:h-72 lg:h-96 bg-gray-900 flex items-center justify-center">
              {/* Animated dot grid */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)`,
                  backgroundSize: "28px 28px",
                }}
              />
              {/* Center icon */}
              <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/30 flex items-center justify-center">
                  <Search className="w-8 h-8 sm:w-10 sm:h-10 text-white/70" />
                </div>
                <p className="text-white/50 text-xs sm:text-sm font-medium uppercase tracking-widest">
                  Connection Lost
                </p>
              </div>
              {/* Subtle radial glow */}
              <div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)",
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
