"use client";

import { useEffect, useState } from "react";
import { X, ExternalLink, AlertTriangle, Info, Sparkles } from "lucide-react";
import { apiBaseUrl } from "@/lib/api/utils/api";
import type { UrgentAlert } from "@/entities/UrgentAlert";

interface UrgentAlertModalProps {
  alert: UrgentAlert;
  isOpen: boolean;
  onClose: () => void;
}

export function UrgentAlertModal({ alert, isOpen, onClose }: UrgentAlertModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const getImageUrl = (id: string | null | undefined) => {
    if (!id) return "";
    if (id.startsWith("http://") || id.startsWith("https://") || id.startsWith("/")) {
      return id;
    }
    return `${apiBaseUrl}/attachments/${id}`;
  };

  const variantStyles = {
    alert: {
      badge: "bg-[#7d1d15] text-[#fde8e4] border-red-800/40",
      icon: AlertTriangle,
      label: "AVISO URGENTE",
      accent: "#85261d",
    },
    info: {
      badge: "bg-[#143321] text-[#e8f5ec] border-emerald-800/40",
      icon: Info,
      label: "COMUNICADO PAROQUIAL",
      accent: "#18351E",
    },
    solemnity: {
      badge: "bg-[#634515] text-[#fff6e0] border-amber-600/40",
      icon: Sparkles,
      label: "SOLENIDADE / FESTA",
      accent: "#B8872E",
    },
  };

  const currentVariant = variantStyles[alert.variant] || variantStyles.alert;
  const VariantIcon = currentVariant.icon;

  const imageUrl = getImageUrl(alert.modalImageId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#fbf6ee] rounded-2xl shadow-2xl border border-[#d8cbb8] overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5d8c5] bg-[#f4ebe0]/80">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider border shadow-2xs ${currentVariant.badge}`}
            >
              <VariantIcon className="w-3 h-3" />
              {currentVariant.label}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Title */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#14201d] leading-tight">
              {alert.modalTitle || alert.text}
            </h2>
            <div className="w-16 h-1 bg-[#B8872E] mt-3 rounded-full" />
          </div>

          {/* Cartaz / Arte / Flyer se houver */}
          {imageUrl && (
            <div className="w-full rounded-xl overflow-hidden border border-[#d8cbb8] shadow-md bg-stone-100 flex items-center justify-center">
              <img
                src={imageUrl}
                alt={alert.modalTitle || "Cartaz de divulgação"}
                className="w-full max-h-[460px] object-contain"
              />
            </div>
          )}

          {/* Description Text */}
          <div className="text-stone-800 text-base leading-relaxed whitespace-pre-wrap font-sans">
            {alert.modalDescription || alert.text}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#f4ebe0] border-t border-[#e5d8c5] flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-semibold text-stone-600 hover:bg-stone-200/60 transition-colors"
          >
            Fechar
          </button>

          {alert.modalActionUrl && alert.modalActionText && (
            <a
              href={alert.modalActionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#18351E] hover:bg-[#234b2b] text-[#fbf6ee] text-xs font-bold transition-all shadow-sm"
            >
              {alert.modalActionText}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
