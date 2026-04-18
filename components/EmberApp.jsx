'use client'
// Ember Budget App v1.1 — Fire / Water / Nature / Earth / Floral
import { useState, createContext, useContext, useEffect } from "react";
import { supabase } from '@/lib/supabase'

// ── THEMES ──────────────────────────────────────────────────────────────────
const THEMES = {
  fire: {
    name: "Fire", emoji: "🔥",
    bg: "#111111", card: "#1c1c1c", card2: "#242424", border: "#2a2a2a", navBg: "#161616",
    primary: "#f97316", secondary: "#facc15", accent: "#fb923c",
    red: "#ef4444", green: "#4ade80", text: "#f5f5f5", muted: "#9ca3af", dim: "#4b5563",
    gradA: "#f97316", gradB: "#facc15", glow: "rgba(249,115,22,0.25)",
    partnerBg: "#0f1a0f", partnerBorder: "#2a4a2a", partnerText: "#4ade80",
    catColors: ["#f97316","#fb923c","#facc15","#fbbf24","#f59e0b","#ea580c","#fdba74","#fed7aa","#4ade80","#6b7280"],
    light: { bg: "#fafaf9", card: "#ffffff", card2: "#f5f0eb", border: "#e8ddd0", navBg: "#ffffff", text: "#1a1208", muted: "#78716c", dim: "#c4b5a0", partnerBg: "#f0fdf4", partnerBorder: "#bbf7d0", partnerText: "#16a34a" },
  },
  water: {
    name: "Water", emoji: "🌊",
    bg: "#080f1a", card: "#0d1929", card2: "#112236", border: "#1a3a5c", navBg: "#060d16",
    primary: "#38bdf8", secondary: "#7dd3fc", accent: "#0ea5e9",
    red: "#f87171", green: "#34d399", text: "#e0f2fe", muted: "#7ea8c9", dim: "#2d5a7a",
    gradA: "#38bdf8", gradB: "#818cf8", glow: "rgba(56,189,248,0.25)",
    partnerBg: "#0a1420", partnerBorder: "#1a3a5c", partnerText: "#34d399",
    catColors: ["#38bdf8","#0ea5e9","#7dd3fc","#818cf8","#a78bfa","#60a5fa","#93c5fd","#bae6fd","#34d399","#64748b"],
    light: { bg: "#f0f9ff", card: "#ffffff", card2: "#e0f2fe", border: "#bae6fd", navBg: "#ffffff", text: "#082f49", muted: "#4a90a4", dim: "#a5d8f0", partnerBg: "#f0fdf4", partnerBorder: "#bbf7d0", partnerText: "#0f766e" },
  },
  nature: {
    name: "Nature", emoji: "🌿",
    bg: "#0a110a", card: "#121a12", card2: "#182018", border: "#243824", navBg: "#080e08",
    primary: "#4ade80", secondary: "#a3e635", accent: "#22c55e",
    red: "#f87171", green: "#86efac", text: "#ecfdf0", muted: "#86a886", dim: "#3a5a3a",
    gradA: "#4ade80", gradB: "#a3e635", glow: "rgba(74,222,128,0.25)",
    partnerBg: "#0a1a14", partnerBorder: "#1a4a2a", partnerText: "#86efac",
    catColors: ["#4ade80","#22c55e","#a3e635","#84cc16","#65a30d","#16a34a","#86efac","#bbf7d0","#34d399","#6b7280"],
    light: { bg: "#f7fef7", card: "#ffffff", card2: "#f0fdf4", border: "#bbf7d0", navBg: "#ffffff", text: "#052e16", muted: "#4a7c59", dim: "#a7d9b2", partnerBg: "#f0fdf4", partnerBorder: "#86efac", partnerText: "#15803d" },
  },
  earth: {
    name: "Earth", emoji: "🪨",
    bg: "#0f0b08", card: "#1c1510", card2: "#241c14", border: "#3a2d1f", navBg: "#0c0906",
    primary: "#c8854a", secondary: "#e8b87a", accent: "#a0622a",
    red: "#e05a5a", green: "#7abf7a", text: "#f5ede3", muted: "#a08060", dim: "#5a3f28",
    gradA: "#c8854a", gradB: "#e8b87a", glow: "rgba(200,133,74,0.25)",
    partnerBg: "#0f1a0a", partnerBorder: "#2a4a1a", partnerText: "#7abf7a",
    catColors: ["#c8854a","#a0622a","#e8b87a","#d4955a","#b87040","#8b4513","#deb887","#f5deb3","#7abf7a","#6b5a4a"],
    light: { bg: "#fdf8f2", card: "#ffffff", card2: "#faf0e6", border: "#e8d5bc", navBg: "#ffffff", text: "#2c1a0a", muted: "#8b6040", dim: "#d4b896", partnerBg: "#f0fdf4", partnerBorder: "#bbf7d0", partnerText: "#15803d" },
  },
  floral: {
    name: "Floral", emoji: "🌸",
    bg: "#120a12", card: "#1c1020", card2: "#231428", border: "#3a1f42", navBg: "#0e080f",
    primary: "#e879f9", secondary: "#f9a8d4", accent: "#c026d3",
    red: "#fb7185", green: "#4ade80", text: "#fdf4ff", muted: "#c4a8cc", dim: "#5a3a62",
    gradA: "#e879f9", gradB: "#f9a8d4", glow: "rgba(232,121,249,0.25)",
    partnerBg: "#0a100a", partnerBorder: "#1a3a20", partnerText: "#4ade80",
    catColors: ["#e879f9","#c026d3","#f9a8d4","#f0abfc","#a855f7","#db2777","#fda4af","#fbcfe8","#4ade80","#6b7280"],
    light: { bg: "#fdf4ff", card: "#ffffff", card2: "#fae8ff", border: "#f0abfc", navBg: "#ffffff", text: "#3b0764", muted: "#9d5aad", dim: "#e4b8f0", partnerBg: "#f0fdf4", partnerBorder: "#bbf7d0", partnerText: "#15803d" },
  },
};

const applyMode = (theme, isLight) => isLight ? { ...theme, ...theme.light } : theme;

const ThemeCtx = createContext(THEMES.fire);
const useT = () => useContext(ThemeCtx);

// ── DATA ────────────────────────────────────────────────────────────────────
const CAT_META = {
  Housing:       { icon: "🏠", idx: 0 },
  Transport:     { icon: "🚗", idx: 1 },
  Groceries:     { icon: "🛒", idx: 2 },
  Utilities:     { icon: "⚡", idx: 3 },
  Subscriptions: { icon: "📱", idx: 4 },
  Dining:        { icon: "🍽️", idx: 5 },
  Health:        { icon: "💊", idx: 6 },
  Entertainment: { icon: "🎮", idx: 7 },
  Savings:       { icon: "💰", idx: 8 },
  Other:         { icon: "📦", idx: 9 },
};
const CATS = Object.keys(CAT_META);
const cc = (cat, T) => T.catColors[CAT_META[cat]?.idx ?? 9];

const INIT_TXN = [
  { id: 1,  name: "Rent",           amount: 950,  category: "Housing",       date: "2025-04-01" },
  { id: 2,  name: "Council Tax",    amount: 140,  category: "Housing",       date: "2025-04-01" },
  { id: 3,  name: "Gas & Electric", amount: 95,   category: "Utilities",     date: "2025-04-02" },
  { id: 4,  name: "Internet",       amount: 40,   category: "Utilities",     date: "2025-04-02" },
  { id: 5,  name: "Netflix",        amount: 18,   category: "Subscriptions", date: "2025-04-03" },
  { id: 6,  name: "Spotify",        amount: 11,   category: "Subscriptions", date: "2025-04-03" },
  { id: 7,  name: "Car Insurance",  amount: 65,   category: "Transport",     date: "2025-04-04" },
  { id: 8,  name: "Groceries",      amount: 280,  category: "Groceries",     date: "2025-04-05" },
  { id: 9,  name: "Gym",            amount: 35,   category: "Health",        date: "2025-04-06" },
  { id: 10, name: "Dinner Out",     amount: 48,   category: "Dining",        date: "2025-04-08" },
  { id: 11, name: "Cinema",         amount: 22,   category: "Entertainment", date: "2025-04-10" },
  { id: 12, name: "Amazon Prime",   amount: 9,    category: "Subscriptions", date: "2025-04-11" },
];

const INIT_BUDGETS = {
  Housing: 1100, Transport: 120, Groceries: 320, Utilities: 150,
  Subscriptions: 60, Dining: 80, Health: 60, Entertainment: 50, Savings: 0, Other: 50,
};

const PREV_MONTH = {
  Housing: 1090, Transport: 130, Groceries: 295, Utilities: 110,
  Subscriptions: 38, Dining: 95, Health: 35, Entertainment: 65, Savings: 200, Other: 30,
};

const fmt = (n) => `£${Number(n).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const myShare = (t, splits) => t.amount * ((splits[t.id] ?? 100) / 100);

// ── SHARED UI ────────────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  const T = useT();
  return <div style={{ background: T.card, borderRadius: 16, padding: 18, border: `1px solid ${T.border}`, ...style }}>{children}</div>;
}
function Label({ children }) {
  const T = useT();
  return <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>{children}</div>;
}
function GhostBtn({ children, onClick, style = {} }) {
  const T = useT();
  return <button onClick={onClick} style={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 8, color: T.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 13, padding: "6px 12px", ...style }}>{children}</button>;
}
function PrimaryBtn({ children, onClick, style = {} }) {
  const T = useT();
  return <button onClick={onClick} style={{ background: `linear-gradient(135deg,${T.gradA},${T.gradB}88)`, border: `1px solid ${T.primary}`, borderRadius: 10, color: "#000", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700, padding: "11px 16px", ...style }}>{children}</button>;
}
function OutlineBtn({ children, onClick, style = {} }) {
  const T = useT();
  return <button onClick={onClick} style={{ background: "transparent", border: `1px solid ${T.primary}`, borderRadius: 10, color: T.primary, cursor: "pointer", fontFamily: "inherit", fontSize: 14, padding: "11px 16px", ...style }}>{children}</button>;
}

// ── DONUT ────────────────────────────────────────────────────────────────────
function DonutChart({ data, total, income }) {
  const T = useT();
  const size = 220, cx = 110, cy = 110, R = 88, r = 60;
  let cum = -Math.PI / 2;
  const arcs = data.filter(d => d.value > 0).map(d => {
    const angle = (d.value / Math.max(total, 1)) * 2 * Math.PI;
    const s = cum; cum += angle; const e = cum; const large = angle > Math.PI ? 1 : 0;
    return { ...d, path: `M ${cx+R*Math.cos(s)} ${cy+R*Math.sin(s)} A ${R} ${R} 0 ${large} 1 ${cx+R*Math.cos(e)} ${cy+R*Math.sin(e)} L ${cx+r*Math.cos(e)} ${cy+r*Math.sin(e)} A ${r} ${r} 0 ${large} 0 ${cx+r*Math.cos(s)} ${cy+r*Math.sin(s)} Z` };
  });
  const pct = income > 0 ? Math.round((total / income) * 100) : 0;
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <svg width={size} height={size} style={{ filter: `drop-shadow(0 0 18px ${T.glow})` }}>
        <circle cx={cx} cy={cy} r={(R+r)/2} fill="none" stroke={T.card2} strokeWidth={R-r} />
        {arcs.map((a, i) => <path key={i} d={a.path} fill={a.color} opacity={0.92} />)}
        <circle cx={cx} cy={cy} r={r-2} fill={T.bg} />
      </svg>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", pointerEvents: "none" }}>
        <div style={{ fontSize: 11, color: T.muted, letterSpacing: 2, textTransform: "uppercase" }}>my share</div>
        <div style={{ fontSize: 22, fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: T.primary, lineHeight: 1.1 }}>{pct}%</div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{fmt(total)}</div>
      </div>
    </div>
  );
}

// ── BOTTOM NAV ───────────────────────────────────────────────────────────────
function BottomNav({ tab, setTab }) {
  const T = useT();
  const tabs = [
    { id: "home",       label: "Home",     icon: "◈" },
    { id: "insights",   label: "Insights", icon: "◉" },
    { id: "savings",    label: "Savings",  icon: "◎" },
    { id: "income",     label: "Income",   icon: "◐" },
    { id: "categories", label: "Bills",    icon: "⊞" },
    { id: "settings",   label: "Settings", icon: "◬" },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto", background: T.navBg, borderTop: `1px solid ${T.border}`, display: "flex", zIndex: 100 }}>
      {tabs.map(t => {
        const active = tab === t.id;
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, background: "none", border: "none", padding: "10px 2px 12px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, position: "relative" }}>
            {active && <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 2, background: `linear-gradient(90deg,${T.gradA},${T.gradB})`, borderRadius: "0 0 4px 4px", boxShadow: `0 0 10px ${T.primary}` }} />}
            <span style={{ fontSize: 16, color: active ? T.primary : T.dim, transition: "color .2s" }}>{t.icon}</span>
            <span style={{ fontSize: 9, letterSpacing: 0.5, color: active ? T.primary : T.dim, fontFamily: "'Outfit',sans-serif", textTransform: "uppercase" }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── HOME ─────────────────────────────────────────────────────────────────────
function HomeTab({ income, setIncome, transactions, splits, partnerName, bankConnected, connectBank }) {
  const T = useT();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(income));

  const myTotal = transactions.reduce((s, t) => s + myShare(t, splits), 0);
  const partnerTotal = transactions.reduce((s, t) => s + (t.amount - myShare(t, splits)), 0);
  const remaining = income - myTotal;

  const chartData = CATS.map(c => ({ label: c, value: transactions.filter(t => t.category === c).reduce((s, t) => s + myShare(t, splits), 0), color: cc(c, T) })).filter(d => d.value > 0);
  const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div style={{ padding: "0 16px 110px" }}>
      <div style={{ paddingTop: 52, paddingBottom: 20, textAlign: "center" }}>
        <div style={{ fontSize: 11, color: T.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>Monthly Take-Home</div>
        {editing ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ fontSize: 28, color: T.primary }}>£</span>
            <input autoFocus value={draft} onChange={e => setDraft(e.target.value)}
              onBlur={() => { const v = parseFloat(draft); if (!isNaN(v)) setIncome(v); setEditing(false); }}
              onKeyDown={e => e.key === "Enter" && e.target.blur()}
              style={{ background: "transparent", border: "none", borderBottom: `2px solid ${T.primary}`, color: T.text, fontSize: 38, fontFamily: "'Outfit',sans-serif", fontWeight: 700, width: 150, textAlign: "center", outline: "none" }} />
          </div>
        ) : (
          <div onClick={() => { setDraft(String(income)); setEditing(true); }} style={{ cursor: "pointer" }}>
            <span style={{ fontSize: 42, fontFamily: "'Outfit',sans-serif", fontWeight: 700, background: `linear-gradient(135deg,${T.gradA},${T.gradB})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{fmt(income)}</span>
            <span style={{ fontSize: 11, color: T.dim, marginLeft: 8 }}>tap to edit</span>
          </div>
        )}
      </div>

      {/* Connect Bank Button */}
      {!bankConnected && (
        <button onClick={connectBank} style={{
          width: "100%", marginBottom: 16, padding: "14px", borderRadius: 14, cursor: "pointer",
          background: `linear-gradient(135deg, ${T.gradA}22, ${T.gradB}11)`,
          border: `1px solid ${T.primary}`,
          color: T.primary, fontFamily: "inherit", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          🏦 Connect Your Bank
        </button>
      )}
      {bankConnected && (
        <div style={{ width: "100%", marginBottom: 16, padding: "10px 14px", borderRadius: 12, background: T.partnerBg, border: `1px solid ${T.partnerBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: T.green }}>🏦 Bank connected</span>
          <button onClick={connectBank} style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 8, color: T.muted, padding: "4px 10px", cursor: "pointer", fontSize: 11 }}>Refresh</button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
        <DonutChart data={chartData} total={myTotal} income={income} />
        <div style={{ display: "flex", gap: 10, marginTop: 16, width: "100%" }}>
          {[{ label: "My Spend", value: myTotal, color: T.primary }, { label: "Remaining", value: remaining, color: remaining < 0 ? T.red : T.green }].map(s => (
            <div key={s.label} style={{ flex: 1, background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 18, fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: s.color }}>{fmt(s.value)}</div>
            </div>
          ))}
        </div>
        {partnerTotal > 0 && (
          <div style={{ marginTop: 10, width: "100%", background: T.partnerBg, border: `1px solid ${T.partnerBorder}`, borderRadius: 12, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: T.muted }}>💑 {partnerName}'s share</span>
            <span style={{ fontSize: 14, fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: T.partnerText }}>−{fmt(partnerTotal)}</span>
          </div>
        )}
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Label>Breakdown</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {chartData.map(d => (
            <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 5, background: T.card2, borderRadius: 20, padding: "5px 10px" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: T.muted }}>{CAT_META[d.label].icon} {d.label}</span>
              <span style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{fmt(d.value)}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <Label>Recent</Label>
        {recent.map((t, i) => (
          <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: i < recent.length - 1 ? 12 : 0, marginBottom: i < recent.length - 1 ? 12 : 0, borderBottom: i < recent.length - 1 ? `1px solid ${T.border}` : "none" }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: T.card2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{CAT_META[t.category]?.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: T.text }}>{t.name}</div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{t.category} · {t.date}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.primary }}>−{fmt(myShare(t, splits))}</div>
              {(splits[t.id] ?? 100) < 100 && <div style={{ fontSize: 10, color: T.muted }}>of {fmt(t.amount)}</div>}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── INSIGHTS ─────────────────────────────────────────────────────────────────
function InsightsTab({ income, transactions, splits }) {
  const T = useT();
  const [aiText, setAiText] = useState("");
  const [loading, setLoading] = useState(false);

  const total = transactions.reduce((s, t) => s + myShare(t, splits), 0);
  const savingsRate = income > 0 ? (((income - total) / income) * 100).toFixed(1) : 0;
  const healthScore = Math.min(100, Math.max(0, Math.round((parseFloat(savingsRate) > 20 ? 40 : parseFloat(savingsRate) > 10 ? 25 : 10) + (total < income * 0.8 ? 30 : total < income ? 15 : 0) + 30)));
  const scoreColor = healthScore >= 70 ? T.green : healthScore >= 45 ? T.accent : T.red;

  const byCat = CATS.map(c => ({
    cat: c,
    curr: transactions.filter(t => t.category === c).reduce((s, t) => s + myShare(t, splits), 0),
    prev: PREV_MONTH[c] || 0,
  })).filter(d => d.curr > 0 || d.prev > 0);
  const maxBar = Math.max(...byCat.map(d => Math.max(d.curr, d.prev)), 1);

  const getAI = async () => {
    setLoading(true); setAiText("");
    const summary = `UK user. Income: £${income}. My share of spend: £${total.toFixed(2)} (split bills with partner). Categories: ${byCat.filter(d => d.curr > 0).map(d => `${d.cat} £${d.curr.toFixed(0)}`).join(", ")}. Savings rate: ${savingsRate}%.`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: "You are a sharp UK personal finance coach. Be direct, no fluff. Use £. Give 3-4 specific actionable insights with emoji bullets. End with one 'this week' action.", messages: [{ role: "user", content: `Analyse my budget: ${summary}` }] })
      });
      const data = await res.json();
      setAiText(data.content?.[0]?.text || "No response.");
    } catch { setAiText("Error — please try again."); }
    setLoading(false);
  };

  return (
    <div style={{ padding: "0 16px 110px" }}>
      <div style={{ paddingTop: 52, paddingBottom: 20 }}>
        <div style={{ fontSize: 22, fontFamily: "'Playfair Display',serif", fontWeight: 700, color: T.text }}>Insights</div>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        {[{ label: "Health Score", val: healthScore, suffix: "/100", col: scoreColor }, { label: "Savings Rate", val: `${savingsRate}%`, suffix: "of income", col: parseFloat(savingsRate) > 10 ? T.green : T.red }].map(s => (
          <Card key={s.label} style={{ flex: 1, textAlign: "center" }}>
            <Label>{s.label}</Label>
            <div style={{ fontSize: 34, fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: s.col }}>{s.val}</div>
            <div style={{ fontSize: 11, color: T.muted }}>{s.suffix}</div>
          </Card>
        ))}
      </div>
      <Card style={{ marginBottom: 16 }}>
        <Label>This Month vs Last (My Share)</Label>
        {byCat.map(d => (
          <div key={d.cat} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 13, color: T.text }}>{CAT_META[d.cat].icon} {d.cat}</span>
              <span style={{ fontSize: 12, color: d.curr > d.prev ? T.red : T.green }}>{d.curr > d.prev ? "▲" : d.curr < d.prev ? "▼" : "–"} {fmt(d.curr)}</span>
            </div>
            {[{ v: d.curr, c: T.primary, label: "This" }, { v: d.prev, c: T.dim, label: "Last" }].map(b => (
              <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                <div style={{ width: 28, fontSize: 10, color: T.muted, textAlign: "right", flexShrink: 0 }}>{b.label}</div>
                <div style={{ flex: 1, height: 6, background: T.card2, borderRadius: 3 }}>
                  <div style={{ height: "100%", borderRadius: 3, background: b.c, width: `${(b.v / maxBar) * 100}%`, transition: "width .5s" }} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </Card>
      <Card>
        <Label>AI Analysis</Label>
        {!aiText && !loading && <OutlineBtn onClick={getAI} style={{ width: "100%" }}>{T.emoji} Analyse My Spending</OutlineBtn>}
        {loading && (
          <div style={{ textAlign: "center", padding: "30px 0", color: T.muted }}>
            <div style={{ fontSize: 28, animation: "pulse 1.5s ease-in-out infinite", display: "inline-block" }}>{T.emoji}</div>
            <div style={{ marginTop: 10, fontSize: 13 }}>Crunching your numbers...</div>
            <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
          </div>
        )}
        {aiText && (
          <div>
            <div style={{ fontSize: 13, lineHeight: 1.8, color: T.muted, whiteSpace: "pre-wrap" }}>{aiText}</div>
            <GhostBtn onClick={getAI} style={{ marginTop: 12 }}>Refresh</GhostBtn>
          </div>
        )}
      </Card>
    </div>
  );
}

// ── BILLS / CATEGORIES ───────────────────────────────────────────────────────
function CategoriesTab({ transactions, setTransactions, budgets, setBudgets, catNames, setCatNames, splits, setSplits, partnerName }) {
  const T = useT();
  const [selectedCat, setSelectedCat] = useState(null);
  const [reassigning, setReassigning] = useState(null);
  const [editingBudget, setEditingBudget] = useState(null);
  const [budgetDraft, setBudgetDraft] = useState("");
  const [renamingCat, setRenamingCat] = useState(null);
  const [nameDraft, setNameDraft] = useState("");

  const displayName = (key) => catNames[key] || key;
  const safeMeta = (cat) => CAT_META[cat] || { icon: "📦", idx: 9 };
  const SPLIT_OPTS = [100, 75, 50, 25];

  const catTotals = CATS.map(c => ({
    cat: c,
    fullTotal: transactions.filter(t => t.category === c).reduce((s, t) => s + t.amount, 0),
    myTotal: transactions.filter(t => t.category === c).reduce((s, t) => s + myShare(t, splits), 0),
    txns: transactions.filter(t => t.category === c),
    budget: budgets[c] || 0,
  })).filter(d => d.txns.length > 0);

  return (
    <div style={{ padding: "0 16px 110px" }}>
      <div style={{ paddingTop: 52, paddingBottom: 4 }}>
        <div style={{ fontSize: 22, fontFamily: "'Playfair Display',serif", fontWeight: 700, color: T.text }}>Bills</div>
        <div style={{ fontSize: 13, color: T.muted, marginTop: 4, marginBottom: 16 }}>Tap to manage, rename & set your share</div>
      </div>

      {catTotals.map(({ cat, fullTotal, myTotal, txns, budget }) => {
        const pct = budget > 0 ? Math.min(100, (myTotal / budget) * 100) : 0;
        const over = budget > 0 && myTotal > budget;
        const isOpen = selectedCat === cat;
        const name = displayName(cat);
        const meta = safeMeta(cat);
        const color = cc(cat, T);

        return (
          <div key={cat} style={{ marginBottom: 10 }}>
            <div onClick={() => { setSelectedCat(isOpen ? null : cat); setRenamingCat(null); }}
              style={{ background: T.card, border: `1px solid ${isOpen ? T.primary : T.border}`, borderRadius: isOpen ? "16px 16px 0 0" : 16, padding: 16, cursor: "pointer", transition: "border-color .2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: T.card2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{meta.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 15, color: T.text, fontWeight: 600 }}>{name}</span>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: over ? T.red : T.primary }}>{fmt(myTotal)}</div>
                      {myTotal !== fullTotal && <div style={{ fontSize: 10, color: T.muted }}>of {fmt(fullTotal)}</div>}
                    </div>
                  </div>
                  {budget > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: T.muted }}>Budget: {fmt(budget)}</span>
                        <span style={{ fontSize: 10, color: over ? T.red : T.muted }}>{pct.toFixed(0)}%{over ? " OVER" : ""}</span>
                      </div>
                      <div style={{ height: 4, background: T.card2, borderRadius: 2 }}>
                        <div style={{ height: "100%", borderRadius: 2, width: `${pct}%`, transition: "width .4s", background: over ? T.red : `linear-gradient(90deg,${T.gradA},${T.gradB})` }} />
                      </div>
                    </div>
                  )}
                </div>
                <span style={{ color: T.dim, fontSize: 14, marginLeft: 6 }}>{isOpen ? "▲" : "▼"}</span>
              </div>
            </div>

            {isOpen && (
              <div style={{ background: T.card2, border: `1px solid ${T.primary}`, borderTop: "none", borderRadius: "0 0 16px 16px", padding: 16 }}>

                {/* Rename */}
                <div style={{ marginBottom: 12, padding: "10px 12px", background: T.card, borderRadius: 10 }}>
                  <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Category Name</div>
                  {renamingCat === cat ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      <input autoFocus value={nameDraft} onChange={e => setNameDraft(e.target.value)} maxLength={30}
                        onKeyDown={e => { if (e.key === "Enter") { if (nameDraft.trim()) setCatNames(p => ({ ...p, [cat]: nameDraft.trim() })); setRenamingCat(null); }}}
                        style={{ flex: 1, background: T.bg, border: `1px solid ${T.primary}`, borderRadius: 8, padding: "7px 10px", color: T.text, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
                      <PrimaryBtn onClick={() => { if (nameDraft.trim()) setCatNames(p => ({ ...p, [cat]: nameDraft.trim() })); setRenamingCat(null); }} style={{ padding: "7px 14px", fontSize: 13 }}>Save</PrimaryBtn>
                      <GhostBtn onClick={() => setRenamingCat(null)} style={{ padding: "7px 10px", fontSize: 13 }}>✕</GhostBtn>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 15, color: T.text }}>{name}</span>
                      <GhostBtn onClick={e => { e.stopPropagation(); setRenamingCat(cat); setNameDraft(name); }} style={{ fontSize: 12, padding: "5px 12px" }}>✏️ Rename</GhostBtn>
                    </div>
                  )}
                  {catNames[cat] && <div style={{ fontSize: 11, color: T.dim, marginTop: 5 }}>Original: {cat}</div>}
                </div>

                {/* Budget cap */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "10px 12px", background: T.card, borderRadius: 10 }}>
                  <span style={{ fontSize: 12, color: T.muted, flex: 1 }}>Budget cap (my share)</span>
                  {editingBudget === cat ? (
                    <>
                      <input autoFocus value={budgetDraft} onChange={e => setBudgetDraft(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") { const v = parseFloat(budgetDraft); if (!isNaN(v)) setBudgets(p => ({ ...p, [cat]: v })); setEditingBudget(null); }}}
                        style={{ width: 80, background: "transparent", border: `1px solid ${T.primary}`, borderRadius: 6, padding: "4px 8px", color: T.text, fontSize: 13, fontFamily: "'Outfit',sans-serif", textAlign: "right", outline: "none" }} />
                      <PrimaryBtn onClick={() => { const v = parseFloat(budgetDraft); if (!isNaN(v)) setBudgets(p => ({ ...p, [cat]: v })); setEditingBudget(null); }} style={{ padding: "4px 10px", fontSize: 12 }}>Set</PrimaryBtn>
                    </>
                  ) : (
                    <GhostBtn onClick={() => { setEditingBudget(cat); setBudgetDraft(String(budget || "")); }} style={{ fontSize: 12, padding: "4px 10px" }}>{budget > 0 ? fmt(budget) : "Set"} ✏️</GhostBtn>
                  )}
                </div>

                {/* Transactions */}
                <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Transactions</div>
                {txns.map(t => {
                  const share = splits[t.id] ?? 100;
                  return (
                    <div key={t.id} style={{ marginBottom: 10 }}>
                      {reassigning === t.id ? (
                        <div style={{ background: T.card, borderRadius: 10, padding: 12 }}>
                          <div style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>Move "{t.name}" to:</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {CATS.filter(c => c !== cat).map(c => (
                              <button key={c} onClick={() => { setTransactions(p => p.map(x => x.id === t.id ? { ...x, category: c } : x)); setReassigning(null); }}
                                style={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 20, color: T.text, padding: "5px 10px", cursor: "pointer", fontSize: 12 }}>
                                {safeMeta(c).icon} {displayName(c)}
                              </button>
                            ))}
                            <button onClick={() => setReassigning(null)} style={{ background: "none", border: `1px solid ${T.dim}`, borderRadius: 20, color: T.muted, padding: "5px 10px", cursor: "pointer", fontSize: 12 }}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ background: T.card, borderRadius: 12 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px" }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 14, color: T.text }}>{t.name}</div>
                              <div style={{ fontSize: 11, color: T.muted }}>{t.date}</div>
                            </div>
                            <div style={{ textAlign: "right", marginRight: 6 }}>
                              <div style={{ fontSize: 14, color: T.primary, fontWeight: 700 }}>{fmt(myShare(t, splits))}</div>
                              {share < 100 && <div style={{ fontSize: 10, color: T.muted }}>my {share}% · {fmt(t.amount)} total</div>}
                            </div>
                            <GhostBtn onClick={() => setReassigning(t.id)} style={{ padding: "4px 8px", fontSize: 11 }}>Move</GhostBtn>
                          </div>
                          {/* My share selector */}
                          <div style={{ padding: "0 12px 10px", display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 11, color: T.muted, flexShrink: 0 }}>My share</span>
                            <div style={{ flex: 1, display: "flex", gap: 4 }}>
                              {SPLIT_OPTS.map(p => (
                                <button key={p} onClick={() => setSplits(prev => ({ ...prev, [t.id]: p }))}
                                  style={{ flex: 1, padding: "5px 2px", borderRadius: 7, fontSize: 11, cursor: "pointer", fontWeight: share === p ? 700 : 400, border: `1px solid ${share === p ? T.primary : T.border}`, background: share === p ? `${T.primary}22` : T.card2, color: share === p ? T.primary : T.muted, transition: "all .15s" }}>
                                  {p}%
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── SAVINGS ──────────────────────────────────────────────────────────────────
const INTEREST_FREQS = ["Monthly", "Quarterly", "Annually"];

function calcInterestEarned(saved, aer, freqLabel, monthsHeld) {
  if (!aer || aer <= 0 || !saved || saved <= 0) return 0;
  const rate = aer / 100;
  const n = freqLabel === "Monthly" ? 12 : freqLabel === "Quarterly" ? 4 : 1;
  const years = monthsHeld / 12;
  return saved * (Math.pow(1 + rate / n, n * years) - 1);
}

function nextPaymentDate(startDate, freqLabel) {
  const now = new Date();
  const start = new Date(startDate);
  if (freqLabel === "Monthly") {
    const next = new Date(now.getFullYear(), now.getMonth() + 1, start.getDate());
    return next;
  }
  if (freqLabel === "Quarterly") {
    const next = new Date(start);
    while (next <= now) next.setMonth(next.getMonth() + 3);
    return next;
  }
  // Annually
  const next = new Date(start);
  while (next <= now) next.setFullYear(next.getFullYear() + 1);
  return next;
}

function daysUntil(date) {
  const diff = date - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function SavingsTab({ income, transactions, splits }) {
  const T = useT();
  const today = new Date().toISOString().slice(0, 10);
  const [goals, setGoals] = useState([
    { id: 1, name: "Emergency Fund", target: 3000, saved: 850,  monthsLeft: 12, aer: 4.5,  interestFreq: "Monthly",   startDate: "2025-01-01", monthsHeld: 3 },
    { id: 2, name: "Holiday",        target: 1200, saved: 320,  monthsLeft: 6,  aer: 0,    interestFreq: "Monthly",   startDate: "2025-02-01", monthsHeld: 2 },
  ]);
  const [form, setForm] = useState({ name: "", target: "", months: "", aer: "", interestFreq: "Monthly" });
  const [adding, setAdding] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [editingInterest, setEditingInterest] = useState(null);
  const [interestDraft, setInterestDraft] = useState({ aer: "", interestFreq: "Monthly" });

  const totalSpend = transactions.reduce((s, t) => s + myShare(t, splits), 0);
  const spare = income - totalSpend;
  const totalGoalMonthly = goals.reduce((s, g) => s + (g.target - g.saved) / (g.monthsLeft || 12), 0);

  const Ring = ({ pct, size = 90, stroke = 8 }) => {
    const r = (size - stroke) / 2, circ = 2 * Math.PI * r, dash = (Math.min(100, pct) / 100) * circ;
    return (
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.card2} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.primary} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${T.primary})`, transition: "stroke-dasharray .6s" }} />
      </svg>
    );
  };

  return (
    <div style={{ padding: "0 16px 110px" }}>
      <div style={{ paddingTop: 52, paddingBottom: 20 }}>
        <div style={{ fontSize: 22, fontFamily: "'Playfair Display',serif", fontWeight: 700, color: T.text }}>Savings</div>
      </div>

      {/* Available to save card */}
      <Card style={{ marginBottom: 16, background: spare > 0 ? T.partnerBg : "#1a0a0a", border: `1px solid ${spare > 0 ? T.partnerBorder : T.red}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Label>Available to Save</Label>
            <div style={{ fontSize: 28, fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: spare > 0 ? T.secondary : T.red }}>{fmt(Math.max(0, spare))}</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>after my share of bills · {spare > 0 ? `${((spare / income) * 100).toFixed(0)}% of income` : "overspent!"}</div>
          </div>
          <div style={{ fontSize: 36 }}>{spare > 0 ? "💰" : "⚠️"}</div>
        </div>
        {goals.length > 0 && (
          <div style={{ marginTop: 12, padding: "10px 12px", background: T.card, borderRadius: 10 }}>
            <div style={{ fontSize: 12, color: T.muted }}>Goals need <span style={{ color: T.primary, fontWeight: 700 }}>{fmt(totalGoalMonthly)}</span>/mo · You have <span style={{ color: spare > totalGoalMonthly ? T.green : T.red, fontWeight: 700 }}>{fmt(spare)}</span></div>
          </div>
        )}
      </Card>

      {/* Goals */}
      {goals.map(g => {
        const interest = calcInterestEarned(g.saved, g.aer, g.interestFreq, g.monthsHeld || 1);
        const effectiveSaved = g.saved + interest;
        const pct = Math.min(100, Math.round((effectiveSaved / g.target) * 100));
        const monthly = ((g.target - effectiveSaved) / (g.monthsLeft || 12)).toFixed(2);
        const nextPay = g.aer > 0 ? nextPaymentDate(g.startDate || today, g.interestFreq) : null;
        const daysLeft = nextPay ? daysUntil(nextPay) : null;
        const isExpanded = expandedId === g.id;
        const isEditingInterest = editingInterest === g.id;

        // Project 12 months with interest
        const projectedSaved = g.aer > 0
          ? g.saved * Math.pow(1 + (g.aer / 100) / (g.interestFreq === "Monthly" ? 12 : g.interestFreq === "Quarterly" ? 4 : 1),
              (g.interestFreq === "Monthly" ? 12 : g.interestFreq === "Quarterly" ? 4 : 1))
          : g.saved;

        return (
          <Card key={g.id} style={{ marginBottom: 12 }}>
            {/* Main row */}
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ position: "relative", flexShrink: 0, cursor: "pointer" }} onClick={() => setExpandedId(isExpanded ? null : g.id)}>
                <Ring pct={pct} />
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.primary, fontFamily: "'Outfit',sans-serif" }}>{pct}%</div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 3 }}>{g.name}</div>
                <div style={{ fontSize: 12, color: T.muted }}>{fmt(effectiveSaved)} of {fmt(g.target)}</div>
                {interest > 0 && <div style={{ fontSize: 11, color: T.green, marginTop: 2 }}>+{fmt(interest)} interest earned</div>}
                <div style={{ fontSize: 12, color: T.accent, marginTop: 3 }}>{fmt(Math.max(0, monthly))}/mo · {g.monthsLeft || 12} months left</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                <button onClick={() => setGoals(p => p.filter(x => x.id !== g.id))} style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 8, color: T.dim, padding: "3px 8px", cursor: "pointer", fontSize: 11 }}>✕</button>
                <button onClick={() => setExpandedId(isExpanded ? null : g.id)} style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 8, color: T.muted, padding: "3px 8px", cursor: "pointer", fontSize: 11 }}>{isExpanded ? "▲" : "▼"}</button>
              </div>
            </div>

            {/* Quick deposit */}
            <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
              {[50, 100, 200].map(amt => (
                <button key={amt} onClick={() => setGoals(p => p.map(x => x.id === g.id ? { ...x, saved: Math.min(x.target, x.saved + amt) } : x))}
                  style={{ flex: 1, background: T.card2, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, padding: "7px", cursor: "pointer", fontSize: 13 }}>+{fmt(amt)}</button>
              ))}
            </div>

            {/* Expanded interest section */}
            {isExpanded && (
              <div style={{ marginTop: 14, borderTop: `1px solid ${T.border}`, paddingTop: 14 }}>

                {/* Interest rate settings */}
                <div style={{ background: T.card2, borderRadius: 12, padding: 14, marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: T.muted, letterSpacing: 2, textTransform: "uppercase" }}>Interest Settings</div>
                    {!isEditingInterest
                      ? <button onClick={() => { setEditingInterest(g.id); setInterestDraft({ aer: String(g.aer || ""), interestFreq: g.interestFreq }); }}
                          style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 8, color: T.primary, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>✏️ Edit</button>
                      : null}
                  </div>

                  {isEditingInterest ? (
                    <div>
                      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, color: T.muted, marginBottom: 5 }}>AER / Interest Rate %</div>
                          <input type="number" step="0.01" placeholder="e.g. 4.5" value={interestDraft.aer}
                            onChange={e => setInterestDraft(p => ({ ...p, aer: e.target.value }))}
                            style={{ width: "100%", background: T.bg, border: `1px solid ${T.primary}`, borderRadius: 8, padding: "8px 10px", color: T.text, fontSize: 14, fontFamily: "'Outfit',sans-serif", outline: "none", boxSizing: "border-box" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, color: T.muted, marginBottom: 5 }}>Paid</div>
                          <select value={interestDraft.interestFreq} onChange={e => setInterestDraft(p => ({ ...p, interestFreq: e.target.value }))}
                            style={{ width: "100%", background: T.bg, border: `1px solid ${T.primary}`, borderRadius: 8, padding: "8px 10px", color: T.text, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}>
                            {INTEREST_FREQS.map(f => <option key={f}>{f}</option>)}
                          </select>
                        </div>
                      </div>
                      {interestDraft.aer && (
                        <div style={{ fontSize: 12, color: T.green, padding: "7px 10px", background: T.partnerBg, borderRadius: 8, marginBottom: 10 }}>
                          → At {interestDraft.aer}% AER you'd earn ~{fmt(calcInterestEarned(g.saved, parseFloat(interestDraft.aer), interestDraft.interestFreq, 12))} over 12 months on your current balance
                        </div>
                      )}
                      <div style={{ display: "flex", gap: 8 }}>
                        <PrimaryBtn style={{ flex: 2, padding: "8px" }} onClick={() => {
                          setGoals(p => p.map(x => x.id === g.id ? { ...x, aer: parseFloat(interestDraft.aer) || 0, interestFreq: interestDraft.interestFreq, startDate: x.startDate || today } : x));
                          setEditingInterest(null);
                        }}>Save</PrimaryBtn>
                        <GhostBtn style={{ flex: 1, padding: "8px" }} onClick={() => setEditingInterest(null)}>Cancel</GhostBtn>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {g.aer > 0 ? (
                        <div style={{ display: "flex", gap: 10 }}>
                          <div style={{ flex: 1, background: T.card, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>AER</div>
                            <div style={{ fontSize: 20, fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: T.green }}>{g.aer}%</div>
                          </div>
                          <div style={{ flex: 1, background: T.card, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Paid</div>
                            <div style={{ fontSize: 14, fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: T.text }}>{g.interestFreq}</div>
                          </div>
                          <div style={{ flex: 1, background: T.card, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Next in</div>
                            <div style={{ fontSize: 14, fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: daysLeft < 7 ? T.green : T.text }}>{daysLeft}d</div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ textAlign: "center", padding: "8px 0", color: T.dim, fontSize: 13 }}>No interest set — tap Edit to add your account's rate</div>
                      )}
                    </div>
                  )}
                </div>

                {/* 12-month projection */}
                {g.aer > 0 && (
                  <div style={{ background: T.card2, borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 11, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>12-Month Projection</div>
                    <div style={{ display: "flex", gap: 10 }}>
                      {[
                        { label: "Current Balance", value: effectiveSaved, color: T.text },
                        { label: "In 12 Months", value: projectedSaved + (totalGoalMonthly * 12), color: T.green },
                        { label: "Interest (12mo)", value: calcInterestEarned(effectiveSaved, g.aer, g.interestFreq, 12), color: T.primary },
                      ].map(s => (
                        <div key={s.label} style={{ flex: 1, background: T.card, borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                          <div style={{ fontSize: 9, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4, lineHeight: 1.3 }}>{s.label}</div>
                          <div style={{ fontSize: 13, fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: s.color }}>{fmt(s.value)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        );
      })}

      {/* Add goal */}
      {!adding ? (
        <button onClick={() => setAdding(true)} style={{ width: "100%", padding: "14px", background: "transparent", border: `1px dashed ${T.primary}`, borderRadius: 16, color: T.primary, fontFamily: "inherit", fontSize: 14, cursor: "pointer" }}>+ New Savings Goal</button>
      ) : (
        <Card>
          <Label>New Goal</Label>
          {[
            { key: "name",   ph: "Goal name (e.g. New Car)",  type: "text"   },
            { key: "target", ph: "Target amount £",            type: "number" },
            { key: "months", ph: "Months to reach it",         type: "number" },
          ].map(f => (
            <input key={f.key} type={f.type} placeholder={f.ph} value={form[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              style={{ width: "100%", background: T.card2, border: `1px solid ${T.border}`, borderRadius: 10, padding: "11px 14px", color: T.text, fontSize: 14, marginBottom: 10, boxSizing: "border-box", fontFamily: "inherit", outline: "none" }} />
          ))}
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input type="number" step="0.01" placeholder="AER % (optional)" value={form.aer}
              onChange={e => setForm(p => ({ ...p, aer: e.target.value }))}
              style={{ flex: 1, background: T.card2, border: `1px solid ${T.border}`, borderRadius: 10, padding: "11px 14px", color: T.text, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            <select value={form.interestFreq} onChange={e => setForm(p => ({ ...p, interestFreq: e.target.value }))}
              style={{ flex: 1, background: T.card2, border: `1px solid ${T.border}`, borderRadius: 10, padding: "11px 14px", color: T.text, fontSize: 14, fontFamily: "inherit", outline: "none" }}>
              {INTEREST_FREQS.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          {form.target && form.months && (
            <div style={{ fontSize: 13, color: T.accent, marginBottom: 10, padding: "8px 12px", background: T.card2, borderRadius: 8 }}>
              → Save {fmt(form.target / form.months)}/month
              {form.aer && ` · +${fmt(calcInterestEarned(0, parseFloat(form.aer), form.interestFreq, parseFloat(form.months)))} projected interest`}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <PrimaryBtn style={{ flex: 2 }} onClick={() => {
              if (!form.name || !form.target || !form.months) return;
              setGoals(p => [...p, { id: Date.now(), name: form.name, target: Number(form.target), saved: 0, monthsLeft: Number(form.months), aer: parseFloat(form.aer) || 0, interestFreq: form.interestFreq, startDate: today, monthsHeld: 0 }]);
              setForm({ name: "", target: "", months: "", aer: "", interestFreq: "Monthly" });
              setAdding(false);
            }}>Add Goal</PrimaryBtn>
            <GhostBtn style={{ flex: 1 }} onClick={() => setAdding(false)}>Cancel</GhostBtn>
          </div>
        </Card>
      )}
    </div>
  );
}

// ── INCOME ───────────────────────────────────────────────────────────────────
function IncomeTab({ income, setIncome, sideHustles, setSideHustles }) {
  const T = useT();
  const [incomeDraft, setIncomeDraft] = useState(String(income));
  const [editingIncome, setEditingIncome] = useState(false);
  const [form, setForm] = useState({ name: "", amount: "", frequency: "Monthly" });
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({});
  const FREQS = ["Weekly", "Fortnightly", "Monthly", "One-off"];
  const toM = (a, f) => f === "Weekly" ? a*52/12 : f === "Fortnightly" ? a*26/12 : f === "One-off" ? a/12 : a;
  const totalSide = sideHustles.reduce((s, h) => s + toM(h.amount, h.frequency), 0);
  const totalIncome = income + totalSide;

  return (
    <div style={{ padding: "0 16px 110px" }}>
      <div style={{ paddingTop: 52, paddingBottom: 20 }}>
        <div style={{ fontSize: 22, fontFamily: "'Playfair Display',serif", fontWeight: 700, color: T.text }}>Income</div>
      </div>
      <Card style={{ marginBottom: 16, background: `${T.primary}11`, border: `1px solid ${T.primary}`, textAlign: "center" }}>
        <div style={{ fontSize: 11, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Total Monthly Income</div>
        <div style={{ fontSize: 44, fontFamily: "'Outfit',sans-serif", fontWeight: 700, background: `linear-gradient(135deg,${T.gradA},${T.gradB})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{fmt(totalIncome)}</div>
        {totalSide > 0 && <div style={{ fontSize: 12, color: T.muted, marginTop: 6 }}><span style={{ color: T.accent }}>+{fmt(totalSide)}</span> from side hustles</div>}
      </Card>
      <Card style={{ marginBottom: 16 }}>
        <Label>Main Income</Label>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: T.card2, borderRadius: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: `${T.primary}22`, border: `1px solid ${T.primary}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>💼</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 2 }}>Monthly take-home</div>
            {editingIncome ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: T.primary, fontSize: 16 }}>£</span>
                <input autoFocus value={incomeDraft} onChange={e => setIncomeDraft(e.target.value)}
                  onBlur={() => { const v = parseFloat(incomeDraft); if (!isNaN(v)) setIncome(v); setEditingIncome(false); }}
                  onKeyDown={e => e.key === "Enter" && e.target.blur()}
                  style={{ background: "transparent", border: "none", borderBottom: `1px solid ${T.primary}`, color: T.text, fontSize: 20, fontFamily: "'Outfit',sans-serif", fontWeight: 700, width: 120, outline: "none" }} />
              </div>
            ) : <div style={{ fontSize: 20, fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: T.text }}>{fmt(income)}</div>}
          </div>
          <GhostBtn onClick={() => { setIncomeDraft(String(income)); setEditingIncome(true); }} style={{ fontSize: 12, padding: "6px 12px" }}>Edit</GhostBtn>
        </div>
      </Card>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <Label>Side Hustles</Label>
          {!adding && <OutlineBtn onClick={() => setAdding(true)} style={{ fontSize: 12, padding: "5px 12px", marginTop: -8 }}>+ Add</OutlineBtn>}
        </div>
        {sideHustles.length === 0 && !adding && <div style={{ textAlign: "center", padding: "16px 0", color: T.dim, fontSize: 13 }}>No side hustles yet</div>}
        {sideHustles.map((h, i) => (
          <div key={h.id} style={{ marginBottom: i < sideHustles.length - 1 ? 10 : 0 }}>
            {editingId === h.id ? (
              <div style={{ background: T.card2, borderRadius: 12, padding: 12 }}>
                <input value={editDraft.name} onChange={e => setEditDraft(p => ({ ...p, name: e.target.value }))}
                  style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px", color: T.text, fontSize: 13, marginBottom: 8, boxSizing: "border-box", fontFamily: "inherit", outline: "none" }} />
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input type="number" value={editDraft.amount} onChange={e => setEditDraft(p => ({ ...p, amount: e.target.value }))}
                    style={{ flex: 1, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px", color: T.text, fontSize: 13, fontFamily: "inherit", outline: "none" }} />
                  <select value={editDraft.frequency} onChange={e => setEditDraft(p => ({ ...p, frequency: e.target.value }))}
                    style={{ flex: 1, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px", color: T.text, fontSize: 13, fontFamily: "inherit", outline: "none" }}>
                    {FREQS.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <PrimaryBtn style={{ flex: 2 }} onClick={() => { setSideHustles(p => p.map(x => x.id === h.id ? { ...editDraft, amount: Number(editDraft.amount) } : x)); setEditingId(null); }}>Save</PrimaryBtn>
                  <GhostBtn style={{ flex: 1 }} onClick={() => setEditingId(null)}>Cancel</GhostBtn>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: T.card2, borderRadius: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${T.primary}22`, border: `1px solid ${T.primary}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{T.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: T.text, fontWeight: 500 }}>{h.name}</div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{h.frequency} · <span style={{ color: T.accent }}>{fmt(toM(h.amount, h.frequency))}/mo</span></div>
                </div>
                <div style={{ textAlign: "right", marginRight: 6 }}>
                  <div style={{ fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: T.secondary }}>{fmt(h.amount)}</div>
                  <div style={{ fontSize: 10, color: T.dim }}>{h.frequency}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <button onClick={() => { setEditingId(h.id); setEditDraft({ ...h }); }} style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 6, color: T.muted, padding: "3px 8px", cursor: "pointer", fontSize: 11 }}>✏️</button>
                  <button onClick={() => setSideHustles(p => p.filter(x => x.id !== h.id))} style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 6, color: T.muted, padding: "3px 8px", cursor: "pointer", fontSize: 11 }}>✕</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {adding && (
          <div style={{ marginTop: sideHustles.length > 0 ? 12 : 0, background: T.card2, borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 12, color: T.muted, marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>New Side Hustle</div>
            <input placeholder="e.g. Freelance, GPU Rental, Etsy..." value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 12px", color: T.text, fontSize: 14, marginBottom: 8, boxSizing: "border-box", fontFamily: "inherit", outline: "none" }} />
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input type="number" placeholder="£ Amount" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                style={{ flex: 1, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 12px", color: T.text, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
              <select value={form.frequency} onChange={e => setForm(p => ({ ...p, frequency: e.target.value }))}
                style={{ flex: 1, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 12px", color: T.text, fontSize: 14, fontFamily: "inherit", outline: "none" }}>
                {FREQS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            {form.amount && <div style={{ fontSize: 12, color: T.accent, marginBottom: 10, padding: "7px 10px", background: T.card, borderRadius: 8 }}>→ {fmt(toM(Number(form.amount), form.frequency))}/month equivalent</div>}
            <div style={{ display: "flex", gap: 8 }}>
              <PrimaryBtn style={{ flex: 2 }} onClick={() => { if (!form.name || !form.amount) return; setSideHustles(p => [...p, { ...form, id: Date.now(), amount: Number(form.amount) }]); setForm({ name: "", amount: "", frequency: "Monthly" }); setAdding(false); }}>Add</PrimaryBtn>
              <GhostBtn style={{ flex: 1 }} onClick={() => setAdding(false)}>Cancel</GhostBtn>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

// ── SETTINGS ─────────────────────────────────────────────────────────────────
function SettingsTab({ themeKey, setThemeKey, partnerName, setPartnerName, lightMode, setLightMode, onSignOut, user }) {
  const T = useT();
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(partnerName);

  return (
    <div style={{ padding: "0 16px 110px" }}>
      <div style={{ paddingTop: 52, paddingBottom: 20 }}>
        <div style={{ fontSize: 22, fontFamily: "'Playfair Display',serif", fontWeight: 700, color: T.text }}>Settings</div>
      </div>

      {/* Light / Dark toggle */}
      <Card style={{ marginBottom: 16 }}>
        <Label>Appearance</Label>
        <div style={{ display: "flex", gap: 10 }}>
          {[{ val: false, label: "Dark", icon: "🌑" }, { val: true, label: "Light", icon: "☀️" }].map(opt => {
            const active = lightMode === opt.val;
            return (
              <button key={String(opt.val)} onClick={() => setLightMode(opt.val)} style={{
                flex: 1, padding: "14px 10px", borderRadius: 14, cursor: "pointer",
                border: `2px solid ${active ? T.primary : T.border}`,
                background: active ? `${T.primary}18` : T.card2,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transition: "all .2s",
              }}>
                <span style={{ fontSize: 24 }}>{opt.icon}</span>
                <span style={{ fontSize: 13, fontWeight: active ? 700 : 400, color: active ? T.primary : T.muted }}>{opt.label}</span>
                {active && <div style={{ width: 18, height: 18, borderRadius: "50%", background: T.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#000", fontWeight: 700 }}>✓</div>}
              </button>
            );
          })}
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <Label>Theme</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Object.entries(THEMES).map(([key, theme]) => {
            const active = themeKey === key;
            const previewT = applyMode(theme, lightMode);
            return (
              <button key={key} onClick={() => setThemeKey(key)} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", width: "100%",
                background: active ? `${theme.primary}18` : T.card2,
                border: `2px solid ${active ? theme.primary : T.border}`,
                borderRadius: 14, cursor: "pointer", textAlign: "left", transition: "all .2s",
              }}>
                <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                  {[previewT.bg, theme.primary, theme.secondary, previewT.card].map((col, i) => (
                    <div key={i} style={{ width: 12, height: 34, borderRadius: 4, background: col, border: `1px solid ${previewT.border}` }} />
                  ))}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, color: active ? theme.primary : T.text, fontWeight: active ? 700 : 400 }}>{theme.emoji} {theme.name}</div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>
                    {key === "fire"   && "Warm oranges & yellows"}
                    {key === "water"  && "Cool blues & purples"}
                    {key === "nature" && "Fresh greens & lime"}
                    {key === "floral" && "Soft pinks & lilac"}
                    {key === "earth"  && "Rich browns & terracotta"}
                  </div>
                </div>
                {active && <div style={{ width: 22, height: 22, borderRadius: "50%", background: theme.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#000", fontWeight: 700, flexShrink: 0 }}>✓</div>}
              </button>
            );
          })}
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <Label>Partner Name</Label>
        <div style={{ padding: "12px 14px", background: T.card2, borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>💑</span>
          {editingName ? (
            <div style={{ flex: 1, display: "flex", gap: 8 }}>
              <input autoFocus value={nameDraft} onChange={e => setNameDraft(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { setPartnerName(nameDraft); setEditingName(false); }}}
                style={{ flex: 1, background: T.bg, border: `1px solid ${T.primary}`, borderRadius: 8, padding: "7px 10px", color: T.text, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
              <PrimaryBtn onClick={() => { setPartnerName(nameDraft); setEditingName(false); }} style={{ padding: "7px 14px", fontSize: 13 }}>Save</PrimaryBtn>
            </div>
          ) : (
            <>
              <span style={{ flex: 1, fontSize: 15, color: T.text }}>{partnerName || "Your partner"}</span>
              <GhostBtn onClick={() => { setNameDraft(partnerName); setEditingName(true); }} style={{ fontSize: 12, padding: "5px 12px" }}>Edit</GhostBtn>
            </>
          )}
        </div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 10 }}>Shown on the home page bill split summary</div>
      </Card>

      <Card>
        <Label>Account</Label>
        <div style={{ padding: "12px 14px", background: T.card2, borderRadius: 12, marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 4 }}>Signed in as</div>
          <div style={{ fontSize: 14, color: T.text }}>{user?.email}</div>
        </div>
        <button onClick={onSignOut} style={{ width: "100%", padding: "12px", background: "transparent", border: `1px solid ${T.red}`, borderRadius: 12, color: T.red, fontFamily: "inherit", fontSize: 14, cursor: "pointer" }}>
          Sign Out
        </button>
      </Card>
    </div>
  );
}

// ── APP ──────────────────────────────────────────────────────────────────────
export default function EmberApp({ user, onSignOut }) {
  const [tab, setTab] = useState("home");
  const [themeKey, setThemeKey] = useState("fire");
  const [lightMode, setLightMode] = useState(false);
  const [income, setIncome] = useState(2800);
  const [sideHustles, setSideHustles] = useState([]);
  const [transactions, setTransactions] = useState(INIT_TXN);
  const [budgets, setBudgets] = useState(INIT_BUDGETS);
  const [catNames, setCatNames] = useState({});
  const [splits, setSplits] = useState({});
  const [partnerName, setPartnerName] = useState("Partner");
  const [bankConnected, setBankConnected] = useState(false);

  // Load data from Supabase on mount
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      // Load settings
      const { data: s } = await supabase.from('settings').select('*').eq('user_id', user.id).single();
      if (s) {
        if (s.income) setIncome(s.income);
        if (s.partner_name) setPartnerName(s.partner_name);
        if (s.theme) setThemeKey(s.theme);
        if (s.light_mode !== undefined) setLightMode(s.light_mode);
        if (s.cat_names) setCatNames(s.cat_names);
      }
      // Load transactions
      const { data: txns } = await supabase.from('transactions').select('*').eq('user_id', user.id);
      if (txns && txns.length > 0) {
        setTransactions(txns.map(t => ({ id: t.id, name: t.name, amount: t.amount, category: t.category, date: t.date })));
        setBankConnected(true);
      }
      // Load splits
      const { data: sp } = await supabase.from('splits').select('*').eq('user_id', user.id);
      if (sp) {
        const splitsMap = {};
        sp.forEach(s => { splitsMap[s.transaction_id] = s.my_share; });
        setSplits(splitsMap);
      }
    };
    load();
  }, [user]);

  // Save settings to Supabase whenever they change
  useEffect(() => {
    if (!user) return;
    supabase.from('settings').upsert({ user_id: user.id, income, partner_name: partnerName, theme: themeKey, light_mode: lightMode, cat_names: catNames }, { onConflict: 'user_id' });
  }, [income, partnerName, themeKey, lightMode, catNames]);

  const connectBank = () => {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.NEXT_PUBLIC_TRUELAYER_CLIENT_ID || '',
      scope: 'info accounts balance cards transactions',
      redirect_uri: `${window.location.origin}/api/auth/callback`,
      providers: 'uk-ob-all uk-oauth-all',
    });
    window.location.href = `https://auth.truelayer.com/?${params}`;
  };

  const T = applyMode(THEMES[themeKey], lightMode);
  const toM = (a, f) => f === "Weekly" ? a*52/12 : f === "Fortnightly" ? a*26/12 : f === "One-off" ? a/12 : a;
  const totalIncome = income + sideHustles.reduce((s, h) => s + toM(h.amount, h.frequency), 0);

  return (
    <ThemeCtx.Provider value={T}>
      <div style={{ background: T.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", fontFamily: "'Jost',sans-serif", transition: "background .4s" }}>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Jost:wght@300;400;500;600&family=Outfit:wght@400;600;700&display=swap" rel="stylesheet" />
        <style>{`*{box-sizing:border-box}input::placeholder{color:#4b5563}select{appearance:none}::-webkit-scrollbar{width:0}`}</style>

        {tab === "home"       && <HomeTab income={totalIncome} setIncome={setIncome} transactions={transactions} splits={splits} partnerName={partnerName} bankConnected={bankConnected} connectBank={connectBank} />}
        {tab === "insights"   && <InsightsTab income={totalIncome} transactions={transactions} splits={splits} />}
        {tab === "savings"    && <SavingsTab income={totalIncome} transactions={transactions} splits={splits} />}
        {tab === "income"     && <IncomeTab income={income} setIncome={setIncome} sideHustles={sideHustles} setSideHustles={setSideHustles} />}
        {tab === "categories" && <CategoriesTab transactions={transactions} setTransactions={setTransactions} budgets={budgets} setBudgets={setBudgets} catNames={catNames} setCatNames={setCatNames} splits={splits} setSplits={setSplits} partnerName={partnerName} />}
        {tab === "settings"   && <SettingsTab themeKey={themeKey} setThemeKey={setThemeKey} partnerName={partnerName} setPartnerName={setPartnerName} lightMode={lightMode} setLightMode={setLightMode} onSignOut={onSignOut} user={user} />}

        <BottomNav tab={tab} setTab={setTab} />
      </div>
    </ThemeCtx.Provider>
  );
}
