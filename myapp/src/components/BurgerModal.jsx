import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import "./BurgerModal.css";

const extrasList = [
  { name: "Extra Medallón", price: 3000 },
  { name: "Extra Bacon", price: 2000 },
  { name: "Extra Cheddar", price: 2000 }
];

const burgerTypes = [
  { name: "Simple", multiplier: 1, description: "1 medallón" },
  { name: "Doble", multiplier: 1.2, description: "2 medallones" },
  { name: "Triple", multiplier: 1.4, description: "3 medallones" }
];

const BurgerModal = ({ isOpen, onClose, product }) => {
  const [quantity, setQuantity] = useState(1);
  const [extras, setExtras] = useState({});
  const [removeOptions, setRemoveOptions] = useState([]);
  const [selectedRemoved, setSelectedRemoved] = useState([]);
  const [selectedType, setSelectedType] = useState("Simple");

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
      setSelectedRemoved([]);
      setSelectedType("Simple");
    }
  }, [product]);

  if (!product) return null;

  const updateExtra = (name, delta) => {
    setExtras((prev) => ({
      ...prev,
      [name]: Math.max(prev[name] + delta, 0)
    }));
  };

  const getSelectedTypeData = () => {
    return burgerTypes.find(type => type.name === selectedType) || burgerTypes[0];
  };

  const calculateTotal = () => {
    const selectedTypeData = getSelectedTypeData();
    const basePrice = product.price * selectedTypeData.multiplier;
    const extrasTotal = extrasList.reduce(
      (total, extra) => total + extras[extra.name] * extra.price,
      0
    );
    return (basePrice + extrasTotal) * quantity;
  };

  const handleAddToCart = () => {
    const selectedExtras = Object.entries(extras).filter(([_, qty]) => qty > 0);
    const selectedTypeData = getSelectedTypeData();

    const item = {
      name: `${product.name} ${selectedType}`,
      quantity,
      extras: selectedExtras,
      removed: selectedRemoved,
      totalPrice: calculateTotal(),
      image: product.image,
      type: selectedType
    };

    if (product.addToCart) {
      product.addToCart(item);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="burger-modal-overlay">
      <div className="burger-modal-container">
        <button onClick={onClose} className="close-button" aria-label="Cerrar modal">
          <X size={24} />
        </button>

        <div className="burger-modal-content">
          <img src={product.image} alt={product.name} className="burger-image" />
          <div className="burger-info">
            <h2 className="burger-name">{product.name}</h2>
            <p className="burger-description">{product.description}</p>
            <p className="burger-description">Todas las hamburguesas vienen con papas.</p>

            <div className="section">
              <h3 className="section-title">Tipo de Hamburguesa</h3>
              <div className="burger-type-grid">
                {burgerTypes.map((type) => (
                  <button
                    key={type.name}
                    className={`burger-type-btn ${selectedType === type.name ? 'selected' : ''}`}
                    onClick={() => setSelectedType(type.name)}
                    aria-label={`Seleccionar ${type.name}`}
                  >
                    <div className="type-name">{type.name}</div>
                    <div className="type-description">{type.description}</div>
                    <div className="type-price">
                      ${(product.price * type.multiplier).toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="section">
              <h3 className="section-title">Extras</h3>
              <div className="extras-grid">
                {extrasList.map((extra) => (
                  <div key={extra.name} className="extra-item">
                    <div className="extra-details">
                      <span>{extra.name}</span>
                      <span className="extra-price">${extra.price.toLocaleString()}</span>
                    </div>
                    <div className="counter">
                      <button onClick={() => updateExtra(extra.name, -1)} className="qty-btn" aria-label={`Quitar ${extra.name}`}>-</button>
                      <span>{extras[extra.name]}</span>
                      <button onClick={() => updateExtra(extra.name, 1)} className="qty-btn" aria-label={`Agregar ${extra.name}`}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {removeOptions.length > 0 && (
              <div className="section">
                <h3 className="section-title">Quitar</h3>
                <div className="remove-grid">
                  {removeOptions.map((opt) => (
                    <label key={opt} className="remove-option">
                      <input
                        type="checkbox"
                        checked={selectedRemoved.includes(opt)}
                        onChange={() => {
                          setSelectedRemoved((prev) =>
                            prev.includes(opt)
                              ? prev.filter((r) => r !== opt)
                              : [...prev, opt]
                          );
                        }}
                      />{" "}
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="quantity-price">
              <div className="quantity-control">
                <p>Cantidad: </p>
                <button onClick={() => setQuantity(Math.max(quantity - 1, 1))} className="qty-btn" aria-label="Disminuir cantidad">-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="qty-btn" aria-label="Aumentar cantidad">+</button>
              </div>
              <p className="total-price">${calculateTotal().toLocaleString()}</p>
            </div>

            <button
              className="add-to-order-button"
              onClick={handleAddToCart}
              aria-label="Agregar a mi pedido"
            >
              AGREGAR A MI PEDIDO (${calculateTotal().toLocaleString()})
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default BurgerModal;
