"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Target, ArrowDown } from "lucide-react";

interface HeroSectionProps {
  eventDate?: string; // Optional event date for countdown
  currentParticipants?: number;
  fundraisingGoal?: number;
  currentlyRaised?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  eventDate = "2024-09-30", // Default September 30th
  currentParticipants = 47,
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
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  const progressPercentage = (currentlyRaised / fundraisingGoal) * 100;

  const scrollToDetails = () => {
    const detailsSection = document.getElementById("build-raise-cross");
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
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 max-w-4xl mx-auto">
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
          Build your fundraising page, raise funds for recovery programs, and
          cross the bridge to celebration this September.
        </p>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 w-full max-w-2xl">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
            <Users className="w-6 h-6 text-white mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {currentParticipants}
            </div>
            <div className="text-sm text-white/80">Bridge Builders</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
            <Target className="w-6 h-6 text-white mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              ${currentlyRaised.toLocaleString()}
            </div>
            <div className="text-sm text-white/80">Raised So Far</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
            <Calendar className="w-6 h-6 text-white mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{timeLeft.days}</div>
            <div className="text-sm text-white/80">Days to Cross</div>
          </div>
        </div>

        {/* Countdown timer */}
        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 mb-8 max-w-lg border border-white/30">
          <h3 className="text-lg font-semibold text-white mb-4">
            Challenge Countdown
          </h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">
                {timeLeft.days}
              </div>
              <div className="text-xs text-white/80">Days</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {timeLeft.hours}
              </div>
              <div className="text-xs text-white/80">Hours</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {timeLeft.minutes}
              </div>
              <div className="text-xs text-white/80">Min</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {timeLeft.seconds}
              </div>
              <div className="text-xs text-white/80">Sec</div>
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
