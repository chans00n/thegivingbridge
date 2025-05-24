"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface CampaignCardProps {
  imageUrl?: string;
  title: string;
  description: string;
  raisedAmount: number;
  goalAmount: number;
  ctaText?: string;
  onCtaClick?: () => void;
  ctaLink?: string;
  imageIsLink?: boolean;
  imageLinkHref?: string;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  imageUrl,
  title,
  description,
  raisedAmount,
  goalAmount,
  ctaText = "View Details",
  onCtaClick,
  ctaLink,
  imageIsLink,
  imageLinkHref,
}) => {
  const progressPercentage =
    goalAmount > 0 ? (raisedAmount / goalAmount) * 100 : 0;

  const imageContent = (
    <AspectRatio ratio={1 / 1}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-opacity duration-200 ease-in-out group-hover:opacity-75"
        />
      ) : (
        <div className="w-full h-full bg-neutral-200 flex items-center justify-center transition-opacity duration-200 ease-in-out group-hover:opacity-75">
          <span className="text-neutral-500">Placeholder Image</span>
        </div>
      )}
    </AspectRatio>
  );

  return (
    <Card className="group w-full overflow-hidden transition-shadow duration-200 ease-in-out hover:shadow-xl">
      <CardHeader className="p-0">
        {imageIsLink && imageLinkHref ? (
          <Link href={imageLinkHref} passHref>
            {imageContent}
          </Link>
        ) : (
          imageContent
        )}
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle
          className="text-xl font-semibold mb-2 truncate"
          title={title}
        >
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-neutral-600 mb-3 h-10 overflow-hidden text-ellipsis">
          {description}
        </CardDescription>
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Raised: ${raisedAmount.toLocaleString()}</span>
            <span>Goal: ${goalAmount.toLocaleString()}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {ctaLink ? (
          <Link href={ctaLink} passHref className="w-full">
            <Button className="w-full">{ctaText}</Button>
          </Link>
        ) : onCtaClick ? (
          <Button onClick={onCtaClick} className="w-full">
            {ctaText}
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
};
