import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import Home from './pages/Home';
import CoinDetailPage from './pages/CoinDetail';
import Header from './components/Header'; // Import the Header component
import Footer from './components/Footer'; // Import the Footer component
import './styles.css';

function App() {
  return (
    <FavoritesProvider>
      <div className="app-container">
        <Router>
          <Header />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/coin/:coinId" element={<CoinDetailPage />} />
            </Routes>
          </div>
        </Router>
        <Footer />
      </div>
    </FavoritesProvider>
  );
}

export default App;