"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { listActiveAnnouncements } from "@/lib/api/announcements/listActive";
import { apiBaseUrl } from "@/lib/api/utils/api";
import type { Announcement } from "@/entities/Announcement";

const SLIDE_INTERVAL_MS = 15000; // 15 segundos

export function AnnouncementsHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data, isPending } = useQuery({
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

  const getImageUrl = (id: string) => {
    if (!id) return "/hero/slide-1.png";
    if (id.startsWith("http://") || id.startsWith("https://") || id.startsWith("/")) {
      return id;
    }
    return `${apiBaseUrl}/attachments/${id}`;
  };

  if (isPending) {
    return (
      <section className="relative w-full h-[480px] md:h-[560px] lg:h-[632px] bg-[#14201d] flex items-center justify-center text-[#e8dfd1]">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#d4a359] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Carregando destaques...</span>
        </div>
      </section>
    );
  }

  if (announcements.length === 0) {
    return null;
  }

  const slide = announcements[currentSlide] || announcements[0];
  const desktopSrc = getImageUrl(slide.coverDesktopId);
  const tabletSrc = slide.coverTabletId ? getImageUrl(slide.coverTabletId) : desktopSrc;
  const mobileSrc = slide.coverMobileId ? getImageUrl(slide.coverMobileId) : tabletSrc;

  return (
    <section className="relative w-full h-[480px] md:h-[560px] lg:h-[632px] bg-[#14201d] text-white overflow-hidden">
      {/* 100% Width Background Image with Responsive <picture> Tag */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source media="(max-width: 640px)" srcSet={mobileSrc} />
          <source media="(max-width: 1024px)" srcSet={tabletSrc} />
          <img
            src={desktopSrc}
            alt={slide.title}
            className="w-full h-full object-cover object-center transition-opacity duration-700"
          />
        </picture>
      </div>

      {/* MINIMAL OVERLAY: Suave gradiente apenas atrás do texto para legibilidade máxima sem escurecer a foto */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent md:w-3/4 lg:w-3/5" />
      <div className="absolute inset-0 z-0 bg-black/10" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-6 md:px-12 flex flex-col justify-center">
        <div className="max-w-xl md:max-w-md py-12">
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

          <p className="text-base md:text-lg text-[#e6ded1] font-sans mb-8 leading-relaxed max-w-lg drop-shadow">
            {slide.description}
          </p>

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
        </div>
      </div>

      {/* Setas de Navegação (Esquerda / Direita) */}
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

          {/* Bolinhas de Navegação (Bottom Center) */}
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
