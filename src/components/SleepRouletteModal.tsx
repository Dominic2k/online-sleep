import React, { useState } from 'react';
import { LocationInfo, EquipmentItem, WeatherType, LightingType, SoundTrackId } from '../types';
import { LOCATIONS } from '../data/locations';
import { EQUIPMENT_ITEMS } from '../data/equipment';
import { Dices, Sparkles, Check, X } from 'lucide-react';

interface SleepRouletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRoulette: (
    location: LocationInfo,
    bed: EquipmentItem,
    pajamas: EquipmentItem,
    weather: WeatherType,
    lighting: LightingType,
    soundVolumes: Record<SoundTrackId, number>
  ) => void;
}

export const SleepRouletteModal: React.FC<SleepRouletteModalProps> = ({
  isOpen,
  onClose,
  onApplyRoulette
}) => {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<{
    location: LocationInfo;
    bed: EquipmentItem;
    pajamas: EquipmentItem;
    weather: WeatherType;
    lighting: LightingType;
  } | null>(null);

  if (!isOpen) return null;

  const handleRoll = () => {
    setIsRolling(true);

    let count = 0;
    const interval = window.setInterval(() => {
      count++;
      const randomLoc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      const beds = EQUIPMENT_ITEMS.filter(i => i.category === 'bed');
      const randomBed = beds[Math.floor(Math.random() * beds.length)];
      const pjs = EQUIPMENT_ITEMS.filter(i => i.category === 'pajamas');
      const randomPj = pjs[Math.floor(Math.random() * pjs.length)];
      const weathers: WeatherType[] = ['rain', 'snow', 'stars', 'thunder'];
      const lightings: LightingType[] = ['amber', 'moonlight', 'candle', 'neon'];

      setResult({
        location: randomLoc,
        bed: randomBed,
        pajamas: randomPj,
        weather: weathers[Math.floor(Math.random() * weathers.length)],
        lighting: lightings[Math.floor(Math.random() * lightings.length)]
      });

      if (count > 15) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 90);
  };

  const handleApply = () => {
    if (!result) return;
    const defaultSounds: Record<SoundTrackId, number> = {
      rain: result.weather === 'rain' ? 65 : 0,
      thunder: result.weather === 'thunder' ? 45 : 0,
      waves: result.location.id === 'beach' ? 70 : 0,
      campfire: result.location.id === 'forest' ? 60 : 0,
      forest: result.location.id === 'forest' ? 50 : 0,
      clock: result.location.id === 'attic' ? 30 : 0,
      lofi: 45,
      whitenoise: result.location.id === 'space' ? 55 : 15
    };

    onApplyRoulette(
      result.location,
      result.bed,
      result.pajamas,
      result.weather,
      result.lighting,
      defaultSounds
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[92vh] sm:max-h-[90vh] bg-slate-900 border border-fuchsia-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Mobile drag handle */}
        <div className="sm:hidden w-12 h-1 bg-white/20 rounded-full mx-auto mt-2 mb-1" />

        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-5 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="text-xl sm:text-2xl p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-fuchsia-500/20 border border-fuchsia-400/30">🎲</span>
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white tracking-wide">Sleep Roulette</h2>
              <p className="text-[11px] sm:text-xs text-slate-400">Để định mệnh chọn combo ngủ đêm nay!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 text-center space-y-4 sm:space-y-6 overflow-y-auto overscroll-contain">
          {!result ? (
            <div className="py-6 sm:py-8 flex flex-col items-center">
              <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 animate-bounce">🎰</div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto">
                Nhấn nút bên dưới để quay ngẫu nhiên địa điểm, trang phục, giường ngủ và thời tiết thư giãn đêm nay!
              </p>
            </div>
          ) : (
            <div className={`p-4 sm:p-5 rounded-2xl bg-slate-800/60 border border-fuchsia-500/30 space-y-2.5 sm:space-y-3.5 transition-all text-xs sm:text-sm ${isRolling ? 'blur-[1px] scale-95' : 'scale-100'}`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Địa điểm ngủ:</span>
                <span className="font-bold text-amber-300">{result.location.nameVi}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Giường êm:</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <span>{result.bed.icon}</span> {result.bed.name}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Đồ ngủ (Pajamas):</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <span>{result.pajamas.icon}</span> {result.pajamas.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Thời tiết & Ánh sáng:</span>
                <span className="font-semibold text-purple-300 uppercase font-mono text-[11px] sm:text-xs">
                  {result.weather} • {result.lighting}
                </span>
              </div>
            </div>
          )}

          {/* Roll Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-2">
            <button
              onClick={handleRoll}
              disabled={isRolling}
              className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-2xl bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-50 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-600/30 transition transform active:scale-95"
            >
              <Dices size={18} className={isRolling ? 'animate-spin' : ''} />
              <span>{isRolling ? 'Đang Quay...' : 'Quay Ngẫu Nhiên'}</span>
            </button>

            {result && !isRolling && (
              <button
                onClick={handleApply}
                className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition transform active:scale-95"
              >
                <Check size={18} />
                <span>Áp Dụng Combo Này</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

