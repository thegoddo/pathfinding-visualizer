import { runBidirectionalSearch } from "./bidirectionalSearch";

export const runTsinghuaSSSP = (graph, startNodeId, endNodeId) =>
  runBidirectionalSearch(graph, startNodeId, endNodeId, {
    forwardHeuristic: () => 0,
    backwardHeuristic: () => 0,
  });
