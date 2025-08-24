// src/components/AddressSearchMap.tsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import Button from "../Button";

export default function AddressSearchMap() {
  const [position, setPosition] = useState<[number, number]>([43.6532, -79.3832]); // default Toronto
  const [address, setAddress] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    const res = await fetch(url, {
      headers: { "User-Agent": "CarpoolApp/1.0 (pupilpickup@gmail.com)" }, // required by Nominatim
    });
    const data = await res.json();

    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      setPosition([lat, lon]);
    } else {
      alert("Address not found!");
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Enter an address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: "300px", marginRight: "8px", color: "black" }}
        />
        <Button label="Search" variant="primary" type="submit" />
      </form>

      <MapContainer
        center={position}
        zoom={14}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>Result: {address}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
