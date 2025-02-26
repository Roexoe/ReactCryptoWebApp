import { Link } from 'react-router-dom';
import logo from '../assets/Coin-radar-icon.png';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Coin Radar Logo" />
        <h1>Coin Radar</h1>
      </div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          {/* Add more navigation links here if needed */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;