import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center bg-black",
        className
      )}
      // No overflow-hidden here — let the beams breathe
    >
      {/* ── Lamp beam stage ─────────────────────────────────────── */}
      <div
        className="relative w-full flex items-center justify-center"
        style={{ height: "200px" }}
      >
        {/* Left conic beam */}
        <motion.div
          initial={{ opacity: 0.5, width: "10rem" }}
          whileInView={{ opacity: 1, width: "28rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.9, ease: "easeInOut" }}
          style={{
            backgroundImage:
              "conic-gradient(from 70deg at center top, #06b6d4, transparent, transparent)",
            position: "absolute",
            right: "50%",
            top: 0,
            height: "100%",
            transformOrigin: "top right",
          }}
        >
          {/* Fade left edge */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, black 0%, transparent 40%)",
            }}
          />
          {/* Fade bottom */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, black 0%, transparent 50%)",
            }}
          />
        </motion.div>

        {/* Right conic beam */}
        <motion.div
          initial={{ opacity: 0.5, width: "10rem" }}
          whileInView={{ opacity: 1, width: "28rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.9, ease: "easeInOut" }}
          style={{
            backgroundImage:
              "conic-gradient(from 290deg at center top, transparent, transparent, #06b6d4)",
            position: "absolute",
            left: "50%",
            top: 0,
            height: "100%",
            transformOrigin: "top left",
          }}
        >
          {/* Fade right edge */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to left, black 0%, transparent 40%)",
            }}
          />
          {/* Fade bottom */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, black 0%, transparent 50%)",
            }}
          />
        </motion.div>

        {/* Central glow blob — sits at the lamp source point */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "50%",
            transform: "translateX(-50%)",
            width: "18rem",
            height: "10rem",
            borderRadius: "50%",
            background: "rgba(6,182,212,0.45)",
            filter: "blur(48px)",
            zIndex: 10,
          }}
        />

        {/* Bright core pill */}
        <motion.div
          initial={{ width: "6rem" }}
          whileInView={{ width: "14rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.9, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "0",
            left: "50%",
            transform: "translateX(-50%)",
            height: "5rem",
            borderRadius: "50%",
            background: "rgba(34,211,238,0.7)",
            filter: "blur(28px)",
            zIndex: 11,
          }}
        />

        {/* Horizontal glowing line */}
        <motion.div
          initial={{ width: "8rem", opacity: 0 }}
          whileInView={{ width: "28rem", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.9, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "1px",
            left: "50%",
            transform: "translateX(-50%)",
            height: "2px",
            background:
              "linear-gradient(to right, transparent, #22d3ee, transparent)",
            boxShadow: "0 0 12px 2px #22d3ee",
            borderRadius: "2px",
            zIndex: 20,
          }}
        />

        {/* Dark band that hides the very top (lamp body) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: "black",
            zIndex: 15,
          }}
        />

        {/* Bottom fade — seamlessly blends beam into the content below */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "80px",
            background: "linear-gradient(to bottom, transparent, black)",
            zIndex: 12,
          }}
        />
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="relative z-20 w-full flex flex-col items-center px-5 pb-0">
        {children}
      </div>
    </div>
  );
};
