"use client";

import { useState } from "react";
import { X, MapPin, Clock, Map, Copy, Check } from "lucide-react";
import { communities, type Community } from "../data/agendaData";

import { useRouter } from "next/navigation";
import { BotanicalDivider } from "./icons/BotanicalDivider";
import { CrossIcon } from "./icons/CrossIcon";

const communityImages: Record<string, string> = {
  psj: "/Desktop5/e1d50cae9fab58435153a4c41bbf85789ad42f26.png",
  cse: "/Desktop5/05954d1396cd22d752a9383cc71f05004fb83a94.png",
  cnsr: "/Desktop5/7387a98bd8b87ea87349155d8dcfa3b57becde99.png",
  csf: "/Desktop5/8923874a787fb8983e3c782e8248f74411a5c7b1.png",
  cscj: "/Desktop5/455ffb51a3b40639c1fdae0be7b7b8c147a6c4b4.png",
};

interface CommunityModalProps {
  community: Community;
  onClose: () => void;
}

function CommunityModal({ community, onClose }: CommunityModalProps) {
  const router = useRouter();
  const img = communityImages[community.id];

  const [copied, setCopied] = useState(false);

  const handleViewSchedule = () => {
    onClose();
    router.push(`/agenda?comunidade=${community.id}`);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(community.address).catch(() => {});
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    community.address,
  )}`;

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
      {/* overlay */}
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
          overflow-hidden
          rounded-3xl
          bg-[#FBF8F3]
          border
          border-[#D6A64A]
          shadow-2xl
        "
      >
        {/* decoração topo */}
        <div
          className="
            h-2
            bg-[#B8872E]
          "
        />

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

        <div
          className="
            p-8
            text-center
          "
        >
          {/* imagem */}

          <div
            className="
              relative
              mx-auto
              size-32
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
              src={img}
              alt={community.name}
              className="
                size-full
                rounded-full
                object-cover
                p-1
              "
            />
          </div>

          {/* título */}

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
            {community.name}
          </h2>

          <div
            className="
              flex
              items-center
              justify-center
              gap-3
              my-5
            "
          >
            <span
              className="
              h-px
              w-14
              bg-[#B8872E]
            "
            />

            <CrossIcon width={8} height={16} fill="#B8872E" />

            <span
              className="
              h-px
              w-14
              bg-[#B8872E]
            "
            />
          </div>

          {/* endereço */}

          <div
            className="
              flex
              items-start
              gap-3
              text-left
              mb-6
            "
          >
            <MapPin
              size={18}
              className="
                text-[#B8872E]
                mt-1
              "
            />

            <p
              className="
                flex-1
                text-[#5A463B]
                text-lg
                leading-relaxed
              "
              style={{
                fontFamily: "Cormorant Garamond, serif",
              }}
            >
              {community.address}
            </p>

            <button
              onClick={handleCopyAddress}
              className="
                size-8
                rounded-lg
                border
                border-[#D6A64A]
                text-[#B8872E]
                flex
                items-center
                justify-center
              "
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>

          {/* mapa */}

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex
              items-center
              justify-center
              gap-2
              w-full
              py-3
              rounded-xl
              border
              border-[#B8872E]
              text-[#18351E]
              mb-3
              hover:bg-[#F2E9DA]
              transition
            "
          >
            <Map size={16} />
            Abrir no Mapa
          </a>

          {/* agenda */}

          <button
            onClick={handleViewSchedule}
            className="
              flex
              items-center
              justify-center
              gap-2
              w-full
              py-3
              rounded-xl
              bg-[#18351E]
              text-[#F8F3EC]
              hover:bg-[#102516]
              transition
            "
          >
            <Clock size={16} />
            Ver Horários de Missa
          </button>
        </div>
      </div>
    </div>
  );
}

export function CommunitiesSection() {
  const [selected, setSelected] = useState<Community | null>(null);

  return (
    <section
      id="comunidades"
      className="communities-section relative overflow-hidden pt-16 lg:pt-0 pb-24 lg:pb-36 z-1"
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
                  src={communityImages[c.id]}
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
        <CommunityModal
          community={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
