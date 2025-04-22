// src/pages/OrderSuccess.jsx
import React from "react";
import "./OrderSuccess.css";
import { useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const location = useLocation();
  const {
    method,
    paymentMethod,
    finalTotal,
    address,
    phoneNumber,
    username,
  } = location.state || {};

  const showTransferInfo = paymentMethod === "Transferencia";

  return (
    <div className="order-success-container">
      <h1>¡Pedido realizado con éxito!</h1>
      <p>Gracias por tu compra, {username}.</p>

      <div className="order-details">
        <p><strong>Método de entrega:</strong> {method}</p>
        <p><strong>Domicilio:</strong> {address}</p>
        <p><strong>Teléfono:</strong> {phoneNumber}</p>
        <p><strong>Método de pago:</strong> {paymentMethod}</p>
        <p><strong>Total:</strong> ${finalTotal}</p>
      </div>

      {showTransferInfo && (
        <div className="transfer-info">
          <h3>Datos para Transferencia</h3>
          <p>Por favor, transferí a:</p>
          <p><strong>ALIAS:</strong> MVP.BURGERS</p>
          <p><strong>CBU:</strong> 0000003100000000123456</p>
          <p>Y enviá el comprobante a:</p>
          <p><strong>+54 11 2345 6789</strong></p>
        </div>
      )}
    </div>
  );
};

export default OrderSuccess;
