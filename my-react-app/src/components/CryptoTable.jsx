import { useState } from 'react';
import CryptoItem from './CryptoItem';

const CryptoTable = ({ cryptoData }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const sortedData = [...cryptoData].sort((a, b) => {
    if (sortConfig.key === 'favorites') {
      const aFavorite = a.favorite ? 1 : 0;
      const bFavorite = b.favorite ? 1 : 0;
      return sortConfig.direction === 'ascending' ? bFavorite - aFavorite : aFavorite - bFavorite;
    }

    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    }

    return 0;
  });

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        direction = null;
      }
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') return '↑';
      if (sortConfig.direction === 'descending') return '↓';
    }
    return '';
  };

  return (
    <table className="crypto-table">
      <thead>
        <tr>
          <th onClick={() => handleSort('favorites')}>⭐ {getSortIndicator('favorites')}</th>
          <th onClick={() => handleSort('index')}># {getSortIndicator('index')}</th>
          <th onClick={() => handleSort('name')}>Name {getSortIndicator('name')}</th>
          <th onClick={() => handleSort('current_price')}>Price {getSortIndicator('current_price')}</th>
          <th onClick={() => handleSort('price_change_percentage_1h_in_currency')}>1h % {getSortIndicator('price_change_percentage_1h_in_currency')}</th>
          <th onClick={() => handleSort('price_change_percentage_24h_in_currency')}>24h % {getSortIndicator('price_change_percentage_24h_in_currency')}</th>
          <th onClick={() => handleSort('price_change_percentage_7d_in_currency')}>7d % {getSortIndicator('price_change_percentage_7d_in_currency')}</th>
          <th onClick={() => handleSort('market_cap')}>Market Cap {getSortIndicator('market_cap')}</th>
          <th onClick={() => handleSort('total_volume')}>Volume (24h) {getSortIndicator('total_volume')}</th>
          <th onClick={() => handleSort('circulating_supply')}>Circulating Supply {getSortIndicator('circulating_supply')}</th>
          <th>7d Trend</th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map((coin, index) => (
          <CryptoItem key={coin.id} coin={coin} index={index} />
        ))}
      </tbody>
    </table>
  );
};

export default CryptoTable;