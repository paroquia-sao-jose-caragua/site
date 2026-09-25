"use client";

import Link from "next/link";
import { Church, MapPin, ChevronRight, Sparkles, Phone, Clock } from "lucide-react";
import { CrossIcon } from "@/components/icons/CrossIcon";
import { useCommunities } from "@/lib/api/communities/use-communities";
import { apiBaseUrl } from "@/lib/api/utils/api";

function LiturgicalConnector({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center my-6 md:my-8" aria-hidden="true">
      <div className="h-6 md:h-10 w-px bg-gradient-to-b from-[#B8872E]/30 via-[#B8872E] to-[#B8872E]" />
      <div className="my-1.5 px-3.5 py-1 rounded-full bg-[#fbf5eb] border border-[#D6A64A]/50 shadow-xs flex items-center gap-2 text-[11px] font-semibold tracking-widest uppercase text-[#8c6218]">
        <CrossIcon width={8} height={14} fill="#B8872E" />
        <span>{label}</span>
        <CrossIcon width={8} height={14} fill="#B8872E" />
      </div>
      <div className="h-6 md:h-10 w-px bg-gradient-to-b from-[#B8872E] via-[#B8872E] to-[#B8872E]/30" />
    </div>
  );
}

export default function CommunitiesIndexPage() {
  const { communities, isPending } = useCommunities();

  const getImageUrl = (coverUrl?: string, coverId?: string) => {
    if (coverUrl) return coverUrl;
    if (!coverId) return "/pastoral-center.png";
    if (
      coverId.startsWith("http://") ||
      coverId.startsWith("https://") ||
      coverId.startsWith("/")
    ) {
      return coverId;
    }
    return `${apiBaseUrl}/attachments/${coverId}`;
  };

  const matriz =
    communities?.find(
      (c) => c.type === "parish_church" || c.name.toLowerCase().includes("matriz"),
    ) || communities?.[0];

  const chapels = communities?.filter((c) => c.id !== matriz?.id) || [];

  return (
    <main className="relative w-full min-h-screen bg-[#fbf6ee] overflow-hidden pt-8 pb-24 md:pb-36">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#8c7b6c] mb-6 flex items-center gap-2 font-medium">
          <Link href="/" className="hover:text-[#2d261e] transition-colors">
            Início
          </Link>
          <span>&gt;</span>
          <span className="text-[#2d261e]">Comunidades</span>
        </nav>

        {/* Page Header (alinhado à esquerda seguindo o padrão de Liturgia, Clérigos e Quero Contribuir) */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a6824b] uppercase tracking-widest mb-2">
            <Church className="w-4 h-4" />
            <span>COMUNIDADES PAROQUIAIS</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#18351E]">
            Nossas Comunidades de Fé
          </h1>
          <p className="text-sm md:text-base text-[#6b5c4d] mt-2 max-w-2xl leading-relaxed">
            A Paróquia São José é composta pela Igreja Matriz — sede pastoral e administrativa — e pelas capelas e comunidades presentes nos bairros de Caraguatatuba, unidas sob o mesmo pastoreio.
          </p>
        </div>

        {/* Content */}
        {isPending ? (
          <div className="space-y-8 w-full">
            {/* Skeleton Matriz */}
            <div className="w-full bg-[#fbf5eb] border border-[#D6A64A]/30 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 animate-pulse">
              <div className="w-full sm:w-64 h-56 rounded-2xl bg-zinc-200/60 shrink-0" />
              <div className="flex-1 space-y-3 w-full">
                <div className="h-4 w-32 bg-zinc-200/60 rounded" />
                <div className="h-8 w-60 bg-zinc-200/60 rounded" />
                <div className="h-4 w-80 bg-zinc-200/60 rounded" />
              </div>
            </div>

            {/* Skeleton Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-[#fbf5eb] border border-[#D6A64A]/30 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-5 animate-pulse"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-zinc-200/60 shrink-0" />
                  <div className="flex-1 space-y-2 w-full">
                    <div className="h-3 w-20 bg-zinc-200/60 rounded" />
                    <div className="h-5 w-40 bg-zinc-200/60 rounded" />
                    <div className="h-3 w-48 bg-zinc-200/60 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !communities || communities.length === 0 ? (
          <div className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-2xl p-12 text-center text-[#736254] max-w-md mx-auto">
            Nenhuma comunidade cadastrada no momento.
          </div>
        ) : (
          <div className="w-full space-y-4">
            {/* ============================================================== */}
            {/* NÍVEL 1: IGREJA MATRIZ — SEDE PAROQUIAL E ADMINISTRATIVA       */}
            {/* ============================================================== */}
            {matriz && (
              <section aria-labelledby="matriz-section-heading" className="w-full">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="size-9 rounded-xl bg-[#ECD6BD]/50 border border-[#D6A64A]/50 flex items-center justify-center text-[#B8872E] shadow-2xs shrink-0">
                      <Church className="w-4.5 h-4.5" />
                    </div>
                    <h2
                      id="matriz-section-heading"
                      className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[#18351E]"
                    >
                      Sede Paroquial e Administrativa
                    </h2>
                  </div>
                  <p className="text-sm md:text-base text-[#6b5c4d] font-serif max-w-3xl leading-relaxed">
                    A Igreja Matriz é o coração da vida paroquial. Nela reside o Pároco, funciona a Secretaria Paroquial central e concentram-se as principais celebrações e decisões administrativas que coordenam todas as comunidades do território.
                  </p>
                </div>

                <div className="w-full bg-[#fbf5eb] border border-[#D6A64A]/50 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1 w-full">
                    {/* Foto da Matriz */}
                    <div className="w-full sm:w-60 md:w-80 h-56 sm:h-64 lg:h-auto shrink-0 rounded-2xl overflow-hidden bg-[#f3ece0] border border-[#D6A64A]/30">
                      <img
                        src={getImageUrl(matriz.coverUrl, matriz.coverId)}
                        alt={matriz.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Informações da Matriz */}
                    <div className="flex-1 text-center sm:text-left flex flex-col justify-between py-1">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#18351E] text-[#eeca94] text-xs font-semibold uppercase tracking-wider mb-2 w-fit mx-auto sm:mx-0">
                          <Sparkles className="w-3 h-3" />
                          <span>IGREJA MATRIZ</span>
                        </div>

                        <h3
                          id="matriz-heading"
                          className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#18351E] mb-2"
                          style={{ fontFamily: "Cormorant Garamond, serif" }}
                        >
                          {matriz.name.toLowerCase().startsWith("igreja") || matriz.name.toLowerCase().startsWith("matriz")
                            ? matriz.name
                            : `Igreja Matriz ${matriz.name}`}
                        </h3>

                        {matriz.address && (
                          <div className="flex items-center gap-1.5 text-xs md:text-sm text-[#736254] font-serif mb-3 justify-center sm:justify-start">
                            <MapPin className="w-4 h-4 text-[#B8872E] shrink-0" />
                            <span>{matriz.address}</span>
                          </div>
                        )}

                        {matriz.heroSubtitle && (
                          <p className="text-sm md:text-base text-[#8c6218] font-serif italic max-w-2xl mb-4">
                            &ldquo;{matriz.heroSubtitle}&rdquo;
                          </p>
                        )}
                      </div>

                      {/* Dados de Contato e Secretaria */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#5A463B] pt-2 border-t border-[#D6A64A]/20">
                        <span className="text-xs text-[#736254] font-serif">
                          {matriz.patronName ? `Padroeiro(a): ${matriz.patronName}` : "Administrada pela Matriz"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botão de Ação */}
                  <div className="shrink-0 flex items-center justify-center lg:justify-end w-full lg:w-auto pt-2 lg:pt-0">
                    <Link
                      href={`/comunidades/${matriz.slug}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#18351E] text-[#eeca94] hover:bg-[#27442A] text-sm font-semibold transition-all shadow-xs group"
                    >
                      <span>Conheça a Matriz</span>
                      <ChevronRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {/* CONECTOR LITÚRGICO ENTRE A MATRIZ E AS CAPELAS */}
            {matriz && chapels.length > 0 && (
              <LiturgicalConnector label="Comunhão e Cuidado Pastoral" />
            )}

            {/* ============================================================== */}
            {/* NÍVEL 2: CAPELAS E COMUNIDADES NOS BAIRROS                     */}
            {/* ============================================================== */}
            {chapels.length > 0 && (
              <section aria-labelledby="chapels-section-heading" className="w-full">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="size-9 rounded-xl bg-[#ECD6BD]/50 border border-[#D6A64A]/50 flex items-center justify-center text-[#B8872E] shadow-2xs shrink-0">
                      <Sparkles className="w-4.5 h-4.5" />
                    </div>
                    <h2
                      id="chapels-section-heading"
                      className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[#18351E]"
                    >
                      Capelas e Comunidades nos Bairros
                    </h2>
                  </div>
                  <p className="text-sm md:text-base text-[#6b5c4d] font-serif max-w-3xl leading-relaxed">
                    As capelas são os braços missionários da Paróquia São José nos bairros. Todas estão sob a responsabilidade pastoral do Pároco e compartilham a administração sacramental e canônica da Matriz, acolhendo os fiéis locais com celebrações, catequese e caridade.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  {chapels.map((community) => {
                    const cover = getImageUrl(community.coverUrl, community.coverId);

                    return (
                      <div
                        key={community.id}
                        className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                          {/* Foto da Capela */}
                          <div className="w-full sm:w-28 sm:h-28 md:w-32 md:h-32 shrink-0 h-40 rounded-2xl overflow-hidden border border-[#D6A64A]/30 bg-[#f3ece0]">
                            <img
                              src={cover}
                              alt={community.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Textos da Capela */}
                          <div className="flex-1 text-center sm:text-left">
                            <span className="inline-block text-[11px] font-bold text-[#B8872E] uppercase tracking-wider mb-1">
                              CAPELA PAROQUIAL
                            </span>

                            <h3
                              className="text-2xl font-semibold text-[#18351E] mb-1"
                              style={{ fontFamily: "Cormorant Garamond, serif" }}
                            >
                              {community.name.toLowerCase().startsWith("capela") || community.name.toLowerCase().startsWith("comunidade")
                                ? community.name
                                : `Capela ${community.name}`}
                            </h3>

                            {community.address && (
                              <p className="text-xs text-[#736254] font-serif flex items-center gap-1 justify-center sm:justify-start mb-2 line-clamp-1">
                                <MapPin className="w-3.5 h-3.5 text-[#B8872E] shrink-0" />
                                <span>{community.address.split("-")[1]?.trim() || community.address}</span>
                              </p>
                            )}

                            {community.heroSubtitle && (
                              <p className="text-xs md:text-sm text-[#8c6218] font-serif italic line-clamp-2 leading-relaxed">
                                &ldquo;{community.heroSubtitle}&rdquo;
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Botão de ação */}
                        <div className="mt-5 pt-4 border-t border-[#D6A64A]/20 flex items-center justify-between">
                          <span className="text-xs text-[#736254] font-serif">
                            {community.patronName ? `Padroeiro(a): ${community.patronName}` : "Administrada pela Matriz"}
                          </span>
                          <Link
                            href={`/comunidades/${community.slug}`}
                            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#18351E] text-[#eeca94] hover:bg-[#27442A] text-xs font-semibold transition-all shadow-xs group"
                          >
                            <span>Conheça</span>
                            <ChevronRight
                              size={14}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Onda decorativa inferior */}
      <div
        className="
          absolute
          bottom-[-2px]
          left-0
          w-[calc(100%+4cm)]
          max-w-none
          ml-[-2cm]
          aspect-[1536/296]
          bg-[url('/wave-separator.svg')]
          bg-no-repeat
          bg-center
          bg-cover
          pointer-events-none
        "
      />
    </main>
  );
}
