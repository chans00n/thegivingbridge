import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, Users } from "lucide-react";

export const CTAFooter = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          {/* Header */}
          <div className="flex justify-center items-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-red-400 fill-current" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Make a Difference?
            </h2>
            <Heart className="w-8 h-8 text-red-400 fill-current" />
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join hundreds of community members who are building bridges to
            recovery, hope, and healing. Your participation creates ripple
            effects that transform lives.
          </p>

          {/* Stats row */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-10">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">47+</div>
              <div className="text-blue-200 text-sm">Participants Joined</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">$12,500</div>
              <div className="text-blue-200 text-sm">Raised So Far</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">25%</div>
              <div className="text-blue-200 text-sm">of Goal Reached</div>
            </div>
          </div>

          {/* Main CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/interest-form" className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Join The Challenge Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Learn More
            </Button>
          </div>

          {/* Urgency message */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-lg mx-auto">
            <p className="text-white text-sm mb-2">
              <strong>Limited Time:</strong> Registration closes September 25th
            </p>
            <p className="text-blue-200 text-xs">
              Don&apos;t miss your chance to be part of this transformative
              community event
            </p>
          </div>

          {/* Social proof */}
          <div className="mt-12 text-center">
            <p className="text-blue-200 text-sm mb-4">
              Join these amazing community partners:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-white/80 text-sm">
              <span>• Recovery Center Alliance</span>
              <span>• Mental Health First Aid</span>
              <span>• Community Care Network</span>
              <span>• Hope & Healing Foundation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
