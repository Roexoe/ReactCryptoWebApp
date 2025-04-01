import { useEffect, useState, useRef } from 'react';
import { getCryptoList } from '../services/api';
import SearchBar from '../components/SearchBar';
import CryptoTable from '../components/CryptoTable';
import MarketShareChart from '../components/MarketShareChart';
import MarketStats from '../components/MarketStats';
import { RefreshCw } from 'lucide-react';

const Home = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [nextRefresh, setNextRefresh] = useState(null);
  const timerRef = useRef(null);
  const REFRESH_INTERVAL = 3 * 60 * 1000; // 3 minuten in milliseconden

  // Functie om de data op te halen
  const fetchData = async (isAuto = false) => {
    if (isRefreshing) return; // Voorkom dubbele aanvragen
    
    setIsRefreshing(true);
    setError(null);
    try {
      console.log(`${isAuto ? 'Auto-refresh' : 'Handmatig'} ophalen van gegevens gestart...`);
      const data = await getCryptoList();
      if (data && data.length > 0) {
        console.log(`Data succesvol opgehaald: ${data.length} munten`);
        setCryptoData(data);
        setLastUpdated(new Date());
        if (isAuto) {
          // Toon een korte notificatie
          setError("✅ Data is automatisch bijgewerkt");
          setTimeout(() => setError(null), 3000);
        }
      } else {
        console.warn("Geen data ontvangen van API");
        setError("Geen gegevens ontvangen van de API");
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      let errorMessage = "Er is een fout opgetreden bij het ophalen van de gegevens.";
      
      if (error.response) {
        if (error.response.status === 429) {
          errorMessage = "API limiet bereikt. Probeer het later nog eens.";
        } else {
          errorMessage = `API fout: ${error.response.status} - ${error.response.statusText}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      // Bereken volgende refresh tijdstip als auto-refresh aan staat
      if (autoRefresh) {
        setNextRefresh(new Date(Date.now() + REFRESH_INTERVAL));
      } else {
        setNextRefresh(null);
      }
    }
  };

  // Update timer elke seconde om aftellen naar volgende refresh te tonen
  useEffect(() => {
    if (autoRefresh && nextRefresh) {
      const timer = setInterval(() => {
        // Forceer re-render om countdown bij te werken
        setNextRefresh(new Date(nextRefresh));
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [autoRefresh, nextRefresh]);

  // Auto-refresh effect
  useEffect(() => {
    // Data ophalen bij initiële laden
    fetchData();
    
    // Interval voor auto-refresh
    if (autoRefresh) {
      console.log(`Auto-refresh ingeschakeld, interval: ${REFRESH_INTERVAL}ms`);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      timerRef.current = setInterval(() => {
        fetchData(true); // true betekent auto-refresh
      }, REFRESH_INTERVAL);
      
      // Bereken eerste volgende refresh
      setNextRefresh(new Date(Date.now() + REFRESH_INTERVAL));
    } else {
      console.log('Auto-refresh uitgeschakeld');
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setNextRefresh(null);
    }
    
    return () => {
      console.log('Cleanup: interval verwijderen');
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [autoRefresh]);

  const filteredCryptoData = cryptoData.filter((coin) =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handmatige refresh functie
  const handleRefresh = () => {
    fetchData(false); // false betekent handmatige refresh
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(prev => !prev);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString();
  };
  
  // Bereken tijd tot volgende refresh
  const getTimeUntilNextRefresh = () => {
    if (!nextRefresh) return '';
    
    const now = new Date();
    const diff = nextRefresh - now;
    
    if (diff <= 0) return 'Nu...';
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div>
      <h1 className="page-title">Crypto Dashboard</h1>
      <p className="page-subtitle">Track cryptocurrency prices and market data</p>
      
      {/* Refresh status weergeven */}
      <div className="refresh-status">
        <div>
          <p>Laatst bijgewerkt: {formatTime(lastUpdated)}</p>
          {error && <p className={error.includes('✅') ? 'success-message' : 'error-message'}>{error}</p>}
          <div className="auto-refresh-toggle">
            <input 
              type="checkbox" 
              id="auto-refresh" 
              checked={autoRefresh} 
              onChange={toggleAutoRefresh} 
            />
            <label htmlFor="auto-refresh">
              Auto-refresh (elke 3 min) 
              {autoRefresh && nextRefresh && (
                <span className="next-refresh-time"> - Volgende: {getTimeUntilNextRefresh()}</span>
              )}
            </label>
          </div>
        </div>
        <button 
          onClick={handleRefresh} 
          className={`refresh-button ${isRefreshing ? 'refreshing' : ''}`}
          disabled={isRefreshing}
        >
          <RefreshCw size={18} />
          {isRefreshing ? 'Bijwerken...' : 'Vernieuwen'}
        </button>
      </div>
      
      {/* Market Statistics Section */}
      <MarketStats />
      
      {/* Market Cap Distribution Chart */}
      <MarketShareChart title="Cryptocurrency Market Cap Distribution" />
      
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {isLoading ? (
        <div className="loading">Laden van cryptocurrencies...</div>
      ) : cryptoData.length > 0 ? (
        <CryptoTable cryptoData={filteredCryptoData} />
      ) : (
        <div className="no-data-message">
          <p>Geen cryptocurrency gegevens beschikbaar. Probeer later opnieuw of controleer je internetverbinding.</p>
          <button 
            onClick={handleRefresh} 
            className="refresh-button"
            disabled={isRefreshing}
          >
            <RefreshCw size={18} />
            Probeer opnieuw
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;