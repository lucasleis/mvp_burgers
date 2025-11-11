// src/components/OrderSuccess.jsx
import React from "react";
import "./OrderSuccess.css";
import { useLocation } from "react-router-dom";

// 🔒 Helper de sanitización básica
function sanitizeText(value) {
  if (!value) return "";
  return String(value).replace(/<\/?[^>]+(>|$)/g, "").trim();
}

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
  const hasOrderInfo =
    method || paymentMethod || finalTotal || address || phoneNumber || username;

  // Sanitización de textos dinámicos
  const safeUsername = sanitizeText(username);
  const safeMethod = sanitizeText(method);
  const safePaymentMethod = sanitizeText(paymentMethod);
  const safeAddress = sanitizeText(address);
  const safePhone = sanitizeText(phoneNumber);

  return (
    <div className="order-success-container">
      <h1>¡Pedido realizado con éxito!</h1>

      {safeUsername ? (
        <p>
          Gracias por tu compra, <strong>{safeUsername}</strong>.
        </p>
      ) : (
        <p>Gracias por tu compra.</p>
      )}

      {hasOrderInfo ? (
        <div className="order-details">
          {safeMethod && (
            <p>
              <strong>Método de entrega:</strong> {safeMethod}
            </p>
          )}
          {safeAddress && (
            <p>
              <strong>Domicilio:</strong> {safeAddress}
            </p>
          )}
          {safePhone && (
            <p>
              <strong>Teléfono:</strong> {safePhone}
            </p>
          )}
          {safePaymentMethod && (
            <p>
              <strong>Método de pago:</strong> {safePaymentMethod}
            </p>
          )}
          {typeof finalTotal === "number" && (
            <p>
              <strong>Total:</strong> ${finalTotal.toLocaleString("es-AR")}
            </p>
          )}
        </div>
      ) : (
        <p>No se encontraron detalles del pedido.</p>
      )}

      {showTransferInfo && (
        <div className="transfer-info">
          <h3>Datos para Transferencia</h3>
          <p>Por favor, transferí a:</p>
          <p>
            <strong>ALIAS:</strong> <code>MVP.BURGERS</code>
          </p>
          <p>
            <strong>CBU:</strong>{" "}
            <code>0000003100000000123456</code>
          </p>
          <p>Y enviá el comprobante a:</p>
          <p>
            <strong>+54 11 2345 6789</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderSuccess;
