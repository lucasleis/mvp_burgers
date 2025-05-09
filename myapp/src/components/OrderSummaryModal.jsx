import React, { useState, useEffect } from "react";
import "./OrderSummaryModal.css";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OrderSummaryModal = ({ isOpen, onClose, cart, setCart }) => {
  const [selectedOption, ] = useState("");
  
  // Asegurarse de que se reciba correctamente el carrito
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
    navigate("/confirmar", { state: { method: selectedOption, total } });
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
                className="cart-item-image"
              />
            ) : (
              <div className="cart-item-no-image">Sin imagen</div>
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

        {/* El método de envío podría ser implementado aquí si se requiere */}
        {/* <div className="store-select">
          <label>Método de envio:</label>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="" disabled hidden>Seleccionar</option>
            <option value="Take Away">Take Away. Sarmiento 251, Avellaneda</option>
            <option value="Delivery">Delivery ($5000)</option>
          </select>
        </div> */}

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
