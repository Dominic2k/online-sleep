import React from 'react';
import { PassportStamp } from '../types';
import { LOCATIONS } from '../data/locations';
import { X, CheckCircle, Lock, Award } from 'lucide-react';

interface SleepPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stamps: PassportStamp[];
}

export const SleepPassportModal: React.FC<SleepPassportModalProps> = ({
  isOpen,
  onClose,
  stamps
}) => {
  if (!isOpen) return null;

  const unlockedMap = new Map(stamps.map(s => [s.locationId, s]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#141624] border border-amber-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Passport Leather Header */}
        <div className="px-6 py-5 border-b border-amber-500/20 bg-gradient-to-r from-amber-950 via-[#181a2e] to-amber-950 text-center relative">
          <div className="text-3xl mb-1">🛂</div>
          <h2 className="text-xl font-extrabold tracking-widest uppercase text-amber-300 font-mono">
            Hộ Chiếu Giấc Mơ (Sleep Passport)
          </h2>
          <p className="text-xs text-amber-200/60 font-mono">
            OFFICIAL SLUMBERVERSE EXPLORATION PASSPORT
          </p>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Passport Content Pages */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-b border-white/10 pb-2">
            <span>Đã khám phá: {stamps.length} / {LOCATIONS.length} Địa điểm</span>
            <span className="flex items-center gap-1 text-amber-300 font-semibold">
              <Award size={14} /> Danh hiệu: Nhà Du Hành Đêm
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LOCATIONS.map(loc => {
              const stamp = unlockedMap.get(loc.id);
              const isUnlocked = !!stamp;

              return (
                <div
                  key={loc.id}
                  className={`relative p-4 rounded-2xl border transition flex flex-col justify-between overflow-hidden ${
                    isUnlocked
                      ? 'bg-amber-950/20 border-amber-400/40 shadow-md'
                      : 'bg-slate-900/40 border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                        {loc.nameVi}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono">{loc.name}</span>
                    </div>

                    {isUnlocked ? (
                      <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                        <CheckCircle size={14} />
                      </span>
                    ) : (
                      <span className="p-1 rounded-full bg-white/5 text-slate-500 border border-white/10">
                        <Lock size={14} />
                      </span>
                    )}
                  </div>

                  {/* Stamp Graphic */}
                  <div className="my-3 py-3 px-4 rounded-xl border border-dashed flex items-center justify-between font-mono text-xs relative select-none">
                    {isUnlocked ? (
                      <>
                        <div className="border border-amber-400 text-amber-300 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-widest transform -rotate-6 shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                          ★ PASSED ★
                        </div>
                        <div className="text-right text-[11px] text-amber-200/80">
                          <div>{stamp.unlockedAt}</div>
                          <div className="text-[10px] text-slate-400">{stamp.sleepMinutes} phút ngủ sâu</div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full text-center text-slate-500 text-[11px] py-1">
                        Chưa có dấu mộc
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-1">{loc.subtitle}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-slate-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Đóng Hộ Chiếu
          </button>
        </div>
      </div>
    </div>
  );
};

