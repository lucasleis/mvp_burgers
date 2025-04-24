import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import "./BurgerModal.css";

const extrasList = [
  { name: "Extra Medallón", price: 3000 },
  { name: "Extra Bacon", price: 2000 },
  { name: "Extra Cheddar", price: 2000 }
];

const BurgerModal = ({ isOpen, onClose, product }) => {
  const [quantity, setQuantity] = useState(1);
  const [extras, setExtras] = useState({});
  const [removeOptions, setRemoveOptions] = useState([]);

  useEffect(() => {
    if (product) {
      setExtras(
        extrasList.reduce((acc, extra) => {
          acc[extra.name] = 0;
          return acc;
        }, {})
      );
      setQuantity(1);
      setRemoveOptions(product.removeOptions || []);
    }
  }, [product]);

  if (!product) return null;

  const incrementExtra = (name) => {
    setExtras({ ...extras, [name]: extras[name] + 1 });
  };

  const decrementExtra = (name) => {
    if (extras[name] > 0) {
      setExtras({ ...extras, [name]: extras[name] - 1 });
    }
  };

  const incrementQty = () => {
    setQuantity(quantity + 1);
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const calculateTotal = () => {
    const extrasTotal = extrasList.reduce(
      (total, extra) => total + extras[extra.name] * extra.price,
      0
    );
    return (product.price + extrasTotal) * quantity;
  };

  const total = calculateTotal();

  return (
    <Dialog open={isOpen} onClose={onClose} className="burger-modal-overlay">
      <div className="burger-modal-container">
        <button onClick={onClose} className="close-button">
          <X size={24} />
        </button>

        <div className="burger-modal-content">
          <img src={product.image} alt={product.name} className="burger-image" />
          <div className="burger-info">
            <h2 className="burger-name">{product.name}</h2>
            <p className="burger-description">{product.description}</p>
            <p className="burger-description">Todas las hamburguesas vienen con papas.</p>

            <div className="section">
              <h3 className="section-title">Extras</h3>
              <div className="extras-grid">
                {extrasList.map((extra, idx) => (
                  <div key={idx} className="extra-item">
                    <div className="extra-details">
                      <span>{extra.name}</span>
                      <span className="extra-price">${extra.price.toLocaleString()}</span>
                    </div>
                    <div className="counter">
                      <button onClick={() => decrementExtra(extra.name)} className="qty-btn">-</button>
                      <span>{extras[extra.name]}</span>
                      <button onClick={() => incrementExtra(extra.name)} className="qty-btn">+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {removeOptions.length > 0 && (
              <div className="section">
                <h3 className="section-title">Quitar</h3>
                <div className="remove-grid">
                  {removeOptions.map((opt, idx) => (
                    <label key={idx} className="remove-option">
                      <input type="checkbox" /> {opt}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="quantity-price">
              <div className="quantity-control">
                <p>Cantidad: </p>
                <button onClick={decrementQty} className="qty-btn">-</button>
                <span>{quantity}</span>
                <button onClick={incrementQty} className="qty-btn">+</button>
              </div>
              <p className="total-price">${total.toLocaleString()}</p>
            </div>

            <button
              className="add-to-order-button"
              onClick={() => {
                const selectedExtras = Object.entries(extras).filter(([_, qty]) => qty > 0);
                const selectedRemoved = Array.from(document.querySelectorAll('.remove-option input:checked')).map(
                  input => input.parentElement.textContent.trim()
                );
              
                const item = {
                  name: product.name,
                  quantity,
                  extras: selectedExtras,
                  removed: selectedRemoved, 
                  totalPrice: total,
                  image: product.image 
                };
              
                if (product.addToCart) {
                  product.addToCart(item);
                }
                onClose();
              }}
            >
              AGREGAR A MI PEDIDO (${total.toLocaleString()})
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default BurgerModal;
