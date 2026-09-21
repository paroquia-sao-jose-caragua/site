"use client";

import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Heart,
  ChevronDown,
  Church,
  BookOpen,
  Users,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink } from "./ui/nav-link";
import { useCommunities } from "@/lib/api/communities/use-communities";

const navItems = [
  { label: "Início", to: "/" },
  { label: "Liturgia Diária", to: "/liturgia" },
  { label: "Comunidades", to: "/comunidades", hasDropdown: true },
  { label: "Agenda", to: "/agenda" },
  { label: "Clérigos", to: "/clerigos" },
  { label: "Contato", to: "/contato" },
];

const secondaryNavItems = [
  { label: "Liturgia Diária", to: "/liturgia", icon: BookOpen },
  { label: "Clérigos", to: "/clerigos", icon: Users },
  { label: "Contato", to: "/contato", icon: MessageCircle },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { communities } = useCommunities();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCommunitiesOpen, setMobileCommunitiesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
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
            className={`max-w-320 mx-auto px-6 flex items-center justify-between transition-all duration-300 ease-in-out ${
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

              {/* 2. Liturgia Diária (visível em telas >= 1200px) */}
              <NavLink
                href="/liturgia"
                className="hidden min-[1200px]:inline-flex px-3.5 py-1.5 text-md font-semibold rounded-lg"
              >
                Liturgia Diária
              </NavLink>

              {/* 3. Comunidades (sempre visível com dropdown) */}
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
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-72 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-2xl shadow-xl p-2 text-[#18351E]">
                      <div className="space-y-0.5 max-h-[360px] overflow-y-auto">
                        {communities && communities.length > 0 ? (
                          communities.map((comm) => {
                            const isMatriz =
                              comm.type === "parish_church" ||
                              comm.name
                                .toLowerCase()
                                .includes("matriz");
                            const isActiveCommunity =
                              pathname === `/comunidades/${comm.slug}`;

                            return (
                              <Link
                                key={comm.id}
                                href={`/comunidades/${comm.slug}`}
                                onClick={() => setDropdownOpen(false)}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all group/item ${
                                  isActiveCommunity
                                    ? "bg-[#18351E] text-[#eeca94]"
                                    : "text-[#18351E] hover:bg-[#18351E] hover:text-[#eeca94]"
                                }`}
                              >
                                <div
                                  className={`size-6.5 rounded-lg flex items-center justify-center shrink-0 ${
                                    isActiveCommunity
                                      ? "bg-[#eeca94]/20 text-[#eeca94]"
                                      : "bg-[#D6A64A]/20 text-[#B8872E] group-hover/item:bg-[#eeca94]/20 group-hover/item:text-[#eeca94]"
                                  }`}
                                >
                                  <Church className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="font-semibold text-xs leading-tight line-clamp-1 font-serif">
                                    {comm.name}
                                  </span>
                                  <span
                                    className={`text-[10px] line-clamp-1 ${
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
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Agenda (sempre visível) */}
              <NavLink
                href="/agenda"
                className="px-3.5 py-1.5 text-md font-semibold rounded-lg"
              >
                Agenda
              </NavLink>

              {/* 5. Clérigos (visível em telas >= 1200px) */}
              <NavLink
                href="/clerigos"
                className="hidden min-[1200px]:inline-flex px-3.5 py-1.5 text-md font-semibold rounded-lg"
              >
                Clérigos
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
                if (item.hasDropdown) {
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
                        <div className="bg-[#142d19] py-2 pl-12 pr-6 space-y-1">
                          {communities?.map((comm) => (
                            <Link
                              key={comm.id}
                              href={`/comunidades/${comm.slug}`}
                              onClick={() => setMobileOpen(false)}
                              className="block py-2 text-xs text-[#d6b686]/90 hover:text-white"
                            >
                              {comm.name}
                            </Link>
                          ))}
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
