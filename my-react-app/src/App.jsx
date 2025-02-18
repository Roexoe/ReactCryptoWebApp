import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import Home from './pages/Home';
import CoinDetailPage from './pages/CoinDetail';

function App() {
  return (
    <FavoritesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coin/:coinId" element={<CoinDetailPage />} />
        </Routes>
      </Router>
    </FavoritesProvider>
  );
}

export default App;
