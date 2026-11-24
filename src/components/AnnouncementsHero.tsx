"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { listActiveAnnouncements } from "@/lib/api/announcements/listActive";
import { apiBaseUrl } from "@/lib/api/utils/api";
import type { Announcement } from "@/entities/Announcement";

const SLIDE_INTERVAL_MS = 15000;
const FALLBACK_HOLD_MS = 2000;
const DEFAULT_BANNER = "/banners/default-banner.png";
const CACHE_KEY = "cached_active_announcements_v1";

const getImageUrl = (id?: string | null) => {
  if (!id) return "";
  if (
    id.startsWith("http://") ||
    id.startsWith("https://") ||
    id.startsWith("/")
  ) {
    return id;
  }
  return `${apiBaseUrl}/attachments/${id}`;
};

export function AnnouncementsHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFallback, setShowFallback] = useState(true);
  const [cachedAnnouncements, setCachedAnnouncements] = useState<
    Announcement[] | null
  >(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Announcement[];
        if (Array.isArray(parsed)) {
          setCachedAnnouncements(parsed);
        }
      }
    } catch {
      // ignore invalid cache
    }
  }, []);

  const { data } = useQuery({
    queryKey: ["active-announcements"],
    queryFn: listActiveAnnouncements,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!data?.announcements) return;
    setCachedAnnouncements(data.announcements);
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data.announcements));
    } catch {
      // ignore storage quota errors
    }
  }, [data]);

  const announcements: Announcement[] =
    data?.announcements ?? cachedAnnouncements ?? [];

  // Preload banner images in browser cache
  useEffect(() => {
    if (announcements.length === 0) return;
    announcements.forEach((item) => {
      [item.coverDesktopId, item.coverTabletId, item.coverMobileId].forEach(
        (id) => {
          const url = getImageUrl(id);
          if (url) {
            const img = new window.Image();
            img.src = url;
          }
        },
      );
    });
  }, [announcements]);

  // Mantém o banner de fallback por 5s após os banners reais serem carregados e faz transição suave
  useEffect(() => {
    if (announcements.length === 0) {
      setShowFallback(true);
      return;
    }

    const timer = setTimeout(() => {
      setShowFallback(false);
    }, FALLBACK_HOLD_MS);

    return () => clearTimeout(timer);
  }, [announcements.length]);

  useEffect(() => {
    if (showFallback || announcements.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % announcements.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [showFallback, announcements.length]);

  const slide = announcements[currentSlide] || announcements[0];
  const hasDynamicSlide = announcements.length > 0 && !!slide;
  const hasSlideContent = Boolean(
    slide?.badgeText?.trim() ||
      slide?.title?.trim() ||
      slide?.description?.trim() ||
      slide?.actionText?.trim(),
  );

  const desktopSrc = hasDynamicSlide ? getImageUrl(slide.coverDesktopId) : "";
  const tabletSrc =
    hasDynamicSlide && slide.coverTabletId
      ? getImageUrl(slide.coverTabletId)
      : desktopSrc;
  const mobileSrc =
    hasDynamicSlide && slide.coverMobileId
      ? getImageUrl(slide.coverMobileId)
      : tabletSrc;

  const hasTabletImage = Boolean(
    !showFallback && hasDynamicSlide && slide.coverTabletId,
  );

  const heightClasses = hasTabletImage
    ? "aspect-square sm:aspect-[4/3] lg:aspect-[1440/632]"
    : "aspect-square sm:aspect-[1440/632]";

  return (
    <section
      className={`relative w-full ${heightClasses} bg-[#14201d] text-white overflow-hidden`}
    >
      {/* 1. Camada dos Banners Dinâmicos (por baixo, aparece com crossfade após 5s) */}
      {hasDynamicSlide && desktopSrc && (
        <div
          className={`absolute inset-0 z-10 transition-opacity duration-1000 ease-in-out ${
            showFallback ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="absolute inset-0 z-0">
            {!hasSlideContent && slide.actionUrl ? (
              <Link
                href={slide.actionUrl}
                aria-label="Acessar destaque"
                className="block w-full h-full"
              >
                <picture className="block w-full h-full">
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
              </Link>
            ) : (
              <picture className="block w-full h-full">
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
            )}
          </div>

          {hasSlideContent && (
            <>
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent md:w-3/4 lg:w-3/5" />
              <div className="absolute inset-0 z-0 bg-black/15" />

              <div className="relative z-10 max-w-7xl mx-auto h-full px-6 md:px-12 flex flex-col justify-center">
                <div className="max-w-xl md:max-w-md py-12">
                  {slide.badgeText && (
                    <div className="flex items-center gap-2 text-[#d4a359] text-sm font-semibold uppercase tracking-[0.25em] mb-4">
                      <span className="h-px w-8 bg-[#d4a359]/60 inline-block" />
                      <span>{slide.badgeText}</span>
                    </div>
                  )}

                  {slide.title && (
                    <h1 className="text-4xl md:text-6xl font-serif font-semibold text-[#fbf5eb] tracking-tight leading-[1.1] mb-5 drop-shadow-md">
                      {slide.title}
                    </h1>
                  )}

                  {slide.description && (
                    <p className="text-base md:text-lg text-[#e6ded1] font-sans mb-8 leading-relaxed max-w-lg drop-shadow">
                      {slide.description}
                    </p>
                  )}

                  {slide.actionText && (
                    <div>
                      <Link
                        href={slide.actionUrl || "#"}
                        className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#c69247] hover:bg-[#b07d35] text-[#14201d] border border-[#D6A64A]/40 font-semibold text-sm transition-all shadow-md hover:shadow-lg"
                      >
                        {slide.actionText}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 2. Camada do Banner de Fallback (sem botão, desaparece suavemente após 5s) */}
      <div
        aria-hidden={hasDynamicSlide && !showFallback}
        className={`absolute inset-0 z-20 transition-opacity duration-1000 ease-in-out ${
          hasDynamicSlide && !showFallback
            ? "opacity-0 pointer-events-none"
            : "opacity-100"
        }`}
      >
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

        <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent md:w-3/4 lg:w-3/5" />
        <div className="absolute inset-0 z-0 bg-black/15" />
      </div>

      {/* Indicadores de Slide (Apenas após a saída do fallback e com múltiplos anúncios) */}
      {!showFallback && announcements.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {announcements.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide
                  ? "w-6 bg-[#d4a359]"
                  : "w-2 bg-white/40 hover:bg-white/80"
              }`}
              aria-label={`Ir para slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
