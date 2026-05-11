/* import MinHeap from "../utils/MinHeap";
import { haversineDistance } from "../utils/heuristics";



export const runPathfinder = (
  graph,
  startNodeId,
  endNodeId,
  useHeuristic = true
) => {
  if (!graph[startNodeId] || !graph[endNodeId]) {
    return {
      path: [],
      visitedEdges: [],
      distance: 0,
      visitedNodes: 0,
    };
  }

  const pq = new MinHeap();

  const gScore = {};  // Cost from start to node, it stores the lowest known cost to reach each node from the start node. Initially, all nodes have a gScore of Infinity except for the start node, which has a gScore of 0
  const cameFrom = {};   // For path reconstruction, it stores the previous node in the optimal path to reach the current node
  const visited = new Set();

  const visitedEdges = [];   // To animate the visited edges, it stores the edges that have been explored during the algorithm's execution. Each edge is represented by its start and end coordinates, which can be used to visualize the search process on a map.

  let visitedNodes = 0;   // To track the number of visited nodes, it counts how many unique nodes have been visited during the algorithm's execution. This can be useful for performance analysis and understanding the efficiency of the pathfinding process.

  for (const nodeId in graph) {
    gScore[nodeId] = Infinity;
    cameFrom[nodeId] = null;
  }

  gScore[startNodeId] = 0;

  pq.push({
    nodeId: startNodeId,
    priority: 0,
  });

  while (!pq.isEmpty()) {
    const current = pq.pop();

    const currentId = current.nodeId;

    if (visited.has(currentId)) continue;

    visited.add(currentId);
    visitedNodes++;

    if (currentId === endNodeId) {
      break;
    }

    const neighbors = graph[currentId].neighbors; // this neighbors object contains the adjacent nodes and the weights of the edges connecting them. The keys of this object are the IDs of the neighboring nodes, and the values are the weights (or costs) associated with traveling from the current node to each neighbor. This information is crucial for the pathfinding algorithm to calculate the tentative gScore for each neighbor and determine the optimal path to the destination node.

    for (const neighborId in neighbors) {
      const edgeWeight = neighbors[neighborId];

      const tentativeGScore =
        gScore[currentId] + edgeWeight;

      if (tentativeGScore < gScore[neighborId]) {
        cameFrom[neighborId] = currentId;

        gScore[neighborId] = tentativeGScore;

        const heuristic = useHeuristic
          ? haversineDistance(
              graph[neighborId].coords,
              graph[endNodeId].coords
            )
          : 0;

        const fScore = tentativeGScore + heuristic;

        pq.push({
          nodeId: neighborId,
          priority: fScore,
        });

        visitedEdges.push({
          from: [
            graph[currentId].coords[1],
            graph[currentId].coords[0],
          ],
          to: [
            graph[neighborId].coords[1],
            graph[neighborId].coords[0],
          ],
        });
      }
    }
  }

  // no path
  if (gScore[endNodeId] === Infinity) {
    return {
      path: [],
      visitedEdges,
      distance: 0,
      visitedNodes,
    };
  }

  // reconstruct path
  const path = [];

  let temp = endNodeId;

  while (temp) {
    const coords = graph[temp].coords;

    path.push([
      coords[1],
      coords[0],
    ]);

    temp = cameFrom[temp];
  }

  path.reverse();

  return {
    path,
    visitedEdges,
    distance: gScore[endNodeId],
    visitedNodes,
  };
};

 */



import { runAStar } from "./AStar";
import { runDijkstra } from "./Dijkstra";

/**
 * Pathfinding Dispatcher
 */

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