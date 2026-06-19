"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface ClergyMember {
  img: string;
  role: string;
  name: string;
  bio: string;
}

const clergy: ClergyMember[] = [
  {
    img: "/Desktop5/cbfee9095d0b7216d141eba05232f2e192b01bc2.png",
    role: "Pároco",
    name: "Padre Altair Santos",
    bio: "Nascido em 26 de janeiro de 1967, foi ordenado em 29 de janeiro de 1994. Atualmente é Pároco da Paróquia São José de Caraguatatuba.",
  },
  {
    img: "/Desktop5/2c639083669db26e28970c07d7940eb6016061d7.png",
    role: "Diácono Permanente",
    name: "Valter de Almeida",
    bio: "Nascido em 13 de abril de 1951, foi ordenado diácono permanente em 05 de junho de 1999. É casado com Deiko Hashimoto desde 11 de setembro de 1976 e exerce seu ministério na Paróquia São José em Caraguatatuba.",
  },
  {
    img: "/Desktop5/f5d4c9341b05a3663e03b0433e3c3f2de529be86.png",
    role: "Bispo Diocesano",
    name: "Dom José Carlos Brandão Cabral",
    bio: "Dom José Carlos Chacorowski, CM, nasceu em Curitiba (PR) em 26 de dezembro de 1956. Ordenado sacerdote pelo Papa São João Paulo II em 1980, dedicou sua vida à formação, à missão evangelizadora e ao serviço pastoral, atuando no Brasil e em missão na República Democrática do Congo. Ao longo de sua trajetória, exerceu importantes funções na Congregação da Missão e junto às Filhas da Caridade, além de servir como Bispo Auxiliar de São Luís do Maranhão. Em 2013, foi nomeado pelo Papa Francisco Bispo da Diocese de Caraguatatuba, onde tomou posse em 17 de agosto do mesmo ano e segue conduzindo seu ministério episcopal até os dias atuais.",
  },
  {
    img: "/Desktop5/ae2df067426c94caa1cca45ef44e6b134da6cbe4.png",
    role: "Sumo Pontífice",
    name: "Papa Leão XIV",
    bio: "O Papa Leão XIV, nascido Robert Francis Prevost em Chicago (EUA) em 1955, é o 267.º Papa da Igreja Católica. Membro da Ordem de Santo Agostinho, exerceu importante trabalho missionário e episcopal no Peru antes de assumir funções de destaque no Vaticano. Eleito em 8 de maio de 2025, escolheu o nome Leão XIV em referência ao Papa Leão XIII e à tradição da doutrina social da Igreja. Desde o início de seu pontificado, tem destacado a importância da paz, do diálogo, da justiça social e da unidade da Igreja.",
  },
];

interface CleryModalProps {
  member: ClergyMember;
  onClose: () => void;
}

function CleroModal({ member, onClose }: CleryModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 size-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-[#4a2f24] transition-colors"
          aria-label="Fechar"
        >
          <X size={15} />
        </button>

        {/* Content — scrollable */}
        <div className="p-6 pt-8 overflow-y-auto">
          {/* Circular photo + role + name */}
          <div className="flex flex-col items-center text-center mb-5">
            <img
              src={member.img}
              alt={member.name}
              className="size-40 rounded-full object-cover object-top ring-4 ring-[#dcc2b5] mb-4"
            />
            <p
              className="text-[#a45d00] text-[11px] uppercase tracking-widest mb-1"
              style={{ fontWeight: 600 }}
            >
              {member.role}
            </p>
            <h2
              className="text-[#1a1a1a] text-[18px]"
              style={{ fontWeight: 700, lineHeight: 1.3 }}
            >
              {member.name}
            </h2>
          </div>

          {/* Divider */}
          <div className="w-10 h-0.5 bg-[#dcc2b5] rounded-full mx-auto mb-5" />

          {/* Bio */}
          <p className="text-[#4b5563] text-[14px]" style={{ lineHeight: 1.8 }}>
            {member.bio}
          </p>
        </div>
      </div>
    </div>
  );
}

export function CleroSection() {
  const [selected, setSelected] = useState<ClergyMember | null>(null);

  return (
    <section className="py-20 bg-[#f9f5f2]">
      <div className="max-w-300 mx-auto px-6">
        <div className="mb-10">
          <p
            className="text-[#4a2f24] text-[11px] uppercase tracking-widest mb-1"
            style={{ fontWeight: 500 }}
          >
            Clero
          </p>
          <h2
            className="text-[#4a2f24] text-[26px]"
            style={{ fontWeight: 600, lineHeight: 1.3 }}
          >
            Servos da Igreja
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {clergy.map((person, i) => (
            <button
              key={i}
              onClick={() => setSelected(person)}
              className="flex flex-col items-center gap-4 group focus:outline-none"
            >
              <div className="relative size-35 md:size-40 shrink-0">
                <img
                  src={person.img}
                  alt={person.name}
                  className="size-full object-cover object-top rounded-full ring-4 ring-[#dcc2b5] group-hover:ring-[#7b4f37] group-hover:scale-[1.03] transition-all duration-300"
                />
              </div>
              <div className="text-center">
                <p
                  className="text-[#a45d00] text-[11px] uppercase tracking-wide mb-0.5"
                  style={{ fontWeight: 600 }}
                >
                  {person.role}
                </p>
                <p
                  className="text-[#7b4f37] text-[15px] group-hover:text-[#4a2f24] transition-colors"
                  style={{ fontWeight: 600, lineHeight: 1.4 }}
                >
                  {person.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <CleroModal member={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
