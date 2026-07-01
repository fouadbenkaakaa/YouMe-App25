import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, RotateCcw, UserPlus, ShoppingBag, Search, Globe } from "lucide-react";
import { useApp } from "../context/AppContext";

const QUICK_ACTIONS = [
  { icon: UserPlus, label: "اقتراح أصدقاء", prompt: "اقترح لي أصدقاء بناءً على اهتماماتي" },
  { icon: ShoppingBag, label: "اقتراح منتجات", prompt: "ما المنتجات التي قد تناسبني في السوق؟" },
  { icon: Globe, label: "ترجمة منشور", prompt: "ترجم هذا المنشور للإنجليزية: أهلاً بكم في وصلة" },
  { icon: Search, label: "بحث ذكي", prompt: "ابحث عن مهندسين من الإمارات مهتمين بالتقنية" },
];

const AI_RESPONSES: Record<string, string> = {
  default: "مرحباً! أنا مساعدك الذكي في وصلة. يمكنني مساعدتك في اقتراح الأصدقاء، البحث عن المنتجات، ترجمة المحتوى، والمزيد! 😊",
  friend: "بناءً على اهتماماتك في التقنية والزراعة، أقترح عليك:\n\n1. **أحمد الحربي** (92% توافق) - مزارع من أستراليا\n2. **خالد التقنية** (85% توافق) - مهندس مهتم بالذكاء الاصطناعي\n3. **سارة المنصور** (78% توافق) - متحمسة للطبيعة والسفر\n\nهل تريد إرسال طلب صداقة لأي منهم؟",
  product: "بناءً على ملفك الشخصي والاهتمامات، إليك اقتراحات من السوق:\n\n🚗 **تويوتا هايلوكس 2023** - مناسب لطبيعة عملك\n🌱 **معدات زراعية** - جرار زراعي بسعر مناسب في القصيم\n📱 **هاتف ذكي** - آخر الإصدارات بسعر تنافسي\n\nهل تريد رؤية تفاصيل أي منتج؟",
  translate: "✅ **الترجمة:**\n\n**عربي:** أهلاً بكم في وصلة\n**English:** Welcome to Wasla\n**Français:** Bienvenue à Wasla\n**Türkçe:** Wasla'ya Hoşgeldiniz\n\nهل تريد ترجمة نص آخر؟",
  search: "🔍 **نتائج البحث بالذكاء الاصطناعي:**\n\nوجدت 8 مهندسين من الإمارات مهتمين بالتقنية:\n\n1. **سلطان الشامسي** (Dubai) - 34 سنة، مهندس برمجيات\n2. **مريم الكتبي** (Abu Dhabi) - 29 سنة، مهندسة شبكات\n3. **أحمد الظاهري** (Sharjah) - 31 سنة، مطور تطبيقات\n\nهل تريد التواصل مع أحدهم؟",
};

function getAIResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("صديق") || lower.includes("اقتراح") && lower.includes("صديق")) return AI_RESPONSES.friend;
  if (lower.includes("منتج") || lower.includes("سوق") || lower.includes("شراء")) return AI_RESPONSES.product;
  if (lower.includes("ترجم") || lower.includes("translation")) return AI_RESPONSES.translate;
  if (lower.includes("بحث") || lower.includes("ابحث")) return AI_RESPONSES.search;
  return `شكراً على سؤالك! يمكنني مساعدتك في:\n\n• اقتراح أصدقاء مناسبين\n• اقتراح منتجات من السوق\n• ترجمة المنشورات\n• البحث الذكي عن مستخدمين\n• تحليل اهتماماتك\n\nكيف يمكنني مساعدتك تحديداً؟ 🤖`;
}

interface Message {
  id: string;
  from: "user" | "ai";
  text: string;
  time: string;
}

export default function AIAssistantPage() {
  const { user } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    { id: "0", from: "ai", text: AI_RESPONSES.default, time: "الآن" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), from: "user", text: msg, time: "الآن" };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const aiMsg: Message = { id: (Date.now() + 1).toString(), from: "ai", text: getAIResponse(msg), time: "الآن" };
      setMessages(m => [...m, aiMsg]);
      setLoading(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="ai-page">
      <div className="ai-header">
        <div className="ai-header-info">
          <div className="ai-avatar"><Sparkles size={24} /></div>
          <div>
            <div className="ai-name">المساعد الذكي</div>
            <div className="ai-status">● نشط دائماً</div>
          </div>
        </div>
        <button className="icon-btn" onClick={() => setMessages([{ id: "0", from: "ai", text: AI_RESPONSES.default, time: "الآن" }])}>
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="quick-actions-bar">
        {QUICK_ACTIONS.map(qa => (
          <button key={qa.label} className="quick-action-chip" onClick={() => send(qa.prompt)}>
            <qa.icon size={14} /> {qa.label}
          </button>
        ))}
      </div>

      <div className="ai-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`ai-msg-row ${msg.from}`}>
            {msg.from === "ai" && <div className="ai-bubble-avatar"><Sparkles size={16} /></div>}
            {msg.from === "user" && <img src={user?.avatar} alt="" className="ai-user-avatar" />}
            <div className={`ai-bubble ${msg.from}`}>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                {msg.text.split("**").map((part, i) =>
                  i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="ai-msg-row ai">
            <div className="ai-bubble-avatar"><Sparkles size={16} /></div>
            <div className="ai-bubble ai ai-typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="ai-input-bar">
        <input
          type="text"
          placeholder="اسألني أي شيء..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
        />
        <button className={`ai-send-btn ${input.trim() ? "active" : ""}`} onClick={() => send()}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
