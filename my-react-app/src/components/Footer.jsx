import logo from '../assets/Coin-radar-icon.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-logo">
        <img src={logo} alt="Coin Radar Logo" />
        <h1>Coin Radar</h1>
      </div>
      <div className="footer-info">
        <p>&copy; 2025 Coin Radar. All rights reserved.</p>
        <p>Contact: info@coinradar.com</p>
        <p>Address: 123 Crypto Street, Blockchain City</p>
      </div>
    </footer>
  );
};

export default Footer;