import React from 'react';
import './Footer.css';
// import logo from '../imgs/logoBlancoSinFondo.png';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      
      {/* Logo 
      <div className="footer-left">
        <div className="footer-logo">
          <img src={logo} alt="MVP Burgers logo" loading="lazy" />
        </div>
      </div>
      */}

      <div className="footer-contact-row">

        {/* WhatsApp */} 
        <div className="footer-center">
          <a 
            href="https://wa.me/5491130201586" 
            target="_blank" 
            rel="noopener noreferrer"
            className="whatsapp-link"
            aria-label="Contactar por WhatsApp"
          >
            <FaWhatsapp className="icon" aria-hidden="true" />
            <span>+54 11 3020 1586</span>
          </a>
        </div>

        {/* Instagram */}
        <div className="footer-right">
          <a 
            href="https://www.instagram.com/mvp.burgers/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="instagram-link"
            aria-label="Visitar Instagram de MVP Burgers"
          >
            <FaInstagram className="icon" aria-hidden="true" />
            <span>@mvp.burgers</span>
          </a>
        </div>
      </div>
 
      {/* Créditos */}
      <div className="footer-credits">
        <p>© {new Date().getFullYear()} MVP Burgers | Hecho con ❤️ por <a href="https://nivalis.ar" target="_blank" rel="noopener noreferrer">Nivalis</a></p>
      </div>
  </footer>
  );
};

export default Footer;
