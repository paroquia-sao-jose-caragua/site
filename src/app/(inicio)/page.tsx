import { UrgentAlertBar } from "@/components/UrgentAlertBar";
import { AnnouncementsHero } from "@/components/AnnouncementsHero";
import { LiturgyFloatingButton } from "@/components/LiturgyFloatingButton";
import { OurCommunitiesSection } from "@/components/OurCommunitiesSection";
import { UpcomingMassesSection } from "@/components/UpcomingMassesSection";
import { CleroSection } from "@/components/CleroSection";
import { QuickServicesSection } from "@/components/QuickServicesSection";
import { CommunityCalloutSection } from "@/components/CommunityCalloutSection";

export default function HomePage() {
  return (
    <main className="w-full min-h-screen bg-[#fbf6ee]">
      <AnnouncementsHero />
      <OurCommunitiesSection />
      <UpcomingMassesSection />
      <CleroSection />
      <CommunityCalloutSection />
      <LiturgyFloatingButton />
    </main>
  );
}
