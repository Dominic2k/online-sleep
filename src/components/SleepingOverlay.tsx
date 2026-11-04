import React, { useState, useEffect } from 'react';
import { LocationInfo, SleepSessionState, SoundTrackId } from '../types';
import { Volume2, VolumeX, Sun, Pause, Play, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface SleepingOverlayProps {
  session: SleepSessionState;
  location: LocationInfo;
  onWakeUp: () => void;
  onTogglePause: () => void;
  soundVolumes: Record<SoundTrackId, number>;
}

export const SleepingOverlay: React.FC<SleepingOverlayProps> = ({
  session,
  location,
  onWakeUp,
  onTogglePause,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathSeconds, setBreathSeconds] = useState(4);

  // 4-7-8 Breathing Technique Cycle
  useEffect(() => {
    let timer: number;
    let current = 4;
    let phase: 'inhale' | 'hold' | 'exhale' = 'inhale';

    const interval = window.setInterval(() => {
      current--;
      if (current <= 0) {
        if (phase === 'inhale') {
          phase = 'hold';
          current = 7;
        } else if (phase === 'hold') {
          phase = 'exhale';
          current = 8;
        } else {
          phase = 'inhale';
          current = 4;
        }
        setBreathPhase(phase);
      }
      setBreathSeconds(current);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleMute = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  const getBreathingText = () => {
    switch (breathPhase) {
      case 'inhale':
        return `Hít vào nhẹ nhàng (${breathSeconds}s)`;
      case 'hold':
        return `Giữ hơi thở thư giãn (${breathSeconds}s)`;
      case 'exhale':
        return `Thở ra êm ái (${breathSeconds}s)`;
    }
  };

  const getBreathingScale = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'scale-125 duration-[4000ms]';
      case 'hold':
        return 'scale-125 duration-[7000ms]';
      case 'exhale':
        return 'scale-90 duration-[8000ms]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06070a] text-slate-100 flex flex-col justify-between p-6 sm:p-10 select-none animate-fadeIn">
      {/* Top Bar: Location & Quick Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs text-slate-300">Đang ngủ tại:</span>
          <span className="text-xs font-bold text-amber-300">{location.nameVi}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleMute}
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition text-slate-300 hover:text-white"
            title="Bật/Tắt âm thanh"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button
            onClick={onTogglePause}
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition text-slate-300 hover:text-white"
            title={session.status === 'paused' ? 'Tiếp tục' : 'Tạm dừng'}
          >
            {session.status === 'paused' ? <Play size={18} /> : <Pause size={18} />}
          </button>
        </div>
      </div>

      {/* Center: Minimalist Digital Clock & 4-7-8 Breathing Guide */}
      <div className="flex flex-col items-center justify-center my-auto space-y-8">
        {/* Breathing Circle */}
        <div className="relative flex items-center justify-center">
          <div
            className={`w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-purple-500/15 via-indigo-500/20 to-teal-500/15 border border-purple-400/30 blur-[1px] transition-transform ease-in-out ${getBreathingScale()}`}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <span className="text-4xl sm:text-5xl mb-2 animate-bounce">😴</span>
            <div className="text-xs uppercase tracking-widest text-purple-300 font-mono mb-1">
              Nhịp Thở 4-7-8
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-200">
              {getBreathingText()}
            </div>
          </div>
        </div>

        {/* Big Timer */}
        <div className="text-center">
          <div className="text-xs text-slate-400 font-mono tracking-widest uppercase mb-1">
            Thời Gian Ngủ
          </div>
          <div className="font-mono text-5xl sm:text-7xl font-light tracking-tight text-white/90 drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">
            {formatTime(session.elapsedSeconds)}
          </div>
          <div className="text-xs text-purple-300/80 mt-2 font-mono flex items-center justify-center gap-1.5">
            <Sparkles size={12} />
            <span>Tâm trí đang được làm sạch và tái tạo...</span>
          </div>
        </div>
      </div>

      {/* Bottom Action: Wake Up & View Report Button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto w-full">
        <button
          onClick={onWakeUp}
          className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2.5 transition transform active:scale-95"
        >
          <Sun size={20} className="text-slate-950" />
          <span>Thức Dậy & Nhận Báo Cáo Giấc Ngủ</span>
        </button>
      </div>
    </div>
  );
};

