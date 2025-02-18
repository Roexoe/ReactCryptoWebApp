import axios from 'axios';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

export const getCryptoList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: false,
      },
    });
    return response.data;
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
