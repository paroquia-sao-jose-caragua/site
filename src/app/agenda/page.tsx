"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
  MapPin,
  Sparkles,
  X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { listCalendarSchedules } from "@/lib/api/calendar/list";
import type {
  CalendarSchedule,
  EventSchedule,
  Schedule,
} from "@/entities/CalendarSchedule";
import type { Community } from "@/entities/Community";
import { ScheduleModal } from "@/components/ScheduleModal";
import { useCommunities } from "@/lib/api/communities/use-communities";
import dayjs from "dayjs";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const WEEKDAYS_FULL = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];
const MONTHS_PT = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function getVisibleMonths() {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  return Array.from({ length: 5 }, (_, index) => {
    const rawMonth = currentMonth + index;
    const month = ((rawMonth - 1) % 12) + 1;
    const year = rawMonth > 12 ? currentYear + 1 : currentYear;

    return {
      value: month,
      year,
      label: MONTHS_PT[month - 1],
    };
  });
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay();
}

function parseDate(str: string) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDateLabel(dateStr: string) {
  const d = parseDate(dateStr);
  const weekday = WEEKDAYS_FULL[d.getDay()];
  const day = d.getDate();
  const month = MONTHS_PT[d.getMonth()];
  return `${weekday}, ${day} de ${month}`;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

function matchesCommunityFilter(
  event: AgendaEvent,
  selectedCommunityId: string,
  communities: Community[],
) {
  if (
    selectedCommunityId === "all" ||
    event.communityId === selectedCommunityId
  ) {
    return true;
  }

  const legacyCommunity = communities.find((c) => c.id === selectedCommunityId);

  if (!legacyCommunity || !event.community.name) {
    return false;
  }

  const eventCommunityName = normalizeText(event.community.name);
  const legacyName = normalizeText(legacyCommunity.name);

  return (
    eventCommunityName.includes(legacyName) ||
    legacyName.includes(eventCommunityName)
  );
}

const getEventTypeLabel = (eventType: EventSchedule["eventType"]): string => {
  switch (eventType) {
    case "mass":
      return "Santa Missa";
    case "pilgrimage":
      return "Peregrinação";
    case "service":
      return "Serviço";
    case "formation":
      return "Formação";
    case "feast":
      return "Festa";
    case "anniversary":
      return "Aniversário";
    case "conference":
      return "Conferência";
    case "meeting":
      return "Encontro";
    case "celebration":
      return "Celebração";
    case "retreat":
      return "Retiro";
    case "liturgical_event":
      return "Evento Litúrgico";
    case "ordination":
      return "Ordenação";
    case "community_event":
      return "Evento Comunitário";
    case "other":
      return "Evento";
    default:
      return "Evento";
  }
};

function getScheduleName(schedule: Schedule) {
  if (schedule.type === "mass" || schedule.eventType === "mass") {
    return "Santa Missa";
  }

  return getEventTypeLabel(schedule.eventType);
}

function getScheduleDescription(schedule: Schedule) {
  if (schedule.cancellationReason) {
    return schedule.cancellationReason;
  }

  return schedule.orientations;
}

function isRecurringSchedule(schedule: Schedule) {
  return schedule.type === "mass" && schedule.massType === "ordinary";
}

function mapCalendarToAgendaEvents(calendar: CalendarSchedule[]) {
  return calendar.flatMap((day) => {
    const date = day.date.slice(0, 10);
    const activeSchedules = day.schedules.active;

    if (activeSchedules.length === 0) {
      return [];
    }

    return activeSchedules.map((schedule): AgendaEvent => {
      return {
        id:
          schedule.type === "mass"
            ? `${date}-${schedule.massScheduleId}`
            : `${date}-${schedule.eventScheduleId}`,
        type: schedule.type,
        name: getScheduleName(schedule),
        time:
          schedule.type === "mass" || (schedule.type === "event" && schedule.eventType === "mass")
            ? schedule.startTime
            : schedule.endTime
              ? `${schedule.startTime} — ${schedule.endTime}`
              : schedule.startTime,
        communityId: schedule.community.id,
        location: schedule.community.address,
        orientations: schedule?.orientations,
        ...(schedule.type === "event"
          ? {
              eventType: schedule.eventType,
              customLocation: schedule?.customLocation,
            }
          : {}),
        recurring: isRecurringSchedule(schedule),
        date,
        description: getScheduleDescription(schedule),
        community: schedule.community,
        isPrecept: schedule.isPrecept,
        title: schedule?.title,
        massType: schedule?.massType,
      };
    });
  });
}

interface MiniCalendarProps {
  year: number;
  month: number;
  selectedDate: string | null;
  eventDates: Set<string>;
  onSelect: (date: string) => void;
  onMonthChange?: (year: number, month: number) => void;
}

function MiniCalendar({
  year,
  month,
  selectedDate,
  eventDates,
  onSelect,
  onMonthChange,
}: MiniCalendarProps) {
  const [calYear, setCalYear] = useState(year);
  const [calMonth, setCalMonth] = useState(month);

  useEffect(() => {
    setCalYear(year);
    setCalMonth(month);
  }, [year, month]);

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const today = new Date();

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const prevMonth = () => {
    let nextY = calYear;
    let nextM = calMonth - 1;
    if (calMonth === 1) {
      nextM = 12;
      nextY = calYear - 1;
    }
    setCalMonth(nextM);
    setCalYear(nextY);
    onMonthChange?.(nextY, nextM);
  };
  const nextMonth = () => {
    let nextY = calYear;
    let nextM = calMonth + 1;
    if (calMonth === 12) {
      nextM = 1;
      nextY = calYear + 1;
    }
    setCalMonth(nextM);
    setCalYear(nextY);
    onMonthChange?.(nextY, nextM);
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3.5">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-[#ECD6BD]/40 transition-colors text-[#18351E] cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>
        <span
          className="text-sm sm:text-base text-[#18351E] font-bold tracking-tight"
        >
          {MONTHS_PT[calMonth - 1]} {calYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-[#ECD6BD]/40 transition-colors text-[#18351E] cursor-pointer"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-xs text-[#5A463B] font-bold py-1.5 uppercase tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1 sm:gap-y-1.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const dateStr = `${calYear}-${String(calMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === todayStr;
          const hasEvent = eventDates.has(dateStr);

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => onSelect(isSelected ? "" : dateStr)}
              className={[
                "relative flex flex-col items-center justify-center h-9 sm:h-10 w-full rounded-xl text-sm transition-all cursor-pointer font-medium",
                isSelected
                  ? "bg-[#18351E] text-[#ffe7c2] font-bold shadow-2xs"
                  : isToday
                    ? "bg-[#ECD6BD]/50 text-[#18351E] font-semibold"
                    : "text-[#2b2b2b] hover:bg-[#ECD6BD]/30",
              ].join(" ")}
            >
              {day}
              {hasEvent && !isSelected && (
                <span className="absolute bottom-1 sm:bottom-1.5 left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-[#B8872E]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface AgendaEvent {
  id: string;
  name: string;
  type: Schedule["type"];
  time: string;
  communityId: string;
  recurring: boolean;
  date: string; // "YYYY-MM-DD"
  description?: string;
  location: string;
  title?: string;
  isPrecept?: boolean;
  customLocation?: string;
  orientations?: string;
  massType?: "ordinary" | "devotional" | "solemnity" | "sacramental";
  eventType?:
    | "mass"
    | "pilgrimage"
    | "service"
    | "formation"
    | "feast"
    | "anniversary"
    | "conference"
    | "meeting"
    | "celebration"
    | "retreat"
    | "liturgical_event"
    | "ordination"
    | "community_event"
    | "other";
  community: {
    id: string;
    type: Community["type"];
    coverUrl: string;
    name: string;
    address: string;
  };
}

interface EventCardProps {
  event: AgendaEvent;
}

function EventCard({ event }: EventCardProps) {
  const [selectedSchedule, setSelectedSchedule] = useState<AgendaEvent | null>(
    null,
  );

  const communityName = event.community.name;
  const img = event.community.coverUrl;
  const isMass = event.type === "mass" || event.eventType === "mass";

  return (
    <>
      <div
        onClick={() => setSelectedSchedule(event)}
        className="group bg-[#fbf5eb] border border-[#D6A64A]/40 hover:border-[#B8872E] rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between text-left"
      >
        <div>
          {/* Top row: Time pill, Precept badge, Special badges, Community Avatar */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Horário (sem parecer botão) */}
              <div className="flex items-center gap-1.5 font-mono text-sm sm:text-base font-bold text-[#18351E]">
                <Clock className="w-4 h-4 text-[#B8872E]" />
                <span>{event.time}</span>
              </div>

              {/* Precept Badge (Em destaque sem badge de recorrência) */}
              {event.isPrecept && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#18351E] text-[#eeca94] border border-[#d6a64a]/50 shadow-2xs">
                  ✦ Preceito
                </span>
              )}

              {/* Solemnity Badge */}
              {event.massType === "solemnity" && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#ECD6BD]/40 text-[#B8872E] border border-[#D6A64A]/50">
                  <Sparkles className="w-3 h-3 text-[#B8872E]" />
                  <span>Solenidade</span>
                </span>
              )}

              {/* Devotional Badge */}
              {event.massType === "devotional" && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#f6eff9] text-[#76428a] border border-[#76428a]/30">
                  <Sparkles className="w-3 h-3 text-[#76428a]" />
                  <span>Devocional</span>
                </span>
              )}

              {/* Event Type Badge if not mass */}
              {!isMass && event.eventType && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#eef5fc] text-[#1e588f] border border-[#1e588f]/30">
                  <CalendarDays className="w-3 h-3 text-[#1e588f]" />
                  <span>{getEventTypeLabel(event.eventType)}</span>
                </span>
              )}
            </div>

            {/* Community Avatar / Cover */}
            {img && (
              <img
                src={img}
                alt={communityName || ""}
                className="size-10 rounded-full object-cover ring-2 ring-[#D6A64A]/50 shrink-0"
              />
            )}
          </div>

          {/* Title and Orientations */}
          <div className="space-y-1">
            <h3
              className="text-xl sm:text-2xl font-semibold text-[#18351E] leading-snug group-hover:text-[#B8872E] transition-colors"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              {isMass ? (
                <>
                  Santa Missa
                  {event.massType === "devotional" && event.title
                    ? ` Devocional — ${event.title}`
                    : ""}
                  {event.massType === "solemnity" && event.title
                    ? ` Solene — ${event.title}`
                    : ""}
                  {!event.massType && event.title ? ` — ${event.title}` : ""}
                </>
              ) : (
                event.name
              )}
            </h3>

            {(event.orientations || event.description) && (
              <p className="text-xs sm:text-sm text-[#5A463B] font-serif leading-relaxed line-clamp-2">
                {event.orientations || event.description}
              </p>
            )}
          </div>
        </div>

        {/* Card Footer: Location & Ver Detalhes (Visualização Pública, sem formato de botão) */}
        <div className="mt-4 pt-3.5 border-t border-[#D6A64A]/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#5A463B]">
            <MapPin className="w-3.5 h-3.5 text-[#B8872E] shrink-0" />
            <span className="font-medium text-[#5A463B] group-hover:text-[#18351E] transition-colors truncate max-w-[220px] sm:max-w-[340px]">
              {event.customLocation
                ? event.customLocation
                : `${event.community.type === "parish_church" ? "Paróquia Matriz " : "Capela "} ${communityName}`}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#18351E] group-hover:text-[#B8872E] transition-all shrink-0">
            <span>Ver detalhes</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>

      {selectedSchedule && (
        <ScheduleModal
          schedule={selectedSchedule}
          onClose={() => setSelectedSchedule(null)}
        />
      )}
    </>
  );
}

function AgendaPageContent() {
  const today = dayjs();

  const currentMonth = today.month() + 1;
  const currentYear = today.year();

  const nextMonthDate = today.add(1, "month");

  const nextMonth = nextMonthDate.month() + 1;
  const nextYear = nextMonthDate.year();

  const searchParams = useSearchParams();

  const visibleMonths = useMemo(() => getVisibleMonths(), []);
  const { communities } = useCommunities();

  const initialMonthObj = visibleMonths.find((m) => m.value === currentMonth) ?? visibleMonths[0];

  const [selectedMonth, setSelectedMonth] = useState(initialMonthObj.value);
  const [selectedYear, setSelectedYear] = useState(initialMonthObj.year);
  const [selectedCommunityId, setSelectedCommunityId] = useState("all");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const selectedCommunity = useMemo(() => {
    if (selectedCommunityId === "all") return undefined;

    return communities.find((c) => c.id === selectedCommunityId);
  }, [selectedCommunityId, communities]);

  useEffect(() => {
    const param = searchParams.get("comunidade") ?? "all";

    setSelectedCommunityId(param);
  }, [searchParams]);

  const isCurrentMonth = selectedMonth === currentMonth && selectedYear === currentYear;

  const {
    data: currentData,
    isPending,
    isError,
  } = useQuery({
    queryKey: [
      "calendar-schedules",
      selectedYear,
      selectedMonth,
      selectedCommunityId,
    ],
    queryFn: () =>
      listCalendarSchedules({
        month: selectedMonth,
        year: selectedYear,
        communityId:
          selectedCommunityId !== "all" ? selectedCommunityId : undefined,
      }),
    refetchOnWindowFocus: false,
  });

  const { data: nextData } = useQuery({
    queryKey: ["calendar-schedules", nextYear, nextMonth, selectedCommunityId],
    queryFn: () =>
      listCalendarSchedules({
        month: nextMonth,
        year: nextYear,
        communityId:
          selectedCommunityId !== "all" ? selectedCommunityId : undefined,
      }),
    enabled: isCurrentMonth,
    refetchOnWindowFocus: false,
  });

  const data = useMemo(() => {
    if (!isCurrentMonth) {
      return currentData;
    }

    const currentEvents = mapCalendarToAgendaEvents(
      currentData?.calendar ?? [],
    ).filter((event) => event.date >= today.format("YYYY-MM-DD"));

    return currentEvents.length > 0 ? currentData : nextData;
  }, [currentData, nextData, isCurrentMonth, today]);

  useEffect(() => {
    if (!isCurrentMonth) return;

    const currentEvents = mapCalendarToAgendaEvents(
      currentData?.calendar ?? [],
    ).filter((event) => event.date >= today.format("YYYY-MM-DD"));

    if (currentEvents.length === 0 && nextData?.calendar?.length) {
      setSelectedMonth(nextMonth);
      setSelectedYear(nextYear);
    }
  }, [currentData, nextData, isCurrentMonth, nextMonth, nextYear, today]);

  const agendaEvents = useMemo(() => {
    return mapCalendarToAgendaEvents(data?.calendar ?? []);
  }, [data?.calendar]);

  const filteredEvents = useMemo(() => {
    return agendaEvents.filter((e) => {
      const d = parseDate(e.date);
      const monthMatch =
        d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
      const communityMatch = selectedCommunityId
        ? matchesCommunityFilter(e, selectedCommunityId, communities)
        : undefined;
      const dateMatch = !selectedDate || e.date === selectedDate;
      return monthMatch && communityMatch && dateMatch;
    });
  }, [
    agendaEvents,
    selectedMonth,
    selectedYear,
    selectedCommunityId,
    selectedDate,
    communities,
  ]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, AgendaEvent[]>();
    filteredEvents.forEach((e) => {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    });
    return map;
  }, [filteredEvents]);

  const datesToShow = useMemo(() => {
    if (selectedDate) {
      return eventsByDay.has(selectedDate) ? [selectedDate] : [];
    }

    return Array.from(eventsByDay.keys()).sort();
  }, [eventsByDay, selectedDate]);

  const eventDatesSet = useMemo(() => {
    const s = new Set<string>();
    agendaEvents.forEach((e) => {
      const d = parseDate(e.date);
      if (
        d.getMonth() + 1 === selectedMonth &&
        d.getFullYear() === selectedYear
      ) {
        s.add(e.date);
      }
    });
    return s;
  }, [agendaEvents, selectedMonth, selectedYear]);

  const clearFilters = () => {
    setSelectedDate("");
    setSelectedCommunityId("all");
  };

  const hasFilters = selectedDate !== "" || selectedCommunityId !== "all";

  return (
    <main className="relative overflow-hidden bg-[#fbf6ee] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6 mb-32">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#8c7b6c] mb-6 flex items-center gap-2 font-medium">
          <Link href="/" className="hover:text-[#2d261e] transition-colors">
            Início
          </Link>
          <span>&gt;</span>
          <span className="text-[#2d261e]">Agenda Pastoral</span>
        </nav>

        {/* Header Block: Title */}
        <div className="mb-8 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a6824b] uppercase tracking-widest mb-2">
            <Calendar className="w-4 h-4" />
            <span>AGENDA PASTORAL</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#18351E]">
            Programação da Paróquia
          </h1>
          <p className="text-sm md:text-base text-[#6b5c4d] mt-2 leading-relaxed">
            Acompanhe as celebrações, eventos pastorais e missas de todas as nossas comunidades.
          </p>
        </div>

        {/* Month Selector Bar & Discreet Community Select with separating border */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D6A64A]/30 mb-8">
          {/* Month buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {visibleMonths.map((m) => {
              const isSelected = selectedMonth === m.value && selectedYear === m.year;
              return (
                <button
                  key={`${m.year}-${m.value}`}
                  onClick={() => {
                    setSelectedMonth(m.value);
                    setSelectedYear(m.year);
                    setSelectedDate("");
                  }}
                  className={`px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    isSelected
                      ? "bg-[#1b2a26] text-white shadow-xs font-semibold"
                      : "bg-[#fbf5eb] text-[#6b5c4d] border border-[#e8e2d8] hover:border-[#a6824b] hover:text-[#2d261e]"
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* Discreet Community Select */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-[#5A463B] uppercase tracking-wider hidden sm:inline">
              Comunidade:
            </span>
            <div className="relative">
              <select
                value={selectedCommunityId}
                onChange={(e) => setSelectedCommunityId(e.target.value)}
                className="appearance-none bg-[#fbf5eb] border border-[#D6A64A]/50 text-[#18351E] text-xs sm:text-sm font-medium rounded-xl pl-3 pr-8 py-2 shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#B8872E] hover:border-[#B8872E] transition-colors cursor-pointer"
                aria-label="Filtrar por comunidade"
              >
                <option value="all">Todas as comunidades</option>
                {communities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.type === "parish_church" ? "Paróquia Matriz " : "Capela "}
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#B8872E] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Content Layout: Cards list (left on desktop) + Sidebar MiniCalendar (right on desktop, top on mobile) */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
          {/* Main Column: Active filters + Cards list (order-2 on mobile, lg:order-1 on desktop) */}
          <div className="flex-1 min-w-0 w-full order-2 lg:order-1">
            {/* Active filters bar */}
            {hasFilters && (
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <span className="text-xs text-[#5A463B] font-semibold uppercase tracking-wider">
                  Filtros ativos:
                </span>
                {selectedDate && (
                  <span
                    className="inline-flex items-center gap-1.5 bg-[#fbf5eb] border border-[#D6A64A]/50 text-[#18351E] text-xs px-3 py-1 rounded-xl shadow-2xs font-medium"
                  >
                    <Calendar size={12} className="text-[#B8872E]" />
                    {formatDateLabel(selectedDate).split(",")[0] +
                      ", " +
                      parseDate(selectedDate).getDate() +
                      " de " +
                      MONTHS_PT[parseDate(selectedDate).getMonth()]}
                    <button
                      onClick={() => setSelectedDate("")}
                      className="ml-1 text-zinc-400 hover:text-[#18351E] cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedCommunity && (
                  <span
                    className="inline-flex items-center gap-1.5 bg-[#fbf5eb] border border-[#D6A64A]/50 text-[#18351E] text-xs px-3 py-1 rounded-xl shadow-2xs font-medium"
                  >
                    <MapPin size={12} className="text-[#B8872E]" />
                    {selectedCommunity?.name}
                    <button
                      onClick={() => setSelectedCommunityId("all")}
                      className="ml-1 text-zinc-400 hover:text-[#18351E] cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#B8872E] hover:text-[#18351E] transition-colors font-bold cursor-pointer ml-1"
                >
                  Limpar tudo
                </button>
              </div>
            )}

            {/* Day list */}
            <div className="space-y-10">
              {isPending && (
                <div className="bg-[#fbf5eb] border border-[#D6A64A]/30 rounded-3xl p-12 text-center shadow-xs">
                  <div className="relative mx-auto mb-3 w-fit">
                    <Calendar
                      size={40}
                      className="text-[#B8872E] animate-pulse"
                    />
                  </div>

                  <p
                    className="text-[#18351E] text-base font-semibold"
                  >
                    Carregando a programação...
                  </p>
                  <p className="text-xs text-[#5A463B] mt-1">
                    Buscando os agendamentos das comunidades
                  </p>
                </div>
              )}

              {!isPending && isError && (
                <div className="bg-[#fbf5eb] border border-rose-200 rounded-3xl p-12 text-center shadow-xs">
                  <Calendar size={40} className="text-rose-400 mx-auto mb-3" />
                  <p
                    className="text-zinc-800 text-base font-semibold"
                  >
                    Não foi possível carregar a agenda
                  </p>
                  <p className="text-zinc-500 text-xs mt-1">
                    Tente novamente em alguns instantes.
                  </p>
                </div>
              )}

              {!isPending &&
                !isError &&
                datesToShow.map((dateStr) => {
                  const events = eventsByDay.get(dateStr) ?? [];
                  const isToday = dateStr === dayjs().format("YYYY-MM-DD");
                  const dateObj = parseDate(dateStr);

                  return (
                    <div key={dateStr} className="space-y-4">
                      {/* Date Section Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-[#D6A64A]/30">
                        <div className="flex items-center gap-3">
                          {/* Mini Calendar Date Badge */}
                          <div className="flex flex-col items-center justify-center bg-[#fbf5eb] border border-[#D6A64A]/50 rounded-xl px-3 py-1.5 min-w-[52px] shadow-2xs">
                            <span className="text-[10px] font-bold uppercase text-[#B8872E] tracking-wider font-sans">
                              {WEEKDAYS[dateObj.getDay()]}
                            </span>
                            <span className="text-xl font-bold text-[#18351E] font-mono leading-none">
                              {dateObj.getDate()}
                            </span>
                          </div>

                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <h2
                                className="text-xl sm:text-2xl font-semibold text-[#18351E] capitalize"
                                style={{ fontFamily: "Cormorant Garamond, serif" }}
                              >
                                {formatDateLabel(dateStr)}
                              </h2>
                              {isToday && (
                                <span className="text-[11px] bg-[#18351E] text-[#ffe7c2] px-2.5 py-0.5 rounded-full border border-[#D6A64A]/40 font-semibold uppercase tracking-wider">
                                  Hoje
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-[#5A463B] font-medium">
                              {events.length} {events.length === 1 ? "celebração agendada" : "celebrações agendadas"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Cards list */}
                      <div className="space-y-4">
                        {events.map((evt, i) => (
                          <EventCard key={`${evt.id}-${i}`} event={evt} />
                        ))}
                      </div>
                    </div>
                  );
                })}

              {!isPending &&
                !isError &&
                datesToShow.every(
                  (d) => (eventsByDay.get(d) ?? []).length === 0,
                ) && (
                  <div className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-3xl p-12 text-center shadow-xs">
                    <div className="size-16 rounded-2xl bg-[#f3ece0] border border-[#D6A64A]/50 flex items-center justify-center text-[#B8872E] mx-auto mb-4">
                      <Calendar size={32} />
                    </div>
                    <h3
                      className="text-2xl font-semibold text-[#18351E] mb-2"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      Nenhum evento encontrado
                    </h3>
                    <p className="text-sm text-[#5A463B] max-w-md mx-auto mb-6">
                      Não encontramos celebrações para os filtros selecionados. Tente selecionar outro mês ou limpar os filtros.
                    </p>
                    {hasFilters && (
                      <button
                        onClick={clearFilters}
                        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#18351E] text-[#eeca94] text-xs font-semibold hover:bg-[#234125] transition-colors cursor-pointer shadow-xs"
                      >
                        Limpar Filtros
                      </button>
                    )}
                  </div>
                )}
            </div>
          </div>

          {/* Sidebar: MiniCalendar (order-1 on mobile so it renders before cards; lg:order-2 on desktop so it is on the right) */}
          <div className="w-full lg:w-80 xl:w-88 shrink-0 lg:sticky lg:top-24 lg:self-start order-1 lg:order-2">
            <MiniCalendar
              year={selectedYear}
              month={selectedMonth}
              selectedDate={selectedDate}
              eventDates={eventDatesSet}
              onMonthChange={(y, m) => {
                setSelectedYear(y);
                setSelectedMonth(m);
                setSelectedDate("");
              }}
              onSelect={(d) => {
                setSelectedDate(d);
                if (d) {
                  const parts = d.split("-").map(Number);
                  setSelectedYear(parts[0]);
                  setSelectedMonth(parts[1]);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Decorative wave */}
      <div
        className="
          absolute
          bottom-[-2px]
          left-0
          w-[calc(100%+4cm)]
          max-w-none
          ml-[-2cm]
          aspect-[1536/296]
          bg-[url('/wave-separator.svg')]
          bg-no-repeat
          bg-center
          bg-cover
          pointer-events-none
        "
      />
    </main>
  );
}

export default function AgendaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fbf6ee]">
          <div className="bg-[#18351e] border-b border-[#d6b686]">
            <div className="max-w-320 mx-auto px-6 py-10">
              <div className="h-4 w-24 rounded bg-[#1f3f26]" />
              <div className="mt-3 h-8 w-72 max-w-full rounded bg-[#1f3f26]" />
            </div>
          </div>
        </div>
      }
    >
      <AgendaPageContent />
    </Suspense>
  );
}
