import { notifications } from "@mantine/notifications";
import { State } from "../../types";
import { Dispatch, SetStateAction } from "react";
import mapboxgl from "mapbox-gl";

export const drawRoute = ({
  map,
  state,
  setTravelTime,
  location,
}: {
  map: mapboxgl.Map;
  state: State;
  setTravelTime: Dispatch<SetStateAction<string | null>>;
  location: { lat: number; lon: number };
}) => {
  if (!map || !map.isStyleLoaded() || !state.selectedPlace) return;


  const url = `https://api.mapbox.com/directions/v5/mapbox/${state.transportMode}/${location.lon},${location.lat};${state.selectedPlace.lon},${state.selectedPlace.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

  console.log("Fetching route from:", url)

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log("Route response:", data)
      if (data.routes.length === 0) {
        if (map.getSource("route")) {
          if (map.getLayer("route")) map.removeLayer("route");
          map.removeSource("route");
        }
        notifications.show({
          title: "Route Not Found",
          message: "No available routes for the selected transport mode.",
          color: "yellow",
        });
        return;
      }


      if (map.getSource("route")) {
        if (map.getLayer("route")) map.removeLayer("route");
        map.removeSource("route");
      }

    
      const routeLine = data.routes[0].geometry;
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: routeLine,
        },
      });

      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#007AFF", "line-width": 5 },
      });

    
      const duration = data.routes[0].duration / 60;
      setTravelTime(`${duration.toFixed(1)} minute`);
    })
    .catch((err) => {
      console.error("Route error:", err)
      notifications.show({
        title: "Error loading route",
        message: err.message,
        color: "red",
      });
    });
};
