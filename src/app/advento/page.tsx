import type { Metadata } from "next";
import { AdventJourneyPage } from "@/components/advento/AdventJourneyPage";

export const metadata: Metadata = {
  title: "Tempo do Advento",
  description:
    "Um caminho de fé, esperança e preparação para o Natal. Acompanhe as quatro semanas do Advento na Paróquia São José de Caraguatatuba.",
};

export default function AdventoPage() {
  return <AdventJourneyPage />;
}
