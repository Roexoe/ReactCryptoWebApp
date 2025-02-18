import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';

const CryptoItem = ({ coin, index }) => {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate(`/coin/${coin.id}`);
  };

  const isFavorite = favorites.includes(coin.id);

  return (
    <tr onClick={handleRowClick} style={{ cursor: 'pointer' }}>
      <td onClick={(e) => e.stopPropagation()}>
        <span 
          className={`favorite-icon ${isFavorite ? "active" : ""}`} 
          onClick={() => toggleFavorite(coin.id)}
        >★</span>
      </td>
      <td>{index + 1}</td>
      <td className="crypto-name">
        <img src={coin.image} alt={coin.name} />
        {coin.name} <span className="crypto-symbol">{coin.symbol.toUpperCase()}</span>
      </td>
      <td className={coin.current_price > 0 ? "price-up" : "price-down"}>
        €{coin.current_price.toFixed(2)}
      </td>
      <td className={coin.price_change_percentage_1h_in_currency > 0 ? "price-up" : "price-down"}>
        {coin.price_change_percentage_1h_in_currency.toFixed(2)}%
      </td>
      <td className={coin.price_change_percentage_24h_in_currency > 0 ? "price-up" : "price-down"}>
        {coin.price_change_percentage_24h_in_currency.toFixed(2)}%
      </td>
      <td className={coin.price_change_percentage_7d_in_currency > 0 ? "price-up" : "price-down"}>
        {coin.price_change_percentage_7d_in_currency.toFixed(2)}%
      </td>
      <td>€{coin.market_cap.toLocaleString()}</td>
      <td>€{coin.total_volume.toLocaleString()}</td>
      <td>{coin.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}</td>
      <td>
        {/* Placeholder for 7-day trend chart */}
        <div className="trend-chart">Chart</div>
      </td>
    </tr>
  );
};

export default CryptoItem;