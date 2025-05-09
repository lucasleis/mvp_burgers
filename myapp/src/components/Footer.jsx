import React from 'react';
import './Footer.css';
import logo from '../imgs/logoBlancoSinFondo.png';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      
      {/* Logo */}
      <div className="footer-left">
        <div className="footer-logo">
          <img src={logo} alt="MVP Burgers logo" loading="lazy" />
        </div>
      </div>

      {/* WhatsApp */}
      <div className="footer-center">
        <a 
          href="https://wa.me/5491123456789" 
          target="_blank" 
          rel="noopener noreferrer"
          className="whatsapp-link"
          aria-label="Contactar por WhatsApp"
        >
          <FaWhatsapp className="icon" aria-hidden="true" />
          <span>+54 11 2345 6789</span>
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

    </footer>
  );
};

export default Footer;
