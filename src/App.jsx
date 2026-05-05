import { useEffect, useState } from "react";
import "./App.css";
import MapDashboard from "./components/Map";
import { buildGraph } from "./utils/graphBuilder";

function App() {
  const [roadGraph, setRoadGraph] = useState(null);

  useEffect(() => {
    console.log("Starting fetch for Bhopal road network...");

    fetch("/data/bhopalData.geojson")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const graph = buildGraph(data);
        setRoadGraph(graph);
      })
      .catch((err) => {
        console.error("Failed to load map data: ", err);
      });
  }, []);

  return (
    <div className="App">
      <MapDashboard graph={roadGraph} />
    </div>
  );
}

export default App;
