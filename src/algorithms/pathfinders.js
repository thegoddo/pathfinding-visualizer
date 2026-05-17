import { runAStar } from "./AStar";
import { runDijkstra } from "./DijikstrasAlgo";
import { runTsinghuaSSSP } from "./tsinghua";

export const runPathfinder = (
  graph,
  startNodeId,
  endNodeId,
  algorithm = "A*",
) => {
  if (!graph || !graph[startNodeId] || !graph[endNodeId]) {
    return { path: [], visitedEdges: [], distance: 0 };
  }

  if (typeof algorithm === "boolean") {
    return algorithm
      ? runAStar(graph, startNodeId, endNodeId)
      : runDijkstra(graph, startNodeId, endNodeId);
  }

  switch (algorithm) {
    case "Dijikstra":
      return runDijkstra(graph, startNodeId, endNodeId);
    case "Near-Linear SSSP":
      return runTsinghuaSSSP(graph, startNodeId, endNodeId);
    case "A*":
    default:
      return runAStar(graph, startNodeId, endNodeId);
  }
};
