import { HeroSection } from "@/components/landing/hero-section";
import { BuildRaiseCross } from "@/components/landing/build-raise-cross";
import { EventDetails } from "@/components/landing/event-details";
import { ImpactStory } from "@/components/landing/impact-story";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FAQSection } from "@/components/landing/faq-section";
import { CTAFooter } from "@/components/landing/cta-footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <BuildRaiseCross />
      <EventDetails />
      <ImpactStory />
      <HowItWorks />
      <FAQSection />
      <CTAFooter />
    </main>
  );
}
