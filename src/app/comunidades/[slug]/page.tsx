"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Phone,
  Mail,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  ImageIcon,
  X,
} from "lucide-react";
import { CrossIcon } from "@/components/icons/CrossIcon";
import { DirectionsModal } from "@/components/DirectionsModal";
import { useCommunityBySlug } from "@/lib/api/communities/use-community-by-slug";
import { useCommunities } from "@/lib/api/communities/use-communities";
import {
  formatTimesList,
  formatCommunityMassScheduleSummary,
} from "@/lib/utils/formatMassSchedules";
import { useParishContact } from "@/lib/api/parish-contact/use-parish-contact";

const getCoverImageUrl = (comm: {
  slug: string;
  coverUrl?: string;
  coverId?: string;
}) => {
  if (comm.coverUrl) return comm.coverUrl;
  if (comm.coverId) {
    if (comm.coverId.startsWith("http") || comm.coverId.startsWith("/")) {
      return comm.coverId;
    }
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_BASE_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3333";
    return `${apiBaseUrl}/attachments/${comm.coverId}`;
  }
  const localMap: Record<string, string> = {
    "matriz-sao-jose": "/communities/sao-jose.png",
    "nossa-senhora-do-rosario": "/communities/nossa-senhora-do-rosario.jpeg",
    "santa-edwiges": "/communities/santa-edwiges.png",
    "sagrada-familia": "/communities/sagrada-familia.jpeg",
    "sagrado-coracao-de-jesus": "/communities/sagrado-coracao-de-jesus.jpeg",
  };
  return localMap[comm.slug] || "/communities/sao-jose.png";
};

const WEEKDAY_FULL = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const MONTHS_FULL = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CommunityDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { community, isPending, error } = useCommunityBySlug(resolvedParams.slug);
  const { communities } = useCommunities();
  const { contact } = useParishContact();
  const photos = community?.photos || [];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isDirectionsOpen, setIsDirectionsOpen] = useState(false);
  const [isParishDirectionsOpen, setIsParishDirectionsOpen] = useState(false);

  const parishSecretaryAddress =
    contact?.address ||
    "R. Edson dos Santos, 30 — Morro do Algodão, Caraguatatuba - SP, 11671-180";

  const otherCommunities = (communities || []).filter(
    (c) => c.slug !== resolvedParams.slug && c.id !== community?.id
  );

  useEffect(() => {
    const photosCount = photos.length;
    if (lightboxIndex === null || photosCount === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + photosCount) % photosCount : null
        );
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % photosCount : null
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, photos.length]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#fbf6ee] flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 border-3 border-[#B8872E]/30 border-t-[#B8872E] rounded-full animate-spin" />
          <span className="text-sm font-serif text-[#5A463B]">Carregando informações da comunidade...</span>
        </div>
      </div>
    );
  }

  if (!community || error) {
    return (
      <div className="min-h-screen bg-[#fbf6ee] flex items-center justify-center py-20">
        <div className="text-center max-w-md px-6">
          <h2
            className="text-3xl font-semibold text-[#18351E] mb-3"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Comunidade não encontrada
          </h2>
          <p className="text-sm text-[#5A463B] font-serif mb-6">
            A comunidade solicitada não está disponível ou o link está incorreto.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#18351E] text-white text-xs font-semibold hover:bg-[#27442A] transition-all"
          >
            <span>Voltar ao início</span>
          </Link>
        </div>
      </div>
    );
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    community.address || ""
  )}`;

  // Organize ordinary mass schedules by day of week
  const ordinarySchedules = (community.massSchedules || []).filter(
    (s) => (s.type === "ordinary" || s.recurrenceType === "weekly") && s.active !== false
  );

  const weeklyScheduleMap = new Map<number, Set<string>>();
  for (const s of ordinarySchedules) {
    if (typeof s.dayOfWeek === "number") {
      if (!weeklyScheduleMap.has(s.dayOfWeek)) {
        weeklyScheduleMap.set(s.dayOfWeek, new Set());
      }
      for (const t of s.times || []) {
        if (t.startTime) {
          weeklyScheduleMap.get(s.dayOfWeek)!.add(t.startTime);
        }
      }
    }
  }

  const orderedDays = Array.from(weeklyScheduleMap.keys()).sort((a, b) => {
    if (a === 0 && b !== 0) return -1;
    if (b === 0 && a !== 0) return 1;
    if (a === 6 && b !== 6) return -1;
    if (b === 6 && a !== 6) return 1;
    return a - b;
  });

  const devotionalSchedules = (community.massSchedules || []).filter(
    (s) =>
      (s.type === "devotional" ||
        s.type === "solemnity" ||
        s.recurrenceType === "monthly" ||
        s.recurrenceType === "yearly") &&
      s.active !== false
  );

  const aboutParagraphs = community.aboutDescription
    ? community.aboutDescription.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : [];

  return (
    <div className="relative overflow-hidden min-h-screen bg-[#fbf6ee] text-[#18351E] pb-24 md:pb-36">
      <main className="py-8 md:py-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-[#736254] font-serif mb-8">
            <Link href="/" className="hover:text-[#B8872E] transition-colors">
              Início
            </Link>
            <ChevronRight className="w-3 h-3 text-[#B8872E]/60" />
            <Link
              href="/#comunidades"
              className="hover:text-[#B8872E] transition-colors"
            >
              Comunidades
            </Link>
            <ChevronRight className="w-3 h-3 text-[#B8872E]/60" />
            <span className="text-[#18351E] font-medium">
              {community.name}
            </span>
          </nav>

          {/* 1. HERO HEADER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16 md:mb-20">
            {/* Left Info */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fbf5eb] border border-[#D6A64A]/40 text-[#B8872E] text-xs font-semibold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#B8872E]" />
                <span>{community.type === "parish_church" ? "IGREJA MATRIZ" : "COMUNIDADE"}</span>
              </div>

              <h1
                className="text-4xl md:text-6xl font-semibold text-[#18351E] leading-tight"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                {community.name}
              </h1>

              {community.heroSubtitle && (
                <p className="text-base md:text-lg text-[#5A463B] font-serif leading-relaxed max-w-xl">
                  {community.heroSubtitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 pt-3">
                <a
                  href="#horarios"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18351E] text-white text-xs font-semibold hover:bg-[#27442A] transition-all shadow-md"
                >
                  <Calendar className="w-4 h-4 text-[#D6A64A]" />
                  <span>Ver horários de missa</span>
                </a>

                {community.address && (
                  <button
                    type="button"
                    onClick={() => setIsDirectionsOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#fbf5eb] border border-[#D6A64A] text-[#18351E] text-xs font-semibold hover:bg-[#f3ece0] transition-all shadow-xs cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-[#B8872E]" />
                    <span>Como chegar</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Church Photo */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#D6A64A]/40 shadow-xl bg-[#f3ece0]">
                <img
                  src={community.coverUrl || "/pastoral-center.png"}
                  alt={community.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
            </div>
          </div>

          {/* 2. SOBRE A COMUNIDADE + INFORMAÇÕES */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 md:mb-24">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-px w-8 bg-[#B8872E]/40" />
                  <span className="text-[#B8872E] text-xs font-bold uppercase tracking-[0.25em]">
                    SOBRE A COMUNIDADE
                  </span>
                </div>

                <h2
                  className="text-2xl md:text-3xl font-semibold text-[#18351E] mb-4"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {community.aboutTitle || "Uma família de fé no coração do bairro"}
                </h2>

                {aboutParagraphs.length > 0 ? (
                  aboutParagraphs.map((paragraph, idx) => (
                    <p key={idx} className="text-base text-[#5A463B] font-serif leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-base text-[#5A463B] font-serif leading-relaxed mb-4">
                    {community.aboutDescription || "Conheça a história e a vida fraterna da nossa comunidade."}
                  </p>
                )}

                {/* Breve Resumo Histórico */}
                {community.historySummary && (
                  <div className="p-5 rounded-2xl bg-[#fbf5eb] border-l-4 border-[#B8872E] border-y border-r border-[#D6A64A]/30">
                    <h4
                      className="text-lg font-semibold text-[#18351E] mb-1.5 flex items-center gap-2"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      <CrossIcon width={8} height={16} fill="#B8872E" />
                      <span>Breve História da Comunidade</span>
                    </h4>
                    <p className="text-sm text-[#5A463B] font-serif leading-relaxed italic">
                      “{community.historySummary}”
                    </p>
                  </div>
                )}
              </div>

              {/* Padroeiro Card */}
              {community.patronName && (
                <div className="p-5 rounded-2xl bg-[#fbf5eb] border border-[#D6A64A]/30 flex items-center gap-4">
                  <div className="relative size-16 rounded-full overflow-hidden border-2 border-[#D6A64A] shrink-0 bg-[#efe4d4] flex items-end justify-center">
                    <img
                      src={community.patronPhotoUrl || "/clergies/paroco.png"}
                      alt={community.patronName}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#B8872E] uppercase tracking-widest block">
                      PADROEIRO(A)
                    </span>
                    <h3
                      className="text-xl font-semibold text-[#18351E]"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      {community.patronName}
                    </h3>
                    {community.patronDescription && (
                      <p className="text-xs text-[#5A463B] font-serif leading-relaxed">
                        {community.patronDescription}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Informações Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <h3
                  className="text-2xl font-semibold text-[#18351E] pb-4 border-b border-[#D6A64A]/20"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  Informações
                </h3>

                <div className="space-y-5 text-sm text-[#5A463B] font-serif">
                  {community.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#B8872E] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-[#18351E] block text-xs uppercase tracking-wider mb-0.5">
                          Endereço
                        </span>
                        <p className="leading-snug">{community.address}</p>
                      </div>
                    </div>
                  )}

                  {(community.phone || contact?.phone) && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-[#B8872E] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-[#18351E] block text-xs uppercase tracking-wider mb-0.5">
                          Telefone
                        </span>
                        <p className="leading-snug">{community.phone || contact?.phone}</p>
                      </div>
                    </div>
                  )}

                  {(community.email || contact?.email) && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-[#B8872E] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-[#18351E] block text-xs uppercase tracking-wider mb-0.5">
                          E-mail
                        </span>
                        <p className="leading-snug">{community.email || contact?.email}</p>
                      </div>
                    </div>
                  )}

                  {(community.officeHours || contact?.officeHours || community.type === "chapel" || "Terça a sexta-feira: 09h às 12h e 14h às 17h40\nSábado: 08h às 12h") && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-[#B8872E] shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-[#18351E] block text-xs uppercase tracking-wider mb-0.5">
                          Secretaria
                        </span>
                        {community.type === "chapel" ? (
                          <div className="space-y-1">
                            <p className="leading-snug text-sm">
                              Atendimento via Secretaria Paroquial (Matriz)
                            </p>
                            <button
                              type="button"
                              onClick={() => setIsParishDirectionsOpen(true)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B8872E] hover:text-[#18351E] hover:underline cursor-pointer transition-colors pt-0.5"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>Ver horário e endereço</span>
                            </button>
                          </div>
                        ) : (
                          <p className="leading-snug whitespace-pre-line text-sm">
                            {community.officeHours || contact?.officeHours || "Terça a sexta-feira: 09h às 12h e 14h às 17h40\nSábado: 08h às 12h"}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {community.address && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setIsDirectionsOpen(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#fbf5eb] border border-[#D6A64A] text-[#18351E] text-xs font-semibold hover:bg-[#f3ece0] transition-all cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-[#B8872E]" />
                      <span>Como chegar</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. HORÁRIOS DE MISSA & DEVOÇÕES */}
          <div id="horarios" className="scroll-mt-32 mb-16 md:mb-24">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="h-px w-8 bg-[#B8872E]/40" />
                <span className="text-[#B8872E] text-xs font-bold uppercase tracking-[0.25em]">
                  CELEBRAÇÕES
                </span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-semibold text-[#18351E]"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Horários de Missa
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Missas Regulares Table */}
              <div className="lg:col-span-6 bg-[#fbf5eb] border border-[#D6A64A]/30 rounded-3xl p-6 md:p-8">
                <h3
                  className="text-xl font-semibold text-[#18351E] mb-6 flex items-center gap-2"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  <Calendar className="w-5 h-5 text-[#B8872E]" />
                  <span>Missas Regulares</span>
                </h3>

                {orderedDays.length > 0 ? (
                  <div className="divide-y divide-[#D6A64A]/20">
                    {orderedDays.map((day) => {
                      const times = Array.from(weeklyScheduleMap.get(day)!).sort();
                      return (
                        <div
                          key={day}
                          className="py-3.5 flex items-center justify-between text-sm"
                        >
                          <span className="font-serif text-[#18351E] font-medium">
                            {WEEKDAY_FULL[day]}
                          </span>
                          <span className="font-mono text-xs font-semibold text-[#B8872E] bg-[#f9f3e9] px-3 py-1 rounded-full border border-[#D6A64A]/30">
                            {formatTimesList(times)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-[#5A463B] font-serif">
                    Nenhum horário regular cadastrado no momento.
                  </p>
                )}
              </div>

              {/* Missas Devocionais da Comunidade */}
              {devotionalSchedules.length > 0 && (
                <div className="lg:col-span-6 bg-[#fbf5eb] border border-[#D6A64A]/30 rounded-3xl p-6 md:p-8">
                  <h3
                    className="text-xl font-semibold text-[#18351E] mb-6 flex items-center gap-2"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    <CrossIcon width={10} height={18} fill="#B8872E" />
                    <span>Missas Devocionais da Comunidade</span>
                  </h3>

                  <div className="divide-y divide-[#D6A64A]/20">
                    {devotionalSchedules.map((dev, devIdx) => {
                      const times = (dev.times || []).map((t) => t.startTime).filter(Boolean).sort();
                      let recurrenceLabel = "";

                      if (typeof dev.dayOfMonth === "number" && typeof dev.monthOfYear === "number") {
                        recurrenceLabel = `${dev.dayOfMonth} de ${MONTHS_FULL[dev.monthOfYear - 1]}`;
                      } else if (typeof dev.dayOfMonth === "number") {
                        recurrenceLabel = `Dia ${dev.dayOfMonth} de cada mês`;
                      } else if (
                        typeof dev.weekOfMonth === "number" &&
                        typeof dev.dayOfWeek === "number"
                      ) {
                        const weekPrefix = dev.weekOfMonth === 5 ? "Última" : `${dev.weekOfMonth}ª`;
                        recurrenceLabel = `${WEEKDAY_FULL[dev.dayOfWeek]} (${weekPrefix} sem.)`;
                      } else if (typeof dev.dayOfWeek === "number") {
                        recurrenceLabel = `Toda ${WEEKDAY_FULL[dev.dayOfWeek]}`;
                      } else {
                        recurrenceLabel = "Conforme agendamento";
                      }

                      const timesStr = formatTimesList(times);
                      const fullBadge = timesStr ? `${recurrenceLabel} • ${timesStr}` : recurrenceLabel;

                      return (
                        <div
                          key={`${dev.id || "dev"}-${devIdx}`}
                          className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 text-sm"
                        >
                          <div className="flex flex-col">
                            <span className="font-serif text-[#18351E] font-medium text-base">
                              {dev.title || "Celebração Especial"}
                            </span>
                            {dev.orientations && (
                              <span className="text-[11px] text-[#5A463B] font-serif leading-tight mt-0.5">
                                {dev.orientations}
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-xs font-semibold text-[#B8872E] bg-[#f9f3e9] px-3 py-1 rounded-full border border-[#D6A64A]/30 shrink-0 self-start sm:self-auto text-center">
                            {fullBadge}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. GALERIA DE FOTOS */}
          {community.photos && community.photos.length > 0 && (
            <div className="mb-16 md:mb-24">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-[#B8872E] text-xs font-bold uppercase tracking-[0.25em] block mb-1">
                    GALERIA
                  </span>
                  <h2
                    className="text-3xl md:text-4xl font-semibold text-[#18351E]"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    Nossa Igreja
                  </h2>
                </div>

                <span className="text-xs font-bold text-[#B8872E] uppercase tracking-widest hidden sm:inline-flex items-center gap-1">
                  <span>{photos.length} fotos</span>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {photos.map((item, idx) => (
                  <button
                    key={`${item.id || item.photoId || "photo"}-${idx}`}
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#D6A64A]/30 bg-[#fbf5eb] shadow-xs cursor-pointer text-left focus:outline-hidden focus:ring-2 focus:ring-[#B8872E] transition-all hover:scale-[1.02]"
                  >
                    <img
                      src={item.photoUrl || (item.photoId ? `${process.env.NEXT_PUBLIC_BASE_API_URL}/attachments/${item.photoId}` : "")}
                      alt={item.caption || community.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.caption && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
                        <span className="text-white text-[11px] font-serif line-clamp-2">
                          {item.caption}
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Lightbox Modal */}
          {lightboxIndex !== null && photos[lightboxIndex] && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
              onClick={() => setLightboxIndex(null)}
            >
              {/* Top Header */}
              <div
                className="flex items-center justify-between w-full max-w-5xl mx-auto z-10 text-white/90"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-xs font-mono tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  {lightboxIndex + 1} / {photos.length}
                </span>

                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Fechar galeria"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Center Image with Navigation */}
              <div
                className="relative flex items-center justify-center flex-1 max-w-5xl mx-auto w-full my-4"
                onClick={(e) => e.stopPropagation()}
              >
                {photos.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIndex(
                        (lightboxIndex - 1 + photos.length) % photos.length
                      )
                    }
                    className="absolute left-2 sm:left-4 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm border border-white/10 transition-all cursor-pointer hover:scale-105"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                )}

                <img
                  src={
                    photos[lightboxIndex].photoUrl ||
                    (photos[lightboxIndex].photoId
                      ? `${process.env.NEXT_PUBLIC_BASE_API_URL}/attachments/${photos[lightboxIndex].photoId}`
                      : "")
                  }
                  alt={photos[lightboxIndex].caption || `Foto ${lightboxIndex + 1}`}
                  className="max-h-[72vh] max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-200"
                />

                {photos.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIndex((lightboxIndex + 1) % photos.length)
                    }
                    className="absolute right-2 sm:right-4 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm border border-white/10 transition-all cursor-pointer hover:scale-105"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                )}
              </div>

              {/* Bottom Caption */}
              <div
                className="w-full max-w-3xl mx-auto text-center z-10"
                onClick={(e) => e.stopPropagation()}
              >
                {photos[lightboxIndex].caption ? (
                  <p
                    className="text-sm sm:text-base text-white/95 font-serif bg-black/50 px-5 py-2.5 rounded-2xl backdrop-blur-sm inline-block border border-white/10 max-w-2xl"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    {photos[lightboxIndex].caption}
                  </p>
                ) : (
                  <span className="text-xs text-white/60 font-serif">
                    {community.name}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Directions / Como Chegar Modal */}
          {community.address && (
            <DirectionsModal
              isOpen={isDirectionsOpen}
              onClose={() => setIsDirectionsOpen(false)}
              communityName={community.name}
              address={community.address}
            />
          )}

          {/* Directions / Endereço e Horários da Secretaria (Matriz) Modal */}
          <DirectionsModal
            isOpen={isParishDirectionsOpen}
            onClose={() => setIsParishDirectionsOpen(false)}
            title="Secretaria Paroquial"
            badgeText="ATENDIMENTO & ENDEREÇO"
            communityName="Matriz São José"
            address={parishSecretaryAddress}
            officeHours={
              community.officeHours ||
              contact?.officeHours ||
              "Terça a sexta-feira: 09h às 12h e 14h às 17h40\nSábado: 08h às 12h"
            }
          />

          {/* 5. OUTRAS COMUNIDADES */}
          {otherCommunities.length > 0 && (
            <div className="mb-16 md:mb-24 pt-12 md:pt-16 border-t border-[#D6A64A]/25">
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="h-px w-10 bg-[#B8872E]/40" />
                  <div className="flex items-center gap-1.5 text-[#B8872E] text-xs font-semibold uppercase tracking-[0.25em]">
                    <Sparkles className="w-3.5 h-3.5 text-[#B8872E]" />
                    <span>CONHEÇA TAMBÉM</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#B8872E]" />
                  </div>
                  <span className="h-px w-10 bg-[#B8872E]/40" />
                </div>

                <h2
                  className="text-2xl md:text-4xl font-semibold text-[#18351E] mb-2"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  Outras comunidades da nossa paróquia
                </h2>

                <p className="text-xs md:text-sm text-[#5A463B] font-serif leading-relaxed max-w-xl">
                  Nossa paróquia é uma só família reunida em diversas capelas e igrejas. Conheça os horários de missas e as atividades de cada comunidade.
                </p>
              </div>

              {/* Grid Responsivo de Outras Comunidades */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {otherCommunities.map((other) => {
                  const coverUrl = getCoverImageUrl(other);
                  const isMatriz =
                    other.type === "parish_church" ||
                    other.name.toLowerCase().includes("matriz");
                  const massSummary = formatCommunityMassScheduleSummary(other.massSchedules);

                  return (
                    <Link
                      key={other.id}
                      href={`/comunidades/${other.slug || other.id}`}
                      className="group bg-[#fbf5eb] border border-[#D6A64A]/30 hover:border-[#B8872E] rounded-3xl p-4 flex flex-col justify-between text-left shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                    >
                      <div>
                        {/* Capa com Badge */}
                        <div className="h-40 w-full overflow-hidden rounded-2xl bg-[#f3ece0] mb-3.5 relative">
                          <img
                            src={coverUrl}
                            alt={other.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#18351E]/90 backdrop-blur-xs border border-[#D6A64A]/40 text-[#D6A64A] text-[10px] font-semibold tracking-wider uppercase shadow-xs">
                            <span>{isMatriz ? "✦ Matriz" : "✦ Capela"}</span>
                          </div>
                        </div>

                        {/* Nome da Comunidade */}
                        <h3
                          className="text-lg font-semibold text-[#18351E] group-hover:text-[#B8872E] transition-colors leading-snug mb-2.5 line-clamp-2"
                          style={{ fontFamily: "Cormorant Garamond, serif" }}
                        >
                          {other.name}
                        </h3>

                        {/* Informações Rápidas */}
                        <div className="space-y-1.5 text-xs text-[#736254] mb-3">
                          <div className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#B8872E] shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{other.address || "Caraguatatuba / SP"}</span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#B8872E] shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{massSummary}</span>
                          </div>
                        </div>
                      </div>

                      {/* Link / Ação */}
                      <div className="flex items-center justify-between text-xs font-semibold text-[#18351E] group-hover:text-[#B8872E] transition-colors pt-3 border-t border-[#D6A64A]/20 mt-2">
                        <span>Conhecer comunidade</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* 6. BANNER FAÇA PARTE */}
          <div className="rounded-3xl bg-[#18351E] text-white p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 z-10 text-center md:text-left">
              <h3
                className="text-2xl md:text-4xl font-semibold text-[#fbf5eb]"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Faça parte da nossa comunidade!
              </h3>
              <p className="text-sm md:text-base text-[#D6A64A]/90 font-serif max-w-xl">
                Participe das celebrações, grupos de oração e atividades. Todos são bem-vindos!
              </p>
            </div>

            <Link
              href="/contato"
              className="z-10 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#B8872E] hover:bg-[#a37625] text-white text-xs font-semibold transition-all shadow-md shrink-0"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>Falar com a secretaria</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Onda decorativa inferior */}
      <div
        className="
          absolute
          bottom-[-2px]
          left-0
          w-[calc(100%+4cm)]
          max-w-none
          ml-[-2cm]
          aspect-[1536/296]
          bg-[url('/wave-separator.svg')]
          bg-no-repeat
          bg-center
          bg-cover
          pointer-events-none
        "
      />
    </div>
  );
}

