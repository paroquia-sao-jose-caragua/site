import { CleroSection } from "@/components/CleroSection";

export const metadata = {
  title: "Clérigos | Paróquia São José de Caraguatatuba",
  description: "Conheça os ministros e pastores que servem à nossa comunidade.",
};

export default function ClerigosPage() {
  return (
    <main className="relative w-full min-h-screen bg-[#fbf6ee] overflow-hidden pb-24 md:pb-36">
      <CleroSection />

      {/* Onda decorativa inferior */}
      <div
        className="
          absolute
          bottom-[-2px]
          left-0
          w-[calc(100%+4cm)]
          max-w-none
          ml-[-2cm]
          aspect-[1536/296]
          bg-[url('/wave-separator.svg')]
          bg-no-repeat
          bg-center
          bg-cover
          pointer-events-none
        "
      />
    </main>
  );
}
