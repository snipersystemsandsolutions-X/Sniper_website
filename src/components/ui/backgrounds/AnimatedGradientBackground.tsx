import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";

interface AnimatedGradientBackgroundProps {
   /**
    * Initial size of the radial gradient, defining the starting width.
    * @default 110
    */
   startingGap?: number;

   /**
    * Enables or disables the breathing animation effect.
    * @default false
    */
   Breathing?: boolean;

   /**
    * Array of colors to use in the radial gradient.
    * Each color corresponds to a stop percentage in `gradientStops`.
    * @default ["#0A0A0A", "#2979FF", "#FF80AB", "#FF6D00", "#FFD600", "#00E676", "#3D5AFE"]
    */
   gradientColors?: string[];

   /**
    * Array of percentage stops corresponding to each color in `gradientColors`.
    * The values should range between 0 and 100.
    * @default [35, 50, 60, 70, 80, 90, 100]
    */
   gradientStops?: number[];

   /**
    * Speed of the breathing animation.
    * Lower values result in slower animation.
    * @default 0.02
    */
   animationSpeed?: number;

   /**
    * Maximum range for the breathing animation in percentage points.
    * Determines how much the gradient "breathes" by expanding and contracting.
    * @default 5
    */
   breathingRange?: number;

   /**
    * Additional inline styles for the gradient container.
    * @default {}
    */
   containerStyle?: React.CSSProperties;

   /**
    * Additional class names for the gradient container.
    * @default ""
    */
   containerClassName?: string;


   /**
    * Additional top offset for the gradient container form the top to have a more flexible control over the gradient.
    * @default 0
    */
   topOffset?: number;

   /**
    * Height (in %) of the fade-to-black region pinned to the bottom of the
    * container, used to make the hero blend seamlessly into the next
    * section instead of ending on a hard edge.
    * Set to 0 to disable.
    * @default 20
    */
   bottomFadeHeight?: number;

   /**
    * Color the bottom fade blends into. Defaults to a near-black that
    * matches common dark hero backgrounds — override to match your
    * section's actual bg color for a perfect seam.
    * @default "#000000"
    */
   bottomFadeColor?: string;
}

/**
 * AnimatedGradientBackground
 *
 * This component renders a customizable animated radial gradient background with a subtle breathing effect.
 * It uses `framer-motion` for an entrance animation and raw CSS gradients for the dynamic background.
 *
 *
 * @param {AnimatedGradientBackgroundProps} props - Props for configuring the gradient animation.
 * @returns JSX.Element
 */
const AnimatedGradientBackground: React.FC<AnimatedGradientBackgroundProps> = ({
   startingGap = 125,
   Breathing = false,
   gradientColors = [
      "#0A0612",
      "#7C4DFF",
      "#C9AFFF",
      "#4A2FD1",
      "#2E1A7A",
      "#1B0F52",
      "#120A33"
   ],
   gradientStops = [35, 50, 60, 70, 80, 90, 100],
   animationSpeed = 0.02,
   breathingRange = 5,
   containerStyle = {},
   topOffset = 0,
   containerClassName = "",
   bottomFadeHeight = 20,
   bottomFadeColor = "#000000",
}) => {



   // Validation: Ensure gradientStops and gradientColors lengths match
   if (gradientColors.length !== gradientStops.length) {
      throw new Error(
         `GradientColors and GradientStops must have the same length.
     Received gradientColors length: ${gradientColors.length},
     gradientStops length: ${gradientStops.length}`
      );
   }

   const containerRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      let animationFrame: number;
      let width = startingGap;
      let directionWidth = 1;

      const animateGradient = () => {
         if (width >= startingGap + breathingRange) directionWidth = -1;
         if (width <= startingGap - breathingRange) directionWidth = 1;

         if (!Breathing) directionWidth = 0;
         width += directionWidth * animationSpeed;

         const gradientStopsString = gradientStops
            .map((stop, index) => `${gradientColors[index]} ${stop}%`)
            .join(", ");

         // Note: percentages here resolve against each axis independently
         // (width% against the container's own width, height% against its
         // own height). Using the same number for both means the ellipse's
         // aspect ratio always matches the container's aspect ratio
         // automatically — so it stays visually proportioned to the box
         // it's in, whether that box is squarish or a wide, short hero.
         const gradientStopsFinal = gradientStopsString;
         const gradient = `radial-gradient(${width}% ${width + topOffset}% at 50% 20%, ${gradientStopsFinal})`;

         if (containerRef.current) {
            containerRef.current.style.background = gradient;
         }

         animationFrame = requestAnimationFrame(animateGradient);
      };

      animationFrame = requestAnimationFrame(animateGradient);

      return () => cancelAnimationFrame(animationFrame); // Cleanup animation
   }, [startingGap, Breathing, gradientColors, gradientStops, animationSpeed, breathingRange, topOffset]);

   return (
      <motion.div
         key="animated-gradient-background"
         initial={{
            opacity: 0,
            scale: 1.5,
         }}
         animate={{
            opacity: 1,
            scale: 1,
            transition: {
               duration: 2,
               ease: [0.25, 0.1, 0.25, 1], // Cubic bezier easing
             },
         }}
         className={`absolute inset-0 overflow-hidden ${containerClassName}`}
      >
         <div
            ref={containerRef}
            style={containerStyle}
            className="absolute inset-0 transition-transform"
         />

         {/* Bottom fade — dissolves the hard edge of the gradient into
             black so the hero blends seamlessly into whatever section
             follows, instead of cutting off abruptly. */}
         {bottomFadeHeight > 0 && (
            <div
               aria-hidden="true"
               className="absolute bottom-0 left-0 right-0 pointer-events-none"
               style={{
                  height: `${bottomFadeHeight}%`,
                  background: `linear-gradient(to bottom, transparent, ${bottomFadeColor})`,
               }}
            />
         )}
      </motion.div>
   );
};

export default AnimatedGradientBackground;