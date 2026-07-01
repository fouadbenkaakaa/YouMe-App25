export type BadgeType = "blue" | "green" | "gold" | "purple" | "gray" | null;

interface BadgeProps {
  type: BadgeType;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const BADGE_CONFIG: Record<NonNullable<BadgeType>, { emoji: string; label: string; color: string; bg: string; border: string }> = {
  blue:   { emoji: "✓", label: "شخصية عامة",     color: "#fff", bg: "#3b82f6", border: "#2563eb" },
  green:  { emoji: "✓", label: "متجر موثق",       color: "#fff", bg: "#22c55e", border: "#16a34a" },
  gold:   { emoji: "✓", label: "جهة حكومية",      color: "#fff", bg: "#f59e0b", border: "#d97706" },
  purple: { emoji: "✓", label: "منظمة خيرية",     color: "#fff", bg: "#a855f7", border: "#9333ea" },
  gray:   { emoji: "✓", label: "حساب موثق",       color: "#fff", bg: "#6b7280", border: "#4b5563" },
};

const SIZE_MAP = { sm: 16, md: 20, lg: 26 };

export default function VerificationBadge({ type, size = "md", showLabel = false }: BadgeProps) {
  if (!type) return null;
  const cfg = BADGE_CONFIG[type];
  const px = SIZE_MAP[size];

  return (
    <span className="badge-wrap" title={cfg.label} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span
        className="verify-badge"
        style={{
          width: px, height: px,
          background: cfg.bg,
          border: `2px solid ${cfg.border}`,
          borderRadius: "50%",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          color: cfg.color,
          fontSize: px * 0.5,
          fontWeight: 900,
          flexShrink: 0,
          boxShadow: `0 1px 4px ${cfg.bg}55`,
        }}
      >
        {cfg.emoji}
      </span>
      {showLabel && <span style={{ fontSize: 12, color: cfg.bg, fontWeight: 700 }}>{cfg.label}</span>}
    </span>
  );
}

export { BADGE_CONFIG };
