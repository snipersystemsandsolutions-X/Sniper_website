"use client";
import { cn } from "@/lib/utils";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

export const StickyScroll = ({
  content,
  header,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
    tags?: string[];
    moreCount?: number;
  }[];
  header?: {
    eyebrow?: string;
    title: React.ReactNode;
    description?: string;
  };
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0,
    );
    setActiveCard(closestBreakpointIndex);
  });

  // Measure the text column's real rendered height directly instead of
  // relying on flex `items-stretch` — a ResizeObserver reports the exact
  // box height (fires again whenever the active card changes and its
  // title/description/tags reflow), and we apply that as an explicit
  // px height on the image panel. This can't silently fail the way
  // CSS stretch can across browsers/edge cases; it's a measured value,
  // not an inference.
  const textColRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = textColRef.current;
    if (!el) return;

    const update = () => setPanelHeight(el.getBoundingClientRect().height);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ height: `${cardLength * 100}vh` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">

        {/* Static header — pinned along with the cards */}
        {header && (
          <div className="mb-10 sm:mb-14 max-w-3xl">
            {header.eyebrow && (
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-gradient-to-r from-violet-400 to-fuchsia-400" />
                <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-violet-300/80">
                  {header.eyebrow}
                </span>
              </div>
            )}
            <h2 className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tighter font-semibold text-white leading-tight">
              {header.title}
            </h2>
            {header.description && (
              <p className="mt-5 max-w-2xl text-sm sm:text-base text-gray-400 leading-relaxed">
                {header.description}
              </p>
            )}
          </div>
        )}

        <div className="flex w-full flex-col items-start gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">

          {/* Text column — no min-height here anymore: that used to force
              this wrapper to report 26rem even when the active card's
              content was shorter, which is exactly why the ResizeObserver
              was still measuring 416px instead of the real ~268px. The
              26rem floor now lives on the image panel below instead. */}
          <div ref={textColRef} className="relative w-full max-w-xl">
            {content.map((item, index) => (
              <motion.div
                key={item.title + index}
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                className={
                  activeCard === index
                    ? "relative"
                    : "pointer-events-none absolute inset-0 lg:block hidden"
                }
              >
                {/* Mobile-only image — sits above title/description,
                    since the sticky side panel is desktop-only. */}
                <div className="mb-6 h-48 w-full overflow-hidden rounded-md bg-white sm:h-56 lg:hidden">
                  {item.content}
                </div>

                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-violet-300/70">
                  Solution {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="mt-3 text-2xl font-bold text-slate-100">
                  {item.title}
                </h3>
                <p className="mt-5 max-w-md text-base leading-relaxed text-slate-300">
                  {item.description}
                </p>

                {(item.tags?.length || item.moreCount) && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {item.tags?.map((tag, ti) => (
                      <span
                        key={ti}
                        className="text-xs font-medium text-violet-200 bg-violet-500/15 border border-violet-400/20 rounded-full px-3 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.moreCount ? (
                      <span className="text-xs font-medium text-white/50 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                        +{item.moreCount} more
                      </span>
                    ) : null}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Desktop visual panel — height is set explicitly from the
              measured text-column height (see ResizeObserver above), so
              it tracks the real bottom of the title/description/tags
              instead of depending on flex stretch resolving correctly. */}
          <div
            style={{ height: panelHeight ? `${panelHeight}px` : undefined }}
            className={cn(
              "hidden shrink-0 overflow-hidden rounded-md bg-white lg:block sm:h-[20rem] lg:w-[35rem]",
              contentClassName,
            )}
          >
            {content[activeCard].content ?? null}
          </div>
        </div>
      </div>
    </div>
  );
};
