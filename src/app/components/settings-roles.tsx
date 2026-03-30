import { Shield, Users, BarChart3, Eye, Plus, ChevronRight } from "lucide-react";
import type { ThemeColors } from "./settings-types";

const roles = [
  { name: "Admin", desc: "Full access to Knowledgebase, Chat, Dashboard, and RAG", date: "Jan 21, 2026", Icon: Shield },
  { name: "Manager", desc: "Manage users, view reports, and configure policies", date: "Jan 18, 2026", Icon: Users },
  { name: "Analyst", desc: "Access reports, data export, and analytics dashboards", date: "Jan 15, 2026", Icon: BarChart3 },
  { name: "Viewer", desc: "Read-only access to dashboards and reports", date: "Jan 10, 2026", Icon: Eye },
];

export function RolesSettings({ t, dm }: { t: ThemeColors; dm: boolean }) {
  return (
    <div className="p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[18px] m-0" style={{ color: t.text }}>Roles & Permissions</h3>
          <p className="text-[13px] m-0 mt-1" style={{ color: t.textMuted }}>Define access levels and capabilities</p>
        </div>
        <button className="flex items-center gap-2 bg-[#7f56d9] text-white border-none rounded-[8px] px-4 py-2 text-[13px] cursor-pointer hover:bg-[#6941c6] transition-colors">
          <Plus size={14} color="white" /> Create Role
        </button>
      </div>
      <div className="flex items-center gap-4 p-3 rounded-[10px]" style={{ backgroundColor: t.bgSecondary, border: `1px solid ${t.border}` }}>
        <span className="text-[13px]" style={{ color: t.textTertiary }}><span style={{ fontWeight: 600, color: t.text }}>18</span> total users</span>
        <div className="w-px h-4" style={{ backgroundColor: t.border }} />
        <span className="text-[13px]" style={{ color: t.textTertiary }}><span style={{ fontWeight: 600, color: t.text }}>4</span> roles defined</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {roles.map(role => (
          <div key={role.name} className="rounded-[12px] p-4 flex flex-col gap-3" style={{ border: `1px solid ${t.border}`, backgroundColor: t.cardBg }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: dm ? "#7f56d922" : "#f0ebff", color: "#7f56d9" }}>
                <role.Icon size={18} />
              </div>
              <div>
                <h4 className="text-[14px] m-0" style={{ color: t.text }}>{role.name}</h4>
                <span className="inline-flex text-[11px] px-2 py-0.5 rounded-[6px] mt-1" style={{ border: `1px solid ${t.border}`, color: t.textSecondary, backgroundColor: dm ? "#252830" : "#f9fafb" }}>Custom</span>
              </div>
            </div>
            <p className="text-[13px] m-0 pt-3" style={{ color: t.textSecondary, borderTop: `1px solid ${t.border}` }}>{role.desc}</p>
            <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${t.border}` }}>
              <span className="text-[12px]" style={{ color: t.textMuted }}>{role.date}</span>
              <button className="flex items-center gap-1 bg-transparent border-none cursor-pointer text-[13px] p-0" style={{ color: "#7f56d9" }}>
                View details <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
