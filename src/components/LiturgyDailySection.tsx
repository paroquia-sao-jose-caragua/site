"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen, Calendar as CalendarIcon } from "lucide-react";
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
              <div className="flex items-center gap-2 text-[#B8872E] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
                <BookOpen className="w-4 h-4 text-[#B8872E]" />
                <span>PALAVRA DO DIA</span>
              </div>

              <blockquote
                className="text-2xl md:text-3xl font-semibold text-[#18351E] mb-2 leading-snug"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                “Permanecei em mim, e eu permanecerei em vós.”
              </blockquote>

              <p className="text-sm font-semibold text-[#B8872E] mb-3">{gospelRef}</p>

              <p className="text-sm text-[#3E2E25] font-medium mb-8 leading-relaxed max-w-md">
                {formatLiturgyText(gospelSnippet)}
              </p>

              <Link
                href="/liturgia"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#18351E] hover:bg-[#27442A] text-[#eeca94] font-semibold text-sm transition-all shadow-md hover:shadow-lg"
              >
                Ler reflexão completa
              </Link>
            </div>
          </div>

          {/* Card 2: Liturgia Diária (1 column) */}
          <div className="border-2 border-[#D6A64A]/60 rounded-2xl p-6 md:p-10 flex flex-col justify-center items-center text-center hover:shadow-sm transition-shadow">
            <CalendarIcon className="text-[#b8872e] w-7 h-7 mb-3" />

            <span className="text-xs font-semibold text-[#B8872E] uppercase tracking-[0.25em] mb-3">
              LITURGIA DIÁRIA
            </span>

            <h3
              className="text-2xl font-semibold text-[#18351E] mb-8 max-w-xs"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Acompanhe a Liturgia todos os dias
            </h3>

            <Link
              href="/liturgia"
              className="w-full max-w-xs inline-flex items-center justify-center px-6 py-3 rounded-lg border border-[#B8872E] text-[#B8872E] hover:bg-[#B8872E] hover:text-white font-semibold text-sm transition-all"
            >
              Acessar Liturgia
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
