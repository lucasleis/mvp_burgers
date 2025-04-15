import React, { useState } from "react";
import "./OrderSummaryModal.css";
// import DeliveryMap from "./DeliveryMap"; 
import { FaTrash } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const OrderSummaryModal = ({ isOpen, onClose, cart, setCart }) => {
  //const [selectedOption, setSelectedOption] = useState("");
  const [selectedOption, ] = useState("");

  const deliveryCharge = selectedOption === "Delivery" ? 5000 : 0;
  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const total = subtotal + deliveryCharge;

  const handleRemoveItem = (indexToRemove) => {
    const updatedCart = cart.filter((_, index) => index !== indexToRemove);
    setCart(updatedCart);
  };

  const navigate = useNavigate();
  const handleConfirmClick = () => {
    navigate("/confirmar", { state: { method: selectedOption } });
  };
  

  return (
    <div className={`order-summary-modal ${isOpen ? "open" : ""}`}>
      <div className="modal-header">
        <h2>MI PEDIDO</h2>
        <button className="close-btn" onClick={onClose}>CERRAR</button>
      </div>

      <div className="modal-content">
        <p className="item-count">({cart.length} artículo{cart.length !== 1 ? "s" : ""})</p>

        {cart.map((item, index) => (
          <div className="cart-item" key={index}>
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  borderRadius: "6px"
                }}
              />
            ) : (
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "6px",
                  backgroundColor: "#ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  color: "#666"
                }}
              >
                Sin imagen
              </div>
            )}

            <div className="cart-item-info">
              <strong>{item.name}</strong>
              <div className="customizations">
              {item.extras && item.extras.map(([name, qty], i) => (
                <p key={`extra-${i}`}>{name} x{qty}</p>
              ))}
                {item.removed && item.removed.map((rem, i) => (
                  <p key={`removed-${i}`}>{rem}</p>
                ))}
              </div>
              <p><strong>${item.totalPrice.toLocaleString()}</strong></p>
            </div>

            <button className="icon-btn" onClick={() => handleRemoveItem(index)}>
              <FaTrash />
            </button>
          </div>
        ))}

        <div className="summary">
          <div className="row">
            <span>SUBTOTAL</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          {deliveryCharge > 0 && (
            <div className="row">
              <span>Delivery</span>
              <span>${deliveryCharge.toLocaleString()}</span>
            </div>
          )}
          <div className="row total">
            <strong>TOTAL</strong>
            <strong>${total.toLocaleString()}</strong>
          </div>
        </div>

        {/*
        <div className="store-select">
          <label>Método de envio:</label>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="" disabled hidden>Seleccionar</option>
            <option value="Take Away">Take Away. Sarmiento 251, Avellaneda</option>
            <option value="Delivery">Delivery ($5000)</option>
          </select>

          {selectedOption === "Take Away" && (
            <div className="map-container">
              <iframe
                title="Ubicación Take Away"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.7704576170363!2d-58.37150512342676!3d-34.63536437292671!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a3335c0842fd3b%3A0x81b530bbf3f23968!2sSarmiento%20251%2C%20Avellaneda%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1712848461217!5m2!1ses-419!2sar"
                width="100%"
                height="250"
                style={{ border: 0, borderRadius: "8px", marginTop: "1rem" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          )}
        </div>
        */}

        <textarea placeholder="Añadir comentarios..."></textarea>

        <div className="modal-buttons">
          <button className="secondary-btn" onClick={onClose}>SEGUIR COMPRANDO</button>
          <button className="primary-btn" onClick={handleConfirmClick}>
            TERMINAR PEDIDO
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryModal;
