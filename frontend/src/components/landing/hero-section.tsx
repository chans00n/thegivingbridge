"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

interface HeroSectionProps {
  eventDate?: string; // Optional event date for countdown
  fundraisingGoal?: number;
  currentlyRaised?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  eventDate = "2025-09-01", // September 1st - start of campaign
  fundraisingGoal = 50000,
  currentlyRaised = 12500,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(eventDate) - +new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        // If the date has passed, show zeros
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  const progressPercentage = (currentlyRaised / fundraisingGoal) * 100;

  const scrollToDetails = () => {
    const detailsSection = document.getElementById("how-it-works");
    detailsSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('/images/placeholders/geoffroy-hauwen-Nba45LGrCfM-unsplash.jpg')`,
      }}
    >
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/20 via-transparent to-neutral-900/30"></div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 max-w-5xl mx-auto">
        {/* Main headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
          The Giving Bridge Challenge
        </h1>

        {/* BUILD → RAISE → CROSS tagline */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
            <span className="text-xl md:text-2xl font-bold text-white">
              BUILD
            </span>
          </div>
          <ArrowDown className="w-6 h-6 text-neutral-300 rotate-[-90deg]" />
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
            <span className="text-xl md:text-2xl font-bold text-white">
              RAISE
            </span>
          </div>
          <ArrowDown className="w-6 h-6 text-neutral-300 rotate-[-90deg]" />
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
            <span className="text-xl md:text-2xl font-bold text-white">
              CROSS
            </span>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 drop-shadow-md max-w-2xl">
          <span className="underline">Build</span> your fundraising page,{" "}
          <span className="underline">raise</span> funds for The Phoenix, and{" "}
          <span className="underline">cross</span> your bridge for recovery this
          September.
        </p>

        {/* Compact countdown timer */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8 max-w-2xl w-full border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-3 text-center">
            Challenge Starts In
          </h3>
          <div className="flex justify-center gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {timeLeft.days.toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-white/80">DAYS</div>
            </div>
            <div className="text-white/60 self-center">:</div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {timeLeft.hours.toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-white/80">HRS</div>
            </div>
            <div className="text-white/60 self-center">:</div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {timeLeft.minutes.toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-white/80">MIN</div>
            </div>
            <div className="text-white/60 self-center">:</div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {timeLeft.seconds.toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-white/80">SEC</div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-md mb-8">
          <div className="flex justify-between text-white text-sm mb-2">
            <span>${currentlyRaised.toLocaleString()} raised</span>
            <span>${fundraisingGoal.toLocaleString()} goal</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-4 border border-white/30">
            <div
              className="bg-[#E2241A] h-4 rounded-full transition-all duration-1000 shadow-lg"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="text-center text-white text-sm mt-2">
            {progressPercentage.toFixed(1)}% of bridge completed
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            asChild
            size="lg"
            className="bg-[#E2241A] hover:bg-[#B01C14] text-white px-8 py-3 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
          >
            <Link href="/interest-form">Join the Challenge</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={scrollToDetails}
            className="border-white/50 text-white hover:bg-white/10 hover:border-white px-8 py-3 text-lg font-semibold backdrop-blur-sm"
          >
            Learn How It Works
          </Button>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToDetails}
          className="animate-bounce text-white/80 hover:text-white transition-colors"
          aria-label="Scroll to learn more"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
