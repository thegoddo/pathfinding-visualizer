import { distance } from "turf";

export const buildGraph = (geoJson) => {
  const graph = {};

  geoJson.features.forEach((feature) => {
    const coordinates = feature.geometry.coordinates; // These are [lng, lat]
    const isOneWay = feature.properties.oneway === "yes";

    for (let i = 0; i < coordinates.length - 1; i++) {
      const start = coordinates[i].join(",");
      const end = coordinates[i + 1].join(",");

      // Turf distance expects [lng, lat]
      const d = distance(coordinates[i], coordinates[i + 1]);

      if (!graph[start])
        graph[start] = { coords: coordinates[i], neighbors: {} };
      if (!graph[end])
        graph[end] = { coords: coordinates[i + 1], neighbors: {} };

      graph[start].neighbors[end] = d;

      if (!isOneWay) {
        graph[end].neighbors[start] = d;
      }
    }
  });

  return graph;
};

export const findNearestNode = (clickCoords, graph) => {
  let minDistance = Infinity;
  let nearestNodeId = null;

  // clickCoords comes from Leaflet as [lat, lng]
  // We need to convert it to [lng, lat] for Turf
  const fromPoint = [clickCoords[1], clickCoords[0]];

  for (const nodeId in graph) {
    const nodeCoords = graph[nodeId].coords; // Already [lng, lat]
    const d = distance(fromPoint, nodeCoords);

    if (d < minDistance) {
      minDistance = d;
      nearestNodeId = nodeId;
    }
  }

  return nearestNodeId;
};
