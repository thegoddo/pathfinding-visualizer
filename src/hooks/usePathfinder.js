import { create } from "zustand";

const usePathfinder = create((set) => ({
  visitedNodes: 0,
  distance: 0,
  isRunning: false,
  path: [],

  setStats: (nodes, dist) => set({ visitedNodes: nodes, distance: dist }),
  setPath: (newPath) => set({ path: newPath }),
  setIsRunning: (status) => set({ isRunning: status }),
  reset: () =>
    set({ visitedNodes: 0, distance: 0, path: [], isRunning: false }),
}));

export default usePathfinder;
