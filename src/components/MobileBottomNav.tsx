"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Calendar,
  CalendarCheck,
  ChevronDown,
  Church,
  Heart,
  Home,
  Menu,
  MessageCircle,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useCommunities } from "@/lib/api/communities/use-communities";
import { useClergy } from "@/lib/api/clergy/use-clergy";
import { getClergyRoleLabel } from "@/lib/utils/clergy";

export function MobileBottomNav() {
  const pathname = usePathname() || "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [agendaSheetOpen, setAgendaSheetOpen] = useState(false);
  const [communitiesOpen, setCommunitiesOpen] = useState(false);
  const [clergyOpen, setClergyOpen] = useState(false);
  const [agendaMenuOpen, setAgendaMenuOpen] = useState(false);

  const { communities = [] } = useCommunities();
  const { clergy = [] } = useClergy();

  useEffect(() => {
    setMenuOpen(false);
    setAgendaSheetOpen(false);
  }, [pathname]);

  const isHomeActive = pathname === "/";
  const isAgendaActive =
    pathname === "/agenda" || pathname.startsWith("/agendamentos");
  const isLiturgyActive = pathname.startsWith("/liturgia");
  const isMoreActive =
    pathname.startsWith("/comunidades") ||
    pathname.startsWith("/clerigos") ||
    pathname.startsWith("/contato") ||
    pathname.startsWith("/quero-contribuir");

  const closeAllSheets = () => {
    setMenuOpen(false);
    setAgendaSheetOpen(false);
  };

  return (
    <>
      {/* Submenu da Agenda (ao clicar no botão fixo Agenda) */}
      {agendaSheetOpen && (
        <div
          className="fixed inset-0 z-40 min-[950px]:hidden flex flex-col justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Opções de Agenda"
        >
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setAgendaSheetOpen(false)}
          />

          <div className="relative z-10 bg-[#fbf5eb] border-t border-[#D6A64A]/45 rounded-t-3xl shadow-2xl px-5 pt-5 pb-6 mb-16 space-y-2.5">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6A64A]/20">
              <span
                className="text-lg font-bold text-[#18351E]"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Agenda &amp; Atendimentos
              </span>
              <button
                type="button"
                onClick={() => setAgendaSheetOpen(false)}
                aria-label="Fechar opções de agenda"
                className="p-1.5 rounded-full text-[#5A463B] hover:text-[#18351E] hover:bg-[#ECD6BD]/50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <Link
              href="/agenda"
              onClick={closeAllSheets}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/85 border border-[#D6A64A]/25 hover:border-[#B8872E] transition-colors"
            >
              <div className="size-9 rounded-xl bg-[#ECD6BD]/50 text-[#18351E] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-[#B8872E]" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-semibold text-[#18351E] block">
                  Programação Paroquial
                </span>
                <span className="text-xs text-[#5A463B] block">
                  Horários de missas e celebrações
                </span>
              </div>
            </Link>

            <Link
              href="/agendamentos"
              onClick={closeAllSheets}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/85 border border-[#D6A64A]/25 hover:border-[#B8872E] transition-colors"
            >
              <div className="size-9 rounded-xl bg-[#ECD6BD]/50 text-[#18351E] flex items-center justify-center shrink-0">
                <CalendarCheck className="w-4 h-4 text-[#B8872E]" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-semibold text-[#18351E] block">
                  Agendar Atendimento
                </span>
                <span className="text-xs text-[#5A463B] block">
                  Confissões e visitas pastorais
                </span>
              </div>
            </Link>

            <Link
              href="/agendamentos/acompanhar"
              onClick={closeAllSheets}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/85 border border-[#D6A64A]/25 hover:border-[#B8872E] transition-colors"
            >
              <div className="size-9 rounded-xl bg-[#ECD6BD]/50 text-[#18351E] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-[#B8872E]" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-semibold text-[#18351E] block">
                  Acompanhar Agendamento
                </span>
                <span className="text-xs text-[#5A463B] block">
                  Consultar status ou cancelar pedido
                </span>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Drawer / Bottom Sheet do Menu Hamburguer (mesmos menus do desktop) */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 min-[950px]:hidden flex flex-col justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Menu da Paróquia"
        >
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMenuOpen(false)}
          />

          <div className="relative z-10 bg-[#fbf5eb] border-t border-[#D6A64A]/45 rounded-t-3xl shadow-2xl max-h-[78vh] overflow-y-auto px-5 pt-5 pb-6 mb-16 space-y-2">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6A64A]/20">
              <span
                className="text-lg font-bold text-[#18351E]"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Menu da Paróquia
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Fechar menu"
                className="p-1.5 rounded-full text-[#5A463B] hover:text-[#18351E] hover:bg-[#ECD6BD]/50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Início (sem submenu) */}
            <Link
              href="/"
              onClick={closeAllSheets}
              className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/80 border border-[#D6A64A]/25 text-sm font-semibold text-[#18351E] hover:border-[#B8872E] transition-colors"
            >
              <Home className="w-4 h-4 text-[#B8872E]" />
              <span>Início</span>
            </Link>

            {/* 2. Comunidades (com submenu) */}
            <div className="rounded-2xl bg-white/80 border border-[#D6A64A]/25 overflow-hidden">
              <button
                type="button"
                onClick={() => setCommunitiesOpen((prev) => !prev)}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold text-[#18351E] cursor-pointer"
              >
                <span className="inline-flex items-center gap-2.5">
                  <Church className="w-4 h-4 text-[#B8872E]" />
                  <span>Comunidades</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#8c7b6c] transition-transform ${
                    communitiesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {communitiesOpen && (
                <div className="px-4 pb-3 pt-1 space-y-1 border-t border-[#D6A64A]/15">
                  {communities.map((comm) => (
                    <Link
                      key={comm.id}
                      href={`/comunidades/${comm.slug}`}
                      onClick={closeAllSheets}
                      className="block py-2 px-2.5 rounded-xl text-sm text-[#5A463B] hover:text-[#18351E] hover:bg-[#ECD6BD]/40 transition-colors"
                    >
                      {comm.name}
                    </Link>
                  ))}
                  <Link
                    href="/comunidades"
                    onClick={closeAllSheets}
                    className="block py-1.5 px-2.5 text-xs font-semibold text-[#B8872E] hover:text-[#18351E]"
                  >
                    Ver todas as comunidades →
                  </Link>
                </div>
              )}
            </div>

            {/* 3. Clérigos (com submenu) */}
            <div className="rounded-2xl bg-white/80 border border-[#D6A64A]/25 overflow-hidden">
              <button
                type="button"
                onClick={() => setClergyOpen((prev) => !prev)}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold text-[#18351E] cursor-pointer"
              >
                <span className="inline-flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-[#B8872E]" />
                  <span>Clérigos</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#8c7b6c] transition-transform ${
                    clergyOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {clergyOpen && (
                <div className="px-4 pb-3 pt-1 space-y-1 border-t border-[#D6A64A]/15">
                  {clergy.map((member) => (
                    <Link
                      key={member.id}
                      href={`/clerigos/${member.slug}`}
                      onClick={closeAllSheets}
                      className="flex items-center justify-between gap-2 py-2 px-2.5 rounded-xl text-sm text-[#5A463B] hover:text-[#18351E] hover:bg-[#ECD6BD]/40 transition-colors"
                    >
                      <span className="truncate">{member.name}</span>
                      <span className="text-[11px] text-[#B8872E] shrink-0">
                        {getClergyRoleLabel(
                          member.position,
                          member.roleName,
                          member.title
                        )}
                      </span>
                    </Link>
                  ))}
                  <Link
                    href="/clerigos"
                    onClick={closeAllSheets}
                    className="block py-1.5 px-2.5 text-xs font-semibold text-[#B8872E] hover:text-[#18351E]"
                  >
                    Ver todos os clérigos →
                  </Link>
                </div>
              )}
            </div>

            {/* 4. Agenda (com submenu) */}
            <div className="rounded-2xl bg-white/80 border border-[#D6A64A]/25 overflow-hidden">
              <button
                type="button"
                onClick={() => setAgendaMenuOpen((prev) => !prev)}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold text-[#18351E] cursor-pointer"
              >
                <span className="inline-flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[#B8872E]" />
                  <span>Agenda</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#8c7b6c] transition-transform ${
                    agendaMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {agendaMenuOpen && (
                <div className="px-4 pb-3 pt-1 space-y-1 border-t border-[#D6A64A]/15">
                  <Link
                    href="/agenda"
                    onClick={closeAllSheets}
                    className="block py-2 px-2.5 rounded-xl text-sm text-[#5A463B] hover:text-[#18351E] hover:bg-[#ECD6BD]/40 transition-colors"
                  >
                    Programação Paroquial
                  </Link>
                  <Link
                    href="/agendamentos"
                    onClick={closeAllSheets}
                    className="block py-2 px-2.5 rounded-xl text-sm text-[#5A463B] hover:text-[#18351E] hover:bg-[#ECD6BD]/40 transition-colors"
                  >
                    Agendar Atendimento
                  </Link>
                  <Link
                    href="/agendamentos/acompanhar"
                    onClick={closeAllSheets}
                    className="block py-1.5 px-2.5 text-xs font-semibold text-[#B8872E] hover:text-[#18351E]"
                  >
                    Acompanhar agendamento →
                  </Link>
                </div>
              )}
            </div>

            {/* 5. Liturgia Diária (sem submenu) */}
            <Link
              href="/liturgia"
              onClick={closeAllSheets}
              className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/80 border border-[#D6A64A]/25 text-sm font-semibold text-[#18351E] hover:border-[#B8872E] transition-colors"
            >
              <BookOpen className="w-4 h-4 text-[#B8872E]" />
              <span>Liturgia Diária</span>
            </Link>

            {/* 6. Contato (sem submenu) */}
            <Link
              href="/contato"
              onClick={closeAllSheets}
              className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/80 border border-[#D6A64A]/25 text-sm font-semibold text-[#18351E] hover:border-[#B8872E] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#B8872E]" />
              <span>Contato</span>
            </Link>

            {/* 7. Quero contribuir (sem submenu) */}
            <div className="pt-2">
              <Link
                href="/quero-contribuir"
                onClick={closeAllSheets}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#18351E] hover:bg-[#27442A] text-[#eeca94] border border-[#D6A64A]/40 px-6 py-3 text-sm font-semibold shadow-sm transition-all"
              >
                <Heart className="w-4 h-4 fill-[#eeca94] text-[#eeca94]" />
                <span>Quero contribuir</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer Fixo Mobile */}
      <nav
        aria-label="Navegação inferior mobile"
        className="fixed bottom-0 inset-x-0 z-50 min-[950px]:hidden bg-[#fbf6ee]/95 backdrop-blur-md border-t border-[#D6A64A]/35 shadow-[0_-4px_20px_rgba(24,53,30,0.06)] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1.5 min-h-16">
          <Link
            href="/"
            onClick={closeAllSheets}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all select-none ${
              isHomeActive && !menuOpen && !agendaSheetOpen
                ? "bg-[#18351E]/10 text-[#18351E] font-semibold"
                : "text-[#5A463B] hover:text-[#18351E]"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[11px] mt-0.5 leading-tight">Início</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setAgendaSheetOpen((prev) => !prev);
            }}
            aria-expanded={agendaSheetOpen}
            aria-label="Abrir opções de agenda"
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all select-none cursor-pointer ${
              agendaSheetOpen || (isAgendaActive && !menuOpen)
                ? "bg-[#18351E]/10 text-[#18351E] font-semibold"
                : "text-[#5A463B] hover:text-[#18351E]"
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[11px] mt-0.5 leading-tight">Agenda</span>
          </button>

          <Link
            href="/liturgia"
            onClick={closeAllSheets}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all select-none ${
              isLiturgyActive && !menuOpen && !agendaSheetOpen
                ? "bg-[#18351E]/10 text-[#18351E] font-semibold"
                : "text-[#5A463B] hover:text-[#18351E]"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[11px] mt-0.5 leading-tight">Liturgia</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              setAgendaSheetOpen(false);
              setMenuOpen((prev) => !prev);
            }}
            aria-expanded={menuOpen}
            aria-label="Abrir menu completo"
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all select-none cursor-pointer ${
              menuOpen || (isMoreActive && !agendaSheetOpen)
                ? "bg-[#18351E]/10 text-[#18351E] font-semibold"
                : "text-[#5A463B] hover:text-[#18351E]"
            }`}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span className="text-[11px] mt-0.5 leading-tight">Menu</span>
          </button>
        </div>
      </nav>
    </>
  );
}
