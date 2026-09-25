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
        <nav className="text-xs text-[#8c7b6c] mb-8 flex items-center gap-2 font-medium flex-wrap">
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
                <div className="h-10 w-44 bg-zinc-200/60 rounded-full pt-4" />
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Esquerda: Informações do Clérigo */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fbf5eb] border border-[#D6A64A]/40 text-[#B8872E] text-xs font-semibold tracking-widest uppercase">
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

                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <a
                    href="#biografia"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18351E] text-white text-xs font-semibold hover:bg-[#27442A] transition-all shadow-md cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-[#D6A64A]" />
                    <span>Ver biografia</span>
                  </a>

                  {(member.position === "parish_priest" ||
                    member.position === "permanent_deacon" ||
                    member.position === "vicar") && (
                    <Link
                      href="/contato"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#fbf5eb] border border-[#D6A64A] text-[#18351E] text-xs font-semibold hover:bg-[#f3ece0] transition-all shadow-xs"
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
                  <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-serif italic">
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
                    <span className="text-[#B8872E] text-xs font-bold uppercase tracking-[0.25em]">
                      HISTÓRIA E MINISTÉRIO
                    </span>
                  </div>

                  <h2
                    className="text-2xl md:text-3xl font-semibold text-[#18351E] mb-4"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    Trajetória Pastoral e Vocação
                  </h2>

                  <div className="space-y-4 font-serif text-[#43362d] text-base md:text-lg leading-relaxed text-justify">
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

                <div className="pt-2">
                  <Link
                    href="/clerigos"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#8c6218] hover:text-[#18351E] transition-colors"
                  >
                    <ArrowLeft size={14} />
                    <span>Voltar para todos os clérigos</span>
                  </Link>
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

                  <div className="space-y-3.5 text-sm">
                    <div>
                      <span className="text-xs text-[#8c7b6c] uppercase tracking-wider block font-medium">Ofício / Função</span>
                      <span className="font-semibold text-[#18351E] text-base">{role}</span>
                    </div>

                    <div>
                      <span className="text-xs text-[#8c7b6c] uppercase tracking-wider block font-medium">Jurisdição</span>
                      <span className="text-[#5A463B] font-serif">{getMinistryJurisdiction(member.position)}</span>
                    </div>

                    <div className="pt-3 border-t border-[#D6A64A]/20 text-[11.5px] text-[#8c7b6c] italic font-serif">
                      A serviço do Evangelho e da Igreja Católica.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. DEMAIS MINISTROS E PASTORES (Navegação Rápida) */}
            {otherClergy.length > 0 && (
              <section aria-labelledby="other-clergy-heading" className="pt-4 border-t border-[#D6A64A]/30">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2
                      id="other-clergy-heading"
                      className="text-2xl md:text-3xl font-semibold text-[#18351E]"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      Outros Pastores e Ministros
                    </h2>
                    <p className="text-xs md:text-sm text-[#736254]">
                      Conheça os demais ministros que servem e guiam a Igreja.
                    </p>
                  </div>

                  <Link
                    href="/clerigos"
                    className="text-xs md:text-sm font-semibold text-[#8c6218] hover:text-[#18351E] hover:underline transition-colors hidden sm:inline-flex items-center gap-1"
                  >
                    <span>Ver todos</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {otherClergy.map((item) => {
                    const photoUrl = getClergyPhotoUrl(item);
                    const itemRole = getClergyRoleLabel(
                      item.position,
                      item.roleName,
                      item.title,
                    );

                    return (
                      <Link
                        key={item.id}
                        href={`/clerigos/${item.slug}`}
                        className="group bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-2xl p-4 sm:p-5 flex items-center gap-4 hover:shadow-md hover:border-[#D6A64A] hover:-translate-y-0.5 transition-all"
                      >
                        <div className="size-16 rounded-full overflow-hidden shrink-0 border border-[#D6A64A]/50 bg-gradient-to-b from-[#f8f3eb] to-[#e7dac7]">
                          <img
                            src={photoUrl}
                            alt={item.name}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className="text-[10.5px] font-bold text-[#B8872E] uppercase tracking-wider block truncate">
                            {itemRole}
                          </span>
                          <h3
                            className="text-lg font-semibold text-[#18351E] group-hover:text-[#B8872E] transition-colors truncate"
                            style={{ fontFamily: "Cormorant Garamond, serif" }}
                          >
                            {item.name}
                          </h3>
                          <span className="text-xs text-[#8c6218] font-medium flex items-center gap-1 mt-0.5">
                            <span>Conheça</span>
                            <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </Link>
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
