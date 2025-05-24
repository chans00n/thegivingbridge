"use client";

import Image from "next/image";
import { AnimatedProgress } from "@/components/ui/animated-progress";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Assuming CampaignData interface is defined elsewhere and imported,
// or defined here if this component is self-contained with its props.
// For now, let's duplicate a simplified version for clarity.
interface CampaignData {
  id: string;
  title: string;
  imageUrl?: string;
  story: string; // Not used directly in Hero, but part of the full data
  goalAmount: number;
  raisedAmount: number;
  organizerName: string;
}

interface CampaignHeroProps {
  campaign: CampaignData;
  onDonateClick?: () => void; // Optional: for when donate button functionality is added
  compact?: boolean; // Optional: for sidebar/compact layout
}

export const CampaignHero: React.FC<CampaignHeroProps> = ({
  campaign,
  onDonateClick,
  compact = false,
}) => {
  const progressPercentage =
    campaign.goalAmount > 0
      ? (campaign.raisedAmount / campaign.goalAmount) * 100
      : 0;

  if (compact) {
    // Compact layout for sidebar
    return (
      <div className="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-neutral-800">
        {campaign.imageUrl && (
          <div className="w-full">
            <AspectRatio ratio={4 / 3}>
              <Image
                src={campaign.imageUrl}
                alt={campaign.title}
                fill
                className="object-cover"
                priority
              />
            </AspectRatio>
          </div>
        )}
        <div className="p-4">
          <h1 className="mb-3 text-xl font-bold leading-tight tracking-tight text-neutral-900 dark:text-white">
            {campaign.title}
          </h1>
          <p className="mb-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Organized by: {campaign.organizerName}
          </p>

          <div className="mb-4">
            <div className="mb-2 text-center">
              <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                ${campaign.raisedAmount.toLocaleString()}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                raised of ${campaign.goalAmount.toLocaleString()} goal
              </div>
            </div>
            <AnimatedProgress
              value={progressPercentage}
              className="w-full mb-2"
              size="md"
              showMilestones={true}
              celebrateGoal={true}
              milestones={[25, 50, 75, 90]}
            />
            <div className="text-center text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {progressPercentage.toFixed(0)}% Complete
            </div>
          </div>

          <Button size="lg" className="w-full text-lg" onClick={onDonateClick}>
            Donate Now
          </Button>
        </div>
      </div>
    );
  }

  // Default layout for mobile/full-width
  return (
    <div className="mb-8 overflow-hidden rounded-lg bg-white shadow-lg dark:bg-neutral-800">
      {campaign.imageUrl && (
        <div className="w-full">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={campaign.imageUrl}
              alt={campaign.title}
              fill
              className="object-cover"
              priority // Consider adding priority if it's often LCP
            />
          </AspectRatio>
        </div>
      )}
      <div className="p-6">
        <h1 className="mb-3 text-3xl font-bold leading-tight tracking-tight text-neutral-900 dark:text-white md:text-4xl">
          {campaign.title}
        </h1>
        <p className="mb-4 text-base font-medium text-neutral-600 dark:text-neutral-400">
          Organized by: {campaign.organizerName}
        </p>

        <div className="mb-4">
          <div className="mb-1 flex justify-between text-sm font-medium text-neutral-700 dark:text-neutral-300">
            <span>Raised: ${campaign.raisedAmount.toLocaleString()}</span>
            <span>Goal: ${campaign.goalAmount.toLocaleString()}</span>
          </div>
          <AnimatedProgress
            value={progressPercentage}
            className="w-full"
            size="md"
            showMilestones={true}
            celebrateGoal={true}
            milestones={[25, 50, 75, 90]}
          />
        </div>

        <Button
          size="lg"
          className="w-full text-lg sm:w-auto"
          onClick={onDonateClick} // Attach onClick handler
        >
          Donate Now
        </Button>
      </div>
    </div>
  );
};
