import axios from 'axios';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

// Configure Axios with defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Accept': 'application/json'
  }
});

// Cache configuratie
const CACHE_DURATION = {
  CRYPTO_LIST: 5 * 60 * 1000, // 5 minuten voor de lijst
  COIN_DETAILS: 10 * 60 * 1000, // 10 minuten voor coin details
  MARKET_CHART: 5 * 60 * 1000  // 5 minuten voor grafieken
};

// Cache helpers
const getFromCache = (key) => {
  try {
    const cachedData = localStorage.getItem(key);
    if (!cachedData) return null;
    
    const { timestamp, data } = JSON.parse(cachedData);
    return { timestamp, data };
  } catch (error) {
    console.error('Error retrieving from cache:', error);
    return null;
  }
};

const saveToCache = (key, data) => {
  try {
    const cacheEntry = {
      timestamp: Date.now(),
      data: data
    };
    localStorage.setItem(key, JSON.stringify(cacheEntry));
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
};

const isCacheValid = (cacheEntry, maxAge) => {
  if (!cacheEntry) return false;
  const now = Date.now();
  return (now - cacheEntry.timestamp) < maxAge;
};

// Helper function to delay execution (for retries)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to make API calls with retry logic and caching
async function makeApiCall(url, params, cacheKey = null, cacheDuration = null, retries = 3, retryDelay = 1000) {
  // Als er een cache key is meegegeven, probeer dan eerst uit de cache te halen
  if (cacheKey) {
    const cachedData = getFromCache(cacheKey);
    if (cachedData && isCacheValid(cachedData, cacheDuration)) {
      console.log(`Using cached data for ${cacheKey}`);
      return cachedData.data;
    }
  }

  try {
    console.log(`Fetching fresh data from API: ${url}`);
    const response = await apiClient.get(url, { params });
    
    // Als er een cache key is meegegeven, sla dan de data op in de cache
    if (cacheKey) {
      saveToCache(cacheKey, response.data);
    }
    
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`API Error: ${error.response.status} - ${error.response.statusText}`);
      
      if (error.response.status === 429) {
        
        // Als er een cache key is meegegeven, probeer dan uit de cache te halen (ook als deze verlopen is)
        if (cacheKey) {
          const cachedData = getFromCache(cacheKey);
          if (cachedData) {
            console.log(`Using expired cached data for ${cacheKey} due to rate limiting`);
            return cachedData.data;
          }
        }
        
        // If we have retries left, wait and then retry
        if (retries > 0) {
          console.log(`Retrying in ${retryDelay}ms... (${retries} retries left)`);
          await delay(retryDelay);
          return makeApiCall(url, params, cacheKey, cacheDuration, retries - 1, retryDelay * 2);
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from the server:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
    }
    
    // If we've exhausted retries and still have an error, try to return cached data even if expired
    if (cacheKey) {
      const cachedData = getFromCache(cacheKey);
      if (cachedData) {
        console.log(`Using expired cached data for ${cacheKey} as fallback after error`);
        return cachedData.data;
      }
    }
    
    throw error;
  }
}

const validateCryptoData = (data) => {
  return data.map((coin) => ({
    id: coin.id || 'N/A',
    image: coin.image || '',
    name: coin.name || 'N/A',
    symbol: coin.symbol || 'N/A',
    current_price: coin.current_price || 0,
    price_change_percentage_1h_in_currency: coin.price_change_percentage_1h_in_currency || 0,
    price_change_percentage_24h_in_currency: coin.price_change_percentage_24h_in_currency || 0,
    price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency || 0,
    market_cap: coin.market_cap || 0,
    total_volume: coin.total_volume || 0,
    circulating_supply: coin.circulating_supply || 0,
    sparkline_in_7d: coin.sparkline_in_7d || { price: [] },
  }));
};

export const getCryptoList = async () => {
  try {
    const data = await makeApiCall('/coins/markets', {
      vs_currency: 'eur',
      order: 'market_cap_desc',
      per_page: 50, // Reduced from 100 to lower API burden
      page: 1,
      sparkline: true,
      price_change_percentage: '1h,24h,7d',
    }, 'cryptoList', CACHE_DURATION.CRYPTO_LIST);
    
    return validateCryptoData(data);
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    // You could add fallback to cached data here if needed
    return [];
  }
};

export const getCoinDetails = async (coinId) => {
  try {
    const data = await makeApiCall(`/coins/${coinId}`, {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
      sparkline: true
    }, `coinDetails_${coinId}`, CACHE_DURATION.COIN_DETAILS);
    
    return data;
  } catch (error) {
    console.error(`Error fetching details for coin ${coinId}:`, error);
    return null;
  }
};

export const getCoinMarketChart = async (coinId, days) => {
  try {
    const data = await makeApiCall(`/coins/${coinId}/market_chart`, {
      vs_currency: 'eur',
      days: days,
      interval: days <= 1 ? 'minute' : 'daily',
    }, `marketChart_${coinId}_${days}`, CACHE_DURATION.MARKET_CHART);
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${days}d market chart for ${coinId}:`, error);
    return null;
  }
};

export const getGlobalMarketData = async () => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/global');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching global market data:', error);
    throw error;
  }
};