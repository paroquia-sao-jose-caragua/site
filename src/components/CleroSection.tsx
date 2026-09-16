"use client";

import { useState } from "react";
import { X, ChevronRight, Sparkles } from "lucide-react";
import { CrossIcon } from "./icons/CrossIcon";

export interface ClergyMember {
  id: string;
  img: string;
  role: string;
  name: string;
  shortIntro?: string;
  bio: string;
  isMain?: boolean;
}

export const clergyMembers: ClergyMember[] = [
  {
    id: "altair",
    img: "/clergies/paroco.png",
    role: "Pároco",
    name: "Padre Altair Santos",
    shortIntro: "À frente da missão pastoral da nossa comunidade.",
    bio: "Pe. Altair dos Santos nasceu em Florestópolis, no estado do Paraná, em 26 de janeiro de 1967. Filho de Sebastião dos Santos e Santa de Matos, foi batizado no Paraná. Recebeu os sacramentos da Primeira Eucaristia e da Crisma nas Paróquias de Nossa Senhora Auxiliadora e Nossa Senhora do Sagrado Coração, em Curitiba, onde iniciou seu engajamento pastoral. Foi ordenado diácono no Paraná e, posteriormente, ordenado presbítero em 29 de janeiro de 1994, em Curitiba (PR). Atualmente, exerce o ministério como pároco da Paróquia São José, em Caraguatatuba (SP), dedicando-se ao serviço pastoral da Igreja e da comunidade.",
    isMain: true,
  },
  {
    id: "valter",
    img: "/clergies/diacono.png",
    role: "Diácono Permanente",
    name: "Valter de Almeida",
    shortIntro: "Servindo ao altar e às obras de caridade da paróquia.",
    bio: "Valter de Almeida nasceu em São José do Rio Pardo, no Estado de São Paulo, em 13 de abril de 1951, filho de José Porcínio de Almeida Sobrinho e Palmira Foiadelli de Almeida. É casado com Deiko Hashimoto de Almeida, com quem constituiu sua família, tendo um filho e dois netos. Foi ordenado Diácono Permanente em 05 de junho de 1999, na Catedral Divino Espírito Santo, em Caraguatatuba, pelas mãos de Dom Fernando Mason. Atualmente exerce seu ministério diaconal na Paróquia São José, no bairro Morro do Algodão, em Caraguatatuba, dedicando-se ao serviço da Igreja e da comunidade.",
  },
  {
    id: "chacorowski",
    img: "/clergies/bispo.png",
    role: "Bispo Diocesano",
    name: "Dom José Carlos Chacorowski",
    shortIntro: "Pastor da Diocese de Caraguatatuba.",
    bio: "Dom José Carlos Chacorowski, CM, nasceu em Curitiba (PR) em 26 de dezembro de 1956. Ordenado sacerdote pelo Papa São João Paulo II em 1980, dedicou sua vida à formação, à missão evangelizadora e ao serviço pastoral, atuando no Brasil e em missão na República Democrática do Congo. Ao longo de sua trajetória, exerceu importantes funções na Congregação da Missão e junto às Filhas da Caridade, além de servir como Bispo Auxiliar de São Luís do Maranhão. Em 2013, foi nomeado pelo Papa Francisco Bispo da Diocese de Caraguatatuba, onde tomou posse em 17 de agosto do mesmo ano e segue conduzindo seu ministério episcopal até os dias atuais.",
  },
  {
    id: "leao",
    img: "/clergies/papa.png",
    role: "Sumo Pontífice",
    name: "Papa Leão XIV",
    shortIntro: "Bispo de Roma e pastor universal da Igreja Católica.",
    bio: "O Papa Leão XIV, nascido Robert Francis Prevost em Chicago (EUA) em 1955, é o 267.º Papa da Igreja Católica. Membro da Ordem de Santo Agostinho, exerceu importante trabalho missionário e episcopal no Peru antes de assumir funções de destaque no Vaticano. Eleito em 8 de maio de 2025, escolheu o nome Leão XIV em referência ao Papa Leão XIII e à tradição da doutrina social da Igreja. Desde o início de seu pontificado, tem destacado a importância da paz, do diálogo, da justiça social e da unidade da Igreja.",
  },
];

interface CleroModalProps {
  member: ClergyMember;
  onClose: () => void;
}

export function CleroModal({ member, onClose }: CleroModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="absolute inset-0 bg-[#18351E]/60 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl bg-[#fbf5eb] border border-[#D6A64A] shadow-2xl flex flex-col z-10">
        <div className="h-2 bg-[#B8872E]" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 size-9 rounded-full bg-[#18351E] text-[#D6A64A] flex items-center justify-center hover:scale-105 transition-transform z-20 cursor-pointer"
          aria-label="Fechar"
        >
          <X size={16} />
        </button>

        <div className="p-6 md:p-10 overflow-y-auto">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* Foto Portrait */}
            <div className="w-full md:w-52 shrink-0 flex flex-col items-center">
              <div className="relative w-40 md:w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[#D6A64A]/50 shadow-md bg-gradient-to-b from-[#f8f3eb] to-[#e7dac7] flex items-end justify-center">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Info Right */}
            <div className="flex-1 text-left">
              <p className="text-[#B8872E] text-xs font-bold uppercase tracking-[0.25em] mb-1.5">
                {member.role}
              </p>

              <h2
                className="text-[#18351E] text-2xl md:text-3xl font-semibold mb-4"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                {member.name}
              </h2>

              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-12 bg-[#B8872E]/40" />
                <CrossIcon width={8} height={16} fill="#B8872E" />
                <span className="h-px flex-1 bg-[#B8872E]/40" />
              </div>

              <h3
                className="text-[#18351E] text-lg font-semibold mb-2"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Biografia
              </h3>

              <p className="text-[#5A463B] text-sm md:text-base leading-relaxed text-justify font-serif">
                {member.bio || `Biografia de ${member.name} será inserida aqui.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CleroSection() {
  const [selected, setSelected] = useState<ClergyMember | null>(null);

  const mainMember = clergyMembers.find((m) => m.isMain) || clergyMembers[0];
  const otherMembers = clergyMembers.filter((m) => m.id !== mainMember.id);

  return (
    <section className="bg-[#fbf6ee] py-16 md:py-24 border-t border-[#e8dfd1]/60">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-px w-12 bg-[#B8872E]/40" />
            <div className="flex items-center gap-1.5 text-[#B8872E] text-xs font-semibold uppercase tracking-[0.3em]">
              <Sparkles className="w-3.5 h-3.5 text-[#B8872E]" />
              <span>NOSSA IGREJA</span>
              <Sparkles className="w-3.5 h-3.5 text-[#B8872E]" />
            </div>
            <span className="h-px w-12 bg-[#B8872E]/40" />
          </div>

          <h2
            className="text-3xl md:text-5xl font-semibold text-[#18351E] mb-4"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Quem nos conduz na fé
          </h2>

          <p className="text-sm md:text-base text-[#5A463B] font-serif leading-relaxed max-w-2xl mx-auto">
            Conheça os ministros e pastores que servem à nossa comunidade, cada um em sua missão e vocação.
          </p>
        </div>

        {/* 1. PERFIL PRINCIPAL — PÁROCO */}
        <div className="mb-16">
          <button
            type="button"
            onClick={() => setSelected(mainMember)}
            className="w-full bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col md:flex-row items-stretch text-left group cursor-pointer relative"
          >
            {/* Left Photo */}
            <div className="w-full h-64 sm:h-72 md:h-auto md:w-80 lg:w-96 shrink-0 relative bg-gradient-to-b from-[#f8f3eb] to-[#e7dac7] border-b md:border-b-0 md:border-r border-[#D6A64A]/20 overflow-hidden flex items-start justify-center">
              <img
                src={mainMember.img}
                alt={mainMember.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18351E] border border-[#D6A64A]/40 text-[#D6A64A] text-xs font-semibold tracking-wider uppercase shadow-md">
                <span>✦ PÁROCO</span>
              </div>
            </div>

            {/* Right Info Content */}
            <div className="p-6 md:p-10 flex-1 flex flex-col justify-between relative z-10">
              <div>
                <div className="flex items-center gap-2 text-[#B8872E] text-xs font-bold uppercase tracking-[0.25em] mb-2">
                  <CrossIcon fill="#B8872E" width={10} height={18} />
                  <span>PÁROCO</span>
                </div>

                <h3
                  className="text-2xl md:text-4xl font-semibold text-[#18351E] leading-tight group-hover:text-[#B8872E] transition-colors mb-2"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {mainMember.name}
                </h3>

                {mainMember.shortIntro && (
                  <p className="text-xs md:text-sm font-semibold text-[#B8872E] uppercase tracking-wider mb-4">
                    {mainMember.shortIntro}
                  </p>
                )}

                <p className="text-sm md:text-base text-[#5A463B] font-serif leading-relaxed mb-6 max-w-xl line-clamp-4 md:line-clamp-5 overflow-hidden text-ellipsis">
                  {mainMember.bio}
                </p>

                {/* Subtle St. Joseph lily / decoration text */}
                <div className="flex items-center gap-3 my-6 py-4 border-t border-b border-[#D6A64A]/20">
                  <span className="text-xs text-[#8c7b6c] font-serif italic">
                    “São José, homem justo e fiel, rogai por nós.”
                  </span>
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18351E] text-white text-xs font-semibold group-hover:bg-[#27442A] transition-all shadow-md">
                  <span>Conheça sua história completa</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* 2. OUTROS MINISTROS E PASTORES */}
        <div>
          <div className="mb-8">
            <span className="text-[#B8872E] text-xs font-bold uppercase tracking-[0.25em] block mb-1">
              OUTROS MINISTROS E PASTORES
            </span>
            <h3
              className="text-2xl md:text-3xl font-semibold text-[#18351E] mb-2"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Servindo à Igreja
            </h3>
            <p className="text-sm text-[#5A463B] font-serif">
              Conheça também aqueles que exercem diferentes ministérios e responsabilidades na Igreja.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherMembers.map((person) => (
              <button
                key={person.id}
                type="button"
                onClick={() => setSelected(person)}
                className="group bg-[#fbf5eb] border border-[#D6A64A]/30 rounded-2xl p-5 flex flex-col items-center text-center shadow-xs hover:shadow-md hover:border-[#B8872E] hover:-translate-y-1.5 transition-all cursor-pointer"
              >
                {/* Circular Portrait Photo */}
                <div className="relative w-36 h-36 aspect-square mb-4 overflow-hidden rounded-full border-2 border-[#D6A64A]/50 shadow-sm bg-gradient-to-b from-[#f8f3eb] to-[#e7dac7] flex items-end justify-center">
                  <img
                    src={person.img}
                    alt={person.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Role / Categoria */}
                <p className="text-[#B8872E] text-xs uppercase tracking-[0.2em] font-semibold mb-1">
                  {person.role}
                </p>

                {/* Name */}
                <h4
                  className="text-[#18351E] text-lg font-semibold leading-snug group-hover:text-[#B8872E] transition-colors mb-4 line-clamp-1"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {person.name}
                </h4>

                {/* Action Link */}
                <div className="flex items-center gap-1 text-xs font-semibold text-[#18351E] group-hover:text-[#B8872E] transition-colors mt-auto pt-3 border-t border-[#D6A64A]/20 w-full justify-center">
                  <span>Conheça</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <CleroModal member={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
