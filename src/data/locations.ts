import { LocationInfo, SoundTrackDef } from '../types';

export const LOCATIONS: LocationInfo[] = [
  {
    id: 'attic',
    name: 'Cozy Attic',
    nameVi: 'Gác Mái Đêm Mưa',
    subtitle: 'Mưa gõ mái ngói, đèn vàng ấm áp và tách trà thảo mộc',
    description: 'Một căn gác xép gỗ ấm cúng trên cao với cửa sổ nghiêng nhìn ra thành phố mờ sương trong đêm mưa rả rích.',
    themeColor: 'from-amber-950/60 via-slate-900 to-indigo-950/70',
    accentGlow: '#f59e0b',
    defaultWeather: 'rain',
    defaultLighting: 'amber',
    defaultSounds: {
      rain: 70,
      clock: 25,
      lofi: 40,
    },
    specialEffectName: 'Vệt mưa chảy trên kính & Đèn dầu dịu nhẹ'
  },
  {
    id: 'forest',
    name: 'Deep Forest Tent',
    nameVi: 'Lều Giữa Rừng Thông',
    subtitle: 'Đống lửa trại tí tách, sương đêm và tiếng lá xào xạc',
    description: 'Một chiếc lều canvas mộc mạc dựng bên bờ suối trong lòng rừng thông tĩnh mịch, đom đóm dập dờn bay trong đêm hè.',
    themeColor: 'from-emerald-950/60 via-slate-900 to-teal-950/70',
    accentGlow: '#10b981',
    defaultWeather: 'stars',
    defaultLighting: 'candle',
    defaultSounds: {
      campfire: 65,
      forest: 55,
      whitenoise: 15,
    },
    specialEffectName: 'Đom đóm lập lòe & Tàn tro lửa bay'
  },
  {
    id: 'beach',
    name: 'Moonlit Beach Hammock',
    nameVi: 'Võng Biển Trăng Rằm',
    subtitle: 'Sóng vỗ bờ cát rì rào, gió đêm mát rượi và bầu trời ngàn sao',
    description: 'Một chiếc võng đan êm ái treo giữa hai rặng dừa nghiêng trên bờ cát trắng, ngắm ánh trăng tròn phản chiếu trên mặt đại dương êm đềm.',
    themeColor: 'from-cyan-950/60 via-slate-900 to-blue-950/70',
    accentGlow: '#38bdf8',
    defaultWeather: 'stars',
    defaultLighting: 'moonlight',
    defaultSounds: {
      waves: 75,
      forest: 20,
    },
    specialEffectName: 'Sóng biển dạt dào & Sao băng qua trời'
  },
  {
    id: 'tatami',
    name: 'Kyoto Tatami Haven',
    nameVi: 'Phòng Trà Kiểu Nhật',
    subtitle: 'Mùi cỏ tatami thoang thoảng, tiếng chuông gió và ống tre gõ nước',
    description: 'Căn phòng thiền truyền thống mở cửa nhìn ra vườn sỏi và cây phong lá đỏ, tiếng nước rơi gõ cộc định kỳ mang lại sự an yên tột cùng.',
    themeColor: 'from-orange-950/60 via-stone-900 to-amber-950/70',
    accentGlow: '#fb923c',
    defaultWeather: 'rain',
    defaultLighting: 'candle',
    defaultSounds: {
      rain: 35,
      clock: 15,
      lofi: 50,
    },
    specialEffectName: 'Ống tre gõ nước & Lá phong mùa thu khẽ rơi'
  },
  {
    id: 'space',
    name: 'Orbital Sleep Pod',
    nameVi: 'Trạm Không Gian Vô Tận',
    subtitle: 'Ngắm Trái Đất xanh trôi chậm, vũ trụ tĩnh lặng và ánh sao bao la',
    description: 'Một khoang ngủ capsule tương lai với cửa sổ kính vòm khổng lồ, nơi bạn trôi bềnh bồng nhìn ngắm hành tinh xanh giữa không gian bao la.',
    themeColor: 'from-purple-950/60 via-slate-950 to-indigo-950/80',
    accentGlow: '#c084fc',
    defaultWeather: 'stars',
    defaultLighting: 'neon',
    defaultSounds: {
      whitenoise: 50,
      lofi: 60,
    },
    specialEffectName: 'Trái Đất xoay chậm & Dải ngân hà cực quang'
  }
];

export const SOUND_TRACKS: SoundTrackDef[] = [
  { id: 'rain', label: 'Mưa rả rích', emoji: '🌧️', defaultVol: 60, category: 'nature' },
  { id: 'thunder', label: 'Sấm xa xa', emoji: '⛈️', defaultVol: 30, category: 'nature' },
  { id: 'waves', label: 'Sóng biển đêm', emoji: '🌊', defaultVol: 50, category: 'nature' },
  { id: 'campfire', label: 'Lửa trại tí tách', emoji: '🔥', defaultVol: 45, category: 'cozy' },
  { id: 'forest', label: 'Dế & Gió đêm', emoji: '🦗', defaultVol: 35, category: 'nature' },
  { id: 'clock', label: 'Đồng hồ tích tắc', emoji: '🕰️', defaultVol: 20, category: 'cozy' },
  { id: 'lofi', label: 'Lo-fi Chords', emoji: '🎹', defaultVol: 40, category: 'ambient' },
  { id: 'whitenoise', label: 'Tiếng ồn trắng / Gió êm', emoji: '💨', defaultVol: 25, category: 'ambient' },
];

