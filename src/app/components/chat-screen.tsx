import { useState, useRef, useEffect, lazy, Suspense, startTransition } from "react";
import imgImage13 from "figma:asset/455d1356f9baed9a176feddf5ae4c24cab21915f.png";
import imgImage13Dark from "figma:asset/bf27771b7e9882997d9b0115ee22db1b91239ba3.png";
import imgAvatar from "figma:asset/6bbf9fa630820c59ebb475e2139488924c941c9f.png";
import { agents, type Agent } from "./agent-selection";
import { AttachmentMenu } from "./attachment-menu";
import { AttachmentPreview, type Attachment } from "./attachment-menu";
import { Send, ChevronDown, ArrowLeft, Upload, Plus, X, FileText, Settings, Moon, Sun, Globe, LogOut } from "lucide-react";
import {
  type Message,
  type Chat,
  modelOptions,
  getAIResponse,
  generateId,
  getThemeColors,
} from "./chat-data";

const SettingsPage = lazy(() => import("./settings-page").then(m => ({ default: m.SettingsPage })));
const ChatSidebar = lazy(() => import("./chat-sidebar").then(m => ({ default: m.ChatSidebar })));
const ChatMessages = lazy(() => import("./chat-messages").then(m => ({ default: m.ChatMessages })));

const agentPrompts: Record<string, { emoji: string; text: string }[]> = {
  "life": [
    { emoji: "💰", text: "What savings and investment plans does Tawuniya offer?" },
    { emoji: "🛡️", text: "Explain the different life insurance coverage options" },
    { emoji: "📋", text: "What are the eligibility criteria for life insurance?" },
    { emoji: "📊", text: "Compare term life vs. whole life insurance benefits" },
  ],
  "strategic": [
    { emoji: "🎯", text: "What are Tawuniya's key strategic objectives for this year?" },
    { emoji: "🧭", text: "How does our vision align across business units?" },
    { emoji: "📈", text: "Summarize the long-term growth strategy" },
    { emoji: "🤝", text: "What are the strategic priorities for cross-department collaboration?" },
  ],
  "stratify": [
    { emoji: "📄", text: "Analyze this document for strategic alignment" },
    { emoji: "🔍", text: "Evaluate a new strategic initiative proposal" },
    { emoji: "📝", text: "Summarize key findings from a strategy report" },
    { emoji: "⚖️", text: "Compare two strategic approaches and recommend the best fit" },
  ],
  "legal-contract": [
    { emoji: "📜", text: "Explain the key clauses in a standard insurance contract" },
    { emoji: "⚖️", text: "What are the latest regulatory compliance requirements?" },
    { emoji: "🔒", text: "Review a contract for potential legal risks" },
    { emoji: "📖", text: "Summarize our company's data privacy policy" },
  ],
  "legal-litigation": [
    { emoji: "🏛️", text: "Help me research case law for an insurance dispute" },
    { emoji: "📑", text: "Review a legal document for compliance issues" },
    { emoji: "⚖️", text: "What are the regulatory requirements for this case?" },
    { emoji: "🔎", text: "Summarize recent litigation outcomes in insurance" },
  ],
  "car-expert": [
    { emoji: "🚗", text: "What is the current market value for a 2023 Toyota Camry?" },
    { emoji: "🔧", text: "Estimate spare parts pricing for a common repair" },
    { emoji: "📊", text: "What are the latest trends in the auto insurance market?" },
    { emoji: "🛞", text: "Compare vehicle safety ratings for insurance assessment" },
  ],
  "general-insurance": [
    { emoji: "🏠", text: "What property insurance products does Tawuniya offer?" },
    { emoji: "✈️", text: "Explain our travel insurance coverage details" },
    { emoji: "🏢", text: "What are the commercial insurance options for businesses?" },
    { emoji: "📋", text: "How do I file a general insurance claim?" },
  ],
  "health-insurance": [
    { emoji: "🏥", text: "What does the standard health insurance plan cover?" },
    { emoji: "💊", text: "Which medications are covered under our formulary?" },
    { emoji: "👨‍⚕️", text: "How do I find an in-network specialist?" },
    { emoji: "📞", text: "What is the pre-authorization process for procedures?" },
  ],
  "pptx-generator": [
    { emoji: "📊", text: "Create a quarterly business review presentation" },
    { emoji: "🎨", text: "Generate a Tawuniya-branded project proposal deck" },
    { emoji: "📈", text: "Build a performance metrics dashboard presentation" },
    { emoji: "🗂️", text: "Create an executive summary presentation from a report" },
  ],
  "hr-policy": [
    { emoji: "📅", text: "What is the annual leave policy and entitlements?" },
    { emoji: "💼", text: "Explain the employee benefits package" },
    { emoji: "📜", text: "What does Saudi labor law say about end-of-service benefits?" },
    { emoji: "🏥", text: "How do I apply for medical leave?" },
  ],
};

interface Props {
  agent: Agent;
  onBackToAgents: () => void;
  onSwitchAgent: (agent: Agent) => void;
}

export function ChatScreen({ agent, onBackToAgents, onSwitchAgent }: Props) {
  const [activeAgent, setActiveAgent] = useState<Agent>(agent);
  const [showAgentSwitcher, setShowAgentSwitcher] = useState(false);
  const [agentChats, setAgentChats] = useState<Record<string, Chat[]>>({});
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenuChatId, setOpenMenuChatId] = useState<string | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [settingsModalMounted, setSettingsModalMounted] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [expandedSourcesMsgId, setExpandedSourcesMsgId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const dm = darkMode;
  const t = getThemeColors(dm);
  const chats = agentChats[activeAgent.id] || [];
  const activeChat = chats.find(c => c.id === activeChatId) || null;

  const setChats = (updater: (prev: Chat[]) => Chat[]) => {
    setAgentChats(prev => ({ ...prev, [activeAgent.id]: updater(prev[activeAgent.id] || []) }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      let fileType: 'pdf' | 'word' | 'excel' | 'powerpoint' | 'document' = 'document';
      if (ext === 'pdf') fileType = 'pdf';
      else if (ext === 'doc' || ext === 'docx') fileType = 'word';
      else if (ext === 'xls' || ext === 'xlsx') fileType = 'excel';
      else if (ext === 'ppt' || ext === 'pptx') fileType = 'powerpoint';
      
      const newAttachment: Attachment = {
        id: generateId(),
        name: file.name,
        size: file.size,
        type: fileType
      };
      startTransition(() => {
        setAttachments(prev => [...prev, newAttachment]);
        setToastMsg(`Document "${file.name}" uploaded successfully`);
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  useEffect(() => { setActiveAgent(agent); setActiveChatId(null); setInputValue(""); }, [agent]);
  useEffect(() => { if (toastMsg) { const t2 = setTimeout(() => setToastMsg(null), 2200); return () => clearTimeout(t2); } }, [toastMsg]);
  useEffect(() => { if (!showUserMenu) return; const h = (e: MouseEvent) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, [showUserMenu]);
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

  const handleSwitchAgent = (a: Agent) => {
    setActiveAgent(a); setActiveChatId(null); setInputValue("");
    setShowAgentSwitcher(false); closeSettingsModal(); setIsTyping(false);
    onSwitchAgent(a);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleNewChat = () => {
    startTransition(() => setActiveChatId(null)); setInputValue(""); setOpenMenuChatId(null);
    setShowSearch(false); setSearchQuery(""); closeSettingsModal();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: generateId(), role: "user", content: text.trim(), timestamp: new Date() };
    let targetChatId = activeChatId;
    startTransition(() => {
      if (activeChatId) {
        setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, userMsg] } : c));
      } else {
        const newChat: Chat = { id: generateId(), title: text.trim().substring(0, 50) + (text.length > 50 ? "..." : ""), messages: [userMsg], createdAt: new Date() };
        targetChatId = newChat.id;
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newChat.id);
      }
      setInputValue(""); 
      setIsTyping(true);
    });
    const agentId = activeAgent.id;
    setTimeout(() => {
      const { content: aiContent, sources: aiSources } = getAIResponse(text);
      const aiResponse: Message = { id: generateId(), role: "assistant", content: aiContent, timestamp: new Date(), sources: aiSources };
      startTransition(() => {
        setAgentChats(prev => ({ ...prev, [agentId]: (prev[agentId] || []).map(c => c.id === targetChatId ? { ...c, messages: [...c.messages, aiResponse] } : c) }));
        setIsTyping(false);
      });
    }, 1200 + Math.random() * 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(inputValue); } };

  const handleRegenerate = (msgId: string) => {
    if (!activeChat) return;
    const idx = activeChat.messages.findIndex(m => m.id === msgId);
    if (idx > 0) {
      const lastUser = activeChat.messages.slice(0, idx).reverse().find(m => m.role === "user");
      if (lastUser) { setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: c.messages.filter(m => m.id !== msgId) } : c)); setInputValue(lastUser.content); }
    }
  };

  const handleEditChatTitle = (id: string) => { const c = chats.find(x => x.id === id); if (c) { setEditingChatId(id); setEditingTitle(c.title); } };
  const saveEditedTitle = () => { if (editingChatId && editingTitle.trim()) { setChats(prev => prev.map(c => c.id === editingChatId ? { ...c, title: editingTitle.trim() } : c)); setEditingChatId(null); setEditingTitle(""); } };
  const cancelEditTitle = () => { setEditingChatId(null); setEditingTitle(""); };
  const deleteChat = (id: string, e: React.MouseEvent) => { e.stopPropagation(); setChats(prev => prev.filter(c => c.id !== id)); if (activeChatId === id) startTransition(() => setActiveChatId(null)); };

  const getFileTypeLabel = (type: string) => {
    if (type === 'pdf') return 'PDF';
    if (type === 'word') return 'DOCX';
    if (type === 'excel') return 'XLSX';
    if (type === 'powerpoint') return 'PPTX';
    return 'FILE';
  };

  const getFileIconColor = (type: string) => {
    if (type === 'pdf') return '#EF4444';
    if (type === 'word') return '#3B82F6';
    if (type === 'excel') return '#10B981';
    if (type === 'powerpoint') return '#F97316';
    return '#6B7280';
  };

  return (
    <div className="relative flex w-full h-screen overflow-hidden transition-colors duration-300" style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: t.bg }}>
      <Suspense fallback={null}>
        <ChatSidebar
          chats={chats} activeChatId={activeChatId} sidebarOpen={sidebarOpen}
          showSearch={showSearch} searchQuery={searchQuery} showSettings={settingsModalMounted}
          editingChatId={editingChatId} editingTitle={editingTitle} openMenuChatId={openMenuChatId}
          darkMode={darkMode} dm={dm} t={t} language={language}
          onNewChat={handleNewChat} onSelectChat={(id) => startTransition(() => setActiveChatId(id))}
          onToggleSidebar={setSidebarOpen} onToggleSearch={() => setShowSearch(!showSearch)}
          onSearchChange={setSearchQuery} onOpenSettings={openSettingsModal}
          onEditChatTitle={handleEditChatTitle} onEditingTitleChange={setEditingTitle}
          onSaveEditedTitle={saveEditedTitle} onCancelEditTitle={cancelEditTitle}
          onDeleteChat={deleteChat} onOpenMenuChat={setOpenMenuChatId}
          onToggleDarkMode={() => setDarkMode(!darkMode)} onSetLanguage={setLanguage}
          onToast={setToastMsg}
        />
      </Suspense>

      <div className="flex flex-col flex-1 min-w-0 min-h-0 h-full">
        <>
          <div className="flex items-center justify-between px-[24px] py-[12px] shrink-0">
              <div className="flex items-center">
                <div className="flex items-center rounded-[8px]" style={{ border: `1px solid ${t.border}`, backgroundColor: dm ? "#252830" : "#F9FAFB" }}>
                  <button onClick={onBackToAgents} className="flex items-center justify-center w-[32px] h-[32px] cursor-pointer border-none transition-colors rounded-l-[7px]" style={{ backgroundColor: "transparent", color: t.textSecondary, borderRight: `1px solid ${t.border}` }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = dm ? "#2e3138" : "#f0f1f3")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")} title="Back to agents">
                    <ArrowLeft size={16} />
                  </button>
                  <div className="relative">
                    <button onClick={() => setShowAgentSwitcher(!showAgentSwitcher)} className="flex items-center gap-2 px-3 h-[32px] cursor-pointer border-none transition-colors rounded-r-[7px]" style={{ backgroundColor: "transparent", color: dm ? "#d0d5dd" : "#535862" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = dm ? "#2e3138" : "#f0f1f3")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                      <activeAgent.icon size={16} />
                      <span className="text-[13px] font-semibold">{activeAgent.name}</span>
                      <ChevronDown size={14} />
                    </button>
                    {showAgentSwitcher && (
                      <div className="absolute top-full left-0 mt-1 rounded-[10px] shadow-xl z-50 py-1 w-[280px] max-h-[400px] overflow-y-auto" style={{ backgroundColor: t.dropdownBg, border: `1px solid ${t.border}` }}>
                        <div className="px-3 py-2" style={{ borderBottom: `1px solid ${t.border}` }}>
                          <p className="text-[11px] m-0 uppercase tracking-wider" style={{ color: t.textMuted }}>Switch Agent</p>
                        </div>
                        {agents.map(a => {
                          const isActive = activeAgent.id === a.id;
                          return (
                            <button key={a.id} onClick={() => handleSwitchAgent(a)} className="w-full text-left px-3 py-2.5 cursor-pointer border-none flex items-center gap-3 transition-colors" style={{ backgroundColor: isActive ? (dm ? "#1e1433" : "#f0ebff") : t.dropdownBg, color: isActive ? "#7f56d9" : t.textSecondary }} onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = t.bgHover; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = isActive ? (dm ? "#1e1433" : "#f0ebff") : t.dropdownBg; }}>
                              <div className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center shrink-0" style={{ 
                                background: `linear-gradient(135deg, ${a.iconColor}35, ${a.iconColor}15)`,
                                border: `1px solid ${a.iconColor}40`,
                                backdropFilter: "blur(8px)",
                                boxShadow: `0 2px 6px ${a.iconColor}10, inset 0 1px 0 rgba(255,255,255,0.15)`
                              }}>
                                <a.icon size={16} color={a.iconColor} strokeWidth={1.8} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] m-0 truncate" style={{ fontWeight: isActive ? 600 : 400 }}>{a.name}</p>
                              </div>
                              {isActive && <div className="w-[6px] h-[6px] rounded-full bg-[#7f56d9] shrink-0" />}
                            </button>
                          );
                        })}
                        <div style={{ borderTop: `1px solid ${t.border}` }}>
                          <button onClick={onBackToAgents} className="w-full text-left px-3 py-2.5 cursor-pointer border-none flex items-center gap-2 text-[13px] transition-colors" style={{ backgroundColor: t.dropdownBg, color: t.textMuted }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = t.bgHover)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = t.dropdownBg)}>
                            View all agents
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={openSettingsModal} className="flex items-center justify-center w-[32px] h-[32px] cursor-pointer border-none transition-colors rounded-[6px]" style={{ backgroundColor: dm ? "transparent" : "transparent", color: settingsModalMounted ? "#7f56d9" : t.textSecondary }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = dm ? "#2e3138" : "#f0f1f3")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")} title="Settings">
                  <Settings size={20} />
                </button>
                <div className="relative" ref={userMenuRef}>
                  <button onClick={() => setShowUserMenu(!showUserMenu)} className="bg-transparent border-none cursor-pointer p-0 rounded-full transition-opacity hover:opacity-80" title="Abdullah Al-Rashid">
                    <div className="relative rounded-full size-[32px]">
                      <img alt="A" className="object-cover rounded-full size-full" src={imgAvatar} />
                      <div className="absolute bg-[#17b26a] bottom-0 right-0 rounded-full size-[8px] border-[1.5px]" style={{ borderColor: t.bg }} />
                    </div>
                  </button>
                  {showUserMenu && (
                    <div className="absolute top-full right-0 mt-2 rounded-[10px] shadow-xl z-60 py-1 overflow-hidden w-[220px]" style={{ backgroundColor: t.dropdownBg, border: `1px solid ${t.border}` }}>
                      <div className="px-3 py-2.5 flex items-center gap-2.5" style={{ borderBottom: `1px solid ${t.border}` }}>
                        <div className="relative rounded-full shrink-0 size-[32px]"><img alt="A" className="object-cover rounded-full size-full" src={imgAvatar} /></div>
                        <div className="min-w-0"><p className="text-[13px]" style={{ color: t.text }}>Abdullah Al-Rashid</p><p className="text-[11px]" style={{ color: t.textMuted }}>Administrator</p></div>
                      </div>
                      <button onClick={() => { startTransition(() => setDarkMode(!darkMode)); setShowUserMenu(false); }} className="w-full text-left px-3 py-[7px] text-[13px] cursor-pointer border-none flex items-center gap-2.5 transition-colors" style={{ backgroundColor: t.dropdownBg, color: t.textSecondary }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = t.bgHover)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = t.dropdownBg)}>
                        {dm ? <Sun size={16} color={t.textTertiary} /> : <Moon size={16} color={t.textTertiary} />}
                        <span className="flex-1">{dm ? "Light Mode" : "Dark Mode"}</span>
                        <div className="relative w-[32px] h-[18px] rounded-full transition-colors" style={{ backgroundColor: dm ? "#7f56d9" : "#d5d7da" }}><div className="absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-all" style={{ left: dm ? "16px" : "2px" }} /></div>
                      </button>
                      <div className="px-3 py-[7px] text-[13px] flex items-center gap-2.5" style={{ color: t.textSecondary }}>
                        <Globe size={16} color={t.textTertiary} />
                        <span className="flex-1">Language</span>
                        <div className="flex rounded-[6px] overflow-hidden" style={{ border: `1px solid ${t.border}` }}>
                          <button onClick={() => startTransition(() => setLanguage("en"))} className="border-none cursor-pointer px-2.5 py-[3px] text-[11px] transition-colors" style={{ backgroundColor: language === "en" ? "#7f56d9" : "transparent", color: language === "en" ? "#fff" : t.textMuted }}>EN</button>
                          <button onClick={() => startTransition(() => setLanguage("ar"))} className="border-none cursor-pointer px-2.5 py-[3px] text-[11px] transition-colors" style={{ backgroundColor: language === "ar" ? "#7f56d9" : "transparent", color: language === "ar" ? "#fff" : t.textMuted, borderLeft: `1px solid ${t.border}` }}>عربي</button>
                        </div>
                      </div>
                      <div className="my-0.5" style={{ borderTop: `1px solid ${t.border}` }} />
                      <button onClick={() => { setShowUserMenu(false); setToastMsg("Logged out successfully"); }} className="w-full text-left px-3 py-[7px] text-[13px] text-[#f04438] cursor-pointer border-none flex items-center gap-2.5 transition-colors" style={{ backgroundColor: t.dropdownBg }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = dm ? "#2a1215" : "#fef3f2")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = t.dropdownBg)}>
                        <LogOut size={16} color="#f04438" /> Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
          </div>

          {!activeChat ? (
            <div className="flex flex-col flex-1 min-h-0 items-center justify-center px-6 pb-12">
                <div className="flex flex-col gap-[24px] items-center max-w-[669px] w-full px-4">
                  <div className="flex flex-col gap-[16px] items-start w-full">
                    <div className="flex flex-col gap-[2px] items-start w-full">
                      <p className="leading-[32px] text-[24px]" style={{ color: t.textTertiary }}>👋 Hi Abdullah,</p>
                      <p className="font-semibold leading-[38px] text-[32px]" style={{ color: t.text }}>Chat with {activeAgent.name}</p>
                    </div>

                    <div className={`flex items-center px-[16px] py-[8px] w-full ${attachments.length > 0 ? 'rounded-[20px]' : 'rounded-[100px]'}`} style={{ backgroundColor: t.inputBg, border: `1px solid ${t.border}` }}>
                      <div className="flex flex-col gap-2 w-full">
                        {attachments.length > 0 && (
                          <div className="flex gap-2 flex-wrap pt-1">
                            {attachments.map(att => (
                              <div key={att.id} className="relative flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] min-w-0 max-w-[320px]" style={{ backgroundColor: dm ? "#1F1F1F" : "#ffffff", border: `1px solid ${dm ? "#3a3a3a" : "#e5e5e5"}` }}>
                                <div className="w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0" style={{ backgroundColor: getFileIconColor(att.type) }}>
                                  <FileText size={20} color="white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[13px] m-0 truncate font-medium" style={{ color: t.text }}>{att.name}</p>
                                  <p className="text-[11px] m-0 mt-0.5" style={{ color: t.textMuted }}>{getFileTypeLabel(att.type)}</p>
                                </div>
                                <button onClick={() => startTransition(() => setAttachments(prev => prev.filter(a => a.id !== att.id)))} className="border-none p-0 bg-black rounded-full w-5 h-5 cursor-pointer flex items-center justify-center shrink-0 transition-opacity" style={{ backgroundColor: dm ? "#ffffff" : "#000000" }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                                  <X size={12} color={dm ? "#000000" : "#ffffff"} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between w-full">
                          <div className="flex gap-[8px] items-center flex-1">
                            <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx" onChange={handleFileUpload} className="hidden" />
                            <button onClick={() => fileInputRef.current?.click()} className="border-none p-0 bg-transparent cursor-pointer flex items-center justify-center transition-colors shrink-0" onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                              <Plus size={18} color={t.textMuted} />
                            </button>
                            <input ref={inputRef} type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={handleKeyDown} placeholder={`Ask ${activeAgent.name} anything...`} className="flex-1 border-none outline-none text-[14px] leading-[20px] bg-transparent" style={{ color: t.text, caretColor: t.text }} />
                          </div>
                          <button onClick={() => { sendMessage(inputValue); startTransition(() => setAttachments([])); }} disabled={!inputValue.trim() && attachments.length === 0} className="border-none p-[6px] rounded-[6px] transition-colors shrink-0" style={{ cursor: (inputValue.trim() || attachments.length > 0) ? "pointer" : "default", opacity: (inputValue.trim() || attachments.length > 0) ? 1 : 0.4, backgroundColor: "transparent" }} onMouseEnter={e => { if (inputValue.trim() || attachments.length > 0) e.currentTarget.style.backgroundColor = t.bgHover; }} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                            <Send size={20} color={(inputValue.trim() || attachments.length > 0) ? "#7f56d9" : t.textMuted} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 min-h-0">
                <Suspense fallback={null}>
                  <ChatMessages messages={activeChat.messages} isTyping={isTyping} dm={dm} t={t} copiedMsgId={copiedMsgId} expandedSourcesMsgId={expandedSourcesMsgId} onCopy={setCopiedMsgId} onRegenerate={handleRegenerate} onToggleSources={id => setExpandedSourcesMsgId(expandedSourcesMsgId === id ? null : id)} />
                </Suspense>
                <div className="px-6 py-4 shrink-0">
                  <div className="max-w-[720px] mx-auto">
                    <div className="flex flex-col gap-2 w-full">
                      {attachments.length > 0 && (
                        <AttachmentPreview attachments={attachments} onRemove={(id) => setAttachments(prev => prev.filter(a => a.id !== id))} dm={dm} t={t} />
                      )}
                      <div className="flex items-center px-[16px] py-[8px] rounded-[100px] w-full" style={{ backgroundColor: t.inputBg, border: `1px solid ${t.border}` }}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex gap-[8px] items-center flex-1">
                            <AttachmentMenu onAttach={(att) => setAttachments(prev => [...prev, att])} dm={dm} t={t} />
                            <input ref={inputRef} type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={handleKeyDown} placeholder={`Ask ${activeAgent.name} anything...`} className="flex-1 border-none outline-none text-[14px] leading-[20px] bg-transparent" style={{ color: t.text, caretColor: t.text }} />
                          </div>
                          <button onClick={() => { sendMessage(inputValue); startTransition(() => setAttachments([])); }} disabled={!inputValue.trim() && attachments.length === 0} className="border-none p-[6px] rounded-[6px] transition-colors shrink-0" style={{ cursor: (inputValue.trim() || attachments.length > 0) ? "pointer" : "default", opacity: (inputValue.trim() || attachments.length > 0) ? 1 : 0.4, backgroundColor: "transparent" }} onMouseEnter={e => { if (inputValue.trim() || attachments.length > 0) e.currentTarget.style.backgroundColor = t.bgHover; }} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                            <Send size={20} color={(inputValue.trim() || attachments.length > 0) ? "#7f56d9" : t.textMuted} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          )}
        </>
      </div>

      {showAgentSwitcher && <div className="fixed inset-0 z-40" onClick={() => setShowAgentSwitcher(false)} />}
      {openMenuChatId && <div className="fixed inset-0 z-40" onClick={() => setOpenMenuChatId(null)} />}
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
                <SettingsPage onBack={closeSettingsModal} darkMode={dm} t={t} logoSrc={imgImage13} logoDarkSrc={imgImage13Dark} onToggleDarkMode={() => setDarkMode(!darkMode)} />
              </Suspense>
            </div>
          </div>
        </div>
      )}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-[10px] text-[13px] shadow-lg z-[100]" style={{ animation: "fadeInUp 0.25s ease", backgroundColor: t.toastBg, color: t.toastText }}>{toastMsg}</div>
      )}
    </div>
  );
}
