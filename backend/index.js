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

    // DEBUG: Log the raw Classy API response
    console.log("=== TRANSACTIONS DEBUG ===");
    console.log("Raw Classy API response:", JSON.stringify(data, null, 2));
    if (data && data.data && data.data.length > 0) {
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
        // Try multiple possible amount fields from Classy API
        let transactionAmount = 0;
        if (transaction.donation_gross_amount) {
          transactionAmount = transaction.donation_gross_amount;
        } else if (transaction.total_gross_amount) {
          transactionAmount = transaction.total_gross_amount;
        } else if (transaction.initial_gross_amount) {
          transactionAmount = transaction.initial_gross_amount;
        } else if (transaction.amount) {
          transactionAmount = transaction.amount / 100; // Convert cents to dollars if it's the amount field
        }

        console.log(
          `Transaction ${transaction.id}: donation_gross_amount=${transaction.donation_gross_amount}, total_gross_amount=${transaction.total_gross_amount}, initial_gross_amount=${transaction.initial_gross_amount}, amount=${transaction.amount}, using=${transactionAmount}`,
        );

        return sum + transactionAmount;
      }, 0);

      // Transform transactions into activity items for the frontend
      activityItems = data.data.map((transaction) => {
        // Extract donor information
        const donorName = transaction.member_email_address
          ? `${transaction.billing_first_name || ""} ${transaction.billing_last_name || ""}`.trim() ||
            transaction.member_email_address
          : transaction.company_name || "Anonymous";

        // Try multiple possible amount fields from Classy API (same logic as above)
        let transactionAmount = 0;
        if (transaction.donation_gross_amount) {
          transactionAmount = transaction.donation_gross_amount;
        } else if (transaction.total_gross_amount) {
          transactionAmount = transaction.total_gross_amount;
        } else if (transaction.initial_gross_amount) {
          transactionAmount = transaction.initial_gross_amount;
        } else if (transaction.amount) {
          transactionAmount = transaction.amount / 100; // Convert cents to dollars if it's the amount field
        }

        return {
          id: transaction.id,
          userName: donorName,
          action: "donated",
          amount: transactionAmount,
          timestamp: transaction.created_at,
          userAvatar: null, // Classy API doesn't provide avatar URLs
        };
      });
    }

    console.log("Processed totalRaisedAmount:", totalRaisedAmount);
    console.log("Processed activityItems count:", activityItems.length);

    // Return processed data in the format the frontend expects
    res.json({
      totalRaisedAmount,
      activityItems,
    });
  } catch (error) {
    console.error(
      `Error fetching Classy campaign transactions for ${req.params.campaignId}:`,
      error,
    );
    res.status(500).json({
      error: error.message || "Failed to fetch campaign transactions",
    });
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
        processedFundraisers = data.data
          .map((page, index) => {
            // Get the fundraiser name from member info or fallback
            const fundraiserName = page.member
              ? `${page.member.first_name || ""} ${page.member.last_name || ""}`.trim() ||
                page.member.email_address
              : page.alias || `Fundraiser ${index + 1}`;

            // Calculate the raised amount (amount_raised is in cents in Classy API)
            const raisedAmount = page.amount_raised
              ? page.amount_raised / 100
              : page.donation_gross_amount || page.total_gross_amount || 0;
            const goalAmount = page.goal
              ? page.goal / 100
              : page.goal_amount || page.target_amount || 0;

            console.log(
              `Fundraiser ${page.id}: amount_raised=${page.amount_raised}, donation_gross_amount=${page.donation_gross_amount}, total_gross_amount=${page.total_gross_amount}, goal=${page.goal}, goal_amount=${page.goal_amount}, target_amount=${page.target_amount}, converted: raised=${raisedAmount}, goal=${goalAmount}`,
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
