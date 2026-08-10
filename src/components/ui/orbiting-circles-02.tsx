"use client";

import ParticleSphereAnimation from "@/components/ui/orbiting-circles-02-utils/particalsphear";
import React from "react";

// ─── 5 orbit rings with real partner/tech logos ───────────────────────────────
const orbits = [
  {
    radiusPx: { mobile: 55, desktop: 190 },
    duration: 16,
    icons: [
      { src: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",       alt: "Apple",     angle: 0,   bg: "#ffffff" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/4/41/Autodesk_Logo_2021.svg",     alt: "Autodesk",  angle: 120, bg: "#ffffff" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/9/90/Adobe_Corporate_wordmark.svg", alt: "Adobe",   angle: 240, bg: "#ffffff" },
    ],
  },
  {
    radiusPx: { mobile: 78, desktop: 272 },
    duration: 22,
    icons: [
      { src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", alt: "Microsoft", angle: 45,  bg: "#ffffff" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg",              alt: "NVIDIA",    angle: 165, bg: "#76b900" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg", alt: "AWS",       angle: 285, bg: "#ffffff" },
    ],
  },
  {
    radiusPx: { mobile: 101, desktop: 356 },
    duration: 30,
    icons: [
      { src: "https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg",         alt: "Dell",    angle: 20,  bg: "#ffffff" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Hewlett_Packard_Enterprise_logo_2025.svg/1280px-Hewlett_Packard_Enterprise_logo_2025.svg.png",           alt: "HP",      angle: 110, bg: "#e4e9ecff" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg",   alt: "Cisco",   angle: 200, bg: "#ffffff" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Samsung_Black_icon.svg",     alt: "Samsung", angle: 290, bg: "#ffffff" },
    ],
  },
  {
    radiusPx: { mobile: 124, desktop: 440 },
    duration: 38,
    icons: [
      { src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",   alt: "Google",   angle: 60,  bg: "#ffffff" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Lenovo_%282015%29.svg",  alt: "Lenovo",   angle: 150, bg: "#e60012" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg",      alt: "Logitech", angle: 240, bg: "#ffffff" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Jabra_Logo.png",         alt: "Jabra",    angle: 330, bg: "#ffffff" },
    ],
  },
  {
    radiusPx: { mobile: 147, desktop: 526 },
    duration: 48,
    icons: [
      { src: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg",                  alt: "ASUS",       angle: 30,  bg: "#ffffff" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/8/8d/LG_logo_%282014%29.svg",         alt: "LG",         angle: 102, bg: "#ffffff" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Acer_2011.svg/1280px-Acer_2011.svg.png",                  alt: "Acer",       angle: 174, bg: "#000000ff" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/4/41/BenQ_wordmark.svg",              alt: "BenQ",       angle: 246, bg: "#ffffff" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Super_Micro_Computer_Logo.svg",  alt: "Supermicro", angle: 318, bg: "#ffffff" },
    ],
  },
];

// ─── Single orbit ring — centred on the sphere ───────────────────────────────
const OrbitRing = ({
  radius,
  duration,
  icons,
  clockwise,
  iconSize,
  padSize,
  mobile,
}: {
  radius: number;
  duration: number;
  icons: { src: string; alt: string; angle: number; bg: string }[];
  clockwise: boolean;
  iconSize: number;
  padSize: number;
  mobile?: boolean;
}) => {
  const diameter = radius * 2;
  const orbitAnim   = clockwise ? "og-orbit-cw"   : "og-orbit-ccw";
  const counterAnim = clockwise ? "og-counter-cw"  : "og-counter-ccw";
  const half = padSize / 2;
  const borderWidth = mobile ? "1px" : "2px";

  return (
    <div
      style={{
        position: "absolute",
        top:  "50%",
        left: "50%",
        width:  diameter,
        height: diameter,
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        border: `${borderWidth} solid rgba(255, 255, 255, 0.16)`,
        pointerEvents: "none",
      }}
    >
      {icons.map((icon, i) => (
        // Arm: starts at top of circle, rotates around centre
        <div
          key={i}
          style={
            {
              position: "absolute",
              top: 0,
              left: "50%",
              height: "50%",
              width: 0,
              transformOrigin: "bottom center",
              "--start-angle": `${icon.angle}deg`,
              animation: `${orbitAnim} ${duration}s linear infinite`,
            } as React.CSSProperties
          }
        >
          {/* Badge — counter-rotates so logo stays upright */}
          <div
            style={
              {
                position: "absolute",
                top: `-${half}px`,
                left: "50%",
                transform: "translateX(-50%)",
                "--counter-offset": `${-icon.angle}deg`,
                animation: `${counterAnim} ${duration}s linear infinite`,
                width:  padSize,
                height: padSize,
                borderRadius: "50%",
                border: mobile ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.20)",
                background: icon.bg,
                boxShadow: mobile
                  ? "0 2px 10px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.3)"
                  : "0 4px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "auto",
              } as React.CSSProperties
            }
          >
            <img
              src={icon.src}
              alt={icon.alt}
              width={iconSize}
              height={iconSize}
              style={{ width: iconSize, height: iconSize, objectFit: "contain", display: "block" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Main export ──────────────────────────────────────────────────────────────
// On desktop this fills 100% of whatever container it's placed in.
// The globe is centred; orbits radiate in all directions (may bleed — clip in parent).
export default function OrbitingCirclesGlobe({ mobile = false }: { mobile?: boolean }) {
  const globeSize = mobile ? 120 : 320;
  const iconSize  = mobile ? 20  : 46;
  const padSize   = mobile ? 40  : 82;

  return (
    <div
      style={{
        position: "relative",
        width:  "100%",
        height: "100%",
        minHeight: mobile ? 380 : 0,
      }}
    >
      {/* ── Keyframes ── */}
      <style>{`
        @keyframes og-orbit-cw {
          from { transform: rotate(var(--start-angle)); }
          to   { transform: rotate(calc(var(--start-angle) + 360deg)); }
        }
        @keyframes og-orbit-ccw {
          from { transform: rotate(var(--start-angle)); }
          to   { transform: rotate(calc(var(--start-angle) - 360deg)); }
        }
        @keyframes og-counter-cw {
          from { transform: translateX(-50%) rotate(var(--counter-offset, 0deg)); }
          to   { transform: translateX(-50%) rotate(calc(var(--counter-offset, 0deg) - 360deg)); }
        }
        @keyframes og-counter-ccw {
          from { transform: translateX(-50%) rotate(var(--counter-offset, 0deg)); }
          to   { transform: translateX(-50%) rotate(calc(var(--counter-offset, 0deg) + 360deg)); }
        }
      `}</style>

      {/* ── Centre particle globe ── */}
      <div
        style={{
          position: "absolute",
          top:  "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width:  globeSize,
          height: globeSize,
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <ParticleSphereAnimation />
      </div>

      {/* ── 5 orbit rings ── */}
      {orbits.map((orbit, i) => (
        <OrbitRing
          key={i}
          radius={mobile ? orbit.radiusPx.mobile : orbit.radiusPx.desktop}
          duration={orbit.duration}
          icons={orbit.icons}
          clockwise={i % 2 === 0}
          iconSize={iconSize}
          padSize={padSize}
          mobile={mobile}
        />
      ))}
    </div>
  );
}
