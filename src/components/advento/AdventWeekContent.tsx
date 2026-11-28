"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Church,
  Flame,
  HeartHandshake,
  Home,
  Sparkles,
  Users,
} from "lucide-react";
import { ADVENT_SYMBOLS_HREF } from "./adventData";
import type {
  AdventFamilySuggestionIcon,
  AdventWeekData,
  AdventWeekId,
} from "./types";

interface AdventWeekContentProps {
  week: AdventWeekData;
  onSelectWeek: (weekId: AdventWeekId) => void;
}

function SuggestionIcon({ icon }: { icon: AdventFamilySuggestionIcon }) {
  const cls = "w-4 h-4 text-[#B8872E] shrink-0 mt-1";
  switch (icon) {
    case "prayer":
      return <Sparkles className={cls} strokeWidth={1.75} />;
    case "church":
      return <Church className={cls} strokeWidth={1.75} />;
    case "book":
      return <BookOpen className={cls} strokeWidth={1.75} />;
    case "heart":
      return <HeartHandshake className={cls} strokeWidth={1.75} />;
    case "home":
      return <Home className={cls} strokeWidth={1.75} />;
    case "users":
      return <Users className={cls} strokeWidth={1.75} />;
  }
}

export function AdventWeekContent({
  week,
  onSelectWeek,
}: AdventWeekContentProps) {
  if (!week.isPublished) {
    return (
      <article
        id="advent-week-panel"
        role="tabpanel"
        aria-label={week.theme}
        className="space-y-10"
      >
        {/* Identificação da semana */}
        <header className="space-y-3 pb-6 border-b border-[#D6A64A]/30">
          <div className="flex items-center gap-3">
            <span className="hidden sm:block h-px w-8 bg-[#B8872E]/50" />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-[#B8872E]">
              {week.eyebrow}
            </span>
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#18351E] leading-[1.15]"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {week.title}
          </h2>

          <p className="text-lg text-[#8c6218] font-serif italic">
            {week.subtitle}
          </p>
        </header>

        {/* Introdução oficial */}
        <div className="space-y-4 font-serif text-[#43362d] text-base md:text-lg leading-relaxed max-w-3xl">
          {week.introParagraphs.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Referência do Evangelho */}
        <section className="bg-[#f3ece0] border-l-4 border-[#a6824b] rounded-r-2xl p-6 sm:p-7 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#a6824b]">
            <BookOpen className="w-4 h-4" />
            <span>{week.gospelSection.title}</span>
          </div>
          <p className="text-xl font-serif font-bold text-[#18351E]">
            {week.gospelSection.reference}
          </p>
          {week.gospelSection.reflectionParagraphs.map((p, idx) => (
            <p
              key={idx}
              className="text-lg font-serif text-[#43362d] leading-relaxed"
            >
              {p}
            </p>
          ))}
        </section>

        {/* Tópicos oficiais da semana */}
        {week.previewTopics && week.previewTopics.length > 0 && (
          <section className="space-y-4">
            <h3
              className="text-2xl font-semibold text-[#18351E]"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              O que contemplaremos nesta semana
            </h3>
            <ul className="space-y-2.5 font-serif text-[#43362d] text-base md:text-lg">
              {week.previewTopics.map((topic, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 size-1.5 rounded-full bg-[#B8872E] shrink-0"
                  />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Aviso sereno de preparação do conteúdo completo */}
        <div className="bg-[#fbf5eb] border border-[#D6A64A]/35 rounded-3xl p-6 sm:p-8 space-y-4">
          <p className="font-serif text-[#5A463B] text-lg leading-relaxed">
            As reflexões completas, orações e sugestões em família desta{" "}
            {week.numberLabel}ª semana do Advento serão disponibilizadas ao longo
            da nossa caminhada paroquial até o Natal.
          </p>
          <button
            type="button"
            onClick={() => onSelectWeek(1)}
            className="inline-flex items-center gap-2 rounded-full bg-[#18351E] hover:bg-[#27442A] text-[#eeca94] text-sm font-semibold px-6 py-3 transition-colors cursor-pointer"
          >
            <span>Ler a Primeira Semana (Esperança)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </article>
    );
  }

  return (
    <article
      id="advent-week-panel"
      role="tabpanel"
      aria-label={week.theme}
      className="space-y-12"
    >
      {/* 1. Identificação da semana */}
      <header className="space-y-3 pb-6 border-b border-[#D6A64A]/30">
        <div className="flex items-center gap-3">
          <span className="hidden sm:block h-px w-8 bg-[#B8872E]/50" />
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-[#B8872E]">
            {week.eyebrow}
          </span>
        </div>

        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#18351E] leading-[1.15]"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          {week.title}
        </h2>

        <p className="text-lg sm:text-xl text-[#8c6218] font-serif italic">
          {week.subtitle}
        </p>
      </header>

      {/* 2. Introdução editorial */}
      <section className="space-y-4 font-serif text-[#43362d] text-base md:text-lg leading-relaxed max-w-3xl">
        {week.introParagraphs.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </section>

      <hr className="border-[#D6A64A]/25" />

      {/* 3. A primeira vela: Esperança */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5 text-[#B8872E]">
          <h3
            className="text-2xl sm:text-3xl font-semibold text-[#18351E]"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {week.candleSection.title}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-7 items-center">
          <div
            className={`${
              week.candleSection.image ? "md:col-span-7" : "md:col-span-12"
            } space-y-4 font-serif text-[#43362d] text-base md:text-lg leading-relaxed`}
          >
            {week.candleSection.paragraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {week.candleSection.image && (
            <div className="md:col-span-5">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-[#D6A64A]/40 shadow-sm bg-[#f3ece0]">
                <Image
                  src={week.candleSection.image.src}
                  alt={week.candleSection.image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover object-center"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. A Palavra de Deus (estilo Liturgia Diária) */}
      <section className="bg-[#f3ece0] border-l-4 border-[#a6824b] rounded-r-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#a6824b]">
            <BookOpen className="w-4 h-4" />
            <span>A PALAVRA DE DEUS</span>
          </div>
          <span className="text-sm font-semibold text-[#8c6218]">
            {week.gospelSection.reference}
          </span>
        </div>

        <h3
          className="text-2xl sm:text-3xl font-semibold text-[#18351E]"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          {week.gospelSection.title}
        </h3>

        {week.gospelSection.quote && (
          <blockquote className="text-lg sm:text-xl font-serif italic font-semibold text-[#18351E] leading-relaxed border-y border-[#D6A64A]/30 py-4">
            &ldquo;{week.gospelSection.quote}&rdquo;
          </blockquote>
        )}

        <div className="space-y-3 font-serif text-[#43362d] text-lg leading-relaxed">
          {week.gospelSection.reflectionParagraphs.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* 5. Os símbolos que nos acompanham */}
      {week.symbolsSection && (
        <section id="simbolos-advento" className="space-y-6 scroll-mt-28">
          <div className="space-y-3">
            <h3
              className="text-2xl sm:text-3xl font-semibold text-[#18351E]"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              {week.symbolsSection.title}
            </h3>
            <p className="font-serif text-[#43362d] text-base md:text-lg leading-relaxed">
              {week.symbolsSection.intro}
            </p>
          </div>

          <ul className="space-y-3 font-serif text-[#43362d] text-base md:text-lg leading-relaxed pl-1">
            {week.symbolsSection.items.map((item) => (
              <li key={item.label} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2.5 size-1.5 rounded-full bg-[#B8872E] shrink-0"
                />
                <span>
                  <strong className="font-semibold text-[#18351E]">
                    {item.label}:
                  </strong>{" "}
                  {item.description}
                </span>
              </li>
            ))}
          </ul>

          <p className="font-serif text-[#5A463B] text-base md:text-lg leading-relaxed italic">
            {week.symbolsSection.closing}
          </p>

          {/* Chamada visual para a página de Símbolos do Advento:
              oculta enquanto ADVENT_SYMBOLS_HREF === null (rota ainda inexistente) */}
          {ADVENT_SYMBOLS_HREF && week.symbolsSection.callout && (
            <Link
              href={ADVENT_SYMBOLS_HREF}
              className="group flex flex-col sm:flex-row items-stretch overflow-hidden rounded-3xl border border-[#D6A64A]/40 bg-[#fbf5eb] hover:border-[#B8872E] shadow-xs hover:shadow-md transition-all"
            >
              <div className="relative sm:w-56 aspect-[16/10] sm:aspect-auto shrink-0 overflow-hidden">
                <Image
                  src={week.symbolsSection.callout.imageSrc}
                  alt={week.symbolsSection.callout.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, 224px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col justify-center gap-2">
                <h4
                  className="text-2xl font-semibold text-[#18351E] group-hover:text-[#8c6218] transition-colors"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {week.symbolsSection.callout.title}
                </h4>
                <p className="text-sm sm:text-base font-serif text-[#5A463B]">
                  {week.symbolsSection.callout.description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#B8872E] mt-1">
                  <span>Explorar símbolos</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          )}
        </section>
      )}

      <hr className="border-[#D6A64A]/25" />

      {/* 6. Vivendo a esperança em família */}
      {week.familySection && (
        <section className="space-y-6">
          <div className="space-y-3">
            <h3
              className="text-2xl sm:text-3xl font-semibold text-[#18351E]"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              {week.familySection.title}
            </h3>
            <p className="font-serif text-[#43362d] text-base md:text-lg leading-relaxed">
              {week.familySection.intro}
            </p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-1">
            {week.familySection.suggestions.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 font-serif text-[#43362d] text-lg leading-relaxed pb-3 border-b border-[#D6A64A]/20"
              >
                <SuggestionIcon icon={item.icon} />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 7. Momento de reflexão */}
      {week.reflectionSection && (
        <section className="relative overflow-hidden bg-[#fbf5eb] border border-[#D6A64A]/35 rounded-3xl p-6 sm:p-9 space-y-5 shadow-2xs">
          <div
            aria-hidden="true"
            className="pointer-events-none select-none absolute -top-2 right-0 w-24 sm:w-32 aspect-[420/480] opacity-20"
          >
            <Image
              src="/destaques/advento/estrela-dourada-topo-direita.png"
              alt=""
              fill
              sizes="(max-width: 640px) 96px, 128px"
              className="object-contain object-right-top"
            />
          </div>

          <div className="relative z-10 space-y-5">
            <h3
              className="text-2xl sm:text-3xl font-semibold text-[#18351E]"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              {week.reflectionSection.title}
            </h3>

            <ul className="space-y-3 font-serif text-[#43362d] text-base md:text-lg leading-relaxed">
              {week.reflectionSection.questions.map((question, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="text-[#B8872E] font-semibold mt-0.5"
                  >
                    •
                  </span>
                  <span>{question}</span>
                </li>
              ))}
            </ul>

            <p className="pt-4 border-t border-[#D6A64A]/25 font-serif italic text-[#8c6218] text-base md:text-lg leading-relaxed">
              &ldquo;{week.reflectionSection.prayer}&rdquo;
            </p>
          </div>
        </section>
      )}

      {/* 8. Continuidade da caminhada */}
      {week.nextWeek && (
        <section className="pt-6 border-t border-[#D6A64A]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3
              className="text-2xl sm:text-3xl font-semibold text-[#18351E]"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              {week.nextWeek.title}
            </h3>
            <p className="font-serif text-[#5A463B] text-lg leading-relaxed">
              {week.nextWeek.description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelectWeek(week.nextWeek!.targetWeekId)}
            className="group shrink-0 inline-flex items-center justify-center gap-2.5 rounded-full bg-[#18351E] hover:bg-[#27442A] text-[#eeca94] font-semibold text-sm sm:text-base px-7 py-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8872E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbf6ee]"
          >
            <span>{week.nextWeek.buttonLabel}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </section>
      )}
    </article>
  );
}
