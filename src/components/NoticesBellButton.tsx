"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { getActiveNotices } from "@/lib/api/notices/getActive";
import { NoticesBellModal } from "./NoticesBellModal";

export function NoticesBellButton() {
  const [modalOpen, setModalOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["active-notices"],
    queryFn: getActiveNotices,
  });

  const notices = data?.notices ?? [];

  if (notices.length === 0) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
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

      <NoticesBellModal
        notices={notices}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
