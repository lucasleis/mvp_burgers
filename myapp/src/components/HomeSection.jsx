import React from 'react';
import './HomeSection.css';
import burgerImg from '../imgs/burgerSinFondo.png';

const HomeSection = () => {
  return (
    <section className="home-section">
      <div className="text-content">
        <h1>MVP</h1>
        <h1>BURGERS</h1>
        <button className="order-now-button">Hacé tu pedido online</button>
      </div>
      <div className="image-container">
        <img src={burgerImg} alt="Hamburguesa" />
      </div>
    </section>
  );
};

export default HomeSection;
