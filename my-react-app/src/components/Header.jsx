import { Link } from 'react-router-dom';
import { Home, Sparkles, Star, Moon } from 'lucide-react';
import logo from '../assets/Coin-radar-icon.png';

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="logo">
        <img src={logo} alt="Coin Radar Logo" />
        <h1>Coin Radar</h1>
      </Link>
      
      <nav>
        <ul>
          <li>
            <Link to="/">
              <Home size={18} />
              Home
            </Link>
          </li>
          <li>
            <Link to="/trending">
              <Sparkles size={18} />
              Trending
            </Link>
          </li>
          <li>
            <Link to="/favorites">
              <Star size={18} />
              Favorites
            </Link>
          </li>
        </ul>
        
        <button className="theme-toggle" aria-label="Toggle theme">
          <Moon size={18} />
        </button>
      </nav>
    </header>
  );
};

export default Header;