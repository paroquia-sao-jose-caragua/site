"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ADVENT_WEEKS, getInitialAdventWeekId } from "./adventData";
import { AdventWeekSidebar } from "./AdventWeekSidebar";
import { AdventWeekContent } from "./AdventWeekContent";
import type { AdventWeekId } from "./types";

export function AdventJourneyPage() {
  const [activeWeekId, setActiveWeekId] = useState<AdventWeekId>(() =>
    getInitialAdventWeekId()
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const contentTopRef = useRef<HTMLDivElement>(null);

  // Ensure client timezone/date matches on hydration
  useEffect(() => {
    setActiveWeekId(getInitialAdventWeekId());
  }, []);

  const activeWeek =
    ADVENT_WEEKS.find((w) => w.id === activeWeekId) ?? ADVENT_WEEKS[0];

  const handleSelectWeek = (
    weekId: AdventWeekId,
    options?: { scrollToContent?: boolean }
  ) => {
    if (weekId === activeWeekId) return;
    setIsTransitioning(true);

    window.setTimeout(() => {
      setActiveWeekId(weekId);
      setIsTransitioning(false);

      if (options?.scrollToContent && contentTopRef.current) {
        contentTopRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 140);
  };

  return (
    <main className="relative w-full min-h-screen overflow-x-clip bg-[#fbf6ee] text-[#18351E] pt-5 pb-20 md:pb-28">
      {/* Subtle decorative Advent ornaments anchored to page corners (matching Advent highlight) */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-0 left-0 w-32 sm:w-48 md:w-64 lg:w-80 xl:w-96 aspect-[520/512] opacity-40 sm:opacity-60 lg:opacity-75"
      >
        <Image
          src="/destaques/advento/moldura-topo-esquerda.png"
          alt=""
          fill
          sizes="(max-width: 640px) 128px, (max-width: 1024px) 256px, 384px"
          className="object-contain object-left-top"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-0 right-0 w-32 sm:w-48 md:w-64 lg:w-80 xl:w-96 aspect-[520/512] opacity-40 sm:opacity-60 lg:opacity-75"
      >
        <Image
          src="/destaques/advento/moldura-topo-direita.png"
          alt=""
          fill
          sizes="(max-width: 640px) 128px, (max-width: 1024px) 256px, 384px"
          className="object-contain object-right-top"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-0 left-0 w-32 sm:w-48 md:w-60 lg:w-72 aspect-[520/512] opacity-35 lg:opacity-45"
      >
        <Image
          src="/destaques/advento/moldura-base-esquerda.png"
          alt=""
          fill
          sizes="(max-width: 640px) 128px, (max-width: 1024px) 240px, 288px"
          className="object-contain object-left-bottom"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-0 right-0 w-36 sm:w-52 md:w-64 lg:w-80 aspect-[620/500] opacity-35 lg:opacity-45"
      >
        <Image
          src="/destaques/advento/pinheiro-dourado-base-direita.png"
          alt=""
          fill
          sizes="(max-width: 640px) 144px, (max-width: 1024px) 256px, 320px"
          className="object-contain object-right-bottom"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="text-sm text-[#8c7b6c] mb-4 flex items-center gap-2 font-medium"
        >
          <Link href="/" className="hover:text-[#18351E] transition-colors">
            Início
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#B8872E]/60" />
          <span className="text-[#18351E] font-semibold">Tempo do Advento</span>
        </nav>

        {/* 1. Cabeçalho de apresentação da página (Ordem obrigatória: Título -> Descrição -> Imagem) */}
        <header className="mb-10 md:mb-12 text-center">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2">
            <span className="h-px w-10 sm:w-16 bg-[#B8872E]/50" />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#B8872E]">
              JORNADA LITÚRGICA
            </span>
            <span className="h-px w-10 sm:w-16 bg-[#B8872E]/50" />
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-semibold text-[#18351E] leading-tight"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Tempo do Advento
          </h1>

          <p className="text-lg text-[#5A463B] font-serif mt-2.5 max-w-2xl mx-auto leading-relaxed">
            Ao longo das quatro semanas do Advento, somos convidados a intensificar nossa oração e renovar a esperança na vinda de Cristo.
          </p>

          <div className="mt-5 relative w-full aspect-[16/10] sm:aspect-[16/7] md:aspect-[16/6.2] overflow-hidden rounded-3xl border border-[#D6A64A]/35 shadow-sm bg-[#f3ece0]">
            <Image
              src="/destaques/advento/presepio-realista-desktop.png"
              alt="Presépio tradicional com Maria, José, a manjedoura vazia aguardando o Menino Jesus e a estrela brilhando ao fundo"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1280px"
              className="object-cover object-[50%_52%]"
            />
          </div>
        </header>

        {/* 2. Estrutura principal: conteúdo (~70%) + sidebar (~30%) */}
        <div
          ref={contentTopRef}
          className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px] gap-2 xl:gap-14 items-start"
        >
          {/* Mobile: Barra horizontal antes do conteúdo */}
          <div className="lg:hidden min-w-0">
            <AdventWeekSidebar
              weeks={ADVENT_WEEKS}
              activeWeekId={activeWeekId}
              onSelectWeek={(id) => handleSelectWeek(id)}
            />
          </div>

          {/* Coluna principal (~70%) */}
          <div
            className={`min-w-0 transition-opacity duration-200 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            <AdventWeekContent
              week={activeWeek}
              onSelectWeek={(id) =>
                handleSelectWeek(id, { scrollToContent: true })
              }
            />
          </div>

          {/* Sidebar desktop (~30%, sticky abaixo do header de 72px + 24px de respiro) */}
          <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <AdventWeekSidebar
              weeks={ADVENT_WEEKS}
              activeWeekId={activeWeekId}
              onSelectWeek={(id) =>
                handleSelectWeek(id, { scrollToContent: true })
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
}
