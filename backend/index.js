require('dotenv').config();

const express = require('express');
const cors = require('cors'); // Import CORS
const app = express();
// const port = process.env.PORT || 3001; // Vercel handles the port

const { getClassyAppAccessToken, getClassyCampaigns, getClassyCampaignDetails, getClassyCampaignTransactions, getClassyCampaignFundraisingTeams, getClassyCampaignFundraisingPages } = require('./classyService');
const https = require('https');

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
    const data = await getClassyCampaigns(orgId, req.query);
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
    const data = await getClassyCampaignDetails(campaignId, req.query);
    res.json(data);
  } catch (error) {
    console.error(`Error fetching Classy campaign details for ${req.params.campaignId}:`, error);
    res.status(500).json({ error: error.message || 'Failed to fetch campaign details' });
  }
});

// Route to get campaign transactions
app.get('/api/classy/campaigns/:campaignId/transactions', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const data = await getClassyCampaignTransactions(campaignId, req.query);
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
    const data = await getClassyCampaignFundraisingTeams(campaignId, req.query);
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
    const data = await getClassyCampaignFundraisingPages(campaignId, req.query);
    res.json(data);
  } catch (error) {
    console.error(`Error fetching Classy campaign fundraising pages for ${req.params.campaignId}:`, error);
    res.status(500).json({ error: error.message || 'Failed to fetch fundraising pages' });
  }
});


// app.listen(port, () => {
//   console.log(`Minimal Backend server listening on port ${port}`);
// });

module.exports = app; // Export the app for Vercel 