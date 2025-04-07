import React from 'react';
import './Footer.css';
import logo from '../imgs/logoBlancoSinFondo.png';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <img src={logo} alt="Logo" />
      </div>
      <div className="footer-center">
        <div className="footer-text">
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

      </div>
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
