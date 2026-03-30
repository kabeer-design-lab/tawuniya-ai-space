import { useState } from "react";
import { Search } from "lucide-react";
import type { ThemeColors } from "./settings-types";

interface AuditLog { id: string; user: string; email: string; actionType: "Create" | "Update" | "Delete"; description: string; resource: string; timestamp: Date; }

const logs: AuditLog[] = [
  { id: "1", user: "Hello brother", email: "default-user@tawuniya.com", actionType: "Update", description: "Updated role: NewROLEEE", resource: "Role", timestamp: new Date(2026, 1, 16, 15, 59, 18) },
  { id: "2", user: "default-user@tawuniya.com", email: "default-user@tawuniya.com", actionType: "Create", description: "Login attempt", resource: "Auth Login", timestamp: new Date(2026, 1, 16, 15, 58, 20) },
  { id: "3", user: "Hello brother", email: "default-user@tawuniya.com", actionType: "Create", description: "Assigned user to role: ckns", resource: "Organization User", timestamp: new Date(2026, 1, 12, 16, 0, 55) },
  { id: "4", user: "Hello brother", email: "default-user@tawuniya.com", actionType: "Delete", description: "Removed user from role: ckns", resource: "Organization User", timestamp: new Date(2026, 1, 12, 16, 0, 47) },
  { id: "5", user: "Hello brother", email: "default-user@tawuniya.com", actionType: "Update", description: "Updated role permissions: ckns", resource: "Role", timestamp: new Date(2026, 1, 12, 15, 58, 10) },
  { id: "6", user: "default-user@tawuniya.com", email: "default-user@tawuniya.com", actionType: "Create", description: "Login attempt", resource: "Auth Login", timestamp: new Date(2026, 1, 12, 15, 50, 5) },
  { id: "7", user: "Hello brother", email: "default-user@tawuniya.com", actionType: "Update", description: "Updated role: admin_role", resource: "Role", timestamp: new Date(2026, 1, 11, 14, 32, 18) },
  { id: "8", user: "Hello brother", email: "default-user@tawuniya.com", actionType: "Delete", description: "Removed temp_user from role", resource: "Organization User", timestamp: new Date(2026, 1, 10, 11, 15, 33) },
];

function fmtTs(d: Date) {
  const mo = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${mo[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`;
}

function Badge({ type, dm }: { type: AuditLog["actionType"]; dm?: boolean }) {
  const s: Record<string, { bg: string; bgD: string; c: string; cD: string; b: string; bD: string }> = {
    Create: { bg: "#ecfdf3", bgD: "#0d2b1a", c: "#067647", cD: "#4ade80", b: "#abefc6", bD: "#166534" },
    Update: { bg: "#eff8ff", bgD: "#0c1e3a", c: "#175cd3", cD: "#60a5fa", b: "#b2ddff", bD: "#1e40af" },
    Delete: { bg: "#fef3f2", bgD: "#2d1212", c: "#b42318", cD: "#f87171", b: "#fecdca", bD: "#991b1b" },
  };
  const v = s[type];
  return <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-[12px] border" style={{ backgroundColor: dm ? v.bgD : v.bg, color: dm ? v.cD : v.c, borderColor: dm ? v.bD : v.b }}>{type}</span>;
}

export function AuditLogsSettings({ t, dm }: { t: ThemeColors; dm: boolean }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 20;
  const filtered = logs.filter(l => l.user.toLowerCase().includes(search.toLowerCase()) || l.description.toLowerCase().includes(search.toLowerCase()) || l.resource.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-6 flex flex-col gap-5">
      <div>
        <h3 className="text-[18px] m-0" style={{ color: t.text }}>Audit Logs</h3>
        <p className="text-[13px] m-0 mt-1" style={{ color: t.textMuted }}>Monitor all user activities and system events</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-[8px] px-3 py-2 flex-1 min-w-[200px] max-w-[320px]" style={{ border: `1px solid ${t.border}`, backgroundColor: t.inputBg }}>
          <Search size={16} color="#A4A7AE" />
          <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search logs..." className="border-none outline-none text-[13px] flex-1 bg-transparent" style={{ color: t.text }} />
        </div>
        {search && <button onClick={() => { setSearch(""); setPage(1); }} className="text-[13px] text-[#7f56d9] bg-transparent border-none cursor-pointer hover:underline px-1">Clear</button>}
      </div>
      <div className="rounded-[12px] overflow-hidden flex flex-col" style={{ border: `1px solid ${t.border}`, maxHeight: "calc(100vh - 280px)" }}>
        <div className="overflow-auto flex-1">
          <table className="w-full border-collapse" style={{ minWidth: 700 }}>
            <thead className="sticky top-0 z-10">
              <tr style={{ backgroundColor: t.bgSecondary }}>
                {["User", "Action", "Description", "Resource", "Timestamp"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[12px]" style={{ color: t.textMuted, borderBottom: `1px solid ${t.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(log => (
                <tr key={log.id} className="transition-colors" style={{ backgroundColor: t.cardBg }}>
                  <td className="px-4 py-3" style={{ borderBottom: `1px solid ${t.border}` }}>
                    <p className="text-[13px] m-0" style={{ color: t.text }}>{log.user}</p>
                    <p className="text-[12px] m-0" style={{ color: t.textMuted }}>{log.email}</p>
                  </td>
                  <td className="px-4 py-3" style={{ borderBottom: `1px solid ${t.border}` }}><Badge type={log.actionType} dm={dm} /></td>
                  <td className="px-4 py-3 text-[13px]" style={{ color: t.textSecondary, borderBottom: `1px solid ${t.border}` }}>{log.description}</td>
                  <td className="px-4 py-3 text-[13px]" style={{ color: t.textSecondary, borderBottom: `1px solid ${t.border}` }}>{log.resource}</td>
                  <td className="px-4 py-3 text-[13px] whitespace-nowrap" style={{ color: t.textMuted, borderBottom: `1px solid ${t.border}` }}>{fmtTs(log.timestamp)}</td>
                </tr>
              ))}
              {paginated.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-[14px]" style={{ color: t.textMuted }}>No logs match your filters</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: `1px solid ${t.border}`, backgroundColor: t.bgSecondary }}>
          <span className="text-[13px]" style={{ color: t.textMuted }}>Showing {filtered.length > 0 ? (page-1)*perPage+1 : 0} to {Math.min(page*perPage, filtered.length)} of {filtered.length}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="rounded-[6px] px-3 py-1 text-[13px] cursor-pointer border-none" style={{ backgroundColor: t.cardBg, color: page === 1 ? t.textMuted : t.textSecondary, border: `1px solid ${t.border}`, opacity: page === 1 ? 0.5 : 1 }}>Previous</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i+1)} className="rounded-[6px] px-2.5 py-1 text-[13px] cursor-pointer border-none" style={{ backgroundColor: page === i+1 ? "#7f56d9" : t.cardBg, color: page === i+1 ? "#fff" : t.textSecondary, border: `1px solid ${page === i+1 ? "#7f56d9" : t.border}` }}>{i+1}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="rounded-[6px] px-3 py-1 text-[13px] cursor-pointer border-none" style={{ backgroundColor: t.cardBg, color: page === totalPages ? t.textMuted : t.textSecondary, border: `1px solid ${t.border}`, opacity: page === totalPages ? 0.5 : 1 }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
