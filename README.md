# Geospatial Pathfinding Visualizer

A high-performance web application that visualizes graph traversal algorithms on real-world road networks.

## Demo

![Project Demo](./project.webm)

## Overview

This project is an interactive tool designed to demonstrate and compare pathfinding efficiency using real-world data from OpenStreetMap (Bhopal). By converting geographic coordinates into a mathematical adjacency list, it visualizes how algorithms "think" when navigating complex urban environments.

## Key Features

- Real-world graph logic: Data is parsed from GeoJSON to create a weighted directed or undirected graph based on road properties.
- Algorithm comparison:
  - A\* Search: Utilizes the Haversine formula as a heuristic for goal-oriented optimization.
  - Dijkstra's Algorithm: Guaranteed shortest path via uniform cost expansion.
- Dynamic travel modes:
  - Driving: High-speed search using primary, secondary, and tertiary networks.
  - Walking: Detailed search including residential streets and society lanes.
- Interactive UI:
  - Dark and light mode toggles.
  - Variable animation speeds (Slow, Normal, Fast) for presentation purposes.
  - Real-time exploration statistics.

## Technical Stack

- Frontend: React.js + Vite
- Mapping: Leaflet.js and React-Leaflet
- Geometry: Turf.js (spherical distance calculations)
- Icons: Lucide React
- Styling: CSS3 and standard mapping tiles (CartoDB / OSM)

## Core Implementation Details

The project utilizes HTML5 Canvas rendering via Leaflet's `preferCanvas` setting. This allows the application to render thousands of visited edges per second without blocking the UI thread, providing the fluid animation seen in the demo.

### The Heuristic

For the A\* implementation, the Haversine distance is used:

$$
d = 2r \arcsin\left(\sqrt{\sin^2\left(\frac{\phi_2 - \phi_1}{2}\right) + \cos(\phi_1) \cos(\phi_2) \sin^2\left(\frac{\lambda_2 - \lambda_1}{2}\right)}\right)
$$

This ensures the heuristic is admissible, meaning it never overestimates the distance to the goal, guaranteeing an optimal solution.

## Installation & Setup

Clone the repository:

```bash
git clone https://github.com/your-username/pathfinding-visualizer.git
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

## Contributors

- [**@thegoddo**](https://github.com/thegoddo)
- [**@vkhushi442016**](https://github.com/vkhushi442016)
- [**@jkhush04**](https://github.com/jkhush04)
- [**@pikachu184**](https://github.com/pikachu184)

Created as part of the MCA Major Project curriculum.
