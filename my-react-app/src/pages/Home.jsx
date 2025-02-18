import { useEffect, useState } from 'react';
import { getCryptoList } from '../services/api';
import CryptoList from '../components/Cryptolist';
import SearchBar from '../components/SearchBar';

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

  return (
    <div>
      <h1>Crypto Dashboard</h1>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CryptoList cryptoData={cryptoData} searchQuery={searchQuery} />
    </div>
  );
};

export default Home;
