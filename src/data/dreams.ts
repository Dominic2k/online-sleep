import { DreamCard, RoomPeer } from '../types';

export const DREAM_CARDS: DreamCard[] = [
  {
    id: 'dream-1',
    title: 'Khinh Khí Cầu Mây Kẹo Bông',
    story: 'Bạn cùng một chú mèo cam đội mũ thuyền trưởng lướt khinh khí cầu bồng bềnh qua những tầng mây màu hồng pastel có vị ngọt dâu tây.',
    emoji: '🎈',
    rarity: 'Common',
    rarityColor: 'from-blue-500/20 to-sky-500/20 border-sky-400/40 text-sky-300'
  },
  {
    id: 'dream-2',
    title: 'Tiệm Trà Sữa Đom Đóm Giữa Rừng',
    story: 'Bạn tình cờ tìm thấy một quán trà nhỏ lấp lánh đom đóm dưới gốc cây đại thụ. Chủ quán là một chú rái cá phục vụ trà hoa cúc mật ong ấm bụng.',
    emoji: '🍵',
    rarity: 'Common',
    rarityColor: 'from-emerald-500/20 to-teal-500/20 border-teal-400/40 text-teal-300'
  },
  {
    id: 'dream-3',
    title: 'Chuyến Tàu Đêm Không Ga Đến',
    story: 'Con tàu hơi nước cổ điển chạy êm ru trên đường ray bằng ánh trăng qua mặt đại dương phẳng lặng. Ngoài cửa sổ, những chú cá voi phát quang bơi lượn trên trời sao.',
    emoji: '🚂',
    rarity: 'Cozy Rare',
    rarityColor: 'from-purple-500/20 to-indigo-500/20 border-purple-400/40 text-purple-300'
  },
  {
    id: 'dream-4',
    title: 'Hiệu Sách Cổ Mùi Gỗ Trầm',
    story: 'Một thư viện vô tận với những giá sách cao chạm trần nhà. Mỗi cuốn sách khi mở ra lại phát ra giai điệu dương cầm êm ái xoa dịu những âu lo thường nhật.',
    emoji: '📚',
    rarity: 'Cozy Rare',
    rarityColor: 'from-amber-500/20 to-yellow-500/20 border-amber-400/40 text-amber-300'
  },
  {
    id: 'dream-5',
    title: 'Vũ Điệu Cực Quang Tinh Vân',
    story: 'Bạn trôi nổi tự do giữa các vì sao lấp lánh như bụi kim cương. Trái Đất bên dưới tỏa sáng dịu dàng như một viên ngọc bích bình yên trong vòng tay vũ trụ.',
    emoji: '🌌',
    rarity: 'Cosmic Legendary',
    rarityColor: 'from-fuchsia-500/30 to-rose-500/30 border-fuchsia-400/60 text-fuchsia-300 shadow-[0_0_20px_rgba(217,70,239,0.25)]'
  },
  {
    id: 'dream-6',
    title: 'Cơn Mưa Mùa Thu Trên Mái Rơm',
    story: 'Bạn cuộn tròn trong chiếc chăn len dày cộp, lắng nghe từng giọt mưa mùa thu tí tách gõ ngoài cửa sổ. Mùi đất ẩm và mùi lá phong mang lại giấc ngủ ngọt ngào nhất.',
    emoji: '🍁',
    rarity: 'Common',
    rarityColor: 'from-orange-500/20 to-amber-500/20 border-orange-400/40 text-orange-300'
  }
];

export const MOCK_ROOM_PEERS: RoomPeer[] = [
  {
    id: 'peer-1',
    name: 'Mây Ngủ Say',
    avatarEmoji: '😴',
    pajama: 'Bộ Gấu Panda',
    locationId: 'attic',
    statusText: 'Đang mơ về tiệm bánh mì thơm phức...',
    minutesSleeping: 142,
    likes: 18
  },
  {
    id: 'peer-2',
    name: 'Đom Đóm Đêm',
    avatarEmoji: '✨',
    pajama: 'Yukata Hoa',
    locationId: 'forest',
    statusText: 'Lửa trại ấm quá, không muốn dậy luôn zZz',
    minutesSleeping: 215,
    likes: 34
  },
  {
    id: 'peer-3',
    name: 'Starlight Traveler',
    avatarEmoji: '🪐',
    pajama: 'Phi Hành Gia Mềm',
    locationId: 'space',
    statusText: 'Trôi bềnh bồng ngắm Trái Đất trôi chậm...',
    minutesSleeping: 88,
    likes: 27
  },
  {
    id: 'peer-4',
    name: 'Cá Voi Lặn Sâu',
    avatarEmoji: '🐋',
    pajama: 'Pijama Sọc',
    locationId: 'beach',
    statusText: 'Tiếng sóng vỗ rì rào mát rượi...',
    minutesSleeping: 310,
    likes: 52
  }
];

