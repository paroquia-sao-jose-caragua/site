"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft, Sparkles, BookOpen, MessageCircle } from "lucide-react";
import { CrossIcon } from "@/components/icons/CrossIcon";
import { useClergyBySlug } from "@/lib/api/clergy/use-clergy-by-slug";
import { getClergyPhotoUrl, getClergyRoleLabel } from "@/lib/utils/clergy";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ClergyDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const { member, otherClergy, isPending } = useClergyBySlug(slug);

  const getMinistryJurisdiction = (position?: string) => {
    switch (position) {
      case "parish_priest":
      case "permanent_deacon":
      case "vicar":
        return "Paróquia São José • Caraguatatuba";
      case "diocesan_bishop":
        return "Diocese de Caraguatatuba • SP";
      case "supreme_pontiff":
        return "Santa Sé • Cidade do Vaticano";
      default:
        return "Paróquia São José de Caraguatatuba";
    }
  };

  const getClergyHierarchyDesc = (position?: string) => {
    switch (position) {
      case "supreme_pontiff":
        return "O Santo Padre é o Sucessor de Pedro e princípio visível de unidade e comunhão de toda a Igreja Católica Universal.";
      case "diocesan_bishop":
        return "O Bispo Diocesano é o pastor próprio e sucessor dos Apóstolos à frente da Diocese de Caraguatatuba.";
      case "parish_priest":
        return "O Pároco é o pastor próprio designado para pastorear e coordenar a vida litúrgica e pastoral da Paróquia São José.";
      default:
        return "Colaborador sagrado dedicado ao serviço litúrgico do altar, à palavra de Deus e às obras pastorais de caridade.";
    }
  };

  const bioParagraphs = member?.bio
    ? member.bio.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : [];

  const role = member
    ? getClergyRoleLabel(member.position, member.roleName, member.title)
    : "";

  return (
    <main className="relative w-full min-h-screen bg-[#fbf6ee] overflow-hidden pt-8 pb-24 md:pb-36">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="text-sm text-[#8c7b6c] mb-8 flex items-center gap-2 font-medium flex-wrap">
          <Link href="/" className="hover:text-[#2d261e] transition-colors">
            Início
          </Link>
          <span>&gt;</span>
          <Link href="/clerigos" className="hover:text-[#2d261e] transition-colors">
            Clérigos
          </Link>
          <span>&gt;</span>
          <span className="text-[#2d261e] font-semibold">
            {member ? member.name : "Carregando..."}
          </span>
        </nav>

        {isPending ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-pulse mb-16">
              <div className="lg:col-span-7 space-y-4">
                <div className="h-6 w-32 bg-zinc-200/60 rounded-full" />
                <div className="h-12 w-3/4 bg-zinc-200/60 rounded" />
                <div className="h-6 w-1/2 bg-zinc-200/60 rounded" />
                <div className="hidden sm:block h-10 w-44 bg-zinc-200/60 rounded-full pt-4" />
              </div>
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="aspect-[3/4] w-full max-w-sm bg-zinc-200/60 rounded-3xl" />
              </div>
            </div>
          </div>
        ) : !member ? (
          <div className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-3xl p-12 text-center max-w-xl mx-auto my-12 shadow-sm">
            <h2
              className="text-3xl font-semibold text-[#18351E] mb-3"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Clérigo não encontrado
            </h2>
            <p className="text-sm text-[#736254] mb-6">
              O membro do clero solicitado não foi localizado ou o endereço pode ter sido alterado.
            </p>
            <Link
              href="/clerigos"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#18351E] text-[#eeca94] text-sm font-semibold hover:bg-[#27442A] transition-colors shadow-xs"
            >
              <ArrowLeft size={16} />
              <span>Voltar para a lista de clérigos</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-16 md:space-y-20">
            {/* 1. HERO HEADER (estilo Comunidades: Título à esquerda, Foto à direita) */}
            <div className="gap-0 grid grid-cols-1 lg:grid-cols-12 sm:gap-8 lg:gap-12 items-center">
              {/* Esquerda: Informações do Clérigo */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fbf5eb] border border-[#D6A64A]/40 text-[#B8872E] text-sm font-semibold tracking-widest uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-[#B8872E]" />
                  <span>{role}</span>
                </div>

                <h1
                  className="text-4xl md:text-6xl font-semibold text-[#18351E] leading-tight"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {member.name}
                </h1>

                {member.shortIntro && (
                  <p className="text-base md:text-lg text-[#5A463B] font-serif leading-relaxed max-w-xl">
                    &ldquo;{member.shortIntro}&rdquo;
                  </p>
                )}

                <div className="hidden sm:flex flex-wrap items-center gap-4 pt-3">
                  <a
                    href="#biografia"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18351E] text-white text-sm font-semibold hover:bg-[#27442A] transition-all shadow-md cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-[#D6A64A]" />
                    <span>Ver biografia</span>
                  </a>

                  {(member.position === "parish_priest" ||
                    member.position === "permanent_deacon" ||
                    member.position === "vicar") && (
                    <Link
                      href="/contato"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#fbf5eb] border border-[#D6A64A] text-[#18351E] text-sm font-semibold hover:bg-[#f3ece0] transition-all shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4 text-[#B8872E]" />
                      <span>Falar com a secretaria</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Direita: Foto do Clérigo (sem borda aninhada) */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative aspect-[3/4] w-full max-w-sm rounded-3xl overflow-hidden border border-[#D6A64A]/40 shadow-xl bg-[#f3ece0]">
                  <img
                    src={getClergyPhotoUrl(member)}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 text-white text-sm font-serif italic">
                    {getMinistryJurisdiction(member.position)}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. CONTEÚDO DA BIOGRAFIA + LATERAL (mesma disposição de Comunidades) */}
            <div id="biografia" className="grid grid-cols-1 lg:grid-cols-12 gap-10 scroll-mt-28">
              {/* Coluna Principal da Biografia */}
              <div className="lg:col-span-8 space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="h-px w-8 bg-[#B8872E]/40" />
                    <span className="text-[#B8872E] text-sm font-bold uppercase tracking-[0.25em]">
                      HISTÓRIA E MINISTÉRIO
                    </span>
                  </div>

                  <h2
                    className="text-2xl md:text-3xl font-semibold text-[#18351E] mb-4"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    Trajetória Pastoral e Vocação
                  </h2>

                  <div className="space-y-4 max-w-3xl font-serif text-[#43362d] text-base md:text-lg leading-relaxed text-justify">
                    {bioParagraphs.length > 0 ? (
                      bioParagraphs.map((p, idx) => (
                        <p key={idx} className="indent-4 first:indent-0">
                          {p}
                        </p>
                      ))
                    ) : (
                      <p className="text-[#736254] italic">
                        Informações biográficas deste clérigo serão inseridas em breve.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Coluna Lateral de Informações */}
              <div className="lg:col-span-4 space-y-5">
                <div className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-[#D6A64A]/20">
                    <CrossIcon width={12} height={18} fill="#B8872E" />
                    <h3
                      className="text-xl font-semibold text-[#18351E]"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      Dados do Ministério
                    </h3>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <span className="text-sm text-[#8c7b6c] uppercase tracking-wider block font-medium">Ofício / Função</span>
                      <span className="font-semibold text-[#18351E] text-base text-sm">{role}</span>
                    </div>

                    <div>
                      <span className="text-sm text-[#8c7b6c] uppercase tracking-wider block font-medium">Jurisdição</span>
                      <span className="text-[#5A463B] font-serif text-sm">{getMinistryJurisdiction(member.position)}</span>
                    </div>

                    {/* Hierarquia do Clero */}
                    <div className="pt-3 border-t border-[#D6A64A]/20 text-md font-serif text-[#5A463B] space-y-1.5 text-md">
                      <p className="leading-relaxed">
                        {getClergyHierarchyDesc(member.position)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. DEMAIS MINISTROS E PASTORES (Navegação Rápida) */}
            {otherClergy.length > 0 && (
              <section aria-labelledby="other-clergy-heading" className="md:pt-8">
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="h-px w-10 bg-[#B8872E]/40" />
                    <div className="flex items-center gap-1.5 text-[#B8872E] text-sm font-semibold uppercase tracking-[0.25em]">
                      <span>CONHEÇA TAMBÉM</span>
                    </div>
                    <span className="h-px w-10 bg-[#B8872E]/40" />
                  </div>

                  <h2
                    id="other-clergy-heading"
                    className="text-2xl md:text-4xl font-semibold text-[#18351E] mb-2"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    Outros Pastores e Ministros
                  </h2>

                  <p className="text-lg text-[#5A463B] font-serif leading-relaxed max-w-xl mb-3">
                    Conheça os demais ministros que servem e guiam a Igreja na comunhão apostólica.
                  </p>
                </div>

                <div
                  className={`grid grid-cols-1 gap-4 md:gap-5 ${
                    otherClergy.length === 1
                      ? "max-w-md mx-auto"
                      : otherClergy.length === 2
                      ? "sm:grid-cols-2"
                      : otherClergy.length === 3
                      ? "sm:grid-cols-2 lg:grid-cols-3"
                      : "sm:grid-cols-2 lg:grid-cols-4"
                  }`}
                >
                  {otherClergy.map((item) => {
                    const photoUrl = getClergyPhotoUrl(item);
                    const itemRole = getClergyRoleLabel(
                      item.position,
                      item.roleName,
                      item.title,
                    );
                    const summaryText = item.shortIntro || item.bio;

                    return (
                      <Link
                        key={item.id}
                        href={`/clerigos/${item.slug}`}
                        className="group bg-[#fbf5eb] border border-[#D6A64A]/30 hover:border-[#B8872E] rounded-3xl p-4 flex items-stretch gap-4 text-left shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                      >
                        {/* Foto retrato à esquerda */}
                        <div className="w-28 sm:w-32 aspect-[3/4] shrink-0 overflow-hidden rounded-2xl bg-gradient-to-b from-[#f8f3eb] to-[#e7dac7]">
                          <img
                            src={photoUrl}
                            alt={item.name}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Conteúdo à direita */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <span className="block text-[10.5px] font-bold text-[#B8872E] uppercase tracking-wider mb-0.5 truncate">
                              {itemRole}
                            </span>

                            <h3
                              className="text-lg font-semibold text-[#18351E] group-hover:text-[#B8872E] transition-colors leading-snug line-clamp-2"
                              style={{ fontFamily: "Cormorant Garamond, serif" }}
                            >
                              {item.name}
                            </h3>

                            {summaryText && (
                              <p className="text-xs sm:text-sm text-[#736254] line-clamp-2 mt-1.5">
                                {summaryText}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#18351E] group-hover:text-[#B8872E] transition-colors pt-2.5 border-t border-[#D6A64A]/20 mt-2">
                            <span>Conheça</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-14 flex flex-col sm:flex-row sm:items-center justify-end gap-3 text-sm sm:text-base">
                  <Link
                    href="/clerigos"
                    className="text-sm sm:text-base font-semibold text-[#18351E] hover:text-[#B8872E] inline-flex items-center gap-1 transition-colors group shrink-0"
                  >
                    <span>Entenda a hierarquia e veja todos</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
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
