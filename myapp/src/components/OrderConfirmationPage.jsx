import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import "leaflet/dist/leaflet.css";
import "./OrderConfirmationPage.css";
import { useNavigate } from "react-router-dom";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const { method: initialMethod, total: initialTotal, deliveryTime } = location.state || {};
  const [method, setMethod] = useState(initialMethod || "Take Away");
  const [address, setAddress] = useState("");
  const [telefono, setPhone] = useState("");
  const [nombre, setName] = useState("");
  const [floor, setFloor] = useState("");
  const [apartment, setApartment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [telefonoError, setPhoneError] = useState(false);
  const [nombreError, setNameError] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(initialMethod || "Efectivo");
  // const [showTransferInfo, setShowTransferInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // scrollear hasta errores
  const telefonoRef = useRef(null);
  const nombreRef = useRef(null);
  const addressRef = useRef(null);

  const deliveryCharge = method === "Delivery" ? 5000 : 0;
  const baseTotal = initialTotal || 0;
  const finalTotal = baseTotal + deliveryCharge;

  const navigate = useNavigate();

  const handleConfirm = () => {
    let hasError = false;
    let firstErrorRef = null;

    if (telefono.trim() === "") {
      setPhoneError(true);
      hasError = true;
      if (!firstErrorRef) firstErrorRef = telefonoRef;
    }

    if (nombre.trim() === "") {
      setNameError(true);
      hasError = true;
      if (!firstErrorRef) firstErrorRef = nombreRef;
    }

    if (method === "Delivery" && address.trim() === "") {
      setAddressError(true);
      hasError = true;
      if (!firstErrorRef) firstErrorRef = addressRef;
    }

    if (hasError && firstErrorRef?.current) {
      firstErrorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Si todo está OK, mostramos el modal de confirmación
    setShowModal(true);
  };


  const handleModalCancel = () => {
    setShowModal(false);
  };

  const sendOrder = async ({
    method,
    paymentMethod,
    finalTotal,
    address,
    phoneNumber
  }) => {
    try {
      
      const response = await fetch(`${backendUrl}/enviarpedido`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: method,
          paymentMethod: paymentMethod,
          address: address,
          finalTotal: finalTotal,
          phoneNumber: phoneNumber,
          deliveryTime: deliveryTime
        })
      });
  
      const data = await response.json();
  
      if (data.success) {
        // alert("Pedido enviado!");
        navigate("/pedido-exitoso", {
        state: {
          method,
          paymentMethod,
          finalTotal: finalTotal.toLocaleString(),
          address: address,
          phoneNumber: telefono,
          username: nombre,
          deliveryTime: deliveryTime,
        }
      });
      } else {
        alert("Error al enviar pedido");
      }
      

    } catch (error) {
      console.error("Error al realizar el fetch:", error);
      //alert("Error de conexión con el servidor: ", error);
    }
  };
  

  return (
    <div className="confirmation-container">
      <h2>Confirmación de Pedido</h2>

      {/* INSERTAR DATOS*/}
      <div className="delivery-form">
        <label>Numero de contacto:</label>
        <input
          type="text"
          ref={telefonoRef}
          value={telefono}
          onChange={(e) => {
            const input = e.target.value;
            setPhone(input);
            const numericOnly = input.replace(/\D/g, ""); // Quita todo lo que no sea número
            if (numericOnly.length > 7) {
              setPhoneError(false);
            } else {
              setPhoneError(true);
            }
          }}
          placeholder="Ej: +541123456789"
          className={telefonoError ? "input-error" : ""}
        />
        {telefonoError && (
          <p className="error-message">Ingresá un número válido (mínimo 8 dígitos).</p>
        )}

        <label>Nombre de contacto:</label>
        <input
          type="text"
          ref={nombreRef}
          value={nombre}
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value.trim() !== "") {
              setNameError(false);
            }
          }}
          placeholder="Ej: Manuel"
          className={nombreError ? "input-error" : ""}
        />
        {nombreError && (
          <p className="error-message">Un nombre de contacto es obligatorio.</p>
        )}
      </div>

      <p className="method">Método de envío:</p>
      <div className="method-toggle">
        <div
          className={`method-option ${method === "Take Away" ? "active" : ""}`}
          onClick={() => {
            setMethod("Take Away");
            setAddressError(false);
          }}
        >
          Take Away
        </div>
        <div
          className={`method-option ${method === "Delivery" ? "active" : ""}`}
          onClick={() => setMethod("Delivery")}
        >
          Delivery
        </div>
      </div>

      {method === "Take Away" && (
        <>
          <p className="takeaway-address">Dirección: Sarmiento 253, Avellaneda</p>
          <div className="map-container">
            <iframe
              title="Ubicación Take Away"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.7704576170363!2d-58.37150512342676!3d-34.63536437292671!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a3335c0842fd3b%3A0x81b530bbf3f23968!2sSarmiento%20253%2C%20Avellaneda%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1712848461217!5m2!1ses-419!2sar"
              width="100%"
              height="250"
              style={{ border: 0, borderRadius: "8px", marginTop: "1rem" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </>
      )}

      {method === "Delivery" && (
        <div className="delivery-form">
          <p className="delivery-charge">*Incluye recargo por Delivery ($5.000)</p>
          <label>Dirección:</label>
          <input
            type="text"
            ref={addressRef}
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (e.target.value.trim() !== "") {
                setAddressError(false);
              }
            }}
            placeholder="Ej: Av. Mitre 123"
            className={addressError ? "input-error" : ""}
          />
          {addressError && (
            <p className="error-message">La dirección es obligatoria.</p>
          )}

          <label>Piso (opcional):</label>
          <input
            type="text"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            placeholder="Ej: 3"
          />

          <label>Departamento (opcional):</label>
          <input
            type="text"
            value={apartment}
            onChange={(e) => setApartment(e.target.value)}
            placeholder="Ej: B"
          />

        </div>
      )}

      <p className="method">Método de pago:</p>
      <div className="method-toggle">
        <div
          className={`method-option ${paymentMethod === "Efectivo" ? "active" : ""}`}
          onClick={() => setPaymentMethod("Efectivo")}
        >
          Efectivo
        </div>
        <div
          className={`method-option ${paymentMethod === "Transferencia" ? "active" : ""}`}
          onClick={() => setPaymentMethod("Transferencia")}
        >
          Transferencia
        </div>
      </div>


      <div className="order-footer">
        <div className="price-display">
          Total: <span className="price-amount">${finalTotal.toLocaleString()}</span>
        </div>
        <button className="primary-btn" onClick={handleConfirm}>
          Confirmar Compra
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={handleModalCancel} className="close-button">
              <X size={24} />
            </button>
            <h3>Revisar pedido:</h3>
            <p><strong>Método:</strong> {method}</p>
            {method === "Delivery" ? (
              <p>
                <strong>Dirección:</strong> {address}
                {floor && ` - Piso ${floor}`}
                {apartment && ` - Depto ${apartment}`}
              </p>
            ) : (
              <p><strong>Dirección:</strong> Sarmiento 253, Avellaneda. Depto A.</p>
            )}
            <p><strong>Método de pago: </strong>{paymentMethod}</p>
            <p><strong>Total:</strong> ${finalTotal.toLocaleString()}</p>

            <div className="modal-buttons">
              <button onClick={handleModalCancel} className="modal-btn cancel" disabled={isSubmitting}>
                Cancelar
              </button>

              <button
                className="modal-btn confirm"
                disabled={isSubmitting}
                onClick={async () => {
                  setIsSubmitting(true); 
                
                  const addressFormatted =
                    method === "Take Away"
                      ? "Sarmiento 253, Avellaneda. Depto A."
                      : `${address}${floor ? ` - Piso ${floor}` : ""}${apartment ? ` - Depto ${apartment}` : ""}`;
                
                  
                  await sendOrder({
                    method,
                    paymentMethod,
                    finalTotal: finalTotal.toLocaleString(),
                    address: addressFormatted,
                    phoneNumber: telefono,
                    username: nombre,
                    deliveryTime: deliveryTime, 
                  });
                
                  setIsSubmitting(false); 
                }}
              >
                {isSubmitting ? "Enviando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;

