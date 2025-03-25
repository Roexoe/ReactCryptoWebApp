import axios from 'axios';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

// Configure Axios with defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json'
  }
});

// Helper function to delay execution (for retries)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Vereenvoudigde functie voor API calls zonder cache
async function makeApiCall(url, params, retries = 3, retryDelay = 1000) {
  try {
    console.log(`Fetching data from API: ${url}`);
    const response = await apiClient.get(url, { params });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429 && retries > 0) {
      // Rate limiting - wacht en probeer opnieuw
      console.log(`Rate limited. Retrying in ${retryDelay}ms...`);
      await delay(retryDelay);
      return makeApiCall(url, params, retries - 1, retryDelay * 2);
    }
    
    console.error(`API call error for ${url}:`, error.message);
    throw error;
  }
}

// API endpoints zonder cache
export const getCoinList = async (page = 1, perPage = 100) => {
  try {
    return await makeApiCall('/coins/markets', {
      vs_currency: 'eur',
      order: 'market_cap_desc',
      per_page: perPage,
      page: page,
      sparkline: true,
      price_change_percentage: '1h,24h,7d'
    });
  } catch (error) {
    console.error('Error fetching coin list:', error);
    return [];
  }
};

// Aliasing voor backward compatibility
export const getCryptoList = getCoinList;

export const getGlobalMarketData = async () => {
  try {
    return await makeApiCall('/global');
  } catch (error) {
    console.error('Error fetching global market data:', error);
    return null;
  }
};

export const getTrendingCoins = async () => {
  try {
    const result = await makeApiCall('/search/trending');
    return result.coins || [];
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    return [];
  }
};

export const getCoinDetails = async (coinId) => {
  if (!coinId) {
    console.error('No coinId provided to getCoinDetails');
    return null;
  }
  
  try {
    return await makeApiCall(`/coins/${coinId}`, {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
      sparkline: true
    });
  } catch (error) {
    console.error(`Error fetching details for coin ${coinId}:`, error);
    return null;
  }
};

export const getCoinMarketChart = async (coinId, days) => {
  if (!coinId) {
    console.error('No coinId provided to getCoinMarketChart');
    return null;
  }
  
  try {
    return await makeApiCall(`/coins/${coinId}/market_chart`, {
      vs_currency: 'eur',
      days: days,
      interval: days <= 1 ? 'minute' : days <= 7 ? 'hourly' : 'daily'
    });
  } catch (error) {
    console.error(`Error fetching market chart for coin ${coinId}:`, error);
    return null;
  }
};

export const searchCoins = async (query) => {
  if (!query || query.trim() === '') {
    return [];
  }
  
  try {
    const result = await makeApiCall('/search', { query });
    return result.coins || [];
  } catch (error) {
    console.error('Error searching coins:', error);
    return [];
  }
};