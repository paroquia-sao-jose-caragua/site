import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AdventCalloutSectionProps {
  href?: string;
}

export function AdventCalloutSection({
  href = "/advento",
}: AdventCalloutSectionProps) {
  return (
    <section
      aria-labelledby="advent-cta-heading"
      className="relative overflow-hidden bg-[#fbf6ee] py-16 md:py-24"
    >
      {/* Decorative 4-corner pine & gold frame backgrounds */}
      {/* Top Left */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-0 left-0 w-32 sm:w-48 md:w-64 lg:w-80 xl:w-96 aspect-[520/512] opacity-85"
      >
        <Image
          src="/destaques/advento/moldura-topo-esquerda.png"
          alt=""
          fill
          sizes="(max-width: 640px) 128px, (max-width: 1024px) 256px, 384px"
          className="object-contain object-left-top"
        />
      </div>

      {/* Top Right */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-0 right-0 w-32 sm:w-48 md:w-64 lg:w-80 xl:w-96 aspect-[520/512] opacity-85"
      >
        <Image
          src="/destaques/advento/moldura-topo-direita.png"
          alt=""
          fill
          sizes="(max-width: 640px) 128px, (max-width: 1024px) 256px, 384px"
          className="object-contain object-right-top"
        />
      </div>

      {/* Bottom Left */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-0 left-0 w-28 sm:w-44 md:w-56 lg:w-72 xl:w-84 aspect-[520/512] opacity-80"
      >
        <Image
          src="/destaques/advento/moldura-base-esquerda.png"
          alt=""
          fill
          sizes="(max-width: 640px) 112px, (max-width: 1024px) 224px, 336px"
          className="object-contain object-left-bottom"
        />
      </div>

      {/* Bottom Right */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-0 right-0 w-28 sm:w-44 md:w-56 lg:w-72 xl:w-84 aspect-[520/512] opacity-80"
      >
        <Image
          src="/destaques/advento/moldura-base-direita.png"
          alt=""
          fill
          sizes="(max-width: 640px) 112px, (max-width: 1024px) 224px, 336px"
          className="object-contain object-right-bottom"
        />
      </div>

      {/* Main Centered Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
        {/* Identificação superior */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3">
          <span className="h-px w-10 sm:w-16 bg-[#B8872E]/50" />
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#B8872E]">
            TEMPO DO ADVENTO
          </span>
          <span className="h-px w-10 sm:w-16 bg-[#B8872E]/50" />
        </div>

        {/* Título principal */}
        <h2
          id="advent-cta-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#18351E] leading-[1.15] mb-4 max-w-2xl"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Prepare o seu coração.<br/>Jesus está chegando!
        </h2>

        {/* Texto descritivo */}
        <p className="text-base sm:text-lg text-[#5A463B] font-serif leading-relaxed max-w-2xl mb-10">
          O Advento é um tempo de espera e esperança, um convite para preparar o
          coração e renovar nossa fé na chegada de Jesus.
        </p>

        {/* Imagem centralizada */}
        <div className="group/img relative aspect-[16/9] md:aspect-[8/3] w-full max-w-4xl overflow-hidden rounded-3xl border border-[#D6A64A]/45 shadow-md mb-10">
          {/* Mobile */}
          <Image
            src="/destaques/advento/coroa-do-advento.png"
            alt="Coroa do Advento com velas acesas"
            fill
            sizes="(max-width: 767px) 100vw, 1px"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover/img:scale-[1.03] md:hidden"
          />
          {/* Desktop */}
          <Image
            src="/destaques/advento/coroa-do-advento-desktop.png"
            alt="Coroa do Advento com velas acesas"
            fill
            sizes="(min-width: 768px) 896px, 1px"
            className="hidden md:block object-cover object-center transition-transform duration-700 ease-out group-hover/img:scale-[1.03]"
          />
        </div>

        {/* Botão CTA flanqueado por linhas douradas + Texto complementar */}
        <div className="flex flex-col items-center gap-3.5 w-full">
          <div className="flex items-center justify-center gap-4 sm:gap-6 w-full max-w-xl">
            <span
              aria-hidden="true"
              className="hidden sm:block h-px flex-1 bg-[#B8872E]/40"
            />
            <Link
              href={href}
              className="group/btn inline-flex items-center justify-center gap-2.5 rounded-full bg-[#18351E] hover:bg-[#27442A] active:bg-[#122917] border border-[#D6A64A]/60 text-[#eeca94] font-semibold text-sm sm:text-base px-8 py-3.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8872E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbf6ee]"
            >
              <span>Conheça o Advento</span>
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

          <p className="text-sm text-[#8c7b6c] font-serif italic">
            Viva este tempo de fé e preparação conosco.
          </p>
        </div>
      </div>
    </section>
  );
}
