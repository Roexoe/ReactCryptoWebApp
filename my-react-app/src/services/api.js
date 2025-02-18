import axios from 'axios';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

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
  }));
};

export const getCryptoList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/coins/markets`, {
      params: {
        vs_currency: 'eur',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: false,
        price_change_percentage: '1h,24h,7d', // Ensure these fields are included
      },
    });
    return validateCryptoData(response.data);
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return [];
  }
};

export const getCoinDetails = async (coinId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/coins/${coinId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching coin details:', error);
    return null;
  }
};