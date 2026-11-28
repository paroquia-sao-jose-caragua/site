import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import type {
  AdventHighlightSlide,
  HighlightSlideConfig,
  MarianFeastHighlightSlide,
} from "./types";

interface SlideRendererProps {
  slide: HighlightSlideConfig;
  isActive: boolean;
  prefersReducedMotion: boolean;
}

function AdventSlideContent({
  slide,
  isActive,
  prefersReducedMotion,
}: {
  slide: AdventHighlightSlide;
  isActive: boolean;
  prefersReducedMotion: boolean;
}) {
  const imageAnimClass = prefersReducedMotion
    ? ""
    : isActive
      ? "opacity-100 scale-100 translate-y-0 transition-all duration-700 ease-out"
      : "opacity-0 scale-[0.985] translate-y-2 transition-all duration-500 ease-in";

  return (
    <div className="relative w-full h-full flex items-center pt-6 pb-11 sm:py-8 md:py-12">
      {/* Decorative 4-corner pine & gold frame backgrounds */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-0 left-0 w-32 sm:w-48 md:w-64 lg:w-80 xl:w-96 aspect-[520/512] opacity-85"
      >
        <Image
          src={slide.images.corners.topLeft}
          alt=""
          fill
          sizes="(max-width: 640px) 128px, (max-width: 1024px) 256px, 384px"
          className="object-contain object-left-top"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-0 right-0 w-32 sm:w-48 md:w-64 lg:w-80 xl:w-96 aspect-[520/512] opacity-85"
      >
        <Image
          src={slide.images.corners.topRight}
          alt=""
          fill
          sizes="(max-width: 640px) 128px, (max-width: 1024px) 256px, 384px"
          className="object-contain object-right-top"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-0 left-0 w-28 sm:w-44 md:w-56 lg:w-72 xl:w-84 aspect-[520/512] opacity-80"
      >
        <Image
          src={slide.images.corners.bottomLeft}
          alt=""
          fill
          sizes="(max-width: 640px) 112px, (max-width: 1024px) 224px, 336px"
          className="object-contain object-left-bottom"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-0 right-0 w-28 sm:w-44 md:w-56 lg:w-72 xl:w-84 aspect-[520/512] opacity-80"
      >
        <Image
          src={slide.images.corners.bottomRight}
          alt=""
          fill
          sizes="(max-width: 640px) 112px, (max-width: 1024px) 224px, 336px"
          className="object-contain object-right-bottom"
        />
      </div>

      {/* Main Centered Content (preserved exactly from Advent section) */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
        {/* Identificação superior */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3">
          <span className="h-px w-10 sm:w-16 bg-[#B8872E]/50" />
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#B8872E]">
            {slide.eyebrow}
          </span>
          <span className="h-px w-10 sm:w-16 bg-[#B8872E]/50" />
        </div>

        {/* Título principal */}
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#18351E] leading-[1.15] mb-4 max-w-2xl"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          {slide.titleLines[0]}
          <br />
          {slide.titleLines[1]}
        </h2>

        {/* Texto descritivo */}
        <p className="text-base sm:text-lg text-[#5A463B] font-serif leading-relaxed max-w-2xl mb-10">
          {slide.description}
        </p>

        {/* Imagem centralizada */}
        <div
          className={`group/img relative aspect-[3/2] md:aspect-[8/3] w-full max-w-4xl overflow-hidden rounded-3xl border border-[#D6A64A]/45 shadow-md mb-7 ${imageAnimClass}`}
        >
          <Image
            src={slide.images.mobileSrc}
            alt={slide.images.alt}
            fill
            priority={isActive}
            sizes="(max-width: 767px) 100vw, 1px"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover/img:scale-[1.03] md:hidden"
          />
          <Image
            src={slide.images.desktopSrc}
            alt={slide.images.alt}
            fill
            priority={isActive}
            sizes="(min-width: 768px) 896px, 1px"
            className="hidden md:block object-cover object-center transition-transform duration-700 ease-out group-hover/img:scale-[1.03]"
          />
        </div>

        {/* Botão CTA flanqueado por linhas douradas + Texto complementar */}
        <div className="flex flex-col items-center gap-7 w-full">
          <p className="text-lg text-[#8c7b6c] font-serif italic">
            {slide.complementaryText}
          </p>

          <div className="flex items-center justify-center gap-4 sm:gap-6 w-full max-w-xl">
            <span
              aria-hidden="true"
              className="hidden sm:block h-px flex-1 bg-[#B8872E]/40"
            />
            <Link
              href={slide.cta.href}
              tabIndex={isActive ? 0 : -1}
              className="group/btn inline-flex items-center justify-center gap-2.5 rounded-full bg-[#18351E] hover:bg-[#27442A] active:bg-[#122917] border border-[#D6A64A]/60 text-[#eeca94] font-semibold text-sm sm:text-base px-8 py-3.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8872E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbf6ee]"
            >
              <span>{slide.cta.label}</span>
              <ArrowRight
                aria-hidden="true"
                className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1"
              />
            </Link>
            <span
              aria-hidden="true"
              className="hidden sm:block h-px flex-1 bg-[#B8872E]/40"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MarianFeastSlideContent({
  slide,
  isActive,
  prefersReducedMotion,
}: {
  slide: MarianFeastHighlightSlide;
  isActive: boolean;
  prefersReducedMotion: boolean;
}) {
  const imageAnimClass = prefersReducedMotion
    ? ""
    : isActive
      ? "opacity-100 scale-100 translate-y-0 transition-all duration-700 ease-out"
      : "opacity-0 scale-[0.985] translate-y-3 transition-all duration-500 ease-in";

  return (
    <div className="relative w-full h-full flex items-stretch">
      {/* Subtle golden ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -top-20 left-[12%] h-80 w-80 rounded-full bg-[#D6A64A]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-0 right-[10%] h-72 w-72 rounded-full bg-[#B8872E]/10 blur-3xl"
      />
      {/* Delicate golden ornamental corner hairlines */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none hidden lg:block absolute top-6 right-6 w-16 h-16 border-t border-r border-[#D6A64A]/40 rounded-tr-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none select-none hidden lg:block absolute bottom-6 right-6 w-16 h-16 border-b border-r border-[#D6A64A]/40 rounded-br-2xl"
      />

      {/* Desktop: Large transparent image anchored flush to the bottom-left of the section */}
      <div
        aria-hidden="true"
        className={`pointer-events-none select-none hidden lg:block absolute bottom-0 left-0 z-10 w-[48%] xl:w-[46%] max-w-[680px] h-[98%] ${imageAnimClass}`}
      >
        <Image
          src={slide.image.src}
          alt={slide.image.alt}
          fill
          sizes="(min-width: 1280px) 680px, (min-width: 1024px) 48vw, 1px"
          className="object-contain object-left-bottom"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col lg:grid lg:grid-cols-12 lg:items-center">
        {/* Left spacer on desktop (occupied by the bottom-left flush image) */}
        <div className="hidden lg:block lg:col-span-5" />

        {/* Right Column: Left-Aligned Textual Content */}
        <div className="lg:col-span-7 flex flex-col items-start text-left pt-6 pb-11 sm:py-8 lg:py-12 lg:pl-8 xl:pl-12">
          {/* 1. Identificação pequena */}
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-10 sm:w-12 bg-[#B8872E]/60" />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#B8872E]">
              {slide.eyebrow}
            </span>
          </div>

          {/* 2. Título principal */}
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold text-[#18351E] leading-[1.12] mb-5"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {slide.title}
          </h2>

          {/* 3. Texto introdutório */}
          <p className="text-lg text-[#5A463B] font-serif leading-relaxed max-w-xl mb-4 lg:mb-6">
            {slide.mobileDescription ? (
              <>
                <span className="lg:hidden">{slide.mobileDescription}</span>
                <span className="hidden lg:inline">{slide.description}</span>
              </>
            ) : (
              slide.description
            )}
          </p>

          {/* Mobile / Tablet: Standardized 3/2 framed image right below description */}
          <div
            className={`lg:hidden relative aspect-[3/2] w-full overflow-hidden rounded-3xl border border-[#D6A64A]/45 bg-gradient-to-b from-[#f6ecdb] via-[#fbf5eb] to-[#f1e4ce] shadow-md mb-6 ${imageAnimClass}`}
          >
            <Image
              src={slide.image.src}
              alt={slide.image.alt}
              fill
              sizes="(max-width: 1023px) 100vw, 1px"
              className="object-contain object-bottom pt-2"
            />
          </div>

          {/* 4. Bloco de datas */}
          <div className="relative z-20 w-full max-w-lg rounded-2xl border border-[#D6A64A]/45 bg-[#fbf5eb]/95 shadow-xs px-5 py-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-left">
              {slide.scheduleDates.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-2.5 sm:first:border-r sm:first:border-[#D6A64A]/30 sm:first:pr-4"
                >
                  <CalendarDays
                    aria-hidden="true"
                    className="w-4 h-4 text-[#B8872E] shrink-0 mt-1"
                  />
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#B8872E]">
                      {item.label}
                    </span>
                    <span className="block text-sm sm:text-base font-semibold text-[#18351E] mt-0.5">
                      {item.dates}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Invocação mariana em itálico */}
          <p className="text-lg text-[#8c6218] font-serif italic mb-7">
            {slide.invocation}
          </p>

          {/* 6. Botão de acesso à programação */}
          <Link
            href={slide.cta.href}
            tabIndex={isActive ? 0 : -1}
            className="group/btn inline-flex items-center justify-center gap-2.5 rounded-full bg-[#18351E] hover:bg-[#27442A] active:bg-[#122917] border border-[#D6A64A]/60 text-[#eeca94] font-semibold text-sm sm:text-base px-8 py-3.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8872E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbf6ee]"
          >
            <span>{slide.cta.label}</span>
            <ArrowRight
              aria-hidden="true"
              className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SlideRenderer({
  slide,
  isActive,
  prefersReducedMotion,
}: SlideRendererProps) {
  if (slide.layout === "advent") {
    return (
      <AdventSlideContent
        slide={slide}
        isActive={isActive}
        prefersReducedMotion={prefersReducedMotion}
      />
    );
  }

  return (
    <MarianFeastSlideContent
      slide={slide}
      isActive={isActive}
      prefersReducedMotion={prefersReducedMotion}
    />
  );
}
