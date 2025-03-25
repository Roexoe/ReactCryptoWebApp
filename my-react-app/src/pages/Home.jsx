import { useEffect, useState } from 'react';
import { getCryptoList } from '../services/api';
import SearchBar from '../components/SearchBar';
import CryptoTable from '../components/CryptoTable';
import MarketShareChart from '../components/MarketShareChart';
import MarketStats from '../components/MarketStats';

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

  return (
    <div>
      <h1 className="page-title">Crypto Dashboard</h1>
      <p className="page-subtitle">Track cryptocurrency prices and market data in real-time</p>
      
      {/* Market Statistics Section */}
      <MarketStats />
      
      {/* Market Cap Distribution Chart */}
      <MarketShareChart title="Cryptocurrency Market Cap Distribution" />
      
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CryptoTable cryptoData={filteredCryptoData} />
    </div>
  );
};

export default Home;