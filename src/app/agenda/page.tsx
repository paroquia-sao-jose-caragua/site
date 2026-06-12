import { useMemo, useState, useEffect } from "react";
import { MapPin, RefreshCw, Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useSearchParams } from "react-router";
import { agendaEvents, communities, type AgendaEvent } from "../data/agendaData";

import imgEllipse1 from "../../imports/Desktop5/e1d50cae9fab58435153a4c41bbf85789ad42f26.png";
import imgEllipse2 from "../../imports/Desktop5/05954d1396cd22d752a9383cc71f05004fb83a94.png";
import imgEllipse3 from "../../imports/Desktop5/7387a98bd8b87ea87349155d8dcfa3b57becde99.png";
import imgEllipse4 from "../../imports/Desktop5/8923874a787fb8983e3c782e8248f74411a5c7b1.png";
import imgEllipse5 from "../../imports/Desktop5/455ffb51a3b40639c1fdae0be7b7b8c147a6c4b4.png";

const communityImages: Record<string, string> = {
  psj: imgEllipse1,
  cse: imgEllipse2,
  cnsr: imgEllipse3,
  csf: imgEllipse4,
  cscj: imgEllipse5,
};

const MONTHS = [
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
];

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const WEEKDAYS_FULL = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
const MONTHS_PT = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

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

function isSameDay(a: string, b: string) {
  return a === b;
}

interface MiniCalendarProps {
  year: number;
  month: number;
  selectedDate: string | null;
  eventDates: Set<string>;
  onSelect: (date: string) => void;
}

function MiniCalendar({ year, month, selectedDate, eventDates, onSelect }: MiniCalendarProps) {
  const [calYear, setCalYear] = useState(year);
  const [calMonth, setCalMonth] = useState(month);

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const today = new Date();

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const prevMonth = () => {
    if (calMonth === 1) { setCalMonth(12); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 12) { setCalMonth(1); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-white border border-[#dcc2b5]/50 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-[#f9f5f2] transition-colors text-[#7b4f37]">
          <ChevronLeft size={15} />
        </button>
        <span className="text-[13px] text-[#4a2f24]" style={{ fontWeight: 600 }}>
          {MONTHS_PT[calMonth - 1]} {calYear}
        </span>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-[#f9f5f2] transition-colors text-[#7b4f37]">
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-[10px] text-[#7b4f37]/70 py-1" style={{ fontWeight: 500 }}>{d}</div>
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
                isSelected ? "bg-[#4a2f24] text-white" : isToday ? "bg-[#f9f5f2] text-[#4a2f24]" : "text-[#2b2b2b] hover:bg-[#f9f5f2]",
              ].join(" ")}
              style={{ fontWeight: isToday || isSelected ? 600 : 400 }}
            >
              {day}
              {hasEvent && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 size-[3px] rounded-full bg-[#a45d00]" />
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
  const community = communities.find(c => c.id === event.communityId);
  const img = communityImages[event.communityId];

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl px-5 py-4 flex items-start gap-4 hover:border-[#dcc2b5] hover:shadow-sm transition-all">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[#2b2b2b]/60 text-[13px]">{event.startTime} — {event.endTime}</span>
          {event.recurring && (
            <span className="inline-flex items-center gap-1 text-[#7b4f37] text-[11px] bg-[#f9f5f2] border border-[#dcc2b5]/60 px-2 py-0.5 rounded-full" style={{ fontWeight: 500 }}>
              <RefreshCw size={10} />
              Recorrente
            </span>
          )}
        </div>
        <p className="text-[#1a1a1a] text-[15px] mb-2" style={{ fontWeight: 600 }}>
          {event.title}
        </p>
        {event.description && (
          <p className="text-[#2b2b2b]/60 text-[13px] mb-2">{event.description}</p>
        )}
        <div className="flex items-center gap-1 text-[#a45d00] text-[13px]">
          <MapPin size={12} />
          <span>{community?.name}</span>
        </div>
      </div>
      {img && (
        <img
          src={img}
          alt={community?.name}
          className="size-9 rounded-full object-cover ring-2 ring-[#dcc2b5]/50 shrink-0 mt-0.5"
        />
      )}
    </div>
  );
}

export default function AgendaPage() {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const [searchParams] = useSearchParams();
  const initialCommunity = searchParams.get("comunidade") ?? "all";

  const initialMonth = MONTHS.find(m => m.value === currentMonth) ? currentMonth : MONTHS[0].value;
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedCommunity, setSelectedCommunity] = useState<string>(initialCommunity);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Sync if URL param changes (e.g. back navigation)
  useEffect(() => {
    const param = searchParams.get("comunidade") ?? "all";
    setSelectedCommunity(param);
  }, [searchParams]);

  const filteredEvents = useMemo(() => {
    return agendaEvents.filter(e => {
      const d = parseDate(e.date);
      const monthMatch = d.getMonth() + 1 === selectedMonth && d.getFullYear() === currentYear;
      const communityMatch = selectedCommunity === "all" || e.communityId === selectedCommunity;
      const dateMatch = !selectedDate || e.date === selectedDate;
      return monthMatch && communityMatch && dateMatch;
    });
  }, [selectedMonth, selectedCommunity, selectedDate, currentYear]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, AgendaEvent[]>();
    filteredEvents.forEach(e => {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    });
    // Sort events within each day by start time
    map.forEach(list => list.sort((a, b) => a.startTime.localeCompare(b.startTime)));
    return map;
  }, [filteredEvents]);

  // All dates in the month to show, even empty ones (unless filtered by date)
  const allDatesInMonth = useMemo(() => {
    const days = getDaysInMonth(currentYear, selectedMonth);
    const dates: string[] = [];
    for (let d = 1; d <= days; d++) {
      const ds = `${currentYear}-${String(selectedMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      if (!selectedDate || ds === selectedDate) {
        dates.push(ds);
      }
    }
    return dates;
  }, [selectedMonth, selectedDate, currentYear]);

  const eventDatesSet = useMemo(() => {
    const s = new Set<string>();
    agendaEvents.forEach(e => {
      const d = parseDate(e.date);
      if (d.getMonth() + 1 === selectedMonth && d.getFullYear() === currentYear) {
        s.add(e.date);
      }
    });
    return s;
  }, [selectedMonth, currentYear]);

  const clearFilters = () => {
    setSelectedDate("");
    setSelectedCommunity("all");
  };

  const hasFilters = selectedDate !== "" || selectedCommunity !== "all";

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Page header */}
      <div className="bg-white border-b border-[#e5e7eb]">
        <div className="max-w-[1200px] mx-auto px-6 py-6">
          <div className="flex items-center gap-2 text-[#7b4f37] text-[13px] mb-2">
            <Calendar size={14} />
            <span>Agenda</span>
          </div>
          <h1 className="text-[#1a1a1a] text-[28px]" style={{ fontWeight: 600 }}>
            Programação da Paróquia
          </h1>
        </div>

        {/* Month tabs */}
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex gap-0 overflow-x-auto pb-0 scrollbar-none">
            {MONTHS.map(m => (
              <button
                key={m.value}
                onClick={() => { setSelectedMonth(m.value); setSelectedDate(""); }}
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
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <div className="w-full lg:w-[260px] shrink-0 space-y-4">
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
              <p className="text-[11px] text-[#4a2f24] uppercase tracking-widest mb-3" style={{ fontWeight: 600 }}>
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
                  style={{ fontWeight: selectedCommunity === "all" ? 600 : 400 }}
                >
                  Todas
                </button>
                {communities.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCommunity(c.id)}
                    className={[
                      "w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors flex items-center gap-2",
                      selectedCommunity === c.id
                        ? "bg-[#4a2f24] text-white"
                        : "text-[#2b2b2b] hover:bg-[#f9f5f2]",
                    ].join(" ")}
                    style={{ fontWeight: selectedCommunity === c.id ? 600 : 400 }}
                  >
                    <img
                      src={communityImages[c.id]}
                      alt={c.name}
                      className="size-5 rounded-full object-cover shrink-0"
                    />
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
                <span className="text-[13px] text-[#6b7280]">Filtros ativos:</span>
                {selectedDate && (
                  <span className="inline-flex items-center gap-1.5 bg-[#f9f5f2] border border-[#dcc2b5] text-[#4a2f24] text-[12px] px-3 py-1 rounded-full" style={{ fontWeight: 500 }}>
                    <Calendar size={11} />
                    {formatDateLabel(selectedDate).split(",")[0] + ", " + parseDate(selectedDate).getDate() + " de " + MONTHS_PT[parseDate(selectedDate).getMonth()]}
                    <button onClick={() => setSelectedDate("")} className="ml-1 hover:text-[#7b4f37]">
                      <X size={11} />
                    </button>
                  </span>
                )}
                {selectedCommunity !== "all" && (
                  <span className="inline-flex items-center gap-1.5 bg-[#f9f5f2] border border-[#dcc2b5] text-[#4a2f24] text-[12px] px-3 py-1 rounded-full" style={{ fontWeight: 500 }}>
                    <MapPin size={11} />
                    {communities.find(c => c.id === selectedCommunity)?.shortName}
                    <button onClick={() => setSelectedCommunity("all")} className="ml-1 hover:text-[#7b4f37]">
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
              {allDatesInMonth.map(dateStr => {
                const events = eventsByDay.get(dateStr) ?? [];
                const isToday = dateStr === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

                // When filtered by date, show even empty days
                // When not filtered, skip empty days to keep the list clean
                if (!selectedDate && events.length === 0) return null;

                return (
                  <div key={dateStr}>
                    <div className="flex items-center gap-2 mb-3">
                      <h2 className="text-[#1a1a1a] text-[17px]" style={{ fontWeight: 600 }}>
                        {formatDateLabel(dateStr)}
                      </h2>
                      {isToday && (
                        <span className="text-[11px] bg-[#4a2f24] text-white px-2 py-0.5 rounded-full" style={{ fontWeight: 500 }}>
                          Hoje
                        </span>
                      )}
                    </div>

                    {events.length === 0 ? (
                      <p className="text-[#9ca3af] text-[14px] pl-1">Nenhum agendamento para este dia</p>
                    ) : (
                      <div className="space-y-2">
                        {events.map(evt => (
                          <EventCard key={evt.id} event={evt} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {allDatesInMonth.every(d => (eventsByDay.get(d) ?? []).length === 0) && (
                <div className="text-center py-16">
                  <Calendar size={40} className="text-[#dcc2b5] mx-auto mb-3" />
                  <p className="text-[#6b7280] text-[15px]" style={{ fontWeight: 500 }}>
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
