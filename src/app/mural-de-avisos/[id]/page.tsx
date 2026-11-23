"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Info,
  Sparkles,
  Pin,
  Clock,
  ExternalLink,
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
    <section className="relative overflow-hidden bg-[#fbf6ee] min-h-screen">
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-36">
        {/* Breadcrumb */}
        <nav className="text-sm text-[#8c7b6c] mb-2 flex items-center gap-2 font-medium flex-wrap">
          <Link href="/" className="hover:text-[#2d261e] transition-colors">
            Início
          </Link>
          <span>&gt;</span>
          <Link
            href="/mural-de-avisos"
            className="hover:text-[#2d261e] transition-colors"
          >
            Mural de Avisos
          </Link>
          {notice && (
            <>
              <span>&gt;</span>
              <span className="text-[#2d261e] line-clamp-1">{notice.title}</span>
            </>
          )}
        </nav>

        {isPending ? (
          <div className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-2xl p-8 space-y-4 max-w-4xl">
            <div className="h-6 w-36 bg-[#ECD6BD]/50 rounded-full animate-pulse" />
            <div className="h-9 w-3/4 bg-[#ECD6BD]/50 rounded-lg animate-pulse" />
            <div className="h-48 w-full bg-[#ECD6BD]/50 rounded-xl animate-pulse" />
          </div>
        ) : isError || !notice ? (
          <div className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-2xl p-10 text-center space-y-3 max-w-3xl">
            <h1 className="text-2xl font-serif font-bold text-[#18351E]">
              Aviso não encontrado
            </h1>
            <p className="text-sm text-[#6b5c4d]">
              Este aviso pode ter sido removido ou expirado.
            </p>
            <div className="pt-2">
              <Link
                href="/mural-de-avisos"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#18351E] hover:bg-[#234b2b] text-[#fbf6ee] text-sm font-semibold transition-colors"
              >
                Ver todos os avisos
              </Link>
            </div>
          </div>
        ) : (
          (() => {
            const style = variantStyles[notice.variant] || variantStyles.info;
            const VariantIcon = style.icon;
            const imageUrl = getImageUrl(notice.imageId);
            const publishedAt = formatDate(notice.createdAt);
            const endsAt = formatDate(notice.endsAt);

            return (
              <div className="max-w-4xl">
                {/* Page Header */}
                <div className="mb-8">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider border ${style.badge}`}
                    >
                      <VariantIcon className="w-3 h-3" />
                      {style.label}
                    </span>

                    {notice.pinned && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#ECD6BD]/80 text-[#634515]">
                        <Pin className="w-3 h-3" />
                        FIXADO
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#18351E] leading-tight">
                    {notice.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#6b5c4d] mt-3">
                    {publishedAt && <span>Publicado em {publishedAt}</span>}
                    {endsAt && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Válido até {endsAt}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Card */}
                <article className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm space-y-6">
                  {imageUrl && (
                    <div className="w-full rounded-xl overflow-hidden border border-[#D6A64A]/30 bg-stone-100">
                      <img
                        src={imageUrl}
                        alt={notice.title}
                        className="w-full h-auto block"
                      />
                    </div>
                  )}

                  <div className="text-[#2d261e] text-base leading-relaxed whitespace-pre-wrap font-sans">
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
                </article>
              </div>
            );
          })()
        )}
      </div>
    </section>
  );
}
