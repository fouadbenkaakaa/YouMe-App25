export interface Game {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  color: string;
  maxPlayers: number;
  duration: string;
  aiGenerated?: boolean;
}

export interface Rank {
  name: string;
  nameEn: string;
  minPoints: number;
  color: string;
  bgColor: string;
  icon: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  condition: string;
}

export interface Tournament {
  id: string;
  title: string;
  gameId: string;
  organizer: string;
  organizerAvatar: string;
  maxParticipants: number;
  currentParticipants: number;
  status: "upcoming" | "live" | "finished";
  startTime: string;
  prize: string;
  entryCode?: string;
  participants: string[];
  bracket: BracketMatch[];
}

export interface BracketMatch {
  id: string;
  round: number;
  player1: string | null;
  player2: string | null;
  winner: string | null;
  status: "pending" | "live" | "finished";
}

export const games: Game[] = [
  {
    id: "trivia-ai",
    title: "تحدي المعرفة AI",
    category: "ذكاء",
    description: "أسئلة ذكية يولدها AI!",
    icon: "🧠",
    color: "#8B5CF6",
    maxPlayers: 100,
    duration: "3 دقائق",
    aiGenerated: true,
  },
  {
    id: "wordle-ar",
    title: "وردل عربي",
    category: "كلمات",
    description: "خمن الكلمة في 6 محاولات",
    icon: "🔤",
    color: "#10B981",
    maxPlayers: 50,
    duration: "5 دقائق",
  },
  {
    id: "ai-draw",
    title: "ارسم وخمن AI",
    category: "إبداع",
    description: "AI يرسم وانت تخمن!",
    icon: "🎨",
    color: "#EC4899",
    maxPlayers: 20,
    duration: "2 دقيقة",
    aiGenerated: true,
  },
  {
    id: "tiktok-challenge",
    title: "تحدي تيك توك",
    category: "ترند",
    description: "أكمل الترند المشهور!",
    icon: "🎵",
    color: "#000000",
    maxPlayers: 30,
    duration: "1 دقيقة",
  },
  {
    id: "speed-quiz",
    title: "سباق الإجابات",
    category: "سرعة",
    description: "من الأسرع في الإجابة؟",
    icon: "⚡",
    color: "#F59E0B",
    maxPlayers: 8,
    duration: "2 دقيقة",
  },
  {
    id: "ludo-fast",
    title: "لودو سريع",
    category: "كلاسيكي",
    description: "لودو بجولة واحدة!",
    icon: "🎲",
    color: "#EF4444",
    maxPlayers: 4,
    duration: "10 دقائق",
  },
];

export const ranks: Rank[] = [
  { name: "برونزي", nameEn: "Bronze", minPoints: 0, color: "#CD7F32", bgColor: "#FFF3E0", icon: "🥉" },
  { name: "فضي", nameEn: "Silver", minPoints: 1000, color: "#C0C0C0", bgColor: "#F5F5F5", icon: "🥈" },
  { name: "ذهبي", nameEn: "Gold", minPoints: 3000, color: "#FFD700", bgColor: "#FFFDE7", icon: "🥇" },
  { name: "بلاتيني", nameEn: "Platinum", minPoints: 6000, color: "#E5E4E2", bgColor: "#F3E5F5", icon: "💎" },
  { name: "ماسي", nameEn: "Diamond", minPoints: 10000, color: "#B9F2FF", bgColor: "#E0F7FA", icon: "💠" },
  { name: "تاج", nameEn: "Crown", minPoints: 15000, color: "#FF6B35", bgColor: "#FFF3E0", icon: "👑" },
  { name: "آس", nameEn: "Ace", minPoints: 22000, color: "#FF1744", bgColor: "#FFEBEE", icon: "🎯" },
  { name: "قاهر", nameEn: "Conqueror", minPoints: 30000, color: "#FFD700", bgColor: "#FFF8E1", icon: "🏆" },
];

export const badges: Badge[] = [
  { id: "first-win", name: "أول فوز", description: "فز في أول بطولة", icon: "🎉", color: "#8B5CF6", condition: "فوز واحد" },
  { id: "streak-3", name: "سلسلة انتصارات", description: "فز 3 بطولات متتالية", icon: "🔥", color: "#EF4444", condition: "3 فوز متتالي" },
  { id: "organizer", name: "منظم محترف", description: "نظم 5 بطولات", icon: "📋", color: "#10B981", condition: "5 بطولات منظمة" },
  { id: "popular", name: "نجم الجماهير", description: "انضم 50 لاعب لبطولاتك", icon: "⭐", color: "#F59E0B", condition: "50 مشارك" },
  { id: "ai-master", name: "سيد AI", description: "فز في 10 تحديات AI", icon: "🤖", color: "#EC4899", condition: "10 فوز AI" },
  { id: "speed-king", name: "ملك السرعة", description: "أجب في أقل من ثانية", icon: "⚡", color: "#3B82F6", condition: "إجابة < 1 ثانية" },
  { id: "legend", name: "أسطورة", description: "وصل للقب قاهر", icon: "👑", color: "#FFD700", condition: "الوصول لقب قاهر" },
  { id: "social", name: "نجم اجتماعي", description: "ادعُ 10 أصدقاء", icon: "👥", color: "#8B5CF6", condition: "10 دعوات" },
];

export const POINTS = {
  WIN_TOURNAMENT: 500,
  SECOND_PLACE: 300,
  THIRD_PLACE: 150,
  PARTICIPATE: 50,
  WIN_MATCH: 100,
  PERFECT_ANSWER: 50,
  FAST_ANSWER: 30,
  ORGANIZE_TOURNAMENT: 200,
};

export function generateEntryCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function generateRandomBracket(participants: string[]) {
  const shuffled = [...participants].sort(() => Math.random() - 0.5);
  const matches = [];
  let matchId = 1;

  for (let i = 0; i < shuffled.length; i += 2) {
    matches.push({
      id: `R1-M${matchId}`,
      round: 1,
      player1: shuffled[i] || null,
      player2: shuffled[i + 1] || null,
      winner: null,
      status: "pending",
    });
    matchId++;
  }

  return matches;
}

export function getRankByPoints(points: number): Rank {
  for (let i = ranks.length - 1; i >= 0; i--) {
    if (points >= ranks[i].minPoints) {
      return ranks[i];
    }
  }
  return ranks[0];
}
