import { useState, lazy, Suspense, useTransition } from "react";
import { ThemeColors, defaultTheme } from "./settings-types";
import {
  BookOpen, Users, Shield, Clock, BarChart3, FileText, Library,
  PanelLeftOpen, PanelLeftClose, ChevronRight, BotMessageSquare, X,
} from "lucide-react";

const AgentsSettings = lazy(() => import("./settings-agents").then(m => ({ default: m.AgentsSettings })));
const HistorySettings = lazy(() => import("./settings-history").then(m => ({ default: m.HistorySettings })));
const UsageSettings = lazy(() => import("./settings-usage").then(m => ({ default: m.UsageSettings })));
const KnowledgeBasesSettings = lazy(() => import("./settings-knowledge").then(m => ({ default: m.KnowledgeBasesSettings })));
const UsersSettings = lazy(() => import("./settings-users").then(m => ({ default: m.UsersSettings })));
const RolesSettings = lazy(() => import("./settings-roles").then(m => ({ default: m.RolesSettings })));
const AuditLogsSettings = lazy(() => import("./settings-audit").then(m => ({ default: m.AuditLogsSettings })));

const NAV = [
  { id: "agents", label: "Agents", Icon: BotMessageSquare },
  { id: "knowledge", label: "Knowledge Bases", Icon: BookOpen },
  { id: "users", label: "Users", Icon: Users },
  { id: "roles", label: "Roles", Icon: Shield },
];
const MON = [
  { id: "history", label: "History", Icon: Clock },
  { id: "usage", label: "Usage", Icon: BarChart3 },
  { id: "audit", label: "Audit Logs", Icon: FileText },
];
const ALL = [...NAV, ...MON];

export function SettingsPage({ onBack, darkMode = false, t: tProp, logoSrc, logoDarkSrc, onToggleDarkMode }: { onBack: () => void; darkMode?: boolean; t?: ThemeColors; logoSrc?: string; logoDarkSrc?: string; onToggleDarkMode?: () => void }) {
  const t = tProp || defaultTheme;
  const dm = darkMode;
  const [activeTab, setActiveTab] = useState("agents");
  const [monitorOpen, setMonitorOpen] = useState(true);
  const [sideOpen, setSideOpen] = useState(true);
  const [isPending, startTransition] = useTransition();

  const activeBg = dm ? "#1e1433" : "#f0ebff";

  const handleTabChange = (tabId: string) => {
    startTransition(() => {
      setActiveTab(tabId);
    });
  };

  const TabBtn = ({ item, isActive }: { item: typeof ALL[0]; isActive: boolean }) => (
    <button onClick={() => handleTabChange(item.id)} className="bg-transparent border-none cursor-pointer p-[8px] rounded-[8px] transition-colors flex items-center justify-center" style={{ backgroundColor: isActive ? activeBg : "transparent" }} onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = t.bgHover; }} onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = isActive ? activeBg : "transparent"; }} title={item.label}>
      <item.Icon size={20} color={isActive ? "#7f56d9" : t.textTertiary} />
    </button>
  );

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full" data-dark={dm ? "true" : undefined}>
      <div className="flex flex-1 min-h-0">
        <div className={`relative self-stretch shrink-0 transition-all duration-300 z-50 ${sideOpen ? "w-[251px]" : "w-[60px]"}`} style={{ borderRight: `0.5px solid ${t.borderLight}` }}>
          {!sideOpen && (
            <div className="flex flex-col items-center py-[16px] size-full relative" style={{ backgroundColor: t.bgSecondary }}>
              <button onClick={() => setSideOpen(true)} className="bg-transparent border-none cursor-pointer p-[6px] rounded-[6px] transition-colors mb-[20px] shrink-0" style={{ color: t.textTertiary }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = t.bgHover)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")} title="Expand sidebar">
                <PanelLeftOpen size={20} />
              </button>
              <div className="flex flex-col items-center gap-[4px] w-full shrink-0">
                {NAV.map(item => <TabBtn key={item.id} item={item} isActive={activeTab === item.id} />)}
                <div className="w-[24px] my-[4px]" style={{ borderTop: `1px solid ${t.border}` }} />
                {MON.map(item => <TabBtn key={item.id} item={item} isActive={activeTab === item.id} />)}
              </div>
            </div>
          )}
          {sideOpen && (
            <div className="flex flex-col gap-[24px] items-start pl-[20px] pr-[16px] py-[20px] size-full relative" style={{ backgroundColor: t.bgSecondary }}>
              <div className="flex items-center justify-between w-full shrink-0">
                {(logoSrc || logoDarkSrc) && (
                  <button onClick={onBack} className="bg-transparent border-none p-0 cursor-pointer h-[31.695px] w-[110px]">
                    <img alt="Tawuniya" className="max-w-none object-cover size-full" src={dm ? (logoDarkSrc || logoSrc) : (logoSrc || logoDarkSrc)} />
                  </button>
                )}
                <button onClick={onBack} className="bg-transparent border-none cursor-pointer p-1 rounded-[6px] transition-colors" style={{ color: t.textTertiary }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = t.bgHover)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                  <X size={20} />
                </button>
              </div>
              <div className="flex flex-col flex-1 gap-[16px] items-start w-full min-h-0">
                <p className="leading-[20px] text-[14px] shrink-0" style={{ color: t.textSecondary }}>Settings</p>
                <div className="flex flex-col gap-[4px] items-start w-full">
                  {NAV.map(item => {
                    const isActive = activeTab === item.id;
                    return (
                      <button key={item.id} onClick={() => handleTabChange(item.id)} className="flex gap-[8px] items-center w-full cursor-pointer bg-transparent border-none p-[6px_8px] rounded-[6px] transition-colors text-left" style={{ backgroundColor: isActive ? activeBg : "transparent" }} onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = t.bgHover; }} onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = isActive ? activeBg : "transparent"; }}>
                        <item.Icon size={20} color={isActive ? "#7f56d9" : t.textTertiary} />
                        <p className="leading-[20px] text-[14px] whitespace-nowrap" style={{ color: isActive ? "#7f56d9" : t.text }}>{item.label}</p>
                      </button>
                    );
                  })}
                  <button onClick={() => setMonitorOpen(!monitorOpen)} className="flex gap-[8px] items-center w-full cursor-pointer bg-transparent border-none p-[6px_8px] rounded-[6px] transition-colors text-left" onMouseEnter={e => { e.currentTarget.style.backgroundColor = t.bgHover; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                    <Library size={20} color={t.textTertiary} />
                    <p className="flex-1 leading-[20px] text-[14px] text-left" style={{ color: t.text }}>Monitoring</p>
                    <ChevronRight size={14} color={t.textTertiary} className="shrink-0 transition-transform duration-200" style={{ transform: monitorOpen ? "rotate(90deg)" : "rotate(0deg)" }} />
                  </button>
                  {monitorOpen && (
                    <div className="flex flex-col gap-[4px] pl-[32px] w-full">
                      {MON.map(item => {
                        const isActive = activeTab === item.id;
                        return (
                          <button key={item.id} onClick={() => handleTabChange(item.id)} className="flex gap-[8px] items-center w-full cursor-pointer bg-transparent border-none p-[6px_8px] rounded-[6px] transition-colors text-left" style={{ backgroundColor: isActive ? activeBg : "transparent" }} onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = t.bgHover; }} onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = isActive ? activeBg : "transparent"; }}>
                            <item.Icon size={20} color={isActive ? "#7f56d9" : t.textTertiary} />
                            <p className="leading-[20px] text-[14px] whitespace-nowrap" style={{ color: isActive ? "#7f56d9" : t.text }}>{item.label}</p>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={`flex-1 min-w-0 flex flex-col ${activeTab === "history" ? "overflow-hidden" : "overflow-y-auto"}`}>
          {activeTab === "agents" && <Suspense fallback={<div>Loading...</div>}><AgentsSettings t={t} dm={dm} /></Suspense>}
          {activeTab === "knowledge" && <Suspense fallback={<div>Loading...</div>}><KnowledgeBasesSettings t={t} dm={dm} /></Suspense>}
          {activeTab === "users" && <Suspense fallback={<div>Loading...</div>}><UsersSettings t={t} dm={dm} /></Suspense>}
          {activeTab === "roles" && <Suspense fallback={<div>Loading...</div>}><RolesSettings t={t} dm={dm} /></Suspense>}
          {activeTab === "history" && <Suspense fallback={<div>Loading...</div>}><HistorySettings t={t} dm={dm} /></Suspense>}
          {activeTab === "usage" && <Suspense fallback={<div>Loading...</div>}><UsageSettings t={t} dm={dm} /></Suspense>}
          {activeTab === "audit" && <Suspense fallback={<div>Loading...</div>}><AuditLogsSettings t={t} dm={dm} /></Suspense>}
        </div>
      </div>
    </div>
  );
}