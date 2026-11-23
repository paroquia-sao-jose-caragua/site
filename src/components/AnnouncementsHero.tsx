"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { listActiveAnnouncements } from "@/lib/api/announcements/listActive";
import { apiBaseUrl } from "@/lib/api/utils/api";
import type { Announcement } from "@/entities/Announcement";

const SLIDE_INTERVAL_MS = 15000;
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

  const { data, isPending } = useQuery({
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

  useEffect(() => {
    if (announcements.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % announcements.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const isLoadingWithoutCache = isPending && cachedAnnouncements === null;

  if (isLoadingWithoutCache) {
    return (
      <section
        aria-label="Carregando destaques"
        className="relative w-full aspect-square sm:aspect-auto sm:h-[480px] md:h-[560px] lg:h-[632px] bg-[#f4ebe0] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#f3e9db] via-[#efe3d3] to-[#fbf6ee] animate-pulse" />
      </section>
    );
  }

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

  return (
    <section
      className={`relative w-full aspect-square sm:aspect-auto sm:h-[480px] md:h-[560px] lg:h-[632px] overflow-hidden ${
        hasDynamicSlide ? "bg-[#f4ebe0] text-white" : "bg-[#18351E] text-white"
      }`}
    >
      {/* Imagem Dinâmica da API */}
      {hasDynamicSlide && desktopSrc && (
        <div className="absolute inset-0 z-0 transition-opacity duration-500">
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
      )}

      {/* Overlay gradiente suave para contraste e legibilidade (apenas quando houver texto sobreposto) */}
      {(!hasDynamicSlide || hasSlideContent) && (
        <>
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent md:w-3/4 lg:w-3/5" />
          <div className="absolute inset-0 z-0 bg-black/15" />
        </>
      )}

      {/* Conteúdo (Destaque da API ou Mensagem Padrão de Boas-Vindas) */}
      {(!hasDynamicSlide || hasSlideContent) && (
        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 md:px-12 flex flex-col justify-center">
          <div className="max-w-xl md:max-w-md py-12">
            {hasDynamicSlide ? (
              <>
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
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-[#d4a359] text-sm font-semibold uppercase tracking-[0.25em] mb-4">
                  <span className="h-px w-8 bg-[#d4a359]/60 inline-block" />
                  <span>MISSA DO PADROEIRO</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-serif font-semibold text-[#fbf5eb] tracking-tight leading-[1.1] mb-5 drop-shadow-md">
                  Missa em Honra a São José
                </h1>

                <p className="text-base md:text-lg text-[#e6ded1] font-sans mb-8 leading-relaxed max-w-lg drop-shadow">
                  Todo dia 19. Venha celebrar conosco na Paróquia Matriz. Traga
                  suas intenções de oração e fortaleça sua devoção ao Glorioso
                  São José.
                </p>

                <div>
                  <Link
                    href="/agenda"
                    className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#c69247] hover:bg-[#b07d35] text-[#14201d] border border-[#D6A64A]/40 font-semibold text-sm transition-all shadow-md hover:shadow-lg"
                  >
                    Ver Programação Completa
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Indicadores de Slide (Apenas se houver múltiplos anúncios) */}
      {announcements.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
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
