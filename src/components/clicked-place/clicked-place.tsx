import { useEffect } from "react";
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

  useEffect(() => {
    if (!map) return;

    map.on("click", async (e) => {
      const { lng, lat } = e.lngLat;

      const url = `https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/tilequery/${lng},${lat}.json?radius=50&limit=1&layers=poi_label&access_token=${mapboxgl.accessToken}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        if (data.features.length > 0) {
          const place = data.features[0];
          const placeName = place.properties.name;
          const category = place.properties.maki
            ? String(place.properties.maki)
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            : place.properties.maki;

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
    });

    return () => {
      if (map) {
        map.off("click", () => {});
      }
    };
  }, [map]);

  return null
};
