import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState } from "react";

export default function MapExample() {
  const [position, setPosition] = useState<[number, number]>([43.6532, -79.3832]); // Default Toronto

  return (
    <MapContainer center={position} zoom={13} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      <Marker position={position}>
        <Popup>Selected location</Popup>
      </Marker>
    </MapContainer>
  );
}
