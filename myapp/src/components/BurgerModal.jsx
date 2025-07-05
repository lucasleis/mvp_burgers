import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import "./BurgerModal.css";

const BurgerModal = ({ isOpen, onClose, product }) => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;   // ⬅️ igual que en OrderPage

  /* ------------------- estados ------------------- */
  const [extrasList, setExtrasList] = useState([]);       // ← nuevo
  const [extras, setExtras] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [removeOptions, setRemoveOptions] = useState([]);
  const [selectedRemoved, setSelectedRemoved] = useState([]);
  const [selectedType, setSelectedType] = useState("Simple");

  /* --------- 1. traemos los extras una sola vez --------- */
  useEffect(() => {
    fetch(`${backendUrl}/extras`)
      .then((res) => res.json())
      .then((data) => setExtrasList(data))
      .catch((err) => console.error("Error al cargar extras:", err));
  }, [backendUrl]);

  /* --------- 2. cuando llega el producto o extrasList, reseteamos -------- */
  useEffect(() => {
    if (!product || extrasList.length === 0) return;

    // arranca todas las cantidades en 0
    const initialExtras = extrasList.reduce((acc, extra) => {
      acc[extra.name] = 0;
      return acc;
    }, {});

    setExtras(initialExtras);
    setQuantity(1);
    setRemoveOptions(product.removeOptions || []);
    setSelectedRemoved([]);
    setSelectedType(
      (product.price_simple > 0 && "Simple") ||
      (product.price_double > 0 && "Doble") ||
      (product.price_triple > 0 && "Triple") ||
      ""
    );
  }, [product, extrasList]);

  if (!product) return null;

  /* ---------------- tipos de burger ---------------- */
  const burgerTypes = [
    { name: "Simple",  description: "1 medallón", price: product.price_simple,  disabled: product.price_simple  === 0 },
    { name: "Doble",   description: "2 medallones", price: product.price_double, disabled: product.price_double   === 0 },
    { name: "Triple",  description: "3 medallones", price: product.price_triple, disabled: product.price_triple  === 0 },
  ];

  /* ---------------- helpers ---------------- */
  const updateExtra = (name, delta) =>
    setExtras((prev) => ({ ...prev, [name]: Math.max(prev[name] + delta, 0) }));

  const getSelectedTypeData = () =>
    burgerTypes.find((t) => t.name === selectedType) || burgerTypes[0];

  const calculateTotal = () => {
    const basePrice = getSelectedTypeData().price || 0;
    const extrasTotal = extrasList.reduce(
      (sum, extra) => sum + extras[extra.name] * extra.price,
      0
    );
    return (basePrice + extrasTotal) * quantity;
  };

  const handleAddToCart = () => {
    const selectedExtras = Object.entries(extras).filter(([_, qty]) => qty > 0);
    const item = {
      name: `${product.name} ${selectedType}`,
      quantity,
      extras: selectedExtras,
      removed: selectedRemoved,
      totalPrice: calculateTotal(),
      image: product.image,
      type: selectedType,
    };
    product.addToCart?.(item);
    onClose();
  };

  /* ---------------- render ---------------- */
  return (
    <Dialog open={isOpen} onClose={onClose} className="burger-modal-overlay">
      <div className="burger-modal-container">
        <button onClick={onClose} className="close-button" aria-label="Cerrar modal">
          <X size={24} />
        </button>

        <div className="burger-modal-content">
          {/* encabezado */}
          <div className="burger-header">
            <img src={product.image} alt={product.name} className="burger-image" />
            <div className="burger-header-texts">
              <h2 className="burger-name">{product.name}</h2>
              <p className="burger-description">{product.description}</p>
              <p className="burger-remark">Todas las hamburguesas vienen con papas.</p>
            </div>
          </div>

          <div className="burger-info">
            {/* tipo de burger */}
            <div className="section">
              <h3 className="section-title">Tipo de Hamburguesa</h3>
              <div className="burger-type-grid">
                {burgerTypes.map((type) => (
                  <button
                    key={type.name}
                    className={`burger-type-btn ${selectedType === type.name ? "selected" : ""}`}
                    onClick={() => !type.disabled && setSelectedType(type.name)}
                    disabled={type.disabled}
                    aria-label={`Seleccionar ${type.name}`}
                  >
                    <div className="type-name">{type.name}</div>
                    <div className="type-description">{type.description}</div>
                    <div className="type-price">
                      {type.price > 0 ? `$${type.price.toLocaleString()}` : "No disponible"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* extras */}
            <div className="section">
              <h3 className="section-title">Extras</h3>
              {extrasList.length === 0 ? (
                <p>Cargando extras...</p>
              ) : (
                <div className="extras-grid">
                  {extrasList.map((extra) => (
                    <div key={extra.id} className="extra-item">
                      <div className="extra-details">
                        <span>{extra.name}</span>
                        <span className="extra-price">${extra.price.toLocaleString()}</span>
                      </div>
                      <div className="counter">
                        <button
                          onClick={() => updateExtra(extra.name, -1)}
                          className="qty-btn"
                          aria-label={`Quitar ${extra.name}`}
                        >-</button>
                        <span>{extras[extra.name]}</span>
                        <button
                          onClick={() => updateExtra(extra.name, 1)}
                          className="qty-btn"
                          aria-label={`Agregar ${extra.name}`}
                        >+</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* quitar ingredientes (si los hay) */}
            {removeOptions.length > 0 && (
              <div className="section">
                <h3 className="section-title">Quitar</h3>
                <div className="remove-grid">
                  {removeOptions.map((opt) => (
                    <label key={opt} className="remove-option">
                      <input
                        type="checkbox"
                        checked={selectedRemoved.includes(opt)}
                        onChange={() =>
                          setSelectedRemoved((prev) =>
                            prev.includes(opt)
                              ? prev.filter((r) => r !== opt)
                              : [...prev, opt]
                          )
                        }
                      />{" "}
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* cantidad + total */}
            <div className="quantity-price">
              <div className="quantity-control">
                <p>Cantidad:</p>
                <button onClick={() => setQuantity(Math.max(quantity - 1, 1))} className="qty-btn" aria-label="Disminuir cantidad">-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="qty-btn" aria-label="Aumentar cantidad">+</button>
              </div>
              <p className="total-price">${calculateTotal().toLocaleString()}</p>
            </div>

            <button className="add-to-order-button" onClick={handleAddToCart} aria-label="Agregar a mi pedido">
              AGREGAR A MI PEDIDO (${calculateTotal().toLocaleString()})
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default BurgerModal;
