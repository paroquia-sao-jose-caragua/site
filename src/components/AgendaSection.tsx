"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

import Link from "next/link";
import { listCalendarSchedules } from "@/lib/api/calendar/list";
import type { CalendarSchedule, Schedule } from "@/entities/CalendarSchedule";

const slides = [
  {
    img: "/Desktop5/d53665c7234c83d23c647e6d5da1abf39fc0ea7d.png",
    title: "Celebre conosco a Missa em Honra a São José",
    info: "Todo dia 19 às 19h30 na Paróquia São José",
  },
  {
    img: "/Desktop5/9501870a6d2e000e824b7f82399914486cb30cfd.png",
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
  time: string;
  name: string;
  location: string;
  startTime: string;
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

function getScheduleTitle(schedule: Schedule) {
  if (schedule.type === "event") {
    return schedule.title;
  }

  return schedule.title ?? "Santa Missa";
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
        date,
        time: formatScheduleTime(schedule),
        name: getScheduleTitle(schedule),
        location: formatCommunityName(schedule.community),
        startTime: schedule.startTime,
      }),
    );
  });
}

export function AgendaSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

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
    <section id="agenda" className="py-16 bg-white">
      <div className="max-w-300 mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-14 items-start">
          {/* Carousel */}
          <div className="w-full lg:w-[58%] shrink-0">
            <div
              className="relative overflow-hidden rounded-2xl shadow-md"
              ref={emblaRef}
            >
              <div className="flex">
                {slides.map((slide, i) => (
                  <div
                    key={i}
                    className="relative shrink-0 w-full"
                    style={{ aspectRatio: "16/12" }}
                  >
                    <img
                      src={slide.img}
                      alt={slide.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(74,47,36,0.92) 0%, rgba(74,47,36,0) 55%)",
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <p
                        className="text-[#f9f5f2] text-[22px] md:text-[26px] mb-2 leading-snug"
                        style={{ fontWeight: 600 }}
                      >
                        {slide.title}
                      </p>
                      <p className="text-[#f9f5f2]/80 text-[14px] md:text-[16px]">
                        {slide.info}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => emblaApi?.scrollTo(i)}
                    className="rounded-full transition-all"
                    style={{
                      width: i === selectedIndex ? 20 : 6,
                      height: 6,
                      background: i === selectedIndex ? "#7b4f37" : "#dcc2b5",
                    }}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={scrollPrev}
                  className="p-2 rounded-lg border border-[#dcc2b5] hover:bg-[#f9f5f2] transition-colors"
                  aria-label="Anterior"
                >
                  <ChevronLeft size={16} className="text-[#7b4f37]" />
                </button>
                <button
                  onClick={scrollNext}
                  className="p-2 rounded-lg border border-[#dcc2b5] hover:bg-[#f9f5f2] transition-colors"
                  aria-label="Próximo"
                >
                  <ChevronRight size={16} className="text-[#7b4f37]" />
                </button>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="flex-1 min-w-0 w-full">
            <p
              className="text-[#4a2f24] text-[11px] uppercase tracking-widest mb-1"
              style={{ fontWeight: 500 }}
            >
              Agenda
            </p>
            <h2
              className="text-[#4a2f24] text-[26px] mb-6"
              style={{ fontWeight: 600, lineHeight: 1.3 }}
            >
              Nossa programação especial
            </h2>

            <div className="space-y-6">
              {isPending && (
                <p className="text-[#2b2b2b]/60 text-[14px]">
                  Carregando agenda
                </p>
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
                    <p
                      className="text-[#7b4f37] text-[13px] mb-3"
                      style={{ fontWeight: 500 }}
                    >
                      {day}
                    </p>
                    <div className="space-y-2">
                      {events.map((evt, i) => (
                        <div
                          key={`${evt.id}-${i}`}
                          className="bg-[#f9f5f2] border border-[#dcc2b5]/60 rounded-xl p-4 flex items-end justify-between shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div>
                            <p className="text-[#2b2b2b]/70 text-[13px] mb-0.5">
                              {evt.time}
                            </p>
                            <p
                              className="text-[#2b2b2b] text-[15px]"
                              style={{ fontWeight: 500 }}
                            >
                              {evt.name}
                            </p>
                          </div>
                          <div
                            className="flex items-center gap-1 text-[#a45d00] text-[12px]"
                            style={{ fontWeight: 400 }}
                          >
                            <MapPin size={11} />
                            <span>{evt.location}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            <Link
              href="/agenda"
              className="mt-6 inline-flex items-center gap-1 text-[#7b4f37] text-[14px] hover:text-[#4a2f24] transition-colors"
              style={{ fontWeight: 500 }}
            >
              Ver Programação Completa
              <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
