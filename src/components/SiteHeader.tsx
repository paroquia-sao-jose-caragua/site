"use client";

import { useState, useEffect, useRef } from "react";
import {
  Heart,
  ChevronDown,
  ChevronRight,
  BookOpen,
  MessageCircle,
  Calendar,
  CalendarCheck,
  Download,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink } from "./ui/nav-link";
import { useCommunities } from "@/lib/api/communities/use-communities";
import { useClergy } from "@/lib/api/clergy/use-clergy";
import { getClergyPhotoUrl, getClergyRoleLabel } from "@/lib/utils/clergy";

const navItems = [
  { label: "Início", to: "/" },
  { label: "Comunidades", to: "/comunidades", dropdownType: "communities" as const },
  { label: "Clérigos", to: "/clerigos", dropdownType: "clergy" as const },
  { label: "Agenda", to: "/agenda", dropdownType: "agenda" as const },
  { label: "Liturgia Diária", to: "/liturgia" },
  { label: "Contato", to: "/contato" },
];

const secondaryNavItems = [
  { label: "Liturgia Diária", to: "/liturgia", icon: BookOpen },
  { label: "Contato", to: "/contato", icon: MessageCircle },
];

const getCommunityCoverUrl = (comm: {
  slug: string;
  coverUrl?: string;
  coverId?: string;
}) => {
  if (comm.coverUrl) return comm.coverUrl;
  if (comm.coverId) {
    if (comm.coverId.startsWith("http") || comm.coverId.startsWith("/")) {
      return comm.coverId;
    }
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
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

export function SiteHeader() {
  const pathname = usePathname();
  const { communities } = useCommunities();
  const { clergy } = useClergy();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [clergyDropdownOpen, setClergyDropdownOpen] = useState(false);
  const [agendaDropdownOpen, setAgendaDropdownOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);
  }, []);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const clergyDropdownRef = useRef<HTMLDivElement>(null);
  const agendaDropdownRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clergyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const agendaTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const moreTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        clergyDropdownRef.current &&
        !clergyDropdownRef.current.contains(event.target as Node)
      ) {
        setClergyDropdownOpen(false);
      }
      if (
        agendaDropdownRef.current &&
        !agendaDropdownRef.current.contains(event.target as Node)
      ) {
        setAgendaDropdownOpen(false);
      }
      if (
        moreDropdownRef.current &&
        !moreDropdownRef.current.contains(event.target as Node)
      ) {
        setMoreOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 150);
  };

  const handleClergyMouseEnter = () => {
    if (clergyTimeoutRef.current) clearTimeout(clergyTimeoutRef.current);
    setClergyDropdownOpen(true);
  };

  const handleClergyMouseLeave = () => {
    clergyTimeoutRef.current = setTimeout(() => {
      setClergyDropdownOpen(false);
    }, 150);
  };

  const handleAgendaMouseEnter = () => {
    if (agendaTimeoutRef.current) clearTimeout(agendaTimeoutRef.current);
    setAgendaDropdownOpen(true);
  };

  const handleAgendaMouseLeave = () => {
    agendaTimeoutRef.current = setTimeout(() => {
      setAgendaDropdownOpen(false);
    }, 150);
  };

  const handleMoreMouseEnter = () => {
    if (moreTimeoutRef.current) clearTimeout(moreTimeoutRef.current);
    setMoreOpen(true);
  };

  const handleMoreMouseLeave = () => {
    moreTimeoutRef.current = setTimeout(() => {
      setMoreOpen(false);
    }, 150);
  };

  const isCommunitiesActive = pathname.startsWith("/comunidades");
  const isClergyActive = pathname.startsWith("/clerigos");
  const isAgendaActive =
    pathname.startsWith("/agenda") || pathname.startsWith("/agendamentos");
  const isSecondaryActive = secondaryNavItems.some((item) =>
    pathname.startsWith(item.to)
  );

  return (
    <header className="sticky top-0 z-30">
      <div className="flex items-start">
        <div
          className={'relative flex-1 bg-[#fbf5eb] min-w-0 border-b border-[#D6A64A] transition-all duration-300 ease-in-out shadow-md bg-[#fbf5eb]/95 backdrop-blur-md'}
        >
          <div
            className={'max-w-324 mx-auto px-4 sm:px-6 flex items-center justify-between transition-all duration-300 ease-in-out h-14 min-[950px]:h-[72px]'}
          >
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <img
                src="/logo-mark.png"
                alt="Paróquia São José"
                className={'w-auto transition-all duration-300 ease-in-out object-contain h-10 min-[950px]:h-14'}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden min-[950px]:flex items-center gap-1">
              {/* 1. Início (sempre visível) */}
              <NavLink
                href="/"
                end
                className="px-3.5 py-1.5 text-md font-semibold rounded-lg"
              >
                Início
              </NavLink>

              {/* 2. Comunidades (sempre visível com dropdown) */}
              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`px-3.5 py-1.5 text-md font-semibold rounded-lg inline-flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    isCommunitiesActive
                      ? "bg-[#B8872E]/15 text-[#8c6218]"
                      : "text-[#32402A] hover:text-[#B8872E] hover:bg-[#B8872E]/8"
                  }`}
                >
                  <span>Comunidades</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu Comunidades */}
                {dropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-80 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-2xl shadow-xl p-2 text-[#18351E]">
                      <div className="space-y-1 max-h-[380px] overflow-y-auto">
                        {communities && communities.length > 0 ? (
                          communities.map((comm) => {
                            const isMatriz =
                              comm.type === "parish_church" ||
                              comm.name
                                .toLowerCase()
                                .includes("matriz");
                            const isActiveCommunity =
                              pathname === `/comunidades/${comm.slug}`;
                            const coverUrl = getCommunityCoverUrl(comm);

                            return (
                              <Link
                                key={comm.id}
                                href={`/comunidades/${comm.slug}`}
                                onClick={() => setDropdownOpen(false)}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all group/item ${
                                  isActiveCommunity
                                    ? "bg-[#ECD6BD]/55 text-[#18351E]"
                                    : "text-[#18351E] hover:bg-[#ECD6BD]/40"
                                }`}
                              >
                                <div
                                  className={`size-11 rounded-lg overflow-hidden shrink-0 border transition-all ${
                                    isActiveCommunity
                                      ? "border-[#B8872E]/60 ring-1 ring-[#B8872E]/40"
                                      : "border-[#D6A64A]/30 group-hover/item:border-[#B8872E]/50"
                                  }`}
                                >
                                  <img
                                    src={coverUrl}
                                    alt={comm.name}
                                    className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="font-semibold text-md leading-snug line-clamp-1 font-serif">
                                    {comm.name}
                                  </span>
                                  <span
                                    className={`text-sm line-clamp-1 ${
                                      isActiveCommunity
                                        ? "text-[#5A463B]"
                                        : "text-[#736254] group-hover/item:text-[#5A463B]"
                                    }`}
                                  >
                                    {isMatriz
                                      ? "Igreja Matriz"
                                      : "Capela"}
                                  </span>
                                </div>
                              </Link>
                            );
                          })
                        ) : (
                          <div className="p-3 text-center text-sm text-[#736254]">
                            Carregando comunidades...
                          </div>
                        )}
                      </div>

                      <div className="pt-1 mt-1 border-t border-[#D6A64A]/20">
                        <Link
                          href="/comunidades"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-[#8c6218] hover:text-[#18351E] rounded-lg transition-colors"
                        >
                          <span>Ver todas as comunidades</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Clérigos (sempre visível com dropdown) */}
              <div
                ref={clergyDropdownRef}
                className="relative"
                onMouseEnter={handleClergyMouseEnter}
                onMouseLeave={handleClergyMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setClergyDropdownOpen(!clergyDropdownOpen)}
                  className={`px-3.5 py-1.5 text-md font-semibold rounded-lg inline-flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    isClergyActive
                      ? "bg-[#B8872E]/15 text-[#8c6218]"
                      : "text-[#32402A] hover:text-[#B8872E] hover:bg-[#B8872E]/8"
                  }`}
                >
                  <span>Clérigos</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      clergyDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu Clérigos */}
                {clergyDropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-80 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-2xl shadow-xl p-2 text-[#18351E]">
                      <div className="space-y-1 max-h-[380px] overflow-y-auto">
                        {clergy && clergy.length > 0 ? (
                          <>
                            {clergy.map((item) => {
                              const isActiveClergy =
                                pathname === `/clerigos/${item.slug}`;
                              const photoUrl = getClergyPhotoUrl(item);
                              const role = getClergyRoleLabel(
                                item.position,
                                item.roleName,
                                item.title,
                              );

                              return (
                                <Link
                                  key={item.id}
                                  href={`/clerigos/${item.slug}`}
                                  onClick={() => setClergyDropdownOpen(false)}
                                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all group/item ${
                                    isActiveClergy
                                      ? "bg-[#ECD6BD]/55 text-[#18351E]"
                                      : "text-[#18351E] hover:bg-[#ECD6BD]/40"
                                  }`}
                                >
                                  <div
                                    className={`size-11 rounded-lg overflow-hidden shrink-0 border transition-all bg-[#f0e6d6] ${
                                      isActiveClergy
                                        ? "border-[#B8872E]/60 ring-1 ring-[#B8872E]/40"
                                        : "border-[#D6A64A]/30 group-hover/item:border-[#B8872E]/50"
                                    }`}
                                  >
                                    <img
                                      src={photoUrl}
                                      alt={item.name}
                                      className="w-full h-full object-cover object-top group-hover/item:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="font-semibold text-md leading-snug line-clamp-1 font-serif">
                                      {item.name}
                                    </span>
                                    <span
                                      className={`text-sm line-clamp-1 ${
                                        isActiveClergy
                                          ? "text-[#5A463B]"
                                          : "text-[#736254] group-hover/item:text-[#5A463B]"
                                      }`}
                                    >
                                      {role}
                                    </span>
                                  </div>
                                </Link>
                              );
                            })}

                            <div className="pt-1 mt-1 border-t border-[#D6A64A]/20">
                              <Link
                                href="/clerigos"
                                onClick={() => setClergyDropdownOpen(false)}
                                className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-[#8c6218] hover:text-[#18351E] rounded-lg transition-colors"
                              >
                                <span>Ver todos os clérigos</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </>
                        ) : (
                          <div className="p-3 text-center text-sm text-[#736254]">
                            Carregando clérigos...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Agenda com Submenus */}
              <div
                ref={agendaDropdownRef}
                className="relative"
                onMouseEnter={handleAgendaMouseEnter}
                onMouseLeave={handleAgendaMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setAgendaDropdownOpen(!agendaDropdownOpen)}
                  className={`px-3.5 py-1.5 text-md font-semibold rounded-lg inline-flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    isAgendaActive
                      ? "bg-[#B8872E]/15 text-[#8c6218]"
                      : "text-[#32402A] hover:text-[#B8872E] hover:bg-[#B8872E]/8"
                  }`}
                >
                  <span>Agenda</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      agendaDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu Agenda */}
                {agendaDropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-80 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-2xl shadow-xl p-2 text-[#18351E]">
                      <div className="space-y-1">
                        <Link
                          href="/agenda"
                          onClick={() => setAgendaDropdownOpen(false)}
                          className={`flex items-start gap-3 p-3 rounded-xl transition-all group/item ${
                            pathname === "/agenda"
                              ? "bg-[#ECD6BD]/55 text-[#18351E]"
                              : "text-[#18351E] hover:bg-[#ECD6BD]/40"
                          }`}
                        >
                          <div
                            className={`p-2.5 rounded-lg shrink-0 transition-colors ${
                              pathname === "/agenda"
                                ? "bg-[#ECD6BD]/80 text-[#18351E]"
                                : "bg-[#D6A64A]/20 text-[#B8872E] group-hover/item:bg-[#ECD6BD]/70 group-hover/item:text-[#18351E]"
                            }`}
                          >
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-md leading-snug font-serif">
                              Programação da Paróquia
                            </span>
                            <span
                              className={`text-sm line-clamp-1 ${
                                pathname === "/agenda"
                                  ? "text-[#5A463B]"
                                  : "text-[#736254] group-hover/item:text-[#5A463B]"
                              }`}
                            >
                              Horários de missas e eventos
                            </span>
                          </div>
                        </Link>

                        <Link
                          href="/agendamentos"
                          onClick={() => setAgendaDropdownOpen(false)}
                          className={`flex items-start gap-3 p-3 rounded-xl transition-all group/item ${
                            pathname === "/agendamentos"
                              ? "bg-[#ECD6BD]/55 text-[#18351E]"
                              : "text-[#18351E] hover:bg-[#ECD6BD]/40"
                          }`}
                        >
                          <div
                            className={`p-2.5 rounded-lg shrink-0 transition-colors ${
                              pathname === "/agendamentos"
                                ? "bg-[#ECD6BD]/80 text-[#18351E]"
                                : "bg-[#D6A64A]/20 text-[#B8872E] group-hover/item:bg-[#ECD6BD]/70 group-hover/item:text-[#18351E]"
                            }`}
                          >
                            <CalendarCheck className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-md leading-snug font-serif">
                              Agendar Atendimento
                            </span>
                            <span
                              className={`text-sm line-clamp-1 ${
                                pathname === "/agendamentos"
                                  ? "text-[#5A463B]"
                                  : "text-[#736254] group-hover/item:text-[#5A463B]"
                              }`}
                            >
                              Confissões e visitas pastorais
                            </span>
                          </div>
                        </Link>
                      </div>

                      <div className="pt-1 mt-1 border-t border-[#D6A64A]/20">
                        <Link
                          href="/agendamentos/acompanhar"
                          onClick={() => setAgendaDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-[#8c6218] hover:text-[#18351E] rounded-lg transition-colors"
                        >
                          <span>Acompanhar agendamento</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Menu Mais com Submenu */}
              <div
                ref={moreDropdownRef}
                className="relative"
                onMouseEnter={handleMoreMouseEnter}
                onMouseLeave={handleMoreMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setMoreOpen(!moreOpen)}
                  className={`px-3.5 py-1.5 text-md font-semibold rounded-lg inline-flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    isSecondaryActive
                      ? "bg-[#B8872E]/15 text-[#8c6218]"
                      : "text-[#32402A] hover:text-[#B8872E] hover:bg-[#B8872E]/8"
                  }`}
                >
                  <span>Mais</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      moreOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Submenu Mais */}
                {moreOpen && (
                  <div className="absolute top-full right-0 pt-2 w-56 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-2xl shadow-xl p-2 text-[#18351E]">
                      <div className="space-y-0.5">
                        {secondaryNavItems.map((item) => {
                          const isActive = pathname.startsWith(item.to);
                          const Icon = item.icon;

                          return (
                            <Link
                              key={item.label}
                              href={item.to}
                              onClick={() => setMoreOpen(false)}
                              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-md transition-all group/item ${
                                isActive
                                  ? "bg-[#ECD6BD]/55 text-[#18351E]"
                                  : "text-[#18351E] hover:bg-[#ECD6BD]/40"
                              }`}
                            >
                              <div
                                className={`size-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                  isActive
                                    ? "bg-[#ECD6BD]/80 text-[#18351E]"
                                    : "bg-[#D6A64A]/20 text-[#B8872E] group-hover/item:bg-[#ECD6BD]/70 group-hover/item:text-[#18351E]"
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className="font-semibold text-md font-serif">
                                {item.label}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 8. Botão Quero Contribuir */}
              <Link
                href="/quero-contribuir"
                className="ml-2 inline-flex items-center justify-center gap-2 bg-[#18351E] hover:bg-[#27442A] text-[#eeca94] hover:text-[#eeca94] border border-[#D6A64A]/40 text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm"
              >
                <Heart size={14} className="fill-[#eeca94] text-[#eeca94]" />
                Quero contribuir
              </Link>
            </nav>

            {/* Mobile PWA Download Button (visible only in browser, hidden when installed as standalone) */}
            {!isStandalone && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-pwa-notification-prompt"));
                }}
                aria-label="Baixar aplicativo"
                className="min-[950px]:hidden inline-flex items-center gap-1.5 px-2 py-1.5 -mr-2 text-sm font-semibold text-[#18351E] hover:text-[#B8872E] transition-colors cursor-pointer"
              >
                <Download size={18} />
                <span>Baixar App</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
