"use client";

import { Schedule } from "@/entities/CalendarSchedule";
import { Community } from "@/entities/Community";
import {
  Check,
  Copy,
  ExternalLink,
  Info,
  MapPin,
  Navigation,
  Sparkles,
  X,
} from "lucide-react";
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

  const addressToUse = schedule.customLocation || schedule.community.address;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(addressToUse).catch(() => {});
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    addressToUse
  )}`;

  const communityDisplayName = `${
    schedule.community.type === "parish_church"
      ? "Paróquia Matriz "
      : "Capela "
  }${schedule.community.name}`;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#18351E]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card (mesmo layout e ocupação do DirectionsModal) */}
      <div
        className="relative w-full h-full sm:h-auto sm:max-w-lg sm:max-h-[90vh] overflow-hidden rounded-none sm:rounded-3xl bg-[#FBF8F3] border-0 sm:border sm:border-[#D6A64A]/60 shadow-2xl flex flex-col z-10 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Border */}
        <div className="h-2 bg-[#B8872E] w-full shrink-0" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-[#5A463B] hover:text-[#18351E] transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X size={22} />
        </button>

        <div className="p-6 pb-24 sm:p-8 sm:pb-8 text-center flex-1 min-h-0 overflow-y-auto">
          {/* Cabeçalho centralizado: Título e Horário */}
          {schedule?.massType === "solemnity" && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3ece0] text-[#B8872E] text-sm font-semibold uppercase tracking-wider mb-3 border border-[#D6A64A]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#B8872E]" />
              <span>Solenidade</span>
            </div>
          )}

          <h3
            className="text-2xl sm:text-3xl font-semibold text-[#18351E] leading-tight"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {schedule.name}
          </h3>

          {(schedule.type === "mass" || schedule.eventType === "mass") &&
          schedule.massType !== "ordinary" &&
          schedule.massType !== "solemnity" &&
          getMassTypeLabel(schedule.massType) ? (
            <p
              className="text-base sm:text-lg text-[#5A463B] font-serif mt-1"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              {`${getMassTypeLabel(schedule.massType)}${schedule.title ? `: ${schedule.title}` : ""}`}
            </p>
          ) : null}

          {schedule?.massType === "solemnity" && schedule?.title ? (
            <p
              className="text-base sm:text-lg text-[#5A463B] font-serif mt-1"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              {schedule.title}
            </p>
          ) : null}

          <p className="mt-2 text-base sm:text-lg font-semibold text-[#B8872E]">
            {schedule.time}
          </p>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-3 my-4">
            <span className="h-px w-12 bg-[#B8872E]/40" />
            <CrossIcon width={8} height={16} fill="#B8872E" />
            <span className="h-px w-12 bg-[#B8872E]/40" />
          </div>

          {/* Celebração Preceitual Box */}
          {schedule?.isPrecept && (
            <div className="rounded-2xl bg-white/90 border border-[#D6A64A]/40 p-4 text-left shadow-xs mb-4">
              <span className="text-[11px] font-bold text-[#B8872E] uppercase tracking-wider block mb-1">
                ✦ Celebração Preceitual
              </span>
              <p className="text-sm font-medium text-[#18351E] leading-relaxed">
                Esta celebração é preceitual, ou seja, cumpre preceito o fiel católico que participar dela.
              </p>
            </div>
          )}

          {/* Orientações Box */}
          {schedule?.orientations && (
            <div className="rounded-2xl bg-white/90 border border-[#D6A64A]/40 p-4 text-left shadow-xs mb-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Info className="w-3.5 h-3.5 text-[#B8872E]" />
                <span className="text-[11px] font-bold text-[#B8872E] uppercase tracking-wider">
                  Orientações
                </span>
              </div>
              <p className="text-sm font-medium text-[#18351E] leading-relaxed whitespace-pre-line">
                {schedule.orientations}
              </p>
            </div>
          )}

          {/* Address Box (idêntico ao DirectionsModal) */}
          <div className="rounded-2xl bg-white/90 border border-[#D6A64A]/40 p-5 text-left shadow-xs mb-5">
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin className="w-3.5 h-3.5 text-[#B8872E]" />
              <span className="text-[11px] font-bold text-[#B8872E] uppercase tracking-wider">
                {communityDisplayName}
              </span>
            </div>
            <p className="text-sm sm:text-base font-medium text-[#18351E] leading-relaxed select-all">
              {addressToUse}
            </p>

            {/* Copy Button */}
            <div className="mt-4 pt-3 border-t border-[#D6A64A]/20">
              <button
                type="button"
                onClick={handleCopyAddress}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  copied
                    ? "bg-emerald-50 border border-emerald-400 text-emerald-800"
                    : "bg-[#fbf5eb] border border-[#D6A64A] text-[#18351E] hover:bg-[#f3ece0]"
                }`}
              >
                {copied ? (
                  <>
                    <Check size={15} className="text-emerald-600" />
                    <span>Endereço copiado com sucesso!</span>
                  </>
                ) : (
                  <>
                    <Copy size={15} className="text-[#B8872E]" />
                    <span>Copiar endereço</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#18351E] hover:bg-[#27442A] text-[#eeca94] text-sm font-semibold transition-all shadow-md cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-[#eeca94]" />
              <span>Abrir no Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-0.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
