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
    sparkline_in_7d: coin.sparkline_in_7d || { price: [] }, // Ensure sparkline data is included
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
        sparkline: true, // Ensure sparkline data is included
        price_change_percentage: '1h,24h,7d',
      },
    });
    console.log(response.data); // Controleer de API-respons
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