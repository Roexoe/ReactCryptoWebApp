import { useState, useEffect } from 'react';
import { getGlobalMarketData } from '../services/api';
import { TrendingUp, DollarSign, BarChart2, PieChart } from 'lucide-react';

const MarketStats = () => {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        const data = await getGlobalMarketData();
        setMarketData(data);
      } catch (err) {
        console.error("Failed to fetch global market data:", err);
        setError("Could not load market statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  // Format numbers for display
  const formatNumber = (num, isCurrency = true) => {
    if (num === undefined || num === null) return 'N/A';
    
    if (num >= 1000000000000) {
      return `${isCurrency ? '€' : ''}${(num / 1000000000000).toFixed(2)}T`;
    }
    if (num >= 1000000000) {
      return `${isCurrency ? '€' : ''}${(num / 1000000000).toFixed(2)}B`;
    }
    if (num >= 1000000) {
      return `${isCurrency ? '€' : ''}${(num / 1000000).toFixed(2)}M`;
    }
    
    return isCurrency ? `€${num.toLocaleString()}` : num.toLocaleString();
  };

  // Format percentage for display
  const formatPercentage = (pct) => {
    if (pct === undefined || pct === null) return 'N/A';
    const value = parseFloat(pct).toFixed(2);
    const isPositive = value >= 0;
    
    return (
      <span className={`percentage ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? '+' : ''}{value}%
      </span>
    );
  };

  if (loading) {
    return (
      <div className="market-stats-container">
        <div className="stats-loader">Loading market statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="market-stats-container">
        <div className="stats-error">{error}</div>
      </div>
    );
  }

  const data = marketData?.data || {};
  
  return (
    <div className="market-stats-container">
      <div className="stats-main">
        <div className="stats-box total-market-cap">
          <h3>
            <DollarSign size={18} />
            Total Market Cap
          </h3>
          <div className="stats-value">
            {formatNumber(data.total_market_cap?.eur)}
          </div>
          <div className="stats-change">
            24h Change: {formatPercentage(data.market_cap_change_percentage_24h_usd)}
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stats-box">
          <h3>
            <BarChart2 size={18} />
            24h Trading Volume
          </h3>
          <div className="stats-value">
            {formatNumber(data.total_volume?.eur)}
          </div>
        </div>

        <div className="stats-box">
          <h3>
            <PieChart size={18} />
            BTC Dominance
          </h3>
          <div className="stats-value">
            {data.market_cap_percentage?.btc ? `${data.market_cap_percentage.btc.toFixed(1)}%` : 'N/A'}
          </div>
        </div>

        <div className="stats-box">
          <h3>
            <TrendingUp size={18} />
            Active Cryptocurrencies
          </h3>
          <div className="stats-value">
            {formatNumber(data.active_cryptocurrencies, false)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketStats;