import { CleroSection } from "@/components/CleroSection";

export const metadata = {
  title: "Clérigos | Paróquia São José de Caraguatatuba",
  description: "Conheça os ministros e pastores que servem à nossa comunidade.",
};

export default function ClerigosPage() {
  return (
    <main className="w-full min-h-screen bg-[#fbf6ee]">
      <CleroSection />
    </main>
  );
}
