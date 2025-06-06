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
    const detailsSection = document.getElementById("event-details");
    detailsSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center dark:bg-neutral-900"
      style={{
        backgroundImage: `url('/images/placeholders/geoffroy-hauwen-Nba45LGrCfM-unsplash.jpg')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70"></div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 max-w-4xl mx-auto">
        {/* Main headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 shadow-lg">
          Join The Giving Bridge Challenge!
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl lg:text-2xl text-neutral-200 mb-8 shadow-md max-w-2xl">
          Make a difference this September. Support recovery, build community,
          and inspire hope through the power of giving.
        </p>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 w-full max-w-2xl">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <Users className="w-6 h-6 text-white mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {currentParticipants}
            </div>
            <div className="text-sm text-neutral-200">Participants</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <Target className="w-6 h-6 text-white mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              ${currentlyRaised.toLocaleString()}
            </div>
            <div className="text-sm text-neutral-200">Raised So Far</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <Calendar className="w-6 h-6 text-white mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{timeLeft.days}</div>
            <div className="text-sm text-neutral-200">Days Remaining</div>
          </div>
        </div>

        {/* Countdown timer */}
        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 mb-8 max-w-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Event Countdown
          </h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">
                {timeLeft.days}
              </div>
              <div className="text-xs text-neutral-200">Days</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {timeLeft.hours}
              </div>
              <div className="text-xs text-neutral-200">Hours</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {timeLeft.minutes}
              </div>
              <div className="text-xs text-neutral-200">Min</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {timeLeft.seconds}
              </div>
              <div className="text-xs text-neutral-200">Sec</div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-md mb-8">
          <div className="flex justify-between text-white text-sm mb-2">
            <span>${currentlyRaised.toLocaleString()} raised</span>
            <span>${fundraisingGoal.toLocaleString()} goal</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="text-center text-white text-sm mt-2">
            {progressPercentage.toFixed(1)}% of goal reached
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            asChild
            size="lg"
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-semibold"
          >
            <Link href="/interest-form">Join the Challenge</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={scrollToDetails}
            className="border-white text-white hover:bg-white hover:text-neutral-900 px-8 py-3 text-lg font-semibold"
          >
            Learn More
          </Button>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToDetails}
          className="animate-bounce text-white hover:text-neutral-200 transition-colors"
          aria-label="Scroll to learn more"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
