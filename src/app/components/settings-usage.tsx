import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FileText, Box, Clock } from "lucide-react";
import type { ThemeColors } from "./settings-types";

export function UsageSettings({ t, dm }: { t: ThemeColors; dm: boolean }) {
  const dauData = [
    { date: "Jan 31", users: 0 }, { date: "Feb 04", users: 1 }, { date: "Feb 10", users: 1 },
    { date: "Feb 14", users: 0.5 }, { date: "Feb 18", users: 0 }, { date: "Feb 24", users: 0 }, { date: "Mar 02", users: 0 },
  ];
  const queryData = [
    { date: "Feb 01", queries: 7 }, { date: "Feb 05", queries: 0 }, { date: "Feb 09", queries: 28 },
    { date: "Feb 12", queries: 14 }, { date: "Feb 15", queries: 26 }, { date: "Feb 22", queries: 0 }, { date: "Mar 02", queries: 0 },
  ];
  const fileTypes = [
    { type: "PDF", color: "#F04438", files: 12, pct: 42 },
    { type: "DOCX", color: "#2E90FA", files: 8, pct: 28 },
    { type: "TXT", color: "#17B26A", files: 5, pct: 17 },
    { type: "CSV", color: "#F79009", files: 2, pct: 7 },
    { type: "XLSX", color: "#7F56D9", files: 1, pct: 6 },
  ];
  const totalFiles = fileTypes.reduce((s, f) => s + f.files, 0);

  const StatCard = ({ label, value, sub, icon }: { label: string; value: string; sub: string; icon: React.ReactNode }) => (
    <div className="rounded-[12px] p-5" style={{ border: `1px solid ${t.border}`, backgroundColor: t.cardBg }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] m-0" style={{ color: t.textMuted }}>{label}</p>
        {icon}
      </div>
      <p className="text-[28px] m-0" style={{ color: t.text }}>{value}</p>
      <p className="text-[12px] m-0 mt-1" style={{ color: t.textMuted }}>{sub}</p>
    </div>
  );

  const tooltipStyle = { fontSize: 12, borderRadius: 8, border: `1px solid ${t.border}`, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", backgroundColor: t.cardBg, color: t.text };

  return (
    <div className="p-6 flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Files" value="1" sub="Files indexed in knowledge base" icon={<FileText size={18} color={t.textMuted} />} />
        <StatCard label="Total Volume" value="0.01 MB" sub="Total storage used" icon={<Box size={18} color={t.textMuted} />} />
        <StatCard label="Last Indexed" value="39 days ago" sub="Jan 21, 2026, 11:26 PM" icon={<Clock size={18} color={t.textMuted} />} />
      </div>
      {/* File Types */}
      <div className="rounded-[12px] p-6" style={{ border: `1px solid ${t.border}`, backgroundColor: t.cardBg }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h4 className="text-[15px] m-0" style={{ color: t.text }}>File Types Distribution</h4>
            <p className="text-[13px] m-0 mt-0.5" style={{ color: t.textMuted }}>Breakdown by type</p>
          </div>
          <span className="text-[13px]" style={{ color: t.textSecondary }}>{totalFiles} total files</span>
        </div>
        <div className="flex gap-8 items-start">
          <div className="shrink-0 relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              {(() => { let cum = 0; const total = fileTypes.reduce((s, f) => s + f.pct, 0); return fileTypes.map(ft => { const sa = (cum / total) * 360 - 90; const sl = (ft.pct / total) * 360; cum += ft.pct; const s = sa + 1, a = sl - 2, r = 62; const sr = (s * Math.PI) / 180, er = ((s + a) * Math.PI) / 180; const d = `M 80 80 L ${80+r*Math.cos(sr)} ${80+r*Math.sin(sr)} A ${r} ${r} 0 ${a>180?1:0} 1 ${80+r*Math.cos(er)} ${80+r*Math.sin(er)} Z`; return <path key={ft.type} d={d} fill={ft.color} opacity={0.85} className="transition-opacity hover:opacity-100 cursor-pointer" />; }); })()}
              <circle cx="80" cy="80" r="40" fill={dm ? "#181b22" : "white"} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[22px]" style={{ fontWeight: 600, color: t.text }}>{totalFiles}</span>
              <span className="text-[11px]" style={{ color: t.textMuted }}>Files</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            {fileTypes.map(ft => (
              <div key={ft.type} className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 shrink-0" style={{ minWidth: 90 }}>
                  <span className="block size-[10px] rounded-full shrink-0" style={{ backgroundColor: ft.color }} />
                  <span className="inline-flex items-center px-2 py-[2px] rounded-[6px] text-[12px]" style={{ backgroundColor: ft.color + "14", color: ft.color, fontWeight: 600 }}>.{ft.type.toLowerCase()}</span>
                </div>
                <div className="flex-1 h-[8px] rounded-full overflow-hidden" style={{ backgroundColor: dm ? "#2e3038" : "#f2f4f7" }}>
                  <div className="h-full rounded-full" style={{ width: `${ft.pct}%`, backgroundColor: ft.color }} />
                </div>
                <span className="text-[13px] tabular-nums shrink-0" style={{ minWidth: 50, textAlign: "right", color: t.textSecondary }}>{ft.files} files</span>
                <span className="inline-flex items-center justify-center rounded-[6px] text-[12px] tabular-nums px-2 py-[1px] shrink-0" style={{ backgroundColor: ft.color + "14", color: ft.color, fontWeight: 600, minWidth: 44 }}>{ft.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-[12px] p-5" style={{ border: `1px solid ${t.border}`, backgroundColor: t.cardBg }}>
          <h4 className="text-[15px] m-0" style={{ color: t.text }}>Daily Active Users</h4>
          <p className="text-[12px] m-0 mt-0.5" style={{ color: t.textMuted }}>Unique users per day</p>
          <div className="mt-4" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dauData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={dm ? "#2e3038" : "#f0f0f0"} vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: t.textMuted }} tickLine={false} axisLine={{ stroke: t.border }} />
                <YAxis tick={{ fontSize: 11, fill: t.textMuted }} tickLine={false} axisLine={false} domain={[0, 2]} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: t.text }} />
                <Line type="monotone" dataKey="users" stroke="#F04438" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#F04438" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-[12px] p-5" style={{ border: `1px solid ${t.border}`, backgroundColor: t.cardBg }}>
          <h4 className="text-[15px] m-0" style={{ color: t.text }}>Daily Queries</h4>
          <p className="text-[12px] m-0 mt-0.5" style={{ color: t.textMuted }}>Queries processed per day</p>
          <div className="mt-4" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={queryData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={dm ? "#2e3038" : "#f0f0f0"} vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: t.textMuted }} tickLine={false} axisLine={{ stroke: t.border }} />
                <YAxis tick={{ fontSize: 11, fill: t.textMuted }} tickLine={false} axisLine={false} domain={[0, 28]} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: t.text }} />
                <Bar dataKey="queries" fill="#7f56d9" radius={[3, 3, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
