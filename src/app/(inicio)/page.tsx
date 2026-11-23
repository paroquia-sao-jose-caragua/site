import { AnnouncementsHero } from "@/components/AnnouncementsHero";
import { OurCommunitiesSection } from "@/components/OurCommunitiesSection";
import { UpcomingMassesSection } from "@/components/UpcomingMassesSection";
import { CleroSection } from "@/components/CleroSection";
import { ChurchLinksSection } from "@/components/ChurchLinksSection";
import { CommunityCalloutSection } from "@/components/CommunityCalloutSection";

export default function HomePage() {
  return (
    <main className="w-full min-h-screen bg-[#fbf6ee]">
      <AnnouncementsHero />
      <OurCommunitiesSection />
      <UpcomingMassesSection />
      <CleroSection />
      <ChurchLinksSection />
      <CommunityCalloutSection />
    </main>
  );
}
