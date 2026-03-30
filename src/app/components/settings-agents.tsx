import { useEffect, useRef, useState } from "react";
import { CalendarRange, ChevronDown, Download, RotateCcw } from "lucide-react";
import { ThemeColors } from "./settings-types";
import { agents } from "./agent-selection";

const TODAY = new Date("2026-03-30T12:00:00");
const DEFAULT_START = "2026-03-01";
const DEFAULT_END = "2026-03-30";

const agentMonthlyUsage: Record<string, Record<string, number>> = {
  life: { "2026-01": 981, "2026-02": 1098, "2026-03": 1243 },
  strategic: { "2026-01": 624, "2026-02": 742, "2026-03": 856 },
  stratify: { "2026-01": 388, "2026-02": 461, "2026-03": 542 },
  "legal-contract": { "2026-01": 904, "2026-02": 996, "2026-03": 1089 },
  "car-expert": { "2026-01": 611, "2026-02": 683, "2026-03": 734 },
  "general-insurance": { "2026-01": 1288, "2026-02": 1412, "2026-03": 1521 },
  "health-insurance": { "2026-01": 1761, "2026-02": 1946, "2026-03": 2103 },
  "pptx-generator": { "2026-01": 276, "2026-02": 341, "2026-03": 412 },
  "hr-policy": { "2026-01": 1495, "2026-02": 1688, "2026-03": 1876 },
};

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function shiftDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function parseDate(value: string) {
  return new Date(`${value}T12:00:00`);
}

function monthKey(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}`;
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function overlappingDays(start: Date, end: Date, monthStart: Date, monthEnd: Date) {
  const overlapStart = start > monthStart ? start : monthStart;
  const overlapEnd = end < monthEnd ? end : monthEnd;
  if (overlapStart > overlapEnd) return 0;
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((overlapEnd.getTime() - overlapStart.getTime()) / msPerDay) + 1;
}

function getUsageForRange(agentId: string, startDate: string, endDate: string) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (start > end) return 0;

  let cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  const finalMonth = new Date(end.getFullYear(), end.getMonth(), 1);
  let total = 0;

  while (cursor <= finalMonth) {
    const currentMonthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const currentMonthEnd = endOfMonth(cursor);
    const daysInMonth = currentMonthEnd.getDate();
    const daysUsed = overlappingDays(start, end, currentMonthStart, currentMonthEnd);
    const monthlyTotal = agentMonthlyUsage[agentId]?.[monthKey(cursor)] || 0;

    if (daysUsed > 0 && monthlyTotal > 0) {
      total += (monthlyTotal / daysInMonth) * daysUsed;
    }

    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }

  return Math.round(total);
}

function getPresetDates(preset: "7d" | "30d" | "month") {
  if (preset === "7d") {
    return {
      start: formatDateInput(shiftDays(TODAY, -6)),
      end: formatDateInput(TODAY),
    };
  }

  if (preset === "30d") {
    return {
      start: formatDateInput(shiftDays(TODAY, -29)),
      end: formatDateInput(TODAY),
    };
  }

  return {
    start: formatDateInput(startOfMonth(TODAY)),
    end: formatDateInput(TODAY),
  };
}

function formatRangeLabel(startDate: string, endDate: string) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const sameMonth = start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth();

  if (sameMonth) {
    return `${start.toLocaleString("en-US", { month: "short" })} ${start.getDate()}-${end.getDate()}, ${end.getFullYear()}`;
  }

  return `${start.toLocaleString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

export function AgentsSettings({ t, dm }: { t: ThemeColors; dm: boolean }) {
  const [startDate, setStartDate] = useState(DEFAULT_START);
  const [endDate, setEndDate] = useState(DEFAULT_END);
  const [activePreset, setActivePreset] = useState<"7d" | "30d" | "month" | "custom">("month");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const usageByAgent = Object.fromEntries(
    agents.map((agent) => [agent.id, getUsageForRange(agent.id, startDate, endDate)]),
  );
  const maxUsage = Math.max(...Object.values(usageByAgent), 1);
  const rangeLabel = formatRangeLabel(startDate, endDate);

  const handleDownload = (agentName: string) => {
    console.log(`Downloading report for ${agentName} from ${startDate} to ${endDate}`);
  };

  const applyPreset = (preset: "7d" | "30d" | "month") => {
    const next = getPresetDates(preset);
    setActivePreset(preset);
    setStartDate(next.start);
    setEndDate(next.end);
  };

  const handleStartDateChange = (value: string) => {
    setActivePreset("custom");
    setStartDate(value);
    if (value > endDate) setEndDate(value);
  };

  const handleEndDateChange = (value: string) => {
    setActivePreset("custom");
    setEndDate(value);
    if (value < startDate) setStartDate(value);
  };

  const resetDateFilter = () => {
    const next = getPresetDates("month");
    setActivePreset("month");
    setStartDate(next.start);
    setEndDate(next.end);
  };

  useEffect(() => {
    if (!showDateFilter) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowDateFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDateFilter]);

  const presetButton = (id: "7d" | "30d" | "month", label: string) => {
    const isActive = activePreset === id;
    return (
      <button
        key={id}
        onClick={() => applyPreset(id)}
        className="cursor-pointer border-none rounded-[8px] px-[12px] py-[8px] text-[13px] font-medium transition-all"
        style={{
          backgroundColor: isActive ? "#7f56d9" : (dm ? "#2e3138" : "#f9fafb"),
          color: isActive ? "#ffffff" : t.text,
          border: `1px solid ${isActive ? "#7f56d9" : t.border}`,
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="flex flex-col flex-1 p-[32px] gap-[24px]" style={{ backgroundColor: t.bg }}>
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-[16px]">
        <div className="flex flex-col gap-[8px]">
          <h1 className="text-[24px] font-semibold leading-[32px] m-0" style={{ color: t.text }}>
            Agents
          </h1>
          <p className="text-[14px] leading-[20px] m-0" style={{ color: t.textSecondary }}>
            Manage and monitor all AI agents. Download individual agent reports and view their details.
          </p>
        </div>

        <div className="relative self-start" ref={filterRef}>
          <button
            onClick={() => setShowDateFilter((prev) => !prev)}
            className="flex items-center justify-center gap-[8px] cursor-pointer border-none rounded-[10px] px-[14px] py-[10px] text-[13px] font-medium transition-all"
            style={{
              backgroundColor: showDateFilter ? "#7f56d9" : t.cardBg,
              color: showDateFilter ? "#ffffff" : t.text,
              border: `1px solid ${showDateFilter ? "#7f56d9" : t.border}`,
              boxShadow: showDateFilter ? "0 8px 20px rgba(127,86,217,0.18)" : "none",
            }}
          >
            <CalendarRange size={16} />
            Filter by date
            <ChevronDown
              size={14}
              style={{ transform: showDateFilter ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
            />
          </button>

          {showDateFilter && (
            <div
              className="absolute right-0 top-[calc(100%+10px)] z-20 w-[320px] rounded-[14px] p-[16px] flex flex-col gap-[14px]"
              style={{
                backgroundColor: t.cardBg,
                border: `1px solid ${t.border}`,
                boxShadow: dm ? "0 18px 40px rgba(0,0,0,0.35)" : "0 18px 40px rgba(16,24,40,0.14)",
              }}
            >
              <div className="flex flex-col gap-[4px]">
                <p className="text-[14px] font-semibold leading-[18px] m-0" style={{ color: t.text }}>
                  Filter by date
                </p>
                <p className="text-[12px] leading-[16px] m-0" style={{ color: t.textSecondary }}>
                  Showing usage data for {rangeLabel}
                </p>
              </div>

              <div className="flex flex-wrap gap-[8px]">
                {presetButton("7d", "Last 7 days")}
                {presetButton("30d", "Last 30 days")}
                {presetButton("month", "This month")}
              </div>

              <div className="flex flex-col gap-[10px]">
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[12px] leading-[16px]" style={{ color: t.textMuted }}>
                    Start date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="rounded-[8px] px-[12px] py-[10px] text-[14px] outline-none"
                    style={{
                      backgroundColor: dm ? "#1f232b" : "#ffffff",
                      color: t.text,
                      border: `1px solid ${t.border}`,
                    }}
                  />
                </div>

                <div className="flex flex-col gap-[6px]">
                  <label className="text-[12px] leading-[16px]" style={{ color: t.textMuted }}>
                    End date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    className="rounded-[8px] px-[12px] py-[10px] text-[14px] outline-none"
                    style={{
                      backgroundColor: dm ? "#1f232b" : "#ffffff",
                      color: t.text,
                      border: `1px solid ${t.border}`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-[10px]">
                <button
                  onClick={resetDateFilter}
                  className="flex items-center justify-center gap-[8px] cursor-pointer border-none rounded-[8px] px-[14px] py-[10px] text-[13px] font-medium transition-all"
                  style={{
                    backgroundColor: dm ? "#2e3138" : "#f9fafb",
                    color: t.text,
                    border: `1px solid ${t.border}`,
                  }}
                >
                  <RotateCcw size={14} />
                  Reset
                </button>

                <button
                  onClick={() => setShowDateFilter(false)}
                  className="cursor-pointer border-none rounded-[8px] px-[14px] py-[10px] text-[13px] font-medium transition-all"
                  style={{
                    backgroundColor: "#7f56d9",
                    color: "#ffffff",
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
        {agents.map((agent) => {
          const usage = usageByAgent[agent.id] || 0;

          return (
            <div
              key={agent.id}
              className="rounded-[12px] p-[20px] flex flex-col transition-all"
              style={{
                backgroundColor: t.cardBg,
                border: `1px solid ${t.border}`,
                minHeight: "280px",
              }}
            >
              <div className="flex items-start justify-between mb-[16px]">
                <div
                  className="w-[48px] h-[48px] rounded-[14px] flex items-center justify-center shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${agent.iconColor}35, ${agent.iconColor}15)`,
                    border: `1px solid ${agent.iconColor}40`,
                    backdropFilter: "blur(12px)",
                    boxShadow: `0 2px 8px ${agent.iconColor}10, inset 0 1px 0 rgba(255,255,255,0.15)`,
                  }}
                >
                  <agent.icon size={22} color={agent.iconColor} strokeWidth={1.8} />
                </div>
              </div>

              <div className="flex flex-col gap-[8px] mb-[16px]">
                <h3 className="text-[16px] font-semibold leading-[22px] m-0" style={{ color: t.text }}>
                  {agent.name}
                </h3>
                <p
                  className="text-[13px] leading-[19px] m-0 line-clamp-2"
                  style={{
                    color: t.textSecondary,
                    minHeight: "38px",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {agent.description}
                </p>
              </div>

              <div className="flex flex-col gap-[8px] mb-[16px]">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] leading-[16px] m-0" style={{ color: t.textMuted }}>
                    Total Usage
                  </p>
                  <p className="text-[13px] font-semibold leading-[16px] m-0" style={{ color: "#7f56d9" }}>
                    {usage.toLocaleString()}
                  </p>
                </div>

                <div className="relative w-full h-[8px] rounded-full overflow-hidden" style={{ backgroundColor: dm ? "#2e3138" : "#f0f1f3" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(usage / maxUsage) * 100}%`,
                      background: "linear-gradient(90deg, #7f56d9, #7f56d9cc)",
                      boxShadow: "0 0 8px #7f56d940",
                    }}
                  />
                </div>

                <p className="text-[11px] leading-[14px] m-0" style={{ color: t.textMuted }}>
                  requests in selected period
                </p>
              </div>

              <div className="flex-1" />

              <button
                onClick={() => handleDownload(agent.name)}
                className="flex items-center justify-center gap-[8px] w-full cursor-pointer border-none rounded-[8px] px-[16px] py-[10px] text-[14px] font-medium transition-all"
                style={{
                  backgroundColor: dm ? "#2e3138" : "#f9fafb",
                  color: t.text,
                  border: `1px solid ${t.border}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = dm ? "#3a3d47" : "#f0f1f3";
                  e.currentTarget.style.borderColor = "#7f56d9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = dm ? "#2e3138" : "#f9fafb";
                  e.currentTarget.style.borderColor = t.border;
                }}
              >
                <Download size={16} />
                Download Report
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
