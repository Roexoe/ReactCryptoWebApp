import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCoinDetails } from '../services/api';
import TrendChart from '../components/TrendChart';

const CoinDetailPage = () => {
  const { coinId } = useParams();
  const [coin, setCoin] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCoinDetails(coinId);
      console.log('Coin data:', data); // Log the API response
      setCoin(data);
    };
    fetchData();
  }, [coinId]);

  if (!coin) return <p>Loading...</p>;

  // Check if sparkline data exists
  console.log('7d sparkline:', coin.market_data?.sparkline_7d);
  console.log('30d sparkline:', coin.market_data?.sparkline_30d);

  return (
    <div className="coin-detail-container">
      <h1>{coin.name} ({coin.symbol.toUpperCase()})</h1>
      <div className="coin-detail-info">
        <p>Huidige prijs: €{coin.market_data.current_price.eur}</p>
        <p>Marktkapitalisatie: €{coin.market_data.market_cap.eur}</p>
        <p>24u verandering: {coin.market_data.price_change_percentage_24h}%</p>
        <p>Circulerende voorraad: {coin.market_data.circulating_supply}</p>
        <p>Totale voorraad: {coin.market_data.total_supply}</p>
        <p>Maximale voorraad: {coin.market_data.max_supply}</p>
        <p>Volledig verwaterde waardering: €{coin.market_data.fully_diluted_valuation.eur}</p>
        <p>24 uur handelsvolume: €{coin.market_data.total_volume.eur}</p>
      </div>
      
      {/* Explicitly check if data exists and has length */}
      {coin.market_data?.sparkline_7d?.price && coin.market_data.sparkline_7d.price.length > 0 ? (
        <div className="coin-detail-charts">
          <h2>7d Trend</h2>
          <div className="chart-container">
            <TrendChart sparklineData={coin.market_data.sparkline_7d.price} />
          </div>
        </div>
      ) : (
        <div className="coin-detail-charts">
          <h2>7d Trend</h2>
          <p>Geen 7-dagen grafiekgegevens beschikbaar</p>
        </div>
      )}
      
      {/* Explicitly check if data exists and has length */}
      {coin.market_data?.sparkline_30d?.price && coin.market_data.sparkline_30d.price.length > 0 ? (
        <div className="coin-detail-charts">
          <h2>1m Trend</h2>
          <div className="chart-container">
            <TrendChart sparklineData={coin.market_data.sparkline_30d.price} />
          </div>
        </div>
      ) : (
        <div className="coin-detail-charts">
          <h2>1m Trend</h2>
          <p>Geen 30-dagen grafiekgegevens beschikbaar</p>
        </div>
      )}
    </div>
  );
};

export default CoinDetailPage;