import { useEffect, useRef } from "react";
import { notifications } from "@mantine/notifications";
import mapboxgl from "mapbox-gl";
import { useCategory } from "../../context-reducer/context";

export const ClickedPlace = ({
  map,
  open,
}: {
  map: mapboxgl.Map;
  open: () => void;
}) => {
  const { dispatch } = useCategory();
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    const onClick = async (e: mapboxgl.MapMouseEvent & mapboxgl.MapEvent) => {
      const { lng, lat } = e.lngLat;

      const url = `https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/tilequery/${lng},${lat}.json?radius=50&limit=1&layers=poi_label&access_token=${mapboxgl.accessToken}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("TileQuery Response:", data);

        if (data.features.length > 0) {
          const place = data.features[0];
          const placeName = place.properties.name || "Unknown Place";
          const category = place.properties.maki
            ? String(place.properties.maki)
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            : "Other";
          if (markerRef.current) {
            markerRef.current.remove();
            markerRef.current = null;
          }
          const icon = document.createElement("div");
          icon.style.width = "35px";
          icon.style.height = "35px";
          icon.style.cursor = "pointer";
          icon.style.borderRadius = '50%'
          icon.style.border = "2px solid red"

          const newMarker = new mapboxgl.Marker({ element: icon })
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup().setText(placeName))
            .addTo(map);

          markerRef.current = newMarker;
          dispatch({
            type: "SET_SELECTED_PLACE",
            payload: {
              id: place.id,
              name: placeName,
              lat,
              lon: lng,
              category: category,
              rating: undefined,
              phone: undefined,
              website: undefined,
              address: undefined,
              opening_hours: undefined,
            },
          });

          open();
        }
      } catch (error: unknown) {
        let errorMessage = "Unknown Error";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        notifications.show({
          title: "Error",
          message: errorMessage,
          color: "red",
        });
      }
    };

    map.on("click", onClick);

    return () => {
      map.off("click", onClick);
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [map, dispatch]);

  return null;
};
