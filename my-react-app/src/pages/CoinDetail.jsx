import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCoinDetails, getCoinMarketChart } from '../services/api';
import TrendChart from '../components/TrendChart';
import { ArrowUp, ArrowDown, ChevronsUpDown, RefreshCw } from 'lucide-react';

const CoinDetailPage = () => {
  const { coinId } = useParams();
  const [coin, setCoin] = useState(null);
  const [marketData1h, setMarketData1h] = useState(null);
  const [marketData24h, setMarketData24h] = useState(null);
  const [marketData7d, setMarketData7d] = useState(null);
  const [marketData30d, setMarketData30d] = useState(null);
  const [activeTimeframe, setActiveTimeframe] = useState('24h'); // Default to 24h
  const [performanceTimeframe, setPerformanceTimeframe] = useState('24h');
  
  // Converter state
  const [eurAmount, setEurAmount] = useState('100');
  const [coinAmount, setCoinAmount] = useState('');
  const [convertDirection, setConvertDirection] = useState('eurToCoin'); // 'eurToCoin' or 'coinToEur'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coinData = await getCoinDetails(coinId);
        setCoin(coinData);

        // Fetch market chart data for different timeframes
        const data1h = await getCoinMarketChart(coinId, 0.042); // 0.042 dagen = 1 uur
        setMarketData1h(data1h);
        
        const data24h = await getCoinMarketChart(coinId, 1); // 1 dag = 24 uur
        setMarketData24h(data24h);
        
        const data7d = await getCoinMarketChart(coinId, 7);
        setMarketData7d(data7d);
        
        const data30d = await getCoinMarketChart(coinId, 30);
        setMarketData30d(data30d);
        
        // Set initial coin amount based on EUR 100
        if (coinData.market_data?.current_price?.eur) {
          setCoinAmount((100 / coinData.market_data.current_price.eur).toFixed(8));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [coinId]);

  useEffect(() => {
    if (!coin) return;
    
    const currentPrice = coin.market_data.current_price.eur;
    if (convertDirection === 'eurToCoin' && eurAmount) {
      setCoinAmount((parseFloat(eurAmount) / currentPrice).toFixed(8));
    } else if (convertDirection === 'coinToEur' && coinAmount) {
      setEurAmount((parseFloat(coinAmount) * currentPrice).toFixed(2));
    }
  }, [eurAmount, coinAmount, convertDirection, coin]);

  if (!coin) return <div className="loading">Loading...</div>;

  // Format price with appropriate decimals
  const formatPrice = (price) => {
    if (price >= 1) return `€${price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    else if (price >= 0.01) return `€${price.toLocaleString(undefined, {minimumFractionDigits: 4, maximumFractionDigits: 4})}`;
    else return `€${price.toLocaleString(undefined, {minimumFractionDigits: 6, maximumFractionDigits: 8})}`;
  };

  // Format numbers with suffixes (K, M, B, T)
  const formatLargeNumber = (value) => {
    if (!value) return 'N/A';
    if (value >= 1000000000000) return `€${(value / 1000000000000).toFixed(2)}T`;
    if (value >= 1000000000) return `€${(value / 1000000000).toFixed(2)}B`;
    if (value >= 1000000) return `€${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `€${(value / 1000).toFixed(2)}K`;
    return `€${value.toLocaleString()}`;
  };

  const getPriceChangeClass = (change) => {
    if (!change) return '';
    return change >= 0 ? 'price-up' : 'price-down';
  };

  // Calculate percentage from ATH/ATL
  const calculatePercentFromATH = (current, ath) => {
    return ((current - ath) / ath * 100).toFixed(2);
  };

  // Handle converter input change
  const handleEurAmountChange = (e) => {
    setEurAmount(e.target.value);
    setConvertDirection('eurToCoin');
  };

  const handleCoinAmountChange = (e) => {
    setCoinAmount(e.target.value);
    setConvertDirection('coinToEur');
  };

  // Swap conversion direction
  const swapConversion = () => {
    setConvertDirection(prev => prev === 'eurToCoin' ? 'coinToEur' : 'eurToCoin');
  };

  // Get performance data based on selected timeframe
  const getPerformanceData = () => {
    switch(performanceTimeframe) {
      case '24h':
        return {
          change: coin.market_data.price_change_percentage_24h,
          high: coin.market_data.high_24h.eur,
          low: coin.market_data.low_24h.eur
        };
      case '7d':
        return {
          change: coin.market_data.price_change_percentage_7d,
          high: Math.max(...(coin.market_data?.sparkline_7d?.price || marketData7d?.prices?.map(p => p[1]) || [])),
          low: Math.min(...(coin.market_data?.sparkline_7d?.price || marketData7d?.prices?.map(p => p[1]) || []))
        };
      case '30d':
        return {
          change: coin.market_data.price_change_percentage_30d,
          high: Math.max(...(coin.market_data?.sparkline_30d?.price || marketData30d?.prices?.map(p => p[1]) || [])),
          low: Math.min(...(coin.market_data?.sparkline_30d?.price || marketData30d?.prices?.map(p => p[1]) || []))
        };
      default:
        return { change: 0, high: 0, low: 0 };
    }
  };

  const performanceData = getPerformanceData();

  return (
    <div className="coin-detail-container">
      <div className="coin-detail-header">
        <img src={coin.image?.large || coin.image?.small} alt={coin.name} />
        <div className="coin-title">
          <h1>{coin.name} <span className="coin-symbol">{coin.symbol.toUpperCase()}</span></h1>
          <div className="coin-price-container">
            <span className="current-price">{formatPrice(coin.market_data.current_price.eur)}</span>
            <span className={`price-change-24h ${getPriceChangeClass(coin.market_data.price_change_percentage_24h)}`}>
              {coin.market_data.price_change_percentage_24h >= 0 ? 
                <ArrowUp size={16} /> : 
                <ArrowDown size={16} />
              }
              {Math.abs(coin.market_data.price_change_percentage_24h).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div className="coin-detail-main">
        <div className="coin-stats-grid">
          <div className="stat-card">
            <p className="stat-title">Market Cap</p>
            <p className="stat-value">{formatLargeNumber(coin.market_data.market_cap.eur)}</p>
          </div>
          <div className="stat-card">
            <p className="stat-title">Volume (24h)</p>
            <p className="stat-value">{formatLargeNumber(coin.market_data.total_volume.eur)}</p>
          </div>
          <div className="stat-card">
            <p className="stat-title">Circulating Supply</p>
            <p className="stat-value">{coin.market_data.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}</p>
          </div>
          <div className="stat-card">
            <p className="stat-title">Max Supply</p>
            <p className="stat-value">{coin.market_data.max_supply ? coin.market_data.max_supply.toLocaleString() : 'N/A'}</p>
          </div>
        </div>

        <div className="coin-detail-charts-container">
          <h2>Price Chart</h2>
          
          <div className="time-period-selector">
            <button 
              className={activeTimeframe === '1h' ? 'active' : ''} 
              onClick={() => setActiveTimeframe('1h')}
            >
              1H
            </button>
            <button 
              className={activeTimeframe === '24h' ? 'active' : ''} 
              onClick={() => setActiveTimeframe('24h')}
            >
              24H
            </button>
            <button 
              className={activeTimeframe === '7d' ? 'active' : ''} 
              onClick={() => setActiveTimeframe('7d')}
            >
              7D
            </button>
            <button 
              className={activeTimeframe === '30d' ? 'active' : ''} 
              onClick={() => setActiveTimeframe('30d')}
            >
              30D
            </button>
          </div>
          
          {/* 1H Chart */}
          {activeTimeframe === '1h' && (
            <div className="chart-container">
              {marketData1h?.prices ? (
                <TrendChart 
                  sparklineData={marketData1h.prices.map(price => price[1])}
                  timestamps={marketData1h.prices.map(price => price[0])}
                  timeframe="1h"
                />
              ) : (
                <p className="no-data-message">Geen 1-uurs grafiekgegevens beschikbaar</p>
              )}
            </div>
          )}
          
          {/* 24H Chart */}
          {activeTimeframe === '24h' && (
            <div className="chart-container">
              {marketData24h?.prices ? (
                <TrendChart 
                  sparklineData={marketData24h.prices.map(price => price[1])}
                  timestamps={marketData24h.prices.map(price => price[0])}
                  timeframe="24h"
                />
              ) : (
                <p className="no-data-message">Geen 24-uurs grafiekgegevens beschikbaar</p>
              )}
            </div>
          )}
          
          {/* 7D Chart */}
          {activeTimeframe === '7d' && (
            <div className="chart-container">
              {(coin.market_data?.sparkline_7d?.price || marketData7d?.prices) ? (
                <TrendChart 
                  sparklineData={coin.market_data?.sparkline_7d?.price || marketData7d?.prices.map(price => price[1])}
                  timestamps={marketData7d?.prices.map(price => price[0])}
                  timeframe="7d"
                />
              ) : (
                <p className="no-data-message">Geen 7-dagen grafiekgegevens beschikbaar</p>
              )}
            </div>
          )}
          
          {/* 30D Chart */}
          {activeTimeframe === '30d' && (
            <div className="chart-container">
              {(coin.market_data?.sparkline_30d?.price || marketData30d?.prices) ? (
                <TrendChart 
                  sparklineData={coin.market_data?.sparkline_30d?.price || marketData30d?.prices.map(price => price[1])}
                  timestamps={marketData30d?.prices.map(price => price[0])}
                  timeframe="30d"
                />
              ) : (
                <p className="no-data-message">Geen 30-dagen grafiekgegevens beschikbaar</p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Converter Section */}
      <div className="converter-section">
        <h2>Valuta Converter</h2>
        <div className="converter-container">
          <div className="converter-input-group">
            <label htmlFor="eur-amount">EUR</label>
            <input
              id="eur-amount"
              type="number"
              value={eurAmount}
              onChange={handleEurAmountChange}
              min="0"
              step="any"
            />
          </div>
          
          <button className="swap-button" onClick={swapConversion}>
            <ChevronsUpDown size={20} />
          </button>
          
          <div className="converter-input-group">
            <label htmlFor="coin-amount">{coin.symbol.toUpperCase()}</label>
            <input
              id="coin-amount"
              type="number"
              value={coinAmount}
              onChange={handleCoinAmountChange}
              min="0"
              step="any"
            />
          </div>
        </div>
        <p className="conversion-rate">
          1 {coin.symbol.toUpperCase()} = {formatPrice(coin.market_data.current_price.eur)}
        </p>
      </div>
      
      {/* Price Performance */}
      <div className="price-performance-section">
        <h2>Prijs Prestaties</h2>
        
        <div className="time-period-selector performance-selector">
          <button 
            className={performanceTimeframe === '24h' ? 'active' : ''} 
            onClick={() => setPerformanceTimeframe('24h')}
          >
            24H
          </button>
          <button 
            className={performanceTimeframe === '7d' ? 'active' : ''} 
            onClick={() => setPerformanceTimeframe('7d')}
          >
            7D
          </button>
          <button 
            className={performanceTimeframe === '30d' ? 'active' : ''} 
            onClick={() => setPerformanceTimeframe('30d')}
          >
            30D
          </button>
        </div>
        
        <div className="performance-data">
          <div className="performance-card">
            <h3>Hoogste Prijs</h3>
            <p className="high-price">{formatPrice(performanceData.high)}</p>
          </div>
          
          <div className="performance-card">
            <h3>Laagste Prijs</h3>
            <p className="low-price">{formatPrice(performanceData.low)}</p>
          </div>
          
          <div className="performance-card">
            <h3>Verandering</h3>
            <p className={getPriceChangeClass(performanceData.change)}>
              {performanceData.change >= 0 ? 
                <ArrowUp size={16} /> : 
                <ArrowDown size={16} />
              }
              {Math.abs(performanceData.change).toFixed(2)}%
            </p>
          </div>
        </div>
        
        <div className="price-extremes">
          <div className="price-extreme">
            <h3>All-Time High (ATH)</h3>
            <div className="extreme-data">
              <p className="extreme-price">{formatPrice(coin.market_data.ath.eur)}</p>
              <p className={`extreme-change ${getPriceChangeClass(calculatePercentFromATH(coin.market_data.current_price.eur, coin.market_data.ath.eur))}`}>
                {calculatePercentFromATH(coin.market_data.current_price.eur, coin.market_data.ath.eur)}%
              </p>
              <p className="extreme-date">{new Date(coin.market_data.ath_date.eur).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="price-extreme">
            <h3>All-Time Low (ATL)</h3>
            <div className="extreme-data">
              <p className="extreme-price">{formatPrice(coin.market_data.atl.eur)}</p>
              <p className={`extreme-change ${getPriceChangeClass(calculatePercentFromATH(coin.market_data.current_price.eur, coin.market_data.atl.eur))}`}>
                {calculatePercentFromATH(coin.market_data.current_price.eur, coin.market_data.atl.eur)}%
              </p>
              <p className="extreme-date">{new Date(coin.market_data.atl_date.eur).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="coin-detail-info-section">
        <h2>Marktgegevens</h2>
        <div className="coin-detail-info">
          <div className="info-row">
            <span>Marktkapitalisatie Rank</span>
            <span>#{coin.market_cap_rank}</span>
          </div>
          <div className="info-row">
            <span>Volledig verwaterde waardering</span>
            <span>{formatLargeNumber(coin.market_data.fully_diluted_valuation?.eur)}</span>
          </div>
          <div className="info-row">
            <span>24u Handelsvolume</span>
            <span>{formatLargeNumber(coin.market_data.total_volume.eur)}</span>
          </div>
          <div className="info-row">
            <span>24u Laag / 24u Hoog</span>
            <span>{formatPrice(coin.market_data.low_24h.eur)} / {formatPrice(coin.market_data.high_24h.eur)}</span>
          </div>
          <div className="info-row">
            <span>Circulerende voorraad</span>
            <span>{coin.market_data.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}</span>
          </div>
          <div className="info-row">
            <span>Totale voorraad</span>
            <span>{coin.market_data.total_supply ? coin.market_data.total_supply.toLocaleString() : 'N/A'}</span>
          </div>
          <div className="info-row">
            <span>Maximale voorraad</span>
            <span>{coin.market_data.max_supply ? coin.market_data.max_supply.toLocaleString() : 'N/A'}</span>
          </div>
        </div>
      </div>

      {coin.description?.en && (
        <div className="coin-description">
          <h2>Over {coin.name}</h2>
          <div dangerouslySetInnerHTML={{ __html: coin.description.en.split('. ').slice(0, 3).join('. ') + '.' }} />
          {coin.description.en.split('. ').length > 3 && (
            <button className="read-more">Lees meer</button>
          )}
        </div>
      )}
    </div>
  );
};

export default CoinDetailPage;