"use client";

import { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Copy,
  Check,
  ExternalLink,
  Navigation,
} from "lucide-react";
import { CrossIcon } from "./icons/CrossIcon";

interface DirectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityName: string;
  address: string;
}

export function DirectionsModal({
  isOpen,
  onClose,
  communityName,
  address,
}: DirectionsModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address,
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#18351E]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#FBF8F3] border border-[#D6A64A]/60 shadow-2xl flex flex-col z-10 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Border */}
        <div className="h-2 bg-[#B8872E] w-full" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 size-9 rounded-full bg-[#18351E] text-[#D6A64A] flex items-center justify-center hover:scale-105 transition-all shadow-md cursor-pointer"
          aria-label="Fechar"
        >
          <X size={16} />
        </button>

        <div className="p-6 sm:p-8 text-center">
          {/* Badge & Icon */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3ece0] text-[#B8872E] text-xs font-semibold uppercase tracking-wider mb-3 border border-[#D6A64A]/30">
            <MapPin className="w-3.5 h-3.5 text-[#B8872E]" />
            <span>LOCALIZAÇÃO</span>
          </div>

          <h3
            className="text-2xl sm:text-3xl font-semibold text-[#18351E] leading-tight"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Como chegar
          </h3>

          <p
            className="text-base sm:text-lg text-[#5A463B] font-serif mt-1 mb-4"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {communityName}
          </p>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-3 my-4">
            <span className="h-px w-12 bg-[#B8872E]/40" />
            <CrossIcon width={8} height={16} fill="#B8872E" />
            <span className="h-px w-12 bg-[#B8872E]/40" />
          </div>

          {/* Address Box */}
          <div className="rounded-2xl bg-white/90 border border-[#D6A64A]/40 p-5 text-left shadow-xs mb-5">
            <span className="text-[11px] font-bold text-[#B8872E] uppercase tracking-wider block mb-1">
              Endereço completo
            </span>
            <p className="text-sm sm:text-base font-medium text-[#18351E] leading-relaxed select-all">
              {address}
            </p>

            {/* Copy Button */}
            <div className="mt-4 pt-3 border-t border-[#D6A64A]/20">
              <button
                type="button"
                onClick={handleCopyAddress}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#18351E] hover:bg-[#27442A] text-white text-xs sm:text-sm font-semibold transition-all shadow-md cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-[#D6A64A]" />
              <span>Abrir no Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-0.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
