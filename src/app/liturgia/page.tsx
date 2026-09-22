"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  MessageCircle,
  Quote,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { getDailyLiturgy } from "@/lib/api/liturgy/getDaily";
import { formatLiturgyText } from "@/utils/formatLiturgyText";

dayjs.locale("pt-br");

type TabType = "first" | "second" | "psalm" | "gospel" | "reflection" | "saint";

export default function LiturgiaPage() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [activeTab, setActiveTab] = useState<TabType>("first");

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

  const tomorrowDateStr = selectedDate.add(1, "day").format("dddd, D [de] MMMM");

  return (
    <main className="relative overflow-hidden bg-[#fbf6ee] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-32">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#8c7b6c] mb-6 flex items-center gap-2 font-medium">
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
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a6824b] uppercase tracking-widest mb-2">
                <BookOpen className="w-4 h-4" />
                LITURGIA DIÁRIA
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#2d261e]">
                Liturgia do Dia
              </h1>
              <p className="text-sm md:text-base text-[#6b5c4d] mt-2">
                A Palavra de Deus que ilumina o nosso caminho.
              </p>
            </div>

            {/* Date Selector Header */}
            <div className="flex items-center gap-3 bg-[#fbf5eb] border border-[#e8e2d8] rounded-xl px-4 py-3 w-fit shadow-sm">
              <button
                onClick={handlePrevDay}
                className="p-1.5 rounded-lg text-[#8c7b6c] hover:bg-[#fbf6ee] hover:text-[#2d261e] transition-colors"
                title="Dia anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-sm md:text-base font-serif font-semibold text-[#2d261e]">
                <CalendarIcon className="w-4 h-4 text-[#a6824b]" />
                <span className="capitalize">{selectedDate.format("dddd, D [de] MMMM [de] YYYY")}</span>
              </div>

              <button
                onClick={handleNextDay}
                className="p-1.5 rounded-lg text-[#8c7b6c] hover:bg-[#fbf6ee] hover:text-[#2d261e] transition-colors"
                title="Próximo dia"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#e8e2d8]">
              <button
                onClick={() => setActiveTab("first")}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === "first"
                    ? "bg-[#1b2a26] text-white shadow"
                    : "bg-[#fbf5eb] text-[#6b5c4d] border border-[#e8e2d8] hover:border-[#a6824b]"
                }`}
              >
                1ª Leitura
              </button>

              {data?.secondReading && (
                <button
                  onClick={() => setActiveTab("second")}
                  className={`px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === "second"
                      ? "bg-[#1b2a26] text-white shadow"
                      : "bg-[#fbf5eb] text-[#6b5c4d] border border-[#e8e2d8] hover:border-[#a6824b]"
                  }`}
                >
                  2ª Leitura
                </button>
              )}

              <button
                onClick={() => setActiveTab("psalm")}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === "psalm"
                    ? "bg-[#1b2a26] text-white shadow"
                    : "bg-[#fbf5eb] text-[#6b5c4d] border border-[#e8e2d8] hover:border-[#a6824b]"
                }`}
              >
                Salmo
              </button>

              <button
                onClick={() => setActiveTab("gospel")}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === "gospel"
                    ? "bg-[#1b2a26] text-white shadow"
                    : "bg-[#fbf5eb] text-[#6b5c4d] border border-[#e8e2d8] hover:border-[#a6824b]"
                }`}
              >
                Evangelho
              </button>

              <button
                onClick={() => setActiveTab("reflection")}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === "reflection"
                    ? "bg-[#1b2a26] text-white shadow"
                    : "bg-[#fbf5eb] text-[#6b5c4d] border border-[#e8e2d8] hover:border-[#a6824b]"
                }`}
              >
                Reflexão
              </button>

              {data?.saint && (
                <button
                  onClick={() => setActiveTab("saint")}
                  className={`px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === "saint"
                      ? "bg-[#1b2a26] text-white shadow"
                      : "bg-[#fbf5eb] text-[#6b5c4d] border border-[#e8e2d8] hover:border-[#a6824b]"
                  }`}
                >
                  Santos do Dia
                </button>
              )}
            </div>

            {/* Reading Content Card */}
            <div className="bg-[#fbf5eb] border border-[#e8e2d8] rounded-2xl p-6 md:p-8 shadow-sm">
              {isPending ? (
                <div className="py-16 text-center text-[#8c7b6c] text-sm">
                  Carregando leituras da Liturgia...
                </div>
              ) : (
                <>
                  {/* Tab 1: First Reading */}
                  {activeTab === "first" && (
                    <article className="prose max-w-none text-[#332b22]">
                      <span className="text-xs font-bold text-[#a6824b] uppercase tracking-wider block mb-1">
                        1ª LEITURA
                      </span>
                      <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2d261e] mb-4">
                        {data?.firstReading?.title || "Primeira Leitura"}
                      </h2>
                      <p className="text-xs font-semibold text-[#8c7b6c] mb-6">
                        {data?.firstReading?.reference}
                      </p>

                      <div className="bg-[#f3ece0] border-l-4 border-[#a6824b] p-4 rounded-r-lg italic text-[#4a3f35] font-serif text-sm md:text-base mb-6">
                        {formatLiturgyText(data?.firstReading?.text?.slice(0, 180))}...
                      </div>

                      <div className="text-sm md:text-base leading-relaxed space-y-4 whitespace-pre-line text-[#332b22]">
                        {formatLiturgyText(data?.firstReading?.text)}
                      </div>

                      <div className="mt-8 pt-4 border-t border-[#e8e2d8] text-sm md:text-base font-bold text-[#a6824b]">
                        Palavra do Senhor. <span className="font-semibold text-[#2d261e]">Graças a Deus.</span>
                      </div>
                    </article>
                  )}

                  {/* Tab 2: Second Reading */}
                  {activeTab === "second" && data?.secondReading && (
                    <article className="prose max-w-none text-[#332b22]">
                      <span className="text-xs font-bold text-[#a6824b] uppercase tracking-wider block mb-1">
                        2ª LEITURA
                      </span>
                      <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2d261e] mb-4">
                        {data.secondReading.title}
                      </h2>
                      <p className="text-xs font-semibold text-[#8c7b6c] mb-6">
                        {data.secondReading.reference}
                      </p>

                      <div className="text-sm md:text-base leading-relaxed space-y-4 whitespace-pre-line text-[#332b22]">
                        {formatLiturgyText(data.secondReading.text)}
                      </div>

                      <div className="mt-8 pt-4 border-t border-[#e8e2d8] text-sm md:text-base font-bold text-[#a6824b]">
                        Palavra do Senhor. <span className="font-semibold text-[#2d261e]">Graças a Deus.</span>
                      </div>
                    </article>
                  )}

                  {/* Tab 3: Psalm */}
                  {activeTab === "psalm" && (
                    <article className="prose max-w-none text-[#332b22]">
                      <span className="text-xs font-bold text-[#a6824b] uppercase tracking-wider block mb-1">
                        SALMO RESPONSORIAL
                      </span>
                      <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2d261e] mb-4">
                        Salmo Responsorial
                      </h2>
                      <p className="text-xs font-semibold text-[#8c7b6c] mb-6">
                        {data?.psalm?.reference}
                      </p>

                      {data?.psalm?.response && (
                        <div className="bg-[#f3ece0] border-l-4 border-[#a6824b] p-4 rounded-r-lg font-serif font-bold text-[#2d261e] text-base mb-6">
                          R. {data.psalm.response}
                        </div>
                      )}

                      <div className="text-sm md:text-base leading-relaxed space-y-4 whitespace-pre-line text-[#332b22] font-serif">
                        {formatLiturgyText(data?.psalm?.text)}
                      </div>
                    </article>
                  )}

                  {/* Tab 4: Gospel */}
                  {activeTab === "gospel" && (
                    <article className="prose max-w-none text-[#332b22]">
                      <span className="text-xs font-bold text-[#a6824b] uppercase tracking-wider block mb-1">
                        EVANGELHO
                      </span>
                      <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2d261e] mb-4">
                        {data?.gospel?.title || "Evangelho do Dia"}
                      </h2>
                      <p className="text-xs font-semibold text-[#8c7b6c] mb-6">
                        {data?.gospel?.reference}
                      </p>

                      <div className="text-sm md:text-base leading-relaxed space-y-4 whitespace-pre-line text-[#332b22]">
                        {formatLiturgyText(data?.gospel?.text)}
                      </div>

                      <div className="mt-8 pt-4 border-t border-[#e8e2d8] text-sm md:text-base font-bold text-[#a6824b]">
                        Palavra da Salvação. <span className="font-semibold text-[#2d261e]">Glória a vós, Senhor.</span>
                      </div>
                    </article>
                  )}

                  {/* Tab 5: Reflection */}
                  {activeTab === "reflection" && (
                    <article className="prose max-w-none text-[#332b22]">
                      <span className="text-xs font-bold text-[#a6824b] uppercase tracking-wider block mb-1">
                        REFLEXÃO DA PALAVRA
                      </span>
                      <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2d261e] mb-6">
                        Reflexão Completa
                      </h2>
                      <div className="text-sm md:text-base leading-relaxed space-y-4 text-[#332b22] whitespace-pre-line">
                        {data?.reflection?.text ||
                          "A promessa da nova aliança revela o coração misericordioso de Deus, que renova o nosso ser e nos convida a vivenciar sua palavra no cotidiano com amor e entrega."}
                      </div>
                    </article>
                  )}

                  {/* Tab 6: Saint of the Day */}
                  {activeTab === "saint" && data?.saint && (
                    <article className="prose max-w-none text-[#332b22]">
                      <span className="text-xs font-bold text-[#a6824b] uppercase tracking-wider block mb-1">
                        SANTOS DO DIA
                      </span>
                      <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2d261e] mb-4">
                        {data.saint.name}
                      </h2>
                      <div className="text-sm md:text-base leading-relaxed space-y-4 text-[#332b22] whitespace-pre-line">
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
            <div className="relative rounded-2xl overflow-hidden w-full aspect-[16/10.15] border border-[#D6A64A]/40 shadow-md">
              <img
                src="/biblia-aberta-card.png"
                alt="Liturgia Diária"
                className="w-full h-full object-cover object-bottom"
              />
            </div>

            {/* Leituras do Dia Card */}
            <div className="bg-[#fbf5eb] border border-[#e8e2d8] rounded-2xl p-5 shadow-sm space-y-4">
              <h4 className="font-serif font-bold text-[#2d261e] text-lg border-b border-[#e8e2d8] pb-3">
                Leituras do Dia
              </h4>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f3ece0]">
                  <BookOpen className="w-4 h-4 text-[#a6824b] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-[#2d261e] block">1ª Leitura</span>
                    <span className="text-[#6b5c4d] text-xs md:text-sm">{data?.firstReading?.reference || "Primeira Leitura"}</span>
                  </div>
                </div>

                {data?.secondReading && (
                  <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f3ece0]">
                    <BookOpen className="w-4 h-4 text-[#a6824b] mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-[#2d261e] block">2ª Leitura</span>
                      <span className="text-[#6b5c4d] text-xs md:text-sm">{data.secondReading.reference}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f3ece0]">
                  <Quote className="w-4 h-4 text-[#a6824b] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-[#2d261e] block">Salmo</span>
                    <span className="text-[#6b5c4d] text-xs md:text-sm">{data?.psalm?.reference || "Salmo"}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f3ece0]">
                  <BookOpen className="w-4 h-4 text-[#a6824b] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-[#2d261e] block">Evangelho</span>
                    <span className="text-[#6b5c4d] text-xs md:text-sm">{data?.gospel?.reference || "Evangelho"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Santos do Dia Card (Conditional) */}
            {data?.saint && (
              <div className="bg-[#fbf5eb] border border-[#e8e2d8] rounded-2xl p-5 shadow-sm">
                <h4 className="font-serif font-bold text-[#2d261e] text-lg border-b border-[#e8e2d8] pb-3 mb-4">
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
              <h4 className="font-serif font-bold text-[#2d261e] text-lg mb-2">
                A liturgia de amanhã
              </h4>
              <p className="text-sm text-[#6b5c4d] mb-4 capitalize">{tomorrowDateStr}</p>

              <button
                onClick={handleNextDay}
                className="text-sm font-bold text-[#a6824b] hover:text-[#8c6c3c] flex items-center gap-1 transition-colors cursor-pointer"
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
                  <p className="font-serif italic text-sm text-[#4a3f35] leading-relaxed mb-2">
                    &ldquo;{data?.psalm?.response || data?.psalm?.text?.slice(0, 140) || "Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho."}&rdquo;
                  </p>
                  <span className="text-xs font-bold text-[#8c7b6c]">
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
