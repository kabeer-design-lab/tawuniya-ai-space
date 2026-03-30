import { FileText } from "lucide-react";
import type { ThemeColors } from "./settings-types";

const docs = [
  { id: "1", name: "Baseer GPT RBAC Report.pdf", size: "6.92 KB", createdAt: "2026-01-21 23:26" },
  { id: "2", name: "Health Insurance Policy 2026.pdf", size: "2.40 MB", createdAt: "2026-03-01 14:12" },
  { id: "3", name: "Motor Coverage Guidelines v3.pdf", size: "1.80 MB", createdAt: "2026-02-28 09:45" },
  { id: "4", name: "Claims Processing Handbook.docx", size: "3.10 MB", createdAt: "2026-02-27 16:30" },
  { id: "5", name: "Travel Insurance FAQ EN.pdf", size: "890 KB", createdAt: "2026-02-25 11:05" },
  { id: "6", name: "CCHI Regulatory Updates Q1.pdf", size: "1.20 MB", createdAt: "2026-02-24 08:18" },
  { id: "7", name: "Vision 2030 Roadmap.pptx", size: "5.60 MB", createdAt: "2026-02-22 15:40" },
  { id: "8", name: "Premium Calculation Tables.xlsx", size: "4.20 MB", createdAt: "2026-02-20 10:22" },
];

export function KnowledgeBasesSettings({ t, dm }: { t: ThemeColors; dm: boolean }) {
  return (
    <div className="p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[18px] m-0" style={{ color: t.text }}>Knowledge Bases</h3>
          <p className="text-[13px] m-0 mt-1" style={{ color: t.textMuted }}>Manage document files that power the AI assistant's responses</p>
        </div>
      </div>
      <div className="rounded-[12px] overflow-hidden flex flex-col" style={{ border: `1px solid ${t.border}`, maxHeight: "calc(100vh - 280px)" }}>
        <div className="overflow-auto flex-1">
          <table className="w-full border-collapse" style={{ minWidth: 600 }}>
            <thead>
              <tr style={{ backgroundColor: t.cardBg }}>
                {["Name", "Type", "Size", "Created At"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[13px]" style={{ color: t.textMuted, borderBottom: `1px solid ${t.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {docs.map(doc => (
                <tr key={doc.id} style={{ backgroundColor: t.cardBg }}>
                  <td className="px-4 py-3" style={{ borderBottom: `1px solid ${t.border}` }}>
                    <a href="#" onClick={e => e.preventDefault()} className="text-[13px] no-underline hover:underline flex items-center gap-2" style={{ color: "#7f56d9" }}>
                      <FileText size={16} color="#7f56d9" className="shrink-0" />
                      {doc.name}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-[13px]" style={{ color: t.textSecondary, borderBottom: `1px solid ${t.border}` }}>{doc.name.split(".").pop()?.toUpperCase()}</td>
                  <td className="px-4 py-3 text-[13px]" style={{ color: t.textSecondary, borderBottom: `1px solid ${t.border}` }}>{doc.size}</td>
                  <td className="px-4 py-3 text-[13px] whitespace-nowrap" style={{ color: t.textSecondary, borderBottom: `1px solid ${t.border}` }}>{doc.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
