import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { findNearestNode } from "../utils/graphBuilder";

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
  const [points, setPoints] = useState([]); // Stores the actual Graph Node IDs

  const handleMapClick = (clickCoords) => {
    if (!graph) return; // Wait until graph is built

    // Use the graph to find the actual road intersection nearest to the click
    const nearestNodeId = findNearestNode(clickCoords, graph);

    if (points.length < 2) {
      setPoints([...points, nearestNodeId]);
    } else {
      setPoints([nearestNodeId]);
    }
  };

  return (
    <MapContainer
      center={[23.2599, 77.4126]}
      zoom={13}
      style={{ height: "100vh" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ClickHandler onMapClick={handleMapClick} />

      {/* Visualize selected Start and End nodes */}
      {points.map((nodeId) => (
        <Marker
          key={nodeId}
          position={[graph[nodeId].coords[1], graph[nodeId].coords[0]]}
        />
      ))}

      {/* 
         NEXT STEP: 
         If points.length === 2, call AStar(graph, points[0], points[1])
      */}
    </MapContainer>
  );
};
export default MapDashboard;
