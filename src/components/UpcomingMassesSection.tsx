"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import { listCalendarSchedules } from "@/lib/api/calendar/list";
import type { Schedule } from "@/entities/CalendarSchedule";
import type { Community } from "@/entities/Community";
import { ScheduleModal } from "@/components/ScheduleModal";

dayjs.locale("pt-br");

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

function formatCommunityName(community?: Schedule["community"]) {
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
  return schedule.endTime
    ? `${schedule.startTime} - ${schedule.endTime}`
    : schedule.startTime;
}

export function UpcomingMassesSection() {
  const [selectedSchedule, setSelectedSchedule] = useState<AgendaSectionEvent | null>(null);

  const today = dayjs();
  const currentMonth = today.month() + 1;
  const currentYear = today.year();

  const nextMonthDate = today.add(1, "month");
  const nextMonth = nextMonthDate.month() + 1;
  const nextYear = nextMonthDate.year();

  const { data: currentData, isPending: isPendingCurrent } = useQuery({
    queryKey: ["home-calendar-schedules", currentYear, currentMonth],
    queryFn: () => listCalendarSchedules({ month: currentMonth, year: currentYear }),
    refetchOnWindowFocus: false,
  });

  const { data: nextData, isPending: isPendingNext } = useQuery({
    queryKey: ["home-calendar-schedules", nextYear, nextMonth],
    queryFn: () => listCalendarSchedules({ month: nextMonth, year: nextYear }),
    refetchOnWindowFocus: false,
  });

  const isPending = isPendingCurrent && isPendingNext;

  const todayDateStr = today.format("YYYY-MM-DD");

  const allCalendarDays = [
    ...(currentData?.calendar ?? []),
    ...(nextData?.calendar ?? []),
  ];

  // Map and filter active schedules for masses/events from today onwards
  const events = allCalendarDays
    .flatMap((dayGroup) => {
      const dateStr = dayGroup.date.slice(0, 10);
      return dayGroup.schedules.active.map((schedule, idx): AgendaSectionEvent => ({
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
        customLocation: schedule.type === "event" ? schedule.customLocation : undefined,
        location: formatCommunityName(schedule.community),
        community: schedule.community,
        startTime: schedule.startTime,
      }));
    })
    .filter((event) => event.date >= todayDateStr)
    .sort((a, b) => {
      const dateDiff = a.date.localeCompare(b.date);
      if (dateDiff !== 0) return dateDiff;
      return a.startTime.localeCompare(b.startTime);
    });

  // Group events by date
  const groupedByDate = events.reduce<Record<string, AgendaSectionEvent[]>>((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {});

  // Take the first 4 upcoming days
  const upcomingDayEntries = Object.entries(groupedByDate).slice(0, 4);

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
              Acompanhe os horários das nossas celebrações e participe conosco dos momentos de fé e oração.
            </p>
          </div>

          <Link
            href="/agenda"
            className="text-xs font-semibold text-[#B8872E] hover:text-[#18351E] flex items-center gap-1 transition-colors shrink-0"
          >
            Ver agenda completa <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mass Cards Layout */}
        {isPending ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-[#fbf5eb] border border-[#D6A64A]/30 rounded-2xl p-6 h-40 animate-pulse flex gap-6"
              >
                <div className="w-24 bg-zinc-200/60 rounded-xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-zinc-200/60 rounded w-3/4" />
                  <div className="h-4 bg-zinc-200/60 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : upcomingDayEntries.length === 0 ? (
          <div className="bg-[#fbf5eb] border border-[#D6A64A]/30 rounded-2xl p-8 text-center text-[#8c7b6c] text-sm">
            Nenhuma missa agendada para os próximos dias.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingDayEntries.map(([dateStr, items]) => {
              const dateObj = dayjs(dateStr);
              const dayNum = dateObj.format("DD");
              const dayName = dateObj.locale("pt-br").format("dddd").toUpperCase();
              const monthName = dateObj.locale("pt-br").format("MMM").toUpperCase().replace(".", "");

              return (
                <div
                  key={dateStr}
                  className="bg-[#fbf5eb] border border-[#D6A64A]/30 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 shadow-sm items-start"
                >
                  {/* Date Box */}
                  <div className="flex flex-col items-center justify-center border-r sm:border-r border-[#e8dfd1] pr-0 sm:pr-6 w-full sm:w-28 text-center shrink-0">
                    <span className="text-[10px] font-bold text-[#B8872E] uppercase tracking-wider">
                      {dayName}
                    </span>
                    <span
                      className="text-4xl md:text-5xl font-bold text-[#18351E] leading-none my-1"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      {dayNum}
                    </span>
                    <span className="text-xs font-semibold text-[#8c7b6c] uppercase">
                      {monthName}
                    </span>
                  </div>

                  {/* Times List */}
                  <div className="flex-1 space-y-3 w-full">
                    {items.map((item, idx) => (
                      <button
                        key={`${item.id}-${idx}`}
                        type="button"
                        onClick={() => setSelectedSchedule(item)}
                        className="w-full text-left flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#f4ece1] pb-3 last:border-b-0 gap-2 cursor-pointer hover:bg-[#f3ece0] p-2 rounded-xl transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-[#B8872E] font-mono bg-[#f3ece0] px-2.5 py-1 rounded-md border border-[#D6A64A]/30 group-hover:bg-[#B8872E] group-hover:text-[#18351E] transition-colors">
                            {item.time}
                          </span>
                          <span className="font-semibold text-sm text-[#18351E] group-hover:text-[#B8872E] transition-colors">
                            {item.title || item.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-[#6b5c4d] group-hover:text-[#B8872E] transition-colors">
                          <MapPin className="w-3.5 h-3.5 text-[#B8872E]" />
                          <span>{item.location}</span>
                        </div>
                      </button>
                    ))}
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
