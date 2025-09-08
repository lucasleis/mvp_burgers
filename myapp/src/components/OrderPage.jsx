import React, { useState, useEffect, useRef } from "react";
import "./OrderPage.css";
import imageBurger from "../imgs/burger.png";
import BurgerModal from "./BurgerModal";
import OrderSummaryModal from "./OrderSummaryModal";
import { FaShoppingCart } from "react-icons/fa";

const OrderPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const finalizeButtonRef = useRef(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const [products, setProducts] = useState([]);
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificamos si la tienda está abierta
  useEffect(() => {
    fetch(`${backendUrl}/status`)
      .then((res) => res.json())
      .then((data) => {
        setBlocked(!data.open);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al verificar estado de la tienda:", err);
        setBlocked(true);
        setLoading(false);
      });
  }, [backendUrl]);

  // Cargamos el menú si está abierta
  useEffect(() => {
    if (!blocked) {
      fetch(`${backendUrl}/menu`)
        .then((res) => res.json())
        .then((data) => {

          // Ordenar los productos por precio (usando price_simple o price_double)
          const productosOrdenados = [...data].sort((a, b) => {
            const precioA = Number(a.price_simple) || Number(a.price_double) || 0;
            const precioB = Number(b.price_simple) || Number(b.price_double) || 0;
            return precioA - precioB; // ascendente, de menor a mayor
          });

          const productosConImagen = productosOrdenados.map((prod) => ({
            ...prod,
            image: imageBurger,
          }));
          setProducts(productosConImagen);
        })
        .catch((err) => console.error("Error al cargar menú:", err));
    }
  }, [backendUrl, blocked]);

  const openModal = (product) => {
    if (!product?.name) return;

    setSelectedProduct({
      ...product,
      addToCart: (item) => {
        const wasEmpty = cart.length === 0;
        const newCart = [...cart, item];

        if (wasEmpty && finalizeButtonRef.current) {
          setTimeout(() => {
            finalizeButtonRef.current.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }

        setCart(newCart);
      },
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const totalCartPrice = cart.reduce((total, item) => total + item.totalPrice, 0);

  if (loading) {
    return <p className="p-4">Cargando estado de la tienda...</p>;
  }

  if (blocked) {
    return (
      <div className="order-page closed">
        <h1>😔 Lo sentimos</h1>
        <p>No estamos tomando pedidos en este momento.</p>
        <p>¡Volvé más tarde!</p>
      </div>
    );
  }

  return (
    <div className="order-page">
      <div className="order-header">
        <h1>BURGERS</h1>
      </div>

      <div className="order-grid">
        {products.map((product) => (
          <div key={product.name} className="order-card">
            <img src={product.image} alt={`Foto de ${product.name}`} />
            <div className="order-card-content">
              <h3>{product.name}</h3>
              <p className="description">{product.description}</p>
              <p className="price">
                {Number(product.price_simple)
                  ? `$ ${Number(product.price_simple).toLocaleString()}`
                  : Number(product.price_double)
                  ? `$ ${Number(product.price_double).toLocaleString()}`
                  : "Precio no disponible"}
              </p>
              <button className="add-button" onClick={() => openModal(product)}>
                AGREGAR
              </button>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="finalize-container">
          <p className="finalize-total">
            Total del pedido: <span>${totalCartPrice.toLocaleString()}</span>
          </p>
          <button
            ref={finalizeButtonRef}
            className="finalize-button"
            onClick={() => setIsSummaryOpen(true)}
          >
            Finalizar Pedido
          </button>
        </div>
      )}

      <button
        className={`floating-cart ${isSummaryOpen ? "open" : ""}`}
        onClick={() => setIsSummaryOpen(!isSummaryOpen)}
      >
        <FaShoppingCart />
      </button>

      <BurgerModal isOpen={isModalOpen} onClose={closeModal} product={selectedProduct} />

      <OrderSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        cart={cart}
        setCart={setCart}
        total={totalCartPrice}
      />
    </div>
  );
};

export default OrderPage;
