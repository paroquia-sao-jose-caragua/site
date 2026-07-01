"use client";

import { useState } from "react";
import { communities, type Community } from "../data/agendaData";

import { CrossIcon } from "./icons/CrossIcon";
import { CommunityModal } from "./CommunityModal";

export function CommunitiesSection() {
  const [selected, setSelected] = useState<Community | null>(null);

  return (
    <section
      id="comunidades"
      className="communities-section relative overflow-hidden pt-16 lg:pt-0 pb-24 lg:pb-36"
    >
      <div className="max-w-320 mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-12 bg-[#B8872E]" />

            <p
              className="text-[#B8872E] uppercase tracking-[0.35em] text-sm"
              style={{
                fontFamily: "Cormorant Garamond, serif",
              }}
            >
              Igreja
            </p>

            <span className="h-px w-12 bg-[#B8872E]" />
          </div>

          <h2
            className="text-[#18351E] text-3xl lg:text-5xl md:text-5xl font-semibold"
            style={{
              fontFamily: "Cormorant Garamond, serif",
            }}
          >
            Conheça Nossas Comunidades
          </h2>

          <p
            className="mt-5 max-w-xl text-[#5A463B] text-xl"
            style={{
              fontFamily: "Cormorant Garamond, serif",
            }}
          >
            Cada comunidade é um pedaço vivo da nossa fé.
            <br />
            Encontre a mais próxima de você e faça parte dessa família.
          </p>
        </div>

        {/* Cards */}
        <div
          className="
          grid 
          grid-cols-1 
          sm:grid-cols-3 
          lg:grid-cols-5 
          gap-6
        "
        >
          {communities.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelected(c)}
              className="
                group
                relative
                rounded-2xl
                border
                border-[#D6A64A]
                bg-[#fbf4eb]/70
                p-5
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
              {/* imagem */}
              <div
                className="
                relative
                size-32
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
                  src={c.coverUrl}
                  alt={c.name}
                  className="
                    size-full
                    rounded-full
                    object-cover
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

              <h3
                className="
                  text-[#18351E]
                  text-lg
                  leading-tight
                "
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontWeight: 600,
                }}
              >
                {c.name}
              </h3>

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

      {/* Rodapé da seção */}
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
          z-1
        "
      />

      {selected && (
        <CommunityModal
          community={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
