import React, { useEffect } from 'react';
import { DreamCard, LocationInfo, PassportStamp } from '../types';
import { Sparkles, Trophy, CheckCircle2, Share2, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MorningReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  elapsedSeconds: number;
  location: LocationInfo;
  dreamCard: DreamCard;
  earnedExp: number;
  currentLevel: number;
  totalExp: number;
  passportStamp: PassportStamp;
  onOpenPassport: () => void;
}

export const MorningReportModal: React.FC<MorningReportModalProps> = ({
  isOpen,
  onClose,
  elapsedSeconds,
  location,
  dreamCard,
  earnedExp,
  currentLevel,
  onOpenPassport
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `🌙 Tôi vừa hoàn thành phiên ngủ tại "${location.nameVi}" trên Sleep Online!\n✨ Giấc mơ: "${dreamCard.title}" - ${dreamCard.story}\n💤 Tham gia cùng tôi tại Sleep Online!`
      );
      alert('Đã sao chép Thẻ Giấc Mơ vào bộ nhớ tạm! Bạn có thể dán lên mạng xã hội.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 text-center">
          <div className="inline-flex p-3 rounded-full bg-amber-500/20 border border-amber-400/30 mb-2">
            <Sparkles size={28} className="text-amber-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Chào Buổi Sáng!</h2>
          <p className="text-xs text-amber-200/80 mt-0.5">
            Phiên ngủ của bạn đã hoàn thành trọn vẹn và an yên.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* 1. Time & Stats Overview */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                Thời Gian Ngủ
              </span>
              <span className="text-2xl font-bold font-mono text-white">
                {hours > 0 ? `${hours}h ` : ''}{minutes}m {seconds}s
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">Tại {location.nameVi}</span>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                Kinh Nghiệm Nhận Được
              </span>
              <span className="text-2xl font-bold font-mono text-amber-400">
                +{earnedExp} EXP
              </span>
              <span className="text-[10px] text-amber-200/70 block mt-1">Cấp độ {currentLevel}</span>
            </div>
          </div>

          {/* 2. Passport Stamp Notification */}
          <div className="bg-indigo-950/40 border border-indigo-500/30 p-3.5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl p-2 bg-indigo-900/50 rounded-xl border border-indigo-400/30">🛂</span>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  Đóng dấu Hộ Chiếu Giấc Ngủ!
                </div>
                <div className="text-[11px] text-indigo-300">Con dấu địa điểm: {location.nameVi}</div>
              </div>
            </div>
            <button
              onClick={onOpenPassport}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1"
            >
              <Compass size={12} />
              Xem Hộ Chiếu
            </button>
          </div>

          {/* 3. Unlocked Dream Card */}
          <div className={`p-5 rounded-2xl border bg-gradient-to-br ${dreamCard.rarityColor} relative overflow-hidden shadow-lg`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{dreamCard.emoji}</span>
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-black/40 border border-white/10">
                    {dreamCard.rarity}
                  </span>
                  <h3 className="font-extrabold text-base text-white mt-1">{dreamCard.title}</h3>
                </div>
              </div>
              <Trophy size={18} className="text-amber-400" />
            </div>

            <p className="text-xs text-slate-200 leading-relaxed italic bg-black/20 p-3 rounded-xl border border-white/10">
              "{dreamCard.story}"
            </p>

            <div className="mt-3 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Thẻ Giấc Mơ #SL-{dreamCard.id.split('-')[1]}</span>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              >
                <Share2 size={12} />
                <span>Chia Sẻ Thẻ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-slate-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide shadow-lg transition"
          >
            Quay Về Phòng Ngủ
          </button>
        </div>
      </div>
    </div>
  );
};

