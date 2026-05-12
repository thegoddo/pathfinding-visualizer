import MinHeap from "../utils/MinHeap";
import { haversineDistance } from "../utils/heuristics";

export const runAStar = (
  graph,
  startNodeId,
  endNodeId
) => {
  const pq = new MinHeap();

  const gScore = {};
  const cameFrom = {};
  const visited = new Set();

  const visitedEdges = [];

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

    if (currentId === endNodeId) break;

    const neighbors = graph[currentId].neighbors;

    for (const neighborId in neighbors) {
      const weight = neighbors[neighborId];

      const tentativeGScore =
        gScore[currentId] + weight;

      if (tentativeGScore < gScore[neighborId]) {
        gScore[neighborId] =
          tentativeGScore;

        cameFrom[neighborId] = currentId;

        const heuristic =
          haversineDistance(
            graph[neighborId].coords,
            graph[endNodeId].coords
          );

        const fScore =
          tentativeGScore + heuristic;

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

  if (gScore[endNodeId] === Infinity) {
    return {
      path: [],
      visitedEdges,
      distance: 0,
    };
  }

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

  return {
    path: path.reverse(),
    visitedEdges,
    distance: gScore[endNodeId],
  };
};