import MinHeap from "../utils/MinHeap";

const toLatLng = (coords) => [coords[1], coords[0]];

const buildReverseGraph = (graph) => {
  const reverseGraph = {};

  for (const nodeId in graph) {
    reverseGraph[nodeId] = {
      coords: graph[nodeId].coords,
      neighbors: {},
    };
  }

  for (const nodeId in graph) {
    for (const neighborId in graph[nodeId].neighbors) {
      if (!reverseGraph[neighborId]) {
        reverseGraph[neighborId] = {
          coords: graph[neighborId]?.coords ?? graph[nodeId].coords,
          neighbors: {},
        };
      }

      reverseGraph[neighborId].neighbors[nodeId] = graph[nodeId].neighbors[neighborId];
    }
  }

  return reverseGraph;
};

const buildPath = (
  graph,
  forwardPrev,
  backwardPrev,
  meetingNode,
  endNodeId,
) => {
  const pathToMeeting = [];
  let current = meetingNode;

  while (current) {
    pathToMeeting.push(toLatLng(graph[current].coords));
    current = forwardPrev[current];
  }

  pathToMeeting.reverse();

  const pathToEnd = [];
  current = meetingNode;

  while (current !== endNodeId) {
    current = backwardPrev[current];

    if (!current) {
      return [];
    }

    pathToEnd.push(toLatLng(graph[current].coords));
  }

  return pathToMeeting.concat(pathToEnd);
};

const updateBestMeeting = (
  nodeId,
  forwardDist,
  backwardDist,
  bestDistance,
  bestMeetingNode,
) => {
  if (forwardDist[nodeId] === Infinity || backwardDist[nodeId] === Infinity) {
    return { bestDistance, bestMeetingNode };
  }

  const totalDistance = forwardDist[nodeId] + backwardDist[nodeId];

  if (totalDistance < bestDistance) {
    return { bestDistance: totalDistance, bestMeetingNode: nodeId };
  }

  return { bestDistance, bestMeetingNode };
};

export const runBidirectionalSearch = (
  graph,
  startNodeId,
  endNodeId,
  options = {},
) => {
  const {
    forwardHeuristic = () => 0,
    backwardHeuristic = () => 0,
  } = options;

  if (!graph || !graph[startNodeId] || !graph[endNodeId]) {
    return { path: [], visitedEdges: [], distance: 0 };
  }

  if (startNodeId === endNodeId) {
    return {
      path: [toLatLng(graph[startNodeId].coords)],
      visitedEdges: [],
      distance: 0,
    };
  }

  const reverseGraph = buildReverseGraph(graph);
  const visitedEdges = [];

  const forwardHeap = new MinHeap();
  const backwardHeap = new MinHeap();

  const forwardDist = {};
  const backwardDist = {};
  const forwardPrev = {};
  const backwardPrev = {};
  const forwardSettled = new Set();
  const backwardSettled = new Set();

  for (const nodeId in graph) {
    forwardDist[nodeId] = Infinity;
    backwardDist[nodeId] = Infinity;
    forwardPrev[nodeId] = null;
    backwardPrev[nodeId] = null;
  }

  forwardDist[startNodeId] = 0;
  backwardDist[endNodeId] = 0;

  forwardHeap.push({
    nodeId: startNodeId,
    priority: forwardHeuristic(startNodeId, graph, endNodeId),
  });
  backwardHeap.push({
    nodeId: endNodeId,
    priority: backwardHeuristic(endNodeId, reverseGraph, startNodeId),
  });

  let bestDistance = Infinity;
  let bestMeetingNode = null;

  const getPriority = (heap) => (heap.isEmpty() ? Infinity : heap.heap[0].priority);

  const relaxNeighbors = (
    currentId,
    currentGraph,
    currentDist,
    currentPrev,
    heap,
    heuristicFn,
    heuristicTargetId,
  ) => {
    for (const neighborId in currentGraph[currentId].neighbors) {
      const weight = currentGraph[currentId].neighbors[neighborId];
      const tentativeDistance = currentDist[currentId] + weight;

      if (tentativeDistance < currentDist[neighborId]) {
        currentDist[neighborId] = tentativeDistance;
        currentPrev[neighborId] = currentId;

        heap.push({
          nodeId: neighborId,
          priority: tentativeDistance + heuristicFn(neighborId, currentGraph, heuristicTargetId),
        });

        visitedEdges.push({
          from: toLatLng(currentGraph[currentId].coords),
          to: toLatLng(currentGraph[neighborId].coords),
        });

        const best = updateBestMeeting(
          neighborId,
          forwardDist,
          backwardDist,
          bestDistance,
          bestMeetingNode,
        );

        bestDistance = best.bestDistance;
        bestMeetingNode = best.bestMeetingNode;
      }
    }
  };

  while (!forwardHeap.isEmpty() && !backwardHeap.isEmpty()) {
    if (getPriority(forwardHeap) + getPriority(backwardHeap) >= bestDistance) {
      break;
    }

    const expandForward = getPriority(forwardHeap) <= getPriority(backwardHeap);

    if (expandForward) {
      const current = forwardHeap.pop();
      if (!current) break;

      const currentId = current.nodeId;
      if (forwardSettled.has(currentId)) continue;

      forwardSettled.add(currentId);

      const best = updateBestMeeting(
        currentId,
        forwardDist,
        backwardDist,
        bestDistance,
        bestMeetingNode,
      );

      bestDistance = best.bestDistance;
      bestMeetingNode = best.bestMeetingNode;

      relaxNeighbors(
        currentId,
        graph,
        forwardDist,
        forwardPrev,
        forwardHeap,
        forwardHeuristic,
        endNodeId,
      );
    } else {
      const current = backwardHeap.pop();
      if (!current) break;

      const currentId = current.nodeId;
      if (backwardSettled.has(currentId)) continue;

      backwardSettled.add(currentId);

      const best = updateBestMeeting(
        currentId,
        forwardDist,
        backwardDist,
        bestDistance,
        bestMeetingNode,
      );

      bestDistance = best.bestDistance;
      bestMeetingNode = best.bestMeetingNode;

      relaxNeighbors(
        currentId,
        reverseGraph,
        backwardDist,
        backwardPrev,
        backwardHeap,
        backwardHeuristic,
        startNodeId,
      );
    }
  }

  if (bestMeetingNode === null || bestDistance === Infinity) {
    return { path: [], visitedEdges, distance: 0 };
  }

  return {
    path: buildPath(
      graph,
      forwardPrev,
      backwardPrev,
      bestMeetingNode,
      endNodeId,
    ),
    visitedEdges,
    distance: bestDistance,
  };
};