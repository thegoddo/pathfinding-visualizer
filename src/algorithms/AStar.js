import MinHeap from "../utils/MinHeap";
import { haversineDistance } from "../utils/heuristics";
import { runBidirectionalSearch } from "./bidirectionalSearch";

export const runAStar = (
  graph,
  startNodeId,
  endNodeId
) => {
  return runBidirectionalSearch(graph, startNodeId, endNodeId, {
    forwardHeuristic: (nodeId, currentGraph, targetNodeId) =>
      haversineDistance(currentGraph[nodeId].coords, currentGraph[targetNodeId].coords),
    backwardHeuristic: (nodeId, currentGraph, targetNodeId) =>
      haversineDistance(currentGraph[nodeId].coords, currentGraph[targetNodeId].coords),
  });
};