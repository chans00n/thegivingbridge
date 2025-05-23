require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors'); // Import CORS
const app = express();
const port = process.env.PORT || 3001; // Use environment variable for port

const { getClassyAppAccessToken } = require('./classyService'); // Import the Classy service
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
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded request bodies

// Import classyService methods
const classyService = require('./classyService');

app.get('/', (req, res) => {
  res.send('Hello World from the Express Backend!');
});

// Test endpoint simulating database interaction
app.get('/api/test-db', async (req, res) => {
  try {
    // Simulate reading a DB config to test .env (optional)
    const dbHost = process.env.DB_HOST || 'not set';
    // In a real scenario, you would query the database here:
    // const dbResponse = await pool.query('SELECT NOW()');
    // res.json({ message: 'Database connected', time: dbResponse.rows[0].now });
    
    res.json({
      message: 'Simulated database interaction successful',
      data: [{ id: 1, name: 'Test Item' }],
      dbHostFromEnv: dbHost // Example of reading an env var
    });
  } catch (error) {
    console.error('Error in /api/test-db:', error);
    res.status(500).json({ message: 'Error interacting with database (simulated)' });
  }
});

// New route to test Classy token fetching
app.get('/test-classy-token', async (req, res) => {
  try {
    const token = await classyService.getClassyAppAccessToken();
    res.json({ message: 'Successfully fetched Classy app token (or used cache)', token: token });
  } catch (error) {
    console.error('Error in /test-classy-token:', error);
    res.status(500).json({ message: 'Failed to get Classy app token', error: error.message });
  }
});

// New route to fetch specific campaign details from Classy
app.get('/api/classy/campaigns/:campaignId', async (req, res) => {
  const { campaignId } = req.params;
  if (!campaignId) {
    return res.status(400).json({ message: 'Campaign ID is required' });
  }

  try {
    const campaignData = await classyService.getCampaignById(campaignId);
    res.json({ message: `Successfully fetched campaign ${campaignId} data`, data: campaignData });
  } catch (error) {
    console.error(`Error fetching campaign ${campaignId} via classyService:`, error);
    // Use statusCode from the error object if available (from makeClassyRequest)
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ 
      message: error.message || `Failed to fetch campaign ${campaignId} data`,
      details: error.details // Pass along details from the service error
    });
  }
});

// UPDATED ROUTE: List campaigns, now requires orgId and uses getCampaignsByOrganization
app.get('/api/classy/campaigns', async (req, res) => {
  const { orgId, ...otherQueryParams } = req.query; // Extract orgId and other potential query params

  if (!orgId) {
    return res.status(400).json({ message: 'Organization ID (orgId) is required as a query parameter.' });
  }

  try {
    const queryParamsString = new URLSearchParams(otherQueryParams).toString();
    const campaignsListData = await classyService.getCampaignsByOrganization(orgId, queryParamsString);
    
    if (campaignsListData && Array.isArray(campaignsListData.data)) {
      const campaignsWithOverviewsAndTotals = await Promise.all(campaignsListData.data.map(async (campaign) => {
        try {
          const individualCampaignData = await classyService.getCampaignById(campaign.id);

          if (individualCampaignData && individualCampaignData.overview && typeof individualCampaignData.overview.total_gross_amount === 'number') {
            campaign.total_raised = individualCampaignData.overview.total_gross_amount;
          } else if (individualCampaignData && typeof individualCampaignData.total_raised === 'number') {
            campaign.total_raised = individualCampaignData.total_raised;
          } else {
            campaign.total_raised = 0;
          }
        } catch (error) {
          console.error(`Error fetching individual details for campaign ID: ${campaign.id}`, error);
          campaign.total_raised = campaign.total_raised || 0;
        }
        return campaign;
      }));
      campaignsListData.data = campaignsWithOverviewsAndTotals;
    }

    res.json(campaignsListData);

  } catch (error) {
    console.error(`Error fetching campaigns list for orgId ${orgId} via classyService:`, error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ 
      message: error.message || `Failed to fetch campaigns list for orgId ${orgId}`,
      details: error.details 
    });
  }
});

// ADDED: New route to fetch campaign transactions and calculate total raised (first page only)
app.get('/api/classy/campaigns/:campaignId/transactions', async (req, res) => {
  const { campaignId } = req.params;
  if (!campaignId) {
    return res.status(400).json({ message: 'Campaign ID is required' });
  }

  try {
    let totalRaisedAmount = 0;
    let allTransactions = [];
    const MAX_ACTIVITY_ITEMS = 20; // As defined in frontend

    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      // Construct query params for pagination, e.g., 'per_page=100&page=X'
      // Classy default per_page is 20. Let's be explicit for clarity if needed, or use Classy's default.
      // For fetching ALL transactions, we might need a higher per_page or just loop through pages.
      // The Classy API default is 20 per page. We can adjust if needed.
      const queryParams = `page=${currentPage}&per_page=50`; // Fetch 50 at a time to reduce calls
      
      // Use classyService to fetch a page of transactions
      const pageData = await classyService.getCampaignTransactions(campaignId, queryParams);

      if (pageData && pageData.data && Array.isArray(pageData.data)) {
        pageData.data.forEach(transaction => {
          if (transaction && typeof transaction.total_gross_amount === 'number') {
            totalRaisedAmount += transaction.total_gross_amount;
          }
          allTransactions.push(transaction);
        });
        
        // Check for more pages
        // hasMorePages = pageData.next_page_url ? true : false; // Simpler way
        if (pageData.next_page_url) {
            currentPage++;
        } else {
            hasMorePages = false;
        }

      } else {
        // No data or not an array, stop pagination
        hasMorePages = false;
      }
      
      // Safety break if we fetch too many pages (e.g., > 20 pages * 50 items = 1000 transactions)
      // This prevents infinite loops if pagination logic is flawed or API behaves unexpectedly.
      if (currentPage > 20) { 
          console.warn(`[${campaignId}] Transactions: Exceeded 20 page limit, breaking.`);
          hasMorePages = false;
      }
    }

    allTransactions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const recentTransactions = allTransactions.slice(0, MAX_ACTIVITY_ITEMS);

    let activityItems = await Promise.all(recentTransactions.map(async (transaction) => {
      let userName = transaction.anonymous ? 'Anonymous' : 'Unknown Donor';
      let userAvatarUrl = undefined;

      if (transaction.supporter_id && !transaction.anonymous) {
        try {
          // Use classyService to fetch supporter details
          const supporterData = await classyService.getSupporterById(transaction.supporter_id);
          if (supporterData) {
            userName = `${supporterData.first_name || ''} ${supporterData.last_name || ''}`.trim();
            if (!userName) userName = 'Unknown Donor'; // Fallback if name fields are empty
            userAvatarUrl = supporterData.profile_picture_url || undefined;
          }
        } catch (supporterErr) {
          // Log error but don't let it break the entire process
          console.warn(`[${campaignId}] Transactions: Error fetching details for supporter ${transaction.supporter_id}:`, supporterErr.message);
        }
      }

      return {
        id: transaction.id ? transaction.id.toString() : Math.random().toString(), // Ensure ID is a string
        type: 'donation',
        userName: userName,
        userAvatarUrl: userAvatarUrl,
        amount: transaction.donation_gross_amount, // Use donation_gross_amount as per previous logs
        message: transaction.comment || undefined,
        timestamp: transaction.created_at, // This will be formatted on the frontend
      };
    }));

    res.json({
      message: `Successfully processed all transactions for campaign ${campaignId}`,
      totalRaisedAmount: totalRaisedAmount,
      activityItems: activityItems,
    });

  } catch (error) {
    console.error(`Error processing transactions for campaign ${campaignId} in route handler:`, error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ 
        message: error.message || `Failed to process campaign ${campaignId} transactions`,
        details: error.details 
    });
  }
});

// ADDED: New route to fetch specific organization details from Classy
app.get('/api/classy/organizations/:organizationId', async (req, res) => {
  const { organizationId } = req.params;
  if (!organizationId) {
    return res.status(400).json({ message: 'Organization ID is required' });
  }

  try {
    const organizationData = await classyService.getOrganizationById(organizationId);
    // Assuming the organization name is in a field like 'name' from the API response.
    // The actual structure might vary, so this part might need adjustment based on real API responses.
    const organizationName = organizationData.name || 'Organization name not found in API response';
    
    res.json({
      message: `Successfully fetched organization ${organizationId} data`, 
      // Send back the whole data object, or specific parts as needed by frontend
      data: organizationData, 
      organizationName: organizationName // Keep this if frontend specifically uses it
    });

  } catch (error) {
    console.error(`Error fetching organization ${organizationId} via classyService:`, error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ 
      message: error.message || `Failed to fetch organization ${organizationId} data`,
      details: error.details 
    });
  }
});

// ADDED: New route to fetch top individual fundraisers for a campaign
app.get('/api/classy/campaigns/:campaignId/top-fundraisers', async (req, res) => {
  const { campaignId } = req.params;
  if (!campaignId) {
    return res.status(400).json({ message: 'Campaign ID is required' });
  }

  try {
    // Token is handled by classyService
    let allFundraisingPagesMeta = []; // To store basic info from the list endpoint

    // 1. Fetch all fundraising pages (meta-data) for the campaign, handling pagination
    let currentPage = 1;
    let hasMorePages = true;
    console.log(`[${campaignId}] Top Fundraisers: Fetching fundraising page list...`);

    while (hasMorePages) {
      const queryParams = `page=${currentPage}&per_page=50`; // Fetch 50 at a time
      const pageListData = await classyService.getCampaignFundraisingPages(campaignId, queryParams);

      if (pageListData && pageListData.data && Array.isArray(pageListData.data)) {
        allFundraisingPagesMeta = allFundraisingPagesMeta.concat(pageListData.data);
        if (pageListData.next_page_url) {
          currentPage++;
        } else {
          hasMorePages = false;
        }
      } else {
        hasMorePages = false; // No data or not an array, stop pagination
      }
      // Safety break
      if (currentPage > 20) { 
          console.warn(`[${campaignId}] Top Fundraisers: Exceeded 20 page limit for page list, breaking.`);
          hasMorePages = false;
      }
    }
    console.log(`[${campaignId}] Top Fundraisers: Found ${allFundraisingPagesMeta.length} total fundraising page entries.`);

    // 2. For each page, fetch its full details/aggregates if needed
    // The getFundraisingPageAggregates was designed for overview, let's check if what we get from getCampaignFundraisingPages is enough
    // The current structure of allFundraisingPagesMeta might already contain member and some aggregate data if Classy API includes it in the list view.
    // If not, then we would iterate and call classyService.getFundraisingPageAggregates(fp.id) or classyService.makeClassyRequest(`/2.0/fundraising-pages/${fp.id}?with=member&aggregates=true`)

    // The existing code maps `page.total_raised`, `page.goal`, `page.alias`, `page.member.first_name` etc. 
    // This implies the listing endpoint `/2.0/campaigns/{campaign_id}/fundraising-pages` might already include enough details with proper `with` parameters.
    // Let's assume for now `getCampaignFundraisingPages` (which calls `/2.0/campaigns/:campaignId/fundraising-pages`)
    // can accept `with=member,goal_progress_summary` (or similar) to get necessary data to avoid N+1 calls for aggregates.
    // The current `getCampaignFundraisingPages` in `classyService` takes a raw `queryParamsString`.
    // We will adjust the call here to include `with` params.

    // Re-fetch with `with` params if the initial fetch didn't have enough details.
    // For simplicity in this step, we'll assume the first fetch of allFundraisingPagesMeta should get all necessary data
    // by enhancing the queryParams for getCampaignFundraisingPages.
    // Let's modify the fetching loop to use `with` parameter from the start.

    allFundraisingPagesMeta = []; // Reset for re-fetch with `with`
    currentPage = 1;
    hasMorePages = true;
    console.log(`[${campaignId}] Top Fundraisers: Re-fetching fundraising page list WITH DETAILS...`);

    while (hasMorePages) {
      // Include `with=member` to get fundraiser names, `with=goal_progress_summary` for raised/goal amounts.
      // Exact `with` params depend on Classy API. Assuming `member` and `goal_progress_summary` are valid.
      // The endpoint /2.0/campaigns/{id}/fundraising-pages supports `with=member` and includes `total_raised` and `goal` directly on the page objects.
      const queryParamsWithDetails = `page=${currentPage}&per_page=50&with=member`; 
      const pageListDataWithDetails = await classyService.getCampaignFundraisingPages(campaignId, queryParamsWithDetails);

      if (pageListDataWithDetails && pageListDataWithDetails.data && Array.isArray(pageListDataWithDetails.data)) {
        allFundraisingPagesMeta = allFundraisingPagesMeta.concat(pageListDataWithDetails.data);
        if (pageListDataWithDetails.next_page_url) {
          currentPage++;
        } else {
          hasMorePages = false;
        }
      } else {
        hasMorePages = false;
      }
      if (currentPage > 20) { 
          console.warn(`[${campaignId}] Top Fundraisers: Exceeded 20 page limit for detailed page list, breaking.`);
          hasMorePages = false;
      }
    }
    console.log(`[${campaignId}] Top Fundraisers: Found ${allFundraisingPagesMeta.length} fundraising pages with details.`);

    // 3. Filter out pages without necessary data and map to desired structure
    const processedFundraisers = allFundraisingPagesMeta
      .filter(page => page && typeof page.total_raised === 'number') // Ensure total_raised is present
      .map(page => ({
        id: page.id.toString(), // Ensure ID is string
        name: page.title || page.alias || (page.member ? `${page.member.first_name || ''} ${page.member.last_name || ''}`.trim() : 'Unnamed Fundraiser'),
        raisedAmount: page.total_raised || 0,
        goalAmount: page.goal || 0, 
        pagePath: page.canonical_url, // Or construct from slug: `/campaign/${campaignId}/fundraising/${page.slug || page.id}`
        avatarUrl: page.logo_url || (page.member ? page.member.profile_picture_url : undefined),
      }));
    
    console.log(`[${campaignId}] Top Fundraisers: Processed ${processedFundraisers.length} fundraisers after filtering and mapping.`);

    // 4. Sort by raisedAmount descending
    processedFundraisers.sort((a, b) => b.raisedAmount - a.raisedAmount);

    // 5. Take top 10
    const top10Fundraisers = processedFundraisers.slice(0, 10);

    res.json({
      message: `Successfully fetched top fundraisers for campaign ${campaignId}`,
      data: top10Fundraisers,
    });

  } catch (error) {
    console.error(`Error fetching top fundraisers for campaign ${campaignId} via classyService:`, error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ 
      message: error.message || `Failed to fetch top fundraisers for campaign ${campaignId}`,
      details: error.details 
    });
  }
});

// NEW ROUTE: Get details for a specific fundraising page
app.get('/api/classy/fundraising-pages/:fundraisingPageId', async (req, res) => {
  const { fundraisingPageId } = req.params;
  const CLASSY_API_BASE = 'https://api.classy.org'; // Ensure this is defined or use process.env

  if (!fundraisingPageId) {
    return res.status(400).json({ message: 'Fundraising Page ID is required' });
  }

  try {
    const token = await getClassyAppAccessToken();
    
    const options = {
      hostname: 'api.classy.org',
      path: `/2.0/fundraising-pages/${fundraisingPageId}?with=member&aggregates=true`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const classyReq = https.request(options, (classyRes) => {
      let rawData = '';
      classyRes.on('data', (chunk) => {
        rawData += chunk;
      });
      classyRes.on('end', () => {
        try {
          if (classyRes.statusCode >= 200 && classyRes.statusCode < 300) {
            const parsedData = JSON.parse(rawData);
            // We might want to adapt this data before sending, similar to top-fundraisers
            // For now, sending the raw data object from Classy
            res.json({ message: `Successfully fetched fundraising page ${fundraisingPageId} data`, data: parsedData });
          } else {
            console.error(`Error fetching fundraising page ${fundraisingPageId} from Classy: Status ${classyRes.statusCode}`, rawData);
            res.status(classyRes.statusCode).json({ message: `Failed to fetch fundraising page ${fundraisingPageId} from Classy`, error: rawData });
          }
        } catch (e) {
          console.error(`Error parsing Classy response for fundraising page ${fundraisingPageId}:`, e);
          res.status(500).json({ message: 'Failed to parse Classy API response', error: e.message });
        }
      });
    });

    classyReq.on('error', (e) => {
      console.error(`Error with Classy API request for fundraising page ${fundraisingPageId}:`, e);
      res.status(500).json({ message: 'Request to Classy API failed', error: e.message });
    });

    classyReq.end();

  } catch (error) {
    console.error(`Error fetching fundraising page ${fundraisingPageId}:`, error);
    res.status(500).json({ message: 'Failed to fetch fundraising page data', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`DB_HOST from env: ${process.env.DB_HOST}`); // Log for testing .env setup
  }
}); 