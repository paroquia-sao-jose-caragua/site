"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  AlertTriangle,
  Info,
  Sparkles,
  Pin,
  ChevronRight,
  Clock,
  ArrowLeft,
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
    if (id.startsWith("http://") || id.startsWith("https://") || id.startsWith("/")) {
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
    <main className="min-h-screen bg-[#fbf6ee] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5A463B] hover:text-[#18351E] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#18351E] text-[#eeca94] flex items-center justify-center shrink-0 shadow-sm">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#14201d]">
                Mural de Avisos
              </h1>
              <p className="text-sm sm:text-base text-[#5A463B]">
                Comunicados, orientações e avisos importantes da Paróquia São José
              </p>
            </div>
          </div>
          <div className="w-20 h-1 bg-[#B8872E] mt-4 rounded-full" />
        </div>

        {isPending ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-[#f4ebe0] animate-pulse border border-[#e5d8c5]"
              />
            ))}
          </div>
        ) : notices.length === 0 ? (
          <div className="bg-white border border-[#e5d8c5] rounded-2xl p-10 text-center space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-[#f4ebe0] text-[#5A463B] flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-serif font-bold text-[#14201d]">
              Nenhum aviso ativo no momento
            </h2>
            <p className="text-sm text-[#5A463B] max-w-md mx-auto">
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
                  className="block bg-white border border-[#e5d8c5] hover:border-[#B8872E] rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    {imageUrl && (
                      <div className="w-full sm:w-44 aspect-video sm:aspect-4/3 rounded-xl overflow-hidden border border-[#e5d8c5] bg-stone-100 shrink-0">
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
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ECD6BD]/70 text-[#634515]">
                              <Pin className="w-2.5 h-2.5" />
                              FIXADO
                            </span>
                          )}
                        </div>

                        <h2 className="text-xl font-serif font-bold text-[#14201d] group-hover:text-[#18351E] leading-snug">
                          {notice.title}
                        </h2>

                        <p className="text-sm sm:text-base text-stone-600 line-clamp-2 leading-relaxed">
                          {notice.summary || notice.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#f4ebe0] text-xs text-[#736254]">
                        <div className="flex flex-wrap items-center gap-3">
                          {publishedAt && <span>Publicado em {publishedAt}</span>}
                          {endsAt && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              Válido até {endsAt}
                            </span>
                          )}
                        </div>

                        <span className="inline-flex items-center gap-1 font-semibold text-[#18351E] group-hover:text-[#B8872E]">
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
    </main>
  );
}
