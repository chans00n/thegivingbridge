import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FAQSection } from "@/components/landing/faq-section";
import { CTAFooter } from "@/components/landing/cta-footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <HowItWorks />
      <FAQSection />
      <CTAFooter />
    </main>
  );
}
