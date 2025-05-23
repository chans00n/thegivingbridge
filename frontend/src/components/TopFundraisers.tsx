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
  const names = name.split(" ");
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
                      ? "bg-primary text-primary-foreground border-amber-400 dark:border-amber-300 ring-2 ring-amber-400 dark:ring-amber-300"
                      : "bg-card"
                  }
                `}
              >
                <CardHeader
                  className={`
                    flex flex-row items-center space-x-4 pb-2
                  `}
                >
                  <span
                    className={`
                      text-3xl font-bold
                      ${index === 0 ? "text-amber-400 dark:text-amber-300" : "text-primary"}
                    `}
                  >
                    #{index + 1}
                  </span>
                  <Avatar
                    className={`
                      h-16 w-16 border-2
                      ${index === 0 ? "border-amber-400 dark:border-amber-300" : "border-primary/50"}
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
                        text-2xl
                        ${
                          index === 0
                            ? "text-amber-500 bg-primary-foreground dark:text-amber-400 dark:bg-primary-foreground"
                            : ""
                        }
                      `}
                    >
                      {getInitials(fundraiser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle
                      className={`
                        text-xl leading-tight truncate
                      `}
                    >
                      {fundraiser.name}
                    </CardTitle>
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
                      ${index === 0 ? "text-primary-foreground/80 dark:text-primary-foreground/80" : "text-muted-foreground"}
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
                          ? "bg-primary-foreground/20 [&>div]:bg-amber-400 dark:bg-primary-foreground/20 dark:[&>div]:bg-amber-500"
                          : ""
                      }
                    `}
                  />
                  <div
                    className={`
                      text-xs text-right
                      ${index === 0 ? "text-primary-foreground/70 dark:text-primary-foreground/70" : "text-muted-foreground"}
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
