"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export interface TopFundraiserData {
  id: number;
  name: string;
  raisedAmount: number;
  goalAmount: number;
  pagePath: string;
  avatarUrl?: string;
}

interface TopFundraisersProps {
  fundraisers: TopFundraiserData[];
  title?: string;
  campaignBaseUrl?: string;
  currencyCode?: string;
}

const getInitials = (name: string) => {
  const names = (name || "Unknown").split(" ");
  if (names.length === 1) return names[0][0]?.toUpperCase() || "U";
  return (
    (names[0][0]?.toUpperCase() || "") +
    (names[names.length - 1][0]?.toUpperCase() || "")
  );
};

const CLASSY_BASE_URL =
  process.env.NEXT_PUBLIC_CLASSY_ORG_URL || "https://www.classy.org";

export const TopFundraisers: React.FC<TopFundraisersProps> = ({
  fundraisers,
  title = "Top Supporters",
  campaignBaseUrl = CLASSY_BASE_URL,
  currencyCode = "USD",
}) => {
  if (!fundraisers || fundraisers.length === 0) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No top fundraisers to display yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6 text-center">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fundraisers.map((fundraiser, index) => {
          const percentage =
            fundraiser.goalAmount > 0
              ? Math.min(
                  (fundraiser.raisedAmount / fundraiser.goalAmount) * 100,
                  100,
                )
              : 0;

          return (
            <Link
              href={`${campaignBaseUrl}${fundraiser.pagePath}`}
              key={fundraiser.id}
              className="block hover:no-underline"
            >
              <Card
                className={`
                  flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-200
                  ${
                    index === 0
                      ? "bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 border-amber-200 dark:border-amber-800 ring-1 ring-amber-200 dark:ring-amber-800"
                      : "bg-card"
                  }
                `}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start space-x-3">
                    <span
                      className={`
                        text-2xl font-bold flex-shrink-0 mt-1
                        ${index === 0 ? "text-amber-600 dark:text-amber-400" : "text-primary"}
                      `}
                    >
                      #{index + 1}
                    </span>
                    <Avatar
                      className={`
                        h-14 w-14 border-2 flex-shrink-0
                        ${index === 0 ? "border-amber-300 dark:border-amber-600" : "border-primary/50"}
                      `}
                    >
                      {fundraiser.avatarUrl && (
                        <AvatarImage
                          src={fundraiser.avatarUrl}
                          alt={fundraiser.name}
                        />
                      )}
                      <AvatarFallback
                        className={`
                          text-xl
                          ${
                            index === 0
                              ? "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950"
                              : ""
                          }
                        `}
                      >
                        {getInitials(fundraiser.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle
                        className="text-lg leading-tight break-words hyphens-auto"
                        title={fundraiser.name}
                      >
                        {fundraiser.name}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent
                  className={`
                    flex-grow
                  `}
                >
                  <div
                    className={`
                      text-sm mb-1
                      ${index === 0 ? "text-neutral-700 dark:text-neutral-300" : "text-muted-foreground"}
                    `}
                  >
                    Raised{" "}
                    {(fundraiser.raisedAmount || 0).toLocaleString(undefined, {
                      style: "currency",
                      currency: currencyCode,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                    {" of "}
                    {(fundraiser.goalAmount || 0).toLocaleString(undefined, {
                      style: "currency",
                      currency: currencyCode,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                    {" goal"}
                  </div>
                  <Progress
                    value={percentage}
                    className={`
                      w-full h-3 mb-2
                      ${
                        index === 0
                          ? "bg-amber-100 [&>div]:bg-amber-500 dark:bg-amber-900/30 dark:[&>div]:bg-amber-400"
                          : ""
                      }
                    `}
                  />
                  <div
                    className={`
                      text-xs text-right
                      ${index === 0 ? "text-neutral-600 dark:text-neutral-400" : "text-muted-foreground"}
                    `}
                  >
                    {percentage.toFixed(0)}%
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
