import { useEffect, useState } from 'react';
import { getCryptoList } from '../services/api';
import SearchBar from '../components/SearchBar';
import CryptoTable from '../components/CryptoTable';
import MarketShareChart from '../components/MarketShareChart';

const Home = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCryptoList();
      setCryptoData(data);
    };
    fetchData();
  }, []);

  const filteredCryptoData = cryptoData.filter((coin) =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate insights from crypto data
  const getMarketInsights = () => {
    if (!filteredCryptoData.length) return {};
    
    const totalMarketCap = filteredCryptoData.reduce((sum, coin) => sum + coin.market_cap, 0);
    const totalVolume = filteredCryptoData.reduce((sum, coin) => sum + coin.total_volume, 0);
    
    const positivePerformers = filteredCryptoData.filter(coin => coin.price_change_percentage_24h_in_currency > 0);
    const negativePerformers = filteredCryptoData.filter(coin => coin.price_change_percentage_24h_in_currency <= 0);
    
    const trendingCoins = filteredCryptoData.slice(0, 3); // Top 3 trending coins
    
    return {
      totalMarketCap,
      totalVolume,
      positiveCount: positivePerformers.length,
      negativeCount: negativePerformers.length,
      trendingCoins
    };
  };

  const insights = getMarketInsights();

  // Format large numbers as billions/millions
  const formatLargeNumber = (value) => {
    if (!value) return 'N/A';
    if (value >= 1000000000000) return `€${(value / 1000000000000).toFixed(2)}T`;
    if (value >= 1000000000) return `€${(value / 1000000000).toFixed(2)}B`;
    if (value >= 1000000) return `€${(value / 1000000).toFixed(2)}M`;
    return `€${value.toLocaleString()}`;
  };

  return (
    <div className="home-container">
      <h1>Crypto Dashboard</h1>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      {filteredCryptoData.length > 0 && (
        <div className="market-insights-container">
          <h2>Market Insights</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <h3>Total Market Cap</h3>
              <p>{formatLargeNumber(insights.totalMarketCap)}</p>
              <MarketShareChart cryptoData={filteredCryptoData.slice(0, 10)} />
            </div>
            <div className="insight-card">
              <h3>24h Trading Volume</h3>
              <p>{formatLargeNumber(insights.totalVolume)}</p>
            </div>
            <div className="insight-card">
              <h3>Market Sentiment</h3>
              <div className="sentiment-meter">
                <div className="positive-sentiment" style={{
                  width: `${insights.positiveCount / filteredCryptoData.length * 100}%`
                }}></div>
                <div className="negative-sentiment" style={{
                  width: `${insights.negativeCount / filteredCryptoData.length * 100}%`
                }}></div>
              </div>
              <p>{insights.positiveCount} bullish / {insights.negativeCount} bearish</p>
            </div>
            <div className="insight-card">
              <h3>Trending Coins</h3>
              <ul className="trending-coins-list">
                {insights.trendingCoins.map((coin) => (
                  <li key={coin.id}>
                    <img src={coin.image} alt={coin.name} />
                    <p>{coin.name} ({coin.symbol.toUpperCase()})</p>
                    <p>{formatLargeNumber(coin.current_price)}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      <CryptoTable cryptoData={filteredCryptoData} />
    </div>
  );
};

export default Home;