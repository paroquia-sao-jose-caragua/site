"use client";

/* eslint-disable @next/next/no-img-element */

import { ExternalLink } from "lucide-react";

const CHURCH_LINKS = [
  {
    name: "Diocese de Caraguatatuba",
    subtitle: "Igreja Particular do Litoral Norte",
    href: "https://dicaragua.org.br/",
    logoSrc: "/diocese-logotipo.webp",
    logoAlt: "Brasão da Diocese de Caraguatatuba",
    logoBgClass: "bg-[#0c4571]",
  },
  {
    name: "CNBB",
    subtitle: "Conferência Nacional dos Bispos do Brasil",
    href: "https://www.cnbb.org.br/",
    logoSrc: "/cnbb-logotipo.png",
    logoAlt: "Logotipo da CNBB",
    logoBgClass: "bg-white",
  },
  {
    name: "Vatican News",
    subtitle: "Portal oficial da Santa Sé",
    href: "https://www.vaticannews.va/pt.html",
    logoSrc: "/vatican-news-logotipo.jpg",
    logoAlt: "Logotipo do Vatican News",
    logoBgClass: "bg-white",
  },
];

export function ChurchLinksSection() {
  return (
    <section className="bg-[#fbf6ee] py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-px w-12 bg-[#B8872E]/40" />
            <div className="flex items-center gap-1.5 text-[#B8872E] text-sm font-semibold uppercase tracking-[0.3em]">
              <span>COMUNHÃO Eclesial</span>
            </div>
            <span className="h-px w-12 bg-[#B8872E]/40" />
          </div>

          <h2
            className="text-3xl md:text-5xl font-semibold text-[#18351E] mb-4"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Unidos à Igreja
          </h2>

          <p className="text-lg text-[#5A463B] font-serif leading-relaxed max-w-2xl mx-auto">
            Acompanhe as notícias, documentos e orientações pastorais da nossa Diocese, da CNBB e da Santa Sé.
          </p>
        </div>

        {/* 3 Institutional Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CHURCH_LINKS.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col bg-[#fbf5eb] border border-[#D6A64A]/40 hover:border-[#B8872E] rounded-3xl overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div
                className={`h-32 sm:h-36 w-full flex items-center justify-center p-6 ${item.logoBgClass}`}
              >
                <img
                  src={item.logoSrc}
                  alt={item.logoAlt}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="px-5 py-4 border-t border-[#D6A64A]/25 flex items-center justify-between gap-3 flex-1">
                <div className="min-w-0">
                  <h3
                    className="text-xl font-bold text-[#18351E] leading-snug group-hover:text-[#8c6218] transition-colors truncate"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    {item.name}
                  </h3>
                  <p className="text-sm text-[#5A463B] truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>

                <ExternalLink
                  size={17}
                  className="text-[#B8872E] shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
