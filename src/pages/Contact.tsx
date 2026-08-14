import { Layout } from "@/components/Layout";
import LottieAnimation from "@/components/LottieAnimation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PageSEO from "@/components/PageSEO";
import { GrainGradient } from "@paper-design/shaders-react";


gsap.registerPlugin(ScrollTrigger);

// ========================================================
// GSAP UTILITIES
// ========================================================

// ---- Marquee Ticker ----


// ---- Form field — light design with GSAP focus underline ----
const AnimatedInput = React.memo(({ label, id, type = "text", value, onChange, required = false, placeholder, className = "", list, ...rest }: {
  label: string; id: string; type?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean; placeholder?: string; className?: string;
  list?: string;
  [key: string]: any;
}) => {
  const underlineRef = useRef<HTMLDivElement>(null);

  const handleFocus = () => {
    gsap.fromTo(underlineRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 0.5, ease: "power3.out" }
    );
  };
  const handleBlur = () => {
    gsap.to(underlineRef.current, { scaleX: 0, transformOrigin: "right center", duration: 0.4, ease: "power2.in" });
  };

  return (
    <div className="relative w-full">
      <label htmlFor={id} className="block text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2 sm:mb-3">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          required={required}
          list={list}
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-300 rounded-full text-gray-900 focus:outline-none focus:border-gray-900 transition-colors duration-300 ${className}`}
          {...rest}
        />
        <div className="absolute bottom-0 left-4 sm:left-6 right-4 sm:right-6 overflow-hidden rounded-full pointer-events-none">
          <div ref={underlineRef} className="h-full w-full bg-black" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </div>
  );
});

const AnimatedTextarea = React.memo(({ label, id, value, onChange, required = false, rows = 5, placeholder, className = "" }: {
  label: string; id: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean; rows?: number; placeholder?: string; className?: string;
}) => {
  const underlineRef = useRef<HTMLDivElement>(null);

  const handleFocus = () => {
    gsap.fromTo(underlineRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 0.5, ease: "power3.out" }
    );
  };
  const handleBlur = () => {
    gsap.to(underlineRef.current, { scaleX: 0, transformOrigin: "right center", duration: 0.4, ease: "power2.in" });
  };

  return (
    <div className="relative w-full">
      <label htmlFor={id} className="block text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2 sm:mb-3">
        {label}
      </label>
      <div className="relative">
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-300 rounded-3xl text-gray-900 focus:outline-none focus:border-gray-900 transition-colors duration-300 resize-none ${className}`}
        />
        <div className="absolute bottom-0 left-4 sm:left-6 right-4 sm:right-6 overflow-hidden rounded-full pointer-events-none">
          <div ref={underlineRef} className="h-full w-full bg-black" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </div>
  );
});

// ---- Contact Info cards with GSAP line-draw dividers ----
const ContactInfoList = ({ contactInfo, infoInView }: { contactInfo: any[]; infoInView: boolean }) => {
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!infoInView) return;
    linesRef.current.forEach((line, i) => {
      if (!line) return;
      gsap.fromTo(line,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 0.9, ease: "power3.out", delay: 0.2 + i * 0.1 }
      );
    });
  }, [infoInView]);

  return (
    <div className="space-y-8 sm:space-y-12">
      {contactInfo.map((info, index) => (
        <motion.div
          key={index}
          className="relative pb-2 last:pb-0"
          initial={{ opacity: 0, y: 30 }}
          animate={infoInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 + index * 0.1 }}
        >
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="flex-shrink-0">
              <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="space-y-1 sm:space-y-2 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">{info.label}</p>
              <p className="text-base sm:text-lg text-white leading-relaxed break-words">{info.content}</p>
            </div>
          </div>
          {index < contactInfo.length - 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10 overflow-hidden">
              <div
                ref={el => { linesRef.current[index] = el; }}
                className="h-full bg-gradient-to-r from-white/20 via-white/80 to-white/20"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// ---- Magnetic CTA button (disabled on touch devices) ----
const MagneticLink = ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => {
  const btnRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    // Only apply magnetic effect on non-touch devices
    if (window.matchMedia("(hover: none)").matches) return;
    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
      gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: "power2.out" });
    };
    const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.5)" });
    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);
    return () => { btn.removeEventListener("mousemove", onMove); btn.removeEventListener("mouseleave", onLeave); };
  }, []);
  return (
    <a ref={btnRef as any} href={to} className={`will-change-transform ${className ?? ""}`}>
      {children}
    </a>
  );
};

// ---- Location card with GSAP image parallax ----
const LocationCard = ({ loc, index, locInView }: { loc: any; index: number; locInView: boolean }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);


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
    const img = imgRef.current;
    const wrap = wrapRef.current;
    if (!img || !wrap) return;
    // Skip parallax on mobile for perf
    if (window.matchMedia("(max-width: 640px)").matches) return;
    const tween = gsap.fromTo(img,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);

  // Responsive heights
  const isFirst = index === 0;
  const heightClass = isFirst
    ? "h-[280px] sm:h-[340px] md:h-[420px]"
    : "h-[140px] sm:h-[160px] md:h-[196px]";

  return (
    <motion.div
      ref={wrapRef}
      className={`relative rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer ${isFirst ? "col-span-2 row-span-2" : ""} ${heightClass}`}
      initial={{ opacity: 0, y: 40 }}
      animate={locInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 + (index % 4) * 0.08 }}
      whileHover={{ y: -4 }}
    >
      <img
        ref={imgRef}
        src={loc.img}
        alt={loc.city}
        className="absolute inset-0 w-full h-full object-cover scale-110 will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5">
        <span
          className="inline-block text-white uppercase tracking-widest mb-1 sm:mb-2 px-2 sm:px-3 py-1 rounded-full"
          style={{ fontSize: "8px", fontWeight: 600, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}
        >
          {loc.tag}
        </span>
        <h3
          className="text-white font-semibold leading-tight"
          style={{ fontSize: isFirst ? "clamp(16px, 4vw, 26px)" : "clamp(12px, 2vw, 15px)" }}
        >
          {loc.city}
        </h3>
        <p
          className="text-gray-300 font-normal mt-0.5"
          style={{ fontSize: isFirst ? "clamp(11px, 2vw, 13px)" : "clamp(10px, 1.5vw, 11px)" }}
        >
          {loc.state}
        </p>
      </div>
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: "28px", height: "28px", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.25)" }}
        >
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white -rotate-45" />
        </div>
      </div>
    </motion.div>
  );
};


// ========================================================
// WHITE SCREEN TRANSITION (Framer Motion)
// ========================================================
const WhiteScreenTransition = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-white z-[9999] will-change-transform"
      initial={{ y: 0 }}
      animate={{ y: "-105%" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
      onAnimationComplete={onComplete}
    />
  );
};


// ========================================================
// ✦ Staggered Form Fields Wrapper (Framer Motion)
// ========================================================
const SpringFormFields = ({ children, trigger }: { children: React.ReactNode[]; trigger: boolean }) => {
  return (
    <>
      {(children as React.ReactNode[]).map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 32 }}
          animate={trigger ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.08 + i * 0.07 }}
        >
          {child}
        </motion.div>
      ))}
    </>
  );
};


// ========================================================
// ✦ Animated Submit Button (Framer Motion)
// ========================================================
const SpringSubmitButton = ({ onClick, type = "submit", loading = false }: { onClick?: () => void; type?: "submit" | "button"; loading?: boolean }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-2 sm:gap-3 px-8 sm:px-12 py-3 sm:py-4 border-2 border-gray-900 rounded-full text-gray-900 font-semibold text-sm sm:text-base tracking-widest uppercase hover:bg-gray-900 hover:text-white transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      whileHover={loading ? {} : { scale: 1.04 }}
      whileTap={loading ? {} : { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 320, damping: 18 }}
    >
      {loading ? "SENDING..." : "SEND MESSAGE"}
      {loading
        ? <span className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        : <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
      }
    </motion.button>
  );
};


// ========================================================
// ✦ Success Toast (Framer Motion)
// ========================================================
const SpringToast = ({ visible, onDone, message = "MESSAGE SENT — WE'LL BE IN TOUCH SOON", isError = false }: {
  visible: boolean; onDone: () => void; message?: string; isError?: boolean;
}) => {
  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          className="fixed bottom-6 sm:bottom-8 left-4 right-4 sm:left-1/2 sm:right-auto z-[100] pointer-events-none sm:w-auto"
          style={{ ...(typeof window !== "undefined" && window.innerWidth >= 640 ? { x: "-50%", left: "50%" } : {}) }}
          initial={{ opacity: 0, y: 60, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.85 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <div className={`${isError ? "bg-red-600" : "bg-gray-900"} text-white rounded-2xl sm:rounded-full px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-semibold tracking-widest uppercase whitespace-nowrap shadow-2xl text-center`}>
            {isError ? "✕" : "✓"} &nbsp; {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


// ========================================================
// ✦ Section Heading reveal (Framer Motion)
// ========================================================
const SpringHeading = ({ children, trigger, delay = 0 }: { children: React.ReactNode; trigger: boolean; delay?: number }) => {
  return (
    <motion.h2
      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-8 sm:mb-12 leading-tight"
      initial={{ opacity: 0, y: 60 }}
      animate={trigger ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: delay / 1000 }}
    >
      {children}
    </motion.h2>
  );
};


// ========================================================
// ORBITAL RINGS
// ========================================================
const OrbitalRings = () => (
  <div className="absolute inset-0 bg-black overflow-hidden">
    <div className="absolute top-1/4 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
    <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] md:w-[1000px] md:h-[1000px]">
      <div className="absolute inset-0 animate-[spin_20s_linear_infinite]"><div className="absolute inset-0 rounded-full border-2 border-white blur-sm"></div><div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 sm:w-4 h-3 sm:h-4 bg-purple-400 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.8)]"></div></div>
      <div className="absolute inset-8 animate-[spin_15s_linear_infinite_reverse]"><div className="absolute inset-0 rounded-full border-2 border-white blur-sm"></div><div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 sm:w-3 h-2 sm:h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"></div></div>
      <div className="absolute inset-16 animate-[spin_12s_linear_infinite]"><div className="absolute inset-0 rounded-full border-2 border blur-[2px]"></div><div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 sm:w-3 h-2 sm:h-3 bg-pink-400 rounded-full shadow-[0_0_18px_rgba(244,114,182,0.9)]"></div></div>
      <div className="absolute inset-24 animate-[spin_9s_linear_infinite_reverse]"><div className="absolute inset-0 rounded-full border-2 border blur-[1px]"></div><div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_12px_rgba(96,165,250,0.9)]"></div></div>
      <div className="absolute inset-32 animate-[spin_7s_linear_infinite]"><div className="absolute inset-0 rounded-full border-2 border blur-[1px]"></div><div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-violet-400 rounded-full shadow-[0_0_10px_rgba(167,139,250,1)]"></div></div>
      <div className="absolute inset-40 animate-[spin_5s_linear_infinite_reverse]"><div className="absolute inset-0 rounded-full border-2 border"></div><div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-fuchsia-400 rounded-full shadow-[0_0_15px_rgba(232,121,249,1)]"></div></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"></div>
        <div className="absolute w-10 sm:w-16 h-10 sm:h-16 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-xl"></div>
        <div className="absolute w-6 sm:w-8 h-6 sm:h-8 bg-white/50 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.5)]"></div>
      </div>
    </div>
  </div>
);


// ========================================================
// CTA SECTION
// ========================================================

/**
 * Key fixes vs previous attempts:
 *
 * 1. `position: fixed` breaks inside any ancestor that has a CSS transform
 *    applied (including Framer Motion's entrance animation). The blob divs
 *    are therefore rendered via a React Portal into document.body so they
 *    are NEVER a descendant of the animated section.
 *
 * 2. All cursor state is in refs — no React state, no stale closures.
 *    The RAF loop runs once and reads live ref values every tick.
 *
 * 3. CSS `transition` is NOT applied to `left`/`top` on the blob — the RAF
 *    loop handles smooth movement itself. CSS transition would fight the RAF
 *    and cause jitter. Only `opacity` and `width/height` use CSS transitions.
 *
 * 4. `isTouchDevice` is detected synchronously before any effect runs,
 *    not inside a useEffect (which fires after mount and creates a race).
 */

// Detect touch once at module level — safe because this module only runs in browser
const IS_TOUCH = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

const CTASection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const ctaBtnRef = useRef<HTMLAnchorElement>(null);
  const rafRef = useRef<number | null>(null);

  // Direct DOM refs for the cursor layers (mutated in RAF, never via state)
  const blobRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  // All cursor tracking in refs — zero re-renders, zero stale closures
  const mouse = useRef({ x: 0, y: 0 });   // raw mouse position
  const smooth = useRef({ x: 0, y: 0 });   // lerped position written to DOM
  const trail = useRef({ x: 0, y: 0 });   // trail lags further behind
  const inside = useRef(false);            // mouse is inside the section
  const hovered = useRef(false);            // mouse is over the CTA button

  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  // ── Single RAF loop — started once, never recreated ──────────────────
  useEffect(() => {
    if (IS_TOUCH) return;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);

      if (!inside.current) return;

      // Lerp the main blob toward the real mouse
      const f = hovered.current ? 0.2 : 0.12;
      smooth.current.x = lerp(smooth.current.x, mouse.current.x, f);
      smooth.current.y = lerp(smooth.current.y, mouse.current.y, f);

      // Trail lags behind smooth position
      trail.current.x = lerp(trail.current.x, smooth.current.x, 0.07);
      trail.current.y = lerp(trail.current.y, smooth.current.y, 0.07);

      // Write directly to DOM — NO React state, NO re-render
      if (blobRef.current) {
        const sz = hovered.current ? 128 : 96;
        blobRef.current.style.transform =
          `translate(${smooth.current.x}px, ${smooth.current.y}px) translate(-50%, -50%) scale(${hovered.current ? 1.25 : 1})`;
        blobRef.current.style.width = `${sz}px`;
        blobRef.current.style.height = `${sz}px`;
        blobRef.current.textContent = hovered.current ? "CLICK ME!" : "LET'S GO!";
      }

      if (trailRef.current) {
        trailRef.current.style.transform =
          `translate(${trail.current.x}px, ${trail.current.y}px) translate(-50%, -50%)`;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []); // empty deps — intentional, loop reads from refs not state

  // ── Section mouse events ──────────────────────────────────────────────
  useEffect(() => {
    if (IS_TOUCH) return;
    const section = sectionRef.current;
    if (!section) return;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    const onEnter = () => {
      inside.current = true;
      // Snap smooth/trail to current mouse so there's no "fly in" on first entry
      smooth.current.x = mouse.current.x;
      smooth.current.y = mouse.current.y;
      trail.current.x = mouse.current.x;
      trail.current.y = mouse.current.y;
      if (blobRef.current) blobRef.current.style.opacity = "1";
      if (trailRef.current) trailRef.current.style.opacity = "0.3";
    };
    const onLeave = () => {
      inside.current = false;
      hovered.current = false;
      if (blobRef.current) blobRef.current.style.opacity = "0";
      if (trailRef.current) trailRef.current.style.opacity = "0";
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseenter", onEnter);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseenter", onEnter);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // ── Magnetic CTA button ───────────────────────────────────────────────
  useEffect(() => {
    if (IS_TOUCH) return;
    const btn = ctaBtnRef.current;
    if (!btn) return;
    const onMove = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.3;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.3;
      gsap.to(btn, { x: dx, y: dy, duration: 0.35, ease: "power2.out" });
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

  // ── Cursor markup — rendered into document.body via Portal ───────────
  // This escapes ALL ancestor stacking contexts and transforms so that
  // `position: fixed` + `transform` work exactly as expected.
  const cursorPortal = !IS_TOUCH && typeof document !== "undefined"
    ? createPortal(
      <>
        {/* Main blob */}
        <div
          ref={blobRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "#ffffff",
            color: "#000000",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.04em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 99999,
            opacity: 0,
            // Only non-position props get CSS transition — position uses RAF
            transition: "opacity 0.2s ease, width 0.2s ease, height 0.2s ease",
            filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.35))",
            willChange: "transform",
          }}
        />
        {/* Trailing dot */}
        <div
          ref={trailRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.25)",
            pointerEvents: "none",
            zIndex: 99998,
            opacity: 0,
            transition: "opacity 0.3s ease",
            willChange: "transform",
          }}
        />
      </>,
      document.body
    )
    : null;

  return (
    <>
      {cursorPortal}

      <motion.section
        ref={(el) => {
          sectionRef.current = el;
          ctaRef.current = el;
        }}
        className="relative bg-black text-white py-16 sm:py-20 px-4 sm:px-6 rounded-[2rem] sm:rounded-[4rem] mx-3 sm:mx-6 my-8 sm:my-12 overflow-hidden cursor-none"
        initial={{ opacity: 0, y: 60 }}
        animate={ctaInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <OrbitalRings />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            className="mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold mb-4 sm:mb-6 leading-tight text-white">
              Have<br />an idea?<br />We make it happen
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            <a
              ref={ctaBtnRef}
              href="/"
              className="inline-flex items-center px-8 sm:px-12 py-3 sm:py-4 border-2 border-white rounded-full text-white font-medium text-base sm:text-lg hover:bg-white hover:text-black transition-all duration-300 relative z-10 will-change-transform"
              onMouseEnter={() => { hovered.current = true; }}
              onMouseLeave={() => { hovered.current = false; }}
            >
              BACK TO HOME
              <span className="absolute inset-[-12px] rounded-full" />
            </a>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
};


// ========================================================
// CONTACT PAGE
// ========================================================

const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "ab9fd6a8-a8de-4f28-ba11-f6d95387e932";

const Contact = () => {

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);
  const [viewMode, setViewMode] = useState<"visual" | "addresses">("visual");

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMounted, setToastMounted] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIsError, setToastIsError] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    websiteUrl: "",
    stateRegion: "",
    message: "",
  });

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const showToast = (msg: string, isError = false) => {
    setToastMessage(msg);
    setToastIsError(isError);
    setToastMounted(true);
    setTimeout(() => setToastVisible(true), 20);
    setTimeout(() => setToastVisible(false), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "—",
        company: formData.company,
        website_url: formData.websiteUrl || "—",
        state_region: formData.stateRegion,
        message: formData.message,
        subject: `New Contact Enquiry from ${formData.name} — ${formData.company}`,
        from_name: formData.name,
      };

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        showToast("MESSAGE SENT — WE'LL BE IN TOUCH SOON");
        setFormData({ name: "", email: "", phone: "", company: "", websiteUrl: "", stateRegion: "", message: "" });
      } else {
        showToast("SOMETHING WENT WRONG — PLEASE TRY AGAIN", true);
      }
    } catch {
      showToast("NETWORK ERROR — PLEASE TRY AGAIN LATER", true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ease = [0.16, 1, 0.3, 1] as const;

  const contactInfo = [
    { icon: MapPin, label: "OUR OFFICES", content: "Chennai (HQ) | Bangalore | Hyderabad | Gurugram | Coimbatore | Kochi | Vijayawada" },
    { icon: Phone, label: "PHONE", content: "+91 8939301100" },
    { icon: Mail, label: "EMAIL", content: "enquiry@sniperindia.com" },
    { icon: Clock, label: "WORKING HOURS", content: "Mon - Fri: 9:30 AM - 6:30 PM" },
  ];

  const locations = [
    { city: "Chennai", state: "Tamil Nadu", tag: "Headquarters", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Chennai_-_bird%27s-eye_view.jpg/1920px-Chennai_-_bird%27s-eye_view.jpg" },
    { city: "Bangalore", state: "Karnataka", tag: "Regional Office", img: "https://i.postimg.cc/T1rQ8gxv/bangalore.jpg" },
    { city: "Hyderabad", state: "Telangana", tag: "Regional Office", img: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=800&q=80" },
    { city: "Gurugram", state: "Haryana", tag: "Regional Office", img: "https://i.postimg.cc/3xy4d7yw/1.webp" },
    { city: "Coimbatore", state: "Tamil Nadu", tag: "Branch Office", img: "https://i.postimg.cc/3JQfdnWz/Ev-Dufkz-VEAA5W1W.jpg" },
    { city: "Kochi", state: "Kerala", tag: "Branch Office", img: "https://i.postimg.cc/bvsTyKPH/kochi.jpg" },
    { city: "Vijayawada", state: "Andhra Pradesh", tag: "Branch Office", img: "https://i.postimg.cc/ZKwpWVwh/Prakasham-Barriage-Vijayawada.jpg" },
  ];

  const heroRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const locRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-60px" });
  const formInView = useInView(formRef, { once: true, margin: "-60px" });
  const infoInView = useInView(infoRef, { once: true, margin: "-60px" });
  const locInView = useInView(locRef, { once: true, margin: "-60px" });

  // ✦ GSAP: Hero heading character stagger
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = heroHeadingRef.current;
    if (!el) return;
    const words = el.querySelectorAll(".contact-word");
    gsap.fromTo(words,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.09, delay: 1.1 }
    );
  }, []);



  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry",
  ];

  return (
    <Layout>

      <PageSEO
        title="Contact Sniper Systems | IT Solutions Provider in Chennai"
        description="Get in touch with Sniper Systems, a leading IT solutions provider in Chennai. Contact us for IT infrastructure, managed IT services, cloud solutions, and enterprise technology services."
        canonical="/contact"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Sniper Systems",
            "image": "https://sniperindia.com/wp-content/uploads/2023/09/logo.png",
            "url": "https://sniperindia.com",
            "telephone": "+91-44-00000000",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Chennai Office Address",
              "addressLocality": "Chennai",
              "addressRegion": "Tamil Nadu",
              "postalCode": "600001",
              "addressCountry": "India"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 13.0827,
              "longitude": 80.2707
            },
            "openingHours": "Mo-Fr 09:00-18:00"
          },
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Sniper Systems",
            "url": "https://sniperindia.com/contact",
            "description": "Contact Sniper Systems for IT solutions, managed services, and enterprise technology support."
          }
        ]}
      />

      {showWhiteScreen && <WhiteScreenTransition onComplete={() => setShowWhiteScreen(false)} />}

      {/* ✦ Toast notification */}
      {toastMounted && (
        <SpringToast
          visible={toastVisible}
          onDone={() => setToastMounted(false)}
          message={toastMessage}
          isError={toastIsError}
        />
      )}

      {/* ==================== HERO ==================== */}
      <section className="relative bg-white pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-white opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto">

          {/* ── Hero: heading (left) + LottieAnimation (right) ── */}
          <div
            className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 mb-6 sm:mb-10"
            ref={heroRef}
          >
            {/* Left — heading + description */}
            <div className="flex-1 text-center lg:text-left w-full">
              <h1
                ref={heroHeadingRef}
                className="text-5xl sm:text-6xl md:text-7xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight font-sans"
                aria-label="Contact Us"
              >
                {["Contact", "Us"].map((word, i) => (
                  <span key={i} className="contact-word inline-block opacity-0 mr-[0.25em] last:mr-0">
                    {word}
                  </span>
                ))}
              </h1>

              <motion.p
                className="text-base sm:text-lg md:text-xl text-gray-700 max-w-xl leading-relaxed mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease, delay: 1.35 }}
              >
                Get in touch with Sniper Systems and Solutions. We're here to help you transform
                your IT infrastructure and drive your business forward with innovative technology
                solutions.
              </motion.p>
            </div>

            {/* Right — Lottie Animation */}
            <motion.div
              className="flex-1 flex items-center justify-center w-full max-w-[260px] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
              initial={{ opacity: 0, x: 40 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, ease, delay: 1.3 }}
            >
              <LottieAnimation />
            </motion.div>
          </div>

        </div>
      </section>

      {/* ✦ GSAP Marquee */}


      {/* ==================== FORM + INFO ==================== */}
      <section className="bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16">

            {/* Contact Form */}
            <div ref={formRef}>
              <SpringHeading trigger={formInView}>
                Send us<br />a message
              </SpringHeading>

              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <SpringFormFields trigger={formInView}>
                  <AnimatedInput
                    label="Name *"
                    id="name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Your full name"
                  />
                  <AnimatedInput
                    label="Email *"
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="your.email@company.com"
                  />
                  <AnimatedInput
                    label="Phone *"
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    required
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 1234 567 890"
                  />
                  <AnimatedInput
                    label="Company Name *"
                    id="company"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    required
                    placeholder="Your company or organisation"
                  />
                  <AnimatedInput
                    label="Website URL"
                    id="websiteUrl"
                    type="text"
                    value={formData.websiteUrl}
                    onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })}
                    placeholder="yourwebsite.com (optional)"
                  />
                  <div className="relative">
                    <label htmlFor="stateRegion" className="block text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2 sm:mb-3">
                      State / Region *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="stateRegion"
                        name="stateRegion"
                        list="indian-states"
                        value={formData.stateRegion}
                        onChange={e => setFormData({ ...formData, stateRegion: e.target.value })}
                        required
                        placeholder="Select or type your state"
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-300 rounded-full text-gray-900 focus:outline-none focus:border-gray-900 transition-colors duration-300"
                      />
                      <datalist id="indian-states">
                        {indianStates.map(s => <option key={s} value={s} />)}
                      </datalist>
                    </div>
                  </div>
                  <AnimatedTextarea
                    label="Message *"
                    id="message"
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    placeholder="Tell us about your project or inquiry..."
                  />
                  <div>
                    <SpringSubmitButton type="submit" loading={isSubmitting} />
                  </div>
                </SpringFormFields>
              </form>
            </div>

            {/* Contact Info — unchanged */}
            <div
              ref={infoRef}
              className="relative flex flex-col justify-between overflow-hidden rounded-md bg-black border border-[#222] p-8 sm:p-12 text-white min-h-[720px]"
            >
              <GrainGradient
                speed={1}
                scale={1}
                rotation={0}
                offsetX={0}
                offsetY={0}
                softness={0.5}
                intensity={0.5}
                noise={0.25}
                shape="corners"
                frame={2854.5}
                colors={["#FFFFFF", "#FC7819", "#FC7819", "#FFFFFF"]}
                colorBack="#00000000"
                className="absolute inset-0 bg-black opacity-30"
              />

              <div className="relative z-10 flex flex-col justify-between h-full w-full space-y-12">
                <div>
                  <motion.h2
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-8 sm:mb-12 leading-tight"
                    initial={{ opacity: 0, y: 60 }}
                    animate={infoInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                  >
                    Get in<br />touch
                  </motion.h2>

                  <ContactInfoList contactInfo={contactInfo} infoInView={infoInView} />
                </div>

                <motion.div
                  className="space-y-4 sm:space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={infoInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, ease, delay: 0.55 }}
                >
                  <p className="text-base sm:text-lg text-white/70 leading-relaxed font-sans">
                    Whether you need IT consulting, managed services, or technology infrastructure solutions,
                    our team is ready to help you achieve your business goals.
                  </p>
                  <p className="text-base sm:text-lg text-white/70 leading-relaxed font-sans">
                    Reach out today and discover how Sniper Systems can transform your IT operations.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✦ GSAP Marquee */}


      {/* ==================== UNIFIED LOCATIONS SECTION ==================== */}
      <section className="relative bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            ref={locRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-8 sm:mb-12 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={locInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease }}
          >
            Our<br />Locations
          </motion.h2>

          {/* Toggle Tabs */}
          <motion.div
            className="flex gap-4 mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={locInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
          >
            <button
              onClick={() => setViewMode("visual")}
              className={`px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${viewMode === "visual"
                ? "bg-gray-900 text-white"
                : "border-2 border-gray-300 text-gray-900 hover:border-gray-900"
                }`}
            >
              View Locations
            </button>
            <button
              onClick={() => setViewMode("addresses")}
              className={`px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${viewMode === "addresses"
                ? "bg-gray-900 text-white"
                : "border-2 border-gray-300 text-gray-900 hover:border-gray-900"
                }`}
            >
              Office Addresses
            </button>
          </motion.div>

          {/* Location Cards View */}
          <AnimatePresence mode="wait">
            {viewMode === "visual" && (
              <motion.div
                key="locations-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {locations.map((loc, i) => (
                    <LocationCard key={loc.city} loc={loc} index={i} locInView={locInView} />
                  ))}
                </div>

                <motion.p
                  className="mt-6 sm:mt-8 text-xs sm:text-sm text-gray-400 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, ease, delay: 0.2 }}
                >
                  Sniper Systems and Solutions Pvt. Ltd. — Serving clients across India
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Office Addresses View */}
          <AnimatePresence mode="wait">
            {viewMode === "addresses" && (
              <motion.div
                key="addresses-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                  {/* CHENNAI */}
                  <motion.div
                    className="rounded-2xl p-6 sm:p-8 border-2 border-gray-200 hover:border-gray-900 transition-colors duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease, delay: 0.1 }}
                  >
                    <div className="flex items-start gap-4 mb-5 sm:mb-6">
                      <div className="flex-shrink-0">
                        <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-gray-900" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900">Chennai</h3>
                    </div>
                    <div className="space-y-4 ml-10">
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">Headquarters</p>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                          3rd Floor, Sri Durga Enclave - Phase II,<br />
                          Plot no: 22 & 23, 2nd River View, Residency, Colony,<br />
                          Karapakkam, Chennai, Tamil Nadu 600097
                        </p>
                      </div>
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">Branch Office</p>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                          4th Floor, Moti Towers,<br />
                          No.131/2A, Rajiv Gandhi Salai,<br />
                          opp. Apollo Hospital, Perungudi,<br />
                          Chennai, Tamil Nadu 600096
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* HYDERABAD */}
                  <motion.div
                    className="rounded-2xl p-6 sm:p-8 border-2 border-gray-200 hover:border-gray-900 transition-colors duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease, delay: 0.15 }}
                  >
                    <div className="flex items-start gap-4 mb-5 sm:mb-6">
                      <div className="flex-shrink-0">
                        <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-gray-900" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900">Hyderabad</h3>
                    </div>
                    <div className="space-y-4 ml-10">
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">Regional Office</p>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                          401-B, Plot No. 81, Kub Towers,<br />
                          Telecom Nagar Extension, Gachibowli,<br />
                          Hyderabad, Telangana 500032
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* BANGALORE */}
                  <motion.div
                    className="rounded-2xl p-6 sm:p-8 border-2 border-gray-200 hover:border-gray-900 transition-colors duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease, delay: 0.2 }}
                  >
                    <div className="flex items-start gap-4 mb-5 sm:mb-6">
                      <div className="flex-shrink-0">
                        <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-gray-900" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900">Bangalore</h3>
                    </div>
                    <div className="space-y-4 ml-10">
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">Regional Office</p>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                          Sanctuary, 1st to 3rd Floor,<br />
                          Site No. 102, 36th Main, BTM 2nd Stage,<br />
                          Bengaluru, Karnataka 560068
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* GURUGRAM */}
                  <motion.div
                    className="rounded-2xl p-6 sm:p-8 border-2 border-gray-200 hover:border-gray-900 transition-colors duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease, delay: 0.25 }}
                  >
                    <div className="flex items-start gap-4 mb-5 sm:mb-6">
                      <div className="flex-shrink-0">
                        <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-gray-900" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900">Gurugram</h3>
                    </div>
                    <div className="space-y-4 ml-10">
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">Regional Office</p>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                          Fume Coworking, 2nd Floor,<br />
                          Plot- 76-D, Phase IV, Udyog Vihar,<br />
                          Sector 18, Gurugram, Haryana 122001
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.p
                  className="mt-10 sm:mt-14 text-center text-sm sm:text-base text-gray-600 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, ease, delay: 0.3 }}
                >
                  We also have branch offices in Coimbatore, Kochi, and Vijayawada. Contact us for more information about visiting any of our locations.
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <CTASection />

      {/* ✦ Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 sm:bottom-8 left-4 sm:left-8 w-11 sm:w-14 h-11 sm:h-14 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300 z-50 shadow-lg"
            aria-label="Scroll to top"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
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

export default Contact;
