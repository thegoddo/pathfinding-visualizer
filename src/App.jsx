import { useEffect, useState } from "react";
import "./App.css";
import MapDashboard from "./components/Map";
import { buildGraph } from "./utils/graphBuilder";
 
function App() {
  const [roadGraph, setRoadGraph] = useState(null);

  useEffect(() => {

    const loadData = async () => {
      try {
        console.log("Fetching GeoJSON data...");
        // Ensure this file is in your 'public/data' folder if using Vite/CRA
        const response = await fetch("./data/bhopalData.geojson");
        const data = await response.json();

    console.log(`Building road network graph...`);
    const graph = buildGraph(data);
    setRoadGraph(graph);
    console.log(`Graph built with ${Object.keys(graph).length} nodes.`);
  }catch (error) {
        console.error("Failed to load or parse GeoJSON:", error);
      }
    };
    loadData();
  },
 []);


  return (
    <div className="App">

        {roadGraph ? (
        <MapDashboard graph={roadGraph} />
      ) : (
        <p>Loading road network data...</p>
      )}
    </div>
  );
}

export default App;
