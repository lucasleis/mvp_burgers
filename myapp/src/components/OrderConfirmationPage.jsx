import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./OrderConfirmationPage.css";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const { method: initialMethod } = location.state || {};
  const [method, setMethod] = useState(initialMethod || "Take Away");
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("");
  const [floor, setFloor] = useState("");
  const [apartment, setApartment] = useState("");

  const handleConfirm = () => {
    alert(
      `Pedido confirmado!\nMétodo: ${method}\nDirección: ${address} ${
        floor ? ` - Piso ${floor}` : ""
      } ${apartment ? ` - Depto ${apartment}` : ""}`
    );
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      }
    });

    return position ? <Marker position={position} /> : null;
  };

  return (
    <div className="confirmation-container">
      <h2>Confirmación de Pedido</h2>

      <p className="method">Método de envío:</p>
      <div className="method-toggle">
        <div
          className={`method-option ${method === "Take Away" ? "active" : ""}`}
          onClick={() => setMethod("Take Away")}
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
          <label>Dirección:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ej: Av. Mitre 123"
          />

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

          <p>Hacé clic en el mapa para seleccionar tu ubicación:</p>
          <div className="map-wrapper">
            <MapContainer center={[-34.63, -58.37]} zoom={13}>
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker />
            </MapContainer>
          </div>
        </div>
      )}

      { /*
      <div className="order-footer">
        <div className="price-display">
          Total: <span className="price-amount">$3500</span>
        </div>
        <button className="confirm-button">Confirmar Compra</button>
      </div>
      */ }

    </div>
  );
};

export default OrderConfirmationPage;
