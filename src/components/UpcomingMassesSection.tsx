"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import { listCalendarSchedules } from "@/lib/api/calendar/list";
import type { Schedule } from "@/entities/CalendarSchedule";
import type { Community } from "@/entities/Community";
import { ScheduleModal } from "@/components/ScheduleModal";

dayjs.locale("pt-br");

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

type AgendaSectionEvent = {
  id: string;
  date: string;
  type: Schedule["type"];
  title?: string;
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
  isPrecept?: boolean;
  customLocation?: string;
  orientations?: string;
  time: string;
  name: string;
  location: string;
  startTime: string;
  community: {
    id: string;
    type: Community["type"];
    coverUrl: string;
    name: string;
    address: string;
  };
};

function getCommunityShortName(name: string) {
  return name
    .replace(/^Matriz\s+/i, "")
    .replace(/^Paróquia\s+/i, "")
    .replace(/^Capela\s+/i, "")
    .replace(/^Comunidade\s+/i, "");
}

function formatCommunityName(
  community?: Schedule["community"],
  customLocation?: string,
) {
  if (customLocation) return customLocation;
  if (!community) return "Matriz São José";
  const communityType = community.type as string;
  const prefix =
    communityType === "parish_chapel" || communityType === "parish_church"
      ? "Matriz"
      : "Capela";

  return `${prefix} ${getCommunityShortName(community.name)}`;
}

function getScheduleName(schedule: Schedule) {
  if (schedule.type === "mass" || schedule.eventType === "mass") {
    return "Santa Missa";
  }
  return "Evento";
}

function getScheduleId(schedule: Schedule) {
  return schedule.type === "mass"
    ? schedule.massScheduleId
    : schedule.eventScheduleId;
}

function formatScheduleTime(schedule: Schedule) {
  if (schedule.type === "mass" || schedule.eventType === "mass") {
    return schedule.startTime;
  }
  return schedule.endTime
    ? `${schedule.startTime} - ${schedule.endTime}`
    : schedule.startTime;
}

export function UpcomingMassesSection() {
  const [selectedSchedule, setSelectedSchedule] =
    useState<AgendaSectionEvent | null>(null);

  const today = dayjs();
  const currentMonth = today.month() + 1;
  const currentYear = today.year();

  const nextMonthDate = today.add(1, "month");
  const nextMonth = nextMonthDate.month() + 1;
  const nextYear = nextMonthDate.year();

  const { data: currentData, isPending: isPendingCurrent } = useQuery({
    queryKey: ["home-calendar-schedules", currentYear, currentMonth],
    queryFn: () =>
      listCalendarSchedules({ month: currentMonth, year: currentYear }),
    refetchOnWindowFocus: false,
  });

  const { data: nextData, isPending: isPendingNext } = useQuery({
    queryKey: ["home-calendar-schedules", nextYear, nextMonth],
    queryFn: () => listCalendarSchedules({ month: nextMonth, year: nextYear }),
    refetchOnWindowFocus: false,
  });

  const isPending = isPendingCurrent && isPendingNext;
  const todayDateStr = today.format("YYYY-MM-DD");
  const tomorrowDateStr = today.add(1, "day").format("YYYY-MM-DD");

  const allCalendarDays = [
    ...(currentData?.calendar ?? []),
    ...(nextData?.calendar ?? []),
  ];

  // Map and filter active schedules for celebrations from today onwards
  const allEvents = allCalendarDays
    .flatMap((dayGroup) => {
      const dateStr = dayGroup.date.slice(0, 10);
      return dayGroup.schedules.active.map(
        (schedule, idx): AgendaSectionEvent => ({
          id: `${dateStr}-${getScheduleId(schedule)}-${schedule.startTime || idx}`,
          date: dateStr,
          type: schedule.type,
          time: formatScheduleTime(schedule),
          name: getScheduleName(schedule),
          title: schedule.title,
          isPrecept: schedule.isPrecept,
          orientations: schedule.orientations,
          massType: schedule.massType,
          eventType: schedule.type === "event" ? schedule.eventType : undefined,
          customLocation:
            schedule.type === "event" ? schedule.customLocation : undefined,
          location: formatCommunityName(
            schedule.community,
            schedule.type === "event" ? schedule.customLocation : undefined,
          ),
          community: schedule.community,
          startTime: schedule.startTime,
        }),
      );
    })
    .filter((event) => event.date >= todayDateStr)
    .sort((a, b) => {
      const dateDiff = a.date.localeCompare(b.date);
      if (dateDiff !== 0) return dateDiff;
      return a.startTime.localeCompare(b.startTime);
    });

  // Prioritize upcoming celebrations (if today, keep events starting 45 mins ago onwards)
  const currentHourBuffer = today.subtract(45, "minute").format("HH:mm");
  const futureEvents = allEvents.filter((event) => {
    if (event.date > todayDateStr) return true;
    if (event.date === todayDateStr) {
      return event.startTime >= currentHourBuffer;
    }
    return false;
  });

  // Cap at at most 4 schedules total across the section
  const upcomingEvents = (
    futureEvents.length > 0 ? futureEvents : allEvents
  ).slice(0, 4);

  // Group schedules by day
  const groupedByDate = upcomingEvents.reduce<
    Record<string, AgendaSectionEvent[]>
  >((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {});

  const dayEntries = Object.entries(groupedByDate);

  return (
    <section className="bg-[#fbf6ee] py-12 md:py-16 border-t border-[#e8dfd1]/60">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2 text-[#B8872E] text-xs font-semibold uppercase tracking-[0.25em]">
              <Calendar className="w-4 h-4 text-[#B8872E]" />
              <span>CELEBRAÇÕES</span>
            </div>
            <h2
              className="text-2xl md:text-4xl font-semibold text-[#18351E] mb-3"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Próximas Missas
            </h2>
            <p className="text-sm md:text-base text-[#5A463B] max-w-xl font-serif">
              Acompanhe os horários das nossas celebrações e participe conosco
              dos momentos de fé e oração.
            </p>
          </div>

          <Link
            href="/agenda"
            className="text-xs font-semibold text-[#B8872E] hover:text-[#18351E] flex items-center gap-1 transition-colors shrink-0"
          >
            Ver agenda completa <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Content */}
        {isPending ? (
          <div className="space-y-6">
            <div className="h-12 bg-[#fbf5eb] border border-[#D6A64A]/30 rounded-xl animate-pulse w-72" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-[#fbf5eb] border border-[#D6A64A]/30 rounded-2xl p-5 sm:p-6 h-40 animate-pulse flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-20 h-5 bg-zinc-200/60 rounded" />
                      <div className="size-10 bg-zinc-200/60 rounded-full" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-6 bg-zinc-200/60 rounded w-3/4" />
                      <div className="h-4 bg-zinc-200/60 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[#D6A64A]/20 flex items-center justify-between">
                    <div className="h-4 bg-zinc-200/60 rounded w-36" />
                    <div className="h-4 bg-zinc-200/60 rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : dayEntries.length === 0 ? (
          <div className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-3xl p-10 text-center shadow-xs">
            <div className="size-14 rounded-2xl bg-[#f3ece0] border border-[#D6A64A]/50 flex items-center justify-center text-[#B8872E] mx-auto mb-3">
              <Calendar size={28} />
            </div>
            <h3
              className="text-2xl font-semibold text-[#18351E] mb-1"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Nenhuma missa agendada
            </h3>
            <p className="text-sm text-[#5A463B] max-w-md mx-auto mb-5 font-serif">
              Não há celebrações programadas para os próximos dias no momento.
              Consulte a agenda completa para ver toda a programação.
            </p>
            <Link
              href="/agenda"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#18351E] text-[#eeca94] text-xs font-semibold hover:bg-[#234125] transition-colors shadow-xs"
            >
              Ver agenda completa <ChevronRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {dayEntries.map(([dateStr, items]) => {
              const dateObj = parseDate(dateStr);
              const isToday = dateStr === todayDateStr;
              const isTomorrow = dateStr === tomorrowDateStr;

              return (
                <div key={dateStr} className="space-y-4">
                  {/* Day Header - Outside the cards */}
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
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3
                            className="text-xl sm:text-2xl font-semibold text-[#18351E] capitalize"
                            style={{ fontFamily: "Cormorant Garamond, serif" }}
                          >
                            {formatDateLabel(dateStr)}
                          </h3>
                          {isToday && (
                            <span className="text-[11px] bg-[#18351E] text-[#ffe7c2] px-2.5 py-0.5 rounded-full border border-[#D6A64A]/40 font-semibold uppercase tracking-wider">
                              Hoje
                            </span>
                          )}
                          {isTomorrow && (
                            <span className="text-[11px] bg-[#f3ece0] text-[#18351E] px-2.5 py-0.5 rounded-full border border-[#D6A64A]/40 font-semibold uppercase tracking-wider">
                              Amanhã
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#5A463B] font-medium">
                          {items.length}{" "}
                          {items.length === 1
                            ? "celebração agendada"
                            : "celebrações agendadas"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cards for this day in responsive grid */}
                  <div
                    className={`grid gap-5 ${
                      items.length === 1
                        ? "grid-cols-1"
                        : "grid-cols-1 md:grid-cols-2"
                    }`}
                  >
                    {items.map((event) => {
                      const isMass =
                        event.type === "mass" || event.eventType === "mass";
                      const communityName = event.community?.name;
                      const img = event.community?.coverUrl;

                      return (
                        <div
                          key={event.id}
                          onClick={() => setSelectedSchedule(event)}
                          className="group bg-[#fbf5eb] border border-[#D6A64A]/40 hover:border-[#B8872E] rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between text-left"
                        >
                          <div>
                            {/* Top row: Time, Badges, Avatar */}
                            <div className="flex items-center justify-between gap-3 mb-3">
                              <div className="flex items-center gap-2.5 flex-wrap">
                                {/* Horário (estilo limpo, sem parecer botão) */}
                                <div className="flex items-center gap-1.5 font-mono text-sm sm:text-base font-bold text-[#18351E]">
                                  <Clock className="w-4 h-4 text-[#B8872E]" />
                                  <span>{event.time}</span>
                                </div>

                                {/* Precept Badge */}
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
                                style={{
                                  fontFamily: "Cormorant Garamond, serif",
                                }}
                              >
                                {isMass ? (
                                  <>
                                    Santa Missa
                                    {event.massType === "devotional" &&
                                    event.title
                                      ? ` Devocional — ${event.title}`
                                      : ""}
                                    {event.massType === "solemnity" &&
                                    event.title
                                      ? ` Solene — ${event.title}`
                                      : ""}
                                    {!event.massType && event.title
                                      ? ` — ${event.title}`
                                      : ""}
                                  </>
                                ) : (
                                  event.title || event.name
                                )}
                              </h3>

                              {(event.orientations ||
                                (event.massType &&
                                  event.massType !== "ordinary")) && (
                                <p className="text-xs sm:text-sm text-[#5A463B] font-serif leading-relaxed line-clamp-2">
                                  {event.orientations ||
                                    (event.massType === "solemnity"
                                      ? "Celebração Solene"
                                      : event.massType === "devotional"
                                        ? "Missa Devocional"
                                        : "")}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Card Footer: Localização e Ver detalhes (limpos, sem visual de botão) */}
                          <div className="mt-4 pt-3.5 border-t border-[#D6A64A]/20 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-1.5 text-xs text-[#5A463B]">
                              <MapPin className="w-3.5 h-3.5 text-[#B8872E] shrink-0" />
                              <span className="font-medium text-[#5A463B] group-hover:text-[#18351E] transition-colors truncate max-w-[220px] sm:max-w-[340px]">
                                {event.location}
                              </span>
                            </div>

                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#B8872E] group-hover:text-[#18351E] transition-all shrink-0">
                              <span>Ver detalhes</span>
                              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Details Modal */}
        {selectedSchedule && (
          <ScheduleModal
            schedule={selectedSchedule}
            onClose={() => setSelectedSchedule(null)}
          />
        )}
      </div>
    </section>
  );
}
