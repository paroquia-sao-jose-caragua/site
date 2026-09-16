"use client";

import { Heart } from "lucide-react";
import Link from "next/link";

export function CommunityCalloutSection() {
  return (
    <section className="bg-[#f3ece0] text-[#18351E] relative overflow-hidden py-16 px-6 border-t border-[#e8dfd1]/60">
      {/* Background Lily Flower Illustration to the right */}
      <div className="absolute right-0 bottom-0 top-0 opacity-15 pointer-events-none flex items-center justify-end">
        <img
          src="/inicio/lirio-right.png"
          alt=""
          className="h-full object-contain max-w-md mix-blend-multiply"
        />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div className="max-w-2xl text-center md:text-left">
          <h2
            className="text-3xl md:text-5xl font-semibold text-[#18351E] mb-3"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Faça parte da nossa comunidade!
          </h2>
          <p className="text-base md:text-lg text-[#5A463B] font-serif">
            Sua contribuição ajuda a manter nossas obras, ações pastorais e evangelização.
          </p>
        </div>

        <Link
          href="/quero-contribuir"
          className="inline-flex items-center gap-2 bg-[#18351E] hover:bg-[#27442A] text-white font-bold text-base px-8 py-4 rounded-xl transition-all shadow-md hover:scale-105 shrink-0"
        >
          <Heart className="w-5 h-5 fill-[#D6A64A] text-[#D6A64A]" />
          Quero contribuir
        </Link>
      </div>
    </section>
  );
}
