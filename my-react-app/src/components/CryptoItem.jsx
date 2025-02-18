import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';

const CryptoItem = ({ coin }) => {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  return (
    <div className="crypto-item">
      <h2>{coin.name} ({coin.symbol.toUpperCase()})</h2>
      <p>${coin.current_price.toFixed(2)}</p>
      <button onClick={() => toggleFavorite(coin.id)}>
        {favorites.includes(coin.id) ? '★' : '☆'} Favoriet
      </button>
      <Link to={`/coin/${coin.id}`}>Meer info</Link>
    </div>
  );
};

export default CryptoItem;
