"use client";

import { useState } from "react";
import { ChevronRight, Church, MapPin, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCommunities } from "@/lib/api/communities/use-communities";
import { apiBaseUrl } from "@/lib/api/utils/api";
import { CommunityModal } from "./CommunityModal";
import type { Community } from "@/entities/Community";

export function OurCommunitiesSection() {
  const { communities, isPending } = useCommunities();
  const [selected, setSelected] = useState<Community | null>(null);

  const getImageUrl = (coverUrl?: string, coverId?: string) => {
    if (coverUrl) return coverUrl;
    if (!coverId) return "/pastoral-center.png";
    if (coverId.startsWith("http://") || coverId.startsWith("https://") || coverId.startsWith("/")) {
      return coverId;
    }
    return `${apiBaseUrl}/attachments/${coverId}`;
  };

  // Find Matriz / Parish Church or fallback to first
  const matriz =
    communities?.find(
      (c) => c.type === "parish_church" || c.name.toLowerCase().includes("matriz"),
    ) || communities?.[0];

  // Remaining communities for the 2x2 right grid
  const otherCommunities =
    communities?.filter((c) => c.id !== matriz?.id).slice(0, 4) || [];

  return (
    <section className="bg-[#fbf6ee] py-16 md:py-24 border-t border-[#e8dfd1]/60">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header (Centered) */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-px w-12 bg-[#B8872E]/40" />
            <div className="flex items-center gap-1.5 text-[#B8872E] text-xs font-semibold uppercase tracking-[0.3em]">
              <Sparkles className="w-3.5 h-3.5 text-[#B8872E]" />
              <span>NOSSAS COMUNIDADES</span>
              <Sparkles className="w-3.5 h-3.5 text-[#B8872E]" />
            </div>
            <span className="h-px w-12 bg-[#B8872E]/40" />
          </div>

          <h2
            className="text-3xl md:text-5xl font-semibold text-[#18351E] mb-4"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Onde nossa fé se encontra
          </h2>

          <p className="text-sm md:text-base text-[#5A463B] font-serif leading-relaxed max-w-2xl mx-auto">
            A Paróquia São José é formada por cinco comunidades, que caminham unidas na mesma fé e no mesmo propósito: servir a Deus e ao próximo.
          </p>
        </div>

        {/* Communities Layout Grid */}
        {isPending ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-[#fbf5eb] border border-[#D6A64A]/30 rounded-3xl h-[520px] animate-pulse p-6" />
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-[#fbf5eb] border border-[#D6A64A]/30 rounded-2xl h-[250px] animate-pulse p-4"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left: Matriz Featured Card */}
            {matriz && (
              <Link
                href={`/comunidades/${matriz.slug || "matriz-sao-jose"}`}
                className="lg:col-span-6 bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between text-left group cursor-pointer relative"
              >
                {/* Image Container with Badge */}
                <div className="relative h-64 md:h-72 w-full overflow-hidden bg-[#faf8f5]">
                  <img
                    src={getImageUrl(matriz.coverUrl, matriz.coverId)}
                    alt={matriz.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18351E] border border-[#D6A64A]/40 text-[#D6A64A] text-xs font-semibold tracking-wider uppercase shadow-md">
                    <span>✦ COMUNIDADE MATRIZ</span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between relative z-10">
                  <div>
                    {/* Icon + Title + Subtitle */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#faf8f5] border border-[#D6A64A]/40 flex items-center justify-center text-[#B8872E] shrink-0 mt-0.5">
                        <Church className="w-5 h-5" />
                      </div>
                      <div>
                        <h3
                          className="text-2xl md:text-3xl font-semibold text-[#18351E] leading-tight group-hover:text-[#B8872E] transition-colors"
                          style={{ fontFamily: "Cormorant Garamond, serif" }}
                        >
                          {matriz.name}
                        </h3>
                        <span className="text-[10px] font-bold text-[#B8872E] uppercase tracking-widest">
                          MATRIZ
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-[#5A463B] leading-relaxed mb-6 font-serif">
                      É na {matriz.name} que tudo começou. Aqui, nossa paróquia tem sua sede e realiza as principais celebrações e atividades pastorais.
                    </p>

                    {/* Address & Mass Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-t border-b border-[#D6A64A]/20 mb-6 text-xs text-[#5A463B]">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-[#B8872E] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-[#18351E] block mb-0.5">Endereço</span>
                          <span className="line-clamp-2">{matriz.address || "Rua Edson dos Santos, 30 — Morro do Algodão"}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 sm:border-l sm:border-[#D6A64A]/20 sm:pl-4">
                        <Calendar className="w-4 h-4 text-[#B8872E] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-[#18351E] block mb-0.5">Missas</span>
                          <span>Dom 8h, 10h e 19h | Sáb 19h30</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Button */}
                  <div>
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18351E] text-white text-xs font-semibold group-hover:bg-[#27442A] transition-all shadow-md">
                      <span>Saiba mais sobre a comunidade</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Right: 2x2 Grid for Other Communities */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherCommunities.map((item) => {
                const imageSrc = getImageUrl(item.coverUrl, item.coverId);
                return (
                  <Link
                    key={item.id}
                    href={`/comunidades/${item.slug || item.id}`}
                    className="group bg-[#fbf5eb] border border-[#D6A64A]/30 rounded-2xl p-4 flex flex-col justify-between text-left shadow-xs hover:shadow-md hover:border-[#B8872E] hover:-translate-y-1 transition-all cursor-pointer"
                  >
                    <div>
                      {/* Rectangular Image */}
                      <div className="h-36 w-full overflow-hidden rounded-xl bg-[#faf8f5] mb-3 relative">
                        <img
                          src={imageSrc}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Title */}
                      <h3
                        className="text-base font-semibold text-[#18351E] group-hover:text-[#B8872E] transition-colors leading-snug mb-2 line-clamp-2"
                        style={{ fontFamily: "Cormorant Garamond, serif" }}
                      >
                        {item.name}
                      </h3>

                      {/* Info Lines */}
                      <div className="space-y-1.5 text-xs text-[#736254] mb-3">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#B8872E] shrink-0" />
                          <span className="truncate">{item.address || "Caraguatatuba / SP"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#B8872E] shrink-0" />
                          <span className="truncate">Missas: Finais de Semana</span>
                        </div>
                      </div>
                    </div>

                    {/* Link / Button */}
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#18351E] group-hover:text-[#B8872E] transition-colors pt-2 border-t border-[#D6A64A]/20">
                      <span>Saiba mais</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Section Footer (Centered Link) */}
        <div className="mt-14 text-center">
          <div className="inline-flex items-center gap-4 max-w-md mx-auto w-full">
            <span className="h-px flex-1 bg-[#D6A64A]/40" />
            <Link
              href="/comunidades"
              className="text-xs font-bold text-[#B8872E] hover:text-[#18351E] uppercase tracking-widest flex items-center gap-1.5 transition-colors shrink-0"
            >
              <span>VER TODAS AS COMUNIDADES</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <span className="h-px flex-1 bg-[#D6A64A]/40" />
          </div>
        </div>
      </div>

      {selected && (
        <CommunityModal
          community={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
