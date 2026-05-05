import { distance } from "turf";

export const buildGraph = (geoJson) => {
  const graph = {};

  geoJson.features.forEach((feature) => {
    const coordinates = feature.geometry.coordinates;
    const isOneWay = feature.properties.oneway === "yes";

    for (let i = 0; i < coordinates.length - 1; i++) {
      console.log(`${coordinates[i]}, ${coordinates[i + 1]}`);

      const start = coordinates[i].join(",");
      const end = coordinates[i + 1].join(",");

      // Calculate physical distance in km
      const d = distance(coordinates[i], coordinates[i + 1]);

      // Initialize node entries if they don't exist
      if (!graph[start])
        graph[start] = { coords: coordinates[i], neighbors: {} };
      if (!graph[end])
        graph[end] = { coords: coordinates[i + 1], neighbors: {} };

      // Add edge: start -> end
      graph[start].neighbors[end] = d;

      // If not one-way, add back-edge: end -> start
      if (!isOneWay) {
        graph[end].neighbors[start] = d;
      }
    }
  });
    
  return graph;
};
