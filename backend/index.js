require('dotenv').config();

const express = require('express');
const cors = require('cors'); // Import CORS
const app = express();
// const port = process.env.PORT || 3001; // Vercel handles the port, this should remain commented

const { getClassyAppAccessToken, getCampaignsByOrganization, getCampaignById, getOrganizationById, getClassyCampaignTransactions, getClassyCampaignFundraisingTeams, getClassyCampaignFundraisingPages, getClassyCampaignTopFundraisers } = require('./classyService');
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
app.get('/', (req, res) => {
  res.send('Express Backend for The Giving Bridge is running!');
});

// Route to get campaigns
app.get('/api/classy/campaigns', async (req, res) => {
  try {
    const orgId = process.env.NEXT_PUBLIC_CLASSY_ORG_ID;
    if (!orgId) {
      return res.status(400).json({ error: 'Classy Organization ID is not configured.' });
    }
    const queryParamsString = new URLSearchParams(req.query).toString();
    const data = await getCampaignsByOrganization(orgId, queryParamsString);
    res.json(data);
  } catch (error) {
    console.error('Error fetching Classy campaigns:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch campaigns' });
  }
});

// Route to get specific campaign details
app.get('/api/classy/campaigns/:campaignId', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const data = await getCampaignById(campaignId); // getCampaignById in classyService handles 'with=overview'
    res.json(data);
  } catch (error) {
    console.error(`Error fetching Classy campaign details for ${req.params.campaignId}:`, error);
    res.status(500).json({ error: error.message || 'Failed to fetch campaign details' });
  }
});

// Route to get organization details
app.get('/api/classy/organizations/:organizationId', async (req, res) => {
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
      res.status(404).json({ error: 'Organization not found or name missing in response' });
    }
  } catch (error) {
    console.error(`Error fetching Classy organization details for ${req.params.organizationId}:`, error);
    res.status(500).json({ error: error.message || 'Failed to fetch organization details' });
  }
});

// Route to get campaign transactions
app.get('/api/classy/campaigns/:campaignId/transactions', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const queryParamsString = new URLSearchParams(req.query).toString();
    const data = await getClassyCampaignTransactions(campaignId, queryParamsString);
    res.json(data);
  } catch (error) {
    console.error(`Error fetching Classy campaign transactions for ${req.params.campaignId}:`, error);
    res.status(500).json({ error: error.message || 'Failed to fetch campaign transactions' });
  }
});

// Route to get campaign fundraising teams
app.get('/api/classy/campaigns/:campaignId/fundraising-teams', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const queryParamsString = new URLSearchParams(req.query).toString();
    const data = await getClassyCampaignFundraisingTeams(campaignId, queryParamsString);
    res.json(data);
  } catch (error) {
    console.error(`Error fetching Classy campaign fundraising teams for ${req.params.campaignId}:`, error);
    res.status(500).json({ error: error.message || 'Failed to fetch fundraising teams' });
  }
});

// Route to get campaign fundraising pages
app.get('/api/classy/campaigns/:campaignId/fundraising-pages', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const queryParamsString = new URLSearchParams(req.query).toString();
    const data = await getClassyCampaignFundraisingPages(campaignId, queryParamsString);
    res.json(data);
  } catch (error) {
    console.error(`Error fetching Classy campaign fundraising pages for ${req.params.campaignId}:`, error);
    res.status(500).json({ error: error.message || 'Failed to fetch fundraising pages' });
  }
});

// Route to get campaign top fundraisers
app.get('/api/classy/campaigns/:campaignId/top-fundraisers', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const queryParamsString = new URLSearchParams(req.query).toString();
    const data = await getClassyCampaignTopFundraisers(campaignId, queryParamsString);
    // The frontend expects { data: [fundraisers] }
    // The Classy /fundraising-pages endpoint returns { data: [pages], total: X, ... }
    // We need to make sure the response is just { data: [...] } if the frontend expects that.
    // For now, let's assume the classyService function already returns the array or the frontend can handle the full Classy response.
    res.json(data); // Assuming classyService returns it in a format the frontend can use or the frontend adapts it.
  } catch (error) {
    console.error(`Error fetching Classy campaign top fundraisers for ${req.params.campaignId}:`, error);
    res.status(500).json({ error: error.message || 'Failed to fetch top fundraisers' });
  }
});

// app.listen() should remain commented out for Vercel serverless deployment
// const port = process.env.PORT || 3001;
// app.listen(port, () => {
//   console.log(`Express Backend server listening on port ${port}`);
// });

module.exports = app; // Export the app for Vercel 