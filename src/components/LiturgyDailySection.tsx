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
      ? data.gospel.text.slice(0, 180) + "..."
      : "Quem permanece em mim, e eu nele, esse dá muito fruto; porque sem mim nada podeis fazer.";

  return (
    <section className="bg-[#fbf6ee] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 items-center">
          {/* Esquerda: Palavra do Dia */}
          <div className="lg:col-span-2 relative overflow-hidden py-4 md:py-6 text-left">
            {/* Imagem da Bíblia à direita dentro da coluna da Palavra do Dia */}
            <div className="absolute inset-y-0 right-0 w-full sm:w-3/4 z-0 pointer-events-none flex justify-end items-center">
              <img
                src="/biblia-aberta.png"
                alt="Bíblia Aberta"
                className="h-[130%] lg:h-[145%] w-auto max-w-none object-contain object-right opacity-50 md:opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#fbf6ee] via-[#fbf6ee]/75 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#fbf6ee] via-transparent to-[#fbf6ee]/60" />
            </div>

            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-2 text-[#B8872E] text-sm font-semibold uppercase tracking-[0.25em] mb-3">
                <BookOpen className="w-4 h-4 text-[#B8872E]" />
                <span>PALAVRA DO DIA</span>
              </div>

              <h2
                className="text-3xl md:text-5xl font-semibold text-[#18351E] mb-4"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                {gospelRef}
              </h2>

              <p className="text-base md:text-lg text-[#5A463B] font-serif leading-relaxed mb-8">
                {formatLiturgyText(gospelSnippet)}
              </p>

              <Link
                href="/liturgia"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#18351E] hover:bg-[#27442A] text-[#eeca94] font-semibold text-sm transition-all shadow-sm hover:shadow-md"
              >
                Ler Palavra do Dia
              </Link>
            </div>
          </div>

          {/* Direita: Card Leituras do Dia */}
          <div className="bg-[#fbf5eb]/95 backdrop-blur-xs border border-[#e8e2d8] rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="font-serif font-bold text-[#2d261e] text-xl border-b border-[#e8e2d8] pb-3">
              Leituras do Dia
            </h4>

            <div className="space-y-3 text-md">
              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f3ece0]">
                <BookOpen className="w-4 h-4 text-[#a6824b] mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-[#2d261e] block">
                    1ª Leitura
                  </span>
                  <span className="text-[#6b5c4d] text-md">
                    {data?.firstReading?.reference || "Primeira Leitura"}
                  </span>
                </div>
              </div>

              {data?.secondReading && (
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f3ece0]">
                  <BookOpen className="w-4 h-4 text-[#a6824b] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-[#2d261e] block">
                      2ª Leitura
                    </span>
                    <span className="text-[#6b5c4d] text-md">
                      {data.secondReading.reference}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f3ece0]">
                <Quote className="w-4 h-4 text-[#a6824b] mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-[#2d261e] block">Salmo</span>
                  <span className="text-[#6b5c4d] text-md">
                    {data?.psalm?.reference || "Salmo"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f3ece0]">
                <BookOpen className="w-4 h-4 text-[#a6824b] mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-[#2d261e] block">
                    Evangelho
                  </span>
                  <span className="text-[#6b5c4d] text-md">
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
