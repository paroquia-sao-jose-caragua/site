"use client";

import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Heart,
  ChevronDown,
  ChevronRight,
  Church,
  BookOpen,
  Users,
  MessageCircle,
  Calendar,
  CalendarCheck,
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCommunitiesOpen, setMobileCommunitiesOpen] = useState(false);
  const [mobileClergyOpen, setMobileClergyOpen] = useState(false);
  const [mobileAgendaOpen, setMobileAgendaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [clergyDropdownOpen, setClergyDropdownOpen] = useState(false);
  const [agendaDropdownOpen, setAgendaDropdownOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const clergyDropdownRef = useRef<HTMLDivElement>(null);
  const agendaDropdownRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clergyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const agendaTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const moreTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header className="sticky top-0 z-50">
      <div className="flex items-start">
        <div
          className={`relative flex-1 bg-[#fbf5eb] min-w-0 border-b border-[#D6A64A] transition-all duration-300 ease-in-out ${
            scrolled ? "shadow-md bg-[#fbf5eb]/95 backdrop-blur-md" : ""
          }`}
        >
          <div
            className={`max-w-324 mx-auto px-6 flex items-center justify-between transition-all duration-300 ease-in-out ${
              scrolled ? "h-[72px]" : "h-24"
            }`}
          >
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <img
                src="/logo-mark.png"
                alt="Paróquia São José"
                className={`w-auto transition-all duration-300 ease-in-out object-contain ${
                  scrolled ? "h-14" : "h-20"
                }`}
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
                                    ? "bg-[#18351E] text-[#eeca94]"
                                    : "text-[#18351E] hover:bg-[#18351E] hover:text-[#eeca94]"
                                }`}
                              >
                                <div
                                  className={`size-9 rounded-lg overflow-hidden shrink-0 border transition-all ${
                                    isActiveCommunity
                                      ? "border-[#eeca94]/60 ring-1 ring-[#eeca94]"
                                      : "border-[#D6A64A]/30 group-hover/item:border-[#eeca94]/50"
                                  }`}
                                >
                                  <img
                                    src={coverUrl}
                                    alt={comm.name}
                                    className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="font-semibold text-[14px] leading-snug line-clamp-1 font-serif">
                                    {comm.name}
                                  </span>
                                  <span
                                    className={`text-[11.5px] line-clamp-1 ${
                                      isActiveCommunity
                                        ? "text-[#eeca94]/70"
                                        : "text-[#736254] group-hover/item:text-[#eeca94]/70"
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
                          <div className="p-3 text-center text-xs text-[#736254]">
                            Carregando comunidades...
                          </div>
                        )}
                      </div>

                      <div className="pt-1 mt-1 border-t border-[#D6A64A]/20">
                        <Link
                          href="/comunidades"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#8c6218] hover:text-[#18351E] rounded-lg transition-colors"
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
                                      ? "bg-[#18351E] text-[#eeca94]"
                                      : "text-[#18351E] hover:bg-[#18351E] hover:text-[#eeca94]"
                                  }`}
                                >
                                  <div
                                    className={`size-9 rounded-lg overflow-hidden shrink-0 border transition-all bg-[#f0e6d6] ${
                                      isActiveClergy
                                        ? "border-[#eeca94]/60 ring-1 ring-[#eeca94]"
                                        : "border-[#D6A64A]/30 group-hover/item:border-[#eeca94]/50"
                                    }`}
                                  >
                                    <img
                                      src={photoUrl}
                                      alt={item.name}
                                      className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="font-semibold text-[14px] leading-snug line-clamp-1 font-serif">
                                      {item.name}
                                    </span>
                                    <span
                                      className={`text-[11.5px] line-clamp-1 ${
                                        isActiveClergy
                                          ? "text-[#eeca94]/70"
                                          : "text-[#736254] group-hover/item:text-[#eeca94]/70"
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
                                className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#8c6218] hover:text-[#18351E] rounded-lg transition-colors"
                              >
                                <span>Ver todos os clérigos</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </>
                        ) : (
                          <div className="p-3 text-center text-xs text-[#736254]">
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
                              ? "bg-[#18351E] text-[#eeca94]"
                              : "text-[#18351E] hover:bg-[#18351E] hover:text-[#eeca94]"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg shrink-0 ${
                              pathname === "/agenda"
                                ? "bg-[#27442A] text-[#eeca94]"
                                : "bg-[#fbf6ee] text-[#B8872E] group-hover/item:bg-[#27442A] group-hover/item:text-[#eeca94]"
                            }`}
                          >
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-sm leading-snug font-serif">
                              Programação Paroquial
                            </span>
                            <span
                              className={`text-[11.5px] line-clamp-1 ${
                                pathname === "/agenda"
                                  ? "text-[#eeca94]/80"
                                  : "text-[#736254] group-hover/item:text-[#eeca94]/80"
                              }`}
                            >
                              Horários de missas e celebrações
                            </span>
                          </div>
                        </Link>

                        <Link
                          href="/agendamentos"
                          onClick={() => setAgendaDropdownOpen(false)}
                          className={`flex items-start gap-3 p-3 rounded-xl transition-all group/item ${
                            pathname === "/agendamentos"
                              ? "bg-[#18351E] text-[#eeca94]"
                              : "text-[#18351E] hover:bg-[#18351E] hover:text-[#eeca94]"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg shrink-0 ${
                              pathname === "/agendamentos"
                                ? "bg-[#27442A] text-[#eeca94]"
                                : "bg-[#fbf6ee] text-[#B8872E] group-hover/item:bg-[#27442A] group-hover/item:text-[#eeca94]"
                            }`}
                          >
                            <CalendarCheck className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-sm leading-snug font-serif">
                              Agendar Atendimento
                            </span>
                            <span
                              className={`text-[11.5px] line-clamp-1 ${
                                pathname === "/agendamentos"
                                  ? "text-[#eeca94]/80"
                                  : "text-[#736254] group-hover/item:text-[#eeca94]/80"
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
                          className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#8c6218] hover:text-[#18351E] rounded-lg transition-colors"
                        >
                          <span>Acompanhar agendamento</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Liturgia Diária (visível em telas >= 1200px) */}
              <NavLink
                href="/liturgia"
                className="hidden min-[1200px]:inline-flex px-3.5 py-1.5 text-md font-semibold rounded-lg"
              >
                Liturgia Diária
              </NavLink>

              {/* 6. Contato (visível em telas >= 1200px) */}
              <NavLink
                href="/contato"
                className="hidden min-[1200px]:inline-flex px-3.5 py-1.5 text-md font-semibold rounded-lg"
              >
                Contato
              </NavLink>

              {/* 7. Menu Mais com Submenu (visível apenas em telas < 1200px) */}
              <div
                ref={moreDropdownRef}
                className="relative min-[1200px]:hidden"
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
                              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all group/item ${
                                isActive
                                  ? "bg-[#18351E] text-[#eeca94]"
                                  : "text-[#18351E] hover:bg-[#18351E] hover:text-[#eeca94]"
                              }`}
                            >
                              <div
                                className={`size-6.5 rounded-lg flex items-center justify-center shrink-0 ${
                                  isActive
                                    ? "bg-[#eeca94]/20 text-[#eeca94]"
                                    : "bg-[#D6A64A]/20 text-[#B8872E] group-hover/item:bg-[#eeca94]/20 group-hover/item:text-[#eeca94]"
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <span className="font-semibold text-xs font-serif">
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
                className="ml-2 inline-flex items-center gap-1.5 bg-[#18351e] hover:bg-[#27442A] text-[#eeca94] hover:text-[#eeca94] text-md px-4 py-2 rounded-lg transition-colors shadow-sm"
                style={{ fontWeight: 500 }}
              >
                <Heart size={13} className="fill-[#eeca94]" />
                Quero contribuir
              </Link>
            </nav>

            <button
              className="min-[950px]:hidden text-[#314523] p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="min-[950px]:hidden bg-[#18351e] border-t border-[#BB8835] py-2">
              {navItems.map((item) => {
                if (item.dropdownType === "agenda") {
                  return (
                    <div key={item.label} className="border-b border-[#234125]/40">
                      <button
                        type="button"
                        onClick={() =>
                          setMobileAgendaOpen(!mobileAgendaOpen)
                        }
                        className={`w-full flex items-center justify-between py-3 pl-10 pr-6 text-[15px] font-medium transition-colors text-left ${
                          isAgendaActive
                            ? "text-[#d6b686] bg-[#234125]"
                            : "text-[#d6b686] hover:text-white"
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            mobileAgendaOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {mobileAgendaOpen && (
                        <div className="bg-[#142d19] py-2 pl-10 pr-6 space-y-1">
                          <Link
                            href="/agenda"
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm transition-colors ${
                              pathname === "/agenda"
                                ? "bg-[#234125] text-[#d6b686]"
                                : "text-[#d6b686]/90 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <div className="size-7 rounded-md overflow-hidden shrink-0 flex items-center justify-center bg-[#234125] text-[#d6b686] border border-[#d6b686]/30">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-medium text-[13.5px]">Programação Paroquial</span>
                              <span className="text-[11px] text-[#d6b686]/70">Horários de missas e celebrações</span>
                            </div>
                          </Link>

                          <Link
                            href="/agendamentos"
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm transition-colors ${
                              pathname === "/agendamentos"
                                ? "bg-[#234125] text-[#d6b686]"
                                : "text-[#d6b686]/90 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <div className="size-7 rounded-md overflow-hidden shrink-0 flex items-center justify-center bg-[#234125] text-[#d6b686] border border-[#d6b686]/30">
                              <CalendarCheck className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-medium text-[13.5px]">Agendar Atendimento</span>
                              <span className="text-[11px] text-[#d6b686]/70">Confissões e visitas pastorais</span>
                            </div>
                          </Link>

                          <div className="pt-1 mt-1 border-t border-[#234125]/60">
                            <Link
                              href="/agendamentos/acompanhar"
                              onClick={() => setMobileOpen(false)}
                              className="block py-2 text-xs font-semibold text-[#e0be8b] hover:underline"
                            >
                              Acompanhar agendamento →
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                if (item.dropdownType === "communities") {
                  return (
                    <div key={item.label} className="border-b border-[#234125]/40">
                      <button
                        type="button"
                        onClick={() =>
                          setMobileCommunitiesOpen(!mobileCommunitiesOpen)
                        }
                        className={`w-full flex items-center justify-between py-3 pl-10 pr-6 text-[15px] font-medium transition-colors text-left ${
                          isCommunitiesActive
                            ? "text-[#d6b686] bg-[#234125]"
                            : "text-[#d6b686] hover:text-white"
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            mobileCommunitiesOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {mobileCommunitiesOpen && (
                        <div className="bg-[#142d19] py-2 pl-10 pr-6 space-y-1">
                          {communities?.map((comm) => {
                            const coverUrl = getCommunityCoverUrl(comm);
                            const isActive = pathname === `/comunidades/${comm.slug}`;

                            return (
                              <Link
                                key={comm.id}
                                href={`/comunidades/${comm.slug}`}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm transition-colors ${
                                  isActive
                                    ? "bg-[#234125] text-[#d6b686]"
                                    : "text-[#d6b686]/90 hover:text-white hover:bg-white/5"
                                }`}
                              >
                                <div className="size-7 rounded-md overflow-hidden shrink-0 border border-[#d6b686]/30">
                                  <img
                                    src={coverUrl}
                                    alt={comm.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="font-medium text-[13.5px]">{comm.name}</span>
                              </Link>
                            );
                          })}

                          <div className="pt-1">
                            <Link
                              href="/comunidades"
                              onClick={() => setMobileOpen(false)}
                              className="block py-2 text-xs font-semibold text-[#e0be8b] hover:underline"
                            >
                              Ver todas as comunidades →
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                if (item.dropdownType === "clergy") {
                  return (
                    <div key={item.label} className="border-b border-[#234125]/40">
                      <button
                        type="button"
                        onClick={() =>
                          setMobileClergyOpen(!mobileClergyOpen)
                        }
                        className={`w-full flex items-center justify-between py-3 pl-10 pr-6 text-[15px] font-medium transition-colors text-left ${
                          isClergyActive
                            ? "text-[#d6b686] bg-[#234125]"
                            : "text-[#d6b686] hover:text-white"
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            mobileClergyOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {mobileClergyOpen && (
                        <div className="bg-[#142d19] py-2 pl-10 pr-6 space-y-1">
                          {clergy?.map((member) => {
                            const photoUrl = getClergyPhotoUrl(member);
                            const isActive = pathname === `/clerigos/${member.slug}`;
                            const role = getClergyRoleLabel(
                              member.position,
                              member.roleName,
                              member.title,
                            );

                            return (
                              <Link
                                key={member.id}
                                href={`/clerigos/${member.slug}`}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm transition-colors ${
                                  isActive
                                    ? "bg-[#234125] text-[#d6b686]"
                                    : "text-[#d6b686]/90 hover:text-white hover:bg-white/5"
                                }`}
                              >
                                <div className="size-7 rounded-md overflow-hidden shrink-0 border border-[#d6b686]/30 bg-[#f0e6d6]">
                                  <img
                                    src={photoUrl}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="font-medium text-[13.5px] line-clamp-1">{member.name}</span>
                                  <span className="text-[11px] text-[#d6b686]/70 line-clamp-1">{role}</span>
                                </div>
                              </Link>
                            );
                          })}

                          <div className="pt-1">
                            <Link
                              href="/clerigos"
                              onClick={() => setMobileOpen(false)}
                              className="block py-2 text-xs font-semibold text-[#e0be8b] hover:underline"
                            >
                              Ver todos os clérigos →
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={item.label}
                    href={item.to}
                    end={item.to === "/"}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      [
                        "block py-3 text-[15px] transition-colors pl-10 pr-6",
                        isActive
                          ? "text-[#d6b686] bg-[#234125]"
                          : "text-[#d6b686] hover:text-white",
                      ].join(" ")
                    }
                    style={{ fontWeight: 500 }}
                  >
                    {item.label}
                  </NavLink>
                );
              })}

              <div className="py-4">
                <Link
                  href="/quero-contribuir"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center gap-1.5 bg-[#e0be8b] hover:bg-[#314523] text-[#314523] hover:text-[#e0be8b] text-[13px] ml-8 px-4 py-2 rounded-lg transition-colors shadow-sm"
                  style={{ fontWeight: 600 }}
                >
                  <Heart size={13} className="fill-[#314523]" />
                  Quero contribuir
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
