require('dotenv').config(); // For local development

const fetch = require('node-fetch'); // Ensure node-fetch is used if in Node environment

const CLASSY_API_BASE = 'https://api.classy.org/2.0';
const TOKEN_URL = 'https://api.classy.org/oauth2/auth';

let classyAppAccessToken = null;
let tokenExpiryTime = 0;

// Function to get and cache the Classy App Access Token
async function getClassyAppAccessToken() {
  const now = Date.now();
  if (classyAppAccessToken && now < tokenExpiryTime) {
    return classyAppAccessToken;
  }

  const clientId = process.env.CLASSY_CLIENT_ID;
  const clientSecret = process.env.CLASSY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Classy client ID or secret is not configured in environment variables.');
    throw new Error('Classy API credentials not configured.');
  }

  try {
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Error fetching Classy token: ${response.status} ${errorBody}`);
      throw new Error(`Failed to fetch Classy app access token: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();
    classyAppAccessToken = data.access_token;
    // Set expiry time to a bit before actual expiry to be safe (e.g., 5 minutes buffer)
    tokenExpiryTime = now + (data.expires_in - 300) * 1000;
    return classyAppAccessToken;
  } catch (error) {
    console.error('Exception while fetching Classy token:', error);
    throw error; // Re-throw to be caught by calling function
  }
}

// Generic function to make authenticated GET requests to Classy API
async function makeClassyGetRequest(endpoint, queryParams = '') {
  const token = await getClassyAppAccessToken();
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const url = `${CLASSY_API_BASE}${endpoint}${queryParams ? `?${queryParams}` : ''}`;
  // console.log(`Making Classy GET request to: ${url}`); // For debugging

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Classy API Error (${response.status}) for ${url}: ${errorBody}`);
      throw new Error(`Classy API request failed for ${endpoint}: ${response.status} - ${errorBody}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Exception during Classy GET request to ${url}:`, error);
    throw error; // Re-throw
  }
}

// Get campaigns for an organization
async function getCampaignsByOrganization(orgId, queryParams = '') {
  if (!orgId) {
    // Fallback to environment variable if orgId is not explicitly passed
    // This is more robust for backend services.
    orgId = process.env.CLASSY_ORGANIZATION_ID;
    if (!orgId) {
        console.error('Classy Organization ID is not provided and not found in environment variables.');
        throw new Error('Classy Organization ID is required.');
    }
  }
  return makeClassyGetRequest(`/organizations/${orgId}/campaigns`, queryParams);
}

// Get a specific campaign by ID
async function getCampaignById(campaignId, queryParams = 'with=overview') {
  // const orgId = process.env.CLASSY_ORGANIZATION_ID; // Use the backend-specific env var
  // if (!orgId) {
  //   console.error('Classy Organization ID is not configured in environment variables for getCampaignById.');
  //   throw new Error('Classy Organization ID is required for fetching campaign details.');
  // }
  if (!campaignId) throw new Error('Campaign ID is required.');
  // return makeClassyGetRequest(`/organizations/${orgId}/campaigns/${campaignId}`, queryParams); // Original
  return makeClassyGetRequest(`/campaigns/${campaignId}`, queryParams); // Testing direct campaign endpoint
}

// Get transactions for a campaign
async function getClassyCampaignTransactions(campaignId, queryParams = '') {
  if (!campaignId) throw new Error('Campaign ID is required.');
  return makeClassyGetRequest(`/campaigns/${campaignId}/transactions`, queryParams);
}

// Get fundraising teams for a campaign
async function getClassyCampaignFundraisingTeams(campaignId, queryParams = '') {
  if (!campaignId) throw new Error('Campaign ID is required.');
  return makeClassyGetRequest(`/campaigns/${campaignId}/fundraising-teams`, queryParams);
}

// Get fundraising pages for a campaign
async function getClassyCampaignFundraisingPages(campaignId, queryParams = '') {
  if (!campaignId) throw new Error('Campaign ID is required.');
  return makeClassyGetRequest(`/campaigns/${campaignId}/fundraising-pages`, queryParams);
}

// Get organization details by ID
async function getOrganizationById(organizationId, queryParams = '') {
  if (!organizationId) throw new Error('Organization ID is required.');
  return makeClassyGetRequest(`/organizations/${organizationId}`, queryParams);
}

// Get top fundraisers for a campaign
async function getClassyCampaignTopFundraisers(campaignId, queryParams = '') {
  if (!campaignId) throw new Error('Campaign ID is required.');
  return makeClassyGetRequest(`/campaigns/${campaignId}/fundraising-pages`, queryParams + (queryParams ? '&' : '') + 'sort=total_raised:desc&per_page=5'); // Example: Get top 5
}

module.exports = {
  getClassyAppAccessToken,
  getCampaignsByOrganization,
  getCampaignById,
  getOrganizationById,
  getClassyCampaignTransactions,
  getClassyCampaignFundraisingTeams,
  getClassyCampaignFundraisingPages,
  getClassyCampaignTopFundraisers,
}; 