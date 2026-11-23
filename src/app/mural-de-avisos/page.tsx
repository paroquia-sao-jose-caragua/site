"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Clock } from "lucide-react";
import { getActiveNotices } from "@/lib/api/notices/getActive";
import { apiBaseUrl } from "@/lib/api/utils/api";
import type { Notice } from "@/entities/Notice";

export default function MuralDeAvisosPage() {
  const { data, isPending } = useQuery({
    queryKey: ["active-notices"],
    queryFn: getActiveNotices,
  });

  const notices = data?.notices ?? [];

  const getImageUrl = (id?: string | null) => {
    if (!id) return "";
    if (
      id.startsWith("http://") ||
      id.startsWith("https://") ||
      id.startsWith("/")
    ) {
      return id;
    }
    return `${apiBaseUrl}/attachments/${id}`;
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
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-36">
        {/* Breadcrumb */}
        <nav className="text-sm text-[#8c7b6c] mb-3 flex items-center justify-center gap-2 font-medium">
          <Link href="/" className="hover:text-[#2d261e] transition-colors">
            Início
          </Link>
          <span>&gt;</span>
          <span className="text-[#2d261e]">Mural de Avisos</span>
        </nav>

        {/* Page Header Centralizado */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#18351E]">
            Mural de Avisos
          </h1>
          <p className="text-sm md:text-base text-[#6b5c4d] mt-2 max-w-xl mx-auto">
            Comunicados, orientações e avisos importantes da Paróquia São José.
          </p>
        </div>

        {isPending ? (
          <div className="space-y-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-44 rounded-2xl bg-[#fbf5eb] animate-pulse border border-[#D6A64A]/30"
              />
            ))}
          </div>
        ) : notices.length === 0 ? (
          <div className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-2xl p-10 text-center space-y-2 shadow-xs">
            <h2 className="text-xl font-serif font-bold text-[#18351E]">
              Nenhum aviso ativo no momento
            </h2>
            <p className="text-sm text-[#6b5c4d] max-w-md mx-auto">
              Quando houver novos comunicados paroquiais, eles aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {notices.map((notice: Notice) => {
              const imageUrl = getImageUrl(notice.imageId);
              const publishedAt = formatDate(notice.createdAt);
              const endsAt = formatDate(notice.endsAt);

              return (
                <Link
                  key={notice.id}
                  href={`/mural-de-avisos/${notice.id}`}
                  className="block bg-[#fbf5eb] border border-[#D6A64A]/40 hover:border-[#B8872E] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col sm:flex-row">
                    {imageUrl && (
                      <div className="w-full sm:w-72 md:w-80 aspect-video sm:aspect-auto sm:min-h-[200px] bg-stone-100 shrink-0 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={notice.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0 p-4 sm:p-6 flex flex-col justify-between gap-3">
                      <div className="space-y-1.5 sm:space-y-2">
                        <h2 className="text-lg sm:text-xl font-serif font-bold text-[#18351E] group-hover:text-[#8c6218] transition-colors leading-snug">
                          {notice.title}
                        </h2>

                        <p className="text-sm text-[#5A463B] line-clamp-2 sm:line-clamp-3 leading-relaxed">
                          {notice.summary || notice.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2.5 border-t border-[#D6A64A]/20 text-xs text-[#736254]">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          {publishedAt && <span>{publishedAt}</span>}
                          {endsAt && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              Até {endsAt}
                            </span>
                          )}
                        </div>

                        <span className="inline-flex items-center gap-1 font-semibold text-[#8c6218] group-hover:text-[#18351E] transition-colors shrink-0">
                          Ler mais
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
