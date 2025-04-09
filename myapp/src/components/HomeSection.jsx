import React from 'react';
import './HomeSection.css';
import burgerImg from '../imgs/burgerSinFondo.png';
import { Link } from 'react-router-dom';


const HomeSection = () => {
  return (
    <section className="home-section">
      <div className="text-content">
        <h1>MVP</h1>
        <h1>BURGERS</h1>
        {/*<button className="order-now-button">Hacé tu pedido online</button> */}
        <Link to="/order" className="order-now-button"> Hacé tu pedido online </Link>
      </div>
      <div className="image-container">
        <img src={burgerImg} alt="Hamburguesa" />
      </div>
    </section>
  );
};

export default HomeSection;
