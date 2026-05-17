import MinHeap from "../utils/MinHeap";

const toLatLng = (coords) => [coords[1], coords[0]];

const buildPath = (graph, cameFrom, endNodeId) => {
	const path = [];
	let current = endNodeId;

	while (current) {
		path.push(toLatLng(graph[current].coords));
		current = cameFrom[current];
	}

	return path.reverse();
};

/**
 * Single-source shortest paths for nonnegative weighted graphs.
 *
 * This is a practical SSSP implementation for the visualizer: it computes the
 * exact shortest path with a binary heap and records relaxed edges for animation.
 * @param {Object} graph - Adjacency list keyed by node id.
 * @param {string} startNodeId - Source node id.
 * @param {string} endNodeId - Target node id.
 * @returns {{ path: Array<[number, number]>, visitedEdges: Array<{from: [number, number], to: [number, number]}>, distance: number }}
 */
export const runTsinghuaSSSP = (graph, startNodeId, endNodeId) => {
	if (!graph || !graph[startNodeId] || !graph[endNodeId]) {
		return { path: [], visitedEdges: [], distance: 0 };
	}

	const pq = new MinHeap();
	const dist = {};
	const cameFrom = {};
	const visited = new Set();
	const visitedEdges = [];

	for (const nodeId in graph) {
		dist[nodeId] = Infinity;
		cameFrom[nodeId] = null;
	}

	dist[startNodeId] = 0;
	pq.push({ nodeId: startNodeId, priority: 0 });

	while (!pq.isEmpty()) {
		const current = pq.pop();

		if (!current) break;

		const currentId = current.nodeId;
		if (visited.has(currentId)) continue;

		visited.add(currentId);

		if (currentId === endNodeId) break;

		const neighbors = graph[currentId].neighbors;

		for (const neighborId in neighbors) {
			const weight = neighbors[neighborId];
			const tentativeDistance = dist[currentId] + weight;

			if (tentativeDistance < dist[neighborId]) {
				dist[neighborId] = tentativeDistance;
				cameFrom[neighborId] = currentId;

				pq.push({ nodeId: neighborId, priority: tentativeDistance });

				visitedEdges.push({
					from: toLatLng(graph[currentId].coords),
					to: toLatLng(graph[neighborId].coords),
				});
			}
		}
	}

	if (dist[endNodeId] === Infinity) {
		return { path: [], visitedEdges, distance: 0 };
	}

	return {
		path: buildPath(graph, cameFrom, endNodeId),
		visitedEdges,
		distance: dist[endNodeId],
	};
};
