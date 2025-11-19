// src/components/HomeSection.jsx
import React, { useState, useEffect } from "react";
import "./HomeSection.css";
import burgerImg from "../imgs/mascota_sinfondo_volteada.png";
import { Link } from "react-router-dom";
import OrderInfoModal from "./InfoHorarios";

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

      <div className="image-container">
        <img
          src={burgerImg}
          alt="Ilustración de hamburguesa"
          loading="lazy"
          width="300"
          height="300"
        />
      </div>

      <div className="text-content">
        <div className="text-content">
          <div className="title-block">
            <h1>MVP</h1>
            <h1>BURGERS</h1>
          </div>

          <Link
            to="/order"
            className="order-now-button"
          >
            Hacé tu pedido online
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
