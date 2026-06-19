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
import { communities, type AgendaEvent } from "../../data/agendaData";
import { useSearchParams } from "next/navigation";
import { listCalendarSchedules } from "@/lib/api/calendar/list";
import type { CalendarSchedule, Schedule } from "@/entities/CalendarSchedule";

const communityImages: Record<string, string> = {
  psj: "/Desktop5/e1d50cae9fab58435153a4c41bbf85789ad42f26.png",
  cse: "/Desktop5/05954d1396cd22d752a9383cc71f05004fb83a94.png",
  cnsr: "/Desktop5/7387a98bd8b87ea87349155d8dcfa3b57becde99.png",
  csf: "/Desktop5/8923874a787fb8983e3c782e8248f74411a5c7b1.png",
  cscj: "/Desktop5/455ffb51a3b40639c1fdae0be7b7b8c147a6c4b4.png",
};

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

function getCommunityShortName(name: string) {
  return name
    .replace(/^Matriz\s+/i, "")
    .replace(/^Paróquia\s+/i, "")
    .replace(/^Capela\s+/i, "")
    .replace(/^Comunidade\s+/i, "");
}

function formatCommunityName(community: Schedule["community"]) {
  const communityType = community.type as string;
  const prefix =
    communityType === "parish_chapel" || communityType === "parish_church"
      ? "Matriz"
      : "Capela";
  const name = getCommunityShortName(community.name);

  return `${prefix} ${name}`;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

function matchesCommunityFilter(event: AgendaEvent, selectedCommunity: string) {
  if (selectedCommunity === "all" || event.communityId === selectedCommunity) {
    return true;
  }

  const legacyCommunity = communities.find((c) => c.id === selectedCommunity);

  if (!legacyCommunity || !event.communityName) {
    return false;
  }

  const eventCommunityName = normalizeText(event.communityName);
  const legacyNames = [legacyCommunity.name, legacyCommunity.shortName].map(
    normalizeText,
  );

  return legacyNames.some(
    (name) =>
      eventCommunityName.includes(name) || name.includes(eventCommunityName),
  );
}

function getScheduleTitle(schedule: Schedule) {
  if (schedule.type === "event") {
    return schedule.title;
  }

  return schedule.title ?? "Santa Missa";
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
      const communityName = formatCommunityName(schedule.community);

      return {
        id:
          schedule.type === "mass"
            ? `${date}-${schedule.massScheduleId}`
            : `${date}-${schedule.eventScheduleId}`,
        title: getScheduleTitle(schedule),
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        communityId: schedule.community.id,
        communityName,
        communityShortName: getCommunityShortName(communityName),
        communityCoverUrl: schedule.community.coverUrl,
        communityAddress: schedule.community.address,
        recurring: isRecurringSchedule(schedule),
        date,
        description: getScheduleDescription(schedule),
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
    <div className="bg-white border border-[#dcc2b5]/50 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-[#f9f5f2] transition-colors text-[#7b4f37]"
        >
          <ChevronLeft size={15} />
        </button>
        <span
          className="text-[13px] text-[#4a2f24]"
          style={{ fontWeight: 600 }}
        >
          {MONTHS_PT[calMonth - 1]} {calYear}
        </span>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-[#f9f5f2] transition-colors text-[#7b4f37]"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] text-[#7b4f37]/70 py-1"
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
              onClick={() => onSelect(isSelected ? "" : dateStr)}
              className={[
                "relative flex flex-col items-center justify-center h-8 w-full rounded-lg text-[12px] transition-all",
                isSelected
                  ? "bg-[#4a2f24] text-white"
                  : isToday
                    ? "bg-[#f9f5f2] text-[#4a2f24]"
                    : "text-[#2b2b2b] hover:bg-[#f9f5f2]",
              ].join(" ")}
              style={{ fontWeight: isToday || isSelected ? 600 : 400 }}
            >
              {day}
              {hasEvent && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 size-0.75 rounded-full bg-[#a45d00]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface EventCardProps {
  event: AgendaEvent;
}

function EventCard({ event }: EventCardProps) {
  const community = communities.find((c) => c.id === event.communityId);
  const communityName = event.communityName ?? community?.name;
  const img = event.communityCoverUrl ?? communityImages[event.communityId];

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl px-5 py-4 flex items-start gap-4 hover:border-[#dcc2b5] hover:shadow-sm transition-all">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[#2b2b2b]/60 text-[13px]">
            {event.endTime
              ? `${event.startTime} — ${event.endTime}`
              : event.startTime}
          </span>
          {event.recurring && (
            <span
              className="inline-flex items-center gap-1 text-[#7b4f37] text-[11px] bg-[#f9f5f2] border border-[#dcc2b5]/60 px-2 py-0.5 rounded-full"
              style={{ fontWeight: 500 }}
            >
              <RefreshCw size={10} />
              Recorrente
            </span>
          )}
        </div>
        <p
          className="text-[#1a1a1a] text-[15px] mb-2"
          style={{ fontWeight: 600 }}
        >
          {event.title}
        </p>
        {event.description && (
          <p className="text-[#2b2b2b]/60 text-[13px] mb-2">
            {event.description}
          </p>
        )}
        <div className="flex items-center gap-1 text-[#a45d00] text-[13px]">
          <MapPin size={12} />
          <span>{communityName}</span>
        </div>
      </div>
      {img && (
        <img
          src={img}
          alt={communityName || ""}
          className="size-9 rounded-full object-cover ring-2 ring-[#dcc2b5]/50 shrink-0 mt-0.5"
        />
      )}
    </div>
  );
}

function AgendaPageContent() {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const searchParams = useSearchParams();
  const initialCommunity = searchParams.get("comunidade") ?? "all";
  const visibleMonths = useMemo(() => getVisibleMonths(), []);

  const initialMonth = visibleMonths.find((m) => m.value === currentMonth)
    ? currentMonth
    : visibleMonths[0].value;
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedCommunity, setSelectedCommunity] =
    useState<string>(initialCommunity);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Sync if URL param changes (e.g. back navigation)
  useEffect(() => {
    const param = searchParams.get("comunidade") ?? "all";
    setSelectedCommunity(param);
  }, [searchParams]);

  const { data, isPending, isError } = useQuery({
    queryKey: ["calendar-schedules", currentYear, selectedMonth],
    queryFn: () =>
      listCalendarSchedules({
        month: selectedMonth,
        year: currentYear,
      }),
    refetchOnWindowFocus: false,
  });

  const agendaEvents = useMemo(() => {
    return mapCalendarToAgendaEvents(data?.calendar ?? []);
  }, [data?.calendar]);

  const communityOptions = useMemo(() => {
    const options = new Map<
      string,
      {
        id: string;
        name: string;
        shortName: string;
        coverUrl?: string;
      }
    >();

    agendaEvents.forEach((event) => {
      if (!event.communityName || options.has(event.communityId)) {
        return;
      }

      options.set(event.communityId, {
        id: event.communityId,
        name: event.communityName,
        shortName: event.communityShortName ?? event.communityName,
        coverUrl: event.communityCoverUrl,
      });
    });

    if (options.size === 0) {
      communities.forEach((community) => {
        options.set(community.id, {
          id: community.id,
          name: community.name,
          shortName: community.shortName,
          coverUrl: communityImages[community.id],
        });
      });
    }

    return Array.from(options.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [agendaEvents]);

  const filteredEvents = useMemo(() => {
    return agendaEvents.filter((e) => {
      const d = parseDate(e.date);
      const monthMatch =
        d.getMonth() + 1 === selectedMonth && d.getFullYear() === currentYear;
      const communityMatch = matchesCommunityFilter(e, selectedCommunity);
      const dateMatch = !selectedDate || e.date === selectedDate;
      return monthMatch && communityMatch && dateMatch;
    });
  }, [
    agendaEvents,
    selectedMonth,
    selectedCommunity,
    selectedDate,
    currentYear,
  ]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, AgendaEvent[]>();
    filteredEvents.forEach((e) => {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    });
    // Sort events within each day by start time
    map.forEach((list) =>
      list.sort((a, b) => a.startTime.localeCompare(b.startTime)),
    );
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
    setSelectedCommunity("all");
  };

  const hasFilters = selectedDate !== "" || selectedCommunity !== "all";
  const selectedCommunityLabel =
    communityOptions.find((c) => c.id === selectedCommunity)?.shortName ??
    communities.find((c) => c.id === selectedCommunity)?.shortName;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Page header */}
      <div className="bg-white border-b border-[#e5e7eb]">
        <div className="max-w-300 mx-auto px-6 py-6">
          <div className="flex items-center gap-2 text-[#7b4f37] text-[13px] mb-2">
            <Calendar size={14} />
            <span>Agenda</span>
          </div>
          <h1
            className="text-[#1a1a1a] text-[28px]"
            style={{ fontWeight: 600 }}
          >
            Programação da Paróquia
          </h1>
        </div>

        {/* Month tabs */}
        <div className="max-w-300 mx-auto px-6">
          <div className="flex gap-0 overflow-x-auto pb-0 scrollbar-none">
            {visibleMonths.map((m) => (
              <button
                key={m.value}
                onClick={() => {
                  setSelectedMonth(m.value);
                  setSelectedDate("");
                }}
                className={[
                  "px-5 py-3 text-[14px] whitespace-nowrap border-b-2 transition-all shrink-0",
                  selectedMonth === m.value
                    ? "border-[#4a2f24] text-[#4a2f24]"
                    : "border-transparent text-[#6b7280] hover:text-[#4a2f24] hover:border-[#dcc2b5]",
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
      <div className="max-w-300 mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-65 shrink-0 space-y-4">
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
            <div className="bg-white border border-[#dcc2b5]/50 rounded-2xl p-4 shadow-sm">
              <p
                className="text-[11px] text-[#4a2f24] uppercase tracking-widest mb-3"
                style={{ fontWeight: 600 }}
              >
                Comunidade
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCommunity("all")}
                  className={[
                    "w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors",
                    selectedCommunity === "all"
                      ? "bg-[#4a2f24] text-white"
                      : "text-[#2b2b2b] hover:bg-[#f9f5f2]",
                  ].join(" ")}
                  style={{
                    fontWeight: selectedCommunity === "all" ? 600 : 400,
                  }}
                >
                  Todas
                </button>
                {communityOptions.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCommunity(c.id)}
                    className={[
                      "w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors flex items-center gap-2",
                      selectedCommunity === c.id
                        ? "bg-[#4a2f24] text-white"
                        : "text-[#2b2b2b] hover:bg-[#f9f5f2]",
                    ].join(" ")}
                    style={{
                      fontWeight: selectedCommunity === c.id ? 600 : 400,
                    }}
                  >
                    {c.coverUrl && (
                      <img
                        src={c.coverUrl}
                        alt={c.name}
                        className="size-5 rounded-full object-cover shrink-0"
                      />
                    )}
                    <span className="truncate">{c.shortName}</span>
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
                <span className="text-[13px] text-[#6b7280]">
                  Filtros ativos:
                </span>
                {selectedDate && (
                  <span
                    className="inline-flex items-center gap-1.5 bg-[#f9f5f2] border border-[#dcc2b5] text-[#4a2f24] text-[12px] px-3 py-1 rounded-full"
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
                {selectedCommunity !== "all" && (
                  <span
                    className="inline-flex items-center gap-1.5 bg-[#f9f5f2] border border-[#dcc2b5] text-[#4a2f24] text-[12px] px-3 py-1 rounded-full"
                    style={{ fontWeight: 500 }}
                  >
                    <MapPin size={11} />
                    {selectedCommunityLabel}
                    <button
                      onClick={() => setSelectedCommunity("all")}
                      className="ml-1 hover:text-[#7b4f37]"
                    >
                      <X size={11} />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-[12px] text-[#7b4f37] hover:text-[#4a2f24] transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  Limpar tudo
                </button>
              </div>
            )}

            {/* Day list */}
            <div className="space-y-8">
              {isPending && (
                <div className="text-center py-16">
                  <Calendar size={40} className="text-[#dcc2b5] mx-auto mb-3" />
                  <p
                    className="text-[#6b7280] text-[15px]"
                    style={{ fontWeight: 500 }}
                  >
                    Carregando agenda
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
                        <h2
                          className="text-[#1a1a1a] text-[17px]"
                          style={{ fontWeight: 600 }}
                        >
                          {formatDateLabel(dateStr)}
                        </h2>
                        {isToday && (
                          <span
                            className="text-[11px] bg-[#4a2f24] text-white px-2 py-0.5 rounded-full"
                            style={{ fontWeight: 500 }}
                          >
                            Hoje
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
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
                      className="text-[#6b7280] text-[15px]"
                      style={{ fontWeight: 500 }}
                    >
                      Nenhum evento encontrado
                    </p>
                    <p className="text-[#9ca3af] text-[13px] mt-1">
                      Tente outro mês ou remova os filtros
                    </p>
                    {hasFilters && (
                      <button
                        onClick={clearFilters}
                        className="mt-4 text-[#7b4f37] text-[13px] hover:text-[#4a2f24] transition-colors"
                        style={{ fontWeight: 500 }}
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
    </div>
  );
}

export default function AgendaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fafafa]">
          <div className="bg-white border-b border-[#e5e7eb]">
            <div className="max-w-300 mx-auto px-6 py-6">
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
