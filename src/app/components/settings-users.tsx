import { useState } from "react";
import { Search, Plus, MoreHorizontal, Check } from "lucide-react";
import type { ThemeColors } from "./settings-types";

const users = [
  { id: "1", name: "Default User", email: "default-user@tawuniya.com", role: "Admin", extra: 1, status: "Active" },
  { id: "2", name: "Shaik Shoaib", email: "sshoaib@master-works.sa", role: "Standard User", extra: 0, status: "Active" },
  { id: "3", name: "Abdullah Al-Rashid", email: "abdullah@tawuniya.com", role: "Admin", extra: 0, status: "Active" },
  { id: "4", name: "Sara Al-Dosari", email: "sara.d@tawuniya.com", role: "Manager", extra: 2, status: "Active" },
  { id: "5", name: "Mohammed Al-Harbi", email: "m.harbi@tawuniya.com", role: "Analyst", extra: 0, status: "Active" },
  { id: "6", name: "Fatima Al-Zahrani", email: "fatima.z@tawuniya.com", role: "Viewer", extra: 0, status: "Inactive" },
];

export function UsersSettings({ t, dm }: { t: ThemeColors; dm: boolean }) {
  const [search, setSearch] = useState("");
  const [menuId, setMenuId] = useState<string | null>(null);
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 flex flex-col gap-4 overflow-auto">
      <div>
        <h3 className="text-[18px] m-0" style={{ color: t.text }}>Users</h3>
        <p className="text-[13px] m-0 mt-1" style={{ color: t.textMuted }}>Manage user accounts and team memberships</p>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-[8px] px-3 py-2 flex-1 max-w-[340px]" style={{ border: `1px solid ${t.border}`, backgroundColor: t.inputBg }}>
          <Search size={16} color="#A4A7AE" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="border-none outline-none text-[13px] flex-1 bg-transparent" style={{ color: t.text }} />
        </div>
        <button className="flex items-center gap-2 text-white border-none rounded-[8px] px-4 py-2 text-[13px] cursor-pointer" style={{ backgroundColor: "#7f56d9" }}>
          <Plus size={14} color="white" /> Create User
        </button>
      </div>
      <div className="rounded-[12px] overflow-hidden" style={{ border: `1px solid ${t.border}` }}>
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ backgroundColor: t.bgSecondary }}>
              {["User", "Email", "Roles", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[12px]" style={{ color: t.textMuted, borderBottom: `1px solid ${t.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="transition-colors" style={{ backgroundColor: t.cardBg }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = t.bgHover)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = t.cardBg)}>
                <td className="px-4 py-3" style={{ borderBottom: `1px solid ${t.border}` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[13px] text-white" style={{ backgroundColor: "#7f56d9" }}>{u.name.charAt(0)}</div>
                    <span className="text-[13px]" style={{ color: t.text }}>{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px]" style={{ color: t.textSecondary, borderBottom: `1px solid ${t.border}` }}>{u.email}</td>
                <td className="px-4 py-3" style={{ borderBottom: `1px solid ${t.border}` }}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px]" style={{ color: t.textSecondary }}>{u.role}</span>
                    {u.extra > 0 && <span className="text-[11px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: dm ? "#252830" : "#f0f0f0", color: t.textMuted }}>+{u.extra}</span>}
                  </div>
                </td>
                <td className="px-4 py-3" style={{ borderBottom: `1px solid ${t.border}` }}>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px]" style={u.status === "Active" ? { backgroundColor: dm ? "#0d2b1a" : "#ecfdf3", color: "#067647", border: `1px solid ${dm ? "#166534" : "#abefc6"}` } : { backgroundColor: dm ? "#252830" : "#f5f5f5", color: t.textMuted, border: `1px solid ${t.border}` }}>
                    {u.status === "Active" ? <Check size={12} color="#17b26a" /> : <span className="w-[6px] h-[6px] rounded-full bg-[#A4A7AE]" />}
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3 relative" style={{ borderBottom: `1px solid ${t.border}` }}>
                  <button onClick={() => setMenuId(menuId === u.id ? null : u.id)} className="bg-transparent border-none cursor-pointer p-1.5 rounded-[6px]" style={{ color: t.textTertiary }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = t.bgHover)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                    <MoreHorizontal size={16} />
                  </button>
                  {menuId === u.id && (<>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuId(null)} />
                    <div className="absolute right-4 top-full mt-1 rounded-[8px] shadow-lg z-50 py-1 w-[140px]" style={{ backgroundColor: t.dropdownBg, border: `1px solid ${t.border}` }}>
                      {["Edit", "Manage roles", "Delete"].map(label => (
                        <button key={label} onClick={() => setMenuId(null)} className="w-full text-left cursor-pointer border-none flex items-center gap-2 px-3 py-1.5 text-[13px] transition-colors" style={{ backgroundColor: t.dropdownBg, color: label === "Delete" ? "#ef4444" : t.textSecondary }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = t.bgHover)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = t.dropdownBg)}>{label}</button>
                      ))}
                    </div>
                  </>)}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-[14px]" style={{ color: t.textMuted }}>No users found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
