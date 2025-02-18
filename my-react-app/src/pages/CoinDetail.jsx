import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCoinDetails } from '../services/api';

const CoinDetailPage = () => {
  const { coinId } = useParams();
  const [coin, setCoin] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCoinDetails(coinId);
      setCoin(data);
    };
    fetchData();
  }, [coinId]);

  if (!coin) return <p>Loading...</p>;

  return (
    <div>
      <h1>{coin.name} ({coin.symbol.toUpperCase()})</h1>
      <p>Huidige prijs: €{coin.market_data.current_price.eur}</p>
      <p>Marktkapitalisatie: €{coin.market_data.market_cap.eur}</p>
      <p>24u verandering: {coin.market_data.price_change_percentage_24h}%</p>
    </div>
  );
};

export default CoinDetailPage;
