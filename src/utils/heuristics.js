import { distance } from "turf";

/**
 * Calculate the straight line b/w two points
 * Can be used as an heuristics h(n) in A* algo
 * @param {Array} coords1 - [longitude, latitude]
 * @param {Array} coords2 - [longitude, latitude]
 * @returns {number} distance in km
 */
export const haversineDistance = (coords1, coords2) => {
  return distance(coords1, coords2);
};
