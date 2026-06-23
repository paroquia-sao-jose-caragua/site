import { Schedule } from "@/entities/CalendarSchedule";
import { Community } from "@/entities/Community";
import { Check, Copy, MapPin, X } from "lucide-react";
import { useState } from "react";
import { CrossIcon } from "./icons/CrossIcon";

type AgendaSectionEvent = {
  id: string;
  date: string;
  type: Schedule["type"];
  title?: string;
  massType?: "ordinary" | "devotional" | "solemnity" | "sacramental";
  eventType?:
    | "mass"
    | "pilgrimage"
    | "service"
    | "formation"
    | "feast"
    | "anniversary"
    | "conference"
    | "meeting"
    | "celebration"
    | "retreat"
    | "liturgical_event"
    | "ordination"
    | "community_event"
    | "other";
  isPrecept?: boolean;
  customLocation?: string;
  orientations?: string;
  time: string;
  name: string;
  location: string;
  community: {
    id: string;
    type: Community["type"];
    coverUrl: string;
    name: string;
    address: string;
  };
};

interface ScheduleModalProps {
  schedule: AgendaSectionEvent;
  onClose: () => void;
}

function getMassTypeLabel(massType?: AgendaSectionEvent["massType"]) {
  switch (massType) {
    case "devotional":
      return "Missa Devocional";

    case "solemnity":
      return "Solenidade";

    case "sacramental":
      return "Missa Sacramental";

    default:
      return null;
  }
}

export function ScheduleModal({ schedule, onClose }: ScheduleModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(schedule.community.address).catch(() => {});
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    schedule.community.address,
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
      <div
        className="
          absolute
          inset-0
          bg-[#18351E]/60
          backdrop-blur-sm
        "
        onClick={onClose}
      />

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
        <div className="h-2 bg-[#B8872E]" />

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

        <div className="p-8">
          {/* Evento */}
          <div className="flex flex-col items-center text-center mb-6">
            <img
              src={schedule.community.coverUrl}
              alt={schedule.community.name}
              className="
                size-20
                rounded-full
                object-cover
                border
                border-[#D6A64A]
                shrink-0
                mb-2
              "
            />

            {schedule?.massType === "solemnity" && (
              <span
                className="
                  text-[#B8872E]
                  text-sm
                  uppercase
                  tracking-widest
                  font-semibold
                "
              >
                ✦ Solenidade ✦
              </span>
            )}

            <h2
              className="
                text-[#18351E]
                text-3xl
                leading-tight
              "
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontWeight: 600,
              }}
            >
              {schedule.name}
            </h2>

            {(schedule.type === "mass" || schedule.eventType === "mass") &&
            schedule.massType !== "ordinary" &&
            schedule.massType !== "solemnity" &&
            getMassTypeLabel(schedule.massType) ? (
              <p className="text-lg">{`${getMassTypeLabel(schedule.massType)}${schedule.title ? `: ${schedule.title}` : ""}`}</p>
            ) : null}

            {schedule?.massType === "solemnity" && schedule?.title ? (
              <p className="text-lg">{`Título: ${schedule.title}`}</p>
            ) : null}

            <p
              className="
                mt-3
                text-[#B8872E]
                text-lg
              "
            >
              {schedule.time}
            </p>
          </div>

          {/* divisor */}
          <div
            className="
              flex
              items-center
              justify-center
              gap-3
              mb-6
            "
          >
            <span className="h-px w-14 bg-[#B8872E]" />

            <CrossIcon width={8} height={16} fill="#B8872E" />

            <span className="h-px w-14 bg-[#B8872E]" />
          </div>

          {/* celebração preceitual */}
          {schedule?.isPrecept ? (
            <div className="mb-6">
              <p
                className="
                  text-[#18351E]
                  text-xl
                  font-semibold
                  mb-2
                "
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Celebração Preceitual
              </p>
              <p
                className="
                  text-[#5A463B]
                  text-lg
                  leading-relaxed
                "
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Esta celebração é preceitual, ou seja, cumpre preceito o fiel
                católico que a participar dela.
              </p>
            </div>
          ) : null}

          {/* orientações */}
          {schedule?.orientations ? (
            <div className="mb-6">
              <h3
                className="
                  text-[#18351E]
                  text-xl
                  font-semibold
                  mb-2
                "
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Orientações:
              </h3>
              <p
                className="
                  text-[#5A463B]
                  text-lg
                  leading-relaxed
                "
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                {schedule.orientations}
              </p>
            </div>
          ) : null}

          {/* endereço ações */}
          <div
            className="
              flex
              items-center
              gap-3
              mb-6
              rounded-xl
            "
          >
            <div className="min-w-0">
              <div
                className="
                  flex
                  items-start
                  gap-3
                  mb-1
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
                    text-[#18351E]
                    text-xl
                    leading-tight
                  "
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontWeight: 600,
                  }}
                >
                  {schedule.community.type === "parish_church"
                    ? "Paróquia Matriz "
                    : "Capela "}
                  {schedule.community.name}
                </p>
              </div>

              <div
                className="
                  flex
                  items-start
                  gap-3
                "
              >
                <p
                  className="
                    flex-1
                    text-[#5A463B]
                    text-md
                    leading-relaxed
                  "
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                  }}
                >
                  {schedule.customLocation || schedule.community.address}
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
            </div>
          </div>
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
              hover:bg-[#F2E9DA]
              transition
            "
          >
            <MapPin size={16} />
            Abrir no Mapa
          </a>
        </div>
      </div>
    </div>
  );
}
