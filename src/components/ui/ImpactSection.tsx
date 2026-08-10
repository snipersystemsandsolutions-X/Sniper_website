import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import ShinyText from "./ShinyText";
// Using a plain <img> here since this file isn't running inside a Next.js
// build — swap back to `import Image from "next/image"` + `<Image fill />`
// in your actual app if you want Next's image optimization.

// ────────────────────────────────────────────────────────────────
// Cards now match the section's actual heading — "Why Choose Sniper
// for Unreal Engine." Previously these five slots held Unreal
// Engine *platform* capabilities (Photorealistic Rendering,
// Cross-Platform, etc.), which duplicated content already covered
// elsewhere on the page and didn't match what the heading/intro
// paragraph actually promised. Swapped in the PDF's "Why
// Partner with Sniper Systems" differentiators instead, capped at
// 5 cards (not the full 9-item bullet list) to keep this section
// scannable.
// ────────────────────────────────────────────────────────────────
const impactCards = [
  {
    id: 0,
    metric: "01",
    title: "Authorized Unreal Engine Partner",
    description:
      "Sniper Systems is an Authorized Unreal Engine Partner in India, giving enterprises a trusted, direct line to licensing, technical guidance, and platform expertise.",
    image:
      "https://images.unsplash.com/photo-1672380135241-c024f7fbfa13?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      
    bg: "bg-[#E0CFF7]",
    text: "text-[#1b0b33]",
    isFeature: true,
  },
  {
    id: 1,
    metric: "02",
    title: "Enterprise-Focused Consulting",
    description:
      "Experienced solution architects work with your team from the earliest scoping conversations, bringing industry-specific expertise to every engagement.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    bg: "bg-[#2A1854]",
    text: "text-white",
  },
  {
    id: 2,
    metric: "03",
    title: "Cloud & AI Integration",
    description:
      "We connect real-time 3D environments with cloud platforms and AI analytics, so visualization stays tied to live operational data rather than static files.",
    image:
      "https://images.unsplash.com/photo-1667984390538-3dea7a3fe33d?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bg: "bg-[#150a2e]",
    text: "text-white",
  },
  {
    id: 3,
    metric: "04",
    title: "End-to-End Implementation",
    description:
      "From initial rollout through managed services and ongoing optimization, we stay involved well past go-live.",
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bg: "bg-[#6E32CF]",
    text: "text-white",
  },
  {
    id: 4,
    metric: "05",
    title: "Pan-India Delivery & Support",
    description:
      "Nationwide delivery and support built for long-term technology partnerships, not one-off projects.",
    image:
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=1200&auto=format&fit=crop&q=70",
    bg: "bg-[#3a1f66]",
    text: "text-white",
  },
];

export default function ImpactSection() {
  const [openCard, setOpenCard] = useState(0);

  return (
    <section className="w-full py-12 sm:py-16 md:py-20">
      <div className="w-full">
        <div className="flex items-start justify-between gap-6 mb-8 sm:mb-10">
          <div className="max-w-[620px]">
             <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-gradient-to-r from-violet-400 to-fuchsia-400" />
                <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-violet-300/80">
                  partner advantage
                </span>
              </div>

            {/* was tracking-tighter — pulled back to tracking-tight, letters
                were sitting close enough to hurt legibility at this size */}
            <h2 className="text-4xl sm:text-4xl md:text-5xl leading-[1.05] font-semibold text-white tracking-tight">
              Why Choose Sniper for Unreal Engine
            </h2>
            <p className="mt-4 text-xs sm:text-[15px] text-white/70 leading-[1.7] max-w-[560px]">
              As an Authorized Unreal Engine Partner, Sniper Systems & Solutions works closely with enterprises to design, develop, and deploy scalable real-time 3D solutions that align with business objectives and operational goals.
            </p>
          </div>


        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-0">
          {impactCards.map((card, idx) => {
            const isOpen = openCard === idx;
            const closedHeights = [280, 320, 360, 390, 430];
            const targetHeight = isOpen ? 460 : closedHeights[idx];

            return (
              <motion.div
                key={card.id}
                onMouseEnter={() => setOpenCard(idx)}
                onFocus={() => setOpenCard(idx)}
                onClick={() => setOpenCard(idx)}
                tabIndex={0}
                animate={{ flex: isOpen ? 4.4 : 1.3 }}
                transition={{ type: "spring", stiffness: 220, damping: 28 }}
                className={`${card.bg} ${card.text} relative overflow-hidden  h-[360px] md:h-auto cursor-pointer`}
              >
                <motion.div
                  animate={{ height: targetHeight }}
                  transition={{ type: "spring", stiffness: 260, damping: 30 }}
                  className="h-full"
                >
                  {isOpen ? (
                    <div className="h-full p-6 sm:p-8 md:p-10 flex flex-col">
                      {card.isFeature ? (
                        <div className="max-w-[280px]">
                          <p className="text-[10px] tracking-[1.3px] uppercase font-semibold opacity-80">
                            Why Sniper
                          </p>
                          <h3 className="mt-2 text-[28px] sm:text-[32px] md:text-[36px] leading-[1.05] font-semibold tracking-tight">
                            {card.title}
                          </h3>
                          <p
                            className="mt-3 text-[13px] sm:text-[14px] leading-[1.6] opacity-90 overflow-hidden"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {card.description}
                          </p>
                          <button
                            type="button"
                            className="mt-4 inline-flex items-center gap-2 text-[11px] tracking-[1.4px] uppercase font-semibold"
                          >
                            Talk to our team <ArrowRight size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="max-w-[300px]">
                          <p className="text-[10px] tracking-[1.3px] uppercase font-semibold opacity-80">
                            Why Sniper
                          </p>
                          <h3 className="mt-2 text-[22px] sm:text-[26px] md:text-[30px] leading-[1.08] font-semibold tracking-tight">
                            {card.title}
                          </h3>
                          {/* Clamped to 3 lines so a long description can never push the
                              stat + image below out of the card's fixed height — it just
                              truncates here instead of overflowing/clipping further down. */}
                          <p
                            className="mt-3 text-[13px] sm:text-[14px] leading-[1.6] opacity-90 overflow-hidden"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {card.description}
                          </p>
                          <button
                            type="button"
                            className="mt-4 inline-flex items-center gap-2 text-[11px] tracking-[1.4px] uppercase font-semibold"
                          >
                            Talk to our team <ArrowRight size={14} />
                          </button>
                        </div>
                      )}

                      {/* Stat + image pinned to the bottom of the card via mt-auto —
                          stays at a fixed height/position no matter how tall the text
                          block above ends up, instead of being squeezed and clipped by
                          the card's fixed overall height. */}
                      <div className="mt-auto pt-6 grid grid-cols-1 sm:grid-cols-[1.05fr_1fr] gap-4 items-end">
                        <div>
                          <p className="text-[56px] sm:text-[62px] md:text-[72px] font-semibold leading-none">
                            {card.metric}
                          </p>
                          <p className="mt-2 text-[11px] tracking-[1.2px] uppercase font-semibold">
                            {card.title}
                          </p>
                        </div>

                        <div
                          className={`relative w-full rounded-sm overflow-hidden border border-black/10 ${
                            card.isFeature
                              ? "h-[160px] sm:h-[180px] md:h-[200px]"
                              : "h-[130px] sm:h-[150px] md:h-[160px]"
                          }`}
                        >
                          <img
                            src={card.image}
                            alt={card.title}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full p-5 sm:p-6 md:p-7 flex flex-col justify-between">
                      <div />
                      <div>
                        <p className="text-[28px] sm:text-[32px] md:text-[36px] font-semibold leading-none">
                          {card.metric}
                        </p>
                        <p className="mt-2 text-[11px] tracking-[1.2px] uppercase font-semibold max-w-[120px]">
                          {card.title}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 bg-[#150a2e] text-white rounded-full px-5 sm:px-8 py-4 flex items-center justify-center text-center">
          <p className="text-[13px] sm:text-[14px] leading-[1.4]">
            <ShinyText
              text=" See your potential. Estimate your ROI with Unreal Engine — talk to our solutions team."
              speed={2}
              delay={0}
              color="#b5b5b5"
              shineColor="#ffffff"
              spread={120}
              direction="left"
              yoyo={false}
              pauseOnHover={false}
              disabled={false}
            />

          </p>
        </div>
      </div>
    </section>
  );
}