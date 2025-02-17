import { useEffect } from "react";
import { useCategory } from "../../context-reducer/context";

export const ViewPortRadius = ({ map }: { map: mapboxgl.Map }) => {
  const { state, dispatch } = useCategory();

  const getRadiusFromViewport = (map: mapboxgl.Map): number => {
    const bounds: mapboxgl.LngLatBounds | null = map.getBounds();
    const center: mapboxgl.LngLat = map.getCenter();

    if (!bounds) return state.radius;

    const latDiff: number = Math.abs(bounds.getNorthEast().lat - center.lat);

    const radiusKm: number = latDiff * 111;
    const radiusM: number = radiusKm * 1000;
    return radiusM;
  };

  useEffect(() => {
    if (!map) return;

    const updateRadius = (): void => {
      const newRadius: number = getRadiusFromViewport(map);
      dispatch({ type: "SET_RADIUS", payload: newRadius });
      console.log("Yangi radius:", newRadius);
    };

    map.on("moveend", updateRadius);
    map.on("zoomend", updateRadius);

    return () => {
      map.off("moveend", updateRadius);
      map.off("zoomend", updateRadius);
    };
  }, [map, dispatch]);

  return null
};
