import { useEffect, useState } from "react";
import "./App.css";
import MapDashboard from "./components/Map";
import { buildGraph } from "./utils/graphBuilder";
import bhopalData from "./data/bhopalData.geojson";

function App() {
  const [roadGraph, setRoadGraph] = useState(null);

  useEffect(() => {
    console.log(`Building road network graph...`);
    const graph = buildGraph(bhopalData);
    setRoadGraph(graph);
    console.log(`Graph built with ${Object.keys(graph).length} nodes.`);
  }, []);
  return (
    <div classnName="App">
      <MapDashboard graph={roadGraph} />
    </div>
  );
}

export default App;
