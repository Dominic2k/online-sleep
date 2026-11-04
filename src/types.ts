export type LocationId = 'attic' | 'forest' | 'beach' | 'tatami' | 'space';

export interface LocationInfo {
  id: LocationId;
  name: string;
  nameVi: string;
  subtitle: string;
  description: string;
  themeColor: string;
  accentGlow: string;
  defaultWeather: WeatherType;
  defaultLighting: LightingType;
  defaultSounds: Partial<Record<SoundTrackId, number>>;
  specialEffectName: string;
}

export type EquipmentCategory = 'bed' | 'pillow' | 'blanket' | 'pajamas' | 'companion';

export interface EquipmentItem {
  id: string;
  name: string;
  category: EquipmentCategory;
  comfort: number;     // Tăng EXP
  warmth: number;      // Tăng cảm giác dễ chịu
  serenity: number;    // Giảm căng thẳng, tăng độ tĩnh
  aesthetic: number;   // Tăng tỉ lệ thẻ giấc mơ hiếm
  icon: string;
  description: string;
  tag: string;
}

export type WeatherType = 'rain' | 'snow' | 'stars' | 'thunder';
export type LightingType = 'amber' | 'moonlight' | 'candle' | 'neon' | 'pitch_black';

export type SoundTrackId = 'rain' | 'thunder' | 'waves' | 'campfire' | 'forest' | 'clock' | 'lofi' | 'whitenoise';

export interface SoundTrackDef {
  id: SoundTrackId;
  label: string;
  emoji: string;
  defaultVol: number;
  category: 'nature' | 'cozy' | 'ambient';
}

export type DurationMode = 'nap15' | 'nap30' | 'hour1' | 'hour4' | 'hour8' | 'endless';

export interface SleepSessionState {
  status: 'idle' | 'sleeping' | 'paused' | 'completed';
  durationMode: DurationMode;
  targetMinutes: number; // 0 for endless
  elapsedSeconds: number;
  startTime: number | null;
}

export interface DreamCard {
  id: string;
  title: string;
  story: string;
  emoji: string;
  rarity: 'Common' | 'Cozy Rare' | 'Cosmic Legendary';
  rarityColor: string;
}

export interface PassportStamp {
  locationId: LocationId;
  unlockedAt: string;
  sleepMinutes: number;
}

export interface RoomPeer {
  id: string;
  name: string;
  avatarEmoji: string;
  pajama: string;
  locationId: LocationId;
  statusText: string;
  minutesSleeping: number;
  likes: number;
}

