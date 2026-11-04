import React from 'react';
import { WeatherType, LightingType, SoundTrackId } from '../types';
import { SOUND_TRACKS } from '../data/locations';
import { X, Volume2, CloudRain, SunMedium, Sliders } from 'lucide-react';

interface EnvironmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  weather: WeatherType;
  onChangeWeather: (w: WeatherType) => void;
  lighting: LightingType;
  onChangeLighting: (l: LightingType) => void;
  soundVolumes: Record<SoundTrackId, number>;
  onChangeVolume: (trackId: SoundTrackId, vol: number) => void;
}

export const EnvironmentModal: React.FC<EnvironmentModalProps> = ({
  isOpen,
  onClose,
  weather,
  onChangeWeather,
  lighting,
  onChangeLighting,
  soundVolumes,
  onChangeVolume
}) => {
  if (!isOpen) return null;

  const weatherOptions: { id: WeatherType; label: string; icon: string; desc: string }[] = [
    { id: 'rain', label: 'Mưa Rả Rích', icon: '🌧️', desc: 'Mưa rơi nhẹ và mát lạnh' },
    { id: 'snow', label: 'Tuyết Rơi Êm', icon: '❄️', desc: 'Những bông tuyết trắng buốt giá' },
    { id: 'stars', label: 'Trời Sao Đêm', icon: '✨', desc: 'Bầu trời đêm quang đãng ngàn sao' },
    { id: 'thunder', label: 'Sấm Chớp Dịu', icon: '⛈️', desc: 'Sấm rền xa xa ru giấc ngủ sâu' }
  ];

  const lightingOptions: { id: LightingType; label: string; icon: string; desc: string }[] = [
    { id: 'amber', label: 'Đèn Vàng Ấm', icon: '💡', desc: 'Ánh sáng vàng dịu mắt thư giãn' },
    { id: 'moonlight', label: 'Ánh Trăng Bạc', icon: '🌕', desc: 'Ánh trăng huyền ảo mát mẻ' },
    { id: 'candle', label: 'Ánh Nến Mộc', icon: '🕯️', desc: 'Lửa nến bập bùng ấm cúng' },
    { id: 'neon', label: 'Neon Mộng Mơ', icon: '🔮', desc: 'Ánh sáng viễn tưởng cyberpunk mờ' },
    { id: 'pitch_black', label: 'Tối Tuyệt Đối', icon: '🌑', desc: 'Chuẩn OLED tiết kiệm pin và dễ ngủ' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-teal-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-2xl bg-teal-500/20 border border-teal-400/30">🌿</span>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Điều Kiện Môi Trường (Environment)</h2>
              <p className="text-xs text-slate-400">Tùy chỉnh thời tiết, ánh sáng đèn và bộ trộn âm thanh thiên nhiên thời gian thực</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Weather Selector */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-sm font-bold text-teal-300">
              <CloudRain size={16} />
              <span>Thời Tiết (Weather Simulation)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {weatherOptions.map(opt => {
                const isSelected = weather === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onChangeWeather(opt.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-teal-950/60 border-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.25)] ring-1 ring-teal-400'
                        : 'bg-slate-800/40 border-white/10 hover:border-white/20 hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="text-2xl mb-1">{opt.icon}</div>
                    <div className="font-bold text-xs text-white">{opt.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Lighting Selector */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-sm font-bold text-amber-300">
              <SunMedium size={16} />
              <span>Chế Độ Ánh Sáng (Ambient Lighting)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {lightingOptions.map(opt => {
                const isSelected = lighting === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onChangeLighting(opt.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-950/60 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-400'
                        : 'bg-slate-800/40 border-white/10 hover:border-white/20 hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="text-2xl mb-1">{opt.icon}</div>
                    <div className="font-bold text-xs text-white">{opt.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{opt.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Multi-Track Ambient Sound Mixer */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-purple-300">
                <Sliders size={16} />
                <span>Bộ Trộn Âm Thanh Đa Kênh (Soundscape Mixer)</span>
              </div>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 bg-purple-950/40 px-2 py-1 rounded-md border border-purple-500/20">
                <Volume2 size={12} className="text-purple-400" />
                Web Audio Engine
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
              {SOUND_TRACKS.map(track => {
                const currentVol = soundVolumes[track.id] ?? 0;
                return (
                  <div key={track.id} className="bg-slate-800/50 p-3 rounded-xl border border-white/10 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 font-semibold text-slate-200">
                        <span className="text-base">{track.emoji}</span>
                        {track.label}
                      </span>
                      <span className="font-mono text-xs text-purple-300 bg-purple-900/40 px-1.5 py-0.5 rounded">
                        {currentVol}%
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={currentVol}
                        onChange={e => onChangeVolume(track.id, parseInt(e.target.value))}
                        className="w-full accent-purple-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                      />
                      <button
                        onClick={() => onChangeVolume(track.id, currentVol > 0 ? 0 : 50)}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border transition ${
                          currentVol > 0
                            ? 'text-slate-400 border-white/10 hover:text-white'
                            : 'text-purple-300 border-purple-500/40 bg-purple-900/20'
                        }`}
                      >
                        {currentVol > 0 ? 'Tắt' : 'Bật'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs tracking-wide shadow-lg transition"
          >
            Đóng & Áp Dụng
          </button>
        </div>
      </div>
    </div>
  );
};

