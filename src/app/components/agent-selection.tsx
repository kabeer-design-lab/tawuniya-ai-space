import { lazy, Suspense, useEffect, useRef, useState, startTransition } from "react";
import {
  ArrowRight, Compass, Crosshair, FileCheck, CarFront, ShieldCheck, HeartPulse,
  Presentation, UserCog, Settings, Briefcase, Moon, Sun, Globe, LogOut,
} from "lucide-react";
import imgLogo from "figma:asset/455d1356f9baed9a176feddf5ae4c24cab21915f.png";
import imgLogoDark from "figma:asset/bf27771b7e9882997d9b0115ee22db1b91239ba3.png";
import imgProfile from "figma:asset/eaf63db5ad466a39838ff2d2169a9d948dcd34bc.png";
import { defaultTheme } from "./settings-types";

const SettingsPage = lazy(() => import("./settings-page").then(m => ({ default: m.SettingsPage })));

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: typeof Briefcase;
  iconColor: string;
  number: number;
}

export const agents: Agent[] = [
  { id: "life", name: "Life Insurance Agent", description: "Supports employees with specialized knowledge and detailed answers related to life insurance and savings/investments plans.", icon: Briefcase, iconColor: "#3B82F6", number: 1 },
  { id: "strategic", name: "Strategy Agent", description: "Supports company-wide understanding of strategic objectives, long-term direction, and vision, ensuring consistent alignment across all business units.", icon: Compass, iconColor: "#7f56d9", number: 2 },
  { id: "stratify", name: "Stratify", description: "Supports the strategy team by analyzing, summarizing, and evaluating documents to ensure alignment with corporate strategy, while assisting in the development and refinement of new strategic initiatives.", icon: Crosshair, iconColor: "#F97316", number: 3 },
  { id: "legal-contract", name: "Legal Agent", description: "Provides employees with clear, compliant, and easy-to-understand explanations of legal matters, regulations and company policies.", icon: FileCheck, iconColor: "#10B981", number: 4 },
  { id: "car-expert", name: "Motor / Mobility Agent", description: "Delivers expert insights on automobiles, spare parts, pricing, and market trends to support motor insurance sector.", icon: CarFront, iconColor: "#EF4444", number: 5 },
  { id: "general-insurance", name: "General Insurance Agent", description: "Provides comprehensive knowledge across Tawuniya's full range of general insurance products and services.", icon: ShieldCheck, iconColor: "#6366F1", number: 6 },
  { id: "health-insurance", name: "Health Agent", description: "A health assistant offering expert medical support and doctor-approved guidance within health insurance.", icon: HeartPulse, iconColor: "#EC4899", number: 7 },
  { id: "pptx-generator", name: "PPT Generator AI Agent", description: "Creates professional PowerPoint presentations automatically, ensuring consistent Tawuniya look & feel to reducing manual effort.", icon: Presentation, iconColor: "#F59E0B", number: 8 },
  { id: "hr-policy", name: "HR Agent", description: "A HR assistant offering expert regarding HR policies, benefits, internal procedures, and Saudi labor regulations.", icon: UserCog, iconColor: "#14B8A6", number: 9 },
];

export function AgentSelection({ onSelectAgent, userName }: { onSelectAgent: (agent: Agent) => void; userName: string }) {
  const [settingsModalMounted, setSettingsModalMounted] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const userMenuRef = useRef<HTMLDivElement>(null);
  const t = defaultTheme;

  useEffect(() => {
    if (!showUserMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  useEffect(() => {
    if (!settingsModalMounted) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [settingsModalMounted]);

  const openSettingsModal = () => {
    setSettingsModalMounted(true);
    requestAnimationFrame(() => setSettingsModalVisible(true));
  };

  const closeSettingsModal = () => {
    setSettingsModalVisible(false);
    window.setTimeout(() => setSettingsModalMounted(false), 300);
  };

  return (
    <div className="flex flex-col w-full min-h-screen overflow-auto" style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "#ffffff" }}>
      <div className="max-w-[1600px] mx-auto w-full px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <img alt="Tawuniya" src={imgLogo} className="h-[32px] w-auto object-contain" />
          <div className="flex items-center gap-2">
            <button
              onClick={openSettingsModal}
              className="flex items-center justify-center w-[32px] h-[32px] cursor-pointer border-none transition-colors rounded-[6px] bg-transparent"
              style={{ color: "#535862" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f0f1f3")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              title="Settings"
            >
              <Settings size={20} />
            </button>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="bg-transparent border-none cursor-pointer p-0 rounded-full transition-opacity hover:opacity-80"
                title={userName}
              >
                <img src={imgProfile} alt="Profile" className="w-[32px] h-[32px] rounded-full object-cover" />
              </button>

              {showUserMenu && (
                <div
                  className="absolute top-full right-0 mt-2 rounded-[10px] shadow-xl z-60 py-1 overflow-hidden w-[220px]"
                  style={{ backgroundColor: t.dropdownBg, border: `1px solid ${t.border}` }}
                >
                  <div className="px-3 py-2.5 flex items-center gap-2.5" style={{ borderBottom: `1px solid ${t.border}` }}>
                    <div className="relative rounded-full shrink-0 size-[32px]">
                      <img alt="A" className="object-cover rounded-full size-full" src={imgProfile} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px]" style={{ color: t.text }}>{userName}</p>
                      <p className="text-[11px]" style={{ color: t.textMuted }}>Administrator</p>
                    </div>
                  </div>

                  <button
                    onClick={() => { startTransition(() => setDarkMode(!darkMode)); setShowUserMenu(false); }}
                    className="w-full text-left px-3 py-[7px] text-[13px] cursor-pointer border-none flex items-center gap-2.5 transition-colors"
                    style={{ backgroundColor: t.dropdownBg, color: t.textSecondary }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = t.bgHover)}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = t.dropdownBg)}
                  >
                    {darkMode ? <Sun size={16} color={t.textTertiary} /> : <Moon size={16} color={t.textTertiary} />}
                    <span className="flex-1">{darkMode ? "Light Mode" : "Dark Mode"}</span>
                    <div className="relative w-[32px] h-[18px] rounded-full transition-colors" style={{ backgroundColor: darkMode ? "#7f56d9" : "#d5d7da" }}>
                      <div className="absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-all" style={{ left: darkMode ? "16px" : "2px" }} />
                    </div>
                  </button>

                  <div className="px-3 py-[7px] text-[13px] flex items-center gap-2.5" style={{ color: t.textSecondary }}>
                    <Globe size={16} color={t.textTertiary} />
                    <span className="flex-1">Language</span>
                    <div className="flex rounded-[6px] overflow-hidden" style={{ border: `1px solid ${t.border}` }}>
                      <button
                        onClick={() => setLanguage("en")}
                        className="border-none cursor-pointer px-2.5 py-[3px] text-[11px] transition-colors"
                        style={{ backgroundColor: language === "en" ? "#7f56d9" : "transparent", color: language === "en" ? "#fff" : t.textMuted }}
                      >
                        EN
                      </button>
                      <button
                        onClick={() => setLanguage("ar")}
                        className="border-none cursor-pointer px-2.5 py-[3px] text-[11px] transition-colors"
                        style={{ backgroundColor: language === "ar" ? "#7f56d9" : "transparent", color: language === "ar" ? "#fff" : t.textMuted, borderLeft: `1px solid ${t.border}` }}
                      >
                        عربي
                      </button>
                    </div>
                  </div>

                  <div className="my-0.5" style={{ borderTop: `1px solid ${t.border}` }} />

                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="w-full text-left px-3 py-[7px] text-[13px] text-[#f04438] cursor-pointer border-none flex items-center gap-2.5 transition-colors"
                    style={{ backgroundColor: t.dropdownBg }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#fef3f2")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = t.dropdownBg)}
                  >
                    <LogOut size={16} color="#f04438" /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="font-semibold leading-[42px] text-[32px] text-[#181d27]">
            <span className="text-[24px] font-normal leading-[36px]">👋 Hi {userName},</span>
            <br />
            Select an agent to start a conversation
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {agents.map(agent => (
            <button
              key={agent.id}
              onClick={() => onSelectAgent(agent)}
              className="bg-white hover:bg-[#f9fafb] rounded-[10px] px-5 py-6 flex flex-col items-start text-left cursor-pointer border-none transition-all duration-200 relative"
              style={{ border: "1px solid #e9eaeb" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#7f56d9"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e9eaeb"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div
                className="w-[48px] h-[48px] rounded-[14px] flex items-center justify-center mb-4 shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${agent.iconColor}35, ${agent.iconColor}15)`,
                  border: `1px solid ${agent.iconColor}40`,
                  backdropFilter: "blur(12px)",
                  boxShadow: `0 2px 8px ${agent.iconColor}10, inset 0 1px 0 rgba(255,255,255,0.15)`,
                }}
              >
                <agent.icon size={22} color={agent.iconColor} strokeWidth={1.8} />
              </div>

              <p className="font-semibold text-[15px] leading-[20px] text-[#181d27] m-0 mb-1.5">{agent.name}</p>
              <p className="text-[13px] leading-[19px] text-[#535862] m-0 flex-1 font-normal line-clamp-2 overflow-hidden">{agent.description}</p>

              <div className="flex items-center gap-1.5 mt-4">
                <span className="text-[13px] font-semibold text-[#7f56d9]">Start chat</span>
                <ArrowRight size={14} color="#7f56d9" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {settingsModalMounted && (
        <div className="fixed inset-0 z-[120]">
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              backgroundColor: "rgba(16,24,40,0.16)",
              opacity: settingsModalVisible ? 1 : 0,
            }}
            onClick={closeSettingsModal}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-full transition-transform duration-300 ease-out"
            style={{
              transform: settingsModalVisible ? "translateY(0)" : "translateY(100%)",
            }}
          >
            <div className="flex w-full h-full" style={{ backgroundColor: t.bg }}>
              <Suspense fallback={null}>
                <SettingsPage
                  onBack={closeSettingsModal}
                  darkMode={darkMode}
                  t={t}
                  logoSrc={imgLogo}
                  logoDarkSrc={imgLogoDark}
                  onToggleDarkMode={() => setDarkMode(!darkMode)}
                />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
