import React, { useState, useEffect } from 'react';
import './HomeSection.css';
import burgerImg from '../imgs/burgerSinFondo.png';
import { Link } from 'react-router-dom';
import OrderInfoModal from './InfoHorarios'; // Importar el modal

const HomeSection = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <section className="home-section">
      {showModal && <OrderInfoModal onClose={handleCloseModal} />}
      <div className="text-content">
        <h1>MVP</h1>
        <h1>BURGERS</h1>
        <Link to="/order" className="order-now-button"> Hacé tu pedido online </Link>
      </div>
      <div className="image-container">
        <img src={burgerImg} alt="Hamburguesa" />
      </div>
    </section>
  );
};

export default HomeSection;
