"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  AlertTriangle,
  Info,
  Sparkles,
  Pin,
  Clock,
  ExternalLink,
  Bell,
} from "lucide-react";
import { getNoticeById } from "@/lib/api/notices/getById";
import { apiBaseUrl } from "@/lib/api/utils/api";

const variantStyles = {
  alert: {
    badge: "bg-[#7d1d15] text-[#fde8e4] border-red-800/40",
    icon: AlertTriangle,
    label: "AVISO URGENTE",
  },
  info: {
    badge: "bg-[#143321] text-[#e8f5ec] border-emerald-800/40",
    icon: Info,
    label: "COMUNICADO PAROQUIAL",
  },
  solemnity: {
    badge: "bg-[#634515] text-[#fff6e0] border-amber-600/40",
    icon: Sparkles,
    label: "SOLENIDADE / FESTA",
  },
};

export default function NoticeDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data, isPending, isError } = useQuery({
    queryKey: ["notice", id],
    queryFn: () => getNoticeById(id),
    enabled: Boolean(id),
  });

  const notice = data?.notice;

  const getImageUrl = (imageId?: string | null) => {
    if (!imageId) return "";
    if (
      imageId.startsWith("http://") ||
      imageId.startsWith("https://") ||
      imageId.startsWith("/")
    ) {
      return imageId;
    }
    return `${apiBaseUrl}/attachments/${imageId}`;
  };

  const formatDate = (iso?: string | null) => {
    if (!iso) return null;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-[#fbf6ee] pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <Link
          href="/mural-de-avisos"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5A463B] hover:text-[#18351E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Mural de Avisos
        </Link>

        {isPending ? (
          <div className="bg-white border border-[#e5d8c5] rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="h-6 w-36 bg-[#f4ebe0] rounded-full animate-pulse" />
            <div className="h-9 w-3/4 bg-[#f4ebe0] rounded-lg animate-pulse" />
            <div className="h-48 w-full bg-[#f4ebe0] rounded-xl animate-pulse" />
          </div>
        ) : isError || !notice ? (
          <div className="bg-white border border-[#e5d8c5] rounded-2xl p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#f4ebe0] text-[#5A463B] flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#14201d]">
              Aviso não encontrado
            </h1>
            <p className="text-sm text-[#5A463B]">
              Este aviso pode ter sido removido ou expirado.
            </p>
            <div className="pt-2">
              <Link
                href="/mural-de-avisos"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#18351E] text-[#fbf6ee] text-sm font-semibold"
              >
                Ver todos os avisos
              </Link>
            </div>
          </div>
        ) : (
          <article className="bg-white border border-[#e5d8c5] rounded-2xl overflow-hidden shadow-sm">
            {(() => {
              const style = variantStyles[notice.variant] || variantStyles.info;
              const VariantIcon = style.icon;
              const imageUrl = getImageUrl(notice.imageId);
              const publishedAt = formatDate(notice.createdAt);
              const endsAt = formatDate(notice.endsAt);

              return (
                <>
                  <div className="px-6 sm:px-8 py-5 bg-[#f4ebe0]/70 border-b border-[#e5d8c5] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider border ${style.badge}`}
                      >
                        <VariantIcon className="w-3 h-3" />
                        {style.label}
                      </span>

                      {notice.pinned && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#ECD6BD]/70 text-[#634515]">
                          <Pin className="w-3 h-3" />
                          FIXADO
                        </span>
                      )}
                    </div>

                    {endsAt && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#5A463B]">
                        <Clock className="w-3.5 h-3.5" />
                        Válido até {endsAt}
                      </span>
                    )}
                  </div>

                  <div className="p-6 sm:p-8 space-y-6">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#14201d] leading-tight">
                        {notice.title}
                      </h1>
                      {publishedAt && (
                        <p className="text-xs text-[#736254] mt-2">
                          Publicado em {publishedAt}
                        </p>
                      )}
                      <div className="w-16 h-1 bg-[#B8872E] mt-3 rounded-full" />
                    </div>

                    {imageUrl && (
                      <div className="w-full rounded-xl overflow-hidden border border-[#d8cbb8] bg-stone-100">
                        <img
                          src={imageUrl}
                          alt={notice.title}
                          className="w-full h-auto block"
                        />
                      </div>
                    )}

                    <div className="text-stone-800 text-base leading-relaxed whitespace-pre-wrap font-sans">
                      {notice.description}
                    </div>

                    {notice.actionUrl && notice.actionText && (
                      <div className="pt-2">
                        <a
                          href={notice.actionUrl}
                          target={
                            notice.actionUrl.startsWith("http")
                              ? "_blank"
                              : undefined
                          }
                          rel={
                            notice.actionUrl.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#18351E] hover:bg-[#234b2b] text-[#fbf6ee] text-sm font-bold transition-all shadow-sm"
                        >
                          <span>{notice.actionText}</span>
                          {notice.actionUrl.startsWith("http") && (
                            <ExternalLink className="w-4 h-4" />
                          )}
                        </a>
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </article>
        )}
      </div>
    </main>
  );
}
