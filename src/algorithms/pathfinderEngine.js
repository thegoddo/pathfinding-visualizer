
import { runAStar } from "./AStar";
import { runDijkstra } from "./Dijkstra";


export const runPathfinder = (
  graph,
  startNodeId,
  endNodeId,
  useHeuristic = true
) => {
  if (
    !graph ||
    !graph[startNodeId] ||
    !graph[endNodeId]
  ) {
    return {
      path: [],
      visitedEdges: [],
      distance: 0,
    };
  }

  return useHeuristic
    ? runAStar(
      graph,
      startNodeId,
      endNodeId
    )
    : runDijkstra(
      graph,
      startNodeId,
      endNodeId
    );
};