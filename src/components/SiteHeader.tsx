import { useState } from "react";
import { Menu, X, Heart } from "lucide-react";
import { Link, NavLink } from "react-router";
import imgLogo from "../../imports/Desktop5/85dbf46b54be77c7212c66da9b797105c1fc2bf5.png";

const navItems = [
  { label: "Início", to: "/" },
  { label: "Agenda", to: "/agenda" },
  { label: "Contato", to: "/contato" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#4a2f24] border-b border-[#533b31]">
      <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="relative size-10 rounded-full overflow-hidden ring-2 ring-[#f9f5f2]/20">
            <img src={imgLogo} alt="Logo Paróquia São José" className="size-full object-cover" />
          </div>
          <div>
            <p className="text-[#f9f5f2] text-[15px]" style={{ fontWeight: 600 }}>Paróquia São José</p>
            <p className="text-[#dcc2b5] text-[12px]">Diocese de Caraguatatuba</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                [
                  "px-4 py-2 text-[14px] rounded-lg transition-colors",
                  isActive
                    ? "text-[#f9f5f2] bg-white/15"
                    : "text-[#dcc2b5] hover:text-[#f9f5f2] hover:bg-white/10",
                ].join(" ")
              }
              style={{ fontWeight: 500 }}
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/contribuir"
            className="ml-2 inline-flex items-center gap-1.5 bg-[#faba45] hover:bg-[#f5aa2e] text-[#2b2b2b] text-[13px] px-4 py-2 rounded-lg transition-colors shadow-sm"
            style={{ fontWeight: 600 }}
          >
            <Heart size={13} className="fill-[#2b2b2b]" />
            Quero contribuir
          </Link>
        </nav>

        <button
          className="md:hidden text-[#f9f5f2] p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#3d2318] border-t border-[#533b31] px-6 py-2">
          {navItems.map(item => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                [
                  "block py-3 text-[15px] border-b border-[#533b31]/60 transition-colors",
                  isActive ? "text-[#f9f5f2]" : "text-[#dcc2b5] hover:text-[#f9f5f2]",
                ].join(" ")
              }
              style={{ fontWeight: 500 }}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="py-4">
            <Link
              to="/contribuir"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-1.5 bg-[#faba45] hover:bg-[#f5aa2e] text-[#2b2b2b] text-[14px] px-4 py-2.5 rounded-lg transition-colors"
              style={{ fontWeight: 600 }}
            >
              <Heart size={14} className="fill-[#2b2b2b]" />
              Quero contribuir
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
