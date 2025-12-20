import { useEffect, useRef } from "react";
import { CinematicCanvasProps } from "./types";

export const CinematicCanvas: React.FC<CinematicCanvasProps> = ({
  width,
  height,
  children,
  particleEffect = false,
  particleCount = 100,
  className = "",
  style = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = width;
    canvas.height = height;
    const particles: { x: number; y: number; vx: number; vy: number }[] = [];
    if (particleEffect) {
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        });
      }
    }

    const render = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      if (particleEffect) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      if (children) {
        children(ctx);
      }
      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, particleEffect, particleCount, children]);

  return (
    <canvas
      ref={canvasRef}
      className={`cinematic-canvas ${className}`}
      style={{ display: "block", ...style }}
    />
  );
};
