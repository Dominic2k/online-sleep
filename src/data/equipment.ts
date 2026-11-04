import { EquipmentItem } from '../types';

export const EQUIPMENT_ITEMS: EquipmentItem[] = [
  // --- BEDS (5) ---
  {
    id: 'bed-tatami',
    name: 'Đệm Chiếu Tatami',
    category: 'bed',
    comfort: 20,
    warmth: 15,
    serenity: 35,
    aesthetic: 25,
    icon: '🍵',
    description: 'Chiếu rơm thơm hương thảo mộc tự nhiên, nâng đỡ cột sống chuẩn phong cách Kyoto.',
    tag: 'Zen Minimalist'
  },
  {
    id: 'bed-cloud',
    name: 'Đệm Mây Bồng Bềnh',
    category: 'bed',
    comfort: 45,
    warmth: 30,
    serenity: 20,
    aesthetic: 30,
    icon: '☁️',
    description: 'Lớp mút memory foam đa tầng lún nhẹ như được thả mình giữa những đám mây ngũ sắc.',
    tag: 'Ultra Soft'
  },
  {
    id: 'bed-hammock',
    name: 'Võng Đan Thủ Công',
    category: 'bed',
    comfort: 25,
    warmth: 10,
    serenity: 30,
    aesthetic: 40,
    icon: '🌴',
    description: 'Sợi cotton dệt thoáng khí đu đưa nhịp nhàng theo từng cơn gió thoảng.',
    tag: 'Boho Chill'
  },
  {
    id: 'bed-cyberpod',
    name: 'Khoang Ngủ Capsule Zero-G',
    category: 'bed',
    comfort: 35,
    warmth: 20,
    serenity: 45,
    aesthetic: 35,
    icon: '🛸',
    description: 'Mô phỏng trạng thái không trọng lực, khử rung và cách ly âm thanh tuyệt đối.',
    tag: 'Sci-Fi Pod'
  },
  {
    id: 'bed-vintage-wood',
    name: 'Giường Gỗ Sồi Vintage',
    category: 'bed',
    comfort: 30,
    warmth: 40,
    serenity: 25,
    aesthetic: 30,
    icon: '🪵',
    description: 'Chất gỗ sồi mộc mạc thơm mùi tinh dầu tự nhiên, chắc chắn và mang lại cảm giác an tâm.',
    tag: 'Cozy Classic'
  },

  // --- PILLOWS (4) ---
  {
    id: 'pillow-cloud-feather',
    name: 'Gối Lông Vũ Khổng Lồ',
    category: 'pillow',
    comfort: 35,
    warmth: 20,
    serenity: 15,
    aesthetic: 20,
    icon: '🪶',
    description: 'Lông vũ trắng tinh khiết siêu mềm, ôm trọn phần đầu cho giấc ngủ sâu không mỏi cổ.',
    tag: 'Fluffy Dream'
  },
  {
    id: 'pillow-memory-foam',
    name: 'Gối Công Thái Học Ergonomic',
    category: 'pillow',
    comfort: 30,
    warmth: 15,
    serenity: 35,
    aesthetic: 10,
    icon: '💆',
    description: 'Thiết kế lượn sóng phân tán áp lực đốt sống cổ, thư giãn tuyệt đối cho cơ vai.',
    tag: 'Orthopedic'
  },
  {
    id: 'pillow-buckwheat',
    name: 'Gối Vỏ Kiều Mạch Tự Nhiên',
    category: 'pillow',
    comfort: 15,
    warmth: 10,
    serenity: 40,
    aesthetic: 25,
    icon: '🌾',
    description: 'Hạt kiều mạch thông thoáng khí, tạo âm thanh sột soạt êm dịu mỗi khi trở mình.',
    tag: 'Traditional'
  },
  {
    id: 'pillow-star',
    name: 'Gối Ngôi Sao Phát Sáng',
    category: 'pillow',
    comfort: 25,
    warmth: 25,
    serenity: 15,
    aesthetic: 45,
    icon: '⭐',
    description: 'Chất nhung phát quang dạ quang nhẹ, lấp lánh như nhặt được mảnh sao trời.',
    tag: 'Cute Aesthetic'
  },

  // --- BLANKETS (4) ---
  {
    id: 'blanket-wool',
    name: 'Chăn Len Dệt Tay Dày',
    category: 'blanket',
    comfort: 25,
    warmth: 45,
    serenity: 20,
    aesthetic: 30,
    icon: '🧶',
    description: 'Mũi đan len to bồng bềnh, giữ ấm tuyệt vời trong những đêm mưa lạnh giá.',
    tag: 'Warm & Heavy'
  },
  {
    id: 'blanket-weighted',
    name: 'Chăn Trọng Lực Deep Sleep',
    category: 'blanket',
    comfort: 20,
    warmth: 35,
    serenity: 50,
    aesthetic: 15,
    icon: '⚓',
    description: 'Trọng lượng 7kg phân bổ đều như một cái ôm siết chặt ấm áp, xua tan âu lo.',
    tag: 'Anxiety Reliever'
  },
  {
    id: 'blanket-silk',
    name: 'Chăn Lụa Tơ Tằm Mát Lạnh',
    category: 'blanket',
    comfort: 40,
    warmth: 15,
    serenity: 25,
    aesthetic: 35,
    icon: '🧣',
    description: 'Mặt lụa trơn mịn mát rượi chạm vào làn da, hoàn hảo cho những đêm hè oi ả.',
    tag: 'Silky Touch'
  },
  {
    id: 'blanket-patchwork',
    name: 'Chăn Ghép Vải Vintage Quilt',
    category: 'blanket',
    comfort: 20,
    warmth: 30,
    serenity: 20,
    aesthetic: 45,
    icon: '🌸',
    description: 'Từng mảnh vải hoa nhí mang ký ức tuổi thơ ấm êm nơi nhà bà ngoại.',
    tag: 'Nostalgic'
  },

  // --- PAJAMAS (4) ---
  {
    id: 'pj-stripes',
    name: 'Pijama Sọc Cổ Điển',
    category: 'pajamas',
    comfort: 25,
    warmth: 20,
    serenity: 20,
    aesthetic: 25,
    icon: '👔',
    description: 'Chất vải sợi cotton hữu cơ mềm mại, phom dáng rộng rãi phong cách quý ông thư thái.',
    tag: 'Timeless'
  },
  {
    id: 'pj-panda',
    name: 'Bộ Liền Thân Gấu Trúc (Onesie)',
    category: 'pajamas',
    comfort: 35,
    warmth: 45,
    serenity: 15,
    aesthetic: 45,
    icon: '🐼',
    description: 'Lông nhung mịn màng phủ kín từ đầu đến chân với đôi tai gấu panda siêu đáng yêu.',
    tag: 'Super Cute'
  },
  {
    id: 'pj-kimono',
    name: 'Yukata Hoa Anh Đào',
    category: 'pajamas',
    comfort: 30,
    warmth: 15,
    serenity: 35,
    aesthetic: 40,
    icon: '👘',
    description: 'Áo choàng yukata thoáng nhẹ, tự do cử động cho giấc ngủ bay bổng không gò bó.',
    tag: 'Zen Style'
  },
  {
    id: 'pj-astronaut',
    name: 'Bộ Đồ Ngủ Phi Hành Gia Mềm',
    category: 'pajamas',
    comfort: 20,
    warmth: 30,
    serenity: 30,
    aesthetic: 40,
    icon: '👨‍🚀',
    description: 'Họa tiết ngân hà kèm phù hiệu thêu NASA thu nhỏ, sẵn sàng du ngoạn hành tinh giấc mơ.',
    tag: 'Cosmic Vibe'
  },

  // --- COMPANION & ACCESSORIES (5) ---
  {
    id: 'pet-cat',
    name: 'Mèo Cam Ngủ Cuộn Tròn',
    category: 'companion',
    comfort: 35,
    warmth: 40,
    serenity: 30,
    aesthetic: 35,
    icon: '🐱',
    description: 'Chú mèo béo cuộn tròn dưới chân giường, phát ra tiếng rù rù (purring) chữa lành trái tim.',
    tag: 'Purring Therapy'
  },
  {
    id: 'pet-shiba',
    name: 'Cún Shiba Đắp Chăn',
    category: 'companion',
    comfort: 30,
    warmth: 35,
    serenity: 25,
    aesthetic: 40,
    icon: '🐕',
    description: 'Chú chó Shiba ngoan ngoãn gối đầu cạnh bạn, thỉnh thoảng thở dài thỏa mãn.',
    tag: 'Loyal Buddy'
  },
  {
    id: 'acc-teddy',
    name: 'Gấu Bông Tuổi Thơ Bạc Màu',
    category: 'companion',
    comfort: 25,
    warmth: 30,
    serenity: 30,
    aesthetic: 30,
    icon: '🧸',
    description: 'Người bạn trung thành từng đồng hành suốt những năm tháng ấu thơ vô lo vô nghĩ.',
    tag: 'Childhood Soul'
  },
  {
    id: 'acc-diffuser',
    name: 'Đèn Xông Tinh Dầu Oải Hương',
    category: 'companion',
    comfort: 20,
    warmth: 15,
    serenity: 50,
    aesthetic: 35,
    icon: '🪔',
    description: 'Làn khói thơm mùi hoa oải hương dịu nhẹ xoa dịu các noron thần kinh sau ngày mệt mỏi.',
    tag: 'Aromatherapy'
  },
  {
    id: 'acc-headphones',
    name: 'Tai Nghe Chống Ồn Ngủ Êm',
    category: 'companion',
    comfort: 15,
    warmth: 10,
    serenity: 55,
    aesthetic: 25,
    icon: '🎧',
    description: 'Khử sạch 99% tạp âm thế giới bên ngoài, chỉ giữ lại giai điệu bạn yêu thích.',
    tag: 'Soundproof'
  }
];

