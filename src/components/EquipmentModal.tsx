import React, { useState } from 'react';
import { EquipmentCategory, EquipmentItem } from '../types';
import { EQUIPMENT_ITEMS } from '../data/equipment';
import { X, Sparkles, Shield, Heart, Moon } from 'lucide-react';
import { SleepDiorama } from './SleepDiorama';

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  equippedBed: EquipmentItem;
  equippedPillow: EquipmentItem;
  equippedBlanket: EquipmentItem;
  equippedPajamas: EquipmentItem;
  equippedCompanion: EquipmentItem;
  onSelectEquipment: (item: EquipmentItem) => void;
}

export const EquipmentModal: React.FC<EquipmentModalProps> = ({
  isOpen,
  onClose,
  equippedBed,
  equippedPillow,
  equippedBlanket,
  equippedPajamas,
  equippedCompanion,
  onSelectEquipment
}) => {
  const [activeCategory, setActiveCategory] = useState<EquipmentCategory>('bed');

  if (!isOpen) return null;

  const categories: { id: EquipmentCategory; label: string; icon: string }[] = [
    { id: 'bed', label: 'Giường Ngủ', icon: '🛏️' },
    { id: 'pillow', label: 'Gối Nằm', icon: '🪶' },
    { id: 'blanket', label: 'Chăn Ấm', icon: '🧶' },
    { id: 'pajamas', label: 'Đồ Ngủ', icon: '👔' },
    { id: 'companion', label: 'Bạn Đồng Hành', icon: '🐾' }
  ];

  const currentEquippedMap: Record<EquipmentCategory, EquipmentItem> = {
    bed: equippedBed,
    pillow: equippedPillow,
    blanket: equippedBlanket,
    pajamas: equippedPajamas,
    companion: equippedCompanion
  };

  const filteredItems = EQUIPMENT_ITEMS.filter(item => item.category === activeCategory);

  // Calculate total stats
  const totalStats = [
    equippedBed,
    equippedPillow,
    equippedBlanket,
    equippedPajamas,
    equippedCompanion
  ].reduce(
    (acc, item) => ({
      comfort: acc.comfort + item.comfort,
      warmth: acc.warmth + item.warmth,
      serenity: acc.serenity + item.serenity,
      aesthetic: acc.aesthetic + item.aesthetic
    }),
    { comfort: 0, warmth: 0, serenity: 0, aesthetic: 0 }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] bg-slate-900 border border-purple-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Mobile drag handle */}
        <div className="sm:hidden w-12 h-1 bg-white/20 rounded-full mx-auto mt-2 mb-1" />

        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-5 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="text-xl sm:text-2xl p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-purple-500/20 border border-purple-400/30">🧰</span>
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white tracking-wide">Tủ Đồ Trang Bị (Sleep Setup)</h2>
              <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-1">Tùy biến giường chiếu, đồ ngủ và thú cưng</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Total Stats Summary Bar */}
        <div className="px-4 sm:px-6 py-2 sm:py-2.5 bg-purple-950/40 border-b border-purple-500/20 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-white/5">
            <Sparkles size={14} className="text-amber-400 flex-shrink-0" />
            <div>
              <div className="text-slate-400 text-[9px] sm:text-[10px]">Comfort (Độ Êm)</div>
              <div className="font-bold text-amber-300 text-xs sm:text-sm">+{totalStats.comfort} EXP/m</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-white/5">
            <Heart size={14} className="text-rose-400 flex-shrink-0" />
            <div>
              <div className="text-slate-400 text-[9px] sm:text-[10px]">Warmth (Ấm Áp)</div>
              <div className="font-bold text-rose-300 text-xs sm:text-sm">+{totalStats.warmth} Cozy</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-white/5">
            <Shield size={14} className="text-teal-400 flex-shrink-0" />
            <div>
              <div className="text-slate-400 text-[9px] sm:text-[10px]">Serenity (Tĩnh Lặng)</div>
              <div className="font-bold text-teal-300 text-xs sm:text-sm">+{totalStats.serenity} Calm</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-white/5">
            <Moon size={14} className="text-fuchsia-400 flex-shrink-0" />
            <div>
              <div className="text-slate-400 text-[9px] sm:text-[10px]">Aesthetic (Thẩm Mỹ)</div>
              <div className="font-bold text-fuchsia-300 text-xs sm:text-sm">+{totalStats.aesthetic} Dream Luck</div>
            </div>
          </div>
        </div>

        {/* Live Visual Diorama Preview (Instant visual feedback as user changes items) */}
        <div className="bg-slate-950/80 border-b border-white/10 px-4 py-1.5 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="text-[10px] sm:text-[11px] text-purple-300 font-mono flex items-center gap-1.5">
            <span>✨</span>
            <span>Hình ảnh thực tế khi kết hợp trang bị:</span>
            <span className="text-white font-semibold truncate max-w-[200px] sm:max-w-none">
              {equippedBed.name} • {equippedBlanket.name} • {equippedCompanion.name}
            </span>
          </div>
          <div className="scale-[0.7] sm:scale-85 -my-7 sm:-my-5 pointer-events-none">
            <SleepDiorama
              equippedBed={equippedBed}
              equippedPillow={equippedPillow}
              equippedBlanket={equippedBlanket}
              equippedPajamas={equippedPajamas}
              equippedCompanion={equippedCompanion}
              isSleeping={false}
              onOpenEquipmentModal={() => {}}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-4 sm:px-6 pt-3 sm:pt-4 flex gap-2 border-b border-white/10 overflow-x-auto pb-2.5 scrollbar-none">
          {categories.map(cat => {
            const isSelected = activeCategory === cat.id;
            const equippedItem = currentEquippedMap[cat.id];
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-75 font-normal">({equippedItem.name.split(' ')[0]})</span>
              </button>
            );
          })}
        </div>

        {/* Item List Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 overscroll-contain">
          {filteredItems.map(item => {
            const isEquipped = currentEquippedMap[item.category]?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onSelectEquipment(item)}
                className={`relative p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between active:scale-[0.99] ${
                  isEquipped
                    ? 'bg-purple-900/30 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)] ring-1 ring-purple-400/50'
                    : 'bg-slate-800/40 border-white/10 hover:border-white/30 hover:bg-slate-800/70'
                }`}
              >
                {/* Top Item Info */}
                <div className="flex items-start gap-3">
                  <div className="text-2xl sm:text-3xl p-2.5 sm:p-3 bg-black/40 rounded-2xl border border-white/10 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xs sm:text-sm text-white truncate">{item.name}</h3>
                      {isEquipped && (
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-purple-500 text-white px-2 py-0.5 rounded-full flex-shrink-0 ml-1">
                          Đang dùng
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-purple-300 font-mono tracking-wide bg-purple-950/60 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                      {item.tag}
                    </span>
                    <p className="text-[11px] sm:text-xs text-slate-400 mt-1.5 line-clamp-2">{item.description}</p>
                  </div>
                </div>

                {/* Bottom Stats */}
                <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-white/10 grid grid-cols-4 gap-1 text-[10px] sm:text-[11px]">
                  <div className="text-center bg-amber-950/30 rounded py-1 border border-amber-500/20">
                    <span className="text-[8px] sm:text-[9px] text-slate-400 block">Comfort</span>
                    <span className="font-bold text-amber-300">+{item.comfort}</span>
                  </div>
                  <div className="text-center bg-rose-950/30 rounded py-1 border border-rose-500/20">
                    <span className="text-[8px] sm:text-[9px] text-slate-400 block">Warmth</span>
                    <span className="font-bold text-rose-300">+{item.warmth}</span>
                  </div>
                  <div className="text-center bg-teal-950/30 rounded py-1 border border-teal-500/20">
                    <span className="text-[8px] sm:text-[9px] text-slate-400 block">Calm</span>
                    <span className="font-bold text-teal-300">+{item.serenity}</span>
                  </div>
                  <div className="text-center bg-fuchsia-950/30 rounded py-1 border border-fuchsia-500/20">
                    <span className="text-[8px] sm:text-[9px] text-slate-400 block">Aesthetic</span>
                    <span className="font-bold text-fuchsia-300">+{item.aesthetic}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-white/10 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs tracking-wide shadow-lg transition active:scale-95"
          >
            Xong & Áp Dụng
          </button>
        </div>
      </div>
    </div>
  );
};

