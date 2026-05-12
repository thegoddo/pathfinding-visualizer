import MinHeap from "../utils/MinHeap";

export const runDijkstra = (graph, src, des) => {
  let pq = new MinHeap();


  let visited = new Set();
  let dist = {};
  let prev = {}; // for path reconstruction


  let visitedEdges = []; // for animation

  // initialize distances
  for (let node in graph) {
    dist[node] = Infinity;
    prev[node] = null;
  }
  dist[src] = 0;

  pq.push({ nodeId: src, priority: 0 });

  while (!pq.isEmpty()) {

    let curr = pq.pop();

    if (visited.has(curr.nodeId)) continue;
    visited.add(curr.nodeId);

    // 🔥 early stop
    if (curr.nodeId === des) break;

    let neighbors = graph[curr.nodeId].neighbors;

    for (let neighbor in neighbors) {
      let weight = neighbors[neighbor];

      if (dist[curr.nodeId] + weight < dist[neighbor]) {
        dist[neighbor] = dist[curr.nodeId] + weight;
        prev[neighbor] = curr.nodeId;

        pq.push({ nodeId: neighbor, priority: dist[neighbor] });



        visitedEdges.push({
          from: [
            graph[curr.nodeId].coords[1],
            graph[curr.nodeId].coords[0],
          ],
          to: [
            graph[neighbor].coords[1],
            graph[neighbor].coords[0]
          ]
        });
      }
    }
  }
  if (dist[des] === Infinity) {
    return {
      path: [],
      visitedEdges,
      distance: 0,
    };
  }
  // reconstruct path

  const path = [];

  let temp = des;

  while (temp) {
    const coords = graph[temp].coords;

    path.push([coords[1], coords[0]]);
    temp = prev[temp];


  }

  return {
    path: path.reverse(),
    visitedEdges,
    distance: dist[des],

  }
}