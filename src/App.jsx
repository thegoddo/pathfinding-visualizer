import { useEffect, useState } from "react";
import MapDashboard from "./components/Map";
import { buildGraph } from "./utils/graphBuilder";

function App() {
  const [rawData, setRawData] = useState(null);
  const [roadGraph, setRoadGraph] = useState(null);
  const [mode, setMode] = useState("driving"); // "driving" or "walking"

  const generateGraph = (data, currentMode) => {
    const filteredFeatures = data.features.filter((f) => {
      const type = f.properties.highway;
      if (currentMode === "driving") {
        return ["primary", "secondary", "tertiary"].includes(type);
      }
      // Walking includes everything
      return true;
    });

    const graph = buildGraph({ ...data, features: filteredFeatures });
    setRoadGraph(graph);
  };

  useEffect(() => {
    fetch("/data/bhopalData.geojson")
      .then((res) => res.json())
      .then((data) => {
        setRawData(data);
        generateGraph(data, "driving");
      });
  }, []);

  const toggleMode = () => {
    const newMode = mode === "driving" ? "walking" : "driving";
    setMode(newMode);
    if (rawData) generateGraph(rawData, newMode);
  };

  return (
    <div className="App">
      <MapDashboard graph={roadGraph} mode={mode} onToggleMode={toggleMode} />
    </div>
  );
}

export default App;
