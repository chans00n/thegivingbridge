const https = require('https');
const querystring = require('querystring');

let accessToken = null;
let tokenExpiryTime = null;

const CLASSY_CLIENT_ID = process.env.CLASSY_CLIENT_ID;
const CLASSY_CLIENT_SECRET = process.env.CLASSY_CLIENT_SECRET;
const CLASSY_TOKEN_URL = 'https://api.classy.org/oauth2/auth';

async function fetchNewAccessToken() {
    if (!CLASSY_CLIENT_ID || !CLASSY_CLIENT_SECRET) {
        console.error('Error: CLASSY_CLIENT_ID or CLASSY_CLIENT_SECRET is not set in environment variables.');
        throw new Error('Missing Classy API credentials in environment.');
    }

    const postData = querystring.stringify({
        grant_type: 'client_credentials',
        client_id: CLASSY_CLIENT_ID,
        client_secret: CLASSY_CLIENT_SECRET,
    });

    const options = {
        hostname: 'api.classy.org',
        path: '/oauth2/auth',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData),
        },
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let rawData = '';
            res.on('data', (chunk) => {
                rawData += chunk;
            });
            res.on('end', () => {
                try {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        const parsedData = JSON.parse(rawData);
                        if (parsedData.access_token && parsedData.expires_in) {
                            accessToken = parsedData.access_token;
                            // Store expiry time as a timestamp (current time + expires_in seconds - a small buffer)
                            tokenExpiryTime = Date.now() + (parsedData.expires_in * 1000) - 5000; // 5s buffer
                            console.log('Successfully fetched new Classy app access token.');
                            resolve(accessToken);
                        } else {
                            console.error('Error: access_token or expires_in missing in Classy response.', parsedData);
                            reject(new Error('Invalid token response from Classy.'));
                        }
                    } else {
                        console.error(`Error fetching Classy token: Status ${res.statusCode}`, rawData);
                        reject(new Error(`Classy API responded with status ${res.statusCode}: ${rawData}`));
                    }
                } catch (e) {
                    console.error('Error parsing Classy token response:', e);
                    reject(new Error('Failed to parse token response from Classy.'));
                }
            });
        });

        req.on('error', (e) => {
            console.error('Error with Classy token request:', e);
            reject(new Error('Request to Classy API failed.'));
        });

        req.write(postData);
        req.end();
    });
}

async function getClassyAppAccessToken() {
    if (accessToken && tokenExpiryTime && Date.now() < tokenExpiryTime) {
        console.log('Using cached Classy app access token.');
        return accessToken;
    }
    console.log('Cached Classy token expired or not found, fetching new one...');
    return fetchNewAccessToken();
}

// ADDED: Generic helper function to make requests to the Classy API
async function makeClassyRequest(path, method = 'GET', body = null, queryParams = '') {
  const token = await getClassyAppAccessToken();
  const fullPath = queryParams ? `${path}?${queryParams}` : path;
  
  const options = {
    hostname: 'api.classy.org',
    path: fullPath,
    method: method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) { // Added PATCH
    const payload = JSON.stringify(body);
    options.headers['Content-Length'] = Buffer.byteLength(payload);
  }

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let rawData = '';
      res.on('data', (chunk) => rawData += chunk);
      res.on('end', () => {
        try {
          // Attempt to parse JSON only if there's content and it's likely JSON
          let parsedData = null;
          if (rawData && res.headers['content-type'] && res.headers['content-type'].includes('application/json')) {
            parsedData = JSON.parse(rawData);
          } else if (rawData) {
            parsedData = rawData; // Return raw data if not JSON
          }

          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedData);
          } else {
            console.error(`Classy API Error on path ${fullPath}: Status ${res.statusCode}`, rawData);
            // Include parsedData in error if available, otherwise rawData
            const errorDetails = parsedData || rawData;
            reject({ statusCode: res.statusCode, message: `Classy API Error on path ${fullPath}`, details: errorDetails });
          }
        } catch (e) {
          console.error(`Error parsing Classy response from ${fullPath}:`, e, rawData);
          reject({ statusCode: 500, message: 'Failed to parse Classy API response', details: e.message, rawResponse: rawData });
        }
      });
    });
    req.on('error', (e) => {
      console.error(`Request error for Classy API on ${fullPath}:`, e);
      reject({ statusCode: 500, message: 'Request to Classy API failed', details: e.message });
    });
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// ADDED: Specific API call functions
async function getCampaignById(campaignId) {
  if (!campaignId) throw new Error('campaignId is required for getCampaignById');
  return makeClassyRequest(`/2.0/campaigns/${campaignId}`, 'GET', null, 'with=overview');
}

async function getCampaignTransactions(campaignId, queryParamsString = '') {
  if (!campaignId) throw new Error('campaignId is required for getCampaignTransactions');
  // queryParamsString should be a URL-encoded string, e.g., "per_page=100&page=1"
  return makeClassyRequest(`/2.0/campaigns/${campaignId}/transactions`, 'GET', null, queryParamsString);
}

async function getSupporterById(supporterId) {
  if (!supporterId) throw new Error('supporterId is required for getSupporterById');
  return makeClassyRequest(`/2.0/supporters/${supporterId}`);
}

async function getOrganizationById(organizationId) {
  if (!organizationId) throw new Error('organizationId is required for getOrganizationById');
  return makeClassyRequest(`/2.0/organizations/${organizationId}`);
}

async function getCampaignFundraisingPages(campaignId, queryParamsString = '') {
  if (!campaignId) throw new Error('campaignId is required for getCampaignFundraisingPages');
  // queryParamsString should be a URL-encoded string
  return makeClassyRequest(`/2.0/campaigns/${campaignId}/fundraising-pages`, 'GET', null, queryParamsString);
}

async function getFundraisingPageAggregates(fundraisingPageId) {
    if (!fundraisingPageId) throw new Error('fundraisingPageId is required for getFundraisingPageAggregates');
    return makeClassyRequest(`/2.0/fundraising-pages/${fundraisingPageId}/overview`); // Assuming overview gives aggregates
}

// RENAMED: Function to get a list of all campaigns globally (currently facing 403)
async function getGlobalCampaignsList(queryParamsString = '') {
  // queryParamsString should be a URL-encoded string, e.g., "status=active&sort=total_gross_amount:desc&page=1"
  return makeClassyRequest('/2.0/campaigns', 'GET', null, queryParamsString);
}

// ADDED: Function to get a list of campaigns for a specific organization
async function getCampaignsByOrganization(organizationId, queryParamsString = '') {
  if (!organizationId) throw new Error('organizationId is required for getCampaignsByOrganization');
  
  const params = new URLSearchParams(queryParamsString);
  if (!params.has('with')) {
    params.append('with', 'overview');
  } else if (!params.get('with').includes('overview')) {
    params.set('with', params.get('with') + ',overview');
  }
  const updatedQueryParamsString = params.toString();

  const path = `/2.0/organizations/${organizationId}/campaigns`;
  return makeClassyRequest(path, 'GET', null, updatedQueryParamsString);
}

module.exports = {
    getClassyAppAccessToken,
    makeClassyRequest, // Exporting for potential direct use if ever needed, or for testing
    getCampaignById,
    getCampaignTransactions,
    getSupporterById,
    getOrganizationById,
    getCampaignFundraisingPages,
    getFundraisingPageAggregates,
    getGlobalCampaignsList, // Exporting renamed function
    getCampaignsByOrganization, // Exporting new function
}; 