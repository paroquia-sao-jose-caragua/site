"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useQueries } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAvailableSlots } from "@/lib/api/appointments/get-available-slots";

interface BookingCalendarProps {
  agentId: string;
  serviceId?: string;
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
}

interface DayItem {
  dateStr: string;
  dayNumber: string;
  weekdayShort: string;
  monthYearLabel: string;
  isFuture: boolean;
  isAvailable: boolean;
  isChecking: boolean;
}

function toDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function BookingCalendar({
  agentId,
  serviceId,
  selectedDate,
  onSelectDate,
}: BookingCalendarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dayRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const rawDays = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const list: Array<{
      dateStr: string;
      dayNumber: string;
      weekdayShort: string;
      monthYearLabel: string;
      isFuture: boolean;
    }> = [];

    for (let i = -3; i <= 21; i++) {
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
        isFuture: i >= 1,
      });
    }
    return list;
  }, []);

  const futureDays = useMemo(
    () => rawDays.filter((d) => d.isFuture),
    [rawDays]
  );

  const slotQueries = useQueries({
    queries: futureDays.map((d) => ({
      queryKey: ["available-slots", agentId, d.dateStr, serviceId],
      queryFn: () =>
        getAvailableSlots({
          agentId,
          date: d.dateStr,
          serviceId,
        }),
      enabled: Boolean(agentId),
      staleTime: 1000 * 60 * 2,
    })),
  });

  const daysList = useMemo<DayItem[]>(() => {
    const futureIndexByDate = new Map<string, number>();
    futureDays.forEach((d, idx) => futureIndexByDate.set(d.dateStr, idx));

    return rawDays.map((d) => {
      if (!d.isFuture) {
        return {
          ...d,
          isAvailable: false,
          isChecking: false,
        };
      }
      const qIdx = futureIndexByDate.get(d.dateStr)!;
      const query = slotQueries[qIdx];
      const hasSlots = Boolean(query?.data && query.data.length > 0);
      return {
        ...d,
        isAvailable: hasSlots,
        isChecking: Boolean(query?.isPending),
      };
    });
  }, [rawDays, futureDays, slotQueries]);

  const availableDays = useMemo(
    () => daysList.filter((d) => d.isAvailable),
    [daysList]
  );

  // If the currently selected date has no available slots (once checked),
  // automatically advance to the next day with available slots.
  useEffect(() => {
    if (!agentId || availableDays.length === 0) return;

    const currentItem = daysList.find((d) => d.dateStr === selectedDate);
    if (currentItem && currentItem.isChecking) return;

    if (!currentItem || !currentItem.isAvailable) {
      const nextAvailable =
        availableDays.find((d) => d.dateStr > selectedDate) || availableDays[0];
      if (nextAvailable && nextAvailable.dateStr !== selectedDate) {
        onSelectDate(nextAvailable.dateStr);
      }
    }
  }, [agentId, daysList, availableDays, selectedDate, onSelectDate]);

  const monthTitle = useMemo(() => {
    const current = daysList.find((d) => d.dateStr === selectedDate);
    return current?.monthYearLabel || daysList[0]?.monthYearLabel || "";
  }, [daysList, selectedDate]);

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
    if (!selectedDate) return;
    const frame = requestAnimationFrame(() =>
      centerDateInView(selectedDate, false)
    );
    const timer = setTimeout(() => centerDateInView(selectedDate, false), 100);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [selectedDate, centerDateInView]);

  useEffect(() => {
    const handleResize = () => {
      if (selectedDate) centerDateInView(selectedDate, false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedDate, centerDateInView]);

  const handleStepDay = (direction: -1 | 1) => {
    if (availableDays.length === 0) return;
    const currentIndex = availableDays.findIndex(
      (d) => d.dateStr === selectedDate
    );
    const nextIndex =
      currentIndex === -1
        ? 0
        : Math.max(0, Math.min(availableDays.length - 1, currentIndex + direction));
    const target = availableDays[nextIndex];
    if (target) {
      onSelectDate(target.dateStr);
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

  const currentAvailIdx = availableDays.findIndex(
    (d) => d.dateStr === selectedDate
  );

  return (
    <section className="bg-white/95 rounded-2xl p-4 border border-[#D6A64A]/30 shadow-2xs space-y-3 overflow-hidden">
      {/* Header with Chevrons and centered dynamic month title */}
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          disabled={currentAvailIdx <= 0}
          onClick={() => handleStepDay(-1)}
          aria-label="Dia disponível anterior"
          className="p-1.5 rounded-lg text-[#5A463B] hover:text-[#18351E] hover:bg-[#ECD6BD]/40 transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span
          className="text-base sm:text-lg font-bold text-[#18351E] tracking-tight capitalize"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          {monthTitle}
        </span>

        <button
          type="button"
          disabled={
            currentAvailIdx === -1 ||
            currentAvailIdx >= availableDays.length - 1
          }
          onClick={() => handleStepDay(1)}
          aria-label="Próximo dia disponível"
          className="p-1.5 rounded-lg text-[#5A463B] hover:text-[#18351E] hover:bg-[#ECD6BD]/40 transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Horizontally Rolling Weekday Strip */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-3 overflow-x-auto select-none py-2 px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing"
      >
        {daysList.map((d) => {
          const isSelected = d.dateStr === selectedDate && d.isAvailable;

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
              disabled={!d.isAvailable}
              onClick={() => {
                if (hasDraggedRef.current || !d.isAvailable) return;
                onSelectDate(d.dateStr);
                centerDateInView(d.dateStr, true);
              }}
              className={`flex flex-col items-center py-2 sm:py-2.5 px-1.5 sm:px-2 rounded-xl transition-all relative select-none shrink-0 w-[52px] sm:w-[60px] lg:w-[68px] ${
                isSelected
                  ? "bg-[#18351E] text-[#eeca94] shadow-xs scale-105 z-10 cursor-pointer"
                  : d.isAvailable
                  ? "bg-[#ECD6BD]/45 text-[#18351E] hover:bg-[#ECD6BD]/80 cursor-pointer"
                  : "bg-[#f3ece0]/55 text-[#a39485] cursor-not-allowed"
              }`}
            >
              <span
                className={`text-[10px] font-semibold mb-0.5 tracking-tight ${
                  isSelected
                    ? "text-[#D6A64A]"
                    : d.isAvailable
                    ? "text-[#8c7b6c]"
                    : "text-[#b8aa99]"
                }`}
              >
                {d.weekdayShort}
              </span>

              <span
                className={`text-base font-bold tracking-tight ${
                  isSelected
                    ? "text-[#eeca94]"
                    : d.isAvailable
                    ? "text-[#18351E]"
                    : "text-[#a39485]"
                }`}
              >
                {d.dayNumber}
              </span>

              <span
                className={`w-1.5 h-1.5 rounded-full mt-1 transition-opacity ${
                  isSelected
                    ? "bg-[#D6A64A]"
                    : d.isAvailable
                    ? "bg-[#B8872E]/60"
                    : "opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
