import './Header.css';
import logo from '../imgs/logo.png';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header" role="banner">
      <Link to="/" className="logo-link" aria-label="Ir a la página principal">
        <img src={logo} alt="MVP Burgers Logo" className="logo" loading="lazy" />
      </Link>

      <nav className="nav" aria-label="Navegación principal">
        <ul className="nav-list">
          {/* Futuro: enlaces del menú */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
