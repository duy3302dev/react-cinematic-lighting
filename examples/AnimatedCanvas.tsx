import React, { useRef, useEffect } from 'react';
import { CinematicCanvas, vividPreset } from 'react-cinematic-lighting';

/**
 * Example: Animated canvas with cinematic lighting
 */
export function AnimatedCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let hue = 0;
    let animationId: number;

    const animate = () => {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `hsl(${hue}, 70%, 50%)`);
      gradient.addColorStop(0.5, `hsl(${hue + 60}, 70%, 50%)`);
      gradient.addColorStop(1, `hsl(${hue + 120}, 70%, 50%)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw animated circles
      for (let i = 0; i < 5; i++) {
        const offset = (Date.now() / 1000 + i * 0.5) % 2 * Math.PI;
        const x = canvas.width / 2 + Math.cos(offset) * (100 + i * 30);
        const y = canvas.height / 2 + Math.sin(offset) * (100 + i * 30);
        const radius = 30 + Math.sin(offset * 2) * 10;

        ctx.fillStyle = `hsla(${(hue + i * 30) % 360}, 80%, 60%, 0.8)`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      hue = (hue + 0.5) % 360;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div style={{ 
      background: '#000', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ color: '#fff', marginBottom: '2rem' }}>
          Animated Canvas with Vivid Lighting
        </h1>
        <CinematicCanvas
          ref={canvasRef}
          width={800}
          height={600}
          lightingOptions={vividPreset}
          containerStyle={{
            background: '#000',
          }}
          canvasStyle={{
            borderRadius: '12px',
          }}
        />
      </div>
    </div>
  );
}

export default AnimatedCanvas;
