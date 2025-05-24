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

            // Get the fundraiser name from member info or fallback
            const fundraiserName = page.member
              ? `${page.member.first_name || ""} ${page.member.last_name || ""}`.trim() ||
                page.member.email_address
              : page.alias || `Fundraiser ${index + 1}`;

            // Try multiple amount fields with detailed logging
            const amount_raised_cents = page.amount_raised || 0;
            const amount_raised_dollars = amount_raised_cents / 100;
            const donation_gross = page.donation_gross_amount || 0;
            const total_gross = page.total_gross_amount || 0;
            const net_amount = page.net_amount || 0;
            const progress_bar_amount = page.progress_bar_amount || 0;
            const hard_credits = page.hard_credits_amount || 0;
            const soft_credits = page.soft_credits_amount || 0;

            // Try multiple goal fields
            const goal_cents = page.goal || 0;
            const goal_dollars = goal_cents / 100;
            const goal_amount = page.goal_amount || 0;
            const target_amount = page.target_amount || 0;

            console.log(`Fundraiser ${page.id}:`);
            console.log(
              `  Amount fields: amount_raised=${amount_raised_cents} (=$${amount_raised_dollars}), donation_gross=${donation_gross}, total_gross=${total_gross}, net_amount=${net_amount}, progress_bar_amount=${progress_bar_amount}, hard_credits=${hard_credits}, soft_credits=${soft_credits}`,
            );
            console.log(
              `  Goal fields: goal=${goal_cents} (=$${goal_dollars}), goal_amount=${goal_amount}, target_amount=${target_amount}`,
            );

            // Use the first non-zero amount we find
            const raisedAmount =
              amount_raised_dollars ||
              donation_gross ||
              total_gross ||
              net_amount ||
              progress_bar_amount ||
              hard_credits ||
              soft_credits ||
              0;
            const goalAmount =
              goal_dollars || goal_amount || target_amount || 0;

            console.log(
              `  Final values: raised=$${raisedAmount}, goal=$${goalAmount}`,
            );

            return {
              id: page.id,
              name: fundraiserName,
              raisedAmount: raisedAmount, // Match the interface field name
              goalAmount: goalAmount, // Match the interface field name
              pagePath: page.canonical_url || `/fundraising-pages/${page.id}`, // Provide the page path
              avatarUrl: null, // Classy API doesn't provide avatar URLs
            };
          })
          // Sort by amount raised in descending order
          .sort((a, b) => b.raisedAmount - a.raisedAmount);
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
