import React, { useState } from "react";
import "./OrderSummaryModal.css";
import { FaTrash } from "react-icons/fa";

const OrderSummaryModal = ({ isOpen, onClose, cart, setCart }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const deliveryCharge = selectedOption === "Delivery" ? 5000 : 0;
  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const total = subtotal + deliveryCharge;

  const handleRemoveItem = (indexToRemove) => {
    const updatedCart = cart.filter((_, index) => index !== indexToRemove);
    setCart(updatedCart);
  };

  return (
    <div className={`order-summary-modal ${isOpen ? "open" : ""}`}>
      <div className="modal-header">
        <h2>MI PEDIDO</h2>
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
              <p>${item.totalPrice.toLocaleString()}</p>
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

        <div className="store-select">
          <label>Método de envio:</label>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="" disabled hidden>Seleccionar</option>
            <option value="Take Away">Take Away</option>
            <option value="Delivery">Delivery ($5000)</option>
          </select>
        </div>

        <textarea placeholder="Añadir comentarios..."></textarea>

        <div className="modal-buttons">
          <button className="secondary-btn" onClick={onClose}>SEGUIR COMPRANDO</button>
          <button className="primary-btn">CONFIRMAR PEDIDO</button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryModal;
