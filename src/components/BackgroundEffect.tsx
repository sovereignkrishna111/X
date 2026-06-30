import { useEffect, useRef } from 'react';
import type { Profile } from '../types';

interface Props {
  profile: Profile;
  themeEffect: string;
}

export function BackgroundEffect({ profile, themeEffect }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; vx: number; vy: number; r: number; color: string; alpha: number }[] = [];
    let animating = false;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const clearAnim = () => {
      cancelAnimationFrame(animRef.current);
      animating = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = [];
    };

    if (themeEffect === 'neon-effect') {
      animating = true;
      const colors = ['#f0abfc', '#818cf8', '#67e8f9', '#a78bfa', '#fb7185'];
      for (let i = 0; i < 70; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          r: Math.random() * 2 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.6 + 0.4,
        });
      }
      const draw = () => {
        if (!animating) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
          ctx.shadowBlur = 14; ctx.shadowColor = p.color; ctx.fill(); ctx.shadowBlur = 0;
          particles.forEach((p2) => {
            const dx = p.x - p2.x, dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = p.color + Math.floor((1 - dist / 120) * 40).toString(16).padStart(2, '0');
              ctx.lineWidth = 0.5; ctx.stroke();
            }
          });
        });
        animRef.current = requestAnimationFrame(draw);
      };
      draw();

    } else if (themeEffect === 'cyber-effect') {
      animating = true;
      const cols = Math.ceil(canvas.width / 20);
      const drops: number[] = Array(cols).fill(0).map(() => Math.random() * -50);
      const chars = '01アイウエオカキクケコサシスセソ'.split('');
      const draw = () => {
        if (!animating) return;
        ctx.fillStyle = 'rgba(0,0,0,0.04)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fbbf24'; ctx.font = '12px monospace';
        for (let i = 0; i < drops.length; i++) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          ctx.globalAlpha = Math.random() * 0.3 + 0.05;
          ctx.fillText(char, i * 20, drops[i] * 20);
          if (drops[i] * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
          drops[i] += 0.5;
        }
        ctx.globalAlpha = 1;
        animRef.current = requestAnimationFrame(draw);
      };
      draw();

    } else if (themeEffect === 'fire-effect') {
      animating = true;
      const embers: { x: number; y: number; vx: number; vy: number; size: number; life: number; maxLife: number }[] = [];
      const spawnEmber = () => {
        embers.push({
          x: canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.9,
          y: canvas.height + 10,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -(Math.random() * 2.5 + 1.5),
          size: Math.random() * 3 + 1,
          life: 0, maxLife: Math.random() * 90 + 40,
        });
      };
      const draw = () => {
        if (!animating) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < 3; i++) spawnEmber();
        for (let i = embers.length - 1; i >= 0; i--) {
          const e = embers[i];
          e.x += e.vx + Math.sin(e.life * 0.1) * 0.5; e.y += e.vy; e.life++;
          if (e.life >= e.maxLife) { embers.splice(i, 1); continue; }
          const progress = e.life / e.maxLife;
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.size * (1 - progress * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${20 + progress * 20}, 100%, 60%, ${(1 - progress) * 0.5})`;
          ctx.shadowBlur = 8; ctx.shadowColor = `hsl(${20}, 100%, 50%)`; ctx.fill(); ctx.shadowBlur = 0;
        }
        animRef.current = requestAnimationFrame(draw);
      };
      draw();

    } else if (themeEffect === 'midnight-effect') {
      animating = true;
      const stars: { x: number; y: number; r: number; phase: number; speed: number }[] = [];
      for (let i = 0; i < 180; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.75,
          r: Math.random() * 1.5 + 0.3,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.8 + 0.2,
        });
      }
      let t = 0;
      const draw = () => {
        if (!animating) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        t += 0.018;
        stars.forEach((s) => {
          const alpha = 0.25 + Math.sin(t * s.speed + s.phase) * 0.35;
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(147, 197, 253, ${Math.max(0, alpha)})`; ctx.fill();
        });
        animRef.current = requestAnimationFrame(draw);
      };
      draw();
    }

    return () => { clearAnim(); window.removeEventListener('resize', resize); };
  }, [themeEffect]);

  const bgStyle = (() => {
    if (profile.background_type === 'color') return { backgroundColor: profile.background_value };
    if (profile.background_type === 'gradient') return { background: profile.background_value };
    if (profile.background_type === 'image') return {
      backgroundImage: `url(${profile.background_value})`,
      backgroundSize: 'cover', backgroundPosition: 'center',
    };
    return {};
  })();

  const overlay = profile.bg_overlay || 'none';

  return (
    <div className="fixed inset-0 -z-10">
      {/* Base background */}
      <div className="absolute inset-0 transition-all duration-700" style={bgStyle} />

      {/* Video background */}
      {profile.background_type === 'video' && profile.background_value && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={profile.background_value}
          autoPlay loop muted playsInline
        />
      )}

      {/* Overlay/Cut Effects */}
      {overlay === 'dark' && (
        <div className="absolute inset-0 bg-black/55" />
      )}
      {overlay === 'vignette' && (
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%)'
        }} />
      )}
      {overlay === 'fade' && (
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.8) 100%)'
        }} />
      )}
      {overlay === 'gradient-dark' && (
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(160deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)'
        }} />
      )}
      {overlay === 'blur' && (
        <div className="absolute inset-0 backdrop-blur-md bg-black/20" />
      )}
      {overlay === 'grain' && (
        <div className="absolute inset-0 grain-overlay" />
      )}
      {overlay === 'upper-reveal' && (
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, transparent 0%, transparent 35%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0.95) 100%)'
        }} />
      )}
      {overlay === 'lower-mask' && (
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(0,0,0,0.9) 100%)'
        }} />
      )}
      {overlay === 'spotlight' && (
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 30%, transparent 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.85) 100%)'
        }} />
      )}
      {overlay === 'half-shade' && (
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, transparent 0%, transparent 45%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.75) 100%)'
        }} />
      )}
      {overlay === 'diagonal' && (
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, transparent 0%, transparent 40%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.9) 100%)'
        }} />
      )}
      {overlay === 'side-fade' && (
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.85) 100%)'
        }} />
      )}
      {overlay === 'radial-blur' && (
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at 50% 40%, transparent 0%, transparent 25%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.9) 100%)'
        }} />
      )}

      {/* Aurora blobs */}
      {themeEffect === 'aurora-effect' && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="aurora-blob aurora-blob-1" />
          <div className="aurora-blob aurora-blob-2" />
          <div className="aurora-blob aurora-blob-3" />
        </div>
      )}

      {/* Ocean waves */}
      {themeEffect === 'ocean-effect' && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="ocean-wave" />
          <div className="ocean-wave ocean-wave-2" />
          <div className="ocean-wave ocean-wave-3" />
        </div>
      )}

      {/* Glass orbs */}
      {themeEffect === 'glass-effect' && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="glass-orb glass-orb-1" />
          <div className="glass-orb glass-orb-2" />
          <div className="glass-orb glass-orb-3" />
        </div>
      )}

      {/* Pastel bubbles */}
      {themeEffect === 'pastel-effect' && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="pastel-bubble pastel-bubble-1" />
          <div className="pastel-bubble pastel-bubble-2" />
          <div className="pastel-bubble pastel-bubble-3" />
          <div className="pastel-bubble pastel-bubble-4" />
        </div>
      )}

      {/* Canvas animations */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: themeEffect === 'neon-effect' ? 0.5
            : themeEffect === 'cyber-effect' ? 0.3
            : themeEffect === 'fire-effect' ? 0.65
            : themeEffect === 'midnight-effect' ? 0.9
            : 0,
        }}
      />
    </div>
  );
}
