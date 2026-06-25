"use client";

import { useState } from "react";
import { Menu, X, Heart } from "lucide-react";
import Link from "next/link";
import { NavLink } from "./ui/nav-link";

const navItems = [
  { label: "Início", to: "/" },
  { label: "Agenda", to: "/agenda" },
  { label: "Contato", to: "/contato" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="flex items-start">
        <div className="relative flex-1 ml-[-12px] bg-[#fbf4eb] min-w-0 border-b border-[#D6A64A]">
          <div className="max-w-320 mx-auto px-6 h-24 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <img src="/logo-mark.png" alt="" height={80} width={240} />
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  href={item.to}
                  end={item.to === "/"}
                  className="px-4 py-2 text-md font-semibold rounded-lg transition-colors"
                >
                  {item.label}
                </NavLink>
              ))}
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
              className="md:hidden text-[#314523] p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {mobileOpen && (
            <div className="md:hidden bg-[#18351e] border-t border-[#BB8835] py-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  href={item.to}
                  end={item.to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    [
                      "block py-3 text-[15px] transition-colors pl-10 pr-6",
                      isActive
                        ? "text-[#d6b686] bg-[#234125] border-r-2 border-[#d6b686]"
                        : "text-[#d6b686] hover:text-[#d6b686]",
                    ].join(" ")
                  }
                  style={{ fontWeight: 500 }}
                >
                  {item.label}
                </NavLink>
              ))}
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
