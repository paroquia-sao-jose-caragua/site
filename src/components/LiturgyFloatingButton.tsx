import Link from "next/link";
import { BookOpen } from "lucide-react";

export function LiturgyFloatingButton() {
  return (
    <Link
      href="/liturgia"
      aria-label="Ler Liturgia Diária"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 hidden min-[950px]:inline-flex items-center justify-center gap-2 rounded-full bg-[#18351E] hover:bg-[#27442A] text-[#eeca94] border border-[#D6A64A]/40 px-6 py-3 text-sm font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
    >
      <BookOpen className="w-4 h-4 text-[#eeca94] shrink-0" />
      <span>Liturgia Diária</span>
    </Link>
  );
}
