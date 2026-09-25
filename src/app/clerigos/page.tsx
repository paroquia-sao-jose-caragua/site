"use client";

import Link from "next/link";
import { Users, ChevronRight, Sparkles, Globe, Shield, Church } from "lucide-react";
import { CrossIcon } from "@/components/icons/CrossIcon";
import { useClergy } from "@/lib/api/clergy/use-clergy";
import { getClergyPhotoUrl, getClergyRoleLabel } from "@/lib/utils/clergy";

export default function ClerigosPage() {
  const { clergy, isPending } = useClergy();

  // Separação por níveis canônicos e pastorais
  const pontiffs = clergy.filter((item) => item.position === "supreme_pontiff");
  const bishops = clergy.filter((item) => item.position === "diocesan_bishop");
  const parishPriests = clergy.filter(
    (item) =>
      item.position === "parish_priest" ||
      (item.isMain && !["supreme_pontiff", "diocesan_bishop"].includes(item.position)),
  );
  const assistants = clergy.filter(
    (item) =>
      item.position === "vicar" ||
      item.position === "permanent_deacon" ||
      (!["supreme_pontiff", "diocesan_bishop", "parish_priest"].includes(item.position) &&
        !item.isMain),
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

        {/* Page Header (alinhado à esquerda seguindo o padrão das demais páginas) */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a6824b] uppercase tracking-widest mb-2">
            <Users className="w-4 h-4" />
            <span>NOSSOS CLÉRIGOS</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#18351E]">
            Quem nos conduz na fé
          </h1>
          <p className="text-sm md:text-base text-[#6b5c4d] mt-2 max-w-2xl leading-relaxed">
            A sucessão e comunhão apostólica que nos une à Sé de Pedro em Roma, à Diocese de Caraguatatuba e ao pastoreio direto da Paróquia São José.
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
          /* Trilha de Comunhão Apostólica (Left-Rail Timeline) */
          <div className="w-full space-y-12 md:space-y-16">
            {/* ============================================================== */}
            {/* GRAU 1: IGREJA UNIVERSAL — SÉ APOSTÓLICA (Papa)               */}
            {/* ============================================================== */}
            {pontiffs.length > 0 && (
              <div className="relative pl-10 sm:pl-14 md:pl-16">
                {/* Linha vertical conectando ao próximo grau */}
                <div
                  className="absolute left-4 sm:left-5 top-10 -bottom-12 md:-bottom-16 w-0.5 bg-gradient-to-b from-[#B8872E] via-[#D6A64A]/40 to-[#D6A64A]/30 -translate-x-1/2"
                  aria-hidden="true"
                />

                {/* Nó / Ícone na Linha */}
                <div
                  className="absolute left-4 sm:left-5 top-0 -translate-x-1/2 size-8 sm:size-10 rounded-full bg-[#fbf6ee] border-2 border-[#B8872E] flex items-center justify-center text-[#B8872E] shadow-xs z-10 ring-4 ring-[#fbf6ee]"
                  aria-hidden="true"
                >
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                <section aria-labelledby="pontiff-heading-group">
                  {/* Cabeçalho do Nível */}
                  <div className="mb-5 pt-0.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ECD6BD]/60 border border-[#D6A64A]/40 text-[#8c6218] text-[11px] font-bold tracking-wider uppercase mb-1.5">
                      <span>1º Grau • Sé Apostólica de Roma</span>
                    </div>
                    <h2
                      id="pontiff-heading-group"
                      className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#18351E]"
                    >
                      Igreja Universal
                    </h2>
                    <p className="text-sm md:text-base text-[#6b5c4d] font-serif max-w-3xl leading-relaxed mt-1.5">
                      O Santo Padre, Sucessor do Apóstolo Pedro e Bispo de Roma, é o pastor supremo da Igreja e o perpétuo princípio de unidade na fé e na caridade de todos os fiéis.
                    </p>
                  </div>

                  {/* Card do Pontífice */}
                  <div className="w-full space-y-4">
                    {pontiffs.map((member) => {
                      const role = getClergyRoleLabel(
                        member.position,
                        member.roleName,
                        member.title,
                      );
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
                              className="h-10 inline-flex items-center gap-2 px-6 rounded-full bg-[#18351E] text-white hover:bg-[#27442A] text-xs font-semibold transition-all shadow-xs group"
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
              </div>
            )}

            {/* ============================================================== */}
            {/* GRAU 2: IGREJA PARTICULAR — DIOCESE (Bispo Diocesano)         */}
            {/* ============================================================== */}
            {bishops.length > 0 && (
              <div className="relative pl-10 sm:pl-14 md:pl-16">
                {/* Linha vertical conectando ao próximo grau */}
                <div
                  className="absolute left-4 sm:left-5 top-10 -bottom-12 md:-bottom-16 w-0.5 bg-gradient-to-b from-[#B8872E] via-[#D6A64A]/40 to-[#D6A64A]/30 -translate-x-1/2"
                  aria-hidden="true"
                />

                {/* Nó / Ícone na Linha */}
                <div
                  className="absolute left-4 sm:left-5 top-0 -translate-x-1/2 size-8 sm:size-10 rounded-full bg-[#fbf6ee] border-2 border-[#B8872E] flex items-center justify-center text-[#B8872E] shadow-xs z-10 ring-4 ring-[#fbf6ee]"
                  aria-hidden="true"
                >
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                <section aria-labelledby="bishop-heading-group">
                  {/* Cabeçalho do Nível */}
                  <div className="mb-5 pt-0.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ECD6BD]/60 border border-[#D6A64A]/40 text-[#8c6218] text-[11px] font-bold tracking-wider uppercase mb-1.5">
                      <span>2º Grau • Igreja Particular</span>
                    </div>
                    <h2
                      id="bishop-heading-group"
                      className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#18351E]"
                    >
                      Diocese de Caraguatatuba
                    </h2>
                    <p className="text-sm md:text-base text-[#6b5c4d] font-serif max-w-3xl leading-relaxed mt-1.5">
                      O Bispo Diocesano é o sucessor dos Apóstolos confiado pelo Santo Padre para pastorear, ensinar e santificar a Diocese de Caraguatatuba, à qual nossa paróquia pertence filialmente.
                    </p>
                  </div>

                  {/* Card do Bispo */}
                  <div className="w-full space-y-4">
                    {bishops.map((member) => {
                      const role = getClergyRoleLabel(
                        member.position,
                        member.roleName,
                        member.title,
                      );
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
                              className="h-10 inline-flex items-center gap-2 px-6 rounded-full bg-[#18351E] text-white hover:bg-[#27442A] text-xs font-semibold transition-all shadow-xs group"
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
              </div>
            )}

            {/* ============================================================== */}
            {/* GRAU 3: COMUNIDADE PAROQUIAL — PARÓQUIA SÃO JOSÉ (Pároco)      */}
            {/* ============================================================== */}
            {parishPriests.length > 0 && (
              <div className="relative pl-10 sm:pl-14 md:pl-16">
                {/* Linha vertical conectando ao próximo grau */}
                <div
                  className="absolute left-4 sm:left-5 top-10 -bottom-12 md:-bottom-16 w-0.5 bg-gradient-to-b from-[#B8872E] via-[#D6A64A]/40 to-[#D6A64A]/30 -translate-x-1/2"
                  aria-hidden="true"
                />

                {/* Nó / Ícone na Linha */}
                <div
                  className="absolute left-4 sm:left-5 top-0 -translate-x-1/2 size-8 sm:size-10 rounded-full bg-[#fbf6ee] border-2 border-[#B8872E] flex items-center justify-center text-[#B8872E] shadow-xs z-10 ring-4 ring-[#fbf6ee]"
                  aria-hidden="true"
                >
                  <Church className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                <section aria-labelledby="parish-heading-group">
                  {/* Cabeçalho do Nível */}
                  <div className="mb-5 pt-0.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ECD6BD]/60 border border-[#D6A64A]/40 text-[#8c6218] text-[11px] font-bold tracking-wider uppercase mb-1.5">
                      <span>3º Grau • Sede Paroquial</span>
                    </div>
                    <h2
                      id="parish-heading-group"
                      className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#18351E]"
                    >
                      Paróquia São José
                    </h2>
                    <p className="text-sm md:text-base text-[#6b5c4d] font-serif max-w-3xl leading-relaxed mt-1.5">
                      O Pároco é o pastor próprio designado pelo Bispo Diocesano para pastorear nossa comunidade no Morro do Algodão e em todas as suas capelas, ministrando os sacramentos e a palavra de Deus.
                    </p>
                  </div>

                  {/* Card do Pároco */}
                  <div className="w-full space-y-4">
                    {parishPriests.map((member) => {
                      const role = getClergyRoleLabel(
                        member.position,
                        member.roleName,
                        member.title,
                      );
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
                              className="h-10 inline-flex items-center gap-2 px-6 rounded-full bg-[#18351E] text-white hover:bg-[#27442A] text-xs font-semibold transition-all shadow-xs group"
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
              </div>
            )}

            {/* ============================================================== */}
            {/* GRAU 4: SERVIÇO DO ALTAR & CARIDADE (Vigários e Diáconos)      */}
            {/* ============================================================== */}
            {assistants.length > 0 && (
              <div className="relative pl-10 sm:pl-14 md:pl-16">
                {/* Linha vertical que desce e suaviza ao final */}
                <div
                  className="absolute left-4 sm:left-5 top-10 bottom-0 w-0.5 bg-gradient-to-b from-[#B8872E] via-[#D6A64A]/30 to-transparent -translate-x-1/2"
                  aria-hidden="true"
                />

                {/* Nó / Ícone na Linha */}
                <div
                  className="absolute left-4 sm:left-5 top-0 -translate-x-1/2 size-8 sm:size-10 rounded-full bg-[#fbf6ee] border-2 border-[#B8872E] flex items-center justify-center text-[#B8872E] shadow-xs z-10 ring-4 ring-[#fbf6ee]"
                  aria-hidden="true"
                >
                  <CrossIcon width={10} height={16} fill="#B8872E" />
                </div>

                <section aria-labelledby="assistants-heading-group">
                  {/* Cabeçalho do Nível */}
                  <div className="mb-5 pt-0.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ECD6BD]/60 border border-[#D6A64A]/40 text-[#8c6218] text-[11px] font-bold tracking-wider uppercase mb-1.5">
                      <span>Ministério Sagrado • Serviço & Caridade</span>
                    </div>
                    <h2
                      id="assistants-heading-group"
                      className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#18351E]"
                    >
                      Diáconos e Vigários Paroquiais
                    </h2>
                    <p className="text-sm md:text-base text-[#6b5c4d] font-serif max-w-3xl leading-relaxed mt-1.5">
                      Colaboradores diretos no serviço litúrgico do altar, na proclamação da Palavra e nas obras de caridade e misericórdia junto à nossa comunidade.
                    </p>
                  </div>

                  {/* Cards dos Diáconos e Vigários */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
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
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[#18351E] hover:text-[#B8872E] transition-colors group"
                            >
                              <span>Conheça</span>
                              <ChevronRight
                                size={14}
                                className="group-hover:translate-x-0.5 transition-transform"
                              />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
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
