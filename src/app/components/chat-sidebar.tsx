import { useRef, useEffect, useState } from "react";
import svgPaths from "../../imports/svg-xy4pf4w126";
import imgImage13 from "figma:asset/455d1356f9baed9a176feddf5ae4c24cab21915f.png";
import imgImage13Dark from "figma:asset/bf27771b7e9882997d9b0115ee22db1b91239ba3.png";
import imgAvatar from "figma:asset/6bbf9fa630820c59ebb475e2139488924c941c9f.png";
import imgBaseerLogo from "figma:asset/c90fddf3e2e798b59b6846ae902f4ae2acb58979.png";
import { type Chat, type ThemeColors } from "./chat-data";
import {
  PanelLeftOpen, PanelLeftClose, Search, Settings, Moon, Sun, Globe,
  LogOut, MoreVertical, Pencil, Trash2, ChevronDown, Star,
} from "lucide-react";

interface ChatSidebarProps {
  chats: Chat[]; activeChatId: string | null; sidebarOpen: boolean;
  showSearch: boolean; searchQuery: string; showSettings: boolean;
  editingChatId: string | null; editingTitle: string; openMenuChatId: string | null;
  darkMode: boolean; dm: boolean; t: ThemeColors; language: "en" | "ar";
  onNewChat: () => void; onSelectChat: (id: string) => void;
  onToggleSidebar: (open: boolean) => void; onToggleSearch: () => void;
  onSearchChange: (q: string) => void; onOpenSettings: () => void;
  onEditChatTitle: (id: string) => void; onEditingTitleChange: (title: string) => void;
  onSaveEditedTitle: () => void; onCancelEditTitle: () => void;
  onDeleteChat: (id: string, e: React.MouseEvent) => void;
  onOpenMenuChat: (id: string | null) => void; onToggleDarkMode: () => void;
  onSetLanguage: (lang: "en" | "ar") => void; onToast: (msg: string) => void;
}

export function ChatSidebar({
  chats, activeChatId, sidebarOpen, showSearch, searchQuery, showSettings,
  editingChatId, editingTitle, openMenuChatId, darkMode, dm, t,
  onNewChat, onSelectChat, onToggleSidebar, onToggleSearch, onSearchChange,
  onOpenSettings, onEditChatTitle, onEditingTitleChange, onSaveEditedTitle,
  onCancelEditTitle, onDeleteChat, onOpenMenuChat, onToggleDarkMode,
  onSetLanguage, language, onToast,
}: ChatSidebarProps) {
  const editInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => { if (editingChatId && editInputRef.current) { editInputRef.current.focus(); editInputRef.current.select(); } }, [editingChatId]);

  const filteredChats = chats.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={`relative self-stretch shrink-0 transition-all duration-300 z-50 ${sidebarOpen ? "w-[251px]" : "w-[60px]"}`} style={{ borderRight: `0.5px solid ${t.borderLight}` }}>
      {!sidebarOpen && (
        <div className="flex flex-col items-center py-[16px] size-full relative" style={{ backgroundColor: t.bgSecondary }}>
          <button onClick={() => onToggleSidebar(true)} className="bg-transparent border-none cursor-pointer p-[6px] rounded-[6px] transition-colors mb-[20px] shrink-0" style={{ color: t.textTertiary }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = t.bgHover)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")} title="Expand sidebar">
            <PanelLeftOpen size={20} />
          </button>
          <div className="flex flex-col items-center gap-[4px] w-full shrink-0">
            <button onClick={onNewChat} className="bg-transparent border-none cursor-pointer p-[8px] rounded-[8px] transition-colors flex items-center justify-center" onMouseEnter={e => (e.currentTarget.style.backgroundColor = t.bgHover)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")} title="New Chat">
              <svg className="block size-[20px]" fill="none" viewBox="0 0 22 22"><path d={svgPaths.pc638600} stroke="#7F56D9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
            </button>
            <button onClick={onToggleSearch} className="bg-transparent border-none cursor-pointer p-[8px] rounded-[8px] transition-colors flex items-center justify-center" onMouseEnter={e => (e.currentTarget.style.backgroundColor = t.bgHover)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")} title="Search Chat">
              <Search size={20} color={t.textTertiary} />
            </button>
          </div>
          <div className="flex-1" />
          {/* Settings and Profile removed - moved to chat screen header */}
        </div>
      )}
      {sidebarOpen && (
        <div className="flex flex-col gap-[24px] items-start pl-[20px] pr-[16px] py-[20px] size-full relative" style={{ backgroundColor: t.bgSecondary }}>
          <div className="flex items-center justify-between w-full shrink-0">
            <div className="h-[31.695px] w-[110px]"><img alt="Tawuniya" className="max-w-none object-cover pointer-events-none size-full" src={dm ? imgImage13Dark : imgImage13} /></div>
            <button onClick={() => onToggleSidebar(false)} className="bg-transparent border-none cursor-pointer p-1 rounded-[6px] transition-colors" style={{ color: t.textTertiary }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = t.bgHover)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
              <PanelLeftClose size={20} />
            </button>
          </div>
          <div className="flex flex-col flex-1 gap-[24px] items-start w-full min-h-0">
            <div className="flex flex-col flex-1 gap-[24px] items-start w-full min-h-0">
              <div className="flex flex-col gap-[16px] items-start shrink-0 w-full">
                <button onClick={onNewChat} className="flex gap-[8px] items-center w-full cursor-pointer bg-transparent border-none p-0 hover:opacity-70 transition-opacity">
                  <svg className="block size-[20px] ml-[2px]" fill="none" viewBox="0 0 22 22"><path d={svgPaths.pc638600} stroke="#7F56D9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                  <p className="font-medium leading-[20px] text-[#7f56d9] text-[14px]">New Chat</p>
                </button>
                <button onClick={onToggleSearch} className="flex gap-[8px] items-center w-full cursor-pointer bg-transparent border-none p-0 hover:opacity-70 transition-opacity">
                  <Search size={18} color={t.textTertiary} className="ml-[3px]" />
                  <p className="leading-[20px] text-[14px]" style={{ color: t.text }}>Search Chat</p>
                </button>
                {showSearch && (
                  <input type="text" value={searchQuery} onChange={e => onSearchChange(e.target.value)} placeholder="Search chats..." className="w-full rounded-[8px] px-3 py-2 text-[13px] outline-none focus:border-[#7f56d9] transition-colors" style={{ border: `1px solid ${t.border}`, backgroundColor: t.inputBg, color: t.text }} autoFocus />
                )}
              </div>
              <div className="flex flex-col gap-[4px] items-start w-full flex-1 min-h-0 overflow-y-auto">
                <p className="leading-[20px] text-[14px] shrink-0 mb-1" style={{ color: t.textSecondary }}>Your Chats</p>
                {filteredChats.map(chat => (
                  <div key={chat.id} className="relative flex items-center w-full rounded-[6px] transition-colors group" style={{ backgroundColor: activeChatId === chat.id ? t.bgActiveChat : "transparent" }} onMouseEnter={e => { if (activeChatId !== chat.id) e.currentTarget.style.backgroundColor = t.bgHover; }} onMouseLeave={e => { if (activeChatId !== chat.id) e.currentTarget.style.backgroundColor = "transparent"; }}>
                    <button onClick={() => { onSelectChat(chat.id); onOpenMenuChat(null); }} className="flex items-center flex-1 cursor-pointer bg-transparent border-none p-[6px_8px] text-left min-w-0">
                      {chat.pinned && <Star size={12} fill="#7f56d9" color="#7f56d9" className="shrink-0 mr-1.5" />}
                      {editingChatId === chat.id ? (
                        <input ref={editInputRef} type="text" value={editingTitle} onChange={e => onEditingTitleChange(e.target.value)} onBlur={onSaveEditedTitle} onKeyDown={e => { if (e.key === "Enter") onSaveEditedTitle(); if (e.key === "Escape") onCancelEditTitle(); e.stopPropagation(); }} onClick={e => e.stopPropagation()} className="flex-1 border border-[#7f56d9] rounded-[4px] px-1.5 py-0.5 text-[13px] outline-none min-w-0" style={{ backgroundColor: t.inputBg, color: t.text }} />
                      ) : (
                        <p className="flex-1 leading-[20px] text-[14px] overflow-hidden text-ellipsis whitespace-nowrap min-w-0" style={{ color: t.text }}>{chat.title}</p>
                      )}
                    </button>
                    {editingChatId !== chat.id && (
                      <button onClick={e => { e.stopPropagation(); onOpenMenuChat(openMenuChatId === chat.id ? null : chat.id); }} className={`bg-transparent border-none cursor-pointer p-1 mr-1 rounded-[4px] transition-all shrink-0 ${openMenuChatId === chat.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} onMouseEnter={e => (e.currentTarget.style.backgroundColor = t.border)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                        <MoreVertical size={14} color={t.textTertiary} />
                      </button>
                    )}
                    {openMenuChatId === chat.id && (
                      <div className="absolute right-0 top-full mt-1 rounded-[8px] shadow-lg z-50 w-[150px] py-1 overflow-hidden" style={{ backgroundColor: t.dropdownBg, border: `1px solid ${t.border}` }}>
                        <button onClick={e => { e.stopPropagation(); onEditChatTitle(chat.id); onOpenMenuChat(null); }} className="w-full text-left px-3 py-[6px] text-[13px] cursor-pointer border-none flex items-center gap-2 transition-colors" style={{ backgroundColor: t.dropdownBg, color: t.textSecondary }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = t.bgHover)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = t.dropdownBg)}>
                          <Pencil size={13} color={t.textTertiary} /> Rename
                        </button>
                        <div className="my-0.5" style={{ borderTop: `1px solid ${t.border}` }} />
                        <button onClick={e => { onDeleteChat(chat.id, e); onOpenMenuChat(null); onToast("Chat deleted"); }} className="w-full text-left px-3 py-[6px] text-[13px] text-[#f04438] cursor-pointer border-none flex items-center gap-2 transition-colors" style={{ backgroundColor: t.dropdownBg }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = dm ? "#2a1215" : "#fef3f2")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = t.dropdownBg)}>
                          <Trash2 size={13} color="#f04438" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center w-full shrink-0 pt-2 gap-1">
              <p className="text-[10px] m-0" style={{ color: t.textMuted }}>Powered By</p>
              <img alt="Baseer" src={imgBaseerLogo} className="h-[24px] w-auto object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}