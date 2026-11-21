"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AgendaMobileCalendarProps {
  year: number;
  month: number;
  selectedDate: string | null;
  eventDates: Set<string>;
  preceptDates?: Set<string>;
  onSelect: (date: string) => void;
  onMonthChange?: (year: number, month: number) => void;
}

interface DayItem {
  dateStr: string;
  dayNumber: string;
  weekdayShort: string;
  monthYearLabel: string;
  year: number;
  month: number;
}

function toDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function AgendaMobileCalendar({
  year,
  month,
  selectedDate,
  eventDates,
  preceptDates,
  onSelect,
  onMonthChange,
}: AgendaMobileCalendarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dayRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const todayStr = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return toDateStr(d);
  }, []);

  const daysList = useMemo<DayItem[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const list: DayItem[] = [];
    for (let i = 0; i <= 45; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const rawWeek = new Intl.DateTimeFormat("pt-BR", {
        weekday: "short",
      })
        .format(d)
        .replace(".", "");
      const weekdayShort =
        rawWeek.charAt(0).toUpperCase() + rawWeek.slice(1, 3);

      const rawMonthYear = new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        year: "numeric",
      }).format(d);
      const monthYearLabel =
        rawMonthYear.charAt(0).toUpperCase() + rawMonthYear.slice(1);

      list.push({
        dateStr: toDateStr(d),
        dayNumber: String(d.getDate()).padStart(2, "0"),
        weekdayShort,
        monthYearLabel,
        year: d.getFullYear(),
        month: d.getMonth() + 1,
      });
    }
    return list;
  }, []);

  const activeReferenceDate = selectedDate || todayStr;

  const monthTitle = useMemo(() => {
    const current = daysList.find((d) => d.dateStr === activeReferenceDate);
    return current?.monthYearLabel || daysList[0]?.monthYearLabel || "";
  }, [daysList, activeReferenceDate]);

  const centerDateInView = useCallback((dateStr: string, smooth = true) => {
    const container = scrollContainerRef.current;
    const element = dayRefs.current.get(dateStr);
    if (!container || !element) return;

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const diff =
      elementRect.left +
      elementRect.width / 2 -
      (containerRect.left + containerRect.width / 2);

    if (Math.abs(diff) > 1) {
      container.scrollTo({
        left: container.scrollLeft + diff,
        behavior: smooth ? "smooth" : ("instant" as ScrollBehavior),
      });
    }
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      centerDateInView(activeReferenceDate, false)
    );
    return () => cancelAnimationFrame(frame);
  }, [activeReferenceDate, centerDateInView]);

  const handleSelectItem = (item: DayItem) => {
    const isSelected = selectedDate === item.dateStr;
    if (isSelected) {
      onSelect("");
      return;
    }
    if (item.year !== year || item.month !== month) {
      onMonthChange?.(item.year, item.month);
    }
    onSelect(item.dateStr);
    centerDateInView(item.dateStr, true);
  };

  const handleStepDay = (direction: -1 | 1) => {
    const currentIndex = daysList.findIndex(
      (d) => d.dateStr === activeReferenceDate
    );
    const nextIndex =
      currentIndex === -1
        ? 0
        : Math.max(0, Math.min(daysList.length - 1, currentIndex + direction));
    const target = daysList[nextIndex];
    if (target) {
      if (target.year !== year || target.month !== month) {
        onMonthChange?.(target.year, target.month);
      }
      onSelect(target.dateStr);
      centerDateInView(target.dateStr, true);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    isMouseDownRef.current = true;
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftStartRef.current = container.scrollLeft;
    hasDraggedRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    const x = e.pageX - container.offsetLeft;
    const walk = x - startXRef.current;
    if (Math.abs(walk) > 5) {
      hasDraggedRef.current = true;
    }
    container.scrollLeft = scrollLeftStartRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isMouseDownRef.current = false;
  };

  const currentIdx = daysList.findIndex(
    (d) => d.dateStr === activeReferenceDate
  );

  return (
    <div className="bg-[#fbf5eb] border-y border-[#D6A64A]/40 p-4 space-y-3 overflow-hidden w-[calc(100%+36px)] -ml-[18px]">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          disabled={currentIdx <= 0}
          onClick={() => handleStepDay(-1)}
          aria-label="Dia anterior"
          className="p-1.5 rounded-lg hover:bg-[#ECD6BD]/40 transition-colors text-[#18351E] disabled:opacity-30 cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="text-sm sm:text-base text-[#18351E] font-bold tracking-tight capitalize">
          {monthTitle}
        </span>

        <button
          type="button"
          disabled={currentIdx === -1 || currentIdx >= daysList.length - 1}
          onClick={() => handleStepDay(1)}
          aria-label="Próximo dia"
          className="p-1.5 rounded-lg hover:bg-[#ECD6BD]/40 transition-colors text-[#18351E] disabled:opacity-30 cursor-pointer"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Horizontal Days Strip */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="flex items-center gap-1.5 overflow-x-auto select-none py-1.5 px-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing"
      >
        {daysList.map((d) => {
          const isSelected = selectedDate === d.dateStr;
          const isToday = d.dateStr === todayStr;
          const hasEvent = eventDates.has(d.dateStr);
          const hasPrecept = preceptDates?.has(d.dateStr);

          return (
            <button
              key={d.dateStr}
              ref={(el) => {
                if (el) {
                  dayRefs.current.set(d.dateStr, el);
                } else {
                  dayRefs.current.delete(d.dateStr);
                }
              }}
              type="button"
              onClick={() => {
                if (hasDraggedRef.current) return;
                handleSelectItem(d);
              }}
              className={[
                "relative flex flex-col items-center justify-center py-2 px-1.5 rounded-xl transition-all cursor-pointer select-none shrink-0 w-[52px]",
                isSelected
                  ? "bg-[#18351E] text-[#ffe7c2] font-bold shadow-2xs scale-105 z-10"
                  : isToday
                    ? "bg-[#ECD6BD]/50 text-[#18351E] font-semibold"
                    : hasPrecept
                      ? "text-[#18351E] font-bold bg-[#f3ece0]/60 hover:bg-[#ECD6BD]/40"
                      : "text-[#2b2b2b] hover:bg-[#ECD6BD]/30",
              ].join(" ")}
            >
              <span
                className={[
                  "text-[10px] font-semibold mb-0.5 tracking-tight",
                  isSelected ? "text-[#ffe7c2]/80" : "text-[#5A463B]",
                ].join(" ")}
              >
                {d.weekdayShort}
              </span>

              <span className="text-base font-bold tracking-tight leading-none">
                {d.dayNumber}
              </span>

              <span
                className={[
                  "size-1.5 rounded-full mt-1.5 transition-opacity",
                  hasEvent && !isSelected ? "bg-[#B8872E]" : "opacity-0",
                ].join(" ")}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
