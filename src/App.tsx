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
  DreamCard
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
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export function App() {
  // 1. Core State
  const [currentLocation, setCurrentLocation] = useState<LocationInfo>(LOCATIONS[0]);

  // Equipment selection
  const [equippedBed, setEquippedBed] = useState<EquipmentItem>(
    EQUIPMENT_ITEMS.find(i => i.id === 'bed-vintage-wood')!
  );
  const [equippedPillow, setEquippedPillow] = useState<EquipmentItem>(
    EQUIPMENT_ITEMS.find(i => i.id === 'pillow-cloud-feather')!
  );
  const [equippedBlanket, setEquippedBlanket] = useState<EquipmentItem>(
    EQUIPMENT_ITEMS.find(i => i.id === 'blanket-wool')!
  );
  const [equippedPajamas, setEquippedPajamas] = useState<EquipmentItem>(
    EQUIPMENT_ITEMS.find(i => i.id === 'pj-stripes')!
  );
  const [equippedCompanion, setEquippedCompanion] = useState<EquipmentItem>(
    EQUIPMENT_ITEMS.find(i => i.id === 'pet-cat')!
  );

  // Environment
  const [weather, setWeather] = useState<WeatherType>(currentLocation.defaultWeather);
  const [lighting, setLighting] = useState<LightingType>(currentLocation.defaultLighting);
  const [soundVolumes, setSoundVolumes] = useState<Record<SoundTrackId, number>>({
    rain: 60,
    thunder: 0,
    waves: 0,
    campfire: 0,
    forest: 0,
    clock: 20,
    lofi: 40,
    whitenoise: 10
  });

  // Sound active status
  const [isAudioActive, setIsAudioActive] = useState(false);

  // User Progression
  const [userLevel, setUserLevel] = useState(1);
  const [totalExp, setTotalExp] = useState(120);
  const [stamps, setStamps] = useState<PassportStamp[]>([
    { locationId: 'attic', unlockedAt: '2026-11-04', sleepMinutes: 480 }
  ]);

  // Sleep Session
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
    setTotalExp(newTotalExp);
    setUserLevel(Math.floor(newTotalExp / 150) + 1);

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
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-purple-600/30 border border-purple-400/30">
            🌙
          </div>
          <div>
            <h1 className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-purple-200 via-white to-indigo-200 bg-clip-text text-transparent">
              Sleep Online
            </h1>
            <p className="text-[10px] text-purple-300 font-mono tracking-wider -mt-0.5">
              THE COZY SLUMBERVERSE
            </p>
          </div>
        </div>

        {/* Quick Nav Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Level Pill */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-2xl border border-white/10 text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-slate-400">Cấp {userLevel}</span>
            <span className="font-mono text-amber-300 font-bold">{totalExp} EXP</span>
          </div>

          {/* Quick Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2.5 rounded-2xl border transition flex items-center gap-1.5 text-xs font-semibold ${
              isAudioActive
                ? 'bg-purple-600/30 text-purple-200 border-purple-400/50 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'bg-slate-900/60 text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Bật/Tắt âm thanh môi trường Web Audio"
          >
            {isAudioActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="hidden md:inline">{isAudioActive ? 'Đang Phát' : 'Âm Thanh'}</span>
          </button>

          {/* Sleep Roulette */}
          <button
            onClick={() => setShowRouletteModal(true)}
            className="p-2.5 rounded-2xl bg-slate-900/60 hover:bg-fuchsia-950/40 text-slate-300 hover:text-fuchsia-300 border border-white/10 hover:border-fuchsia-500/30 transition flex items-center gap-1.5 text-xs font-semibold"
            title="Quay ngẫu nhiên Sleep Roulette"
          >
            <Dices size={16} className="text-fuchsia-400" />
            <span className="hidden md:inline">Roulette</span>
          </button>

          {/* Sleep Passport */}
          <button
            onClick={() => setShowPassportModal(true)}
            className="p-2.5 rounded-2xl bg-slate-900/60 hover:bg-amber-950/40 text-slate-300 hover:text-amber-300 border border-white/10 hover:border-amber-500/30 transition flex items-center gap-1.5 text-xs font-semibold"
            title="Xem Hộ Chiếu Giấc Ngủ"
          >
            <Compass size={16} className="text-amber-400" />
            <span className="hidden md:inline">Hộ Chiếu</span>
          </button>

          {/* 2AM Club Multiplayer Room */}
          <button
            onClick={() => setShowRoomModal(true)}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 hover:from-purple-900/60 hover:to-indigo-900/60 text-purple-200 border border-purple-500/30 transition flex items-center gap-1.5 text-xs font-semibold"
            title="Phòng ngủ online 2AM Club"
          >
            <Users size={16} className="text-indigo-400" />
            <span className="hidden sm:inline">2AM Club</span>
          </button>
        </div>
      </header>

      {/* 2. Main Body Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Location Picker Strip */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <span>📍</span> Chọn Địa Điểm Ngủ (5 Locations)
            </span>
            <span className="font-mono text-[11px] text-purple-300">
              Đang chọn: {currentLocation.nameVi}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* 1. Equipment Button */}
          <button
            onClick={() => setShowEquipmentModal(true)}
            className="p-4 rounded-3xl bg-slate-900/80 hover:bg-slate-800/80 border border-purple-500/20 hover:border-purple-500/40 text-left transition shadow-lg flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl p-2.5 rounded-2xl bg-purple-500/20 border border-purple-400/30 group-hover:scale-110 transition">
                🧰
              </span>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  Tủ Đồ Trang Bị
                  <span className="text-[10px] text-amber-300 font-mono">+{totalComfort} EXP</span>
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {equippedBed.name} • {equippedPajamas.name} • {equippedCompanion.name}
                </p>
              </div>
            </div>
            <ArrowRight size={18} className="text-slate-500 group-hover:text-purple-300 transition" />
          </button>

          {/* 2. Environment Button */}
          <button
            onClick={() => setShowEnvironmentModal(true)}
            className="p-4 rounded-3xl bg-slate-900/80 hover:bg-slate-800/80 border border-teal-500/20 hover:border-teal-500/40 text-left transition shadow-lg flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl p-2.5 rounded-2xl bg-teal-500/20 border border-teal-400/30 group-hover:scale-110 transition">
                🌿
              </span>
              <div>
                <h3 className="font-bold text-sm text-white">Môi Trường & Âm Thanh</h3>
                <p className="text-xs text-slate-400 line-clamp-1">
                  Thời tiết: {weather} • Đèn: {lighting} • Sound Mixer
                </p>
              </div>
            </div>
            <Sliders size={18} className="text-slate-500 group-hover:text-teal-300 transition" />
          </button>

          {/* 3. Primary Start Sleep Button */}
          <button
            onClick={() => setShowSessionModal(true)}
            className="p-4 rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-purple-600/30 flex items-center justify-center gap-3 transition transform active:scale-98 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl group-hover:rotate-12 transition">
              <Moon size={22} className="text-white" />
            </div>
            <div className="text-left">
              <div className="text-sm font-extrabold text-white">BẮT ĐẦU NGỦ ONLINE</div>
              <div className="text-[11px] text-purple-200/90 font-normal">
                Vào chế độ thư giãn & tích lũy giấc mơ
              </div>
            </div>
          </button>
        </div>
      </main>

      {/* 3. Bottom Footer */}
      <footer className="border-t border-white/5 py-4 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <span>💤 Sleep Online MVP v0.1</span>
          <span>•</span>
          <span className="text-slate-400">Cozy Slumber & Idle Sleep Simulator</span>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center gap-4 text-[11px] text-slate-400">
          <span>5 Địa Điểm 2D</span>
          <span>•</span>
          <span>22 Trang Bị</span>
          <span>•</span>
          <span>Web Audio Engine</span>
        </div>
      </footer>

      {/* --- MODALS & OVERLAYS --- */}

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
        userAvatar={equippedPajamas.icon}
        userName="Bạn (Người Du Hành Đêm)"
      />
    </div>
  );
}
export default App;

