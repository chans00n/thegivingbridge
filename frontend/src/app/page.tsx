import { HeroSection } from "@/components/landing/hero-section";
import { EventDetails } from "@/components/landing/event-details";
import { ImpactStory } from "@/components/landing/impact-story";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FAQSection } from "@/components/landing/faq-section";
import { CTAFooter } from "@/components/landing/cta-footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection
        eventDate="2024-09-30"
        currentParticipants={47}
        fundraisingGoal={50000}
        currentlyRaised={12500}
      />
      <EventDetails />
      <ImpactStory />
      <HowItWorks />
      <FAQSection />
      <CTAFooter />
    </div>
  );
}
