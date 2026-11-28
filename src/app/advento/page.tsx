import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tempo do Advento",
  description:
    "O Advento é um tempo de espera e esperança, um convite para preparar o coração e renovar nossa fé na chegada de Jesus.",
};

export default function AdventoPage() {
  return <main className="w-full min-h-screen bg-[#fbf6ee]" />;
}
