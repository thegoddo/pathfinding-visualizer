import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Polyline,
  CircleMarker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { findNearestNode } from "../utils/graphBuilder";
import { runPathfinder } from "../algorithms/pathfinders";
import { Sun, Moon, Gauge, Footprints, Car, ChevronDown } from "lucide-react";

function ClickHandler({ onMapClick }) {
  useMapEvents({ click: (e) => onMapClick([e.latlng.lat, e.latlng.lng]) });
  return null;
}

const TRAVEL_SPEED_KMH = {
  driving: 35,
  walking: 5,
};

const formatTravelTime = (minutes) => {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return "--";
  }

  if (minutes < 60) {
    return `${minutes.toFixed(1)} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
};

const MapDashboard = ({ graph, mode, onToggleMode }) => {
  const [points, setPoints] = useState([]);
  const [animatingEdges, setAnimatingEdges] = useState([]);
  const [finalPath, setFinalPath] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [speed, setSpeed] = useState("Normal");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("A*");
  const [isAlgorithmMenuOpen, setIsAlgorithmMenuOpen] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTravelTime, setEstimatedTravelTime] = useState(0);

  const animationIntervalRef = useRef(null);
  const algorithmOptions = ["A*", "Dijikstra", "Near-Linear SSSP"];

  const theme = {
    dark: {
      tiles: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      visited: "#38ef7d",
      path: "#f9d976",
      bg: "#111",
    },
    light: {
      tiles: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      visited: "#2575fc",
      path: "#d32f2f",
      bg: "#fff",
    },
  };
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  // Clear map if mode changes
  useEffect(() => {
    clearInterval(animationIntervalRef.current);
    setAnimatingEdges([]);
    setFinalPath([]);
    setPoints([]);
  }, [mode]);

  const startPathfinding = (startId, endId) => {
    setFinalPath([]);
    setElapsedTime(0);
    setEstimatedTravelTime(0);

    const startedAt = performance.now();
    const { path, visitedEdges, distance } = runPathfinder(
      graph,
      startId,
      endId,
      selectedAlgorithm,
    );
    const endedAt = performance.now();

    if (visitedEdges.length === 0) return;

    if (path.length > 0) {
      setElapsedTime(endedAt - startedAt);
      const speedKmh = TRAVEL_SPEED_KMH[mode] ?? TRAVEL_SPEED_KMH.driving;
      setEstimatedTravelTime((distance / speedKmh) * 60);
    }

    let index = 0;
    const config = {
      Slow: { batch: 2, interval: 40 },
      Normal: { batch: 35, interval: 20 },
      Fast: { batch: 200, interval: 10 },
    }[speed]; 
    const tempEdges = [];

    /**
     * 
     */
    animationIntervalRef.current = setInterval(() => {
      if (index >= visitedEdges.length) {
        clearInterval(animationIntervalRef.current);
        setFinalPath(path);
        return;
      }
      
      /**
       * Batching multiple edges together to reduce number of re-renders an improve performance,
       *  especially for large graphs with thousands of edges. 
       * Each batch will add a chunk of visited edges to the map at once, creating a smoother animation effect without overwhelming the browser.
       * Each batch is added on setInterval based on the configure speed.
       */
      for (let i = 0; i < config.batch && index < visitedEdges.length; i++) {
        tempEdges.push(visitedEdges[index]);
        index++;
      }
      setAnimatingEdges([...tempEdges]);
    }, config.interval);
  };

  useEffect(() => {
    if (points.length === 2 && graph) startPathfinding(points[0], points[1]);
  }, [points, graph]);

  const handleMapClick = (coords) => {
    if (!graph) return;
    const nodeId = findNearestNode(coords, graph);
    if (points.length < 2) {
      setPoints([...points, nodeId]);
    } else {
      clearInterval(animationIntervalRef.current);
      setAnimatingEdges([]);
      setFinalPath([]);
      setElapsedTime(0);
      setPoints([nodeId]);
    }
  };

  const handleAlgorithmSelect = (algorithm) => {
    setSelectedAlgorithm(algorithm);
    setIsAlgorithmMenuOpen(false);
    clearInterval(animationIntervalRef.current);
    setAnimatingEdges([]);
    setFinalPath([]);
    setElapsedTime(0);
    setPoints([]);
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HUD Control Panel */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          background: isDarkMode ? "#1a1a1a" : "#fff",
          color: isDarkMode ? "#fff" : "#000",
          padding: "12px 25px",
          borderRadius: "40px",
          display: "flex",
          gap: "15px",
          alignItems: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          border: isDarkMode ? "1px solid #333" : "1px solid #ddd",
        }}
      >
        {/* Mode Toggle Button */}
        <button
          onClick={onToggleMode}
          style={{
            background: isDarkMode ? "#333" : "#eee",
            border: "none",
            cursor: "pointer",
            color: "inherit",
            padding: "8px 15px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {mode === "driving" ? <Car size={18} /> : <Footprints size={18} />}
          <span style={{ fontSize: "11px", fontWeight: "bold" }}>
            {mode.toUpperCase()}
          </span>
        </button>

        <div style={{ width: "1px", height: "30px", background: "#444" }}></div>

        <div>
          <span style={{ fontSize: "9px", color: "#888", display: "block" }}>
            EXPLORED
          </span>
          <span style={{ fontSize: "18px", fontWeight: "bold" }}>
            {animatingEdges.length}
          </span>
        </div>

        <div style={{ width: "1px", height: "30px", background: "#444" }}></div>

        {finalPath.length > 0 && elapsedTime > 0 && (
          <>
            <div>
              <span style={{ fontSize: "9px", color: "#888", display: "block" }}>
                TIME
              </span>
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                {elapsedTime.toFixed(2)} ms
              </span>
            </div>

            <div style={{ width: "1px", height: "30px", background: "#444" }}></div>
          </>
        )}

        {finalPath.length > 0 && estimatedTravelTime > 0 && (
          <>
            <div>
              <span style={{ fontSize: "9px", color: "#888", display: "block" }}>
                ETA
              </span>
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                {formatTravelTime(estimatedTravelTime)}
              </span>
            </div>

            <div style={{ width: "1px", height: "30px", background: "#444" }}></div>
          </>
        )}

        <button
          onClick={() =>
            setSpeed((s) =>
              s === "Normal" ? "Slow" : s === "Slow" ? "Fast" : "Normal",
            )
          }
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "inherit",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Gauge
            size={18}
            color={
              speed === "Slow"
                ? "#ff9800"
                : speed === "Fast"
                  ? "#f44336"
                  : "#4caf50"
            }
          />
          <span style={{ fontSize: "9px" }}>{speed}</span>
        </button>

        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: isDarkMode ? "#f9d976" : "#2575fc",
          }}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <MapContainer
          center={[23.2599, 77.4126]}
          zoom={14}
          style={{ height: "100%", width: "100%", background: currentTheme.bg }}
          preferCanvas={true}
        >
          <TileLayer
            key={isDarkMode ? "d" : "l"}
            url={currentTheme.tiles}
            attribution="&copy; OSM"
          />
          <ClickHandler onMapClick={handleMapClick} />

          {points[0] && (
            <CircleMarker
              center={[graph[points[0]].coords[1], graph[points[0]].coords[0]]}
              pathOptions={{
                color: "#00f2fe",
                fillColor: "#00f2fe",
                fillOpacity: 1,
              }}
              radius={7}
            />
          )}
          {points[1] && (
            <CircleMarker
              center={[graph[points[1]].coords[1], graph[points[1]].coords[0]]}
              pathOptions={{
                color: "#ff4b5c",
                fillColor: "#ff4b5c",
                fillOpacity: 1,
              }}
              radius={7}
            />
          )}

          {animatingEdges.map((edge, idx) => (
            <Polyline
              key={idx}
              positions={[edge.from, edge.to]}
              pathOptions={{
                color: currentTheme.visited,
                weight: mode === "walking" ? 1.5 : 2.5,
                opacity: 0.6,
              }}
            />
          ))}

          {finalPath.length > 0 && (
            <Polyline
              positions={finalPath}
              pathOptions={{ color: currentTheme.path, weight: 5, opacity: 1 }}
            />
          )}
        </MapContainer>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1000,
          padding: "14px 20px 20px",
          display: "flex",
          justifyContent: "center",
          background: isDarkMode ? "#111" : "#f7f7f7",
          borderTop: isDarkMode ? "1px solid #2a2a2a" : "1px solid #e7e7e7",
        }}
      >
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setIsAlgorithmMenuOpen((open) => !open)}
            style={{
              background: isDarkMode ? "#1f1f1f" : "#fff",
              border: isDarkMode ? "1px solid #343434" : "1px solid #d8d8d8",
              color: isDarkMode ? "#fff" : "#111",
              padding: "10px 16px",
              borderRadius: "999px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              fontWeight: 600,
            }}
          >
            <span>Pathfinding</span>
            <span style={{ color: isDarkMode ? "#9ca3af" : "#555" }}>
              {selectedAlgorithm}
            </span>
            <ChevronDown size={16} />
          </button>

          {isAlgorithmMenuOpen && (
            <div
              style={{
                position: "absolute",
                left: 0,
                bottom: "calc(100% + 10px)",
                minWidth: "220px",
                background: isDarkMode ? "#1b1b1b" : "#fff",
                border: isDarkMode ? "1px solid #343434" : "1px solid #d8d8d8",
                borderRadius: "18px",
                padding: "8px",
                boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
              }}
            >
              {algorithmOptions.map((option) => {
                const isSelected = option === selectedAlgorithm;

                return (
                  <button
                    key={option}
                    onClick={() => handleAlgorithmSelect(option)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      border: "none",
                      background: isSelected
                        ? isDarkMode
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(37,117,252,0.08)"
                        : "transparent",
                      color: isDarkMode ? "#fff" : "#111",
                      cursor: "pointer",
                      fontWeight: isSelected ? 700 : 500,
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapDashboard;
