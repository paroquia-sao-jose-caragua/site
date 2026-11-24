"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ExternalLink,
  MessageCircle,
  Quote,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { getDailyLiturgy } from "@/lib/api/liturgy/getDaily";
import { formatLiturgyText } from "@/utils/formatLiturgyText";

dayjs.locale("pt-br");

function capitalizeFirst(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatLiturgyDate(date: dayjs.Dayjs, compact = false) {
  const weekday = capitalizeFirst(
    date.format(compact ? "ddd" : "dddd").replace(".", "")
  );
  const day = date.format("D");
  const month = capitalizeFirst(
    date.format(compact ? "MMM" : "MMMM").replace(".", "")
  );
  const year = date.format("YYYY");
  return `${weekday}, ${day} de ${month} de ${year}`;
}

type TabType = "first" | "second" | "psalm" | "gospel" | "reflection" | "saint";

const LITURGY_IMAGES = [
  "/liturgy/01.png",
  "/liturgy/02.png",
  "/liturgy/03.png",
  "/liturgy/04.png",
];

const LITURGY_IMAGE_INTERVAL_MS = 8000;

function VaticanNewsReflectionCard() {
  return (
    <a
      href="https://www.vaticannews.va/pt/palavra-do-dia.html"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-4 bg-[#fbf5eb] border border-[#D6A64A]/40 hover:border-[#B8872E] rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all no-underline"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="size-14 rounded-xl overflow-hidden shrink-0 border border-[#D6A64A]/30">
          <img
            src="/vatican-news-logoicon.png"
            alt="Vatican News"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#B8872E] block">
            Vatican News
          </span>
          <span className="font-serif font-bold text-[#18351E] text-lg leading-snug group-hover:text-[#8c6218] transition-colors block">
            Palavra do Dia
          </span>
          <span className="text-xs text-[#6b5c4d] truncate block">
            Acessar reflexão completa no site oficial
          </span>
        </div>
      </div>

      <ExternalLink
        size={18}
        className="text-[#B8872E] shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
      />
    </a>
  );
}

export default function LiturgiaPage() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [activeTab, setActiveTab] = useState<TabType>("first");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const tabButtonRefs = useRef<Partial<Record<TabType, HTMLButtonElement | null>>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % LITURGY_IMAGES.length);
    }, LITURGY_IMAGE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const formattedDateParam = selectedDate.format("YYYY-MM-DD");

  const { data, isPending } = useQuery({
    queryKey: ["daily-liturgy", formattedDateParam],
    queryFn: () => getDailyLiturgy(formattedDateParam),
  });

  const handlePrevDay = () => {
    setSelectedDate((prev) => prev.subtract(1, "day"));
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => prev.add(1, "day"));
  };

  const visibleTabs = [
    { id: "first" as const, label: "1ª Leitura", visible: true },
    {
      id: "second" as const,
      label: "2ª Leitura",
      visible: Boolean(data?.secondReading),
    },
    { id: "psalm" as const, label: "Salmo", visible: true },
    { id: "gospel" as const, label: "Evangelho", visible: true },
    { id: "reflection" as const, label: "Reflexão", visible: true },
    {
      id: "saint" as const,
      label: "Santos do Dia",
      visible: Boolean(data?.saint),
    },
  ].filter((tab) => tab.visible);

  const selectTabWithScroll = (tabId: TabType) => {
    setActiveTab(tabId);
    tabButtonRefs.current[tabId]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;

    const touch = e.changedTouches[0];
    if (!touch) return;

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;

    if (Math.abs(dx) < 50 || Math.abs(dx) <= Math.abs(dy) * 1.2) {
      return;
    }

    const currentIndex = visibleTabs.findIndex((t) => t.id === activeTab);
    if (currentIndex === -1) return;

    if (dx < 0 && currentIndex < visibleTabs.length - 1) {
      selectTabWithScroll(visibleTabs[currentIndex + 1].id);
    } else if (dx > 0 && currentIndex > 0) {
      selectTabWithScroll(visibleTabs[currentIndex - 1].id);
    }
  };

  const tomorrowDateStr = selectedDate.add(1, "day").format("dddd, D [de] MMMM");

  return (
    <main className="relative overflow-hidden bg-[#fbf6ee] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6 mb-32">
        {/* Breadcrumb */}
        <nav className="text-sm text-[#8c7b6c] mb-2 flex items-center gap-2 font-medium">
          <Link href="/" className="hover:text-[#2d261e] transition-colors">
            Início
          </Link>
          <span>&gt;</span>
          <span className="text-[#2d261e]">Liturgia Diária</span>
        </nav>

        {/* Main Content Layout (Grid 2 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left / Main Column (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#18351E]">
                Liturgia do Dia
              </h1>
              <p className="text-sm md:text-base text-[#6b5c4d] mt-2">
                A Palavra de Deus que ilumina o nosso caminho.
              </p>
            </div>

            {/* Date Selector Header */}
            <div className="flex items-center justify-between gap-3 bg-[#fbf5eb] border-y border-[#D6A64A]/30 px-4 py-3 w-[calc(100%_+_36px)] ml-[-18px]">
              <button
                onClick={handlePrevDay}
                className="p-1.5 rounded-lg text-[#8c7b6c] hover:bg-[#fbf6ee] hover:text-[#2d261e] transition-colors cursor-pointer"
                title="Dia anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-md font-serif font-semibold text-[#2d261e]">
                <span className="sm:hidden">
                  {formatLiturgyDate(selectedDate, true)}
                </span>
                <span className="hidden sm:inline">
                  {formatLiturgyDate(selectedDate, false)}
                </span>
              </div>

              <button
                onClick={handleNextDay}
                className="p-1.5 rounded-lg text-[#8c7b6c] hover:bg-[#fbf6ee] hover:text-[#2d261e] transition-colors cursor-pointer"
                title="Próximo dia"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {visibleTabs.map((tab) => (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabButtonRefs.current[tab.id] = el;
                  }}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-md transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#B8872E]/15 text-[#8c6218] font-semibold"
                      : "text-[#32402A] font-medium hover:text-[#B8872E] hover:bg-[#B8872E]/8"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Reading Content */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="touch-pan-y"
            >
              {isPending ? (
                <div className="py-16 text-center text-[#8c7b6c] text-sm">
                  Carregando leituras da Liturgia...
                </div>
              ) : (
                <>
                  {/* Tab 1: First Reading */}
                  {activeTab === "first" && (
                    <article className="prose max-w-none text-[#332b22]">
                      <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2d261e] mb-1.5">
                        {data?.firstReading?.title || "Primeira Leitura"}
                      </h2>
                      <p className="text-lg font-semibold text-[#a6824b] tracking-wider mb-4">
                        {data?.firstReading?.reference}
                      </p>

                      <div className="text-lg sm:text-md leading-relaxed space-y-4 whitespace-pre-line text-[#332b22]">
                        {formatLiturgyText(data?.firstReading?.text)}
                      </div>

                      <div className="mt-8 pt-4 border-t border-[#e8e2d8] text-lg font-bold text-[#a6824b]">
                        Palavra do Senhor. <span className="font-semibold text-[#2d261e]">Graças a Deus.</span>
                      </div>
                    </article>
                  )}

                  {/* Tab 2: Second Reading */}
                  {activeTab === "second" && data?.secondReading && (
                    <article className="prose max-w-none text-[#332b22]">
                      <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2d261e] mb-1.5">
                        {data.secondReading.title}
                      </h2>
                      <p className="text-lg font-semibold text-[#a6824b] tracking-wider mb-4">
                        {data.secondReading.reference}
                      </p>

                      <div className="text-lg sm:text-md leading-relaxed space-y-4 whitespace-pre-line text-[#332b22]">
                        {formatLiturgyText(data.secondReading.text)}
                      </div>

                      <div className="mt-8 pt-4 border-t border-[#e8e2d8] text-lg font-bold text-[#a6824b]">
                        Palavra do Senhor. <span className="font-semibold text-[#2d261e]">Graças a Deus.</span>
                      </div>
                    </article>
                  )}

                  {/* Tab 3: Psalm */}
                  {activeTab === "psalm" && (
                    <article className="prose max-w-none text-[#332b22]">
                      <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2d261e] mb-1.5">
                        Salmo Responsorial
                      </h2>
                      <p className="text-lg font-semibold text-[#a6824b] tracking-wider mb-4">
                        {data?.psalm?.reference}
                      </p>

                      {data?.psalm?.response && (
                        <div className="bg-[#f3ece0] border-l-4 border-[#a6824b] p-4 rounded-r-lg font-serif font-bold text-[#2d261e] text-base mb-6">
                          R. {data.psalm.response}
                        </div>
                      )}

                      <div className="text-lg sm:text-md leading-relaxed space-y-4 whitespace-pre-line text-[#332b22] font-serif">
                        {formatLiturgyText(data?.psalm?.text)}
                      </div>
                    </article>
                  )}

                  {/* Tab 4: Gospel */}
                  {activeTab === "gospel" && (
                    <article className="prose max-w-none text-[#332b22]">
                      <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2d261e] mb-1.5">
                        {(data?.gospel?.title || "Evangelho do Dia")
                          .replace(/\s*✠\s*/g, " ")
                          .trim()}
                      </h2>
                      <p className="text-lg font-semibold text-[#a6824b] tracking-wider mb-4">
                        {data?.gospel?.reference}
                      </p>

                      <div className="text-lg sm:text-md leading-relaxed space-y-4 whitespace-pre-line text-[#332b22]">
                        {formatLiturgyText(data?.gospel?.text)}
                      </div>

                      <div className="mt-8 pt-4 border-t border-[#e8e2d8] text-lg font-bold text-[#a6824b]">
                        Palavra da Salvação. <span className="font-semibold text-[#2d261e]">Glória a vós, Senhor.</span>
                      </div>
                    </article>
                  )}

                  {/* Tab 5: Reflection (Vatican News) */}
                  {activeTab === "reflection" && (
                    <article className="prose max-w-none text-[#332b22]">
                      <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2d261e] mb-2">
                        Reflexão Diária do Evangelho
                      </h2>
                      <p className="text-md leading-relaxed text-[#5A463B] mb-6">
                        Acompanhe o comentário e a meditação sobre o Evangelho de hoje diretamente no portal oficial do Vatican News em português.
                      </p>

                      <VaticanNewsReflectionCard />
                    </article>
                  )}

                  {/* Tab 5: Saint of the Day */}
                  {activeTab === "saint" && data?.saint && (
                    <article className="prose max-w-none text-[#332b22]">
                      <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2d261e] mb-4">
                        {data.saint.name}
                      </h2>
                      <div className="text-md leading-relaxed space-y-4 text-[#332b22] whitespace-pre-line">
                        {data.saint.description ||
                          "Celebramos hoje a vida dos santos da Igreja Católica, cujo testemunho de fé inspira nosso caminhar diário rumo ao Reino."}
                      </div>
                    </article>
                  )}
                </>
              )}
            </div>

          </div>

          {/* Right Sidebar Column (1 col) */}
          <div className="space-y-6">
            {/* Hero Card */}
            <div className="relative rounded-2xl overflow-hidden w-full aspect-[16/10.15] border border-[#D6A64A]/40 shadow-md bg-[#f3ece0]">
              {LITURGY_IMAGES.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt="Liturgia Diária"
                  className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1500 ease-in-out ${
                    index === currentImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>

            {/* Reflexão Diária - Vatican News */}
            <div className="hidden lg:block">
              <VaticanNewsReflectionCard />
            </div>

            {/* Leituras do Dia Card */}
            <div className="hidden lg:block bg-[#fbf5eb] border border-[#e8e2d8] rounded-2xl p-5 shadow-sm space-y-4">
              <h4 className="font-serif font-bold text-[#2d261e] text-xl border-b border-[#e8e2d8] pb-3">
                Leituras do Dia
              </h4>

              <div className="space-y-3 text-md">
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f3ece0]">
                  <BookOpen className="w-4 h-4 text-[#a6824b] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-[#2d261e] block">1ª Leitura</span>
                    <span className="text-[#6b5c4d] text-md">{data?.firstReading?.reference || "Primeira Leitura"}</span>
                  </div>
                </div>

                {data?.secondReading && (
                  <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f3ece0]">
                    <BookOpen className="w-4 h-4 text-[#a6824b] mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-[#2d261e] block">2ª Leitura</span>
                      <span className="text-[#6b5c4d] text-md">{data.secondReading.reference}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f3ece0]">
                  <Quote className="w-4 h-4 text-[#a6824b] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-[#2d261e] block">Salmo</span>
                    <span className="text-[#6b5c4d] text-md">{data?.psalm?.reference || "Salmo"}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f3ece0]">
                  <BookOpen className="w-4 h-4 text-[#a6824b] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-[#2d261e] block">Evangelho</span>
                    <span className="text-[#6b5c4d] text-md">{data?.gospel?.reference || "Evangelho"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Santos do Dia Card (Conditional) */}
            {data?.saint && (
              <div className="bg-[#fbf5eb] border border-[#e8e2d8] rounded-2xl p-5 shadow-sm">
                <h4 className="font-serif font-bold text-[#2d261e] text-xl border-b border-[#e8e2d8] pb-3 mb-4">
                  Santos do Dia
                </h4>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#f4ece1] border border-[#e3d7c5] flex items-center justify-center text-[#a6824b] font-bold font-serif text-xl shrink-0">
                    †
                  </div>
                  <div>
                    <h5 className="font-bold text-base text-[#2d261e]">{data.saint.name}</h5>
                    <p className="text-sm text-[#8c7b6c] mt-0.5">Memória facultativa</p>
                  </div>
                </div>
              </div>
            )}

            {/* A liturgia de amanhã Card */}
            <div className="bg-[#fbf5eb] border border-[#e8e2d8] rounded-2xl p-5 shadow-sm">
              <h4 className="font-serif font-bold text-[#2d261e] text-xl mb-2">
                A liturgia de amanhã
              </h4>
              <p className="text-md text-[#6b5c4d] mb-4 capitalize">{tomorrowDateStr}</p>

              <button
                onClick={handleNextDay}
                className="text-md font-bold text-[#a6824b] hover:text-[#8c6c3c] flex items-center gap-1 transition-colors cursor-pointer"
              >
                Ver leituras de amanhã &gt;
              </button>
            </div>

            {/* Salmo em destaque do Dia */}
            <div className="bg-[#f3ece0] border border-[#e8e2d8] rounded-2xl p-5 text-center shadow-inner">
              <Quote className="w-6 h-6 text-[#a6824b] mx-auto mb-2 opacity-60" />
              {isPending ? (
                <div className="space-y-2 py-2 animate-pulse">
                  <div className="h-4 bg-[#e8e0d4] rounded w-3/4 mx-auto" />
                  <div className="h-3 bg-[#e8e0d4] rounded w-1/3 mx-auto" />
                </div>
              ) : (
                <>
                  <p className="font-serif italic text-md text-[#4a3f35] leading-relaxed mb-2">
                    &ldquo;{data?.psalm?.response || data?.psalm?.text?.slice(0, 140) || "Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho."}&rdquo;
                  </p>
                  <span className="text-md font-bold text-[#8c7b6c]">
                    {data?.psalm?.reference || "Salmo Responsorial"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

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
      "
      />
    </main>
  );
}
