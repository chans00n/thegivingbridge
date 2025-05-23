"use client";

import Image from "next/image";
import { Progress } from "@/components/ui/progress";
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
}

export const CampaignHero: React.FC<CampaignHeroProps> = ({
  campaign,
  onDonateClick,
}) => {
  const progressPercentage =
    campaign.goalAmount > 0
      ? (campaign.raisedAmount / campaign.goalAmount) * 100
      : 0;

  return (
    <div className="mb-8 overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
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
        <h1 className="mb-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-4xl">
          {campaign.title}
        </h1>
        <p className="mb-4 text-base font-medium text-gray-600 dark:text-gray-400">
          Organized by: {campaign.organizerName}
        </p>

        <div className="mb-4">
          <div className="mb-1 flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
            <span>Raised: ${campaign.raisedAmount.toLocaleString()}</span>
            <span>Goal: ${campaign.goalAmount.toLocaleString()}</span>
          </div>
          <Progress value={progressPercentage} className="h-3 w-full" />
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
