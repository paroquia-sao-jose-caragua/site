"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen, Quote } from "lucide-react";
import Link from "next/link";
import { getDailyLiturgy } from "@/lib/api/liturgy/getDaily";
import { formatLiturgyText } from "@/utils/formatLiturgyText";

export function LiturgyDailySection() {
  const { data } = useQuery({
    queryKey: ["daily-liturgy-today"],
    queryFn: () => getDailyLiturgy(),
  });

  const gospelRef = data?.gospel?.reference || "João 15,4";
  const gospelSnippet =
    data?.gospel?.text
      ? data.gospel.text.slice(0, 130) + "..."
      : "Quem permanece em mim, e eu nele, esse dá muito fruto; porque sem mim nada podeis fazer.";

  return (
    <section className="bg-[#fbf6ee] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Palavra do Dia (Spans 2 columns on desktop with biblia-aberta background) */}
          <div className="lg:col-span-2 bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-2xl p-6 md:p-10 flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-md transition-shadow min-h-[320px]">
            {/* Background image covering the full card */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <img
                src="/biblia-aberta.png"
                alt="Bíblia Aberta"
                className="w-full h-full object-cover object-right md:object-right-bottom opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#fbf5eb] via-[#fbf5eb]/90 to-[#fbf5eb]/40 md:to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#fbf5eb]/90 via-transparent to-transparent md:hidden" />
            </div>

            <div className="relative z-10 w-full max-w-xl">
              <div className="flex items-center gap-2 text-[#B8872E] text-sm font-semibold uppercase tracking-[0.25em] mb-4">
                <BookOpen className="w-4 h-4 text-[#B8872E]" />
                <span>PALAVRA DO DIA</span>
              </div>

              <blockquote
                className="text-2xl md:text-3xl font-semibold text-[#18351E] mb-2 leading-snug"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                “Permanecei em mim, e eu permanecerei em vós.”
              </blockquote>

              <p className="text-md font-semibold text-[#B8872E] mb-3">{gospelRef}</p>

              <p className="text-md text-[#3E2E25] font-medium mb-8 leading-relaxed max-w-2xl">
                {formatLiturgyText(gospelSnippet)}
              </p>

              <Link
                href="/liturgia"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#18351E] hover:bg-[#27442A] text-[#eeca94] font-semibold text-sm transition-all shadow-md hover:shadow-lg"
              >
                Ler Palavra do Dia
              </Link>
            </div>
          </div>

          {/* Card 2: Leituras do Dia (1 column) */}
          <div className="bg-[#fbf5eb] border border-[#e8e2d8] rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="font-serif font-bold text-[#2d261e] text-lg border-b border-[#e8e2d8] pb-3">
              Leituras do Dia
            </h4>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f3ece0]">
                <BookOpen className="w-4 h-4 text-[#a6824b] mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-[#2d261e] block">1ª Leitura</span>
                  <span className="text-[#6b5c4d] text-sm md:text-sm">
                    {data?.firstReading?.reference || "Primeira Leitura"}
                  </span>
                </div>
              </div>

              {data?.secondReading && (
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f3ece0]">
                  <BookOpen className="w-4 h-4 text-[#a6824b] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-[#2d261e] block">2ª Leitura</span>
                    <span className="text-[#6b5c4d] text-sm md:text-sm">
                      {data.secondReading.reference}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f3ece0]">
                <Quote className="w-4 h-4 text-[#a6824b] mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-[#2d261e] block">Salmo</span>
                  <span className="text-[#6b5c4d] text-sm md:text-sm">
                    {data?.psalm?.reference || "Salmo"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f3ece0]">
                <BookOpen className="w-4 h-4 text-[#a6824b] mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-[#2d261e] block">Evangelho</span>
                  <span className="text-[#6b5c4d] text-sm md:text-sm">
                    {data?.gospel?.reference || "Evangelho"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
