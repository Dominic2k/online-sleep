import { useState, useEffect } from 'react';
import {
  LocationInfo,
  EquipmentItem,
  WeatherType,
  LightingType,
  SoundTrackId,
  DurationMode,
  SleepSessionState,
  PassportStamp,
  DreamCard,
  UserProfile,
  SleepHistoryRecord
} from './types';
import { LOCATIONS } from './data/locations';
import { EQUIPMENT_ITEMS } from './data/equipment';
import { DREAM_CARDS } from './data/dreams';
import { audioEngine } from './utils/audioEngine';

// Components
import { SleepStage } from './components/SleepStage';
import { LocationSelector } from './components/LocationSelector';
import { EquipmentModal } from './components/EquipmentModal';
import { EnvironmentModal } from './components/EnvironmentModal';
import { SleepSessionModal } from './components/SleepSessionModal';
import { SleepingOverlay } from './components/SleepingOverlay';
import { MorningReportModal } from './components/MorningReportModal';
import { SleepRouletteModal } from './components/SleepRouletteModal';
import { SleepPassportModal } from './components/SleepPassportModal';
import { MultiplayerRoomModal } from './components/MultiplayerRoomModal';
import { ProfileModal } from './components/ProfileModal';

// Icons
import {
  Moon,
  Sparkles,
  Sliders,
  Dices,
  Compass,
  Users,
  Volume2,
  VolumeX,
  ArrowRight,
  Share2
} from 'lucide-react';

const STORAGE_KEY = 'sleep_online_v1_save';

export function App() {
  // Helper to load stored state from LocalStorage
  const getSavedData = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return null;
  };

  const saved = getSavedData();

  // 1. User Profile & Account (Persistent)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    if (saved?.profile) return saved.profile;
    return {
      name: 'Người Du Hành Đêm',
      avatarEmoji: '😌',
      title: 'Tân Binh Ngủ Nướng',
      joinedDate: new Date().toISOString().split('T')[0]
    };
  });

  const [userLevel, setUserLevel] = useState<number>(() => saved?.userLevel || 1);
  const [totalExp, setTotalExp] = useState<number>(() => saved?.totalExp || 120);

  // Sleep History (Persistent)
  const [sleepHistory, setSleepHistory] = useState<SleepHistoryRecord[]>(() => {
    if (saved?.sleepHistory && Array.isArray(saved.sleepHistory)) return saved.sleepHistory;
    return [];
  });

  // Location (Persistent)
  const [currentLocation, setCurrentLocation] = useState<LocationInfo>(() => {
    if (saved?.locationId) {
      const found = LOCATIONS.find(l => l.id === saved.locationId);
      if (found) return found;
    }
    return LOCATIONS[0];
  });

  // Equipment selection (Persistent)
  const [equippedBed, setEquippedBed] = useState<EquipmentItem>(() => {
    if (saved?.bedId) {
      const found = EQUIPMENT_ITEMS.find(i => i.id === saved.bedId);
      if (found) return found;
    }
    return EQUIPMENT_ITEMS.find(i => i.id === 'bed-vintage-wood')!;
  });

  const [equippedPillow, setEquippedPillow] = useState<EquipmentItem>(() => {
    if (saved?.pillowId) {
      const found = EQUIPMENT_ITEMS.find(i => i.id === saved.pillowId);
      if (found) return found;
    }
    return EQUIPMENT_ITEMS.find(i => i.id === 'pillow-cloud-feather')!;
  });

  const [equippedBlanket, setEquippedBlanket] = useState<EquipmentItem>(() => {
    if (saved?.blanketId) {
      const found = EQUIPMENT_ITEMS.find(i => i.id === saved.blanketId);
      if (found) return found;
    }
    return EQUIPMENT_ITEMS.find(i => i.id === 'blanket-wool')!;
  });

  const [equippedPajamas, setEquippedPajamas] = useState<EquipmentItem>(() => {
    if (saved?.pajamasId) {
      const found = EQUIPMENT_ITEMS.find(i => i.id === saved.pajamasId);
      if (found) return found;
    }
    return EQUIPMENT_ITEMS.find(i => i.id === 'pj-stripes')!;
  });

  const [equippedCompanion, setEquippedCompanion] = useState<EquipmentItem>(() => {
    if (saved?.companionId) {
      const found = EQUIPMENT_ITEMS.find(i => i.id === saved.companionId);
      if (found) return found;
    }
    return EQUIPMENT_ITEMS.find(i => i.id === 'pet-cat')!;
  });

  // Environment (Persistent)
  const [weather, setWeather] = useState<WeatherType>(() => saved?.weather || currentLocation.defaultWeather);
  const [lighting, setLighting] = useState<LightingType>(() => saved?.lighting || currentLocation.defaultLighting);
  const [soundVolumes, setSoundVolumes] = useState<Record<SoundTrackId, number>>(() => {
    if (saved?.soundVolumes) return saved.soundVolumes;
    return {
      rain: 60,
      thunder: 0,
      waves: 0,
      campfire: 0,
      forest: 0,
      clock: 20,
      lofi: 40,
      whitenoise: 10
    };
  });

  // Sound active status
  const [isAudioActive, setIsAudioActive] = useState(false);

  // Passport Stamps (Persistent)
  const [stamps, setStamps] = useState<PassportStamp[]>(() => {
    if (saved?.stamps && Array.isArray(saved.stamps)) return saved.stamps;
    return [{ locationId: 'attic', unlockedAt: '2026-11-04', sleepMinutes: 480 }];
  });

  // Auto-Save all changes to LocalStorage
  useEffect(() => {
    try {
      const dataToSave = {
        profile: userProfile,
        userLevel,
        totalExp,
        sleepHistory,
        locationId: currentLocation.id,
        bedId: equippedBed.id,
        pillowId: equippedPillow.id,
        blanketId: equippedBlanket.id,
        pajamasId: equippedPajamas.id,
        companionId: equippedCompanion.id,
        weather,
        lighting,
        soundVolumes,
        stamps
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {
      // ignore
    }
  }, [
    userProfile,
    userLevel,
    totalExp,
    sleepHistory,
    currentLocation.id,
    equippedBed.id,
    equippedPillow.id,
    equippedBlanket.id,
    equippedPajamas.id,
    equippedCompanion.id,
    weather,
    lighting,
    soundVolumes,
    stamps
  ]);

  // Sleep Session state
  const [session, setSession] = useState<SleepSessionState>({
    status: 'idle',
    durationMode: 'hour8',
    targetMinutes: 480,
    elapsedSeconds: 0,
    startTime: null
  });

  // Latest Earned Report state
  const [latestDreamCard, setLatestDreamCard] = useState<DreamCard>(DREAM_CARDS[0]);
  const [latestEarnedExp, setLatestEarnedExp] = useState(0);

  // Modals
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [showEnvironmentModal, setShowEnvironmentModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showMorningReportModal, setShowMorningReportModal] = useState(false);
  const [showRouletteModal, setShowRouletteModal] = useState(false);
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);

  // Active Sleep Timer
  useEffect(() => {
    let interval: number;
    if (session.status === 'sleeping') {
      interval = window.setInterval(() => {
        setSession(prev => ({
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [session.status]);

  // Total Comfort Calculation
  const totalComfort =
    equippedBed.comfort +
    equippedPillow.comfort +
    equippedBlanket.comfort +
    equippedPajamas.comfort +
    equippedCompanion.comfort;

  // Handle Location Switch
  const handleSelectLocation = (loc: LocationInfo) => {
    setCurrentLocation(loc);
    setWeather(loc.defaultWeather);
    setLighting(loc.defaultLighting);

    // Apply location default sounds
    const updatedSounds: Record<SoundTrackId, number> = {
      rain: 0,
      thunder: 0,
      waves: 0,
      campfire: 0,
      forest: 0,
      clock: 0,
      lofi: 0,
      whitenoise: 0,
      ...loc.defaultSounds
    };
    setSoundVolumes(updatedSounds);

    if (isAudioActive) {
      audioEngine.updateVolumes(updatedSounds);
    }
  };

  // Sound Engine Volume Change
  const handleChangeVolume = (trackId: SoundTrackId, vol: number) => {
    const next = { ...soundVolumes, [trackId]: vol };
    setSoundVolumes(next);
    if (!isAudioActive) {
      audioEngine.startEngine(next);
      setIsAudioActive(true);
    } else {
      audioEngine.updateVolumes(next);
    }
  };

  const handleToggleSound = () => {
    if (!isAudioActive) {
      audioEngine.startEngine(soundVolumes);
      setIsAudioActive(true);
    } else {
      audioEngine.stopEngine();
      setIsAudioActive(false);
    }
  };

  // Web Share / Copy Link handler
  const handleShareApp = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Sleep Online – The Cozy Slumberverse',
          text: `Vào chọn phòng ngủ 2D, tùy chỉnh trang bị và ngủ cùng ${userProfile.name} tại Sleep Online nhé! 🌙💤`,
          url: window.location.href
        })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép link Sleep Online vào bộ nhớ tạm! Bạn có thể dán gửi cho bạn bè.');
    }
  };

  // Start Sleep Session
  const handleStartSleep = (mode: DurationMode) => {
    setShowSessionModal(false);

    // Start Audio
    if (!isAudioActive) {
      audioEngine.startEngine(soundVolumes);
      setIsAudioActive(true);
    }

    let targetMins = 0;
    if (mode === 'nap15') targetMins = 15;
    else if (mode === 'nap30') targetMins = 30;
    else if (mode === 'hour1') targetMins = 60;
    else if (mode === 'hour4') targetMins = 240;
    else if (mode === 'hour8') targetMins = 480;

    setSession({
      status: 'sleeping',
      durationMode: mode,
      targetMinutes: targetMins,
      elapsedSeconds: 0,
      startTime: Date.now()
    });
  };

  // Wake Up & Complete Session
  const handleWakeUp = () => {
    const elapsedMinutes = Math.max(1, Math.round(session.elapsedSeconds / 60));
    const calculatedExp = Math.round(elapsedMinutes * (10 + totalComfort * 0.15));

    // Pick random Dream Card
    const randomDream = DREAM_CARDS[Math.floor(Math.random() * DREAM_CARDS.length)];
    setLatestDreamCard(randomDream);
    setLatestEarnedExp(calculatedExp);

    // Update EXP & Level
    const newTotalExp = totalExp + calculatedExp;
    const newLevel = Math.floor(newTotalExp / 150) + 1;
    setTotalExp(newTotalExp);
    setUserLevel(newLevel);

    // Record into persistent Sleep History
    const newRecord: SleepHistoryRecord = {
      id: `sleep-${Date.now()}`,
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      locationId: currentLocation.id,
      locationName: currentLocation.nameVi,
      durationMinutes: elapsedMinutes,
      earnedExp: calculatedExp,
      dreamTitle: randomDream.title,
      dreamEmoji: randomDream.emoji,
      dreamRarity: randomDream.rarity
    };
    setSleepHistory(prev => [newRecord, ...prev]);

    // Unlock or update stamp
    setStamps(prev => {
      const exists = prev.find(s => s.locationId === currentLocation.id);
      if (exists) {
        return prev.map(s =>
          s.locationId === currentLocation.id
            ? { ...s, sleepMinutes: s.sleepMinutes + elapsedMinutes }
            : s
        );
      }
      return [
        ...prev,
        {
          locationId: currentLocation.id,
          unlockedAt: new Date().toISOString().split('T')[0],
          sleepMinutes: elapsedMinutes
        }
      ];
    });

    setSession(prev => ({ ...prev, status: 'completed' }));
    setShowMorningReportModal(true);
  };

  // Reset entire profile and state
  const handleResetData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUserLevel(1);
    setTotalExp(120);
    setSleepHistory([]);
    setStamps([{ locationId: 'attic', unlockedAt: new Date().toISOString().split('T')[0], sleepMinutes: 480 }]);
    setUserProfile({
      name: 'Người Du Hành Đêm',
      avatarEmoji: '😌',
      title: 'Tân Binh Ngủ Nướng',
      joinedDate: new Date().toISOString().split('T')[0]
    });
    alert('Đã xóa dữ liệu cục bộ và đặt lại từ đầu!');
  };

  // Equipment Item select
  const handleSelectEquipment = (item: EquipmentItem) => {
    if (item.category === 'bed') setEquippedBed(item);
    else if (item.category === 'pillow') setEquippedPillow(item);
    else if (item.category === 'blanket') setEquippedBlanket(item);
    else if (item.category === 'pajamas') setEquippedPajamas(item);
    else if (item.category === 'companion') setEquippedCompanion(item);
  };

  return (
    <div className="min-h-screen bg-[#090a12] text-slate-100 flex flex-col justify-between selection:bg-purple-500/30">
      {/* 1. Top Navbar */}
      <header className="border-b border-white/10 bg-slate-950/85 backdrop-blur-md sticky top-0 z-30 px-3 sm:px-8 py-2 sm:py-3 flex items-center justify-between">
        {/* Brand & User Profile Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-base sm:text-xl shadow-lg shadow-purple-600/30 border border-purple-400/30 flex-shrink-0">
            🌙
          </div>
          <div>
            <h1 className="font-extrabold text-xs sm:text-base tracking-tight bg-gradient-to-r from-purple-200 via-white to-indigo-200 bg-clip-text text-transparent leading-tight">
              Sleep Online
            </h1>
            <p className="text-[9px] text-purple-300 font-mono tracking-wider -mt-0.5">
              SLUMBERVERSE
            </p>
          </div>
        </div>

        {/* User Account / Profile Badge (Clickable to open ProfileModal) */}
        <button
          onClick={() => setShowProfileModal(true)}
          className="flex items-center gap-1.5 sm:gap-2 bg-slate-900/90 hover:bg-purple-950/40 p-1 sm:py-1.5 sm:px-3 rounded-xl sm:rounded-2xl border border-white/10 hover:border-purple-400/40 transition active:scale-95 group text-left"
          title="Xem hồ sơ & lịch sử giấc ngủ"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-sm sm:text-base group-hover:scale-105 transition flex-shrink-0">
            {userProfile.avatarEmoji}
          </div>
          <div className="min-w-0 pr-1">
            <div className="font-bold text-[11px] sm:text-xs text-white truncate max-w-[85px] sm:max-w-[120px]">
              {userProfile.name}
            </div>
            <div className="text-[9px] sm:text-[10px] text-amber-300 font-mono flex items-center gap-1">
              <span>Lv.{userLevel}</span>
              <span className="text-slate-500">•</span>
              <span>{totalExp} EXP</span>
            </div>
          </div>
        </button>

        {/* Quick Nav Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quick Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border transition flex items-center gap-1.5 text-xs font-semibold active:scale-95 ${
              isAudioActive
                ? 'bg-purple-600/30 text-purple-200 border-purple-400/50 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'bg-slate-900/60 text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Bật/Tắt âm thanh môi trường Web Audio"
          >
            {isAudioActive ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span className="hidden md:inline">{isAudioActive ? 'Đang Phát' : 'Âm Thanh'}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShareApp}
            className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition active:scale-95"
            title="Chia sẻ Sleep Online"
          >
            <Share2 size={15} className="text-purple-300" />
          </button>

          {/* Desktop-only Quick Buttons */}
          <button
            onClick={() => setShowRouletteModal(true)}
            className="hidden md:flex p-2.5 rounded-2xl bg-slate-900/60 hover:bg-fuchsia-950/40 text-slate-300 hover:text-fuchsia-300 border border-white/10 hover:border-fuchsia-500/30 transition items-center gap-1.5 text-xs font-semibold"
            title="Quay ngẫu nhiên Sleep Roulette"
          >
            <Dices size={16} className="text-fuchsia-400" />
            <span>Roulette</span>
          </button>

          <button
            onClick={() => setShowPassportModal(true)}
            className="hidden md:flex p-2.5 rounded-2xl bg-slate-900/60 hover:bg-amber-950/40 text-slate-300 hover:text-amber-300 border border-white/10 hover:border-amber-500/30 transition items-center gap-1.5 text-xs font-semibold"
            title="Xem Hộ Chiếu Giấc Ngủ"
          >
            <Compass size={16} className="text-amber-400" />
            <span>Hộ Chiếu</span>
          </button>

          <button
            onClick={() => setShowRoomModal(true)}
            className="hidden md:flex p-2.5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 hover:from-purple-900/60 hover:to-indigo-900/60 text-purple-200 border border-purple-500/30 transition items-center gap-1.5 text-xs font-semibold"
            title="Phòng ngủ online 2AM Club"
          >
            <Users size={16} className="text-indigo-400" />
            <span>2AM Club</span>
          </button>
        </div>
      </header>

      {/* 2. Main Body Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3.5 sm:p-6 space-y-4 sm:space-y-5 pb-24 md:pb-6">
        {/* Location Picker Strip */}
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5 text-[11px] sm:text-xs">
              <span>📍</span> Chọn Địa Điểm (5 Locations)
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] text-purple-300">
              {currentLocation.nameVi}
            </span>
          </div>
          <LocationSelector
            currentLocationId={currentLocation.id}
            onSelectLocation={handleSelectLocation}
          />
        </div>

        {/* Dynamic 2D Sleep Stage */}
        <SleepStage
          location={currentLocation}
          weather={weather}
          lighting={lighting}
          equippedBed={equippedBed}
          equippedPillow={equippedPillow}
          equippedBlanket={equippedBlanket}
          equippedPajamas={equippedPajamas}
          equippedCompanion={equippedCompanion}
          isSleeping={session.status === 'sleeping'}
        />

        {/* Dashboard Bottom Action Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
          {/* 1. Equipment Button */}
          <button
            onClick={() => setShowEquipmentModal(true)}
            className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-slate-900/80 hover:bg-slate-800/80 border border-purple-500/20 hover:border-purple-500/40 text-left transition shadow-lg flex items-center justify-between group active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <span className="text-xl sm:text-2xl p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-purple-500/20 border border-purple-400/30 group-hover:scale-105 transition flex-shrink-0">
                🧰
              </span>
              <div className="min-w-0">
                <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                  Tủ Đồ Trang Bị
                  <span className="text-[10px] text-amber-300 font-mono">+{totalComfort} EXP</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                  {equippedBed.name} • {equippedPajamas.name}
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-500 group-hover:text-purple-300 transition flex-shrink-0 ml-1" />
          </button>

          {/* 2. Environment Button */}
          <button
            onClick={() => setShowEnvironmentModal(true)}
            className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-slate-900/80 hover:bg-slate-800/80 border border-teal-500/20 hover:border-teal-500/40 text-left transition shadow-lg flex items-center justify-between group active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <span className="text-xl sm:text-2xl p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-teal-500/20 border border-teal-400/30 group-hover:scale-105 transition flex-shrink-0">
                🌿
              </span>
              <div className="min-w-0">
                <h3 className="font-bold text-xs sm:text-sm text-white">Môi Trường & Âm Thanh</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                  Thời tiết: {weather} • Đèn: {lighting}
                </p>
              </div>
            </div>
            <Sliders size={16} className="text-slate-500 group-hover:text-teal-300 transition flex-shrink-0 ml-1" />
          </button>

          {/* 3. Primary Start Sleep Button */}
          <button
            onClick={() => setShowSessionModal(true)}
            className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2.5 sm:gap-3 transition transform active:scale-98 group"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/20 flex items-center justify-center text-lg sm:text-xl group-hover:rotate-12 transition flex-shrink-0">
              <Moon size={18} className="text-white sm:w-5 sm:h-5" />
            </div>
            <div className="text-left min-w-0">
              <div className="text-xs sm:text-sm font-extrabold text-white">BẮT ĐẦU NGỦ ONLINE</div>
              <div className="text-[10px] sm:text-[11px] text-purple-200/90 font-normal truncate">
                Chế độ thư giãn & tích lũy giấc mơ
              </div>
            </div>
          </button>
        </div>
      </main>

      {/* 3. Mobile Bottom Navigation Dock (Visible only on mobile screens) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-[#07080f]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 z-40 flex items-center justify-around text-[10px] text-slate-400 select-none shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center gap-0.5 py-1 px-1.5 text-purple-300 font-semibold active:scale-90 transition"
        >
          <span className="text-base">🛌</span>
          <span>Sân khấu</span>
        </button>

        <button
          onClick={() => setShowEquipmentModal(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-1.5 hover:text-white active:scale-90 transition"
        >
          <span className="text-base">🧰</span>
          <span>Trang bị</span>
        </button>

        <button
          onClick={() => setShowEnvironmentModal(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-1.5 hover:text-white active:scale-90 transition"
        >
          <span className="text-base">🌿</span>
          <span>Âm thanh</span>
        </button>

        <button
          onClick={() => setShowRouletteModal(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-1.5 hover:text-white active:scale-90 transition"
        >
          <span className="text-base">🎲</span>
          <span>Roulette</span>
        </button>

        <button
          onClick={() => setShowPassportModal(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-1.5 hover:text-white active:scale-90 transition"
        >
          <span className="text-base">🛂</span>
          <span>Hộ chiếu</span>
        </button>

        <button
          onClick={() => setShowRoomModal(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-1.5 hover:text-white active:scale-90 transition"
        >
          <span className="text-base">👥</span>
          <span>2AM Club</span>
        </button>

        <button
          onClick={() => setShowProfileModal(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-1.5 hover:text-white active:scale-90 transition"
        >
          <span className="text-base">{userProfile.avatarEmoji}</span>
          <span>Hồ sơ</span>
        </button>
      </nav>

      {/* 4. Bottom Footer (Desktop only) */}
      <footer className="hidden md:flex border-t border-white/5 py-4 px-6 text-center text-xs text-slate-500 items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <span>💤 Sleep Online v1.0</span>
          <span>•</span>
          <span className="text-slate-400">Tài khoản: {userProfile.name} (Lv.{userLevel})</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>5 Địa Điểm 2D</span>
          <span>•</span>
          <span>22 Trang Bị</span>
          <span>•</span>
          <span>Lưu Trữ LocalStorage</span>
        </div>
      </footer>

      {/* --- MODALS & OVERLAYS --- */}

      {/* User Profile & Sleep History Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={userProfile}
        onUpdateProfile={setUserProfile}
        userLevel={userLevel}
        totalExp={totalExp}
        history={sleepHistory}
        onResetData={handleResetData}
        totalLocationsUnlocked={stamps.length}
        totalLocationsCount={LOCATIONS.length}
      />

      {/* Equipment Drawer */}
      <EquipmentModal
        isOpen={showEquipmentModal}
        onClose={() => setShowEquipmentModal(false)}
        equippedBed={equippedBed}
        equippedPillow={equippedPillow}
        equippedBlanket={equippedBlanket}
        equippedPajamas={equippedPajamas}
        equippedCompanion={equippedCompanion}
        onSelectEquipment={handleSelectEquipment}
      />

      {/* Environment Drawer */}
      <EnvironmentModal
        isOpen={showEnvironmentModal}
        onClose={() => setShowEnvironmentModal(false)}
        weather={weather}
        onChangeWeather={setWeather}
        lighting={lighting}
        onChangeLighting={setLighting}
        soundVolumes={soundVolumes}
        onChangeVolume={handleChangeVolume}
      />

      {/* Sleep Session Setup */}
      <SleepSessionModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        onStartSleep={handleStartSleep}
        selectedMode={session.durationMode}
        onSelectMode={mode => setSession(prev => ({ ...prev, durationMode: mode }))}
        location={currentLocation}
        equippedBed={equippedBed}
        totalComfort={totalComfort}
      />

      {/* Active Sleeping Screen (Full Screen Dark OLED Overlay) */}
      {session.status === 'sleeping' && (
        <SleepingOverlay
          session={session}
          location={currentLocation}
          onWakeUp={handleWakeUp}
          onTogglePause={() =>
            setSession(prev => ({
              ...prev,
              status: prev.status === 'sleeping' ? 'paused' : 'sleeping'
            }))
          }
          soundVolumes={soundVolumes}
        />
      )}

      {/* Morning Report */}
      <MorningReportModal
        isOpen={showMorningReportModal}
        onClose={() => setShowMorningReportModal(false)}
        elapsedSeconds={session.elapsedSeconds}
        location={currentLocation}
        dreamCard={latestDreamCard}
        earnedExp={latestEarnedExp}
        currentLevel={userLevel}
        totalExp={totalExp}
        passportStamp={{
          locationId: currentLocation.id,
          unlockedAt: new Date().toISOString().split('T')[0],
          sleepMinutes: Math.max(1, Math.round(session.elapsedSeconds / 60))
        }}
        onOpenPassport={() => {
          setShowMorningReportModal(false);
          setShowPassportModal(true);
        }}
      />

      {/* Sleep Roulette */}
      <SleepRouletteModal
        isOpen={showRouletteModal}
        onClose={() => setShowRouletteModal(false)}
        onApplyRoulette={(loc, bed, pj, w, l, sounds) => {
          handleSelectLocation(loc);
          setEquippedBed(bed);
          setEquippedPajamas(pj);
          setWeather(w);
          setLighting(l);
          setSoundVolumes(sounds);
          if (isAudioActive) {
            audioEngine.updateVolumes(sounds);
          }
        }}
      />

      {/* Sleep Passport */}
      <SleepPassportModal
        isOpen={showPassportModal}
        onClose={() => setShowPassportModal(false)}
        stamps={stamps}
      />

      {/* 2AM Club Multiplayer Room */}
      <MultiplayerRoomModal
        isOpen={showRoomModal}
        onClose={() => setShowRoomModal(false)}
        userAvatar={userProfile.avatarEmoji}
        userName={userProfile.name}
      />
    </div>
  );
}
export default App;
