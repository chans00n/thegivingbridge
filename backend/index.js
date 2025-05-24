require("dotenv").config();

const express = require("express");
const cors = require("cors"); // Import CORS
const app = express();
// const port = process.env.PORT || 3001; // Vercel handles the port, this should remain commented

const {
  getCampaignsByOrganization,
  getCampaignById,
  getOrganizationById,
  getClassyCampaignTransactions,
  getClassyCampaignFundraisingTeams,
  getClassyCampaignFundraisingPages,
  getClassyCampaignTopFundraisers,
} = require("./classyService");
// Removed https require as it's not directly used in index.js after classyService abstraction

// --- Database Placeholder ---
// const { Pool } = require('pg');
// const pool = new Pool({
//   user: process.env.DB_USER,       // From .env
//   host: process.env.DB_HOST,       // From .env
//   database: process.env.DB_NAME,     // From .env
//   password: process.env.DB_PASSWORD, // From .env
//   port: process.env.DB_PORT,       // From .env or default 5432
// });
// --- End Database Placeholder ---

// Middleware
app.use(cors()); // Use CORS middleware
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

// Simple route for root to confirm service is up
app.get("/", (req, res) => {
  res.send("Express Backend for The Giving Bridge is running!");
});

// Route to get campaigns
app.get("/api/classy/campaigns", async (req, res) => {
  try {
    const orgId = process.env.NEXT_PUBLIC_CLASSY_ORG_ID;
    if (!orgId) {
      return res
        .status(400)
        .json({ error: "Classy Organization ID is not configured." });
    }
    const queryParamsString = new URLSearchParams(req.query).toString();
    const data = await getCampaignsByOrganization(orgId, queryParamsString);
    res.json(data);
  } catch (error) {
    console.error("Error fetching Classy campaigns:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch campaigns" });
  }
});

// Route to get specific campaign details
app.get("/api/classy/campaigns/:campaignId", async (req, res) => {
  try {
    const { campaignId } = req.params;
    const data = await getCampaignById(campaignId); // getCampaignById in classyService handles 'with=overview'

    // DEBUG: Log campaign overview data
    console.log("=== CAMPAIGN DETAILS DEBUG ===");
    console.log(
      `Campaign ${campaignId}: Raw response keys:`,
      Object.keys(data || {}),
    );
    if (data && data.overview) {
      console.log("Campaign overview keys:", Object.keys(data.overview));
      console.log("Campaign overview:", JSON.stringify(data.overview, null, 2));
    }

    // Process the campaign data to convert goal from cents to dollars
    if (data && data.goal && typeof data.goal === "number") {
      data.goal = data.goal / 100; // Convert from cents to dollars
      console.log(
        `Campaign ${campaignId}: converted goal from ${data.goal * 100} cents to $${data.goal}`,
      );
    }

    // Log various amount fields that might be present
    if (data) {
      console.log(`Campaign ${campaignId} amounts:`);
      console.log(`  goal: ${data.goal} (converted)`);
      console.log(`  total_raised: ${data.total_raised}`);
      console.log(`  net_amount: ${data.net_amount}`);
      console.log(`  gross_amount: ${data.gross_amount}`);
      if (data.overview) {
        console.log(`  overview.raised_amount: ${data.overview.raised_amount}`);
        console.log(`  overview.net_amount: ${data.overview.net_amount}`);
        console.log(
          `  overview.progress_bar_amount: ${data.overview.progress_bar_amount}`,
        );
        console.log(
          `  overview.hard_credits_amount: ${data.overview.hard_credits_amount}`,
        );
        console.log(
          `  overview.soft_credits_amount: ${data.overview.soft_credits_amount}`,
        );
      }
    }

    res.json(data);
  } catch (error) {
    console.error(
      `Error fetching Classy campaign details for ${req.params.campaignId}:`,
      error,
    );
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch campaign details" });
  }
});

// Route to get organization details
app.get("/api/classy/organizations/:organizationId", async (req, res) => {
  try {
    const { organizationId } = req.params;
    const queryParamsString = new URLSearchParams(req.query).toString();
    const data = await getOrganizationById(organizationId, queryParamsString);
    // The frontend expects { organizationName: 'Name' }
    // Classy API returns { name: 'Name', ...otherProps }
    // We need to adapt this response for the frontend
    if (data && data.name) {
      res.json({ organizationName: data.name });
    } else {
      res
        .status(404)
        .json({ error: "Organization not found or name missing in response" });
    }
  } catch (error) {
    console.error(
      `Error fetching Classy organization details for ${req.params.organizationId}:`,
      error,
    );
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch organization details" });
  }
});

// Route to get campaign transactions
app.get("/api/classy/campaigns/:campaignId/transactions", async (req, res) => {
  try {
    const { campaignId } = req.params;
    const queryParamsString = new URLSearchParams(req.query).toString();
    const data = await getClassyCampaignTransactions(
      campaignId,
      queryParamsString,
    );

    // DEBUG: Log complete transaction structure
    console.log("=== TRANSACTIONS DEBUG ===");
    console.log(
      `Campaign ${campaignId}: Processing ${data?.data?.length || 0} transactions`,
    );

    if (data && data.data && data.data.length > 0) {
      console.log("Sample transaction keys:", Object.keys(data.data[0]));
      console.log(
        "First transaction sample:",
        JSON.stringify(data.data[0], null, 2),
      );
    }

    // Process the raw Classy API response for frontend consumption
    let totalRaisedAmount = 0;
    let activityItems = [];

    if (data && Array.isArray(data.data)) {
      // Calculate total raised amount from all transactions
      totalRaisedAmount = data.data.reduce((sum, transaction) => {
        // Try multiple amount fields and log what we find
        const donation_gross = transaction.donation_gross_amount || 0;
        const total_gross = transaction.total_gross_amount || 0;
        const initial_gross = transaction.initial_gross_amount || 0;
        const amount = transaction.amount || 0;
        const purchased_amount = transaction.purchased_amount || 0;
        const net_amount = transaction.net_amount || 0;

        console.log(
          `Transaction ${transaction.id}: donation_gross=${donation_gross}, total_gross=${total_gross}, initial_gross=${initial_gross}, amount=${amount}, purchased_amount=${purchased_amount}, net_amount=${net_amount}`,
        );

        // Use the first non-zero amount we find
        const transactionAmount =
          donation_gross ||
          total_gross ||
          initial_gross ||
          purchased_amount ||
          net_amount ||
          amount;
        console.log(
          `Transaction ${transaction.id}: Using amount=${transactionAmount}`,
        );

        return sum + transactionAmount;
      }, 0);

      console.log(
        `Total calculated from ${data.data.length} transactions: $${totalRaisedAmount}`,
      );

      // Transform transactions into activity items for the frontend
      activityItems = data.data.map((transaction) => {
        // Extract donor information
        const donorName = transaction.member_email_address
          ? `${transaction.billing_first_name || ""} ${transaction.billing_last_name || ""}`.trim() ||
            transaction.member_email_address
          : transaction.company_name || "Anonymous";

        // Use the same logic as above for individual transaction amounts
        const donation_gross = transaction.donation_gross_amount || 0;
        const total_gross = transaction.total_gross_amount || 0;
        const initial_gross = transaction.initial_gross_amount || 0;
        const amount = transaction.amount || 0;
        const purchased_amount = transaction.purchased_amount || 0;
        const net_amount = transaction.net_amount || 0;

        const transactionAmount =
          donation_gross ||
          total_gross ||
          initial_gross ||
          purchased_amount ||
          net_amount ||
          amount;

        return {
          id: transaction.id,
          donorName: donorName,
          amount: transactionAmount,
          timestamp: transaction.purchased_at || transaction.created_at,
          message: transaction.comment || "",
          isAnonymous: transaction.is_anonymous || false,
        };
      });
    }

    console.log(`=== TRANSACTIONS SUMMARY ===`);
    console.log(`Total raised: $${totalRaisedAmount}`);
    console.log(`Activity items: ${activityItems.length}`);
    console.log(`Sample activity item:`, activityItems[0]);

    // Return the processed data
    res.json({
      totalRaisedAmount,
      activityItems,
      pagination: {
        currentPage: data.current_page || 1,
        totalPages: data.last_page || 1,
        total: data.total || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching campaign transactions:", error);
    res.status(500).json({ error: "Failed to fetch campaign transactions" });
  }
});

// Route to get campaign fundraising teams
app.get(
  "/api/classy/campaigns/:campaignId/fundraising-teams",
  async (req, res) => {
    try {
      const { campaignId } = req.params;
      const queryParamsString = new URLSearchParams(req.query).toString();
      const data = await getClassyCampaignFundraisingTeams(
        campaignId,
        queryParamsString,
      );
      res.json(data);
    } catch (error) {
      console.error(
        `Error fetching Classy campaign fundraising teams for ${req.params.campaignId}:`,
        error,
      );
      res
        .status(500)
        .json({ error: error.message || "Failed to fetch fundraising teams" });
    }
  },
);

// Route to get campaign fundraising pages
app.get(
  "/api/classy/campaigns/:campaignId/fundraising-pages",
  async (req, res) => {
    try {
      const { campaignId } = req.params;
      const queryParamsString = new URLSearchParams(req.query).toString();
      const data = await getClassyCampaignFundraisingPages(
        campaignId,
        queryParamsString,
      );
      res.json(data);
    } catch (error) {
      console.error(
        `Error fetching Classy campaign fundraising pages for ${req.params.campaignId}:`,
        error,
      );
      res
        .status(500)
        .json({ error: error.message || "Failed to fetch fundraising pages" });
    }
  },
);

// Route to get campaign top fundraisers
app.get(
  "/api/classy/campaigns/:campaignId/top-fundraisers",
  async (req, res) => {
    try {
      const { campaignId } = req.params;
      const queryParamsString = new URLSearchParams(req.query).toString();
      const data = await getClassyCampaignTopFundraisers(
        campaignId,
        queryParamsString,
      );

      // DEBUG: Log the raw Classy API response
      console.log("=== TOP FUNDRAISERS DEBUG ===");
      console.log("Raw Classy API response:", JSON.stringify(data, null, 2));
      if (data && data.data && data.data.length > 0) {
        console.log(
          "First fundraiser sample:",
          JSON.stringify(data.data[0], null, 2),
        );
      }

      // Process the fundraising pages data for the frontend
      let processedFundraisers = [];

      if (data && Array.isArray(data.data)) {
        console.log(`Processing ${data.data.length} fundraising pages`);

        processedFundraisers = data.data
          .map((page, index) => {
            // DEBUG: Log all available fields for the first fundraiser
            if (index === 0) {
              console.log("Sample fundraiser keys:", Object.keys(page));
              console.log(
                "Sample fundraiser data:",
                JSON.stringify(page, null, 2),
              );
            }

            // Get the fundraiser name - use title or alias
            const fundraiserName =
              page.title || page.alias || `Fundraiser ${index + 1}`;

            // Try to get raised amount from potential overview/aggregate data
            let raisedAmount = 0;

            // Check for various possible amount fields that might be included with 'with=overview,aggregates'
            if (page.overview && page.overview.raised_amount) {
              raisedAmount = page.overview.raised_amount;
              console.log(`  Found overview.raised_amount: ${raisedAmount}`);
            } else if (page.aggregates && page.aggregates.raised_amount) {
              raisedAmount = page.aggregates.raised_amount;
              console.log(`  Found aggregates.raised_amount: ${raisedAmount}`);
            } else if (page.amount_raised) {
              raisedAmount = page.amount_raised / 100; // Convert from cents if present
              console.log(
                `  Found amount_raised: ${page.amount_raised} cents = $${raisedAmount}`,
              );
            } else if (page.total_raised) {
              raisedAmount = page.total_raised;
              console.log(`  Found total_raised: ${raisedAmount}`);
            }

            // For goals: the 'goal' field appears to already be in dollars, not cents
            const goalAmount = page.goal || 0; // Don't divide by 100 - already in dollars

            console.log(`Fundraiser ${page.id}:`);
            console.log(`  Name: ${fundraiserName}`);
            console.log(
              `  Goal from API: ${page.goal} (keeping as dollars = $${goalAmount})`,
            );
            console.log(`  Raw goal: ${page.raw_goal}`);
            console.log(`  Raised amount: $${raisedAmount}`);

            return {
              id: page.id,
              name: fundraiserName,
              raisedAmount: raisedAmount,
              goalAmount: goalAmount,
              pagePath: page.canonical_url || `/fundraising-pages/${page.id}`,
              avatarUrl: page.logo_url || null,
            };
          })
          // Sort by raised amount first, then by goal amount as fallback
          .sort((a, b) => {
            if (b.raisedAmount !== a.raisedAmount) {
              return b.raisedAmount - a.raisedAmount;
            }
            return b.goalAmount - a.goalAmount;
          });
      }

      console.log("Processed fundraisers count:", processedFundraisers.length);
      console.log("Processed fundraisers sample:", processedFundraisers[0]);

      // Return processed data in the format the frontend expects
      res.json({
        data: processedFundraisers,
      });
    } catch (error) {
      console.error(
        `Error fetching Classy campaign top fundraisers for ${req.params.campaignId}:`,
        error,
      );
      res
        .status(500)
        .json({ error: error.message || "Failed to fetch top fundraisers" });
    }
  },
);

// app.listen() should remain commented out for Vercel serverless deployment
// const port = process.env.PORT || 3001;
// app.listen(port, () => {
//   console.log(`Express Backend server listening on port ${port}`);
// });

module.exports = app; // Export the app for Vercel
