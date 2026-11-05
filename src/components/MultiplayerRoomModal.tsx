import React, { useState } from 'react';
import { RoomPeer } from '../types';
import { MOCK_ROOM_PEERS } from '../data/dreams';
import { X, Users, Heart, Sparkles, Moon } from 'lucide-react';

interface MultiplayerRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAvatar: string;
  userName: string;
}

export const MultiplayerRoomModal: React.FC<MultiplayerRoomModalProps> = ({
  isOpen,
  onClose,
  userName
}) => {
  const [peers, setPeers] = useState<RoomPeer[]>(MOCK_ROOM_PEERS);
  const [sentReactions, setSentReactions] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleSendHeart = (peerId: string) => {
    setPeers(prev =>
      prev.map(p => (p.id === peerId ? { ...p, likes: p.likes + 1 } : p))
    );
    setSentReactions(prev => ({ ...prev, [peerId]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] bg-slate-900 border border-purple-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Mobile drag handle */}
        <div className="sm:hidden w-12 h-1 bg-white/20 rounded-full mx-auto mt-2 mb-1" />

        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-5 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="text-xl sm:text-2xl p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-purple-500/20 border border-purple-400/30">👥</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-bold text-white tracking-wide">Phòng Ngủ 2AM Club</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] sm:text-[10px] font-mono border border-emerald-500/30">
                  LIVE 5 người
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-1">Không ồn ào. Cùng nhau chìm vào giấc ngủ an yên.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current User in Room */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-purple-950/40 border-b border-purple-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-500/30 border border-purple-400/40 flex items-center justify-center text-base sm:text-lg">
              😌
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-white truncate max-w-[140px] sm:max-w-none">{userName} (Bạn)</div>
              <div className="text-[9px] sm:text-[10px] text-purple-300">Đang chuẩn bị vào giấc ngủ</div>
            </div>
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1 font-mono">
            <Moon size={12} className="text-purple-400" /> Yên lặng
          </span>
        </div>

        {/* Peer List */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain max-h-[60vh] space-y-2.5 sm:space-y-3.5">
          <div className="text-[11px] sm:text-xs font-mono text-slate-400 flex items-center gap-1.5 mb-1">
            <Users size={14} />
            <span>Những người bạn đang ngủ say cùng phòng:</span>
          </div>

          {peers.map(peer => {
            const hasSent = sentReactions[peer.id];
            return (
              <div
                key={peer.id}
                className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-800/40 border border-white/10 hover:border-white/20 transition flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-xl sm:text-2xl shadow-inner relative flex-shrink-0">
                    {peer.avatarEmoji}
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs sm:text-sm text-white truncate">{peer.name}</h4>
                      <span className="text-[9px] sm:text-[10px] text-purple-300 font-mono bg-purple-900/40 px-1.5 py-0.2 rounded border border-purple-400/20 flex-shrink-0">
                        {peer.pajama}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-300 italic mt-0.5 line-clamp-1">"{peer.statusText}"</p>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono mt-0.5 block">
                      Đã ngủ: {Math.floor(peer.minutesSleeping / 60)}h {peer.minutesSleeping % 60}m
                    </span>
                  </div>
                </div>

                {/* Silent Reaction Button */}
                <button
                  onClick={() => handleSendHeart(peer.id)}
                  disabled={hasSent}
                  className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition active:scale-95 flex-shrink-0 ${
                    hasSent
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-white/10 hover:border-rose-500/30'
                  }`}
                  title="Thả sao băng chúc ngủ ngon"
                >
                  <Heart size={14} className={hasSent ? 'fill-rose-400 text-rose-400' : ''} />
                  <span>{peer.likes}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-white/10 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-purple-300 text-[10px] sm:text-xs truncate mr-2">
            <Sparkles size={14} className="flex-shrink-0" />
            <span className="truncate">Thả sao băng gửi thông điệp bình an đến bạn bè.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition active:scale-95 flex-shrink-0"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

