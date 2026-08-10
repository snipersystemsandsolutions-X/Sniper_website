"use client";

import { useEffect, useRef } from "react";

export default function ParticleSphereAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const PARTICLE_COUNT = 900;
    const RADIUS = Math.min(width, height) * 0.42;

    // Generate particles on a sphere surface using Fibonacci lattice
    const particles: { x: number; y: number; z: number; ox: number; oy: number; oz: number }[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      particles.push({
        ox: Math.cos(theta) * r,
        oy: y,
        oz: Math.sin(theta) * r,
        x: 0, y: 0, z: 0,
      });
    }

    let rotX = 0.003;
    let rotY = 0.006;
    let angle = 0;

    // Rotation matrix helpers
    const rotateX = (p: { x: number; y: number; z: number }, a: number) => {
      const cos = Math.cos(a), sin = Math.sin(a);
      return { x: p.x, y: p.y * cos - p.z * sin, z: p.y * sin + p.z * cos };
    };
    const rotateY = (p: { x: number; y: number; z: number }, a: number) => {
      const cos = Math.cos(a), sin = Math.sin(a);
      return { x: p.x * cos + p.z * sin, y: p.y, z: -p.x * sin + p.z * cos };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      angle += 0.006;

      const cx = width / 2;
      const cy = height / 2;

      const projected = particles.map((p) => {
        let pt = { x: p.ox, y: p.oy, z: p.oz };
        pt = rotateY(pt, angle * rotY / 0.006);
        pt = rotateX(pt, angle * rotX / 0.006);
        const z = pt.z;
        const scale = RADIUS / (RADIUS - z * RADIUS * 0.6 + RADIUS);
        return {
          sx: cx + pt.x * RADIUS * scale,
          sy: cy + pt.y * RADIUS * scale,
          z: z,
          alpha: (z + 1) / 2,
        };
      });

      // Sort back-to-front
      projected.sort((a, b) => a.z - b.z);

      projected.forEach(({ sx, sy, alpha, z }) => {
        const size = 1.2 + alpha * 1.4;
        const brightness = Math.round(140 + alpha * 115);
        ctx.beginPath();
        ctx.arc(sx, sy, size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${brightness},${brightness},${brightness},${0.25 + alpha * 0.75})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
