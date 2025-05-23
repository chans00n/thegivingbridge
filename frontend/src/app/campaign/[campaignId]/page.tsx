"use client"; // For potential client-side interactions, hooks

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { CampaignHero } from "@/components/campaign-hero";
import { CampaignStory } from "@/components/campaign-story";
import { CampaignActivityFeed } from "@/components/campaign-activity-feed";
import { SocialShareButtons } from "@/components/social-share-buttons";
import { TopFundraisers, TopFundraiserData } from "@/components/TopFundraisers";

// Import CampaignData from the component file or a shared types file
// For now, assuming it's exported from campaign-hero.tsx or we redefine it if not
// Let's try to import it. If not available, the linter will tell us.
// We will remove the local definition of CampaignData and MOCK_CAMPAIGN_DATA
// as the hero component now defines CampaignData, and for this step,
// we are just integrating the hero. The page itself will get its data differently later.

// Mock data for now - this should ideally come from a data fetching layer
// For the purpose of integrating CampaignHero, we will use the campaign object
// obtained from MOCK_CAMPAIGN_DATA which is now defined within the page itself for simplicity
// until data fetching is implemented.

interface ActivityItem {
  id: string;
  type: "donation" | "comment";
  userName: string;
  userAvatarUrl?: string;
  amount?: number;
  message?: string;
  timestamp: string;
}

// ADDED: Utility function to format date strings to relative time
function formatRelativeTime(dateString: string): string {
  if (!dateString) return "Unknown";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Unknown";

  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const weeks = Math.round(days / 7);
  const months = Math.round(days / 30.44); // Average days in month
  const years = Math.round(days / 365);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (weeks === 1) return "1w ago";
  if (days < 30) return `${weeks}w ago`;
  if (months === 1) return "1mo ago";
  if (days < 365) return `${months}mo ago`;
  if (years === 1) return "1y ago";
  return `${years}y ago`;
}

// Updated CampaignData interface to better match Classy API structure
interface CampaignDataFromAPI {
  id: number; // Classy uses number for id
  name: string; // This is the campaign title
  logo_url?: string; // For campaign image
  team_cover_photo_url?: string; // ADDED: For campaign cover image
  goal: number; // Goal amount
  organization_id?: number;
  currency_code?: string;
  default_page_appeal?: string; // Added for campaign story
  total_raised?: number; // Total raised amount from API
  overview?: {
    // Campaign overview data when using 'with=overview'
    raised_amount?: number;
    progress_bar_amount?: number;
    net_amount?: number;
    hard_credits_amount?: number;
    soft_credits_amount?: number;
    donations_count?: number;
    donors_count?: number;
    fees_amount?: number;
    largest_donation_amount?: number;
    average_donation_amount?: number;
  };
}

// This is the type expected by CampaignHero and other components
interface CampaignPageData {
  id: string;
  title: string;
  imageUrl?: string;
  story: string;
  goalAmount: number;
  raisedAmount: number; // Placeholder for now
  organizerName: string; // Placeholder for now
  currencyCode?: string;
}

// interface CampaignPageProps { // Params prop is no longer used
// params: {
// campaignId: string;
// };
// }

export default function CampaignPage(/*{ params }: CampaignPageProps*/) {
  // params prop removed
  const { campaignId } = useParams<{ campaignId: string }>(); // MODIFIED: Used useParams hook

  const [campaignPageData, setCampaignPageData] =
    useState<CampaignPageData | null>(null);

  // ADDED: State for activity items
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // ADDED: State for top fundraisers
  const [topFundraisers, setTopFundraisers] = useState<TopFundraiserData[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!campaignId) return;

    async function fetchCampaignData() {
      setLoading(true);
      setError(null);
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

      try {
        // Fetch primary campaign data
        const campaignUrl = new URL(
          `/api/classy/campaigns/${campaignId}`,
          apiBaseUrl,
        );
        const campaignResponse = await fetch(campaignUrl.toString());

        if (!campaignResponse.ok) {
          const errorData = await campaignResponse.json();
          throw new Error(
            errorData.message ||
              `Failed to fetch campaign data: ${campaignResponse.status}`,
          );
        }
        const campaignResult = await campaignResponse.json();

        // ADDED: Check if the expected data structure is present
        if (!campaignResult || typeof campaignResult.id === "undefined") {
          const errorMessage =
            campaignResult?.error ||
            campaignResult?.message ||
            "Campaign data is missing, in an unexpected format, or lacks an ID.";
          console.error(
            "Error from backend or malformed campaign data (expected direct campaign object):",
            campaignResult,
          );
          throw new Error(errorMessage);
        }

        const apiData = campaignResult as CampaignDataFromAPI;

        // Prepare for parallel fetches
        let raisedAmount = 0;
        let fetchedActivities: ActivityItem[] = [];
        let organizerName = `Organization ID: ${apiData.organization_id || "N/A"}`;
        let fetchedTopFundraisers: TopFundraiserData[] = [];

        // Try to get raised amount from campaign overview first
        if (apiData.overview && apiData.overview.raised_amount) {
          raisedAmount = apiData.overview.raised_amount;
          console.log(`Using overview raised amount: $${raisedAmount}`);
        } else if (apiData.overview && apiData.overview.progress_bar_amount) {
          raisedAmount = apiData.overview.progress_bar_amount;
          console.log(`Using overview progress bar amount: $${raisedAmount}`);
        } else if (apiData.total_raised) {
          raisedAmount = apiData.total_raised;
          console.log(`Using campaign total_raised: $${raisedAmount}`);
        } else {
          console.log(
            "No raised amount found in campaign data, will try to calculate from transactions",
          );
        }

        const promises = [];

        // Promise for transactions and activities
        promises.push(
          fetch(
            new URL(
              `/api/classy/campaigns/${campaignId}/transactions`,
              apiBaseUrl,
            ).toString(),
          )
            .then(async (res) => {
              if (res.ok) {
                const result = await res.json();
                // Only use transaction total if we don't already have a raised amount from campaign data
                if (
                  raisedAmount === 0 &&
                  result &&
                  typeof result.totalRaisedAmount === "number"
                ) {
                  raisedAmount = result.totalRaisedAmount;
                  console.log(
                    `Using calculated total from transactions: $${raisedAmount}`,
                  );
                }
                if (result && Array.isArray(result.activityItems)) {
                  fetchedActivities = result.activityItems.map(
                    (activity: ActivityItem) => ({
                      ...activity,
                      timestamp: formatRelativeTime(activity.timestamp),
                    }),
                  );
                } else {
                  console.warn(
                    "activityItems not found in backend response or not an array.",
                    result,
                  );
                }
              } else {
                console.warn(
                  `Failed to fetch campaign transactions data: ${res.status}`,
                );
                const errorDetails = await res.json().catch(() => null);
                console.warn("Transactions fetch error details:", errorDetails);
              }
            })
            .catch((err) =>
              console.warn("Error fetching campaign transactions:", err),
            ),
        );

        // Promise for organization name (if organization_id exists)
        if (apiData.organization_id) {
          promises.push(
            fetch(
              new URL(
                `/api/classy/organizations/${apiData.organization_id}`,
                apiBaseUrl,
              ).toString(),
            )
              .then(async (res) => {
                if (res.ok) {
                  const result = await res.json();
                  if (result && result.organizationName) {
                    organizerName = result.organizationName;
                  }
                } else {
                  console.warn(
                    `Failed to fetch organization data: ${res.status}`,
                  );
                }
              })
              .catch((err) =>
                console.warn("Error fetching organization details:", err),
              ),
          );
        }

        // Promise for top fundraisers
        promises.push(
          fetch(
            new URL(
              `/api/classy/campaigns/${campaignId}/top-fundraisers`,
              apiBaseUrl,
            ).toString(),
          )
            .then(async (res) => {
              if (res.ok) {
                const result = await res.json();
                if (result && Array.isArray(result.data)) {
                  fetchedTopFundraisers = result.data;
                }
              } else {
                console.warn(`Failed to fetch top fundraisers: ${res.status}`);
              }
            })
            .catch((err) =>
              console.warn("Error fetching top fundraisers:", err),
            ),
        );

        // Execute all promises in parallel
        await Promise.all(promises);

        // Set states after all promises have resolved (or failed gracefully)
        setActivities(fetchedActivities);
        setTopFundraisers(fetchedTopFundraisers);

        const adaptedData: CampaignPageData = {
          id: apiData.id.toString(),
          title: apiData.name,
          imageUrl: apiData.team_cover_photo_url || apiData.logo_url,
          story:
            apiData.default_page_appeal ||
            "This campaign doesn\'t have a story provided yet. Check back soon!",
          goalAmount: apiData.goal,
          raisedAmount: raisedAmount, // Use the value fetched in parallel
          organizerName: organizerName, // Use the value fetched in parallel
          currencyCode: apiData.currency_code || "USD",
        };
        setCampaignPageData(adaptedData);
      } catch (err: unknown) {
        console.error("Error fetching campaign data:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchCampaignData();
  }, [campaignId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Loading campaign details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!campaignPageData) {
    notFound();
    return null;
  }

  const pageUrl = `/campaign/${campaignPageData.id}`;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-900">
      {/* Mobile Layout: Single Column (default for mobile) */}
      <div className="container mx-auto px-4 py-8 lg:hidden">
        <CampaignHero
          campaign={campaignPageData}
          onDonateClick={() =>
            alert(
              "Donate Clicked! This will eventually go to the Classy donation page.",
            )
          }
        />

        <div className="my-8">
          <CampaignStory story={campaignPageData.story} title="Our Story" />
        </div>

        <div className="my-8">
          <TopFundraisers
            fundraisers={topFundraisers}
            currencyCode={campaignPageData.currencyCode}
          />
        </div>

        <div className="my-8">
          <CampaignActivityFeed
            activities={activities}
            title="Recent Support"
          />
        </div>

        <div className="my-8">
          <SocialShareButtons
            pageUrl={pageUrl}
            pageTitle={campaignPageData.title}
          />
        </div>
      </div>

      {/* Desktop Layout: Two Column (hidden on mobile, shown on lg+) */}
      <div className="hidden lg:flex lg:min-h-screen">
        {/* Left Column: Scrolling Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8 max-w-4xl">
            {/* Story Section */}
            <div className="mb-12">
              <CampaignStory story={campaignPageData.story} title="Our Story" />
            </div>

            {/* Top Supporters Section */}
            <div className="mb-12">
              <TopFundraisers
                fundraisers={topFundraisers}
                currencyCode={campaignPageData.currencyCode}
              />
            </div>

            {/* Recent Support Section */}
            <div className="mb-12">
              <CampaignActivityFeed
                activities={activities}
                title="Recent Support"
              />
            </div>

            {/* Social Share Section */}
            <div className="mb-8">
              <SocialShareButtons
                pageUrl={pageUrl}
                pageTitle={campaignPageData.title}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Fixed Hero Sidebar */}
        <div className="w-96 bg-white dark:bg-neutral-800 shadow-xl">
          <div className="sticky top-0 h-screen overflow-y-auto">
            <div className="p-6">
              <CampaignHero
                campaign={campaignPageData}
                compact={true}
                onDonateClick={() =>
                  alert(
                    "Donate Clicked! This will eventually go to the Classy donation page.",
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
