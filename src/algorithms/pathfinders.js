import { haversineDistance } from "../utils/heuristics";

/**
 * A* and Dijkstra Pathfinding Engine
 * @param {Object} graph - The adjacency list
 * @param {string} startNodeId - Key of the start node (e.g. "77.412,23.259")
 * @param {string} endNodeId - Key of the end node
 * @param {boolean} useHeuristic - True for A*, False for Dijkstra
 * @returns {Object} { path, visitedOrder }
 */

export const runPathfinder = (
  graph,
  startNodeId,
  endNodeId,
  useHeuristic = true,
) => {
  if (!graph || !graph[startNodeId] || !graph[endNodeId])
    return { path: [], visitedEdges: [] };

  const openSet = new Set([startNodeId]);
  const visitedEdges = []; // Will store { from: [lat, lng], to: [lat, lng] }

  const gScore = {};
  const fScore = {};
  const cameFrom = {};

  for (const nodeId in graph) {
    gScore[nodeId] = Infinity;
    fScore[nodeId] = Infinity;
  }

  gScore[startNodeId] = 0;
  fScore[startNodeId] = useHeuristic
    ? haversineDistance(graph[startNodeId].coords, graph[endNodeId].coords)
    : 0;

  while (openSet.size > 0) {
    let currentId = null;
    let lowestScore = Infinity;
    for (const nodeId of openSet) {
      if (fScore[nodeId] < lowestScore) {
        lowestScore = fScore[nodeId];
        currentId = nodeId;
      }
    }

    if (currentId === endNodeId) {
      const path = [];
      let temp = currentId;
      while (temp) {
        const coords = graph[temp].coords;
        path.push([coords[1], coords[0]]); // [lat, lng] for Leaflet
        temp = cameFrom[temp];
      }
      return { path: path.reverse(), visitedEdges };
    }

    openSet.delete(currentId);

    const neighbors = graph[currentId].neighbors;
    for (const neighborId in neighbors) {
      const tentativeGScore = gScore[currentId] + neighbors[neighborId];

      if (tentativeGScore < gScore[neighborId]) {
        // Record the edge for visualization
        visitedEdges.push({
          from: [graph[currentId].coords[1], graph[currentId].coords[0]],
          to: [graph[neighborId].coords[1], graph[neighborId].coords[0]],
        });

        cameFrom[neighborId] = currentId;
        gScore[neighborId] = tentativeGScore;
        const hScore = useHeuristic
          ? haversineDistance(graph[neighborId].coords, graph[endNodeId].coords)
          : 0;
        fScore[neighborId] = tentativeGScore + hScore;

        if (!openSet.has(neighborId)) openSet.add(neighborId);
      }
    }
  }
  return { path: [], visitedEdges };
};
