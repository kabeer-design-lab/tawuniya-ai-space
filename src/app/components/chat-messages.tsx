import { useRef, useEffect, useCallback } from "react";
import { type Message, type ThemeColors, copyToClipboard, renderMarkdown } from "./chat-data";
import { Copy, Check, RefreshCw, BookOpen, FileText } from "lucide-react";

function RenderMD({ text }: { text: string }) {
  const items = renderMarkdown(text);
  return (
    <div className="flex flex-col">
      {items.map(item => {
        if (item.type === "spacer") return <div key={item.key} className="h-2" />;
        return <div key={item.key} className="my-0.5"><span dangerouslySetInnerHTML={{ __html: item.html }} /></div>;
      })}
    </div>
  );
}

export function ChatMessages({ messages, isTyping, dm, t, copiedMsgId, expandedSourcesMsgId, onCopy, onRegenerate, onToggleSources }: {
  messages: Message[]; isTyping: boolean; dm: boolean; t: ThemeColors;
  copiedMsgId: string | null; expandedSourcesMsgId: string | null;
  onCopy: (msgId: string) => void; onRegenerate: (msgId: string) => void; onToggleSources: (msgId: string) => void;
}) {
  const endRef = useRef<HTMLDivElement>(null);
  const scroll = useCallback(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, []);
  useEffect(() => { scroll(); }, [messages.length, scroll]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4">
      <div className="max-w-[720px] mx-auto flex flex-col gap-6">
        {messages.map(msg => (
          <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
            <div className={`text-[14px] leading-[24px] ${msg.role === "user" ? "rounded-[18px] rounded-br-[4px] px-4 py-2.5 max-w-[85%]" : "w-full"}`} style={msg.role === "user" ? { backgroundColor: t.userBubbleBg, border: `1px solid ${t.userBubbleBorder}`, color: t.text } : { color: t.textSecondary }}>
              {msg.role === "assistant" ? <RenderMD text={msg.content} /> : msg.content}
            </div>
            {msg.role === "assistant" && (
              <div className="flex flex-col gap-1 mt-1.5 w-full">
                <div className="flex items-center gap-1">
                  <button onClick={() => { copyToClipboard(msg.content.replace(/\*\*/g, "")); onCopy(msg.id); }} className="border-none cursor-pointer p-1.5 rounded-[6px] transition-colors" style={{ backgroundColor: copiedMsgId === msg.id ? (dm ? "#0d2b1a" : "#ecfdf3") : "transparent", color: copiedMsgId === msg.id ? "#17B26A" : t.textMuted }} onMouseEnter={e => { if (copiedMsgId !== msg.id) { e.currentTarget.style.backgroundColor = t.bgHover; e.currentTarget.style.color = t.textTertiary; } }} onMouseLeave={e => { if (copiedMsgId !== msg.id) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = t.textMuted; } }} title={copiedMsgId === msg.id ? "Copied!" : "Copy"}>
                    {copiedMsgId === msg.id ? <Check size={15} /> : <Copy size={15} />}
                  </button>
                  <button onClick={() => onRegenerate(msg.id)} className="border-none cursor-pointer p-1.5 rounded-[6px] transition-colors" style={{ backgroundColor: "transparent", color: t.textMuted }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = t.bgHover; e.currentTarget.style.color = t.textTertiary; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = t.textMuted; }} title="Regenerate">
                    <RefreshCw size={15} />
                  </button>
                </div>
                {expandedSourcesMsgId === msg.id && msg.sources && msg.sources.length > 0 && (
                  <SourcesPanel sources={msg.sources} dm={dm} t={t} />
                )}
              </div>
            )}
          </div>
        ))}
        {isTyping && <TypingIndicator t={t} />}
        <div ref={endRef} />
      </div>
    </div>
  );
}

function SourcesPanel({ sources, dm, t }: { sources: NonNullable<Message["sources"]>; dm: boolean; t: ThemeColors }) {
  const tc: Record<string, { bg: string; text: string; icon: string }> = {
    pdf: { bg: dm ? "#3d1c1c" : "#fef3f2", text: "#d92d20", icon: "#f04438" },
    docx: { bg: dm ? "#1c2a3d" : "#eff8ff", text: "#1570ef", icon: "#2e90fa" },
    xlsx: { bg: dm ? "#1c3d24" : "#ecfdf3", text: "#067647", icon: "#17b26a" },
    txt: { bg: dm ? "#252830" : "#f9fafb", text: dm ? "#a0a4ab" : "#535862", icon: dm ? "#8b8f97" : "#717680" },
    csv: { bg: dm ? "#1c3d24" : "#ecfdf3", text: "#067647", icon: "#17b26a" },
  };
  return (
    <div className="mt-1.5 rounded-[10px] overflow-hidden" style={{ border: `1px solid ${t.border}`, backgroundColor: t.sourcesBg }}>
      <div className="px-3 py-2 flex items-center gap-1.5" style={{ backgroundColor: t.sourcesHeader, borderBottom: `1px solid ${t.border}` }}>
        <BookOpen size={13} color={t.textTertiary} />
        <span className="text-[12px]" style={{ color: t.textTertiary }}>Knowledge Base Sources</span>
      </div>
      <div className="flex flex-col">
        {sources.map((src, idx) => {
          const c = tc[src.type] || tc.txt;
          return (
            <div key={idx} className="flex items-center gap-3 px-3 py-2.5 transition-colors" style={{ borderBottom: idx < sources.length - 1 ? `1px solid ${t.border}` : "none" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = t.bgHover)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
              <div className="shrink-0 size-[32px] rounded-[6px] flex items-center justify-center" style={{ backgroundColor: c.bg }}>
                <FileText size={16} color={c.icon} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] truncate" style={{ color: t.text }}>{src.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] uppercase" style={{ backgroundColor: c.bg, color: c.text }}>{src.type}</span>
                  <span className="text-[11px]" style={{ color: t.textMuted }}>Relevance</span>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-1.5">
                <div className="w-[48px] h-[4px] rounded-full overflow-hidden" style={{ backgroundColor: t.border }}>
                  <div className="h-full rounded-full" style={{ width: `${src.relevance}%`, backgroundColor: src.relevance >= 90 ? "#17b26a" : src.relevance >= 75 ? "#f79009" : "#a4a7ae" }} />
                </div>
                <span className="text-[11px] w-[28px] text-right" style={{ color: t.textTertiary }}>{src.relevance}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TypingIndicator({ t }: { t: ThemeColors }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="ai-sparkle-container shrink-0">
        <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
          <path className="sparkle-main" d="M14 2C14 2 15.2 7.8 17.2 9.8C19.2 11.8 25 13 25 13C25 13 19.2 14.2 17.2 16.2C15.2 18.2 14 24 14 24C14 24 12.8 18.2 10.8 16.2C8.8 14.2 3 13 3 13C3 13 8.8 11.8 10.8 9.8C12.8 7.8 14 2 14 2Z" fill="url(#sg1)" />
          <defs><linearGradient id="sg1" x1="14" y1="2" x2="14" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#9E77ED" /><stop offset="1" stopColor="#6941C6" /></linearGradient></defs>
        </svg>
      </div>
      <span className="text-[14px] ai-thinking-text" style={{ color: t.textMuted }}>Thinking<span className="dot-1">.</span><span className="dot-2">.</span><span className="dot-3">.</span></span>
    </div>
  );
}
