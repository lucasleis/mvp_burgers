// DeliveryMap.jsx
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Corrige el problema de los íconos que no se cargan correctamente en React
import "leaflet/dist/leaflet.css";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

const LocationMarker = ({ setPosition }) => {
  const [markerPosition, setMarkerPosition] = useState(null);

  useMapEvents({
    click(e) {
      setMarkerPosition(e.latlng);
      setPosition(e.latlng);
    }
  });

  return markerPosition === null ? null : <Marker position={markerPosition} />;
};

const DeliveryMap = ({ setDeliveryLocation }) => {
  return (
    <div style={{ height: "400px", marginTop: "1rem", borderRadius: "8px", overflow: "hidden" }}>
      <MapContainer center={[-34.6625, -58.3658]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker setPosition={setDeliveryLocation} />
      </MapContainer>
    </div>
  );
};

export default DeliveryMap;
