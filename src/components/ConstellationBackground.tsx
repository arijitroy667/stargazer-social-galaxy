
import React, { useEffect, useRef } from 'react';

export const ConstellationBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Stars array
    const stars: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      angle: number;
    }> = [];

    // Create stars
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.5 + 0.1,
        angle: Math.random() * Math.PI * 2,
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and animate stars
      stars.forEach((star, index) => {
        // Update position
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;

        // Wrap around screen
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Twinkling effect
        star.opacity = Math.sin(Date.now() * 0.001 + index) * 0.3 + 0.7;

        // Draw star
        ctx.save();
        ctx.globalAlpha = star.opacity;
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffffff';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw connections between nearby stars
        stars.forEach((otherStar, otherIndex) => {
          if (index !== otherIndex) {
            const distance = Math.sqrt(
              Math.pow(star.x - otherStar.x, 2) + Math.pow(star.y - otherStar.y, 2)
            );

            if (distance < 100) {
              ctx.save();
              ctx.globalAlpha = (100 - distance) / 100 * 0.2;
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(star.x, star.y);
              ctx.lineTo(otherStar.x, otherStar.y);
              ctx.stroke();
              ctx.restore();
            }
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};
