import MinHeap from "../utils/MinHeap";
import { runBidirectionalSearch } from "./bidirectionalSearch";

export const runDijkstra = (graph, src, des) => {
  return runBidirectionalSearch(graph, src, des, {
    forwardHeuristic: () => 0,
    backwardHeuristic: () => 0,
  });
}