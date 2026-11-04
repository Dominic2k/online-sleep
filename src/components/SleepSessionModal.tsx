import React from 'react';
import { DurationMode, EquipmentItem, LocationInfo } from '../types';
import { X, Moon, Clock, Sparkles } from 'lucide-react';

interface SleepSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSleep: (mode: DurationMode) => void;
  selectedMode: DurationMode;
  onSelectMode: (mode: DurationMode) => void;
  location: LocationInfo;
  equippedBed: EquipmentItem;
  totalComfort: number;
}

export const SleepSessionModal: React.FC<SleepSessionModalProps> = ({
  isOpen,
  onClose,
  onStartSleep,
  selectedMode,
  onSelectMode,
  location,
  equippedBed,
  totalComfort
}) => {
  if (!isOpen) return null;

  const durationOptions: { id: DurationMode; label: string; timeText: string; desc: string; icon: string }[] = [
    { id: 'nap15', label: 'Chợp Mắt Nhanh', timeText: '15 Phút', desc: 'Sạc nhanh năng lượng giữa giờ làm việc', icon: '⚡' },
    { id: 'nap30', label: 'Giấc Ngủ Trưa', timeText: '30 Phút', desc: 'Tránh mệt mỏi buổi chiều, tái tạo tập trung', icon: '🌤️' },
    { id: 'hour1', label: 'Power Sleep', timeText: '1 Giờ', desc: 'Chu kỳ hồi phục ngắn cho ngày bận rộn', icon: '🔋' },
    { id: 'hour4', label: 'Ngủ Nửa Đêm', timeText: '4 Giờ', desc: 'Phù hợp người ngủ theo chu kỳ polyphasic', icon: '🌙' },
    { id: 'hour8', label: 'Giấc Ngủ Tiêu Chuẩn', timeText: '8 Giờ', desc: 'Giấc ngủ trọn vẹn tái sinh thể chất & tâm trí', icon: '🌟' },
    { id: 'endless', label: 'Vô Hạn (Endless)', timeText: 'Tự Thức Dậy', desc: 'Ngủ thảnh thơi không báo thức, tự do bấm dậy', icon: '♾️' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-indigo-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-2xl bg-indigo-500/20 border border-indigo-400/30">💤</span>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Thiết Lập Phiên Ngủ (Sleep Session)</h2>
              <p className="text-xs text-slate-400">Chọn thời lượng và bắt đầu hành trình thư giãn của bạn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Selected Location & Setup summary */}
        <div className="px-6 py-3 bg-indigo-950/40 border-b border-indigo-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-indigo-200">
            <span>📍 Địa điểm:</span>
            <span className="font-bold text-white">{location.nameVi}</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-200">
            <span>🛏️ Giường:</span>
            <span className="font-bold text-white">{equippedBed.name}</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-300 font-medium">
            <Sparkles size={14} />
            <span>+{totalComfort} EXP/phút</span>
          </div>
        </div>

        {/* Duration Selection Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {durationOptions.map(opt => {
            const isSelected = selectedMode === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onSelectMode(opt.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-indigo-950/70 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)] ring-1 ring-indigo-400'
                    : 'bg-slate-800/40 border-white/10 hover:border-white/20 hover:bg-slate-800/70'
                }`}
              >
                <div className="text-3xl p-2 bg-black/40 rounded-xl border border-white/10">
                  {opt.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{opt.label}</span>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-200 border border-indigo-400/20">
                      {opt.timeText}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{opt.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Notice & Start Button */}
        <div className="px-6 py-4 border-t border-white/10 bg-slate-950/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock size={16} className="text-indigo-400 flex-shrink-0" />
            <span>Màn hình sẽ chuyển sang chế độ Dark OLED dịu mắt với âm thanh thư giãn.</span>
          </div>
          <button
            onClick={() => onStartSleep(selectedMode)}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition transform active:scale-95"
          >
            <Moon size={18} />
            <span>Bắt Đầu Ngủ Ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};

