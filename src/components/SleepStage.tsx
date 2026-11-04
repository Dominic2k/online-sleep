import React, { useEffect, useRef } from 'react';
import { LocationInfo, WeatherType, LightingType, EquipmentItem } from '../types';

interface SleepStageProps {
  location: LocationInfo;
  weather: WeatherType;
  lighting: LightingType;
  equippedBed: EquipmentItem;
  equippedPillow: EquipmentItem;
  equippedBlanket: EquipmentItem;
  equippedPajamas: EquipmentItem;
  equippedCompanion: EquipmentItem;
  isSleeping: boolean;
}

export const SleepStage: React.FC<SleepStageProps> = ({
  location,
  weather,
  lighting,
  equippedBed,
  equippedPillow,
  equippedBlanket,
  equippedPajamas,
  equippedCompanion,
  isSleeping
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas particle / animation loop (Rain, Embers, Fireflies, Stars, Falling leaves)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize particles based on location & weather
    const particles: Array<{
      x: number;
      y: number;
      speedY: number;
      speedX: number;
      size: number;
      opacity: number;
      angle?: number;
    }> = [];

    const particleCount = location.id === 'attic' ? 70 : location.id === 'forest' ? 45 : 35;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speedY:
          weather === 'rain'
            ? 7 + Math.random() * 6
            : weather === 'snow'
            ? 1 + Math.random() * 2
            : (Math.random() - 0.5) * 0.8,
        speedX:
          weather === 'rain'
            ? -1 - Math.random() * 1.5
            : (Math.random() - 0.5) * 1.2,
        size: Math.random() * (weather === 'rain' ? 2 : 3) + 1,
        opacity: Math.random() * 0.7 + 0.3,
        angle: Math.random() * Math.PI * 2
      });
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // 1. Weather / Ambient Particle rendering
      if (weather === 'rain') {
        ctx.strokeStyle = 'rgba(180, 210, 255, 0.45)';
        ctx.lineWidth = 1.5;
        particles.forEach(p => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 2, p.y + p.speedY * 2.5);
          ctx.stroke();

          p.x += p.speedX;
          p.y += p.speedY;
          if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * (width + 100);
          }
        });
      } else if (weather === 'snow') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        particles.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.x += Math.sin(frame * 0.02 + p.y * 0.01) * 0.6;
          p.y += p.speedY;
          if (p.y > height) {
            p.y = -5;
            p.x = Math.random() * width;
          }
        });
      } else if (location.id === 'forest') {
        // Fireflies & campfire embers
        particles.forEach(p => {
          const glow = Math.sin(frame * 0.05 + (p.angle || 0)) * 0.4 + 0.6;
          ctx.fillStyle = `rgba(253, 224, 71, ${p.opacity * glow})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#facc15';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          p.x += Math.sin(frame * 0.015 + p.y) * 0.8;
          p.y += p.speedY * 0.5;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
        });
      } else if (location.id === 'space' || weather === 'stars') {
        // Twinkling stars
        particles.forEach((p, idx) => {
          const twinkle = (Math.sin(frame * 0.04 + idx) + 1) / 2;
          ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + twinkle * 0.8})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        });

        // Occasional shooting star
        if (frame % 280 === 0) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          const startX = Math.random() * width * 0.6;
          const startY = Math.random() * height * 0.3;
          ctx.moveTo(startX, startY);
          ctx.lineTo(startX + 120, startY + 60);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [location.id, weather]);

  // Lighting overlay styles
  const getLightingOverlayClass = () => {
    switch (lighting) {
      case 'amber':
        return 'bg-gradient-to-t from-amber-950/40 via-amber-900/10 to-transparent';
      case 'candle':
        return 'bg-gradient-to-t from-orange-950/50 via-yellow-950/15 to-transparent';
      case 'moonlight':
        return 'bg-gradient-to-b from-blue-900/25 via-indigo-950/30 to-slate-950/60';
      case 'neon':
        return 'bg-gradient-to-tr from-purple-900/30 via-cyan-950/20 to-slate-950/50';
      case 'pitch_black':
        return 'bg-black/75';
      default:
        return 'bg-transparent';
    }
  };

  return (
    <div className="relative w-full h-[400px] md:h-[480px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950 select-none flex items-center justify-center">
      {/* 1. Background Scene Layout */}
      {location.id === 'attic' && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/90 to-amber-950/40">
          {/* Slanted Attic Beams */}
          <div className="absolute inset-x-0 top-0 h-28 border-b-8 border-amber-950/70 bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-amber-950/60 transform -skew-y-3" />
          {/* Skylight Window */}
          <div className="absolute top-8 right-16 w-48 h-56 rounded-2xl border-4 border-amber-900/60 bg-gradient-to-br from-indigo-900/40 to-slate-900/80 backdrop-blur-sm shadow-inner flex flex-col justify-between p-3 overflow-hidden">
            <div className="w-full h-1/2 border-b-2 border-amber-900/40" />
            <div className="absolute inset-y-0 left-1/2 w-0.5 bg-amber-900/40" />
            <div className="text-[10px] text-amber-200/50 tracking-wider text-right z-10 font-mono">RAINY NIGHT</div>
          </div>
          {/* Wooden Floor */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-amber-950/80 to-amber-900/30 border-t border-amber-800/20" />
          {/* Night Desk Lamp with soft breathing light */}
          <div className="absolute bottom-24 left-14 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-amber-400/20 blur-xl animate-pulse-slow" />
            <div className="w-8 h-8 rounded-t-full bg-amber-500/80 shadow-[0_0_20px_#f59e0b]" />
            <div className="w-1 h-10 bg-amber-800" />
            <div className="w-10 h-2 rounded bg-amber-900" />
          </div>
          {/* Steaming Mug */}
          <div className="absolute bottom-28 left-28 text-sm flex items-center gap-1 opacity-80">
            <span className="text-xl">☕</span>
            <span className="text-[10px] text-amber-300 font-mono animate-bounce">~</span>
          </div>
        </div>
      )}

      {location.id === 'forest' && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-emerald-950/80 to-teal-950/50">
          {/* Distant Mountain & Pine Silhouettes */}
          <div className="absolute inset-x-0 bottom-24 h-48 opacity-40 flex justify-between items-end px-4">
            <div className="w-0 h-0 border-l-[70px] border-l-transparent border-r-[70px] border-r-transparent border-b-[180px] border-b-emerald-900" />
            <div className="w-0 h-0 border-l-[90px] border-l-transparent border-r-[90px] border-r-transparent border-b-[220px] border-b-emerald-950" />
            <div className="w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[160px] border-b-teal-950" />
          </div>
          {/* Cozy Canvas A-Frame Tent */}
          <div className="absolute bottom-20 left-12 w-44 h-40">
            <div className="w-0 h-0 border-l-[80px] border-l-transparent border-r-[80px] border-r-transparent border-b-[140px] border-b-amber-100/20 relative">
              <div className="absolute -bottom-[140px] -left-12 w-24 h-32 bg-amber-500/20 rounded-t-full blur-md animate-pulse-slow" />
              <div className="absolute -bottom-[140px] -left-4 text-xs font-mono text-amber-200/70">⛺ CAMP</div>
            </div>
          </div>
          {/* Campfire */}
          <div className="absolute bottom-20 right-20 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-orange-500/30 blur-lg animate-pulse" />
            <div className="text-3xl animate-bounce">🔥</div>
            <div className="text-sm -mt-2">🪵</div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-emerald-950 to-teal-950/80 border-t border-emerald-800/20" />
        </div>
      )}

      {location.id === 'beach' && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/90 to-cyan-950/60">
          {/* Full Moon */}
          <div className="absolute top-10 right-20 w-24 h-24 rounded-full bg-amber-100/90 shadow-[0_0_50px_rgba(254,243,199,0.5)] flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border border-amber-200/40 opacity-40" />
          </div>
          {/* Ocean Waves */}
          <div className="absolute inset-x-0 bottom-20 h-28 bg-gradient-to-t from-cyan-900/40 to-transparent flex flex-col justify-end">
            <div className="w-full h-8 bg-cyan-500/10 rounded-t-[50%] blur-sm animate-breathe" />
            <div className="w-full h-6 bg-cyan-400/20 rounded-t-[40%]" />
          </div>
          {/* Palm Trees */}
          <div className="absolute bottom-16 left-6 text-6xl opacity-85 transform -rotate-12">🌴</div>
          <div className="absolute bottom-16 right-6 text-6xl opacity-85 transform scale-x-[-1] -rotate-12">🌴</div>
          {/* Sand Beach */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-amber-900/40 via-amber-800/20 to-transparent border-t border-cyan-500/20" />
        </div>
      )}

      {location.id === 'tatami' && (
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-amber-950/60 to-stone-900">
          {/* Shoji Screen Frame */}
          <div className="absolute top-8 inset-x-12 h-64 border-4 border-amber-900/80 grid grid-cols-4 grid-rows-3 bg-stone-900/70 shadow-2xl">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border border-amber-950/60 bg-amber-100/5 backdrop-blur-sm" />
            ))}
          </div>
          {/* Zen Red Maple Silhouette outside */}
          <div className="absolute top-12 left-16 text-3xl opacity-60 animate-float">🍁</div>
          <div className="absolute top-20 right-20 text-2xl opacity-50 animate-float" style={{ animationDelay: '2s' }}>🍁</div>
          {/* Tatami Mat Floor */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-stone-800/90 border-t-4 border-amber-900/80 flex divide-x-2 divide-amber-950/70">
            <div className="flex-1 bg-amber-900/10" />
            <div className="flex-1 bg-amber-950/20" />
            <div className="flex-1 bg-amber-900/10" />
          </div>
          {/* Stone Lantern / Tsukubai */}
          <div className="absolute bottom-24 right-14 text-3xl">🏮</div>
        </div>
      )}

      {location.id === 'space' && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950/80 to-slate-950">
          {/* Giant Viewport Ring */}
          <div className="absolute inset-4 rounded-3xl border-4 border-purple-500/30 shadow-[inset_0_0_60px_rgba(168,85,247,0.2)]" />
          {/* Earth in viewport */}
          <div className="absolute top-12 right-16 w-44 h-44 rounded-full bg-gradient-to-br from-blue-500 via-cyan-400 to-indigo-950 shadow-[0_0_60px_rgba(56,189,248,0.4)] overflow-hidden flex items-center justify-center">
            {/* Atmospheric rim */}
            <div className="w-full h-full rounded-full border-4 border-cyan-300/40 opacity-70" />
            {/* Swirling white cloud band */}
            <div className="absolute inset-0 bg-white/20 rounded-full blur-md animate-pulse-slow" />
          </div>
          {/* Pod Deck Floor with glowing neon trims */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-slate-900/95 border-t-2 border-purple-400/50 shadow-[0_-10px_30px_rgba(192,132,252,0.15)] flex justify-around items-center">
            <div className="h-1 w-1/3 bg-cyan-400/40 rounded-full shadow-[0_0_10px_#22d3ee]" />
            <div className="h-1 w-1/3 bg-purple-400/40 rounded-full shadow-[0_0_10px_#c084fc]" />
          </div>
        </div>
      )}

      {/* 2. Particle Canvas Overlay */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />

      {/* 3. Lighting Overlay */}
      <div className={`absolute inset-0 z-15 pointer-events-none transition-colors duration-1000 ${getLightingOverlayClass()}`} />

      {/* 4. Center Sleep Sanctuary (Avatar + Bed + Blanket + Pet) */}
      <div className="relative z-20 flex flex-col items-center justify-center -mt-6">
        {/* Main Bed Structure */}
        <div className="relative group flex flex-col items-center">
          {/* Bed Base */}
          <div className="w-64 sm:w-80 h-28 sm:h-32 rounded-3xl bg-slate-800/90 border-2 border-white/20 shadow-2xl flex flex-col justify-between p-3 relative overflow-hidden backdrop-blur-md">
            {/* Bed Headboard / Pillow Area */}
            <div className="flex items-center justify-between w-full px-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
                {equippedBed.icon} {equippedBed.name}
              </span>
              {/* Equipped Pillow */}
              <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30 text-xs text-amber-200">
                <span>{equippedPillow.icon}</span>
                <span className="hidden sm:inline text-[11px]">{equippedPillow.name}</span>
              </div>
            </div>

            {/* Avatar & Sleeping Animation */}
            <div className="flex items-center justify-center my-auto relative">
              {/* Sleeping Breathing Avatar */}
              <div
                className={`flex flex-col items-center transition-transform duration-700 ${
                  isSleeping ? 'animate-breathe' : 'animate-float'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  {/* Pajama Icon & Face */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500/30 to-pink-500/30 border-2 border-white/30 flex items-center justify-center text-3xl shadow-lg relative">
                    {isSleeping ? '😴' : '😌'}
                    <span className="absolute -bottom-1 -right-1 text-base">{equippedPajamas.icon}</span>
                  </div>
                  {/* Floating 'zZz' indicator when sleeping */}
                  {isSleeping && (
                    <div className="absolute -top-6 -right-6 text-sm font-bold text-purple-300 flex flex-col animate-bounce">
                      <span className="text-xs">z</span>
                      <span className="text-sm -mt-1 font-mono">Z</span>
                      <span className="text-base -mt-1 font-extrabold text-amber-300">Z</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Equipped Pet / Companion beside bed */}
              <div className="absolute -right-4 -bottom-1 flex items-center bg-black/50 px-2 py-1 rounded-full border border-white/10 text-xs text-slate-200 animate-float" style={{ animationDelay: '1.5s' }}>
                <span className="text-lg mr-1">{equippedCompanion.icon}</span>
                <span className="text-[10px] hidden sm:inline">{equippedCompanion.name}</span>
              </div>
            </div>

            {/* Blanket covering bottom */}
            <div className="w-full bg-gradient-to-r from-purple-600/70 via-indigo-600/70 to-purple-600/70 border-t-2 border-purple-400/40 rounded-b-2xl py-1.5 px-3 flex items-center justify-between text-xs text-purple-100 shadow-md">
              <span className="flex items-center gap-1 font-medium">
                {equippedBlanket.icon} {equippedBlanket.name}
              </span>
              <span className="text-[10px] uppercase tracking-wider bg-black/40 px-1.5 py-0.5 rounded text-purple-200">
                {equippedBlanket.tag}
              </span>
            </div>
          </div>
        </div>

        {/* Status Pill below bed */}
        <div className="mt-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-lg text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-300">
            {isSleeping ? 'Đang trong phiên ngủ sâu...' : 'Sẵn sàng chìm vào giấc ngủ'}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-300 font-medium">{location.nameVi}</span>
        </div>
      </div>

      {/* Location Badge (Top Left) */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 shadow-lg">
        <div className="w-3 h-3 rounded-full shadow-[0_0_8px]" style={{ backgroundColor: location.accentGlow }} />
        <div>
          <div className="text-xs font-bold text-white tracking-wide">{location.nameVi}</div>
          <div className="text-[10px] text-slate-400">{location.name}</div>
        </div>
      </div>

      {/* Special Ambient Effect Pill (Top Right) */}
      <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[11px] text-slate-300">
        <span>✨</span>
        <span>{location.specialEffectName}</span>
      </div>
    </div>
  );
};

