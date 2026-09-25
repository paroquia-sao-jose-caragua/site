"use client";

import Link from "next/link";
import { Users, ChevronRight, Sparkles, Globe, Shield, Church } from "lucide-react";
import { CrossIcon } from "@/components/icons/CrossIcon";
import { useClergy } from "@/lib/api/clergy/use-clergy";
import { getClergyPhotoUrl, getClergyRoleLabel } from "@/lib/utils/clergy";

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

export default function ClerigosPage() {
  const { clergy, isPending } = useClergy();

  // Separação por níveis canônicos e pastorais
  const pontiffs = clergy.filter((item) => item.position === "supreme_pontiff");
  const bishops = clergy.filter((item) => item.position === "diocesan_bishop");
  const parishPriests = clergy.filter(
    (item) => item.position === "parish_priest" || (item.isMain && !["supreme_pontiff", "diocesan_bishop"].includes(item.position)),
  );
  const assistants = clergy.filter(
    (item) =>
      item.position === "vicar" ||
      item.position === "permanent_deacon" ||
      (!["supreme_pontiff", "diocesan_bishop", "parish_priest"].includes(item.position) && !item.isMain),
  );

  return (
    <main className="relative w-full min-h-screen bg-[#fbf6ee] overflow-hidden pt-8 pb-24 md:pb-36">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#8c7b6c] mb-6 flex items-center gap-2 font-medium">
          <Link href="/" className="hover:text-[#2d261e] transition-colors">
            Início
          </Link>
          <span>&gt;</span>
          <span className="text-[#2d261e]">Clérigos</span>
        </nav>

        {/* Page Header (alinhado à esquerda seguindo Liturgia, Quero Contribuir e Comunidades) */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a6824b] uppercase tracking-widest mb-2">
            <Users className="w-4 h-4" />
            <span>NOSSOS CLÉRIGOS</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#18351E]">
            Quem nos conduz na fé
          </h1>
          <p className="text-sm md:text-base text-[#6b5c4d] mt-2 max-w-2xl leading-relaxed">
            A estrutura de comunhão apostólica que nos une à Sé de Pedro, à nossa Diocese de Caraguatatuba e ao pastoreio direto da Paróquia São José.
          </p>
        </div>

        {/* Content */}
        {isPending ? (
          <div className="space-y-8 w-full">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full bg-[#fbf5eb] border border-[#D6A64A]/30 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 animate-pulse"
              >
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-zinc-200/60 shrink-0" />
                <div className="flex-1 space-y-3 w-full">
                  <div className="h-4 w-28 bg-zinc-200/60 rounded" />
                  <div className="h-7 w-56 bg-zinc-200/60 rounded" />
                  <div className="h-4 w-72 bg-zinc-200/60 rounded" />
                </div>
                <div className="h-10 w-28 bg-zinc-200/60 rounded-xl shrink-0" />
              </div>
            ))}
          </div>
        ) : clergy.length === 0 ? (
          <div className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-2xl p-12 text-center text-[#736254] max-w-md mx-auto">
            Nenhum clérigo cadastrado no momento.
          </div>
        ) : (
          <div className="w-full space-y-4">
            {/* ============================================================== */}
            {/* NÍVEL 1: IGREJA UNIVERSAL — SÉ APOSTÓLICA (Papa)               */}
            {/* ============================================================== */}
            {pontiffs.length > 0 && (
              <section aria-labelledby="pontiff-section-heading" className="w-full">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="size-9 rounded-xl bg-[#ECD6BD]/50 border border-[#D6A64A]/50 flex items-center justify-center text-[#B8872E] shadow-2xs shrink-0">
                      <Globe className="w-4.5 h-4.5" />
                    </div>
                    <h2
                      id="pontiff-section-heading"
                      className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[#18351E]"
                    >
                      Igreja Universal • Santa Sé
                    </h2>
                  </div>
                  <p className="text-sm md:text-base text-[#6b5c4d] font-serif max-w-3xl leading-relaxed">
                    O Papa, como Bispo de Roma e Sucessor do Apóstolo Pedro, é o pastor supremo da Igreja Católica no mundo inteiro e o perpétuo fundamento visível da unidade da fé e da comunhão de todos os fiéis.
                  </p>
                </div>

                <div className="w-full space-y-4">
                  {pontiffs.map((member) => {
                    const role = getClergyRoleLabel(member.position, member.roleName, member.title);
                    return (
                      <div
                        key={member.id}
                        className="w-full bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-stretch justify-between gap-6 shadow-xs hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1">
                          <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 shrink-0 rounded-2xl overflow-hidden bg-[#f3ece0] border border-[#D6A64A]/30">
                            <img
                              src={getClergyPhotoUrl(member)}
                              alt={member.name}
                              className="w-full h-full object-cover object-top"
                            />
                          </div>

                          <div className="flex-1 text-center sm:text-left flex flex-col justify-center">
                            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#18351E] text-[#eeca94] text-xs font-semibold uppercase tracking-wider mb-2 w-fit mx-auto sm:mx-0">
                              <Sparkles className="w-3 h-3" />
                              <span>{role}</span>
                            </div>

                            <h3
                              id="pontiff-heading"
                              className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#18351E] mb-1.5"
                              style={{ fontFamily: "Cormorant Garamond, serif" }}
                            >
                              {member.name}
                            </h3>

                            {member.shortIntro && (
                              <p className="text-sm md:text-base text-[#8c6218] font-serif italic max-w-3xl">
                                &ldquo;{member.shortIntro}&rdquo;
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center justify-center sm:justify-end">
                          <Link
                            href={`/clerigos/${member.slug}`}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#18351E] text-[#eeca94] hover:bg-[#27442A] text-sm font-semibold transition-all shadow-xs group"
                          >
                            <span>Conheça</span>
                            <ChevronRight
                              size={16}
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

            {/* CONECTOR LITÚRGICO ENTRE PAPA E BISPO */}
            {pontiffs.length > 0 && bishops.length > 0 && (
              <LiturgicalConnector label="Comunhão Episcopal" />
            )}

            {/* ============================================================== */}
            {/* NÍVEL 2: IGREJA PARTICULAR — DIOCESE (Bispo Diocesano)         */}
            {/* ============================================================== */}
            {bishops.length > 0 && (
              <section aria-labelledby="bishop-section-heading" className="w-full">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="size-9 rounded-xl bg-[#ECD6BD]/50 border border-[#D6A64A]/50 flex items-center justify-center text-[#B8872E] shadow-2xs shrink-0">
                      <Shield className="w-4.5 h-4.5" />
                    </div>
                    <h2
                      id="bishop-section-heading"
                      className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[#18351E]"
                    >
                      Igreja Particular • Diocese de Caraguatatuba
                    </h2>
                  </div>
                  <p className="text-sm md:text-base text-[#6b5c4d] font-serif max-w-3xl leading-relaxed">
                    O Bispo Diocesano é o sucessor dos Apóstolos confiado pelo Santo Padre para guiar e santificar a Diocese de Caraguatatuba, a cuja jurisdição nossa Paróquia São José pertence em filial obediência e comunhão eclesial.
                  </p>
                </div>

                <div className="w-full space-y-4">
                  {bishops.map((member) => {
                    const role = getClergyRoleLabel(member.position, member.roleName, member.title);
                    return (
                      <div
                        key={member.id}
                        className="w-full bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-stretch justify-between gap-6 shadow-xs hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1">
                          <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 shrink-0 rounded-2xl overflow-hidden bg-[#f3ece0] border border-[#D6A64A]/30">
                            <img
                              src={getClergyPhotoUrl(member)}
                              alt={member.name}
                              className="w-full h-full object-cover object-top"
                            />
                          </div>

                          <div className="flex-1 text-center sm:text-left flex flex-col justify-center">
                            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#18351E] text-[#eeca94] text-xs font-semibold uppercase tracking-wider mb-2 w-fit mx-auto sm:mx-0">
                              <Sparkles className="w-3 h-3" />
                              <span>{role}</span>
                            </div>

                            <h3
                              id="bishop-heading"
                              className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#18351E] mb-1.5"
                              style={{ fontFamily: "Cormorant Garamond, serif" }}
                            >
                              {member.name}
                            </h3>

                            {member.shortIntro && (
                              <p className="text-sm md:text-base text-[#8c6218] font-serif italic max-w-3xl">
                                &ldquo;{member.shortIntro}&rdquo;
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center justify-center sm:justify-end">
                          <Link
                            href={`/clerigos/${member.slug}`}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#18351E] text-[#eeca94] hover:bg-[#27442A] text-sm font-semibold transition-all shadow-xs group"
                          >
                            <span>Conheça</span>
                            <ChevronRight
                              size={16}
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

            {/* CONECTOR LITÚRGICO ENTRE BISPO E PARÓQUIA */}
            {(pontiffs.length > 0 || bishops.length > 0) && parishPriests.length > 0 && (
              <LiturgicalConnector label="Governo e Cuidado Pastoral" />
            )}

            {/* ============================================================== */}
            {/* NÍVEL 3: COMUNIDADE PAROQUIAL — PARÓQUIA SÃO JOSÉ              */}
            {/* ============================================================== */}
            {parishPriests.length > 0 && (
              <section aria-labelledby="parish-section-heading" className="w-full">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="size-9 rounded-xl bg-[#ECD6BD]/50 border border-[#D6A64A]/50 flex items-center justify-center text-[#B8872E] shadow-2xs shrink-0">
                      <Church className="w-4.5 h-4.5" />
                    </div>
                    <h2
                      id="parish-section-heading"
                      className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[#18351E]"
                    >
                      Comunidade Paroquial • Paróquia São José
                    </h2>
                  </div>
                  <p className="text-sm md:text-base text-[#6b5c4d] font-serif max-w-3xl leading-relaxed">
                    O Pároco é o pastor próprio confiado pelo Bispo Diocesano para exercer o ministério pastoral da Paróquia São José no Morro do Algodão e em todas as suas capelas, conduzindo os fiéis pelo ensino do Evangelho, pela santificação dos sacramentos e pela caridade cristã.
                  </p>
                </div>

                <div className="w-full space-y-4">
                  {parishPriests.map((member) => {
                    const role = getClergyRoleLabel(member.position, member.roleName, member.title);
                    return (
                      <div
                        key={member.id}
                        className="w-full bg-[#fbf5eb] border border-[#D6A64A]/50 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-stretch justify-between gap-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1">
                          <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 shrink-0 rounded-2xl overflow-hidden bg-[#f3ece0] border border-[#D6A64A]/30">
                            <img
                              src={getClergyPhotoUrl(member)}
                              alt={member.name}
                              className="w-full h-full object-cover object-top"
                            />
                          </div>

                          <div className="flex-1 text-center sm:text-left flex flex-col justify-center">
                            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#18351E] text-[#eeca94] text-xs font-semibold uppercase tracking-wider mb-2 w-fit mx-auto sm:mx-0">
                              <Sparkles className="w-3 h-3" />
                              <span>{role}</span>
                            </div>

                            <h3
                              id="parish-heading"
                              className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#18351E] mb-1.5"
                              style={{ fontFamily: "Cormorant Garamond, serif" }}
                            >
                              {member.name}
                            </h3>

                            {member.shortIntro && (
                              <p className="text-sm md:text-base text-[#8c6218] font-serif italic max-w-3xl">
                                &ldquo;{member.shortIntro}&rdquo;
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center justify-center sm:justify-end">
                          <Link
                            href={`/clerigos/${member.slug}`}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#18351E] text-[#eeca94] hover:bg-[#27442A] text-sm font-semibold transition-all shadow-xs group"
                          >
                            <span>Conheça</span>
                            <ChevronRight
                              size={16}
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

            {/* ============================================================== */}
            {/* RAMIFICAÇÃO: VIGÁRIOS & DIÁCONOS PERMANENTES                    */}
            {/* ============================================================== */}
            {assistants.length > 0 && (
              <section aria-labelledby="assistants-section-heading" className="w-full mt-4">
                {/* Linha conectora de ramificação */}
                <div className="flex flex-col items-center mb-6" aria-hidden="true">
                  <div className="h-6 md:h-8 w-px bg-gradient-to-b from-[#B8872E] to-[#B8872E]/40" />
                  <div className="my-1.5 px-3.5 py-1 rounded-full bg-[#fbf5eb] border border-[#D6A64A]/50 shadow-xs flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-[#8c6218]">
                    <CrossIcon width={8} height={14} fill="#B8872E" />
                    <span>Serviço do Altar e da Caridade</span>
                    <CrossIcon width={8} height={14} fill="#B8872E" />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="size-9 rounded-xl bg-[#ECD6BD]/50 border border-[#D6A64A]/50 flex items-center justify-center text-[#B8872E] shadow-2xs shrink-0">
                      <Sparkles className="w-4.5 h-4.5" />
                    </div>
                    <h2
                      id="assistants-section-heading"
                      className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[#18351E]"
                    >
                      Diáconos e Vigários Paroquiais
                    </h2>
                  </div>
                  <p className="text-sm md:text-base text-[#6b5c4d] font-serif max-w-3xl leading-relaxed">
                    Os diáconos permanentes e vigários colaboram diretamente com o pároco no serviço litúrgico do altar, na proclamação da Palavra de Deus e nas obras de misericórdia e caridade que sustentam as famílias e os mais necessitados da nossa comunidade.
                  </p>
                </div>

                <div className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full">
                    {assistants.map((member) => {
                      const photoUrl = getClergyPhotoUrl(member);
                      const role = getClergyRoleLabel(
                        member.position,
                        member.roleName,
                        member.title,
                      );

                      return (
                        <div
                          key={member.id}
                          className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                            {/* Foto */}
                            <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-2xl overflow-hidden border border-[#D6A64A]/30 bg-[#f3ece0]">
                              <img
                                src={photoUrl}
                                alt={member.name}
                                className="w-full h-full object-cover object-top"
                              />
                            </div>

                            <div className="flex-1 text-center sm:text-left">
                              <span className="inline-block text-[11px] font-bold text-[#B8872E] uppercase tracking-wider mb-1">
                                {role}
                              </span>

                              <h3
                                className="text-2xl font-semibold text-[#18351E] mb-1"
                                style={{ fontFamily: "Cormorant Garamond, serif" }}
                              >
                                {member.name}
                              </h3>

                              {member.shortIntro && (
                                <p className="text-xs md:text-sm text-[#736254] font-serif italic line-clamp-2 leading-relaxed">
                                  &ldquo;{member.shortIntro}&rdquo;
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-5 pt-4 border-t border-[#D6A64A]/20 flex items-center justify-end">
                            <Link
                              href={`/clerigos/${member.slug}`}
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
