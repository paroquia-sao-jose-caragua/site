"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getActiveUrgentAlert } from "@/lib/api/urgent-alert/getActive";
import { UrgentAlertModal } from "./UrgentAlertModal";
import { AlertTriangle, Info, Sparkles, ArrowRight, X } from "lucide-react";
import type { UrgentAlert } from "@/entities/UrgentAlert";

export function UrgentAlertBar() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["active-urgent-alert"],
    queryFn: getActiveUrgentAlert,
  });

  const alert: UrgentAlert | null = data?.alert ?? null;

  // Check sessionStorage dismissal
  useEffect(() => {
    if (!alert) return;
    const storageKey = `dismissed_alert_${alert.id}_${alert.updatedAt || alert.createdAt || "default"}`;
    if (sessionStorage.getItem(storageKey) === "true") {
      setIsDismissed(true);
    }
  }, [alert]);

  if (!alert || !alert.active || isDismissed) {
    return null;
  }

  const variantConfigs = {
    alert: {
      barBg: "bg-gradient-to-r from-[#701710] via-[#85261d] to-[#701710] text-[#fff8f2] border-b border-[#a8382c]/40",
      badgeBg: "bg-[#54110a] text-amber-200 border-amber-400/30",
      badgeText: "AVISO URGENTE",
      buttonBg: "bg-amber-400 text-stone-950 hover:bg-amber-300 shadow-sm",
      iconPulse: "text-amber-300 animate-pulse",
    },
    info: {
      barBg: "bg-gradient-to-r from-[#0f2617] via-[#153422] to-[#0f2617] text-[#f4efe6] border-b border-emerald-700/30",
      badgeBg: "bg-[#0b1c11] text-emerald-200 border-emerald-400/30",
      badgeText: "COMUNICADO",
      buttonBg: "bg-[#d4a85c] text-[#0f2617] hover:bg-[#e2bb76] shadow-sm",
      iconPulse: "text-emerald-300",
    },
    solemnity: {
      barBg: "bg-gradient-to-r from-[#523912] via-[#6e4e1a] to-[#523912] text-[#fff8ed] border-b border-amber-500/40",
      badgeBg: "bg-[#3d2a0d] text-amber-200 border-amber-300/40",
      badgeText: "SOLENIDADE",
      buttonBg: "bg-[#f5d470] text-[#332207] hover:bg-[#fae08f] shadow-sm",
      iconPulse: "text-amber-200 animate-pulse",
    },
  };

  const config = variantConfigs[alert.variant] || variantConfigs.alert;

  return (
    <>
      <aside
        aria-label="Aviso Paroquial Urgente"
        className={`relative z-20 w-full shadow-md select-none transition-all ${config.barBg}`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 sm:gap-6">
          {/* Badge fixo à esquerda */}
          <div className="shrink-0 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase border shadow-2xs ${config.badgeBg}`}
            >
              <span className="hidden xs:inline">{config.badgeText}</span>
            </span>
          </div>

          {/* Letreiro Marquee central */}
          <div className="flex-1 overflow-hidden ticker-wrapper relative cursor-pointer" onClick={() => alert.hasModal && setModalOpen(true)}>
            <div className="animate-ticker text-xs sm:text-sm font-medium tracking-wide">
              {/* Repetição para loop contínuo */}
              {[1, 2, 3, 4].map((i) => (
                <span key={i} className="inline-flex items-center gap-4 pr-12">
                  <span>{alert.text}</span>
                  <span className="opacity-50 text-[10px]">☩</span>
                </span>
              ))}
            </div>
          </div>

          {/* Ações à direita */}
          <div className="shrink-0 flex items-center gap-2 sm:gap-3">
            {alert.hasModal && (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1 rounded-full text-xs font-extrabold tracking-wide transition-all transform hover:scale-105 active:scale-95 ${config.buttonBg}`}
              >
                <span>{alert.modalButtonText || "Ver Detalhes"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Modal com detalhes caso habilitado */}
      {alert.hasModal && (
        <UrgentAlertModal
          alert={alert}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
