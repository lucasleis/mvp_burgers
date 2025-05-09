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
  const hasOrderInfo = method || paymentMethod || finalTotal || address || phoneNumber || username;

  return (
    <div className="order-success-container">
      <h1>¡Pedido realizado con éxito!</h1>
      {username ? (
        <p>Gracias por tu compra, {username}.</p>
      ) : (
        <p>Gracias por tu compra.</p>
      )}

      {hasOrderInfo ? (
        <div className="order-details">
          {method && <p><strong>Método de entrega:</strong> {method}</p>}
          {address && <p><strong>Domicilio:</strong> {address}</p>}
          {phoneNumber && <p><strong>Teléfono:</strong> {phoneNumber}</p>}
          {paymentMethod && <p><strong>Método de pago:</strong> {paymentMethod}</p>}
          {typeof finalTotal === "number" && (
            <p><strong>Total:</strong> ${finalTotal.toLocaleString()}</p>
          )}
        </div>
      ) : (
        <p>No se encontraron detalles del pedido.</p>
      )}

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
