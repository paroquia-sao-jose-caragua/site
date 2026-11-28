"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { ADVENT_SYMBOLS_HREF } from "./adventData";
import type { AdventWeekData, AdventWeekId } from "./types";

interface AdventWeekSidebarProps {
  weeks: AdventWeekData[];
  activeWeekId: AdventWeekId;
  onSelectWeek: (weekId: AdventWeekId) => void;
}

export function AdventWeekSidebar({
  weeks,
  activeWeekId,
  onSelectWeek,
}: AdventWeekSidebarProps) {
  const activeIndex = Math.max(
    0,
    weeks.findIndex((week) => week.id === activeWeekId)
  );
  const activeWeek = weeks[activeIndex] ?? weeks[0];
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < weeks.length - 1;

  const handlePrevWeek = () => {
    if (hasPrev) {
      onSelectWeek(weeks[activeIndex - 1].id);
    }
  };

  const handleNextWeek = () => {
    if (hasNext) {
      onSelectWeek(weeks[activeIndex + 1].id);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) => {
    if (
      e.key === "ArrowRight" ||
      e.key === "ArrowDown"
    ) {
      e.preventDefault();
      const next = weeks[(currentIndex + 1) % weeks.length];
      onSelectWeek(next.id);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prev = weeks[(currentIndex - 1 + weeks.length) % weeks.length];
      onSelectWeek(prev.id);
    }
  };

  return (
    <aside aria-label="Navegação pelas semanas do Advento" className="min-w-0">
      {/* Mobile / Tablet: Week switcher bar (same pattern as Liturgia Diária) */}
      <div className="lg:hidden mb-8">
        <div className="flex items-center justify-between gap-3 bg-[#fbf5eb] border-y border-[#D6A64A]/30 px-4 py-3 -mx-6">
          <button
            type="button"
            onClick={handlePrevWeek}
            disabled={!hasPrev}
            aria-label="Semana anterior"
            title="Semana anterior"
            className="p-1.5 rounded-lg text-[#8c7b6c] hover:bg-[#fbf6ee] hover:text-[#2d261e] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#8c7b6c]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center min-w-0" aria-live="polite">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B8872E]">
              {activeWeek.numberLabel} — {activeWeek.displayDate}
            </span>
            <span
              className="block text-lg font-semibold text-[#18351E] leading-snug truncate"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Jornada Litúrgica: {activeWeek.theme}
            </span>
          </div>

          <button
            type="button"
            onClick={handleNextWeek}
            disabled={!hasNext}
            aria-label="Próxima semana"
            title="Próxima semana"
            className="p-1.5 rounded-lg text-[#8c7b6c] hover:bg-[#fbf6ee] hover:text-[#2d261e] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#8c7b6c]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop: Vertical Sidebar (~30%) */}
      <div className="hidden lg:block space-y-5">
        <div className="bg-[#fbf5eb] border border-[#e8e2d8] rounded-3xl p-6 shadow-sm">
          <div className="pb-4 mb-2 border-b border-[#e8e2d8]">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.25em] text-[#B8872E] mb-1">
              JORNADA LITÚRGICA
            </span>
            <h2
              className="text-2xl font-semibold text-[#18351E]"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Sua caminhada
            </h2>
          </div>

          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="Sua caminhada no Advento"
            className="divide-y divide-[#e8e2d8]"
          >
            {weeks.map((week, idx) => {
              const isSelected = week.id === activeWeekId;
              return (
                <div key={week.id} className="py-1.5 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    aria-controls="advent-week-panel"
                    onClick={() => onSelectWeek(week.id)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    className={`group w-full text-left rounded-xl px-4 py-3 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8872E] ${
                      isSelected
                        ? "bg-[#EFE4D1]/85"
                        : "bg-transparent hover:bg-[#f3ece0]/60"
                    }`}
                  >
                    <span
                      className={`block text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                        isSelected
                          ? "text-[#B8872E]"
                          : "text-[#8c7b6c] group-hover:text-[#B8872E]"
                      }`}
                    >
                      {week.numberLabel} — {week.displayDate}
                    </span>

                    <span
                      className="block text-lg font-semibold text-[#18351E] mt-0.5 leading-snug"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      {week.theme}
                    </span>

                    <span className="block text-sm text-[#6b5c4d] font-serif mt-0.5">
                      {week.sidebarSubtitle}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Acesso futuro à página de Símbolos do Advento (oculto enquanto a rota não existir) */}
          {ADVENT_SYMBOLS_HREF && (
            <div className="mt-5 pt-4 border-t border-[#e8e2d8]">
              <Link
                href={ADVENT_SYMBOLS_HREF}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#8c6218] hover:text-[#18351E] transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#B8872E]" />
                <span>Símbolos do Advento</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
