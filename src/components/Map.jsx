import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
  // Bhopal, Madhya Pradesh Coordinates
  const position = [23.2599, 77.4126];

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 
         TODO: Your Algorithms will render components here.
         Example: <Polyline positions={path} color="blue" /> 
      */}
    </MapContainer>
  );
};

export default Map;
