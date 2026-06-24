import { HeroSection } from "@/components/HeroSection";
import { CommunitiesSection } from "@/components/CommunitiesSection";
import { CentroPastoralSection } from "@/components/CentroPastoralSection";
import { CleroSection } from "@/components/CleroSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <CommunitiesSection />
      <CentroPastoralSection />
      <CleroSection />
    </main>
  );
}
