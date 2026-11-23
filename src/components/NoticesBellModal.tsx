"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X, Bell, ChevronRight, ArrowRight } from "lucide-react";
import type { Notice } from "@/entities/Notice";

interface NoticesBellModalProps {
  notices: Notice[];
  isOpen: boolean;
  onClose: () => void;
}

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

  return createPortal(
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
      <div className="relative w-full h-full sm:h-auto sm:max-w-xl bg-[#fbf6ee] rounded-none sm:rounded-2xl shadow-2xl border-0 sm:border sm:border-[#D6A64A]/40 overflow-hidden z-10 flex flex-col sm:max-h-[85vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#D6A64A]/30 bg-[#f4ebe0] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#D6A64A]/20 text-[#8c6218] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#2d261e] leading-tight">
                Mural de Avisos
              </h2>
              <p className="text-xs text-[#6b5c4d]">
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
            className="p-2 text-[#5A463B] hover:text-[#2d261e] transition-colors cursor-pointer"
            aria-label="Fechar janela de avisos"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Avisos */}
        <div className="p-4 sm:p-6 flex-1 min-h-0 overflow-y-auto space-y-3">
          {notices.map((notice) => (
            <Link
              key={notice.id}
              href={`/mural-de-avisos/${notice.id}`}
              onClick={onClose}
              className="block rounded-2xl bg-[#fbf5eb] border border-[#D6A64A]/40 hover:border-[#B8872E] p-4 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="space-y-1.5">
                <h3 className="text-base font-serif font-bold text-[#2d261e] group-hover:text-[#8c6218] transition-colors leading-snug">
                  {notice.title}
                </h3>

                <p className="text-sm text-[#5A463B] line-clamp-2 leading-relaxed">
                  {notice.summary || notice.description}
                </p>
              </div>

              <div className="flex items-center justify-end pt-2.5 mt-3 border-t border-[#D6A64A]/20">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#8c6218] group-hover:text-[#2d261e] transition-colors">
                  Ler mais
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 pb-8 sm:pb-4 bg-[#f4ebe0] border-t border-[#D6A64A]/30 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full text-sm font-semibold text-[#5A463B] hover:bg-[#ECD6BD]/50 transition-colors cursor-pointer"
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
    </div>,
    document.body
  );
}
