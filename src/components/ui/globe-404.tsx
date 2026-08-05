import createGlobe, { type COBEOptions } from "cobe";
import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const GLOBE_CONFIG: COBEOptions = {
  width: 600,
  height: 600,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 1,
  diffuse: 1.2,
  mapSamples: 16000,
  mapBrightness: 6,
  baseColor: [0.2, 0.2, 0.2],
  markerColor: [1, 0.39, 0.08],
  glowColor: [0.6, 0.6, 0.6],
  markers: [
    { location: [13.0827, 80.2707], size: 0.08 }, // Chennai
    { location: [19.076, 72.8777], size: 0.07 },  // Mumbai
    { location: [28.6139, 77.209], size: 0.07 },  // Delhi
    { location: [40.7128, -74.006], size: 0.06 }, // New York
    { location: [51.5074, -0.1278], size: 0.06 }, // London
    { location: [35.6762, 139.6503], size: 0.05 }, // Tokyo
    { location: [1.3521, 103.8198], size: 0.05 }, // Singapore
  ],
};

export interface GlobeProps {
  className?: string;
  config?: COBEOptions;
}

export function Globe404({ className, config = GLOBE_CONFIG }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const widthRef = useRef(0);

  const onRender = useCallback((state: Record<string, any>) => {
    phiRef.current += 0.005;
    state.phi = phiRef.current;
    state.width = widthRef.current * 2;
    state.height = widthRef.current * 2;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      widthRef.current = canvas.offsetWidth;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const globe = createGlobe(canvas, {
      ...config,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      onRender,
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", handleResize);
    };
  }, [config, onRender]);

  return (
    <div className={cn("relative aspect-square w-full", className)}>
      <canvas
        ref={canvasRef}
        style={{ background: "transparent" }}
        className="size-full [contain:layout_paint_size]"
      />
    </div>
  );
}
