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
      className="fixed inset-0 z-40 flex items-center justify-center p-0 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative w-full h-full sm:h-auto sm:max-w-2xl bg-[#fbf6ee] rounded-none sm:rounded-2xl shadow-2xl border-0 sm:border sm:border-[#d8cbb8] overflow-hidden z-10 sm:my-8 flex flex-col sm:max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5d8c5] bg-[#f4ebe0]/80 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#14201d] leading-tight whitespace-pre-line">
              {alert.modalTitle || alert.text}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#5A463B] hover:text-[#18351E] transition-colors cursor-pointer"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 flex-1 min-h-0 overflow-y-auto space-y-6">
          {/* Cartaz / Arte / Flyer se houver */}
          {imageUrl && (
            <div className="w-full rounded-xl overflow-hidden border border-[#d8cbb8] shadow-md bg-stone-100">
              <img
                src={imageUrl}
                alt={alert.modalTitle || "Cartaz de divulgação"}
                className="w-full h-auto block"
              />
            </div>
          )}

          {/* Description Text */}
          <div className="text-stone-800 text-base leading-relaxed whitespace-pre-wrap font-sans">
            {alert.modalDescription || alert.text}
          </div>
        </div>

        {/* Footer (apenas quando houver botão de ação) */}
        {alert.modalActionUrl && alert.modalActionText && (
          <div className="px-6 py-4 bg-[#f4ebe0] border-t border-[#e5d8c5] flex items-center justify-end shrink-0">
            <a
              href={alert.modalActionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#18351E] hover:bg-[#234b2b] text-[#fbf6ee] text-sm font-bold transition-all shadow-sm"
            >
              {alert.modalActionText}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
