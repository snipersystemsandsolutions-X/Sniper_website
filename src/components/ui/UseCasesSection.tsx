import { ArrowRight } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Enterprise from "@/assets/Enterprise_visualization.jpg";
import Interactive from "@/assets/Interactive_product_experience.jpg";
import Extended from "@/assets/Extended_reality.jpg";
import simulation from "@/assets/Simulation_training.jpg";


const ease = [0.16, 1, 0.3, 1] as const;

// ========================================================
// ✦ DATA — swap/reorder freely, grid supports any length
// ========================================================
const KEY_USE_CASES = [
  {
    tag: "USE CASE 01",
    title: "Enterprise Visualization",
    description:
      "Turn engineering models, facilities, and operational data into interactive walkthroughs that speed up reviews and decisions.",
    image: Enterprise,
    url: "https://www.unrealengine.com/uses/architecture",
    
  },
  {
    tag: "USE CASE 02",
    title: "Interactive Product Experiences",
    description:
      "Let customers configure, explore, and personalize products in real time — configurators, showrooms, and sales demos that shorten the sales cycle.",
    image: Interactive,
    url: "https://www.unrealengine.com/uses/automotive",
  },
  {
    tag: "USE CASE 03",
    title: "Simulation & Training",
    description:
      "Build realistic, low-risk training environments for safety, equipment operation, and emergency response that improve readiness at lower cost.",
    image: simulation,
    url: "https://www.unrealengine.com/en-US/solutions/simulation",
  },
  {
    tag: "USE CASE 04",
    title: "Extended Reality (XR)",
    description:
      "Deliver AR, VR, and MR experiences for remote collaboration, design validation, and product demonstrations across any device.",
    image: Extended,
    url: "https://www.unrealengine.com/en-US/virtual-production",
  },
];

// ========================================================
// ✦ FADE-UP (self-contained, no parent deps required)
// ========================================================
const FadeUp = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease, delay }}
    >
      {children}
    </motion.div>
  );
};

// ========================================================
// ✦ CARD
// ========================================================
const UseCaseCard = ({
  useCase,
  index,
}: {
  useCase: (typeof KEY_USE_CASES)[number];
  index: number;
}) => {
  return (
    <FadeUp delay={0.05 * index} className="h-full">
      <a
  href={useCase.url}
  target="_blank"
  rel="noopener noreferrer"
  className="group relative h-full flex flex-col rounded-2xl bg-white p-3
  ring-1 ring-black/[0.04] transition-shadow duration-300
  hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] cursor-pointer"
>
        {/* Thumbnail — flat banner ratio, matches the reference proportions
            instead of a tall, oversized hero image */}
          <div className="relative w-full aspect-[12/5] overflow-hidden rounded-xl">
              <img
                src={useCase.image}
                alt={useCase.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <span
                className="absolute left-3 top-3 rounded-full bg-black/80 px-2.5 py-1
                text-[10px] font-medium tracking-wide text-white"
              >
                {useCase.tag}
              </span>
            </div>

        {/* Copy — compact, single padding source, tight rhythm */}
        <div className="flex flex-col flex-1 px-1 pt-4 pb-1">
          <h3 className="text-base sm:text-xl  font-semibold tracking-tighter text-[#14101f]">
            {useCase.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed tracking-tight text-[#14101f]/60">
            {useCase.description}
          </p>

          <button
            className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#14101f]
            px-3.5 py-1.5 text-xs font-medium text-white transition-colors duration-300
            hover:bg-[#2a1f45]"
          >
            Discover
            <ArrowRight className="h-5 w-3" />
          </button>
        </div>
      </a>
    </FadeUp>
  );
};

// ========================================================
// ✦ SECTION
// ========================================================
const UseCasesSection = () => {
  return (
    <section
      className="relative px-4 sm:px-6 py-16 sm:py-20"
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1100px" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Eyebrow */}
        <FadeUp className="flex items-center gap-3 mb-6">
          <span className="h-px w-8 bg-gradient-to-r from-violet-400 to-fuchsia-400" />
          <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-violet-300/80">
            Key Use Cases
          </span>
        </FadeUp>

        {/* Heading */}
        <FadeUp delay={0.05}>
          <h2 className="text-4xl sm:text-4xl md:text-5xl font-heading font-semibold text-white mb-4 sm:mb-5 leading-tight max-w-2xl tracking-tighter">
            Push the boundaries of what's possible
          </h2>
        </FadeUp>

        <FadeUp delay={0.1}>
          <p className="text-sm sm:text-base text-violet-100/70 leading-relaxed max-w-2xl mb-10 sm:mb-14">
            Explore how enterprises put Unreal Engine to work — from real-time
            visualization to XR — to unlock measurable business outcomes.
          </p>
        </FadeUp>

        {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {KEY_USE_CASES.map((useCase, i) => (
            <UseCaseCard key={useCase.title} useCase={useCase} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
