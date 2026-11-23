"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Info,
  Sparkles,
  Pin,
  ChevronRight,
  Clock,
} from "lucide-react";
import { getActiveNotices } from "@/lib/api/notices/getActive";
import { apiBaseUrl } from "@/lib/api/utils/api";
import type { Notice } from "@/entities/Notice";

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
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-36">
        {/* Breadcrumb */}
        <nav className="text-sm text-[#8c7b6c] mb-2 flex items-center gap-2 font-medium">
          <Link href="/" className="hover:text-[#2d261e] transition-colors">
            Início
          </Link>
          <span>&gt;</span>
          <span className="text-[#2d261e]">Mural de Avisos</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#18351E]">
            Mural de Avisos
          </h1>
          <p className="text-sm md:text-base text-[#6b5c4d] mt-2 max-w-2xl">
            Comunicados, orientações e avisos importantes da Paróquia São José.
          </p>
        </div>

        {isPending ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-[#fbf5eb] animate-pulse border border-[#D6A64A]/30"
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
          <div className="space-y-4">
            {notices.map((notice: Notice) => {
              const style = variantStyles[notice.variant] || variantStyles.info;
              const VariantIcon = style.icon;
              const imageUrl = getImageUrl(notice.imageId);
              const publishedAt = formatDate(notice.createdAt);
              const endsAt = formatDate(notice.endsAt);

              return (
                <Link
                  key={notice.id}
                  href={`/mural-de-avisos/${notice.id}`}
                  className="block bg-[#fbf5eb] border border-[#D6A64A]/40 hover:border-[#B8872E] rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    {imageUrl && (
                      <div className="w-full sm:w-48 aspect-video sm:aspect-4/3 rounded-xl overflow-hidden border border-[#D6A64A]/30 bg-stone-100 shrink-0">
                        <img
                          src={imageUrl}
                          alt={notice.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider border ${style.badge}`}
                          >
                            <VariantIcon className="w-3 h-3" />
                            {style.label}
                          </span>

                          {notice.pinned && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ECD6BD]/80 text-[#634515]">
                              <Pin className="w-2.5 h-2.5" />
                              FIXADO
                            </span>
                          )}
                        </div>

                        <h2 className="text-xl font-serif font-bold text-[#18351E] group-hover:text-[#8c6218] transition-colors leading-snug">
                          {notice.title}
                        </h2>

                        <p className="text-sm sm:text-base text-[#5A463B] line-clamp-2 leading-relaxed">
                          {notice.summary || notice.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#D6A64A]/20 text-xs text-[#736254]">
                        <div className="flex flex-wrap items-center gap-3">
                          {publishedAt && (
                            <span>Publicado em {publishedAt}</span>
                          )}
                          {endsAt && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              Válido até {endsAt}
                            </span>
                          )}
                        </div>

                        <span className="inline-flex items-center gap-1 font-semibold text-[#8c6218] group-hover:text-[#18351E] transition-colors">
                          Ler aviso
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
