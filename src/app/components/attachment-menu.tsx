import { useState, useRef } from "react";
import { Paperclip, Image, FileText, File, X } from "lucide-react";

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
}

interface AttachmentMenuProps {
  onAttach?: (attachment: Attachment) => void;
  attachments?: Attachment[];
  onRemove?: (id: string) => void;
  dm?: boolean;
  t?: any;
}

export function AttachmentMenu({ onAttach, dm, t }: AttachmentMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAttach) {
      onAttach({
        id: Math.random().toString(36).slice(2),
        name: file.name,
        type: file.type,
        size: file.size,
      });
    }
    e.target.value = "";
    setShowMenu(false);
  };

  const menuItems = [
    { icon: Image, label: "Photo / Image", accept: ".png,.jpg,.jpeg,.webp,.gif", ref: imageInputRef },
    { icon: FileText, label: "Document", accept: ".pdf,.docx,.doc,.txt,.csv,.xlsx", ref: fileInputRef },
  ];

  return (
    null
  );
}

export function AttachmentPreview({ attachments, onRemove, dm, t }: { attachments: Attachment[]; onRemove: (id: string) => void; dm?: boolean; t?: any }) {
  if (!attachments.length) return null;

  const getIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    if (type.includes("pdf")) return FileText;
    return File;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex gap-2 flex-wrap px-1 pb-2">
      {attachments.map(att => {
        const Icon = getIcon(att.type);
        return (
          <div
            key={att.id}
            className="flex items-center gap-2 px-3 py-2 rounded-[8px] max-w-[200px]"
            style={{ backgroundColor: dm ? "rgba(127,86,217,0.1)" : "rgba(127,86,217,0.06)", border: `1px solid ${dm ? "rgba(127,86,217,0.2)" : "rgba(127,86,217,0.15)"}` }}
          >
            <Icon size={14} color="#7f56d9" className="shrink-0" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[12px] truncate" style={{ color: t?.text || "#1d2939" }}>{att.name}</span>
              <span className="text-[10px]" style={{ color: t?.textMuted || "#98a2b3" }}>{formatSize(att.size)}</span>
            </div>
            <button
              onClick={() => onRemove(att.id)}
              className="flex items-center justify-center w-[16px] h-[16px] rounded-full border-none cursor-pointer shrink-0"
              style={{ backgroundColor: "transparent", color: t?.textMuted || "#98a2b3" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
              onMouseLeave={e => (e.currentTarget.style.color = t?.textMuted || "#98a2b3")}
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
