"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  Bell,
  AlertTriangle,
  Info,
  Sparkles,
  Pin,
  ChevronRight,
  ArrowRight,
  Clock,
} from "lucide-react";
import type { Notice } from "@/entities/Notice";

interface NoticesBellModalProps {
  notices: Notice[];
  isOpen: boolean;
  onClose: () => void;
}

const variantStyles = {
  alert: {
    badge: "bg-[#7d1d15] text-[#fde8e4] border-red-800/40",
    icon: AlertTriangle,
    label: "URGENTE",
  },
  info: {
    badge: "bg-[#143321] text-[#e8f5ec] border-emerald-800/40",
    icon: Info,
    label: "COMUNICADO",
  },
  solemnity: {
    badge: "bg-[#634515] text-[#fff6e0] border-amber-600/40",
    icon: Sparkles,
    label: "SOLENIDADE",
  },
};

export function NoticesBellModal({
  notices,
  isOpen,
  onClose,
}: NoticesBellModalProps) {
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

  const formatEndsAt = (iso?: string | null) => {
    if (!iso) return null;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Avisos Paroquiais em Andamento"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Full Container */}
      <div className="relative w-full h-full sm:h-auto sm:max-w-xl bg-[#fbf6ee] rounded-none sm:rounded-2xl shadow-2xl border-0 sm:border sm:border-[#d8cbb8] overflow-hidden z-10 flex flex-col sm:max-h-[85vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#e5d8c5] bg-[#f4ebe0] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#18351E] text-[#eeca94] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#18351E] leading-tight">
                Mural de Avisos
              </h2>
              <p className="text-xs text-[#5A463B]">
                {notices.length}{" "}
                {notices.length === 1
                  ? "aviso em andamento"
                  : "avisos em andamento"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#5A463B] hover:text-[#18351E] transition-colors cursor-pointer"
            aria-label="Fechar janela de avisos"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Avisos */}
        <div className="p-4 sm:p-6 flex-1 min-h-0 overflow-y-auto space-y-3">
          {notices.map((notice) => {
            const style = variantStyles[notice.variant] || variantStyles.info;
            const VariantIcon = style.icon;
            const endsAtLabel = formatEndsAt(notice.endsAt);

            return (
              <Link
                key={notice.id}
                href={`/mural-de-avisos/${notice.id}`}
                onClick={onClose}
                className="block rounded-xl bg-white border border-[#e5d8c5] hover:border-[#B8872E] p-4 shadow-2xs transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider border ${style.badge}`}
                      >
                        <VariantIcon className="w-3 h-3" />
                        {style.label}
                      </span>

                      {notice.pinned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECD6BD]/70 text-[#634515]">
                          <Pin className="w-2.5 h-2.5" />
                          FIXADO
                        </span>
                      )}

                      {endsAtLabel && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#736254]">
                          <Clock className="w-3 h-3" />
                          Até {endsAtLabel}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-serif font-bold text-[#14201d] group-hover:text-[#18351E] leading-snug">
                      {notice.title}
                    </h3>

                    <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed">
                      {notice.summary || notice.description}
                    </p>
                  </div>

                  <ChevronRight className="w-5 h-5 text-[#B8872E] shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 pb-8 sm:pb-4 bg-[#f4ebe0] border-t border-[#e5d8c5] flex flex-col-reverse sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full text-sm font-semibold text-stone-600 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            Fechar
          </button>

          <Link
            href="/mural-de-avisos"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#18351E] hover:bg-[#234b2b] text-[#fbf6ee] text-sm font-bold transition-all shadow-sm"
          >
            <span>Ver Mural de Avisos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
