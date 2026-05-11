import { distance } from "turf";


export const haversineDistance = (coords1, coords2) => {
  return distance(coords1, coords2);
};
