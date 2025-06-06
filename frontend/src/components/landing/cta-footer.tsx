"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, Users } from "lucide-react";

export const CTAFooter = () => {
  return (
    <section className="py-20 bg-neutral-900 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          {/* Header */}
          <div className="flex justify-center items-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-[#E2241A] fill-current" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Cross the Bridge to Recovery
            </h2>
            <Heart className="w-8 h-8 text-[#E2241A] fill-current" />
          </div>

          {/* Main message */}
          <p className="text-xl md:text-2xl text-neutral-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Every bridge built connects someone to the support they need.
            <br />
            <strong className="text-white">
              Your participation creates lasting change.
            </strong>
          </p>

          {/* Urgency message */}
          <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <p className="text-neutral-200 text-lg">
              <span className="text-[#E2241A] font-bold">
                Registration closes September 25th!
              </span>
              <br />
              Don't miss your chance to be part of this movement.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              asChild
              size="lg"
              className="bg-[#E2241A] hover:bg-[#B01C14] text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all border-0"
            >
              <Link href="/interest-form" className="flex items-center gap-2">
                Join the Challenge
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="border-neutral-600 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-500 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
            >
              Learn More
            </Button>
          </div>

          {/* Community partners */}
          <div className="border-t border-neutral-700 pt-8">
            <p className="text-neutral-400 text-sm mb-4">
              Proudly supporting recovery with our community partners:
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 text-neutral-500">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">Recovery Support Organizations</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span className="text-sm">Mental Health Advocates</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">Sober Communities</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
