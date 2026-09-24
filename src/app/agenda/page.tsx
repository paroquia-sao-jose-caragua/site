"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
  MapPin,
  Sparkles,
  X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
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

  return Array.from({ length: 5 }, (_, index) => {
    const month = ((currentMonth + index - 1) % 12) + 1;

    return {
      value: month,
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
}

function MiniCalendar({
  year,
  month,
  selectedDate,
  eventDates,
  onSelect,
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
    if (calMonth === 1) {
      setCalMonth(12);
      setCalYear((y) => y - 1);
    } else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 12) {
      setCalMonth(1);
      setCalYear((y) => y + 1);
    } else setCalMonth((m) => m + 1);
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-[#ECD6BD]/40 transition-colors text-[#18351E] cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>
        <span
          className="text-[13px] text-[#18351E] font-semibold"
        >
          {MONTHS_PT[calMonth - 1]} {calYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-[#ECD6BD]/40 transition-colors text-[#18351E] cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1.5">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[11px] text-[#5A463B] font-semibold py-1 uppercase tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
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
                "relative flex flex-col items-center justify-center h-8 w-full rounded-lg text-[12px] transition-all cursor-pointer",
                isSelected
                  ? "bg-[#18351E] text-[#ffe7c2] font-bold shadow-2xs"
                  : isToday
                    ? "bg-[#ECD6BD]/50 text-[#18351E] font-semibold"
                    : "text-[#2b2b2b] hover:bg-[#ECD6BD]/30",
              ].join(" ")}
            >
              {day}
              {hasEvent && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-[#B8872E]" />
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

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#B8872E] group-hover:text-[#18351E] transition-all shrink-0">
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

  const initialMonth = visibleMonths.find((m) => m.value === currentMonth)
    ? currentMonth
    : visibleMonths[0].value;

  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
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

  const isCurrentMonth = selectedMonth === currentMonth;

  const {
    data: currentData,
    isPending,
    isError,
  } = useQuery({
    queryKey: [
      "calendar-schedules",
      currentYear,
      selectedMonth,
      selectedCommunityId,
    ],
    queryFn: () =>
      listCalendarSchedules({
        month: selectedMonth,
        year: currentYear,
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
    }
  }, [currentData, nextData, isCurrentMonth, nextMonth, today]);

  const agendaEvents = useMemo(() => {
    return mapCalendarToAgendaEvents(data?.calendar ?? []);
  }, [data?.calendar]);

  const filteredEvents = useMemo(() => {
    return agendaEvents.filter((e) => {
      const d = parseDate(e.date);
      const monthMatch =
        d.getMonth() + 1 === selectedMonth && d.getFullYear() === currentYear;
      const communityMatch = selectedCommunityId
        ? matchesCommunityFilter(e, selectedCommunityId, communities)
        : undefined;
      const dateMatch = !selectedDate || e.date === selectedDate;
      return monthMatch && communityMatch && dateMatch;
    });
  }, [
    agendaEvents,
    selectedMonth,
    selectedCommunityId,
    selectedDate,
    currentYear,
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
        d.getFullYear() === currentYear
      ) {
        s.add(e.date);
      }
    });
    return s;
  }, [agendaEvents, selectedMonth, currentYear]);

  const clearFilters = () => {
    setSelectedDate("");
    setSelectedCommunityId("all");
  };

  const hasFilters = selectedDate !== "" || selectedCommunityId !== "all";

  return (
    <div className="relative overflow-hidden min-h-screen bg-[#fbf6ee]">
      {/* Page header */}
      <div className="relative bg-[#18351e] border-b border-[#d6b686]">
        <div className="flex flex-col items-start max-w-320 mx-auto px-6 py-10 sm:py-12">
          <div className="flex items-center justify-center gap-1.5 text-[#d6b686] text-xs font-semibold uppercase tracking-wider mb-3 bg-[#1f3f26] px-3.5 py-1.5 rounded-full border border-[#eeca94]/20">
            <Calendar size={14} />
            <span>Agenda Pastoral</span>
          </div>
          <h1 className="text-[#fff8f0] text-3xl lg:text-4xl font-semibold leading-tight">
            Programação da Paróquia
          </h1>
          <p
            className="mt-2 text-[#f8f3ece6] text-base sm:text-lg max-w-2xl"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Acompanhe as celebrações da Santa Missa, solenidades e eventos pastorais de todas as nossas comunidades.
          </p>
        </div>
      </div>

      {/* Month tabs */}
      <div className="sticky top-20 z-40 bg-[#18351e] border-b border-[#d6b686]/60 shadow-xs">
        <div className="max-w-320 mx-auto px-6">
          <div className="flex gap-0 overflow-x-auto pb-0 scrollbar-none">
            {visibleMonths.map((m) => (
              <button
                key={m.value}
                onClick={() => {
                  setSelectedMonth(m.value);
                  setSelectedDate("");
                }}
                className={[
                  "px-5 py-3 text-sm whitespace-nowrap border-b-2 transition-all shrink-0 cursor-pointer font-medium",
                  selectedMonth === m.value
                    ? "border-[#d6b686] text-[#d6b686] bg-[#234125] font-semibold"
                    : "border-transparent text-[#d6b686]/80 hover:text-[#d6b686] hover:bg-[#234125]/40",
                ].join(" ")}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-320 mx-auto px-6 pt-8 pb-36">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-72 shrink-0 space-y-5 lg:sticky lg:top-36 lg:self-start">
            {/* Mini calendar */}
            <MiniCalendar
              year={currentYear}
              month={selectedMonth}
              selectedDate={selectedDate}
              eventDates={eventDatesSet}
              onSelect={(d) => {
                setSelectedDate(d);
                if (d) {
                  const m = parseInt(d.split("-")[1]);
                  setSelectedMonth(m);
                }
              }}
            />

            {/* Community filter */}
            <div className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-2xl p-4 shadow-sm">
              <p
                className="text-[11px] text-[#18351e] uppercase tracking-widest mb-3 font-semibold"
              >
                Filtrar por Comunidade
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCommunityId("all")}
                  className={[
                    "w-full text-left px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer",
                    selectedCommunityId === "all"
                      ? "bg-[#18351e] text-[#ffe7c2] font-semibold shadow-2xs"
                      : "text-[#2b2b2b] hover:bg-[#ECD6BD]/40 font-medium",
                  ].join(" ")}
                >
                  Todas as comunidades
                </button>
                {communities.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCommunityId(c.id)}
                    className={[
                      "w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer",
                      selectedCommunityId === c.id
                        ? "bg-[#18351e] text-[#ffe7c2] font-semibold shadow-2xs"
                        : "text-[#2b2b2b] hover:bg-[#ECD6BD]/40 font-medium",
                    ].join(" ")}
                  >
                    <span className="truncate">
                      {c.type === "parish_church"
                        ? "Paróquia Matriz "
                        : "Capela "}
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
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
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D6A64A]/30">
                        <div className="flex items-center gap-3">
                          {/* Mini Calendar Date Badge */}
                          <div className="flex flex-col items-center justify-center bg-[#fbf5eb] border border-[#D6A64A]/50 rounded-xl px-2.5 py-1 min-w-[52px] shadow-2xs">
                            <span className="text-[10px] font-bold uppercase text-[#B8872E] tracking-wider font-sans">
                              {WEEKDAYS[dateObj.getDay()]}
                            </span>
                            <span className="text-xl font-bold text-[#18351E] font-mono leading-none">
                              {dateObj.getDate()}
                            </span>
                          </div>

                          <div>
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
    </div>
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
