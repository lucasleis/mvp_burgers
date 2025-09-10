// src/components/Header.jsx
import "./Header.css";
import logo from "../imgs/logo.png";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header" role="banner">
      <Link
        to="/"
        className="logo-link"
        aria-label="Ir a la página principal de MVP Burgers"
      >
        <img
          src={logo}
          alt="Logo de MVP Burgers"
          className="logo"
          loading="lazy"
          width="140"
          height="auto"
        />
      </Link>

      <nav className="nav" aria-label="Navegación principal">
        <ul className="nav-list">
          {/* Futuro: añadir enlaces del menú
              Ejemplo seguro:
              <li><Link to="/menu" aria-label="Ver menú">Menú</Link></li>
              <li><Link to="/contacto" aria-label="Ir a contacto">Contacto</Link></li>
           */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
