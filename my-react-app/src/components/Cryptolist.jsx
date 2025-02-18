import CryptoItem from './CryptoItem';

const CryptoList = ({ cryptoData, searchQuery }) => {
  return (
    <div className="crypto-list">
      {cryptoData
        .filter((coin) => coin.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((coin) => (
          <CryptoItem key={coin.id} coin={coin} />
        ))}
    </div>
  );
};

export default CryptoList;
