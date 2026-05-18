import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

const ZoomDebounce = ({ onFinishedZoom }) => {
  const map = useMap();
  const timer = useRef(null);

  useEffect(() => {
    const handler = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        onFinishedZoom?.(map.getZoom());
      }, 250);
    };

    map.on("zoom", handler);
    return () => {
      clearTimeout(timer.current);
      map.off("zoom", handler);
    };
  }, [map, onFinishedZoom]);

  return null;
};

export default ZoomDebounce;