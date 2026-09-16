"use client";

import { use } from "react";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Phone,
  Mail,
  Clock,
  Sparkles,
  ChevronRight,
  Heart,
  Users,
  BookOpen,
  Music,
  MessageCircle,
} from "lucide-react";
import { CrossIcon } from "@/components/icons/CrossIcon";
import { getCommunityDetailBySlug } from "@/data/communitiesDetailData";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CommunityDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const community = getCommunityDetailBySlug(resolvedParams.slug);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    community.address
  )}`;

  return (
    <div className="min-h-screen bg-[#fbf6ee] text-[#18351E]">
      <main className="py-8 md:py-14">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-[#736254] font-serif mb-8">
            <Link href="/" className="hover:text-[#B8872E] transition-colors">
              Início
            </Link>
            <ChevronRight className="w-3 h-3 text-[#B8872E]/60" />
            <Link
              href="/comunidades"
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
                <span>COMUNIDADE</span>
              </div>

              <h1
                className="text-4xl md:text-6xl font-semibold text-[#18351E] leading-tight"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                {community.name}
              </h1>

              <p className="text-base md:text-lg text-[#5A463B] font-serif leading-relaxed max-w-xl">
                {community.heroSubtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-3">
                <a
                  href="#horarios"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18351E] text-white text-xs font-semibold hover:bg-[#27442A] transition-all shadow-md"
                >
                  <Calendar className="w-4 h-4 text-[#D6A64A]" />
                  <span>Ver horários de missa</span>
                </a>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#fbf5eb] border border-[#D6A64A] text-[#18351E] text-xs font-semibold hover:bg-[#f3ece0] transition-all shadow-xs"
                >
                  <MapPin className="w-4 h-4 text-[#B8872E]" />
                  <span>Como chegar</span>
                </a>
              </div>
            </div>

            {/* Right Church Photo */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#D6A64A]/40 shadow-xl bg-[#faf8f5]">
                <img
                  src={community.coverUrl}
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
                  Uma família de fé no coração do bairro
                </h2>

                <p className="text-base text-[#5A463B] font-serif leading-relaxed mb-4">
                  {community.aboutParagraph1}
                </p>

                <p className="text-base text-[#5A463B] font-serif leading-relaxed mb-6">
                  {community.aboutParagraph2}
                </p>

                {/* Breve Resumo Histórico */}
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
              </div>

              {/* Padroeiro Card */}
              <div className="p-5 rounded-2xl bg-[#fbf5eb] border border-[#D6A64A]/30 flex items-center gap-4">
                <div className="relative size-16 rounded-full overflow-hidden border-2 border-[#D6A64A] shrink-0 bg-[#efe4d4] flex items-end justify-center">
                  <img
                    src={community.patronImage || "/clergies/paroco.png"}
                    alt={community.patronName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#B8872E] uppercase tracking-widest block">
                    PADROEIRO
                  </span>
                  <h3
                    className="text-xl font-semibold text-[#18351E]"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    {community.patronName}
                  </h3>
                  <p className="text-xs text-[#5A463B] font-serif">
                    {community.patronDescription}
                  </p>
                </div>
              </div>
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
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#B8872E] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#18351E] block text-xs uppercase tracking-wider mb-0.5">
                        Endereço
                      </span>
                      <p className="leading-snug">{community.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#B8872E] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#18351E] block text-xs uppercase tracking-wider mb-0.5">
                        Telefone
                      </span>
                      <p className="leading-snug">{community.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#B8872E] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#18351E] block text-xs uppercase tracking-wider mb-0.5">
                        E-mail
                      </span>
                      <p className="leading-snug">{community.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#B8872E] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#18351E] block text-xs uppercase tracking-wider mb-0.5">
                        Secretaria
                      </span>
                      <p className="leading-snug whitespace-pre-line">
                        {community.officeHours}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#fbf5eb] border border-[#D6A64A] text-[#18351E] text-xs font-semibold hover:bg-[#f3ece0] transition-all"
                  >
                    <MapPin className="w-4 h-4 text-[#B8872E]" />
                    <span>Como chegar</span>
                  </a>
                </div>
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

                <div className="divide-y divide-[#D6A64A]/20">
                  {community.massSchedule.map((item, idx) => (
                    <div
                      key={idx}
                      className="py-3.5 flex items-center justify-between text-sm"
                    >
                      <span className="font-serif text-[#18351E] font-medium">
                        {item.day}
                      </span>
                      <span className="font-mono text-xs font-semibold text-[#B8872E] bg-[#f9f3e9] px-3 py-1 rounded-full border border-[#D6A64A]/30">
                        {item.times}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missa e Devoções da Comunidade */}
              {community.devotions.length > 0 && (
                <div className="lg:col-span-6 bg-[#fbf5eb] border border-[#D6A64A]/30 rounded-3xl p-6 md:p-8">
                  <h3
                    className="text-xl font-semibold text-[#18351E] mb-6 flex items-center gap-2"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    <CrossIcon width={10} height={18} fill="#B8872E" />
                    <span>Missa e Devoções da Comunidade</span>
                  </h3>

                  <div className="space-y-6">
                    {community.devotions.map((dev, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="size-12 rounded-full overflow-hidden border-2 border-[#D6A64A] shrink-0 bg-[#efe4d4] flex items-center justify-center p-1">
                          <CrossIcon width={12} height={20} fill="#B8872E" />
                        </div>
                        <div>
                          <h4
                            className="text-base font-semibold text-[#18351E] mb-1"
                            style={{ fontFamily: "Cormorant Garamond, serif" }}
                          >
                            {dev.title}
                          </h4>
                          <p className="text-xs text-[#5A463B] font-serif leading-relaxed whitespace-pre-line">
                            {dev.schedule}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
            </div>
          </div>

          {/* 4. NOSSA IGREJA (FOTO GALLERY) */}
          {community.type === 'parish_church' && (
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
                  <span>Fotos do espaço</span>
                  {/* <ChevronRight className="w-4 h-4" /> */}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {community.photos.map((item, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#D6A64A]/30 bg-[#fbf5eb] shadow-xs"
                  >
                    <img
                      src={item.url}
                      alt={item.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
                      <span className="text-white text-[11px] font-serif line-clamp-1">
                        {item.caption}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 5. GRUPOS E PASTORAL */}
          {/* <div className="mb-16 md:mb-24">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[#B8872E] text-xs font-bold uppercase tracking-[0.25em] block mb-1">
                  ATUAÇÃO PASTORAL
                </span>
                <h2
                  className="text-3xl md:text-4xl font-semibold text-[#18351E]"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  Grupos e Pastoral
                </h2>
              </div>

              <Link
                href="/contato"
                className="text-xs font-bold text-[#B8872E] hover:text-[#18351E] uppercase tracking-widest flex items-center gap-1 transition-colors"
              >
                <span>Conheça todos os grupos</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {community.pastorals.map((pastoral, idx) => (
                <div
                  key={idx}
                  className="bg-[#fbf5eb] border border-[#D6A64A]/30 rounded-2xl p-6 text-center hover:border-[#B8872E] transition-all hover:shadow-md"
                >
                  <div className="size-12 rounded-2xl bg-[#faf8f5] border border-[#D6A64A]/40 flex items-center justify-center text-[#B8872E] mx-auto mb-4">
                    {idx % 5 === 0 && <CrossIcon width={14} height={22} fill="#B8872E" />}
                    {idx % 5 === 1 && <BookOpen className="w-5 h-5 text-[#B8872E]" />}
                    {idx % 5 === 2 && <Heart className="w-5 h-5 text-[#B8872E]" />}
                    {idx % 5 === 3 && <Users className="w-5 h-5 text-[#B8872E]" />}
                    {idx % 5 === 4 && <Music className="w-5 h-5 text-[#B8872E]" />}
                  </div>

                  <h3
                    className="text-xl font-semibold text-[#18351E] mb-2"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    {pastoral.name}
                  </h3>

                  <p className="text-xs text-[#5A463B] font-serif leading-relaxed">
                    {pastoral.description}
                  </p>
                </div>
              ))}
            </div>
          </div> */}

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
    </div>
  );
}
