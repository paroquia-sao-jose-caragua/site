"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { CrossIcon } from "./icons/CrossIcon";

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
    bio: "Valter de Almeida nasceu em São José do Rio Pardo, no Estado de São Paulo, em 13 de abril de 1951, filho de José Porcínio de Almeida Sobrinho e Palmira Foiadelli de Almeida. É casado com Deiko Hashimoto de Almeida, com quem constituiu sua família, tendo um filho e dois netos. Foi ordenado Diácono Permanente em 05 de junho de 1999, na Catedral Divino Espírito Santo, em Caraguatatuba, pelas mãos de Dom Fernando Mason. Atualmente exerce seu ministério diaconal na Paróquia São José, no bairro Morro do Algodão, em Caraguatatuba, dedicando-se ao serviço da Igreja e da comunidade.",
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
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        p-5
      "
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* backdrop */}

      <div
        className="
          absolute
          inset-0
          bg-[#18351E]/60
          backdrop-blur-sm
        "
        onClick={onClose}
      />

      {/* modal */}

      <div
        className="
          relative
          w-full
          max-w-md
          max-h-[90vh]
          overflow-hidden
          rounded-3xl
          bg-[#FBF8F3]
          border
          border-[#D6A64A]
          shadow-2xl
          flex
          flex-col
        "
      >
        {/* topo dourado */}

        <div
          className="
            h-2
            bg-[#B8872E]
          "
        />

        {/* fechar */}

        <button
          onClick={onClose}
          className="
            absolute
            top-5
            right-5
            size-9
            rounded-full
            bg-[#18351E]
            text-[#D6A64A]
            flex
            items-center
            justify-center
            hover:scale-105
            transition
          "
        >
          <X size={16} />
        </button>

        {/* conteúdo */}

        <div
          className="
            p-8
            overflow-y-auto
          "
        >
          {/* Foto */}

          <div
            className="
              flex
              flex-col
              items-center
              text-center
              mb-6
            "
          >
            <div
              className="
                relative
                size-40
                mb-6
              "
            >
              <div
                className="
                  absolute
                  inset-0
                  rounded-full
                  border-4
                  border-[#B8872E]
                "
              />

              <img
                src={member.img}
                alt={member.name}
                className="
                  size-full
                  rounded-full
                  object-cover
                  object-top
                  p-1
                "
              />
            </div>

            {/* cargo */}

            <p
              className="
                text-[#B8872E]
                text-xs
                uppercase
                tracking-[0.25em]
                mb-2
              "
              style={{
                fontWeight: 600,
              }}
            >
              {member.role}
            </p>

            {/* nome */}

            <h2
              className="
                text-[#18351E]
                text-3xl
              "
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontWeight: 600,
              }}
            >
              {member.name}
            </h2>
          </div>

          {/* divisor */}

          <div
            className="
              flex
              items-center
              justify-center
              gap-4
              mb-6
            "
          >
            <span
              className="
                h-px
                w-16
                bg-[#B8872E]
              "
            />

            <CrossIcon width={8} height={16} fill="#B8872E" />

            <span
              className="
                h-px
                w-16
                bg-[#B8872E]
              "
            />
          </div>

          {/* biografia */}

          <p
            className="
              text-[#5A463B]
              text-base
              leading-relaxed
              text-justify
            "
            style={{
              fontFamily: "Cormorant Garamond, serif",
            }}
          >
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
    <section
      className="
        relative
        overflow-hidden
        bg-[#F8F3EC]
        pt-16
        md:pt-24
        pb-16
        md:pb-36
      "
    >
      <div
        className="
          max-w-320
          mx-auto
          px-6
          pb-10
          relative
          overflow-hidden
          z-10
        "
      >
        {/* Header */}

        <div className="mb-14">
          <div
            className="
              flex
              items-center
              gap-3
              mb-4
            "
          >
            <span className="h-px w-12 bg-[#B8872E]" />

            <p
              className="
                text-[#B8872E]
                uppercase
                tracking-[0.35em]
                text-sm
              "
              style={{
                fontFamily: "Cormorant Garamond, serif",
              }}
            >
              Clero
            </p>

            <span className="h-px w-12 bg-[#B8872E]" />
          </div>

          <h2
            className="
              text-[#18351E]
              text-3xl lg:text-4xl
              font-semibold
            "
            style={{
              fontFamily: "Cormorant Garamond, serif",
            }}
          >
            Servos da Igreja
          </h2>

          <p
            className="
              mt-5
              text-[#5A463B]
              text-lg
            "
            style={{
              fontFamily: "Cormorant Garamond, serif",
            }}
          >
            Conheça aqueles que dedicam suas vidas ao serviço da nossa
            comunidade de fé.
          </p>
        </div>

        {/* Cards */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-4
            gap-6
          "
        >
          {clergy.map((person, i) => (
            <button
              key={i}
              onClick={() => setSelected(person)}
              className="
                group
                relative
                rounded-2xl
                border
                border-[#D6A64A]
                bg-[#fbf4eb]
                p-6
                flex
                flex-col
                items-center
                text-center
                transition-all
                duration-300
                hover:-translate-y-2
                hover:shadow-xl
                cursor-pointer
              "
            >
              {/* Foto */}

              <div
                className="
                  relative
                  size-36
                  md:size-40
                  mb-5
                "
              >
                <div
                  className="
                    absolute
                    inset-0
                    rounded-full
                    border-4
                    border-[#B8872E]
                  "
                />

                <img
                  src={person.img}
                  alt={person.name}
                  className="
                    size-full
                    rounded-full
                    object-cover
                    object-top
                    p-1
                  "
                />

                {/* selo */}

                <div
                  className="
                    absolute
                    -bottom-3
                    left-1/2
                    -translate-x-1/2
                    size-10
                    rounded-full
                    bg-[#18351E]
                    border
                    border-[#D6A64A]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <CrossIcon fill="#D6A64A" width={10} height={20} />
                </div>
              </div>

              {/* cargo */}

              <p
                className="
                  text-[#B8872E]
                  text-xs
                  uppercase
                  tracking-widest
                  mb-2
                "
                style={{
                  fontWeight: 600,
                }}
              >
                {person.role}
              </p>

              {/* nome */}

              <h3
                className="
                  text-[#18351E]
                  text-xl
                  leading-tight
                "
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontWeight: 600,
                }}
              >
                {person.name}
              </h3>

              {/* detalhe */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                  mt-5
                "
              >
                <span className="h-px w-8 bg-[#B8872E]" />

                <CrossIcon width={8} height={16} fill="#B8872E" />

                <span className="h-px w-8 bg-[#B8872E]" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Onda decorativa inferior */}
      <div
        className="
          absolute
          bottom-0
          left-0
          w-[calc(100%+4cm)]
          max-w-none
          ml-[-2cm]
          aspect-[1536/296]
          bg-[url('/wave-separator.svg')]
          bg-no-repeat
          bg-center
          bg-cover
        "
      />

      {selected && (
        <CleroModal member={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
