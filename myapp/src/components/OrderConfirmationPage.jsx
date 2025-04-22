import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import "leaflet/dist/leaflet.css";
import "./OrderConfirmationPage.css";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const { method: initialMethod, total: initialTotal } = location.state || {};
  const [method, setMethod] = useState(initialMethod || "Take Away");
  const [address, setAddress] = useState("");
  const [floor, setFloor] = useState("");
  const [apartment, setApartment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(initialMethod || "Efectivo");
  const [showTransferInfo, setShowTransferInfo] = useState(false);

  const deliveryCharge = method === "Delivery" ? 5000 : 0;
  const baseTotal = initialTotal || 0;
  const finalTotal = baseTotal + deliveryCharge;

  const handleConfirm = () => {
    if (method === "Delivery" && address.trim() === "") {
      setAddressError(true);
      return;
    }
    setAddressError(false);
    setShowModal(true);
  };

  /*
    const handleModalConfirm = () => {
      setShowModal(false);

      if (paymentMethod === "Transferencia") {
        setShowTransferInfo(true);
        return;
      }

      alert(
        `Pedido confirmado!\nMétodo de pago: ${paymentMethod}\nMétodo: ${method}\nDirección: ${
          method === "Take Away"
            ? "Sarmiento 251, Avellaneda"
            : `${address}${floor ? ` - Piso ${floor}` : ""}${apartment ? ` - Depto ${apartment}` : ""}`
        }\nTotal: $${finalTotal.toLocaleString()}`
      );   
    };
  */
  

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
      console.log(JSON.stringify({
        method,
        paymentMethod,
        address,
        finalTotal,
        phoneNumber
      }));
      
      const response = await fetch("http://127.0.0.1:5000/enviarpedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: method,
          paymentMethod: paymentMethod,
          address: address,
          finalTotal: finalTotal,
          phoneNumber: phoneNumber
        })
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert("Pedido enviado!");
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
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            if (e.target.value.trim() !== "") {
              setAddressError(false);
            }
          }}
          placeholder="Ej: +541123456789"
          className={addressError ? "input-error" : ""}
        />
        {addressError && (
          <p className="error-message">Un numero de contacto es obligatorio.</p>
        )}

        <label>Nombre de contacto:</label>
        <input
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            if (e.target.value.trim() !== "") {
              setAddressError(false);
            }
          }}
          placeholder="Ej: Manuel"
          className={addressError ? "input-error" : ""}
        />
        {addressError && (
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
          <p className="takeaway-address">Dirección: Sarmiento 251, Avellaneda</p>
          <div className="map-container">
            <iframe
              title="Ubicación Take Away"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.7704576170363!2d-58.37150512342676!3d-34.63536437292671!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a3335c0842fd3b%3A0x81b530bbf3f23968!2sSarmiento%20251%2C%20Avellaneda%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1712848461217!5m2!1ses-419!2sar"
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
              <p><strong>Dirección:</strong> Sarmiento 251, Avellaneda</p>
            )}
            <p><strong>Método de pago: </strong>{paymentMethod}</p>
            <p><strong>Total:</strong> ${finalTotal.toLocaleString()}</p>

            <div className="modal-buttons">
              <button onClick={handleModalCancel} className="secondary-btn">
                Cancelar
              </button>
              {/*<button onClick={handleModalConfirm} className="primary-btn"> */}
              <button className="primary-btn" onClick={() => {
                  const addressFormatted = method === "Take Away"
                    ? "Sarmiento 251, Avellaneda"
                    : `${address}${floor ? ` - Piso ${floor}` : ""}${apartment ? ` - Depto ${apartment}` : ""}`;
                
                  sendOrder({
                    method: "Delivery",
                    paymentMethod: "Efectivo",
                    finalTotal: finalTotal.toLocaleString(),
                    address: addressFormatted,
                    phoneNumber: "",
                    username: "manuel"
                  })
                  }}
                >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {showTransferInfo && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={() => setShowTransferInfo(false)} className="close-button">
              <X size={24} />
            </button>
            <h3>Datos para Transferencia</h3>
            <p>Por favor, transferí a:</p>
            <p><strong>ALIAS:</strong> MVP.BURGERS</p>
            <p><strong>CBU:</strong> 0000003100000000123456</p>
            <p>Y enviá el comprobante a:</p>
            <p><strong>+541123456789</strong></p>
            <div className="modal-buttons">
              <button className="primary-btn" onClick={() => {
                  setShowTransferInfo(false);
                  /*
                    alert(
                      `Pedido confirmado!\nMétodo de pago: ${paymentMethod}\nMétodo: ${method}\nDirección: ${
                        method === "Take Away"
                          ? "Sarmiento 251, Avellaneda"
                          : `${address}${floor ? ` - Piso ${floor}` : ""}${apartment ? ` - Depto ${apartment}` : ""}`
                      }\nTotal: $${finalTotal.toLocaleString()}`
                    );
                  */
                  }}
                >
                Entendido!
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderConfirmationPage;

