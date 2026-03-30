export interface Message { id: string; role: "user" | "assistant"; content: string; timestamp: Date; sources?: SourceFile[]; }
export interface Chat { id: string; title: string; messages: Message[]; createdAt: Date; pinned?: boolean; }
export type SourceFile = { name: string; type: "pdf" | "docx" | "xlsx" | "txt" | "csv"; relevance: number };

const R: Record<string, string> = {
  health: `**Tawuniya Health Insurance**\n\n- **Tawuniya Vitality**: Wellness rewards program\n- **Individual Plans**: 3,000+ providers across KSA\n- **Corporate Plans**: CCHI-compliant solutions\n- **VIP Plans**: International hospital access\n\nAll plans include telemedicine, pharmacy, and dental/optical.`,
  motor: `**Tawuniya Motor Insurance**\n\n- **Comprehensive (Shaamil)**: Full protection\n- **TPL**: Mandatory per Saudi regulations\n- **Tawuniya Drive**: Up to 30% safe driving discount\n\n24/7 roadside assistance, 500+ workshops, Najm integration.`,
  travel: `**Tawuniya Travel Insurance**\n\n- **Umrah & Hajj**: Specialized pilgrim plans\n- **International**: Medical, cancellation, baggage\n- **Schengen Compliant**: EU visa plans\n\nMedical up to SAR 500,000, 24/7 global assistance.`,
  claims: `**Filing a Claim**\n\n1. **Mobile App**: Submit and track digitally\n2. **Online**: tawuniya.com.sa\n3. **Call**: 8001249990\n4. **Branch**: 60+ locations across KSA\n\nAverage processing: 5-7 business days.`,
  default: `I can help with:\n\n- **Insurance**: Health, Motor, Travel, Home\n- **Claims**: Filing, tracking, managing\n- **Policies**: Coverage and benefits\n\nTawuniya serves over 5 million customers across Saudi Arabia.`,
};

const S: Record<string, SourceFile[]> = {
  health: [{ name: "Health_Plans_2026.pdf", type: "pdf", relevance: 96 }, { name: "CCHI_Guidelines.pdf", type: "pdf", relevance: 88 }],
  motor: [{ name: "Motor_Policy_v4.pdf", type: "pdf", relevance: 94 }, { name: "Drive_Telematics.docx", type: "docx", relevance: 87 }],
  travel: [{ name: "Travel_Products.pdf", type: "pdf", relevance: 95 }],
  claims: [{ name: "Claims_Manual.pdf", type: "pdf", relevance: 97 }],
  default: [{ name: "Company_Overview.pdf", type: "pdf", relevance: 92 }],
};

export function getAIResponse(msg: string): { content: string; sources: SourceFile[] } {
  const l = msg.toLowerCase();
  if (l.includes("health") || l.includes("medical")) return { content: R.health, sources: S.health };
  if (l.includes("motor") || l.includes("car")) return { content: R.motor, sources: S.motor };
  if (l.includes("travel") || l.includes("umrah")) return { content: R.travel, sources: S.travel };
  if (l.includes("claim") || l.includes("file")) return { content: R.claims, sources: S.claims };
  return { content: R.default, sources: S.default };
}

export function generateId() { return Math.random().toString(36).substring(2, 11); }

export function copyToClipboard(text: string) {
  try { const t = document.createElement("textarea"); t.value = text; t.style.position = "fixed"; t.style.opacity = "0"; document.body.appendChild(t); t.select(); document.execCommand("copy"); document.body.removeChild(t); } catch {}
}

export const initialChats: Chat[] = [
  { id: "1", title: "Health Insurance Coverage Inquiry", messages: [
    { id: "m1", role: "user", content: "What health insurance plans does Tawuniya offer?", timestamp: new Date(2026, 2, 1, 9, 0) },
    { id: "m2", role: "assistant", content: R.health, timestamp: new Date(2026, 2, 1, 9, 1), sources: S.health },
  ], createdAt: new Date(2026, 2, 1, 9, 0) },
  { id: "2", title: "Motor Insurance Quote", messages: [
    { id: "m3", role: "user", content: "Tell me about motor insurance", timestamp: new Date(2026, 2, 1, 10, 0) },
    { id: "m4", role: "assistant", content: R.motor, timestamp: new Date(2026, 2, 1, 10, 1), sources: S.motor },
  ], createdAt: new Date(2026, 2, 1, 10, 0) },
  { id: "3", title: "Claims Process", messages: [
    { id: "m5", role: "user", content: "How do I file a claim?", timestamp: new Date(2026, 1, 28, 14, 0) },
    { id: "m6", role: "assistant", content: R.claims, timestamp: new Date(2026, 1, 28, 14, 1), sources: S.claims },
  ], createdAt: new Date(2026, 1, 28, 14, 0) },
];

export const modelOptions = ["Groq-gpt-oss:120b", "Tawuniya-LLM:70b", "GPT-4o", "Claude-3.5"];

export function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    let p = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    if (line.startsWith("- ")) return { key: i, type: "bullet" as const, html: "•" + p.substring(1) };
    if (/^\d+\./.test(line)) return { key: i, type: "numbered" as const, html: p };
    if (line.trim() === "") return { key: i, type: "spacer" as const, html: "" };
    return { key: i, type: "paragraph" as const, html: p };
  });
}

export interface ThemeColors {
  bg: string; bgSecondary: string; bgHover: string; bgActiveChat: string;
  border: string; borderLight: string; text: string; textSecondary: string;
  textTertiary: string; textMuted: string; inputBg: string; cardBg: string;
  dropdownBg: string; userBubbleBg: string; userBubbleBorder: string;
  sourcesBg: string; sourcesHeader: string; toastBg: string; toastText: string;
}

export function getThemeColors(dm: boolean): ThemeColors {
  return {
    bg: dm ? "#0f1117" : "#ffffff", bgSecondary: dm ? "#1a1d24" : "#f9fafb",
    bgHover: dm ? "#252830" : "#f5f5f5", bgActiveChat: dm ? "#1e1433" : "#f0ebff",
    border: dm ? "#2e3038" : "#e9eaeb", borderLight: dm ? "#23262e" : "#d5d7da",
    text: dm ? "#f0f1f3" : "#181d27", textSecondary: dm ? "#c8cad0" : "#414651",
    textTertiary: dm ? "#a0a4ab" : "#535862", textMuted: dm ? "#8b8f97" : "#717680",
    inputBg: dm ? "#1a1d24" : "#ffffff", cardBg: dm ? "#181b22" : "#ffffff",
    dropdownBg: dm ? "#1a1d24" : "#ffffff", userBubbleBg: dm ? "#252830" : "#f9fafb",
    userBubbleBorder: dm ? "#2e3038" : "#e9eaeb", sourcesBg: dm ? "#181b22" : "#fafafa",
    sourcesHeader: dm ? "#1a1d24" : "#f5f5f5", toastBg: dm ? "#f0f1f3" : "#181d27",
    toastText: dm ? "#181d27" : "#ffffff",
  };
}
