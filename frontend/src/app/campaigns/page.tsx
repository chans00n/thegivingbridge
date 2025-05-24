"use client";

import { useState, useEffect } from "react";
import { CampaignCard } from "@/components/campaign-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Define an interface for the campaign data we expect from the API
interface ApiCampaignData {
  id: number;
  name: string;
  // Classy's campaign object might have `default_page_appeal` for a story/description
  // or `description` might be a shorter field. We'll try `default_page_appeal` first for a better blurb.
  default_page_appeal?: string;
  description?: string; // Fallback if default_page_appeal is not present
  goal: number;
  total_raised?: number; // This field needs confirmation from actual API response. Campaign overview has it.
  // The direct campaign list might have `total_gross_amount` or rely on an overview object.
  // For now, let's assume `total_raised` is available or can be mapped.
  logo_url?: string; // For the main image
  team_cover_photo_url?: string; // Alternative image
  canonical_url?: string; // For linking to the campaign page
  type?: string; // ADDED: type to interface for completeness, though API might use specific values
  overview?: {
    // Added to reflect potential data from 'with=overview'
    total_gross_amount?: number;
    // other overview fields if needed
  };
  // Add other fields as needed from the Classy API campaign object
}

// ADDED: Interface for Classy API's pagination structure (adjust based on actual response)
interface ClassyPaginatedResponse {
  data: ApiCampaignData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next_page_url?: string | null;
  prev_page_url?: string | null;
}

const campaignTypes = [
  { value: "_all_", label: "All Types" },
  { value: "ticketed", label: "Ticketed Event" },
  { value: "peer_to_peer", label: "Peer-to-Peer" },
  { value: "crowdfunding", label: "Crowdfunding" },
  { value: "donation_form", label: "Donation Form" },
];

const ITEMS_PER_PAGE = 9;
const MAX_ITEMS_FOR_CLIENT_SEARCH = 200;

// Props for CampaignCard might need adjustment based on ApiCampaignData
// For now, assuming CampaignCard expects: title, description, raisedAmount, goalAmount, imageUrl, ctaLink

export default function CampaignsPage() {
  // Holds the raw list from API (either one page, or all if searching globally)
  const [sourceCampaigns, setSourceCampaigns] = useState<ApiCampaignData[]>([]);
  // Holds the campaigns to be displayed after all filtering and client-side pagination
  const [displayedCampaigns, setDisplayedCampaigns] = useState<
    ApiCampaignData[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [selectedType, setSelectedType] = useState("_all_");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [apiTotalCampaigns, setApiTotalCampaigns] = useState(0); // Total from API if paginating server-side

  useEffect(() => {
    async function fetchCampaignsData() {
      setLoading(true);
      setError(null);
      const orgIdFromEnv = process.env.NEXT_PUBLIC_CLASSY_ORG_ID;

      if (!orgIdFromEnv) {
        setError("Classy Organization ID is not configured.");
        setLoading(false);
        setSourceCampaigns([]);
        setApiTotalCampaigns(0);
        return;
      }

      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
      const queryParams = new URLSearchParams({
        orgId: orgIdFromEnv,
        status: "active",
        sort: "started_at:desc",
      });

      const shouldFetchMaxItems =
        searchTerm || (selectedType && selectedType !== "_all_");

      if (shouldFetchMaxItems) {
        queryParams.append("per_page", MAX_ITEMS_FOR_CLIENT_SEARCH.toString());
      } else {
        queryParams.append("page", currentPage.toString());
        queryParams.append("per_page", ITEMS_PER_PAGE.toString());
      }

      console.log(
        "[CampaignsPage] Fetching with query params:",
        queryParams.toString(),
      );

      try {
        const url = new URL(`/api/classy/campaigns`, apiBaseUrl);
        url.search = queryParams.toString();
        const response = await fetch(url.toString());

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `API Error: ${response.status}`);
        }
        const result: ClassyPaginatedResponse = await response.json();

        console.log(
          "[CampaignsPage] API Result:",
          JSON.parse(JSON.stringify(result)),
        );

        if (result && Array.isArray(result.data)) {
          setSourceCampaigns(result.data);
          if (!shouldFetchMaxItems) {
            setTotalPages(result.last_page || 1);
            setApiTotalCampaigns(result.total || 0);
          }
        } else {
          console.warn(
            "[CampaignsPage] API result.data is not an array or result is missing.",
          );
          setSourceCampaigns([]);
          setApiTotalCampaigns(0);
          if (!shouldFetchMaxItems) {
            setTotalPages(1);
          }
        }
      } catch (err: unknown) {
        console.error("[CampaignsPage] Fetch error:", err);
        setError(err instanceof Error ? err.message : "Unknown fetch error");
        setSourceCampaigns([]);
        setApiTotalCampaigns(0);
      } finally {
        setLoading(false);
      }
    }

    fetchCampaignsData();
  }, [selectedType, currentPage, searchTrigger, searchTerm]);

  useEffect(() => {
    let processedCampaigns = [...sourceCampaigns];

    if (selectedType && selectedType !== "_all_") {
      processedCampaigns = processedCampaigns.filter(
        (campaign) => campaign.type === selectedType,
      );
    }

    if (searchTerm) {
      processedCampaigns = processedCampaigns.filter((campaign) =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    const performClientSideProcessing =
      searchTerm || (selectedType && selectedType !== "_all_");

    if (performClientSideProcessing) {
      const newTotalPages = Math.ceil(
        processedCampaigns.length / ITEMS_PER_PAGE,
      );
      setTotalPages(newTotalPages > 0 ? newTotalPages : 1);
      setApiTotalCampaigns(processedCampaigns.length);
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setDisplayedCampaigns(processedCampaigns.slice(startIndex, endIndex));
    } else {
      setDisplayedCampaigns(processedCampaigns);
    }
  }, [sourceCampaigns, searchTerm, selectedType, currentPage]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSearchClick = () => {
    setSearchTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, searchTrigger]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Loading active campaigns...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        <p>Error loading campaigns: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Active Campaigns</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center items-center">
        <Input
          type="text"
          placeholder="Search all campaigns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 lg:w-1/3"
        />
        <Button onClick={handleSearchClick} className="ml-2">
          Search
        </Button>
        <Select
          value={selectedType}
          onValueChange={(value) => {
            setSelectedType(value);
          }}
        >
          <SelectTrigger className="w-full md:w-auto md:min-w-[180px] md:ml-2">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            {campaignTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {displayedCampaigns.length === 0 && !loading && (
        <p className="text-center text-neutral-600">
          {searchTerm || (selectedType && selectedType !== "_all_")
            ? "No campaigns match your search/filter."
            : "No active campaigns found."}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedCampaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            title={campaign.name}
            description={
              campaign.default_page_appeal?.trim() ||
              campaign.description?.trim() ||
              "No description available."
            }
            raisedAmount={campaign.total_raised || 0}
            goalAmount={campaign.goal}
            imageUrl={
              campaign.team_cover_photo_url ||
              campaign.logo_url ||
              "/images/placeholders/placeholder-campaign.jpg"
            }
            imageIsLink
            imageLinkHref={`/campaign/${campaign.id}`}
            ctaLink={`/campaign/${campaign.id}`}
            ctaText="Learn More & Donate"
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <Button
            onClick={handlePrevPage}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </Button>
        </div>
      )}
      {apiTotalCampaigns > 0 && (
        <p className="text-center text-sm text-neutral-500 mt-2">
          Total matching campaigns: {apiTotalCampaigns}
        </p>
      )}
    </div>
  );
}
