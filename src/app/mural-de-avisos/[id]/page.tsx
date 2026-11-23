"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Clock, ExternalLink } from "lucide-react";
import { getNoticeById } from "@/lib/api/notices/getById";
import { apiBaseUrl } from "@/lib/api/utils/api";

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
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-36">
        {/* Breadcrumb */}
        <nav className="text-sm text-[#8c7b6c] mb-4 flex items-center justify-center gap-2 font-medium flex-wrap text-center">
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
          <div className="space-y-4 py-4">
            <div className="h-10 w-3/4 mx-auto bg-[#ECD6BD]/50 rounded-lg animate-pulse" />
            <div className="h-4 w-48 mx-auto bg-[#ECD6BD]/50 rounded animate-pulse" />
            <div className="h-64 w-full bg-[#ECD6BD]/50 rounded-2xl animate-pulse mt-6" />
          </div>
        ) : isError || !notice ? (
          <div className="py-12 text-center space-y-3">
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
            const imageUrl = getImageUrl(notice.imageId);
            const publishedAt = formatDate(notice.createdAt);
            const endsAt = formatDate(notice.endsAt);

            return (
              <article className="space-y-8">
                {/* Page Header Centralizado */}
                <header className="text-center space-y-3">
                  <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#18351E] leading-tight">
                    {notice.title}
                  </h1>

                  {(publishedAt || endsAt) && (
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-[#6b5c4d]">
                      {publishedAt && <span>Publicado em {publishedAt}</span>}
                      {endsAt && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Válido até {endsAt}
                        </span>
                      )}
                    </div>
                  )}
                </header>

                {imageUrl && (
                  <div className="w-full rounded-2xl overflow-hidden bg-stone-100">
                    <img
                      src={imageUrl}
                      alt={notice.title}
                      className="w-full h-auto block"
                    />
                  </div>
                )}

                <div className="text-[#2d261e] text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-sans">
                  {notice.description}
                </div>

                {notice.actionUrl && notice.actionText && (
                  <div className="pt-2 flex justify-center">
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
                      className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#18351E] hover:bg-[#234b2b] text-[#fbf6ee] text-sm font-bold transition-all shadow-sm"
                    >
                      <span>{notice.actionText}</span>
                      {notice.actionUrl.startsWith("http") && (
                        <ExternalLink className="w-4 h-4" />
                      )}
                    </a>
                  </div>
                )}
              </article>
            );
          })()
        )}
      </div>
    </section>
  );
}
