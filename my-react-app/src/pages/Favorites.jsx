import { useEffect, useState, useContext } from 'react';
import { getCryptoList } from '../services/api';
import { FavoritesContext } from '../context/FavoritesContext';
import CryptoTable from '../components/CryptoTable';
import { Star } from 'lucide-react';

const Favorites = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { favorites } = useContext(FavoritesContext);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getCryptoList();
        setCryptoData(data);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter the crypto data to only include favorited coins
  const favoriteCryptos = cryptoData.filter(coin => favorites.includes(coin.id));
  
  // Empty state when no favorites
  if (!isLoading && favoriteCryptos.length === 0) {
    return (
      <div className="favorites-empty-state">
        <h1 className="page-title">Your Favorites</h1>
        <div className="empty-favorites">
          <Star size={48} />
          <h2>No favorites yet</h2>
          <p>Add cryptocurrencies to your favorites by clicking the star icon in the table.</p>
          <a href="/" className="btn-primary">Browse Cryptocurrencies</a>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="page-title">Your Favorites</h1>
      <p className="page-subtitle">Track your favorite cryptocurrencies in real-time</p>
      
      {isLoading ? (
        <div className="loading-state">Loading your favorites...</div>
      ) : (
        <CryptoTable cryptoData={favoriteCryptos} />
      )}
    </div>
  );
};

export default Favorites;