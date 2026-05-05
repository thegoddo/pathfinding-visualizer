import usePathfinder from "../hooks/usePathfinder";

// Map overlay for dark background like the reel.
const StatsOverlay = () => {
  const { visitedNodes, distance } = usePathfinder();

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "15px 30px",
        borderRadius: "8px",
        textAlign: "center",
        width: "300px",
      }}
    >
      <div
        style={{ fontSize: "12px", color: "#888", textTransform: "uppercase" }}
      >
        Visited Nodes
      </div>
      <div style={{ fontSize: "24px", fontWeight: "bold", color: "#4facfe" }}>
        {visitedNodes}
      </div>
      <hr style={{ border: "0.5px solid #333", margin: "10px 0" }} />
      <div
        style={{ fontSize: "12px", color: "#888", textTransform: "uppercase" }}
      >
        Distance
      </div>
      <div style={{ fontSize: "24px", fontWeight: "bold", color: "#00f2fe" }}>
        {distance > 0 ? `${distance.toFixed(2)} km` : "--"}
      </div>
    </div>
  );
};

export default StatsOverlay;
