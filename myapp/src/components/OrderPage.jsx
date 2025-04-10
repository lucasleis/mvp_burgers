import React, { useState } from "react";
import "./OrderPage.css";
import imageBurger from "../imgs/burger.png";
import BurgerModal from "./BurgerModal";
import OrderSummaryModal from "./OrderSummaryModal";

const OrderPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);


  const openModal = (product) => {
    const removeOptionsByBurger = {
      "Jordan": ["Sin Cheddar", "Sin Cebolla a la plancha" ],
      "Ginobilli": ["Sin Queso Provolone", "Sin Salsa Criolla" ],
      "Lebron": ["Sin Cheddar", "Sin Panceta", "Sin Aderezo MVP" ],
      "Black Mamba": ["Sin Cheddar", "Sin Tomate", "Sin Lechuga", "Sin Cebolla cruda", "Sin Aderezo Tasty" ],
    };

    var burgerName 

    if (product.name.split(" ").length === 2) {
      burgerName = product.name.split(" ")[0];
    } else if (product.name.split(" ").length === 3){
      burgerName = product.name.split(" ").slice(0, 2).join(" ");
    }


    setSelectedProduct({
      ...product,
      removeOptions: removeOptionsByBurger[burgerName] || [],
      addToCart: (item) => setCart([...cart, item])
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const totalCartPrice = cart.reduce((total, item) => total + item.totalPrice, 0);

  const products = [
    {
      name: "Jordan Simple",
      description: "Medallon x1, Cheddar y Cebolla a la plancha",
      price: 9000,
      image: imageBurger
    },
    {
      name: "Jordan Doble",
      description: "Medallon x2, Cheddar y Cebolla a la plancha",
      price: 11000,
      image: imageBurger
    },
    {
      name: "Jordan Triple",
      description: "Medallon x3, Cheddar y Cebolla a la plancha",
      price: 13000,
      image: imageBurger
    },
    {
      name: "Ginobilli Simple",
      description: "Medallon x1, Queso Provolone y Salsa Criolla",
      price: 9000,
      image: imageBurger
    },
    {
      name: "Ginobilli Doble",
      description: "Medallon x2, Queso Provolone y Salsa Criolla",
      price: 11000,
      image: imageBurger
    },
    {
      name: "Ginobilli Triple",
      description: "Medallon x3, Queso Provolone y Salsa Criolla",
      price: 13000,
      image: imageBurger
    },
    {
      name: "Lebron Simple",
      description: "Medallon x1, Cheddar, Panceta y Aderezo MVP",
      price: 10000,
      image: imageBurger
    },
    {
      name: "Lebron Doble",
      description: "Medallon x2, Cheddar, Panceta y Aderezo MVP",
      price: 12000,
      image: imageBurger
    },
    {
      name: "Lebron Triple",
      description: "Medallon x3, Cheddar, Panceta y Aderezo MVP",
      price: 14000,
      image: imageBurger
    },
    {
      name: "Black Mamba Simple",
      description: "Medallon x1, Cheddar, Tomate, Lechuga, Cebolla cruda y Aderezo Tasty",
      price: 10000,
      image: imageBurger
    },
    {
      name: "Black Mamba Doble",
      description: "Medallon x2, Cheddar, Tomate, Lechuga, Cebolla cruda y Aderezo Tasty",
      price: 12000,
      image: imageBurger
    },
    {
      name: "Black Mamba Triple",
      description: "Medallon x3, Cheddar, Tomate, Lechuga, Cebolla cruda y Aderezo Tasty",
      price: 14000,
      image: imageBurger
    }
  ];

  return (
    <div className="order-page">
      <div className="order-header">
        <h1>BURGERS</h1>
      </div>
      <div className="order-grid">
        {products.map((product, index) => (
          <div key={index} className="order-card">
            <img src={product.image} alt={product.name} />
            <div className="order-card-content">
              <h3>{product.name}</h3>
              <p className="description">{product.description}</p>
              <p className="price">$ {product.price.toLocaleString()}</p>
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
          <button className="finalize-button" onClick={() => setIsSummaryOpen(true)}>
            Finalizar Pedido
          </button>
        </div>
      )}

      <button
        className={`floating-cart ${isSummaryOpen ? "open" : ""}`}
        onClick={() => setIsSummaryOpen(!isSummaryOpen)}
      >
        🛒
      </button>

      <BurgerModal isOpen={isModalOpen} onClose={closeModal} product={selectedProduct} />
      <OrderSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        cart={cart}
        total={totalCartPrice}
      />

    </div>
  );
};

export default OrderPage;
