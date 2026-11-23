"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Bell, ChevronRight, ArrowRight } from "lucide-react";
import { getActiveNotices } from "@/lib/api/notices/getActive";
import { NoticesBellModal } from "./NoticesBellModal";

interface NoticesBellButtonProps {
  mode?: "modal" | "popover";
}

export function NoticesBellButton({ mode = "modal" }: NoticesBellButtonProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["active-notices"],
    queryFn: getActiveNotices,
  });

  const notices = data?.notices ?? [];

  useEffect(() => {
    if (mode !== "popover" || !open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mode, open]);

  if (notices.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={`Abrir mural de avisos (${notices.length} ${
          notices.length === 1 ? "aviso" : "avisos"
        })`}
        className="relative inline-flex items-center justify-center p-2 rounded-full text-[#18351E] hover:bg-[#ECD6BD]/50 hover:text-[#B8872E] transition-colors cursor-pointer"
      >
        <Bell size={20} />
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#85261d] text-[#fff8f2] text-[10px] font-extrabold leading-none flex items-center justify-center shadow-xs border border-[#fbf6ee]">
          {notices.length > 9 ? "9+" : notices.length}
        </span>
      </button>

      {mode === "modal" && (
        <NoticesBellModal
          notices={notices}
          isOpen={open}
          onClose={() => setOpen(false)}
        />
      )}

      {mode === "popover" && open && (
        <div className="absolute top-full right-0 pt-2.5 w-96 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="bg-[#fbf6ee] border border-[#D6A64A]/40 rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-[#f4ebe0] border-b border-[#D6A64A]/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#D6A64A]/20 text-[#8c6218] flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <span className="font-serif font-bold text-sm text-[#2d261e]">
                  Mural de Avisos
                </span>
              </div>
              <span className="text-xs text-[#6b5c4d]">
                {notices.length}{" "}
                {notices.length === 1 ? "aviso" : "avisos"}
              </span>
            </div>

            {/* Lista de notificações */}
            <div className="p-3 max-h-80 overflow-y-auto space-y-2.5">
              {notices.map((notice) => (
                <Link
                  key={notice.id}
                  href={`/mural-de-avisos/${notice.id}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl bg-[#fbf5eb] border border-[#D6A64A]/40 hover:border-[#B8872E] p-3.5 shadow-2xs hover:shadow-sm transition-all group"
                >
                  <h4 className="text-sm font-serif font-bold text-[#2d261e] group-hover:text-[#8c6218] transition-colors leading-snug">
                    {notice.title}
                  </h4>
                  <p className="text-xs text-[#5A463B] line-clamp-2 mt-1 leading-relaxed">
                    {notice.summary || notice.description}
                  </p>
                  <div className="flex items-center justify-end pt-2 mt-2 border-t border-[#D6A64A]/20">
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#8c6218] group-hover:text-[#2d261e] transition-colors">
                      Ler mais
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-[#f4ebe0] border-t border-[#D6A64A]/30">
              <Link
                href="/mural-de-avisos"
                onClick={() => setOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-[#18351E] hover:bg-[#234b2b] text-[#fbf6ee] text-xs font-bold transition-all shadow-sm"
              >
                <span>Ver Mural de Avisos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
