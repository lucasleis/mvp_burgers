import React, { useState, useEffect } from "react";
import "./OrderSummaryModal.css";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OrderSummaryModal = ({ isOpen, onClose, cart, setCart }) => {
  const [selectedOption, ] = useState(""); // usar  este estado para Take Away o Delivery 
  const [deliveryTime, setDeliveryTime] = useState("");

  useEffect(() => {
    if (!Array.isArray(cart)) {
      console.error("cart should be an array.");
    }
  }, [cart]);

  const deliveryCharge = selectedOption === "Take Away" ? 5000 : 0;
  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const total = subtotal + deliveryCharge;

  const handleRemoveItem = (indexToRemove) => {
    const updatedCart = cart.filter((_, index) => index !== indexToRemove);
    setCart(updatedCart);
  };

  const navigate = useNavigate();
  const handleConfirmClick = () => {
    if (cart.length === 0) {
      alert("No hay productos en tu carrito.");
      return;
    }
    
    navigate("/confirmar", { state: { method: selectedOption, total, deliveryTime } });
  };

  return (
    <div className={`order-summary-modal ${isOpen ? "open" : ""}`}>
      <div className="modal-header">
        <h2>MI PEDIDO</h2>
        <button className="close-btn" onClick={onClose}>CERRAR</button>
      </div>

      <div className="modal-content">
        <p className="item-count">
          ({cart.reduce((total, item) => total + item.quantity, 0)} artículo
          {cart.reduce((total, item) => total + item.quantity, 0) !== 1 ? "s" : ""})
        </p>
        
        {cart.map((item, index) => (
          <div className="cart-item" key={index}>
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-image"
              />
            ) : (
              <div className="cart-item-no-image">Sin imagen</div>
            )}

            <div className="cart-item-info">
              <strong>{item.name}</strong>
              <p>Cantidad: {item.quantity}</p>
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

        {/* Horario de entrega */}
        <div className="delivery-time-section">
        <select id="delivery-time" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} >
          <option value="" disabled hidden> Seleccionar horario de Entrega </option>
          <option value="20:00-20:30">20:00 - 20:30</option>
          <option value="20:30-21:00">20:30 - 21:00</option>
          <option value="21:00-21:30">21:00 - 21:30</option>
          <option value="21:30-22:00">21:30 - 22:00</option>
          <option value="22:00-22:30">22:00 - 22:30</option>
          <option value="22:30-23:00">22:30 - 23:00</option>
          <option value="23:00-23:30">23:00 - 23:30</option>
        </select>
        </div>

        <textarea placeholder="Añadir comentarios..."></textarea>

        <div className="modal-buttons">
          <button className="secondary-btn" onClick={onClose}>
            SEGUIR COMPRANDO
          </button>
          <button className="primary-btn" onClick={handleConfirmClick}>
            TERMINAR PEDIDO
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryModal;
