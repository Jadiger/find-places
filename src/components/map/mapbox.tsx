import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { SelectedPlaceInfo } from "../select-place/selected-place-info";
import { useDisclosure } from "@mantine/hooks";
import { Marker } from "./marker";
import { IOverPassData, Place } from "../../types";
import { notifications } from "@mantine/notifications";
import { useCategory } from "../../context-reducer/context";
import { ActionIcon, Loader, Stack } from "@mantine/core";
import { IconLocation, IconZoomIn, IconZoomOut } from "@tabler/icons-react";
import { ClickedPlace } from "../clicked-place/clicked-place";
import { ViewPortRadius } from "../viewport-radius/viewport-radius";

mapboxgl.accessToken =
  "pk.eyJ1IjoiamFkaWdlciIsImEiOiJjbTZ6ZnB1M3cwNDFtMmlwZjFqZ2gzOWMwIn0.8XL2yGrchdup7gv3EeVkAg";

export const MapBox = ({
  location,
}: {
  location: { lat: number; lon: number };
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [places, setPlaces] = useState<Place[] | []>([]);

  const { state, dispatch } = useCategory();
  const category = state.selectedCategory?.value || null;

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const mapInstance = new mapboxgl.Map({
      container: "map-container",
      style: "mapbox://styles/jadiger/cm76dbf2x01vp01qx4kgvawoj",
      center: [location.lon, location.lat],
      zoom: state.zoom,
    });

    setMap(mapInstance);

    if (category) {
      mapInstance.on("load", () => {
        fetchPlaces(category);
      });
    }
    setLoading(false);
    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [location, category]);

  const fetchPlaces = async (categoryFilter?: string) => {
    if (!category) {
      // setLoading(false)
      return;
    }
    if (categoryFilter === "all") {
      return;
    }
    const query = `[out:json];node(around:${state.radius},${location.lat},${
      location.lon
    })${`[amenity=${categoryFilter}]`};out;`;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
      query
    )}`;

    try {
      const response = await fetch(url);
      const data: IOverPassData = await response.json();
      console.log(data.elements);

      const fetchedPlaces = data.elements.map((item) => ({
        id: item.id,
        name: item.tags.name,
        lat: item.lat,
        lon: item.lon,
        category: item.tags.amenity,
        rating: item.tags.rating,
        phone: item.tags.phone,
        website: item.tags.website,
        address: item.tags.address,
        opening_hours: item.tags.opening_hours,
      }));

      setPlaces(fetchedPlaces);
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

  return (
    <div
      style={{
        height: "calc(100vh - 60px)",
        width: "100vw",
        position: "relative",
      }}
    >
      <div id="map-container" style={{ height: "100%", width: "100%" }}></div>
      {map && <ClickedPlace map={map} open={open} />}
      <Stack className="absolute top-5 right-5 z-50">
        <ActionIcon
          size={35}
          p={5}
          variant="light"
          radius="md"
          disabled={state.zoom > 20}
          onClick={() => {
            dispatch({ type: "SET_ZOOM", payload: state.zoom + 1 });
            map?.flyTo({ zoom: state.zoom });
          }}
        >
          <IconZoomIn />
        </ActionIcon>
        <ActionIcon
          size={35}
          disabled={state.zoom < 5}
          p={5}
          variant="light"
          radius="md"
          onClick={() => {
            dispatch({ type: "SET_ZOOM", payload: state.zoom - 1 });
            map?.flyTo({ zoom: state.zoom });
            console.log(state.zoom);
          }}
        >
          <IconZoomOut />
        </ActionIcon>
        <ActionIcon
          size={35}
          p={5}
          variant="light"
          radius="md"
          onClick={() => {
            dispatch({ type: "SET_ZOOM", payload: 18 });
            map?.flyTo({
              center: [location.lon, location.lat],
              zoom: state.zoom,
              essential: true,
            });
          }}
        >
          <IconLocation size={20} />
        </ActionIcon>
      </Stack>
      {map && (
        <Marker map={map} location={location} places={places} open={open} />
      )}
      {map && <ViewPortRadius map={map} />}

      {state.selectedPlace && map && (
        <>
          <SelectedPlaceInfo
            opened={opened}
            open={open}
            close={close}
            location={location}
            map={map}
          />
        </>
      )}
      {loading && (
        <div className="absolute top-0 left-0 flex justify-center items-center bg-gray-300 w-full h-full">
          <Loader />
        </div>
      )}
    </div>
  );
};
