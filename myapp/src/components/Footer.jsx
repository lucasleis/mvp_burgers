import React from 'react';
import './Footer.css';
import logo from '../imgs/logoBlancoSinFondo.png';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">

      {/* Logo */}
      <div className="footer-left">
        <div className="footer-logo">
          <img src={logo} alt="Logo" />
        </div>
      </div>

      {/* WhatsApp */}
      <div className="footer-center">
        <a 
          href="https://wa.me/5491123456789" 
          target="_blank" 
          rel="noopener noreferrer"
          className="whatsapp-link"
        >
          <FaWhatsapp className="icon" />
          <span>+541123456789</span>
        </a>
      </div>

      {/* Instagram */}
      <div className="footer-right">
        <a 
          href="https://www.instagram.com/mvp.burgers/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="instagram-link"
        >
          <FaInstagram className="icon" />
          <span>@mvp.burgers</span>
        </a>
      </div>

    </footer>
  );
};

export default Footer;
