"use client";

import { BookOpen, Calendar, Heart, MessageSquare, CalendarCheck } from "lucide-react";
import Link from "next/link";

const services = [
  { label: "Liturgia Diária", href: "/liturgia", icon: BookOpen },
  { label: "Horário de Missas", href: "/agenda", icon: Calendar },
  { label: "Agendamentos", href: "/agendamentos", icon: CalendarCheck },
  { label: "Dízimo e Ofertas", href: "/quero-contribuir", icon: Heart },
  { label: "Fale Conosco", href: "/contato", icon: MessageSquare },
];

export function QuickServicesSection() {
  return (
    <section className="bg-[#fbf6ee] py-10 border-t border-[#e8dfd1]/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={`service-${idx+1}`}
                href={item.href}
                className="bg-[#fbf5eb] border border-[#D6A64A]/30 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:border-[#B8872E] transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#fbf6ee] border border-[#e8dfd1] flex items-center justify-center text-[#B8872E] mb-3 group-hover:bg-[#18351E] group-hover:text-[#D6A64A] transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#18351E] group-hover:text-[#B8872E] transition-colors">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
