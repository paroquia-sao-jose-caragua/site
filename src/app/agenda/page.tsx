"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  MapPin,
  RefreshCw,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { listCalendarSchedules } from "@/lib/api/calendar/list";
import type {
  CalendarSchedule,
  EventSchedule,
  Schedule,
} from "@/entities/CalendarSchedule";
import { BotanicalDivider } from "@/components/icons/BotanicalDivider";
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
        time: `${schedule.startTime} - ${schedule.endTime}`,
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
        ...(schedule.type === "event"
          ? {
              eventType: schedule.eventType,
              customLocation: schedule?.customLocation,
            }
          : {}),
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
    <div className="bg-[#F8F0E7] border border-[#d6a64a]/50 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-[#ECD6BD]/50 transition-colors text-[#32402A]/80"
        >
          <ChevronLeft size={15} />
        </button>
        <span
          className="text-[13px] text-[#32402A]"
          style={{ fontWeight: 600 }}
        >
          {MONTHS_PT[calMonth - 1]} {calYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-[#ECD6BD]/50 transition-colors text-[#32402A]/80"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] text-[#32402A]/80 py-1"
            style={{ fontWeight: 500 }}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
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
                "relative flex flex-col items-center justify-center h-8 w-full rounded-lg text-[12px] transition-all",
                isSelected
                  ? "bg-[#355231] text-[#ffe7c2]"
                  : isToday
                    ? "bg-[#ECD6BD]/50 text-[#32402A]"
                    : "text-[#32402A] hover:bg-[#ECD6BD]/50",
              ].join(" ")}
              style={{ fontWeight: isToday || isSelected ? 600 : 400 }}
            >
              {day}
              {hasEvent && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 size-0.75 rounded-full bg-[#32402A]/80" />
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

  return (
    <div>
      <button
        type="button"
        onClick={() => setSelectedSchedule(event)}
        className="bg-[#f9efe6] hover:bg-[#ECD6BD]/20 border border-[#d6a64a] rounded-xl px-5 py-4 flex items-start gap-4 hover:border-[#dcc2b5] hover:shadow-sm transition-all cursor-pointer w-full text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[#32402A]/80 text-[13px]">{event.time}</span>
            {event.recurring && (
              <span
                className="inline-flex items-center gap-1 text-[#7b4f37] text-[11px] bg-[#ECD6BD]/20 border border-[#dcc2b5]/60 px-2 py-0.5 rounded-full"
                style={{ fontWeight: 500 }}
              >
                <RefreshCw size={10} />
                Recorrente
              </span>
            )}
          </div>
          <p
            className="text-[#32402A] text-[15px] mb-2"
            style={{ fontWeight: 600 }}
          >
            {event.name}
          </p>
          {event.description && (
            <p className="text-[#32402A]/80 text-[13px] mb-2">
              {event.description}
            </p>
          )}
          <div className="flex items-center gap-1 text-[#A3651B] text-[13px]">
            <MapPin size={12} />
            <span>{communityName}</span>
          </div>
        </div>
        {img && (
          <img
            src={img}
            alt={communityName || ""}
            className="size-9 rounded-full object-cover ring-2 ring-[#d6a64a] shrink-0 mt-0.5"
          />
        )}
      </button>

      {selectedSchedule && (
        <ScheduleModal
          schedule={selectedSchedule}
          onClose={() => setSelectedSchedule(null)}
        />
      )}
    </div>
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

    if (currentEvents.length > 0) {
      return currentData;
    }

    return nextData;
  }, [currentData, nextData, isCurrentMonth, today]);

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
    <div className="relative overflow-hidden min-h-screen bg-[#F8F0E7]">
      {/* Page header */}
      <div className="relative bg-[#18351e]">
        <div className="flex flex-col items-start max-w-320 mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-1 text-[#d6b686] text-sm mb-4 bg-[#1f3f26] px-3 py-1.5 rounded-full border border-[#eeca94]/20">
            <Calendar size={16} />
            <span>Agenda</span>
          </div>
          <h1 className="text-[#fff8f0] text-3xl lg:text-4xl font-semibold">
            Programação da Paróquia
          </h1>
        </div>
      </div>

      {/* Month tabs */}
      <div className="sticky top-24 z-40 bg-[#18351e] border-b border-[#d6b686]">
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
                  "px-5 py-3 text-md whitespace-nowrap border-b-2 transition-all shrink-0",
                  selectedMonth === m.value
                    ? "border-[#d6b686] text-[#d6b686] bg-[#234125]"
                    : "border-transparent text-[#d6b686] hover:text-[#d6b686] hover:bg-[#234125]/40",
                ].join(" ")}
                style={{ fontWeight: selectedMonth === m.value ? 600 : 400 }}
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
          <div className="w-full lg:w-65 shrink-0 space-y-4 lg:sticky lg:top-[calc(6rem+3.25rem+2rem)] lg:self-start">
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
            <div className="bg-[#F8F0E7] border border-[#d6a64a]/50 rounded-2xl p-4 shadow-sm">
              <p
                className="text-[11px] text-[#18351e] uppercase tracking-widest mb-3"
                style={{ fontWeight: 600 }}
              >
                Comunidade
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCommunityId("all")}
                  className={[
                    "w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors",
                    selectedCommunityId === "all"
                      ? "bg-[#355231] text-[#ffe7c2]"
                      : "text-[#2b2b2b] hover:bg-[#ECD6BD]/50",
                  ].join(" ")}
                  style={{
                    fontWeight: selectedCommunityId === "all" ? 600 : 400,
                  }}
                >
                  Todas
                </button>
                {communities.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCommunityId(c.id)}
                    className={[
                      "w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors flex items-center gap-2",
                      selectedCommunityId === c.id
                        ? "bg-[#355231] text-[#ffe7c2]"
                        : "text-[#2b2b2b] hover:bg-[#ECD6BD]/50",
                    ].join(" ")}
                    style={{
                      fontWeight: selectedCommunityId === c.id ? 600 : 400,
                    }}
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
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-[13px] text-[#32402A]/80">
                  Filtros ativos:
                </span>
                {selectedDate && (
                  <span
                    className="inline-flex items-center gap-1.5 bg-[#ECD6BD]/20 border border-[#dcc2b5] text-[#4a2f24] text-[12px] px-3 py-1 rounded-full"
                    style={{ fontWeight: 500 }}
                  >
                    <Calendar size={11} />
                    {formatDateLabel(selectedDate).split(",")[0] +
                      ", " +
                      parseDate(selectedDate).getDate() +
                      " de " +
                      MONTHS_PT[parseDate(selectedDate).getMonth()]}
                    <button
                      onClick={() => setSelectedDate("")}
                      className="ml-1 hover:text-[#7b4f37]"
                    >
                      <X size={11} />
                    </button>
                  </span>
                )}
                {selectedCommunity && (
                  <span
                    className="inline-flex items-center gap-1.5 bg-[#ECD6BD]/20 border border-[#dcc2b5] text-[#4a2f24] text-[12px] px-3 py-1 rounded-full"
                    style={{ fontWeight: 500 }}
                  >
                    <MapPin size={11} />
                    {selectedCommunity?.name}
                    <button
                      onClick={() => setSelectedCommunityId("all")}
                      className="ml-1 hover:text-[#7b4f37]"
                    >
                      <X size={11} />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-[12px] text-[#4a2f24]/80 hover:text-[#4a2f24] transition-colors font-bold"
                >
                  Limpar tudo
                </button>
              </div>
            )}

            {/* Day list */}
            <div className="space-y-8">
              {isPending && (
                <div className="text-center py-16">
                  <div className="relative mx-auto mb-3 w-fit">
                    <Calendar
                      size={40}
                      className="text-[#caa48f] animate-[softPulse_2s_ease-in-out_infinite]"
                    />

                    <div className="absolute inset-0 animate-ping opacity-20">
                      <Calendar size={40} className="text-[#b8896f]" />
                    </div>
                  </div>

                  <p
                    className="text-[#6b7280] text-[15px]"
                    style={{ fontWeight: 500 }}
                  >
                    Carregando agenda
                    <span className="inline-flex ml-1 gap-[2px]">
                      <span className="animate-bounce [animation-delay:0ms]">
                        .
                      </span>
                      <span className="animate-bounce [animation-delay:150ms]">
                        .
                      </span>
                      <span className="animate-bounce [animation-delay:300ms]">
                        .
                      </span>
                    </span>
                  </p>
                </div>
              )}

              {!isPending && isError && (
                <div className="text-center py-16">
                  <Calendar size={40} className="text-[#dcc2b5] mx-auto mb-3" />
                  <p
                    className="text-[#6b7280] text-[15px]"
                    style={{ fontWeight: 500 }}
                  >
                    Não foi possível carregar a agenda
                  </p>
                  <p className="text-[#9ca3af] text-[13px] mt-1">
                    Tente novamente em alguns instantes
                  </p>
                </div>
              )}

              {!isPending &&
                !isError &&
                datesToShow.map((dateStr) => {
                  const events = eventsByDay.get(dateStr) ?? [];
                  const isToday =
                    dateStr ===
                    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

                  return (
                    <div key={dateStr}>
                      <div className="flex items-center gap-2 mb-3">
                        <BotanicalDivider height={30} width={45} />
                        <h2
                          className="text-[#32402A] text-[17px]"
                          style={{ fontWeight: 600 }}
                        >
                          {formatDateLabel(dateStr)}
                        </h2>
                        {isToday && (
                          <span
                            className="text-[11px] bg-[#32402A] text-[#ffe7c2] px-2 py-0.5 rounded-full"
                            style={{ fontWeight: 500 }}
                          >
                            Hoje
                          </span>
                        )}
                      </div>

                      <div className="space-y-3">
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
                  <div className="text-center py-16">
                    <Calendar
                      size={40}
                      className="text-[#dcc2b5] mx-auto mb-3"
                    />
                    <p
                      className="text-[#4a2f24]/80 text-[15px]"
                      style={{ fontWeight: 500 }}
                    >
                      Nenhum evento encontrado
                    </p>
                    <p className="text-[#4a2f24]/60 text-[13px] mt-1">
                      Tente outro mês ou remova os filtros
                    </p>
                    {hasFilters && (
                      <button
                        onClick={clearFilters}
                        className="mt-4 text-[#4a2f24]/80 text-[13px] hover:text-[#4a2f24] transition-colors font-bold"
                      >
                        Limpar filtros
                      </button>
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Onda decorativa inferior */}
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
        <div className="min-h-screen bg-[#fafafa]">
          <div className="bg-white border-b border-[#e5e7eb]">
            <div className="max-w-320 mx-auto px-6 py-6">
              <div className="h-4 w-20 rounded bg-[#f9f5f2]" />
              <div className="mt-3 h-8 w-72 max-w-full rounded bg-[#f9f5f2]" />
            </div>
          </div>
        </div>
      }
    >
      <AgendaPageContent />
    </Suspense>
  );
}
