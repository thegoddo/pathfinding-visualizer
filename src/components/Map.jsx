import {
  MapContainer,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// handles map clicks
function ClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

const MapDashboard = ({ graph }) => {
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

export default MapDashboard;
