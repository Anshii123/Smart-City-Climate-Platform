import React, { useEffect, useRef } from 'react';

const FloatingParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    const particleCount = 45;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height; // Spread initially
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * 4 + 1;
        this.speedY = -(Math.random() * 0.8 + 0.3); // Drift upward
        this.speedX = Math.random() * 0.4 - 0.2; // Gentle horizontal wave
        // Higher greenness tone for particles
        this.hue = Math.random() > 0.5 ? 140 : 160; // Emerald or mint
        this.opacity = Math.random() * 0.4 + 0.1;
        this.wobbleSpeed = Math.random() * 0.02 + 0.005;
        this.wobbleDistance = Math.random() * 2 + 0.5;
        this.wobbleAngle = Math.random() * Math.PI;
      }

      update() {
        this.y += this.speedY;
        this.wobbleAngle += this.wobbleSpeed;
        this.x += this.speedX + Math.sin(this.wobbleAngle) * 0.15;

        // Reset if goes off screen
        if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Premium glow effect
        const isDarkMode = document.documentElement.classList.contains('dark');
        const particleColor = isDarkMode 
          ? `rgba(52, 211, 153, ${this.opacity})` // emerald-400
          : `rgba(5, 150, 105, ${this.opacity})`;  // emerald-600

        ctx.fillStyle = particleColor;
        ctx.shadowBlur = this.size * 1.5;
        ctx.shadowColor = isDarkMode ? '#10b981' : '#059669';
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow for performance
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 opacity-70"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default FloatingParticles;
