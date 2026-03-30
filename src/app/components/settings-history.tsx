import { useState, useMemo } from "react";
import { Search, Sparkles } from "lucide-react";
import type { ThemeColors } from "./settings-types";

interface HMsg { role: "user" | "ai"; content: string; timestamp: string; }
interface HItem { id: string; session: string; user: string; email: string; messages: number; duration: string; timestamp: Date; model: string; tokensUsed: number; satisfaction: "positive" | "neutral" | "negative"; conversation: HMsg[]; }

function fmtTs(date: Date) {
  const d = Date.now() - date.getTime(), h = Math.floor(d / 3600000);
  if (h < 1) return `${Math.floor(d / 60000)}m ago`;
  if (h < 24) return `${h}h ago`;
  return date.toLocaleDateString("en-SA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

const H: HItem[] = [
  { id: "1", session: "Health Insurance Inquiry", user: "Abdullah Al-Rashid", email: "abdullah@tawuniya.com", messages: 12, duration: "8m 32s", timestamp: new Date(2026, 2, 2, 9, 14), model: "GPT-4o", tokensUsed: 4820, satisfaction: "positive", conversation: [
    { role: "user", content: "What does Tawuniya's health plan cover?", timestamp: "9:14 AM" },
    { role: "ai", content: "Tawuniya's plan covers:\n\n- **Inpatient**: Hospital, surgery, ICU\n- **Outpatient**: Consultations\n- **Emergency**: 24/7 ER", timestamp: "9:14 AM" },
  ]},
  { id: "2", session: "Motor Insurance Quote", user: "Sara Al-Dosari", email: "sara.d@tawuniya.com", messages: 8, duration: "5m 15s", timestamp: new Date(2026, 2, 2, 8, 47), model: "GPT-4o", tokensUsed: 3150, satisfaction: "positive", conversation: [
    { role: "user", content: "Motor insurance quote for a 2025 Camry?", timestamp: "8:47 AM" },
    { role: "ai", content: "**2025 Toyota Camry**:\n\n**TPL**: ~SAR 1,200/yr\n**Comprehensive**: ~SAR 3,800/yr", timestamp: "8:47 AM" },
  ]},
  { id: "3", session: "Claims Process", user: "Mohammed Al-Harbi", email: "m.harbi@tawuniya.com", messages: 15, duration: "12m 04s", timestamp: new Date(2026, 2, 1, 16, 32), model: "GPT-4o", tokensUsed: 6430, satisfaction: "neutral", conversation: [
    { role: "user", content: "How do I file a health claim?", timestamp: "4:32 PM" },
    { role: "ai", content: "**Direct Settlement** - Visit network hospital with card.\n\n**Reimbursement** - Submit receipts via app.", timestamp: "4:32 PM" },
  ]},
  { id: "4", session: "Travel Insurance", user: "Fatima Al-Zahrani", email: "fatima.z@tawuniya.com", messages: 6, duration: "3m 48s", timestamp: new Date(2026, 2, 1, 14, 5), model: "GPT-4o", tokensUsed: 1890, satisfaction: "positive", conversation: [
    { role: "user", content: "Travel insurance for Umrah?", timestamp: "2:05 PM" },
    { role: "ai", content: "**Umrah travel insurance**:\n- Medical up to SAR 200K\n- Trip cancellation\n- From SAR 75 for 15 days.", timestamp: "2:05 PM" },
  ]},
];

export function HistorySettings({ t, dm }: { t: ThemeColors; dm: boolean }) {
  const satCfg = { positive: { color: "#17B26A" }, neutral: { color: "#b54708" }, negative: { color: "#b42318" } };
  const users = useMemo(() => {
    const m = new Map<string, { name: string; email: string; chatCount: number; totalMessages: number; compliance: string }>();
    const nc = new Set(["m.harbi@tawuniya.com"]);
    H.forEach(i => { const e = m.get(i.email); if (e) { e.chatCount++; e.totalMessages += i.messages; } else m.set(i.email, { name: i.user, email: i.email, chatCount: 1, totalMessages: i.messages, compliance: nc.has(i.email) ? "nc" : "c" }); });
    return Array.from(m.values());
  }, []);

  const [selEmail, setSelEmail] = useState(users[0]?.email ?? "");
  const [selChatId, setSelChatId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const filtered = useMemo(() => { if (!search.trim()) return users; const q = search.toLowerCase(); return users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)); }, [users, search]);
  const chats = useMemo(() => H.filter(i => i.email === selEmail).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()), [selEmail]);
  const active = useMemo(() => { if (selChatId) { const f = chats.find(c => c.id === selChatId); if (f) return f; } return chats[0] ?? null; }, [chats, selChatId]);
  const selUser = users.find(u => u.email === selEmail);

  return (
    <div className="flex flex-col h-full overflow-hidden p-6 gap-4">
      <div className="shrink-0">
        <h2 className="text-[20px] m-0" style={{ color: t.text }}>History</h2>
        <p className="text-[13px] m-0 mt-1" style={{ color: t.textMuted }}>Monitor user conversations and compliance status.</p>
      </div>
      <div className="flex flex-1 min-h-0 overflow-hidden rounded-[12px]" style={{ border: `1px solid ${t.border}`, backgroundColor: dm ? "#141720" : "#ffffff" }}>
        {/* Users */}
        <div className="w-[280px] shrink-0 flex flex-col" style={{ borderRight: `1px solid ${t.border}` }}>
          <div className="relative shrink-0" style={{ borderBottom: `1px solid ${t.border}` }}>
            <div className="p-3 flex items-center justify-between">
              <div><span className="text-[13px] font-semibold" style={{ color: t.text }}>Users</span><br/><span className="text-[11px]" style={{ color: t.textMuted }}>{users.length} total</span></div>
              <button onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearch(""); }} className="size-[30px] rounded-[8px] flex items-center justify-center cursor-pointer transition-colors" style={{ backgroundColor: showSearch ? (dm ? "#252830" : "#f0ebff") : "transparent", color: showSearch ? "#7f56d9" : t.textMuted, border: `1px solid ${showSearch ? "#7f56d9" : t.border}` }} onMouseEnter={e => { if (!showSearch) e.currentTarget.style.backgroundColor = t.bgHover; }} onMouseLeave={e => { if (!showSearch) e.currentTarget.style.backgroundColor = "transparent"; }}>
                <Search size={14} />
              </button>
            </div>
            {showSearch && (
              <div className="px-3 py-2.5" style={{ borderTop: `1px solid ${t.border}` }}>
                <input autoFocus type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full px-3 py-2 rounded-[8px] text-[12px] outline-none" style={{ border: `1px solid ${t.border}`, backgroundColor: t.inputBg, color: t.text }} />
              </div>
            )}
          </div>
          <div className="px-4 py-2 shrink-0 flex items-center gap-4" style={{ borderBottom: `1px solid ${t.border}` }}>
            <div className="flex items-center gap-1.5"><div className="size-[7px] rounded-full bg-[#17b26a]" /><span className="text-[10px]" style={{ color: t.textMuted }}>Compliant</span></div>
            <div className="flex items-center gap-1.5"><div className="size-[7px] rounded-full bg-[#f04438]" /><span className="text-[10px]" style={{ color: t.textMuted }}>Non-Compliant</span></div>
          </div>
          <div className="flex-1 overflow-y-auto pt-1.5">
            {filtered.map(u => { const sel = u.email === selEmail; return (
              <button key={u.email} onClick={() => { setSelEmail(u.email); setSelChatId(null); }} className="flex items-center gap-3 px-3 py-3 mx-2 my-0.5 border-none cursor-pointer text-left transition-colors rounded-[10px]" style={{ width: "calc(100% - 16px)", backgroundColor: sel ? (dm ? "#1a1d24" : "#f4f4f5") : "transparent" }} onMouseEnter={e => { if (!sel) e.currentTarget.style.backgroundColor = t.bgHover; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = sel ? (dm ? "#1a1d24" : "#f4f4f5") : "transparent"; }}>
                <div className="size-[36px] rounded-full flex items-center justify-center text-[12px] text-white shrink-0" style={{ backgroundColor: sel ? "#6b7280" : "#A4A7AE" }}>{u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                <div className="flex-1 min-w-0"><p className="text-[13px] m-0 truncate" style={{ fontWeight: sel ? 600 : 400, color: sel ? t.text : t.textSecondary }}>{u.name}</p><p className="text-[11px] m-0 truncate" style={{ color: t.textMuted }}>{u.email}</p></div>
                <div className="size-[8px] rounded-full shrink-0" style={{ backgroundColor: u.compliance === "c" ? "#17b26a" : "#f04438" }} />
              </button>
            ); })}
            {filtered.length === 0 && <div className="px-4 py-8 text-center text-[12px]" style={{ color: t.textMuted }}>No users found</div>}
          </div>
          {selUser && (
            <div className="p-3 shrink-0" style={{ borderTop: `1px solid ${t.border}` }}>
              <div className="flex items-center justify-between text-[11px]" style={{ color: t.textMuted }}><span>{selUser.chatCount} sessions</span><span>{selUser.totalMessages} messages</span></div>
            </div>
          )}
        </div>
        {/* Sessions */}
        <div className="w-[300px] shrink-0 flex flex-col" style={{ borderRight: `1px solid ${t.border}` }}>
          <div className="px-4 py-3 shrink-0 h-[60px] box-border" style={{ borderBottom: `1px solid ${t.border}` }}>
            <h4 className="text-[14px] m-0" style={{ color: t.text }}>Conversations</h4>
            <p className="text-[11px] m-0 mt-0.5" style={{ color: t.textMuted }}>{chats.length} session{chats.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex-1 overflow-y-auto pt-1.5">
            {chats.map(c => { const a = active?.id === c.id; return (
              <button key={c.id} onClick={() => setSelChatId(c.id)} className="flex flex-col gap-2 px-3 py-3 mx-2 my-0.5 border-none cursor-pointer text-left transition-colors rounded-[10px]" style={{ width: "calc(100% - 16px)", backgroundColor: a ? (dm ? "#1a1d24" : "#f4f4f5") : "transparent" }} onMouseEnter={e => { if (!a) e.currentTarget.style.backgroundColor = t.bgHover; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = a ? (dm ? "#1a1d24" : "#f4f4f5") : "transparent"; }}>
                <div className="flex items-start justify-between gap-2"><p className="text-[13px] m-0 leading-[18px]" style={{ fontWeight: a ? 600 : 500, color: t.text }}>{c.session}</p><span className="shrink-0 size-[8px] rounded-full mt-1.5" style={{ backgroundColor: satCfg[c.satisfaction].color }} /></div>
                <span className="text-[10px]" style={{ color: t.textMuted }}>{fmtTs(c.timestamp)}</span>
              </button>
            ); })}
          </div>
        </div>
        {/* Detail */}
        <div className="flex-1 flex flex-col min-w-0">
          {active ? (<>
            <div className="px-5 py-3 shrink-0 h-[60px] box-border" style={{ borderBottom: `1px solid ${t.border}` }}>
              <h3 className="text-[15px] m-0 truncate" style={{ color: t.text }}>{active.session}</h3>
              <p className="text-[11px] m-0 mt-0.5" style={{ color: t.textMuted }}>{active.timestamp.toLocaleDateString("en-SA", { weekday: "short", month: "short", day: "numeric" })}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
              {active.conversation.map((msg, idx) => msg.role === "user" ? (
                <div key={idx} className="flex flex-col items-end gap-1">
                  <span className="text-[10px] mr-1" style={{ color: t.textMuted }}>{msg.timestamp}</span>
                  <div className="rounded-[16px] rounded-br-[4px] px-4 py-3 text-[13px] leading-[20px] max-w-[65%]" style={{ whiteSpace: "pre-wrap", backgroundColor: dm ? "#2a2d35" : "#f4f4f5", color: t.text }}>{msg.content}</div>
                </div>
              ) : (
                <div key={idx} className="flex items-start gap-2.5 max-w-[80%]">
                  <div className="shrink-0 size-[28px] rounded-[8px] flex items-center justify-center mt-5" style={{ backgroundColor: dm ? "#2d1f54" : "#f0ebff" }}>
                    <Sparkles size={14} color="#7f56d9" />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2"><span className="text-[12px] text-[#7f56d9] font-semibold">Tawuniya AI</span><span className="text-[10px]" style={{ color: t.textMuted }}>{msg.timestamp}</span></div>
                    <div className="rounded-[16px] rounded-tl-[4px] px-4 py-3 text-[13px] leading-[20px]" style={{ whiteSpace: "pre-wrap", border: `1px solid ${t.border}`, backgroundColor: dm ? "#1a1d24" : "#f9fafb", color: t.textSecondary }} dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>") }} />
                  </div>
                </div>
              ))}
            </div>
          </>) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[14px]" style={{ color: t.textMuted }}>Select a user to view conversations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
