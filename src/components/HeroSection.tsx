"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

import Link from "next/link";
import { listCalendarSchedules } from "@/lib/api/calendar/list";
import type {
  CalendarSchedule,
  EventSchedule,
  Schedule,
} from "@/entities/CalendarSchedule";
import { BotanicalDivider } from "./icons/BotanicalDivider";
import type { Community } from "@/entities/Community";
import { cn } from "./ui/utils";
import { ScheduleModal } from "./ScheduleModal";

const slides = [
  {
    img: "/hero/slide-1.png",
    title: "Celebre conosco a Missa em Honra a São José",
    info: "Todo dia 19 às 19h30 na Paróquia São José",
  },
  {
    img: "/hero/slide-2.png",
    title: "Contribua com a construção do nosso Centro Pastoral",
    info: "Carnê Solidário, contribua a partir de R$30 mensais",
  },
];

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

function parseDate(str: string) {
  const [year, month, day] = str.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDateLabel(dateStr: string) {
  const date = parseDate(dateStr);

  return `${WEEKDAYS_FULL[date.getDay()]}, ${date.getDate()} de ${
    MONTHS_PT[date.getMonth()]
  }`;
}

function getTodayDateStr() {
  const today = new Date();

  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(today.getDate()).padStart(2, "0")}`;
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

  return `${prefix} ${getCommunityShortName(community.name)}`;
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

function mapCalendarToEvents(calendar: CalendarSchedule[]) {
  return calendar.flatMap((day) => {
    const date = day.date.slice(0, 10);

    return day.schedules.active.map(
      (schedule): AgendaSectionEvent => ({
        id: `${date}-${getScheduleId(schedule)}`,
        type: schedule.type,
        date,
        time: formatScheduleTime(schedule),
        name: getScheduleName(schedule),
        title: schedule?.title,
        isPrecept: schedule.isPrecept,
        orientations: schedule?.orientations,
        ...(schedule.type === "event"
          ? {
              eventType: schedule.eventType,
              customLocation: schedule?.customLocation,
            }
          : {}),
        massType: schedule?.massType,
        location: formatCommunityName(schedule.community),
        startTime: schedule.startTime,
        community: schedule.community,
      }),
    );
  });
}

export function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const [selectedSchedule, setSelectedSchedule] =
    useState<AgendaSectionEvent | null>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: ["home-calendar-schedules", currentYear, currentMonth],
    queryFn: () =>
      listCalendarSchedules({
        month: currentMonth,
        year: currentYear,
      }),
    refetchOnWindowFocus: false,
  });

  const schedule = useMemo(() => {
    const todayDateStr = getTodayDateStr();
    const events = mapCalendarToEvents(data?.calendar ?? [])
      .filter((event) => event.date >= todayDateStr)
      .sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);

        if (dateCompare !== 0) {
          return dateCompare;
        }

        return a.startTime.localeCompare(b.startTime);
      })
      .slice(0, 4);

    return events.reduce<Record<string, AgendaSectionEvent[]>>((acc, event) => {
      const day = formatDateLabel(event.date);

      acc[day] = [...(acc[day] ?? []), event];

      return acc;
    }, {});
  }, [data?.calendar]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () =>
      setSelectedIndex(emblaApi.selectedScrollSnap()),
    );
  }, [emblaApi]);

  return (
    <section
      id="agenda"
      className="hero-section pt-0 lg:py-10 z-1 min-h-[calc(100vh_-_96px] flex flex-col justify-center"
    >
      <div className="max-w-320 mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-0 xl:gap-0 items-start">
          {/* Carousel */}
          <div className="w-full lg:w-[56%] shrink-0 px-6">
            <div
              className="ml-[-24px] w-[calc(100%_+_48px)] rounded-none relative overflow-hidden lg:rounded-2xl lg:w-full lg:ml-0"
              ref={emblaRef}
            >
              <div className="flex">
                {slides.map((slide, i) => (
                  <div
                    key={slide.img}
                    className="relative shrink-0 w-full"
                    style={{ aspectRatio: "16/12" }}
                  >
                    <img
                      src={slide.img}
                      alt={slide.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={`dot-${i}`}
                    type="button"
                    onClick={() => emblaApi?.scrollTo(i)}
                    className="rounded-full transition-all"
                    style={{
                      width: i === selectedIndex ? 20 : 6,
                      height: 6,
                      background: i === selectedIndex ? "#d6a64a" : "#d6a64a60",
                    }}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={scrollPrev}
                  className="p-2 rounded-lg border border-[#ECD6BD] hover:bg-[#ECD6BD]/20 transition-colors"
                  aria-label="Anterior"
                >
                  <ChevronLeft size={16} className="text-[#7b4f37]" />
                </button>
                <button
                  type="button"
                  onClick={scrollNext}
                  className="p-2 rounded-lg border border-[#ECD6BD] hover:bg-[#ECD6BD]/20 transition-colors"
                  aria-label="Próximo"
                >
                  <ChevronRight size={16} className="text-[#7b4f37]" />
                </button>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="hero-section-schedule flex-1 min-w-0 w-full px-6">
            <div className="space-y-6">
              {isPending && (
                <div className="space-y-8 mt-4">
                  {/* Skeleton days */}
                  {[1, 2].map((day) => (
                    <div key={day}>
                      {/* Header do dia */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-4 w-40 bg-[#EADBC8] rounded animate-pulse" />
                      </div>

                      {/* Events */}
                      <div className="space-y-3">
                        {[1, 2].map((item) => (
                          <div
                            key={item}
                            className="w-full border border-[#ECD6BD]/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#fbf4eb]/50"
                          >
                            {/* Hora */}
                            <div className="mb-2 sm:mb-0 sm:min-h-[40px] flex flex-col items-start justify-center sm:pr-4 sm:border-r border-[#ECD6BD] sm:mr-4">
                              <div className="h-4 w-[84px] bg-[#EADBC8] rounded animate-pulse" />
                            </div>

                            {/* Conteúdo */}
                            <div className="flex flex-col sm:flex-row flex-wrap sm:flex-nowrap justify-between items-start sm:items-center flex-1 gap-2 w-full">
                              <div className="space-y-2 w-full">
                                {/* nome */}
                                <div className="h-4 w-26 bg-[#EADBC8] rounded animate-pulse" />
                              </div>

                              {/* location */}
                              <div className="h-3 w-32 bg-[#EADBC8] rounded animate-pulse sm:text-right" />
                            </div>
                          </div>
                        ))}
                        {day !== 1 && (
                          <div className="w-full border border-[#ECD6BD]/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#fbf4eb]/50">
                            {/* Hora */}
                            <div className="mb-2 sm:mb-0 sm:min-h-[40px] flex flex-col items-start justify-center sm:pr-4 sm:border-r border-[#ECD6BD] sm:mr-4">
                              <div className="h-4 w-[84px] bg-[#EADBC8] rounded animate-pulse" />
                            </div>

                            {/* Conteúdo */}
                            <div className="flex flex-col sm:flex-row flex-wrap sm:flex-nowrap justify-between items-start sm:items-center flex-1 gap-2 w-full">
                              <div className="space-y-2 w-full">
                                {/* nome */}
                                <div className="h-4 w-26 bg-[#EADBC8] rounded animate-pulse" />
                              </div>

                              {/* location */}
                              <div className="h-3 w-32 bg-[#EADBC8] rounded animate-pulse sm:text-right" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isPending && isError && (
                <p className="text-[#2b2b2b]/60 text-[14px]">
                  Não foi possível carregar a agenda
                </p>
              )}

              {!isPending && !isError && Object.keys(schedule).length === 0 && (
                <p className="text-[#2b2b2b]/60 text-[14px]">
                  Nenhum agendamento encontrado
                </p>
              )}

              {!isPending &&
                !isError &&
                Object.entries(schedule).map(([day, events]) => (
                  <div key={day}>
                    <div className="flex items-center gap-2 mb-3">
                      <BotanicalDivider height={30} width={45} />
                      <p className="text-[#32402A] text-md font-semibold">
                        {day}
                      </p>
                    </div>
                    <div className="space-y-3">
                      {events.map((evt, i) => (
                        <button
                          key={`${evt.id}-${i}`}
                          type="button"
                          onClick={() => setSelectedSchedule(evt)}
                          className={cn(
                            "z-1 w-full hover:bg-[#F7EBD7]/80 border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:shadow-sm transition-shadow cursor-pointer",
                            evt.massType === "solemnity"
                              ? "bg-[#F7EBD7]/80 border-[#B8872E]"
                              : "bg-[#fbf4eb]/80 border-[#d6a64a]",
                          )}
                        >
                          <div className="mb-2 sm:mb-0 sm:min-h-[40px] flex flex-col items-start justify-center sm:pr-4 sm:border-r border-[#ECD6BD] sm:mr-4">
                            <p className="text-[#32402A] text-sm font-semibold">
                              {evt.time}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row flex-wrap sm:flex-nowrap justify-between items-start sm:items-center flex-1 gap-1 sm:gap-2">
                            <div>
                              {evt.massType === "solemnity" && (
                                <span
                                  className="
                                    text-[#B8872E]
                                    text-[10px]
                                    uppercase
                                    tracking-widest
                                    font-semibold
                                  "
                                >
                                  ✦ Solenidade
                                </span>
                              )}
                              <p className="text-[#32402A] text-md font-semibold">
                                {evt.name}
                              </p>
                            </div>
                            <p
                              className="flex-1 text-[#A3651B] text-xs sm:text-right"
                              style={{ fontWeight: 400 }}
                            >
                              <span>
                                <MapPin size={11} className="inline mb-[3px]" />{" "}
                                {evt.location}
                              </span>
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            {!isPending && !isError && Object.keys(schedule).length > 0 && (
              <Link
                href="/agenda"
                className="mt-6 inline-flex items-center gap-1 text-[#32402A] text-[14px] hover:text-[#BB8835] transition-colors"
                style={{ fontWeight: 500 }}
              >
                Ver Programação Completa
                <ChevronRight size={15} />
              </Link>
            )}
          </div>

          {selectedSchedule && (
            <ScheduleModal
              schedule={selectedSchedule}
              onClose={() => setSelectedSchedule(null)}
            />
          )}
        </div>
      </div>
    </section>
  );
}
