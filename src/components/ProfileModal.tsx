import React, { useState } from 'react';
import { UserProfile, SleepHistoryRecord } from '../types';
import { X, User, Edit3, Award, Clock, Moon, Trash2, Check, Sparkles, History } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (newProfile: UserProfile) => void;
  userLevel: number;
  totalExp: number;
  history: SleepHistoryRecord[];
  onResetData: () => void;
  totalLocationsUnlocked: number;
  totalLocationsCount: number;
}

const AVATAR_OPTIONS = ['😴', '😌', '🐼', '🐱', '🌙', '🪐', '☕', '🦄', '🚀', '🧸', '🦉', '🦊'];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  userLevel,
  totalExp,
  history,
  onResetData,
  totalLocationsUnlocked,
  totalLocationsCount
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatarEmoji);
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

  if (!isOpen) return null;

  // Calculate Title based on level
  const getLevelTitle = (lvl: number) => {
    if (lvl >= 10) return 'Bậc Thầy Giấc Mơ Vô Tận';
    if (lvl >= 7) return 'Kẻ Săn Đom Đóm Đêm';
    if (lvl >= 5) return 'Nhà Thám Hiểm Trăng Sao';
    if (lvl >= 3) return 'Người Mơ Ban Ngày';
    if (lvl >= 2) return 'Người Bạn Rừng Thông';
    return 'Tân Binh Ngủ Nướng';
  };

  const currentTitle = getLevelTitle(userLevel);

  // EXP progress inside current level (each level takes 150 EXP)
  const currentLevelExp = totalExp % 150;
  const expProgressPercent = Math.min(100, Math.round((currentLevelExp / 150) * 100));

  // Total sleep minutes accumulated
  const totalMinutesSlept = history.reduce((sum, item) => sum + item.durationMinutes, 0);
  const totalHours = (totalMinutesSlept / 60).toFixed(1);

  const handleSaveProfile = () => {
    const trimmed = editName.trim() || 'Người Du Hành Đêm';
    onUpdateProfile({
      ...profile,
      name: trimmed,
      avatarEmoji: selectedAvatar,
      title: currentTitle
    });
    setIsEditing(false);
  };

  const handleConfirmReset = () => {
    if (window.confirm('Bạn có chắc muốn đặt lại toàn bộ cấp độ, trang bị và lịch sử giấc ngủ không? Hành động này không thể hoàn tác.')) {
      onResetData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] bg-slate-900 border border-purple-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Mobile drag handle */}
        <div className="sm:hidden w-12 h-1 bg-white/20 rounded-full mx-auto mt-2 mb-1" />

        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="text-xl sm:text-2xl p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-purple-500/20 border border-purple-400/30">👤</span>
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white tracking-wide">Hồ Sơ Tài Khoản (Profile)</h2>
              <p className="text-[11px] sm:text-xs text-slate-400">Lưu trữ vĩnh viễn trên máy của bạn (Offline LocalStorage)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900/60 border-b border-white/10 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-slate-800/90 border-2 border-purple-400/40 flex items-center justify-center text-3xl sm:text-4xl shadow-xl shadow-purple-600/20 relative flex-shrink-0">
            {profile.avatarEmoji}
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-purple-600 border border-white/20 text-[10px] font-bold font-mono">
              Lv.{userLevel}
            </span>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            {!isEditing ? (
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-lg sm:text-xl font-extrabold text-white truncate">{profile.name}</h3>
                  <button
                    onClick={() => {
                      setEditName(profile.name);
                      setSelectedAvatar(profile.avatarEmoji);
                      setIsEditing(true);
                    }}
                    className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-purple-300 transition"
                    title="Đổi tên & avatar"
                  >
                    <Edit3 size={15} />
                  </button>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-amber-300 font-medium mt-0.5">
                  <Award size={13} />
                  <span>{currentTitle}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Tham gia từ: {profile.joinedDate} • Lưu trên trình duyệt hiện tại
                </p>
              </div>
            ) : (
              <div className="space-y-3 w-full">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="Nhập tên tài khoản..."
                    maxLength={25}
                    className="flex-1 bg-slate-800 border border-purple-500/50 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-400"
                  />
                  <button
                    onClick={handleSaveProfile}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1 transition active:scale-95"
                  >
                    <Check size={14} />
                    <span>Lưu</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs transition"
                  >
                    Hủy
                  </button>
                </div>

                {/* Avatar Picker */}
                <div>
                  <div className="text-[10px] text-slate-400 mb-1">Chọn biểu tượng đại diện:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {AVATAR_OPTIONS.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => setSelectedAvatar(emoji)}
                        className={`w-8 h-8 rounded-xl text-lg flex items-center justify-center transition ${
                          selectedAvatar === emoji
                            ? 'bg-purple-600 border border-white/30 scale-110 shadow-md'
                            : 'bg-slate-800 hover:bg-slate-700'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab switchers */}
        <div className="px-4 sm:px-6 pt-3 flex gap-2 border-b border-white/10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-purple-400 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles size={14} />
            <span>Thống Kê & Cấp Độ</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-purple-400 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History size={14} />
            <span>Lịch Sử Phiên Ngủ ({history.length})</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain">
            {/* Level Progress Bar */}
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span>Cấp Độ {userLevel}</span>
                  <span className="text-amber-300 font-normal text-[11px]">({currentTitle})</span>
                </span>
                <span className="font-mono text-purple-300 text-[11px]">
                  {currentLevelExp} / 150 EXP ({expProgressPercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500 rounded-full shadow-[0_0_10px_#a855f7]"
                  style={{ width: `${expProgressPercent}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 flex items-center justify-between">
                <span>Tổng tích lũy: {totalExp} EXP</span>
                <span>Còn {150 - currentLevelExp} EXP để lên Cấp {userLevel + 1}</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-800/40 p-3 rounded-xl border border-white/5 text-center">
                <div className="text-xl mb-1">⏱️</div>
                <div className="text-[10px] text-slate-400">Tổng Giờ Ngủ</div>
                <div className="font-bold text-base text-white">{totalHours}h</div>
              </div>

              <div className="bg-slate-800/40 p-3 rounded-xl border border-white/5 text-center">
                <div className="text-xl mb-1">💤</div>
                <div className="text-[10px] text-slate-400">Phiên Đã Hoàn Thành</div>
                <div className="font-bold text-base text-white">{history.length}</div>
              </div>

              <div className="bg-slate-800/40 p-3 rounded-xl border border-white/5 text-center">
                <div className="text-xl mb-1">🛂</div>
                <div className="text-[10px] text-slate-400">Dấu Hộ Chiếu</div>
                <div className="font-bold text-base text-amber-300">
                  {totalLocationsUnlocked}/{totalLocationsCount}
                </div>
              </div>

              <div className="bg-slate-800/40 p-3 rounded-xl border border-white/5 text-center">
                <div className="text-xl mb-1">✨</div>
                <div className="text-[10px] text-slate-400">Thẻ Giấc Mơ</div>
                <div className="font-bold text-base text-purple-300">{history.length}</div>
              </div>
            </div>

            {/* Explanation Alert for Persistence */}
            <div className="bg-indigo-950/30 border border-indigo-500/20 p-3.5 rounded-2xl flex items-start gap-3 text-xs text-slate-300">
              <span className="text-xl">💾</span>
              <div>
                <h4 className="font-bold text-white mb-0.5">Dữ Liệu Đang Được Lưu Vĩnh Viễn Trên Trình Duyệt Này</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Ứng dụng sử dụng công nghệ <b>localStorage</b> chuẩn HTML5. Dù bạn làm mới trang (F5), tắt điện thoại, đóng trình duyệt thì tên tài khoản, cấp độ, trang bị và lịch sử giấc ngủ vẫn được giữ nguyên 100%!
                </p>
              </div>
            </div>

            {/* Reset Data Option */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleConfirmReset}
                className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-950/30 transition"
              >
                <Trash2 size={13} />
                <span>Đặt Lại / Xóa Toàn Bộ Dữ Liệu</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Sleep History Log */}
        {activeTab === 'history' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 overscroll-contain">
            {history.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <div className="text-4xl mb-2">🌙</div>
                <p className="text-xs">Chưa có phiên ngủ nào được ghi nhận.</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Hãy bấm "Bắt Đầu Ngủ Online" và thức dậy để lưu lại trang nhật ký đầu tiên!
                </p>
              </div>
            ) : (
              history.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-800/40 border border-white/10 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl p-2 bg-black/40 rounded-xl border border-white/10 flex-shrink-0">
                      {item.dreamEmoji || '🌙'}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">{item.dreamTitle}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>{item.dateStr}</span>
                        <span>•</span>
                        <span className="text-amber-300">{item.locationName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="font-mono font-bold text-purple-300 block">
                      +{item.earnedExp} EXP
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.durationMinutes} phút
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-white/10 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs tracking-wide shadow-lg transition active:scale-95"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

