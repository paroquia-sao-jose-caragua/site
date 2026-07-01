import { useState } from "react";
import {
  X,
  MapPin,
  CalendarIcon,
  Map as MapIcon,
  Copy,
  Check,
  ClockIcon,
} from "lucide-react";
import type { Community } from "../data/agendaData";

import { useRouter } from "next/navigation";
import { CrossIcon } from "./icons/CrossIcon";

interface CommunityModalProps {
  community: Community;
  onClose: () => void;
}

export function CommunityModal({ community, onClose }: CommunityModalProps) {
  const router = useRouter();

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
        z-52
        flex
        items-center
        justify-center
        p-5
        max-h-screen
      "
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        // Close modal when pressing Escape or Enter/Space while focus is on the overlay
        if (e.key === "Escape") {
          onClose();
        }
        if (
          (e.key === "Enter" || e.key === " ") &&
          e.target === e.currentTarget
        ) {
          onClose();
        }
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
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onKeyDown={(e) => {
          // Close modal when pressing Escape or Enter/Space while focus is on the overlay
          if (e.key === "Escape") {
            onClose();
          }
          if (
            (e.key === "Enter" || e.key === " ") &&
            e.target === e.currentTarget
          ) {
            onClose();
          }
        }}
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
        {/* decoração topo */}
        <div
          className="
            h-2
            bg-[#B8872E]
          "
        />

        <button
          type="button"
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
            p-4
            sm:p-8
            text-center
            overflow-y-auto
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
              src={community.coverUrl}
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

          <p
            className="mt-2 text-lg leading-snug text-[#5A463B]"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Confira os horários de missa na agenda do dia, pois pode haver
            ajuste pontual.
          </p>

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

          {/* horários de missa */}

          <div
            className="
              mt-6
              mb-4
              rounded-2xl
              text-left
            "
          >
            <div className="flex items-start gap-2">
              <ClockIcon size={18} className="mt-0.5 shrink-0 text-[#B8872E]" />
              <p
                className="text-lg leading-snug text-[#5A463B]"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                <span className="font-semibold">Horários de Missa</span>{" "}
              </p>
            </div>

            <p
              className="text-md leading-snug text-[#5A463B] ml-[27px]"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              <span className="font-light whitespace-pre-line">
                {community.massTimes.join("\n")}
              </span>
            </p>
          </div>

          {/* endereço */}

          <div
            className="
              flex
              flex-col
              items-start
              text-left
              mb-6
            "
          >
            <div className="flex items-start gap-2">
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
                leading-normal
              "
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                }}
              >
                <span className="font-semibold">Endereço</span>{" "}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-1 ml-[27px]">
              <p
                className="
                flex-1
                text-[#5A463B]
                text-md
                leading-normal
              "
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                }}
              >
                {community.address}
              </p>
              <button
                type="button"
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
            <MapIcon size={16} />
            Abrir no Mapa
          </a>

          {/* agenda */}

          <button
            type="button"
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
            <CalendarIcon size={16} />
            Ver Agenda
          </button>
        </div>
      </div>
    </div>
  );
}
