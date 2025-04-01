import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import TrendChart from './TrendChart';
import { ArrowUp, ArrowDown, Star } from 'lucide-react'; // Assuming you're using lucide-react for icons

/**
 * CryptoItem component represents a single row in a cryptocurrency table.
 * It displays details such as the coin's name, price, market cap, and trends.
 * Users can click on a row to navigate to the coin's details page or toggle it as a favorite.
 */
const CryptoItem = ({ coin, index }) => {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate(`/coin/${coin.id}`);
  };

  const isFavorite = favorites.includes(coin.id);

  // Format large numbers
  const formatNumber = (value) => {
    if (value === null || value === undefined) return 'N/A';
    
    if (value >= 1000000000) {
      return `€${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(2)}M`;
    } else {
      return `€${value.toLocaleString()}`;
    }
  };

  return (
    <tr onClick={handleRowClick}>
      <td onClick={(e) => e.stopPropagation()}>
        <button 
          className={`favorite-icon ${isFavorite ? "active" : ""}`} 
          onClick={() => toggleFavorite(coin.id)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          ★
        </button>
      </td>
      <td className="font-medium">{index + 1}</td>
      <td>
        <div className="crypto-name">
          <img src={coin.image || "/placeholder.svg"} alt={coin.name} />
          <div className="crypto-name-text">
            <span className="font-medium">{coin.name}</span>
            <span className="crypto-symbol">{coin.symbol?.toUpperCase() || ''}</span>
          </div>
        </div>
      </td>
      <td className="text-right font-medium">
        {coin.current_price !== null && coin.current_price !== undefined ? 
          `€${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 
          'N/A'
        }
      </td>
      <td className={`text-right ${coin.price_change_percentage_1h_in_currency > 0 ? 'price-up' : 'price-down'}`}>
        <div className="price-change">
          {coin.price_change_percentage_1h_in_currency > 0 ? 
            <ArrowUp size={16} /> : 
            <ArrowDown size={16} />
          }
          {Math.abs(coin.price_change_percentage_1h_in_currency || 0).toFixed(2)}%
        </div>
      </td>
      <td className={`text-right ${coin.price_change_percentage_24h_in_currency > 0 ? 'price-up' : 'price-down'}`}>
        <div className="price-change">
          {coin.price_change_percentage_24h_in_currency > 0 ? 
            <ArrowUp size={16} /> : 
            <ArrowDown size={16} />
          }
          {Math.abs(coin.price_change_percentage_24h_in_currency || 0).toFixed(2)}%
        </div>
      </td>
      <td className={`text-right ${coin.price_change_percentage_7d_in_currency > 0 ? 'price-up' : 'price-down'}`}>
        <div className="price-change">
          {coin.price_change_percentage_7d_in_currency > 0 ? 
            <ArrowUp size={16} /> : 
            <ArrowDown size={16} />
          }
          {Math.abs(coin.price_change_percentage_7d_in_currency || 0).toFixed(2)}%
        </div>
      </td>
      <td className="text-right font-medium">{formatNumber(coin.market_cap)}</td>
      <td className="text-right font-medium">{formatNumber(coin.total_volume)}</td>
      <td className="text-right">
        {coin.circulating_supply !== null && coin.circulating_supply !== undefined ? 
          `${coin.circulating_supply.toLocaleString()} ${coin.symbol?.toUpperCase() || ''}` : 
          'N/A'
        }
      </td>
      <td className="text-right">
        <div className="trend-chart">
          {coin.sparkline_in_7d && coin.sparkline_in_7d.price && coin.sparkline_in_7d.price.length > 0 ? (
            <TrendChart 
              sparklineData={coin.sparkline_in_7d.price} 
              positive={coin.price_change_percentage_7d_in_currency > 0}
              compact={true}
            />
          ) : null}
        </div>
      </td>
    </tr>
  );
};

export default CryptoItem;