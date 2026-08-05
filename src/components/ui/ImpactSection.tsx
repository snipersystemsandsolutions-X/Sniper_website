import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import ShinyText from "./ShinyText";
// Using a plain <img> here since this file isn't running inside a Next.js
// build — swap back to `import Image from "next/image"` + `<Image fill />`
// in your actual app if you want Next's image optimization.

const impactCards = [
  {
    id: 0,
    metric: "4K",
    title: "Real-Time Photorealistic Rendering",
    description:
      "Unreal Engine's Lumen and Nanite pipelines deliver cinema-grade, ray-traced visuals at interactive frame rates — no pre-baked lighting, no compromise on fidelity.",
    image:
      "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&w=1200&q=80",
    bg: "bg-[#E0CFF7]",
    text: "text-[#1b0b33]",
    isFeature: true,
  },
  {
    id: 1,
    metric: "45%",
    title: "Real-Time Collaboration",
    description:
      "Unreal Engine enables stakeholders to collaborate within shared digital environments, allowing engineers, architects, designers, and decision-makers to interact with projects in real time — improving communication, accelerating approvals, and reducing costly project delays.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    bg: "bg-[#2A1854]",
    text: "text-white",
  },
  {
    id: 2,
    metric: "60%",
    title: "Enterprise Digital Twins",
    description:
      "Digital twins provide a live digital representation of physical assets, facilities, infrastructure, and manufacturing environments. By integrating IoT sensors, cloud platforms, engineering data, and AI analytics, organizations gain real-time visibility into operational performance, predictive maintenance, and resource utilization.",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    bg: "bg-[#150a2e]",
    text: "text-white",
  },
  {
    id: 3,
    metric: "10+",
    title: "Cross-Platform Experiences",
    description:
      "Applications developed with Unreal Engine can be deployed across desktops, mobile devices, web browsers, VR headsets, AR devices, immersive displays, and cloud-based streaming environments — reaching users across departments, locations, and devices while maintaining a consistent, high-quality experience.",
    image:
      "https://images.unsplash.com/photo-1626387346567-68d0827de37c?auto=format&fit=crop&w=1200&q=80",
    bg: "bg-[#6E32CF]",
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

            <h2 className="text-4xl sm:text-4xl md:text-5xl leading-[1.05] font-semibold text-white tracking-tighter">
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
            const closedHeights = [280, 330, 390, 430];
            const targetHeight = isOpen ? 460 : closedHeights[idx];

            return (
              <motion.div
                key={card.id}
                onMouseEnter={() => setOpenCard(idx)}
                onFocus={() => setOpenCard(idx)}
                onClick={() => setOpenCard(idx)}
                tabIndex={0}
                animate={{ flex: isOpen ? 4.8 : 1.5 }}
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
                          <h3 className="text-[28px] sm:text-[32px] md:text-[36px] leading-[1.05] font-semibold mb-2">
                            Photorealistic Visualization
                            <br />
                            case study
                          </h3>
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 text-[11px] tracking-[1.4px] uppercase font-semibold"
                          >
                            Read case study <ArrowRight size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="max-w-[300px]">
                          <p className="text-[10px] tracking-[1.3px] uppercase font-semibold opacity-80">
                            Case study
                          </p>
                          <h3 className="mt-2 text-[22px] sm:text-[26px] md:text-[30px] leading-[1.08] font-semibold">
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
                            Read case study <ArrowRight size={14} />
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
