"use client";

import ParticleSphereAnimation from "@/components/ui/orbiting-circles-02-utils/particalsphear";
import React, { memo } from "react";
import { Link } from "react-router-dom";

import appleBusinessWhite from "@/assets/Apple_business_partner_blk.webp";
import appleEduBlk from "@/assets/Apple_Premium_Edu_Partner_blk.webp";
import bentleyLogo from "@/assets/Bentley/bentley_logo.webp";
import nvidialogo from "@/assets/nvidia.png";

// logoW = how wide the logo is inside its circle, in % of the badge width.
// Every badge is the same size; tune logoW per logo to balance them visually.
type OrbitIcon = {
  src: string;
  alt: string;
  angle: number;
  bg: string;
  to: string;
  logoW?: number;
};

type Orbit = {
  radiusPx: { mobile: number; desktop: number };
  duration: number;
  icons: OrbitIcon[];
};

// ─── 5 orbit rings with real partner/tech logos (each links to its partner page) ───
const orbits: Orbit[] = [
  {
    radiusPx: { mobile: 55, desktop: 190 },
    duration: 16,
    icons: [
      { src: appleBusinessWhite, alt: "Apple Business Partner", angle: 0, bg: "#ffffff", to: "/partners/apple", logoW: 76 },
      { src: "https://upload.wikimedia.org/wikipedia/commons/4/41/Autodesk_Logo_2021.svg", alt: "Autodesk", angle: 120, bg: "#ffffff", to: "/partners/autodesk", logoW: 62 },
      { src: "https://upload.wikimedia.org/wikipedia/commons/9/90/Adobe_Corporate_wordmark.svg", alt: "Adobe", angle: 240, bg: "#ffffff", to: "/partners/adobe", logoW: 56 },
    ],
  },
  {
    radiusPx: { mobile: 78, desktop: 272 },
    duration: 22,
    icons: [
      { src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", alt: "Microsoft", angle: 45, bg: "#ffffff", to: "/partners/microsoft", logoW: 56 },
      { src: appleEduBlk, alt: "Apple Premium Education Partner", angle: 135, bg: "#ffffff", to: "/partners/apple", logoW: 76 },
      { src: nvidialogo, alt: "NVIDIA", angle: 225, bg: "#ffffff", to: "/partners/nvidia", logoW: 70 },
      { src: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg", alt: "AWS", angle: 315, bg: "#ffffff", to: "/partners/aws", logoW: 56 },
    ],
  },
  {
    radiusPx: { mobile: 101, desktop: 356 },
    duration: 30,
    icons: [
      { src: "https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg", alt: "Dell", angle: 20, bg: "#ffffff", to: "/partners/dell", logoW: 56 },
      { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Hewlett_Packard_Enterprise_logo_2025.svg/1280px-Hewlett_Packard_Enterprise_logo_2025.svg.png", alt: "HP", angle: 92, bg: "#e4e9ec", to: "/partners/hp", logoW: 64 },
      { src: bentleyLogo, alt: "Bentley Systems", angle: 164, bg: "#ffffff", to: "/partners/bentley", logoW: 68 },
      { src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg", alt: "Cisco", angle: 236, bg: "#ffffff", to: "/partners/cisco", logoW: 56 },
      { src: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Samsung_Black_icon.svg", alt: "Samsung", angle: 308, bg: "#ffffff", to: "/partners", logoW: 62 },
    ],
  },
  {
    radiusPx: { mobile: 124, desktop: 440 },
    duration: 38,
    icons: [
      { src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", alt: "Google", angle: 60, bg: "#ffffff", to: "/partners", logoW: 62 },
      { src: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Lenovo_%282015%29.svg", alt: "Lenovo", angle: 150, bg: "#ffffff", to: "/partners/lenovo", logoW: 64 },
      { src: "https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg", alt: "Logitech", angle: 240, bg: "#ffffff", to: "/partners/logitech", logoW: 62 },
      { src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Jabra_Logo.png", alt: "Jabra", angle: 330, bg: "#ffffff", to: "/partners", logoW: 66 },
    ],
  },
  {
    radiusPx: { mobile: 147, desktop: 526 },
    duration: 48,
    icons: [
      { src: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg", alt: "ASUS", angle: 30, bg: "#ffffff", to: "/partners/asus", logoW: 62 },
      { src: "https://upload.wikimedia.org/wikipedia/commons/8/8d/LG_logo_%282014%29.svg", alt: "LG", angle: 102, bg: "#ffffff", to: "/partners", logoW: 56 },
      { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Acer_2011.svg/1280px-Acer_2011.svg.png", alt: "Acer", angle: 174, bg: "#ffffff", to: "/partners/acer", logoW: 64 },
      { src: "https://upload.wikimedia.org/wikipedia/commons/4/41/BenQ_wordmark.svg", alt: "BenQ", angle: 246, bg: "#ffffff", to: "/partners", logoW: 62 },
      { src: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Super_Micro_Computer_Logo.svg", alt: "Supermicro", angle: 318, bg: "#ffffff", to: "/partners", logoW: 66 },
    ],
  },
];

// Static CSS lives outside the component so it is not re-created on every render
const ORBIT_CSS = `
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

  .og-arm, .og-badge { will-change: transform; }

  /* Overlapping badges: the hovered one comes to the front */
  .og-badge { z-index: 1; transition: box-shadow 0.2s ease; }
  .og-badge:hover,
  .og-badge:focus-visible { z-index: 20; box-shadow: 0 0 0 2px rgba(255,255,255,0.55), 0 6px 28px rgba(0,0,0,0.6) !important; outline: none; }

  /* Respect users who prefer less motion */
  @media (prefers-reduced-motion: reduce) {
    .og-arm, .og-badge { animation-play-state: paused !important; }
  }
`;

// ─── Single orbit ring — centred on the sphere ───────────────────────────────
const OrbitRing = memo(function OrbitRing({
  radius,
  duration,
  icons,
  clockwise,
  padSize,
  mobile,
}: {
  radius: number;
  duration: number;
  icons: OrbitIcon[];
  clockwise: boolean;
  padSize: number;
  mobile?: boolean;
}) {
  const diameter = radius * 2;
  const orbitAnim = clockwise ? "og-orbit-cw" : "og-orbit-ccw";
  const counterAnim = clockwise ? "og-counter-cw" : "og-counter-ccw";
  const borderWidth = mobile ? "1px" : "2px";

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: diameter,
        height: diameter,
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        border: `${borderWidth} solid rgba(255, 255, 255, 0.16)`,
        pointerEvents: "none",
      }}
    >
      {icons.map((icon) => (
        <div
          key={icon.alt}
          className="og-arm"
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
          <Link
            to={icon.to}
            aria-label={icon.alt}
            title={icon.alt}
            className="og-badge"
            style={
              {
                position: "absolute",
                top: `-${padSize / 2}px`,
                left: "50%",
                transform: "translateX(-50%)",
                "--counter-offset": `${-icon.angle}deg`,
                animation: `${counterAnim} ${duration}s linear infinite`,
                width: padSize,
                height: padSize,
                borderRadius: "50%",
                border: mobile
                  ? "1px solid rgba(255,255,255,0.15)"
                  : "1px solid rgba(255,255,255,0.20)",
                background: icon.bg,
                boxShadow: mobile
                  ? "0 2px 10px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.3)"
                  : "0 4px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                pointerEvents: "auto",
                cursor: "pointer",
              } as React.CSSProperties
            }
          >
            <img
              src={icon.src}
              alt={icon.alt}
              loading="lazy"
              decoding="async"
              draggable={false}
              style={{
                width: `${icon.logoW ?? 56}%`,
                height: "auto",
                maxHeight: "62%",
                objectFit: "contain",
                display: "block",
              }}
            />
          </Link>
        </div>
      ))}
    </div>
  );
});

// ─── Main export ──────────────────────────────────────────────────────────────
export default function OrbitingCirclesGlobe({ mobile = false }: { mobile?: boolean }) {
  const globeSize = mobile ? 120 : 320;
  const padSize = mobile ? 40 : 82;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: mobile ? 380 : 0,
      }}
    >
      <style>{ORBIT_CSS}</style>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: globeSize,
          height: globeSize,
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <ParticleSphereAnimation />
      </div>

      {orbits.map((orbit, i) => (
        <OrbitRing
          key={i}
          radius={mobile ? orbit.radiusPx.mobile : orbit.radiusPx.desktop}
          duration={orbit.duration}
          icons={orbit.icons}
          clockwise={i % 2 === 0}
          padSize={padSize}
          mobile={mobile}
        />
      ))}
    </div>
  );
}