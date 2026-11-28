"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HIGHLIGHTS_SLIDES } from "./highlightsData";
import { SlideRenderer } from "./SlideRenderer";
import type { HighlightSlideConfig } from "./types";

const AUTOPLAY_INTERVAL_MS = 7000;

interface HighlightsCarouselProps {
  slides?: HighlightSlideConfig[];
}

export function HighlightsCarousel({
  slides = HIGHLIGHTS_SLIDES,
}: HighlightsCarouselProps) {
  const totalSlides = slides.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Respect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const goToIndex = useCallback(
    (nextIdx: number, dir?: "next" | "prev") => {
      if (totalSlides <= 1) return;
      const normalized = (nextIdx + totalSlides) % totalSlides;
      setDirection(dir ?? (normalized > activeIndex ? "next" : "prev"));
      setActiveIndex(normalized);
    },
    [activeIndex, totalSlides]
  );

  const handleNext = useCallback(() => {
    goToIndex(activeIndex + 1, "next");
  }, [activeIndex, goToIndex]);

  const handlePrev = useCallback(() => {
    goToIndex(activeIndex - 1, "prev");
  }, [activeIndex, goToIndex]);

  // Autoplay every 7s; pauses on hover, focus, touch, or prefers-reduced-motion
  useEffect(() => {
    if (
      totalSlides <= 1 ||
      isHovered ||
      isFocused ||
      isTouching ||
      prefersReducedMotion
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setDirection("next");
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, AUTOPLAY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [
    totalSlides,
    isHovered,
    isFocused,
    isTouching,
    prefersReducedMotion,
    activeIndex,
  ]);

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    if (totalSlides <= 1) return;
    const touch = e.touches[0];
    if (!touch) return;
    setIsTouching(true);
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    setIsTouching(false);
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || totalSlides <= 1) return;

    const touch = e.changedTouches[0];
    if (!touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    // Trigger slide change only on intentional horizontal swipe
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Keyboard navigation (Left / Right arrows when focused inside carousel)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    }
  };

  if (totalSlides === 0) return null;

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Destaques da Paróquia"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => {
        setIsTouching(false);
        touchStartRef.current = null;
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(e) => {
        if (!sectionRef.current?.contains(e.relatedTarget as Node | null)) {
          setIsFocused(false);
        }
      }}
      className="relative w-full min-[950px]:min-h-[calc(100svh-73px)] flex flex-col overflow-hidden touch-pan-y border-b border-[#e8dfd1]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B8872E]"
    >
      {/* Smooth crossfading background layers per slide */}
      {slides.map((slide, idx) => (
        <div
          key={`bg-${slide.id}`}
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 ${slide.backgroundClass} ${
            prefersReducedMotion
              ? ""
              : "transition-opacity duration-700 ease-in-out"
          } ${idx === activeIndex ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      {/* Grid stack: all slides occupy [grid-area:1/1] to prevent layout height jumps */}
      <div className="relative z-10 grid w-full flex-1" aria-live="polite">
        {slides.map((slide, idx) => {
          const isActive = idx === activeIndex;
          const inactiveTranslate =
            direction === "next" ? "-translate-x-4" : "translate-x-4";

          const motionClasses = prefersReducedMotion
            ? isActive
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
            : isActive
              ? "opacity-100 translate-x-0 transition-all duration-500 ease-out"
              : `opacity-0 ${inactiveTranslate} pointer-events-none transition-all duration-500 ease-in`;

          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${idx + 1} de ${totalSlides} — ${slide.ariaLabel}`}
              aria-hidden={!isActive}
              className={`[grid-area:1/1] w-full ${motionClasses}`}
            >
              <SlideRenderer
                slide={slide}
                isActive={isActive}
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>
          );
        })}
      </div>

      {/* Desktop side navigation arrows */}
      {totalSlides > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Destaque anterior"
            className="hidden md:flex items-center justify-center absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-30 size-10 lg:size-11 rounded-full bg-[#fbf6ee]/75 hover:bg-[#f2e8d7] text-[#8c7b6c] hover:text-[#B8872E] backdrop-blur-xs transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A64A]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Próximo destaque"
            className="hidden md:flex items-center justify-center absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 size-10 lg:size-11 rounded-full bg-[#fbf6ee]/75 hover:bg-[#f2e8d7] text-[#8c7b6c] hover:text-[#B8872E] backdrop-blur-xs transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A64A]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Discreet borderless dots in soft tones close to background */}
          <div
            role="tablist"
            aria-label="Selecionar destaque"
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2"
          >
            {slides.map((slide, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={`dot-${slide.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Ir para ${slide.ariaLabel}`}
                  onClick={() => goToIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A64A] ${
                    isActive
                      ? "w-7 bg-[#D6B882]"
                      : "w-2 bg-[#E5D8C3] hover:bg-[#D6B882]/80"
                  }`}
                />
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
