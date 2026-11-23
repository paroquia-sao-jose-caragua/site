"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getNoticeById } from "@/lib/api/notices/getById";
import { apiBaseUrl } from "@/lib/api/utils/api";

export default function NoticeDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const { data, isPending, isError } = useQuery({
    queryKey: ["notice", id],
    queryFn: () => getNoticeById(id),
    enabled: Boolean(id),
  });

  const notice = data?.notice;

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/mural-de-avisos");
    }
  };

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

  return (
    <section className="relative overflow-hidden bg-[#fbf6ee] min-h-screen">
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-36">
        {/* Botão Voltar */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5A463B] hover:text-[#18351E] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>

        {isPending ? (
          <div className="space-y-4 py-4">
            <div className="h-10 w-3/4 mx-auto bg-[#ECD6BD]/50 rounded-lg animate-pulse" />
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

            return (
              <article className="space-y-8">
                {/* Page Header Centralizado */}
                <header className="text-center">
                  <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#18351E] leading-tight">
                    {notice.title}
                  </h1>
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
