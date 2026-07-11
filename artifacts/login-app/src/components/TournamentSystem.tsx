import { useState, useEffect } from "react";
import {
  Trophy, Users, Clock, Copy, Check, Shuffle,
  Crown, Swords, ChevronRight, Sparkles, Zap,
  Medal, Star, Flame, Target, TrendingUp, Search,
  X, ChevronLeft
} from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  games, ranks, badges, POINTS,
  generateEntryCode, generateRandomBracket,
  getRankByPoints,
} from "../data/gamesData";

export default function TournamentSystem() {
  const { user, addPoints, addBadge, updateRank } = useApp();
  const [activeTab, setActiveTab] = useState("browse");
  const [tournaments, setTournaments] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [tournamentTitle, setTournamentTitle] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(8);
  const [copiedCode, setCopiedCode] = useState(null);
  const [joinCode, setJoinCode] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);

  const currentUser = {
    name: user?.name || "زائر",
    avatar: user?.avatar || "👤",
    points: user?.points || 0,
    badges: user?.badges || [],
  };

  const userRank = getRankByPoints(currentUser.points);

  useEffect(() => {
    const demo = [
      {
        id: "t1",
        title: "بطولة تحدي المعرفة",
        gameId: "trivia-ai",
        organizer: "أحمد",
        organizerAvatar: "👤",
        maxParticipants: 16,
        currentParticipants: 12,
        status: "upcoming",
        startTime: "2026-07-05T15:00:00",
        prize: "🏆 لقب ذهبي + 500 نقطة",
        entryCode: "X7K9P2",
        participants: ["أحمد", "محمد", "سارة", "نورة", "خالد", "فهد", "ليلى", "عمر", "ريم", "يوسف", "نوف", "سعد"],
        bracket: [],
      },
      {
        id: "t2",
        title: "سباق وردل",
        gameId: "wordle-ar",
        organizer: "سارة",
        organizerAvatar: "👩",
        maxParticipants: 8,
        currentParticipants: 8,
        status: "live",
        startTime: "2026-07-05T10:30:00",
        prize: "💎 لقب بلاتيني + 300 نقطة",
        entryCode: "WORD99",
        participants: ["سارة", "نورة", "فاطمة", "ليلى", "ريم", "نوف", "هند", "دانة"],
        bracket: [],
      },
    ];
    setTournaments(demo);
  }, []);

  const createTournament = () => {
    if (!selectedGame || !tournamentTitle) return;
    const code = generateEntryCode();
    const newTournament = {
      id: `t${Date.now()}`,
      title: tournamentTitle,
      gameId: selectedGame.id,
      organizer: currentUser.name,
      organizerAvatar: currentUser.avatar,
      maxParticipants,
      currentParticipants: 1,
      status: "upcoming",
      startTime: new Date(Date.now() + 3600000).toISOString(),
      prize: `🏆 لقب ${userRank.name} + ${POINTS.WIN_TOURNAMENT} نقطة`,
      entryCode: code,
      participants: [currentUser.name],
      bracket: [],
    };
    setTournaments([newTournament, ...tournaments]);
    addPoints(POINTS.ORGANIZE_TOURNAMENT);
    setSelectedGame(null);
    setTournamentTitle("");
    setActiveTab("my");
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const joinTournament = (tournamentId) => {
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId && t.currentParticipants < t.maxParticipants) {
        return {
          ...t,
          currentParticipants: t.currentParticipants + 1,
          participants: [...t.participants, currentUser.name],
        };
      }
      return t;
    }));
    addPoints(POINTS.PARTICIPATE);
    setShowJoinModal(false);
    setJoinCode("");
  };

  const startTournament = (tournamentId) => {
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        const bracket = generateRandomBracket(t.participants);
        return { ...t, status: "live", bracket };
      }
      return t;
    }));
  };

  const declareWinner = (tournamentId, winnerName) => {
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) return { ...t, status: "finished" };
      return t;
    }));
    if (winnerName === currentUser.name) {
      addPoints(POINTS.WIN_TOURNAMENT);
      if (!currentUser.badges.includes("first-win")) {
        addBadge("first-win");
      }
      const newRank = getRankByPoints(currentUser.points + POINTS.WIN_TOURNAMENT);
      if (newRank.name !== userRank.name) updateRank(newRank.name);
    }
  };

  const renderBrowse = () => (
    <div>
      <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
        <Flame size={18} color="#EF4444" />
        🔴 بطولات حية الآن
      </h3>
      {tournaments.filter(t => t.status === "live").map(t => (
        <TournamentCard key={t.id} tournament={t} onJoin={() => setShowJoinModal(true)} />
      ))}

      <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "12px", marginTop: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
        <Clock size={18} color="#8B5CF6" />
        ⏰ قادمة قريباً
      </h3>
      {tournaments.filter(t => t.status === "upcoming").map(t => (
        <TournamentCard key={t.id} tournament={t} onJoin={() => setShowJoinModal(true)} />
      ))}
    </div>
  );

  const renderCreate = () => (
    <div>
      <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "16px" }}>
        <Sparkles size={20} color="#8B5CF6" style={{ marginLeft: "8px" }} />
        أنشئ بطولة جديدة
      </h3>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontSize: "14px", fontWeight: "600", color: "#6B7280", marginBottom: "10px", display: "block" }}>
          اختر اللعبة:
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
          {games.map(game => (
            <button
              key={game.id}
              onClick={() => setSelectedGame(game)}
              style={{
                padding: "14px",
                borderRadius: "16px",
                border: selectedGame?.id === game.id ? "2px solid #8B5CF6" : "2px solid transparent",
                background: selectedGame?.id === game.id ? "#EDE9FE" : "#fff",
                cursor: "pointer",
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "6px" }}>{game.icon}</div>
              <div style={{ fontSize: "13px", fontWeight: "700" }}>{game.title}</div>
              <div style={{ fontSize: "11px", color: "#9CA3AF" }}>{game.duration}</div>
            </button>
          ))}
        </div>
      </div>

      {selectedGame && (
        <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#6B7280", marginBottom: "8px", display: "block" }}>
              اسم البطولة:
            </label>
            <input
              type="text"
              value={tournamentTitle}
              onChange={e => setTournamentTitle(e.target.value)}
              placeholder="مثال: بطولة الجمعة الكبرى"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "2px solid #E5E7EB",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#6B7280", marginBottom: "8px", display: "block" }}>
              عدد المشاركين: {maxParticipants}
            </label>
            <input
              type="range"
              min="4"
              max="64"
              step="4"
              value={maxParticipants}
              onChange={e => setMaxParticipants(Number(e.target.value))}
              style={{ width: "100%" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#9CA3AF" }}>
              <span>4</span><span>16</span><span>32</span><span>64</span>
            </div>
          </div>

          <div style={{ background: "#F3F4F6", borderRadius: "12px", padding: "12px", marginBottom: "16px", fontSize: "13px" }}>
            <div style={{ fontWeight: "700", marginBottom: "6px" }}>
              <Target size={16} style={{ marginLeft: "6px", verticalAlign: "middle" }} />
              الجائزة:
            </div>
            <div style={{ color: "#6B7280" }}>🏆 لقب {userRank.name} + {POINTS.WIN_TOURNAMENT} نقطة</div>
            <div style={{ color: "#6B7280", marginTop: "4px" }}>🎖️ شارة المنظم + {POINTS.ORGANIZE_TOURNAMENT} نقطة</div>
          </div>

          <button
            onClick={createTournament}
            disabled={!tournamentTitle}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              background: tournamentTitle ? "linear-gradient(135deg, #8B5CF6, #A78BFA)" : "#D1D5DB",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "700",
              cursor: tournamentTitle ? "pointer" : "not-allowed",
            }}
          >
            <Sparkles size={18} style={{ marginLeft: "8px", verticalAlign: "middle" }} />
            إنشاء البطولة
          </button>
        </div>
      )}
    </div>
  );

  const renderMyTournaments = () => (
    <div>
      <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "16px" }}>
        <Medal size={20} color="#8B5CF6" style={{ marginLeft: "8px" }} />
        بطولاتي
      </h3>
      {tournaments.filter(t => t.organizer === currentUser.name || t.participants.includes(currentUser.name)).map(t => (
        <div key={t.id} style={{ background: "#fff", borderRadius: "16px", padding: "16px", marginBottom: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
            <div>
              <div style={{ fontSize: "15px", fontWeight: "700" }}>{t.title}</div>
              <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>
                {games.find(g => g.id === t.gameId)?.title}
              </div>
            </div>
            <span style={{
              padding: "4px 10px",
              borderRadius: "8px",
              fontSize: "11px",
              fontWeight: "700",
              background: t.status === "live" ? "#FEE2E2" : t.status === "upcoming" ? "#EDE9FE" : "#F3F4F6",
              color: t.status === "live" ? "#EF4444" : t.status === "upcoming" ? "#8B5CF6" : "#6B7280",
            }}>
              {t.status === "live" ? "🔴 حية" : t.status === "upcoming" ? "⏰ قادمة" : "✅ منتهية"}
            </span>
          </div>

          {t.entryCode && (
            <div style={{ background: "#F3F4F6", borderRadius: "10px", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div>
                <div style={{ fontSize: "11px", color: "#9CA3AF" }}>كود الدخول:</div>
                <div style={{ fontSize: "18px", fontWeight: "800", fontFamily: "monospace", color: "#8B5CF6", letterSpacing: "2px" }}>
                  {t.entryCode}
                </div>
              </div>
              <button
                onClick={() => copyCode(t.entryCode)}
                style={{
                  background: copiedCode === t.entryCode ? "#10B981" : "#8B5CF6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                }}
              >
                {copiedCode === t.entryCode ? <Check size={14} /> : <Copy size={14} />}
                {copiedCode === t.entryCode ? "تم!" : "نسخ"}
              </button>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <Users size={14} color="#9CA3AF" />
            <span style={{ fontSize: "13px", color: "#6B7280" }}>
              {t.currentParticipants} / {t.maxParticipants} مشارك
            </span>
            <div style={{ flex: 1, height: "6px", background: "#E5E7EB", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{
                width: `${(t.currentParticipants / t.maxParticipants) * 100}%`,
                height: "100%",
                background: "linear-gradient(90deg, #8B5CF6, #A78BFA)",
                borderRadius: "3px",
              }} />
            </div>
          </div>

          {t.organizer === currentUser.name && t.status === "upcoming" && (
            <button
              onClick={() => startTournament(t.id)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #10B981, #34D399)",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <Shuffle size={16} />
              بدء البطولة (تنظيم عشوائي)
            </button>
          )}

          {t.status === "live" && t.organizer === currentUser.name && (
            <button
              onClick={() => declareWinner(t.id, currentUser.name)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #F59E0B, #FBBF24)",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                marginTop: "8px",
              }}
            >
              <Trophy size={16} />
              إعلان الفائز
            </button>
          )}
        </div>
      ))}
    </div>
  );

  const renderLeaderboard = () => (
    <div>
      <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "16px" }}>
        <TrendingUp size={20} color="#8B5CF6" style={{ marginLeft: "8px" }} />
        لوحة المتصدرين
      </h3>

      <div style={{
        background: `linear-gradient(135deg, ${userRank.color}20, ${userRank.color}40)`,
        border: `2px solid ${userRank.color}`,
        borderRadius: "20px",
        padding: "20px",
        marginBottom: "20px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "8px" }}>{userRank.icon}</div>
        <div style={{ fontSize: "20px", fontWeight: "800", color: userRank.color }}>{userRank.name}</div>
        <div style={{ fontSize: "14px", color: "#6B7280", marginTop: "4px" }}>{currentUser.points} نقطة</div>
        <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "8px" }}>
          {ranks.findIndex(r => r.name === userRank.name) < ranks.length - 1
            ? `${ranks[ranks.findIndex(r => r.name === userRank.name) + 1]?.minPoints - currentUser.points} نقطة للقب القادم`
            : "أنت في القمة! 🏆"}
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "10px", color: "#6B7280" }}>مسار التقدم</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {ranks.map((rank) => {
            const isCurrent = rank.name === userRank.name;
            const isUnlocked = currentUser.points >= rank.minPoints;
            return (
              <div key={rank.name} style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "12px",
                background: isCurrent ? rank.bgColor : isUnlocked ? "#F9FAFB" : "#F3F4F6",
                opacity: isUnlocked ? 1 : 0.5,
                border: isCurrent ? `2px solid ${rank.color}` : "2px solid transparent",
              }}>
                <span style={{ fontSize: "24px" }}>{rank.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: isCurrent ? rank.color : isUnlocked ? "#1F2937" : "#9CA3AF" }}>
                    {rank.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#9CA3AF" }}>{rank.minPoints} نقطة</div>
                </div>
                {isCurrent && <Crown size={18} color={rank.color} />}
                {isUnlocked && !isCurrent && <Check size={16} color="#10B981" />}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "10px", color: "#6B7280" }}>الشارات</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
          {badges.map(badge => {
            const hasBadge = currentUser.badges.includes(badge.id);
            return (
              <div key={badge.id} style={{
                padding: "12px",
                borderRadius: "12px",
                background: hasBadge ? `${badge.color}15` : "#F3F4F6",
                border: hasBadge ? `1px solid ${badge.color}30` : "1px solid transparent",
                opacity: hasBadge ? 1 : 0.5,
              }}>
                <div style={{ fontSize: "24px", marginBottom: "4px" }}>{badge.icon}</div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: hasBadge ? badge.color : "#9CA3AF" }}>
                  {badge.name}
                </div>
                <div style={{ fontSize: "10px", color: "#9CA3AF", marginTop: "2px" }}>{badge.condition}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  function TournamentCard({ tournament, onJoin }) {
    const game = games.find(g => g.id === tournament.gameId);
    return (
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "16px",
        marginBottom: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        cursor: "pointer",
      }}
      onClick={onJoin}
      >
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: `linear-gradient(135deg, ${game?.color}20, ${game?.color}40)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            flexShrink: 0,
          }}>
            {game?.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "15px", fontWeight: "700" }}>{tournament.title}</div>
            <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>
              بواسطة {tournament.organizer} • {game?.title}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
              <span style={{ fontSize: "12px", color: "#6B7280", display: "flex", alignItems: "center", gap: "4px" }}>
                <Users size={12} />
                {tournament.currentParticipants}/{tournament.maxParticipants}
              </span>
              <span style={{ fontSize: "12px", color: "#6B7280", display: "flex", alignItems: "center", gap: "4px" }}>
                <Clock size={12} />
                {new Date(tournament.startTime).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "#8B5CF6", marginTop: "6px", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
              <Trophy size={12} />
              {tournament.prize}
            </div>
          </div>
          <ChevronRight size={20} color="#9CA3AF" />
        </div>
      </div>
    );
  }

  if (showJoinModal) {
    return (
      <div style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}>
        <div style={{ background: "#fff", borderRadius: "24px", padding: "24px", width: "100%", maxWidth: "400px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "16px", textAlign: "center" }}>
            <Swords size={24} color="#8B5CF6" style={{ marginLeft: "8px", verticalAlign: "middle" }} />
            انضم للبطولة
          </h3>
          <input
            type="text"
            value={joinCode}
            onChange={e => setJoinCode(e.target.value.toUpperCase())}
            placeholder="XXXXXX"
            maxLength={6}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "2px solid #E5E7EB",
              fontSize: "20px",
              fontWeight: "800",
              textAlign: "center",
              letterSpacing: "8px",
              fontFamily: "monospace",
              outline: "none",
              marginBottom: "16px",
            }}
          />
          <button
            onClick={() => {
              const tournament = tournaments.find(t => t.entryCode === joinCode);
              if (tournament) joinTournament(tournament.id);
            }}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              background: joinCode.length === 6 ? "linear-gradient(135deg, #8B5CF6, #A78BFA)" : "#D1D5DB",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "700",
              cursor: joinCode.length === 6 ? "pointer" : "not-allowed",
            }}
          >
            <Zap size={18} style={{ marginLeft: "8px", verticalAlign: "middle" }} />
            انضم الآن
          </button>
          <button
            onClick={() => setShowJoinModal(false)}
            style={{ width: "100%", padding: "12px", marginTop: "8px", borderRadius: "12px", border: "none", background: "none", color: "#9CA3AF", fontSize: "14px", cursor: "pointer" }}
          >
            إلغاء
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px", maxWidth: "480px", margin: "0 auto", minHeight: "100vh", background: "#F8F7FC" }}>
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #8B5CF6, #A78BFA)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Trophy size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#1F2937" }}>البطولات</h1>
            <p style={{ fontSize: "13px", color: "#9CA3AF" }}>نافس، اربح، ارتقي!</p>
          </div>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "#fff",
          borderRadius: "14px",
          padding: "12px 16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          marginBottom: "16px",
        }}>
          <span style={{ fontSize: "28px" }}>{userRank.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "14px", fontWeight: "700", color: userRank.color }}>{userRank.name}</div>
            <div style={{ fontSize: "12px", color: "#9CA3AF" }}>{currentUser.points} نقطة</div>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "11px", color: "#9CA3AF" }}>القادم</div>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#6B7280" }}>
              {ranks[ranks.findIndex(r => r.name === userRank.name) + 1]?.name || "🏆"}
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display: "flex",
        gap: "8px",
        marginBottom: "20px",
        overflowX: "auto",
        paddingBottom: "4px",
      }}>
        {[
          { id: "browse", label: "استكشف", icon: Search },
          { id: "create", label: "أنشئ", icon: Sparkles },
          { id: "my", label: "بطولاتي", icon: Medal },
          { id: "leaderboard", label: "المتصدرين", icon: TrendingUp },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 16px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: activeTab === tab.id ? "linear-gradient(135deg, #8B5CF6, #A78BFA)" : "#fff",
              color: activeTab === tab.id ? "#fff" : "#6B7280",
              boxShadow: activeTab === tab.id ? "0 4px 12px rgba(139,92,246,0.3)" : "0 2px 6px rgba(0,0,0,0.06)",
            }}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "browse" && renderBrowse()}
      {activeTab === "create" && renderCreate()}
      {activeTab === "my" && renderMyTournaments()}
      {activeTab === "leaderboard" && renderLeaderboard()}
    </div>
  );
}
