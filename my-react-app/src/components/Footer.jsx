import { Link, useNavigate } from 'react-router-dom';
import { Github, Twitter, Facebook } from 'lucide-react';
import coinIcon from '../assets/Coin-radar-icon.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Check if we're in a Router context
  const isRouterAvailable = () => {
    try {
      useNavigate();
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const NavLink = ({ to, children, ...props }) => {
    if (isRouterAvailable()) {
      return <Link to={to} {...props}>{children}</Link>;
    }
    return <a href={to} {...props}>{children}</a>;
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-branding">
          <NavLink to="/" className="footer-logo">
            <img src={coinIcon} alt="Coin Radar" />
            <h2>Coin Radar</h2>
          </NavLink>
          <p className="footer-tagline">Real-time cryptocurrency market data</p>
          <div className="footer-social">
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook size={18} />
            </a>
          </div>
        </div>
        
        <div className="footer-links">
          <div className="footer-column">
            <h3>Navigation</h3>
            <ul>
              <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="/favorites">Favorites</NavLink></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Resources</h3>
            <ul>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#api-docs">API Documentation</a></li>
              <li><a href="#blog">Blog</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Legal</h3>
            <ul>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#cookies">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Coin Radar. All rights reserved.</p>
        <p>Data provided by CoinGecko API</p>
      </div>
    </footer>
  );
};

export default Footer;