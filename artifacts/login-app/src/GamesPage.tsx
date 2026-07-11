import { useState, useEffect, useCallback } from "react";
import {
  Gamepad2, Trophy, Search, Heart, Star,
  Flame, Clock, Users, Sparkles, ChevronRight,
  RotateCcw, ArrowLeft, Zap, Target
} from "lucide-react";
import TournamentSystem from "../components/TournamentSystem";
import { games } from "../data/gamesData";

// ====== لعبة 1: تيك تاك تو ======
function TicTacToeGame({ onBack }: { onBack: () => void }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const [a,b,c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (winner || board[i]) return;
    const newBoard = [...board];
    newBoard[i] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
    const w = calculateWinner(newBoard);
    if (w) setWinner(w);
  };

  const reset = () => { setBoard(Array(9).fill(null)); setWinner(null); setXIsNext(true); };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <ArrowLeft size={24} color="#8B5CF6" />
        </button>
        <h2 style={{ fontSize: "20px", fontWeight: "800" }}>⭕ تيك تاك تو</h2>
      </div>

      {winner && (
        <div style={{ textAlign: "center", padding: "20px", background: "#EDE9FE", borderRadius: "16px", marginBottom: "20px" }}>
          <div style={{ fontSize: "48px" }}>🎉</div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#8B5CF6" }}>
            {winner === "X" ? "أنت فزت!" : "الكمبيوتر فاز!"}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "20px" }}>
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            style={{
              aspectRatio: "1",
              fontSize: "32px",
              fontWeight: "800",
              border: "2px solid #E5E7EB",
              borderRadius: "12px",
              background: cell ? (cell === "X" ? "#EDE9FE" : "#FEE2E2") : "#fff",
              color: cell === "X" ? "#8B5CF6" : "#EF4444",
              cursor: cell ? "not-allowed" : "pointer",
            }}
          >
            {cell}
          </button>
        ))}
      </div>

      <button onClick={reset} style={{
        width: "100%", padding: "14px", borderRadius: "12px", border: "none",
        background: "linear-gradient(135deg, #8B5CF6, #A78BFA)", color: "#fff",
        fontSize: "16px", fontWeight: "700", cursor: "pointer", display: "flex",
        alignItems: "center", justifyContent: "center", gap: "8px"
      }}>
        <RotateCcw size={18} /> لعب مرة ثانية
      </button>
    </div>
  );
}

// ====== لعبة 2: حجر ورقة مقص ======
function RockPaperScissors({ onBack }: { onBack: () => void }) {
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [computerChoice, setComputerChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState({ player: 0, computer: 0 });

  const choices = [
    { id: "rock", icon: "✊", name: "حجر" },
    { id: "paper", icon: "✋", name: "ورقة" },
    { id: "scissors", icon: "✌️", name: "مقص" },
  ];

  const play = (choice: string) => {
    const comp = choices[Math.floor(Math.random() * 3)].id;
    setPlayerChoice(choice);
    setComputerChoice(comp);

    if (choice === comp) setResult("تعادل!");
    else if (
      (choice === "rock" && comp === "scissors") ||
      (choice === "paper" && comp === "rock") ||
      (choice === "scissors" && comp === "paper")
    ) {
      setResult("فزت! 🎉");
      setScore(s => ({ ...s, player: s.player + 1 }));
    } else {
      setResult("خسرت! 😢");
      setScore(s => ({ ...s, computer: s.computer + 1 }));
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <ArrowLeft size={24} color="#8B5CF6" />
        </button>
        <h2 style={{ fontSize: "20px", fontWeight: "800" }}>✊ حجر ورقة مقص</h2>
      </div>

      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "30px", background: "#fff", padding: "20px", borderRadius: "16px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px" }}>👤</div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#8B5CF6" }}>{score.player}</div>
        </div>
        <div style={{ fontSize: "24px", fontWeight: "800", display: "flex", alignItems: "center" }}>VS</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px" }}>🤖</div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#EF4444" }}>{score.computer}</div>
        </div>
      </div>

      {result && (
        <div style={{ textAlign: "center", padding: "20px", background: result.includes("فزت") ? "#EDE9FE" : result.includes("خسرت") ? "#FEE2E2" : "#F3F4F6", borderRadius: "16px", marginBottom: "20px" }}>
          <div style={{ fontSize: "48px" }}>
            {playerChoice && choices.find(c => c.id === playerChoice)?.icon}
            {" vs "}
            {computerChoice && choices.find(c => c.id === computerChoice)?.icon}
          </div>
          <div style={{ fontSize: "20px", fontWeight: "800", marginTop: "10px" }}>{result}</div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
        {choices.map(c => (
          <button
            key={c.id}
            onClick={() => play(c.id)}
            style={{
              padding: "20px", borderRadius: "16px", border: "2px solid #E5E7EB",
              background: "#fff", cursor: "pointer", fontSize: "40px",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            {c.icon}
            <div style={{ fontSize: "12px", marginTop: "8px", fontWeight: "600" }}>{c.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ====== لعبة 3: لعبة الذاكرة ======
function MemoryGame({ onBack }: { onBack: () => void }) {
  const emojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
    setCards(shuffled);
  }, []);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    setCards(newCards);
    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      const firstCard = newCards.find(c => c.id === first);
      const secondCard = newCards.find(c => c.id === second);

      if (firstCard?.emoji === secondCard?.emoji) {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second ? { ...c, matched: true } : c
          ));
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second ? { ...c, flipped: false } : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const reset = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
  };

  const allMatched = cards.length > 0 && cards.every(c => c.matched);

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <ArrowLeft size={24} color="#8B5CF6" />
        </button>
        <h2 style={{ fontSize: "20px", fontWeight: "800" }}>🧠 لعبة الذاكرة</h2>
        <div style={{ marginLeft: "auto", fontSize: "14px", color: "#6B7280" }}>الحركات: {moves}</div>
      </div>

      {allMatched && (
        <div style={{ textAlign: "center", padding: "20px", background: "#EDE9FE", borderRadius: "16px", marginBottom: "20px" }}>
          <div style={{ fontSize: "48px" }}>🎉</div>
          <div style={{ fontSize: "20px", fontWeight: "800", color: "#8B5CF6" }}>
            فزت في {moves} حركة!
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "20px" }}>
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            style={{
              aspectRatio: "1",
              fontSize: "28px",
              border: "2px solid #E5E7EB",
              borderRadius: "12px",
              background: card.flipped || card.matched ? "#EDE9FE" : "#8B5CF6",
              color: card.flipped || card.matched ? "#1F2937" : "#fff",
              cursor: card.flipped || card.matched ? "default" : "pointer",
              transition: "all 0.3s",
              transform: card.flipped || card.matched ? "rotateY(0deg)" : "rotateY(180deg)",
            }}
          >
            {card.flipped || card.matched ? card.emoji : "?"}
          </button>
        ))}
      </div>

      <button onClick={reset} style={{
        width: "100%", padding: "14px", borderRadius: "12px", border: "none",
        background: "linear-gradient(135deg, #8B5CF6, #A78BFA)", color: "#fff",
        fontSize: "16px", fontWeight: "700", cursor: "pointer", display: "flex",
        alignItems: "center", justifyContent: "center", gap: "8px"
      }}>
        <RotateCcw size={18} /> لعب مرة ثانية
      </button>
    </div>
  );
}

// ====== الصفحة الرئيسية ======
export default function GamesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showTournaments, setShowTournaments] = useState(false);
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const toggleFavorite = (gameId: string) => {
    setFavorites(prev =>
      prev.includes(gameId) ? prev.filter(id => id !== gameId) : [...prev, gameId]
    );
  };

  const filteredGames = games.filter(g =>
    g.title.includes(searchQuery) || g.category.includes(searchQuery)
  );

  // ====== وضع اللعب ======
  if (activeGame === "trivia-ai") {
    return <TicTacToeGame onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === "wordle-ar") {
    return <RockPaperScissors onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === "ai-draw") {
    return <MemoryGame onBack={() => setActiveGame(null)} />;
  }

  // ====== وضع البطولات ======
  if (showTournaments) {
    return (
      <div>
        <button
          onClick={() => setShowTournaments(false)}
          style={{
            margin: "16px",
            padding: "10px 16px",
            borderRadius: "10px",
            border: "none",
            background: "#F3F4F6",
            color: "#6B7280",
            cursor: "pointer",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <ArrowLeft size={16} />
          رجوع للألعاب
        </button>
        <TournamentSystem />
      </div>
    );
  }

  // ====== وضع المتصفح ======
  return (
    <div style={{ padding: "16px", maxWidth: "480px", margin: "0 auto", minHeight: "100vh", background: "#F8F7FC" }}>

      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "800", display: "flex", alignItems: "center", gap: "10px", color: "#1F2937" }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "14px",
              background: "linear-gradient(135deg, #8B5CF6, #A78BFA)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Gamepad2 size={24} color="#fff" />
            </div>
            ألعاب YouMe
          </h1>
          <button
            onClick={() => setShowTournaments(true)}
            style={{
              padding: "10px 16px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #F59E0B, #FBBF24)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
            }}
          >
            <Trophy size={16} />
            البطولات
          </button>
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          background: "#fff", borderRadius: "16px", padding: "12px 16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
        }}>
          <Search size={18} color="#9CA3AF" />
          <input
            type="text"
            placeholder="ابحث عن لعبة..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ border: "none", outline: "none", background: "none", fontSize: "14px", width: "100%", color: "#1F2937" }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "20px" }}>
        {[
          { icon: Flame, label: "الأكثر لعبا", value: "5M", color: "#EF4444", bg: "#FEE2E2" },
          { icon: Users, label: "لاعبين", value: "14M", color: "#8B5CF6", bg: "#EDE9FE" },
          { icon: Trophy, label: "بطولات", value: "1.2K", color: "#F59E0B", bg: "#FEF3C7" },
        ].map((stat, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: "16px", padding: "14px 10px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
              <stat.icon size={18} color={stat.color} />
            </div>
            <div style={{ fontSize: "16px", fontWeight: "800", color: "#1F2937" }}>{stat.value}</div>
            <div style={{ fontSize: "11px", color: "#9CA3AF" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: "16px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkles size={18} color="#8B5CF6" />
          اختر لعبتك
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
          {filteredGames.map(game => (
            <div key={game.id} style={{
              background: "#fff", borderRadius: "20px", overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              cursor: "pointer", position: "relative",
              transition: "all 0.3s",
            }}
            onClick={() => {
              if (game.id === "trivia-ai" || game.id === "wordle-ar" || game.id === "ai-draw") {
                setActiveGame(game.id);
              }
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; }}
            >
              <div style={{ height: "120px", background: `linear-gradient(135deg, ${game.color}20, ${game.color}40)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "56px", position: "relative" }}>
                {game.icon}
                {game.aiGenerated && (
                  <span style={{ position: "absolute", top: "8px", left: "8px", background: "linear-gradient(135deg, #EC4899, #F472B6)", color: "#fff", padding: "3px 10px", borderRadius: "10px", fontSize: "10px", fontWeight: "800" }}>
                    🤖 AI
                  </span>
                )}
                <button onClick={(e) => { e.stopPropagation(); toggleFavorite(game.id); }} style={{ position: "absolute", bottom: "8px", right: "8px", width: "28px", height: "28px", borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Heart size={14} color={favorites.includes(game.id) ? "#EF4444" : "#9CA3AF"} fill={favorites.includes(game.id) ? "#EF4444" : "none"} />
                </button>
              </div>
              <div style={{ padding: "12px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1F2937", marginBottom: "4px" }}>{game.title}</h3>
                <span style={{ fontSize: "11px", color: game.color, background: `${game.color}15`, padding: "2px 8px", borderRadius: "6px", fontWeight: "600" }}>{game.category}</span>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "12px", color: "#F59E0B", fontWeight: "700" }}>
                    <Star size={12} fill="#F59E0B" /> 4.8
                  </span>
                  <span style={{ fontSize: "11px", color: "#9CA3AF", display: "flex", alignItems: "center", gap: "3px" }}>
                    <Clock size={12} /> {game.duration}
                  </span>
                </div>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (game.id === "trivia-ai" || game.id === "wordle-ar" || game.id === "ai-draw") {
                      setActiveGame(game.id);
                    }
                  }}
                  style={{ width: "100%", marginTop: "10px", padding: "10px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #8B5CF6, #A78BFA)", color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                  <Zap size={14} fill="#fff" /> العب الآن
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div onClick={() => setShowTournaments(true)} style={{
        background: "linear-gradient(135deg, #8B5CF6, #A78BFA)",
        borderRadius: "20px", padding: "20px", color: "#fff",
        textAlign: "center", cursor: "pointer",
        boxShadow: "0 8px 24px rgba(139,92,246,0.3)",
        marginBottom: "20px",
      }}>
        <Trophy size={40} style={{ marginBottom: "8px" }} />
        <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "4px" }}>انظم بطولة الآن!</h3>
        <p style={{ fontSize: "13px", opacity: 0.9 }}>أي شخص يقدر ينظم بطولة ويدعو أصدقائه</p>
        <div style={{ marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "14px", fontWeight: "700" }}>
          ابدأ البطولة <ChevronRight size={18} />
        </div>
      </div>
    </div>
  );
}
