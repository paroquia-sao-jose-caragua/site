"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { listActiveAnnouncements } from "@/lib/api/announcements/listActive";
import { apiBaseUrl } from "@/lib/api/utils/api";
import type { Announcement } from "@/entities/Announcement";

const SLIDE_INTERVAL_MS = 15000;
const DEFAULT_BANNER = "/banners/default-banner.png";

export function AnnouncementsHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data } = useQuery({
    queryKey: ["active-announcements"],
    queryFn: listActiveAnnouncements,
  });

  const announcements: Announcement[] = data?.announcements ?? [];

  useEffect(() => {
    if (announcements.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % announcements.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const handlePrev = () => {
    if (announcements.length <= 1) return;
    setCurrentSlide((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (announcements.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % announcements.length);
  };

  const getImageUrl = (id?: string | null) => {
    if (!id) return DEFAULT_BANNER;
    if (id.startsWith("http://") || id.startsWith("https://") || id.startsWith("/")) {
      return id;
    }
    return `${apiBaseUrl}/attachments/${id}`;
  };

  const slide = announcements[currentSlide] || announcements[0];
  const hasDynamicSlide = announcements.length > 0 && !!slide;

  const desktopSrc = hasDynamicSlide ? getImageUrl(slide.coverDesktopId) : DEFAULT_BANNER;
  const tabletSrc = hasDynamicSlide && slide.coverTabletId ? getImageUrl(slide.coverTabletId) : desktopSrc;
  const mobileSrc = hasDynamicSlide && slide.coverMobileId ? getImageUrl(slide.coverMobileId) : tabletSrc;

  return (
    <section className="relative w-full h-[480px] md:h-[560px] lg:h-[632px] bg-[#14201d] text-white overflow-hidden">
      {/* 1. Imagem de Fallback Estática (Renderizada imediatamente com prioridade máxima para LCP e CLS 0) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={DEFAULT_BANNER}
          alt="Paróquia São José de Caraguatatuba"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* 2. Imagem Dinâmica da API (Renderizada em cima com transição suave quando disponível) */}
      {hasDynamicSlide && desktopSrc !== DEFAULT_BANNER && (
        <div className="absolute inset-0 z-0 transition-opacity duration-700">
          <picture>
            <source media="(max-width: 640px)" srcSet={mobileSrc} />
            <source media="(max-width: 1024px)" srcSet={tabletSrc} />
            <img
              src={desktopSrc}
              alt={slide.title || "Destaque"}
              width={1920}
              height={632}
              fetchPriority="high"
              className="w-full h-full object-cover object-center"
            />
          </picture>
        </div>
      )}

      {/* Overlay gradiente suave para contraste e legibilidade */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent md:w-3/4 lg:w-3/5" />
      <div className="absolute inset-0 z-0 bg-black/15" />

      {/* Conteúdo (Destaque da API ou Mensagem Padrão de Boas-Vindas) */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-6 md:px-12 flex flex-col justify-center">
        <div className="max-w-xl md:max-w-md py-12">
          {hasDynamicSlide ? (
            <>
              {slide.badgeText && (
                <div className="flex items-center gap-2 text-[#d4a359] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
                  <Sparkles className="w-4 h-4 text-[#d4a359]" />
                  <span>{slide.badgeText}</span>
                  <span className="h-px w-8 bg-[#d4a359]/60 inline-block" />
                </div>
              )}

              <h1 className="text-4xl md:text-6xl font-serif font-semibold text-[#fbf5eb] tracking-tight leading-[1.1] mb-5 drop-shadow-md">
                {slide.title}
              </h1>

              {slide.description && (
                <p className="text-base md:text-lg text-[#e6ded1] font-sans mb-8 leading-relaxed max-w-lg drop-shadow">
                  {slide.description}
                </p>
              )}

              {slide.actionText && (
                <div>
                  <Link
                    href={slide.actionUrl || "#"}
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-md bg-[#c69247] hover:bg-[#b07d35] text-[#14201d] font-semibold text-sm transition-all shadow-md hover:shadow-lg hover:scale-105"
                  >
                    {slide.actionText}
                  </Link>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-[#d4a359] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
                <Sparkles className="w-4 h-4 text-[#d4a359]" />
                <span>Diocese de Caraguatatuba</span>
                <span className="h-px w-8 bg-[#d4a359]/60 inline-block" />
              </div>

              <h1 className="text-4xl md:text-6xl font-serif font-semibold text-[#fbf5eb] tracking-tight leading-[1.1] mb-5 drop-shadow-md">
                Paróquia São José
              </h1>

              <p className="text-base md:text-lg text-[#e6ded1] font-sans mb-8 leading-relaxed max-w-lg drop-shadow">
                Uma comunidade de fé, esperança e amor no coração do Litoral Norte. Conheça nossos horários de missas e pastorais.
              </p>

              <div>
                <Link
                  href="/comunidades"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-md bg-[#c69247] hover:bg-[#b07d35] text-[#14201d] font-semibold text-sm transition-all shadow-md hover:shadow-lg hover:scale-105"
                >
                  Conheça Nossas Comunidades
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Controles de Navegação (Apenas se houver múltiplos anúncios) */}
      {announcements.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 text-white/90 hover:text-white flex items-center justify-center transition-all border border-white/10 backdrop-blur-xs"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 text-white/90 hover:text-white flex items-center justify-center transition-all border border-white/10 backdrop-blur-xs"
            aria-label="Próximo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {announcements.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlide ? "w-6 bg-[#d4a359]" : "w-2 bg-white/40 hover:bg-white/80"
                }`}
                aria-label={`Ir para slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
