// Built using Hyperiux Vault: https://vault.hyperiux.com

import { useEffect, useMemo, useState, type CSSProperties } from "react";

type CSSVars = CSSProperties & Record<string, string | number | undefined>;

export interface HoverStackCard {
  id?: number;
  quote: string;
  tag?: string;
  bg: string;
  accent?: string;
}

interface PreparedHoverStackCard extends HoverStackCard {
  _rotation: number;
  _baseX: number;
  _baseZ: number;
}

export interface HoverStackProps {
  cards?: HoverStackCard[];
  cardWidth?: number;
  cardHeight?: number;
  overlap?: number;
  hoverLift?: number;
  pushDistance?: number;
  spread?: number;
  rotation?: number;
  duration?: number;
  accentColor?: string;
  className?: string;
}

const PRESET_ROTATIONS = [-8, 4, -3, 5, -4, 6, 3, -6, 2, -5];

const DEFAULT_CARDS: HoverStackCard[] = [
  { quote: "A must-have for anyone looking to save time and boost productivity.", tag: "Efficiency", bg: "#E4FF1A", accent: "text-[#1A1A1A]" },
  { quote: "This tech has completely streamlined my daily tasks.", tag: "Workflow", bg: "#DD1155", accent: "text-white" },
  { quote: "Innovative and powerful, yet so easy to use!", tag: "Simplicity", bg: "#FF5714", accent: "text-[#1A1A1A]" },
  { quote: "It made everything smoother. Highly recommend!", tag: "Reliability", bg: "#E980FC", accent: "text-[#1A1A1A]" },
  { quote: "Fast, reliable, and user-friendly. Exactly what I needed.", tag: "Speed", bg: "#67D6A3", accent: "text-[#1A1A1A]" },
  { quote: "I can't imagine my workflow without it now. Simply amazing!", tag: "Impact", bg: "#3454D1", accent: "text-white" },
  { quote: "Performance is a game changer. So much smoother now.", tag: "Performance", bg: "#B98CFF", accent: "text-[#1A1A1A]" },
];

function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function CardFooter({ index }: { index: number }) {
  return (
    <div className="relative z-[2] flex flex-col gap-4">
      <div className="h-px w-full bg-current/15" />
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-black text-white shadow-[0_4px_12px_rgba(0,0,0,0.18)]">
            <ArrowUpRight className="size-[15px]" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">
            Explore
          </span>
        </div>
        <span className="text-[11px] font-medium uppercase tabular-nums tracking-[0.16em] opacity-55">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

function HoverStack({
  cards = DEFAULT_CARDS,
  cardWidth = 280,
  cardHeight = 360,
  overlap = 96,
  hoverLift = 30,
  pushDistance = 235,
  spread = 24,
  rotation = 7,
  duration = 0.5,
  accentColor = "transparent",
  className = "",
}: HoverStackProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false)
  );

  useEffect(() => {
    setHasMounted(true);
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const onChange = (event: MediaQueryListEvent) => {
      setReduceMotion(event.matches);
      if (event.matches) setActiveIndex(null);
    };
    setReduceMotion(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const preparedCards: PreparedHoverStackCard[] = useMemo(() => {
    const rotationScale = rotation / 7;
    return cards.map((card, index) => {
      const presetRotation =
        PRESET_ROTATIONS[index % PRESET_ROTATIONS.length] +
        (index % 2 === 0 ? 0 : 1);
      const baseX = index * overlap;
      return {
        ...card,
        _rotation: presetRotation * rotationScale,
        _baseX: baseX,
        _baseZ: index + 1,
      };
    });
  }, [cards, overlap, rotation]);

  const getCardStyle = (card: PreparedHoverStackCard, index: number): CSSVars => {
    const isActive = activeIndex === index;
    const hasActive = activeIndex !== null;

    let x = card._baseX;
    let y = 0;
    let rotate = card._rotation;
    let zIndex = card._baseZ;
    let scale = 1;

    if (reduceMotion) {
      if (isActive) zIndex = 999;
      return {
        "--card-width": `${cardWidth}px`,
        "--card-height": `${cardHeight}px`,
        transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(1)`,
        zIndex,
        transition: "none",
        background: card.bg,
      };
    }

    let boxShadow: string | undefined;

    if (hasActive) {
      if (index < activeIndex) {
        x -= pushDistance;
        y -= spread * 0.4;
      } else if (index > activeIndex) {
        x += pushDistance;
        y += spread * 0.4;
      }

      if (isActive) {
        x = card._baseX;
        y = -hoverLift;
        rotate = 0;
        zIndex = 999;
        scale = 1.035;
        boxShadow = `0 0 0 3px ${accentColor}`;
      }
    }

    const activeMs = Math.max(0, duration) * 1000;
    const transition = isActive
      ? `transform ${activeMs}ms cubic-bezier(0.22, 1.6, 0.32, 1), box-shadow ${activeMs * (900 / 700)}ms cubic-bezier(0.22, 1.6, 0.32, 1)`
      : hasActive
        ? `transform ${activeMs}ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow ${activeMs}ms cubic-bezier(0.22, 1, 0.36, 1)`
        : `transform ${activeMs * (480 / 700)}ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow ${activeMs * (380 / 700)}ms cubic-bezier(0.4, 0, 0.2, 1)`;

    return {
      "--card-width": `${cardWidth}px`,
      "--card-height": `${cardHeight}px`,
      transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`,
      zIndex,
      transition,
      background: card.bg,
      boxShadow,
    };
  };

  const totalWidth =
    preparedCards.length > 0
      ? preparedCards.at(-1)!._baseX + cardWidth
      : cardWidth;

  if (!hasMounted) return null;

  return (
    <div className={`relative w-full px-[7vw] ${className}`}>
      {isTouch ? (
        <div className="flex flex-col gap-[8.8vw]">
          {cards.map((card, index) => (
            <div
              key={card.id ?? index}
              className={`relative flex min-h-[62vw] w-full cursor-default select-none flex-col justify-between overflow-hidden rounded-3xl border border-black/10 p-6 ${card.accent || ""}`}
              style={{ background: card.bg }}
            >
              <div />
              <div className="relative z-[2] flex flex-1 items-center">
                <p className="m-0 max-w-full text-2xl leading-[1.05] tracking-[-0.03em] max-md:text-xl">
                  "{card.quote}"
                </p>
              </div>
              <CardFooter index={index} />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="relative mx-auto"
          style={{
            "--stack-width": `${totalWidth}px`,
            "--stack-height": `${cardHeight + (reduceMotion ? 0 : hoverLift) + 24}px`,
            width: "var(--stack-width)",
            height: "var(--stack-height)",
          } as CSSVars}
        >
          {preparedCards.map((card, index) => (
            <div
              key={card.id ?? index}
              className={`absolute left-0 top-0 flex h-[var(--card-height)] w-[var(--card-width)] origin-[center_center] cursor-pointer select-none flex-col justify-between overflow-hidden rounded-2xl border border-black/10 p-6 will-change-transform ${card.accent || ""}`}
              style={getCardStyle(card, index)}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div />
              <div className="relative z-[2] flex flex-1 items-center">
                <p className="m-0 max-w-[95%] text-[1.75rem] leading-[1] tracking-[-0.03em]">
                  "{card.quote}"
                </p>
              </div>
              <CardFooter index={index} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HoverStack;
