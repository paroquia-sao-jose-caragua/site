"use client";

import { Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { CrossIcon } from "./icons/CrossIcon";

const newsItems = [
  {
    id: "1",
    category: "COMUNIDADE",
    title: "Missa em celebração ao Dia dos Avós",
    description: "Celebração especial reuniu famílias para agradecer e rezar pelos avós.",
    date: "26 de jul, 2024",
    image: "/hero/slide-1.png",
  },
  {
    id: "2",
    category: "EVENTO",
    title: "Noite de Adoração Eucarística",
    description: "Um momento profundo de oração e entrega ao Santíssimo Sagrado Coração.",
    date: "24 de jul, 2024",
    image: "/hero/slide-2.png",
  },
  {
    id: "3",
    category: "CATEQUESE",
    title: "Inscrições abertas para a Catequese 2025",
    description: "Inscreva seu filho e faça parte deste caminho de fé e evangelização.",
    date: "23 de jul, 2024",
    image: "/pastoral-center.png",
  },
  {
    id: "4",
    category: "PASTORAL",
    title: "Campanha do Agasalho 2025",
    description: "Doe amor! Sua doação pode aquecer o inverno de quem mais precisa.",
    date: "20 de jul, 2024",
    image: "/hero/slide-1.png",
  },
];

export function LatestNewsSection() {
  return (
    <section className="bg-[#fbf5eb] py-12 md:py-16 border-t border-[#e8dfd1]/60">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <CrossIcon fill="#B8872E" width={14} height={22} className="shrink-0" />
            <h2
              className="text-2xl md:text-4xl font-semibold text-[#18351E]"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Últimas Notícias
            </h2>
          </div>

          <Link
            href="/agenda"
            className="text-xs font-semibold text-[#B8872E] hover:text-[#18351E] flex items-center gap-1 transition-colors"
          >
            Ver todas as notícias <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* News Grid (4 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="bg-white/90 border border-[#D6A64A]/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="h-44 w-full overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#B8872E] uppercase tracking-wider block mb-2">
                    {item.category}
                  </span>

                  <h3
                    className="text-lg font-semibold text-[#18351E] mb-2 leading-snug line-clamp-2"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#5A463B] line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-[#8c7b6c] border-t border-[#e8dfd1]/60 pt-3 mt-auto">
                  <Calendar className="w-3.5 h-3.5 text-[#B8872E]" />
                  <span>{item.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
