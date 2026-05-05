import { useEffect, useState } from "react";
import "./App.css";
import MapDashboard from "./components/Map";
import { buildGraph } from "./utils/graphBuilder";
//import bhopalData from "./data/bhopalData.geojson";

// now fetch the data from ./data/bhopalData.geojson" and then stored it to a variable for future use
//cant use require as it shows not defined 

 //const bhopalData = fetch("./data/bhopalData.geojson")
  

  
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
    <div classnName="App">
      <MapDashboard graph={roadGraph} />
    </div>
  );
}

export default App;
